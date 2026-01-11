// /workspaces/website/apps/web/lib/catalogue/publicCatalogueLoader.ts
// Description: Loader for public catalogue data from Firebase (vmclpublic) - NO fallback
// Last modified: 2025-12-13

import { getPublicDb } from '../firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

// Types
export type Product = {
  id: string;
  name: string;
  category: string;
  tier: string;
  monthly?: number;
  hourly?: number;
  annual?: number;
  price_per_gb_month?: number;
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

export type EnrichedProduct = Product & ProductTranslation;

export type CategoryData = {
  id: string;
  name: string;
  displayName: string;
  displayConfig: Record<string, unknown>;
  products: Product[];
  productCount: number;
  translations?: {
    fr: Record<string, ProductTranslation>;
    en: Record<string, ProductTranslation>;
  };
  publishedAt?: string;
  updatedAt?: string;
};

export type CatalogueManifest = {
  categories: string[];
  totalProducts: number;
  lastPublished: string;
  version: number;
};

// In-memory cache for SSR/SSG
let catalogueCache: Record<string, CategoryData> | null = null;
let manifestCache: CatalogueManifest | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache TTL

/**
 * Get all categories from Firebase Public
 * Returns empty array if Firebase is unavailable
 */
export async function getAllCategories(): Promise<CategoryData[]> {
  const publicDb = getPublicDb();

  // Check memory cache first
  if (catalogueCache && Date.now() - cacheTimestamp < CACHE_TTL) {
    return Object.values(catalogueCache);
  }

  if (!publicDb) {
    console.warn('Firebase public DB not available');
    return [];
  }

  try {
    const categoriesData: CategoryData[] = [];
    const catalogueRef = collection(publicDb, 'catalogue');
    const snapshot = await getDocs(catalogueRef);

    snapshot.forEach((docSnap) => {
      if (docSnap.id !== '_manifest') {
        categoriesData.push(docSnap.data() as CategoryData);
      }
    });

    // Update cache
    catalogueCache = {};
    categoriesData.forEach((cat) => {
      catalogueCache![cat.id] = cat;
    });
    cacheTimestamp = Date.now();

    return categoriesData;
  } catch (error) {
    console.error('Failed to load catalogue from Firebase:', error);
    return [];
  }
}

/**
 * Get a single category by ID from Firebase Public
 */
export async function getCategoryById(categoryId: string): Promise<CategoryData | null> {
  const publicDb = getPublicDb();

  // Check memory cache first
  if (catalogueCache && catalogueCache[categoryId] && Date.now() - cacheTimestamp < CACHE_TTL) {
    return catalogueCache[categoryId];
  }

  if (!publicDb) {
    console.warn('Firebase public DB not available');
    return null;
  }

  try {
    const categoryRef = doc(publicDb, 'catalogue', categoryId);
    const categorySnap = await getDoc(categoryRef);

    if (categorySnap.exists()) {
      const data = categorySnap.data() as CategoryData;

      // Update cache
      if (!catalogueCache) catalogueCache = {};
      catalogueCache[categoryId] = data;
      cacheTimestamp = Date.now();

      return data;
    }
    return null;
  } catch (error) {
    console.error(`Failed to load category ${categoryId} from Firebase:`, error);
    return null;
  }
}

/**
 * Get all products from a specific category
 */
export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const category = await getCategoryById(categoryId);
  return category?.products || [];
}

/**
 * Get a single product by ID
 */
export async function getProductById(categoryId: string, productId: string): Promise<Product | null> {
  const products = await getProductsByCategory(categoryId);
  return products.find((p) => p.id === productId) || null;
}

/**
 * Get enriched product data with translations
 * This is the main function for product pages
 *
 * IMPORTANT: Products without translation in the requested language are filtered out
 * A product needs at least 'usage' OR 'description' to be visible in a language
 */
