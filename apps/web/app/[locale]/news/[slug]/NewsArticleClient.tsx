'use client';

// apps/web/app/[locale]/news/[slug]/NewsArticleClient.tsx
// Description: Client component for rendering news article with custom markdown components
// Last modified: 2025-11-15

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, User, Share2, Bookmark, ArrowLeft } from 'lucide-react';

// Custom markdown components
import {
  HeroFullscreen,
  HeroParallax,
  HeroCode,
  Quote,
  QuoteHighlight,
  ProjectGrid,
  StatsAnimated,
  Timeline,
  CallToAction,
  ComparisonSlider,
  MetricsGrid,
  ImageFloat,
  StatsShowcase,
  CodeBlock,
  ArchitectureDiagram,
  VideoEmbed,
  GPUComparisonTable,
  AlertBox,
  PricingCard,
  FAQSection,
  TestimonialGrid,
  Testimonial,
  Credits,
} from '@/components/news/custom-components';

interface NewsArticleClientProps {
  article: any;
  locale: string;
}

export default function NewsArticleClient({ article, locale }: NewsArticleClientProps) {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const lang = locale as 'en' | 'fr';

  useEffect(() => {
    const loadArticleContent = async () => {
      try {
        const response = await fetch(
          `/content/news/${locale}/${article.category}/${article.slug}.md`
        );
        const text = await response.text();

        // Remove frontmatter
        const contentWithoutFrontmatter = text.replace(/^---[\s\S]*?---\n/, '');
        setContent(contentWithoutFrontmatter);
      } catch (error) {
        console.error('Failed to load article content:', error);
        setContent('Failed to load article content.');
      } finally {
        setLoading(false);
      }
    };

    loadArticleContent();
  }, [article, locale]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-75" />
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-150" />
        </div>
      </div>
    );
  }

  // Custom components mapping for markdown rendering
  const components = {
    // Custom Components
    HeroFullscreen,
    HeroParallax,
    HeroCode,
    Quote,
    QuoteHighlight,
    ProjectGrid,
    StatsAnimated,
    Timeline,
    CallToAction,
    ComparisonSlider,
    MetricsGrid,
    ImageFloat,
    StatsShowcase,
    CodeBlock,
    ArchitectureDiagram,
    VideoEmbed,
    GPUComparisonTable,
    AlertBox,
    PricingCard,
    FAQSection,
    TestimonialGrid,
    Testimonial,
    Credits,

    // Standard HTML elements styling
    h1: ({ children, ...props }: any) => (
      <h1 className="text-4xl lg:text-5xl font-light text-white mb-6 mt-12" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }: any) => (
      <h2 className="text-3xl lg:text-4xl font-light text-white mb-4 mt-10" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }: any) => (
      <h3 className="text-2xl lg:text-3xl font-light text-white mb-3 mt-8" {...props}>
        {children}
      </h3>
    ),
    p: ({ children, ...props }: any) => (
      <p className="text-lg text-zinc-300 mb-6 leading-relaxed" {...props}>
        {children}
      </p>
    ),
    a: ({ children, href, ...props }: any) => (
      <Link
        href={href || '#'}
        className="text-cyan-500 hover:text-cyan-400 underline decoration-cyan-500/30 hover:decoration-cyan-400 transition-colors"
        {...props}
      >
        {children}
      </Link>
    ),
    ul: ({ children, ...props }: any) => (
      <ul className="list-disc list-inside text-zinc-300 mb-6 space-y-2" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: any) => (
      <ol className="list-decimal list-inside text-zinc-300 mb-6 space-y-2" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }: any) => (
      <li className="text-lg leading-relaxed" {...props}>
        {children}
      </li>
    ),
    blockquote: ({ children, ...props }: any) => (
      <blockquote
        className="border-l-4 border-cyan-500 pl-6 italic text-zinc-400 my-6"
        {...props}
      >
        {children}
      </blockquote>
    ),
    code: ({ inline, children, ...props }: any) =>
      inline ? (
        <code
          className="px-2 py-1 bg-zinc-800 rounded text-cyan-400 text-sm font-mono"
          {...props}
        >
          {children}
        </code>
      ) : (
        <code className="block bg-zinc-900 p-4 rounded-lg text-sm font-mono overflow-x-auto my-6" {...props}>
          {children}
        </code>
      ),
    pre: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    hr: () => <hr className="border-zinc-800 my-12" />,
    table: ({ children, ...props }: any) => (
      <div className="overflow-x-auto my-8">
        <table className="w-full border-collapse" {...props}>
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }: any) => (
      <thead className="bg-zinc-900" {...props}>
        {children}
      </thead>
    ),
    tbody: ({ children, ...props }: any) => <tbody {...props}>{children}</tbody>,
    tr: ({ children, ...props }: any) => (
      <tr className="border-b border-zinc-800" {...props}>
        {children}
      </tr>
    ),
    th: ({ children, ...props }: any) => (
      <th className="px-4 py-3 text-left text-white font-medium" {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }: any) => (
      <td className="px-4 py-3 text-zinc-300" {...props}>
        {children}
      </td>
    ),
    img: ({ src, alt, ...props }: any) => (
      <div className="relative w-full h-96 my-8 rounded-lg overflow-hidden">
        <Image src={src || ''} alt={alt || ''} fill className="object-cover" {...props} />
      </div>
    ),
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Back Button */}
      <div className="container mx-auto px-6 pt-24 pb-8">
        <Link
          href={`/${locale}/news`}
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {locale === 'fr' ? 'Retour aux actualités' : 'Back to news'}
        </Link>
      </div>

      {/* Article Header */}
      <div className="container mx-auto px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Category Badge */}
          <div className="mb-6">
            <span className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-medium">
              {article.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl lg:text-6xl font-light text-white mb-6 leading-tight">
            {article.title[lang]}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-zinc-800">
            {/* Author */}
            <div className="flex items-center gap-3">
              <Image
                src={article.author.avatar}
                alt={article.author.name}
                width={48}
                height={48}
                className="rounded-full"
              />
              <div>
                <div className="text-sm font-medium text-white">{article.author.name}</div>
                <div className="text-xs text-zinc-400">{article.author.role}</div>
              </div>
            </div>

            <div className="h-8 w-px bg-zinc-700" />

            {/* Date */}
            <div className="flex items-center gap-2 text-zinc-400">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                {new Date(article.date).toLocaleDateString(locale, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>

            {/* Read Time */}
            <div className="flex items-center gap-2 text-zinc-400">
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                {article.readTime} {locale === 'fr' ? 'min' : 'min read'}
              </span>
            </div>

            <div className="flex-1" />

            {/* Share Buttons */}
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-full hover:bg-zinc-800 transition-colors" title="Share">
                <Share2 className="w-5 h-5 text-zinc-400" />
              </button>
              <button className="p-2 rounded-full hover:bg-zinc-800 transition-colors" title="Bookmark">
                <Bookmark className="w-5 h-5 text-zinc-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <article className="prose prose-invert prose-lg max-w-none">
            <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </article>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="mt-16 pt-8 border-t border-zinc-800">
              <h3 className="text-sm font-medium text-zinc-500 mb-4">
                {locale === 'fr' ? 'Tags' : 'Tags'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-zinc-900/50 border border-zinc-800 rounded-full text-sm text-zinc-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
