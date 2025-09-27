import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale as 'fr' | 'en';
  const isEN = locale === 'en';

  return {
    title: isEN
      ? 'Cloud Products | VPS, GPU, Hosting, CDN - VMCloud'
      : 'Produits Cloud | VPS, GPU, Hébergement, CDN - VMCloud',
    description: isEN
      ? 'Explore our complete cloud product range: High-performance VPS from €29/month, GPU servers for AI/ML, managed web hosting, global CDN, storage and more.'
      : 'Découvrez notre gamme complète de produits cloud : VPS haute performance dès 29€/mois, serveurs GPU pour IA/ML, hébergement web managé, CDN global, stockage.',
    keywords: isEN
      ? 'cloud products, vps, gpu server, cdn, storage, paas, load balancer, vmcloud, hackboot'
      : 'produits cloud, vps, serveur gpu, cdn, stockage, paas, load balancer, vmcloud, hackboot',
    openGraph: {
      title: isEN
        ? 'VMCloud Products - VPS from €29, GPU Servers, Web Hosting'
        : 'Produits VMCloud - VPS dès 29€, Serveurs GPU, Hébergement Web',
      description: isEN
        ? 'Complete cloud solutions for businesses. VPS, GPU computing, web hosting, CDN, storage. European infrastructure with 24/7 support.'
        : 'Solutions cloud complètes pour entreprises. VPS, calcul GPU, hébergement web, CDN, stockage. Infrastructure européenne avec support 24/7.',
      type: 'website',
      locale: isEN ? 'en_US' : 'fr_FR',
      url: `https://vmcl.fr/${locale}/products`,
    },
    twitter: {
      card: 'summary_large_image',
      title: isEN
        ? 'VMCloud Products - Enterprise Cloud Solutions'
        : 'Produits VMCloud - Solutions Cloud Entreprise',
      description: isEN
        ? 'VPS from €29/month, GPU servers, web hosting, CDN and more. Premium European infrastructure.'
        : 'VPS dès 29€/mois, serveurs GPU, hébergement web, CDN et plus. Infrastructure européenne premium.',
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

