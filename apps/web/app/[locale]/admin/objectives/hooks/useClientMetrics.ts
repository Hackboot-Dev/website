// /workspaces/website/apps/web/app/[locale]/admin/objectives/hooks/useClientMetrics.ts
// Description: Hook for calculating client metrics for objectives
// - New clients, churn, retention, ARPU, LTV, etc.
// - Uses clients table and P&L data for calculations
// Last modified: 2026-01-11
// COMPLETE FILE

'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../../../lib/supabase';
import type { CompanyId } from '../../pnl/types';
import type { ObjectiveType, ObjectivePeriod } from '../types';
import { MONTH_KEYS } from '../../pnl/constants';

// Client from database
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

// Period parameters
type PeriodParams = {
  year: number;
  month?: number;
  quarter?: number;
  period: ObjectivePeriod;
};

// Client metrics result
export type ClientMetrics = {
  // Acquisition
  newClientsTotal: number;
  newClientsBySegment: Record<string, number>;
  conversionRate: number; // leads converted to active
  cac: number; // Cost of Acquisition (marketing expenses / new clients)

  // Retention
  churnRate: number; // % of clients lost
  retentionRate: number; // 100 - churn
  activeClients: number;
  avgTenure: number; // in months

  // Value
  arpu: number; // Average Revenue Per User
  ltv: number; // Lifetime Value
  ltvCacRatio: number;
  avgBasket: number; // Average transaction amount

  // Engagement
  activeRatio: number; // % of clients with recent activity
  upsellRate: number; // % of clients who upgraded (approximated by repeat purchases)

  // Raw data for charts
  totalClients: number;
  clientsByStatus: Record<string, number>;
  clientsByType: Record<string, number>;
};

type UseClientMetricsOptions = {
  companyId: CompanyId;
  period: PeriodParams;
};

