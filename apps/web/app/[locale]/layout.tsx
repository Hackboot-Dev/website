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
        ? 'VMCloud — Sovereign NVMe VPS & GPU Cloud in Europe'
        : 'VMCloud — Cloud souverain NVMe & GPU en France',
      template: '%s | VMCloud',
    },
    description: isEN
      ? 'Sovereign European cloud by VMCloud: NVMe VPS with AMD EPYC from €29/month, NVIDIA GPU servers for AI from €199/month, managed web hosting plus 24/7 NOC and continuous compliance monitoring.'
      : 'Cloud souverain VMCloud : VPS NVMe AMD EPYC dès 29€/mois, serveurs GPU NVIDIA pour IA dès 199€/mois, hébergement managé, supervision NOC 24/7 et conformité RGPD renforcée.',
    icons: {
      icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
      shortcut: ['/icon.svg'],
      apple: ['/icon.svg'],
    },
    openGraph: {
      type: 'website',
      url: `https://vmcl.fr/${locale}`,
      title: isEN
        ? 'VMCloud - Sovereign Cloud Infrastructure | VPS from €29'
        : 'VMCloud - Infrastructure Cloud Souveraine | VPS dès 29€',
      siteName: 'VMCloud',
      description: isEN
        ? '⚡ Sovereign-grade performance. NVMe VPS from €29/month, GPU servers for AI/ML from €199/month, managed hosting and DDoS-protected 400 Gbps backbone with continuous monitoring by 24/7 experts.'
        : '⚡ Performance souveraine. VPS NVMe dès 29€/mois, serveurs GPU pour IA/ML dès 199€/mois, hébergement managé et backbone 400 Gbps anti-DDoS avec experts en surveillance continue 24/7.',
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
        ? 'VMCloud – Sovereign Cloud from €29'
        : 'VMCloud – Cloud souverain dès 29€',
      description: isEN
        ? 'NVMe VPS with AMD EPYC, GPU clusters for AI and managed hosting with concierge-grade 24/7 support and proactive compliance.'
        : 'VPS NVMe AMD EPYC, clusters GPU pour IA et hébergement managé avec support concierge 24/7 et conformité renforcée.',
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
        ? 'VMCloud - Sovereign Cloud Infrastructure'
        : 'VMCloud - Cloud souverain haute performance',
      'msapplication-starturl': `https://vmcl.fr/${locale}`,
      'msapplication-navbutton-color': '#000000',
      'msapplication-window': 'width=1024;height=768',
      'msapplication-task': isEN
        ? 'name=Products;action-uri=/en/products;icon-uri=/icon.svg'
        : 'name=Produits;action-uri=/fr/products;icon-uri=/icon.svg',
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
            alternateName: ['VMCloud'],
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
