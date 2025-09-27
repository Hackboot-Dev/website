import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale as 'en' | 'fr';
  const isEN = locale === 'en';

  return {
    title: isEN
      ? 'Service Level Agreement | VMCloud 99.99% Sovereign SLA'
      : 'Service Level Agreement | SLA souverain 99,99% VMCloud',
    description: isEN
      ? 'Dive into VMCloud’s SLA: 99.99% availability, credit policy, monitoring commitments and incident response windows for sovereign workloads.'
      : 'Découvrez le SLA VMCloud : 99,99% de disponibilité, politique de crédits, engagements de supervision et délais de réponse incidents pour workloads souverains.',
    keywords: isEN
      ? 'VMCloud SLA, 99.99 uptime, sovereign cloud SLA, incident response, service credits'
      : 'SLA VMCloud, disponibilité 99,99, cloud souverain SLA, réponse incident, crédits de service',
    openGraph: {
      title: isEN
        ? 'VMCloud 99.99% SLA'
        : 'SLA 99,99% VMCloud',
      description: isEN
        ? 'Our contractual SLA for sovereign cloud services including measurement, credits and escalation paths.'
        : 'Notre SLA contractuel pour le cloud souverain : mesures, crédits et voies d\'escalade.',
      type: 'article',
      locale: isEN ? 'en_US' : 'fr_FR',
      url: `https://vmcl.fr/${locale}/legal/sla`,
      images: [
        {
          url: `/${locale}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: isEN
            ? 'VMCloud 99.99% SLA'
            : 'SLA 99,99% VMCloud',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: isEN
        ? 'VMCloud Sovereign SLA'
        : 'SLA souverain VMCloud',
      description: isEN
        ? '99.99% uptime commitment, proactive monitoring and response windows detailed.'
        : 'Engagement de disponibilité 99,99%, supervision proactive et délais de réponse détaillés.',
      images: [`/${locale}/twitter-image`],
    },
    alternates: {
      canonical: `/${locale}/legal/sla`,
      languages: {
        'x-default': 'https://vmcl.fr/legal/sla',
        'en-US': 'https://vmcl.fr/en/legal/sla',
        'fr-FR': 'https://vmcl.fr/fr/legal/sla',
      },
    },
  };
}

export default function LegalSLALayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
