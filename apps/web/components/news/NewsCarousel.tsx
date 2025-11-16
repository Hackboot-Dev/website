'use client';

// components/news/NewsCarousel.tsx
// Description: Carousel component for news articles with auto-scroll
// Last modified: 2025-11-15

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import NewsCard from './NewsCard';

interface Article {
  id: string;
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
}

interface NewsCarouselProps {
  articles: Article[];
  locale: string;
  variant?: 'default' | 'compact';
  autoplay?: boolean;
  categoryColor?: string;
}

export default function NewsCarousel({
  articles,
  locale,
  variant = 'default',
  autoplay = false,
  categoryColor,
}: NewsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScroll);
      return () => scrollElement.removeEventListener('scroll', checkScroll);
    }
  }, [articles]);

  // Auto-scroll effect
  useEffect(() => {
    if (!autoplay || !scrollRef.current) return;

    let intervalId: NodeJS.Timeout;
    const scrollElement = scrollRef.current;

    const startAutoScroll = () => {
      intervalId = setInterval(() => {
        if (!scrollElement) return;

        const { scrollLeft, scrollWidth, clientWidth } = scrollElement;
        const maxScroll = scrollWidth - clientWidth;

        if (scrollLeft >= maxScroll - 10) {
          // Reached end, scroll back to start
          scrollElement.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Scroll one card width
          const cardWidth = variant === 'compact' ? 320 : 400;
          scrollElement.scrollBy({ left: cardWidth + 24, behavior: 'smooth' });
        }
      }, 5000); // Auto-scroll every 5 seconds
    };

    // Start auto-scroll after 2 seconds
    const timeoutId = setTimeout(startAutoScroll, 2000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [autoplay, variant]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;

    const scrollAmount = variant === 'compact' ? 320 + 24 : 400 + 24;
    const newScrollLeft =
      scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);

    scrollRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    });
  };

  if (articles.length === 0) {
    return (
      <div className="text-center py-16 text-zinc-500">
        {locale === 'fr' ? 'Aucun article disponible' : 'No articles available'}
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Navigation Buttons */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 rounded-full flex items-center justify-center text-white hover:bg-zinc-800 transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 rounded-full flex items-center justify-center text-white hover:bg-zinc-800 transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Carousel Container */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {articles.map((article, index) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex-shrink-0"
            style={{
              width: variant === 'compact' ? '320px' : '400px',
            }}
          >
            <NewsCard article={article} locale={locale} variant={variant} color={categoryColor} />
          </motion.div>
        ))}
      </div>

      {/* Scroll Indicator Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: Math.ceil(articles.length / 3) }).map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!scrollRef.current) return;
              const cardWidth = variant === 'compact' ? 320 : 400;
              const scrollTo = index * (cardWidth + 24) * 3;
              scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
            }}
            className="w-2 h-2 rounded-full bg-zinc-700 hover:bg-zinc-500 transition-colors"
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
