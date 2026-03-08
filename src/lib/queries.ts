export const SEO_FIELDS = `
  fragment SeoFields on PostTypeSEO {
    title
    metaDesc
    opengraphTitle
    opengraphDescription
    opengraphImage { sourceUrl }
    twitterTitle
    twitterDescription
    twitterImage { sourceUrl }
  }
`;

export const HERO_FIELDS = `
  fragment HeroFields on HeroFields {
    heroTitle
    heroSubtitle
    heroImage { node { sourceUrl altText } }
    heroBadge
    heroCta1Label
    heroCta1Href
    heroCta1Variant
    heroCta2Label
    heroCta2Href
    heroCta2Variant
  }
`;

export const FAQ_FIELDS = `
  fragment FaqFields on FaqFields {
    faq1Question
    faq1Answer
    faq2Question
    faq2Answer
    faq3Question
    faq3Answer
    faq4Question
    faq4Answer
    faq5Question
    faq5Answer
    faq6Question
    faq6Answer
  }
`;

export const CTA_FIELDS = `
  fragment CtaFields on CtaFields {
    ctaTitle
    ctaDescription
    ctaBg
    ctaButton1Label
    ctaButton1Href
    ctaButton1Variant
    ctaButton2Label
    ctaButton2Href
    ctaButton2Variant
  }
`;

export const PAGE_FIELDS = `
  ${SEO_FIELDS}
  ${HERO_FIELDS}
  ${FAQ_FIELDS}
  ${CTA_FIELDS}
  fragment PageFields on Page {
    title
    slug
    content
    featuredImage { node { sourceUrl altText } }
    seo { ...SeoFields }
    heroFields { ...HeroFields }
    faqFields { ...FaqFields }
    ctaFields { ...CtaFields }
  }
`;

export const GET_PAGE = `
  ${PAGE_FIELDS}
  query GetPage($slug: ID!) {
    page(id: $slug, idType: URI) {
      ...PageFields
    }
  }
`;

export const GET_ALL_PAGES = `
  ${PAGE_FIELDS}
  query GetAllPages {
    pages(first: 50) {
      nodes {
        ...PageFields
      }
    }
  }
`;

// ===== Blog Posts (native WP posts — no ACF) =====

export const POST_FIELDS = `
  ${SEO_FIELDS}
  fragment PostFields on Post {
    title
    slug
    date
    content(format: RENDERED)
    excerpt(format: RENDERED)
    seo { ...SeoFields }
    featuredImage { node { sourceUrl altText } }
    categories { nodes { name slug } }
    tags { nodes { name slug } }
    author { node { name } }
  }
`;

export const GET_POSTS = `
  ${POST_FIELDS}
  query GetPosts($first: Int = 20, $after: String) {
    posts(first: $first, after: $after) {
      nodes { ...PostFields }
      pageInfo { hasNextPage endCursor }
    }
  }
`;

export const GET_POST_BY_SLUG = `
  ${POST_FIELDS}
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      ...PostFields
    }
  }
`;

export const GET_POSTS_BY_CATEGORY = `
  ${POST_FIELDS}
  query GetPostsByCategory($slug: String!, $first: Int = 20) {
    posts(where: { categoryName: $slug }, first: $first) {
      nodes { ...PostFields }
    }
  }
`;
