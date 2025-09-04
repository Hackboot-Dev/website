// /workspaces/website/apps/web/app/docs/page.tsx
// Description: Documentation hub with product category cards
// Last modified: 2025-08-31
// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../contexts/LanguageContext';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import SophisticatedBackground from '../../components/animations/SophisticatedBackground';
import { useRevealAnimation, useStaggerReveal, useParallax } from '../../hooks/useAwwardsAnimation';
import ArrowUpRightIcon from '@heroicons/react/24/outline/ArrowUpRightIcon';
import {
  BookOpenIcon,
  ServerIcon,
  CpuChipIcon,
  GlobeAltIcon,
  CloudIcon,
  ArrowsRightLeftIcon,
  CircleStackIcon,
  GlobeEuropeAfricaIcon,
  DocumentTextIcon,
  FolderOpenIcon
} from '@heroicons/react/24/outline';

interface Category {
  id: string;
  name: { [key: string]: string };
  description: { [key: string]: string };
  icon: string;
  order: number;
  color: string;
  docCount?: number;
}

const iconMap: { [key: string]: React.ComponentType<any> } = {
  BookOpenIcon,
  ServerIcon,
  CpuChipIcon,
  GlobeAltIcon,
  CloudIcon,
  ArrowsRightLeftIcon,
  CircleStackIcon,
  GlobeEuropeAfricaIcon
};

