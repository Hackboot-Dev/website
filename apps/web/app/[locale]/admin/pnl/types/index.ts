// /workspaces/website/apps/web/app/[locale]/admin/pnl/types/index.ts
// Description: P&L module types - extracted from PnLPageClient for better modularity
// Last modified: 2024-12-14

// Re-export subscription types
export * from './subscription';

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
  // Subscription reference (if this transaction came from a subscription renewal)
  subscriptionId?: string;
  renewalDate?: string;
  isRecurring?: boolean;
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
  companyId?: CompanyId;
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
// CONSTANTS (re-exported from constants module for backwards compatibility)
// ============================================================

export { MONTHS, MONTH_KEYS, COMPANY_CONFIG } from '../constants';

// ============================================================
// HELPERS (re-exported from shared utils for backwards compatibility)
// ============================================================

export { formatCurrency } from '../../_shared/utils/formatters';
