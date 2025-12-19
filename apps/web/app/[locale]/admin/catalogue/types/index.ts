// apps/web/app/[locale]/admin/catalogue/types/index.ts
// Description: Catalogue module types
// Last modified: 2025-12-19

// ============================================================
// TECHNICAL SPECS
// ============================================================

export type TechnicalSpec = {
  name: string;
  name_fr?: string;
  value: string;
  value_fr?: string;
};

export type TechnicalSection = {
  category: string;
  category_fr?: string;
  specs: TechnicalSpec[];
};

// ============================================================
// BENCHMARKS
// ============================================================

export type BenchmarkMetric = {
  name: string;
  name_fr?: string;
  value: number;
  unit: string;
  unit_fr?: string;
  comparison: string;
  comparison_fr?: string;
};

export type BenchmarksData = {
  title?: string;
  title_fr?: string;
  subtitle?: string;
  subtitle_fr?: string;
  metrics: BenchmarkMetric[];
};

// ============================================================
// SECURITY & FEATURES
// ============================================================

export type SecurityData = {
  title?: string;
  title_fr?: string;
  subtitle?: string;
  subtitle_fr?: string;
  items: Array<string | { en: string; fr: string }>;
};

export type FeaturesData = {
  title?: string;
  title_fr?: string;
  items: Array<string | { en: string; fr: string }>;
};

// ============================================================
// PRODUCT
// ============================================================

export type Product = {
  id: string;
  name: string;
  category: string;
  tier: string;
  monthly?: number;
  hourly?: number;
  annual?: number;
  price_per_gb_month?: number;
  // Display sections (per product, fallback to category config)
  technicalSections?: TechnicalSection[];
  benchmarks?: BenchmarksData;
  security?: SecurityData;
  features?: FeaturesData;
  useCases?: FeaturesData;
  [key: string]: unknown;
};

export type ProductTranslation = {
  usage?: string;
  description?: string;
  use_cases?: string[];
  features?: string[];
  target_audience?: string;
  highlight?: string;
};

// ============================================================
// CATEGORY
// ============================================================

export type CategoryData = {
  id: string;
  name: string;
  displayName: string;
  products: Product[];
  productCount: number;
  translations?: {
    fr: Record<string, ProductTranslation>;
    en: Record<string, ProductTranslation>;
  };
  updatedAt?: string;
};

// ============================================================
// UI TYPES
// ============================================================

export type EditModalTab = 'general' | 'specs' | 'translations' | 'sections';
export type SectionsSubTab = 'technical' | 'benchmarks' | 'security' | 'features';
export type TranslationTab = 'fr' | 'en';

export type PendingChange = {
  product: Product;
  translations: {
    fr: ProductTranslation;
    en: ProductTranslation;
  };
  isNew: boolean;
};
