import type { Metadata } from 'next';
import AboutPageClient from './AboutPageClient';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isEn = params.locale === 'en';

  return {
    title: isEn ? 'About VMCloud - Leading European Cloud Provider' : 'À propos de VMCloud - Leader Cloud Européen',
    description: isEn
      ? 'Discover VMCloud, the European cloud infrastructure leader. €2.5M raised, 3 datacenters, Estonian headquarters.'
      : 'Découvrez VMCloud, leader de l\'infrastructure cloud européenne. 2.5M€ levés, 3 datacenters, siège en Estonie.',
    keywords: isEn
      ? 'VMCloud, cloud provider, European cloud, Estonia tech, cloud gaming, GPU computing, Gaylor Loche, tech startup'
      : 'VMCloud, fournisseur cloud, cloud européen, tech Estonie, cloud gaming, calcul GPU, Gaylor Loche, startup tech',
    openGraph: {
      title: isEn ? 'VMCloud - European Cloud Infrastructure Pioneer' : 'VMCloud - Pionnier Infrastructure Cloud Européen',
      description: isEn
        ? 'From gaming to enterprise cloud. Learn about our evolution, team, and vision for European cloud infrastructure.'
        : 'Du gaming au cloud entreprise. Découvrez notre évolution, notre équipe et notre vision pour l\'infrastructure cloud européenne.',
      images: ['/og-about.jpg'],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: isEn ? 'About VMCloud - European Cloud Leader' : 'À propos de VMCloud - Leader Cloud Européen',
      description: isEn
        ? 'VMCloud - €2.5M raised, Estonian HQ, European expansion.'
        : 'VMCloud - 2.5M€ levés, siège estonien, expansion européenne.',
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