// SEO Phase 2 copy. Source for content/seo/*.md (review) and for tools/apply-seo.mjs (apply).
// Regenerate the review files: node tools/seo-phase2-docs.mjs

// Titles and descriptions. Only pages that need a change are listed; every other page keeps its current copy.
export const META = {
  '': {
    title: 'AI Lead Capture and CRM Enrichment for Sales Teams | Stinto',
    desc: 'Capture every lead at events and meetings, enrich it with AI, follow up instantly and sync it to HubSpot, Salesforce or Dynamics 365.',
  },
  'bridging-the-business-buyer-gap/': {
    title: 'Bridging the Business Buyer Gap in B2B Sales | Stinto',
    desc: 'The business buyer gap is already hurting your growth. Learn what it is, why it matters for sales teams and what you can do to close it.',
  },
  'digital-business-card-and-stinto-relationship-success/': {
    title: 'Digital Business Cards and Relationship Success | Stinto',
  },
  'how-robin-daniels-relationships-fuelled-his-rise/': {
    title: 'How Robin Daniels’ Relationships Fuelled His Rise | Stinto',
    desc: 'Event video: Robin Daniels on how relationships fuelled his rise, and why the people he met mattered at every step of his career.',
  },
  'video-how-robin-daniels-relationships-fueled-his-rise/': {
    title: 'How Robin Daniels’ Relationships Fuelled His Rise | Stinto',
    desc: 'Event video: Robin Daniels on how relationships fuelled his rise, and why the people he met mattered at every step of his career.',
  },
  'the-hidden-costs-of-linkedin-for-your-enterprise/': {
    title: 'The Hidden Costs of LinkedIn for Your Enterprise | Stinto',
  },
  'the-true-costs-of-traditional-paper-business-cards/': {
    title: 'The True Costs of Traditional Paper Business Cards | Stinto',
    desc: 'The hidden costs of paper business cards, from waste to lost contacts, and how digital business cards help your team capture every lead.',
  },
  'iso27001-certified/': {
    title: 'ISO 27001 Certified: How Stinto Protects Lead Data | Stinto',
  },
  'cookie-policy/': {
    title: 'Cookie Policy: How stinto.com Uses Cookies | Stinto',
    desc: 'Which cookies stinto.com uses and why, how to delete or block them in your browser, and how we tell you about changes to this policy.',
  },
  'privacy-policy/': {
    title: 'Privacy Policy: How Stinto Protects Personal Data | Stinto',
  },
  'terms-of-use/': {
    title: 'Terms of Use for the Stinto Platform and Website | Stinto',
    desc: 'The terms that apply when you use the Stinto lead capture platform, apps and website, including registration, purchases and payment.',
  },
  'contact-us-2/': {
    desc: 'Questions about AI lead capture, pricing or CRM sync? Contact the Stinto team in Denmark for sales, customer support or a product demo.',
  },
  'careers/': {
    desc: 'Join Stinto and help sales and event teams capture every lead with AI. See open positions and how we work at our Danish software company.',
  },
};

// One H1 per page: [page, heading text, change].
export const H1 = [
  ['', 'Automate the process from first handshake to CRM and increase your ROI from in-person meetings, events and conferences', 'H1 → H2 (the page keeps “AI lead capture and CRM enrichment” as its H1)'],
  ['bridging-the-business-buyer-gap/', 'Bridging the business buyer gap', 'H2 → H1'],
  ['digital-business-card-and-stinto-relationship-success/', 'Digital business cards and how Stinto can enable Relationship Success for your team', 'H2 → H1'],
  ['how-robin-daniels-relationships-fuelled-his-rise/', 'How Robin Daniels’ Relationships Fueled His Rise', 'H2 → H1'],
  ['video-how-robin-daniels-relationships-fueled-his-rise/', 'How Robin Daniels’ Relationships Fueled His Rise', 'H2 → H1'],
  ['the-hidden-costs-of-linkedin-for-your-enterprise/', 'The Hidden Costs of LinkedIn for Your Enterprise', 'H2 → H1'],
  ['the-true-costs-of-traditional-paper-business-cards/', 'The True Costs of Traditional Paper Business Cards', 'H2 → H1'],
  ['iso27001-certified/', 'Stinto is now ISO 27001 Certified', 'H2 → H1'],
];

