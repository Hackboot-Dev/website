import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale as 'en' | 'fr';
  const isEN = locale === 'en';

  return {
    title: isEN
      ? 'Reset Password | VMCloud Console'
      : 'Réinitialiser le mot de passe | Console VMCloud',
    description: isEN
      ? 'Securely reset your VMCloud console password to regain access to your sovereign cloud services and support.'
      : 'Réinitialisez en toute sécurité votre mot de passe VMCloud pour retrouver l\'accès à vos services cloud souverains et au support.',
    keywords: isEN
      ? 'VMCloud password reset, cloud console recovery, secure login'
      : 'réinitialisation mot de passe VMCloud, récupération console cloud, connexion sécurisée',
    openGraph: {
      title: isEN
        ? 'Reset your VMCloud password'
        : 'Réinitialisez votre mot de passe VMCloud',
      description: isEN
        ? 'Recover access to your VMCloud sovereign infrastructure in a few secure steps.'
        : 'Retrouvez l\'accès à votre infrastructure souveraine VMCloud en quelques étapes sécurisées.',
      type: 'website',
      locale: isEN ? 'en_US' : 'fr_FR',
      url: `https://vmcl.fr/${locale}/forgot-password`,
      images: [
        {
          url: `/${locale}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: isEN
            ? 'VMCloud password recovery'
            : 'Récupération mot de passe VMCloud',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: isEN
        ? 'Reset VMCloud password'
        : 'Réinitialiser mot de passe VMCloud',
      description: isEN
        ? 'Follow the secure flow to regain access to your VMCloud console.'
        : 'Suivez le parcours sécurisé pour retrouver l\'accès à votre console VMCloud.',
      images: [`/${locale}/twitter-image`],
    },
    alternates: {
      canonical: `/${locale}/forgot-password`,
      languages: {
        'x-default': 'https://vmcl.fr/forgot-password',
        'en-US': 'https://vmcl.fr/en/forgot-password',
        'fr-FR': 'https://vmcl.fr/fr/forgot-password',
      },
    },
  };
}

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

