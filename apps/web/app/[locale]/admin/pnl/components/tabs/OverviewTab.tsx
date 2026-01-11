// apps/web/app/[locale]/admin/pnl/components/tabs/OverviewTab.tsx
// Description: Overview tab content with charts and summaries
// Last modified: 2025-12-19

'use client';

import { motion } from 'framer-motion';
import { Package, TrendingDown, Receipt, Edit3, Check, X } from 'lucide-react';
import { formatCurrency } from '../../../_shared/utils/formatters';
import type { PnLData, ProductCategory, ExpenseCategory } from '../../types';
import { TrendChart } from '../charts/TrendChart';
import { MRRCards } from '../kpi/MRRCards';

type OverviewTabProps = {
  data: PnLData | null;
  selectedYear: number;
  currentMonthKey: string;
  chartData: Array<{ name: string; revenue: number; expenses: number; netProfit: number }>;
  subscriptionStats: { total: number; active: number; paused: number; cancelled: number; mrr: number; arr: number };
  // Calculations
  revenue: number;
  grossProfit: number;
  operatingProfit: number;
  expenses: number;
  taxes: number;
  netProfit: number;
  getCategoryRevenue: (cat: ProductCategory, month: string) => number;
  getCategoryClients: (cat: ProductCategory, month: string) => number;
  getExpenseCategoryTotal: (cat: ExpenseCategory, month: string) => number;
  getCalculatedDiscounts: (month: string) => number;
  // Edit state
  editingCell: string | null;
  editValue: string;
  onStartEdit: (key: string, value: number | string) => void;
  onCancelEdit: () => void;
  onEditValueChange: (value: string) => void;
  // Update functions
  onUpdateReduction: (field: 'salesReturns' | 'salesDiscounts' | 'costOfGoodsSold', month: string, value: number) => void;
  onUpdateTax: (field: 'tva' | 'corporateTax' | 'otherTaxes', month: string, value: number) => void;
  onOpenSubscriptions: () => void;
};