export default function DocumentationPage() {
  const IS_PROD = process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_APP_ENV === 'production' || process.env.APP_ENV === 'production';
  if (IS_PROD) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <Header />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl text-white mb-2">403 – Accès interdit</h1>
          <p className="text-zinc-500">Documentation indisponible en production.</p>
        </div>
        <Footer />
      </div>
    );
  }
  const { language } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  
  // Animations
  const titleReveal = useRevealAnimation({ delay: 100 });
  const subtitleReveal = useRevealAnimation({ delay: 300 });
  const { containerRef: statsRef, visibleItems: statsVisible } = useStaggerReveal(4, 100);
  // Use actual categories length and also wait for loading=false
  const itemsForStagger = loading ? 0 : categories.length;
  const { containerRef: categoriesRef, visibleItems: categoriesVisible } = useStaggerReveal(itemsForStagger, 50);
  const geometricParallax = useParallax(0.3);

  // Fetch categories and count documents
  useEffect(() => {
    const fetchCategoriesAndCount = async () => {
      try {
        // Fetch structure
        const structureResponse = await fetch('/data/docs/structure.json');
        const structureData = await structureResponse.json();
        console.log('Structure data loaded:', structureData);
        
        // Count documents for each category
        const categoriesWithCount = await Promise.all(
          structureData.categories.map(async (category: Category) => {
            try {
              // Fetch list of files in this category
              const filesResponse = await fetch(`/api/docs/count?category=${category.id}&lang=${language}`);
              if (filesResponse.ok) {
                const { count } = await filesResponse.json();
                return { ...category, docCount: count };
              }
            } catch (error) {
              console.error(`Error counting docs for ${category.id}:`, error);
            }
            return { ...category, docCount: 0 };
          })
        );
        
        console.log('Categories with count:', categoriesWithCount);
        setCategories(categoriesWithCount);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesAndCount();
  }, [language]);

  // Get color classes for cards
  const getColorClasses = (color: string) => {
    const colors: { [key: string]: { bg: string; hover: string; icon: string } } = {
      cyan: {
        bg: 'from-cyan-500/10 to-transparent',
        hover: 'group-hover:from-cyan-500/20 group-hover:to-cyan-500/10',
        icon: 'group-hover:text-cyan-400'
      },
      purple: {
        bg: 'from-purple-500/10 to-transparent',
        hover: 'group-hover:from-purple-500/20 group-hover:to-purple-500/10',
        icon: 'group-hover:text-purple-400'
      },
      blue: {
        bg: 'from-blue-500/10 to-transparent',
        hover: 'group-hover:from-blue-500/20 group-hover:to-blue-500/10',
        icon: 'group-hover:text-blue-400'
      },
      green: {
        bg: 'from-green-500/10 to-transparent',
        hover: 'group-hover:from-green-500/20 group-hover:to-green-500/10',
        icon: 'group-hover:text-green-400'
      },
      indigo: {
        bg: 'from-indigo-500/10 to-transparent',
        hover: 'group-hover:from-indigo-500/20 group-hover:to-indigo-500/10',
        icon: 'group-hover:text-indigo-400'
      },
      amber: {
        bg: 'from-amber-500/10 to-transparent',
        hover: 'group-hover:from-amber-500/20 group-hover:to-amber-500/10',
        icon: 'group-hover:text-amber-400'
      },
      rose: {
        bg: 'from-rose-500/10 to-transparent',
        hover: 'group-hover:from-rose-500/20 group-hover:to-rose-500/10',
        icon: 'group-hover:text-rose-400'
      }
    };
    return colors[color] || colors.cyan;
  };

  const translations = {
    en: {
      label: "DOCUMENTATION CENTER",
      title: {
        1: "Complete documentation",
        2: "for all our products"
      },
      subtitle: "Explore comprehensive guides and tutorials for each product category.",
      stats: [
        { label: "PRODUCTS" },
        { label: "CATEGORIES" },
        { label: "LANGUAGES" },
        { label: "UPDATED DAILY" }
      ],
      articles: "articles",
      article: "article",
      noArticles: "Coming soon"
    },
    fr: {
      label: "CENTRE DE DOCUMENTATION",
      title: {
        1: "Documentation complète",
        2: "pour tous nos produits"
      },
      subtitle: "Explorez des guides et tutoriels complets pour chaque catégorie de produits.",
      stats: [
        { label: "PRODUITS" },
        { label: "CATÉGORIES" },
        { label: "LANGUES" },
        { label: "MIS À JOUR QUOTIDIENNEMENT" }
      ],
      articles: "articles",
      article: "article",
      noArticles: "Bientôt disponible"
    }
  };

  const t = translations[language as 'en' | 'fr'] || translations.en;

  // Calculate total docs
  const totalDocs = categories.reduce((sum, cat) => sum + (cat.docCount || 0), 0);

  return (
    <>
      <SophisticatedBackground />
      <div className="min-h-screen bg-zinc-950">
        {/* Subtle noise texture */}
        <div className="fixed inset-0 opacity-[0.015] bg-noise pointer-events-none" />
        
        <Header />
      
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center py-20 sm:py-24 overflow-hidden">
          {/* Geometric background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 right-1/3 w-px h-64 bg-gradient-to-b from-transparent via-zinc-700 to-transparent" />
            <div className="absolute bottom-1/3 left-1/4 w-48 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
            <div className="absolute inset-0 bg-grid opacity-[0.02]" />
            
            {/* Animated geometric shapes */}
            <div 
              ref={geometricParallax.elementRef as React.RefObject<HTMLDivElement>}
              style={geometricParallax.style}
              className="absolute top-1/3 right-1/4 w-3 h-3 bg-zinc-800 rounded-full animate-subtle-float"
            />
            <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-zinc-700 rounded-full animate-subtle-float" style={{ animationDelay: '2s' }} />
            <div className="absolute top-1/2 right-1/2 w-1 h-1 bg-zinc-600 rounded-full animate-subtle-float" style={{ animationDelay: '4s' }} />
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-7xl mx-auto">
              <div className="text-center">
                {/* Label */}
                <div className="mb-8">
                  <span className="text-xs tracking-[0.3em] text-zinc-500 font-mono uppercase">
                    {t.label}
                  </span>
                </div>
                
                {/* Title */}
                <div 
                  ref={titleReveal.elementRef as React.RefObject<HTMLDivElement>}
                  style={titleReveal.style}
                  className="mb-8"
                >
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight tracking-tight leading-[0.95]">
                    <span className="block text-white">
                      {t.title[1]}
                    </span>
                    <span className="block text-gradient-subtle mt-2">
                      {t.title[2]}
                    </span>
                  </h1>
                </div>

                {/* Subtitle */}
                <div 
                  ref={subtitleReveal.elementRef as React.RefObject<HTMLDivElement>}
                  style={subtitleReveal.style}
                  className="mb-12"
                >
                  <p className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed max-w-3xl mx-auto">
                    {t.subtitle}
                  </p>
                </div>

                {/* Stats */}
                <div ref={statsRef} className="flex justify-center gap-8 md:gap-16">
                  <div 
                    className="text-center"
                    style={{
                      opacity: statsVisible[0] ? 1 : 0,
                      transform: statsVisible[0] ? 'translateY(0)' : 'translateY(20px)',
                      transition: `all 600ms cubic-bezier(0.16, 1, 0.3, 1)`
                    }}
                  >
                    <div className="text-3xl font-extralight text-white mb-1">7</div>
                    <span className="text-[10px] tracking-[0.3em] text-zinc-600 font-mono uppercase">
                      {t.stats[0].label}
                    </span>
                  </div>
                  
                  <div 
                    className="text-center"
                    style={{
                      opacity: statsVisible[1] ? 1 : 0,
                      transform: statsVisible[1] ? 'translateY(0)' : 'translateY(20px)',
                      transition: `all 600ms cubic-bezier(0.16, 1, 0.3, 1) 100ms`
                    }}
                  >
                    <div className="text-3xl font-extralight text-white mb-1">{categories.length}</div>
                    <span className="text-[10px] tracking-[0.3em] text-zinc-600 font-mono uppercase">
                      {t.stats[1].label}
                    </span>
                  </div>
                  
                  <div 
                    className="text-center"
                    style={{
                      opacity: statsVisible[2] ? 1 : 0,
                      transform: statsVisible[2] ? 'translateY(0)' : 'translateY(20px)',
                      transition: `all 600ms cubic-bezier(0.16, 1, 0.3, 1) 200ms`
                    }}
                  >
                    <div className="text-3xl font-extralight text-white mb-1">2</div>
                    <span className="text-[10px] tracking-[0.3em] text-zinc-600 font-mono uppercase">
                      {t.stats[2].label}
                    </span>
                  </div>
                  
                  <div 
                    className="text-center"
                    style={{
                      opacity: statsVisible[3] ? 1 : 0,
                      transform: statsVisible[3] ? 'translateY(0)' : 'translateY(20px)',
                      transition: `all 600ms cubic-bezier(0.16, 1, 0.3, 1) 300ms`
                    }}
                  >
                    <div className="text-3xl font-extralight text-white mb-1">{totalDocs}</div>
                    <span className="text-[10px] tracking-[0.3em] text-zinc-600 font-mono uppercase">
                      {t.stats[3].label}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              {loading ? (
                <div className="flex justify-center items-center py-32">
                  <div className="relative">
                    <div className="w-12 h-12 border border-zinc-800 rounded-full" />
                    <div className="absolute inset-0 w-12 h-12 border border-zinc-600 rounded-full animate-spin border-t-transparent" />
                  </div>
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-32">
                  <p className="text-zinc-400">Aucune catégorie disponible</p>
                  <p className="text-zinc-500 text-sm mt-2">Vérifiez la console pour les erreurs</p>
                </div>
              ) : (
                <div ref={categoriesRef} className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {categories.sort((a, b) => a.order - b.order).map((category, idx) => {
                    const IconComponent = iconMap[category.icon] || FolderOpenIcon;
                    const categoryName = category.name[language as 'en' | 'fr'] || category.name.en;
                    const categoryDesc = category.description[language as 'en' | 'fr'] || category.description.en;
                    const colorClasses = getColorClasses(category.color);
                    const docCount = category.docCount || 0;
                    
                    return (
                      <div
                        key={category.id}
                        className="group relative"
                        style={{
                          opacity: categoriesVisible[idx] ? 1 : 0,
                          transform: categoriesVisible[idx] ? 'translateY(0)' : 'translateY(30px)',
                          transition: `all 600ms cubic-bezier(0.16, 1, 0.3, 1) ${idx * 50}ms`
                        }}
                        onMouseEnter={() => setHoveredCard(category.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                      >
                        <Link href={`/docs/${category.id}`}>
                          <div className="relative h-full p-6 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl hover:bg-zinc-900/70 hover:border-zinc-700 transition-all duration-300">
                            {/* Gradient overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses.bg} ${colorClasses.hover} rounded-xl pointer-events-none transition-all duration-300`} />
                            
                            {/* Icon */}
                            <div className="relative mb-4">
                              <IconComponent className={`w-8 h-8 text-zinc-500 ${colorClasses.icon} transition-colors duration-300`} />
                            </div>

                            {/* Title */}
                            <h3 className="relative text-lg font-light text-white mb-2 group-hover:text-white transition-colors">
                              {categoryName}
                            </h3>

                            {/* Description */}
                            <p className="relative text-xs text-zinc-500 mb-4 line-clamp-2 leading-relaxed">
                              {categoryDesc}
                            </p>

                            {/* Doc count */}
                            <div className="relative flex items-center justify-between">
                              <span className="text-xs text-zinc-600">
                                {docCount > 0 ? (
                                  <>
                                    {docCount} {docCount === 1 ? t.article : t.articles}
                                  </>
                                ) : (
                                  t.noArticles
                                )}
                              </span>
                              <ArrowUpRightIcon className={`w-4 h-4 text-zinc-700 transform transition-all duration-300 ${
                                hoveredCard === category.id ? 'translate-x-0.5 -translate-y-0.5 text-zinc-500' : ''
                              }`} />
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
