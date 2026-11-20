// Snapshot www.stinto.com (WordPress) into a static site under ./site
// Usage: node tools/mirror.mjs
// All internal links and assets are rewritten to RELATIVE paths, so the
// output works on GitHub Pages (/stinto-website/) and on the real domain.
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { dirname, join, relative, posix } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'site');
const ORIGIN = 'https://www.stinto.com';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';

// Tracking / WordPress-only scripts that must not run on a static staging copy
const STRIP_SCRIPT_HOSTS = ['googletagmanager.com', 'stats.wp.com', 'connect.facebook.net', 'js-eu1.hs-scripts.com', 'js.hs-scripts.com', 'js-eu1.hs-analytics.net', 'cdn.hu-manity.co', 'official-facebook-pixel', 'leadin-script-loader'];
const TRACKING_CODE = /googletagmanager|gtag\(|fbq|fbevents|_hsq|facebook_?signal|fb_pxl_code|huOptions|leadin_wordpress|GoogleAnalyticsObject/i;

// The site inlines scripts as base64 data: URIs. Decode them so tracking can be
// removed and URLs rewritten, then re-encode (keeps the original `defer` order).
function processDataScripts(html, fromFile) {
  return html.replace(/<script\b([^>]*?)src="data:text\/javascript;base64,([^"]+)"([^>]*)><\/script>/g, (m, a, b64, c) => {
    const code = Buffer.from(b64, 'base64').toString('utf8');
    if (TRACKING_CODE.test(code)) return '';
    const out = rewriteAbsolute(code, fromFile);
    return `<script${a}src="data:text/javascript;base64,${Buffer.from(out).toString('base64')}"${c}></script>`;
  });
}

async function sitemapUrls() {
  const urls = [];
  for (const s of ['page', 'post']) {
    const xml = await (await fetch(`${ORIGIN}/${s}-sitemap.xml`, { headers: { 'user-agent': UA } })).text();
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) if (!m[1].includes('/wp-content/')) urls.push(m[1]);
  }
  return urls;
}

const pagePaths = new Set(); // "/plans/" style
const assetQueue = new Map(); // localPath -> remote URL
const done = new Set();

