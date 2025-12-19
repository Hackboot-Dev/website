// apps/web/app/[locale]/admin/pnl/utils/calculations.ts
// Description: Pure calculation functions for P&L data
// Last modified: 2025-12-19

import type { Product, ProductCategory, ExpenseCategory, ExpenseItem, PnLData } from '../types';
import { MONTH_KEYS } from '../constants';

// ============================================================
// TRANSACTION CALCULATIONS
// ============================================================

/**
 * Get transactions count for a product in a given month
 */
export const getTransactionsCount = (product: Product, month: string): number => {
  return product.transactions?.[month]?.length || 0;
};

/**
 * Get transactions revenue for a product in a given month
 */
export const getTransactionsRevenue = (product: Product, month: string): number => {
  const txs = product.transactions?.[month] || [];
  return txs.reduce((sum, tx) => sum + tx.amount, 0);
};

/**
 * Calculate discounts from transactions for a given month
 */
export const getCalculatedDiscounts = (data: PnLData | null, month: string): number => {
  if (!data?.productCategories) return 0;
  let total = 0;
  data.productCategories.forEach((cat) => {
    cat.products.forEach((product) => {
      const txs = product.transactions?.[month] || [];
      txs.forEach((tx) => {
        if (tx.discount && tx.discount > 0) {
          total += tx.discount;
        }
      });
    });
  });
  return total;
};

// ============================================================
// REVENUE CALCULATIONS
// ============================================================

/**
 * Get revenue for a product in a given month
 */
export const getProductRevenue = (product: Product, month: string): number => {
  return getTransactionsRevenue(product, month);
};

/**
 * Get total revenue for a category in a given month
 */
export const getCategoryRevenue = (cat: ProductCategory, month: string): number => {
  return cat.products.reduce((sum, p) => sum + getProductRevenue(p, month), 0);
};

/**
 * Get total clients for a category in a given month
 */
export const getCategoryClients = (cat: ProductCategory, month: string): number => {
  return cat.products.reduce((sum, p) => sum + getTransactionsCount(p, month), 0);
};

/**
 * Get total revenue for all categories in a given month
 */
export const getTotalRevenue = (data: PnLData | null, month: string): number => {
  return data?.productCategories.reduce((sum, cat) => sum + getCategoryRevenue(cat, month), 0) || 0;
};

/**
 * Get total clients for all categories in a given month
 */
export const getTotalClients = (data: PnLData | null, month: string): number => {
  return data?.productCategories.reduce((sum, cat) => sum + getCategoryClients(cat, month), 0) || 0;
};

// ============================================================
// EXPENSE CALCULATIONS
// ============================================================

/**
 * Calculate rule-based quantity for expenses from product transactions
 */
export const getRuleBasedQuantity = (
  data: PnLData | null,
  month: string
): Record<string, Record<string, number>> => {
  const qty: Record<string, Record<string, number>> = {};

  data?.productCategories.forEach((cat) => {
    cat.products.forEach((product) => {
      const txCount = getTransactionsCount(product, month);
      (product.rules || []).forEach((rule) => {
        if (!qty[rule.expenseCategoryId]) qty[rule.expenseCategoryId] = {};
        if (!qty[rule.expenseCategoryId][rule.expenseItemId]) {
          qty[rule.expenseCategoryId][rule.expenseItemId] = 0;
        }
        qty[rule.expenseCategoryId][rule.expenseItemId] += txCount * rule.multiplier;
      });
    });
  });

  return qty;
};

/**
 * Get auto quantity for an expense item (from rules)
 */
export const getAutoQuantity = (
  data: PnLData | null,
  catId: string,
  itemId: string,
  month: string
): number => {
  const ruleQty = getRuleBasedQuantity(data, month);
  return ruleQty[catId]?.[itemId] || 0;
};

/**
 * Get total for an expense item in a given month
 */
export const getExpenseItemTotal = (
  data: PnLData | null,
  catId: string,
  itemId: string,
  month: string
): number => {
  const cat = data?.expenseCategories.find((c) => c.id === catId);
  const item = cat?.items.find((i) => i.id === itemId);
  const unitPrice = item?.unitPrice || 0;
  const manualQty = item?.quantity?.[month] || 0;
  const adjustment = item?.adjustments?.[month] || 0;
  const autoQty = getAutoQuantity(data, catId, itemId, month);

  return (manualQty + autoQty) * unitPrice + adjustment;
};

