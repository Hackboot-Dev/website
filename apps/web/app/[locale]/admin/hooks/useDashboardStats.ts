// /workspaces/website/apps/web/app/[locale]/admin/hooks/useDashboardStats.ts
// Description: Hook for fetching real dashboard KPIs from Supabase with YoY/MoM comparisons and forecasting
// Last modified: 2026-01-10

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../../lib/supabase';

export interface DashboardStats {
  // Current metrics
  revenueMTD: number;
  revenueChange: number; // % vs last month (MoM)
  activeClients: number;
  clientsChange: number;
  activeSubscriptions: number;
  subscriptionsChange: number;
  mrr: number;
  mrrChange: number;

  // YoY comparisons
  revenueYTD: number;
  revenueYTDLastYear: number;
  revenueYoYChange: number; // % vs same period last year

  // Monthly trend data (last 12 months)
  monthlyRevenue: { month: string; revenue: number; year: number }[];

  // MRR Forecasting
  mrrForecast3Months: number;
  mrrForecast6Months: number;
  mrrForecast12Months: number;
  mrrGrowthRate: number; // Monthly growth rate %

  // Alerts summary
  alertsCritical: number;
  alertsWarning: number;

  // Objectives summary
  objectivesAchieved: number;
  objectivesTotal: number;

  loading: boolean;
  error: string | null;
}

const defaultStats: DashboardStats = {
  revenueMTD: 0,
  revenueChange: 0,
  activeClients: 0,
  clientsChange: 0,
  activeSubscriptions: 0,
  subscriptionsChange: 0,
  mrr: 0,
  mrrChange: 0,
  revenueYTD: 0,
  revenueYTDLastYear: 0,
  revenueYoYChange: 0,
  monthlyRevenue: [],
  mrrForecast3Months: 0,
  mrrForecast6Months: 0,
  mrrForecast12Months: 0,
  mrrGrowthRate: 0,
  alertsCritical: 0,
  alertsWarning: 0,
  objectivesAchieved: 0,
  objectivesTotal: 0,
  loading: true,
  error: null,
};

const MONTH_KEYS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

