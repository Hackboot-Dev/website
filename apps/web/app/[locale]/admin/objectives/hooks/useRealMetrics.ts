// /workspaces/website/apps/web/app/[locale]/admin/objectives/hooks/useRealMetrics.ts
// Description: Hook to fetch real metrics from P&L and Clients for objective suggestions
// - Provides current values and suggestions for target amounts
// Last modified: 2026-01-11
// COMPLETE FILE

'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../../../lib/supabase';
import type { CompanyId } from '../../pnl/types';
import type { ObjectiveType, ObjectivePeriod } from '../types';
import { MONTH_KEYS } from '../../pnl/constants';

// Suggestion for target amount
export type TargetSuggestion = {
  label: string;
  value: number;
  description: string;
  source: 'last_period' | 'average' | 'growth' | 'benchmark';
};

// Real metrics result
export type RealMetrics = {
  currentValue: number;           // Current actual value for the metric
  lastPeriodValue: number;        // Value from previous period
  averageValue: number;           // Average over last 3-6 periods
  growthRate: number;             // Growth rate %
  suggestions: TargetSuggestion[];
  loading: boolean;
  error: string | null;
};

type UseRealMetricsOptions = {
  companyId: CompanyId;
  type: ObjectiveType;
  period: ObjectivePeriod;
  year: number;
  month?: number;
  quarter?: number;
};

// P&L Data structure
type PnLProduct = {
  id: string;
  label: string;
  transactions: Record<string, Array<{ amount: number }>>;
};

type PnLCategory = {
  id: string;
  label: string;
  products: PnLProduct[];
};

type PnLExpenseItem = {
  id: string;
  label: string;
  adjustments: Record<string, number>;
};

type PnLExpenseCategory = {
  id: string;
  label: string;
  items: PnLExpenseItem[];
};

type PnLData = {
  year: number;
  productCategories: PnLCategory[];
  expenseCategories: PnLExpenseCategory[];
};

// Client record
type ClientRecord = {
  id: string;
  status: 'lead' | 'active' | 'inactive' | 'churned';
  type: 'individual' | 'business' | 'enterprise';
  total_revenue: number;
  total_transactions: number;
  created_at: string;
};