/**
 * Get total for an expense category in a given month
 */
export const getExpenseCategoryTotal = (
  data: PnLData | null,
  cat: ExpenseCategory,
  month: string
): number => {
  return cat.items.reduce((sum, item) => sum + getExpenseItemTotal(data, cat.id, item.id, month), 0);
};

/**
 * Get total expenses for all categories in a given month
 */
export const getTotalExpenses = (data: PnLData | null, month: string): number => {
  return data?.expenseCategories.reduce(
    (sum, cat) => sum + getExpenseCategoryTotal(data, cat, month),
    0
  ) || 0;
};

// ============================================================
// REDUCTIONS & TAXES
// ============================================================

/**
 * Get total reductions for a given month
 */
export const getTotalReductions = (data: PnLData | null, month: string): number => {
  if (!data?.reductions) return 0;
  return (
    (data.reductions.salesReturns[month] || 0) +
    getCalculatedDiscounts(data, month) +
    (data.reductions.costOfGoodsSold[month] || 0)
  );
};

/**
 * Get total taxes for a given month
 */
export const getTotalTaxes = (data: PnLData | null, month: string): number => {
  if (!data?.taxes) return 0;
  return (
    (data.taxes.tva[month] || 0) +
    (data.taxes.corporateTax[month] || 0) +
    (data.taxes.otherTaxes[month] || 0)
  );
};

// ============================================================
// PROFIT CALCULATIONS
// ============================================================

/**
 * Get gross profit for a given month (Revenue - Reductions)
 */
export const getGrossProfit = (data: PnLData | null, month: string): number => {
  return getTotalRevenue(data, month) - getTotalReductions(data, month);
};

/**
 * Get operating profit for a given month (Gross Profit - Expenses)
 */
export const getOperatingProfit = (data: PnLData | null, month: string): number => {
  return getGrossProfit(data, month) - getTotalExpenses(data, month);
};

/**
 * Get net profit for a given month (Operating Profit - Taxes)
 */
export const getNetProfit = (data: PnLData | null, month: string): number => {
  return getOperatingProfit(data, month) - getTotalTaxes(data, month);
};

// ============================================================
// YTD CALCULATIONS
// ============================================================

export const getYTDRevenue = (data: PnLData | null): number =>
  MONTH_KEYS.reduce((sum, m) => sum + getTotalRevenue(data, m), 0);

export const getYTDExpenses = (data: PnLData | null): number =>
  MONTH_KEYS.reduce((sum, m) => sum + getTotalExpenses(data, m), 0);

export const getYTDClients = (data: PnLData | null): number =>
  MONTH_KEYS.reduce((sum, m) => sum + getTotalClients(data, m), 0);

export const getYTDReductions = (data: PnLData | null): number =>
  MONTH_KEYS.reduce((sum, m) => sum + getTotalReductions(data, m), 0);

export const getYTDGrossProfit = (data: PnLData | null): number =>
  getYTDRevenue(data) - getYTDReductions(data);

export const getYTDOperatingProfit = (data: PnLData | null): number =>
  getYTDGrossProfit(data) - getYTDExpenses(data);

export const getYTDTaxes = (data: PnLData | null): number =>
  MONTH_KEYS.reduce((sum, m) => sum + getTotalTaxes(data, m), 0);

export const getYTDNetProfit = (data: PnLData | null): number =>
  getYTDOperatingProfit(data) - getYTDTaxes(data);

// ============================================================
// CHART DATA
// ============================================================

export const getChartData = (data: PnLData | null) => {
  const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  return MONTH_KEYS.map((month, index) => ({
    name: MONTHS[index],
    revenue: getTotalRevenue(data, month),
    reductions: getTotalReductions(data, month),
    grossProfit: getGrossProfit(data, month),
    expenses: getTotalExpenses(data, month),
    operatingProfit: getOperatingProfit(data, month),
    taxes: getTotalTaxes(data, month),
    netProfit: getNetProfit(data, month),
  }));
};
