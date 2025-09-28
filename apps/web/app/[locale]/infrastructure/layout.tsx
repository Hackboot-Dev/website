import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale as 'fr' | 'en';
  const isEN = locale === 'en';

  return {
    title: isEN
      ? 'European Cloud Infrastructure | Tier III DCs & 24/7 Monitoring - VMCloud'
      : 'Infrastructure Cloud Européenne | Datacenters Tier III & supervision 24/7 - VMCloud',
    description: isEN
      ? 'VMCloud runs sovereign infrastructure across Tier III European datacenters with AMD EPYC compute, RTX/A100 GPU pools, 400 Gbps multi-homed network and layered DDoS defence with continuous monitoring.'
      : 'VMCloud opère une infrastructure souveraine dans des datacenters Tier III européens avec compute AMD EPYC, pools GPU RTX/A100, réseau multi-homed 400 Gbps et défense DDoS multi-couches avec supervision continue.',
    keywords: isEN
      ? 'VMCloud infrastructure, Tier III datacenter, sovereign cloud, AMD EPYC servers, NVIDIA A100, 400 Gbps backbone, DDoS protection'
      : 'infrastructure VMCloud, datacenter Tier III, cloud souverain, serveurs AMD EPYC, NVIDIA A100, backbone 400 Gbps, protection DDoS',
    openGraph: {
      title: isEN
        ? 'VMCloud Infrastructure – Enterprise-Grade & Sovereign'
        : 'Infrastructure VMCloud – Grade entreprise & souveraine',
      description: isEN
        ? 'State-of-the-art sovereign infrastructure across Tier III European locations with AMD EPYC compute, RTX/A100 GPU fabric and layered DDoS protection.'
        : 'Infrastructure souveraine de pointe dans des sites européens Tier III avec compute AMD EPYC, fabric GPU RTX/A100 et protection DDoS multi-couches.',
      type: 'website',
      locale: isEN ? 'en_US' : 'fr_FR',
      url: `https://vmcl.fr/${locale}/infrastructure`,
      images: [
        {
          url: `/${locale}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: isEN
            ? 'VMCloud European sovereign infrastructure overview'
            : 'Infrastructure souveraine européenne VMCloud',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: isEN
        ? 'VMCloud – Sovereign European Infrastructure'
        : 'VMCloud – Infrastructure européenne souveraine',
      description: isEN
        ? 'Tier III facilities, AMD EPYC compute, NVIDIA RTX/A100 GPU fabric, 400 Gbps backbone and 24/7 on-call engineering.'
        : 'Sites Tier III, compute AMD EPYC, fabric GPU NVIDIA RTX/A100, backbone 400 Gbps et astreinte ingénieurs 24/7.',
      images: [`/${locale}/twitter-image`],
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
