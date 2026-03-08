import { wpQuery } from './graphql';
import { GET_PAGE, GET_ALL_PAGES, GET_POSTS, GET_POST_BY_SLUG, GET_POSTS_BY_CATEGORY } from './queries';
import type { RawWpPage, RawHeroFields, RawFaqFields, RawCtaFields, WpPage, WpHero, WpFaq, WpCta, WpPost } from './types';

interface GetPageResponse {
  page: RawWpPage | null;
}

interface GetAllPagesResponse {
  pages: { nodes: RawWpPage[] };
}

// ACF Select fields return arrays in GraphQL — extract first value
function sel(v: string | string[] | null, fallback: string): string {
  if (Array.isArray(v)) return v[0] || fallback;
  return v || fallback;
}

// Convert empty strings to null so ?? fallbacks work in Astro pages
function emptyToNull(v: string | null | undefined): string | null {
  return v?.trim() ? v : null;
}

function cleanSeo(seo: RawWpPage['seo']): WpPage['seo'] {
  return {
    title: emptyToNull(seo.title) as string,
    metaDesc: emptyToNull(seo.metaDesc) as string,
    opengraphTitle: emptyToNull(seo.opengraphTitle) as string,
    opengraphDescription: emptyToNull(seo.opengraphDescription) as string,
    opengraphImage: seo.opengraphImage,
    twitterTitle: emptyToNull(seo.twitterTitle) as string,
    twitterDescription: emptyToNull(seo.twitterDescription) as string,
    twitterImage: seo.twitterImage,
  };
}

// Transform numbered CTA fields into array
function transformHeroCtas(raw: RawHeroFields): { label: string; href: string; variant: string }[] | null {
  const ctas: { label: string; href: string; variant: string }[] = [];
  if (raw.heroCta1Label && raw.heroCta1Href) {
    ctas.push({ label: raw.heroCta1Label, href: raw.heroCta1Href, variant: sel(raw.heroCta1Variant, 'primary') });
  }
  if (raw.heroCta2Label && raw.heroCta2Href) {
    ctas.push({ label: raw.heroCta2Label, href: raw.heroCta2Href, variant: sel(raw.heroCta2Variant, 'outline') });
  }
  return ctas.length > 0 ? ctas : null;
}

// Transform numbered FAQ fields into array
function transformFaqItems(raw: RawFaqFields): { question: string; answer: string }[] | null {
  const items: { question: string; answer: string }[] = [];
  for (let i = 1; i <= 6; i++) {
    const q = raw[`faq${i}Question` as keyof RawFaqFields] as string | null;
    const a = raw[`faq${i}Answer` as keyof RawFaqFields] as string | null;
    if (q && a) items.push({ question: q, answer: a });
  }
  return items.length > 0 ? items : null;
}

// Transform numbered CTA button fields into array
function transformCtaButtons(raw: RawCtaFields): { label: string; href: string; variant: string }[] | null {
  const btns: { label: string; href: string; variant: string }[] = [];
  if (raw.ctaButton1Label && raw.ctaButton1Href) {
    btns.push({ label: raw.ctaButton1Label, href: raw.ctaButton1Href, variant: sel(raw.ctaButton1Variant, 'primary') });
  }
  if (raw.ctaButton2Label && raw.ctaButton2Href) {
    btns.push({ label: raw.ctaButton2Label, href: raw.ctaButton2Href, variant: sel(raw.ctaButton2Variant, 'outline') });
  }
  return btns.length > 0 ? btns : null;
}

// Transform raw GraphQL page into the shape Astro pages expect
function transformPage(raw: RawWpPage): WpPage {
  const heroFields: WpHero = {
    heroTitle: emptyToNull(raw.heroFields.heroTitle) as string,
    heroSubtitle: emptyToNull(raw.heroFields.heroSubtitle) as string,
    heroImage: raw.heroFields.heroImage?.node
      ? { url: raw.heroFields.heroImage.node.sourceUrl }
      : null,
    heroBadge: emptyToNull(raw.heroFields.heroBadge) as string,
    heroCtas: transformHeroCtas(raw.heroFields),
  };

  const faqFields: WpFaq = {
    faqItems: transformFaqItems(raw.faqFields),
  };

  const ctaFields: WpCta = {
    ctaTitle: emptyToNull(raw.ctaFields.ctaTitle) as string,
    ctaDescription: emptyToNull(raw.ctaFields.ctaDescription) as string,
    ctaButtons: transformCtaButtons(raw.ctaFields),
    ctaBg: sel(raw.ctaFields.ctaBg, 'white') as WpCta['ctaBg'],
  };

  return {
    title: raw.title,
    slug: raw.slug,
    content: raw.content,
    seo: cleanSeo(raw.seo),
    heroFields,
    faqFields,
    ctaFields,
    featuredImage: raw.featuredImage,
  };
}

export async function getPage(slug: string): Promise<WpPage> {
  const data = await wpQuery<GetPageResponse>(GET_PAGE, { slug });

  if (!data.page) {
    throw new Error(`Page not found: ${slug}`);
  }

  return transformPage(data.page);
}

export async function getAllPages(): Promise<WpPage[]> {
  const data = await wpQuery<GetAllPagesResponse>(GET_ALL_PAGES);
  return data.pages.nodes.map(transformPage);
}

// ===== Blog Posts =====

interface GetPostsResponse {
  posts: { nodes: WpPost[]; pageInfo: { hasNextPage: boolean; endCursor: string } };
}

interface GetPostBySlugResponse {
  post: WpPost | null;
}

export async function getPosts(first = 20): Promise<WpPost[]> {
  const data = await wpQuery<GetPostsResponse>(GET_POSTS, { first });
  return data.posts.nodes;
}

export async function getPostBySlug(slug: string): Promise<WpPost> {
  const data = await wpQuery<GetPostBySlugResponse>(GET_POST_BY_SLUG, { slug });
  if (!data.post) throw new Error(`Post not found: ${slug}`);
  return data.post;
}

export async function getPostsByCategory(categorySlug: string, first = 20): Promise<WpPost[]> {
  const data = await wpQuery<GetPostsResponse>(GET_POSTS_BY_CATEGORY, { slug: categorySlug, first });
  return data.posts.nodes;
}
