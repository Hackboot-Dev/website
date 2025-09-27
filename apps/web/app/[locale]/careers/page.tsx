// /workspaces/website/apps/web/app/[locale]/careers/page.tsx
// Description: Server component for careers page with SEO metadata
// Last modified: 2025-09-13
// Related docs: /docs/JOURNAL.md

import { Metadata } from 'next';
import CareersPageClient from './CareersPageClient';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isEn = params.locale === 'en';

  return {
    title: isEn
      ? 'Careers at VMCloud – Build the Sovereign Cloud'
      : 'Carrières chez VMCloud – Construisez le cloud souverain',
    description: isEn
      ? 'Join Hackboot’s sovereign cloud team. Remote-first roles across platform, SRE, network, product and support with transparent bands, equity and on-call compensation.'
      : 'Rejoignez l\'équipe cloud souverain d\'Hackboot. Postes remote-first en plateforme, SRE, réseau, produit et support avec grilles transparentes, equity et rémunération d\'astreinte.',
    keywords: isEn
      ? 'VMCloud jobs, sovereign cloud careers, remote SRE roles, Hackboot hiring, DevOps jobs Europe'
      : 'emplois VMCloud, carrières cloud souverain, postes SRE remote, recrutements Hackboot, emplois DevOps Europe',
    openGraph: {
      title: isEn
        ? 'Work at VMCloud – Join the Sovereign Cloud Team'
        : 'Travailler chez VMCloud – Rejoindre l\'équipe du cloud souverain',
      description: isEn
        ? 'Shape Europe’s sovereign cloud with remote-first squads, transparent salary bands, BSPCE and high-impact missions.'
        : 'Façonnez le cloud souverain européen au sein d\'équipes remote-first, avec grilles salariales transparentes, BSPCE et missions à fort impact.',
      images: [
        {
          url: `/${params.locale}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: isEn
            ? 'VMCloud careers – Join the sovereign cloud'
            : 'Carrières VMCloud – Rejoignez le cloud souverain',
        },
      ],
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: isEn ? 'VMCloud Careers – We’re hiring' : 'Carrières VMCloud – Nous recrutons',
      description: isEn
        ? 'Remote-first, equity for all, premium equipment and the mission to build the sovereign cloud.'
        : 'Remote-first, equity pour tous, matériel premium et la mission de bâtir le cloud souverain.',
      images: [`/${params.locale}/twitter-image`]
    },
    alternates: {
      canonical: `https://vmcl.fr/${params.locale}/careers`,
      languages: {
        'en': 'https://vmcl.fr/en/careers',
        'fr': 'https://vmcl.fr/fr/careers'
      }
    }
  };
}

export default function CareersPage() {
  return <CareersPageClient />;
}