// Share images (1200x630, rendered by tools/make-share-images.mjs). Pages not listed keep their current image.
export const SHARE = {
  '': 'assets/share/home.png',
  'plans/': 'assets/share/pricing.png',
  'lead-capture-tool-for-events-sales-teams/': 'assets/share/lead-capture.png',
  'digital-business-card/': 'assets/share/digital-business-card.png',
  'stintotap/': 'assets/share/stintotap.png',
  // Favicon, logo, portrait-shaped or heavy GIF today: use the default.
  ...Object.fromEntries([
    'automatic-follow-up/', 'blog-and-videos/', 'book-a-demo/', 'business-card-scanner/', 'contact-us-2/', 'cookie-policy/',
    'enterprise-customer-success-onboarding-specialist/', 'iso27001-certified/', 'lead-enrichment/', 'privacy-policy/',
    'social-media-content-intern/', 'sustainability/', 'sync-leads-to-your-crm/', 'terms-of-use/', 'testimonials-2/',
    'two-way-exchange/', 'voice-to-text-notes/',
  ].map((p) => [p, 'assets/share/default.png'])),
  // 3.5 MB today: the same picture at 768 px.
  'how-robin-daniels-relationships-fuelled-his-rise/': 'wp-content/uploads/Event-image-RD-v2-768x768.png',
  'video-how-robin-daniels-relationships-fueled-his-rise/': 'wp-content/uploads/Event-image-RD-v2-768x768.png',
};

