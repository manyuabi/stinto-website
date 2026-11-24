// Batch 3: commercial and trust pages. Approved copy from content/rewrite/12–17, mapped to Elementor element ids.
import { hero, faq, cta, infoCards, label } from './blocks.mjs';

const p = (s) => `<p>${s}</p>`;
const DEMO_POINTS = [
  ['Capture', 'A lead captured by card, QR code, tap or scan.'],
  ['Enrich and follow up', 'A voice note added and a personalised follow-up sent.'],
  ['Sync', 'The lead, with notes, landing in your CRM in under 2 minutes.'],
];
const demoBlock = (h1) => `<div class="sb sb-demo">${h1 ? `<h1 class="sb-demo-h">${h1}</h1>` : ''}`
  + `<p class="sb-lead">In the demo you’ll see:</p><div class="sb-cards sb-cards--3">`
  + DEMO_POINTS.map(([t, x]) => `<div class="sb-card"><h3>${t}</h3><p>${x}</p></div>`).join('') + `</div></div>`;

const demoSection = `<section class="sb sb-demo"><h2>Want to see Stinto in action?</h2><p class="sb-lead">In the demo you’ll see:</p><div class="sb-cards sb-cards--3">`
  + DEMO_POINTS.map(([t, x]) => `<div class="sb-card"><h3>${t}</h3><p>${x}</p></div>`).join('')
  + `</div><p style="margin-top:24px"><a class="sb-btn" href="../book-a-demo/">Book a demo</a></p></section>`;

// ---------- Plans
const plansFaq = faq([
  ['Can I pay monthly?', 'Yes. Pay monthly or yearly, and cancel at any time.'],
  ['Are StintoTap cards included?', 'No, StintoTap cards are sold separately and work with every plan.'],
  ['Which CRMs can I connect?', 'HubSpot, Salesforce, Microsoft Dynamics 365 and 9,000+ other apps, via Zapier or our open API.'],
]);
const everyPlan = infoCards('Everything in a plan', 'Business and Enterprise both include the full lead capture workflow.', [
  ['1 Capture', ['Branded digital business card and QR code', 'Two-way exchange by StintoTap, QR or link', 'Unlimited AI business card scans']],
  ['2 Follow up', ['Automatic, personalised follow-up email', 'Your sales materials, incl. video, in every follow-up']],
  ['3 Enrich', ['AI lead enrichment', 'AI voice-to-text notes in 6 languages']],
  ['4 Sync', ['CRM sync with HubSpot, Salesforce, Dynamics 365 and 9,000+ apps', 'Admin dashboard and role-based permissions', 'GDPR compliant, ISO 27001 certified']],
]);
const planListFixes = [
  ['Relationship intelligence with voice-to-text notes', 'AI lead enrichment with voice-to-text notes'],
  ['CRM integration<br>(HubSpot, Salesforce, ActiveCampaign and 1000+ other CRMs)', 'CRM sync<br>(HubSpot, Salesforce, Dynamics 365 and 9,000+ apps via Zapier or open API)'],
  ['ISO27001 certified and GDPR complaint', 'ISO 27001 certified and GDPR compliant'],
  ['Custome branded NFC cards', 'Custom-branded NFC cards'],
];

// ---------- Security
const secFaq = faq([
  ['Is Stinto GDPR compliant?', 'Yes. Stinto processes personal data in full compliance with the GDPR.'],
  ['Is Stinto ISO 27001 certified?', 'Yes.'],
  ['Where is our lead data stored?', 'In the EU.'],
  ['What happens to leads when an employee leaves?', 'They stay with your company.'],
  ['Where can I find more details?', 'In our trust center, linked on this page.'],
]);
const dataCards = infoCards('How your lead data is handled', '', [
  ['Captured with consent', 'In the two-way exchange the other person enters and shares their own details.'],
  ['Stored in the EU', 'Lead data is hosted in the EU and encrypted everywhere.'],
  ['Owned by your company', 'Lead data belongs to your company, not to the employee or to Stinto. Leads stay when people leave.'],
  ['Synced on your terms', 'Leads go to your CRM via Zapier or our open API, only where your team sends them.'],
]);

