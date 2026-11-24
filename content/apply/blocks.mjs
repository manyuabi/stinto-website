// Shared content blocks for the rewrite (see content/rewrite/00-shared-blocks.md).
// All links are relative to a page one folder deep (site/<page>/index.html).
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const DEMO = '../book-a-demo/';
export const SIGNUP = 'http://web.stinto.com/login';

// Order matches the product: the follow-up email goes out at the moment of capture.
const STEPS = [
  { key: 'capture', title: 'Capture', href: '../lead-capture-tool-for-events-sales-teams/', text: 'Tap, scan a QR code or scan a paper card. The lead is in Stinto in seconds.' },
  { key: 'follow-up', title: 'Follow up', href: '../automatic-follow-up/', text: 'The lead instantly gets a personalised email with your details and materials.' },
  { key: 'enrich', title: 'Enrich', href: '../lead-enrichment/', text: 'Add a voice note on what you discussed, so every lead has context.' },
  { key: 'sync', title: 'Sync', href: '../sync-leads-to-your-crm/', text: 'Contact and notes land in your CRM with one click.' },
];

// tone: 'dark' (on the dark green page background) or 'light' (inside a light grey card)
export function strip(current, tone = 'dark') {
  const items = STEPS.map((s, i) => {
    const on = s.key === current;
    return `<li class="sb-step${on ? ' is-current' : ''}"><a href="${s.href}"${on ? ' aria-current="page"' : ''}>`
      + `<span class="sb-step-num">${i + 1}</span><h3>${s.title}${on ? '<span class="sb-step-here">You are here</span>' : ''}</h3><p>${s.text}</p></a></li>`;
  }).join('');
  return `<section class="sb sb-steps${tone === 'light' ? ' sb--light' : ''}" aria-labelledby="sb-steps-h"><h2 id="sb-steps-h">How Stinto works</h2>`
    + `<p class="sb-lead">From first handshake to CRM in four steps, automatically.</p><ol class="sb-steps-list">${items}</ol></section>`;
}

export function hero(text, { tone = 'dark', align = 'center', button = true, large = false } = {}) {
  const cls = `sb-hero sb-hero--${tone}${align === 'left' ? ' sb-hero--left' : ''}${large ? ' sb-hero--lg' : ''}`;
  return `<div class="${cls}" style="text-align:${align}">${text ? `<p>${text}</p>` : ''}`
    + (button ? `<a class="sb-btn" href="${DEMO}">Book a demo</a>` : '') + `</div>`;
}

export function faq(items) {
  const html = `<section class="sb sb-faq" aria-labelledby="sb-faq-h"><h2 id="sb-faq-h">Frequently asked questions</h2><div class="sb-faq-list">`
    + items.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')
    + `</div></section>`;
  const jsonld = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  };
  return { html, jsonld };
}

export function cta() {
  return `<section class="sb sb-cta" aria-labelledby="sb-cta-h"><div class="sb-cta-box"><h2 id="sb-cta-h">Turn every meeting into pipeline</h2>`
    + `<p class="sb-lead">Capture, follow up, enrich and sync every lead, automatically.</p>`
    + `<div class="sb-cta-actions"><a class="sb-btn" href="${DEMO}">Book a demo</a><a class="sb-btn sb-btn--ghost" href="${SIGNUP}">Get started</a></div>`
    + `<p class="sb-cta-trust">Set up in minutes · GDPR compliant &amp; ISO 27001 certified</p></div></section>`;
}

export function captureChannels(tone = 'dark') {
  const cards = [
    ['Digital business card &amp; QR', '../digital-business-card/', 'Share by QR code or link. Every share creates a lead, even if they don’t use Stinto.'],
    ['StintoTap NFC card', '../stintotap/', 'Tap a phone, capture a lead. The fastest swap on a busy show floor.'],
    ['AI card scanner', '../business-card-scanner/', 'Turn paper business cards into CRM-ready leads in seconds.'],
    ['Two-way exchange', '../two-way-exchange/', 'You get their details in Stinto, they get yours by email.'],
  ];
  return `<section class="sb sb-channels${tone === 'light' ? ' sb--light' : ''}" aria-labelledby="sb-ch-h"><h2 id="sb-ch-h">Four ways to capture a lead</h2>`
    + `<p class="sb-lead">Use whichever fits the moment. Every one creates a lead that is followed up and synced to your CRM.</p><div class="sb-cards">`
    + cards.map(([t, h, p]) => `<a class="sb-card" href="${h}"><h3>${t}</h3><p>${p}</p><span class="sb-more">Learn more →</span></a>`).join('')
    + `</div></section>`;
}

export function feature(title, text) {
  return `<section class="sb"><div class="sb-feature"><h2>${title}</h2><p>${text}</p></div></section>`;
}

// Non-link info cards: items = [[title, text | string[]]]. tone as in strip().
export function infoCards(title, lead, items, tone = 'dark') {
  const body = (t) => Array.isArray(t) ? `<ul>${t.map((x) => `<li>${x}</li>`).join('')}</ul>` : `<p>${t}</p>`;
  return `<section class="sb sb-channels${tone === 'light' ? ' sb--light' : ''}"><h2>${title}</h2>${lead ? `<p class="sb-lead">${lead}</p>` : ''}`
    + `<div class="sb-cards">${items.map(([h, t]) => `<div class="sb-card"><h3>${h}</h3>${body(t)}</div>`).join('')}</div></section>`;
}

// Small outcome label placed above a customer quote
export const label = (text) => `<p class="sb-label">${text}</p>`;
