// Batch 4: light-touch pages. Approved copy from content/rewrite/18–21, mapped to Elementor element ids.
const p = (s) => `<p>${s}</p>`;
const legalH1 = (t) => `<h1 class="sb-legal-h">${t}</h1>`;
const closedButton = '<div class="elementor-button-wrapper"> <a class="elementor-button elementor-size-sm" role="button" aria-disabled="true"> <span class="elementor-button-content-wrapper"> <span class="elementor-button-text">Applications closed</span> </span> </a></div>';

export const pages = [
  {
    path: 'sustainability',
    seo: { title: 'Sustainability: Paperless Lead Capture | Stinto', description: 'Paper business cards are thrown away within a week. Stinto replaces them with durable cards and digital lead capture: less waste, better lead data.' },
    ops: [
      { id: 'd73a2fd', replace: [['We knew there had to be a better way.</p>', 'We knew there had to be a better way. And paperless capture has a second benefit: every contact becomes a lead in your CRM instead of a card in a drawer.</p>']] },
      { id: '91bd02c', heading: 'Better for the planet, better for your pipeline' },
      { id: '89fbe9d', replace: [['A modern, responsible approach to professional identity</strong>', 'A modern, responsible approach to professional identity<br aria-hidden="true" />·      Lead data that goes straight to your CRM, not into the bin</strong>']] },
      { id: 'b8318c9', html: p('Make the switch to a longer-lasting solution.<br aria-hidden="true" />Choose a digital business card designed for impact, not disposal, and capture every lead it brings in.') + '<p> </p>' + p('<strong>Stinto: lead capture, reimagined. Responsibly.</strong>') },
    ],
  },
  {
    path: 'blog-and-videos',
    seo: { title: 'Blog and Videos: Lead Capture, Events and CRM Insights | Stinto', description: 'Articles and videos on capturing more leads at events, following up faster and getting clean data into your CRM.' },
    ops: [
      { id: 'a4beb40', heading: 'Blog and videos', tag: 'h1' },
      { id: '68801ea', html: p('Articles and videos on capturing more leads at events, following up faster and getting more return from every meeting and conference.') },
      { id: '6e3af63', replace: [['It not easy, but neccesary.', 'It’s not easy, but it’s necessary.']] },
    ],
  },
  {
    path: 'careers',
    seo: { title: 'Careers at Stinto: Build AI Lead Capture | Stinto', description: 'Join Stinto and help sales and event teams capture every lead with AI. Career opportunities at Stinto.' },
    ops: [
      { id: '199a6ea', heading: 'Career opportunities' },
      { id: '6e842e4', html: p('Stinto is an AI lead capture platform that helps sales and event teams turn every meeting into a lead in their CRM. We don’t have any open positions right now, but we’re always eager to meet new talent.') },
      { id: '4d80caa', html: p('Enterprise Customer Success and Onboarding Specialist') },
      { id: 'fa7767b', replace: [['Read more about the role', 'Applications closed']] },
    ],
  },
  {
    path: 'enterprise-customer-success-onboarding-specialist',
    seo: { title: 'Enterprise Customer Success & Onboarding Specialist | Stinto', description: 'Enterprise Customer Success & Onboarding Specialist at Stinto, the AI lead capture platform. This position is closed.' },
    ops: [
      { id: '428e153', tag: 'h1' },
      { id: 'f62a64d', heading: 'No longer accepting applications' },
      { id: '6d5a112', html: closedButton },
    ],
  },
  {
    path: 'social-media-content-intern',
    seo: { title: 'Social Media & Content Intern | Stinto', description: 'Social Media & Content Intern at Stinto, the AI lead capture platform. Remote or Copenhagen. This position is closed.' },
    ops: [
      { id: '106992e', tag: 'h1' },
      { id: '6eedbdf', replace: [['Stinto is a digital business card platform designed to make sharing and managing professional relationships effortless and secure. With thousands of users and growing market traction, we&#8217;re on a mission to modernise the way professionals connect.',
        'Stinto is an AI lead capture platform that helps sales and event teams capture, follow up and sync every lead to their CRM. With thousands of users and growing market traction, we’re on a mission to modernise how professionals turn meetings into business.']] },
    ],
  },
  {
    path: 'privacy-policy',
    seo: { title: 'Privacy Policy | Stinto', description: 'How Stinto collects, uses and protects personal data, including lead data captured by our customers. GDPR compliant.' },
    ops: [{ id: '5351cc3', prepend: legalH1('Privacy Policy') }],
  },
  {
    path: 'cookie-policy',
    seo: { title: 'Cookie Policy | Stinto', description: 'Which cookies stinto.com uses and how you can manage them.' },
    ops: [{ id: '011f0ee', prepend: legalH1('Cookie Policy') }],
  },
  {
    path: 'terms-of-use',
    seo: { title: 'Terms of Use | Stinto', description: 'The terms that apply when you use Stinto’s AI lead capture platform and website.' },
    ops: [{ id: 'a9c0d16', prepend: legalH1('Terms of Use') }],
  },
];
