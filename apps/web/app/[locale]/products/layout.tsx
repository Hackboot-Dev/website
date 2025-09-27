import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale as 'fr' | 'en';
  const isEN = locale === 'en';

  return {
    title: isEN
      ? 'Cloud Products Catalogue – VPS, GPU, Hosting, CDN | VMCloud'
      : 'Catalogue Produits Cloud – VPS, GPU, Hébergement, CDN | VMCloud',
    description: isEN
      ? 'Explore sovereign-grade cloud services: NVMe VPS with AMD EPYC from €29/month, NVIDIA GPU clusters for AI from €199/month, managed web hosting, object storage, CDN and edge services.'
      : 'Découvrez des services cloud souverains : VPS NVMe AMD EPYC dès 29€/mois, clusters GPU NVIDIA pour IA dès 199€/mois, hébergement web managé, stockage objet, CDN et edge.',
    keywords: isEN
      ? 'VMCloud products, NVMe VPS, GPU cloud, sovereign hosting, CDN, object storage, DevOps services'
      : 'produits VMCloud, VPS NVMe, cloud GPU, hébergement souverain, CDN, stockage objet, services DevOps',
    openGraph: {
      title: isEN
        ? 'VMCloud Products – Sovereign Cloud Building Blocks'
        : 'Produits VMCloud – Briques du Cloud Souverain',
      description: isEN
        ? 'Explore sovereign-grade cloud services: NVMe VPS with AMD EPYC from €29/month, NVIDIA GPU clusters for AI from €199/month, managed web hosting, object storage, CDN and edge services.'
        : 'Découvrez des services cloud souverains : VPS NVMe AMD EPYC dès 29€/mois, clusters GPU NVIDIA pour IA dès 199€/mois, hébergement web managé, stockage objet, CDN et edge.',
      type: 'website',
      locale: isEN ? 'en_US' : 'fr_FR',
      url: `https://vmcl.fr/${locale}/products`,
      images: [
        {
          url: `/${locale}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: isEN
            ? 'VMCloud sovereign cloud product catalogue'
            : 'Catalogue des produits cloud souverain VMCloud',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: isEN
        ? 'VMCloud Products – Enterprise-Grade Sovereign Cloud'
        : 'Produits VMCloud – Cloud souverain pour les entreprises',
      description: isEN
        ? 'Choose NVMe VPS, GPU AI clusters, managed hosting, storage and CDN backed by 24/7 engineers.'
        : 'Choisissez VPS NVMe, clusters GPU IA, hébergement managé, stockage et CDN avec ingénieurs 24/7.',
      images: [`/${locale}/twitter-image`],
    },
    alternates: {
      canonical: `/${locale}/products`,
      languages: {
        'x-default': 'https://vmcl.fr/products',
        'en-US': 'https://vmcl.fr/en/products',
        'fr-FR': 'https://vmcl.fr/fr/products',
      },
    },
  };
}

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
