// apps/web/app/[locale]/roadmap/RoadmapPageClient.tsx
// Description: Full roadmap page with phases, categories and progress tracking
// Last modified: 2025-12-07

'use client';

import { useMemo, useRef, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import SophisticatedBackground from '../../../components/animations/SophisticatedBackground';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { Language } from '../../../types/changelog';
import roadmapData from '../../../data/roadmap/roadmap-full.json';
import {
  ArrowUpRightIcon,
  CheckCircleIcon,
  ClockIcon,
  SparklesIcon,
  ServerIcon,
  CubeIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
  BuildingOfficeIcon,
  TagIcon,
  ChartBarIcon,
  CpuChipIcon,
  PuzzlePieceIcon,
  SignalIcon,
  CircleStackIcon,
  LifebuoyIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

type RoadmapPageClientProps = {
  locale?: Language;
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'server': ServerIcon,
  'cube': CubeIcon,
  'globe': GlobeAltIcon,
  'globe-alt': GlobeAltIcon,
  'shield': ShieldCheckIcon,
  'shield-check': ShieldCheckIcon,
  'wrench': WrenchScrewdriverIcon,
  'building': BuildingOfficeIcon,
  'tag': TagIcon,
  'chart': ChartBarIcon,
  'cpu-chip': CpuChipIcon,
  'puzzle': PuzzlePieceIcon,
  'signal': SignalIcon,
  'database': CircleStackIcon,
  'headset': LifebuoyIcon,
  'lifebuoy': LifebuoyIcon,
  'check-badge': CheckCircleIcon,
};

function getStatusColor(status: string) {
  switch (status) {
    case 'completed':
      return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    case 'in_progress':
      return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    case 'planned':
      return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    default:
      return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20';
  }
}

function getStatusLabel(status: string, lang: string) {
  const labels: Record<string, Record<string, string>> = {
    en: { completed: 'Completed', in_progress: 'In Progress', planned: 'Planned', later: 'Later' },
    fr: { completed: 'Terminé', in_progress: 'En cours', planned: 'Planifié', later: 'Plus tard' },
  };
  return labels[lang]?.[status] || status;
}

function getPhaseStatusColor(status: string) {
  switch (status) {
    case 'in_progress':
      return 'border-amber-500/50 bg-amber-500/5';
    case 'planned':
      return 'border-blue-500/30 bg-blue-500/5';
    default:
      return 'border-zinc-800 bg-zinc-900/20';
  }
}

export default function RoadmapPageClient({ locale }: RoadmapPageClientProps) {
  const { language } = useLanguage();
  const currentLang = (language as Language) || locale || 'en';
  const [expandedPhase, setExpandedPhase] = useState<string | null>('q1-2026');

  const data = useMemo(() => {
    const langData = (roadmapData as any)[currentLang] || (roadmapData as any).en;
    return langData;
  }, [currentLang]);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  if (!data) return null;

  const { hero, stats, phases, products, cta } = data;

  return (
    <>
      <SophisticatedBackground />

      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-zinc-600 origin-left z-50"
        style={{ scaleX }}
      />

      <div ref={containerRef} className="min-h-screen bg-zinc-950 text-white selection:bg-zinc-700/50">
        <Header />

        <main className="relative">
          {/* Noise Overlay */}
          <div className="fixed inset-0 pointer-events-none opacity-[0.04] z-[1] mix-blend-overlay"
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                 backgroundSize: '128px 128px'
               }} />

          {/* Hero Section */}
          <section className="relative min-h-[70vh] flex items-center pt-20 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="max-w-4xl mx-auto text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.6 }}
                  className="mb-8"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-zinc-900/50 border border-zinc-800 text-xs uppercase tracking-[0.2em] text-zinc-400">
                    <SparklesIcon className="w-3.5 h-3.5" />
                    {hero.badge}
                  </div>

                  <h1 className="space-y-2">
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                      className="block text-5xl sm:text-6xl md:text-7xl font-extralight tracking-tight text-white"
                    >
                      {hero.title}
                    </motion.span>
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35, duration: 0.6 }}
                      className="block text-5xl sm:text-6xl md:text-7xl font-extralight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500"
                    >
                      {hero.subtitle}
                    </motion.span>
                  </h1>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-12 font-light"
                >
                  {hero.description}
                </motion.p>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
                >
                  {Object.entries(stats).map(([key, stat]: [string, any]) => (
                    <div key={key} className="text-center">
                      <p className="text-3xl font-light text-white">{stat.value}</p>
                      <p className="text-sm text-zinc-400 mt-1">{stat.label}</p>
                      <p className="text-xs text-zinc-600">{stat.detail}</p>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </section>

          {/* Phases Timeline */}
          <section className="relative py-24 border-t border-zinc-900">
            <div className="container mx-auto px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
                className="mb-16"
              >
                <div className="flex items-center gap-2 text-sm text-emerald-500/80 mb-4">
                  <CheckCircleIcon className="w-4 h-4" />
                  <span>{currentLang === 'fr' ? 'Transparence par défaut' : 'Transparency by default'}</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-extralight text-white tracking-tight">
                  {currentLang === 'fr' ? 'Phases de développement' : 'Development phases'}
                </h2>
              </motion.div>

              {/* Timeline */}
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-4 lg:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-zinc-800 via-zinc-800 to-transparent" />

                <div className="space-y-8">
                  {phases.map((phase: any, phaseIdx: number) => {
                    const isExpanded = expandedPhase === phase.id;
                    const PhaseIcon = phase.status === 'in_progress' ? ClockIcon :
                                      phase.status === 'planned' ? SparklesIcon : ClockIcon;

                    return (
                      <motion.div
                        key={phase.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.6, delay: phaseIdx * 0.1 }}
                        className="relative pl-12 lg:pl-20"
                      >
                        {/* Timeline dot */}
                        <div className={`absolute left-0 lg:left-4 w-8 h-8 rounded-full border-2 flex items-center justify-center bg-zinc-950 z-10 ${
                          phase.status === 'in_progress' ? 'border-amber-500' :
                          phase.status === 'planned' ? 'border-blue-500' : 'border-zinc-700'
                        }`}>
                          <PhaseIcon className={`w-4 h-4 ${
                            phase.status === 'in_progress' ? 'text-amber-500' :
                            phase.status === 'planned' ? 'text-blue-500' : 'text-zinc-500'
                          }`} />
                        </div>

                        {/* Phase card */}
                        <div className={`border rounded-lg overflow-hidden transition-all duration-300 ${getPhaseStatusColor(phase.status)}`}>
                          {/* Header */}
                          <button
                            onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
                            className="w-full p-6 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div>
                                <div className="flex items-center gap-3 mb-1">
                                  <h3 className="text-xl font-light text-white">{phase.title}</h3>
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getStatusColor(phase.status)}`}>
                                    {getStatusLabel(phase.status, currentLang)}
                                  </span>
                                </div>
                                <p className="text-sm text-zinc-500">{phase.timeline}</p>
                              </div>
                            </div>
                            <ChevronDownIcon className={`w-5 h-5 text-zinc-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                          </button>

                          {/* Expanded content */}
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="border-t border-zinc-800/50"
                            >
                              <div className="p-6">
                                <p className="text-zinc-400 text-sm mb-8">{phase.description}</p>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                  {phase.categories.map((category: any, catIdx: number) => {
                                    const IconComponent = iconMap[category.icon] || CubeIcon;

                                    return (
                                      <div key={catIdx} className="space-y-4">
                                        <div className="flex items-center gap-2">
                                          <IconComponent className="w-4 h-4 text-zinc-500" />
                                          <h4 className="text-sm font-medium text-zinc-300">{category.name}</h4>
                                        </div>

                                        <div className="space-y-3">
                                          {category.items.map((item: any, itemIdx: number) => (
                                            <div
                                              key={itemIdx}
                                              className="p-4 rounded-lg bg-zinc-900/30 border border-zinc-800/50 hover:border-zinc-700/50 transition-colors"
                                            >
                                              <div className="flex items-start justify-between gap-3 mb-2">
                                                <h5 className="text-sm text-white font-light">{item.title}</h5>
                                                <span className={`text-[9px] px-2 py-0.5 rounded-full border whitespace-nowrap ${getStatusColor(item.status)}`}>
                                                  {getStatusLabel(item.status, currentLang)}
                                                </span>
                                              </div>
                                              <p className="text-xs text-zinc-500 leading-relaxed">{item.detail}</p>

                                              {item.progress > 0 && (
                                                <div className="mt-3">
                                                  <div className="flex justify-between text-[10px] text-zinc-600 mb-1">
                                                    <span>{currentLang === 'fr' ? 'Progression' : 'Progress'}</span>
                                                    <span>{item.progress}%</span>
                                                  </div>
                                                  <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                                                    <div
                                                      className={`h-full rounded-full transition-all duration-500 ${
                                                        item.progress === 100 ? 'bg-emerald-500' : 'bg-amber-500'
                                                      }`}
                                                      style={{ width: `${item.progress}%` }}
                                                    />
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Products Overview */}
          <section className="relative py-24 border-t border-zinc-900 bg-zinc-950/50">
            <div className="container mx-auto px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl lg:text-4xl font-extralight text-white tracking-tight mb-2">
                  {products.title}
                </h2>
                <p className="text-zinc-500">{products.subtitle}</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.categories.map((category: any, idx: number) => {
                  const IconComponent = iconMap[category.icon] || CubeIcon;

                  return (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className="p-6 rounded-lg border border-zinc-800 bg-zinc-900/20 hover:border-zinc-700 transition-colors"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-zinc-800/50 flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-zinc-400" />
                        </div>
                        <h3 className="text-lg font-light text-white">{category.name}</h3>
                      </div>

                      <div className="space-y-3">
                        {category.products.map((product: any, pIdx: number) => (
                          <div key={pIdx} className="flex items-center justify-between py-2 border-b border-zinc-800/50 last:border-0">
                            <div>
                              <p className="text-sm text-zinc-300">{product.name}</p>
                              <p className="text-xs text-zinc-600">{product.highlight}</p>
                            </div>
                            <div className="text-right">
                              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                                product.status === 'GA' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              }`}>
                                {product.status}
                              </span>
                              <p className="text-[10px] text-zinc-600 mt-1">{product.tiers}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="relative py-20 border-t border-zinc-900">
            <div className="container mx-auto px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl mx-auto text-center"
              >
                <h2 className="text-2xl font-light text-white mb-4">{cta.title}</h2>
                <p className="text-zinc-400 mb-8">{cta.description}</p>

                <div className="flex flex-wrap items-center justify-center gap-4">
                  <a
                    href={`/${currentLang}${cta.primary.href}`}
                    className="group flex items-center gap-2 bg-white text-zinc-900 px-6 py-3 rounded-lg text-sm font-medium hover:bg-zinc-100 transition-colors"
                  >
                    {cta.primary.label}
                    <ArrowUpRightIcon className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                  <a
                    href={`/${currentLang}${cta.secondary.href}`}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm text-zinc-300 border border-zinc-800 hover:border-zinc-700 hover:text-white transition-colors"
                  >
                    {cta.secondary.label}
                  </a>
                </div>
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
