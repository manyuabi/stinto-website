// Global step: menu, header button, footer tagline and sitewide JSON-LD description on every real page.
// Approved copy: content/rewrite/22-global.md. Idempotent: re-running on an applied page changes nothing.
// Usage: node tools/apply-global.mjs [--dry]
import fs from 'node:fs';
import path from 'node:path';

const DRY = process.argv.includes('--dry');
const SITE = path.resolve('site');

const PLATFORM = [
  ['7bd9dbe', 'Lead capture', 'How Stinto captures, enriches, follows up and syncs every lead'],
  ['0786c12', 'AI lead enrichment', 'Turn a name into a qualified lead with AI'],
  ['dab3f28', 'Voice-to-text notes', 'Speak your meeting notes. They land in your CRM'],
  ['d9d3679', 'Automatic follow-up', 'Follow up on every lead before you leave the room'],
  ['903faa5', 'CRM sync', 'Every lead and note synced to your CRM in real time'],
  ['6f3dd75', 'CRM integrations', 'HubSpot, Salesforce, Dynamics 365 and 9,000+ apps'],
  ['4ea6e87', 'Company dashboard', 'See every lead your team captures'],
];
const CAPTURE = [
  ['b45e756', 'Digital business card &amp; QR', 'Share your card. Their details become a lead'],
  ['430e171', 'StintoTap NFC card', 'Tap a phone, capture a lead'],
  ['1a572e5', 'AI business card scanner', 'Scan a paper card into a CRM-ready lead'],
  ['336dbdb', 'Two-way exchange', 'Get their details while they get yours'],
];
const RESOURCE_DESC = [
  ['Learn more about our commiment to your security and compliance concerns', 'GDPR compliant and ISO 27001 certified'],
  ['Get inspired to improve the way your organisation networks', 'Ideas for capturing more leads at events and meetings'],
  ['Read how using Stinto reduces your footprint', 'How paperless lead capture reduces your footprint'],
];
const TAGLINE = 'AI lead capture for sales and event teams. Captured, enriched, followed up, synced.';
const SITE_DESC = 'AI lead capture for sales and event teams: capture, enrich, follow up and sync every lead to your CRM.';
const CAL_SVG = '<svg aria-hidden="true" class="e-font-icon-svg e-far-calendar" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M400 64h-48V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H160V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V160h352v298c0 3.3-2.7 6-6 6z"></path></svg>';

function pages() {
  const out = [];
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) { if (!['wp-content', 'wp-includes', 'assets'].includes(e.name)) walk(p); }
      else if (e.name === 'index.html') out.push(p);
    }
  };
  walk(SITE);
  // Skip the "color-logo" folders: they hold PNG images saved as index.html, not pages.
  return out.filter((p) => !fs.readFileSync(p).subarray(0, 8).toString('latin1').includes('PNG'));
}

function count(h, s) { return h.split(s).length - 1; }

