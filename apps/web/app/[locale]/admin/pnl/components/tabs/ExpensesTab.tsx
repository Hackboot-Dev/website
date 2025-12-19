// apps/web/app/[locale]/admin/pnl/components/tabs/ExpensesTab.tsx
// Description: Expenses tab content
// Last modified: 2025-12-19

'use client';

import { Plus, FolderPlus, Trash2, Pencil, Check, X, Edit3 } from 'lucide-react';
import { formatCurrency } from '../../../_shared/utils/formatters';
import type { PnLData, ExpenseCategory } from '../../types';

type ExpensesTabProps = {
  data: PnLData | null;
  currentMonthKey: string;
  // Calculations
  getExpenseCategoryTotal: (cat: ExpenseCategory, month: string) => number;
  getExpenseItemTotal: (catId: string, itemId: string, month: string) => number;
  getAutoQuantity: (catId: string, itemId: string, month: string) => number;
  // Edit state
  editingCell: string | null;
  editValue: string;
  onStartEdit: (key: string, value: number | string) => void;
  onCancelEdit: () => void;
  onEditValueChange: (value: string) => void;
  // Actions
  onAddExpenseItem: (catId: string) => void;
  onDeleteExpenseItem: (catId: string, itemId: string) => void;
  onUpdateExpenseUnitPrice: (catId: string, itemId: string, price: number) => void;
  onUpdateExpenseQuantity: (catId: string, itemId: string, month: string, qty: number) => void;
  onUpdateExpenseAdjustment: (catId: string, itemId: string, month: string, value: number) => void;
  onRenameExpenseItem: (catId: string, itemId: string, name: string) => void;
  onAddExpenseCategory: () => void;
  onDeleteExpenseCategory: (catId: string) => void;
  onRenameExpenseCategory: (catId: string, name: string) => void;
};

