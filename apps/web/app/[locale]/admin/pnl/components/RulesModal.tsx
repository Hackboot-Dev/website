// /workspaces/website/apps/web/app/[locale]/admin/pnl/components/RulesModal.tsx
// Description: Product rules management modal - extracted from PnLPageClient
// Last modified: 2025-12-14
// Status: Ready for integration - not yet used in PnLPageClient

'use client';

import { useState } from 'react';
import {
  X,
  Settings,
  ChevronDown,
  Trash2,
  Check,
  Link,
} from 'lucide-react';
import type { Product, ProductRule, ExpenseCategory, ExpenseItem } from '../types';
import { formatCurrency } from '../types';

// ============================================================
// TYPES
// ============================================================

type RulesModalProps = {
  // Modal state
  isOpen: boolean;
  catId: string;
  product: Product;
  expenseCategories: ExpenseCategory[];

  // Callbacks
  onClose: () => void;
  onAddRule: (catId: string, productId: string, rule: Omit<ProductRule, 'id'>) => void;
  onDeleteRule: (catId: string, productId: string, ruleId: string) => void;
  onUpdateRuleMultiplier: (catId: string, productId: string, ruleId: string, multiplier: number) => void;

  // Helpers
  getExpenseItem: (catId: string, itemId: string) => ExpenseItem | undefined;
  getExpenseItemLabel: (catId: string, itemId: string) => string;
};

// ============================================================
// COMPONENT
// ============================================================

export function RulesModal({
  isOpen,
  catId,
  product,
  expenseCategories,
  onClose,
  onAddRule,
  onDeleteRule,
  onUpdateRuleMultiplier,
  getExpenseItem,
  getExpenseItemLabel,
}: RulesModalProps) {
  const [openAccordions, setOpenAccordions] = useState<string[]>([]);
  const [editingRule, setEditingRule] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const toggleAccordion = (id: string) => {
    setOpenAccordions((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const startEdit = (ruleId: string, currentValue: number) => {
    setEditingRule(ruleId);
    setEditValue(String(currentValue));
  };

  const cancelEdit = () => {
    setEditingRule(null);
    setEditValue('');
  };

  const saveMultiplier = (ruleId: string) => {
    const multiplier = Number(editValue) || 1;
    onUpdateRuleMultiplier(catId, product.id, ruleId, multiplier);
    cancelEdit();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl shadow-2xl shadow-violet-500/10">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-500/20 rounded-xl flex items-center justify-center">
                <Settings className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">Règles automatiques</h3>
                <p className="text-sm text-zinc-500">{product.label}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          {/* Info */}
          <div className="bg-zinc-800/50 rounded-xl px-4 py-3 border border-zinc-700/50">
            <p className="text-sm text-zinc-400">
              <span className="text-violet-400 font-medium">Par client ajouté</span>, multiplie le prix unitaire de la dépense par le facteur défini.
            </p>
          </div>

          {/* Rules List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Règles actives</span>
              <span className="text-xs text-zinc-600">{product.rules?.length || 0} règle(s)</span>
            </div>

            {(product.rules?.length || 0) === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-zinc-800 rounded-xl">
                <Link className="h-8 w-8 text-zinc-700 mx-auto mb-2" />
                <p className="text-sm text-zinc-600">Aucune règle configurée</p>
                <p className="text-xs text-zinc-700 mt-1">Sélectionnez une dépense ci-dessous</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                {product.rules?.map((rule, index) => {
                  const expItem = getExpenseItem(rule.expenseCategoryId, rule.expenseItemId);
                  const unitPrice = expItem?.unitPrice || 0;
                  const isEditing = editingRule === rule.id;

                  return (
                    <div
                      key={rule.id}
                      className="group flex items-center gap-3 bg-zinc-800/70 hover:bg-zinc-800 rounded-xl px-4 py-3 transition-colors"
                    >
                      <div className="flex-shrink-0 w-6 h-6 bg-violet-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-xs font-medium text-violet-400">{index + 1}</span>
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-sm text-white truncate">
                          {getExpenseItemLabel(rule.expenseCategoryId, rule.expenseItemId)}
                        </p>
                        <p className="text-[10px] text-zinc-500">
                          Prix unitaire: {formatCurrency(unitPrice)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Multiplier - editable inline */}
                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              autoFocus
                              min="0"
                              step="1"
                              className="w-14 bg-zinc-700 border border-violet-500 rounded px-2 py-1 text-center text-white text-sm"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveMultiplier(rule.id);
                                if (e.key === 'Escape') cancelEdit();
                              }}
                            />
                            <button onClick={() => saveMultiplier(rule.id)} className="text-emerald-400">
                              <Check className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEdit(rule.id, rule.multiplier || 1)}
                            className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-lg hover:bg-blue-500/30 transition-colors"
                          >
                            ×{rule.multiplier || 1}
                          </button>
                        )}
                        <span className="text-zinc-600">=</span>
                        <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-lg min-w-[70px] text-center">
                          {formatCurrency((rule.multiplier || 1) * unitPrice)}
                        </span>
                        <button
                          onClick={() => onDeleteRule(catId, product.id, rule.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Add Rule - Accordion Selector */}
          <div className="pt-4 border-t border-zinc-800">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3 block">Ajouter une règle</span>
            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
              {expenseCategories.map((cat) => {
                const isOpen = openAccordions.includes(cat.id);
                const itemsWithRules = cat.items.filter((item) =>
                  product.rules?.some((r) => r.expenseCategoryId === cat.id && r.expenseItemId === item.id)
                ).length;

                return (
                  <div key={cat.id} className="border border-zinc-800 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleAccordion(cat.id)}
                      className="w-full px-4 py-3 flex items-center justify-between bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <ChevronDown className={`h-4 w-4 text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        <span className="text-white font-medium">{cat.label}</span>
                        <span className="text-xs text-zinc-600">({cat.items.length})</span>
                      </div>
                      {itemsWithRules > 0 && (
                        <span className="text-xs text-emerald-400">{itemsWithRules} lié(s)</span>
                      )}
                    </button>
                    {isOpen && (
                      <div className="p-2 space-y-1 bg-zinc-900/50">
                        {cat.items.map((item) => {
                          const hasRule = product.rules?.some(
                            (r) => r.expenseCategoryId === cat.id && r.expenseItemId === item.id
                          );
                          return (
                            <button
                              key={item.id}
                              disabled={hasRule}
                              onClick={() => {
                                onAddRule(catId, product.id, {
                                  expenseCategoryId: cat.id,
                                  expenseItemId: item.id,
                                  multiplier: 1,
                                });
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-all ${
                                hasRule
                                  ? 'bg-emerald-500/10 border border-emerald-500/30'
                                  : 'bg-zinc-800/50 hover:bg-zinc-800 border border-transparent hover:border-violet-500'
                              }`}
                            >
                              <span className={hasRule ? 'text-emerald-400' : 'text-zinc-300'}>{item.label}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-zinc-500">{formatCurrency(item.unitPrice || 0)}</span>
                                {hasRule && <Check className="h-4 w-4 text-emerald-500" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-900/50">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

export default RulesModal;