export function useClientMetrics({ companyId, period }: UseClientMetricsOptions) {
  const [metrics, setMetrics] = useState<ClientMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get date range for period
  const getDateRange = useCallback((p: PeriodParams): { start: Date; end: Date } => {
    const { year, month, quarter, period: periodType } = p;

    if (periodType === 'monthly' && month) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59);
      return { start, end };
    }

    if (periodType === 'quarterly' && quarter) {
      const startMonth = (quarter - 1) * 3;
      const endMonth = quarter * 3 - 1;
      const start = new Date(year, startMonth, 1);
      const end = new Date(year, endMonth + 1, 0, 23, 59, 59);
      return { start, end };
    }

    // Yearly
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31, 23, 59, 59);
    return { start, end };
  }, []);

  // Get previous period date range (for churn calculation)
  const getPreviousPeriodRange = useCallback((p: PeriodParams): { start: Date; end: Date } => {
    const { year, month, quarter, period: periodType } = p;

    if (periodType === 'monthly' && month) {
      const prevMonth = month === 1 ? 12 : month - 1;
      const prevYear = month === 1 ? year - 1 : year;
      const start = new Date(prevYear, prevMonth - 1, 1);
      const end = new Date(prevYear, prevMonth, 0, 23, 59, 59);
      return { start, end };
    }

    if (periodType === 'quarterly' && quarter) {
      const prevQuarter = quarter === 1 ? 4 : quarter - 1;
      const prevYear = quarter === 1 ? year - 1 : year;
      const startMonth = (prevQuarter - 1) * 3;
      const endMonth = prevQuarter * 3 - 1;
      const start = new Date(prevYear, startMonth, 1);
      const end = new Date(prevYear, endMonth + 1, 0, 23, 59, 59);
      return { start, end };
    }

    // Previous year
    const start = new Date(year - 1, 0, 1);
    const end = new Date(year - 1, 11, 31, 23, 59, 59);
    return { start, end };
  }, []);

  // Load and calculate metrics
  const loadMetrics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { start, end } = getDateRange(period);
      const { start: prevStart, end: prevEnd } = getPreviousPeriodRange(period);

      // Fetch all clients for the company
      const { data: allClients, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .eq('company_id', companyId);

      if (clientsError) {
        throw new Error(`Error fetching clients: ${clientsError.message}`);
      }

      const clients = (allClients || []) as ClientRecord[];

      // Calculate metrics
      const now = new Date();

      // --- ACQUISITION ---

      // New clients in this period
      const newClientsInPeriod = clients.filter(c => {
        const createdAt = new Date(c.created_at);
        return createdAt >= start && createdAt <= end;
      });

      const newClientsTotal = newClientsInPeriod.length;

      // New clients by segment
      const newClientsBySegment: Record<string, number> = {
        individual: 0,
        business: 0,
        enterprise: 0,
      };
      newClientsInPeriod.forEach(c => {
        newClientsBySegment[c.type] = (newClientsBySegment[c.type] || 0) + 1;
      });

      // Conversion rate: leads that became active in period
      const leadsAtStartOfPeriod = clients.filter(c => {
        const createdAt = new Date(c.created_at);
        return createdAt < start && c.status === 'lead';
      }).length;

      const convertedInPeriod = clients.filter(c => {
        const firstPurchase = c.first_purchase_at ? new Date(c.first_purchase_at) : null;
        return firstPurchase && firstPurchase >= start && firstPurchase <= end;
      }).length;

      // Also count new clients who are already active (instant conversion)
      const instantConversions = newClientsInPeriod.filter(c => c.status === 'active').length;
      const totalConversions = convertedInPeriod + instantConversions;

      const conversionRate = leadsAtStartOfPeriod > 0
        ? (totalConversions / (leadsAtStartOfPeriod + newClientsInPeriod.filter(c => c.status === 'lead').length)) * 100
        : newClientsTotal > 0 ? (instantConversions / newClientsTotal) * 100 : 0;

      // CAC: Get marketing expenses from P&L
      let marketingExpenses = 0;
      try {
        const { data: pnlResult } = await supabase
          .from('pnl_data')
          .select('data')
          .eq('company_id', companyId)
          .eq('year', period.year)
          .single();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pnlData = pnlResult as { data: any } | null;
        if (pnlData?.data) {
          const expenseCategories = pnlData.data.expenseCategories || [];
          const marketingCategory = expenseCategories.find(
            (cat: { id: string }) => cat.id === 'marketing'
          );

          if (marketingCategory) {
            const monthKeys = getMonthKeysForPeriod(period);
            for (const item of marketingCategory.items || []) {
              for (const mk of monthKeys) {
                marketingExpenses += item.adjustments?.[mk] || 0;
              }
            }
          }
        }
      } catch {
        // P&L data not available, CAC will be 0
      }

      const cac = newClientsTotal > 0 ? marketingExpenses / newClientsTotal : 0;

      // --- RETENTION ---

      // Active clients at end of period
      const activeClients = clients.filter(c => c.status === 'active').length;

      // Churned clients in this period
      // We approximate churn by looking at clients who became 'churned' or 'inactive'
      // In reality, we'd need churned_at timestamp
      const churnedInPeriod = clients.filter(c => {
        const updatedAt = new Date(c.updated_at);
        return (c.status === 'churned' || c.status === 'inactive') &&
          updatedAt >= start && updatedAt <= end;
      }).length;

      // Active at start of period (approximation)
      const activeAtPeriodStart = clients.filter(c => {
        const createdAt = new Date(c.created_at);
        return createdAt < start && (c.status === 'active' ||
          (c.status === 'churned' && new Date(c.updated_at) >= start));
      }).length;

      const churnRate = activeAtPeriodStart > 0
        ? (churnedInPeriod / activeAtPeriodStart) * 100
        : 0;

      const retentionRate = 100 - churnRate;

      // Average tenure (in months)
      const activeClientsWithDate = clients.filter(c => c.status === 'active' && c.created_at);
      let avgTenure = 0;
      if (activeClientsWithDate.length > 0) {
        const totalMonths = activeClientsWithDate.reduce((sum, c) => {
          const createdAt = new Date(c.created_at);
          const monthsDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24 * 30);
          return sum + monthsDiff;
        }, 0);
        avgTenure = totalMonths / activeClientsWithDate.length;
      }

      // --- VALUE ---

      // Total revenue from all clients
      const totalRevenue = clients.reduce((sum, c) => sum + (c.total_revenue || 0), 0);
      const totalTransactions = clients.reduce((sum, c) => sum + (c.total_transactions || 0), 0);

      // ARPU: Average Revenue Per User (active clients)
      const arpu = activeClients > 0 ? totalRevenue / activeClients : 0;

      // LTV: Lifetime Value = ARPU * avg tenure in months * gross margin
      // Simplified: ARPU * avgTenure (assuming ~70% gross margin typical for SaaS)
      const grossMargin = 0.7;
      const ltv = arpu * Math.max(avgTenure, 1) * grossMargin;

      // LTV/CAC ratio
      const ltvCacRatio = cac > 0 ? ltv / cac : 0;

      // Average basket
      const avgBasket = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

      // --- ENGAGEMENT ---

      // Active ratio: clients with activity in last 90 days
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      const recentlyActive = clients.filter(c => {
        const lastPurchase = c.last_purchase_at ? new Date(c.last_purchase_at) : null;
        return lastPurchase && lastPurchase >= ninetyDaysAgo;
      }).length;

      const totalNonLeads = clients.filter(c => c.status !== 'lead').length;
      const activeRatio = totalNonLeads > 0 ? (recentlyActive / totalNonLeads) * 100 : 0;

      // Upsell rate: clients with > 1 transaction (approximation for repeat/upsell)
      const repeatCustomers = clients.filter(c => (c.total_transactions || 0) > 1).length;
      const customersWithAnyTransaction = clients.filter(c => (c.total_transactions || 0) >= 1).length;
      const upsellRate = customersWithAnyTransaction > 0
        ? (repeatCustomers / customersWithAnyTransaction) * 100
        : 0;

      // --- AGGREGATIONS ---

      const totalClients = clients.length;

      const clientsByStatus: Record<string, number> = {
        lead: 0,
        active: 0,
        inactive: 0,
        churned: 0,
      };
      clients.forEach(c => {
        clientsByStatus[c.status] = (clientsByStatus[c.status] || 0) + 1;
      });

      const clientsByType: Record<string, number> = {
        individual: 0,
        business: 0,
        enterprise: 0,
      };
      clients.forEach(c => {
        clientsByType[c.type] = (clientsByType[c.type] || 0) + 1;
      });

      setMetrics({
        // Acquisition
        newClientsTotal,
        newClientsBySegment,
        conversionRate,
        cac,

        // Retention
        churnRate,
        retentionRate,
        activeClients,
        avgTenure,

        // Value
        arpu,
        ltv,
        ltvCacRatio,
        avgBasket,

        // Engagement
        activeRatio,
        upsellRate,

        // Raw
        totalClients,
        clientsByStatus,
        clientsByType,
      });
    } catch (err) {
      console.error('Error loading client metrics:', err);
      setError(err instanceof Error ? err.message : 'Error loading metrics');
    } finally {
      setLoading(false);
    }
  }, [companyId, period, getDateRange, getPreviousPeriodRange]);

  useEffect(() => {
    loadMetrics();
  }, [loadMetrics]);

  // Get metric value by objective type
  const getMetricForType = useCallback((type: ObjectiveType): number => {
    if (!metrics) return 0;

    switch (type) {
      // Acquisition
      case 'new_clients_total':
        return metrics.newClientsTotal;
      case 'new_clients_segment':
        // This would need the segment filter from objective
        return metrics.newClientsTotal;
      case 'conversion_rate':
        return metrics.conversionRate;
      case 'cac':
        return metrics.cac;

      // Retention
      case 'churn_rate':
        return metrics.churnRate;
      case 'retention_rate':
        return metrics.retentionRate;
      case 'active_clients':
        return metrics.activeClients;
      case 'avg_tenure':
        return metrics.avgTenure;

      // Value
      case 'arpu':
        return metrics.arpu;
      case 'ltv':
        return metrics.ltv;
      case 'ltv_cac_ratio':
        return metrics.ltvCacRatio;
      case 'avg_basket':
        return metrics.avgBasket;

      // Engagement
      case 'active_ratio':
        return metrics.activeRatio;
      case 'upsell_rate':
        return metrics.upsellRate;

      default:
        return 0;
    }
  }, [metrics]);

  return {
    metrics,
    loading,
    error,
    refresh: loadMetrics,
    getMetricForType,
  };
}

// Helper: Get month keys for a period
function getMonthKeysForPeriod(period: PeriodParams): string[] {
  if (period.period === 'monthly' && period.month) {
    return [MONTH_KEYS[period.month - 1]];
  }

  if (period.period === 'quarterly' && period.quarter) {
    const startIndex = (period.quarter - 1) * 3;
    return MONTH_KEYS.slice(startIndex, startIndex + 3);
  }

  // Yearly
  return [...MONTH_KEYS];
}

export default useClientMetrics;