// Alt text by image file (any size variant of the same upload). '' = decorative.
export const ALT = {
  // On every page
  'Wordmark-Action-Green.png': 'Stinto',
  'cropped-Wordmark-Action-Green.png': 'Stinto',
  'ISO-27001-720x720.png': 'ISO 27001 certified',
  'Wordmark-Black-300x74.png': 'Stinto',
  // Home
  'ISO-27001-300x300.png': 'ISO 27001 certified',
  'apple-ios-app-store-seeklogo-300x300.png': 'Apple App Store',
  'google-play-store-seeklogo-269x300.png': 'Google Play',
  'producthunt_logo_icon_170828-1593870726-300x300.png': 'Product Hunt',
  'Download_on_the_App_Store_Badge.svg.png': 'Download Stinto on the App Store',
  'google-play-badge.png': 'Get Stinto on Google Play',
  // Platform and capture pages
  'Instant-capture.png': 'StintoTap NFC card tapped on a phone showing a Stinto digital business card',
  'Voice-to-text.png': '',
  'AUtomatic-follow-up.png': '',
  'CRM-sync-1.png': 'HubSpot, Salesforce, Pipedrive, Microsoft Dynamics 365, Zoho and Zapier logos around a cloud upload icon',
  'resume-genius-IESB4iFVuzA-unsplash-1440x960.jpg': 'Two professionals shaking hands across a desk after a meeting',
  'CleanShot-2024-05-17-at-16.19.12.gif': 'Portraits of team members, each with a Stinto badge',
  'CleanShot-2024-05-17-at-16.19.12-720x405.gif': 'Portraits of team members, each with a Stinto badge',
  'Be-the-one@3x-1440x1079.png': 'Colleagues laughing in a meeting around a laptop',
  'Record-and-audio@3x-1440x949.png': '',
  'Add-to-CRM-1.png': 'Contact details, profile and notes flowing into an Add to CRM button',
  'CleanShot-2026-03-26-at-10.36.47.gif': 'Stinto app on a phone showing a captured lead with notes and shared materials',
  'CleanShot-2024-05-16-at-14.13.44.gif': 'A contact in the Stinto app being added to the CRM with one tap',
  'CleanShot-2024-05-16-at-11.24.24.gif': 'A contact in the Stinto app being added to the CRM with one tap',
  'Some-and-themes@3x-1440x928.png': 'Stinto digital business card with colour themes and LinkedIn, X, Instagram and website links',
  'Company-dashboard-720x574.png': 'Stinto company dashboard listing contacts captured by the team',
  'Company-dashboard.png': 'Stinto company dashboard listing contacts captured by the team',
  'Marketing-material@3x-720x477.png': 'Company presentation, video and photo materials ready to attach to follow-ups',
  'CRM-options-ill-v2-1440x1440.png': 'Stinto connected to HubSpot, Salesforce, Zoho CRM, Microsoft Dynamics 365, SuperOffice, Pipedrive, ActiveCampaign, monday CRM and Copper',
  'evangeline-shaw-xRlI-L-kvrw-unsplash-1440x960.jpg': 'Attendees listening at a round table during a conference session',
  'lyubomyr-reverchuk-rtD_lcsN6_U-unsplash-1440x960.jpg': 'Sales team working together on laptops in an open office',
  'product-school-nOvIa_x_tfo-unsplash-1440x960.jpg': 'Crowd of attendees networking in a conference hall',
  'campaign-creators-e6n7uoEnYbA-unsplash-1440x960.jpg': 'Colleagues gathered around a laptop reviewing follow-ups',
  'vitaly-gariev-noekOi-Qt6w-unsplash-1440x810.jpg': 'Professional with headphones and coffee checking her phone outside a venue',
  'Flags-for-website@3x-1440x1412.png': 'Flags of Denmark, Germany, France, the United States, Italy and Spain',
  'Exchange-mail@3x-1080x1440.png': 'Follow-up email received by a new contact, showing the sender’s photo and contact details',
  'StintoTap-Standard-presentation.png': 'StintoTap Essence NFC business card',
  'StintoTap-Custom-branding-presentation-1.png': 'StintoTap Custom NFC business card with company branding',
  'StintoTap-Custom-wooden-card-presentation-1.png': 'StintoTap Wood NFC business card made of wood',
  // Small icons next to a heading that already says the same thing
  'My-Card.svg': '',
  'ai.png': '',
  'Cloud.svg': '',
  'People-meeting.svg': '',
  // Blog
  'business-review-logo.svg': 'Business Review',
  'Bridgiong-the-business-buyer-gap@3x-1440x810.png': 'Bridging the business buyer gap',
  'Bridgiong-the-business-buyer-gap@3x.png': 'Bridging the business buyer gap',
  // Customer stories
  'Color-logo-for-Website-Charlottehaven-300x300.png': 'Charlottehaven logo',
  'Color-logo-for-Website-Inniti-1-300x300.png': 'Inniti logo',
  'Color-logo-for-Website-Gorrissen-Federspiel-300x300.png': 'Gorrissen Federspiel logo',
  'Color-logo-for-Website-Buhlmann-300x300.png': 'Bühlmann Hotels logo',
  'Color-logo-for-Website-Buhlmann-1-e1777367162143-300x73.png': 'Bühlmann Hotels logo',
  'Color-logo-for-Website-RTT-300x300.png': 'RTT logo',
  'Color-logo-for-Website-Modern-Terminals-300x300.png': 'Modern Terminals logo',
  'Color-logos-for-website-Relai-300x300.png': 'Relai logo',
  'Color-logo-for-Website-Novonesis-300x300.png': 'Novonesis logo',
  'Color-logo-for-Website-Hoff-Copenhagen-300x300.png': 'Hoff Copenhagen logo',
  'Color-logo-for-Website-Warner-Bros-300x300.png': 'Warner Bros. logo',
  'Color-logo-for-Website-WeFleet-300x300.png': 'WeFleet logo',
  'ENYTER-ART-FAIR-LOGO-FOR-WEBSITE-300x300.png': 'Enter Art Fair logo',
  'Thomas-Lund-1-720x720.jpg': 'Thomas R. Lund, CEO of Inniti',
  'ktx3c6pnamvtpnjyusersf02d6219-845a-4acb-8b33-aa914b954fc6W1e46fe1c98e160c77bdceeb6f74b30ac2b0c0f959f7adc5dd19ded3e173cb920-720x720.jpg': 'Helle Salling Røber, Head of Sales at Bühlmann Hotels',
  '1779224976325.jpeg': 'Jonas Peng, Commercial Director at Charlottehaven',
};

// Footer: a new Platform column in place of the empty 7% spacer column.
export const FOOTER_PLATFORM = [
  ['Lead capture', 'lead-capture-tool-for-events-sales-teams/'],
  ['AI lead enrichment', 'lead-enrichment/'],
  ['CRM sync', 'sync-leads-to-your-crm/'],
  ['CRM integrations', 'crm-integrations/'],
  ['Pricing', 'plans/'],
  ['Book a demo', 'book-a-demo/'],
];
