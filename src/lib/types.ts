export interface WpImage {
  sourceUrl: string;
  altText: string;
}

export interface WpSeo {
  title: string;
  metaDesc: string;
  opengraphTitle: string;
  opengraphDescription: string;
  opengraphImage: { sourceUrl: string } | null;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: { sourceUrl: string } | null;
}

// Raw types from GraphQL (numbered fields, no repeaters)
export interface RawHeroFields {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: { node: WpImage } | null;
  heroBadge: string;
  heroCta1Label: string | null;
  heroCta1Href: string | null;
  heroCta1Variant: string | string[] | null;
  heroCta2Label: string | null;
  heroCta2Href: string | null;
  heroCta2Variant: string | string[] | null;
}

export interface RawFaqFields {
  faq1Question: string | null;
  faq1Answer: string | null;
  faq2Question: string | null;
  faq2Answer: string | null;
  faq3Question: string | null;
  faq3Answer: string | null;
  faq4Question: string | null;
  faq4Answer: string | null;
  faq5Question: string | null;
  faq5Answer: string | null;
  faq6Question: string | null;
  faq6Answer: string | null;
}

export interface RawCtaFields {
  ctaTitle: string;
  ctaDescription: string;
  ctaBg: string | string[];
  ctaButton1Label: string | null;
  ctaButton1Href: string | null;
  ctaButton1Variant: string | string[] | null;
  ctaButton2Label: string | null;
  ctaButton2Href: string | null;
  ctaButton2Variant: string | string[] | null;
}

// Transformed types (used by Astro pages)
export interface WpHero {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: { url: string } | null;
  heroBadge: string;
  heroCtas: { label: string; href: string; variant: string }[] | null;
}

export interface WpFaq {
  faqItems: { question: string; answer: string }[] | null;
}

export interface WpCta {
  ctaTitle: string;
  ctaDescription: string;
  ctaButtons: { label: string; href: string; variant: string }[] | null;
  ctaBg: 'white' | 'green' | 'gold';
}

// Raw page from GraphQL
export interface RawWpPage {
  title: string;
  slug: string;
  content: string;
  seo: WpSeo;
  heroFields: RawHeroFields;
  faqFields: RawFaqFields;
  ctaFields: RawCtaFields;
  featuredImage: { node: WpImage } | null;
}

// Transformed page (used by Astro pages)
export interface WpPage {
  title: string;
  slug: string;
  content: string;
  seo: WpSeo;
  heroFields: WpHero;
  faqFields: WpFaq;
  ctaFields: WpCta;
  featuredImage: { node: WpImage } | null;
}

// Blog post (native WP post type — no ACF needed)
export interface WpPost {
  title: string;
  slug: string;
  date: string;
  content: string;
  excerpt: string;
  seo: WpSeo;
  featuredImage: { node: WpImage } | null;
  categories: { nodes: { name: string; slug: string }[] };
  tags: { nodes: { name: string; slug: string }[] };
  author: { node: { name: string } };
}
