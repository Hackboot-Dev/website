'use client';

// /workspaces/website/apps/web/app/terms/page.tsx
// Description: Terms and Conditions page (FR/EN) rendered from Markdown with rich styling
// Last modified: 2025-09-02

import React, { useEffect, useState } from 'react';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import SophisticatedBackground from '../../../components/animations/SophisticatedBackground';
import { useLanguage } from '../../../contexts/LanguageContext';
import { parseMarkdown } from '../../../utils/markdown';

export default function TermsPage() {
  const { language } = useLanguage();
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const lang = (language === 'en' ? 'en' : 'fr');
        const resp = await fetch(`/data/legal/terms/${lang}.md`, { cache: 'no-store' });
        if (!resp.ok) {
          // fallback to FR
          const fr = await fetch('/data/legal/terms/fr.md', { cache: 'no-store' });
          if (!fr.ok) throw new Error('Unable to load terms');
          const md = await fr.text();
          const parsed = await parseMarkdown(md);
          setHtml(parsed.content);
        } else {
          const md = await resp.text();
          const parsed = await parseMarkdown(md);
          setHtml(parsed.content);
        }
      } catch (e: any) {
        setError(e?.message || 'Failed to load terms');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [language]);

  return (
    <div className="min-h-screen bg-zinc-950">
      <SophisticatedBackground />
      <div className="fixed inset-0 opacity-[0.015] bg-noise pointer-events-none" />
      <Header />

      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <span className="text-xs tracking-[0.3em] text-zinc-500 font-mono uppercase">{language === 'en' ? 'LEGAL' : 'LÉGAL'}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extralight text-white mb-4">
              {language === 'en' ? 'Terms of Use and Sale' : "Conditions d'utilisation et de vente"}
            </h1>
            <p className="text-zinc-500 mb-10">
              {language === 'en'
                ? 'These terms govern the use of VMCloud services and the conditions of sale. Please read them carefully.'
                : "Ces conditions régissent l'utilisation des services VMCloud ainsi que les conditions de vente. Veuillez les lire attentivement."}
            </p>

            {loading && (
              <div className="py-24 text-center">
                <div className="inline-block">
                  <div className="w-10 h-10 border-2 border-zinc-700 border-t-cyan-500 rounded-full animate-spin" />
                  <p className="mt-4 text-zinc-500">{language === 'en' ? 'Loading…' : 'Chargement…'}</p>
                </div>
              </div>
            )}

            {!loading && error && (
              <div className="py-24 text-center text-zinc-500">{error}</div>
            )}

            {!loading && !error && (
              <article className="doc-content doc-fade-in" dangerouslySetInnerHTML={{ __html: html }} />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

