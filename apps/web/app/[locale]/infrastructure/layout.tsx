import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale as 'fr' | 'en';
  const isEN = locale === 'en';

  return {
    title: isEN
      ? 'European Cloud Infrastructure | 6 Datacenters, 99.97% SLA - VMCloud'
      : 'Infrastructure Cloud Européenne | 6 Datacenters, SLA 99.97% - VMCloud',
    description: isEN
      ? 'Premium infrastructure: 6 EU datacenters, 2500+ AMD EPYC vCPUs, 48 Tesla/RTX GPUs, 400 Gbps network, multi-tier DDoS protection. Enterprise-grade reliability.'
      : 'Infrastructure premium : 6 datacenters EU, 2500+ vCPUs AMD EPYC, 48 GPUs Tesla/RTX, réseau 400 Gbps, protection DDoS multi-niveaux. Fiabilité entreprise.',
    keywords: isEN
      ? 'cloud infrastructure, datacenters, amd epyc, tesla gpu, rtx gpu, ddos protection, vmcloud infrastructure'
      : 'infrastructure cloud, datacenters, amd epyc, gpu tesla, gpu rtx, protection ddos, infrastructure vmcloud',
    openGraph: {
      title: isEN
        ? 'VMCloud Infrastructure - Enterprise-Grade European Cloud'
        : 'Infrastructure VMCloud - Cloud Européen Grade Entreprise',
      description: isEN
        ? 'State-of-the-art infrastructure across 6 European locations. AMD EPYC processors, NVIDIA GPUs, redundant network, 99.97% uptime SLA.'
        : 'Infrastructure de pointe dans 6 sites européens. Processeurs AMD EPYC, GPUs NVIDIA, réseau redondant, SLA 99.97% de disponibilité.',
      type: 'website',
      locale: isEN ? 'en_US' : 'fr_FR',
      url: `https://vmcl.fr/${locale}/infrastructure`,
    },
    twitter: {
      card: 'summary_large_image',
      title: isEN
        ? 'VMCloud - Premium European Infrastructure'
        : 'VMCloud - Infrastructure Européenne Premium',
      description: isEN
        ? '6 datacenters, 2500+ vCPUs, 48 GPUs, 1.5PB storage. Enterprise cloud infrastructure.'
        : '6 datacenters, 2500+ vCPUs, 48 GPUs, 1.5PB stockage. Infrastructure cloud entreprise.',
    },
    alternates: {
      canonical: `/${locale}/infrastructure`,
      languages: {
        'x-default': 'https://vmcl.fr/infrastructure',
        'en-US': 'https://vmcl.fr/en/infrastructure',
        'fr-FR': 'https://vmcl.fr/fr/infrastructure',
      },
    },
  };
}

export default function InfrastructureLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

