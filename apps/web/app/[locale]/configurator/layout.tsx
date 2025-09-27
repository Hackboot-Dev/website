import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale as 'en' | 'fr';
  const isEN = locale === 'en';

  return {
    title: isEN
      ? 'Cloud Configurator | Build Your VMCloud Stack'
      : 'Configurateur Cloud | Composez votre stack VMCloud',
    description: isEN
      ? 'Configure sovereign NVMe VPS, GPU clusters and managed services à la carte. Compare hourly, monthly and annual pricing from €29.'
      : 'Configurez vos VPS NVMe souverains, clusters GPU et services managés à la carte. Comparez les tarifs horaire, mensuel et annuel dès 29€.',
    keywords: isEN
      ? 'VMCloud configurator, custom VPS, GPU builder, sovereign cloud pricing'
      : 'configurateur VMCloud, VPS sur mesure, configurateur GPU, tarification cloud souverain',
    openGraph: {
      title: isEN
        ? 'VMCloud Configurator – Custom Sovereign Cloud'
        : 'Configurateur VMCloud – Cloud souverain sur mesure',
      description: isEN
        ? 'Design your perfect build with NVMe compute, GPU acceleration, network add-ons and instant pricing.'
        : 'Composez votre build idéal avec compute NVMe, accélération GPU, options réseau et tarification instantanée.',
      type: 'website',
      locale: isEN ? 'en_US' : 'fr_FR',
      url: `https://vmcl.fr/${locale}/configurator`,
      images: [
        {
          url: `/${locale}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: isEN
            ? 'VMCloud configurator interface'
            : 'Interface du configurateur VMCloud',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: isEN
        ? 'Build your VMCloud plan'
        : 'Composez votre plan VMCloud',
      description: isEN
        ? 'Estimate NVMe VPS, GPU nodes and managed options with transparent pricing.'
        : 'Estimez VPS NVMe, nœuds GPU et options managées avec une tarification transparente.',
      images: [`/${locale}/twitter-image`],
    },
    alternates: {
      canonical: `/${locale}/configurator`,
      languages: {
        'x-default': 'https://vmcl.fr/configurator',
        'en-US': 'https://vmcl.fr/en/configurator',
        'fr-FR': 'https://vmcl.fr/fr/configurator',
      },
    },
  };
}

export default function ConfiguratorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

