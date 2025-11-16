'use client';

// components/news/NewsCard.tsx
// Description: Card component for displaying individual news articles
// Last modified: 2025-11-15

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';

interface NewsCardProps {
  article: {
    slug: string;
    category: string;
    date: string;
    author: {
      name: string;
      role: string;
      avatar: string;
    };
    readTime: number;
    tags: string[];
    title: {
      en: string;
      fr: string;
    };
    excerpt: {
      en: string;
      fr: string;
    };
    coverImage: string;
    coverImageAlt: {
      en: string;
      fr: string;
    };
  };
  locale: string;
  variant?: 'default' | 'compact';
  color?: string;
}

export default function NewsCard({ article, locale, variant = 'default', color }: NewsCardProps) {
  const lang = locale as 'en' | 'fr';
  const categoryColors: Record<string, string> = {
    cyan: 'cyan-500',
    purple: 'purple-500',
    blue: 'blue-500',
    green: 'green-500',
  };

  const accentColor = color ? categoryColors[color] || 'cyan-500' : 'cyan-500';

  return (
    <Link href={`/${locale}/news/${article.slug}`}>
      <motion.article
        className={`group relative h-full bg-zinc-900/30 border border-zinc-800/50 rounded-xl overflow-hidden hover:border-${accentColor}/50 transition-all duration-300`}
        whileHover={{ y: -4 }}
      >
        {/* Cover Image */}
        <div className={`relative overflow-hidden ${variant === 'compact' ? 'h-40' : 'h-56'}`}>
          <div className={`absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent z-10`} />
          <Image
            src={article.coverImage}
            alt={article.coverImageAlt[lang]}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Category Badge */}
          <div className="absolute top-4 left-4 z-20">
            <span className={`px-3 py-1 bg-${accentColor}/20 border border-${accentColor}/30 rounded-full text-${accentColor} text-xs font-medium backdrop-blur-sm`}>
              {article.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title */}
          <h3 className={`font-light text-white mb-3 line-clamp-2 group-hover:text-${accentColor} transition-colors ${variant === 'compact' ? 'text-lg' : 'text-xl'}`}>
            {article.title[lang]}
          </h3>

          {/* Excerpt */}
          {variant !== 'compact' && (
            <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{article.excerpt[lang]}</p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 mb-4">
            {/* Date */}
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>
                {new Date(article.date).toLocaleDateString(locale, {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>

            {/* Read Time */}
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{article.readTime} min</span>
            </div>

            {/* Tags Count */}
            {article.tags.length > 0 && (
              <div className="flex items-center gap-1">
                <Tag className="w-3 h-3" />
                <span>{article.tags.length}</span>
              </div>
            )}
          </div>

          {/* Author */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                src={article.author.avatar}
                alt={article.author.name}
                width={32}
                height={32}
                className="rounded-full"
              />
              <div>
                <div className="text-xs font-medium text-white">{article.author.name}</div>
                <div className="text-xs text-zinc-500">{article.author.role}</div>
              </div>
            </div>

            {/* Read More Arrow */}
            <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-${accentColor}/10 group-hover:bg-${accentColor}/20 transition-colors`}>
              <ArrowRight className={`w-4 h-4 text-${accentColor} group-hover:translate-x-0.5 transition-transform`} />
            </div>
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-${accentColor}/5 via-transparent to-transparent`} />
      </motion.article>
    </Link>
  );
}
