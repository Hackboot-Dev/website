// apps/web/app/[locale]/admin/catalogue/components/ProductDetail.tsx
// Description: Product detail panel component
// Last modified: 2025-12-19

'use client';

import { Pencil, Trash2, X } from 'lucide-react';
import type { Product, ProductTranslation, CategoryData } from '../types';
import { SPEC_LABELS } from '../constants';
import { formatSpecValue, getProductSpecs } from '../utils';
import displayConfig from '../../../../../data/products/display-config.json';

type ProductDetailProps = {
  product: Product | undefined;
  category: CategoryData | undefined;
  translationTab: 'fr' | 'en';
  showDeleteConfirm: boolean;
  onTranslationTabChange: (tab: 'fr' | 'en') => void;
  onEdit: () => void;
  onDelete: () => void;
  onShowDeleteConfirm: (show: boolean) => void;
};

export function ProductDetail({
  product,
  category,
  translationTab,
  showDeleteConfirm,
  onTranslationTabChange,
  onEdit,
  onDelete,
  onShowDeleteConfirm,
}: ProductDetailProps) {
  if (!product) {
    return null;
  }

  const translationFr = category?.translations?.fr?.[product.id];
  const translationEn = category?.translations?.en?.[product.id];
  const currentTranslation = translationTab === 'fr' ? translationFr : translationEn;

  // Get category config for fallback sections
  const categoryConfig: Record<string, unknown> = (displayConfig as Record<string, Record<string, unknown>>)[category?.id || ''] ?? {};

  return (
    <div
      className={`column-transition overflow-y-auto scrollbar-hide ${
        product ? 'column-visible flex-1' : 'column-hidden'
      }`}
      style={{
        minWidth: product ? 400 : 0,
        width: product ? 'auto' : 0,
      }}
    >
      <div className="min-w-[400px] space-y-4 pb-4">
        {/* Header */}
        <ProductDetailHeader
          product={product}
          showDeleteConfirm={showDeleteConfirm}
          onEdit={onEdit}
          onDelete={onDelete}
          onShowDeleteConfirm={onShowDeleteConfirm}
        />

        {/* Pricing */}
        <PricingGrid product={product} />

        {/* Specs + Translations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SpecsPanel product={product} />
          <TranslationsPanel
            currentTranslation={currentTranslation}
            translationTab={translationTab}
            onTranslationTabChange={onTranslationTabChange}
          />
        </div>

        {/* Benchmarks Section */}
        <BenchmarksSection
          product={product}
          categoryConfig={categoryConfig}
        />

        {/* Security Section */}
        <SecuritySection
          product={product}
          categoryConfig={categoryConfig}
        />

        {/* Features Section */}
        <FeaturesSection
          product={product}
          categoryConfig={categoryConfig}
        />

        {/* Raw JSON */}
        <details className="bg-zinc-900/30 border border-zinc-800 p-3 rounded text-xs">
          <summary className="text-zinc-500 cursor-pointer hover:text-zinc-300">JSON brut</summary>
          <pre className="mt-2 text-zinc-400 overflow-x-auto">{JSON.stringify(product, null, 2)}</pre>
        </details>
      </div>
    </div>
  );
}

// Sub-components

type ProductDetailHeaderProps = {
  product: Product;
  showDeleteConfirm: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onShowDeleteConfirm: (show: boolean) => void;
};

