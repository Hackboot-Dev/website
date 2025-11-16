'use client';

// apps/web/app/[locale]/news/NewsPageClient.tsx
// Description: Client component for news page with category carousels
// Last modified: 2025-11-15

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';
import NewsHero from '../../../components/news/NewsHero';
import NewsCarousel from '../../../components/news/NewsCarousel';
import NewsCategoryFilter from '../../../components/news/NewsCategoryFilter';
import { ArrowRight, TrendingUp, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface Article {
  id: string;
  slug: string;
  category: string;
  featured: boolean;
  priority: number;
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

interface Category {
  id: string;
  slug: string;
  name: {
    en: string;
    fr: string;
  };
  description: {
    en: string;
    fr: string;
  };
  color: string;
}

export default function NewsPageClient({ locale }: { locale: string }) {
  const { t } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load articles and categories
    const loadData = async () => {
      try {
        const response = await fetch('/content/news/articles.json');
        const data = await response.json();
        setArticles(data.articles);
        setCategories(data.categories);
      } catch (error) {
        console.error('Failed to load news data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getFeaturedArticles = () => {
    return articles
      .filter((a) => a.featured)
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 3);
  };

  const getArticlesByCategory = (categoryId: string) => {
    if (categoryId === 'all') {
      return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    return articles
      .filter((a) => a.category === categoryId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getTrendingArticles = () => {
    // Les articles avec le plus de tags ou les plus récents featured
    return articles
      .filter((a) => a.featured)
      .sort((a, b) => b.tags.length - a.tags.length)
      .slice(0, 4);
  };

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

  const featuredArticles = getFeaturedArticles();

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Section with Featured Article */}
      {featuredArticles.length > 0 && (
        <NewsHero article={featuredArticles[0]} locale={locale} />
      )}

      {/* Main Content */}
      <div className="relative pt-20 pb-32">
        {/* Category Filter */}
        <div className="container mx-auto px-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <NewsCategoryFilter
              categories={[
                { id: 'all', name: { en: 'All News', fr: 'Toutes les Actualités' }, color: 'white' },
                ...categories,
              ]}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              locale={locale}
            />
          </motion.div>
        </div>

        {/* Latest News - All Categories or Filtered */}
        <div className="container mx-auto px-6 mb-24">
          <div className="flex items-center justify-between mb-8">
            <div>
              <motion.h2
                className="text-3xl lg:text-4xl font-light text-white mb-2"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                {selectedCategory === 'all' ? (
                  locale === 'fr' ? 'Dernières Actualités' : 'Latest News'
                ) : (
                  categories.find((c) => c.id === selectedCategory)?.name[locale as 'en' | 'fr']
                )}
              </motion.h2>
              <motion.p
                className="text-zinc-400"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                {selectedCategory === 'all'
                  ? locale === 'fr'
                    ? 'Toutes nos actualités, mises à jour et annonces'
                    : 'All our news, updates, and announcements'
                  : categories.find((c) => c.id === selectedCategory)?.description[
                      locale as 'en' | 'fr'
                    ]}
              </motion.p>
            </div>

            {selectedCategory !== 'all' && (
              <Link
                href={`/${locale}/news`}
                className="text-sm text-zinc-400 hover:text-white flex items-center group transition-colors"
                onClick={() => setSelectedCategory('all')}
              >
                {locale === 'fr' ? 'Tout voir' : 'View all'}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>

          <NewsCarousel
            articles={getArticlesByCategory(selectedCategory)}
            locale={locale}
            autoplay={selectedCategory === 'all'}
          />
        </div>

        {/* Trending Articles */}
        {selectedCategory === 'all' && (
          <div className="container mx-auto px-6 mb-24">
            <div className="flex items-center justify-between mb-8">
              <div>
                <motion.div
                  className="flex items-center mb-2"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <TrendingUp className="w-6 h-6 text-cyan-500 mr-3" />
                  <h2 className="text-3xl lg:text-4xl font-light text-white">
                    {locale === 'fr' ? 'Tendances' : 'Trending'}
                  </h2>
                </motion.div>
                <motion.p
                  className="text-zinc-400 ml-9"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  {locale === 'fr'
                    ? 'Les articles les plus populaires et innovants'
                    : 'Most popular and innovative articles'}
                </motion.p>
              </div>
            </div>

            <NewsCarousel articles={getTrendingArticles()} locale={locale} variant="compact" />
          </div>
        )}

        {/* Category Sections - Only when "All" is selected */}
        {selectedCategory === 'all' &&
          categories.map((category, index) => {
            const categoryArticles = getArticlesByCategory(category.id);
            if (categoryArticles.length === 0) return null;

            return (
              <div key={category.id} className="container mx-auto px-6 mb-24">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <motion.h2
                      className="text-3xl lg:text-4xl font-light text-white mb-2"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                    >
                      {category.name[locale as 'en' | 'fr']}
                    </motion.h2>
                    <motion.p
                      className="text-zinc-400"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 }}
                    >
                      {category.description[locale as 'en' | 'fr']}
                    </motion.p>
                  </div>

                  <button
                    onClick={() => setSelectedCategory(category.id)}
                    className="text-sm text-zinc-400 hover:text-white flex items-center group transition-colors"
                  >
                    {locale === 'fr' ? 'Tout voir' : 'View all'}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                <NewsCarousel
                  articles={categoryArticles.slice(0, 6)}
                  locale={locale}
                  categoryColor={category.color}
                />
              </div>
            );
          })}

        {/* CTA Section */}
        <div className="container mx-auto px-6">
          <motion.div
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-blue-500/10 border border-zinc-800/50 p-12 lg:p-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                  backgroundSize: '32px 32px',
                }}
              />
            </div>

            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>

              <h2 className="text-3xl lg:text-4xl font-light text-white mb-4">
                {locale === 'fr' ? 'Restez Informé' : 'Stay Informed'}
              </h2>
              <p className="text-lg text-zinc-400 mb-8">
                {locale === 'fr'
                  ? 'Abonnez-vous à notre newsletter pour recevoir les dernières actualités, mises à jour produits et insights techniques.'
                  : 'Subscribe to our newsletter to receive the latest news, product updates, and technical insights.'}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder={locale === 'fr' ? 'Votre email' : 'Your email'}
                  className="flex-1 px-6 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <button className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-cyan-500/20 transition-all">
                  {locale === 'fr' ? "S'abonner" : 'Subscribe'}
                </button>
              </div>

              <p className="text-xs text-zinc-500 mt-4">
                {locale === 'fr'
                  ? "Pas de spam. Désabonnez-vous à tout moment. Nous respectons votre vie privée."
                  : 'No spam. Unsubscribe at any time. We respect your privacy.'}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
