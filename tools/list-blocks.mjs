// List the editable text blocks of a page, in order: data-id, widget type, tag, text.
// Usage: node tools/list-blocks.mjs <page-folder>   e.g. node tools/list-blocks.mjs lead-enrichment
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = join(dirname(fileURLToPath(import.meta.url)), '..', 'site');
const page = process.argv[2] || '';
const html = readFileSync(join(SITE, page, 'index.html'), 'utf8');
const text = (s) => s.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#8217;/g, '’').replace(/&nbsp;/g, ' ').replace(/&[a-z#0-9]+;/g, ' ').replace(/\s+/g, ' ').trim();

// Only the page body (skip header menu and footer templates)
const start = html.indexOf('data-elementor-type="wp-page"');
const end = html.indexOf('data-elementor-type="wp-page"') > -1 ? html.search(/<footer|class="[^"]*wpr-footer|data-elementor-type="footer"/) : -1;
const body = html.slice(start, end > start ? end : undefined);

const re = /data-id="([a-z0-9]+)"[^>]*data-widget_type="([a-z-]+)\.default"[^>]*>([\s\S]*?)(?=<div class="elementor-element |$)/g;
for (const m of body.matchAll(re)) {
  const [, id, type, inner] = m;
  if (!['heading', 'text-editor', 'button', 'icon-box', 'image-box'].includes(type)) continue;
  const tag = (inner.match(/<(h[1-6]|p|span)\b/) || [])[1] || '';
  const t = text(inner);
  if (t) console.log(`${id}\t${type}\t${tag}\t${t.slice(0, 160)}`);
}
