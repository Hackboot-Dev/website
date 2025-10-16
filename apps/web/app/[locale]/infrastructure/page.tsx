'use client';

import React, { useEffect, useState, useCallback } from 'react';
import './infrastructure.css';
import {
  ServerIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  CircleStackIcon,
  CpuChipIcon,
  CloudArrowUpIcon,
  BoltIcon,
  LockClosedIcon,
  CommandLineIcon,
  ChartBarIcon,
  CubeIcon,
  WrenchScrewdriverIcon,
  SignalIcon,
  FingerPrintIcon,
  KeyIcon,
  DocumentCheckIcon
} from '@heroicons/react/24/outline';
import Badge from '../../../components/ui/Badge';
import Link from 'next/link';
import { useLanguage } from '../../../contexts/LanguageContext';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import SophisticatedBackground from '../../../components/animations/SophisticatedBackground';
import { useParallax } from '../../../hooks/useAwwardsAnimation';

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const pillarKeys = ['fabric', 'sovereignty', 'density', 'observability'] as const;
const blueprintKeys = ['controlPlane', 'compute', 'gpu', 'storage'] as const;
const networkKeys = ['edge', 'peering', 'security'] as const;
const dataKeys = ['persistence', 'protection', 'recovery'] as const;
const operationsKeys = ['automation', 'observability', 'delivery'] as const;
const safeguardKeys = ['physical', 'network', 'compliance', 'encryption'] as const;

const pillarIconMap: Record<(typeof pillarKeys)[number], IconType> = {
  fabric: CommandLineIcon,
  sovereignty: ShieldCheckIcon,
  density: CpuChipIcon,
  observability: ChartBarIcon
};

const blueprintIconMap: Record<(typeof blueprintKeys)[number], IconType> = {
  controlPlane: ServerIcon,
  compute: CubeIcon,
  gpu: CpuChipIcon,
  storage: CircleStackIcon
};

const networkIconMap: Record<(typeof networkKeys)[number], IconType> = {
  edge: GlobeAltIcon,
  peering: SignalIcon,
  security: ShieldCheckIcon
};

const dataIconMap: Record<(typeof dataKeys)[number], IconType> = {
  persistence: CircleStackIcon,
  protection: LockClosedIcon,
  recovery: CloudArrowUpIcon
};

const operationsIconMap: Record<(typeof operationsKeys)[number], IconType> = {
  automation: WrenchScrewdriverIcon,
  observability: ChartBarIcon,
  delivery: BoltIcon
};

const safeguardIconMap: Record<(typeof safeguardKeys)[number], IconType> = {
  physical: FingerPrintIcon,
  network: KeyIcon,
  compliance: DocumentCheckIcon,
  encryption: LockClosedIcon
};

const gradientAccent = 'from-cyan-500/20 via-purple-500/10 to-sky-500/10';

function useInView(options = {}) {
  const [ref, setRef] = useState<Element | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
        ...options
      }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, options]);

  return [setRef, inView] as const;
}

