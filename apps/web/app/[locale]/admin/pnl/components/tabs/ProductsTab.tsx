// apps/web/app/[locale]/admin/pnl/components/tabs/ProductsTab.tsx
// Description: Products & Clients tab content
// Last modified: 2025-12-19

'use client';

import { Plus, FolderPlus, Trash2, Settings, Receipt, Pencil, Check, X, Edit3 } from 'lucide-react';
import { formatCurrency } from '../../../_shared/utils/formatters';
import type { PnLData, ProductCategory, Product } from '../../types';

type ProductsTabProps = {
  data: PnLData | null;
  currentMonthKey: string;
  // Calculations
  getCategoryRevenue: (cat: ProductCategory, month: string) => number;
  getCategoryClients: (cat: ProductCategory, month: string) => number;
  getProductRevenue: (product: Product, month: string) => number;
  getTransactionsCount: (product: Product, month: string) => number;
  // Edit state
  editingCell: string | null;
  editValue: string;
  onStartEdit: (key: string, value: number | string) => void;
  onCancelEdit: () => void;
  onEditValueChange: (value: string) => void;
  // Actions
  onAddProduct: (catId: string) => void;
  onDeleteProduct: (catId: string, productId: string) => void;
  onUpdateProductPrice: (catId: string, productId: string, price: number) => void;
  onRenameProduct: (catId: string, productId: string, name: string) => void;
  onAddProductCategory: () => void;
  onDeleteProductCategory: (catId: string) => void;
  onRenameProductCategory: (catId: string, name: string) => void;
  onOpenTransactionsModal: (catId: string, catLabel: string, productId: string) => void;
  onOpenRulesModal: (catId: string, product: Product) => void;
};

