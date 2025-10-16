// /workspaces/website/apps/web/app/[locale]/layout.tsx
// Description: Layout with dynamic locale support from URL
// Last modified: 2025-09-05
// Related docs: /docs/JOURNAL.md

// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { headers } from 'next/headers';
import '../globals.css';
import { LanguageProvider } from '../../contexts/LanguageContext';
import LanguageLoader from '../../components/ui/LanguageLoader';
import PageReadiness from '../../components/ui/PageReadiness';
import { Language } from '../../utils/loadTranslations';

const inter = Inter({ subsets: ['latin'] });

export async function generateStaticParams() {
  return [{ locale: 'fr' }, { locale: 'en' }];
}

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale as Language;
  const isEN = locale === 'en';
  
  return {
    metadataBase: new URL('https://vmcl.fr'),
    title: {
      default: isEN
        ? 'VMCloud — VPS, GPU Cloud & Web Hosting in Europe'
        : 'VMCloud — Hébergement VPS, Cloud GPU & Web en France',
      template: '%s | VMCloud',
    },
    description: isEN
      ? 'High-performance NVMe VPS from €29/month, GPU servers for AI/ML, and managed web hosting. European datacenters, 24/7 support, 99.99% SLA.'
      : 'VPS NVMe haute performance dès 29€/mois, serveurs GPU pour IA/ML et hébergement web managé. Datacenters européens, support 24/7, SLA 99,99%.',
    icons: {
      icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
      shortcut: ['/icon.svg'],
      apple: ['/icon.svg'],
    },
    openGraph: {
      type: 'website',
      url: `https://vmcl.fr/${locale}`,
      title: isEN
        ? 'VMCloud - Premium Cloud Infrastructure | VPS from €29'
        : 'VMCloud - Infrastructure Cloud Premium | VPS dès 29€',
      siteName: 'VMCloud',
      description: isEN
        ? '⚡ High-performance cloud infrastructure. VPS with NVMe SSD from €29/month, GPU servers for AI/ML, optimized web hosting. 24/7 support, 99.99% SLA.'
        : '⚡ Infrastructure cloud haute performance. VPS avec SSD NVMe dès 29€/mois, serveurs GPU pour IA/ML, hébergement web optimisé. Support 24/7, SLA 99.99%.',
      locale: isEN ? 'en_US' : 'fr_FR',
      images: [
        {
          url: `/${locale}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: isEN
            ? 'VMCloud – Premium Cloud Infrastructure (VPS • GPU • Hosting)'
            : 'VMCloud – Infrastructure Cloud Premium (VPS • GPU • Hébergement)',
        },
      ],
      alternateLocale: isEN ? ['fr_FR'] : ['en_US'],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@vmcloud',
      title: isEN
        ? 'VMCloud – Premium Cloud Infrastructure'
        : 'VMCloud – Infrastructure Cloud Premium',
      description: isEN
        ? 'High‑performance VPS, GPU computing for AI/ML, and professional web hosting with 24/7 support.'
        : 'VPS haute performance, calcul GPU pour AI/ML et hébergement web professionnel avec support 24/7.',
      images: [`/${locale}/twitter-image`],
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
      canonical: `/${locale}`,
      languages: {
        'x-default': 'https://vmcl.fr/',
        'en-US': 'https://vmcl.fr/en',
        'fr-FR': 'https://vmcl.fr/fr',
      },
    },
    category: 'technology',
    applicationName: 'VMCloud',
    authors: [{ name: 'VMCloud Team', url: 'https://vmcl.fr' }],
    creator: 'VMCloud',
    publisher: 'VMCloud',
    formatDetection: {
      telephone: true,
      address: false,
      email: false,
      date: false,
      url: false,
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || '',
      bing: process.env.NEXT_PUBLIC_BING_VERIFICATION || '',
    },
    other: {
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'black-translucent',
      'apple-mobile-web-app-title': 'VMCloud',
      'mobile-web-app-capable': 'yes',
      'msapplication-TileColor': '#000000',
      'msapplication-config': '/browserconfig.xml',
      'theme-color': '#000000',
      'format-detection': 'telephone=no',
      'msapplication-tap-highlight': 'no',
      'apple-touch-fullscreen': 'yes',
      'application-name': 'VMCloud',
      'msapplication-tooltip': isEN 
        ? 'VMCloud - Premium Cloud Infrastructure'
        : 'VMCloud - Infrastructure Cloud Premium',
      'msapplication-starturl': `https://vmcl.fr/${locale}`,
      'msapplication-navbutton-color': '#000000',
      'msapplication-window': 'width=1024;height=768',
      'msapplication-task': isEN
        ? 'name=Products;action-uri=/products;icon-uri=/icon.svg'
        : 'name=Produits;action-uri=/products;icon-uri=/icon.svg',
    },
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0a0a0a',
};

export default function LocaleLayout({ children, params }: Props) {
  const locale = params.locale as Language;
  
  return (
    <html lang={locale}>
      <body className={`${inter.className} bg-zinc-950 text-white`}>
        <Script id="ld-org" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'VMCloud',
            alternateName: ['Hackboot'],
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

        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-67JWW4SMZ2"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-67JWW4SMZ2');
          `}
        </Script>

        <PageReadiness />
        <LanguageProvider initialLanguage={locale}>
          {children}
          <LanguageLoader />
        </LanguageProvider>
      </body>
    </html>
  );
}