export async function getEnrichedProductData(language: string = 'fr'): Promise<Record<string, EnrichedProduct[]>> {
  const categories = await getAllCategories();
  const enrichedData: Record<string, EnrichedProduct[]> = {};

  for (const category of categories) {
    const langTranslations = category.translations?.[language as 'fr' | 'en'] || {};
    const otherLang = language === 'fr' ? 'en' : 'fr';
    const otherLangTranslations = category.translations?.[otherLang as 'fr' | 'en'] || {};

    enrichedData[category.id] = category.products
      .filter((product) => {
        const translation = langTranslations[product.id];
        const otherTranslation = otherLangTranslations[product.id];

        // Product is visible if it has translation in current language
        const hasCurrentLangTranslation = translation?.usage || translation?.description;

        // OR if it has no translation in any language (legacy/default behavior)
        const hasNoTranslationAtAll = !otherTranslation?.usage && !otherTranslation?.description &&
                                       !translation?.usage && !translation?.description;

        return hasCurrentLangTranslation || hasNoTranslationAtAll;
      })
      .map((product) => {
        const translation = langTranslations[product.id] || {};

        return {
          ...product,
          usage: translation.usage || 'N/A',
          description: translation.description || 'N/A',
          use_cases: translation.use_cases || [],
          features: translation.features || [],
          target_audience: translation.target_audience || '',
          highlight: translation.highlight || '',
        };
      });
  }

  return enrichedData;
}

/**
 * Get enriched products for a single category
 * Products without translation in the requested language are filtered out
 */
export async function getEnrichedCategoryProducts(
  categoryId: string,
  language: string = 'fr'
): Promise<EnrichedProduct[]> {
  const category = await getCategoryById(categoryId);
  if (!category) return [];

  const langTranslations = category.translations?.[language as 'fr' | 'en'] || {};
  const otherLang = language === 'fr' ? 'en' : 'fr';
  const otherLangTranslations = category.translations?.[otherLang as 'fr' | 'en'] || {};

  return category.products
    .filter((product) => {
      const translation = langTranslations[product.id];
      const otherTranslation = otherLangTranslations[product.id];

      // Product is visible if it has translation in current language
      const hasCurrentLangTranslation = translation?.usage || translation?.description;

      // OR if it has no translation in any language (legacy/default behavior)
      const hasNoTranslationAtAll = !otherTranslation?.usage && !otherTranslation?.description &&
                                     !translation?.usage && !translation?.description;

      return hasCurrentLangTranslation || hasNoTranslationAtAll;
    })
    .map((product) => {
      const translation = langTranslations[product.id] || {};

      return {
        ...product,
        usage: translation.usage || 'N/A',
        description: translation.description || 'N/A',
        use_cases: translation.use_cases || [],
        features: translation.features || [],
        target_audience: translation.target_audience || '',
        highlight: translation.highlight || '',
      };
    });
}

/**
 * Get a single enriched product
 */
export async function getEnrichedProduct(
  categoryId: string,
  productId: string,
  language: string = 'fr'
): Promise<EnrichedProduct | null> {
  const products = await getEnrichedCategoryProducts(categoryId, language);
  return products.find((p) => p.id === productId) || null;
}

/**
 * Get catalogue manifest (metadata)
 */
export async function getCatalogueManifest(): Promise<CatalogueManifest | null> {
  const publicDb = getPublicDb();

  if (manifestCache && Date.now() - cacheTimestamp < CACHE_TTL) {
    return manifestCache;
  }

  if (!publicDb) {
    return null;
  }

  try {
    const manifestRef = doc(publicDb, 'catalogue', '_manifest');
    const manifestSnap = await getDoc(manifestRef);

    if (manifestSnap.exists()) {
      manifestCache = manifestSnap.data() as CatalogueManifest;
      return manifestCache;
    }
    return null;
  } catch (error) {
    console.error('Failed to load manifest from Firebase:', error);
    return null;
  }
}

/**
 * Invalidate cache (call after publishing new data)
 */
export function invalidateCatalogueCache(): void {
  catalogueCache = null;
  manifestCache = null;
  cacheTimestamp = 0;
}