export function useDashboardStats(): DashboardStats {
  const [stats, setStats] = useState<DashboardStats>(defaultStats);

  const fetchStats = useCallback(async () => {
    try {
      setStats(prev => ({ ...prev, loading: true, error: null }));

      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonthIndex = now.getMonth(); // 0-11
      const currentMonth = MONTH_KEYS[currentMonthIndex];
      const lastMonthIndex = currentMonthIndex === 0 ? 11 : currentMonthIndex - 1;
      const lastMonthStr = MONTH_KEYS[lastMonthIndex];
      const lastMonthYear = currentMonthIndex === 0 ? currentYear - 1 : currentYear;

      // Fetch all data in parallel
      const [
        clientsResult,
        subscriptionsResult,
        transactionsCurrentYear,
        transactionsLastYear,
        alertsResult,
        objectivesResult,
      ] = await Promise.all([
        // Active clients count
        supabase
          .from('clients')
          .select('id, status, created_at', { count: 'exact' })
          .eq('status', 'active') as unknown as Promise<{ count: number | null; data: { id: string; status: string; created_at: string }[] | null }>,

        // Active subscriptions with amount
        supabase
          .from('subscriptions')
          .select('id, amount, status')
          .eq('status', 'active') as unknown as Promise<{ count: number | null; data: { id: string; amount: number; status: string }[] | null }>,

        // Transactions current year
        supabase
          .from('pnl_transactions')
          .select('amount, discount, month, year')
          .eq('year', currentYear) as unknown as Promise<{ data: { amount: number; discount: number; month: string; year: number }[] | null }>,

        // Transactions last year (for YoY)
        supabase
          .from('pnl_transactions')
          .select('amount, discount, month, year')
          .eq('year', currentYear - 1) as unknown as Promise<{ data: { amount: number; discount: number; month: string; year: number }[] | null }>,

        // Unread alerts
        supabase
          .from('alerts')
          .select('severity')
          .eq('is_read', false) as unknown as Promise<{ data: { severity: string }[] | null }>,

        // Objectives for current year
        supabase
          .from('objectives')
          .select('id, type, target_amount')
          .eq('year', currentYear) as unknown as Promise<{ data: { id: string; type: string; target_amount: number }[] | null }>,
      ]);

      // Calculate active clients
      const activeClients = clientsResult.count || 0;

      // Calculate clients created this month vs last month
      const clientsThisMonth = (clientsResult.data || []).filter(c => {
        const created = new Date(c.created_at);
        return created.getMonth() === currentMonthIndex && created.getFullYear() === currentYear;
      }).length;

      // Calculate active subscriptions and MRR
      const activeSubscriptions = (subscriptionsResult.data || []).length;
      const mrr = (subscriptionsResult.data || []).reduce((sum, sub) => {
        return sum + (sub.amount || 0);
      }, 0);

      // Calculate revenue metrics from pnl_transactions
      const txCurrentYear = transactionsCurrentYear.data || [];
      const txLastYear = transactionsLastYear.data || [];

      // Group by month for current year
      const revenueByMonth: Record<string, number> = {};
      MONTH_KEYS.forEach(m => { revenueByMonth[m] = 0; });

      txCurrentYear.forEach(tx => {
        const netAmount = Number(tx.amount) - Number(tx.discount || 0);
        revenueByMonth[tx.month] = (revenueByMonth[tx.month] || 0) + netAmount;
      });

      // Calculate MTD and YTD
      const revenueMTD = revenueByMonth[currentMonth] || 0;
      let revenueYTD = 0;
      for (let i = 0; i <= currentMonthIndex; i++) {
        revenueYTD += revenueByMonth[MONTH_KEYS[i]] || 0;
      }

      // Calculate last month revenue
      const revenueLastMonth = revenueByMonth[lastMonthStr] || 0;

      // Calculate YTD for same period last year
      let revenueYTDLastYear = 0;
      const revenueByMonthLastYear: Record<string, number> = {};
      MONTH_KEYS.forEach(m => { revenueByMonthLastYear[m] = 0; });

      txLastYear.forEach(tx => {
        const netAmount = Number(tx.amount) - Number(tx.discount || 0);
        revenueByMonthLastYear[tx.month] = (revenueByMonthLastYear[tx.month] || 0) + netAmount;
      });

      for (let i = 0; i <= currentMonthIndex; i++) {
        revenueYTDLastYear += revenueByMonthLastYear[MONTH_KEYS[i]] || 0;
      }

      // Calculate changes
      const revenueChange = revenueLastMonth > 0
        ? ((revenueMTD - revenueLastMonth) / revenueLastMonth) * 100
        : 0;

      const revenueYoYChange = revenueYTDLastYear > 0
        ? ((revenueYTD - revenueYTDLastYear) / revenueYTDLastYear) * 100
        : 0;

      // Build monthly revenue array for chart (last 12 months)
      const monthlyRevenue: { month: string; revenue: number; year: number }[] = [];
      for (let i = 11; i >= 0; i--) {
        const monthIdx = (currentMonthIndex - i + 12) % 12;
        const year = currentMonthIndex - i < 0 ? currentYear - 1 : currentYear;
        const monthKey = MONTH_KEYS[monthIdx];
        const revenue = year === currentYear
          ? revenueByMonth[monthKey]
          : revenueByMonthLastYear[monthKey];
        monthlyRevenue.push({ month: monthKey, revenue: revenue || 0, year });
      }

      // MRR Forecasting (simple linear projection based on growth rate)
      // Calculate average monthly growth over last 3 months
      let mrrGrowthRate = 0;
      const last3Months = monthlyRevenue.slice(-3);
      if (last3Months.length >= 2 && last3Months[0].revenue > 0) {
        const growthRates: number[] = [];
        for (let i = 1; i < last3Months.length; i++) {
          if (last3Months[i - 1].revenue > 0) {
            const growth = (last3Months[i].revenue - last3Months[i - 1].revenue) / last3Months[i - 1].revenue;
            growthRates.push(growth);
          }
        }
        if (growthRates.length > 0) {
          mrrGrowthRate = (growthRates.reduce((a, b) => a + b, 0) / growthRates.length) * 100;
        }
      }

      // Project MRR based on current MRR and growth rate
      const monthlyGrowthMultiplier = 1 + (mrrGrowthRate / 100);
      const mrrForecast3Months = mrr * Math.pow(monthlyGrowthMultiplier, 3);
      const mrrForecast6Months = mrr * Math.pow(monthlyGrowthMultiplier, 6);
      const mrrForecast12Months = mrr * Math.pow(monthlyGrowthMultiplier, 12);

      // Alerts summary
      const alerts = alertsResult.data || [];
      const alertsCritical = alerts.filter(a => a.severity === 'critical').length;
      const alertsWarning = alerts.filter(a => a.severity === 'warning').length;

      // Objectives summary (simplified - would need actual calculation)
      const objectivesTotal = (objectivesResult.data || []).length;
      const objectivesAchieved = 0; // Would need to fetch progress

      setStats({
        revenueMTD,
        revenueChange: Math.round(revenueChange * 10) / 10,
        activeClients,
        clientsChange: clientsThisMonth,
        activeSubscriptions,
        subscriptionsChange: 0,
        mrr,
        mrrChange: Math.round(mrrGrowthRate * 10) / 10,
        revenueYTD,
        revenueYTDLastYear,
        revenueYoYChange: Math.round(revenueYoYChange * 10) / 10,
        monthlyRevenue,
        mrrForecast3Months: Math.round(mrrForecast3Months),
        mrrForecast6Months: Math.round(mrrForecast6Months),
        mrrForecast12Months: Math.round(mrrForecast12Months),
        mrrGrowthRate: Math.round(mrrGrowthRate * 10) / 10,
        alertsCritical,
        alertsWarning,
        objectivesAchieved,
        objectivesTotal,
        loading: false,
        error: null,
      });

    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setStats(prev => ({
        ...prev,
        loading: false,
        error: 'Erreur de chargement des statistiques',
      }));
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return stats;
}

export default useDashboardStats;
