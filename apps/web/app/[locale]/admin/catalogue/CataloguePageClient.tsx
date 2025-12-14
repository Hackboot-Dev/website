// /workspaces/website/apps/web/app/[locale]/admin/catalogue/CataloguePageClient.tsx
// Description: Complete catalogue management interface - adaptive columns layout
// Last modified: 2025-12-13

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Package,
  Server,
  Cpu,
  Globe,
  Cloud,
  Network,
  HardDrive,
  Zap,
  Loader2,
  AlertCircle,
  RefreshCw,
  ChevronRight,
  X,
  Pencil,
  Plus,
  Trash2,
  Save,
  Undo2,
} from 'lucide-react';
import { getPublicDb } from '../../../../lib/firebase';
import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import displayConfig from '../../../../data/products/display-config.json';

// Types
type TechnicalSpec = {
  name: string;
  name_fr?: string;
  value: string;
  value_fr?: string;
};

type TechnicalSection = {
  category: string;
  category_fr?: string;
  specs: TechnicalSpec[];
};

type BenchmarkMetric = {
  name: string;
  name_fr?: string;
  value: number;
  unit: string;
  unit_fr?: string;
  comparison: string;
  comparison_fr?: string;
};

type BenchmarksData = {
  title?: string;
  title_fr?: string;
  subtitle?: string;
  subtitle_fr?: string;
  metrics: BenchmarkMetric[];
};

type SecurityData = {
  title?: string;
  title_fr?: string;
  subtitle?: string;
  subtitle_fr?: string;
  items: Array<string | { en: string; fr: string }>;
};

type FeaturesData = {
  title?: string;
  title_fr?: string;
  items: Array<string | { en: string; fr: string }>;
};

