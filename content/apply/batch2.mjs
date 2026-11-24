// Batch 2: capture-channel pages. Approved copy from content/rewrite/08–11, mapped to Elementor element ids.
import { strip, hero, faq, cta, captureChannels } from './blocks.mjs';

const TESTIMONIALS = 'Sales teams capturing more pipeline with Stinto';
const p = (s) => `<p>${s}</p>`;
const end = (f) => ({ end: true, html: captureChannels() + f.html + cta() });

const cardFaq = faq([
  ['Does the other person need the Stinto app?', 'No. They receive your details by email, and you get theirs as a lead in Stinto.'],
  ['How do I share my card?', 'By QR code, link or a tap with a StintoTap NFC card.'],
  ['Where do the leads go?', 'Into Stinto, and with one click into your CRM via Zapier or our open API (Business and Enterprise plans).'],
]);
const tapFaq = faq([
  ['Does the other person need an app?', 'No. Tapping opens your details on their phone, and they get your follow-up by email.'],
  ['Which phones work with StintoTap?', 'All modern iPhones and Android phones with NFC.'],
  ['What if NFC doesn’t work?', 'Every StintoTap card also has a QR code, so anyone can scan it with their camera.'],
]);
const scanFaq = faq([
  ['How accurate is the scanner?', '96% overall accuracy across 30+ languages.'],
  ['What happens after I scan a card?', 'The lead is saved in Stinto, gets your follow-up email, and can be synced to your CRM with your notes.'],
]);
const exchangeFaq = faq([
  ['Does the other person need the Stinto app?', 'No. They enter their details on a web page and get yours by email.'],
  ['Is the exchange GDPR compliant?', 'Yes. Stinto is GDPR compliant and ISO 27001 certified.'],
]);

export const pages = [
  {
    path: 'digital-business-card',
    seo: { title: 'Digital Business Cards that Capture Leads into Your CRM | Stinto', description: 'Every share of your digital business card creates a lead: captured in Stinto, followed up automatically and synced to your CRM. For whole teams.' },
    ops: [
      { id: 'c90d3a6', heading: 'Digital business cards that capture leads straight into your CRM', tag: 'h1' },
      { id: 'c90d3a6', append: hero('Every time your team shares a card, by QR code, link or tap, the other person becomes a lead in Stinto: followed up instantly and synced to your CRM.', { tone: 'light' }) },
      { id: '6160666', heading: 'Every share creates a lead, for every person on your team.' },
      { id: '6c332d9', heading: 'Works with anyone, no app needed' },
      { id: '9211f2e', heading: 'You get their details as a lead in Stinto. They get yours by email.' },
      { id: '25935ce', heading: 'Straight into your pipeline' },
      { id: 'fc43b1c', heading: 'Notes, follow-up and CRM sync are built in, so no lead stays on a phone.' },
      { id: '6af7aa6', heading: 'On-brand for your whole team' },
      { id: '6a2861a', heading: 'Company branding, colour themes and social links on every employee’s card.' },
    ],
    insert: [{ before: '6160666', depth: 2, html: strip('capture') }, end(cardFaq)],
    jsonld: cardFaq.jsonld,
  },
  {
    path: 'stintotap',
    seo: { title: 'StintoTap NFC Business Card: Tap to Capture a Lead | Stinto', description: 'Tap a phone with StintoTap and capture a lead in a second, followed up automatically and synced to your CRM. Essence, Custom and Wood.' },
    ops: [
      { id: 'f4b801b', heading: 'StintoTap: tap a phone, capture a lead' },
      { id: '87a3e2a', html: p('The fastest way to capture a lead on a busy show floor.') },
      { id: '1ef2240', html: p('One tap shares your details and starts the two-way exchange: the lead lands in Stinto, gets your personalised follow-up and syncs to your CRM.') + p('Works with all modern iPhones and Android phones with NFC, and every card also has a QR code.') },
      { id: '1ef2240', append: hero('', { align: 'left' }) },
      { id: '2dc80d6', heading: 'Choose your StintoTap' },
      { id: '0c0dbc4', heading: 'Ideal for professionals, freelancers and individuals. Works with every plan.' },
      { id: '824747f', heading: 'Your company’s design on every card, for teams that want to leave a mark. Works with every plan. Minimum order depends on design.' },
      { id: 'e81ea3a', heading: 'For organisations with a green profile. Works with every plan. Minimum order depends on design.' },
    ],
    insert: [{ before: '2dc80d6', depth: 2, html: strip('capture') }, end(tapFaq)],
    jsonld: tapFaq.jsonld,
  },
  {
    path: 'business-card-scanner',
    seo: { title: 'AI Business Card Scanner: Paper Cards to CRM Leads | Stinto', description: 'Scan any paper business card with AI and turn it into a CRM-ready lead in 2 seconds. 96% accuracy, 30+ languages, synced to your CRM.' },
    ops: [
      { id: '1444e89', heading: 'Scan any paper business card into a CRM-ready lead with AI' },
      { id: '2da3c08', heading: 'Snap the card and Stinto reads it in 2 seconds, saves the lead, follows up and syncs it to your CRM. No typing, no lost cards.' },
      { id: '2da3c08', append: hero('') },
      { id: 'e444a5c', heading: 'Scan in seconds' },
      { id: '28e3fe5', heading: 'More accurate and faster than typing it in yourself' },
      { id: 'd5678ae', heading: 'No more piles of cards' },
      { id: '2c4a46a', heading: 'Every card becomes a lead the moment you scan it, not weeks after the event.' },
      { id: '5698070', heading: 'Scanned, enriched, synced' },
      { id: '90654cd', heading: 'Add a voice note to the scanned lead and send everything to your CRM with one click.' },
    ],
    insert: [{ before: 'e444a5c', depth: 2, html: strip('capture', 'light') }, end(scanFaq)],
    jsonld: scanFaq.jsonld,
  },
  {
    path: 'two-way-exchange',
    seo: { title: 'Two-Way Contact Exchange: Capture Leads Instantly | Stinto', description: 'You capture their details as a lead, they get yours by email, in one step. No app needed for them. Synced to your CRM.' },
    ops: [
      { id: '2042505', heading: 'Capture their details while they get yours, instantly', tag: 'h1' },
      { id: '2042505', append: hero('One exchange, two results: the lead lands in Stinto and your CRM, and they get your details and materials by email. They don’t need the app.') },
      { id: 'a88104f', heading: 'Start with a tap or a QR code' },
      { id: '31e00fe', html: p('Use your StintoTap NFC card or your QR code. The other person enters their details on a web page, with no app needed, and the exchange is done.') },
      { id: 'aa057a0', heading: 'They remember you, thanks to the instant follow-up' },
      { id: 'e205373', html: p('The lead gets a personalised email with your photo, contact details and the materials you chose.') },
      { id: 'b420de9', heading: 'You get a lead, not just a contact' },
      { id: '592c4f8', html: p('The moment they hit “Exchange”, they are a lead in Stinto, ready for your voice note and one-click CRM sync.') },
      { id: '418aa35', heading: 'Lead data that stays up to date' },
      { id: 'e272faf', html: p('If the lead joins Stinto later, you become live contacts, and their details update automatically when they change jobs.') },
      { id: '10186a5', heading: 'From first meeting to closed deal' },
      { id: '69e6cb9', heading: TESTIMONIALS },
    ],
    insert: [{ before: 'a88104f', depth: 2, html: strip('capture', 'light') }, end(exchangeFaq)],
    jsonld: exchangeFaq.jsonld,
  },
];
