import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale as 'en' | 'fr';
  const isEN = locale === 'en';

  return {
    title: isEN
      ? 'Terms of Service | VMCloud Sovereign Cloud Legal'
      : 'Conditions générales de service | Légal VMCloud',
    description: isEN
      ? 'Read VMCloud’s Terms of Service detailing contractual framework, billing, SLA enforcement and customer commitments for sovereign cloud services.'
      : 'Consultez les Conditions Générales de Service VMCloud : cadre contractuel, facturation, application du SLA et engagements client du cloud souverain.',
    keywords: isEN
      ? 'VMCloud terms of service, sovereign cloud contract, billing policy, SLA 99.99'
      : 'conditions service VMCloud, contrat cloud souverain, politique facturation, SLA 99,99',
    openGraph: {
      title: isEN
        ? 'VMCloud Terms of Service'
        : 'Conditions générales VMCloud',
      description: isEN
        ? 'Understand the contractual terms that power VMCloud’s sovereign infrastructure and 24/7 commitments.'
        : 'Comprenez le cadre contractuel qui soutient l\'infrastructure souveraine VMCloud et ses engagements 24/7.',
      type: 'article',
      locale: isEN ? 'en_US' : 'fr_FR',
      url: `https://vmcl.fr/${locale}/legal/terms`,
      images: [
        {
          url: `/${locale}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: isEN
            ? 'VMCloud Terms of Service'
            : 'Conditions générales VMCloud',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: isEN
        ? 'VMCloud Terms of Service'
        : 'Conditions générales VMCloud',
      description: isEN
        ? 'Full contractual framework for VMCloud sovereign infrastructure customers.'
        : 'Cadre contractuel complet pour les clients de l\'infrastructure souveraine VMCloud.',
      images: [`/${locale}/twitter-image`],
    },
    alternates: {
      canonical: `/${locale}/legal/terms`,
      languages: {
        'x-default': 'https://vmcl.fr/legal/terms',
        'en-US': 'https://vmcl.fr/en/legal/terms',
        'fr-FR': 'https://vmcl.fr/fr/legal/terms',
      },
    },
  };
}

export default function LegalTermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
