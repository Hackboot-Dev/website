// /workspaces/website/apps/web/app/docs/[category]/page.tsx
// Description: Category page listing docs with quick navigation and first-article CTA
// Last modified: 2025-09-02
// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import SophisticatedBackground from '../../../components/animations/SophisticatedBackground';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useRevealAnimation, useStaggerReveal } from '../../../hooks/useAwwardsAnimation';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ClockIcon,
  ChevronRightIcon,
  FolderOpenIcon
} from '@heroicons/react/24/outline';

interface DocItem {
  id: string;
  title: string;
  description: string;
  category: string;
  readTime: number;
  lastModified: string;
  order?: number;
  tags?: string[];
}

interface CategoryInfo {
  id: string;
  name: Record<string, string>;
  description: Record<string, string>;
  icon: string;
  order: number;
  color: string;
}

const iconMap: { [key: string]: React.ComponentType<any> } = {
  // Optional: Fallback only for header icon if needed
  FolderOpenIcon
};

export default function CategoryDocsPage() {
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
  const params = useParams();
  const router = useRouter();
  const { language } = useLanguage();

  const [categoryInfo, setCategoryInfo] = useState<CategoryInfo | null>(null);
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const labelReveal = useRevealAnimation({ delay: 50 });
  const titleReveal = useRevealAnimation({ delay: 150 });
  const { containerRef: listRef, visibleItems } = useStaggerReveal(loading ? 0 : docs.length, 60);

  const t = useMemo(() => ({
    en: {
      back: 'Back to documentation',
      read: 'Read',
      articles: 'articles',
      startHere: 'Start with first article',
      updated: 'Last updated',
      notFound: 'No articles available in this category',
    },
    fr: {
      back: 'Retour à la documentation',
      read: 'Lire',
      articles: 'articles',
      startHere: 'Commencer par le premier article',
      updated: 'Dernière mise à jour',
      notFound: 'Aucun article disponible dans cette catégorie',
    }
  })[language as 'en' | 'fr'] || {
    back: 'Back to documentation', read: 'Read', articles: 'articles', startHere: 'Start with first article', updated: 'Last updated', notFound: 'No articles available in this category'
  }, [language]);

  // Load category structure to fetch localized name/description
  useEffect(() => {
    const cat = params.category as string;
    const load = async () => {
      try {
        const resp = await fetch('/data/docs/structure.json');
        const data = await resp.json();
        const info = (data.categories as CategoryInfo[]).find(c => c.id === cat) || null;
        setCategoryInfo(info);
      } catch (e) {
        // Non bloquant
      }
    };
    if (cat) load();
  }, [params.category]);

  // Load docs for category using API
  useEffect(() => {
    const cat = params.category as string;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/docs/list?category=${cat}&lang=${language}`);
        if (!res.ok) throw new Error('Failed to load documents');
        const { documents } = await res.json();
        setDocs(documents || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error');
      } finally {
        setLoading(false);
      }
    };
    if (params.category) run();
  }, [params.category, language]);

  const categoryName = categoryInfo?.name?.[language as 'en' | 'fr'] || categoryInfo?.name?.en || (params.category as string);
  const categoryDesc = categoryInfo?.description?.[language as 'en' | 'fr'] || categoryInfo?.description?.en || '';

  const openFirstDoc = () => {
    if (docs.length === 0) return;
    router.push(`/docs/view/${docs[0].id}?category=${params.category}`);
  };

  return (
    <>
      <SophisticatedBackground />
      <div className="min-h-screen bg-zinc-950">
        <div className="fixed inset-0 opacity-[0.015] bg-noise pointer-events-none" />

        <Header />

        {/* Breadcrumb */}
        <section className="py-8 border-b border-zinc-900/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <nav className="flex items-center gap-2 text-sm">
                <Link href="/" className="text-zinc-600 hover:text-zinc-400 transition-colors">Accueil</Link>
                <ChevronRightIcon className="w-4 h-4 text-zinc-700" />
                <Link href="/docs" className="text-zinc-600 hover:text-zinc-400 transition-colors">Documentation</Link>
                <ChevronRightIcon className="w-4 h-4 text-zinc-700" />
                <span className="text-white">{categoryName}</span>
              </nav>
            </div>
          </div>
        </section>

        {/* Header */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              {/* Label */}
              <div ref={labelReveal.elementRef as React.RefObject<HTMLDivElement>} style={labelReveal.style}>
                <span className="text-xs tracking-[0.3em] text-zinc-500 font-mono uppercase">{categoryInfo ? 'CATÉGORIE' : ''}</span>
              </div>

              {/* Title */}
              <div ref={titleReveal.elementRef as React.RefObject<HTMLDivElement>} style={titleReveal.style} className="mt-3 mb-4">
                <h1 className="text-3xl sm:text-4xl font-extralight text-white">{categoryName}</h1>
              </div>

              {categoryDesc && (
                <p className="text-zinc-400 max-w-3xl">{categoryDesc}</p>
              )}

              <div className="mt-8 flex items-center gap-4">
                <button
                  onClick={() => router.push('/docs')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg transition-colors"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                  {t.back}
                </button>

                {docs.length > 0 && (
                  <button
                    onClick={openFirstDoc}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white text-zinc-950 rounded-lg hover:bg-zinc-100 transition-colors"
                  >
                    {t.startHere}
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Docs list with sidebar */}
        <section className="pb-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10">
              {/* Sidebar listing all docs */}
              <aside className="hidden lg:block lg:col-span-4">
                <div className="sticky top-24">
                  <div className="text-xs text-zinc-500 mb-2">Tous les articles</div>
                  <nav className="border border-zinc-800 rounded-lg divide-y divide-zinc-800 overflow-hidden">
                    {docs.map(d => (
                      <Link
                        key={d.id}
                        href={`/docs/view/${d.id}?category=${params.category}`}
                        className="block px-3 py-2 text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
                      >
                        {d.title}
                      </Link>
                    ))}
                  </nav>
                </div>
              </aside>

              {/* Main cards list */}
              <div className="lg:col-span-8">
                {loading ? (
                  <div className="py-24 text-center">
                    <div className="inline-block">
                      <div className="w-10 h-10 border-2 border-zinc-700 border-t-cyan-500 rounded-full animate-spin" />
                    </div>
                  </div>
                ) : docs.length === 0 ? (
                  <div className="py-24 text-center text-zinc-500">{t.notFound}</div>
                ) : (
                  <div ref={listRef} className="grid sm:grid-cols-2 gap-6">
                    {docs.map((doc, idx) => (
                      <div
                        key={doc.id}
                        className="group p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900/70 transition-all duration-300"
                        style={{
                          opacity: visibleItems[idx] ? 1 : 0,
                          transform: visibleItems[idx] ? 'translateY(0)' : 'translateY(30px)',
                          transition: `all 600ms cubic-bezier(0.16, 1, 0.3, 1) ${idx * 60}ms`
                        }}
                      >
                        <h3 className="text-white font-light text-lg mb-2">{doc.title}</h3>
                        <p className="text-xs text-zinc-500 mb-4 line-clamp-2">{doc.description}</p>
                        <div className="flex items-center justify-between text-xs text-zinc-600">
                          <span className="inline-flex items-center gap-1"><ClockIcon className="w-4 h-4" />{doc.readTime} min</span>
                          <span>{t.updated}: {new Date(doc.lastModified).toLocaleDateString()}</span>
                        </div>
                        <div className="mt-4 flex items-center justify-end">
                          <Link
                            href={`/docs/view/${doc.id}?category=${params.category}`}
                            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300"
                          >
                            {t.read}
                            <ChevronRightIcon className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
