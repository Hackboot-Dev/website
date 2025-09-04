// /workspaces/website/apps/web/app/docs/view/[id]/page.tsx
// Description: Document viewer page with navigation
// Last modified: 2025-09-02
// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '../../../../contexts/LanguageContext';
import Header from '../../../../components/layout/Header';
import Footer from '../../../../components/layout/Footer';
import SophisticatedBackground from '../../../../components/animations/SophisticatedBackground';
import { parseMarkdown, copyToClipboard } from '../../../../utils/markdown';
import {
  ArrowLeftIcon,
  ClockIcon,
  DocumentTextIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

interface DocContent {
  id: string;
  title: string;
  description?: string;
  content: string;
  language: string;
  fallback?: boolean;
}

export default function DocumentViewerPage() {
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
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  
  const [doc, setDoc] = useState<DocContent | null>(null);
  const [parsedContent, setParsedContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryDocs, setCategoryDocs] = useState<Array<{ id: string; title: string }>>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [filter, setFilter] = useState('');

  // Load document
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const docId = params.id as string;
        const cat = searchParams?.get('category');
        const qs = new URLSearchParams({ id: docId, lang: String(language) });
        if (cat) qs.set('category', cat);
        const response = await fetch(`/api/docs/read?${qs.toString()}`);
        
        if (!response.ok) {
          throw new Error('Document not found');
        }
        
        const data = await response.json();
        setDoc(data);
        
        // Parse markdown to HTML
        const parsed = await parseMarkdown(data.content);
        setParsedContent(parsed.content);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load document');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchDocument();
    }
  }, [params.id, language, searchParams]);

  // Load category docs for navigation
  useEffect(() => {
    const cat = searchParams?.get('category');
    const docId = params.id as string;
    if (!cat) {
      setCategoryDocs([]);
      setCurrentIndex(-1);
      return;
    }
    
    const run = async () => {
      try {
        const qs = new URLSearchParams({ category: String(cat), lang: String(language) });
        const res = await fetch(`/api/docs/list?${qs.toString()}`);
        if (!res.ok) return;
        const data = await res.json();
        const docs = (data.documents || []).map((d: any) => ({ id: d.id, title: d.title }));
        setCategoryDocs(docs);
        const idx = docs.findIndex((d: any) => d.id === docId);
        setCurrentIndex(idx);
      } catch {
        // silent
      }
    };
    run();
  }, [searchParams, params.id, language]);

  // Enable copy-to-clipboard on code blocks
  useEffect(() => {
    const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('button.code-copy'));
    if (buttons.length === 0) return;
    const handlers: Array<() => void> = [];
    buttons.forEach((btn) => {
      const onClick = async () => {
        const raw = btn.getAttribute('data-code') || '';
        try {
          await copyToClipboard(decodeURIComponent(raw));
          const original = btn.innerHTML;
          btn.innerHTML = '<span class="text-green-400 text-xs">Copié ✓</span>';
          setTimeout(() => { btn.innerHTML = original; }, 1200);
        } catch {
          // noop
        }
      };
      btn.addEventListener('click', onClick);
      handlers.push(() => btn.removeEventListener('click', onClick));
    });
    return () => { handlers.forEach((off) => off()); };
  }, [parsedContent]);

  const translations = {
    en: {
      backToList: 'Back to documentation',
      loading: 'Loading document...',
      error: 'Error loading document',
      readTime: 'min read',
      navigation: { home: 'Home', docs: 'Documentation' }
    },
    fr: {
      backToList: 'Retour à la documentation',
      loading: 'Chargement du document...',
      error: 'Erreur de chargement',
      readTime: 'min de lecture',
      navigation: { home: 'Accueil', docs: 'Documentation' }
    }
  };

  const t = translations[language as 'en' | 'fr'] || translations.en;

  const calculateReadTime = (content: string) => {
    const words = content.split(/\s+/).length;
    return Math.ceil(words / 200);
  };

  const catParam = searchParams?.get('category') || '';
  const backHref = catParam ? `/docs/${encodeURIComponent(catParam)}` : '/docs';
  const backLabel = (() => {
    if ((language as 'en' | 'fr') === 'fr') {
      return catParam ? 'Retour à la catégorie' : 'Retour à la documentation';
    }
    return catParam ? 'Back to category' : 'Back to documentation';
  })();
  const buildDocUrl = (id: string) => {
    return `/docs/view/${id}${catParam ? '?category=' + encodeURIComponent(catParam) : ''}`;
  };
  
  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      const prev = categoryDocs[currentIndex - 1];
      router.push(buildDocUrl(prev.id));
    }
  }, [currentIndex, categoryDocs, router, buildDocUrl]);

  const goNext = useCallback(() => {
    if (currentIndex >= 0 && currentIndex < categoryDocs.length - 1) {
      const next = categoryDocs[currentIndex + 1];
      router.push(buildDocUrl(next.id));
    }
  }, [currentIndex, categoryDocs, router, buildDocUrl]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goPrev();
      } else if (e.key === 'ArrowRight') {
        goNext();
      }
    };
    
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goPrev, goNext]);

  if (loading) {
    return (
      <div>
        <SophisticatedBackground />
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-zinc-700 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-zinc-400">{t.loading}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !doc) {
    return (
      <div>
        <SophisticatedBackground />
        <div className="min-h-screen bg-zinc-950">
          <Header />
          <div className="container mx-auto px-4 py-32 text-center">
            <DocumentTextIcon className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
            <h2 className="text-2xl text-zinc-400 mb-4">{t.error}</h2>
            <p className="text-zinc-600 mb-8">{error}</p>
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              {backLabel}
            </Link>
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div>
      <SophisticatedBackground />
      <div className="min-h-screen bg-zinc-950">
        <div className="fixed inset-0 opacity-[0.015] bg-noise pointer-events-none" />
        <Header />

        <section className="py-8 border-b border-zinc-900/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <nav className="flex items-center gap-2 text-sm">
                <Link href="/" className="text-zinc-600 hover:text-zinc-400 transition-colors">
                  {t.navigation.home}
                </Link>
                <ChevronRightIcon className="w-4 h-4 text-zinc-700" />
                <Link href="/docs" className="text-zinc-600 hover:text-zinc-400 transition-colors">
                  {t.navigation.docs}
                </Link>
                <ChevronRightIcon className="w-4 h-4 text-zinc-700" />
                <span className="text-white">{doc.title}</span>
              </nav>
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10">
              {/* Sidebar: category docs navigation */}
              {categoryDocs.length > 0 && currentIndex >= 0 && (
                <aside className="hidden lg:block lg:col-span-4">
                  <div className="sticky top-24">
                    <div className="text-xs text-zinc-500 mb-2">{(language as 'en' | 'fr') === 'fr' ? 'Articles de la catégorie' : 'Category articles'}</div>
                    <div className="mb-3">
                      <input
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        placeholder={(language as 'en' | 'fr') === 'fr' ? 'Filtrer...' : 'Filter...'}
                        className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg outline-none focus:border-zinc-600 placeholder:text-zinc-600"
                      />
                    </div>
                    <nav className="border border-zinc-800 rounded-lg divide-y divide-zinc-800 overflow-hidden">
                      {categoryDocs
                        .filter(d => d.title.toLowerCase().includes(filter.toLowerCase()))
                        .map(d => {
                          const active = d.id === (params.id as string);
                          return (
                            <Link
                              key={d.id}
                              href={buildDocUrl(d.id)}
                              className={`block px-3 py-2 text-sm transition-colors ${
                                active
                                  ? 'bg-zinc-900 text-zinc-200'
                                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                              }`}
                            >
                              {d.title}
                            </Link>
                          );
                        })}
                    </nav>
                  </div>
                </aside>
              )}

              {/* Main content */}
              <div className="lg:col-span-8">

              {currentIndex >= 0 && categoryDocs.length > 1 && (
                <div className="mb-8 flex items-center justify-between text-sm">
                  <button
                    disabled={currentIndex === 0}
                    onClick={goPrev}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                      currentIndex === 0 
                        ? 'border-zinc-900 text-zinc-700 cursor-not-allowed' 
                        : 'border-zinc-800 hover:bg-zinc-900 text-zinc-400'
                    }`}
                  >
                    <ArrowLeftIcon className="w-4 h-4" />
                    {currentIndex > 0 ? categoryDocs[currentIndex - 1]?.title : 'Previous'}
                  </button>
                  
                  <span className="text-zinc-600">
                    {currentIndex + 1} / {categoryDocs.length}
                  </span>
                  
                  <button
                    disabled={currentIndex === categoryDocs.length - 1}
                    onClick={goNext}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                      currentIndex === categoryDocs.length - 1
                        ? 'border-zinc-900 text-zinc-700 cursor-not-allowed'
                        : 'border-zinc-800 hover:bg-zinc-900 text-zinc-400'
                    }`}
                  >
                    {currentIndex < categoryDocs.length - 1 ? categoryDocs[currentIndex + 1]?.title : 'Next'}
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                </div>
              )}

              <Link
                href={backHref}
                className="inline-flex items-center gap-2 text-zinc-500 hover:text-cyan-400 transition-colors mb-8"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                {backLabel}
              </Link>

              <header className="mb-12 pb-8 border-b border-zinc-800/50">
                <h1 className="text-4xl md:text-5xl font-extralight text-white mb-6">
                  {doc.title}
                </h1>
                
                {doc.description && (
                  <p className="text-lg text-zinc-400 mb-6">
                    {doc.description}
                  </p>
                )}

                <div className="flex items-center gap-6 text-sm text-zinc-500">
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-4 h-4" />
                    <span>{calculateReadTime(doc.content)} {t.readTime}</span>
                  </div>
                  {doc.fallback && (
                    <div className="px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-xs">
                      {doc.language === 'en' ? 'English version' : 'Version anglaise'}
                    </div>
                  )}
                </div>
              </header>

              <article className="doc-content doc-fade-in max-w-none" dangerouslySetInnerHTML={{ __html: parsedContent }} />

              <div className="mt-16 pt-8 border-t border-zinc-800/50">
                <Link
                  href={backHref}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl transition-colors"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                  {backLabel}
                </Link>
              </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
