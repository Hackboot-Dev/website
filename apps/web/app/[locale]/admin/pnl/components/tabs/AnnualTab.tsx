// apps/web/app/[locale]/admin/pnl/components/tabs/AnnualTab.tsx
// Description: Annual view tab with full P&L table
// Last modified: 2025-12-19

'use client';

import { motion } from 'framer-motion';
import { formatCurrency } from '../../../_shared/utils/formatters';
import type { PnLData, ProductCategory, ExpenseCategory } from '../../types';
import { MONTHS, MONTH_KEYS } from '../../constants';

type AnnualTabProps = {
  data: PnLData | null;
  // Calculations
  getTotalRevenue: (month: string) => number;
  getTotalReductions: (month: string) => number;
  getGrossProfit: (month: string) => number;
  getTotalExpenses: (month: string) => number;
  getOperatingProfit: (month: string) => number;
  getTotalTaxes: (month: string) => number;
  getNetProfit: (month: string) => number;
  getCategoryRevenue: (cat: ProductCategory, month: string) => number;
  getExpenseCategoryTotal: (cat: ExpenseCategory, month: string) => number;
  getCalculatedDiscounts: (month: string) => number;
  // YTD
  ytd: {
    revenue: number;
    reductions: number;
    grossProfit: number;
    expenses: number;
    operatingProfit: number;
    taxes: number;
    netProfit: number;
  };
};

