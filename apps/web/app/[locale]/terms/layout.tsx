import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale as 'en' | 'fr';
  const isEN = locale === 'en';

  return {
    title: isEN
      ? 'Terms & Legal Framework | VMCloud Terms of Service'
      : 'Conditions générales & cadre légal | VMCloud',
    description: isEN
      ? 'Review VMCloud’s terms of service, privacy commitments, SLA, data processing agreement and acceptable use policy for sovereign cloud customers.'
      : 'Consultez les conditions générales de VMCloud, nos engagements de confidentialité, SLA, DPA et politique d\'utilisation acceptable pour un cloud souverain.',
    keywords: isEN
      ? 'VMCloud terms, SLA 99.99, GDPR compliance, data processing agreement, acceptable use'
      : 'conditions VMCloud, SLA 99,99, conformité RGPD, DPA, politique d\'utilisation',
    openGraph: {
      title: isEN
        ? 'VMCloud Legal Terms & Compliance'
        : 'VMCloud – Conditions légales & conformité',
      description: isEN
        ? 'All legal commitments in one place: Terms of Service, SLA, GDPR compliance and security policies for the sovereign cloud.'
        : 'Tous les engagements légaux : CGV/CGU, SLA, conformité RGPD et politiques de sécurité du cloud souverain.',
      type: 'website',
      locale: isEN ? 'en_US' : 'fr_FR',
      url: `https://vmcl.fr/${locale}/terms`,
      images: [
        {
          url: `/${locale}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: isEN
            ? 'VMCloud terms and legal overview'
            : 'Aperçu juridique VMCloud',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: isEN
        ? 'VMCloud Terms & Compliance'
        : 'VMCloud – Conditions & conformité',
      description: isEN
        ? 'Understand our sovereign cloud commitments: SLA, GDPR, data processing, acceptable use.'
        : 'Découvrez nos engagements cloud souverain : SLA, RGPD, traitement des données, utilisation acceptable.',
      images: [`/${locale}/twitter-image`],
    },
    alternates: {
      canonical: `/${locale}/terms`,
      languages: {
        'x-default': 'https://vmcl.fr/terms',
        'en-US': 'https://vmcl.fr/en/terms',
        'fr-FR': 'https://vmcl.fr/fr/terms',
      },
    },
  };
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
