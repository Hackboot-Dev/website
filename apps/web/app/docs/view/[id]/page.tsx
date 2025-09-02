// /workspaces/website/apps/web/app/docs/view/[id]/page.tsx
// Description: Markdown document viewer page
// Last modified: 2025-08-28
// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '../../../../contexts/LanguageContext';
import Header from '../../../../components/layout/Header';
import Footer from '../../../../components/layout/Footer';
import SophisticatedBackground from '../../../../components/animations/SophisticatedBackground';
import { parseMarkdown } from '../../../../utils/markdown';
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
  const params = useParams();
  const router = useRouter();
  const { language } = useLanguage();
  const [doc, setDoc] = useState<DocContent | null>(null);
  const [parsedContent, setParsedContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const docId = params.id as string;
        const response = await fetch(`/api/docs/read?id=${docId}&lang=${language}`);
        
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
  }, [params.id, language]);

  const translations = {
    en: {
      backToList: 'Back to documentation',
      loading: 'Loading document...',
      error: 'Error loading document',
      tryAgain: 'Try again',
      readTime: 'min read',
      lastUpdated: 'Last updated',
      navigation: {
        home: 'Home',
        docs: 'Documentation'
      }
    },
    fr: {
      backToList: 'Retour à la documentation',
      loading: 'Chargement du document...',
      error: 'Erreur de chargement',
      tryAgain: 'Réessayer',
      readTime: 'min de lecture',
      lastUpdated: 'Dernière mise à jour',
      navigation: {
        home: 'Accueil',
        docs: 'Documentation'
      }
    }
  };

  const t = translations[language as 'en' | 'fr'] || translations.en;

  // Calculate read time
  const calculateReadTime = (content: string) => {
    const words = content.split(/\s+/).length;
    return Math.ceil(words / 200);
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
                <span className="text-white">
                  {doc?.title || '...'}
                </span>
              </nav>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 px-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {loading ? (
                <div className="py-32 text-center">
                  <div className="inline-block">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 border-2 border-zinc-700 border-t-cyan-500 rounded-full animate-spin" />
                      <span className="text-zinc-400">{t.loading}</span>
                    </div>
                  </div>
                </div>
              ) : error ? (
                <div className="py-32 text-center">
                  <DocumentTextIcon className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                  <h2 className="text-2xl text-zinc-400 mb-4">{t.error}</h2>
                  <p className="text-zinc-600 mb-8">{error}</p>
                  <button
                    onClick={() => router.push('/docs')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl transition-colors"
                  >
                    <ArrowLeftIcon className="w-4 h-4" />
                    {t.backToList}
                  </button>
                </div>
              ) : doc ? (
                <>
                  {/* Back button */}
                  <Link
                    href="/docs"
                    className="inline-flex items-center gap-2 text-zinc-500 hover:text-cyan-400 transition-colors mb-8"
                  >
                    <ArrowLeftIcon className="w-4 h-4" />
                    {t.backToList}
                  </Link>

                  {/* Document header */}
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

                  {/* Document content */}
                  <article 
                    className="prose prose-invert prose-zinc max-w-none
                      prose-headings:font-light prose-headings:text-white
                      prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
                      prose-p:text-zinc-400 prose-p:leading-relaxed
                      prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:text-cyan-300
                      prose-strong:text-white prose-strong:font-medium
                      prose-code:text-cyan-400 prose-code:bg-zinc-900 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                      prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800
                      prose-blockquote:border-l-cyan-500 prose-blockquote:text-zinc-400
                      prose-ul:text-zinc-400 prose-ol:text-zinc-400
                      prose-table:border-zinc-800 prose-th:bg-zinc-900 prose-th:text-white
                      prose-td:border-zinc-800 prose-td:text-zinc-400"
                    dangerouslySetInnerHTML={{ __html: parsedContent }}
                  />

                  {/* Footer navigation */}
                  <div className="mt-16 pt-8 border-t border-zinc-800/50">
                    <Link
                      href="/docs"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl transition-colors"
                    >
                      <ArrowLeftIcon className="w-4 h-4" />
                      {t.backToList}
                    </Link>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}