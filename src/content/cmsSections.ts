export const cmsSections = [
  { key: 'header', label: 'Header', defaultVisible: true },
  { key: 'hero', label: 'Hero', defaultVisible: true },
  { key: 'redCan', label: 'Red Can', defaultVisible: true },
  { key: 'about', label: 'About', defaultVisible: true },
  { key: 'brandStory', label: 'Brand Story', defaultVisible: true },
  { key: 'products', label: 'Products', defaultVisible: true },
  { key: 'founders', label: 'Founders', defaultVisible: true },
  { key: 'philosophy', label: 'Philosophy', defaultVisible: true },
  { key: 'stats', label: 'Stats', defaultVisible: true },
  { key: 'brandValues', label: 'Brand Values', defaultVisible: true },
  { key: 'gallery', label: 'Gallery', defaultVisible: true },
  { key: 'testimonials', label: 'Testimonials', defaultVisible: true },
  { key: 'community', label: 'Community', defaultVisible: true },
  { key: 'brandPersonality', label: 'Brand Personality', defaultVisible: true },
  { key: 'cta', label: 'CTA', defaultVisible: true },
  { key: 'footer', label: 'Footer', defaultVisible: true },
] as const;

export type CmsSectionKey = (typeof cmsSections)[number]['key'];
