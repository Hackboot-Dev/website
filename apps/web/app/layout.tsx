import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://vmcl.fr'),
  title: {
    default: 'VMCloud – Premium Cloud Infrastructure',
    template: '%s | VMCloud',
  },
  description:
    'Premium European cloud infrastructure with high‑performance VPS, AI/ML GPU computing, and professional web hosting supported 24/7 with a 99.9% SLA.',
  keywords: [
    'VMCloud',
    'VPS hosting',
    'cloud server',
    'GPU computing',
    'AI ML infrastructure',
    'web hosting',
    'cloud infrastructure',
    'dedicated server',
    'European cloud',
    'AMD EPYC',
    'NVMe',
  ],
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    shortcut: ['/icon.svg'],
    apple: ['/icon.svg'],
  },
  openGraph: {
    type: 'website',
    url: 'https://vmcl.fr/',
    title: 'VMCloud – Premium Cloud Infrastructure',
    siteName: 'VMCloud',
    description:
      'Premium European cloud infrastructure: high‑performance VPS, AI/ML GPU computing, and professional web hosting.',
    locale: 'en_US',
    images: [
      {
        url: '/og/home-en',
        width: 1200,
        height: 630,
        alt: 'VMCloud – Premium Cloud Infrastructure (VPS • GPU • Hosting)'
      },
    ],
    alternateLocale: ['fr_FR'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@vmcloud',
    title: 'VMCloud – Premium Cloud Infrastructure',
    description:
      'High‑performance VPS, GPU computing for AI/ML, and professional web hosting with 24/7 support.',
    images: ['/og/home-en'],
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
