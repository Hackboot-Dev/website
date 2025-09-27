import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale as 'en' | 'fr';
  const isEN = locale === 'en';

  return {
    title: isEN
      ? 'Login | VMCloud Console'
      : 'Connexion | Console VMCloud',
    description: isEN
      ? 'Sign in to manage your sovereign cloud: deploy NVMe VPS, launch GPU clusters, monitor resources and access 24/7 support.'
      : 'Connectez-vous pour piloter votre cloud souverain : déployez vos VPS NVMe, lancez vos clusters GPU, surveillez vos ressources et accédez au support 24/7.',
    keywords: isEN
      ? 'VMCloud login, cloud console, manage VPS, GPU dashboard, sovereign cloud portal'
      : 'connexion VMCloud, console cloud, gestion VPS, tableau GPU, portail cloud souverain',
    openGraph: {
      title: isEN
        ? 'VMCloud Console Login'
        : 'Connexion à la console VMCloud',
      description: isEN
        ? 'Access the VMCloud console to manage sovereign infrastructure with real-time monitoring and automation.'
        : 'Accédez à la console VMCloud pour gérer votre infrastructure souveraine avec supervision temps réel et automatisation.',
      type: 'website',
      locale: isEN ? 'en_US' : 'fr_FR',
      url: `https://vmcl.fr/${locale}/login`,
      images: [
        {
          url: `/${locale}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: isEN
            ? 'VMCloud console login'
            : 'Connexion console VMCloud',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: isEN
        ? 'Login to VMCloud'
        : 'Connexion VMCloud',
      description: isEN
        ? 'Unlock your sovereign cloud dashboard with billing, automation and 24/7 support.'
        : 'Accédez à votre espace cloud souverain avec facturation, automatisation et support 24/7.',
      images: [`/${locale}/twitter-image`],
    },
    alternates: {
      canonical: `/${locale}/login`,
      languages: {
        'x-default': 'https://vmcl.fr/login',
        'en-US': 'https://vmcl.fr/en/login',
        'fr-FR': 'https://vmcl.fr/fr/login',
      },
    },
  };
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

