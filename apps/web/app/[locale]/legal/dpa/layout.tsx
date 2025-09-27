import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale as 'en' | 'fr';
  const isEN = locale === 'en';

  return {
    title: isEN
      ? 'Data Processing Agreement | VMCloud GDPR Commitments'
      : 'Data Processing Agreement | Engagements RGPD VMCloud',
    description: isEN
      ? 'Download and review VMCloud’s GDPR-compliant Data Processing Agreement covering sovereignty, sub-processors, retention and security.'
      : 'Téléchargez et consultez le Data Processing Agreement VMCloud conforme RGPD : souveraineté, sous-traitants, rétention et sécurité.',
    keywords: isEN
      ? 'VMCloud DPA, GDPR sovereign cloud, data processing agreement, compliance'
      : 'DPA VMCloud, RGPD cloud souverain, accord de traitement des données, conformité',
    openGraph: {
      title: isEN
        ? 'VMCloud Data Processing Agreement'
        : 'Data Processing Agreement VMCloud',
      description: isEN
        ? 'Our GDPR, sovereignty and security commitments detailed for enterprise workloads.'
        : 'Nos engagements RGPD, souveraineté et sécurité détaillés pour les workloads entreprise.',
      type: 'article',
      locale: isEN ? 'en_US' : 'fr_FR',
      url: `https://vmcl.fr/${locale}/legal/dpa`,
      images: [
        {
          url: `/${locale}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: isEN
            ? 'VMCloud data processing agreement'
            : 'Data Processing Agreement VMCloud',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: isEN
        ? 'VMCloud Data Processing Agreement'
        : 'Data Processing Agreement VMCloud',
      description: isEN
        ? 'Review how VMCloud processes and protects personal data across European datacenters.'
        : 'Découvrez la manière dont VMCloud traite et protège les données personnelles dans ses datacenters européens.',
      images: [`/${locale}/twitter-image`],
    },
    alternates: {
      canonical: `/${locale}/legal/dpa`,
      languages: {
        'x-default': 'https://vmcl.fr/legal/dpa',
        'en-US': 'https://vmcl.fr/en/legal/dpa',
        'fr-FR': 'https://vmcl.fr/fr/legal/dpa',
      },
    },
  };
}

export default function LegalDPALayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
