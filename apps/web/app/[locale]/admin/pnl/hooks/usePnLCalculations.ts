// apps/web/app/[locale]/admin/pnl/hooks/usePnLCalculations.ts
// Description: Hook providing all P&L calculations based on data
// Last modified: 2025-12-19

'use client';

import { useMemo, useCallback } from 'react';
import type { PnLData, Product, ProductCategory, ExpenseCategory } from '../types';
import * as calc from '../utils/calculations';
import { MONTH_KEYS } from '../constants';

type UsePnLCalculationsProps = {
  data: PnLData | null;
};

export function usePnLCalculations({ data }: UsePnLCalculationsProps) {
  // Transaction calculations
  const getTransactionsCount = useCallback(
    (product: Product, month: string) => calc.getTransactionsCount(product, month),
    []
  );

  const getTransactionsRevenue = useCallback(
    (product: Product, month: string) => calc.getTransactionsRevenue(product, month),
    []
  );

  const getCalculatedDiscounts = useCallback(
    (month: string) => calc.getCalculatedDiscounts(data, month),
    [data]
  );

  // Revenue calculations
  const getProductRevenue = useCallback(
    (product: Product, month: string) => calc.getProductRevenue(product, month),
    []
  );

  const getCategoryRevenue = useCallback(
    (cat: ProductCategory, month: string) => calc.getCategoryRevenue(cat, month),
    []
  );

  const getCategoryClients = useCallback(
    (cat: ProductCategory, month: string) => calc.getCategoryClients(cat, month),
    []
  );

  const getTotalRevenue = useCallback(
    (month: string) => calc.getTotalRevenue(data, month),
    [data]
  );

  const getTotalClients = useCallback(
    (month: string) => calc.getTotalClients(data, month),
    [data]
  );

  // Expense calculations
  const getAutoQuantity = useCallback(
    (catId: string, itemId: string, month: string) => calc.getAutoQuantity(data, catId, itemId, month),
    [data]
  );

  const getExpenseItemTotal = useCallback(
    (catId: string, itemId: string, month: string) => calc.getExpenseItemTotal(data, catId, itemId, month),
    [data]
  );

  const getExpenseCategoryTotal = useCallback(
    (cat: ExpenseCategory, month: string) => calc.getExpenseCategoryTotal(data, cat, month),
    [data]
  );

  const getTotalExpenses = useCallback(
    (month: string) => calc.getTotalExpenses(data, month),
    [data]
  );

  // Reductions & taxes
  const getTotalReductions = useCallback(
    (month: string) => calc.getTotalReductions(data, month),
    [data]
  );

  const getTotalTaxes = useCallback(
    (month: string) => calc.getTotalTaxes(data, month),
    [data]
  );

  // Profit calculations
  const getGrossProfit = useCallback(
    (month: string) => calc.getGrossProfit(data, month),
    [data]
  );

  const getOperatingProfit = useCallback(
    (month: string) => calc.getOperatingProfit(data, month),
    [data]
  );

  const getNetProfit = useCallback(
    (month: string) => calc.getNetProfit(data, month),
    [data]
  );

  // YTD calculations
  const ytd = useMemo(() => ({
    revenue: calc.getYTDRevenue(data),
    expenses: calc.getYTDExpenses(data),
    clients: calc.getYTDClients(data),
    reductions: calc.getYTDReductions(data),
    grossProfit: calc.getYTDGrossProfit(data),
    operatingProfit: calc.getYTDOperatingProfit(data),
    taxes: calc.getYTDTaxes(data),
    netProfit: calc.getYTDNetProfit(data),
  }), [data]);

  // Chart data
  const chartData = useMemo(() => calc.getChartData(data), [data]);

  // Expense item helpers
  const getExpenseItem = useCallback(
    (catId: string, itemId: string) => {
      const cat = data?.expenseCategories.find((c) => c.id === catId);
      return cat?.items.find((i) => i.id === itemId);
    },
    [data]
  );

  const getExpenseItemLabel = useCallback(
    (catId: string, itemId: string): string => {
      const cat = data?.expenseCategories.find((c) => c.id === catId);
      const item = cat?.items.find((i) => i.id === itemId);
      return item ? `${cat?.label} → ${item.label}` : 'Unknown';
    },
    [data]
  );

  // Get discounted transactions for a month
  const getDiscountedTransactions = useCallback(
    (month: string) => {
      if (!data?.productCategories) return [];
      const result: Array<{
        catId: string;
        catName: string;
        productId: string;
        productName: string;
        transaction: { id: string; amount: number; discount?: number; clientName: string };
      }> = [];

      data.productCategories.forEach((cat) => {
        cat.products.forEach((product) => {
          const txs = product.transactions?.[month] || [];
          txs.forEach((tx) => {
            if (tx.discount && tx.discount > 0) {
              result.push({
                catId: cat.id,
                catName: cat.label,
                productId: product.id,
                productName: product.label,
                transaction: tx,
              });
            }
          });
        });
      });
      return result;
    },
    [data]
  );

  return {
    // Transaction
    getTransactionsCount,
    getTransactionsRevenue,
    getCalculatedDiscounts,
    getDiscountedTransactions,
    // Revenue
    getProductRevenue,
    getCategoryRevenue,
    getCategoryClients,
    getTotalRevenue,
    getTotalClients,
    // Expenses
    getAutoQuantity,
    getExpenseItemTotal,
    getExpenseCategoryTotal,
    getTotalExpenses,
    getExpenseItem,
    getExpenseItemLabel,
    // Reductions & taxes
    getTotalReductions,
    getTotalTaxes,
    // Profit
    getGrossProfit,
    getOperatingProfit,
    getNetProfit,
    // YTD
    ytd,
    getYTDRevenue: () => ytd.revenue,
    getYTDExpenses: () => ytd.expenses,
    getYTDClients: () => ytd.clients,
    getYTDReductions: () => ytd.reductions,
    getYTDGrossProfit: () => ytd.grossProfit,
    getYTDOperatingProfit: () => ytd.operatingProfit,
    getYTDTaxes: () => ytd.taxes,
    getYTDNetProfit: () => ytd.netProfit,
    // Chart
    chartData,
  };
}
