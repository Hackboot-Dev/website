// /workspaces/website/apps/web/utils/generatePageMetadata.ts
// Description: Helper function to generate page metadata
// Last modified: 2025-09-27
// Related docs: /docs/JOURNAL.md

import { Metadata } from 'next';
import { getPageMetadata } from '../config/seo-metadata';

export function generatePageMetadata(
  pageName: string,
  locale: 'fr' | 'en',
  additionalMetadata?: Partial<Metadata>
): Metadata {
  const pageData = getPageMetadata(pageName, locale);

  if (!pageData) {
    console.warn(`No metadata found for page: ${pageName}`);
    return {};
  }

  const baseUrl = 'https://vmcl.fr';
  const localePath = locale === 'en' ? '/en' : '/fr';
  const fullUrl = `${baseUrl}${localePath}`;

  return {
    title: pageData.title[locale],
    description: pageData.description[locale],
    keywords: pageData.keywords?.[locale]?.join(', '),
    openGraph: {
      title: pageData.ogTitle?.[locale] || pageData.title[locale],
      description: pageData.ogDescription?.[locale] || pageData.description[locale],
      url: fullUrl,
      siteName: 'VMCloud',
      locale: locale === 'en' ? 'en_US' : 'fr_FR',
      type: 'website',
      images: [
        {
          url: `${baseUrl}${localePath}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: 'VMCloud - Premium Cloud Infrastructure',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageData.title[locale],
      description: pageData.description[locale],
      site: '@vmcloud',
      images: [`${baseUrl}${localePath}/twitter-image`],
    },
    alternates: {
      canonical: fullUrl,
      languages: {
        'x-default': baseUrl,
        'en-US': `${baseUrl}/en`,
        'fr-FR': `${baseUrl}/fr`,
      },
    },
    ...additionalMetadata,
  };
}