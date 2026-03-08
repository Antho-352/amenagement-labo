# amenagement-labo.fr — Projet Astro 5 + Tailwind 4

## Stack

- **Astro 5.x** — SSG, `astro.config.mjs` : site URL + `@astrojs/sitemap` + `@tailwindcss/vite`
- **Tailwind CSS 4.x** — config CSS-first dans `src/styles/global.css`
- **Google Fonts** — Cormorant Garamond (heading) + Inter (body), chargées dans BaseLayout
- **Images** — URLs Pexels, pas de fichiers locaux
- **WordPress headless** — prévu via WP GraphQL sur `wp.amenagement-labo.fr` (pas encore connecté)

## Structure du projet

```
src/
├── layouts/BaseLayout.astro     # head, nav (Header), footer (Footer), MobileMenu, ScrollReveal
├── components/                  # 13 composants réutilisables
├── pages/                       # 10 pages .astro
├── styles/global.css            # Tailwind 4 @theme + custom CSS
└── lib/graphql.ts               # Client WP GraphQL (à créer)
```

## Couleurs Tailwind 4

| Token | Valeur | Usage |
|-------|--------|-------|
| `primary` | `#1E4D3A` | Vert foncé — titres, backgrounds, CTA |
| `secondary` | `#C9A96E` | Or — accents, badges, séparateurs |
| `bg-alt` | `#FAFAF8` | Fond alternatif sections |
| `text-dark` | `#171717` | Texte courant |

## Composants et leurs props

| Composant | Props | Notes |
|-----------|-------|-------|
| `BaseLayout` | title, description, keywords?, ogTitle?, ogDescription?, ogImage?, twitterTitle?, twitterDescription?, twitterImage?, canonical?, schema? | Wraps tout. `<slot />` pour contenu page |
| `Hero` | title (supporte `set:html`), subtitle?, bgImage, bgAlt?, ctas?[], overlay?, badge?, height? | `height` défaut `h-[90vh]`, utiliser `h-screen` pour hero pleine page |
| `CtaBanner` | title, description?, ctas?[], bg? (`white`/`green`/`gold`) | Bandeau CTA en fin de page |
| `FaqAccordion` | items: {question, answer}[], title? | FAQ avec accordéon JS |
| `CardGrid` | cols? (2/3/4), gap? | Grille responsive |
| `Card` | icon?, title, description, link?, variant? | Carte dans CardGrid |
| `SectorGrid` | sectors: {name, image, description}[] | Grille des secteurs |
| `SpecTable` | headers[], rows[][] | Tableau de spécifications |
| `ContactForm` | — | Formulaire contact complet |
| `LabSimulator` | — | Simulateur labo (index hero) |

## Pages (10)

index, conception-laboratoires, installation-equipements-techniques, revetements-finitions,
consommables-equipements, normes-reglementations, secteurs-activite, projets-realisations,
conseils-actualites, contact-devis

## Navigation (Header.astro)

Les routes sont des clean URLs sans `.html` :
`/`, `/conception-laboratoires`, `/installation-equipements-techniques`, `/revetements-finitions`,
`/consommables-equipements`, `/normes-reglementations`, `/secteurs-activite`,
`/projets-realisations`, `/conseils-actualites`, `/contact-devis`

---

# Workflow de conversion HTML → Astro (pour futurs projets)

## Principes d'efficacité

1. **Ne pas lire le nav/footer du HTML source** — ils sont identiques sur toutes les pages (~300 lignes chacun), gérés par BaseLayout
2. **Lire une seule page .astro de référence** (ex: `normes-reglementations.astro`) pour le pattern, puis convertir toutes les autres sans relire la référence
3. **Convertir les pages directement** — ne PAS utiliser d'agents background, écrire chaque page dans le contexte principal
4. **Traiter les pages par batch** — lire 3-4 HTML sources en parallèle, puis écrire les .astro correspondantes