export function useRealMetrics(options: UseRealMetricsOptions): RealMetrics {
  const { companyId, type, period, year, month, quarter } = options;

  const [metrics, setMetrics] = useState<RealMetrics>({
    currentValue: 0,
    lastPeriodValue: 0,
    averageValue: 0,
    growthRate: 0,
    suggestions: [],
    loading: true,
    error: null,
  });

  // Load P&L data for a specific year
  const loadPnLData = useCallback(async (targetYear: number): Promise<PnLData | null> => {
    try {
      const { data, error } = await supabase
        .from('pnl_data')
        .select('data')
        .eq('company_id', companyId)
        .eq('year', targetYear)
        .single();

      if (error || !data) return null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (data as any).data as PnLData;
    } catch {
      return null;
    }
  }, [companyId]);

  // Load clients
  const loadClients = useCallback(async (): Promise<ClientRecord[]> => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('company_id', companyId);

      if (error) return [];
      return (data || []) as ClientRecord[];
    } catch {
      return [];
    }
  }, [companyId]);

  // Calculate revenue from P&L data for a period
  const calculateRevenue = useCallback((
    pnlData: PnLData | null,
    monthKeys: string[]
  ): number => {
    if (!pnlData?.productCategories) return 0;

    let total = 0;
    for (const category of pnlData.productCategories) {
      for (const product of category.products) {
        for (const mk of monthKeys) {
          const txs = product.transactions[mk] || [];
          for (const tx of txs) {
            total += tx.amount || 0;
          }
        }
      }
    }
    return total;
  }, []);

  // Calculate expenses from P&L data for a period
  const calculateExpenses = useCallback((
    pnlData: PnLData | null,
    monthKeys: string[],
    categoryFilter?: string
  ): number => {
    if (!pnlData?.expenseCategories) return 0;

    let total = 0;
    for (const category of pnlData.expenseCategories) {
      if (categoryFilter && category.id !== categoryFilter) continue;

      for (const item of category.items) {
        for (const mk of monthKeys) {
          total += item.adjustments[mk] || 0;
        }
      }
    }
    return total;
  }, []);

  // Get month keys for period
  const getMonthKeys = useCallback((
    p: ObjectivePeriod,
    m?: number,
    q?: number
  ): string[] => {
    if (p === 'monthly' && m) {
      return [MONTH_KEYS[m - 1]];
    }
    if (p === 'quarterly' && q) {
      const start = (q - 1) * 3;
      return MONTH_KEYS.slice(start, start + 3) as string[];
    }
    return [...MONTH_KEYS] as string[];
  }, []);

  // Calculate client metrics
  const calculateClientMetric = useCallback((
    clients: ClientRecord[],
    metricType: ObjectiveType,
    startDate: Date,
    endDate: Date
  ): number => {
    switch (metricType) {
      case 'new_clients_total':
      case 'new_clients_segment':
        return clients.filter(c => {
          const created = new Date(c.created_at);
          return created >= startDate && created <= endDate;
        }).length;

      case 'active_clients':
        return clients.filter(c => c.status === 'active').length;

      case 'churn_rate': {
        const activeAtStart = clients.filter(c => {
          const created = new Date(c.created_at);
          return created < startDate && (c.status === 'active' || c.status === 'churned');
        }).length;
        const churned = clients.filter(c => c.status === 'churned').length;
        return activeAtStart > 0 ? (churned / activeAtStart) * 100 : 0;
      }

      case 'retention_rate': {
        const churn = calculateClientMetric(clients, 'churn_rate', startDate, endDate);
        return 100 - churn;
      }

      case 'arpu': {
        const active = clients.filter(c => c.status === 'active');
        const totalRev = active.reduce((sum, c) => sum + (c.total_revenue || 0), 0);
        return active.length > 0 ? totalRev / active.length : 0;
      }

      case 'avg_basket': {
        const totalRev = clients.reduce((sum, c) => sum + (c.total_revenue || 0), 0);
        const totalTx = clients.reduce((sum, c) => sum + (c.total_transactions || 0), 0);
        return totalTx > 0 ? totalRev / totalTx : 0;
      }

      default:
        return 0;
    }
  }, []);

  // Generate suggestions
  const generateSuggestions = useCallback((
    current: number,
    lastPeriod: number,
    average: number,
    growth: number,
    objType: ObjectiveType
  ): TargetSuggestion[] => {
    const suggestions: TargetSuggestion[] = [];
    const isPercentType = objType.includes('rate') || objType.includes('margin') || objType.includes('ratio');
    const isCountType = objType.includes('clients') || objType === 'active_clients' || objType === 'avg_tenure';

    // Suggestion 1: Same as last period
    if (lastPeriod > 0) {
      suggestions.push({
        label: 'Identique à la période précédente',
        value: Math.round(lastPeriod * 100) / 100,
        description: `Maintenir le même niveau que la dernière période`,
        source: 'last_period',
      });
    }

    // Suggestion 2: Based on average
    if (average > 0) {
      suggestions.push({
        label: 'Basé sur la moyenne',
        value: Math.round(average * 100) / 100,
        description: `Moyenne des dernières périodes`,
        source: 'average',
      });
    }

    // Suggestion 3: Growth target (+10%, +20%)
    if (lastPeriod > 0 && !isPercentType) {
      const growth10 = lastPeriod * 1.1;
      const growth20 = lastPeriod * 1.2;

      suggestions.push({
        label: 'Croissance +10%',
        value: Math.round(growth10 * 100) / 100,
        description: `+10% par rapport à la période précédente`,
        source: 'growth',
      });

      suggestions.push({
        label: 'Croissance +20%',
        value: Math.round(growth20 * 100) / 100,
        description: `+20% par rapport à la période précédente`,
        source: 'growth',
      });
    }

    // Suggestion 4: Benchmark for specific types
    if (objType === 'churn_rate') {
      suggestions.push({
        label: 'Benchmark SaaS (<5%)',
        value: 5,
        description: 'Objectif standard pour les entreprises SaaS',
        source: 'benchmark',
      });
    }

    if (objType === 'retention_rate') {
      suggestions.push({
        label: 'Benchmark SaaS (>90%)',
        value: 90,
        description: 'Objectif standard pour les entreprises SaaS',
        source: 'benchmark',
      });
    }

    if (objType === 'ltv_cac_ratio') {
      suggestions.push({
        label: 'Benchmark SaaS (>3)',
        value: 3,
        description: 'Ratio minimum recommandé',
        source: 'benchmark',
      });
    }

    if (objType === 'gross_margin_pct') {
      suggestions.push({
        label: 'Benchmark SaaS (>70%)',
        value: 70,
        description: 'Marge brute standard pour SaaS',
        source: 'benchmark',
      });
    }

    if (objType === 'net_margin_pct') {
      suggestions.push({
        label: 'Benchmark SaaS (>10%)',
        value: 10,
        description: 'Marge nette saine pour SaaS',
        source: 'benchmark',
      });
    }

    return suggestions;
  }, []);

  // Main effect to load and calculate metrics
  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setMetrics(prev => ({ ...prev, loading: true, error: null }));

        const isFinancialType = type.startsWith('revenue') ||
          type.startsWith('expenses') ||
          type.includes('profit') ||
          type.includes('margin');

        const isClientType = type.includes('clients') ||
          type.includes('churn') ||
          type.includes('retention') ||
          type === 'arpu' ||
          type === 'ltv' ||
          type === 'cac' ||
          type === 'avg_basket' ||
          type === 'active_ratio' ||
          type === 'upsell_rate' ||
          type === 'avg_tenure' ||
          type === 'conversion_rate' ||
          type === 'ltv_cac_ratio';

        let currentValue = 0;
        let lastPeriodValue = 0;
        let averageValue = 0;

        if (isFinancialType) {
          // Load P&L data
          const [currentYearData, lastYearData] = await Promise.all([
            loadPnLData(year),
            loadPnLData(year - 1),
          ]);

          const monthKeys = getMonthKeys(period, month, quarter);

          // Calculate current value
          if (type.startsWith('revenue') || type === 'gross_profit' || type === 'net_profit') {
            currentValue = calculateRevenue(currentYearData, monthKeys);
          }

          if (type.startsWith('expenses') || type === 'gross_profit' || type === 'net_profit') {
            const expenses = calculateExpenses(currentYearData, monthKeys);
            if (type.startsWith('expenses')) {
              currentValue = expenses;
            } else if (type === 'gross_profit' || type === 'net_profit') {
              currentValue = currentValue - expenses;
            }
          }

          if (type.includes('margin')) {
            const revenue = calculateRevenue(currentYearData, monthKeys);
            const expenses = calculateExpenses(currentYearData, monthKeys);
            if (revenue > 0) {
              currentValue = ((revenue - expenses) / revenue) * 100;
            }
          }

          // Calculate last period value (for suggestions)
          if (period === 'monthly' && month && month > 1) {
            const prevMonthKeys = getMonthKeys('monthly', month - 1);
            if (type.startsWith('revenue')) {
              lastPeriodValue = calculateRevenue(currentYearData, prevMonthKeys);
            } else if (type.startsWith('expenses')) {
              lastPeriodValue = calculateExpenses(currentYearData, prevMonthKeys);
            }
          } else if (lastYearData) {
            // Use same period from last year
            if (type.startsWith('revenue')) {
              lastPeriodValue = calculateRevenue(lastYearData, monthKeys);
            } else if (type.startsWith('expenses')) {
              lastPeriodValue = calculateExpenses(lastYearData, monthKeys);
            }
          }

          // Average (simple: (current + last) / 2 if both exist)
          if (currentValue > 0 && lastPeriodValue > 0) {
            averageValue = (currentValue + lastPeriodValue) / 2;
          } else {
            averageValue = currentValue || lastPeriodValue;
          }

        } else if (isClientType) {
          // Load clients
          const clients = await loadClients();

          // Date range for current period
          let startDate: Date;
          let endDate: Date;

          if (period === 'monthly' && month) {
            startDate = new Date(year, month - 1, 1);
            endDate = new Date(year, month, 0, 23, 59, 59);
          } else if (period === 'quarterly' && quarter) {
            const startMonth = (quarter - 1) * 3;
            startDate = new Date(year, startMonth, 1);
            endDate = new Date(year, startMonth + 3, 0, 23, 59, 59);
          } else {
            startDate = new Date(year, 0, 1);
            endDate = new Date(year, 11, 31, 23, 59, 59);
          }

          currentValue = calculateClientMetric(clients, type, startDate, endDate);

          // Last period (previous month/quarter/year)
          let prevStartDate: Date;
          let prevEndDate: Date;

          if (period === 'monthly' && month && month > 1) {
            prevStartDate = new Date(year, month - 2, 1);
            prevEndDate = new Date(year, month - 1, 0, 23, 59, 59);
          } else if (period === 'quarterly' && quarter && quarter > 1) {
            const prevStartMonth = (quarter - 2) * 3;
            prevStartDate = new Date(year, prevStartMonth, 1);
            prevEndDate = new Date(year, prevStartMonth + 3, 0, 23, 59, 59);
          } else {
            prevStartDate = new Date(year - 1, 0, 1);
            prevEndDate = new Date(year - 1, 11, 31, 23, 59, 59);
          }

          lastPeriodValue = calculateClientMetric(clients, type, prevStartDate, prevEndDate);

          if (currentValue > 0 && lastPeriodValue > 0) {
            averageValue = (currentValue + lastPeriodValue) / 2;
          } else {
            averageValue = currentValue || lastPeriodValue;
          }
        }

        // Calculate growth rate
        const growthRate = lastPeriodValue > 0
          ? ((currentValue - lastPeriodValue) / lastPeriodValue) * 100
          : 0;

        // Generate suggestions
        const suggestions = generateSuggestions(
          currentValue,
          lastPeriodValue,
          averageValue,
          growthRate,
          type
        );

        setMetrics({
          currentValue,
          lastPeriodValue,
          averageValue,
          growthRate,
          suggestions,
          loading: false,
          error: null,
        });

      } catch (err) {
        console.error('Error loading real metrics:', err);
        setMetrics(prev => ({
          ...prev,
          loading: false,
          error: 'Erreur lors du chargement des données',
        }));
      }
    };

    loadMetrics();
  }, [
    companyId, type, period, year, month, quarter,
    loadPnLData, loadClients, getMonthKeys,
    calculateRevenue, calculateExpenses, calculateClientMetric,
    generateSuggestions
  ]);

  return metrics;
}

export default useRealMetrics;