export function ExpensesTab({
  data,
  currentMonthKey,
  getExpenseCategoryTotal,
  getExpenseItemTotal,
  getAutoQuantity,
  editingCell,
  editValue,
  onStartEdit,
  onCancelEdit,
  onEditValueChange,
  onAddExpenseItem,
  onDeleteExpenseItem,
  onUpdateExpenseUnitPrice,
  onUpdateExpenseQuantity,
  onUpdateExpenseAdjustment,
  onRenameExpenseItem,
  onAddExpenseCategory,
  onDeleteExpenseCategory,
  onRenameExpenseCategory,
}: ExpensesTabProps) {
  const handleKeyDown = (e: React.KeyboardEvent, onSave: () => void) => {
    if (e.key === 'Enter') {
      onSave();
      onCancelEdit();
    }
    if (e.key === 'Escape') onCancelEdit();
  };

  return (
    <div className="space-y-6">
      {data?.expenseCategories.map((cat) => {
        const expCatNameKey = `expcatname_${cat.id}`;

        return (
          <div key={cat.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-zinc-800 bg-red-500/5 flex items-center justify-between group/header">
              {/* Category name - editable */}
              {editingCell === expCatNameKey ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => onEditValueChange(e.target.value)}
                    autoFocus
                    className="bg-zinc-800 border border-violet-500 rounded px-2 py-1 text-white font-semibold"
                    onKeyDown={(e) => handleKeyDown(e, () => onRenameExpenseCategory(cat.id, editValue))}
                  />
                  <button onClick={() => { onRenameExpenseCategory(cat.id, editValue); onCancelEdit(); }} className="text-emerald-400"><Check className="h-4 w-4" /></button>
                  <button onClick={onCancelEdit} className="text-zinc-400"><X className="h-4 w-4" /></button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white">{cat.label}</h3>
                  {cat.isProtected && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-zinc-700 text-zinc-400 rounded">Protégé</span>
                  )}
                  <button
                    onClick={() => onStartEdit(expCatNameKey, cat.label)}
                    className="opacity-0 group-hover/header:opacity-100 p-1 text-zinc-500 hover:text-violet-400"
                  >
                    <Pencil className="h-3 w-3" />
                  </button>
                  {!cat.isProtected && (
                    <button
                      onClick={() => onDeleteExpenseCategory(cat.id)}
                      className="opacity-0 group-hover/header:opacity-100 p-1 text-zinc-500 hover:text-red-400"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              )}
              <span className="text-red-400 font-bold">{formatCurrency(getExpenseCategoryTotal(cat, currentMonthKey))}</span>
            </div>

            {/* Table header */}
            <div className="grid grid-cols-12 gap-2 px-4 py-2 border-b border-zinc-800 text-xs text-zinc-500 font-medium">
              <div className="col-span-3">Élément</div>
              <div className="col-span-2 text-right">Prix unit.</div>
              <div className="col-span-2 text-right">Qté</div>
              <div className="col-span-2 text-right">Ajust. €</div>
              <div className="col-span-2 text-right">Total</div>
              <div className="col-span-1"></div>
            </div>

            {/* Items */}
            <div className="divide-y divide-zinc-800/50">
              {cat.items.map((item) => {
                const unitPriceKey = `unitprice_${item.id}`;
                const qtyKey = `qty_${item.id}_${currentMonthKey}`;
                const adjustKey = `adjust_${item.id}_${currentMonthKey}`;
                const nameKey = `expname_${item.id}`;
                const manualQty = item.quantity?.[currentMonthKey] || 0;
                const autoQty = getAutoQuantity(cat.id, item.id, currentMonthKey);
                const adjustValue = item.adjustments?.[currentMonthKey] || 0;

                return (
                  <div key={item.id} className="grid grid-cols-12 gap-2 px-4 py-3 items-center group">
                    {/* Item name */}
                    <div className="col-span-3">
                      {editingCell === nameKey ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => onEditValueChange(e.target.value)}
                            autoFocus
                            className="w-full bg-zinc-800 border border-violet-500 rounded px-2 py-1 text-white text-sm"
                            onKeyDown={(e) => handleKeyDown(e, () => onRenameExpenseItem(cat.id, item.id, editValue))}
                          />
                          <button onClick={() => { onRenameExpenseItem(cat.id, item.id, editValue); onCancelEdit(); }} className="text-emerald-400"><Check className="h-4 w-4" /></button>
                          <button onClick={onCancelEdit} className="text-zinc-400"><X className="h-4 w-4" /></button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => onStartEdit(nameKey, item.label)}
                            className="text-zinc-300 hover:text-white flex items-center gap-1 text-left"
                          >
                            {item.label}
                            <Pencil className="h-3 w-3 opacity-0 group-hover:opacity-100 text-zinc-500" />
                          </button>
                          {(item.type || item.note) && (
                            <div className="flex items-center gap-1 flex-wrap">
                              {item.type && (
                                <span className="text-[10px] px-1.5 py-0.5 bg-violet-500/20 text-violet-400 rounded">{item.type}</span>
                              )}
                              {item.note && (
                                <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded">{item.note}</span>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Unit Price */}
                    <div className="col-span-2 text-right">
                      {editingCell === unitPriceKey ? (
                        <div className="flex items-center justify-end gap-1">
                          <input
                            type="number"
                            value={editValue}
                            onChange={(e) => onEditValueChange(e.target.value)}
                            autoFocus
                            className="w-20 bg-zinc-800 border border-violet-500 rounded px-2 py-1 text-right text-white text-sm"
                            onKeyDown={(e) => handleKeyDown(e, () => onUpdateExpenseUnitPrice(cat.id, item.id, Number(editValue) || 0))}
                          />
                          <button onClick={() => { onUpdateExpenseUnitPrice(cat.id, item.id, Number(editValue) || 0); onCancelEdit(); }} className="text-emerald-400"><Check className="h-4 w-4" /></button>
                          <button onClick={onCancelEdit} className="text-zinc-400"><X className="h-4 w-4" /></button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onStartEdit(unitPriceKey, item.unitPrice || 0)}
                          className="text-zinc-400 hover:text-white flex items-center justify-end gap-1 w-full"
                        >
                          {formatCurrency(item.unitPrice || 0)}
                          <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-100" />
                        </button>
                      )}
                    </div>

                    {/* Quantity */}
                    <div className="col-span-2 text-right">
                      {editingCell === qtyKey ? (
                        <div className="flex items-center justify-end gap-1">
                          <input
                            type="number"
                            value={editValue}
                            onChange={(e) => onEditValueChange(e.target.value)}
                            autoFocus
                            min="0"
                            className="w-14 bg-zinc-800 border border-violet-500 rounded px-2 py-1 text-right text-white text-sm"
                            onKeyDown={(e) => handleKeyDown(e, () => onUpdateExpenseQuantity(cat.id, item.id, currentMonthKey, Number(editValue) || 0))}
                          />
                          <button onClick={() => { onUpdateExpenseQuantity(cat.id, item.id, currentMonthKey, Number(editValue) || 0); onCancelEdit(); }} className="text-emerald-400"><Check className="h-4 w-4" /></button>
                          <button onClick={onCancelEdit} className="text-zinc-400"><X className="h-4 w-4" /></button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onStartEdit(qtyKey, manualQty)}
                          className="text-blue-400 hover:text-blue-300 flex items-center justify-end gap-1 w-full text-sm"
                        >
                          {manualQty > 0 && <span>{manualQty}</span>}
                          {manualQty > 0 && autoQty > 0 && <span className="text-zinc-600">+</span>}
                          {autoQty > 0 && <span className="text-violet-400">{autoQty}</span>}
                          {manualQty === 0 && autoQty === 0 && <span className="text-zinc-600">0</span>}
                          <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-100" />
                        </button>
                      )}
                    </div>

                    {/* Adjustment */}
                    <div className="col-span-2 text-right">
                      {editingCell === adjustKey ? (
                        <div className="flex items-center justify-end gap-1">
                          <input
                            type="number"
                            value={editValue}
                            onChange={(e) => onEditValueChange(e.target.value)}
                            autoFocus
                            className="w-16 bg-zinc-800 border border-violet-500 rounded px-2 py-1 text-right text-white text-sm"
                            onKeyDown={(e) => handleKeyDown(e, () => onUpdateExpenseAdjustment(cat.id, item.id, currentMonthKey, Number(editValue) || 0))}
                          />
                          <button onClick={() => { onUpdateExpenseAdjustment(cat.id, item.id, currentMonthKey, Number(editValue) || 0); onCancelEdit(); }} className="text-emerald-400"><Check className="h-4 w-4" /></button>
                          <button onClick={onCancelEdit} className="text-zinc-400"><X className="h-4 w-4" /></button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onStartEdit(adjustKey, adjustValue)}
                          className="text-orange-400/70 hover:text-orange-400 flex items-center justify-end gap-1 w-full text-sm"
                        >
                          {adjustValue !== 0 ? (adjustValue > 0 ? '+' : '') + formatCurrency(adjustValue) : '—'}
                          <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-100" />
                        </button>
                      )}
                    </div>

                    {/* Total */}
                    <div className="col-span-2 text-right text-red-400 font-semibold">
                      {formatCurrency(getExpenseItemTotal(cat.id, item.id, currentMonthKey))}
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 text-right">
                      <button
                        onClick={() => onDeleteExpenseItem(cat.id, item.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add item */}
            <div className="px-4 py-2 border-t border-zinc-800">
              <button
                onClick={() => onAddExpenseItem(cat.id)}
                className="flex items-center gap-1 text-xs text-zinc-500 hover:text-violet-400"
              >
                <Plus className="h-3 w-3" /> Ajouter un élément
              </button>
            </div>
          </div>
        );
      })}

      {/* Add expense category button */}
      <button
        onClick={onAddExpenseCategory}
        className="w-full py-4 border-2 border-dashed border-zinc-700 hover:border-red-500 rounded-xl text-zinc-500 hover:text-red-400 transition-colors flex items-center justify-center gap-2"
      >
        <FolderPlus className="h-5 w-5" />
        Ajouter une catégorie de dépenses
      </button>
    </div>
  );
}