type Product = {
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

type ProductTranslation = {
  usage?: string;
  description?: string;
  use_cases?: string[];
  features?: string[];
  target_audience?: string;
  highlight?: string;
};

type CategoryData = {
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

const categoryIcons: Record<string, React.ReactNode> = {
  vps: <Server className="h-5 w-5" />,
  gpu: <Cpu className="h-5 w-5" />,
  webhosting: <Globe className="h-5 w-5" />,
  paas: <Cloud className="h-5 w-5" />,
  loadbalancer: <Network className="h-5 w-5" />,
  storage: <HardDrive className="h-5 w-5" />,
  cdn: <Zap className="h-5 w-5" />,
};

const specLabels: Record<string, string> = {
  vcpu: 'vCPU',
  ram: 'RAM',
  storage: 'Stockage',
  bandwidth: 'Bande passante',
  gpu: 'GPU',
  vram: 'VRAM',
  cuda_cores: 'CUDA Cores',
  tensor_cores: 'Tensor Cores',
  sites: 'Sites',
  databases: 'Bases de données',
  emails: 'Emails',
  ssl: 'SSL',
  backup: 'Backup',
  containers: 'Containers',
  auto_scaling: 'Auto-scaling',
  requests_per_sec: 'Requêtes/sec',
  protocols: 'Protocoles',
  health_checks: 'Health Checks',
  type: 'Type',
  iops: 'IOPS',
  throughput: 'Débit',
  redundancy: 'Redondance',
  min_size: 'Taille min',
  max_size: 'Taille max',
  pops: 'Points de présence',
  traffic_included: 'Trafic inclus',
  ddos_protection: 'Protection DDoS',
  waf: 'WAF',
  cache: 'Cache',
};

const CACHE_KEY = 'catalogue_cache';

// Category order (as displayed on the website)
const CATEGORY_ORDER = ['vps', 'gpu', 'webhosting', 'paas', 'loadbalancer', 'storage', 'cdn'];

export default function CataloguePageClient() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [translationTab, setTranslationTab] = useState<'fr' | 'en'>('fr');

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingTranslationsFr, setEditingTranslationsFr] = useState<ProductTranslation>({});
  const [editingTranslationsEn, setEditingTranslationsEn] = useState<ProductTranslation>({});
  const [editModalTab, setEditModalTab] = useState<'general' | 'specs' | 'translations' | 'sections'>('general');

  // Sections editing state
  const [editingTechnicalSections, setEditingTechnicalSections] = useState<TechnicalSection[]>([]);
  const [editingBenchmarks, setEditingBenchmarks] = useState<BenchmarksData>({ metrics: [] });
  const [editingSecurity, setEditingSecurity] = useState<SecurityData>({ items: [] });
  const [editingFeatures, setEditingFeatures] = useState<FeaturesData>({ items: [] });
  const [sectionsSubTab, setSectionsSubTab] = useState<'technical' | 'benchmarks' | 'security' | 'features'>('technical');

  // Save state
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Delete state
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Pending changes state (for batch save)
  const [hasChanges, setHasChanges] = useState(false);
  const [pendingProducts, setPendingProducts] = useState<Map<string, { product: Product; translations: { fr: ProductTranslation; en: ProductTranslation }; isNew: boolean }>>(new Map());
  const [pendingDeletions, setPendingDeletions] = useState<Set<string>>(new Set());

  // Load catalogue
  // Helper to sort categories
  const sortCategories = (cats: CategoryData[]) => {
    return [...cats].sort((a, b) => {
      const indexA = CATEGORY_ORDER.indexOf(a.id);
      const indexB = CATEGORY_ORDER.indexOf(b.id);
      if (indexA === -1 && indexB === -1) return (a.name || a.id).localeCompare(b.name || b.id);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  };

  const loadCatalogue = useCallback(async (forceSync = false) => {
    if (!forceSync) {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const { data, timestamp } = JSON.parse(cached);
          setCategories(sortCategories(data));
          setLastSynced(new Date(timestamp));
          setLoading(false);
          return;
        } catch { /* Invalid cache */ }
      }
    }

    const publicDb = getPublicDb();
    if (!publicDb) {
      setError('Firebase non initialisé');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      if (forceSync) setSyncing(true);
      setError(null);

      const categoriesData: CategoryData[] = [];
      const snapshot = await getDocs(collection(publicDb, 'catalogue'));

      snapshot.forEach((docSnap) => {
        if (docSnap.id !== '_manifest') {
          categoriesData.push(docSnap.data() as CategoryData);
        }
      });

      // Sort categories by predefined order
      const sortedCategories = sortCategories(categoriesData);
      setCategories(sortedCategories);

      const now = new Date();
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data: categoriesData, timestamp: now.toISOString() }));
      setLastSynced(now);
    } catch (err) {
      console.error('Error loading catalogue:', err);
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }, []);

  useEffect(() => {
    loadCatalogue();
  }, [loadCatalogue]);

  // Computed
  const selectedCategory = categories.find(c => c.id === selectedCategoryId);
  const selectedProduct = selectedCategory?.products.find(p => p.id === selectedProductId);
  const translationFr = selectedCategory?.translations?.fr?.[selectedProductId || ''];
  const translationEn = selectedCategory?.translations?.en?.[selectedProductId || ''];
  const currentTranslation = translationTab === 'fr' ? translationFr : translationEn;

  const totalProducts = categories.reduce((acc, cat) => acc + (cat.productCount || cat.products?.length || 0), 0);

  // Helpers
  const getTierColor = (tier: string) => {
    const colors: Record<string, string> = {
      starter: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      pro: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      business: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
      enterprise: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      premium: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    };
    return colors[tier] || 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
  };

  const formatSpecValue = (value: unknown): string => {
    if (typeof value === 'boolean') return value ? 'Oui' : 'Non';
    if (Array.isArray(value)) return value.join(', ');
    return String(value);
  };

  const getProductSpecs = (product: Product) => {
    const excludeKeys = ['id', 'name', 'category', 'tier', 'monthly', 'hourly', 'annual', 'price_per_gb_month'];
    return Object.entries(product).filter(([key]) => !excludeKeys.includes(key));
  };

  // Open edit modal
  const openEditModal = () => {
    if (!selectedProduct || !selectedCategory) return;
    setIsCreateMode(false);
    setSaveError(null);
    setEditingProduct({ ...selectedProduct });
    setEditingTranslationsFr(selectedCategory.translations?.fr?.[selectedProduct.id] ? { ...selectedCategory.translations.fr[selectedProduct.id] } : {});
    setEditingTranslationsEn(selectedCategory.translations?.en?.[selectedProduct.id] ? { ...selectedCategory.translations.en[selectedProduct.id] } : {});

    // Initialize sections from product or fallback to category config
    const categoryConfig = (displayConfig as Record<string, any>)[selectedCategory.id] || {};

    setEditingTechnicalSections(
      selectedProduct.technicalSections ||
      categoryConfig.technicalSections ||
      []
    );
    setEditingBenchmarks(
      selectedProduct.benchmarks ||
      categoryConfig.benchmarks ||
      { metrics: [] }
    );
    setEditingSecurity(
      selectedProduct.security ||
      categoryConfig.security ||
      { items: [] }
    );
    setEditingFeatures(
      selectedProduct.features ||
      categoryConfig.features ||
      { items: [] }
    );

    setEditModalTab('general');
    setSectionsSubTab('technical');
    setIsEditModalOpen(true);
  };

  // Open create modal
  const openCreateModal = () => {
    if (!selectedCategory) return;
    setIsCreateMode(true);
    setSaveError(null);

    // Create empty product with category
    setEditingProduct({
      id: '',
      name: '',
      category: selectedCategory.id,
      tier: 'starter',
    });
    setEditingTranslationsFr({});
    setEditingTranslationsEn({});

    // Initialize sections from category config as template
    const categoryConfig = (displayConfig as Record<string, any>)[selectedCategory.id] || {};

    setEditingTechnicalSections(categoryConfig.technicalSections || []);
    setEditingBenchmarks(categoryConfig.benchmarks || { metrics: [] });
    setEditingSecurity(categoryConfig.security || { items: [] });
    setEditingFeatures(categoryConfig.features || { items: [] });

    setEditModalTab('general');
    setSectionsSubTab('technical');
    setIsEditModalOpen(true);
  };

  // Update editing product field
  const updateEditingField = (field: string, value: unknown) => {
    if (!editingProduct) return;
    setEditingProduct({ ...editingProduct, [field]: value });
  };

  // Add spec to editing product
  const addSpec = () => {
    if (!editingProduct) return;
    const newKey = `new_spec_${Date.now()}`;
    setEditingProduct({ ...editingProduct, [newKey]: '' });
  };

  // Remove spec from editing product
  const removeSpec = (key: string) => {
    if (!editingProduct) return;
    const { [key]: _, ...rest } = editingProduct;
    setEditingProduct(rest as Product);
  };

  // Rename spec key
  const renameSpecKey = (oldKey: string, newKey: string) => {
    if (!editingProduct || oldKey === newKey) return;
    const value = editingProduct[oldKey];
    const { [oldKey]: _, ...rest } = editingProduct;
    setEditingProduct({ ...rest, [newKey]: value } as Product);
  };

  // Update translation field
  const updateTranslation = (lang: 'fr' | 'en', field: keyof ProductTranslation, value: string | string[]) => {
    if (lang === 'fr') {
      setEditingTranslationsFr({ ...editingTranslationsFr, [field]: value });
    } else {
      setEditingTranslationsEn({ ...editingTranslationsEn, [field]: value });
    }
  };

  // Add item to translation array field
  const addTranslationArrayItem = (lang: 'fr' | 'en', field: 'features' | 'use_cases') => {
    const current = lang === 'fr' ? editingTranslationsFr : editingTranslationsEn;
    const arr = current[field] || [];
    updateTranslation(lang, field, [...arr, '']);
  };

  // Remove item from translation array field
  const removeTranslationArrayItem = (lang: 'fr' | 'en', field: 'features' | 'use_cases', index: number) => {
    const current = lang === 'fr' ? editingTranslationsFr : editingTranslationsEn;
    const arr = [...(current[field] || [])];
    arr.splice(index, 1);
    updateTranslation(lang, field, arr);
  };

  // Update item in translation array field
  const updateTranslationArrayItem = (lang: 'fr' | 'en', field: 'features' | 'use_cases', index: number, value: string) => {
    const current = lang === 'fr' ? editingTranslationsFr : editingTranslationsEn;
    const arr = [...(current[field] || [])];
    arr[index] = value;
    updateTranslation(lang, field, arr);
  };

  // === Technical Sections helpers ===
  const addTechnicalSection = () => {
    setEditingTechnicalSections([
      ...editingTechnicalSections,
      { category: 'Nouvelle section', category_fr: 'Nouvelle section', specs: [] }
    ]);
  };

  const removeTechnicalSection = (index: number) => {
    const newSections = [...editingTechnicalSections];
    newSections.splice(index, 1);
    setEditingTechnicalSections(newSections);
  };

  const updateTechnicalSection = (index: number, field: keyof TechnicalSection, value: string | TechnicalSpec[]) => {
    const newSections = [...editingTechnicalSections];
    newSections[index] = { ...newSections[index], [field]: value };
    setEditingTechnicalSections(newSections);
  };

  const addSpecToSection = (sectionIndex: number) => {
    const newSections = [...editingTechnicalSections];
    newSections[sectionIndex].specs = [
      ...newSections[sectionIndex].specs,
      { name: '', name_fr: '', value: '', value_fr: '' }
    ];
    setEditingTechnicalSections(newSections);
  };

  const removeSpecFromSection = (sectionIndex: number, specIndex: number) => {
    const newSections = [...editingTechnicalSections];
    newSections[sectionIndex].specs.splice(specIndex, 1);
    setEditingTechnicalSections(newSections);
  };

  const updateSpecInSection = (sectionIndex: number, specIndex: number, field: keyof TechnicalSpec, value: string) => {
    const newSections = [...editingTechnicalSections];
    newSections[sectionIndex].specs[specIndex] = {
      ...newSections[sectionIndex].specs[specIndex],
      [field]: value
    };
    setEditingTechnicalSections(newSections);
  };

  // === Benchmarks helpers ===
  const addBenchmarkMetric = () => {
    setEditingBenchmarks({
      ...editingBenchmarks,
      metrics: [
        ...editingBenchmarks.metrics,
        { name: '', name_fr: '', value: 0, unit: '', unit_fr: '', comparison: '', comparison_fr: '' }
      ]
    });
  };

  const removeBenchmarkMetric = (index: number) => {
    const newMetrics = [...editingBenchmarks.metrics];
    newMetrics.splice(index, 1);
    setEditingBenchmarks({ ...editingBenchmarks, metrics: newMetrics });
  };

  const updateBenchmarkMetric = (index: number, field: keyof BenchmarkMetric, value: string | number) => {
    const newMetrics = [...editingBenchmarks.metrics];
    newMetrics[index] = { ...newMetrics[index], [field]: value };
    setEditingBenchmarks({ ...editingBenchmarks, metrics: newMetrics });
  };

  // === Security/Features helpers ===
  const addSecurityItem = () => {
    setEditingSecurity({
      ...editingSecurity,
      items: [...editingSecurity.items, { en: '', fr: '' }]
    });
  };

  const removeSecurityItem = (index: number) => {
    const newItems = [...editingSecurity.items];
    newItems.splice(index, 1);
    setEditingSecurity({ ...editingSecurity, items: newItems });
  };

  const updateSecurityItem = (index: number, lang: 'en' | 'fr', value: string) => {
    const newItems = [...editingSecurity.items];
    const item = newItems[index];
    if (typeof item === 'string') {
      newItems[index] = { en: lang === 'en' ? value : item, fr: lang === 'fr' ? value : item };
    } else {
      newItems[index] = { ...item, [lang]: value };
    }
    setEditingSecurity({ ...editingSecurity, items: newItems });
  };

  const addFeatureItem = () => {
    setEditingFeatures({
      ...editingFeatures,
      items: [...editingFeatures.items, { en: '', fr: '' }]
    });
  };

  const removeFeatureItem = (index: number) => {
    const newItems = [...editingFeatures.items];
    newItems.splice(index, 1);
    setEditingFeatures({ ...editingFeatures, items: newItems });
  };

  const updateFeatureItem = (index: number, lang: 'en' | 'fr', value: string) => {
    const newItems = [...editingFeatures.items];
    const item = newItems[index];
    if (typeof item === 'string') {
      newItems[index] = { en: lang === 'en' ? value : item, fr: lang === 'fr' ? value : item };
    } else {
      newItems[index] = { ...item, [lang]: value };
    }
    setEditingFeatures({ ...editingFeatures, items: newItems });
  };

  // Validation for create/edit
  const getValidationErrors = (): string[] => {
    if (!editingProduct) return [];
    const errors: string[] = [];

    // Required fields
    if (!editingProduct.id?.trim()) {
      errors.push('ID requis');
    } else if (!/^[a-z0-9-_]+$/.test(editingProduct.id)) {
      errors.push('ID invalide (minuscules, chiffres, tirets)');
    }

    if (!editingProduct.name?.trim()) {
      errors.push('Nom requis');
    }

    // At least one pricing
    const hasPricing =
      (editingProduct.monthly !== undefined && editingProduct.monthly !== null) ||
      (editingProduct.hourly !== undefined && editingProduct.hourly !== null) ||
      (editingProduct.annual !== undefined && editingProduct.annual !== null) ||
      (editingProduct.price_per_gb_month !== undefined && editingProduct.price_per_gb_month !== null);

    if (!hasPricing) {
      errors.push('Au moins un tarif requis');
    }

    // Check for at least one translation (FR or EN)
    const hasFrTranslation = editingTranslationsFr.usage || editingTranslationsFr.description;
    const hasEnTranslation = editingTranslationsEn.usage || editingTranslationsEn.description;

    if (!hasFrTranslation && !hasEnTranslation) {
      errors.push('Au moins une traduction (FR ou EN)');
    }

    return errors;
  };

  const validationErrors = getValidationErrors();
  const canSave = validationErrors.length === 0;

  // Add product to pending changes (local only, no Firebase yet)
  const addToPendingChanges = () => {
    if (!editingProduct || !canSave || !selectedCategory) return;

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
    const baseFields = ['id', 'name', 'category', 'tier', 'monthly', 'hourly', 'annual', 'price_per_gb_month', 'technicalSections', 'benchmarks', 'security', 'features', 'useCases'];
    Object.entries(editingProduct).forEach(([key, value]) => {
      if (!baseFields.includes(key) && value !== undefined && value !== null && value !== '') {
        productToSave[key] = value;
      }
    });

    // Add sections if they differ from category config
    const categoryConfig = (displayConfig as Record<string, any>)[categoryId] || {};

    if (editingTechnicalSections.length > 0 &&
        JSON.stringify(editingTechnicalSections) !== JSON.stringify(categoryConfig.technicalSections)) {
      productToSave.technicalSections = editingTechnicalSections;
    }
    if (editingBenchmarks.metrics.length > 0 &&
        JSON.stringify(editingBenchmarks) !== JSON.stringify(categoryConfig.benchmarks)) {
      productToSave.benchmarks = editingBenchmarks;
    }
    if (editingSecurity.items.length > 0 &&
        JSON.stringify(editingSecurity) !== JSON.stringify(categoryConfig.security)) {
      productToSave.security = editingSecurity;
    }
    if (editingFeatures.items.length > 0 &&
        JSON.stringify(editingFeatures) !== JSON.stringify(categoryConfig.features)) {
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
      const existingInCategory = selectedCategory.products?.some(p => p.id === productToSave.id);
      const existingInPending = pendingProducts.has(`${categoryId}:${productToSave.id}`);
      if (existingInCategory || existingInPending) {
        setSaveError(`Un produit avec l'ID "${productToSave.id}" existe déjà`);
        return;
      }
    }

    // Add to pending changes
    const key = `${categoryId}:${productToSave.id}`;
    const newPending = new Map(pendingProducts);
    newPending.set(key, {
      product: productToSave,
      translations: {
        fr: cleanTranslation(editingTranslationsFr),
        en: cleanTranslation(editingTranslationsEn),
      },
      isNew: isCreateMode,
    });
    setPendingProducts(newPending);

    // Update local state immediately for UI
    setCategories(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        let updatedProducts: Product[];
        if (isCreateMode) {
          updatedProducts = [...(cat.products || []), productToSave];
        } else {
          updatedProducts = (cat.products || []).map(p =>
            p.id === productToSave.id ? productToSave : p
          );
        }
        return { ...cat, products: updatedProducts };
      }
      return cat;
    }));

    // Mark as having changes
    setHasChanges(true);

    // Select the product
    setSelectedProductId(productToSave.id);

    // Close modal
    setIsEditModalOpen(false);
    setSaveError(null);
  };

  // Save all pending changes to Firebase
  const saveAllChanges = async () => {
    if (!hasChanges) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      const publicDb = getPublicDb();
      if (!publicDb) {
        throw new Error('Firebase non disponible');
      }

      // Group changes by category
      const changesByCategory = new Map<string, { products: Map<string, Product>; translations: { fr: Record<string, ProductTranslation>; en: Record<string, ProductTranslation> }; deletions: Set<string> }>();

      // Process pending products
      pendingProducts.forEach((change, key) => {
        const categoryId = change.product.category;
        if (!changesByCategory.has(categoryId)) {
          changesByCategory.set(categoryId, { products: new Map(), translations: { fr: {}, en: {} }, deletions: new Set() });
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
          changesByCategory.set(categoryId, { products: new Map(), translations: { fr: {}, en: {} }, deletions: new Set() });
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

      // Invalidate cache and reload from Firebase to ensure UI matches DB
      localStorage.removeItem(CACHE_KEY);
      await loadCatalogue(true);

    } catch (error) {
      console.error('Error saving changes:', error);
      setSaveError(error instanceof Error ? error.message : 'Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  // Discard all pending changes
  const discardChanges = () => {
    setPendingProducts(new Map());
    setPendingDeletions(new Set());
    setHasChanges(false);
    // Reload from Firebase to reset local state
    loadCatalogue(true);
  };

  // Delete product (adds to pending deletions)
  const deleteProduct = () => {
    if (!selectedProduct || !selectedCategory) return;

    const key = `${selectedCategory.id}:${selectedProduct.id}`;

    // Add to pending deletions
    const newDeletions = new Set(pendingDeletions);
    newDeletions.add(key);
    setPendingDeletions(newDeletions);

    // Also remove from pending products if it was a new product that hasn't been saved yet
    const newPending = new Map(pendingProducts);
    if (newPending.has(key)) {
      newPending.delete(key);
      setPendingProducts(newPending);
    }

    // Update local state to remove visually
    setCategories(prev => prev.map(cat => {
      if (cat.id === selectedCategory.id) {
        return {
          ...cat,
          products: cat.products.filter(p => p.id !== selectedProduct.id),
        };
      }
      return cat;
    }));

    // Mark as having changes
    setHasChanges(true);

    // Deselect product
    setSelectedProductId(null);
    setShowDeleteConfirm(false);
  };

  // Loading
  if (loading && !lastSynced) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-6 w-6 animate-spin text-white" />
      </div>
    );
  }

  // Error
  if (error && categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <AlertCircle className="h-8 w-8 text-red-400" />
        <p className="text-red-400">{error}</p>
        <button onClick={() => loadCatalogue(true)} className="px-4 py-2 border border-zinc-700 text-zinc-300 hover:text-white text-sm">
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      {/* Header - Always visible */}
      <div className="flex items-center justify-between pb-4 flex-shrink-0">
        <div>
          <h1 className="text-xl font-light text-white">Catalogue Produits</h1>
          <p className="text-zinc-500 text-sm">{totalProducts} produits • {categories.length} catégories</p>
        </div>
        <button
          onClick={() => loadCatalogue(true)}
          disabled={syncing}
          className="flex items-center gap-2 px-3 py-2 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800 text-sm"
        >
          <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
          {lastSynced ? lastSynced.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : 'Sync'}
        </button>
      </div>

      {/* Columns Container - Fixed height, each column scrolls independently */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* Column 1: Categories */}
        <div
          className="flex-shrink-0 column-transition overflow-y-auto scrollbar-hide"
          style={{ width: selectedCategoryId ? 200 : '100%' }}
        >
          <p className="text-xs text-zinc-500 uppercase tracking-wider px-1 mb-2">Catégories</p>

          {/* Grid when no selection, list when selected */}
          <div className={`${selectedCategoryId ? 'space-y-2' : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'}`}>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategoryId(selectedCategoryId === category.id ? null : category.id);
                  setSelectedProductId(null);
                }}
                className={`text-left item-transition border ${
                  selectedCategoryId === category.id
                    ? 'bg-white/10 border-white/30 text-white'
                    : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white'
                } ${selectedCategoryId ? 'p-3 w-full' : 'p-5'}`}
              >
                <div className={`flex items-center gap-3 ${selectedCategoryId ? '' : 'mb-3'}`}>
                  <div className={`${selectedCategoryId ? 'p-1.5' : 'p-2.5'} bg-zinc-800 rounded-lg icon-transition`}>
                    {categoryIcons[category.id] || <Package className="h-4 w-4" />}
                  </div>
                  {selectedCategoryId ? (
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{category.name}</p>
                      <p className="text-xs text-zinc-500">{category.products?.length || 0}</p>
                    </div>
                  ) : (
                    <span className="text-2xl font-light">{category.products?.length || 0}</span>
                  )}
                  {selectedCategoryId && (
                    <ChevronRight className={`h-4 w-4 chevron-transition ${selectedCategoryId === category.id ? 'rotate-90' : ''}`} />
                  )}
                </div>
                {!selectedCategoryId && (
                  <>
                    <h3 className="text-white font-medium">{category.name}</h3>
                    <p className="text-zinc-500 text-sm">produits</p>
                  </>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Column 2: Products */}
        <div
          className={`flex-shrink-0 column-transition overflow-y-auto scrollbar-hide ${
            selectedCategoryId && selectedCategory ? 'column-visible' : 'column-hidden'
          }`}
          style={{
            width: selectedCategoryId ? (selectedProductId ? 280 : 'auto') : 0,
            flex: selectedCategoryId && !selectedProductId ? 1 : 'none',
            minWidth: selectedCategoryId ? 280 : 0,
          }}
        >
          {selectedCategory && (
            <div className="space-y-2 min-w-[280px]">
              <div className="flex items-center justify-between px-1 mb-2">
                <p className="text-xs text-zinc-500 uppercase tracking-wider">
                  {selectedCategory.name} ({selectedCategory.products?.length || 0})
                </p>
                <button
                  onClick={openCreateModal}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded transition-colors"
                >
                  <Plus className="h-3 w-3" />
                  Nouveau
                </button>
              </div>
              <div className="space-y-2">
                {selectedCategory.products?.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => {
                      setSelectedProductId(selectedProductId === product.id ? null : product.id);
                      setShowDeleteConfirm(false);
                    }}
                    className={`w-full text-left p-3 border item-transition ${
                      selectedProductId === product.id
                        ? 'bg-white/10 border-white/30'
                        : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-600'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-white text-sm font-medium truncate">{product.name || product.id}</p>
                      <span className={`px-1.5 py-0.5 text-[10px] border rounded flex-shrink-0 ${getTierColor(product.tier)}`}>
                        {product.tier}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {product.monthly && <span className="text-emerald-400">{product.monthly}€/mois</span>}
                      {product.hourly && <span className="text-blue-400">{product.hourly}€/h</span>}
                      {product.annual && <span className="text-violet-400">{product.annual}€/an</span>}
                      {product.price_per_gb_month && <span className="text-amber-400">{product.price_per_gb_month}€/GB</span>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Column 3: Product Detail */}
        <div
          className={`column-transition overflow-y-auto scrollbar-hide ${
            selectedProduct ? 'column-visible flex-1' : 'column-hidden'
          }`}
          style={{
            minWidth: selectedProduct ? 400 : 0,
            width: selectedProduct ? 'auto' : 0,
          }}
        >
          {selectedProduct && (
            <div className="min-w-[400px] space-y-4 pb-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Détails</p>
                    <h2 className="text-lg text-white font-medium">{selectedProduct.name}</h2>
                    <p className="text-zinc-500 text-sm">ID: {selectedProduct.id}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={openEditModal}
                      className="text-zinc-500 hover:text-white hover:bg-zinc-800 p-2 rounded transition-colors"
                      title="Modifier le produit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    {showDeleteConfirm ? (
                      <div className="flex items-center gap-1 bg-red-500/10 border border-red-500/30 rounded px-2 py-1">
                        <span className="text-red-400 text-xs">Supprimer ?</span>
                        <button
                          onClick={deleteProduct}
                          className="text-red-400 hover:text-red-300 p-1"
                          title="Confirmer la suppression"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className="text-zinc-500 hover:text-white p-1"
                          title="Annuler"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 p-2 rounded transition-colors"
                        title="Supprimer le produit"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                  {selectedProduct.monthly && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded">
                      <p className="text-emerald-400 text-[10px] uppercase">Mensuel</p>
                      <p className="text-white text-xl font-light">{selectedProduct.monthly}€</p>
                    </div>
                  )}
                  {selectedProduct.hourly && (
                    <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded">
                      <p className="text-blue-400 text-[10px] uppercase">Horaire</p>
                      <p className="text-white text-xl font-light">{selectedProduct.hourly}€</p>
                    </div>
                  )}
                  {selectedProduct.annual && (
                    <div className="bg-violet-500/10 border border-violet-500/20 p-3 rounded">
                      <p className="text-violet-400 text-[10px] uppercase">Annuel</p>
                      <p className="text-white text-xl font-light">{selectedProduct.annual}€</p>
                    </div>
                  )}
                  {selectedProduct.price_per_gb_month && (
                    <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded">
                      <p className="text-amber-400 text-[10px] uppercase">Par GB/mois</p>
                      <p className="text-white text-xl font-light">{selectedProduct.price_per_gb_month}€</p>
                    </div>
                  )}
                </div>

                {/* Specs + Translations */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Specs */}
                  <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded">
                    <h3 className="text-white text-sm font-medium mb-3">Spécifications</h3>
                    <div className="space-y-1.5 text-sm">
                      {getProductSpecs(selectedProduct).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-1.5 border-b border-zinc-800/50">
                          <span className="text-zinc-500">{specLabels[key] || key}</span>
                          <span className="text-white">{formatSpecValue(value)}</span>
                        </div>
                      ))}
                      {getProductSpecs(selectedProduct).length === 0 && (
                        <p className="text-zinc-600 text-xs">Aucune spec</p>
                      )}
                    </div>
                  </div>

                  {/* Translations */}
                  <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white text-sm font-medium">Traductions</h3>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setTranslationTab('fr')}
                          className={`px-2 py-1 text-xs ${translationTab === 'fr' ? 'bg-white text-zinc-900' : 'bg-zinc-800 text-zinc-400'}`}
                        >
                          FR
                        </button>
                        <button
                          onClick={() => setTranslationTab('en')}
                          className={`px-2 py-1 text-xs ${translationTab === 'en' ? 'bg-white text-zinc-900' : 'bg-zinc-800 text-zinc-400'}`}
                        >
                          EN
                        </button>
                      </div>
                    </div>

                    {currentTranslation ? (
                      <div className="space-y-3 text-sm">
                        {currentTranslation.usage && (
                          <div>
                            <p className="text-zinc-500 text-xs mb-0.5">Usage</p>
                            <p className="text-white">{currentTranslation.usage}</p>
                          </div>
                        )}
                        {currentTranslation.description && (
                          <div>
                            <p className="text-zinc-500 text-xs mb-0.5">Description</p>
                            <p className="text-zinc-300 text-xs">{currentTranslation.description}</p>
                          </div>
                        )}
                        {currentTranslation.target_audience && (
                          <div>
                            <p className="text-zinc-500 text-xs mb-0.5">Public cible</p>
                            <p className="text-zinc-300">{currentTranslation.target_audience}</p>
                          </div>
                        )}
                        {currentTranslation.highlight && (
                          <div>
                            <p className="text-zinc-500 text-xs mb-0.5">Highlight</p>
                            <p className="text-zinc-300">{currentTranslation.highlight}</p>
                          </div>
                        )}
                        {currentTranslation.features && currentTranslation.features.length > 0 && (
                          <div>
                            <p className="text-zinc-500 text-xs mb-1">Features</p>
                            <ul className="space-y-0.5 text-xs">
                              {currentTranslation.features.map((f, i) => (
                                <li key={i} className="text-zinc-300">• {f}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {currentTranslation.use_cases && currentTranslation.use_cases.length > 0 && (
                          <div>
                            <p className="text-zinc-500 text-xs mb-1">Cas d'usage</p>
                            <ul className="space-y-0.5 text-xs">
                              {currentTranslation.use_cases.map((u, i) => (
                                <li key={i} className="text-zinc-300">• {u}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-zinc-600 text-xs">Aucune traduction</p>
                    )}
                  </div>
                </div>

                {/* Benchmarks Section */}
                {(() => {
                  const categoryConfig = (displayConfig as Record<string, any>)[selectedCategory?.id || ''] || {};
                  const productBenchmarks = selectedProduct.benchmarks || categoryConfig.benchmarks;
                  if (!productBenchmarks?.metrics?.length) return null;

                  return (
                    <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs text-zinc-500 uppercase tracking-wider">Benchmarks</p>
                        {!selectedProduct.benchmarks && (
                          <span className="text-[10px] text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded">catégorie</span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {productBenchmarks.metrics.slice(0, 4).map((metric: any, idx: number) => (
                          <div key={idx} className="text-center p-2 bg-zinc-800/50 rounded">
                            <div className="text-lg font-light text-white">
                              {metric.value} <span className="text-xs text-zinc-500">{metric.unit}</span>
                            </div>
                            <div className="text-[10px] text-zinc-500 truncate">{metric.name}</div>
                          </div>
                        ))}
                      </div>
                      {productBenchmarks.metrics.length > 4 && (
                        <p className="text-[10px] text-zinc-600 mt-2 text-center">
                          +{productBenchmarks.metrics.length - 4} autres métriques
                        </p>
                      )}
                    </div>
                  );
                })()}

                {/* Security Section */}
                {(() => {
                  const categoryConfig = (displayConfig as Record<string, any>)[selectedCategory?.id || ''] || {};
                  const productSecurity = selectedProduct.security || categoryConfig.security;
                  if (!productSecurity?.items?.length) return null;

                  return (
                    <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs text-zinc-500 uppercase tracking-wider">Sécurité & Conformité</p>
                        {!selectedProduct.security && (
                          <span className="text-[10px] text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded">catégorie</span>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        {productSecurity.items.slice(0, 6).map((item: any, idx: number) => {
                          const text = typeof item === 'string' ? item : (item.fr || item.en || '');
                          return (
                            <div key={idx} className="flex items-center gap-2 text-xs">
                              <div className="w-1 h-1 bg-emerald-400 rounded-full flex-shrink-0" />
                              <span className="text-zinc-400 truncate">{text}</span>
                            </div>
                          );
                        })}
                      </div>
                      {productSecurity.items.length > 6 && (
                        <p className="text-[10px] text-zinc-600 mt-2">
                          +{productSecurity.items.length - 6} autres
                        </p>
                      )}
                    </div>
                  );
                })()}

                {/* Features Section */}
                {(() => {
                  const categoryConfig = (displayConfig as Record<string, any>)[selectedCategory?.id || ''] || {};
                  const productFeatures = selectedProduct.features || categoryConfig.features;
                  if (!productFeatures?.items?.length) return null;

                  return (
                    <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs text-zinc-500 uppercase tracking-wider">Fonctionnalités</p>
                        {!selectedProduct.features && (
                          <span className="text-[10px] text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded">catégorie</span>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        {productFeatures.items.slice(0, 6).map((item: any, idx: number) => {
                          const text = typeof item === 'string' ? item : (item.fr || item.en || '');
                          return (
                            <div key={idx} className="flex items-center gap-2 text-xs">
                              <div className="w-1 h-1 bg-blue-400 rounded-full flex-shrink-0" />
                              <span className="text-zinc-400 truncate">{text}</span>
                            </div>
                          );
                        })}
                      </div>
                      {productFeatures.items.length > 6 && (
                        <p className="text-[10px] text-zinc-600 mt-2">
                          +{productFeatures.items.length - 6} autres
                        </p>
                      )}
                    </div>
                  );
                })()}

                {/* Raw JSON */}
                <details className="bg-zinc-900/30 border border-zinc-800 p-3 rounded text-xs">
                  <summary className="text-zinc-500 cursor-pointer hover:text-zinc-300">JSON brut</summary>
                  <pre className="mt-2 text-zinc-400 overflow-x-auto">{JSON.stringify(selectedProduct, null, 2)}</pre>
                </details>
            </div>
          )}
        </div>
      </div>

      {/* Save Banner - Fixed at bottom when there are changes */}
      {hasChanges && (
        <div className="fixed bottom-0 left-0 right-0 z-40 save-banner-appear">
          <div className="bg-zinc-900/95 backdrop-blur-sm border-t border-zinc-700">
            <div className="max-w-screen-xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                    <span className="text-white font-medium">Modifications non sauvegardées</span>
                  </div>
                  <span className="text-zinc-500 text-sm">
                    {pendingProducts.size > 0 && `${pendingProducts.size} produit${pendingProducts.size > 1 ? 's' : ''} modifié${pendingProducts.size > 1 ? 's' : ''}`}
                    {pendingProducts.size > 0 && pendingDeletions.size > 0 && ' • '}
                    {pendingDeletions.size > 0 && `${pendingDeletions.size} suppression${pendingDeletions.size > 1 ? 's' : ''}`}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {saveError && (
                    <div className="flex items-center gap-2 text-red-400 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>{saveError}</span>
                    </div>
                  )}
                  <button
                    onClick={discardChanges}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded transition-colors disabled:opacity-50"
                  >
                    <Undo2 className="h-4 w-4" />
                    Annuler
                  </button>
                  <button
                    onClick={saveAllChanges}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-zinc-900 hover:bg-zinc-200 rounded transition-colors disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sauvegarde...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Sauvegarder
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsEditModalOpen(false)}
          />

          {/* Modal */}
          <div className="relative bg-zinc-900 border border-zinc-700 rounded-lg w-[90vw] max-w-5xl max-h-[90vh] flex flex-col modal-appear">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-800 flex-shrink-0">
              <div>
                <h2 className="text-xl font-medium text-white">
                  {isCreateMode ? 'Nouveau produit' : 'Modifier le produit'}
                </h2>
                <p className="text-zinc-500 text-sm mt-1">
                  {isCreateMode
                    ? `Catégorie: ${selectedCategory?.name || editingProduct.category}`
                    : `${editingProduct.name} • ${editingProduct.id}`
                  }
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-zinc-500 hover:text-white p-2 hover:bg-zinc-800 rounded transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 px-6 pt-4 flex-shrink-0">
              {(['general', 'specs', 'translations', 'sections'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setEditModalTab(tab)}
                  className={`px-4 py-2 text-sm rounded-t transition-colors ${
                    editModalTab === tab
                      ? 'bg-zinc-800 text-white'
                      : 'text-zinc-500 hover:text-white hover:bg-zinc-800/50'
                  }`}
                >
                  {tab === 'general' && 'Général'}
                  {tab === 'specs' && 'Spécifications'}
                  {tab === 'translations' && 'Traductions'}
                  {tab === 'sections' && 'Sections page'}
                </button>
              ))}
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 modal-scrollbar">
              {/* General Tab */}
              {editModalTab === 'general' && (
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-400 text-xs uppercase tracking-wider mb-2">Nom du produit</label>
                      <input
                        type="text"
                        value={editingProduct.name || ''}
                        onChange={(e) => updateEditingField('name', e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded focus:border-zinc-500 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 text-xs uppercase tracking-wider mb-2">
                        ID {!isCreateMode && '(non modifiable)'}
                      </label>
                      <input
                        type="text"
                        value={editingProduct.id}
                        onChange={(e) => isCreateMode && updateEditingField('id', e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                        disabled={!isCreateMode}
                        placeholder={isCreateMode ? 'ex: vpsnano, gpu-a100' : ''}
                        className={`w-full px-4 py-3 rounded ${
                          isCreateMode
                            ? 'bg-zinc-800 border border-zinc-700 text-white focus:border-zinc-500 focus:outline-none'
                            : 'bg-zinc-800/50 border border-zinc-800 text-zinc-500 cursor-not-allowed'
                        }`}
                      />
                      {isCreateMode && (
                        <p className="text-zinc-600 text-xs mt-1">Minuscules, chiffres, tirets uniquement</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-400 text-xs uppercase tracking-wider mb-2">Catégorie</label>
                      <input
                        type="text"
                        value={editingProduct.category || ''}
                        disabled
                        className="w-full bg-zinc-800/50 border border-zinc-800 text-zinc-500 px-4 py-3 rounded cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 text-xs uppercase tracking-wider mb-2">Tier</label>
                      <div className="relative">
                        <select
                          value={editingProduct.tier || ''}
                          onChange={(e) => updateEditingField('tier', e.target.value)}
                          className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded focus:border-zinc-500 focus:outline-none transition-colors appearance-none cursor-pointer"
                        >
                          <option value="starter">Starter</option>
                          <option value="pro">Pro</option>
                          <option value="business">Business</option>
                          <option value="enterprise">Enterprise</option>
                          <option value="premium">Premium</option>
                        </select>
                        <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 rotate-90 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div>
                    <h3 className="text-white text-sm font-medium mb-4">Tarification</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded">
                        <label className="block text-emerald-400 text-xs uppercase tracking-wider mb-2">Mensuel (€)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={editingProduct.monthly || ''}
                          onChange={(e) => updateEditingField('monthly', e.target.value ? parseFloat(e.target.value) : undefined)}
                          placeholder="—"
                          className="w-full bg-transparent border-0 border-b border-emerald-500/30 text-white text-xl font-light px-0 py-2 focus:border-emerald-400 focus:outline-none transition-colors placeholder:text-zinc-600"
                        />
                      </div>
                      <div className="bg-blue-500/5 border border-blue-500/20 p-4 rounded">
                        <label className="block text-blue-400 text-xs uppercase tracking-wider mb-2">Horaire (€)</label>
                        <input
                          type="number"
                          step="0.0001"
                          value={editingProduct.hourly || ''}
                          onChange={(e) => updateEditingField('hourly', e.target.value ? parseFloat(e.target.value) : undefined)}
                          placeholder="—"
                          className="w-full bg-transparent border-0 border-b border-blue-500/30 text-white text-xl font-light px-0 py-2 focus:border-blue-400 focus:outline-none transition-colors placeholder:text-zinc-600"
                        />
                      </div>
                      <div className="bg-violet-500/5 border border-violet-500/20 p-4 rounded">
                        <label className="block text-violet-400 text-xs uppercase tracking-wider mb-2">Annuel (€)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={editingProduct.annual || ''}
                          onChange={(e) => updateEditingField('annual', e.target.value ? parseFloat(e.target.value) : undefined)}
                          placeholder="—"
                          className="w-full bg-transparent border-0 border-b border-violet-500/30 text-white text-xl font-light px-0 py-2 focus:border-violet-400 focus:outline-none transition-colors placeholder:text-zinc-600"
                        />
                      </div>
                      <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded">
                        <label className="block text-amber-400 text-xs uppercase tracking-wider mb-2">Par GB/mois (€)</label>
                        <input
                          type="number"
                          step="0.0001"
                          value={editingProduct.price_per_gb_month || ''}
                          onChange={(e) => updateEditingField('price_per_gb_month', e.target.value ? parseFloat(e.target.value) : undefined)}
                          placeholder="—"
                          className="w-full bg-transparent border-0 border-b border-amber-500/30 text-white text-xl font-light px-0 py-2 focus:border-amber-400 focus:outline-none transition-colors placeholder:text-zinc-600"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Specs Tab */}
              {editModalTab === 'specs' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white text-sm font-medium">Spécifications techniques</h3>
                    <button
                      onClick={addSpec}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Ajouter
                    </button>
                  </div>

                  <div className="space-y-2">
                    {getProductSpecs(editingProduct).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-3 bg-zinc-800/50 border border-zinc-800 p-3 rounded group">
                        <input
                          type="text"
                          value={key}
                          onChange={(e) => renameSpecKey(key, e.target.value)}
                          className="flex-1 bg-transparent border-0 border-b border-transparent hover:border-zinc-600 focus:border-zinc-500 text-zinc-400 px-0 py-1 focus:outline-none transition-colors"
                          placeholder="Clé"
                        />
                        <span className="text-zinc-600">:</span>
                        <input
                          type="text"
                          value={typeof value === 'boolean' ? (value ? 'true' : 'false') : String(value)}
                          onChange={(e) => {
                            let newValue: unknown = e.target.value;
                            if (e.target.value === 'true') newValue = true;
                            else if (e.target.value === 'false') newValue = false;
                            else if (!isNaN(Number(e.target.value)) && e.target.value !== '') newValue = Number(e.target.value);
                            updateEditingField(key, newValue);
                          }}
                          className="flex-1 bg-transparent border-0 border-b border-transparent hover:border-zinc-600 focus:border-zinc-500 text-white px-0 py-1 focus:outline-none transition-colors"
                          placeholder="Valeur"
                        />
                        <button
                          onClick={() => removeSpec(key)}
                          className="text-zinc-600 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}

                    {getProductSpecs(editingProduct).length === 0 && (
                      <div className="text-center py-8 text-zinc-600">
                        <p>Aucune spécification</p>
                        <p className="text-xs mt-1">Cliquez sur "Ajouter" pour créer une spécification</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Translations Tab */}
              {editModalTab === 'translations' && (
                <div className="space-y-6">
                  {/* Language selector */}
                  <div className="flex gap-2 mb-6">
                    <button
                      onClick={() => setTranslationTab('fr')}
                      className={`px-4 py-2 text-sm rounded transition-colors ${
                        translationTab === 'fr'
                          ? 'bg-white text-zinc-900'
                          : 'bg-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      Français
                    </button>
                    <button
                      onClick={() => setTranslationTab('en')}
                      className={`px-4 py-2 text-sm rounded transition-colors ${
                        translationTab === 'en'
                          ? 'bg-white text-zinc-900'
                          : 'bg-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      English
                    </button>
                  </div>

                  {/* Translation fields */}
                  {(() => {
                    const currentEditTranslation = translationTab === 'fr' ? editingTranslationsFr : editingTranslationsEn;
                    const lang = translationTab;

                    return (
                      <div className="space-y-6">
                        {/* Usage */}
                        <div>
                          <label className="block text-zinc-400 text-xs uppercase tracking-wider mb-2">Usage</label>
                          <input
                            type="text"
                            value={currentEditTranslation.usage || ''}
                            onChange={(e) => updateTranslation(lang, 'usage', e.target.value)}
                            placeholder={lang === 'fr' ? 'Ex: Serveur de production' : 'Ex: Production server'}
                            className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded focus:border-zinc-500 focus:outline-none transition-colors placeholder:text-zinc-600"
                          />
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block text-zinc-400 text-xs uppercase tracking-wider mb-2">Description</label>
                          <textarea
                            value={currentEditTranslation.description || ''}
                            onChange={(e) => updateTranslation(lang, 'description', e.target.value)}
                            placeholder={lang === 'fr' ? 'Description détaillée du produit...' : 'Detailed product description...'}
                            rows={3}
                            className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded focus:border-zinc-500 focus:outline-none transition-colors resize-none placeholder:text-zinc-600"
                          />
                        </div>

                        {/* Target Audience */}
                        <div>
                          <label className="block text-zinc-400 text-xs uppercase tracking-wider mb-2">Public cible</label>
                          <input
                            type="text"
                            value={currentEditTranslation.target_audience || ''}
                            onChange={(e) => updateTranslation(lang, 'target_audience', e.target.value)}
                            placeholder={lang === 'fr' ? 'Ex: Développeurs, PME' : 'Ex: Developers, SMBs'}
                            className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded focus:border-zinc-500 focus:outline-none transition-colors placeholder:text-zinc-600"
                          />
                        </div>

                        {/* Highlight */}
                        <div>
                          <label className="block text-zinc-400 text-xs uppercase tracking-wider mb-2">Highlight</label>
                          <input
                            type="text"
                            value={currentEditTranslation.highlight || ''}
                            onChange={(e) => updateTranslation(lang, 'highlight', e.target.value)}
                            placeholder={lang === 'fr' ? 'Ex: Meilleur rapport qualité/prix' : 'Ex: Best value for money'}
                            className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded focus:border-zinc-500 focus:outline-none transition-colors placeholder:text-zinc-600"
                          />
                        </div>

                        {/* Features */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-zinc-400 text-xs uppercase tracking-wider">Features</label>
                            <button
                              onClick={() => addTranslationArrayItem(lang, 'features')}
                              className="text-zinc-500 hover:text-white text-xs flex items-center gap-1"
                            >
                              <Plus className="h-3 w-3" /> Ajouter
                            </button>
                          </div>
                          <div className="space-y-2">
                            {(currentEditTranslation.features || []).map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-2 group">
                                <span className="text-zinc-600 text-sm w-6">{idx + 1}.</span>
                                <input
                                  type="text"
                                  value={feature}
                                  onChange={(e) => updateTranslationArrayItem(lang, 'features', idx, e.target.value)}
                                  className="flex-1 bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded focus:border-zinc-500 focus:outline-none transition-colors text-sm"
                                />
                                <button
                                  onClick={() => removeTranslationArrayItem(lang, 'features', idx)}
                                  className="text-zinc-600 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                            {(!currentEditTranslation.features || currentEditTranslation.features.length === 0) && (
                              <p className="text-zinc-600 text-xs">Aucune feature</p>
                            )}
                          </div>
                        </div>

                        {/* Use Cases */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-zinc-400 text-xs uppercase tracking-wider">Cas d'usage</label>
                            <button
                              onClick={() => addTranslationArrayItem(lang, 'use_cases')}
                              className="text-zinc-500 hover:text-white text-xs flex items-center gap-1"
                            >
                              <Plus className="h-3 w-3" /> Ajouter
                            </button>
                          </div>
                          <div className="space-y-2">
                            {(currentEditTranslation.use_cases || []).map((useCase, idx) => (
                              <div key={idx} className="flex items-center gap-2 group">
                                <span className="text-zinc-600 text-sm w-6">{idx + 1}.</span>
                                <input
                                  type="text"
                                  value={useCase}
                                  onChange={(e) => updateTranslationArrayItem(lang, 'use_cases', idx, e.target.value)}
                                  className="flex-1 bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded focus:border-zinc-500 focus:outline-none transition-colors text-sm"
                                />
                                <button
                                  onClick={() => removeTranslationArrayItem(lang, 'use_cases', idx)}
                                  className="text-zinc-600 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                            {(!currentEditTranslation.use_cases || currentEditTranslation.use_cases.length === 0) && (
                              <p className="text-zinc-600 text-xs">Aucun cas d'usage</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Sections Tab */}
              {editModalTab === 'sections' && (
                <div className="space-y-6">
                  {/* Sub-tabs */}
                  <div className="flex gap-2 border-b border-zinc-800 pb-4">
                    {(['technical', 'benchmarks', 'security', 'features'] as const).map((subTab) => (
                      <button
                        key={subTab}
                        onClick={() => setSectionsSubTab(subTab)}
                        className={`px-3 py-1.5 text-xs rounded transition-colors ${
                          sectionsSubTab === subTab
                            ? 'bg-white text-zinc-900'
                            : 'bg-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {subTab === 'technical' && 'Specs techniques'}
                        {subTab === 'benchmarks' && 'Benchmarks'}
                        {subTab === 'security' && 'Sécurité'}
                        {subTab === 'features' && 'Features'}
                      </button>
                    ))}
                  </div>

                  {/* Technical Sections Editor */}
                  {sectionsSubTab === 'technical' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-white text-sm font-medium">Spécifications techniques</h3>
                          <p className="text-zinc-500 text-xs">Cartes affichées sur la page produit (Calcul, Mémoire, etc.)</p>
                        </div>
                        <button
                          onClick={addTechnicalSection}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                          Ajouter section
                        </button>
                      </div>

                      {editingTechnicalSections.map((section, sectionIdx) => (
                        <div key={sectionIdx} className="bg-zinc-800/30 border border-zinc-800 rounded-lg p-4 space-y-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-zinc-500 text-xs mb-1">Nom (EN)</label>
                                <input
                                  type="text"
                                  value={section.category}
                                  onChange={(e) => updateTechnicalSection(sectionIdx, 'category', e.target.value)}
                                  className="w-full bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded text-sm focus:border-zinc-500 focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-zinc-500 text-xs mb-1">Nom (FR)</label>
                                <input
                                  type="text"
                                  value={section.category_fr || ''}
                                  onChange={(e) => updateTechnicalSection(sectionIdx, 'category_fr', e.target.value)}
                                  className="w-full bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded text-sm focus:border-zinc-500 focus:outline-none"
                                />
                              </div>
                            </div>
                            <button
                              onClick={() => removeTechnicalSection(sectionIdx)}
                              className="text-zinc-600 hover:text-red-400 p-1"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-zinc-400 text-xs">Spécifications ({section.specs.length})</span>
                              <button
                                onClick={() => addSpecToSection(sectionIdx)}
                                className="text-zinc-500 hover:text-white text-xs flex items-center gap-1"
                              >
                                <Plus className="h-3 w-3" /> Ajouter
                              </button>
                            </div>
                            {section.specs.map((spec, specIdx) => (
                              <div key={specIdx} className="grid grid-cols-4 gap-2 items-center group">
                                <input
                                  type="text"
                                  value={spec.name}
                                  onChange={(e) => updateSpecInSection(sectionIdx, specIdx, 'name', e.target.value)}
                                  placeholder="Nom EN"
                                  className="bg-zinc-900 border border-zinc-700 text-white px-2 py-1.5 rounded text-xs focus:border-zinc-500 focus:outline-none"
                                />
                                <input
                                  type="text"
                                  value={spec.name_fr || ''}
                                  onChange={(e) => updateSpecInSection(sectionIdx, specIdx, 'name_fr', e.target.value)}
                                  placeholder="Nom FR"
                                  className="bg-zinc-900 border border-zinc-700 text-white px-2 py-1.5 rounded text-xs focus:border-zinc-500 focus:outline-none"
                                />
                                <input
                                  type="text"
                                  value={spec.value}
                                  onChange={(e) => updateSpecInSection(sectionIdx, specIdx, 'value', e.target.value)}
                                  placeholder="Valeur EN"
                                  className="bg-zinc-900 border border-zinc-700 text-white px-2 py-1.5 rounded text-xs focus:border-zinc-500 focus:outline-none"
                                />
                                <div className="flex items-center gap-1">
                                  <input
                                    type="text"
                                    value={spec.value_fr || ''}
                                    onChange={(e) => updateSpecInSection(sectionIdx, specIdx, 'value_fr', e.target.value)}
                                    placeholder="Valeur FR"
                                    className="flex-1 bg-zinc-900 border border-zinc-700 text-white px-2 py-1.5 rounded text-xs focus:border-zinc-500 focus:outline-none"
                                  />
                                  <button
                                    onClick={() => removeSpecFromSection(sectionIdx, specIdx)}
                                    className="text-zinc-600 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}

                      {editingTechnicalSections.length === 0 && (
                        <div className="text-center py-8 text-zinc-600">
                          <p>Aucune section technique</p>
                          <p className="text-xs mt-1">Cliquez sur "Ajouter section" pour créer une carte</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Benchmarks Editor */}
                  {sectionsSubTab === 'benchmarks' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-white text-sm font-medium">Benchmarks de performance</h3>
                          <p className="text-zinc-500 text-xs">Métriques affichées dans la section "Benchmarks"</p>
                        </div>
                        <button
                          onClick={addBenchmarkMetric}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                          Ajouter métrique
                        </button>
                      </div>

                      {/* Titles */}
                      <div className="grid grid-cols-2 gap-4 bg-zinc-800/30 border border-zinc-800 rounded-lg p-4">
                        <div>
                          <label className="block text-zinc-500 text-xs mb-1">Titre section (EN)</label>
                          <input
                            type="text"
                            value={editingBenchmarks.title || ''}
                            onChange={(e) => setEditingBenchmarks({ ...editingBenchmarks, title: e.target.value })}
                            placeholder="Performance Benchmarks"
                            className="w-full bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded text-sm focus:border-zinc-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-zinc-500 text-xs mb-1">Titre section (FR)</label>
                          <input
                            type="text"
                            value={editingBenchmarks.title_fr || ''}
                            onChange={(e) => setEditingBenchmarks({ ...editingBenchmarks, title_fr: e.target.value })}
                            placeholder="Benchmarks de Performance"
                            className="w-full bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded text-sm focus:border-zinc-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-zinc-500 text-xs mb-1">Sous-titre (EN)</label>
                          <input
                            type="text"
                            value={editingBenchmarks.subtitle || ''}
                            onChange={(e) => setEditingBenchmarks({ ...editingBenchmarks, subtitle: e.target.value })}
                            placeholder="Real-world metrics"
                            className="w-full bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded text-sm focus:border-zinc-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-zinc-500 text-xs mb-1">Sous-titre (FR)</label>
                          <input
                            type="text"
                            value={editingBenchmarks.subtitle_fr || ''}
                            onChange={(e) => setEditingBenchmarks({ ...editingBenchmarks, subtitle_fr: e.target.value })}
                            placeholder="Métriques réelles"
                            className="w-full bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded text-sm focus:border-zinc-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="space-y-2">
                        {editingBenchmarks.metrics.map((metric, idx) => (
                          <div key={idx} className="bg-zinc-800/30 border border-zinc-800 rounded p-3 group">
                            <div className="grid grid-cols-6 gap-2 items-center">
                              <input
                                type="text"
                                value={metric.name}
                                onChange={(e) => updateBenchmarkMetric(idx, 'name', e.target.value)}
                                placeholder="Nom EN"
                                className="bg-zinc-900 border border-zinc-700 text-white px-2 py-1.5 rounded text-xs focus:border-zinc-500 focus:outline-none"
                              />
                              <input
                                type="number"
                                value={metric.value}
                                onChange={(e) => updateBenchmarkMetric(idx, 'value', parseFloat(e.target.value) || 0)}
                                placeholder="Valeur"
                                className="bg-zinc-900 border border-zinc-700 text-white px-2 py-1.5 rounded text-xs focus:border-zinc-500 focus:outline-none"
                              />
                              <input
                                type="text"
                                value={metric.unit}
                                onChange={(e) => updateBenchmarkMetric(idx, 'unit', e.target.value)}
                                placeholder="Unité"
                                className="bg-zinc-900 border border-zinc-700 text-white px-2 py-1.5 rounded text-xs focus:border-zinc-500 focus:outline-none"
                              />
                              <input
                                type="text"
                                value={metric.comparison}
                                onChange={(e) => updateBenchmarkMetric(idx, 'comparison', e.target.value)}
                                placeholder="Comparaison"
                                className="bg-zinc-900 border border-zinc-700 text-white px-2 py-1.5 rounded text-xs focus:border-zinc-500 focus:outline-none col-span-2"
                              />
                              <button
                                onClick={() => removeBenchmarkMetric(idx)}
                                className="text-zinc-600 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity justify-self-end"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {editingBenchmarks.metrics.length === 0 && (
                        <div className="text-center py-8 text-zinc-600">
                          <p>Aucun benchmark</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Security Editor */}
                  {sectionsSubTab === 'security' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-white text-sm font-medium">Sécurité & Conformité</h3>
                          <p className="text-zinc-500 text-xs">Liste des features sécurité affichées</p>
                        </div>
                        <button
                          onClick={addSecurityItem}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                          Ajouter
                        </button>
                      </div>

                      {/* Titles */}
                      <div className="grid grid-cols-2 gap-4 bg-zinc-800/30 border border-zinc-800 rounded-lg p-4">
                        <div>
                          <label className="block text-zinc-500 text-xs mb-1">Titre (EN)</label>
                          <input
                            type="text"
                            value={editingSecurity.title || ''}
                            onChange={(e) => setEditingSecurity({ ...editingSecurity, title: e.target.value })}
                            placeholder="Security & Compliance"
                            className="w-full bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded text-sm focus:border-zinc-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-zinc-500 text-xs mb-1">Titre (FR)</label>
                          <input
                            type="text"
                            value={editingSecurity.title_fr || ''}
                            onChange={(e) => setEditingSecurity({ ...editingSecurity, title_fr: e.target.value })}
                            placeholder="Sécurité & Conformité"
                            className="w-full bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded text-sm focus:border-zinc-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-2">
                        {editingSecurity.items.map((item, idx) => {
                          const itemObj = typeof item === 'string' ? { en: item, fr: item } : item;
                          return (
                            <div key={idx} className="grid grid-cols-2 gap-2 items-center group">
                              <input
                                type="text"
                                value={itemObj.en}
                                onChange={(e) => updateSecurityItem(idx, 'en', e.target.value)}
                                placeholder="English"
                                className="bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded text-sm focus:border-zinc-500 focus:outline-none"
                              />
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={itemObj.fr}
                                  onChange={(e) => updateSecurityItem(idx, 'fr', e.target.value)}
                                  placeholder="Français"
                                  className="flex-1 bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded text-sm focus:border-zinc-500 focus:outline-none"
                                />
                                <button
                                  onClick={() => removeSecurityItem(idx)}
                                  className="text-zinc-600 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {editingSecurity.items.length === 0 && (
                        <div className="text-center py-8 text-zinc-600">
                          <p>Aucun élément de sécurité</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Features Editor */}
                  {sectionsSubTab === 'features' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-white text-sm font-medium">Fonctionnalités</h3>
                          <p className="text-zinc-500 text-xs">Liste des fonctionnalités du produit</p>
                        </div>
                        <button
                          onClick={addFeatureItem}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                          Ajouter
                        </button>
                      </div>

                      {/* Titles */}
                      <div className="grid grid-cols-2 gap-4 bg-zinc-800/30 border border-zinc-800 rounded-lg p-4">
                        <div>
                          <label className="block text-zinc-500 text-xs mb-1">Titre (EN)</label>
                          <input
                            type="text"
                            value={editingFeatures.title || ''}
                            onChange={(e) => setEditingFeatures({ ...editingFeatures, title: e.target.value })}
                            placeholder="Features"
                            className="w-full bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded text-sm focus:border-zinc-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-zinc-500 text-xs mb-1">Titre (FR)</label>
                          <input
                            type="text"
                            value={editingFeatures.title_fr || ''}
                            onChange={(e) => setEditingFeatures({ ...editingFeatures, title_fr: e.target.value })}
                            placeholder="Fonctionnalités"
                            className="w-full bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded text-sm focus:border-zinc-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-2">
                        {editingFeatures.items.map((item, idx) => {
                          const itemObj = typeof item === 'string' ? { en: item, fr: item } : item;
                          return (
                            <div key={idx} className="grid grid-cols-2 gap-2 items-center group">
                              <input
                                type="text"
                                value={itemObj.en}
                                onChange={(e) => updateFeatureItem(idx, 'en', e.target.value)}
                                placeholder="English"
                                className="bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded text-sm focus:border-zinc-500 focus:outline-none"
                              />
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={itemObj.fr}
                                  onChange={(e) => updateFeatureItem(idx, 'fr', e.target.value)}
                                  placeholder="Français"
                                  className="flex-1 bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded text-sm focus:border-zinc-500 focus:outline-none"
                                />
                                <button
                                  onClick={() => removeFeatureItem(idx)}
                                  className="text-zinc-600 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {editingFeatures.items.length === 0 && (
                        <div className="text-center py-8 text-zinc-600">
                          <p>Aucune fonctionnalité</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-zinc-800 flex-shrink-0">
              <div className="flex-1">
                {saveError ? (
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <span className="text-xs text-red-400">{saveError}</span>
                  </div>
                ) : validationErrors.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {validationErrors.map((error, idx) => (
                      <span key={idx} className="text-xs text-red-400 bg-red-400/10 px-2 py-1 rounded">
                        {error}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-zinc-600 text-xs">
                    {isCreateMode
                      ? 'Prêt à créer le produit'
                      : 'Prêt à sauvegarder les modifications'
                    }
                  </p>
                )}
              </div>
              <div className="flex gap-3 ml-4">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isSaving}
                  className="px-4 py-2 text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded transition-colors disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={addToPendingChanges}
                  disabled={!canSave}
                  className={`px-4 py-2 rounded transition-colors flex items-center gap-2 ${
                    canSave
                      ? 'bg-white text-zinc-900 hover:bg-zinc-200 cursor-pointer'
                      : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                  }`}
                  title={!canSave ? validationErrors.join(', ') : (isCreateMode ? 'Ajouter le produit' : 'Appliquer les modifications')}
                >
                  {isCreateMode ? 'Ajouter' : 'Appliquer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS */}
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        /* Smooth column transitions */
        .column-transition {
          transition:
            width 700ms cubic-bezier(0.4, 0, 0.2, 1),
            min-width 700ms cubic-bezier(0.4, 0, 0.2, 1),
            flex 700ms cubic-bezier(0.4, 0, 0.2, 1),
            opacity 500ms cubic-bezier(0.4, 0, 0.2, 1),
            transform 600ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .column-visible {
          opacity: 1;
          transform: translateX(0);
        }

        .column-hidden {
          opacity: 0;
          transform: translateX(-20px);
          pointer-events: none;
          overflow: hidden;
        }

        /* Item transitions for smoother hover/selection */
        .item-transition {
          transition:
            background-color 300ms cubic-bezier(0.4, 0, 0.2, 1),
            border-color 300ms cubic-bezier(0.4, 0, 0.2, 1),
            transform 200ms cubic-bezier(0.4, 0, 0.2, 1),
            box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .item-transition:hover {
          transform: translateY(-1px);
        }

        .item-transition:active {
          transform: translateY(0);
        }

        /* Icon size transitions */
        .icon-transition {
          transition: padding 400ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Chevron rotation */
        .chevron-transition {
          transition: transform 400ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Modal animations */
        .modal-appear {
          animation: modalAppear 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes modalAppear {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        /* Save banner animation */
        .save-banner-appear {
          animation: saveBannerAppear 400ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes saveBannerAppear {
          from {
            opacity: 0;
            transform: translateY(100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Custom modal scrollbar */
        .modal-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgb(63 63 70) transparent;
        }

        .modal-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .modal-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .modal-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgb(63 63 70);
          border-radius: 3px;
        }

        .modal-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgb(82 82 91);
        }

        /* Remove default input styles */
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input[type="number"] {
          -moz-appearance: textfield;
        }

        /* Custom select arrow hidden (we use our own) */
        select {
          background-image: none;
        }
      `}</style>
    </div>
  );
}
