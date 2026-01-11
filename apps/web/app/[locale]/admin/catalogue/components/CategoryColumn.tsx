// apps/web/app/[locale]/admin/catalogue/components/CategoryColumn.tsx
// Description: Category list column component
// Last modified: 2025-12-19

'use client';

import { Package, ChevronRight } from 'lucide-react';
import type { CategoryData } from '../types';
import { CATEGORY_ICONS } from '../constants';

type CategoryColumnProps = {
  categories: CategoryData[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
};

export function CategoryColumn({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategoryColumnProps) {
  return (
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
              onSelectCategory(selectedCategoryId === category.id ? null : category.id);
            }}
            className={`text-left item-transition border ${
              selectedCategoryId === category.id
                ? 'bg-white/10 border-white/30 text-white'
                : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white'
            } ${selectedCategoryId ? 'p-3 w-full' : 'p-5'}`}
          >
            <div className={`flex items-center gap-3 ${selectedCategoryId ? '' : 'mb-3'}`}>
              <div className={`${selectedCategoryId ? 'p-1.5' : 'p-2.5'} bg-zinc-800 rounded-lg icon-transition`}>
                {CATEGORY_ICONS[category.id] || <Package className="h-4 w-4" />}
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
  );
}
