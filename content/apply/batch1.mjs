// Batch 1: Platform pages. Approved copy from content/rewrite/01–07, mapped to Elementor element ids.
import { strip, hero, faq, cta, captureChannels, feature } from './blocks.mjs';

const TESTIMONIALS = 'Sales teams capturing more pipeline with Stinto';
const p = (s) => `<p>${s}</p>`;

const enrichFaq = faq([
  ['What is lead enrichment?', 'Adding information to a captured lead, such as meeting context, needs and next steps, so sales can qualify and follow up.'],
  ['Where does the enriched data go?', 'Onto the lead’s record in your CRM, or your Stinto Company Dashboard if you have no CRM.'],
  ['Do I have to type?', 'No. Speak your note and Stinto converts it to text.'],
]);
const voiceFaq = faq([
  ['Which languages are supported?', 'English, Danish, German, Spanish, French and Italian.'],
  ['Where do notes go?', 'On the lead in Stinto, and synced to your CRM or Company Dashboard.'],
]);
const followFaq = faq([
  ['What does the lead receive?', 'A personalised email with your contact details and the materials you chose for that event or campaign.'],
  ['Do they need the Stinto app?', 'No. Anyone can receive your follow-up, whether or not they use Stinto.'],
]);
const syncFaq = faq([
  ['What gets synced?', 'Contact details and your notes, on the lead record.'],
  ['How do I connect my CRM?', 'Two ways: through Zapier (no code, 9,000+ apps) or our open API for full control.'],
  ['Which plan includes CRM sync?', 'The Business and Enterprise plans.'],
]);
const crmFaq = faq([
  ['Which CRMs does Stinto work with?', 'HubSpot, Salesforce, Microsoft Dynamics 365 and 9,000+ other apps.'],
  ['How do I connect my CRM?', 'Two ways: through Zapier (no code) or our open API for full control.'],
  ['Which plan includes CRM integrations?', 'The Business and Enterprise plans.'],
]);
const dashFaq = faq([
  ['Do I need a CRM to use Stinto?', 'No. The dashboard works on its own, and you can connect a CRM later.'],
]);

