'use client';

// /workspaces/website/apps/web/app/legal/aup/page.tsx
// Description: Acceptable Use Policy page (FR/EN) rendered from Markdown with rich styling
// Last modified: 2025-09-03

import React, { useEffect, useState } from 'react';
import Header from '../../../../components/layout/Header';
import Footer from '../../../../components/layout/Footer';
import SophisticatedBackground from '../../../../components/animations/SophisticatedBackground';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { parseMarkdown } from '../../../../utils/markdown';

export default function LegalAUPPage() {
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
        const resp = await fetch(`/data/legal/aup/${lang}.md`, { cache: 'no-store' });
        if (!resp.ok) {
          // fallback to FR
          const fr = await fetch('/data/legal/aup/fr.md', { cache: 'no-store' });
          if (!fr.ok) throw new Error('Unable to load AUP');
          const md = await fr.text();
          const parsed = await parseMarkdown(md);
          setHtml(parsed.content);
        } else {
          const md = await resp.text();
          const parsed = await parseMarkdown(md);
          setHtml(parsed.content);
        }
      } catch (e: any) {
        setError(e?.message || 'Failed to load AUP');
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
              {language === 'en' ? 'Acceptable Use Policy (AUP)' : "Politique d'usage acceptable (AUP)"}
            </h1>
            <p className="text-zinc-500 mb-10">
              {language === 'en'
                ? 'Rules and restrictions governing the use of VMCloud services. Prohibited activities and enforcement procedures.'
                : "Règles et restrictions régissant l'utilisation des services VMCloud. Activités interdites et procédures d'application."}
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