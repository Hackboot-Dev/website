// apps/web/utils/loadChangelogData.ts
// Description: Helper to load and merge changelog data from separate files
// Last modified: 2025-12-07
// Related docs: /docs/features/CHANGELOG.md

import type { Language, ChangelogData } from '../types/changelog';
import roadmapData from '../data/changelog/roadmap.json';
import releasesData from '../data/changelog/releases.json';

export function loadChangelogData(language: Language): ChangelogData {
  const roadmap = roadmapData[language] || roadmapData.en;
  const releases = releasesData[language] || releasesData.en;

  return {
    roadmap,
    stats: releases.stats,
    links: releases.links,
    releases: releases.releases,
  };
}
