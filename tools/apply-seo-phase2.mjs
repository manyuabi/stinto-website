// SEO Phase 2: titles, descriptions, one H1 per page, share images, alt text and the footer Platform column.
// Approved copy: content/seo/phase2-data.mjs (review files content/seo/pages.md, alt-text.md).
// Idempotent: re-running on an applied page changes nothing. Run tools/apply-seo.mjs afterwards to rebuild 404.html.
// Usage: node tools/apply-seo-phase2.mjs [--dry]
import fs from 'node:fs';
import path from 'node:path';
import { realPages } from './seo-audit.mjs';
import { META, H1, SHARE, ALT, FOOTER_PLATFORM } from '../content/seo/phase2-data.mjs';

const DRY = process.argv.includes('--dry');
const SITE = path.resolve('site');
const ORIGIN = 'https://www.stinto.com';
const FOOTER_CSS = path.join(SITE, 'wp-content/uploads/elementor/css/post-11623.css');

const dec = (s) => s.replace(/&amp;/g, '&').replace(/&#8217;/g, '’').replace(/&#0?39;/g, '’').replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const fail = (rel, m) => { throw new Error(`${rel || '(home)'}: ${m}`); };

function setMeta(h, rel, { title, desc }) {
  const end = h.indexOf('</head>');
  let head = h.slice(0, end);
  const setAttr = (re, v) => { head = head.replace(re, (_, a, c) => a + esc(v) + c); };
  if (title) {
    head = head.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
    setAttr(/(<meta property="og:title" content=")[^"]*(")/, title);
    setAttr(/(<meta name="twitter:title" content=")[^"]*(")/, title);
  }
  if (desc) {
    if (!/<meta name="description"/.test(head)) fail(rel, 'no meta description');
    setAttr(/(<meta name="description" content=")[^"]*(")/, desc);
    setAttr(/(<meta property="og:description" content=")[^"]*(")/, desc);
    setAttr(/(<meta name="twitter:description" content=")[^"]*(")/, desc);
  }
  // The JSON-LD WebPage node repeats title and description.
  head = head.replace(/(<script type="application\/ld\+json" class="yoast-schema-graph[^"]*"[^>]*>)([\s\S]*?)(<\/script>)/, (_, a, j, c) => {
    const data = JSON.parse(j);
    for (const n of data['@graph']) {
      if (n['@type'] !== 'WebPage' && !(Array.isArray(n['@type']) && n['@type'].includes('WebPage'))) continue;
      if (title) n.name = title;
      if (desc) n.description = desc;
    }
    return a + JSON.stringify(data) + c;
  });
  return head + h.slice(end);
}

function setHeading(h, rel, text, from, to) {
  const re = new RegExp(`<${from}( class="elementor-heading-title[^"]*")>([\\s\\S]*?)</${from}>`, 'g');
  let n = 0;
  h = h.replace(re, (m, cls, inner) => {
    if (n || dec(inner.replace(/<[^>]+>/g, '')).trim() !== text) return m;
    n++;
    return `<${to}${cls}>${inner}</${to}>`;
  });
  return h;
}

function setShare(h, rel, img) {
  const url = `${ORIGIN}/${img}`;
  const [w, hgt] = img.startsWith('assets/share/') ? [1200, 630] : (img.match(/-(\d+)x(\d+)\.\w+$/) || []).slice(1).map(Number);
  if (!w) fail(rel, `unknown size for ${img}`);
  if (!fs.existsSync(path.join(SITE, img))) fail(rel, `missing ${img}`);
  h = h.replace(/(<meta property="og:image(?::secure_url)?" content=")[^"]*(")/g, `$1${url}$2`);
  h = h.replace(/(<meta name="twitter:image" content=")[^"]*(")/g, `$1${url}$2`);
  h = h.replace(/(<meta property="og:image:width" content=")[^"]*(")/, `$1${w}$2`);
  h = h.replace(/(<meta property="og:image:height" content=")[^"]*(")/, `$1${hgt}$2`);
  h = h.replace(/(<meta property="og:image:type" content=")[^"]*(")/, '$1image/png$2');
  if (!h.includes(`<meta property="og:image" content="${url}"`)) fail(rel, 'og:image not set');
  return h;
}

function setAlts(h, rel) {
  return h.replace(/<img\b[^>]*>/g, (tag) => {
    if (/\balt="[^"]/.test(tag) || /data-decorative/.test(tag)) return tag;
    const src = (tag.match(/\bsrc="([^"]*)"/) || [])[1] || '';
    const file = decodeURI(src.split('/').pop());
    if (!(file in ALT)) fail(rel, `no alt text drafted for ${file}`);
    const alt = ALT[file];
    const attrs = alt ? `alt="${esc(alt)}"` : 'alt="" data-decorative';
    return /\balt=""/.test(tag) ? tag.replace(/\balt=""/, attrs) : tag.replace(/<img\b/, `<img ${attrs}`);
  });
}

function footer(h, rel) {
  // Internal footer links open in the same tab.
  const start = h.indexOf('data-id="5150506b"');
  if (start < 0) fail(rel, 'footer not found');
  let foot = h.slice(start).replace(/(<a href="(?!https?:)[^"]*") target="_blank"( link="")?/g, '$1');

  if (!foot.includes('elementor-element-sbfplat')) {
    const prefix = rel ? '../' : '';
    const items = FOOTER_PLATFORM.map(([t, href], i) => `<div class="elementor-element elementor-element-sbfp${i} sb-footer-link elementor-widget elementor-widget-heading" data-element_type="widget" data-widget_type="heading.default"><div class="elementor-widget-container"><p class="elementor-heading-title elementor-size-default"><a href="${rel === href ? './' : prefix + href}">${t}</a></p></div></div>`).join('');
    const col = `<div class="elementor-column elementor-col-20 elementor-top-column elementor-element elementor-element-sbfplat" data-element_type="column"><div class="elementor-widget-wrap elementor-element-populated">${items}</div></div>`;
    const re = /<div class="elementor-column [^"]*elementor-element-5a363d0"[\s\S]*?<div class="elementor-spacer-inner"><\/div><\/div><\/div><\/div><\/div><\/div>/;
    if (!re.test(foot)) fail(rel, 'footer spacer column not found');
    foot = foot.replace(re, col);
  }
  return h.slice(0, start) + foot;
}

const CSS_MARK = '/* sb-footer-platform */';
const CSS = `${CSS_MARK}
.elementor-11623 .elementor-element.elementor-element-sbfplat > .elementor-widget-wrap > .elementor-widget:not(:last-child){margin-block-end:16px;}
.elementor-11623 .sb-footer-link .elementor-heading-title{font-family:"CircularXX", Poppins;font-size:14px;font-weight:400;color:var( --e-global-color-853a94c );}
@media(max-width:767px){.elementor-11623 .elementor-element.elementor-element-sbfplat,.elementor-11623 .elementor-element.elementor-element-dab582d{width:50%;}}
@media(min-width:768px){.elementor-11623 .elementor-element.elementor-element-39843643{width:20%;}
.elementor-11623 .elementor-element.elementor-element-sbfplat{width:18%;}
.elementor-11623 .elementor-element.elementor-element-3a3ba04d{width:22%;}
.elementor-11623 .elementor-element.elementor-element-2923b9dd{width:20%;}
.elementor-11623 .elementor-element.elementor-element-dab582d{width:20%;}}
`;

let changed = 0;
const h1Pages = new Map(H1.map(([p, t, c]) => [p, [t, c.startsWith('H1') ? ['h1', 'h2'] : ['h2', 'h1']]]));
for (const f of realPages()) {
  const rel = path.relative(SITE, f).replace(/index\.html$/, '').split(path.sep).join('/');
  const before = fs.readFileSync(f, 'utf8');
  let h = before;
  if (META[rel]) h = setMeta(h, rel, META[rel]);
  if (h1Pages.has(rel)) { const [t, [from, to]] = h1Pages.get(rel); h = setHeading(h, rel, t, from, to); }
  if ((h.match(/<h1\b/g) || []).length !== 1) fail(rel, `${(h.match(/<h1\b/g) || []).length} H1 after change`);
  if (SHARE[rel]) h = setShare(h, rel, SHARE[rel]);
  h = setAlts(h, rel);
  h = footer(h, rel);
  if (!h.includes('elementor-element-sbfplat')) fail(rel, 'footer column missing');
  if (h !== before) { changed++; if (!DRY) fs.writeFileSync(f, h); }
  console.log(`${h !== before ? 'updated' : 'same   '} ${rel || '(home)'}`);
}
const css = fs.readFileSync(FOOTER_CSS, 'utf8');
if (!css.includes(CSS_MARK) && !DRY) fs.writeFileSync(FOOTER_CSS, `${css}\n${CSS}`);
console.log(`${changed} page(s) ${DRY ? 'would change' : 'changed'}`);