export const pages = [
  {
    path: 'lead-capture-tool-for-events-sales-teams',
    seo: { title: 'Event Lead Capture App for Sales Teams | Stinto', description: 'Capture every lead at events and meetings, follow up instantly, add notes and sync to HubSpot, Salesforce or Dynamics. GDPR compliant. Book a demo.' },
    ops: [
      // FAQ structured data must match the rewritten visible answers
      { raw: [
        ['"text":"Stinto instantly saves their contact details and sends them an email with your card and chosen materials \\u2014 no action needed from you."',
          '"text":"Stinto instantly saves their contact details and sends them a personalised email with your details and chosen materials, with no action needed from you."'],
        ['"text":"Not for now \\u2014 it guarantees an immediate, professional first touch so no lead goes cold. Your voice notes make it easy to send a genuinely personal follow-up afterward.\\n\\u00a0\\nHowever, we will be adding an automatic personalised follow-up feature soon."',
          '"text":"No need to choose. Stinto sends an automatic follow-up that is personalised to each lead, with your details and the materials you chose, so every lead gets a relevant first touch within minutes."'],
      ] },
      { id: 'f94ff32', heading: 'AI lead capture for sales and event teams' },
      { id: '08db818', heading: 'Capture every lead from every event and meeting, straight into your CRM' },
      { id: 'ed04bb4', html: p('Companies spend heavily on trade shows, conferences and client dinners, yet only 48% of the leads they meet are captured and followed up.') + p('Stinto captures every lead in seconds, follows up instantly, adds the context of your conversation and syncs it all to your CRM.') },
      { id: '36fbe6d', heading: 'Manual lead capture loses pipeline' },
      { id: 'f83facc', html: '<p>Traditional business cards take <b>35x</b> longer than Stinto to capture a lead, and need manual data entry into your CRM.</p><p> </p><p>LinkedIn takes <b>12x</b> longer than Stinto, from meeting someone to connecting, waiting for a reply and finally starting the conversation. And the lead ends up on your employee’s private account, not in your CRM.</p>' },
      { id: 'f496b2c', heading: 'Automate the whole journey from handshake to CRM' },
      { id: 'e541e48', html: p('Stinto captures the lead, sends the first follow-up, records the context and updates your CRM, at the booth and between meetings.') },
      { id: '66a55ea', heading: 'Tap with StintoTap, share your QR code, or scan a paper business card with AI. The lead’s real contact details are in Stinto in seconds. <br><br>No typing, no lost stack of cards.' },
      { id: '2c3f8ed', heading: 'The moment you capture a lead, Stinto sends them a personalised email with your details and the materials you chose for that event.' },
      { id: 'd88b527', heading: 'Enrich with context' },
      { id: '4c97b2e', heading: 'Record a voice note about what you discussed. Stinto turns it into text and attaches it to the lead, so the next person knows the full story.' },
      { id: 'fdfe89c', heading: 'One click sends the contact and your notes to HubSpot, Salesforce, Dynamics 365 or any of 9,000+ apps (via Zapier or our open API), so whoever follows up picks up exactly where you left off.' },
      { id: '463c127', html: p('The personalised email lands while your conversation is still fresh. Your voice notes then give your team everything they need for the next step.') },
      { id: '86f7bcd', heading: 'Everything you need, from first contact to CRM' },
      { id: '8d65733', html: p('Share by tap, QR code or link. Every share creates a lead, even with people who don’t use Stinto.') },
      { id: '8d304f6', html: p('Turn paper business cards into CRM-ready leads instantly.') },
      { id: '03525e6', html: p('Capture what was actually said, right after the conversation.') },
      { id: '17dba17', html: p('HubSpot, Salesforce, Dynamics 365 and 9,000+ apps via Zapier or our open API.') },
      { id: '7ebb49c', heading: TESTIMONIALS },
      { id: 'ad1cbd4', replace: [['becuse your forget', 'because you forget']] },
      { id: '782175d', replace: [['unqiue', 'unique']] },
      { id: '73ef9fe', heading: 'Why Stinto beats business cards and LinkedIn for lead capture' },
      { id: 'f414fdd', html: p('Stinto instantly saves their contact details and sends them a personalised email with your details and chosen materials, with no action needed from you.') },
      { id: '8b81d4d', html: '<blockquote><p>No need to choose. Stinto sends an automatic follow-up that is personalised to each lead, with your details and the materials you chose, so every lead gets a relevant first touch within minutes.</p></blockquote>' },
    ],
    insert: [{ after: '17dba17', depth: 2, html: captureChannels('light') }],
  },
  {
    path: 'lead-enrichment',
    seo: { title: 'Lead Enrichment for Event & Meeting Leads | Stinto', description: 'Add context to every lead: where you met, what you discussed and next steps, captured by voice and synced to your CRM automatically.' },
    ops: [
      { id: '905d008', heading: 'Lead enrichment: turn a contact into a qualified lead', tag: 'h1' },
      { id: '905d008', append: hero('A name and email don’t close deals. Context does. Stinto attaches where you met, what you discussed and the next step to every lead, and sends it to your CRM.') },
      { id: '65b67b9', heading: 'Capture the context that qualifies a lead' },
      { id: '3e99fa0', html: p('Record the event, the conversation, the buying signals and the agreed next step while it’s fresh, in seconds and by voice.') },
      { id: 'cef39eb', heading: 'Give your whole team the full picture' },
      { id: 'e43318a', html: p('Anyone who picks up the lead sees what was said, so follow-up is relevant, not generic.') },
      { id: '27e17d3', heading: 'Enriched leads land in your CRM automatically' },
      { id: '48cf901', html: p('Every note is saved on the lead’s record in HubSpot, Salesforce, Dynamics 365 or any CRM you connect via Zapier or our open API. No copy-paste, no admin.') },
      { id: '5cc2f39', heading: '4x faster than typing' },
      { id: '635998b', html: p('Speak your notes between meetings or walking the show floor, and spend the time you save talking to more leads.') },
      { id: '6de816e', heading: 'Works on the go, in 6 languages' },
      { id: '8f68a00', html: p('Record a note right after the meeting in English, Danish, German, Spanish, French or Italian.') },
      { id: 'cbfeaef', heading: TESTIMONIALS },
    ],
    insert: [{ before: '65b67b9', depth: 2, html: strip('enrich', 'light') }, { end: true, html: enrichFaq.html + cta() }],
    jsonld: enrichFaq.jsonld,
  },
  {
    path: 'voice-to-text-notes',
    seo: { title: 'Voice-to-Text Meeting Notes Synced to Your CRM | Stinto', description: 'Speak your meeting notes after every conversation. Stinto turns them into text on the lead and syncs them to your CRM. 6 languages.' },
    ops: [
      { id: '444c600', heading: 'Speak your meeting notes, and they land on the lead in your CRM', tag: 'h1' },
      { id: '444c600', append: hero('After every conversation, record what was said. Stinto turns it into text and attaches it to the lead.') },
      { id: '5beb9e4', heading: 'Never forget what a lead told you' },
      { id: '21ce53d', heading: 'Where you met, what they need, what you promised: recorded in 20 seconds, while it’s fresh.' },
      { id: 'b4366b6', heading: 'Built for the show floor' },
      { id: '25b7ffe', heading: 'Meeting notes, buying signals, reminders and follow-up tasks, all hands-free between meetings.' },
      { id: '6fa7b9f', heading: 'Every note syncs to the CRM' },
      { id: '2441fa7', heading: 'Your colleagues, and your future self, see the full story on the lead record.' },
      { id: 'ed7652c', heading: 'Voice notes are 4x faster than typing.' },
      { id: '46bb781', heading: 'Notes in 6 languages' },
      { id: '7a42e51', heading: 'English, Danish, German, Spanish, French and Italian.' },
    ],
    insert: [{ before: '7e67771', depth: 2, html: strip('enrich', 'light') }, { end: true, html: voiceFaq.html + cta() }],
    jsonld: voiceFaq.jsonld,
  },
  {
    path: 'automatic-follow-up',
    seo: { title: 'Automatic Follow-up Emails After Events & Meetings | Stinto', description: 'Follow up with every lead the moment you meet: an instant, personalised email with your details and materials, from every rep. Book a demo.' },
    ops: [
      { id: '8bf3b46', heading: 'Follow up on every lead before you leave the room', tag: 'h1' },
      { id: '8bf3b46', append: hero('Leads contacted within 5 minutes are 21x more likely to qualify (HBR/MIT). Stinto sends a personalised follow-up the moment you capture a lead, with no typing and no forgotten emails.') },
      { id: 'f45231d', heading: 'Personalised follow-up, sent the second you capture a lead' },
      { id: 'c0b74b5', html: p('Each lead gets an email written for them, with your contact details and the deck, brochure or offer that fits, in their inbox before the conversation ends.') },
      { id: '0edbb70', heading: 'Personal for every lead, consistent across the team' },
      { id: '37b8a75', html: '<p><strong>Set the materials and tone per event or campaign once.</strong></p><ul><li>Thank them for the conversation</li><li>Invite them to book a meeting</li><li>Show why it’s worth continuing the talks</li></ul><p>Every rep at every booth sends a relevant, professional first touch, with no templates to copy and paste.</p>' },
      { id: 'bfd37fb', heading: 'Stay top of mind while competitors are still sorting business cards' },
      { id: '6d48249', html: p('Attach the material that fits: images, PDFs, decks or offers. Leads don’t need the Stinto app to receive it, and they remember you because you followed up first.') },
      { id: '68c7c1f', heading: 'Your details stay current' },
      { id: 'a429b6c', html: p('If your role, number or materials change, leads always find the latest version through the same email.') },
      { id: 'd13b101', heading: 'From first meeting to closed deal' },
      { id: 'c29946f', heading: TESTIMONIALS },
    ],
    insert: [{ before: 'f45231d', depth: 2, html: strip('follow-up', 'light') }, { end: true, html: followFaq.html + cta() }],
    jsonld: followFaq.jsonld,
  },
  {
    path: 'sync-leads-to-your-crm',
    seo: { title: 'Sync Event Leads to HubSpot, Salesforce & Dynamics | Stinto', description: 'Stop leads getting stuck on phones and business cards. Stinto syncs every lead and note to your CRM in one click.' },
    ops: [
      { id: '710545f', heading: 'Every lead and note, synced to your CRM in real time', tag: 'h1' },
      { id: '710545f', append: hero('Leads from events and meetings shouldn’t live on phones or in jacket pockets. Stinto puts them in your CRM, with context, in one click.') },
      { id: '540f462', heading: 'No more manual data entry' },
      { id: '61d9ccf', html: p('No typing from business cards, no spreadsheets after the event. Leads arrive in your CRM complete and correctly formatted, with your notes attached.') },
      { id: 'c67f2ba', heading: 'Leads belong to the company, not to a rep’s phone' },
      { id: '8f0c820', html: p('When leads live in private LinkedIn accounts and phone books, the company loses them. With direct CRM sync, every lead stays in your pipeline, even when someone leaves.') },
      { id: 'f76d8df', heading: 'Works with HubSpot, Salesforce, Dynamics 365 and 9,000+ apps' },
      { id: '3f71d95', html: p('Connect through Zapier, where Stinto is an integration partner, or build your own integration with our open API. No CRM? Use the Stinto Company Dashboard.') + p('<a href="../crm-integrations/">See all CRM integrations →</a>') },
      { id: '746ed94', heading: 'Prove event ROI from your CRM' },
      { id: 'ec77d1d', html: p('You never know where your next big deal will come from, but it won’t happen if the lead isn’t in the CRM. With every event lead in your CRM, you can track it to pipeline and revenue.') },
      { id: 'dfb1f1d', heading: 'From first meeting to closed deal' },
      { id: 'c7cd441', heading: TESTIMONIALS },
    ],
    insert: [{ before: 'b29239f', depth: 2, html: strip('sync', 'light') }, { end: true, html: syncFaq.html + cta() }],
    jsonld: syncFaq.jsonld,
  },
  {
    path: 'crm-integrations',
    seo: { title: 'CRM Integrations: HubSpot, Salesforce, Dynamics 365 | Stinto', description: 'Connect Stinto lead capture to HubSpot, Salesforce, Microsoft Dynamics 365 and 9,000+ apps via Zapier, or build your own with our open API.' },
    ops: [
      { id: '83f92e2', heading: 'Connect your lead capture to HubSpot, Salesforce, Dynamics 365 and 9,000+ apps', tag: 'h1' },
      { id: '83f92e2', append: hero('Two ways to connect: Zapier (no code) or our open API (full control). Every lead you capture, with notes, flows straight into the systems your sales team already uses.', { tone: 'light', align: 'left' }) },
      // 0b3dce6 is the tablet/phone copy of the hero (83f92e2 is desktop-only); same text, kept as h2 so the page has one H1
      { id: '0b3dce6', heading: 'Connect your lead capture to HubSpot, Salesforce, Dynamics 365 and 9,000+ apps' },
      { id: '0b3dce6', append: hero('Two ways to connect: Zapier (no code) or our open API (full control). Every lead you capture, with notes, flows straight into the systems your sales team already uses.', { tone: 'light', align: 'left' }) },
      { id: 'b42f3ed', heading: 'One workflow from handshake to CRM' },
      { id: 'cf8e1c0', html: p('Stinto captures the lead, adds your notes and sends it to your CRM, so no event lead is lost and every one can be traced to revenue.') },
      { id: '66677e0', html: p('Connect with <strong>Zapier</strong> (no code, 9,000+ apps) or build your own integration with our <strong>open API</strong> for full control. Either way, your CRM stays the single source of truth for every lead your team meets.') },
      { id: '9ab34a2', html: '<p>What you can automate:</p><ul><li>Create new contacts or leads in your CRM</li><li>Update existing contacts automatically</li><li>Add meeting notes to the contact</li></ul>' },
      { id: '3f4b8bf', heading: 'Find your CRM among 9,000+ integrations' },
      { id: 'ee529c7', heading: 'No CRM? Use the Company Dashboard' },
      { id: '7b2a19a', html: p('With a company account, your team sends leads to the Company Dashboard with one click: every lead and note in one place, with nothing to set up.') },
      { id: '48fba07', heading: 'Build it yourself with our open API' },
      { id: '0a8e6b2', replace: [['CRM integrations are only available on the team plan', 'CRM integrations are included in the Business and Enterprise plans']] },
      { id: '352b9c3', heading: 'Turn every meeting into pipeline' },
      { id: '160a14c', heading: 'Capture, follow up, enrich and sync every lead, automatically.' },
    ],
    insert: [{ before: 'e0c8a54', depth: 2, html: strip('sync') + crmFaq.html }],
    jsonld: crmFaq.jsonld,
  },
  {
    path: 'company-dashboard',
    seo: { title: 'Company Dashboard: See Every Lead Your Team Captures | Stinto', description: 'One place for every lead, note and material your team captures, with or without a CRM. See leads per event and manage users in minutes.' },
    ops: [
      { raw: [['"position":2,"name":"Low-touch Company Dashboard"', '"position":2,"name":"Company Dashboard"']] },
      { id: '902079c', heading: 'See every lead your team captures, with or without a CRM', tag: 'h1' },
      { id: 'fbc6aa0', html: p('Every company account includes a dashboard with all your team’s leads and notes, the leads from each event, the materials they share, and simple user management.') },
      { id: 'fbc6aa0', append: hero('', {}) },
      { id: 'f10bf9d', heading: 'No CRM needed' },
      { id: 'd2ea3d7', heading: 'All your team’s leads and notes in one place: who was met, by whom, at which event, and what was discussed.' },
      { id: 'b917930', heading: 'Materials for follow-up' },
      { id: '9747b93', heading: 'Upload decks, brochures and videos once. Reps attach the right material to their automatic follow-ups.' },
      { id: '51712a3', heading: 'Team management' },
      { id: '429484a', heading: 'Add or remove team members in minutes. When someone leaves, their leads stay with the company.' },
    ],
    insert: [
      { before: 'f10bf9d', depth: 2, html: strip('sync', 'light') },
      { end: true, html: feature('Know which events deliver', 'See the leads captured at each event, so you can compare events and prove their ROI.') + dashFaq.html + cta() },
    ],
    jsonld: dashFaq.jsonld,
  },
];
