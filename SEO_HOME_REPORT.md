# Rapport SEO — Page d’accueil (FR/EN)

Ce document audite la page d’accueil multilingue (FR/EN) de VMCloud (apps/web) et propose des recommandations pour un SEO « quasi‑parfait » visant le haut des SERP.

## Synthèse

- Base SEO solide: i18n propre, `html lang`, `hreflang`, `canonical`, JSON‑LD, titres uniques.
- Points bloquants: images Open Graph/Twitter manquantes, icônes absentes, sitemap inexistant, quelques redirections et liens non localisés.
- Priorités: corriger OG/Twitter, favicon/manifest, sitemap + hreflang, liens localisés, calibrage titles/descriptions.

## Points Forts

- Internationalisation soignée: `/fr` et `/en`, `html lang={locale}`, `alternates.languages` avec `x-default`.
- Canonicals par langue (`/{locale}`), structure sémantique claire (H1/H2/H3), maillage vers produits/tarifs/légal.
- Données structurées riches: `Organization`, `WebSite`, `WebPage`, `BreadcrumbList`, `Service` (FR/EN), usage de `@id`.
- Robots ouverts à l’indexation (pas de blocage accidentel).

## Problèmes Bloquants

- Open Graph/Twitter:
  - Références inexistantes: `openGraph.images: '/og/home-en'` et `'/og/home-fr'` sans route ni fichier; dans `seo-config.json`, images pointent vers `/images/og/...` et `/images/twitter/...` mais les fichiers ne sont pas présents dans `public`.
  - Impact: previews sociales cassées → CTR réduit, distribution sociale limitée.
- Icônes/Logos:
  - `icon.svg` et `logo.png` référencés mais absents de `apps/web/public/` → favicon/Touch icon brisés.
- Sitemap:
  - `vercel.json` réécrit `/sitemap.xml` vers `/api/sitemap`, mais aucune route implémentée → 404 probable, couverture amoindrie.
- Redirections i18n:
  - `/` redirige vers `/{locale}` via page + middleware (307 temporaire). Préférer 308 ou servir un vrai `x-default`.
- Liens internes non localisés:
  - Plusieurs `Link href="/pricing"` et autres, qui redirigent ensuite vers `/{locale}`. Préférer des liens préfixés ou `LocalizedLink`.
- Meta `keywords`:
  - Présents mais ignorés par Google; éviter la sur‑optimisation (inutile et potentiellement négatif).

## Recommandations Prioritaires (FR & EN)

- Open Graph/Twitter:
  - Créer des images 1200×630: `/public/images/og/home-fr.jpg`, `/public/images/og/home-en.jpg` et `/public/images/twitter/home-fr.jpg`, `/public/images/twitter/home-en.jpg`; ou implémenter `opengraph-image.tsx` / `twitter-image.tsx` dans `app/[locale]/` (génération dynamique).
  - Harmoniser les chemins entre `layout.tsx` et `seo-config.json` (choisir statique OU dynamique, pas les deux).
- Favicons/Manifest:
  - Ajouter `/public/icon.svg`, `/public/favicon.ico`, et une `manifest.webmanifest` (nom, couleurs, icônes multiples). Conserver `themeColor`.
- Sitemap + Hreflang:
  - Implémenter `/app/sitemap.ts` (Next) listant `/{locale}` et intégrer `xhtml:link` hreflang entre `/fr` et `/en`. Soumettre dans GSC/Bing.
- Redirections i18n:
  - Remplacer le 307 par 308 pour `/` → `/fr` (FR par défaut), ou servir un contenu `x-default` à `/` si nécessaire.
- Liens internes localisés:
  - Utiliser le composant `LocalizedLink` dans le Header/Footer/Nav pour limiter les 3xx, clarifier le maillage et renforcer le signal hreflang.
- Titres/Descriptions calibrés (SERP‑friendly):
  - FR Title (~55–60): « VMCloud — Hébergement VPS, Cloud GPU & Web en France »
  - FR Description (~150–160): « VPS NVMe, serveurs GPU pour IA/ML et hébergement web managé. Datacenters en France, support 24/7, SLA 99,99 %. Essai gratuit 30 jours. »
  - EN Title (~55–60): « VMCloud — VPS, GPU Cloud & Web Hosting in Europe »
  - EN Description (~150–160): « High‑performance NVMe VPS, GPU servers for AI/ML, and managed web hosting. European datacenters, 24/7 support, 99.99% SLA. 30‑day free trial. »