export function OverviewTab({
  data,
  selectedYear,
  currentMonthKey,
  chartData,
  subscriptionStats,
  revenue,
  grossProfit,
  operatingProfit,
  expenses,
  taxes,
  netProfit,
  getCategoryRevenue,
  getCategoryClients,
  getExpenseCategoryTotal,
  getCalculatedDiscounts,
  editingCell,
  editValue,
  onStartEdit,
  onCancelEdit,
  onEditValueChange,
  onUpdateReduction,
  onUpdateTax,
  onOpenSubscriptions,
}: OverviewTabProps) {
  const handleKeyDown = (
    e: React.KeyboardEvent,
    onSave: () => void
  ) => {
    if (e.key === 'Enter') {
      onSave();
      onCancelEdit();
    }
    if (e.key === 'Escape') onCancelEdit();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Trend Chart */}
      <TrendChart data={chartData} year={selectedYear} />

      {/* MRR/ARR Cards */}
      <MRRCards stats={subscriptionStats} onOpenSubscriptions={onOpenSubscriptions} />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Products Summary */}
        <div className="bg-zinc-900/20 border border-zinc-900 overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-900 bg-emerald-500/5">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-white flex items-center gap-2">
                <Package className="h-4 w-4 text-emerald-500" /> Revenue
              </h3>
              <span className="text-emerald-400 font-medium">{formatCurrency(revenue)}</span>
            </div>
          </div>
          <div className="divide-y divide-zinc-900">
            {data?.productCategories.map((cat) => (
              <div key={cat.id} className="px-5 py-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-white font-light">{cat.label}</span>
                  <span className="text-emerald-400">{formatCurrency(getCategoryRevenue(cat, currentMonthKey))}</span>
                </div>
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>{getCategoryClients(cat, currentMonthKey)} transactions</span>
                  <span>{cat.products.length} produits</span>
                </div>
              </div>
            ))}

            {/* Reductions */}
            <div className="px-5 py-4 bg-orange-500/5">
              <div className="flex justify-between items-center mb-3">
                <span className="text-orange-400 font-light">Réductions</span>
              </div>
              {/* Discounts (calculated from transactions) */}
              <div className="flex justify-between items-center py-2 group">
                <span className="text-zinc-500 text-sm">Remises</span>
                <span className="text-orange-400 text-sm">{formatCurrency(getCalculatedDiscounts(currentMonthKey))}</span>
              </div>
              {/* COGS */}
              <div className="flex justify-between items-center py-2 group">
                <span className="text-zinc-500 text-sm">COGS</span>
                {editingCell === 'red_cogs' ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={editValue}
                      onChange={(e) => onEditValueChange(e.target.value)}
                      autoFocus
                      className="w-24 bg-zinc-800 border border-violet-500 rounded px-2 py-1 text-right text-white"
                      onKeyDown={(e) => handleKeyDown(e, () => onUpdateReduction('costOfGoodsSold', currentMonthKey, parseFloat(editValue) || 0))}
                    />
                    <button onClick={() => { onUpdateReduction('costOfGoodsSold', currentMonthKey, parseFloat(editValue) || 0); onCancelEdit(); }} className="text-emerald-400"><Check className="h-4 w-4" /></button>
                    <button onClick={onCancelEdit} className="text-zinc-400"><X className="h-4 w-4" /></button>
                  </div>
                ) : (
                  <button
                    onClick={() => onStartEdit('red_cogs', data?.reductions?.costOfGoodsSold[currentMonthKey] || 0)}
                    className="text-orange-400 hover:text-orange-300 flex items-center gap-1"
                  >
                    {formatCurrency(data?.reductions?.costOfGoodsSold[currentMonthKey] || 0)}
                    <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-100" />
                  </button>
                )}
              </div>
            </div>
            {/* Gross Profit */}
            <div className="px-5 py-3 border-t border-zinc-800 bg-zinc-800/30">
              <div className="flex justify-between items-center">
                <span className="text-white font-medium">Profit Brut</span>
                <span className={`font-bold ${grossProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {formatCurrency(grossProfit)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Expenses Summary */}
        <div className="bg-zinc-900/20 border border-zinc-900 overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-900 bg-red-500/5">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-white flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-red-500" /> Dépenses
              </h3>
              <span className="text-red-400 font-medium">{formatCurrency(expenses)}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 divide-x divide-y divide-zinc-900">
            {data?.expenseCategories.map((cat) => (
              <div key={cat.id} className="px-4 py-3">
                <span className="text-zinc-500 text-xs block mb-1">{cat.label}</span>
                <span className="text-white font-light">{formatCurrency(getExpenseCategoryTotal(cat, currentMonthKey))}</span>
              </div>
            ))}
          </div>
          {/* Operating Profit */}
          <div className="px-5 py-3 border-t border-zinc-800 bg-zinc-800/30">
            <div className="flex justify-between items-center">
              <span className="text-white font-medium">Résultat d&apos;exploitation</span>
              <span className={`font-bold ${operatingProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {formatCurrency(operatingProfit)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Taxes Section */}
      <div className="bg-zinc-900/20 border border-zinc-900 overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-900 bg-amber-500/5">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-white flex items-center gap-2">
              <Receipt className="h-4 w-4 text-amber-500" /> Taxes & Impôts
            </h3>
            <span className="text-amber-400 font-medium">{formatCurrency(taxes)}</span>
          </div>
        </div>
        <div className="divide-y divide-zinc-800/50">
          {/* TVA */}
          <div className="flex justify-between items-center px-5 py-3 group">
            <span className="text-zinc-400">TVA collectée</span>
            {editingCell === 'tax_tva' ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={editValue}
                  onChange={(e) => onEditValueChange(e.target.value)}
                  autoFocus
                  className="w-24 bg-zinc-800 border border-violet-500 rounded px-2 py-1 text-right text-white"
                  onKeyDown={(e) => handleKeyDown(e, () => onUpdateTax('tva', currentMonthKey, parseFloat(editValue) || 0))}
                />
                <button onClick={() => { onUpdateTax('tva', currentMonthKey, parseFloat(editValue) || 0); onCancelEdit(); }} className="text-emerald-400"><Check className="h-4 w-4" /></button>
                <button onClick={onCancelEdit} className="text-zinc-400"><X className="h-4 w-4" /></button>
              </div>
            ) : (
              <button
                onClick={() => onStartEdit('tax_tva', data?.taxes?.tva[currentMonthKey] || 0)}
                className="text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                {formatCurrency(data?.taxes?.tva[currentMonthKey] || 0)}
                <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-100" />
              </button>
            )}
          </div>
          {/* Corporate Tax */}
          <div className="flex justify-between items-center px-5 py-3 group">
            <span className="text-zinc-400">Impôt sur les sociétés</span>
            {editingCell === 'tax_corporate' ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={editValue}
                  onChange={(e) => onEditValueChange(e.target.value)}
                  autoFocus
                  className="w-24 bg-zinc-800 border border-violet-500 rounded px-2 py-1 text-right text-white"
                  onKeyDown={(e) => handleKeyDown(e, () => onUpdateTax('corporateTax', currentMonthKey, parseFloat(editValue) || 0))}
                />
                <button onClick={() => { onUpdateTax('corporateTax', currentMonthKey, parseFloat(editValue) || 0); onCancelEdit(); }} className="text-emerald-400"><Check className="h-4 w-4" /></button>
                <button onClick={onCancelEdit} className="text-zinc-400"><X className="h-4 w-4" /></button>
              </div>
            ) : (
              <button
                onClick={() => onStartEdit('tax_corporate', data?.taxes?.corporateTax[currentMonthKey] || 0)}
                className="text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                {formatCurrency(data?.taxes?.corporateTax[currentMonthKey] || 0)}
                <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-100" />
              </button>
            )}
          </div>
          {/* Other Taxes */}
          <div className="flex justify-between items-center px-5 py-3 group">
            <span className="text-zinc-400">Autres taxes</span>
            {editingCell === 'tax_other' ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={editValue}
                  onChange={(e) => onEditValueChange(e.target.value)}
                  autoFocus
                  className="w-24 bg-zinc-800 border border-violet-500 rounded px-2 py-1 text-right text-white"
                  onKeyDown={(e) => handleKeyDown(e, () => onUpdateTax('otherTaxes', currentMonthKey, parseFloat(editValue) || 0))}
                />
                <button onClick={() => { onUpdateTax('otherTaxes', currentMonthKey, parseFloat(editValue) || 0); onCancelEdit(); }} className="text-emerald-400"><Check className="h-4 w-4" /></button>
                <button onClick={onCancelEdit} className="text-zinc-400"><X className="h-4 w-4" /></button>
              </div>
            ) : (
              <button
                onClick={() => onStartEdit('tax_other', data?.taxes?.otherTaxes[currentMonthKey] || 0)}
                className="text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                {formatCurrency(data?.taxes?.otherTaxes[currentMonthKey] || 0)}
                <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-100" />
              </button>
            )}
          </div>
        </div>
        {/* Net Profit */}
        <div className="px-5 py-4 border-t border-zinc-800 bg-violet-500/10">
          <div className="flex justify-between items-center">
            <span className="text-white font-medium text-lg">Résultat Net</span>
            <span className={`font-bold text-xl ${netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {formatCurrency(netProfit)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
