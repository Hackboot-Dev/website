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
} from 'lucide-react';
import { getPublicDb } from '../../../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

// Types
type Product = {
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

export default function CataloguePageClient() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [translationTab, setTranslationTab] = useState<'fr' | 'en'>('fr');

  // Load catalogue
  const loadCatalogue = useCallback(async (forceSync = false) => {
    if (!forceSync) {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const { data, timestamp } = JSON.parse(cached);
          setCategories(data);
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

      categoriesData.sort((a, b) => (a.name || a.id).localeCompare(b.name || b.id));
      setCategories(categoriesData);

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
              <p className="text-xs text-zinc-500 uppercase tracking-wider px-1 mb-2">
                {selectedCategory.name} ({selectedCategory.products?.length || 0})
              </p>
              <div className="space-y-2">
                {selectedCategory.products?.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => setSelectedProductId(selectedProductId === product.id ? null : product.id)}
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
                  <button onClick={() => setSelectedProductId(null)} className="text-zinc-500 hover:text-white p-1">
                    <X className="h-4 w-4" />
                  </button>
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

                {/* Raw JSON */}
                <details className="bg-zinc-900/30 border border-zinc-800 p-3 rounded text-xs">
                  <summary className="text-zinc-500 cursor-pointer hover:text-zinc-300">JSON brut</summary>
                  <pre className="mt-2 text-zinc-400 overflow-x-auto">{JSON.stringify(selectedProduct, null, 2)}</pre>
                </details>
            </div>
          )}
        </div>
      </div>

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
      `}</style>
    </div>
  );
}
