// apps/web/app/[locale]/admin/pnl/constants/index.ts
// Description: P&L module constants
// Last modified: 2025-12-19

import type { CompanyId, CompanyConfig } from '../types';

// Month names (French)
export const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'] as const;

// Month keys (for data access)
export const MONTH_KEYS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'] as const;

// Company configuration
export const COMPANY_CONFIG: Record<CompanyId, CompanyConfig> = {
  hackboot: {
    name: 'Hackboot',
    collection: 'pnl_data',
    color: 'violet',
  },
  vmcloud: {
    name: 'VMCloud',
    collection: 'pnl_data',
    color: 'emerald',
  },
};

// Cache TTL for catalogue data (5 minutes)
export const CATALOGUE_CACHE_TTL = 5 * 60 * 1000;

// Auto-save debounce delay (ms)
export const AUTO_SAVE_DELAY = 800;

// Tab definitions
export const PNL_TABS = [
  { id: 'overview', label: 'Vue globale', icon: 'BarChart3' },
  { id: 'products', label: 'Produits & Clients', icon: 'Package' },
  { id: 'expenses', label: 'Dépenses', icon: 'TrendingDown' },
  { id: 'annual', label: 'Vue annuelle', icon: 'Calendar' },
] as const;

export type PnLTabId = typeof PNL_TABS[number]['id'];
