import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale as 'fr' | 'en';
  const isEN = locale === 'en';

  return {
    title: isEN
      ? '24/7 Technical Support | VMCloud Help Center'
      : 'Support Technique 24/7 | Centre d\'Aide VMCloud',
    description: isEN
      ? 'Expert technical support available 24/7. Average response time < 15 minutes. AI chat, ticketing system, knowledge base and dedicated hotline.'
      : 'Support technique expert disponible 24/7. Temps de réponse moyen < 15 minutes. Chat IA, système de tickets, base de connaissances et hotline dédiée.',
    keywords: isEN
      ? 'technical support, help center, vmcloud support, 24/7 assistance, tickets, knowledge base'
      : 'support technique, centre aide, support vmcloud, assistance 24/7, tickets, base connaissances',
    openGraph: {
      title: isEN
        ? 'VMCloud Support - Get Help 24/7'
        : 'Support VMCloud - Aide 24/7',
      description: isEN
        ? 'Professional support team available round the clock. Chat, tickets, phone support. Average response < 15 min.'
        : 'Équipe support professionnelle disponible 24h/24. Chat, tickets, téléphone. Réponse moyenne < 15 min.',
      type: 'website',
      locale: isEN ? 'en_US' : 'fr_FR',
      url: `https://vmcl.fr/${locale}/support`,
    },
    twitter: {
      card: 'summary_large_image',
      title: isEN
        ? 'VMCloud Support - Expert Assistance 24/7'
        : 'Support VMCloud - Assistance Expert 24/7',
      description: isEN
        ? 'Get help from cloud experts anytime. Multiple support channels available.'
        : 'Obtenez de l\'aide d\'experts cloud à tout moment. Multiples canaux de support disponibles.',
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