function ProductDetailHeader({
  product,
  showDeleteConfirm,
  onEdit,
  onDelete,
  onShowDeleteConfirm,
}: ProductDetailHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Détails</p>
        <h2 className="text-lg text-white font-medium">{product.name}</h2>
        <p className="text-zinc-500 text-sm">ID: {product.id}</p>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={onEdit}
          className="text-zinc-500 hover:text-white hover:bg-zinc-800 p-2 rounded transition-colors"
          title="Modifier le produit"
        >
          <Pencil className="h-4 w-4" />
        </button>
        {showDeleteConfirm ? (
          <div className="flex items-center gap-1 bg-red-500/10 border border-red-500/30 rounded px-2 py-1">
            <span className="text-red-400 text-xs">Supprimer ?</span>
            <button
              onClick={onDelete}
              className="text-red-400 hover:text-red-300 p-1"
              title="Confirmer la suppression"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => onShowDeleteConfirm(false)}
              className="text-zinc-500 hover:text-white p-1"
              title="Annuler"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => onShowDeleteConfirm(true)}
            className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 p-2 rounded transition-colors"
            title="Supprimer le produit"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function PricingGrid({ product }: { product: Product }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
      {product.monthly && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded">
          <p className="text-emerald-400 text-[10px] uppercase">Mensuel</p>
          <p className="text-white text-xl font-light">{product.monthly}€</p>
        </div>
      )}
      {product.hourly && (
        <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded">
          <p className="text-blue-400 text-[10px] uppercase">Horaire</p>
          <p className="text-white text-xl font-light">{product.hourly}€</p>
        </div>
      )}
      {product.annual && (
        <div className="bg-violet-500/10 border border-violet-500/20 p-3 rounded">
          <p className="text-violet-400 text-[10px] uppercase">Annuel</p>
          <p className="text-white text-xl font-light">{product.annual}€</p>
        </div>
      )}
      {product.price_per_gb_month && (
        <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded">
          <p className="text-amber-400 text-[10px] uppercase">Par GB/mois</p>
          <p className="text-white text-xl font-light">{product.price_per_gb_month}€</p>
        </div>
      )}
    </div>
  );
}

function SpecsPanel({ product }: { product: Product }) {
  const specs = getProductSpecs(product);

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded">
      <h3 className="text-white text-sm font-medium mb-3">Spécifications</h3>
      <div className="space-y-1.5 text-sm">
        {specs.map(([key, value]) => (
          <div key={key} className="flex justify-between py-1.5 border-b border-zinc-800/50">
            <span className="text-zinc-500">{SPEC_LABELS[key] || key}</span>
            <span className="text-white">{formatSpecValue(value)}</span>
          </div>
        ))}
        {specs.length === 0 && (
          <p className="text-zinc-600 text-xs">Aucune spec</p>
        )}
      </div>
    </div>
  );
}

type TranslationsPanelProps = {
  currentTranslation: ProductTranslation | undefined;
  translationTab: 'fr' | 'en';
  onTranslationTabChange: (tab: 'fr' | 'en') => void;
};

function TranslationsPanel({
  currentTranslation,
  translationTab,
  onTranslationTabChange,
}: TranslationsPanelProps) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white text-sm font-medium">Traductions</h3>
        <div className="flex gap-1">
          <button
            onClick={() => onTranslationTabChange('fr')}
            className={`px-2 py-1 text-xs ${translationTab === 'fr' ? 'bg-white text-zinc-900' : 'bg-zinc-800 text-zinc-400'}`}
          >
            FR
          </button>
          <button
            onClick={() => onTranslationTabChange('en')}
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
  );
}

type SectionProps = {
  product: Product;
  categoryConfig: Record<string, unknown>;
};

function BenchmarksSection({ product, categoryConfig }: SectionProps) {
  const productBenchmarks = product.benchmarks || (categoryConfig.benchmarks as Product['benchmarks']);
  if (!productBenchmarks?.metrics?.length) return null;

  return (
    <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-zinc-500 uppercase tracking-wider">Benchmarks</p>
        {!product.benchmarks && (
          <span className="text-[10px] text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded">catégorie</span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {productBenchmarks.metrics.slice(0, 4).map((metric, idx) => (
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
}

function SecuritySection({ product, categoryConfig }: SectionProps) {
  const productSecurity = product.security || (categoryConfig.security as Product['security']);
  if (!productSecurity?.items?.length) return null;

  return (
    <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-zinc-500 uppercase tracking-wider">Sécurité & Conformité</p>
        {!product.security && (
          <span className="text-[10px] text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded">catégorie</span>
        )}
      </div>
      <div className="space-y-1.5">
        {productSecurity.items.slice(0, 6).map((item, idx) => {
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
}

function FeaturesSection({ product, categoryConfig }: SectionProps) {
  const productFeatures = product.features || (categoryConfig.features as Product['features']);
  if (!productFeatures?.items?.length) return null;

  return (
    <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-zinc-500 uppercase tracking-wider">Fonctionnalités</p>
        {!product.features && (
          <span className="text-[10px] text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded">catégorie</span>
        )}
      </div>
      <div className="space-y-1.5">
        {productFeatures.items.slice(0, 6).map((item, idx) => {
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
}
