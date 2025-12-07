// apps/web/types/changelog.ts
// Description: TypeScript types for changelog data structure
// Last modified: 2025-12-07
// Related docs: /docs/features/CHANGELOG.md

export type Language = 'fr' | 'en';

export type ChangelogStats = {
  cadenceLabel: string;
  dropsPerMonth: string;
  dropsSuffix: string;
  nextLabel: string;
  nextValue: string;
  nextNote: string;
  updatedLabel: string;
  updatedValue: string;
  updatedNote: string;
};

export type ChangelogLinks = {
  status: string;
  allReleases: string;
};

export type RoadmapItem = {
  title: string;
  detail: string;
  eta?: string;
};

export type RoadmapSection = {
  now: RoadmapItem[];
  next: RoadmapItem[];
  later: RoadmapItem[];
};

export type Release = {
  title: string;
  summary: string;
  date: string;
  href: string;
  tags: string[];
};

export type ChangelogData = {
  stats: ChangelogStats;
  links: ChangelogLinks;
  roadmap: RoadmapSection;
  releases: Release[];
};

export type ChangelogDataByLanguage = {
  en: ChangelogData;
  fr: ChangelogData;
};

export type ChangelogTranslations = {
  badge: string;
  title: string[];
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  roadmapTitle: string;
  roadmapSubtitle: string;
  bucketLabels: {
    now: string;
    next: string;
    later: string;
    badgeNow: string;
    badgeNext: string;
    badgeLater: string;
  };
  releasesTitle: string;
  releasesHeading: string;
  viewAll: string;
  accessTitle: string;
  accessSubtitle: string;
  transparency: string;
  hubs: ChangelogHub[];
};

export type ChangelogHub = {
  title: string;
  description: string;
  href: string;
};
