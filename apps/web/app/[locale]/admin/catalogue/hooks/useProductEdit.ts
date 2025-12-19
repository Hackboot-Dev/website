// apps/web/app/[locale]/admin/catalogue/hooks/useProductEdit.ts
// Description: Hook for product editing state and logic
// Last modified: 2025-12-19

'use client';

import { useState, useCallback } from 'react';
import type {
  Product,
  ProductTranslation,
  CategoryData,
  TechnicalSection,
  TechnicalSpec,
  BenchmarksData,
  BenchmarkMetric,
  SecurityData,
  FeaturesData,
  EditModalTab,
  SectionsSubTab,
} from '../types';
import { BASE_FIELDS } from '../constants';
import { isValidProductId } from '../utils';
import displayConfig from '../../../../../data/products/display-config.json';

type UseProductEditOptions = {
  onSave: (
    product: Product,
    translations: { fr: ProductTranslation; en: ProductTranslation },
    isNew: boolean
  ) => void;
};

export function useProductEdit({ onSave }: UseProductEditOptions) {
  // Modal state
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [activeTab, setActiveTab] = useState<EditModalTab>('general');
  const [sectionsSubTab, setSectionsSubTab] = useState<SectionsSubTab>('technical');
  const [translationTab, setTranslationTab] = useState<'fr' | 'en'>('fr');
  const [saveError, setSaveError] = useState<string | null>(null);

  // Editing state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingTranslationsFr, setEditingTranslationsFr] = useState<ProductTranslation>({});
  const [editingTranslationsEn, setEditingTranslationsEn] = useState<ProductTranslation>({});
  const [editingTechnicalSections, setEditingTechnicalSections] = useState<TechnicalSection[]>([]);
  const [editingBenchmarks, setEditingBenchmarks] = useState<BenchmarksData>({ metrics: [] });
  const [editingSecurity, setEditingSecurity] = useState<SecurityData>({ items: [] });
  const [editingFeatures, setEditingFeatures] = useState<FeaturesData>({ items: [] });

  // Open modal for editing existing product
  const openEditModal = useCallback((product: Product, category: CategoryData) => {
    setIsCreateMode(false);
    setSaveError(null);
    setEditingProduct({ ...product });
    setEditingTranslationsFr(category.translations?.fr?.[product.id] ? { ...category.translations.fr[product.id] } : {});
    setEditingTranslationsEn(category.translations?.en?.[product.id] ? { ...category.translations.en[product.id] } : {});

    // Initialize sections from product or fallback to category config
    const categoryConfig = (displayConfig as Record<string, unknown>)[category.id] || {};

    setEditingTechnicalSections(
      product.technicalSections ||
      (categoryConfig as { technicalSections?: TechnicalSection[] }).technicalSections ||
      []
    );
    setEditingBenchmarks(
      product.benchmarks ||
      (categoryConfig as { benchmarks?: BenchmarksData }).benchmarks ||
      { metrics: [] }
    );
    setEditingSecurity(
      product.security ||
      (categoryConfig as { security?: SecurityData }).security ||
      { items: [] }
    );
    setEditingFeatures(
      product.features ||
      (categoryConfig as { features?: FeaturesData }).features ||
      { items: [] }
    );

    setActiveTab('general');
    setSectionsSubTab('technical');
    setIsOpen(true);
  }, []);

  // Open modal for creating new product
  const openCreateModal = useCallback((category: CategoryData) => {
    setIsCreateMode(true);
    setSaveError(null);

    setEditingProduct({
      id: '',
      name: '',
      category: category.id,
      tier: 'starter',
    });
    setEditingTranslationsFr({});
    setEditingTranslationsEn({});

    // Initialize sections from category config as template
    const categoryConfig = (displayConfig as Record<string, unknown>)[category.id] || {};

    setEditingTechnicalSections((categoryConfig as { technicalSections?: TechnicalSection[] }).technicalSections || []);
    setEditingBenchmarks((categoryConfig as { benchmarks?: BenchmarksData }).benchmarks || { metrics: [] });
    setEditingSecurity((categoryConfig as { security?: SecurityData }).security || { items: [] });
    setEditingFeatures((categoryConfig as { features?: FeaturesData }).features || { items: [] });

    setActiveTab('general');
    setSectionsSubTab('technical');
    setIsOpen(true);
  }, []);

  // Close modal
  const closeModal = useCallback(() => {
    setIsOpen(false);
    setSaveError(null);
  }, []);

  // Update editing product field
  const updateField = useCallback((field: string, value: unknown) => {
    if (!editingProduct) return;
    setEditingProduct({ ...editingProduct, [field]: value });
  }, [editingProduct]);

  // Add spec to editing product
  const addSpec = useCallback(() => {
    if (!editingProduct) return;
    const newKey = `new_spec_${Date.now()}`;
    setEditingProduct({ ...editingProduct, [newKey]: '' });
  }, [editingProduct]);

  // Remove spec from editing product
  const removeSpec = useCallback((key: string) => {
    if (!editingProduct) return;
    const { [key]: _, ...rest } = editingProduct;
    setEditingProduct(rest as Product);
  }, [editingProduct]);

  // Rename spec key
  const renameSpecKey = useCallback((oldKey: string, newKey: string) => {
    if (!editingProduct || oldKey === newKey) return;
    const value = editingProduct[oldKey];
    const { [oldKey]: _, ...rest } = editingProduct;
    setEditingProduct({ ...rest, [newKey]: value } as Product);
  }, [editingProduct]);

  // Update translation field
  const updateTranslation = useCallback((lang: 'fr' | 'en', field: keyof ProductTranslation, value: string | string[]) => {
    if (lang === 'fr') {
      setEditingTranslationsFr(prev => ({ ...prev, [field]: value }));
    } else {
      setEditingTranslationsEn(prev => ({ ...prev, [field]: value }));
    }
  }, []);

  // Translation array helpers
  const addTranslationArrayItem = useCallback((lang: 'fr' | 'en', field: 'features' | 'use_cases') => {
    const current = lang === 'fr' ? editingTranslationsFr : editingTranslationsEn;
    const arr = current[field] || [];
    updateTranslation(lang, field, [...arr, '']);
  }, [editingTranslationsFr, editingTranslationsEn, updateTranslation]);

  const removeTranslationArrayItem = useCallback((lang: 'fr' | 'en', field: 'features' | 'use_cases', index: number) => {
    const current = lang === 'fr' ? editingTranslationsFr : editingTranslationsEn;
    const arr = [...(current[field] || [])];
    arr.splice(index, 1);
    updateTranslation(lang, field, arr);
  }, [editingTranslationsFr, editingTranslationsEn, updateTranslation]);

  const updateTranslationArrayItem = useCallback((lang: 'fr' | 'en', field: 'features' | 'use_cases', index: number, value: string) => {
    const current = lang === 'fr' ? editingTranslationsFr : editingTranslationsEn;
    const arr = [...(current[field] || [])];
    arr[index] = value;
    updateTranslation(lang, field, arr);
  }, [editingTranslationsFr, editingTranslationsEn, updateTranslation]);

  // Technical sections helpers
  const addTechnicalSection = useCallback(() => {
    setEditingTechnicalSections(prev => [
      ...prev,
      { category: 'Nouvelle section', category_fr: 'Nouvelle section', specs: [] }
    ]);
  }, []);

  const removeTechnicalSection = useCallback((index: number) => {
    setEditingTechnicalSections(prev => {
      const newSections = [...prev];
      newSections.splice(index, 1);
      return newSections;
    });
  }, []);

  const updateTechnicalSection = useCallback((index: number, field: keyof TechnicalSection, value: string | TechnicalSpec[]) => {
    setEditingTechnicalSections(prev => {
      const newSections = [...prev];
      newSections[index] = { ...newSections[index], [field]: value };
      return newSections;
    });
  }, []);

  const addSpecToSection = useCallback((sectionIndex: number) => {
    setEditingTechnicalSections(prev => {
      const newSections = [...prev];
      newSections[sectionIndex] = {
        ...newSections[sectionIndex],
        specs: [...newSections[sectionIndex].specs, { name: '', name_fr: '', value: '', value_fr: '' }]
      };
      return newSections;
    });
  }, []);

  const removeSpecFromSection = useCallback((sectionIndex: number, specIndex: number) => {
    setEditingTechnicalSections(prev => {
      const newSections = [...prev];
      const newSpecs = [...newSections[sectionIndex].specs];
      newSpecs.splice(specIndex, 1);
      newSections[sectionIndex] = { ...newSections[sectionIndex], specs: newSpecs };
      return newSections;
    });
  }, []);

  const updateSpecInSection = useCallback((sectionIndex: number, specIndex: number, field: keyof TechnicalSpec, value: string) => {
    setEditingTechnicalSections(prev => {
      const newSections = [...prev];
      const newSpecs = [...newSections[sectionIndex].specs];
      newSpecs[specIndex] = { ...newSpecs[specIndex], [field]: value };
      newSections[sectionIndex] = { ...newSections[sectionIndex], specs: newSpecs };
      return newSections;
    });
  }, []);

  // Benchmarks helpers
  const addBenchmarkMetric = useCallback(() => {
    setEditingBenchmarks(prev => ({
      ...prev,
      metrics: [...prev.metrics, { name: '', name_fr: '', value: 0, unit: '', unit_fr: '', comparison: '', comparison_fr: '' }]
    }));
  }, []);

  const removeBenchmarkMetric = useCallback((index: number) => {
    setEditingBenchmarks(prev => {
      const newMetrics = [...prev.metrics];
      newMetrics.splice(index, 1);
      return { ...prev, metrics: newMetrics };
    });
  }, []);

  const updateBenchmarkMetric = useCallback((index: number, field: keyof BenchmarkMetric, value: string | number) => {
    setEditingBenchmarks(prev => {
      const newMetrics = [...prev.metrics];
      newMetrics[index] = { ...newMetrics[index], [field]: value };
      return { ...prev, metrics: newMetrics };
    });
  }, []);

  const updateBenchmarkField = useCallback((field: keyof BenchmarksData, value: string) => {
    setEditingBenchmarks(prev => ({ ...prev, [field]: value }));
  }, []);

  // Security helpers
  const addSecurityItem = useCallback(() => {
    setEditingSecurity(prev => ({
      ...prev,
      items: [...prev.items, { en: '', fr: '' }]
    }));
  }, []);

  const removeSecurityItem = useCallback((index: number) => {
    setEditingSecurity(prev => {
      const newItems = [...prev.items];
      newItems.splice(index, 1);
      return { ...prev, items: newItems };
    });
  }, []);

  const updateSecurityItem = useCallback((index: number, lang: 'en' | 'fr', value: string) => {
    setEditingSecurity(prev => {
      const newItems = [...prev.items];
      const item = newItems[index];
      if (typeof item === 'string') {
        newItems[index] = { en: lang === 'en' ? value : item, fr: lang === 'fr' ? value : item };
      } else {
        newItems[index] = { ...item, [lang]: value };
      }
      return { ...prev, items: newItems };
    });
  }, []);

  const updateSecurityField = useCallback((field: keyof SecurityData, value: string) => {
    setEditingSecurity(prev => ({ ...prev, [field]: value }));
  }, []);

  // Features helpers
  const addFeatureItem = useCallback(() => {
    setEditingFeatures(prev => ({
      ...prev,
      items: [...prev.items, { en: '', fr: '' }]
    }));
  }, []);

  const removeFeatureItem = useCallback((index: number) => {
    setEditingFeatures(prev => {
      const newItems = [...prev.items];
      newItems.splice(index, 1);
      return { ...prev, items: newItems };
    });
  }, []);

  const updateFeatureItem = useCallback((index: number, lang: 'en' | 'fr', value: string) => {
    setEditingFeatures(prev => {
      const newItems = [...prev.items];
      const item = newItems[index];
      if (typeof item === 'string') {
        newItems[index] = { en: lang === 'en' ? value : item, fr: lang === 'fr' ? value : item };
      } else {
        newItems[index] = { ...item, [lang]: value };
      }
      return { ...prev, items: newItems };
    });
  }, []);

  const updateFeaturesField = useCallback((field: keyof FeaturesData, value: string) => {
    setEditingFeatures(prev => ({ ...prev, [field]: value }));
  }, []);

  // Validation
  const getValidationErrors = useCallback((): string[] => {
    if (!editingProduct) return [];
    const errors: string[] = [];

    if (!editingProduct.id?.trim()) {
      errors.push('ID requis');
    } else if (!isValidProductId(editingProduct.id)) {
      errors.push('ID invalide (minuscules, chiffres, tirets)');
    }

    if (!editingProduct.name?.trim()) {
      errors.push('Nom requis');
    }

    const hasPricing =
      (editingProduct.monthly !== undefined && editingProduct.monthly !== null) ||
      (editingProduct.hourly !== undefined && editingProduct.hourly !== null) ||
      (editingProduct.annual !== undefined && editingProduct.annual !== null) ||
      (editingProduct.price_per_gb_month !== undefined && editingProduct.price_per_gb_month !== null);

    if (!hasPricing) {
      errors.push('Au moins un tarif requis');
    }

    const hasFrTranslation = editingTranslationsFr.usage || editingTranslationsFr.description;
    const hasEnTranslation = editingTranslationsEn.usage || editingTranslationsEn.description;

    if (!hasFrTranslation && !hasEnTranslation) {
      errors.push('Au moins une traduction (FR ou EN)');
    }

    return errors;
  }, [editingProduct, editingTranslationsFr, editingTranslationsEn]);

  const validationErrors = getValidationErrors();
  const canSave = validationErrors.length === 0;

  // Get product specs for editing
  const getEditingProductSpecs = useCallback((): [string, unknown][] => {
    if (!editingProduct) return [];
    return Object.entries(editingProduct).filter(([key]) => !BASE_FIELDS.includes(key));
  }, [editingProduct]);

  // Save product
  const saveProduct = useCallback((category: CategoryData) => {
    if (!editingProduct || !canSave) return;

    const categoryId = editingProduct.category;

    // Build the product object
    const productToSave: Product = {
      id: editingProduct.id,
      name: editingProduct.name,
      category: categoryId,
      tier: editingProduct.tier || 'starter',
    };

    // Add pricing if defined
    if (editingProduct.monthly !== undefined && editingProduct.monthly !== null) {
      productToSave.monthly = editingProduct.monthly;
    }
    if (editingProduct.hourly !== undefined && editingProduct.hourly !== null) {
      productToSave.hourly = editingProduct.hourly;
    }
    if (editingProduct.annual !== undefined && editingProduct.annual !== null) {
      productToSave.annual = editingProduct.annual;
    }
    if (editingProduct.price_per_gb_month !== undefined && editingProduct.price_per_gb_month !== null) {
      productToSave.price_per_gb_month = editingProduct.price_per_gb_month;
    }

    // Add specs (everything except base fields)
    Object.entries(editingProduct).forEach(([key, value]) => {
      if (!BASE_FIELDS.includes(key) && value !== undefined && value !== null && value !== '') {
        productToSave[key] = value;
      }
    });

    // Add sections if they differ from category config
    const categoryConfig = (displayConfig as Record<string, unknown>)[categoryId] || {};

    if (editingTechnicalSections.length > 0 &&
        JSON.stringify(editingTechnicalSections) !== JSON.stringify((categoryConfig as { technicalSections?: unknown }).technicalSections)) {
      productToSave.technicalSections = editingTechnicalSections;
    }
    if (editingBenchmarks.metrics.length > 0 &&
        JSON.stringify(editingBenchmarks) !== JSON.stringify((categoryConfig as { benchmarks?: unknown }).benchmarks)) {
      productToSave.benchmarks = editingBenchmarks;
    }
    if (editingSecurity.items.length > 0 &&
        JSON.stringify(editingSecurity) !== JSON.stringify((categoryConfig as { security?: unknown }).security)) {
      productToSave.security = editingSecurity;
    }
    if (editingFeatures.items.length > 0 &&
        JSON.stringify(editingFeatures) !== JSON.stringify((categoryConfig as { features?: unknown }).features)) {
      productToSave.features = editingFeatures;
    }

    // Clean translations
    const cleanTranslation = (t: ProductTranslation): ProductTranslation => {
      const cleaned: ProductTranslation = {};
      if (t.usage?.trim()) cleaned.usage = t.usage;
      if (t.description?.trim()) cleaned.description = t.description;
      if (t.use_cases?.length && t.use_cases.some(u => u.trim())) {
        cleaned.use_cases = t.use_cases.filter(u => u.trim());
      }
      if (t.features?.length && t.features.some(f => f.trim())) {
        cleaned.features = t.features.filter(f => f.trim());
      }
      if (t.target_audience?.trim()) cleaned.target_audience = t.target_audience;
      if (t.highlight?.trim()) cleaned.highlight = t.highlight;
      return cleaned;
    };

    // Check if ID already exists (for new products)
    if (isCreateMode) {
      const existingInCategory = category.products?.some(p => p.id === productToSave.id);
      if (existingInCategory) {
        setSaveError(`Un produit avec l'ID "${productToSave.id}" existe déjà`);
        return;
      }
    }

    // Call the onSave callback
    onSave(
      productToSave,
      {
        fr: cleanTranslation(editingTranslationsFr),
        en: cleanTranslation(editingTranslationsEn),
      },
      isCreateMode
    );

    // Close modal
    setIsOpen(false);
    setSaveError(null);
  }, [
    editingProduct,
    canSave,
    isCreateMode,
    editingTechnicalSections,
    editingBenchmarks,
    editingSecurity,
    editingFeatures,
    editingTranslationsFr,
    editingTranslationsEn,
    onSave,
  ]);

  return {
    // Modal state
    isOpen,
    isCreateMode,
    activeTab,
    setActiveTab,
    sectionsSubTab,
    setSectionsSubTab,
    translationTab,
    setTranslationTab,
    saveError,

    // Editing state
    editingProduct,
    editingTranslationsFr,
    editingTranslationsEn,
    editingTechnicalSections,
    editingBenchmarks,
    editingSecurity,
    editingFeatures,

    // Modal actions
    openEditModal,
    openCreateModal,
    closeModal,
    saveProduct,

    // Field updates
    updateField,
    addSpec,
    removeSpec,
    renameSpecKey,

    // Translation updates
    updateTranslation,
    addTranslationArrayItem,
    removeTranslationArrayItem,
    updateTranslationArrayItem,

    // Technical sections
    addTechnicalSection,
    removeTechnicalSection,
    updateTechnicalSection,
    addSpecToSection,
    removeSpecFromSection,
    updateSpecInSection,

    // Benchmarks
    addBenchmarkMetric,
    removeBenchmarkMetric,
    updateBenchmarkMetric,
    updateBenchmarkField,

    // Security
    addSecurityItem,
    removeSecurityItem,
    updateSecurityItem,
    updateSecurityField,

    // Features
    addFeatureItem,
    removeFeatureItem,
    updateFeatureItem,
    updateFeaturesField,

    // Validation
    validationErrors,
    canSave,
    getEditingProductSpecs,
  };
}
