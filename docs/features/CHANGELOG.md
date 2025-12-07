# Changelog System

## Overview
The Changelog system provides a public-facing page that displays product releases, infrastructure updates, and a live roadmap. It combines release notes with transparent communication about what VMCloud is building and shipping.

## Architecture

### Components
```
apps/web/
├── app/[locale]/changelog/
│   ├── page.tsx                    # Server component with metadata
│   └── ChangelogPageClient.tsx     # Client component with UI
├── types/
│   └── changelog.ts                # TypeScript type definitions
├── utils/
│   └── changelogLoader.ts          # Centralized data loader
├── data/
│   └── changelog.json              # Changelog data (FR/EN)
└── locales/
    ├── en.json                     # English UI translations
    └── fr.json                     # French UI translations
```

### Data Flow
```
changelog.json → changelogLoader.ts → ChangelogPageClient.tsx
locales/*.json → LanguageContext → ChangelogPageClient.tsx
```

## Features

### 1. Live Roadmap
- **Now**: Currently shipping features (Build phase)
- **Next**: Upcoming features in preparation (Prep phase)
- **Later**: Future features in discovery (Discovery phase)

Each roadmap item includes:
- Title and detailed description
- ETA (optional)
- Visual indicators (icons, colors)

### 2. Release Notes
- Recent changelog posts displayed in cards
- Date, title, summary, and tags
- Direct links to full blog posts
- Filterable by category (Infrastructure, Product, Support)

### 3. Stats Dashboard
- Cadence: Release frequency (bi-weekly drops)
- Next drop: Upcoming release date
- Last update: Most recent changelog update

### 4. Access Channels
Four distinct changelog channels:
- **Product releases**: UI/UX, billing, API changes
- **Infrastructure/ops**: Network, storage, virtualization
- **Support & docs**: Runbooks, KB updates, SLAs
- **Roadmap board**: Discovery, build, rollout status

## Configuration Guide

### Adding a New Release
Edit `/apps/web/data/changelog.json`:

```json
{
  "en": {
    "releases": [
      {
        "title": "Oct 2025 — New feature name",
        "summary": "Short description of what shipped and why it matters.",
        "date": "Oct 15, 2025",
        "href": "https://blog.vmcl.fr/changelog/2025-10-feature",
        "tags": ["Product", "Infrastructure"]
      }
    ]
  },
  "fr": {
    "releases": [
      {
        "title": "Oct 2025 — Nom de la fonctionnalité",
        "summary": "Description courte de ce qui a été livré et pourquoi c'est important.",
        "date": "15 oct. 2025",
        "href": "https://blog.vmcl.fr/changelog/2025-10-feature",
        "tags": ["Produit", "Infrastructure"]
      }
    ]
  }
}
```

### Adding a Roadmap Item
Edit the `roadmap` section in `/apps/web/data/changelog.json`:

```json
{
  "en": {
    "roadmap": {
      "now": [
        {
          "title": "Feature name",
          "detail": "Detailed description of the feature and its impact.",
          "eta": "Shipping Q1"
        }
      ]
    }
  }
}
```

### Updating Stats
Edit the `stats` section in `/apps/web/data/changelog.json`:

```json
{
  "en": {
    "stats": {
      "cadenceLabel": "Bi-weekly drops",
      "dropsPerMonth": "2",
      "dropsSuffix": "drops/month",
      "nextLabel": "Next drop",
      "nextValue": "Nov 1, 2025",
      "nextNote": "Sprint 22",
      "updatedLabel": "Updated",
      "updatedValue": "Oct 2025",
      "updatedNote": "2 days ago"
    }
  }
}
```

### Customizing UI Text
All UI labels and copy are in `/apps/web/locales/{en,fr}.json` under the `changelog` key:

```json
{
  "changelog": {
    "badge": "Product & Infra",
    "title": ["Changelog", "and live roadmap"],
    "subtitle": "One place for every release...",
    "bucketLabels": {
      "now": "Now",
      "next": "Next",
      "later": "Later"
    }
  }
}
```

## File Structure

### `/apps/web/types/changelog.ts`
TypeScript definitions for all changelog data structures:
- `ChangelogData`: Main data structure
- `RoadmapItem`, `Release`: Individual item types
- `ChangelogTranslations`: UI translation structure

### `/apps/web/utils/changelogLoader.ts`
Centralized loader functions:
- `loadChangelogData(language)`: Load data for a specific language
- `getAvailableChangelogLanguages()`: Get all available languages
- `isChangelogLanguageAvailable(language)`: Check if language is supported

### `/apps/web/app/[locale]/changelog/page.tsx`
Server component responsibilities:
- Generate SEO metadata (title, description, OG tags)
- Handle language routing
- Render client component

### `/apps/web/app/[locale]/changelog/ChangelogPageClient.tsx`
Client component responsibilities:
- Load changelog data via loader
- Fetch UI translations from context
- Render all sections with animations
- Handle user interactions

## Testing

### Manual Testing Checklist
- [ ] Visit `/en/changelog` and verify English content displays
- [ ] Visit `/fr/changelog` and verify French content displays
- [ ] Check that roadmap items render in all 3 buckets (Now, Next, Later)
- [ ] Verify release notes cards link to correct blog posts
- [ ] Test stat cards display correct numbers
- [ ] Confirm all 4 access channel cards link correctly
- [ ] Check responsive design on mobile
- [ ] Verify animations trigger on scroll

### Data Validation
```bash
# Validate JSON structure
node -e "JSON.parse(require('fs').readFileSync('apps/web/data/changelog.json', 'utf-8'))"

# Check both languages exist
node -e "const data = JSON.parse(require('fs').readFileSync('apps/web/data/changelog.json', 'utf-8')); console.log('Languages:', Object.keys(data))"
```

## SEO Configuration
SEO metadata is defined in `/apps/web/data/seo-config.json`:

```json
{
  "en": {
    "changelog": {
      "title": "VMCloud Changelog & Roadmap | Product & Infra Releases 2025",
      "description": "Release notes for product, infrastructure...",
      "canonical": "https://vmcl.fr/en/changelog"
    }
  }
}
```

## Future Enhancements

### Planned Improvements
1. **RSS Feed**: Generate RSS/Atom feed from changelog.json
2. **Search**: Add search functionality for releases
3. **Filtering**: Filter releases by tag (Product, Infrastructure, etc.)
4. **Webhooks**: Notify when new releases are published
5. **Admin Panel**: CMS-style interface for editing changelog
6. **Version History**: Track changes to roadmap items over time

### Technical Debt
- None identified - system is cleanly architected

## Maintenance

### Monthly Tasks
- [ ] Update stats with latest sprint/drop information
- [ ] Move shipped roadmap items from "Now" to "Releases"
- [ ] Add new roadmap items for upcoming features
- [ ] Archive old releases (keep last 12 months visible)

### When to Update
- **Roadmap**: Update after each planning session
- **Releases**: Add entry for each bi-weekly drop
- **Stats**: Update every 2 weeks before drop
- **UI Translations**: Only when adding new UI elements

## Related Files
- `/apps/web/data/seo-config.json`: SEO metadata
- `/apps/web/components/layout/Header.tsx`: Changelog nav link
- `/docs/DOCUMENTATION_FEATURES.md`: Index of all feature docs
- `/docs/PROJECT_STATUS.md`: Overall project status

## Support
For questions about the changelog system, refer to:
- This documentation
- Type definitions in `/apps/web/types/changelog.ts`
- Example data in `/apps/web/data/changelog.json`
