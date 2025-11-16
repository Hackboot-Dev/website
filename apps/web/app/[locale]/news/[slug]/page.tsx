// apps/web/app/[locale]/news/[slug]/page.tsx
// Description: Individual news article page with custom components support
// Last modified: 2025-11-15

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import NewsArticleClient from './NewsArticleClient';
import articlesData from '../../../../content/news/articles.json';

interface PageProps {
  params: {
    locale: string;
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = params;
  const article = articlesData.articles.find((a) => a.slug === slug);

  if (!article) {
    return {
      title: 'Article not found',
    };
  }

  const lang = locale as 'en' | 'fr';
  const title = article.title[lang];
  const description = article.excerpt[lang];

  return {
    title: `${title} | VMCloud News`,
    description,
    authors: [{ name: article.author.name }],
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://vmcloud.net/${locale}/news/${slug}`,
      images: [article.coverImage],
      publishedTime: article.date,
      authors: [article.author.name],
      tags: article.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [article.coverImage],
    },
    alternates: {
      canonical: `https://vmcloud.net/${locale}/news/${slug}`,
      languages: {
        'fr-FR': `https://vmcloud.net/fr/news/${slug}`,
        'en-US': `https://vmcloud.net/en/news/${slug}`,
      },
    },
  };
}

export async function generateStaticParams() {
  return articlesData.articles.flatMap((article) => [
    { locale: 'fr', slug: article.slug },
    { locale: 'en', slug: article.slug },
  ]);
}

export default function NewsArticlePage({ params }: PageProps) {
  const { locale, slug } = params;
  const article = articlesData.articles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  return <NewsArticleClient article={article} locale={locale} />;
}
