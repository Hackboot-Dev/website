'use client';

// components/news/NewsHero.tsx
// Description: Hero section for featured news article
// Last modified: 2025-11-15

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface NewsHeroProps {
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
}

export default function NewsHero({ article, locale }: NewsHeroProps) {
  const lang = locale as 'en' | 'fr';

  return (
    <div className="relative h-[85vh] min-h-[600px] overflow-hidden bg-zinc-950">
      {/* Background Image with Parallax */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent z-10" />
        <Image
          src={article.coverImage}
          alt={article.coverImageAlt[lang]}
          fill
          className="object-cover"
          priority
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-20 h-full flex items-end">
        <div className="container mx-auto px-6 pb-20">
          <div className="max-w-4xl">
            {/* Category Badge */}
            <motion.div
              className="inline-block mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-medium backdrop-blur-sm">
                {locale === 'fr' ? '✨ À la une' : '✨ Featured'}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-4xl lg:text-6xl xl:text-7xl font-light text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {article.title[lang]}
            </motion.h1>

            {/* Excerpt */}
            <motion.p
              className="text-lg lg:text-xl text-zinc-300 mb-8 leading-relaxed max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {article.excerpt[lang]}
            </motion.p>

            {/* Meta Info */}
            <motion.div
              className="flex flex-wrap items-center gap-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {/* Author */}
              <div className="flex items-center gap-3">
                <Image
                  src={article.author.avatar}
                  alt={article.author.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <div className="text-sm font-medium text-white">{article.author.name}</div>
                  <div className="text-xs text-zinc-400">{article.author.role}</div>
                </div>
              </div>

              <div className="h-6 w-px bg-zinc-700" />

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
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link
                href={`/${locale}/news/${article.slug}`}
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-zinc-950 rounded-lg font-medium hover:bg-zinc-100 transition-all hover:gap-4 group"
              >
                {locale === 'fr' ? 'Lire l\'article' : 'Read article'}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8, repeat: Infinity, repeatType: 'reverse' }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white/50 rounded-full animate-pulse" />
        </div>
      </motion.div>
    </div>
  );
}
