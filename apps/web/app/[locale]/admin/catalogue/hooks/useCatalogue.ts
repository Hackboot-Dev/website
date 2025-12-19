// apps/web/app/[locale]/admin/catalogue/hooks/useCatalogue.ts
// Description: Hook for catalogue data management
// Last modified: 2025-12-19

'use client';

import { useState, useCallback, useEffect } from 'react';
import { getPublicDb } from '../../../../../lib/firebase';
import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import type { CategoryData, Product, ProductTranslation, PendingChange } from '../types';
import { CATEGORY_ORDER, CATALOGUE_CACHE_KEY, CATALOGUE_CACHE_TTL } from '../constants';

type UseCatalogueOptions = {
  autoSaveDelay?: number;
};

export function useCatalogue(options: UseCatalogueOptions = {}) {
  const { autoSaveDelay = 1000 } = options;

  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Pending changes state
  const [pendingProducts, setPendingProducts] = useState<Map<string, PendingChange>>(new Map());
  const [pendingDeletions, setPendingDeletions] = useState<Set<string>>(new Set());

  // Sort categories by predefined order
  const sortCategories = useCallback((cats: CategoryData[]) => {
    return [...cats].sort((a, b) => {
      const indexA = CATEGORY_ORDER.indexOf(a.id as typeof CATEGORY_ORDER[number]);
      const indexB = CATEGORY_ORDER.indexOf(b.id as typeof CATEGORY_ORDER[number]);
      if (indexA === -1 && indexB === -1) return (a.name || a.id).localeCompare(b.name || b.id);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }, []);

  // Load catalogue from Firebase
  const loadCatalogue = useCallback(async (force = false) => {
    const publicDb = getPublicDb();
    if (!publicDb) {
      setError('Firebase non initialisé');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Check cache first (unless force reload)
      if (!force) {
        const cached = localStorage.getItem(CATALOGUE_CACHE_KEY);
        if (cached) {
          try {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - new Date(timestamp).getTime() < CATALOGUE_CACHE_TTL) {
              setCategories(sortCategories(data));
              setLoading(false);
              return;
            }
          } catch { /* Invalid cache */ }
        }
      }

      const categoriesData: CategoryData[] = [];
      const snapshot = await getDocs(collection(publicDb, 'catalogue'));

      snapshot.forEach((docSnap) => {
        if (docSnap.id !== '_manifest') {
          categoriesData.push(docSnap.data() as CategoryData);
        }
      });

      const sortedCategories = sortCategories(categoriesData);
      setCategories(sortedCategories);

      // Update cache
      localStorage.setItem(CATALOGUE_CACHE_KEY, JSON.stringify({
        data: sortedCategories,
        timestamp: new Date().toISOString(),
      }));
    } catch (err) {
      console.error('Error loading catalogue:', err);
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  }, [sortCategories]);

  // Initial load
  useEffect(() => {
    loadCatalogue();
  }, [loadCatalogue]);

  // Add or update product in pending changes
  const addToPendingChanges = useCallback((
    categoryId: string,
    product: Product,
    translations: { fr: ProductTranslation; en: ProductTranslation },
    isNew: boolean
  ) => {
    const key = `${categoryId}:${product.id}`;
    const newPending = new Map(pendingProducts);
    newPending.set(key, { product, translations, isNew });
    setPendingProducts(newPending);

    // Update local state immediately for UI
    setCategories(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        let updatedProducts: Product[];
        if (isNew) {
          updatedProducts = [...(cat.products || []), product];
        } else {
          updatedProducts = (cat.products || []).map(p =>
            p.id === product.id ? product : p
          );
        }
        return { ...cat, products: updatedProducts };
      }
      return cat;
    }));

    setHasChanges(true);
  }, [pendingProducts]);

  // Mark product for deletion
  const markForDeletion = useCallback((categoryId: string, productId: string) => {
    const key = `${categoryId}:${productId}`;

    // Add to pending deletions
    const newDeletions = new Set(pendingDeletions);
    newDeletions.add(key);
    setPendingDeletions(newDeletions);

    // Remove from pending products if it was a new product
    const newPending = new Map(pendingProducts);
    if (newPending.has(key)) {
      newPending.delete(key);
      setPendingProducts(newPending);
    }

    // Update local state
    setCategories(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          products: cat.products.filter(p => p.id !== productId),
        };
      }
      return cat;
    }));

    setHasChanges(true);
  }, [pendingProducts, pendingDeletions]);

  // Save all pending changes to Firebase
  const saveAllChanges = useCallback(async () => {
    if (!hasChanges) return;

    setSaving(true);
    setSaveError(null);

    try {
      const publicDb = getPublicDb();
      if (!publicDb) {
        throw new Error('Firebase non disponible');
      }

      // Group changes by category
      const changesByCategory = new Map<string, {
        products: Map<string, Product>;
        translations: { fr: Record<string, ProductTranslation>; en: Record<string, ProductTranslation> };
        deletions: Set<string>;
      }>();

      // Process pending products
      pendingProducts.forEach((change) => {
        const categoryId = change.product.category;
        if (!changesByCategory.has(categoryId)) {
          changesByCategory.set(categoryId, {
            products: new Map(),
            translations: { fr: {}, en: {} },
            deletions: new Set(),
          });
        }
        const catChanges = changesByCategory.get(categoryId)!;
        catChanges.products.set(change.product.id, change.product);
        if (Object.keys(change.translations.fr).length > 0) {
          catChanges.translations.fr[change.product.id] = change.translations.fr;
        }
        if (Object.keys(change.translations.en).length > 0) {
          catChanges.translations.en[change.product.id] = change.translations.en;
        }
      });

      // Process pending deletions
      pendingDeletions.forEach((key) => {
        const [categoryId, productId] = key.split(':');
        if (!changesByCategory.has(categoryId)) {
          changesByCategory.set(categoryId, {
            products: new Map(),
            translations: { fr: {}, en: {} },
            deletions: new Set(),
          });
        }
        changesByCategory.get(categoryId)!.deletions.add(productId);
      });

      // Save each category
      for (const [categoryId, changes] of changesByCategory) {
        const categoryRef = doc(publicDb, 'catalogue', categoryId);
        const categorySnap = await getDoc(categoryRef);

        if (!categorySnap.exists()) continue;

        const categoryData = categorySnap.data();
        let products: Product[] = categoryData.products || [];
        const translations = categoryData.translations || { fr: {}, en: {} };

        // Apply deletions
        changes.deletions.forEach(productId => {
          products = products.filter(p => p.id !== productId);
          delete translations.fr[productId];
          delete translations.en[productId];
        });

        // Apply updates/additions
        changes.products.forEach((product, productId) => {
          const existingIndex = products.findIndex(p => p.id === productId);
          if (existingIndex >= 0) {
            products[existingIndex] = product;
          } else {
            products.push(product);
          }
        });

        // Apply translation updates
        Object.assign(translations.fr, changes.translations.fr);
        Object.assign(translations.en, changes.translations.en);

        // Save to Firebase
        await updateDoc(categoryRef, {
          products,
          translations,
          updatedAt: new Date().toISOString(),
        });
      }

      // Clear pending changes
      setPendingProducts(new Map());
      setPendingDeletions(new Set());
      setHasChanges(false);

      // Invalidate cache and reload
      localStorage.removeItem(CATALOGUE_CACHE_KEY);
      await loadCatalogue(true);
    } catch (error) {
      console.error('Error saving changes:', error);
      setSaveError(error instanceof Error ? error.message : 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  }, [hasChanges, pendingProducts, pendingDeletions, loadCatalogue]);

  // Auto-save when hasChanges becomes true
  useEffect(() => {
    if (!hasChanges || saving) return;

    const timeoutId = setTimeout(() => {
      saveAllChanges();
    }, autoSaveDelay);

    return () => clearTimeout(timeoutId);
  }, [hasChanges, autoSaveDelay, saveAllChanges, saving]);

  // Computed values
  const totalProducts = categories.reduce(
    (acc, cat) => acc + (cat.productCount || cat.products?.length || 0),
    0
  );

  return {
    // State
    categories,
    loading,
    error,
    saving,
    saveError,
    hasChanges,
    totalProducts,

    // Actions
    loadCatalogue,
    addToPendingChanges,
    markForDeletion,
    saveAllChanges,
    setCategories,
  };
}
