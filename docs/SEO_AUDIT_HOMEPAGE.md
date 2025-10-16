# Audit SEO – Page d’accueil (apps/web)

Dernière mise à jour: 2025-09-04

## Synthèse
- Santé SEO générale: Bonne base technique (Next.js, metadata, robots, sitemap) mais i18n côté client seulement. Les moteurs indexeront surtout la version EN, et les signaux multilingues (hreflang/html[lang]) manquent.
- Priorités: 1) Internationalisation côté serveur + hreflang, 2) Métadonnées locales (EN/FR) + og:image/twitter:image, 3) Schema.org additionnels (WebSite, Sitelinks Search, Product/Offer), 4) Optimisation performance LCP/CLS, 5) Accessibilité/maillage interne.

---

## Contexte et portée
- Framework: Next.js (app router) – dossier: `apps/web`
- Page d’accueil: `apps/web/app/page.tsx` rendue via `RootLayout` `apps/web/app/layout.tsx`
- i18n disponible: EN et FR via contexte client (`LanguageContext`) + fichiers `apps/web/locales/en.json`, `apps/web/locales/fr.json`
- Fichiers SEO clés:
  - Metadata: `apps/web/app/layout.tsx`
  - Sitemap: `apps/web/app/sitemap.ts`
  - Robots: `apps/web/public/robots.txt`
  - Manifest: `apps/web/app/manifest.webmanifest`

---

## Constats détaillés

### 1) Balises meta et Open Graph/Twitter
- Title par défaut: « VMCloud – Premium Cloud Infrastructure » (OK, clair)
- Description (EN): présente et pertinente (OK), mais non localisée.
- Keywords: présents mais non essentiels pour Google (ne nuisent pas; à entretenir si utiles pour autres moteurs).
- Open Graph: type/siteName/url/title/description OK, mais pas d’image (`og:image`) ni variantes locale (`og:locale:alternate`).
- Twitter: `summary_large_image` OK, mais pas d’image (`twitter:image`).
- Canonical: présent ("/") pour la home (OK).
- Robots meta: `index, follow` (OK). Googlebot directives (OK).

Risques/Opportunités:
- Sans image sociale, le partage (OG/Twitter) sera peu engageant. Ajouter une image 1200x630 (ou 1200x628) optimisée.
- Métadonnées uniquement EN: FR non couverte => incohérence par rapport au contenu traduit côté client.

### 2) Internationalisation (i18n) et hreflang
- Détection/choix de langue côté client via `LanguageContext` et localStorage (JS requis).
- `html lang="en"` figé dans `RootLayout` (pas dynamique).
- Pas de `alternates.languages` (hreflang) dans les metadata.

Risques/Opportunités:
- Les moteurs indexent surtout la version EN; la version FR rendue côté client peut ne pas être bien prise en compte (JS et timing).
- Absence de hreflang peut causer cannibalisation ou mauvaise géolocalisation.

### 3) Sitemap et robots
- `robots.txt`: permissif, pages prioritaires listées, sections privées désindexées (OK). Note: `Crawl-delay` ignoré par Google, OK pour d’autres moteurs.
- `sitemap.ts`: routes principales (OK). Manque les variantes de langue (si i18n serveur adopté). Inclut `/terms` et `/legal/terms` (risque de duplication si les deux existent).

### 4) Données structurées (Schema.org)
- Présent: `Organization` (OK: name, url, logo, sameAs). Les profils `sameAs` semblent génériques; vérifier qu’ils existent.
- Manquants:
  - `WebSite` + `PotentialAction` (Sitelinks Search Box)
  - `Product`/`Service` + `Offer` pour plans/pricing (au minimum sur page Produit/Tarifs)
  - `BreadcrumbList` (si navigation hiérarchique)

### 5) Contenu on-page et structure
- H1: présent dans `HeroSection` (OK). H2/H3 structurés dans Features/Pricing/CTA (OK globalement).
- Liens/CTA: ancrages descriptifs OK, mais plusieurs CTAs génériques ("Get Started", "View Demo"). Possibilité d’enrichir avec contexte (ex: « Get Started with VPS »).
- Images: peu d’images, beaucoup d’animations CSS; penser à `alt` si images réelles ajoutées.

### 6) Performance (impact SEO)
- Font: `Inter` via next/font (OK). Penser à `display: swap` (géré par next/font).
- Animations nombreuses: évaluer impact LCP/CLS. Éviter gros paint-blobs, retarder effets non critiques.
- Images sociales à venir: servir en `.webp`/`.png` optimisé; héberger sous `public/og/`.
- Vérifier: lazy-loading des sections non critiques, réduction du JS côté client (i18n SSR réduira JS).

