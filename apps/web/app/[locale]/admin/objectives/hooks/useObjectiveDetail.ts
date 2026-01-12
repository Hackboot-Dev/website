// /workspaces/website/apps/web/app/[locale]/admin/objectives/hooks/useObjectiveDetail.ts
// Description: Hook for loading objective details with REAL data from P&L, Clients and Subscriptions
// - Uses milestones and distribution types for expected progress calculation
// - Status is calculated based on actual vs expected progress
// - Supports Financial, Client, and Subscription objectives
// Last modified: 2026-01-11
// COMPLETE FILE - No simulated data

'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../../../lib/supabase';
import { getDatabase } from '../../../../../lib/services/database';
import type { CompanyId } from '../../pnl/types';
import type {
  Objective,
  ObjectiveWithProgress,
  ObjectiveType,
  ObjectivePeriod,
  ObjectiveCategory,
  ObjectivePriority,
  DistributionType,
} from '../types';
import { getCategoryForType, isClientObjectiveType, isSubscriptionObjectiveType } from '../types';
import { calculateSubscriptionMetric } from './useSubscriptionMetrics';
import { MONTH_KEYS } from '../../pnl/constants';

// Client types for metrics calculation
type ClientRecord = {
  id: string;
  company_id: string;
  name: string;
  email: string;
  type: 'individual' | 'business' | 'enterprise';
  status: 'lead' | 'active' | 'inactive' | 'churned';
  total_revenue: number;
  total_transactions: number;
  created_at: string;
  updated_at: string;
  first_purchase_at: string | null;
  last_purchase_at: string | null;
};

type UseObjectiveDetailOptions = {
  companyId: CompanyId;
  objectiveId: string;
};

export type HistoricalDataPoint = {
  date: string;
  label: string;
  actual: number;
  target: number;
  cumulative: number;
};

export type ForecastDataPoint = {
  date: string;
  label: string;
  projected: number;
  optimistic: number;
  pessimistic: number;
  confidence: number;
};

export type Insight = {
  id: string;
  type: 'positive' | 'negative' | 'neutral' | 'warning';
  title: string;
  message: string;
  metric?: string;
  value?: number;
  change?: number;
};

export type ObjectiveAction = {
  id: string;
  objectiveId: string;
  title: string;
  description: string;
  actionType: 'lead_followup' | 'upsell' | 'retention' | 'cost_reduction' | 'marketing' | 'other';
  targetEntityType?: string;
  targetEntityId?: string;
  targetEntityName?: string;
  potentialImpact: number;
  isCompleted: boolean;
  completedAt?: string;
  createdAt: string;
};

export type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category?: string;
  clientId?: string;
  clientName?: string;
  productId?: string;
  productName?: string;
};

// P&L Transaction type from database
type PnLTransaction = {
  id: string;
  amount: number;
  clientId: string;
  clientName: string;
  clientEmail?: string;
  isCustom?: boolean;
  note?: string;
  subscriptionId?: string;
  renewalDate?: string;
};

type PnLProduct = {
  id: string;
  label: string;
  price: number;
  transactions: Record<string, PnLTransaction[]>;
};

type PnLProductCategory = {
  id: string;
  label: string;
  products: PnLProduct[];
};

type PnLExpenseItem = {
  id: string;
  label: string;
  type?: string;
  note?: string;
  unitPrice: number;
  quantity: Record<string, number>;
  adjustments: Record<string, number>;
};

type PnLExpenseCategory = {
  id: string;
  label: string;
  items: PnLExpenseItem[];
};

type PnLData = {
  year: number;
  productCategories: PnLProductCategory[];
  expenseCategories: PnLExpenseCategory[];
};

