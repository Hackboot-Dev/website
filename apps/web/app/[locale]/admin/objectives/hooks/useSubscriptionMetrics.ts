// /workspaces/website/apps/web/app/[locale]/admin/objectives/hooks/useSubscriptionMetrics.ts
// Description: Hook for calculating subscription-based objective metrics
// Last modified: 2026-01-11

'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../../../lib/supabase';
import type { CompanyId } from '../../pnl/types';
import type { Objective, ObjectiveType } from '../types';
import { MONTH_KEYS } from '../../pnl/constants';

// ============================================================
// TYPES
// ============================================================

type SubscriptionRecord = {
  id: string;
  company_id: string;
  client_id: string | null;
  name: string;
  unit_price: number;
  quantity: number;
  billing_period: 'hourly' | 'daily' | 'monthly' | 'yearly';
  status: 'active' | 'paused' | 'cancelled' | 'expired';
  start_date: string;
  end_date: string | null;
  next_billing_date: string | null;
  last_billed_date: string | null;
  created_at: string;
  updated_at: string;
  metadata: Record<string, unknown> | null;
};

// For tracking plan changes (expansion/contraction)
type SubscriptionChange = {
  subscription_id: string;
  change_type: 'upgrade' | 'downgrade' | 'cancel' | 'reactivate';
  previous_amount: number;
  new_amount: number;
  mrr_impact: number;
  change_date: string;
};

type SubscriptionMetrics = {
  // Current state
  totalSubscriptions: number;
  activeSubscriptions: number;
  pausedSubscriptions: number;
  cancelledSubscriptions: number;

  // MRR/ARR
  mrr: number;
  arr: number;

  // Period-specific (calculated)
  newSubscriptionsInPeriod: number;
  newMrrInPeriod: number;
  churnedSubscriptionsInPeriod: number;
  churnedMrrInPeriod: number;

  // Expansion/Contraction (requires change tracking)
  expansionMrr: number;
  contractionMrr: number;
  upgradesCount: number;
  downgradesCount: number;

  // Derived metrics
  subscriptionChurnRate: number;
  mrrChurnRate: number;
  nrr: number;  // Net Revenue Retention
  grr: number;  // Gross Revenue Retention
  quickRatio: number;
  arpuSubscribers: number;
};

