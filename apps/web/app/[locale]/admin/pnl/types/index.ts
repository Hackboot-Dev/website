// /workspaces/website/apps/web/app/[locale]/admin/pnl/types/index.ts
// Description: P&L module types - extracted from PnLPageClient for better modularity
// Last modified: 2025-12-14

// ============================================================
// TRANSACTION TYPES
// ============================================================

export type Transaction = {
  id: string;
  amount: number;
  isCustom: boolean;
  note?: string;
  discount?: number;
  clientId: string;
  clientName: string;
  clientEmail?: string;
};

// ============================================================
// PRODUCT TYPES
// ============================================================

export type ProductRule = {
  id: string;
  expenseCategoryId: string;
  expenseItemId: string;
  multiplier: number;
};

export type Product = {
  id: string;
  label: string;
  price: number;
  transactions: Record<string, Transaction[]>;
  rules?: ProductRule[];
};

export type ProductCategory = {
  id: string;
  label: string;
  products: Product[];
  isFromCatalogue?: boolean;
};

// ============================================================
// EXPENSE TYPES
// ============================================================

export type ExpenseItem = {
  id: string;
  label: string;
  type?: string;
  note?: string;
  unitPrice: number;
  quantity: Record<string, number>;
  adjustments: Record<string, number>;
};

export type ExpenseCategory = {
  id: string;
  label: string;
  items: ExpenseItem[];
  isProtected?: boolean;
};

// ============================================================
// COGS & TAXES
// ============================================================

export type ReductionData = {
  salesReturns: Record<string, number>;
  salesDiscounts: Record<string, number>;
  costOfGoodsSold: Record<string, number>;
};

export type TaxesData = {
  tva: Record<string, number>;
  corporateTax: Record<string, number>;
  otherTaxes: Record<string, number>;
};

// ============================================================
// MAIN P&L DATA
// ============================================================

export type PnLData = {
  year: number;
  productCategories: ProductCategory[];
  reductions: ReductionData;
  expenseCategories: ExpenseCategory[];
  taxes: TaxesData;
  updatedAt: string;
};

// ============================================================
// UI TYPES
// ============================================================

export type ClientSelectionMode = 'existing' | 'create' | 'generate';

export type CompanyId = 'hackboot' | 'vmcloud';

export type CompanyConfig = {
  name: string;
  collection: string;
  color: string;
};

// ============================================================
// CONSTANTS
// ============================================================

export const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
export const MONTH_KEYS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

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

// ============================================================
// HELPERS
// ============================================================

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};
