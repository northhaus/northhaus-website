// Northhaus /links — EDIT CONTENT HERE, then run: node tools/build-links.mjs
// • Add/remove products, change `order`, or move `featured: true` to another product.
// • The featured product needs an `image` (srcset, width, height, alt) — the whole card updates from it.
// • `price: null` hides the price for that product.
export default {
  page: {
    title: 'Northhaus Links - Planners, Digital Products & Websites',
    description: 'Northhaus planners, digital products and the Site Plan, in one place. Digital tools. Thoughtful websites.',
    shareDescription: 'Northhaus planners, digital products and the Site Plan, in one place.',
    url: 'https://www.northhaus.io/links',
    ogImage: 'https://www.northhaus.io/uploads/og-home.jpg',
    ogImageAlt: 'Northhaus, UK web and brand studio',
    tagline: 'Digital tools. Thoughtful websites.',
    logo: { src: '/uploads/northhaus-logo-384.webp', width: 192, height: 48, alt: 'Northhaus' },
  },

  products: [
    { id: 'christmas', category: 'Planner', featured: true, order: 0,
      title: 'Christmas & New Year Planner', price: '£4.99',
      description: 'Gifts, budget, time off, Christmas dinner, shopping and New Year’s Eve in one planner that works offline. No account, no subscription.',
      url: 'https://northhaus.gumroad.com/l/cwzvyr',
      eyebrow: 'Seasonal pick', cta: 'View planner',
      image: {
        srcset: [
          { src: '/uploads/christmas-planner-640.webp', w: 640 },
          { src: '/uploads/christmas-planner-1120.webp', w: 1120 },
        ],
        width: 1120, height: 630,
        alt: 'Christmas & New Year Planner cover, showing the planner dashboard on a laptop',
      } },
    { id: 'wedding', category: 'Planner', order: 1, title: 'Wedding Planner', price: '£4.99',
      description: 'Suppliers, budget, guests, RSVPs and deposits in one place.',
      url: 'https://northhaus.gumroad.com/l/klhwa' },
    { id: 'budget', category: 'Planner', order: 2, title: 'Budget Tracker', price: '£4.99',
      description: 'Track monthly bills, debt and investments in one place.',
      url: 'https://northhaus.gumroad.com/l/lmykzn' },
    { id: 'freelancer', category: 'Bundle', order: 3, title: 'Freelancer Admin Kit', price: '£9.99',
      description: 'An invoice maker, client onboarding pack and tax tracker for UK freelancers.',
      url: 'https://northhaus.gumroad.com/l/uzflqx' },
    { id: 'coach', category: 'Tool', order: 4, title: 'Coach Corner', price: '£7.99',
      description: 'Client manager for martial arts coaches and personal trainers: fight plans, weight cuts and sparring notes.',
      url: 'https://northhaus.gumroad.com/l/zchman' },
    { id: 'fitphrase', category: 'Tool', order: 5, title: 'Fit Phrase', price: '£4.99',
      description: 'Turns words into workouts, with an exercise for every letter.',
      url: 'https://northhaus.gumroad.com/l/imzmre' },
    { id: 'divorce', category: 'Planner', order: 6, title: 'Divorce Organiser', price: null,
      description: 'Paperwork, finances, dates, contacts and costs in one private place.',
      url: 'https://northhaus.gumroad.com/l/ttohou' },
    { id: 'funeral', category: 'Planner', order: 7, title: 'Funeral Planner', price: null,
      description: 'Registering the death, arranging the funeral and finding the will, organised.',
      url: 'https://northhaus.gumroad.com/l/rawanc' },
    { id: 'audit', category: 'Audit', order: 8, title: 'Landing Page Audit + Redesign Starter', price: '£149',
      description: 'An expert-reviewed audit of your landing page, plus a new hero and copy pack.',
      url: 'https://northhaus.gumroad.com/l/xfoogo' },
  ],

  shop: { label: 'Browse all products', url: 'https://northhaus.gumroad.com/' },
  productsPage: { label: 'See our digital products page', url: 'https://www.northhaus.io/digital-products' },
  sitePlan: {
    eyebrow: 'Website service', title: 'Site Plan',
    description: 'Custom-coded websites. £0 upfront, then £39 a month. 12-month minimum.',
    detail: 'Up to five pages. Hosting, your domain, backups and up to 30 minutes of changes a month are included.',
    cta: 'Explore Site Plan', url: 'https://www.northhaus.io/site-plan' },
  site: { label: 'Visit Northhaus', url: 'https://www.northhaus.io/' },
  footer: '© 2026 Northhaus',
};
