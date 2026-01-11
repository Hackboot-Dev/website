// apps/web/app/[locale]/admin/pnl/components/layout/PnLHeader.tsx
// Description: P&L page header with title, company name, and action buttons
// Last modified: 2025-12-19

'use client';

import { motion } from 'framer-motion';
import { Sparkles, Calendar, Download, FileText, Loader2 } from 'lucide-react';
import type { CompanyConfig } from '../../types';

type PnLHeaderProps = {
  config: CompanyConfig;
  saving: boolean;
  subscriptionCount: number;
  onExportCSV: () => void;
  onExportPDF: () => void;
  onOpenSubscriptions: () => void;
};

export function PnLHeader({
  config,
  saving,
  subscriptionCount,
  onExportCSV,
  onExportPDF,
  onOpenSubscriptions,
}: PnLHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div className="space-y-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/50 border border-zinc-800 text-xs uppercase tracking-[0.2em] text-zinc-400"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Finance
          {saving && (
            <span className="flex items-center gap-1 ml-2 text-violet-400">
              <Loader2 className="w-3 h-3 animate-spin" />
              Sauvegarde...
            </span>
          )}
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl md:text-4xl font-extralight tracking-tight text-white"
        >
          Profit & Loss
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-zinc-500 font-light"
        >
          {config.name} — Suivi financier
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex items-center gap-2"
      >
        {/* Subscriptions */}
        <button
          onClick={onOpenSubscriptions}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-zinc-900 border border-zinc-800 text-violet-400 hover:text-violet-300 hover:border-violet-500/50 transition-all duration-200 relative"
          title="Gérer les abonnements"
        >
          <Calendar className="h-4 w-4" />
          Abonnements
          {subscriptionCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 bg-violet-500 text-white text-[10px] font-medium rounded-full">
              {subscriptionCount}
            </span>
          )}
        </button>

        {/* Export CSV */}
        <button
          onClick={onExportCSV}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all duration-200"
          title="Export CSV"
        >
          <Download className="h-4 w-4" />
          CSV
        </button>

        {/* Export PDF */}
        <button
          onClick={onExportPDF}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all duration-200"
          title="Export PDF"
        >
          <FileText className="h-4 w-4" />
          PDF
        </button>
      </motion.div>
    </div>
  );
}