type UseSubscriptionMetricsOptions = {
  companyId: CompanyId;
  year: number;
  month?: number;
  quarter?: number;
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Get monthly MRR from a subscription
 */
function getMonthlyMrr(sub: SubscriptionRecord): number {
  const amount = sub.unit_price * sub.quantity;
  switch (sub.billing_period) {
    case 'hourly':
      return amount * 24 * 30; // ~720 hours per month
    case 'daily':
      return amount * 30;
    case 'monthly':
      return amount;
    case 'yearly':
      return amount / 12;
    default:
      return amount;
  }
}

/**
 * Check if subscription was active at a specific date
 */
function wasActiveAt(sub: SubscriptionRecord, date: Date): boolean {
  const startDate = new Date(sub.start_date);
  const endDate = sub.end_date ? new Date(sub.end_date) : null;

  if (startDate > date) return false;
  if (endDate && endDate < date) return false;
  if (sub.status === 'cancelled' || sub.status === 'expired') {
    // Check if it was cancelled before this date
    const updatedAt = new Date(sub.updated_at);
    if (updatedAt < date) return false;
  }
  return true;
}

/**
 * Check if subscription was created in period
 */
function wasCreatedInPeriod(sub: SubscriptionRecord, startDate: Date, endDate: Date): boolean {
  const created = new Date(sub.created_at);
  return created >= startDate && created <= endDate;
}

/**
 * Check if subscription was cancelled in period
 */
function wasCancelledInPeriod(sub: SubscriptionRecord, startDate: Date, endDate: Date): boolean {
  if (sub.status !== 'cancelled' && sub.status !== 'expired') return false;
  if (!sub.end_date) return false;
  const endDateSub = new Date(sub.end_date);
  return endDateSub >= startDate && endDateSub <= endDate;
}

// ============================================================
// MAIN HOOK
// ============================================================

export function useSubscriptionMetrics({ companyId, year, month, quarter }: UseSubscriptionMetricsOptions) {
  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>([]);
  const [changes, setChanges] = useState<SubscriptionChange[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate period dates
  const getPeriodDates = useCallback(() => {
    let startDate: Date;
    let endDate: Date;

    if (month) {
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 0, 23, 59, 59);
    } else if (quarter) {
      const startMonth = (quarter - 1) * 3;
      startDate = new Date(year, startMonth, 1);
      endDate = new Date(year, startMonth + 3, 0, 23, 59, 59);
    } else {
      startDate = new Date(year, 0, 1);
      endDate = new Date(year, 11, 31, 23, 59, 59);
    }

    return { startDate, endDate };
  }, [year, month, quarter]);

  // Load subscriptions
  const loadSubscriptions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('company_id', companyId);

      if (fetchError) throw fetchError;

      setSubscriptions((data || []) as SubscriptionRecord[]);

      // Try to load subscription changes (might not exist yet)
      try {
        const { data: changesData } = await supabase
          .from('subscription_changes')
          .select('*')
          .eq('company_id', companyId);

        setChanges((changesData || []) as SubscriptionChange[]);
      } catch {
        // Table might not exist yet, ignore
        setChanges([]);
      }
    } catch (err) {
      console.error('Error loading subscriptions:', err);
      setError('Erreur lors du chargement des abonnements');
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    loadSubscriptions();
  }, [loadSubscriptions]);

  // Calculate all metrics
  const calculateMetrics = useCallback((): SubscriptionMetrics => {
    const { startDate, endDate } = getPeriodDates();
    const periodStartMinus1Day = new Date(startDate);
    periodStartMinus1Day.setDate(periodStartMinus1Day.getDate() - 1);

    // Current state
    const activeNow = subscriptions.filter(s => s.status === 'active');
    const totalSubscriptions = subscriptions.length;
    const activeSubscriptions = activeNow.length;
    const pausedSubscriptions = subscriptions.filter(s => s.status === 'paused').length;
    const cancelledSubscriptions = subscriptions.filter(s => s.status === 'cancelled').length;

    // Current MRR/ARR
    const mrr = activeNow.reduce((sum, s) => sum + getMonthlyMrr(s), 0);
    const arr = mrr * 12;

    // MRR at start of period (for retention calculations)
    const activeAtStart = subscriptions.filter(s => wasActiveAt(s, periodStartMinus1Day));
    const mrrAtStart = activeAtStart.reduce((sum, s) => sum + getMonthlyMrr(s), 0);

    // New subscriptions in period
    const newInPeriod = subscriptions.filter(s => wasCreatedInPeriod(s, startDate, endDate));
    const newSubscriptionsInPeriod = newInPeriod.length;
    const newMrrInPeriod = newInPeriod.reduce((sum, s) => sum + getMonthlyMrr(s), 0);

    // Churned in period
    const churnedInPeriod = subscriptions.filter(s => wasCancelledInPeriod(s, startDate, endDate));
    const churnedSubscriptionsInPeriod = churnedInPeriod.length;
    const churnedMrrInPeriod = churnedInPeriod.reduce((sum, s) => sum + getMonthlyMrr(s), 0);

    // Expansion/Contraction from changes (if available)
    const periodChanges = changes.filter(c => {
      const changeDate = new Date(c.change_date);
      return changeDate >= startDate && changeDate <= endDate;
    });

    const upgrades = periodChanges.filter(c => c.change_type === 'upgrade');
    const downgrades = periodChanges.filter(c => c.change_type === 'downgrade');

    const expansionMrr = upgrades.reduce((sum, c) => sum + c.mrr_impact, 0);
    const contractionMrr = Math.abs(downgrades.reduce((sum, c) => sum + c.mrr_impact, 0));
    const upgradesCount = upgrades.length;
    const downgradesCount = downgrades.length;

    // Churn rates
    const subscriptionChurnRate = activeAtStart.length > 0
      ? (churnedSubscriptionsInPeriod / activeAtStart.length) * 100
      : 0;

    const mrrChurnRate = mrrAtStart > 0
      ? (churnedMrrInPeriod / mrrAtStart) * 100
      : 0;

    // NRR: Net Revenue Retention
    // (Starting MRR - Churn - Contraction + Expansion) / Starting MRR
    const nrr = mrrAtStart > 0
      ? ((mrrAtStart - churnedMrrInPeriod - contractionMrr + expansionMrr) / mrrAtStart) * 100
      : 100;

    // GRR: Gross Revenue Retention (without expansion)
    // (Starting MRR - Churn - Contraction) / Starting MRR
    const grr = mrrAtStart > 0
      ? ((mrrAtStart - churnedMrrInPeriod - contractionMrr) / mrrAtStart) * 100
      : 100;

    // Quick Ratio: (New + Expansion) / (Churn + Contraction)
    const churnPlusContraction = churnedMrrInPeriod + contractionMrr;
    const quickRatio = churnPlusContraction > 0
      ? (newMrrInPeriod + expansionMrr) / churnPlusContraction
      : newMrrInPeriod + expansionMrr > 0 ? 10 : 0; // If no churn, high ratio

    // ARPU for subscribers
    const arpuSubscribers = activeSubscriptions > 0
      ? mrr / activeSubscriptions
      : 0;

    return {
      totalSubscriptions,
      activeSubscriptions,
      pausedSubscriptions,
      cancelledSubscriptions,
      mrr,
      arr,
      newSubscriptionsInPeriod,
      newMrrInPeriod,
      churnedSubscriptionsInPeriod,
      churnedMrrInPeriod,
      expansionMrr,
      contractionMrr,
      upgradesCount,
      downgradesCount,
      subscriptionChurnRate,
      mrrChurnRate,
      nrr,
      grr,
      quickRatio,
      arpuSubscribers,
    };
  }, [subscriptions, changes, getPeriodDates]);

  // Get metric value for a specific objective type
  const getMetricForObjective = useCallback((obj: Objective): number => {
    const metrics = calculateMetrics();
    const objType = obj.type;

    switch (objType) {
      // Recurring Revenue
      case 'mrr_total':
        return metrics.mrr;
      case 'arr_total':
        return metrics.arr;
      case 'mrr_growth_pct': {
        // Need previous period MRR for growth calculation
        // For now, return current MRR as approximation
        // TODO: Calculate actual growth from historical data
        return 0; // Requires historical comparison
      }
      case 'net_new_mrr':
        return metrics.newMrrInPeriod + metrics.expansionMrr - metrics.churnedMrrInPeriod - metrics.contractionMrr;

      // Churn & Retention
      case 'subscription_churn_rate':
        return metrics.subscriptionChurnRate;
      case 'mrr_churn':
        return metrics.churnedMrrInPeriod;
      case 'mrr_churn_pct':
        return metrics.mrrChurnRate;
      case 'nrr':
        return metrics.nrr;
      case 'grr':
        return metrics.grr;

      // Expansion & Contraction
      case 'expansion_mrr':
        return metrics.expansionMrr;
      case 'contraction_mrr':
        return metrics.contractionMrr;
      case 'expansion_rate':
        return metrics.activeSubscriptions > 0
          ? (metrics.upgradesCount / metrics.activeSubscriptions) * 100
          : 0;
      case 'upgrades_count':
        return metrics.upgradesCount;
      case 'downgrades_count':
        return metrics.downgradesCount;

      // Acquisition
      case 'new_subscriptions':
        return metrics.newSubscriptionsInPeriod;
      case 'new_mrr':
        return metrics.newMrrInPeriod;
      case 'paid_conversion':
        // Requires client count, return 0 for now
        return 0;

      // Advanced SaaS Metrics
      case 'arpu_subscribers':
        return metrics.arpuSubscribers;
      case 'ltv_mrr': {
        // LTV = ARPU / Monthly Churn Rate
        const monthlyChurnRate = metrics.subscriptionChurnRate / 100;
        return monthlyChurnRate > 0
          ? metrics.arpuSubscribers / monthlyChurnRate
          : metrics.arpuSubscribers * 36; // Default to 3 years if no churn
      }
      case 'quick_ratio':
        return metrics.quickRatio;
      case 'payback_months':
        // Requires CAC data, return 0 for now
        return 0;
      case 'magic_number':
        // Requires S&M spend data, return 0 for now
        return 0;

      default:
        return 0;
    }
  }, [calculateMetrics]);

  // Calculate historical data for charts (monthly breakdown)
  const calculateHistoricalData = useCallback((objectiveType: ObjectiveType): { month: string; value: number }[] => {
    const monthlyData: { month: string; value: number }[] = [];

    for (let m = 0; m < 12; m++) {
      const monthStart = new Date(year, m, 1);
      const monthEnd = new Date(year, m + 1, 0, 23, 59, 59);

      // Filter subscriptions active in this month
      const activeInMonth = subscriptions.filter(s => {
        const startDate = new Date(s.start_date);
        const endDate = s.end_date ? new Date(s.end_date) : new Date(year, 11, 31);
        return startDate <= monthEnd && endDate >= monthStart && s.status !== 'cancelled';
      });

      const newInMonth = subscriptions.filter(s => {
        const created = new Date(s.created_at);
        return created >= monthStart && created <= monthEnd;
      });

      const churnedInMonth = subscriptions.filter(s => {
        if (!s.end_date) return false;
        const endDate = new Date(s.end_date);
        return endDate >= monthStart && endDate <= monthEnd;
      });

      let value = 0;

      switch (objectiveType) {
        case 'mrr_total':
          value = activeInMonth.reduce((sum, s) => sum + getMonthlyMrr(s), 0);
          break;
        case 'arr_total':
          value = activeInMonth.reduce((sum, s) => sum + getMonthlyMrr(s), 0) * 12;
          break;
        case 'new_subscriptions':
          value = newInMonth.length;
          break;
        case 'new_mrr':
          value = newInMonth.reduce((sum, s) => sum + getMonthlyMrr(s), 0);
          break;
        case 'subscription_churn_rate': {
          const activeAtMonthStart = subscriptions.filter(s => {
            const startDate = new Date(s.start_date);
            return startDate < monthStart;
          }).length;
          value = activeAtMonthStart > 0
            ? (churnedInMonth.length / activeAtMonthStart) * 100
            : 0;
          break;
        }
        case 'mrr_churn':
          value = churnedInMonth.reduce((sum, s) => sum + getMonthlyMrr(s), 0);
          break;
        default:
          value = 0;
      }

      monthlyData.push({
        month: MONTH_KEYS[m],
        value,
      });
    }

    return monthlyData;
  }, [subscriptions, year]);

  return {
    subscriptions,
    loading,
    error,
    metrics: calculateMetrics(),
    getMetricForObjective,
    calculateHistoricalData,
    refresh: loadSubscriptions,
  };
}

