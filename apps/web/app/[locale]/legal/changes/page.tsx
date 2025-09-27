
// /workspaces/website/apps/web/app/[locale]/legal/changes/page.tsx
// Description: Server entrypoint for changes policy page with metadata & client rendering
// Last modified: 2025-09-18

import type { Metadata } from 'next';
import LegalChangesPageClient from './LegalChangesPageClient';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale as 'en' | 'fr';
  const isEN = locale === 'en';

  return {
    title: isEN
      ? 'Service Changes & Deprecations Policy | VMCloud'
      : 'Politique de changements & dépréciations | VMCloud',
    description: isEN
      ? 'How VMCloud communicates product changes, manages feature deprecations and supports migrations with generous notice for sovereign workloads.'
      : 'Comment VMCloud annonce les changements produits, gère les dépréciations de fonctionnalités et accompagne les migrations avec un préavis généreux.',
    keywords: isEN
      ? 'VMCloud change policy, deprecation window, migration support, roadmap transparency'
      : 'politique de changement VMCloud, fenêtre de dépréciation, accompagnement migration, transparence roadmap',
    openGraph: {
      title: isEN
        ? 'VMCloud Changes & Deprecations Policy'
        : 'Politique VMCloud de changements & dépréciations',
      description: isEN
        ? 'Discover how we maintain transparency on product evolution, with migration support and SLA-aligned notice periods.'
        : 'Découvrez comment nous assurons une transparence totale sur l\'évolution des produits, avec accompagnement migration et délais alignés sur le SLA.',
      type: 'article',
      locale: isEN ? 'en_US' : 'fr_FR',
      url: `https://vmcl.fr/${locale}/legal/changes`,
      images: [
        {
          url: `/${locale}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: isEN
            ? 'VMCloud change management policy'
            : 'Politique de gestion des changements VMCloud',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: isEN
        ? 'VMCloud Change & Deprecation Policy'
        : 'Politique de changement & dépréciation VMCloud',
      description: isEN
        ? 'We announce product evolutions early and guide migrations for sovereign cloud workloads.'
        : 'Nous annonçons les évolutions produit en amont et guidons les migrations pour vos workloads souverains.',
      images: [`/${locale}/twitter-image`],
    },
    alternates: {
      canonical: `/${locale}/legal/changes`,
      languages: {
        'x-default': 'https://vmcl.fr/legal/changes',
        'en-US': 'https://vmcl.fr/en/legal/changes',
        'fr-FR': 'https://vmcl.fr/fr/legal/changes',
      },
    },
  };
}

export default function LegalChangesPage() {
  return <LegalChangesPageClient />;
}
