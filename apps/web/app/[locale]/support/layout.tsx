import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale as 'fr' | 'en';
  const isEN = locale === 'en';

  return {
    title: isEN
      ? '24/7 Technical Support | VMCloud Help Center'
      : 'Support Technique 24/7 | Centre d\'Aide VMCloud',
    description: isEN
      ? 'Reach VMCloud engineers 24/7 via chat, ticket or phone. <15 minute median response, bilingual NOC, proactive monitoring and SLA-backed incident handling.'
      : 'Contactez les ingénieurs VMCloud 24/7 par chat, ticket ou téléphone. Réponse médiane < 15 minutes, NOC bilingue, supervision proactive et gestion d\'incident sous SLA.',
    keywords: isEN
      ? 'VMCloud support, 24/7 NOC, sovereign cloud assistance, SLA response, chat support'
      : 'support VMCloud, NOC 24/7, assistance cloud souverain, réponse SLA, support chat',
    openGraph: {
      title: isEN
        ? 'VMCloud Support – Engineers On Call 24/7'
        : 'Support VMCloud – Ingénieurs disponibles 24/7',
      description: isEN
      type: 'website',
      locale: isEN ? 'en_US' : 'fr_FR',
      url: `https://vmcl.fr/${locale}/support`,
      images: [
        {
          url: `/${locale}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: isEN
            ? 'VMCloud support center 24/7'
            : 'Centre de support VMCloud 24/7',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: isEN
        ? 'VMCloud Support – Expert Assistance 24/7'
        : 'Support VMCloud – Assistance experte 24/7',
      description: isEN
        ? 'Talk to sovereign cloud specialists whenever you need them: chat, tickets, hotline and proactive monitoring.'
        : 'Parlez à des spécialistes du cloud souverain à tout moment : chat, tickets, hotline et supervision proactive.',
      images: [`/${locale}/twitter-image`],
    },
    alternates: {
      canonical: `/${locale}/support`,
      languages: {
        'x-default': 'https://vmcl.fr/support',
        'en-US': 'https://vmcl.fr/en/support',
        'fr-FR': 'https://vmcl.fr/fr/support',
      },
    },
  };
}

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
