// apps/web/app/[locale]/admin/catalogue/components/ProductColumn.tsx
// Description: Product list column component
// Last modified: 2025-12-19

'use client';

import { Plus } from 'lucide-react';
import type { CategoryData, Product } from '../types';
import { getTierColor } from '../utils';

type ProductColumnProps = {
  category: CategoryData | undefined;
  selectedCategoryId: string | null;
  selectedProductId: string | null;
  onSelectProduct: (productId: string | null) => void;
  onCreateProduct: () => void;
};

export function ProductColumn({
  category,
  selectedCategoryId,
  selectedProductId,
  onSelectProduct,
  onCreateProduct,
}: ProductColumnProps) {
  if (!selectedCategoryId || !category) {
    return null;
  }

  return (
    <div
      className={`flex-shrink-0 column-transition overflow-y-auto scrollbar-hide ${
        selectedCategoryId && category ? 'column-visible' : 'column-hidden'
      }`}
      style={{
        width: selectedCategoryId ? (selectedProductId ? 280 : 'auto') : 0,
        flex: selectedCategoryId && !selectedProductId ? 1 : 'none',
        minWidth: selectedCategoryId ? 280 : 0,
      }}
    >
      <div className="space-y-2 min-w-[280px]">
        <div className="flex items-center justify-between px-1 mb-2">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">
            {category.name} ({category.products?.length || 0})
          </p>
          <button
            onClick={onCreateProduct}
            className="flex items-center gap-1 px-2 py-1 text-xs text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded transition-colors"
          >
            <Plus className="h-3 w-3" />
            Nouveau
          </button>
        </div>
        <div className="space-y-2">
          {category.products?.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isSelected={selectedProductId === product.id}
              onSelect={() => onSelectProduct(selectedProductId === product.id ? null : product.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Sub-component for product card
type ProductCardProps = {
  product: Product;
  isSelected: boolean;
  onSelect: () => void;
};

function ProductCard({ product, isSelected, onSelect }: ProductCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-3 border item-transition ${
        isSelected
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
  );
}