- Données structurées (nettoyage):
  - Éviter les doublons `Organization`: conserver une seule déclaration (layout) avec `@id: https://vmcl.fr/#organization`, et référencer ce `@id` depuis la page.
  - Ajouter un bloc `FAQPage` (3–5 Q/R ciblées VPS/GPU/Hébergement) pour rich snippets.
- Performance/CWV:
  - LCP: conserver un hero léger; précharger la police si besoin (next/font OK).
  - CLS: surveiller les animations; s’assurer de tailles réservées pour images/embeds.
  - JS: auditer Lighthouse (mobile) et viser >90.
- Contenu & Intentions:
  - FR: intégrer naturellement « hébergement VPS », « serveur GPU », « hébergement web », « France », « NVMe », « AMD EPYC », « SLA 99,99 % » dans H1/intro/H2/CTA.
  - EN: « VPS hosting », « GPU servers », « managed web hosting », « European datacenters », « NVMe VPS », « 99.99% SLA ».
  - Ajouter un bloc « Confiance » (certifs ISO, RGPD, Tier, SLA) + logos clients/partenaires (E‑E‑A‑T).

## Ciblage Mots‑clés (exemples)

- FR primaire: « hébergement VPS », « serveur GPU », « hébergement web », « cloud France », « VPS NVMe », « AMD EPYC », « SLA 99,99 % ».
- EN primaire: « VPS hosting », « GPU servers », « managed web hosting », « European cloud », « NVMe VPS », « 99.99% SLA ».
- Emplacement: H1 + premier paragraphe, H2 et CTA; éviter répétitions artificielles.

## Quick Wins (1–2 jours)

1) Créer et référencer les images OG/Twitter valides (EN/FR).
2) Ajouter `icon.svg` / `favicon.ico` / `manifest.webmanifest`.
3) Implémenter `sitemap.ts` avec hreflang et soumettre GSC/Bing.
4) Remplacer les liens absolus par `LocalizedLink` dans Header/Footer.
5) Ajuster Title/Description selon les versions proposées ci‑dessus.

## Étapes Suivantes (1–2 semaines)

- Ajouter un bloc FAQ (EN/FR) et « Trust signals » (certifs, SLA, clients).
- Créer des pages d’atterrissage dédiées pour VPS/GPU/Web avec comparatifs et schémas `Service`/`Product`.
- Obtenir des backlinks ciblés (annuaires d’hébergement FR/EN, blogs dev, comparateurs VPS).
- Auditer et améliorer Lighthouse mobile si score <90 (taille JS, images, cache).

## Vérifications à Faire (checklist)

- [ ] `/og/home-en` et `/og/home-fr` OU `/public/images/og/*` et `/public/images/twitter/*` présents, 200, 1200×630.
- [ ] `/public/icon.svg`, `/public/logo.png`, `/public/favicon.ico`, `manifest.webmanifest` existent et sont référencés.
- [ ] `/sitemap.xml` retourne 200, inclut `xhtml:link` hreflang, URLs canoniques `/{locale}`.
- [ ] `/` → `/{locale}` renvoie 308 (pas 307/302) si redirection conservée.
- [ ] `LocalizedLink` utilisé pour les liens internes afin d’éviter les redirections i18n.
- [ ] GSC: propriétés (domaine/https) ajoutées, sitemap soumis, couverture OK, hreflang sans erreur.

---

### Notes techniques (constat code)

- `apps/web/app/[locale]/layout.tsx` et `page.tsx`: i18n, metadata, JSON‑LD OK mais chemins OG/Twitter à corriger.
- `apps/web/public/robots.txt`: OK, mais dépend d’un sitemap fonctionnel.
- `apps/web/vercel.json`: réécriture `/sitemap.xml` → `/api/sitemap` sans implémentation; préférer `app/sitemap.ts`.
- `apps/web/components/layout/Header|Footer`: plusieurs liens non préfixés locale; utilisez `LocalizedLink`.
- `apps/web/app/page.tsx` + `middleware.ts`: redirection i18n; envisager 308 pour stabiliser les signaux.

Fin du rapport.

