import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale as 'fr' | 'en';
  const isEN = locale === 'en';

  return {
    title: isEN
      ? 'Pricing & Plans – NVMe VPS from €29, GPU from €199 | VMCloud'
      : 'Tarifs & Offres – VPS NVMe dès 29€, GPU dès 199€ | VMCloud',
    description: isEN
      ? 'Build your sovereign cloud plan with transparent pricing: NVMe VPS on AMD EPYC from €29/month, GPU RTX/A100 nodes from €199/month, managed hosting from €12.90, hourly or annual billing with up to 25% savings.'
      : 'Composez votre cloud souverain avec une tarification transparente : VPS NVMe AMD EPYC dès 29€/mois, nœuds GPU RTX/A100 dès 199€/mois, hébergement managé dès 12,90€, facturation horaire ou annuelle jusqu\'à -25%.',
    keywords: isEN
      ? 'VMCloud pricing, VPS €29, GPU cloud €199, sovereign cloud rates, pay as you go, SLA 99.99'
      : 'tarifs VMCloud, VPS 29€, cloud GPU 199€, cloud souverain, paiement à l\'usage, SLA 99,99%',
    openGraph: {
      title: isEN
        ? 'VMCloud Pricing – Transparent Sovereign Cloud Plans'
        : 'Tarifs VMCloud – Offres Cloud Souverain Transparentes',
      description: isEN
      type: 'website',
      locale: isEN ? 'en_US' : 'fr_FR',
      url: `https://vmcl.fr/${locale}/pricing`,
      images: [
        {
          url: `/${locale}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: isEN
            ? 'VMCloud Pricing – VPS from €29 and GPU from €199'
            : 'Tarifs VMCloud – VPS dès 29€ et GPU dès 199€',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: isEN
        ? 'VMCloud Pricing – Fair & Predictable Sovereign Cloud'
        : 'Tarifs VMCloud – Cloud souverain clair & prévisible',
      description: isEN
        ? 'Choose NVMe VPS packs from €29/month, AI-ready GPU clusters from €199/month and save up to 25% with annual commitments.'
        : 'Choisissez vos VPS NVMe dès 29€/mois, clusters GPU IA dès 199€/mois et économisez jusqu\'à 25% avec l\'engagement annuel.',
      images: [`/${locale}/twitter-image`],
    },
    alternates: {
      canonical: `/${locale}/pricing`,
      languages: {
        'x-default': 'https://vmcl.fr/pricing',
        'en-US': 'https://vmcl.fr/en/pricing',
        'fr-FR': 'https://vmcl.fr/fr/pricing',
      },
    },
  };
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
