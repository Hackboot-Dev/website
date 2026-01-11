// apps/web/app/[locale]/admin/pnl/components/kpi/KPIGrid.tsx
// Description: Grid of KPI cards for P&L overview
// Last modified: 2025-12-19

'use client';

import { motion } from 'framer-motion';
import { Users, TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react';
import { formatCurrency } from '../../../_shared/utils/formatters';

type KPIGridProps = {
  totalClients: number;
  ytdClients: number;
  totalClientsInDb: number;
  revenue: number;
  ytdRevenue: number;
  expenses: number;
  ytdExpenses: number;
  netProfit: number;
  ytdNetProfit: number;
  margin: number;
  onOpenClients: () => void;
};

export function KPIGrid({
  totalClients,
  ytdClients,
  totalClientsInDb,
  revenue,
  ytdRevenue,
  expenses,
  ytdExpenses,
  netProfit,
  ytdNetProfit,
  margin,
  onOpenClients,
}: KPIGridProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="grid grid-cols-2 lg:grid-cols-5 gap-4"
    >
      {/* Clients KPI */}
      <button
        onClick={onOpenClients}
        className="p-5 bg-zinc-900/20 border border-zinc-900 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all text-left group"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-blue-500/10 border border-blue-900/30 rounded-lg flex items-center justify-center group-hover:bg-blue-500/20 group-hover:border-blue-500/50 transition-colors">
            <Users className="h-4 w-4 text-blue-500" />
          </div>
        </div>
        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1 group-hover:text-blue-400 transition-colors">
          Clients
        </p>
        <p className="text-2xl font-extralight text-white">{totalClients}</p>
        <p className="text-xs text-zinc-600 mt-2">
          YTD: {ytdClients} • {totalClientsInDb} total
        </p>
      </button>

      {/* Revenue KPI */}
      <div className="p-5 bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800 transition-colors">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-emerald-500/10 border border-emerald-900/30 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
        </div>
        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Revenue</p>
        <p className="text-2xl font-extralight text-emerald-400">{formatCurrency(revenue)}</p>
        <p className="text-xs text-zinc-600 mt-2">YTD: {formatCurrency(ytdRevenue)}</p>
      </div>

      {/* Expenses KPI */}
      <div className="p-5 bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800 transition-colors">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-red-500/10 border border-red-900/30 rounded-lg flex items-center justify-center">
            <TrendingDown className="h-4 w-4 text-red-500" />
          </div>
        </div>
        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Dépenses</p>
        <p className="text-2xl font-extralight text-red-400">{formatCurrency(expenses)}</p>
        <p className="text-xs text-zinc-600 mt-2">YTD: {formatCurrency(ytdExpenses)}</p>
      </div>

      {/* Net Profit KPI */}
      <div className="p-5 bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800 transition-colors">
        <div className="flex items-center gap-2 mb-4">
          <div
            className={`w-8 h-8 ${
              netProfit >= 0
                ? 'bg-emerald-500/10 border-emerald-900/30'
                : 'bg-red-500/10 border-red-900/30'
            } border rounded-lg flex items-center justify-center`}
          >
            <DollarSign className={`h-4 w-4 ${netProfit >= 0 ? 'text-emerald-500' : 'text-red-500'}`} />
          </div>
        </div>
        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Profit Net</p>
        <p className={`text-2xl font-extralight ${netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {formatCurrency(netProfit)}
        </p>
        <p className="text-xs text-zinc-600 mt-2">YTD: {formatCurrency(ytdNetProfit)}</p>
      </div>

      {/* Margin KPI */}
      <div className="p-5 bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800 transition-colors">
        <div className="flex items-center gap-2 mb-4">
          <div
            className={`w-8 h-8 ${
              margin >= 0
                ? 'bg-violet-500/10 border-violet-900/30'
                : 'bg-red-500/10 border-red-900/30'
            } border rounded-lg flex items-center justify-center`}
          >
            <Percent className={`h-4 w-4 ${margin >= 0 ? 'text-violet-500' : 'text-red-500'}`} />
          </div>
        </div>
        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Marge</p>
        <p className={`text-2xl font-extralight ${margin >= 0 ? 'text-white' : 'text-red-400'}`}>
          {margin.toFixed(1)}%
        </p>
      </div>
    </motion.div>
  );
}