### 7) Accessibilité (indirect SEO)
- Contrastes OK (thème sombre). Vérifier focus states, aria-labels pour menus/CTA, et cohérence des rôles nav/landmark. Le scroll indicator et micro-interactions doivent rester non bloquants clavier.

---

## Recommandations priorisées

1) Internationaliser côté serveur (Next.js i18n)
- Ajouter `i18n` dans `next.config.js`:
  - `i18n: { locales: ['en','fr'], defaultLocale: 'en' }`
- Servir `/` → EN et `/fr` → FR (ou détecter langue et rediriger 302 sur première visite).
- Générer metadata localisées par page via `generateMetadata` ou metadata segmentées.
- Mettre `<html lang={locale}>` dans `RootLayout` (serveur), pas côté client.
- Ajouter `alternates.languages` (hreflang) EN/FR avec URLs canoniques correctes.

2) Métadonnées sociales complètes
- Ajouter `openGraph.images` avec une image 1200x630 (poids < 300 KB), alt texte descriptif.
- Ajouter `twitter:image` (même visuel) et `twitter:site`/`creator` si comptes existants.
- Définir `openGraph.locale` selon la page (en_US / fr_FR) et `openGraph.alternateLocale`.

3) Données structurées supplémentaires
- `WebSite` + `PotentialAction` (SearchAction) sur la home.
- `Product`/`Service` + `Offer` sur Tarifs/Produits (prix, devise, disponibilité, SLA, etc.).
- Optionnel: `BreadcrumbList` pour pages profondes, `FAQ` si vous avez des FAQs.

4) Sitemap et robots
- Étendre `sitemap.ts` pour inclure variantes EN/FR une fois i18n activé.
- Éviter doublons `/terms` vs `/legal/terms` (choisir un canonique).
- Garder `robots.txt` simple; `Crawl-delay` facultatif.

5) Performance
- Auditer LCP/CLS (Lighthouse). Retarder animations non critiques; éviter lourdes ombres/flou sur viewport initial.
- Préparer og-image optimisée; vérifier tailles des bundles et suspense pour sections non critiques.

6) Accessibilité et UX
- Enrichir libellés CTAs avec contexte; vérifier tab order et focus.
- Vérifier `aria-expanded`/`aria-controls` pour le burger menu mobile.

---

## Propositions de métadonnées localisées

### EN (homepage)
- Title: VMCloud – Premium Cloud Infrastructure (VPS, GPU, Hosting)
- Description: Premium European cloud infrastructure: high‑performance VPS, AI/ML GPU computing, and professional web hosting with 24/7 support and 99.9% SLA.
- Keywords (optionnels): vps hosting, cloud server, gpu cloud, ai gpu, web hosting, european cloud, amd epyc, nvme, dedicated server, 99.9% sla
- OG/Twitter: image `https://<domain>/og/home-en.png`, alt: “VMCloud – Premium Cloud Infrastructure (VPS • GPU • Hosting)”

- Title: VMCloud – Infrastructure Cloud Premium (VPS, GPU, Hébergement)
- Description: Infrastructure cloud européenne premium : VPS haute performance, calcul GPU pour IA/ML et hébergement web professionnel avec support 24/7 et SLA 99,9 %.
- Mots‑clés (optionnels): hébergement vps, serveur cloud, gpu cloud, gpu ia, hébergement web, cloud européen, amd epyc, nvme, serveur dédié, sla 99,9
- OG/Twitter: image `https://<domain>/og/home-fr.png`, alt: “VMCloud – Infrastructure Cloud Premium (VPS • GPU • Hébergement)”

---

## Recherches de mots‑clés (EN/FR)

### EN – Core/Head Terms
- vps hosting, cloud server, virtual private server
- gpu cloud, ai gpu, machine learning gpu, nvidia a100 cloud, rtx 4090 server
- web hosting, managed hosting, european cloud, dedicated server

### EN – Long‑tail/Intent
- best european vps hosting for developers
- nvme vps amd epyc 99.9% sla
- rent nvidia a100 for ai training
- rtx 4090 cloud server hourly pricing
- wordpress optimized hosting with free ssl

### FR – Core/Head Terms
- hébergement vps, serveur cloud, vps nvme
- cloud gpu, gpu ia, serveur rtx 4090, a100 cloud
- hébergement web, hébergement managé, cloud européen, serveur dédié