## Pattern de conversion d'une page

### Frontmatter (entre les `---`)

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
import FaqAccordion from '../components/FaqAccordion.astro';
import CtaBanner from '../components/CtaBanner.astro';

const schema = [
  { "@context": "https://schema.org", "@type": "Organization", "name": "SITE_NAME", "url": "https://SITE_URL", "logo": "LOGO_URL" },
  { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://SITE_URL" },
    { "@type": "ListItem", "position": 2, "name": "PAGE_TITLE", "item": "https://SITE_URL/PAGE_SLUG" }
  ]}
];

const faqItems = [
  { question: "...", answer: "..." },
];
---
```

### Contenu (après le `---`)

```astro
<BaseLayout title="..." description="..." keywords="..." ogTitle="..." schema={schema}>
  <Hero title="Titre <span class='text-secondary italic'>accent</span>" subtitle="..." bgImage="..." badge="..." height="h-screen" ctas={[
    { label: 'CTA primaire', href: '/contact-devis' },
    { label: 'CTA secondaire', href: '/page', variant: 'outline' },
  ]} />

  <!-- Sections du contenu — copier/adapter le HTML entre nav et footer -->

  <FaqAccordion items={faqItems} />
  <CtaBanner title="..." description="..." ctas={[...]} bg="gold" />
</BaseLayout>

<!-- Scripts page-specific APRÈS le </BaseLayout> -->
<script>
  // JS inline converti : onclick="" → data-* + addEventListener
</script>
```

## Règles de conversion

| HTML source | Astro |
|-------------|-------|
| `<nav>...</nav>` + `<footer>...</footer>` | **SUPPRIMER** (géré par BaseLayout) |
| `style="color: #1E4D3A"` ou `class="text-[#1E4D3A]"` | `class="text-primary"` |
| `style="color: #C9A96E"` ou `class="text-[#C9A96E]"` | `class="text-secondary"` |
| `bg-[#1E4D3A]` | `bg-primary` |
| `bg-[#C9A96E]` | `bg-secondary` |
| `bg-[#FAFAF8]` | `bg-bg-alt` |
| `font-serif` (Cormorant) | `font-heading` |
| `font-sans` (Inter) | `font-body` (ou rien, c'est le défaut) |
| `href="page.html"` | `href="/page-slug"` |
| `href="revêtements-finitions.html"` | `href="/revetements-finitions"` (pas d'accents dans URLs) |
| `onclick="fn()"` | `data-action="fn"` + `addEventListener` dans `<script>` |
| `http://amenagement-labo.fr` | `https://amenagement-labo.fr` (corriger http→https) |

## Séquence recommandée pour un nouveau site

### Phase 1 — Setup (~5 min)
```bash
npm create astro@latest SITE_NAME -- --template minimal
cd SITE_NAME
npx astro add tailwind sitemap
```
Configurer `astro.config.mjs`, créer `src/styles/global.css` avec `@theme`.

### Phase 2 — Layout + composants structurels
Créer BaseLayout, Header, Footer, MobileMenu, ScrollReveal.
Copier la nav du HTML source une seule fois → Header.astro.

### Phase 3 — Composants réutilisables
Identifier les patterns qui se répètent sur 3+ pages → en faire des composants.
Patterns typiques : Hero, CardGrid/Card, CtaBanner, FaqAccordion, SpecTable.

### Phase 4 — Pages (le plus gros)
- Lire le HTML source de chaque page (IGNORER les ~300 premières lignes de nav et les ~100 dernières de footer)
- Extraire : meta SEO, contenu entre nav et footer, scripts inline
- Écrire le .astro en utilisant les composants

### Phase 5 — Build & vérification
```bash
npm run build  # Doit passer sans erreur
npm run preview  # Vérifier en local
```

## Commandes

```bash
npm run dev      # Dev server localhost:4321
npm run build    # Build statique → dist/
npm run preview  # Preview du build
```