// Map any stinto URL (absolute) to {kind, local}
function classify(u) {
  let url;
  try { url = new URL(u); } catch { return null; }
  let path;
  if (url.hostname === 'usercontent.one' && url.pathname.startsWith('/wp/www.stinto.com/')) path = url.pathname.slice('/wp/www.stinto.com'.length);
  else if (url.hostname === 'www.stinto.com' || url.hostname === 'stinto.com') path = url.pathname;
  else return null;
  path = decodeURIComponent(path);
  if (/^\/(wp-content|wp-includes)\//.test(path)) return { kind: 'asset', local: path.slice(1), remote: `${ORIGIN}${encodeURI(path)}`, hash: '' };
  if (/^\/(wp-json|feed|xmlrpc\.php|wp-admin|comments)/.test(path)) return { kind: 'skip' };
  if (!path.endsWith('/') && !/\.[a-z0-9]+$/i.test(path)) path += '/';
  return { kind: 'page', local: path.slice(1) + (path.endsWith('/') ? '' : ''), hash: url.hash };
}

function rel(fromFile, toLocal) {
  // fromFile, toLocal are paths relative to OUT using '/'
  let r = posix.relative(posix.dirname(fromFile), toLocal || '.');
  if (r === '') r = '.';
  if (toLocal.endsWith('/') || toLocal === '') r += '/';
  return r.replace(/\/\/$/, '/');
}

// Rewrites absolute stinto URLs (plain or JSON-escaped) inside text
function rewriteAbsolute(text, fromFile) {
  const re = /(?:https?:)?(\\?\/\\?\/)(?:www\.)?(?:stinto\.com|usercontent\.one\\?\/wp\\?\/www\.stinto\.com)((?:\\?\/[^"'\s)<>,&\\?#]*)*)([?][^"'\s)<>,\\#]*)?(#[^"'\s)<>,\\]*)?/gi;
  return text.replace(re, (m, slashes, path, _q, hash) => {
    const escaped = slashes.includes('\\');
    const clean = 'https://www.stinto.com' + (path || '/').replace(/\\\//g, '/');
    const c = classify(clean);
    if (!c || c.kind === 'skip') return m;
    let out;
    if (c.kind === 'asset') { assetQueue.set(c.local, c.remote); out = rel(fromFile, c.local); }
    else { pagePaths.add(c.local); out = rel(fromFile, c.local) + (hash || ''); }
    return escaped ? out.replace(/\//g, '\\/') : out;
  });
}

function rewriteRootRelative(text, fromFile) {
  return text.replace(/(["'(=]\s*)\/(wp-content|wp-includes)\/([^"'\s)<>?#]+)(\?[^"'\s)<>]*)?/g, (m, pre, dir, rest) => {
    const local = `${dir}/${decodeURIComponent(rest)}`;
    assetQueue.set(local, `${ORIGIN}/${dir}/${rest}`);
    return pre + rel(fromFile, local);
  });
}

function cleanHtml(html) {
  // drop tracking scripts
  html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, (s) => {
    const head = s.slice(0, 400);
    if (STRIP_SCRIPT_HOSTS.some((h) => head.includes(h))) return '';
    if (/gtag\(|GoogleAnalyticsObject|fbq\(|_hsq/.test(s) && s.length < 5000) return '';
    return s;
  });
  html = html.replace(/<noscript>(?:(?!<\/noscript>)[\s\S])*<\/noscript>/gi, (s) => (/googletagmanager|facebook\.com\/tr/.test(s) ? '' : s));
  // drop WordPress-only head links
  html = html.replace(/<link[^>]+rel=["'](?:https:\/\/api\.w\.org\/|EditURI|alternate|shortlink|pingback|dns-prefetch)["'][^>]*>\s*/gi, '');
  html = html.replace(/<!--(?:(?!-->)[\s\S])*-->/g, (s) => (s.includes('W3 Total Cache') ? '' : s));
  // staging: never index
  html = html.replace(/<meta name=["']robots["'][^>]*>/gi, '');
  html = html.replace(/<head([^>]*)>/i, '<head$1>\n<meta name="robots" content="noindex, nofollow">');
  return html;
}

async function get(url) {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(url, { headers: { 'user-agent': UA } });
      if (r.ok) return Buffer.from(await r.arrayBuffer());
      if (r.status === 404) return null;
    } catch {}
    await new Promise((r) => setTimeout(r, 800 * (i + 1)));
  }
  return null;
}

async function save(local, data) {
  const f = join(OUT, local);
  await mkdir(dirname(f), { recursive: true });
  await writeFile(f, data);
}

async function doPage(path) {
  const buf = await get(`${ORIGIN}/${path}`);
  if (!buf) { console.warn('page missing', path); return; }
  const file = path.endsWith('/') || path === '' ? `${path}index.html` : path;
  let html = buf.toString('utf8')
    // fix malformed "Stinto Tap" menu links that are broken on the live site
    .replace(/href="(?:https:\/www\.stinto\.com|www\.stinto\.com)\/stintotap\/?"/g, 'href="https://www.stinto.com/stintotap/"');
  html = cleanHtml(processDataScripts(html, file));
  html = rewriteAbsolute(html, file);
  html = rewriteRootRelative(html, file);
  await save(file, html);
}

async function doAsset(local, remote) {
  const buf = await get(remote);
  if (!buf) { console.warn('asset missing', local); return; }
  if (local.endsWith('.css')) {
    let css = buf.toString('utf8');
    css = css.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g, (m, q, ref) => {
      if (ref.startsWith('data:') || ref.startsWith('#')) return m;
      let abs;
      try { abs = new URL(ref, remote).href; } catch { return m; }
      const c = classify(abs);
      if (!c || c.kind !== 'asset') return m;
      assetQueue.set(c.local, c.remote);
      return `url(${q}${rel(local, c.local)}${q})`;
    });
    css = rewriteAbsolute(css, local);
    await save(local, css);
  } else if (local.endsWith('.js')) {
    const js = buf.toString('utf8');
    // Elementor loads widget code on demand; queue those files too
    const el = 'wp-content/plugins/elementor/assets/js/chunks/';
    for (const m of js.matchAll(/(?:__elementorLoadChunk|loadChunk)\(\s*[`"']([a-z0-9-]+)[`"']/g))
      assetQueue.set(el + m[1] + '.min.js', `${ORIGIN}/${el}${m[1]}.min.js`);
    if (local.startsWith('wp-content/plugins/elementor-pro/assets/js/'))
      for (const m of js.matchAll(/"([a-z0-9.-]+\.bundle\.min\.js)"/g))
        assetQueue.set('wp-content/plugins/elementor-pro/assets/js/' + m[1], `${ORIGIN}/wp-content/plugins/elementor-pro/assets/js/${m[1]}`);
    await save(local, rewriteAbsolute(js, local));
  } else await save(local, buf);
}

async function pool(items, n, fn) {
  const it = items[Symbol.iterator]();
  await Promise.all(Array.from({ length: n }, async () => { for (const x of it) await fn(x); }));
}

const start = await sitemapUrls();
for (const u of start) pagePaths.add(classify(u).local);
// crawl pages (links found inside pages are added too)
let round = 0;
while (true) {
  const todo = [...pagePaths].filter((p) => !done.has('p:' + p));
  if (!todo.length || round++ > 3) break;
  todo.forEach((p) => done.add('p:' + p));
  await pool(todo, 6, doPage);
}
while (true) {
  const todo = [...assetQueue].filter(([l]) => !done.has('a:' + l));
  if (!todo.length) break;
  todo.forEach(([l]) => done.add('a:' + l));
  await pool(todo, 8, ([l, r]) => doAsset(l, r));
}
await save('robots.txt', 'User-agent: *\nDisallow: /\n');
await save('.nojekyll', '');
console.log(`pages: ${[...done].filter((d) => d.startsWith('p:')).length}, assets: ${[...done].filter((d) => d.startsWith('a:')).length}`);
