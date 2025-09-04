import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import '../globals.css';
import { LanguageProvider } from '../../contexts/LanguageContext';
import LanguageLoader from '../../components/ui/LanguageLoader';
import PageReadiness from '../../components/ui/PageReadiness';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://vmcl.fr'),
  title: {
    default: 'VMCloud par Hackboot – Infrastructure Cloud Premium',
    template: '%s | VMCloud par Hackboot',
  },
  description:
    'Infrastructure cloud européenne premium : VPS haute performance, calcul GPU pour IA/ML et hébergement web professionnel avec support 24/7 et SLA 99,9 %.',
  keywords: [
    'VMCloud',
    'Hackboot',
    'hébergement vps',
    'serveur cloud',
    'calcul GPU',
    'IA ML',
    'hébergement web',
    'infrastructure cloud',
    'serveur dédié',
    'cloud européen',
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
    url: 'https://vmcl.fr/fr',
    title: 'VMCloud par Hackboot – Infrastructure Cloud Premium',
    siteName: 'VMCloud par Hackboot',
    description:
      'Infrastructure cloud européenne premium : VPS haute performance, calcul GPU pour IA/ML et hébergement web professionnel.',
    locale: 'fr_FR',
    images: [
      {
        url: '/og/home-fr',
        width: 1200,
        height: 630,
        alt: 'VMCloud – Infrastructure Cloud Premium (VPS • GPU • Hébergement)'
      },
    ],
    alternateLocale: ['en_US'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@vmcloud',
    title: 'VMCloud par Hackboot – Infrastructure Cloud Premium',
    description:
      'VPS haute performance, calcul GPU pour IA/ML et hébergement web professionnel avec support 24/7.',
    images: ['/og/home-fr'],
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
    canonical: '/fr',
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

export default function FRLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-zinc-950 text-white`}>
        <Script id="ld-org-fr" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'VMCloud',
            alternateName: ['Hackboot', 'VMCloud par Hackboot'],
            url: 'https://vmcl.fr',
            logo: 'https://vmcl.fr/icon.svg',
            sameAs: [
              'https://linkedin.com/company/vmcloud',
              'https://twitter.com/vmcloud',
              'https://github.com/vmcloud',
            ],
          })}
        </Script>
        <Script id="ld-website-fr" type="application/ld+json" strategy="beforeInteractive">
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
        <LanguageProvider initialLanguage="fr">
          {children}
          <LanguageLoader />
        </LanguageProvider>
      </body>
    </html>
  );
}
