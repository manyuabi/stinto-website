// Technical SEO, Phase 1: absolute URLs, structured data cleanup, robots per environment,
// sitemap.xml, robots.txt and 404.html. Idempotent: re-running changes nothing.
// Usage: node tools/apply-seo.mjs [--env staging|production] [--dry]
//   staging (default): every page noindex, robots.txt disallows everything (GitHub Pages staging).
//   production:        pages indexable (except NOINDEX), robots.txt allows crawling + sitemap.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { realPages } from './seo-audit.mjs';

const ORIGIN = 'https://www.stinto.com';
const SITE = path.resolve('site');
const ENV = (process.argv.find((a) => a.startsWith('--env=')) || '').slice(6)
  || (process.argv.includes('--env') ? process.argv[process.argv.indexOf('--env') + 1] : 'staging');
const DRY = process.argv.includes('--dry');
if (!['staging', 'production'].includes(ENV)) throw new Error(`unknown --env ${ENV}`);

// Pages Google should not index even in production (expired job ad).
const NOINDEX = new Set(['enterprise-customer-success-onboarding-specialist/']);

const ORG_ID = `${ORIGIN}/#organization`;
const ORG = {
  '@type': 'Organization', '@id': ORG_ID, name: 'Stinto', url: `${ORIGIN}/`,
  logo: { '@type': 'ImageObject', inLanguage: 'en-US', '@id': `${ORIGIN}/#/schema/logo/image/`,
    url: `${ORIGIN}/wp-content/uploads/cropped-Stinto-Fav-icon-v2@4x.png`,
    contentUrl: `${ORIGIN}/wp-content/uploads/cropped-Stinto-Fav-icon-v2@4x.png`, width: 512, height: 512, caption: 'Stinto' },
  image: { '@id': `${ORIGIN}/#/schema/logo/image/` },
  description: 'AI lead capture for sales and event teams: capture, enrich, follow up and sync every lead to your CRM.',
  email: 'hello@stinto.com',
  vatID: 'DK38292560',
  address: { '@type': 'PostalAddress', streetAddress: 'Strandvænget 41', postalCode: '2960', addressLocality: 'Rungsted Kyst', addressCountry: 'DK' },
  contactPoint: { '@type': 'ContactPoint', contactType: 'sales', email: 'hello@stinto.com', url: `${ORIGIN}/book-a-demo/`, availableLanguage: ['English', 'Danish'] },
  sameAs: ['https://www.linkedin.com/company/stinto', 'https://www.youtube.com/channel/UCPn0DIspW4JWhpv4oZQ-dEA'],
};
const SOFTWARE = {
  '@type': 'SoftwareApplication', '@id': `${ORIGIN}/#software`, name: 'Stinto',
  applicationCategory: 'BusinessApplication', applicationSubCategory: 'Lead capture and CRM sync',
  operatingSystem: 'iOS, Android, Web',
  description: 'AI lead capture platform: capture leads by digital business card, NFC card, QR code or business card scan, enrich them with AI, follow up automatically and sync them to your CRM.',
  url: `${ORIGIN}/`, publisher: { '@id': ORG_ID },
  offers: { '@type': 'Offer', url: `${ORIGIN}/plans/`, price: '99', priceCurrency: 'EUR',
    priceSpecification: { '@type': 'UnitPriceSpecification', price: '99', priceCurrency: 'EUR', unitText: 'per user per month, billed yearly', referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitCode: 'MON' } } },
};
const SOFTWARE_PAGES = new Set(['', 'plans/']);
const CRUMB_NAMES = {
  'plans/': 'Pricing', 'testimonials-2/': 'Customer stories', 'privacy-policy/': 'Privacy Policy',
  'blog-and-videos/': 'Blog and videos', 'crm-integrations/': 'CRM integrations', 'sync-leads-to-your-crm/': 'CRM sync',
  'lead-capture-tool-for-events-sales-teams/': 'Lead capture', 'lead-enrichment/': 'AI lead enrichment',
  'business-card-scanner/': 'AI business card scanner', 'company-dashboard/': 'Company dashboard', 'automatic-follow-up/': 'Automatic follow-up',
};
const URL_KEYS = new Set(['@id', 'url', 'item', 'contentUrl', 'thumbnailUrl', 'urlTemplate', 'target']);
const dec = (s) => s.replace(/&amp;/g, '&').replace(/&#8211;/g, '–').replace(/&#8217;/g, '’').replace(/&#0?39;/g, '’').replace(/&quot;/g, '"');

const abs = (v, pageUrl) => (typeof v === 'string' && !/^[a-z]+:/i.test(v) ? new URL(v, pageUrl).href : v);
function absolutize(node, pageUrl) {
  if (Array.isArray(node)) return node.map((n) => absolutize(n, pageUrl));
  if (!node || typeof node !== 'object') return node;
  for (const [k, v] of Object.entries(node)) {
    if (URL_KEYS.has(k)) node[k] = Array.isArray(v) ? v.map((x) => abs(x, pageUrl)) : typeof v === 'string' ? abs(v, pageUrl) : absolutize(v, pageUrl);
    else node[k] = absolutize(v, pageUrl);
  }
  return node;
}

function fixGraph(json, rel, pageUrl) {
  const data = JSON.parse(json);
  let graph = absolutize(data['@graph'], pageUrl);
  const isArticle = graph.some((n) => n['@type'] === 'Article');
  graph = graph.filter((n) => n['@type'] !== 'Person' && n['@id'] !== ORG_ID && n['@id'] !== `${ORIGIN}/#software`);
  for (const n of graph) {
    if (n['@type'] === 'WebSite') { delete n.potentialAction; n.name = 'Stinto'; n.publisher = { '@id': ORG_ID }; }
    if (n['@type'] === 'Article') { n.author = { '@id': ORG_ID }; n.publisher = { '@id': ORG_ID }; }
    if (n['@type'] === 'BreadcrumbList') {
      const items = n.itemListElement.filter((i) => i.name !== 'Blog and videos' || !isArticle);
      const last = items[items.length - 1];
      last.name = CRUMB_NAMES[rel] || dec(last.name);
      if (isArticle) items.splice(1, 0, { '@type': 'ListItem', position: 2, name: 'Blog and videos', item: `${ORIGIN}/blog-and-videos/` });
      items.forEach((it, i) => { it.position = i + 1; it.name = dec(it.name); });
      n.itemListElement = items;
    }
    if (n['@type'] === 'WebPage' && n.name) n.name = dec(n.name);
  }
  graph.push(ORG);
  if (SOFTWARE_PAGES.has(rel)) graph.push(SOFTWARE);
  data['@graph'] = graph;
  return JSON.stringify(data);
}

function robotsFor(rel) {
  if (ENV === 'staging') return 'noindex, nofollow';
  return NOINDEX.has(rel) ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
}

function applyPage(h, rel) {
  const pageUrl = `${ORIGIN}/${rel}`;
  const want = (label, ok) => { if (!ok) throw new Error(`${rel || '(home)'}: ${label}`); };

  // Head URLs.
  for (const re of [/(<link rel="canonical" href=")([^"]*)(")/, /(<meta property="og:url" content=")([^"]*)(")/,
    /(<meta property="og:image" content=")([^"]*)(")/g, /(<meta property="og:image:secure_url" content=")([^"]*)(")/g,
    /(<meta name="twitter:image" content=")([^"]*)(")/g]) {
    h = h.replace(re, (_, a, v, c) => a + abs(v, pageUrl) + c);
  }
  want('canonical', /<link rel="canonical" href="https:\/\/www\.stinto\.com\//.test(h));

  // Robots meta.
  want('robots meta', /<meta name="robots" content="[^"]*">/.test(h));
  h = h.replace(/<meta name="robots" content="[^"]*">/, `<meta name="robots" content="${robotsFor(rel)}">`);

  // Structured data.
  h = h.replace(/(<script type="application\/ld\+json" class="yoast-schema-graph[^"]*"[^>]*>)([\s\S]*?)(<\/script>)/, (_, a, j, c) => a + fixGraph(j, rel, pageUrl) + c);
  want('json-ld', h.includes(`"@id":"${ORG_ID}"`) && !h.includes('SearchAction'));
  return h;
}

// --- sitemap, robots.txt -------------------------------------------------------
function lastmod(file) {
  try { return execFileSync('git', ['log', '-1', '--format=%cs', '--', file], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { return ''; }
}
function sitemap(entries) {
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + entries.map(([loc, mod]) => `  <url><loc>${loc}</loc>${mod ? `<lastmod>${mod}</lastmod>` : ''}</url>`).join('\n')
    + '\n</urlset>\n';
}
const ROBOTS = {
  staging: 'User-agent: *\nDisallow: /\n',
  production: `User-agent: *\nAllow: /\nDisallow: /wp-content/uploads/wpforms/\n\nSitemap: ${ORIGIN}/sitemap.xml\n`,
};

// --- 404.html --------------------------------------------------------------------
// Built from the Events page so it keeps the real header, menu, footer and styles.
// It is served for any missing URL at any depth, so links resolve through <base href>.
const BASE = { staging: '/stinto-website/', production: '/' };
function matchingDivEnd(h, start) {
  const re = /<div\b|<\/div>/g; re.lastIndex = start; let depth = 0, m;
  while ((m = re.exec(h))) { depth += m[0] === '</div>' ? -1 : 1; if (depth === 0) return re.lastIndex; }
  throw new Error('unbalanced div');
}
function build404() {
  let h = fs.readFileSync(path.join(SITE, 'events', 'index.html'), 'utf8');
  const s = h.indexOf('<div data-elementor-type="single-page"');
  if (s < 0) throw new Error('404: content block not found in events page');
  const links = [
    ['Lead capture', '../lead-capture-tool-for-events-sales-teams/', 'How Stinto captures, enriches, follows up and syncs every lead.'],
    ['Pricing', '../plans/', 'Simple per-user pricing for AI lead capture and CRM sync.'],
    ['CRM integrations', '../crm-integrations/', 'HubSpot, Salesforce, Dynamics 365 and 9,000+ apps.'],
    ['Customer stories', '../testimonials-2/', 'How sales and event teams capture more leads with Stinto.'],
  ];
  const body = '<section class="sb sb--light" style="padding-top:64px;padding-bottom:64px">'
    + '<h1 class="sb-legal-h" style="color:#fff">Page not found</h1>'
    + '<p class="sb-lead" style="color:#fff">The page you’re looking for has moved or no longer exists. Try one of these instead.</p>'
    + '<p><a class="sb-btn" href="../">Go to the homepage</a> <a class="sb-btn" href="../book-a-demo/">Book a demo</a></p>'
    + '<div class="sb-cards" style="margin-top:32px">'
    + links.map(([t, u, p]) => `<a class="sb-card" href="${u}"><h3>${t}</h3><p>${p}</p><span class="sb-more">Learn more →</span></a>`).join('')
    + '</div></section>';
  h = h.slice(0, s) + body + h.slice(matchingDivEnd(h, s));
  h = h.replace(/<script type="application\/ld\+json"[\s\S]*?<\/script>/g, '')
    .replace(/<link rel="canonical"[^>]*>\s*/g, '')
    .replace(/<meta (?:property|name)="(?:og|twitter):[^>]*>\s*/g, '')
    .replace(/<meta name="description"[^>]*>\s*/g, '')
    .replace(/<title>[^<]*<\/title>/, '<title>Page not found | Stinto</title>')
    .replace(/<meta name="robots" content="[^"]*">/, '<meta name="robots" content="noindex, follow">')
    .replace(/(href|src)="\.\/"/g, '$1="../events/"')
    .replaceAll('../', '')
    .replace(/(href|src)=""/g, '$1="./"')
    .replace(/<head([^>]*)>/, `<head$1>\n<base href="${BASE[ENV]}">`);
  if ((h.match(/<h1\b/g) || []).length !== 1) throw new Error('404: expected one H1');
  return h;
}

// --- run -----------------------------------------------------------------------
const write = (f, s) => { if (!DRY) fs.writeFileSync(f, s); };
const entries = [];
let changed = 0;
for (const f of realPages()) {
  const rel = path.relative(SITE, f).replace(/index\.html$/, '').split(path.sep).join('/');
  const before = fs.readFileSync(f, 'utf8');
  const after = applyPage(before, rel);
  if (after !== before) { changed++; write(f, after); }
  const canon = after.match(/<link rel="canonical" href="([^"]*)"/)[1];
  if (canon === `${ORIGIN}/${rel}` && !NOINDEX.has(rel)) entries.push([canon, lastmod(f)]);
}
write(path.join(SITE, 'sitemap.xml'), sitemap(entries));
write(path.join(SITE, 'robots.txt'), ROBOTS[ENV]);
write(path.join(SITE, '404.html'), build404());
console.log(`${ENV}: ${changed} page(s) ${DRY ? 'would change' : 'changed'}; sitemap has ${entries.length} URLs`);
