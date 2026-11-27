// SEO audit for every real page in site/. Prints a table and a list of problems.
// Usage: node tools/seo-audit.mjs [--fail]   (--fail exits 1 when problems are found)
import fs from 'node:fs';
import path from 'node:path';

const SITE = path.resolve('site');
const ORIGIN = 'https://www.stinto.com';

export function realPages() {
  const out = [];
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) { if (!['wp-content', 'wp-includes', 'assets'].includes(e.name)) walk(p); }
      else if (e.name === 'index.html') out.push(p);
    }
  };
  walk(SITE);
  // The "color-logo" folders hold PNG images saved as index.html, not pages.
  return out.filter((p) => !fs.readFileSync(p).subarray(0, 8).toString('latin1').includes('PNG')).sort();
}

const dec = (s) => s.replace(/&amp;/g, '&').replace(/&#0?39;|&#8217;/g, '’').replace(/&quot;/g, '"').replace(/&#8211;/g, '–');

if (import.meta.url === `file://${process.argv[1]}`) {
  const rows = [];
  const problems = [];
  for (const f of realPages()) {
    const h = fs.readFileSync(f, 'utf8');
    const rel = path.relative(SITE, f).replace(/index\.html$/, '');
    const g = (re) => (h.match(re) || [])[1];
    const title = dec(g(/<title>([^<]*)/) || '');
    const desc = dec(g(/<meta name="description" content="([^"]*)"/) || '');
    const canon = g(/<link rel="canonical" href="([^"]*)"/) || '';
    const ogImg = g(/<meta property="og:image" content="([^"]*)"/) || '';
    const robots = g(/<meta name="robots" content="([^"]*)"/) || '';
    const imgs = h.match(/<img\b[^>]*>/g) || [];
    const noAlt = imgs.filter((i) => !/\balt="/.test(i) || /\balt=""/.test(i) && !/data-decorative/.test(i)).length;
    const h1 = (h.match(/<h1\b/g) || []).length;
    let ldOk = true; const types = new Set();
    for (const m of h.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
      try { JSON.stringify(JSON.parse(m[1]), (k, v) => { if (k === '@type') types.add(v); return v; }); } catch { ldOk = false; }
    }
    const row = { page: rel || '(home)', title: title.length, desc: desc.length, h1, imgs: imgs.length, noAlt,
      canon: canon.startsWith(ORIGIN) ? 'abs' : canon || '-', ogImg: ogImg.startsWith(ORIGIN) ? 'abs' : ogImg ? 'rel' : '-',
      robots, ld: ldOk ? 'ok' : 'INVALID', search: types.has('SearchAction') ? 'yes' : '' };
    rows.push(row);
    const p = (m) => problems.push(`${row.page}: ${m}`);
    if (!canon.startsWith(ORIGIN)) p(`canonical not absolute (${canon || 'missing'})`);
    if (!ogImg.startsWith(ORIGIN)) p('og:image not absolute');
    else if (!fs.existsSync(path.join(SITE, decodeURI(new URL(ogImg).pathname)))) p(`og:image file missing (${ogImg})`);
    if (h1 !== 1) p(`${h1} H1`);
    if (title.length < 30 || title.length > 65) p(`title ${title.length} chars`);
    if (desc.length < 110 || desc.length > 160) p(`description ${desc.length} chars`);
    if (noAlt) p(`${noAlt} image(s) without alt`);
    if (!ldOk) p('invalid JSON-LD');
    if (types.has('SearchAction')) p('dead SearchAction in JSON-LD');
  }
  console.table(rows);
  console.log(problems.length ? `${problems.length} problem(s):\n- ${problems.join('\n- ')}` : 'No problems found.');
  if (process.argv.includes('--fail') && problems.length) process.exit(1);
}