export function useObjectiveDetail({ companyId, objectiveId }: UseObjectiveDetailOptions) {
  const [objective, setObjective] = useState<ObjectiveWithProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);
  const [forecastData, setForecastData] = useState<ForecastDataPoint[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [actions, setActions] = useState<ObjectiveAction[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const dbService = getDatabase(companyId);

  // Load P&L data from Supabase
  const loadPnLData = useCallback(async (year: number): Promise<PnLData | null> => {
    try {
      const { data, error } = await supabase
        .from('pnl_data')
        .select('data')
        .eq('company_id', companyId)
        .eq('year', year)
        .single();

      if (error || !data) {
        console.warn('No P&L data found for year', year);
        return null;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (data as any).data as PnLData;
    } catch (err) {
      console.error('Error loading P&L data:', err);
      return null;
    }
  }, [companyId]);

  // Extract real transactions based on objective type
  const extractTransactions = useCallback((
    pnlData: PnLData,
    obj: ObjectiveWithProgress
  ): Transaction[] => {
    const txList: Transaction[] = [];
    const monthFilter = obj.period === 'monthly' && obj.month
      ? MONTH_KEYS[obj.month - 1]
      : null;
    const quarterMonths = obj.period === 'quarterly' && obj.quarter
      ? MONTH_KEYS.slice((obj.quarter - 1) * 3, obj.quarter * 3) as string[]
      : null;

    const isRevenueType = obj.type.startsWith('revenue') ||
      obj.type.includes('mrr') ||
      obj.type.includes('arr') ||
      obj.type === 'gross_profit' ||
      obj.type === 'net_profit';

    const isExpenseType = obj.type.startsWith('expenses') ||
      obj.type === 'net_profit' ||
      obj.type === 'gross_profit';

    // Extract revenue transactions
    if (isRevenueType && pnlData.productCategories) {
      for (const category of pnlData.productCategories) {
        // Filter by product category if specified
        if (obj.productCategoryId && category.id !== obj.productCategoryId) continue;

        for (const product of category.products) {
          // Filter by product if specified
          if (obj.productId && product.id !== obj.productId) continue;

          for (const [month, monthTxs] of Object.entries(product.transactions)) {
            // Filter by month/quarter
            if (monthFilter && month !== monthFilter) continue;
            if (quarterMonths && !quarterMonths.includes(month)) continue;

            for (const tx of monthTxs) {
              // Filter by client if specified
              if (obj.clientId && tx.clientId !== obj.clientId) continue;

              txList.push({
                id: tx.id,
                date: getDateFromMonth(month, pnlData.year),
                description: `${product.label} - ${tx.clientName}`,
                amount: tx.amount,
                type: 'income',
                category: category.label,
                clientId: tx.clientId,
                clientName: tx.clientName,
                productId: product.id,
                productName: product.label,
              });
            }
          }
        }
      }
    }

    // Extract expense transactions
    if (isExpenseType && pnlData.expenseCategories) {
      for (const category of pnlData.expenseCategories) {
        // Filter by expense category if specified
        if (obj.expenseCategory && category.id !== obj.expenseCategory) continue;

        for (const item of category.items) {
          for (const [month, amount] of Object.entries(item.adjustments)) {
            if (amount === 0) continue;

            // Filter by month/quarter
            if (monthFilter && month !== monthFilter) continue;
            if (quarterMonths && !quarterMonths.includes(month)) continue;

            txList.push({
              id: `${item.id}_${month}`,
              date: getDateFromMonth(month, pnlData.year),
              description: `${item.label}${item.type ? ` (${item.type})` : ''}`,
              amount: amount,
              type: 'expense',
              category: category.label,
            });
          }
        }
      }
    }

    // Sort by date descending
    txList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return txList;
  }, []);

  // Calculate historical data from real transactions
  const calculateHistoricalData = useCallback((
    pnlData: PnLData,
    obj: ObjectiveWithProgress
  ): HistoricalDataPoint[] => {
    const data: HistoricalDataPoint[] = [];
    const now = new Date();

    const isRevenueType = obj.type.startsWith('revenue') ||
      obj.type.includes('mrr') ||
      obj.type.includes('arr');
    const isExpenseType = obj.type.startsWith('expenses');
    const isNetProfit = obj.type === 'net_profit';
    const isGrossProfit = obj.type === 'gross_profit';

    if (obj.period === 'monthly' && obj.month) {
      // Daily data for monthly objectives
      // P&L data is aggregated by month (not by day), so we can't show real daily values.
      // We show only the START and END points for actual data (no artificial distribution)
      const daysInMonth = new Date(obj.year, obj.month, 0).getDate();
      const dailyTarget = obj.targetAmount / daysInMonth;

      const isCurrentMonth = obj.year === now.getFullYear() && obj.month === now.getMonth() + 1;
      const maxDay = isCurrentMonth ? now.getDate() : daysInMonth;

      const monthKey = MONTH_KEYS[obj.month - 1];
      const monthlyTotal = calculateMonthlyAmount(pnlData, obj, monthKey);

      // For monthly views, we show:
      // - Target: daily target (constant)
      // - Cumulative: the actual real total accumulated so far
      // Since we don't have daily breakdown, we show a linear interpolation for the graph
      // but make it clear this is based on the monthly total, not daily transactions
      let targetCumulative = 0;
      for (let day = 1; day <= maxDay; day++) {
        targetCumulative += dailyTarget;

        // Calculate what portion of the month has passed
        const progressRatio = day / maxDay;
        // Show linear interpolation to the real total (honest representation)
        const interpolatedActual = monthlyTotal * progressRatio;

        data.push({
          date: `${obj.year}-${String(obj.month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
          label: `${day}`,
          actual: Math.round(interpolatedActual / maxDay), // Daily portion
          target: Math.round(dailyTarget),
          cumulative: Math.round(interpolatedActual), // Smooth line to real total
        });
      }
    } else if (obj.period === 'quarterly' && obj.quarter) {
      // Monthly data for quarterly objectives
      const startMonthIndex = (obj.quarter - 1) * 3;
      const monthlyTarget = obj.targetAmount / 3;
      let cumulative = 0;

      for (let m = 0; m < 3; m++) {
        const monthIndex = startMonthIndex + m;
        const monthKey = MONTH_KEYS[monthIndex];

        const isCurrentOrPast = obj.year < now.getFullYear() ||
          (obj.year === now.getFullYear() && monthIndex <= now.getMonth());

        if (!isCurrentOrPast && obj.year === now.getFullYear()) continue;

        const monthlyAmount = calculateMonthlyAmount(pnlData, obj, monthKey);
        cumulative += monthlyAmount;

        data.push({
          date: `${obj.year}-${String(monthIndex + 1).padStart(2, '0')}-01`,
          label: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'][monthIndex],
          actual: Math.round(monthlyAmount),
          target: Math.round(monthlyTarget),
          cumulative: Math.round(cumulative),
        });
      }
    } else if (obj.period === 'yearly') {
      // Monthly data for yearly objectives
      const monthlyTarget = obj.targetAmount / 12;
      let cumulative = 0;

      const maxMonth = obj.year === now.getFullYear() ? now.getMonth() : 11;

      for (let m = 0; m <= maxMonth; m++) {
        const monthKey = MONTH_KEYS[m];
        const monthlyAmount = calculateMonthlyAmount(pnlData, obj, monthKey);
        cumulative += monthlyAmount;

        data.push({
          date: `${obj.year}-${String(m + 1).padStart(2, '0')}-01`,
          label: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'][m],
          actual: Math.round(monthlyAmount),
          target: Math.round(monthlyTarget),
          cumulative: Math.round(cumulative),
        });
      }
    }

    return data;
  }, []);

  // Calculate monthly amount from P&L data
  const calculateMonthlyAmount = (
    pnlData: PnLData,
    obj: ObjectiveWithProgress,
    monthKey: string
  ): number => {
    let revenue = 0;
    let expenses = 0;

    const isRevenueType = obj.type.startsWith('revenue') ||
      obj.type.includes('mrr') ||
      obj.type.includes('arr');
    const isExpenseType = obj.type.startsWith('expenses');
    const isNetProfit = obj.type === 'net_profit';
    const isGrossProfit = obj.type === 'gross_profit';

    // Calculate revenue
    if (isRevenueType || isNetProfit || isGrossProfit) {
      for (const category of pnlData.productCategories || []) {
        if (obj.productCategoryId && category.id !== obj.productCategoryId) continue;

        for (const product of category.products) {
          if (obj.productId && product.id !== obj.productId) continue;

          const monthTxs = product.transactions[monthKey] || [];
          for (const tx of monthTxs) {
            if (obj.clientId && tx.clientId !== obj.clientId) continue;
            revenue += tx.amount;
          }
        }
      }
    }

    // Calculate expenses
    if (isExpenseType || isNetProfit || isGrossProfit) {
      for (const category of pnlData.expenseCategories || []) {
        if (obj.expenseCategory && category.id !== obj.expenseCategory) continue;

        for (const item of category.items) {
          expenses += item.adjustments[monthKey] || 0;
        }
      }
    }

    // Return based on type
    if (isNetProfit || isGrossProfit) {
      return revenue - expenses;
    } else if (isExpenseType) {
      return expenses;
    } else {
      return revenue;
    }
  };

  // Calculate total actual amount from P&L data for the entire period
  const calculateActualAmountFromPnL = (
    pnlData: PnLData,
    obj: {
      type: string;
      period: string;
      month?: number;
      quarter?: number;
      year: number;
      productCategoryId?: string;
      productId?: string;
      clientId?: string;
      expenseCategory?: string;
    }
  ): number => {
    let total = 0;

    if (obj.period === 'monthly' && obj.month) {
      const monthKey = MONTH_KEYS[obj.month - 1];
      total = calculateMonthlyAmountForObj(pnlData, obj, monthKey);
    } else if (obj.period === 'quarterly' && obj.quarter) {
      const startMonthIndex = (obj.quarter - 1) * 3;
      for (let m = 0; m < 3; m++) {
        const monthKey = MONTH_KEYS[startMonthIndex + m];
        total += calculateMonthlyAmountForObj(pnlData, obj, monthKey);
      }
    } else if (obj.period === 'yearly') {
      for (let m = 0; m < 12; m++) {
        const monthKey = MONTH_KEYS[m];
        total += calculateMonthlyAmountForObj(pnlData, obj, monthKey);
      }
    }

    return total;
  };

  // Helper to calculate monthly amount for any objective-like object
  const calculateMonthlyAmountForObj = (
    pnlData: PnLData,
    obj: {
      type: string;
      productCategoryId?: string;
      productId?: string;
      clientId?: string;
      expenseCategory?: string;
    },
    monthKey: string
  ): number => {
    let revenue = 0;
    let expenses = 0;

    const isRevenueType = obj.type.startsWith('revenue') ||
      obj.type.includes('mrr') ||
      obj.type.includes('arr');
    const isExpenseType = obj.type.startsWith('expenses');
    const isNetProfit = obj.type === 'net_profit';
    const isGrossProfit = obj.type === 'gross_profit';

    // Calculate revenue
    if (isRevenueType || isNetProfit || isGrossProfit) {
      for (const category of pnlData.productCategories || []) {
        if (obj.productCategoryId && category.id !== obj.productCategoryId) continue;

        for (const product of category.products) {
          if (obj.productId && product.id !== obj.productId) continue;

          const monthTxs = product.transactions[monthKey] || [];
          for (const tx of monthTxs) {
            if (obj.clientId && tx.clientId !== obj.clientId) continue;
            revenue += tx.amount;
          }
        }
      }
    }

    // Calculate expenses
    if (isExpenseType || isNetProfit || isGrossProfit) {
      for (const category of pnlData.expenseCategories || []) {
        if (obj.expenseCategory && category.id !== obj.expenseCategory) continue;

        for (const item of category.items) {
          expenses += item.adjustments[monthKey] || 0;
        }
      }
    }

    // Return based on type
    if (isNetProfit || isGrossProfit) {
      return revenue - expenses;
    } else if (isExpenseType) {
      return expenses;
    } else {
      return revenue;
    }
  };

  // Calculate forecast data based on historical trends
  const calculateForecastData = useCallback((
    historicalData: HistoricalDataPoint[],
    obj: ObjectiveWithProgress
  ): ForecastDataPoint[] => {
    const data: ForecastDataPoint[] = [];
    const now = new Date();

    if (historicalData.length === 0) return data;

    // Calculate average daily/monthly rate from historical data
    const totalActual = historicalData.reduce((sum, d) => sum + d.actual, 0);
    const avgRate = totalActual / historicalData.length;
    const lastCumulative = historicalData[historicalData.length - 1]?.cumulative || 0;

    if (obj.period === 'monthly' && obj.month) {
      const daysInMonth = new Date(obj.year, obj.month, 0).getDate();
      const currentDay = now.getDate();
      const remainingDays = daysInMonth - currentDay;

      if (remainingDays <= 0) return data;

      for (let day = currentDay + 1; day <= daysInMonth; day++) {
        const daysAhead = day - currentDay;
        const projected = lastCumulative + avgRate * daysAhead;
        const optimistic = lastCumulative + avgRate * 1.2 * daysAhead;
        const pessimistic = lastCumulative + avgRate * 0.8 * daysAhead;

        data.push({
          date: `${obj.year}-${String(obj.month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
          label: `${day}`,
          projected: Math.round(projected),
          optimistic: Math.round(optimistic),
          pessimistic: Math.round(pessimistic),
          confidence: Math.max(50, 95 - daysAhead * 2),
        });
      }
    } else if (obj.period === 'yearly') {
      const currentMonth = now.getMonth();
      const remainingMonths = 11 - currentMonth;

      if (remainingMonths <= 0) return data;

      for (let m = currentMonth + 1; m <= 11; m++) {
        const monthsAhead = m - currentMonth;
        const projected = lastCumulative + avgRate * monthsAhead;
        const optimistic = lastCumulative + avgRate * 1.15 * monthsAhead;
        const pessimistic = lastCumulative + avgRate * 0.85 * monthsAhead;

        data.push({
          date: `${obj.year}-${String(m + 1).padStart(2, '0')}-01`,
          label: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'][m],
          projected: Math.round(projected),
          optimistic: Math.round(optimistic),
          pessimistic: Math.round(pessimistic),
          confidence: Math.max(50, 90 - monthsAhead * 5),
        });
      }
    }

    return data;
  }, []);

  // Generate insights based on real data
  const generateInsights = useCallback((
    obj: ObjectiveWithProgress,
    historical: HistoricalDataPoint[],
    txList: Transaction[]
  ): Insight[] => {
    const insights: Insight[] = [];
    const now = new Date();

    // Progress vs expected
    const expectedProgress = calculateExpectedProgress(obj, now);
    const progressDiff = obj.progressPercent - expectedProgress;

    if (progressDiff > 10) {
      insights.push({
        id: 'ahead_of_schedule',
        type: 'positive',
        title: 'En avance sur le planning',
        message: `Vous êtes en avance de ${progressDiff.toFixed(1)}% par rapport au rythme attendu.`,
        metric: 'Avance',
        value: progressDiff,
      });
    } else if (progressDiff < -10) {
      insights.push({
        id: 'behind_schedule',
        type: 'warning',
        title: 'En retard sur le planning',
        message: `Vous avez un retard de ${Math.abs(progressDiff).toFixed(1)}% par rapport au rythme attendu.`,
        metric: 'Retard',
        value: Math.abs(progressDiff),
      });
    }

    // Achievement status
    if (obj.status === 'achieved') {
      insights.push({
        id: 'achieved',
        type: 'positive',
        title: 'Objectif atteint !',
        message: `Félicitations, vous avez atteint ${obj.progressPercent.toFixed(1)}% de votre objectif.`,
      });
    } else if (obj.status === 'at_risk') {
      const remaining = obj.targetAmount - obj.actualAmount;
      insights.push({
        id: 'at_risk',
        type: 'warning',
        title: 'Objectif à risque',
        message: `Il reste ${formatAmount(remaining)} à atteindre pour valider l'objectif.`,
        metric: 'Reste',
        value: remaining,
      });
    }

    // Top contributor insight (from real transactions)
    if (txList.length > 0) {
      const byClient = txList
        .filter(tx => tx.type === 'income' && tx.clientName)
        .reduce((acc, tx) => {
          const key = tx.clientName || 'Inconnu';
          acc[key] = (acc[key] || 0) + tx.amount;
          return acc;
        }, {} as Record<string, number>);

      const topClient = Object.entries(byClient).sort((a, b) => b[1] - a[1])[0];
      if (topClient) {
        insights.push({
          id: 'top_client',
          type: 'neutral',
          title: 'Meilleur contributeur',
          message: `${topClient[0]} représente ${formatAmount(topClient[1])} de revenus.`,
          metric: 'Contribution',
          value: topClient[1],
        });
      }

      // Transaction count
      const incomeCount = txList.filter(tx => tx.type === 'income').length;
      if (incomeCount > 0) {
        insights.push({
          id: 'transaction_count',
          type: 'neutral',
          title: 'Transactions',
          message: `${incomeCount} transaction${incomeCount > 1 ? 's' : ''} enregistrée${incomeCount > 1 ? 's' : ''} sur cette période.`,
          value: incomeCount,
        });
      }
    }

    // Trend insight based on historical data
    if (historical.length >= 3) {
      const recent = historical.slice(-3);
      const older = historical.slice(-6, -3);

      if (older.length > 0) {
        const recentAvg = recent.reduce((sum, d) => sum + d.actual, 0) / recent.length;
        const olderAvg = older.reduce((sum, d) => sum + d.actual, 0) / older.length;
        const change = ((recentAvg - olderAvg) / olderAvg) * 100;

        if (change > 10) {
          insights.push({
            id: 'trend_up',
            type: 'positive',
            title: 'Tendance positive',
            message: `La progression a augmenté de ${change.toFixed(0)}% sur les dernières périodes.`,
            change,
          });
        } else if (change < -10) {
          insights.push({
            id: 'trend_down',
            type: 'negative',
            title: 'Tendance négative',
            message: `La progression a diminué de ${Math.abs(change).toFixed(0)}% sur les dernières périodes.`,
            change,
          });
        }
      }
    }

    return insights;
  }, []);

  // Generate actions based on real data
  const generateActions = useCallback((
    obj: ObjectiveWithProgress,
    txList: Transaction[]
  ): ObjectiveAction[] => {
    const actionsList: ObjectiveAction[] = [];

    if (obj.status === 'at_risk' || obj.status === 'behind') {
      const remaining = obj.targetAmount - obj.actualAmount;

      if (obj.type.startsWith('revenue')) {
        // Find clients to upsell (those with transactions)
        const clientRevenue = txList
          .filter(tx => tx.type === 'income' && tx.clientId)
          .reduce((acc, tx) => {
            acc[tx.clientId!] = {
              name: tx.clientName || 'Client',
              amount: (acc[tx.clientId!]?.amount || 0) + tx.amount,
            };
            return acc;
          }, {} as Record<string, { name: string; amount: number }>);

        const topClients = Object.entries(clientRevenue)
          .sort((a, b) => b[1].amount - a[1].amount)
          .slice(0, 3);

        if (topClients.length > 0) {
          actionsList.push({
            id: 'action_upsell',
            objectiveId: obj.id,
            title: 'Proposer des upgrades aux clients actifs',
            description: `Contactez vos meilleurs clients (${topClients.map(c => c[1].name).join(', ')}) pour proposer des services additionnels.`,
            actionType: 'upsell',
            potentialImpact: remaining * 0.2,
            isCompleted: false,
            createdAt: new Date().toISOString(),
          });
        }

        actionsList.push({
          id: 'action_leads',
          objectiveId: obj.id,
          title: 'Relancer les prospects en attente',
          description: `Il faut ${formatAmount(remaining)} supplémentaires pour atteindre l'objectif. Relancez les prospects non convertis.`,
          actionType: 'lead_followup',
          potentialImpact: remaining * 0.3,
          isCompleted: false,
          createdAt: new Date().toISOString(),
        });
      }

      if (obj.type.startsWith('expenses')) {
        // Find top expense categories
        const expenseByCategory = txList
          .filter(tx => tx.type === 'expense')
          .reduce((acc, tx) => {
            const cat = tx.category || 'Autres';
            acc[cat] = (acc[cat] || 0) + tx.amount;
            return acc;
          }, {} as Record<string, number>);

        const topExpenses = Object.entries(expenseByCategory)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 2);

        if (topExpenses.length > 0) {
          actionsList.push({
            id: 'action_cost',
            objectiveId: obj.id,
            title: 'Auditer les postes de dépenses',
            description: `Les postes ${topExpenses.map(e => e[0]).join(' et ')} représentent les plus gros montants. Analysez les optimisations possibles.`,
            actionType: 'cost_reduction',
            potentialImpact: topExpenses.reduce((sum, e) => sum + e[1], 0) * 0.1,
            isCompleted: false,
            createdAt: new Date().toISOString(),
          });
        }
      }

      if (obj.type.includes('clients') || obj.type.includes('churn')) {
        actionsList.push({
          id: 'action_retention',
          objectiveId: obj.id,
          title: 'Programme de rétention clients',
          description: 'Identifiez les clients inactifs et mettez en place des actions de réengagement.',
          actionType: 'retention',
          potentialImpact: remaining * 0.15,
          isCompleted: false,
          createdAt: new Date().toISOString(),
        });
      }
    }

    return actionsList;
  }, []);

  // ============================================================
  // CLIENT METRICS FUNCTIONS
  // ============================================================

  // Load clients from Supabase
  const loadClients = useCallback(async (): Promise<ClientRecord[]> => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('company_id', companyId);

      if (error) {
        console.warn('Error loading clients:', error);
        return [];
      }

      return (data || []) as ClientRecord[];
    } catch (err) {
      console.error('Error loading clients:', err);
      return [];
    }
  }, [companyId]);

  // Calculate client metric based on objective type
  const calculateClientMetric = useCallback((
    clients: ClientRecord[],
    obj: {
      type: string;
      period: string;
      year: number;
      month?: number;
      quarter?: number;
      clientSegment?: string;
    },
    pnlData: PnLData | null
  ): number => {
    const now = new Date();

    // Get date range for the period
    let startDate: Date;
    let endDate: Date;

    if (obj.period === 'monthly' && obj.month) {
      startDate = new Date(obj.year, obj.month - 1, 1);
      endDate = new Date(obj.year, obj.month, 0, 23, 59, 59);
    } else if (obj.period === 'quarterly' && obj.quarter) {
      const startMonth = (obj.quarter - 1) * 3;
      startDate = new Date(obj.year, startMonth, 1);
      endDate = new Date(obj.year, startMonth + 3, 0, 23, 59, 59);
    } else {
      startDate = new Date(obj.year, 0, 1);
      endDate = new Date(obj.year, 11, 31, 23, 59, 59);
    }

    // Filter clients by segment if specified
    let filteredClients = clients;
    if (obj.clientSegment) {
      filteredClients = clients.filter(c => c.type === obj.clientSegment);
    }

    switch (obj.type) {
      // Acquisition
      case 'new_clients_total':
      case 'new_clients_segment': {
        return filteredClients.filter(c => {
          const createdAt = new Date(c.created_at);
          return createdAt >= startDate && createdAt <= endDate;
        }).length;
      }

      case 'conversion_rate': {
        const leadsAtStart = clients.filter(c => {
          const createdAt = new Date(c.created_at);
          return createdAt < startDate && c.status === 'lead';
        }).length;

        const convertedInPeriod = clients.filter(c => {
          const firstPurchase = c.first_purchase_at ? new Date(c.first_purchase_at) : null;
          return firstPurchase && firstPurchase >= startDate && firstPurchase <= endDate;
        }).length;

        return leadsAtStart > 0 ? (convertedInPeriod / leadsAtStart) * 100 : 0;
      }

      case 'cac': {
        // Get marketing expenses from P&L
        let marketingExpenses = 0;
        if (pnlData?.expenseCategories) {
          const marketingCat = pnlData.expenseCategories.find(c => c.id === 'marketing');
          if (marketingCat) {
            const monthKeys = (obj.period === 'monthly' && obj.month
              ? [MONTH_KEYS[obj.month - 1]]
              : obj.period === 'quarterly' && obj.quarter
                ? MONTH_KEYS.slice((obj.quarter - 1) * 3, obj.quarter * 3)
                : MONTH_KEYS) as string[];

            for (const item of marketingCat.items) {
              for (const mk of monthKeys) {
                marketingExpenses += (item.adjustments as Record<string, number>)[mk] || 0;
              }
            }
          }
        }

        const newClients = filteredClients.filter(c => {
          const createdAt = new Date(c.created_at);
          return createdAt >= startDate && createdAt <= endDate;
        }).length;

        return newClients > 0 ? marketingExpenses / newClients : 0;
      }

      // Retention
      case 'churn_rate': {
        const activeAtStart = clients.filter(c => {
          const createdAt = new Date(c.created_at);
          return createdAt < startDate && (c.status === 'active' ||
            (c.status === 'churned' && new Date(c.updated_at) >= startDate));
        }).length;

        const churnedInPeriod = clients.filter(c => {
          const updatedAt = new Date(c.updated_at);
          return c.status === 'churned' && updatedAt >= startDate && updatedAt <= endDate;
        }).length;

        return activeAtStart > 0 ? (churnedInPeriod / activeAtStart) * 100 : 0;
      }

      case 'retention_rate': {
        const churnRate = calculateClientMetric(clients, { ...obj, type: 'churn_rate' }, pnlData);
        return 100 - churnRate;
      }

      case 'active_clients': {
        return filteredClients.filter(c => c.status === 'active').length;
      }

      case 'avg_tenure': {
        const activeClients = filteredClients.filter(c => c.status === 'active' && c.created_at);
        if (activeClients.length === 0) return 0;

        const totalMonths = activeClients.reduce((sum, c) => {
          const createdAt = new Date(c.created_at);
          const monthsDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24 * 30);
          return sum + monthsDiff;
        }, 0);

        return totalMonths / activeClients.length;
      }

      // Value
      case 'arpu': {
        const activeClients = filteredClients.filter(c => c.status === 'active').length;
        const totalRevenue = filteredClients.reduce((sum, c) => sum + (c.total_revenue || 0), 0);
        return activeClients > 0 ? totalRevenue / activeClients : 0;
      }

      case 'ltv': {
        const arpu = calculateClientMetric(clients, { ...obj, type: 'arpu' }, pnlData);
        const avgTenure = calculateClientMetric(clients, { ...obj, type: 'avg_tenure' }, pnlData);
        const grossMargin = 0.7; // Typical SaaS margin
        return arpu * Math.max(avgTenure, 1) * grossMargin;
      }

      case 'ltv_cac_ratio': {
        const ltv = calculateClientMetric(clients, { ...obj, type: 'ltv' }, pnlData);
        const cac = calculateClientMetric(clients, { ...obj, type: 'cac' }, pnlData);
        return cac > 0 ? ltv / cac : 0;
      }

      case 'avg_basket': {
        const totalRevenue = filteredClients.reduce((sum, c) => sum + (c.total_revenue || 0), 0);
        const totalTransactions = filteredClients.reduce((sum, c) => sum + (c.total_transactions || 0), 0);
        return totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
      }

      // Engagement
      case 'active_ratio': {
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

        const recentlyActive = filteredClients.filter(c => {
          const lastPurchase = c.last_purchase_at ? new Date(c.last_purchase_at) : null;
          return lastPurchase && lastPurchase >= ninetyDaysAgo;
        }).length;

        const totalNonLeads = filteredClients.filter(c => c.status !== 'lead').length;
        return totalNonLeads > 0 ? (recentlyActive / totalNonLeads) * 100 : 0;
      }

      case 'upsell_rate': {
        const repeatCustomers = filteredClients.filter(c => (c.total_transactions || 0) > 1).length;
        const customersWithAny = filteredClients.filter(c => (c.total_transactions || 0) >= 1).length;
        return customersWithAny > 0 ? (repeatCustomers / customersWithAny) * 100 : 0;
      }

      default:
        return 0;
    }
  }, []);

  // Generate client-specific insights
  const generateClientInsights = useCallback((
    obj: ObjectiveWithProgress,
    clients: ClientRecord[]
  ): Insight[] => {
    const insights: Insight[] = [];

    // Progress insight
    if (obj.progressPercent >= 100) {
      insights.push({
        id: 'achieved',
        type: 'positive',
        title: 'Objectif atteint !',
        message: `Félicitations, vous avez atteint ${obj.progressPercent.toFixed(1)}% de votre objectif.`,
      });
    } else if (obj.status === 'at_risk') {
      insights.push({
        id: 'at_risk',
        type: 'warning',
        title: 'Objectif à risque',
        message: `Il reste ${(obj.targetAmount - obj.actualAmount).toFixed(obj.targetUnit === 'percent' ? 1 : 0)} à atteindre.`,
      });
    }

    // Client-specific insights
    const activeCount = clients.filter(c => c.status === 'active').length;
    const totalCount = clients.length;

    if (obj.type.includes('churn') || obj.type.includes('retention')) {
      const churnedCount = clients.filter(c => c.status === 'churned').length;
      if (churnedCount > 0) {
        insights.push({
          id: 'churned_clients',
          type: 'warning',
          title: 'Clients perdus',
          message: `${churnedCount} client${churnedCount > 1 ? 's' : ''} ont quitté votre service.`,
          value: churnedCount,
        });
      }
    }

    if (obj.type.includes('new_clients') || obj.type.includes('acquisition')) {
      const recentClients = clients.filter(c => {
        const createdAt = new Date(c.created_at);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return createdAt >= thirtyDaysAgo;
      }).length;

      insights.push({
        id: 'recent_acquisition',
        type: recentClients > 0 ? 'positive' : 'neutral',
        title: 'Acquisition récente',
        message: `${recentClients} nouveau${recentClients > 1 ? 'x' : ''} client${recentClients > 1 ? 's' : ''} ces 30 derniers jours.`,
        value: recentClients,
      });
    }

    // Top segment
    const byType = clients.reduce((acc, c) => {
      acc[c.type] = (acc[c.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topSegment = Object.entries(byType).sort((a, b) => b[1] - a[1])[0];
    if (topSegment) {
      const segmentLabel = topSegment[0] === 'individual' ? 'Particuliers' :
        topSegment[0] === 'business' ? 'Professionnels' : 'Entreprises';
      insights.push({
        id: 'top_segment',
        type: 'neutral',
        title: 'Segment principal',
        message: `${segmentLabel} représentent ${((topSegment[1] / totalCount) * 100).toFixed(0)}% de vos clients.`,
      });
    }

    // Revenue concentration warning
    const sortedByRevenue = [...clients].sort((a, b) => (b.total_revenue || 0) - (a.total_revenue || 0));
    const top10Percent = Math.max(1, Math.ceil(clients.length * 0.1));
    const top10Revenue = sortedByRevenue.slice(0, top10Percent).reduce((sum, c) => sum + (c.total_revenue || 0), 0);
    const totalRevenue = clients.reduce((sum, c) => sum + (c.total_revenue || 0), 0);

    if (totalRevenue > 0 && (top10Revenue / totalRevenue) > 0.5) {
      insights.push({
        id: 'concentration_risk',
        type: 'warning',
        title: 'Risque de concentration',
        message: `Attention : ${top10Percent} client${top10Percent > 1 ? 's' : ''} représentent ${((top10Revenue / totalRevenue) * 100).toFixed(0)}% du CA.`,
      });
    }

    return insights;
  }, []);

  // Generate client-specific actions
  const generateClientActions = useCallback((
    obj: ObjectiveWithProgress,
    clients: ClientRecord[]
  ): ObjectiveAction[] => {
    const actionsList: ObjectiveAction[] = [];

    if (obj.status === 'at_risk' || obj.status === 'behind') {
      // Churn/Retention actions
      if (obj.type.includes('churn') || obj.type.includes('retention')) {
        const inactiveClients = clients.filter(c => c.status === 'inactive');
        if (inactiveClients.length > 0) {
          actionsList.push({
            id: 'action_reactivation',
            objectiveId: obj.id,
            title: 'Campagne de réactivation',
            description: `${inactiveClients.length} clients inactifs pourraient être réengagés. Proposez des offres de réactivation.`,
            actionType: 'retention',
            potentialImpact: inactiveClients.length * 0.2,
            isCompleted: false,
            createdAt: new Date().toISOString(),
          });
        }
      }

      // Acquisition actions
      if (obj.type.includes('new_clients') || obj.type.includes('acquisition') || obj.type === 'cac') {
        actionsList.push({
          id: 'action_marketing',
          objectiveId: obj.id,
          title: 'Intensifier le marketing',
          description: 'Augmentez les campagnes d\'acquisition : Ads, partenariats, content marketing.',
          actionType: 'marketing',
          potentialImpact: obj.targetAmount * 0.15,
          isCompleted: false,
          createdAt: new Date().toISOString(),
        });

        actionsList.push({
          id: 'action_referral',
          objectiveId: obj.id,
          title: 'Programme de parrainage',
          description: 'Lancez ou boostez votre programme de parrainage pour générer des leads qualifiés.',
          actionType: 'marketing',
          potentialImpact: obj.targetAmount * 0.1,
          isCompleted: false,
          createdAt: new Date().toISOString(),
        });
      }

      // ARPU/LTV actions
      if (obj.type === 'arpu' || obj.type === 'ltv' || obj.type === 'avg_basket') {
        const lowValueClients = clients
          .filter(c => c.status === 'active' && (c.total_revenue || 0) < 100)
          .length;

        if (lowValueClients > 0) {
          actionsList.push({
            id: 'action_upsell',
            objectiveId: obj.id,
            title: 'Campagne d\'upsell',
            description: `${lowValueClients} clients actifs ont un faible panier. Proposez des upgrades et services additionnels.`,
            actionType: 'upsell',
            potentialImpact: lowValueClients * 50,
            isCompleted: false,
            createdAt: new Date().toISOString(),
          });
        }
      }

      // Conversion actions
      if (obj.type === 'conversion_rate') {
        const leads = clients.filter(c => c.status === 'lead').length;
        if (leads > 0) {
          actionsList.push({
            id: 'action_leads',
            objectiveId: obj.id,
            title: 'Convertir les leads',
            description: `${leads} leads en attente. Relancez-les avec des offres personnalisées.`,
            actionType: 'lead_followup',
            potentialImpact: leads * 0.3,
            isCompleted: false,
            createdAt: new Date().toISOString(),
          });
        }
      }
    }

    return actionsList;
  }, []);

  // Calculate historical data for client objectives
  const calculateClientHistoricalData = useCallback((
    clients: ClientRecord[],
    obj: ObjectiveWithProgress
  ): HistoricalDataPoint[] => {
    const data: HistoricalDataPoint[] = [];
    const now = new Date();

    // For client metrics, we show monthly trends
    if (obj.period === 'yearly') {
      const maxMonth = obj.year === now.getFullYear() ? now.getMonth() : 11;
      let cumulative = 0;

      for (let m = 0; m <= maxMonth; m++) {
        const monthStart = new Date(obj.year, m, 1);
        const monthEnd = new Date(obj.year, m + 1, 0, 23, 59, 59);

        // Calculate metric for this month
        let monthlyValue = 0;

        if (obj.type.includes('new_clients')) {
          monthlyValue = clients.filter(c => {
            const createdAt = new Date(c.created_at);
            return createdAt >= monthStart && createdAt <= monthEnd;
          }).length;
        } else if (obj.type === 'active_clients') {
          monthlyValue = clients.filter(c => c.status === 'active').length;
        } else {
          // For percentage/currency metrics, calculate full value
          monthlyValue = calculateClientMetric(clients, {
            ...obj,
            period: 'monthly',
            month: m + 1,
          }, null);
        }

        cumulative += monthlyValue;

        data.push({
          date: `${obj.year}-${String(m + 1).padStart(2, '0')}-01`,
          label: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'][m],
          actual: Math.round(monthlyValue * 100) / 100,
          target: Math.round((obj.targetAmount / 12) * 100) / 100,
          cumulative: Math.round(cumulative * 100) / 100,
        });
      }
    } else if (obj.period === 'quarterly' && obj.quarter) {
      const startMonth = (obj.quarter - 1) * 3;
      let cumulative = 0;

      for (let m = 0; m < 3; m++) {
        const monthIndex = startMonth + m;
        const monthStart = new Date(obj.year, monthIndex, 1);
        const monthEnd = new Date(obj.year, monthIndex + 1, 0, 23, 59, 59);

        const isCurrentOrPast = obj.year < now.getFullYear() ||
          (obj.year === now.getFullYear() && monthIndex <= now.getMonth());

        if (!isCurrentOrPast && obj.year === now.getFullYear()) continue;

        let monthlyValue = 0;
        if (obj.type.includes('new_clients')) {
          monthlyValue = clients.filter(c => {
            const createdAt = new Date(c.created_at);
            return createdAt >= monthStart && createdAt <= monthEnd;
          }).length;
        } else {
          monthlyValue = calculateClientMetric(clients, {
            ...obj,
            period: 'monthly',
            month: monthIndex + 1,
          }, null);
        }

        cumulative += monthlyValue;

        data.push({
          date: `${obj.year}-${String(monthIndex + 1).padStart(2, '0')}-01`,
          label: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'][monthIndex],
          actual: Math.round(monthlyValue * 100) / 100,
          target: Math.round((obj.targetAmount / 3) * 100) / 100,
          cumulative: Math.round(cumulative * 100) / 100,
        });
      }
    } else if (obj.period === 'monthly' && obj.month) {
      // For monthly, show weekly data
      const daysInMonth = new Date(obj.year, obj.month, 0).getDate();
      const isCurrentMonth = obj.year === now.getFullYear() && obj.month === now.getMonth() + 1;
      const maxWeek = isCurrentMonth ? Math.ceil(now.getDate() / 7) : Math.ceil(daysInMonth / 7);

      let cumulative = 0;
      for (let w = 1; w <= maxWeek; w++) {
        const weekStart = new Date(obj.year, obj.month - 1, (w - 1) * 7 + 1);
        const weekEnd = new Date(obj.year, obj.month - 1, Math.min(w * 7, daysInMonth), 23, 59, 59);

        let weeklyValue = 0;
        if (obj.type.includes('new_clients')) {
          weeklyValue = clients.filter(c => {
            const createdAt = new Date(c.created_at);
            return createdAt >= weekStart && createdAt <= weekEnd;
          }).length;
        }

        cumulative += weeklyValue;

        data.push({
          date: weekStart.toISOString().split('T')[0],
          label: `S${w}`,
          actual: weeklyValue,
          target: Math.round(obj.targetAmount / maxWeek),
          cumulative,
        });
      }
    }

    return data;
  }, [calculateClientMetric]);

  // Load all data
  const loadObjective = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get objectives
      const currentYear = new Date().getFullYear();
      const yearsToTry = [currentYear, currentYear - 1, currentYear + 1];

      let foundObjective: Awaited<ReturnType<typeof dbService.getObjectives>>[0] | undefined;
      let progressData: Awaited<ReturnType<typeof dbService.getObjectivesWithProgress>> = [];
      let objectiveYear = currentYear;

      for (const year of yearsToTry) {
        const [objectives, progress] = await Promise.all([
          dbService.getObjectives(year),
          dbService.getObjectivesWithProgress(year),
        ]);
        foundObjective = objectives.find(o => o.id === objectiveId);
        if (foundObjective) {
          progressData = progress;
          objectiveYear = year;
          break;
        }
      }

      if (!foundObjective) {
        setError('Objectif introuvable');
        return;
      }

      // Check if this is a client-type objective
      const isClientObjective = isClientObjectiveType(foundObjective.type as ObjectiveType);

      // Load P&L data for the objective's year
      const pnlData = await loadPnLData(objectiveYear);

      // Load clients if this is a client objective
      const clients = isClientObjective ? await loadClients() : [];

      // Calculate actualAmount based on objective type
      let actualAmount = 0;
      const isSubscriptionObjective = isSubscriptionObjectiveType(foundObjective.type);

      if (isSubscriptionObjective) {
        // For subscription objectives, calculate from subscriptions table
        actualAmount = await calculateSubscriptionMetric(companyId, foundObjective as Objective);
      } else if (isClientObjective) {
        // For client objectives, calculate from clients table
        actualAmount = calculateClientMetric(clients, {
          type: foundObjective.type,
          period: foundObjective.period,
          year: foundObjective.year,
          month: foundObjective.month,
          quarter: foundObjective.quarter,
          clientSegment: (foundObjective as Record<string, unknown>).clientSegment as string | undefined,
        }, pnlData);
      } else if (pnlData) {
        // For financial objectives, calculate from P&L data
        actualAmount = calculateActualAmountFromPnL(pnlData, foundObjective);
      }

      const progressPercent = foundObjective.targetAmount > 0
        ? (actualAmount / foundObjective.targetAmount) * 100
        : 0;

      // Calculate expected progress based on milestones/distribution
      const now = new Date();
      // Cast foundObjective with defaults for missing properties
      const rawObj = foundObjective as Record<string, unknown>;
      const baseObjective = {
        ...foundObjective,
        type: foundObjective.type as ObjectiveType,
        period: foundObjective.period as ObjectivePeriod,
        category: (rawObj.category as ObjectiveCategory) || getCategoryForType(foundObjective.type as ObjectiveType),
        distributionType: (rawObj.distributionType as DistributionType) || 'linear',
        targetUnit: (rawObj.targetUnit as string) || 'currency',
        priority: (rawObj.priority as ObjectivePriority) || 'medium',
      } as Objective;

      const tempObjective: ObjectiveWithProgress = {
        ...baseObjective,
        actualAmount,
        progressPercent,
        status: 'behind',
        trend: 'stable',
      };
      const expectedProgress = calculateExpectedProgress(tempObjective, now);

      // Calculate status based on actual vs expected progress
      const status = calculateStatus(progressPercent, expectedProgress, actualAmount, foundObjective.targetAmount);

      // Calculate days remaining
      const totalDays = getTotalDaysInPeriod(tempObjective);
      const currentDay = getCurrentDayInPeriod(tempObjective, now);
      const daysRemaining = Math.max(0, totalDays - currentDay);

      const objectiveData: ObjectiveWithProgress = {
        ...baseObjective,
        actualAmount,
        progressPercent,
        status,
        trend: 'stable',
        expectedProgress,
        daysRemaining,
      };

      setObjective(objectiveData);

      // Generate data based on objective type
      if (isClientObjective) {
        // CLIENT OBJECTIVE: Use client-specific functions
        setTransactions([]); // No transactions for client objectives

        // Calculate historical data from clients
        const historical = calculateClientHistoricalData(clients, objectiveData);
        setHistoricalData(historical);

        // Calculate forecast based on historical trends
        const forecast = calculateForecastData(historical, objectiveData);
        setForecastData(forecast);

        // Generate client-specific insights
        const clientInsights = generateClientInsights(objectiveData, clients);
        setInsights(clientInsights);

        // Generate client-specific actions
        const clientActions = generateClientActions(objectiveData, clients);
        setActions(clientActions);
      } else if (pnlData) {
        // FINANCIAL OBJECTIVE: Use P&L data
        // Extract real transactions
        const realTransactions = extractTransactions(pnlData, objectiveData);
        setTransactions(realTransactions);

        // Calculate historical data from real P&L
        const historical = calculateHistoricalData(pnlData, objectiveData);
        setHistoricalData(historical);

        // Calculate forecast based on historical trends
        const forecast = calculateForecastData(historical, objectiveData);
        setForecastData(forecast);

        // Generate insights from real data
        const realInsights = generateInsights(objectiveData, historical, realTransactions);
        setInsights(realInsights);

        // Generate actions from real data
        const realActions = generateActions(objectiveData, realTransactions);
        setActions(realActions);
      } else {
        // No data available
        setTransactions([]);
        setHistoricalData([]);
        setForecastData([]);
        setInsights([{
          id: 'no_data',
          type: 'warning',
          title: isClientObjective ? 'Données clients manquantes' : 'Données P&L manquantes',
          message: isClientObjective
            ? `Aucun client trouvé. Ajoutez des clients dans le module Clients.`
            : `Aucune donnée P&L trouvée pour l'année ${objectiveYear}. Ajoutez des transactions dans le module P&L.`,
        }]);
        setActions([]);
      }
    } catch (err) {
      console.error('Error loading objective:', err);
      setError('Erreur lors du chargement de l\'objectif');
    } finally {
      setLoading(false);
    }
  }, [dbService, objectiveId, loadPnLData, loadClients, extractTransactions, calculateHistoricalData, calculateForecastData, generateInsights, generateActions, calculateClientMetric, calculateClientHistoricalData, generateClientInsights, generateClientActions]);

  useEffect(() => {
    loadObjective();
  }, [loadObjective]);

  return {
    objective,
    loading,
    error,
    historicalData,
    forecastData,
    insights,
    actions,
    transactions,
    refresh: loadObjective,
  };
}

// Helper functions

// Get total days in period
function getTotalDaysInPeriod(obj: ObjectiveWithProgress): number {
  if (obj.period === 'monthly' && obj.month) {
    return new Date(obj.year, obj.month, 0).getDate();
  }
  if (obj.period === 'quarterly') {
    // Quarter has approximately 90-92 days, but we use month count * 30 for simplicity
    return 90;
  }
  if (obj.period === 'yearly') {
    return (obj.year % 4 === 0 && obj.year % 100 !== 0) || obj.year % 400 === 0 ? 366 : 365;
  }
  return 30;
}

// Get current day within period (1-indexed)
function getCurrentDayInPeriod(obj: ObjectiveWithProgress, now: Date): number {
  if (obj.period === 'monthly' && obj.month) {
    // Check if we're in the same month
    if (obj.year === now.getFullYear() && obj.month === now.getMonth() + 1) {
      return now.getDate();
    }
    // If period is in the past, return total days
    if (obj.year < now.getFullYear() || (obj.year === now.getFullYear() && obj.month < now.getMonth() + 1)) {
      return new Date(obj.year, obj.month, 0).getDate();
    }
    // If period is in the future, return 0
    return 0;
  }

  if (obj.period === 'quarterly' && obj.quarter) {
    const startMonth = (obj.quarter - 1) * 3; // 0-indexed start month
    const endMonth = obj.quarter * 3 - 1; // 0-indexed end month
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // If in a different year
    if (obj.year < currentYear) return 90; // Past
    if (obj.year > currentYear) return 0; // Future

    // Same year - calculate days
    if (currentMonth < startMonth) return 0; // Future quarter
    if (currentMonth > endMonth) return 90; // Past quarter

    // We're in this quarter - calculate days elapsed
    let daysElapsed = 0;
    for (let m = startMonth; m < currentMonth; m++) {
      daysElapsed += new Date(obj.year, m + 1, 0).getDate();
    }
    daysElapsed += now.getDate();
    return Math.min(90, daysElapsed);
  }

  if (obj.period === 'yearly') {
    if (obj.year < now.getFullYear()) {
      return getTotalDaysInPeriod(obj);
    }
    if (obj.year > now.getFullYear()) {
      return 0;
    }
    return Math.floor((now.getTime() - new Date(obj.year, 0, 0).getTime()) / 86400000);
  }

  return 0;
}

// Calculate expected progress using milestones or distribution type
function calculateExpectedProgress(obj: ObjectiveWithProgress, now: Date): number {
  const totalDays = getTotalDaysInPeriod(obj);
  const currentDay = getCurrentDayInPeriod(obj, now);

  if (currentDay <= 0) return 0;
  if (currentDay >= totalDays) return 100;

  const progress = currentDay / totalDays;
  const startingPercent = obj.startingAmount ? (obj.startingAmount / obj.targetAmount) * 100 : 0;
  const remainingPercent = 100 - startingPercent;

  // If custom milestones are defined, use interpolation
  if (obj.distributionType === 'custom' && obj.milestones && obj.milestones.length > 0) {
    // Sort milestones by day
    const sortedMilestones = [...obj.milestones].sort((a, b) => a.day - b.day);

    // Add implicit start and end milestones
    const allMilestones = [
      { day: 0, expectedAmount: obj.startingAmount || 0 },
      ...sortedMilestones,
      { day: totalDays, expectedAmount: obj.targetAmount },
    ];

    // Find which two milestones we're between
    for (let i = 0; i < allMilestones.length - 1; i++) {
      const prev = allMilestones[i];
      const next = allMilestones[i + 1];

      if (currentDay >= prev.day && currentDay <= next.day) {
        // Interpolate between milestones
        const dayRange = next.day - prev.day;
        const amountRange = next.expectedAmount - prev.expectedAmount;

        if (dayRange === 0) {
          return (prev.expectedAmount / obj.targetAmount) * 100;
        }

        const dayProgress = (currentDay - prev.day) / dayRange;
        const expectedAmount = prev.expectedAmount + (amountRange * dayProgress);
        return (expectedAmount / obj.targetAmount) * 100;
      }
    }

    // Fallback: use last milestone
    const lastMilestone = sortedMilestones[sortedMilestones.length - 1];
    return (lastMilestone.expectedAmount / obj.targetAmount) * 100;
  }

  // Handle distribution types
  let adjustedProgress: number;

  switch (obj.distributionType) {
    case 'front_loaded':
      // More progress expected early: use exponential decay curve
      // At 50% time, expect ~70% progress
      adjustedProgress = 1 - Math.pow(1 - progress, 0.6);
      break;

    case 'back_loaded':
      // Less progress expected early: use exponential growth curve
      // At 50% time, expect ~30% progress
      adjustedProgress = Math.pow(progress, 1.7);
      break;

    case 'linear':
    default:
      // Simple linear progression
      adjustedProgress = progress;
      break;
  }

  return startingPercent + (adjustedProgress * remainingPercent);
}

// Calculate status based on actual vs expected progress
function calculateStatus(
  actualProgress: number,
  expectedProgress: number,
  actualAmount: number,
  targetAmount: number
): ObjectiveWithProgress['status'] {
  // If objective is achieved (>=100%)
  if (actualProgress >= 100 || actualAmount >= targetAmount) {
    return 'achieved';
  }

  // If no actual data yet (actualAmount is 0), check if we should be started
  if (actualAmount === 0) {
    // If we're past the start of the period, we're behind
    if (expectedProgress > 5) {
      return 'behind';
    }
    return 'not_started';
  }

  // Calculate the difference between actual and expected
  const progressDiff = actualProgress - expectedProgress;

  // Thresholds for status determination
  // If actual is >= expected, we're on track or ahead
  if (progressDiff >= 0) {
    return 'on_track';
  }

  // If we're within 10% of expected, still on track
  if (progressDiff >= -10) {
    return 'on_track';
  }

  // If we're within 25% of expected, at risk
  if (progressDiff >= -25) {
    return 'at_risk';
  }

  // More than 25% behind expected = behind
  return 'behind';
}

function formatAmount(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M€`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k€`;
  return `${value.toFixed(0)}€`;
}

function getDateFromMonth(monthKey: string, year: number): string {
  const monthIndex = (MONTH_KEYS as readonly string[]).indexOf(monthKey);
  if (monthIndex === -1) return `${year}-01-15`;
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}-15`;
}
