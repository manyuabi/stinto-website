// Write the Phase 2 review files (content/seo/pages.md, content/seo/alt-text.md) from content/seo/phase2-data.mjs,
// with current values and character counts, and check that every image without alt text has a draft.
// Usage: node tools/seo-phase2-docs.mjs
import fs from 'node:fs';
import path from 'node:path';
import { realPages } from './seo-audit.mjs';
import { META, H1, SHARE, ALT, FOOTER_PLATFORM } from '../content/seo/phase2-data.mjs';

const SITE = path.resolve('site');
const dec = (s) => s.replace(/&amp;/g, '&').replace(/&#0?39;|&#8217;/g, '’').replace(/&quot;/g, '"').replace(/&#8211;/g, '–');
const name = (p) => p || '(home)';
const pages = Object.fromEntries(realPages().map((f) => [path.relative(SITE, f).replace(/index\.html$/, ''), fs.readFileSync(f, 'utf8')]));
const cur = (h, re) => dec((h.match(re) || [])[1] || '');
const flag = (n, lo, hi) => (n < lo || n > hi ? ` ⚠️` : '');

let md = `# SEO Phase 2: page copy for review\n\nTitles aim for 50–60 characters and descriptions for 120–155. Pages not listed keep their current copy.\nEdit the **New** lines directly, or tell me what to change.\n\n## Titles and descriptions\n\n`;
for (const [p, m] of Object.entries(META)) {
  const h = pages[p];
  if (!h) throw new Error(`no page ${p}`);
  const t = cur(h, /<title>([^<]*)/), d = cur(h, /<meta name="description" content="([^"]*)"/);
  md += `### ${name(p)}\n`;
  if (m.title) md += `- Title now (${t.length}): ${t}\n- **New (${m.title.length}${flag(m.title.length, 50, 60)}):** ${m.title}\n`;
  if (m.desc) md += `- Description now (${d.length}): ${d}\n- **New (${m.desc.length}${flag(m.desc.length, 120, 155)}):** ${m.desc}\n`;
  md += '\n';
}
md += `## One H1 per page\n\nThe heading text and its look stay the same; only the tag changes.\n\n| Page | Heading | Change |\n|---|---|---|\n`;
for (const [p, t, c] of H1) md += `| ${name(p)} | ${t} | ${c} |\n`;
md += `\n## Share images (1200×630)\n\nNew images are in \`site/assets/share/\`, rendered by \`tools/make-share-images.mjs\`. Pages not listed keep their current image.\n\n| Page | Now | New |\n|---|---|---|\n`;
for (const [p, s] of Object.entries(SHARE)) {
  const now = cur(pages[p], /<meta property="og:image" content="([^"]*)"/).split('/').pop();
  md += `| ${name(p)} | ${now} | ${s.split('/').pop()} |\n`;
}
md += `\n## Footer: new Platform column\n\nReplaces the empty spacer column between the logo and the contact details. Column widths become 20 / 18 / 22 / 20 / 20 %.\n\n`;
for (const [t, href] of FOOTER_PLATFORM) md += `- ${t} → /${href}\n`;
md += `\nAlso: internal footer links stop opening in a new tab (they use \`target="_blank"\` today). External ones (Knowledge Base, Trust Center) keep it.\n`;
fs.writeFileSync('content/seo/pages.md', md);

// Alt text: every <img> that has no alt, or an empty alt, grouped by upload.
const uses = new Map();
for (const [p, h] of Object.entries(pages)) {
  for (const i of h.match(/<img\b[^>]*>/g) || []) {
    if (/\balt="[^"]/.test(i)) continue;
    const file = decodeURI(((i.match(/\bsrc="([^"]*)"/) || [])[1] || '').split('/').pop());
    if (!uses.has(file)) uses.set(file, new Set());
    uses.get(file).add(name(p));
  }
}
const missing = [...uses.keys()].filter((f) => !(f in ALT));
let alt = `# SEO Phase 2: alt text for review\n\n${[...uses.values()].reduce((n, s) => n + s.size, 0)} image uses (${uses.size} files) have no alt text today.\n“Decorative” means \`alt=""\`: screen readers skip it, because the heading next to it already says the same thing.\n\n| Image | Where | Alt text |\n|---|---|---|\n`;
for (const [f, ps] of uses) {
  const where = ps.size > 6 ? `${ps.size} pages` : [...ps].join(', ');
  alt += `| ${f.length > 48 ? f.slice(0, 45) + '…' : f} | ${where} | ${ALT[f] === '' ? '*decorative*' : ALT[f] ?? '**MISSING**'} |\n`;
}
fs.writeFileSync('content/seo/alt-text.md', alt);
console.log(`pages.md and alt-text.md written. Images without a draft: ${missing.length ? missing.join(', ') : 'none'}`);