### FR – Long‑tail/Intent
- meilleur hébergement vps en europe pour développeurs
- vps amd epyc nvme sla 99,9 %
- louer gpu nvidia a100 pour entraînement ia
- serveur rtx 4090 cloud facturation horaire
- hébergement wordpress optimisé ssl gratuit

### Branded
- vmcloud, hackboot cloud

---

## Maillage interne (suggestions)
- Home → Produits (VPS, GPU, Hébergement) avec ancres descriptives.
- Home → Tarifs (profitez des signaux commerciaux + schema Offer).
- Home → Support/Docs (confiance/qualité).
- Footer: liens légaux + sitemap + pages de catégories produits.

---

## Exemples d’implémentation (proposés)

1) next.config.js (i18n)
```js
// apps/web/next.config.js
const nextConfig = {
  i18n: {
    locales: ['en', 'fr'],
    defaultLocale: 'en',
  },
  // ...
};
module.exports = nextConfig;
```

2) RootLayout – lang dynamique + alternates
```tsx
// apps/web/app/layout.tsx (extrait)
export const generateMetadata = ({ params }) => {
  const locale = params?.locale ?? 'en';
  const isFR = locale === 'fr';
  return {
    title: {
      default: isFR
        ? 'VMCloud – Infrastructure Cloud Premium'
        : 'VMCloud – Premium Cloud Infrastructure',
      template: '%s | VMCloud',
    },
    description: isFR
      ? 'Infrastructure cloud européenne premium : VPS haute performance, GPU IA/ML…'
      : 'Premium European cloud infrastructure: high‑performance VPS, AI/ML GPU…',
    alternates: {
      canonical: locale === 'fr' ? '/fr' : '/',
      languages: {
        'en-US': 'https://<domain>/',
        'fr-FR': 'https://<domain>/fr',
      },
    },
    openGraph: {
      locale: isFR ? 'fr_FR' : 'en_US',
      alternateLocale: isFR ? ['en_US'] : ['fr_FR'],
      images: [
        {
          url: isFR ? '/og/home-fr.png' : '/og/home-en.png',
          width: 1200,
          height: 630,
          alt: isFR
            ? 'VMCloud – Infrastructure Cloud Premium (VPS • GPU • Hébergement)'
            : 'VMCloud – Premium Cloud Infrastructure (VPS • GPU • Hosting)'
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      images: [isFR ? '/og/home-fr.png' : '/og/home-en.png'],
    },
  };
};

export default function RootLayout({ children }) {
  const locale = 'en'; // dériver du segment/params (app router i18n)
  return (
    <html lang={locale}>
      <body>…</body>
    </html>
  );
}
```

3) Schema.org supplémentaires (home)
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "VMCloud",
  "url": "https://<domain>",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://<domain>/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
</script>
```

---

## Checklist d’implémentation
- [ ] Activer i18n serveur (Next.js) + routes `/` et `/fr`
- [ ] Rendre `<html lang>` dynamique
- [ ] Ajouter `alternates.languages` (hreflang EN/FR)
- [ ] Localiser title/description/OG/Twitter par langue
- [ ] Ajouter `og:image` et `twitter:image` (EN/FR)
- [ ] Ajouter `WebSite` + `SearchAction`; prévoir `Product/Offer` sur Tarifs/Produits
- [ ] Étendre sitemap pour variantes EN/FR
- [ ] Vérifier robots.txt (supprimer doublons, conserver simple)
- [ ] Auditer LCP/CLS (Lighthouse) et ajuster animations
- [ ] Améliorer libellés CTA (plus contextuels)

---

## Points à valider avec vous
- Domaine final (remplacer `vmcloud.com` / `<domain>`)
- Visuels OG (fournir sources ou les générer dynamiquement)
- Stratégie i18n: sous-dossiers (`/fr`) vs domaine fr (futur), redirection auto vs sélecteur manuel
- Comptes sociaux réels pour `sameAs` et Twitter

---

## Conclusion
La base SEO est solide côté Next.js (metadata, robots, sitemap). La principale faiblesse concerne l’internationalisation: actuellement client‑side, elle limite l’indexation correcte de la version FR et l’exposition des signaux hreflang/lang. En corrigeant i18n côté serveur et en complétant les métadonnées sociales et les schémas, la home sera prête pour un référencement multilingue propre et une meilleure prévisualisation sociale.

