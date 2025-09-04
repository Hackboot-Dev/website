import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { LanguageProvider } from '../contexts/LanguageContext';
import LanguageLoader from '../components/ui/LanguageLoader';
import PageReadiness from '../components/ui/PageReadiness';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://vmcl.fr'),
  title: {
    default: 'VMCloud by Hackboot – Premium Cloud Infrastructure',
    template: '%s | VMCloud by Hackboot',
  },
  description:
    'Premium European cloud infrastructure by Hackboot: High‑performance VPS, AI/ML GPU computing, and professional web hosting with 24/7 support and 99.9% SLA.',
  keywords: [
    'VMCloud',
    'Hackboot',
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
    title: 'VMCloud by Hackboot – Premium Cloud Infrastructure',
    siteName: 'VMCloud by Hackboot',
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
    title: 'VMCloud by Hackboot – Premium Cloud Infrastructure',
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
  return (
    <html lang="en">
      <body className={`${inter.className} bg-zinc-950 text-white`}>
        <Script id="ld-org" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'VMCloud',
            alternateName: ['Hackboot', 'VMCloud by Hackboot'],
            url: 'https://vmcl.fr',
            logo: 'https://vmcl.fr/icon.svg',
            sameAs: [
              'https://linkedin.com/company/vmcloud',
              'https://twitter.com/vmcloud',
              'https://github.com/vmcloud',
            ],
          })}
        </Script>
        <Script id="ld-website" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'VMCloud',
            url: 'https://vmcl.fr',
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://vmcl.fr/search?q={search_term_string}',
              'query-input': 'required name=search_term_string',
            },
          })}
        </Script>
        <PageReadiness />
        <LanguageProvider>
          {children}
          <LanguageLoader />
        </LanguageProvider>
      </body>
    </html>
  );
}
