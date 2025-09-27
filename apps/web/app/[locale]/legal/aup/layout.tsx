import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale as 'en' | 'fr';
  const isEN = locale === 'en';

  return {
    title: isEN
      ? 'Acceptable Use Policy | VMCloud Sovereign Cloud'
      : 'Politique d\'utilisation acceptable | VMCloud Cloud souverain',
    description: isEN
      ? 'Understand the acceptable use policy governing VMCloud services: security, lawful usage, anti-abuse, and escalation process.'
      : 'Découvrez la politique d\'utilisation acceptable VMCloud : sécurité, usages autorisés, lutte anti-abus et processus d\'escalade.',
    keywords: isEN
      ? 'VMCloud acceptable use policy, sovereign cloud rules, anti-abuse'
      : 'politique d\'utilisation acceptable VMCloud, règles cloud souverain, anti-abus',
    openGraph: {
      title: isEN
        ? 'VMCloud Acceptable Use Policy'
        : 'Politique d\'utilisation acceptable VMCloud',
      description: isEN
        ? 'Security-minded acceptable use framework protecting sovereign workloads on VMCloud.'
        : 'Cadre d\'utilisation responsable pour protéger les workloads souverains sur VMCloud.',
      type: 'article',
      locale: isEN ? 'en_US' : 'fr_FR',
      url: `https://vmcl.fr/${locale}/legal/aup`,
      images: [
        {
          url: `/${locale}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: isEN
            ? 'VMCloud acceptable use policy'
            : 'Politique d\'utilisation acceptable VMCloud',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: isEN
        ? 'VMCloud Acceptable Use Policy'
        : 'Politique d\'utilisation acceptable VMCloud',
      description: isEN
        ? 'Guidelines for secure, lawful usage of VMCloud sovereign infrastructure.'
        : 'Règles pour un usage sécurisé et légal de l\'infrastructure souveraine VMCloud.',
      images: [`/${locale}/twitter-image`],
    },
    alternates: {
      canonical: `/${locale}/legal/aup`,
      languages: {
        'x-default': 'https://vmcl.fr/legal/aup',
        'en-US': 'https://vmcl.fr/en/legal/aup',
        'fr-FR': 'https://vmcl.fr/fr/legal/aup',
      },
    },
  };
}

export default function LegalAUPLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
