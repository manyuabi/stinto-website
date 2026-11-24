// Apply a content spec (text rewrites, SEO tags, new blocks) to pages in site/.
// Usage: node tools/apply-content.mjs content/apply/batch1.mjs [--dry]
// Every operation must match exactly once; otherwise the page is NOT written and the error is reported.
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = join(ROOT, 'site');
const specPath = process.argv[2];
const dry = process.argv.includes('--dry');
if (!specPath) { console.error('Usage: node tools/apply-content.mjs <spec.mjs> [--dry]'); process.exit(1); }
const onlyIdx = process.argv.indexOf('--only');
const only = onlyIdx > -1 ? process.argv[onlyIdx + 1] : null; // apply a single page: --only <page-folder>
const { pages: allPages } = await import(pathToFileURL(resolve(specPath)).href);
const pages = only ? allPages.filter((p) => p.path === only) : allPages;
if (only && !pages.length) { console.error(`--only ${only}: no such page in spec`); process.exit(1); }

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const once = (html, needle, label) => {
  const n = html.split(needle).length - 1;
  if (n !== 1) throw new Error(`${label}: expected 1 match, found ${n}`);
  return html.indexOf(needle);
};

// End index (exclusive) of the <div> element that opens at `start`.
function divEnd(html, start) {
  const re = /<\/?div\b[^>]*>/g;
  re.lastIndex = start;
  let depth = 0, m;
  while ((m = re.exec(html))) {
    depth += m[0].startsWith('</') ? -1 : 1;
    if (depth === 0) return m.index + m[0].length;
  }
  throw new Error('unbalanced div');
}

// [start, end) of the widget-container inner HTML for an Elementor element id
function widgetInner(html, id) {
  const at = once(html, `data-id="${id}"`, `widget ${id}`);
  const open = html.indexOf('<div class="elementor-widget-container">', at);
  if (open < 0 || open - at > 600) throw new Error(`widget ${id}: no widget-container`);
  const end = divEnd(html, open);
  return [open + '<div class="elementor-widget-container">'.length, end - '</div>'.length];
}

// [start, end) of the top-level section (child of the wp-page element) that contains element id
function topSection(html, id) {
  const pageOpen = html.lastIndexOf('<div', once(html, 'data-elementor-type="wp-page"', 'wp-page'));
  const pageEnd = divEnd(html, pageOpen);
  const target = once(html, `data-id="${id}"`, `section of ${id}`);
  let i = html.indexOf('>', pageOpen) + 1;
  while (i < pageEnd - 6) {
    const next = html.indexOf('<div', i);
    if (next < 0 || next >= pageEnd - 6) break;
    const end = divEnd(html, next);
    if (target > next && target < end) return [next, end];
    i = end;
  }
  throw new Error(`section of ${id}: not found`);
}

// [start, end) of the child container (one level inside `parent`) that contains element id.
// Elementor "boxed" containers wrap their children in .e-con-inner, which is looked through.
function childSection(html, [pStart, pEnd], id) {
  const target = html.indexOf(`data-id="${id}"`);
  let i = html.indexOf('>', pStart) + 1;
  const innerOpen = html.indexOf('<div', i);
  if (html.slice(innerOpen, innerOpen + 40).includes('e-con-inner')) i = html.indexOf('>', innerOpen) + 1;
  while (i < pEnd) {
    const next = html.indexOf('<div', i);
    if (next < 0 || next >= pEnd) break;
    const end = divEnd(html, next);
    if (target > next && target < end) return [next, end];
    i = end;
  }
  throw new Error(`child section of ${id}: not found`);
}

// Insert position for a block: { before|after: id, depth: 1|2 } or { end: true }
function insertAt(html, b) {
  if (b.end) return wpPageEnd(html);
  const id = b.before || b.after;
  let sec = topSection(html, id);
  if ((b.depth || 1) === 2) sec = childSection(html, sec, id);
  return b.before ? sec[0] : sec[1];
}

function wpPageEnd(html) {
  const pageOpen = html.lastIndexOf('<div', once(html, 'data-elementor-type="wp-page"', 'wp-page'));
  return divEnd(html, pageOpen);
}

