// /workspaces/website/apps/web/app/[locale]/admin/hooks/useDashboardStats.ts
// Description: Hook for fetching real dashboard KPIs from Supabase
// Last modified: 2025-01-10

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../../lib/supabase';

export interface DashboardStats {
  revenueMTD: number;
  revenueChange: number; // % vs last month
  activeClients: number;
  clientsChange: number;
  activeSubscriptions: number;
  subscriptionsChange: number;
  mrr: number;
  mrrChange: number;
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
  loading: true,
  error: null,
};

export function useDashboardStats(): DashboardStats {
  const [stats, setStats] = useState<DashboardStats>(defaultStats);

  const fetchStats = useCallback(async () => {
    try {
      setStats(prev => ({ ...prev, loading: true, error: null }));

      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.toLocaleString('en', { month: 'short' }).toLowerCase();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthStr = lastMonth.toLocaleString('en', { month: 'short' }).toLowerCase();

      // Fetch all data in parallel
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const [clientsResult, subscriptionsResult, pnlDataResult] = await Promise.all([
        // Active clients count
        (supabase as any)
          .from('clients')
          .select('id, status', { count: 'exact' })
          .eq('status', 'active'),

        // Active subscriptions
        (supabase as any)
          .from('subscriptions')
          .select('id, unit_price, status', { count: 'exact' })
          .eq('status', 'active'),

        // P&L data for current year (both companies)
        (supabase as any)
          .from('pnl_data')
          .select('*')
          .eq('year', currentYear),
      ]);

      // Calculate active clients
      const activeClients = clientsResult.count || 0;

      // Calculate active subscriptions and MRR
      const activeSubscriptions = subscriptionsResult.count || 0;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mrr = (subscriptionsResult.data || []).reduce((sum: number, sub: any) => {
        return sum + (sub.unit_price || 0);
      }, 0);

      // Calculate revenue from P&L data
      let revenueMTD = 0;
      let revenueLastMonth = 0;

      if (pnlDataResult.data && pnlDataResult.data.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const pnl of pnlDataResult.data) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data = pnl.data as any;
          if (data?.productCategories) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            for (const category of data.productCategories) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              for (const product of category.products || []) {
                // Current month revenue
                const currentTransactions = product.transactions?.[currentMonth] || [];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                revenueMTD += currentTransactions.reduce((sum: number, t: any) => {
                  return sum + (t.amount || product.price || 0);
                }, 0);

                // Last month revenue
                const lastTransactions = product.transactions?.[lastMonthStr] || [];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                revenueLastMonth += lastTransactions.reduce((sum: number, t: any) => {
                  return sum + (t.amount || product.price || 0);
                }, 0);
              }
            }
          }
        }
      }

      // Calculate changes
      const revenueChange = revenueLastMonth > 0
        ? ((revenueMTD - revenueLastMonth) / revenueLastMonth) * 100
        : 0;

      setStats({
        revenueMTD,
        revenueChange,
        activeClients,
        clientsChange: 0, // Would need historical data
        activeSubscriptions,
        subscriptionsChange: 0,
        mrr,
        mrrChange: 0,
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
