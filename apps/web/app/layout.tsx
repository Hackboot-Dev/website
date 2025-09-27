import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://vmcl.fr'),
  title: {
    default: 'VMCloud by Hackboot – Cloud souverain NVMe dès 29€/mois',
    template: '%s | VMCloud by Hackboot',
  },
  description:
    'Infrastructure cloud européenne par Hackboot : VPS NVMe ultra-rapides dès 29€/mois, GPU NVIDIA pour IA/ML à partir de 199€/mois, hébergement managé et support expert 24/7 avec SLA 99,99%.',
  keywords: [
    'VMCloud',
    'Hackboot',
    'cloud souverain',
    'VPS NVMe 29€',
    'serveur GPU IA',
    'hébergement web premium',
    'cloud européen',
    'support 24/7',
    'SLA 99.99%',
    'datacenter France',
    'infrastructure AMD EPYC',
  ],
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    shortcut: ['/icon.svg'],
    apple: ['/icon.svg'],
  },
  openGraph: {
    type: 'website',
    url: 'https://vmcl.fr/',
    title: 'VMCloud by Hackboot – Cloud souverain NVMe dès 29€/mois',
    siteName: 'VMCloud by Hackboot',
    description:
      'Cloud européen haute performance : VPS NVMe dès 29€/mois, GPU dédiés IA/ML, hébergement managé et support 24/7/365.',
    locale: 'en_US',
    images: [
      {
        url: '/en/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'VMCloud – Cloud souverain NVMe et GPU IA par Hackboot',
      },
    ],
    alternateLocale: ['fr_FR'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@vmcloud',
    title: 'VMCloud by Hackboot – Cloud souverain dès 29€/mois',
    description:
      'VPS NVMe, GPU NVIDIA pour IA/ML et hébergement managé avec support 24/7 et SLA 99,99%.',
    images: ['/en/twitter-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      maxSnippet: -1,
      maxImagePreview: 'large',
      maxVideoPreview: -1,
    },
  },
  alternates: {
    canonical: '/',
    languages: {
      'x-default': 'https://vmcl.fr/',
      'en-US': 'https://vmcl.fr/',
      'fr-FR': 'https://vmcl.fr/fr',
    },
  },
  category: 'technology',
  applicationName: 'VMCloud',
  formatDetection: {
    telephone: true,
    address: false,
    email: false,
    date: false,
    url: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0a0a0a',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout is minimal as the [locale] layout handles everything
  return children;
}
