import type { Metadata } from 'next';
import AboutPageClient from './AboutPageClient';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isEn = params.locale === 'en';

  return {
    title: isEn ? 'About VMCloud - Leading European Cloud Provider' : 'À propos de VMCloud - Leader Cloud Européen',
    description: isEn
      ? 'Discover how Hackboot built VMCloud into Europe’s sovereign cloud: €2.5M raised, Tier III datacenters in Paris, Lyon & Tallinn, AMD EPYC stacks and 24/7 NOC.'
      : 'Découvrez comment Hackboot a créé VMCloud, cloud souverain européen : 2,5M€ levés, datacenters Tier III à Paris, Lyon & Tallinn, stacks AMD EPYC et NOC 24/7.',
    keywords: isEn
      ? 'VMCloud story, Hackboot, sovereign cloud Europe, AMD EPYC, Gaylor Loche, European datacenters'
      : 'histoire VMCloud, Hackboot, cloud souverain Europe, AMD EPYC, Gaylor Loche, datacenters européens',
    openGraph: {
      title: isEn ? 'VMCloud - European Sovereign Cloud Pioneer' : 'VMCloud - Pionnier du Cloud Souverain Européen',
      description: isEn
        ? 'From gaming roots to sovereign infrastructure: meet the team building NVMe VPS, GPU clusters and 400 Gbps backbone across Europe.'
        : 'Des origines gaming à l\'infrastructure souveraine : découvrez l\'équipe derrière les VPS NVMe, clusters GPU et backbone 400 Gbps européens.',
      images: [
        {
          url: `/${params.locale}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: isEn
            ? 'About VMCloud – European sovereign cloud by Hackboot'
            : 'À propos de VMCloud – Cloud souverain européen par Hackboot',
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: isEn ? 'About VMCloud – European Sovereign Cloud' : 'À propos de VMCloud – Cloud souverain européen',
      description: isEn
        ? 'VMCloud by Hackboot: €2.5M raised, Tier III datacenters, sovereign infrastructure and 24/7 teams.'
        : 'VMCloud par Hackboot : 2,5M€ levés, datacenters Tier III, infrastructure souveraine et équipes 24/7.',
      images: [`/${params.locale}/twitter-image`],
    },
    alternates: {
      canonical: `/${params.locale}/about`,
      languages: {
        'fr': '/fr/about',
        'en': '/en/about',
      },
    },
  };
}

export default function AboutPage() {
  return <AboutPageClient />;
}
