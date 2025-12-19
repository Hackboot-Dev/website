// apps/web/app/[locale]/admin/pnl/components/layout/PnLTabs.tsx
// Description: Tab navigation for P&L views
// Last modified: 2025-12-19

'use client';

import { motion } from 'framer-motion';
import { BarChart3, Package, TrendingDown, Calendar } from 'lucide-react';
import type { PnLTabId } from '../../constants';

const TAB_ICONS = {
  overview: BarChart3,
  products: Package,
  expenses: TrendingDown,
  annual: Calendar,
} as const;

const TAB_LABELS = {
  overview: 'Vue globale',
  products: 'Produits & Clients',
  expenses: 'Dépenses',
  annual: 'Vue annuelle',
} as const;

type PnLTabsProps = {
  activeTab: PnLTabId;
  onTabChange: (tab: PnLTabId) => void;
};

export function PnLTabs({ activeTab, onTabChange }: PnLTabsProps) {
  const tabs: PnLTabId[] = ['overview', 'products', 'expenses', 'annual'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="flex gap-1 bg-zinc-900/20 border border-zinc-900 p-1"
    >
      {tabs.map((tabId) => {
        const Icon = TAB_ICONS[tabId];
        const label = TAB_LABELS[tabId];
        const isActive = activeTab === tabId;

        return (
          <button
            key={tabId}
            onClick={() => onTabChange(tabId)}
            className={`flex-1 py-2.5 px-4 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
              isActive
                ? 'bg-white text-zinc-950'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </motion.div>
  );
}