// Rebuild the two page lists inside every copy (desktop + mobile) of the Solution/Platform mega menu.
function rebuildLists(h) {
  const listRe = (id) => new RegExp(`(data-id="${id}"[\\s\\S]*?<ul class="wpr-page-list">)([\\s\\S]*?)(</ul>)`, 'g');
  const items = {};
  for (const id of ['84031b7', 'c014468']) {
    for (const m of h.matchAll(listRe(id))) {
      for (const li of m[2].match(/<li class="wpr-page-list-item[\s\S]*?<\/li>/g) || []) {
        const k = li.match(/elementor-repeater-item-([0-9a-f]+)/)[1];
        items[k] = li; // desktop and mobile copies are identical
      }
    }
  }
  const build = (spec) => spec.map(([k, t, d]) => {
    if (!items[k]) throw new Error(`menu item ${k} not found`);
    return items[k]
      .replace(/(wpr-pl-title">)[^<]*(<)/, `$1${t}$2`)
      .replace(/<p>[^<]*<\/p>/, `<p>${d}</p>`);
  }).join('');
  h = h.replace(listRe('84031b7'), (_, a, __, c) => a + build(PLATFORM) + c);
  h = h.replace(listRe('c014468'), (_, a, __, c) => a + build(CAPTURE) + c);
  return h;
}

function apply(h, prefix) {
  const want = (label, n, got) => { if (got !== n) throw new Error(`${label}: expected ${n}, found ${got}`); };
  const hub = `${prefix}lead-capture-tool-for-events-sales-teams/`;

  // Top-level labels (desktop + mobile).
  want('Solution desktop', 1, count(h, '<span>Solution</span>') + count(h, 'wpr-pointer-item"><span>Platform</span>'));
  h = h.replace(/href="[^"]*"( class="wpr-menu-item wpr-pointer-item"><span>)Solution(<\/span>)/, `href="${hub}"$1Platform$2`);
  h = h.replace(/href="[^"]*"( class="wpr-mobile-menu-item">)Solution(<)/, `href="${hub}"$1Platform$2`);
  h = h.replace('wpr-pointer-item"><span>Plans</span>', 'wpr-pointer-item"><span>Pricing</span>');
  h = h.replace('wpr-mobile-menu-item">Plans<', 'wpr-mobile-menu-item">Pricing<');
  h = h.replace('wpr-pointer-item"><span>Testimonials</span>', 'wpr-pointer-item"><span>Customers</span>');
  h = h.replace('wpr-mobile-menu-item">Testimonials<', 'wpr-mobile-menu-item">Customers<');

  // Mega-menu column headings.
  h = h.replace(/(data-id="71e4afd"(?:(?!data-id=)[\s\S])*?elementor-heading-title[^>]*>)Use cases(<)/g, '$1Platform$2');
  h = h.replace(/(data-id="7977a41"(?:(?!data-id=)[\s\S])*?elementor-heading-title[^>]*>)Features(<)/g, '$1Ways to capture leads$2');
  h = rebuildLists(h);

  // Resources: descriptions + Events item after Security and compliance.
  for (const [a, b] of RESOURCE_DESC) h = h.split(`<p>${a}</p>`).join(`<p>${b}</p>`);
  if (!h.includes('>Meet the Stinto team at events</p>')) {
    const ev = `<li class="wpr-page-list-item elementor-repeater-item-ev3nt01 wpr-pointer-none wpr-pointer-line-fx wpr-pointer-fx-fade"><span class="wpr-page-list-item-icon">${CAL_SVG}</span><div><a  href="${prefix}events/" class="wpr-no-pointer wpr-pl-title">Events</a><p>Meet the Stinto team at events</p></div></li>`;
    h = h.replace(/(data-id="6a24572"[\s\S]*?<ul class="wpr-page-list">[\s\S]*?)(<\/ul>)/g, `$1${ev}$2`);
  }

  // Header button.
  h = h.replace(/(data-id="34a5bce9"(?:(?!data-id=)[\s\S])*?wpr-button-text">)Get started(<)/, '$1Book a demo$2');

  // Footer tagline + sitewide JSON-LD description.
  h = h.replace('<h6>Create a network of relationships</h6>', `<h6>${TAGLINE}</h6>`);
  h = h.replace('"description":"Reimagine networking with your new digital business card"', `"description":"${SITE_DESC}"`);

  // Checks.
  want('Platform label', 1, count(h, '<span>Platform</span>'));
  want('Pricing label', 1, count(h, '<span>Pricing</span>'));
  want('Customers label', 1, count(h, '<span>Customers</span>'));
  want('Events menu item', 2, count(h, '>Meet the Stinto team at events</p>'));
  want('Book a demo button', 1, count(h, 'wpr-button-text">Book a demo<'));
  want('tagline', 1, count(h, TAGLINE));
  want('site description', 1, count(h, SITE_DESC));
  want('Reimagine gone', 0, count(h, 'Reimagine networking'));
  want('platform heading', 2, count(h, '>Platform</h2>'));
  return h;
}

let changed = 0;
for (const f of pages()) {
  const rel = path.relative(SITE, f);
  const prefix = rel === 'index.html' ? '' : '../'.repeat(rel.split(path.sep).length - 1);
  const before = fs.readFileSync(f, 'utf8');
  const after = apply(before, prefix);
  if (after !== before) { changed++; if (!DRY) fs.writeFileSync(f, after); }
  console.log(`${after !== before ? 'updated' : 'same   '} ${rel}`);
}
console.log(`${changed} page(s) ${DRY ? 'would change' : 'changed'}`);