export function AnnualTab({
  data,
  getTotalRevenue,
  getTotalReductions,
  getGrossProfit,
  getTotalExpenses,
  getOperatingProfit,
  getTotalTaxes,
  getNetProfit,
  getCategoryRevenue,
  getExpenseCategoryTotal,
  getCalculatedDiscounts,
  ytd,
}: AnnualTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Annual Summary Table */}
      <div className="bg-zinc-900/20 border border-zinc-900 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-800/50">
              <th className="text-left px-4 py-3 text-zinc-400 font-medium sticky left-0 bg-zinc-800/50 min-w-[150px]">
                Catégorie
              </th>
              {MONTHS.map((month) => (
                <th key={month} className="text-right px-3 py-3 text-zinc-400 font-medium min-w-[80px]">
                  {month}
                </th>
              ))}
              <th className="text-right px-4 py-3 text-white font-bold min-w-[100px] bg-zinc-700/30">
                YTD
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Revenue Section */}
            <tr className="border-b border-zinc-800 bg-emerald-500/5">
              <td className="px-4 py-3 text-emerald-400 font-semibold sticky left-0 bg-emerald-500/5">
                Revenue
              </td>
              {MONTH_KEYS.map((month) => (
                <td key={month} className="text-right px-3 py-3 text-emerald-400">
                  {formatCurrency(getTotalRevenue(month))}
                </td>
              ))}
              <td className="text-right px-4 py-3 text-emerald-400 font-bold bg-zinc-700/30">
                {formatCurrency(ytd.revenue)}
              </td>
            </tr>
            {/* Products breakdown */}
            {data?.productCategories.map((cat) => (
              <tr key={cat.id} className="border-b border-zinc-800/50">
                <td className="px-4 py-2 text-zinc-500 text-xs pl-8 sticky left-0 bg-zinc-900/20">
                  {cat.label}
                </td>
                {MONTH_KEYS.map((month) => (
                  <td key={month} className="text-right px-3 py-2 text-zinc-500 text-xs">
                    {formatCurrency(getCategoryRevenue(cat, month))}
                  </td>
                ))}
                <td className="text-right px-4 py-2 text-zinc-400 text-xs bg-zinc-700/30">
                  {formatCurrency(MONTH_KEYS.reduce((s, m) => s + getCategoryRevenue(cat, m), 0))}
                </td>
              </tr>
            ))}

            {/* Reductions Section */}
            <tr className="border-b border-zinc-800 bg-orange-500/5">
              <td className="px-4 py-3 text-orange-400 font-semibold sticky left-0 bg-orange-500/5">
                Réductions
              </td>
              {MONTH_KEYS.map((month) => (
                <td key={month} className="text-right px-3 py-3 text-orange-400">
                  {formatCurrency(getTotalReductions(month))}
                </td>
              ))}
              <td className="text-right px-4 py-3 text-orange-400 font-bold bg-zinc-700/30">
                {formatCurrency(ytd.reductions)}
              </td>
            </tr>
            <tr className="border-b border-zinc-800/50">
              <td className="px-4 py-2 text-zinc-500 text-xs pl-8 sticky left-0 bg-zinc-900/20">Retours</td>
              {MONTH_KEYS.map((month) => (
                <td key={month} className="text-right px-3 py-2 text-zinc-500 text-xs">
                  {formatCurrency(data?.reductions?.salesReturns[month] || 0)}
                </td>
              ))}
              <td className="text-right px-4 py-2 text-zinc-400 text-xs bg-zinc-700/30">
                {formatCurrency(MONTH_KEYS.reduce((s, m) => s + (data?.reductions?.salesReturns[m] || 0), 0))}
              </td>
            </tr>
            <tr className="border-b border-zinc-800/50">
              <td className="px-4 py-2 text-zinc-500 text-xs pl-8 sticky left-0 bg-zinc-900/20">Remises</td>
              {MONTH_KEYS.map((month) => (
                <td key={month} className="text-right px-3 py-2 text-zinc-500 text-xs">
                  {formatCurrency(getCalculatedDiscounts(month))}
                </td>
              ))}
              <td className="text-right px-4 py-2 text-zinc-400 text-xs bg-zinc-700/30">
                {formatCurrency(MONTH_KEYS.reduce((s, m) => s + getCalculatedDiscounts(m), 0))}
              </td>
            </tr>
            <tr className="border-b border-zinc-800/50">
              <td className="px-4 py-2 text-zinc-500 text-xs pl-8 sticky left-0 bg-zinc-900/20">COGS</td>
              {MONTH_KEYS.map((month) => (
                <td key={month} className="text-right px-3 py-2 text-zinc-500 text-xs">
                  {formatCurrency(data?.reductions?.costOfGoodsSold[month] || 0)}
                </td>
              ))}
              <td className="text-right px-4 py-2 text-zinc-400 text-xs bg-zinc-700/30">
                {formatCurrency(MONTH_KEYS.reduce((s, m) => s + (data?.reductions?.costOfGoodsSold[m] || 0), 0))}
              </td>
            </tr>

            {/* Gross Profit */}
            <tr className="border-b border-zinc-800 bg-zinc-800/30">
              <td className="px-4 py-3 text-white font-semibold sticky left-0 bg-zinc-800/30">Profit Brut</td>
              {MONTH_KEYS.map((month) => {
                const gp = getGrossProfit(month);
                return (
                  <td key={month} className={`text-right px-3 py-3 font-medium ${gp >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {formatCurrency(gp)}
                  </td>
                );
              })}
              <td className={`text-right px-4 py-3 font-bold bg-zinc-700/30 ${ytd.grossProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {formatCurrency(ytd.grossProfit)}
              </td>
            </tr>

            {/* Expenses Section */}
            <tr className="border-b border-zinc-800 bg-red-500/5">
              <td className="px-4 py-3 text-red-400 font-semibold sticky left-0 bg-red-500/5">Dépenses</td>
              {MONTH_KEYS.map((month) => (
                <td key={month} className="text-right px-3 py-3 text-red-400">
                  {formatCurrency(getTotalExpenses(month))}
                </td>
              ))}
              <td className="text-right px-4 py-3 text-red-400 font-bold bg-zinc-700/30">
                {formatCurrency(ytd.expenses)}
              </td>
            </tr>
            {/* Expenses breakdown */}
            {data?.expenseCategories.map((cat) => (
              <tr key={cat.id} className="border-b border-zinc-800/50">
                <td className="px-4 py-2 text-zinc-500 text-xs pl-8 sticky left-0 bg-zinc-900/20">{cat.label}</td>
                {MONTH_KEYS.map((month) => (
                  <td key={month} className="text-right px-3 py-2 text-zinc-500 text-xs">
                    {formatCurrency(getExpenseCategoryTotal(cat, month))}
                  </td>
                ))}
                <td className="text-right px-4 py-2 text-zinc-400 text-xs bg-zinc-700/30">
                  {formatCurrency(MONTH_KEYS.reduce((s, m) => s + getExpenseCategoryTotal(cat, m), 0))}
                </td>
              </tr>
            ))}

            {/* Operating Profit */}
            <tr className="border-b border-zinc-800 bg-zinc-800/30">
              <td className="px-4 py-3 text-white font-semibold sticky left-0 bg-zinc-800/30">Résultat d&apos;exploitation</td>
              {MONTH_KEYS.map((month) => {
                const op = getOperatingProfit(month);
                return (
                  <td key={month} className={`text-right px-3 py-3 font-medium ${op >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {formatCurrency(op)}
                  </td>
                );
              })}
              <td className={`text-right px-4 py-3 font-bold bg-zinc-700/30 ${ytd.operatingProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {formatCurrency(ytd.operatingProfit)}
              </td>
            </tr>

            {/* Taxes Section */}
            <tr className="border-b border-zinc-800 bg-amber-500/5">
              <td className="px-4 py-3 text-amber-400 font-semibold sticky left-0 bg-amber-500/5">Taxes & Impôts</td>
              {MONTH_KEYS.map((month) => (
                <td key={month} className="text-right px-3 py-3 text-amber-400">
                  {formatCurrency(getTotalTaxes(month))}
                </td>
              ))}
              <td className="text-right px-4 py-3 text-amber-400 font-bold bg-zinc-700/30">
                {formatCurrency(ytd.taxes)}
              </td>
            </tr>
            {/* TVA */}
            <tr className="border-b border-zinc-800/50">
              <td className="px-4 py-2 text-zinc-500 text-xs pl-8 sticky left-0 bg-zinc-900/20">TVA collectée</td>
              {MONTH_KEYS.map((month) => (
                <td key={month} className="text-right px-3 py-2 text-zinc-500 text-xs">
                  {formatCurrency(data?.taxes?.tva[month] || 0)}
                </td>
              ))}
              <td className="text-right px-4 py-2 text-zinc-400 text-xs bg-zinc-700/30">
                {formatCurrency(MONTH_KEYS.reduce((s, m) => s + (data?.taxes?.tva[m] || 0), 0))}
              </td>
            </tr>
            {/* Corporate Tax */}
            <tr className="border-b border-zinc-800/50">
              <td className="px-4 py-2 text-zinc-500 text-xs pl-8 sticky left-0 bg-zinc-900/20">Impôt sur les sociétés</td>
              {MONTH_KEYS.map((month) => (
                <td key={month} className="text-right px-3 py-2 text-zinc-500 text-xs">
                  {formatCurrency(data?.taxes?.corporateTax[month] || 0)}
                </td>
              ))}
              <td className="text-right px-4 py-2 text-zinc-400 text-xs bg-zinc-700/30">
                {formatCurrency(MONTH_KEYS.reduce((s, m) => s + (data?.taxes?.corporateTax[m] || 0), 0))}
              </td>
            </tr>
            {/* Other Taxes */}
            <tr className="border-b border-zinc-800/50">
              <td className="px-4 py-2 text-zinc-500 text-xs pl-8 sticky left-0 bg-zinc-900/20">Autres taxes</td>
              {MONTH_KEYS.map((month) => (
                <td key={month} className="text-right px-3 py-2 text-zinc-500 text-xs">
                  {formatCurrency(data?.taxes?.otherTaxes[month] || 0)}
                </td>
              ))}
              <td className="text-right px-4 py-2 text-zinc-400 text-xs bg-zinc-700/30">
                {formatCurrency(MONTH_KEYS.reduce((s, m) => s + (data?.taxes?.otherTaxes[m] || 0), 0))}
              </td>
            </tr>

            {/* Net Profit */}
            <tr className="bg-violet-500/10 border-t-2 border-violet-500/30">
              <td className="px-4 py-4 text-white font-bold text-base sticky left-0 bg-violet-500/10">Résultat Net</td>
              {MONTH_KEYS.map((month) => {
                const np = getNetProfit(month);
                return (
                  <td key={month} className={`text-right px-3 py-4 font-bold ${np >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {formatCurrency(np)}
                  </td>
                );
              })}
              <td className={`text-right px-4 py-4 font-bold text-lg bg-zinc-700/30 ${ytd.netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {formatCurrency(ytd.netProfit)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Annual Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-zinc-900/20 border border-zinc-900">
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Revenue YTD</p>
          <p className="text-xl font-extralight text-emerald-400">{formatCurrency(ytd.revenue)}</p>
        </div>
        <div className="p-4 bg-zinc-900/20 border border-zinc-900">
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Réductions YTD</p>
          <p className="text-xl font-extralight text-orange-400">{formatCurrency(ytd.reductions)}</p>
        </div>
        <div className="p-4 bg-zinc-900/20 border border-zinc-900">
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Dépenses YTD</p>
          <p className="text-xl font-extralight text-red-400">{formatCurrency(ytd.expenses)}</p>
        </div>
        <div className="p-4 bg-zinc-900/20 border border-zinc-900">
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Profit Net YTD</p>
          <p className={`text-xl font-extralight ${ytd.netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {formatCurrency(ytd.netProfit)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