export function ProductsTab({
  data,
  currentMonthKey,
  getCategoryRevenue,
  getCategoryClients,
  getProductRevenue,
  getTransactionsCount,
  editingCell,
  editValue,
  onStartEdit,
  onCancelEdit,
  onEditValueChange,
  onAddProduct,
  onDeleteProduct,
  onUpdateProductPrice,
  onRenameProduct,
  onAddProductCategory,
  onDeleteProductCategory,
  onRenameProductCategory,
  onOpenTransactionsModal,
  onOpenRulesModal,
}: ProductsTabProps) {
  const handleKeyDown = (e: React.KeyboardEvent, onSave: () => void) => {
    if (e.key === 'Enter') {
      onSave();
      onCancelEdit();
    }
    if (e.key === 'Escape') onCancelEdit();
  };

  return (
    <div className="space-y-6">
      {data?.productCategories.map((cat) => {
        const catNameKey = `catname_${cat.id}`;

        return (
          <div key={cat.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-zinc-800 bg-emerald-500/5 flex items-center justify-between group/header">
              {/* Category name - editable */}
              {editingCell === catNameKey ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => onEditValueChange(e.target.value)}
                    autoFocus
                    className="bg-zinc-800 border border-violet-500 rounded px-2 py-1 text-white font-semibold"
                    onKeyDown={(e) => handleKeyDown(e, () => onRenameProductCategory(cat.id, editValue))}
                  />
                  <button onClick={() => { onRenameProductCategory(cat.id, editValue); onCancelEdit(); }} className="text-emerald-400"><Check className="h-4 w-4" /></button>
                  <button onClick={onCancelEdit} className="text-zinc-400"><X className="h-4 w-4" /></button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white">{cat.label}</h3>
                  {cat.isFromCatalogue && (
                    <span className="text-[10px] text-violet-400 bg-violet-400/10 px-1.5 py-0.5 rounded">
                      catalogue
                    </span>
                  )}
                  {!cat.isFromCatalogue && (
                    <>
                      <button
                        onClick={() => onStartEdit(catNameKey, cat.label)}
                        className="opacity-0 group-hover/header:opacity-100 p-1 text-zinc-500 hover:text-violet-400"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => onDeleteProductCategory(cat.id)}
                        className="opacity-0 group-hover/header:opacity-100 p-1 text-zinc-500 hover:text-red-400"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </>
                  )}
                </div>
              )}
              <div className="flex items-center gap-4">
                <span className="text-zinc-400 text-sm">{getCategoryClients(cat, currentMonthKey)} clients</span>
                <span className="text-emerald-400 font-bold">{formatCurrency(getCategoryRevenue(cat, currentMonthKey))}</span>
              </div>
            </div>

            {/* Table header */}
            <div className="grid grid-cols-12 gap-2 px-4 py-2 border-b border-zinc-800 text-xs text-zinc-500 font-medium">
              <div className="col-span-4">Produit</div>
              <div className="col-span-2 text-right">Prix unitaire</div>
              <div className="col-span-2 text-right">Transactions</div>
              <div className="col-span-3 text-right">Revenue</div>
              <div className="col-span-1"></div>
            </div>

            {/* Products */}
            <div className="divide-y divide-zinc-800/50">
              {cat.products.map((product) => {
                const priceKey = `price_${product.id}`;
                const nameKey = `name_${product.id}`;
                const txCount = getTransactionsCount(product, currentMonthKey);

                return (
                  <div key={product.id} className="grid grid-cols-12 gap-2 px-4 py-3 items-center group">
                    {/* Product name */}
                    <div className="col-span-4">
                      {cat.isFromCatalogue ? (
                        <span className="text-zinc-300">{product.label}</span>
                      ) : editingCell === nameKey ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => onEditValueChange(e.target.value)}
                            autoFocus
                            className="w-full bg-zinc-800 border border-violet-500 rounded px-2 py-1 text-white text-sm"
                            onKeyDown={(e) => handleKeyDown(e, () => onRenameProduct(cat.id, product.id, editValue))}
                          />
                          <button onClick={() => { onRenameProduct(cat.id, product.id, editValue); onCancelEdit(); }} className="text-emerald-400"><Check className="h-4 w-4" /></button>
                          <button onClick={onCancelEdit} className="text-zinc-400"><X className="h-4 w-4" /></button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onStartEdit(nameKey, product.label)}
                          className="text-zinc-300 hover:text-white flex items-center gap-1 text-left"
                        >
                          {product.label}
                          <Pencil className="h-3 w-3 opacity-0 group-hover:opacity-100 text-zinc-500" />
                        </button>
                      )}
                    </div>

                    {/* Price */}
                    <div className="col-span-2 text-right">
                      {cat.isFromCatalogue ? (
                        <span className="text-zinc-400">{formatCurrency(product.price)}</span>
                      ) : editingCell === priceKey ? (
                        <div className="flex items-center justify-end gap-1">
                          <input
                            type="number"
                            value={editValue}
                            onChange={(e) => onEditValueChange(e.target.value)}
                            autoFocus
                            className="w-20 bg-zinc-800 border border-violet-500 rounded px-2 py-1 text-right text-white text-sm"
                            onKeyDown={(e) => handleKeyDown(e, () => onUpdateProductPrice(cat.id, product.id, Number(editValue) || 0))}
                          />
                          <button onClick={() => { onUpdateProductPrice(cat.id, product.id, Number(editValue) || 0); onCancelEdit(); }} className="text-emerald-400"><Check className="h-4 w-4" /></button>
                          <button onClick={onCancelEdit} className="text-zinc-400"><X className="h-4 w-4" /></button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onStartEdit(priceKey, product.price)}
                          className="text-zinc-400 hover:text-white flex items-center justify-end gap-1 w-full"
                        >
                          {formatCurrency(product.price)}
                          <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-100" />
                        </button>
                      )}
                    </div>

                    {/* Transactions */}
                    <div className="col-span-2 text-right">
                      <button
                        onClick={() => onOpenTransactionsModal(cat.id, cat.label, product.id)}
                        className="text-blue-400 font-medium hover:text-blue-300 flex items-center justify-end gap-1 w-full"
                      >
                        <Receipt className="h-3 w-3" />
                        {txCount}
                      </button>
                    </div>

                    {/* Revenue */}
                    <div className="col-span-3 text-right text-emerald-400 font-semibold">
                      {formatCurrency(getProductRevenue(product, currentMonthKey))}
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 text-right flex items-center justify-end gap-1">
                      <button
                        onClick={() => onOpenRulesModal(cat.id, product)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-violet-400 relative"
                        title="Règles de coûts"
                      >
                        <Settings className="h-4 w-4" />
                        {(product.rules?.length || 0) > 0 && (
                          <span className="absolute -top-1 -right-1 w-3 h-3 bg-violet-500 rounded-full text-[8px] flex items-center justify-center text-white">
                            {product.rules?.length}
                          </span>
                        )}
                      </button>
                      {!cat.isFromCatalogue && (
                        <button
                          onClick={() => onDeleteProduct(cat.id, product.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add product */}
            {!cat.isFromCatalogue && (
              <div className="px-4 py-2 border-t border-zinc-800">
                <button
                  onClick={() => onAddProduct(cat.id)}
                  className="flex items-center gap-1 text-xs text-zinc-500 hover:text-violet-400"
                >
                  <Plus className="h-3 w-3" /> Ajouter un produit
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* Add category button */}
      <button
        onClick={onAddProductCategory}
        className="w-full py-4 border-2 border-dashed border-zinc-700 hover:border-violet-500 rounded-xl text-zinc-500 hover:text-violet-400 transition-colors flex items-center justify-center gap-2"
      >
        <FolderPlus className="h-5 w-5" />
        Ajouter une catégorie
      </button>
    </div>
  );
}
