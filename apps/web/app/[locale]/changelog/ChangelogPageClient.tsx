// apps/web/app/[locale]/changelog/ChangelogPageClient.tsx
// Description: Changelog page client component with roadmap and release notes
// Last modified: 2025-12-07
// Related docs: /docs/features/CHANGELOG.md

'use client';

import { useMemo } from 'react';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import SophisticatedBackground from '../../../components/animations/SophisticatedBackground';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useRevealAnimation, useStaggerReveal } from '../../../hooks/useAwwardsAnimation';
import LocalizedLink from '../../../components/ui/LocalizedLink';
import type { Language, ChangelogData } from '../../../types/changelog';
import changelogDataJson from '../../../data/changelog.json';
import {
  ArrowUpRightIcon,
  CheckCircleIcon,
  CalendarDaysIcon,
  FireIcon,
  ClockIcon,
  LinkIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

type ChangelogPageClientProps = {
  locale?: Language;
};

export default function ChangelogPageClient({ locale }: ChangelogPageClientProps) {
  const { language, t } = useLanguage();
  const currentLang = (language as Language) || locale || 'en';

  // Load changelog data directly from JSON - memoized to prevent re-renders
  const data = useMemo(() => {
    const allData = changelogDataJson as Record<Language, ChangelogData>;
    return allData[currentLang] || allData.en;
  }, [currentLang]);

  // Get translations from context (loaded from /locales/*.json) - memoized to prevent infinite re-renders
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

  const heroReveal = useRevealAnimation({ delay: 80 });
  const subtitleReveal = useRevealAnimation({ delay: 180 });
  const statsReveal = useStaggerReveal(3, 80);
  const roadmapReveal = useStaggerReveal(9, 60);
  const releasesReveal = useStaggerReveal(releaseList?.length || 0, 80);

  // Debug: Check if data exists
  if (!roadmap || !releaseList || !stats) {
    console.error('Missing changelog data:', { roadmap, releaseList, stats });
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error loading changelog</h1>
          <p>Data missing: {!roadmap ? 'roadmap ' : ''}{!releaseList ? 'releases ' : ''}{!stats ? 'stats' : ''}</p>
        </div>
      </div>
    );
  }

  const statusHref = links?.status ?? 'https://status.vmcl.fr';
  const latestHref = releaseList[0]?.href ?? links?.allReleases ?? 'https://blog.vmcl.fr/changelog';

  return (
    <>
      <SophisticatedBackground />
      <div className="min-h-screen bg-zinc-950">
        <Header />

        <main className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/40 via-zinc-950 to-zinc-950 pointer-events-none" />

          {/* Hero */}
          <section className="relative pt-36 pb-20">
            <div className="container mx-auto px-6 lg:px-12 relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
                <div className="max-w-2xl space-y-6">
                  <div
                    ref={heroReveal.elementRef}
                    style={heroReveal.style}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs uppercase tracking-[0.2em] text-zinc-300"
                  >
                    <SparklesIcon className="w-4 h-4" />
                    {translations.badge}
                  </div>
                  <h1
                    className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white"
                    ref={heroReveal.elementRef}
                    style={heroReveal.style}
                  >
                    {translations.title1} <span className="text-zinc-400">&amp;</span> {translations.title2}
                  </h1>
                  <p
                    className="text-lg text-zinc-300 leading-relaxed max-w-2xl"
                    ref={subtitleReveal.elementRef}
                    style={subtitleReveal.style}
                  >
                    {translations.subtitle}
                  </p>
                  <div className="flex flex-wrap items-center gap-4">
                    <a
                      href={latestHref}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 bg-white text-zinc-900 px-5 py-3 text-sm font-medium rounded-lg shadow-sm hover:bg-zinc-100 transition"
                    >
                      {translations.ctaPrimary}
                      <ArrowUpRightIcon className="w-4 h-4" />
                    </a>
                    <a
                      href={statusHref}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-lg border border-white/15 text-white hover:border-white/30 transition"
                    >
                      {translations.ctaSecondary}
                      <LinkIcon className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-auto">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 opacity-100 translate-y-0 transition duration-300">
                    <p className="text-zinc-400 text-xs uppercase tracking-[0.2em]">{stats.cadenceLabel}</p>
                    <div className="text-2xl font-semibold text-white mt-2">{stats.dropsPerMonth}</div>
                    <p className="text-zinc-500 text-sm">{stats.dropsSuffix}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 opacity-100 translate-y-0 transition duration-300">
                    <p className="text-zinc-400 text-xs uppercase tracking-[0.2em]">{stats.nextLabel}</p>
                    <div className="text-2xl font-semibold text-white mt-2">{stats.nextValue}</div>
                    <p className="text-zinc-500 text-sm flex items-center gap-2">
                      <CalendarDaysIcon className="w-4 h-4" /> {stats.nextNote}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 opacity-100 translate-y-0 transition duration-300">
                    <p className="text-zinc-400 text-xs uppercase tracking-[0.2em]">{stats.updatedLabel}</p>
                    <div className="text-2xl font-semibold text-white mt-2">{stats.updatedValue}</div>
                    <p className="text-zinc-500 text-sm flex items-center gap-2">
                      <ClockIcon className="w-4 h-4" /> {stats.updatedNote}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Roadmap */}
          <section className="relative py-12">
            <div className="container mx-auto px-6 lg:px-12 relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">{translations.roadmapTitle}</p>
                  <h2 className="text-3xl font-semibold text-white mt-1">{translations.roadmapSubtitle}</h2>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden md:flex items-center gap-2 text-sm text-emerald-400">
                    <CheckCircleIcon className="w-5 h-5" />
                    <span>{translations.transparency}</span>
                  </div>
                  <a
                    href="https://roadmap.vmcl.fr"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-white/15 text-white hover:border-white/30 hover:bg-white/5 transition"
                  >
                    Roadmap complète
                    <ArrowUpRightIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(['now', 'next', 'later'] as const).map((bucket, bucketIdx) => (
                  <div
                    key={bucket}
                    className="p-5 rounded-xl border border-white/10 bg-white/5 backdrop-blur opacity-100 translate-y-0 transition duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {bucket === 'now' && <FireIcon className="w-5 h-5 text-amber-400" />}
                        {bucket === 'next' && <ArrowUpRightIcon className="w-5 h-5 text-blue-300" />}
                        {bucket === 'later' && <ClockIcon className="w-5 h-5 text-zinc-300" />}
                        <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">
                          {bucket === 'now' ? translations.bucketLabels.now : bucket === 'next' ? translations.bucketLabels.next : translations.bucketLabels.later}
                        </p>
                      </div>
                      <span className="text-[11px] text-zinc-500">
                        {bucket === 'now' ? translations.bucketLabels.badgeNow : bucket === 'next' ? translations.bucketLabels.badgeNext : translations.bucketLabels.badgeLater}
                      </span>
                    </div>
                    <div className="space-y-4">
                      {roadmap[bucket].map((item) => (
                        <div key={item.title} className="p-4 rounded-lg bg-black/30 border border-white/5">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-white font-semibold">{item.title}</p>
                              <p className="text-zinc-400 text-sm mt-1">{item.detail}</p>
                            </div>
                            {item.eta && (
                              <span className="text-[11px] px-3 py-1 rounded-full bg-white/5 text-zinc-300 border border-white/10 whitespace-nowrap">
                                {item.eta}
                              </span>
                            )}
                          </div>
                          <div className="mt-3 h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Releases */}
          <section className="relative py-12">
            <div className="container mx-auto px-6 lg:px-12 relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">{translations.releasesTitle}</p>
                  <h2 className="text-3xl font-semibold text-white mt-1">{translations.releasesHeading}</h2>
                </div>
                <a
                  href={links?.allReleases ?? 'https://blog.vmcl.fr/changelog'}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-zinc-300 hover:text-white inline-flex items-center gap-2"
                >
                  {translations.viewAll}
                  <ArrowUpRightIcon className="w-4 h-4" />
                </a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {releaseList.map((release, idx) => (
                  <a
                    key={release.title}
                    href={release.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative p-5 rounded-xl border border-white/10 bg-white/5 hover:border-white/30 transition opacity-100 translate-y-0"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">{release.date}</p>
                      <ArrowUpRightIcon className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mt-2">{release.title}</h3>
                    <p className="text-zinc-400 text-sm mt-2">{release.summary}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {release.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] px-3 py-1 rounded-full bg-white/5 text-zinc-300 border border-white/10"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* Access */}
          <section className="relative py-12 pb-20">
            <div className="container mx-auto px-6 lg:px-12 relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">{translations.accessTitle}</p>
                  <h2 className="text-3xl font-semibold text-white mt-1">{translations.accessSubtitle}</h2>
                </div>
                <LocalizedLink
                  href="/support"
                  className="hidden md:inline-flex items-center gap-2 text-sm text-zinc-300 hover:text-white"
                >
                  Support KB
                  <ArrowUpRightIcon className="w-4 h-4" />
                </LocalizedLink>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[translations.hub1, translations.hub2, translations.hub3, translations.hub4].map((hub) => (
                  <a
                    key={hub.title}
                    href={hub.href}
                    target="_blank"
                    rel="noreferrer"
                    className="p-4 rounded-xl border border-white/10 bg-white/5 hover:border-white/25 transition group"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-semibold">{hub.title}</h3>
                      <ArrowUpRightIcon className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                    </div>
                    <p className="text-zinc-400 text-sm mt-2">{hub.description}</p>
                  </a>
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
