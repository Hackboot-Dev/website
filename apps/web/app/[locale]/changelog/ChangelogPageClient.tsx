// apps/web/app/[locale]/changelog/ChangelogPageClient.tsx
// Description: Changelog page client component - Refined Hero to match Home Page
// Last modified: 2025-12-07

'use client';

import { useMemo, useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import SophisticatedBackground from '../../../components/animations/SophisticatedBackground';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useParallax } from '../../../hooks/useAwwardsAnimation';
import type { Language, ChangelogData } from '../../../types/changelog';
import releasesDataJson from '../../../data/changelog/releases.json';
import roadmapDataJson from '../../../data/changelog/roadmap.json';
import {
  ArrowUpRightIcon,
  CheckCircleIcon,
  CalendarDaysIcon,
  FireIcon,
  ClockIcon,
  SparklesIcon,
  CpuChipIcon,
  BeakerIcon,
} from '@heroicons/react/24/outline';

type ChangelogPageClientProps = {
  locale?: Language;
};

export default function ChangelogPageClient({ locale }: ChangelogPageClientProps) {
  const { language, t } = useLanguage();
  const currentLang = (language as Language) || locale || 'en';

  // Load changelog data directly from JSON
  const data = useMemo(() => {
    // Type assertions to ensure TS knows the structure matches our needs
    const releasesData = releasesDataJson as unknown as Record<Language, Pick<ChangelogData, 'releases' | 'stats' | 'links'>>;
    const roadmapData = roadmapDataJson as unknown as Record<Language, Pick<ChangelogData, 'roadmap'>>;

    const releases = releasesData[currentLang] || releasesData.en;
    const roadmap = roadmapData[currentLang] || roadmapData.en;

    return {
      ...releases,
      roadmap: roadmap // roadmap.json structure is directly the roadmap object for the lang
    };
  }, [currentLang]);

  const translations = useMemo(() => ({
    badge: t('changelog.badge'),
    title1: t('changelog.title1'),
    title2: t('changelog.title2'),
    subtitle: t('changelog.subtitle'),
    ctaPrimary: t('changelog.ctaPrimary'),
    ctaSecondary: t('changelog.ctaSecondary'),
    roadmapTitle: t('changelog.roadmapTitle'),
    roadmapSubtitle: t('changelog.roadmapSubtitle'),
    bucketLabels: {
      now: t('changelog.bucketLabels.now'),
      next: t('changelog.bucketLabels.next'),
      later: t('changelog.bucketLabels.later'),
      badgeNow: t('changelog.bucketLabels.badgeNow'),
      badgeNext: t('changelog.bucketLabels.badgeNext'),
      badgeLater: t('changelog.bucketLabels.badgeLater'),
    },
    releasesTitle: t('changelog.releasesTitle'),
    releasesHeading: t('changelog.releasesHeading'),
    viewAll: t('changelog.viewAll'),
    accessTitle: t('changelog.accessTitle'),
    accessSubtitle: t('changelog.accessSubtitle'),
    transparency: t('changelog.transparency'),
    hub1: {
      title: t('changelog.hub1.title'),
      description: t('changelog.hub1.description'),
      href: t('changelog.hub1.href'),
    },
    hub2: {
      title: t('changelog.hub2.title'),
      description: t('changelog.hub2.description'),
      href: t('changelog.hub2.href'),
    },
    hub3: {
      title: t('changelog.hub3.title'),
      description: t('changelog.hub3.description'),
      href: t('changelog.hub3.href'),
    },
    hub4: {
      title: t('changelog.hub4.title'),
      description: t('changelog.hub4.description'),
      href: t('changelog.hub4.href'),
    },
  }), [t, currentLang]);

  const roadmap = data.roadmap;
  const releaseList = data.releases;
  const stats = data.stats;
  const links = data.links;

  // Animations (Simplified - no complex state)
  const geometryParallax = useParallax(0.3);

  // Scroll Progress
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

  if (!roadmap || !releaseList || !stats) return null;

  const statusHref = links?.status ?? 'https://status.vmcl.fr';
  const latestHref = releaseList[0]?.href ?? links?.allReleases ?? 'https://blog.vmcl.fr/changelog';

  return (
    <>
      <SophisticatedBackground />
      
      {/* Scroll Progress Bar */}
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
          <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
             {/* Geometric accent parallax */}
            <div
              ref={geometryParallax.elementRef}
              className="hidden lg:block absolute top-0 right-0 w-1/3 h-full pointer-events-none z-0"
              style={geometryParallax.style}
            >
               <div className="absolute top-32 right-16 w-px h-64 bg-gradient-to-b from-transparent via-zinc-800 to-transparent"></div>
               <div className="absolute top-32 right-32 w-16 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-12 gap-8 items-center">

                {/* Left side - Main content */}
                <div className="col-span-12 lg:col-span-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.6 }}
                    className="space-y-4 mb-12"
                  >
                     <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-zinc-900/50 border border-zinc-800 text-xs uppercase tracking-[0.2em] text-zinc-400">
                        <SparklesIcon className="w-3.5 h-3.5" />
                        {translations.badge}
                     </div>
                    <h1 aria-label={`${translations.title1} ${translations.title2}`} className="space-y-2">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                      >
                        <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extralight tracking-tight text-white leading-tight">
                          {translations.title1}
                        </span>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35, duration: 0.6 }}
                      >
                        <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extralight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500 leading-tight">
                          {translations.title2}
                        </span>
                      </motion.div>
                    </h1>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="text-lg text-zinc-400 max-w-2xl leading-relaxed mb-12 font-light"
                  >
                    {translations.subtitle}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    className="flex flex-wrap items-center gap-6"
                  >
                    <a
                      href={latestHref}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center gap-3 text-white hover:text-zinc-300 transition-colors"
                    >
                      <span className="text-sm tracking-wide font-medium">{translations.ctaPrimary}</span>
                      <div className="w-12 h-px bg-white group-hover:w-16 transition-[width] duration-300"></div>
                      <ArrowUpRightIcon className="w-4 h-4" />
                    </a>
                    <a
                      href={statusHref}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 tracking-wide transition-colors"
                    >
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      {translations.ctaSecondary}
                    </a>
                  </motion.div>
                </div>

                {/* Right side - Simple last update info */}
                <div className="col-span-12 lg:col-span-4 mt-12 lg:mt-0">
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="p-8 bg-zinc-900/20 border border-zinc-800/50"
                  >
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <CalendarDaysIcon className="w-5 h-5 text-zinc-600 flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">{stats.updatedLabel}</p>
                          <p className="text-xl font-light text-white">{stats.updatedValue}</p>
                          <p className="text-xs text-zinc-600 mt-1">{stats.updatedNote}</p>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-zinc-800/50">
                        <div className="flex items-start gap-4">
                          <ClockIcon className="w-5 h-5 text-zinc-600 flex-shrink-0 mt-1" />
                          <div>
                            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">{stats.nextLabel}</p>
                            <p className="text-xl font-light text-white">{stats.nextValue}</p>
                            <p className="text-xs text-zinc-600 mt-1">{stats.cadenceLabel}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </section>

          {/* Roadmap Pipeline */}
          <section className="relative py-24 border-t border-zinc-900 bg-zinc-950">
            <div className="container mx-auto px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20"
              >
                <div>
                  <h2 className="text-3xl lg:text-4xl font-extralight text-white tracking-tight mb-2">
                    {translations.roadmapSubtitle}
                  </h2>
                  <p className="text-zinc-500 font-light">
                   {t('changelog.roadmapTitle')}
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-sm text-emerald-500/80">
                    <CheckCircleIcon className="w-4 h-4" />
                    <span>{translations.transparency}</span>
                  </div>
                  <a
                    href={`/${currentLang}/roadmap`}
                    className="text-sm font-medium text-white hover:text-zinc-300 transition-colors flex items-center gap-2"
                  >
                    Roadmap
                    <ArrowUpRightIcon className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
                {/* Connecting Lines (Desktop) */}
                <div className="hidden lg:block absolute top-12 left-0 w-full h-px bg-zinc-900 z-0" />

                {(['now', 'next', 'later'] as const).map((bucket, idx) => (
                  <div key={bucket} className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8 bg-zinc-950 pr-4 inline-block">
                      <div className={`
                        w-10 h-10 flex items-center justify-center rounded-lg border bg-zinc-900/50
                        ${bucket === 'now' ? 'border-amber-900/30 text-amber-500' : ''}
                        ${bucket === 'next' ? 'border-blue-900/30 text-blue-500' : ''}
                        ${bucket === 'later' ? 'border-zinc-800 text-zinc-500' : ''}
                      `}>
                        {bucket === 'now' && <FireIcon className="w-5 h-5" />}
                        {bucket === 'next' && <CpuChipIcon className="w-5 h-5" />}
                        {bucket === 'later' && <BeakerIcon className="w-5 h-5" />}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-white capitalize">
                          {translations.bucketLabels[bucket]}
                        </h3>
                        <p className="text-xs text-zinc-500 uppercase tracking-wider">
                          {bucket === 'now' ? translations.bucketLabels.badgeNow : bucket === 'next' ? translations.bucketLabels.badgeNext : translations.bucketLabels.badgeLater}
                        </p>
                      </div>
                    </div>

                    {/* Cards */}
                    <div className="space-y-4">
                      {roadmap[bucket].map((item, i) => (
                        <motion.div
                          key={item.title}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, amount: 0.3 }}
                          transition={{
                            duration: 0.8,
                            ease: [0.16, 1, 0.3, 1],
                            delay: i * 0.1
                          }}
                          className="group p-5 rounded-sm bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/40 transition-[border-color,background-color] duration-200"
                        >
                          <h4 className="text-zinc-200 font-light group-hover:text-white transition-colors duration-200">
                            {item.title}
                          </h4>
                          <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
                            {item.detail}
                          </p>
                          {item.eta && (
                            <div className="mt-4 pt-4 border-t border-zinc-900 flex items-center gap-2">
                              <span className="w-1 h-1 rounded-full bg-zinc-600 group-hover:bg-emerald-500 transition-colors duration-200" />
                              <span className="text-xs text-zinc-600 font-mono">{item.eta}</span>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Releases Timeline - Inspired by About page */}
          <section className="relative py-24 bg-zinc-950">
            <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6 }}
                className="mb-20 text-center"
              >
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500 mb-3">{translations.releasesTitle}</p>
                <h2 className="text-4xl md:text-5xl font-extralight text-white">{translations.releasesHeading}</h2>
              </motion.div>

              <div className="relative max-w-5xl mx-auto">
                {/* Vertical Line */}
                <div className="absolute left-6 lg:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-zinc-800 to-transparent"></div>

                {/* Timeline items */}
                {releaseList.map((release, idx) => (
                  <motion.div
                    key={release.title}
                    initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{
                      duration: 1.2,
                      ease: [0.16, 1, 0.3, 1],
                      delay: 0.1
                    }}
                    className={`relative flex items-center mb-16 ${
                      idx % 2 === 0 ? 'lg:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Content */}
                    <div className={`w-full lg:w-5/12 ${idx % 2 === 0 ? 'lg:text-right lg:pr-12' : 'lg:pl-12'} pl-16 lg:pl-0`}>
                      <a
                        href={release.href}
                        target="_blank"
                        rel="noreferrer"
                        className="block p-6 bg-zinc-900/30 border border-zinc-800 hover:bg-zinc-900/50 hover:border-zinc-700 transition-[border-color,background-color] duration-200 cursor-pointer"
                      >
                        {/* Tags */}
                        <div className={`flex flex-wrap gap-2 mb-3 ${idx % 2 === 0 ? 'lg:justify-end' : ''}`}>
                          {release.tags.map((tag) => (
                            <span key={tag} className="px-2 py-1 text-[10px] uppercase tracking-wider font-medium text-zinc-500 border border-zinc-800">
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Date */}
                        <div className={`text-xs text-zinc-600 mb-2 uppercase tracking-wider ${idx % 2 === 0 ? 'lg:text-right' : ''}`}>
                          {release.date}
                        </div>

                        {/* Title */}
                        <h3 className={`text-xl font-light text-white mb-3 hover:text-zinc-200 transition-colors`}>
                          {release.title}
                        </h3>

                        {/* Summary */}
                        <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                          {release.summary}
                        </p>

                        {/* Link indicator */}
                        <div className={`flex items-center gap-2 text-xs text-zinc-500 hover:text-white transition-colors ${idx % 2 === 0 ? 'lg:justify-end' : ''}`}>
                          <span>Read full update</span>
                          <ArrowUpRightIcon className="w-3 h-3" />
                        </div>
                      </a>
                    </div>

                    {/* Icon Circle */}
                    <div className="absolute left-0 lg:left-1/2 transform lg:-translate-x-1/2 w-14 h-14 bg-zinc-900 border-2 border-zinc-700 rounded-full flex items-center justify-center z-10">
                      <CalendarDaysIcon className="w-6 h-6 text-zinc-500" />
                    </div>
                  </motion.div>
                ))}

                {/* View All Link */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ duration: 0.5 }}
                  className="mt-24 text-center"
                >
                  <a
                    href={links?.allReleases ?? 'https://blog.vmcl.fr/changelog'}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-600 transition-[color,border-color] duration-200"
                  >
                    <ArrowUpRightIcon className="w-4 h-4" />
                  </a>
                  <p className="mt-4 text-xs tracking-widest uppercase text-zinc-600">{translations.viewAll}</p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Hubs / Access */}
          <section className="relative py-20 border-t border-zinc-900">
            <div className="container mx-auto px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <h2 className="text-2xl font-light text-white">{translations.accessSubtitle}</h2>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[translations.hub1, translations.hub2, translations.hub3, translations.hub4].map((hub, i) => (
                  <motion.div
                    key={hub.title}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.05 }}
                  >
                    <a
                      href={hub.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group block p-6 bg-zinc-900/10 hover:bg-zinc-900/30 border border-zinc-900 hover:border-zinc-800 transition-[border-color,background-color] duration-200 text-center md:text-left cursor-pointer"
                    >
                      <h3 className="text-zinc-200 font-medium mb-2 group-hover:text-white transition-colors duration-200">
                        {hub.title}
                      </h3>
                      <p className="text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors duration-200">
                        {hub.description}
                      </p>
                    </a>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}