function setHeading(html, id, text, tag) {
  const [s, e] = widgetInner(html, id);
  const inner = html.slice(s, e);
  const m = inner.match(/^\s*<(h[1-6]|p|div|span)( class="[^"]*")>([\s\S]*)<\/\1>\s*$/);
  if (!m) throw new Error(`heading ${id}: unexpected markup ${inner.slice(0, 120)}`);
  const t = tag || m[1];
  return html.slice(0, s) + `<${t}${m[2]}>${text ?? m[3]}</${t}>` + html.slice(e);
}

function setHtml(html, id, newInner) {
  const [s, e] = widgetInner(html, id);
  return html.slice(0, s) + newInner + html.slice(e);
}

function appendHtml(html, id, extra) {
  const [, e] = widgetInner(html, id);
  return html.slice(0, e) + extra + html.slice(e);
}

function replaceIn(html, id, from, to) {
  const [s, e] = widgetInner(html, id);
  const inner = html.slice(s, e);
  const n = inner.split(from).length - 1;
  if (n < 1) throw new Error(`replace in ${id}: "${from}" not found`);
  return html.slice(0, s) + inner.split(from).join(to) + html.slice(e);
}

function setSeo(html, { title, description }) {
  const head = html.slice(0, html.indexOf('</head>'));
  const oldTitle = (head.match(/<title>([^<]*)<\/title>/) || [])[1];
  const oldDesc = (head.match(/<meta name="description" content="([^"]*)"/) || [])[1];
  if (!oldTitle) throw new Error('no <title>');
  let h = head;
  const T = esc(title), D = esc(description);
  h = h.replace(/<title>[^<]*<\/title>/, `<title>${T}</title>`);
  h = h.replace(/(<meta property="og:title" content=")[^"]*"/, `$1${T}"`);
  h = h.replace(/(<meta name="twitter:title" content=")[^"]*"/, `$1${T}"`);
  if (oldDesc !== undefined) {
    h = h.replace(/(<meta name="description" content=")[^"]*"/, `$1${D}"`);
    h = h.replace(/(<meta property="og:description" content=")[^"]*"/, `$1${D}"`);
    h = h.replace(/(<meta name="twitter:description" content=")[^"]*"/, `$1${D}"`);
  } else {
    h = h.replace(/<\/title>/, `</title>\n<meta name="description" content="${D}" />`);
  }
  // Yoast JSON-LD repeats the title and description, with HTML entities decoded
  const dec = (s) => s.replace(/&#0?39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
  for (const t of new Set([oldTitle, dec(oldTitle)])) h = h.split(`"name":"${t}"`).join(`"name":"${title.replace(/"/g, '\\"')}"`);
  if (oldDesc) for (const d of new Set([oldDesc, dec(oldDesc)])) h = h.split(`"description":"${d}"`).join(`"description":"${description.replace(/"/g, '\\"')}"`);
  return h + html.slice(head.length);
}

function ensureCss(html) {
  if (html.includes('assets/stinto-blocks.css')) return html;
  return html.replace('</head>', '<link rel="stylesheet" id="stinto-blocks-css" href="../assets/stinto-blocks.css" media="all" />\n</head>');
}

let failed = 0;
for (const page of pages) {
  const file = join(SITE, page.path, 'index.html');
  try {
    let html = readFileSync(file, 'utf8');
    if (page.seo) html = setSeo(html, page.seo);
    for (const op of page.ops || []) {
      if (op.raw) { // exact whole-file replacements (e.g. structured data); each must match exactly once
        for (const [a, b] of op.raw) { once(html, a, `raw "${a.slice(0, 50)}"`); html = html.replace(a, () => b); }
      } else if (op.heading !== undefined) html = setHeading(html, op.id, op.heading, op.tag);
      else if (op.html !== undefined) html = setHtml(html, op.id, op.html);
      else if (op.append !== undefined) html = appendHtml(html, op.id, op.append);
      else if (op.replace) for (const [a, b] of op.replace) html = replaceIn(html, op.id, a, b);
      else if (op.tag) html = setHeading(html, op.id, undefined, op.tag);
      else throw new Error(`unknown op ${JSON.stringify(op)}`);
    }
    // Inserted blocks: { before|after: <element id>, depth: 1|2, html } next to the section holding that element; { end: true, html } after the page content
    if (page.insert?.length && html.includes('class="sb ')) throw new Error('page already has inserted blocks; restore it from git before re-applying');
    const inserts = (page.insert || []).map((b) => ({ at: insertAt(html, b), html: b.html }));
    inserts.sort((a, b) => b.at - a.at);
    for (const b of inserts) html = html.slice(0, b.at) + b.html + html.slice(b.at);
    if (page.insert?.length || (page.ops || []).some((o) => o.append)) html = ensureCss(html);
    if (page.jsonld) html = html.replace('</head>', `<script type="application/ld+json">${JSON.stringify(page.jsonld)}</script>\n</head>`);
    const h1s = (html.match(/<h1\b/g) || []).length;
    if (h1s !== 1) throw new Error(`page has ${h1s} <h1> elements, expected 1`);
    if (!dry) writeFileSync(file, html);
    console.log(`${dry ? 'OK (dry)' : 'written'}  /${page.path}/`);
  } catch (e) {
    failed++;
    console.error(`FAILED  /${page.path}/  ${e.message}`);
  }
}
process.exit(failed ? 1 : 0);