export const pages = [
  {
    path: 'plans',
    seo: { title: 'Pricing: AI Lead Capture and CRM Sync Plans | Stinto', description: 'Simple per-user pricing for AI lead capture: capture, enrich, follow up and sync every lead to your CRM. Business and Enterprise plans. Cancel any time.' },
    ops: [
      { id: '6d59b9e', heading: 'Pricing for teams that capture leads at every meeting and event', tag: 'h1' },
      { id: '7748592', heading: 'Capture every lead, add AI voice notes, follow up automatically and sync it all to your CRM.' },
      { id: 'f0c4b43', replace: [['For +20 employees', 'For 20+ employees']] },
      { id: 'a57880c', heading: 'Everything in Business, plus dedicated priority support, ongoing IT support and volume pricing. Enterprise-grade security and compliance.' },
      { id: 'e2ebadb', replace: planListFixes },
      { id: 'f339b77', replace: planListFixes },
    ],
    insert: [{ before: '8cb46fe', html: everyPlan }, { end: true, html: plansFaq.html + cta() }],
    jsonld: plansFaq.jsonld,
  },
  {
    path: 'testimonials-2',
    seo: { title: 'Customer Stories: How Sales Teams Capture More Leads | Stinto', description: 'How sales and event teams use Stinto to capture every lead, follow up faster and keep their CRM up to date. Real customer stories.' },
    ops: [
      { id: '2317650', heading: 'Customer stories: more leads captured, followed up and in the CRM', tag: 'h1' },
      { id: 'ba33c89', heading: 'Stinto is used by sales, business development and event teams who meet prospects in person and need every lead in their CRM.<br><br>- 100% automatic lead capture<br>- 100% automatic, personalised follow-up<br>- AI lead enrichment<br>- CRM sync with HubSpot, Salesforce, Dynamics 365 and 9,000+ apps' },
      { id: '789984a', heading: 'Who captures leads with Stinto' },
      { id: '1494561', html: [
        ['Sales &amp; business development:', 'capture leads at conferences and sync them to the CRM instantly.'],
        ['Real estate:', 'capture buyers at viewings, with their preferences as a voice note.'],
        ['Consulting &amp; professional services:', 'record client goals as a voice note right after the meeting.'],
        ['Events &amp; hospitality:', 'capture leads quickly at busy, high-volume events.'],
        ['Enterprise teams:', 'every employee’s leads in one place, synced to the company CRM.'],
      ].map(([a, b]) => `<ul><li><strong><em>${a}</em> ${b}</strong></li></ul>`).join('<p> </p>') },
      { id: '67904ae', heading: 'What customers say' },
      { id: 'b2a0e60', prepend: label('Every lead captured at events') },
      { id: '38ea607', prepend: label('Everything lands in the CRM') },
      { id: '0d429e6', prepend: label('Never forget who you met') },
      { id: '22c1d7f', prepend: label('Faster follow-up') },
      { id: '13d5690', heading: 'Rated 4.1/5 from 150+ reviews' },
      { id: 'bb54623', heading: 'Turn every meeting into pipeline' },
    ],
  },
  {
    path: 'security-and-compliance',
    seo: { title: 'GDPR & ISO 27001 Compliant Lead Capture | Stinto Security', description: 'Stinto is GDPR compliant and ISO 27001 certified. How your lead data is captured, stored, encrypted and synced to your CRM.' },
    ops: [
      { id: '1b835ae', heading: 'GDPR and ISO 27001 compliant lead capture' },
      { id: '1c7392c', html: p('Stinto is GDPR compliant and ISO 27001 certified, so your team can capture and sync leads with confidence.') },
      { id: '0a9283c', html: p('At Stinto, security and privacy are foundational. We design, build and operate our platform to industry-recognised standards to protect customer data and meet regulatory requirements.')
        + p('Stinto processes personal data in full compliance with the EU General Data Protection Regulation (GDPR) and is ISO 27001 certified. Your data is encrypted everywhere, we undergo regular security testing, and we perform regular audits to ensure GDPR compliance.') },
    ],
    insert: [{ end: true, html: dataCards + secFaq.html + cta() }],
    jsonld: secFaq.jsonld,
  },
  {
    path: 'events',
    seo: { title: 'Events: Meet the Stinto Team | Stinto', description: 'Meet the Stinto team at events for sales and marketing leaders, and see AI lead capture live. Upcoming and past events.' },
    ops: [
      { id: 'efea8d8', heading: 'Meet the Stinto team at events', tag: 'h1' },
      { id: 'efea8d8', append: hero('Join us for talks with sales and marketing leaders, and see how we capture every lead at our own events.', { tone: 'light', align: 'left', button: false, large: true }) },
    ],
    insert: [{ end: true, html: cta() }],
  },
  {
    path: 'book-a-demo',
    seo: { title: 'Book a Demo: See AI Lead Capture and CRM Sync | Stinto', description: 'See how Stinto captures a lead, enriches it with AI, follows up and syncs it to your CRM in under 2 minutes. Book a demo today.' },
    ops: [
      { id: 'cd8652d', prepend: demoBlock('See Stinto capture a lead and sync it to your CRM') },
    ],
  },
  {
    path: 'contact-us-2',
    seo: { title: 'Contact Stinto: Sales, Support and Demos | Stinto', description: 'Questions about AI lead capture or CRM sync? Contact the Stinto team for support, sales or a demo.' },
    ops: [
      { id: 'be356e3', heading: 'Contact us', tag: 'h1' },
      { id: 'be356e3', append: hero('Questions about capturing leads or syncing them to your CRM? We’re happy to help.', { tone: 'light', align: 'left', button: false, large: true }) },
      { id: '8f89646', replace: [['Adress:', 'Address:'], ['Hello@stinto.com', 'hello@stinto.com'], ['Want a demo. <a href="../book-a-demo/">Book one here</a>', 'Want to see Stinto in action? <a href="../book-a-demo/">Book a demo.</a>']] },
    ],
    insert: [{ end: true, html: demoSection }],
  },
];