// ============================================================
// STANDALONE CALCULATION FUNCTION
// ============================================================

/**
 * Calculate subscription metric for a given objective
 * Can be used without the full hook (for useObjectives.ts integration)
 */
export async function calculateSubscriptionMetric(
  companyId: CompanyId,
  objective: Objective
): Promise<number> {
  try {
    const { data: subscriptions, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('company_id', companyId);

    if (error || !subscriptions) return 0;

    const subs = subscriptions as SubscriptionRecord[];
    const { year, month, quarter, type: objType } = objective;

    // Calculate period dates
    let startDate: Date;
    let endDate: Date;

    if (month) {
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 0, 23, 59, 59);
    } else if (quarter) {
      const startMonth = (quarter - 1) * 3;
      startDate = new Date(year, startMonth, 1);
      endDate = new Date(year, startMonth + 3, 0, 23, 59, 59);
    } else {
      startDate = new Date(year, 0, 1);
      endDate = new Date(year, 11, 31, 23, 59, 59);
    }

    const periodStartMinus1Day = new Date(startDate);
    periodStartMinus1Day.setDate(periodStartMinus1Day.getDate() - 1);

    // Helper functions
    const getMonthlyMrrLocal = (sub: SubscriptionRecord): number => {
      const amount = sub.unit_price * sub.quantity;
      switch (sub.billing_period) {
        case 'hourly': return amount * 24 * 30;
        case 'daily': return amount * 30;
        case 'monthly': return amount;
        case 'yearly': return amount / 12;
        default: return amount;
      }
    };

    // Current state
    const activeNow = subs.filter(s => s.status === 'active');
    const mrr = activeNow.reduce((sum, s) => sum + getMonthlyMrrLocal(s), 0);

    // At start of period
    const activeAtStart = subs.filter(s => wasActiveAt(s, periodStartMinus1Day));
    const mrrAtStart = activeAtStart.reduce((sum, s) => sum + getMonthlyMrrLocal(s), 0);

    // New in period
    const newInPeriod = subs.filter(s => wasCreatedInPeriod(s, startDate, endDate));
    const newMrr = newInPeriod.reduce((sum, s) => sum + getMonthlyMrrLocal(s), 0);

    // Churned in period
    const churnedInPeriod = subs.filter(s => wasCancelledInPeriod(s, startDate, endDate));
    const churnedMrr = churnedInPeriod.reduce((sum, s) => sum + getMonthlyMrrLocal(s), 0);

    switch (objType) {
      case 'mrr_total':
        return mrr;
      case 'arr_total':
        return mrr * 12;
      case 'mrr_growth_pct':
        return mrrAtStart > 0 ? ((mrr - mrrAtStart) / mrrAtStart) * 100 : 0;
      case 'net_new_mrr':
        return newMrr - churnedMrr;
      case 'subscription_churn_rate':
        return activeAtStart.length > 0
          ? (churnedInPeriod.length / activeAtStart.length) * 100
          : 0;
      case 'mrr_churn':
        return churnedMrr;
      case 'mrr_churn_pct':
        return mrrAtStart > 0 ? (churnedMrr / mrrAtStart) * 100 : 0;
      case 'nrr':
        return mrrAtStart > 0 ? ((mrrAtStart - churnedMrr) / mrrAtStart) * 100 : 100;
      case 'grr':
        return mrrAtStart > 0 ? ((mrrAtStart - churnedMrr) / mrrAtStart) * 100 : 100;
      case 'expansion_mrr':
        return 0; // Requires change tracking
      case 'contraction_mrr':
        return 0; // Requires change tracking
      case 'expansion_rate':
        return 0; // Requires change tracking
      case 'upgrades_count':
        return 0; // Requires change tracking
      case 'downgrades_count':
        return 0; // Requires change tracking
      case 'new_subscriptions':
        return newInPeriod.length;
      case 'new_mrr':
        return newMrr;
      case 'paid_conversion':
        return 0; // Requires client count
      case 'arpu_subscribers':
        return activeNow.length > 0 ? mrr / activeNow.length : 0;
      case 'ltv_mrr': {
        const churnRate = activeAtStart.length > 0
          ? churnedInPeriod.length / activeAtStart.length
          : 0;
        const arpu = activeNow.length > 0 ? mrr / activeNow.length : 0;
        return churnRate > 0 ? arpu / churnRate : arpu * 36;
      }
      case 'quick_ratio':
        return churnedMrr > 0 ? newMrr / churnedMrr : (newMrr > 0 ? 10 : 0);
      case 'payback_months':
        return 0; // Requires CAC
      case 'magic_number':
        return 0; // Requires S&M spend
      default:
        return 0;
    }
  } catch (err) {
    console.error('Error calculating subscription metric:', err);
    return 0;
  }
}