export default function InfrastructurePage() {
  const { language } = useLanguage();
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [mounted, setMounted] = useState(false);
  const geometricParallax = useParallax(0.3);

  const [heroRef, heroInView] = useInView();
  const [pillarsRef, pillarsInView] = useInView();
  const [blueprintRef, blueprintInView] = useInView();
  const [networkRef, networkInView] = useInView();
  const [dataRef, dataInView] = useInView();
  const [operationsRef, operationsInView] = useInView();
  const [securityRef, securityInView] = useInView();
  const [ctaRef, ctaInView] = useInView();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const locale = language || 'fr';
        const trans = await import(`../../../locales/${locale}/infrastructure.json`);
        setTranslations(trans.infrastructure || trans.default?.infrastructure || {});
      } catch (error) {
        try {
          const frenchTrans = await import(`../../../locales/fr/infrastructure.json`);
          setTranslations(frenchTrans.infrastructure || frenchTrans.default?.infrastructure || {});
        } catch (fallbackError) {
          console.error('Failed to load translations', fallbackError);
          setTranslations({});
        }
      }
    };
    loadTranslations();
  }, [language]);

  const t = useCallback(<T = string>(key: string, fallback?: T) => {
    const keys = key.split('.');
    let value: any = translations;
    for (const k of keys) {
      value = value?.[k];
    }
    if (value === undefined || value === null || value === '') {
      return (fallback ?? (key as unknown as T)) as T;
    }
    return value as T;
  }, [translations]);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <SophisticatedBackground />
      <div className="min-h-screen bg-zinc-950">
        <div className="fixed inset-0 opacity-[0.015] bg-noise pointer-events-none" />

        <Header />

        <main className="relative">
          <section className="relative min-h-[70vh] sm:min-h-[80vh] flex items-center py-24 sm:py-32 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-1/3 right-1/4 w-px h-32 bg-gradient-to-b from-transparent via-zinc-700 to-transparent" />
              <div className="absolute bottom-1/3 left-1/4 w-24 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
              <div className="absolute inset-0 bg-grid opacity-[0.02]" />
              <div
                ref={geometricParallax.elementRef}
                style={geometricParallax.style}
                className="absolute top-1/4 left-1/6 w-2 h-2 bg-zinc-800 rounded-full animate-subtle-float"
              />
              <div className="absolute bottom-1/4 right-1/6 w-1 h-1 bg-zinc-700 rounded-full animate-subtle-float" style={{ animationDelay: '2s' }} />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div
                ref={heroRef}
                className={`max-w-4xl mx-auto text-center ${heroInView ? 'animate-fade-in-up' : 'opacity-0'}`}
              >
                <Badge variant="outline" className="mb-6 inline-flex items-center justify-center">
                  {t('hero.badge', 'Infrastructure Cloud Premium')}
                </Badge>
                <p className="text-zinc-500 text-sm mb-4 italic">
                  {t('hero.evolution', 'Architecture propriétaire conçue pour la performance déterministe')}
                </p>
                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-light text-white mb-6 leading-tight">
                  {t('hero.title', 'Infrastructure Technique')}
                  <br />
                  <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent animate-gradient-text">
                    {t('hero.subtitle', 'Contrôle souverain de bout en bout')}
                  </span>
                </h1>
                <p className="text-zinc-400 text-base sm:text-lg max-w-3xl mx-auto mb-8">
                  {t('hero.description', 'Plateforme cloud européenne conçue sur mesure : parc matériel sélectionné, interconnexions propriétaires et stack logicielle maîtrisée de bout en bout. Chaque couche est optimisée pour les charges critiques, du bare-metal aux plateformes managées.')}
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="/products"
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-4 rounded-xl font-medium hover:opacity-90 transition-all hover:scale-105"
                  >
                    {t('hero.cta.products', 'Découvrir nos offres')}
                  </Link>
                  <Link
                    href="/support"
                    className="bg-zinc-900/70 text-white px-8 py-4 rounded-xl font-medium border border-zinc-700 hover:border-zinc-500 transition-all hover:scale-105"
                  >
                    {t('hero.cta.support', 'Parler à un architecte')}
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section ref={pillarsRef} className="py-20 px-6 bg-zinc-900/20">
            <div className="container mx-auto">
              <div className={`text-center mb-12 ${pillarsInView ? 'animate-fade-in-up' : 'opacity-0'}`}>
                <Badge variant="secondary" className="mb-4">
                  {t('pillars.badge', 'Architecture de confiance')}
                </Badge>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white">
                  {t('pillars.title', 'Fondations techniques')}<span className="text-zinc-500">.</span>
                </h2>
                <p className="text-zinc-400 max-w-3xl mx-auto mt-4">
                  {t('pillars.description', 'Nous opérons une infrastructure propriétaire articulée autour de plans de contrôle isolés, d’un matériel sélectionné et d’une observabilité continue.')} 
                </p>
              </div>

              <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${pillarsInView ? 'animate-grid' : ''}`}>
                {pillarKeys.map((key) => {
                  const Icon = pillarIconMap[key];
                  const bullets = t<string[]>(`pillars.items.${key}.bullets`, [] as string[]);
                  return (
                    <div key={key} className="relative bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm hover:border-zinc-700 transition-all hover-lift">
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradientAccent} opacity-0 hover:opacity-100 transition-opacity pointer-events-none`} />
                      <div className="relative z-10">
                        <Icon className="w-8 h-8 text-cyan-400 mb-4" />
                        <h3 className="text-lg font-medium text-white">
                          {t(`pillars.items.${key}.title`, 'Architecture spécialisée')}
                        </h3>
                        <p className="text-sm text-zinc-400 mt-2">
                          {t(`pillars.items.${key}.description`, '')}
                        </p>
                        <ul className="mt-4 space-y-2">
                          {bullets.map((bullet, idx) => (
                            <li key={idx} className="flex gap-2 text-sm text-zinc-300">
                              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-400" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section ref={blueprintRef} className="py-20 px-6">
            <div className="container mx-auto">
              <div className={`text-center mb-12 ${blueprintInView ? 'animate-fade-in-up' : 'opacity-0'}`}>
                <Badge variant="primary" className="mb-4">
                  {t('blueprint.badge', 'Blueprint technique')}
                </Badge>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white">
                  {t('blueprint.title', 'Strates de l’infrastructure')}<span className="text-zinc-500">.</span>
                </h2>
              </div>

              <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 ${blueprintInView ? 'animate-grid' : ''}`}>
                {blueprintKeys.map((key) => {
                  const Icon = blueprintIconMap[key];
                  const bullets = t<string[]>(`blueprint.items.${key}.bullets`, [] as string[]);
                  return (
                    <div key={key} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 backdrop-blur-sm hover:border-zinc-700 transition-all">
                      <div className="flex items-center gap-3 mb-4">
                        <Icon className="w-8 h-8 text-purple-400" />
                        <div>
                          <p className="text-xs uppercase tracking-widest text-zinc-500">
                            {t(`blueprint.items.${key}.label`, 'Layer')}
                          </p>
                          <h3 className="text-xl text-white font-medium">
                            {t(`blueprint.items.${key}.title`, 'Infrastructure layer')}
                          </h3>
                        </div>
                      </div>
                      <p className="text-sm text-zinc-400">
                        {t(`blueprint.items.${key}.description`, '')}
                      </p>
                      <ul className="mt-5 space-y-2">
                        {bullets.map((bullet, idx) => (
                          <li key={idx} className="flex gap-2 text-sm text-zinc-300">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-400" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section ref={networkRef} className="py-20 px-6 bg-gradient-to-b from-zinc-950 via-zinc-900/40 to-zinc-950">
            <div className="container mx-auto">
              <div className={`text-center mb-12 ${networkInView ? 'animate-fade-in-up' : 'opacity-0'}`}>
                <Badge variant="outline" className="mb-4">
                  {t('network.badge', 'Connectivité & edge')}
                </Badge>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white">
                  {t('network.title', 'Réseau déterministe')}<span className="text-zinc-500">.</span>
                </h2>
                <p className="text-zinc-400 max-w-3xl mx-auto mt-4">
                  {t('network.description', 'Une fabric réseau active-active pensée pour la latence ultra-faible, la sécurité adaptative et la distribution mondiale de contenu.')}
                </p>
              </div>

              <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${networkInView ? 'animate-grid' : ''}`}>
                {networkKeys.map((key) => {
                  const Icon = networkIconMap[key];
                  const bullets = t<string[]>(`network.items.${key}.bullets`, [] as string[]);
                  return (
                    <div key={key} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm hover:border-zinc-700 transition-all">
                      <Icon className="w-7 h-7 text-cyan-400 mb-3" />
                      <h3 className="text-lg text-white font-medium">
                        {t(`network.items.${key}.title`, 'Segment réseau')}
                      </h3>
                      <p className="text-sm text-zinc-400 mt-2">
                        {t(`network.items.${key}.description`, '')}
                      </p>
                      <ul className="mt-4 space-y-2">
                        {bullets.map((bullet, idx) => (
                          <li key={idx} className="flex gap-2 text-sm text-zinc-300">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-400" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section ref={dataRef} className="py-20 px-6">
            <div className="container mx-auto">
              <div className={`text-center mb-12 ${dataInView ? 'animate-fade-in-up' : 'opacity-0'}`}>
                <Badge variant="warning" className="mb-4">
                  {t('data.badge', 'Data fabric')}
                </Badge>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white">
                  {t('data.title', 'Résilience des données')}<span className="text-zinc-500">.</span>
                </h2>
              </div>

              <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${dataInView ? 'animate-grid' : ''}`}>
                {dataKeys.map((key) => {
                  const Icon = dataIconMap[key];
                  const bullets = t<string[]>(`data.items.${key}.bullets`, [] as string[]);
                  return (
                    <div key={key} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm hover:border-zinc-700 transition-all">
                      <Icon className="w-7 h-7 text-emerald-400 mb-3" />
                      <h3 className="text-lg text-white font-medium">
                        {t(`data.items.${key}.title`, 'Capacité de stockage')}
                      </h3>
                      <p className="text-sm text-zinc-400 mt-2">
                        {t(`data.items.${key}.description`, '')}
                      </p>
                      <ul className="mt-4 space-y-2">
                        {bullets.map((bullet, idx) => (
                          <li key={idx} className="flex gap-2 text-sm text-zinc-300">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section ref={operationsRef} className="py-20 px-6 bg-zinc-900/20">
            <div className="container mx-auto">
              <div className={`text-center mb-12 ${operationsInView ? 'animate-fade-in-up' : 'opacity-0'}`}>
                <Badge variant="secondary" className="mb-4">
                  {t('operations.badge', 'Opérations cloud')}
                </Badge>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white">
                  {t('operations.title', 'Industrialisation du run')}<span className="text-zinc-500">.</span>
                </h2>
                <p className="text-zinc-400 max-w-3xl mx-auto mt-4">
                  {t('operations.description', 'Automatisation complète, observabilité unifiée et processus de livraison continue pour garantir des évolutions maîtrisées.')}
                </p>
              </div>

              <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${operationsInView ? 'animate-grid' : ''}`}>
                {operationsKeys.map((key) => {
                  const Icon = operationsIconMap[key];
                  const bullets = t<string[]>(`operations.items.${key}.bullets`, [] as string[]);
                  return (
                    <div key={key} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm hover:border-zinc-700 transition-all">
                      <Icon className="w-7 h-7 text-indigo-400 mb-3" />
                      <h3 className="text-lg text-white font-medium">
                        {t(`operations.items.${key}.title`, 'Pratique d’exploitation')}
                      </h3>
                      <p className="text-sm text-zinc-400 mt-2">
                        {t(`operations.items.${key}.description`, '')}
                      </p>
                      <ul className="mt-4 space-y-2">
                        {bullets.map((bullet, idx) => (
                          <li key={idx} className="flex gap-2 text-sm text-zinc-300">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-400" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section ref={securityRef} className="py-20 px-6">
            <div className="container mx-auto">
              <div className={`text-center mb-12 ${securityInView ? 'animate-fade-in-up' : 'opacity-0'}`}>
                <Badge variant="primary" className="mb-4">
                  {t('safeguards.badge', 'Protection & conformité')}
                </Badge>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white">
                  {t('safeguards.title', 'Sécurité de bout en bout')}<span className="text-zinc-500">.</span>
                </h2>
              </div>

              <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${securityInView ? 'animate-grid' : ''}`}>
                {safeguardKeys.map((key) => {
                  const Icon = safeguardIconMap[key];
                  const bullets = t<string[]>(`safeguards.items.${key}.bullets`, [] as string[]);
                  return (
                    <div key={key} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm hover:border-zinc-700 transition-all">
                      <Icon className="w-7 h-7 text-rose-400 mb-3" />
                      <h3 className="text-lg text-white font-medium">
                        {t(`safeguards.items.${key}.title`, 'Protection avancée')}
                      </h3>
                      <p className="text-sm text-zinc-400 mt-2">
                        {t(`safeguards.items.${key}.description`, '')}
                      </p>
                      <ul className="mt-4 space-y-2">
                        {bullets.map((bullet, idx) => (
                          <li key={idx} className="flex gap-2 text-sm text-zinc-300">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-rose-400" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section ref={ctaRef} className="py-24 px-6">
            <div className="container mx-auto">
              <div className={`relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900/80 to-zinc-950 p-12 ${ctaInView ? 'animate-fade-in-up' : 'opacity-0'}`}>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-transparent" />
                <div className="relative z-10 text-center max-w-3xl mx-auto">
                  <Badge variant="outline" className="mb-4">
                    {t('cta.badge', 'Aller plus loin')}
                  </Badge>
                  <h2 className="text-3xl sm:text-4xl font-light text-white mb-4">
                    {t('cta.title', 'Co-construisons votre plateforme cloud')}
                  </h2>
                  <p className="text-zinc-400 mb-8">
                    {t('cta.description', 'Nos architectes partagent la cartographie détaillée des capacités lors d’ateliers dédiés et vous accompagnent pour concevoir une trajectoire adaptée à vos exigences métier.')}
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Link
                      href="/contact"
                      className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-4 rounded-xl font-medium hover:opacity-90 transition-all hover:scale-105"
                    >
                      {t('cta.primary', 'Planifier un échange')}
                    </Link>
                    <Link
                      href="/docs"
                      className="bg-zinc-900/70 text-white px-8 py-4 rounded-xl font-medium border border-zinc-700 hover:border-zinc-500 transition-all hover:scale-105"
                    >
                      {t('cta.secondary', 'Consulter la documentation')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
