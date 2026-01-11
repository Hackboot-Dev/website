// /workspaces/website/apps/web/app/[locale]/admin/subscriptions/metrics/page.tsx
// Description: SaaS metrics dashboard (MRR, ARR, Churn, etc.)
// Last modified: 2025-12-19

'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ChevronLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  RefreshCw,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  BarChart3,
} from 'lucide-react';

import { useSubscriptions } from '../hooks';
import { calculateMonthlyPrice } from '../types';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatPercent = (value: number) => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
};

type MetricCardProps = {
  label: string;
  value: string;
  subValue?: string;
  change?: number;
  icon: React.ElementType;
  color: 'emerald' | 'blue' | 'violet' | 'amber' | 'red';
};

function MetricCard({ label, value, subValue, change, icon: Icon, color }: MetricCardProps) {
  const colorClasses = {
    emerald: 'border-emerald-900/30 text-emerald-400 bg-emerald-500/10',
    blue: 'border-blue-900/30 text-blue-400 bg-blue-500/10',
    violet: 'border-violet-900/30 text-violet-400 bg-violet-500/10',
    amber: 'border-amber-900/30 text-amber-400 bg-amber-500/10',
    red: 'border-red-900/30 text-red-400 bg-red-500/10',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800 transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 flex items-center justify-center rounded-lg border ${colorClasses[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {change >= 0 ? (
              <ArrowUpRight className="h-4 w-4" />
            ) : (
              <ArrowDownRight className="h-4 w-4" />
            )}
            {formatPercent(change)}
          </div>
        )}
      </div>
      <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-3xl font-light text-white">{value}</p>
      {subValue && <p className="text-sm text-zinc-500 mt-1">{subValue}</p>}
    </motion.div>
  );
}

export default function MetricsPage() {
  const params = useParams();
  const locale = params.locale as string;

  const { subscriptions, metrics, loading, refresh } = useSubscriptions('vmcloud');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setIsRefreshing(false);
  };

  // Calculate additional metrics
  const calculatedMetrics = useMemo(() => {
    if (!subscriptions.length) {
      return {
        avgRevenuePerUser: 0,
        churnRate: 0,
        trialConversionRate: 0,
        monthlyGrowthRate: 0,
        revenueByPeriod: { monthly: 0, quarterly: 0, yearly: 0 },
        statusBreakdown: { active: 0, trial: 0, paused: 0, cancelled: 0, expired: 0 },
      };
    }

    // ARPU
    const activeCount = subscriptions.filter((s) => s.status === 'active').length;
    const avgRevenuePerUser = activeCount > 0 ? (metrics?.mrr || 0) / activeCount : 0;

    // Status breakdown
    const statusBreakdown = {
      active: subscriptions.filter((s) => s.status === 'active').length,
      trial: subscriptions.filter((s) => s.status === 'trial').length,
      paused: subscriptions.filter((s) => s.status === 'paused').length,
      cancelled: subscriptions.filter((s) => s.status === 'cancelled').length,
      expired: subscriptions.filter((s) => s.status === 'expired').length,
    };

    // Revenue by billing period
    const revenueByPeriod = { monthly: 0, quarterly: 0, yearly: 0 };
    subscriptions
      .filter((s) => s.status === 'active')
      .forEach((s) => {
        const monthlyPrice = calculateMonthlyPrice(s.price, s.billingPeriod, s.discountPercent);
        revenueByPeriod[s.billingPeriod] += monthlyPrice;
      });

    // Simple churn rate (cancelled this month / total active at start)
    const churnRate = activeCount > 0 ? ((metrics?.cancelledThisMonth || 0) / (activeCount + (metrics?.cancelledThisMonth || 0))) * 100 : 0;

    return {
      avgRevenuePerUser,
      churnRate,
      trialConversionRate: 0, // Would need historical data
      monthlyGrowthRate: 0, // Would need historical data
      revenueByPeriod,
      statusBreakdown,
    };
  }, [subscriptions, metrics]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href={`/${locale}/admin/subscriptions`}
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-4 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Retour aux abonnements
          </Link>
          <h1 className="text-3xl font-extralight text-white">Métriques SaaS</h1>
          <p className="text-zinc-500 mt-1">Analyse des indicateurs de performance</p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 transition-all"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Actualiser
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
        </div>
      ) : (
        <>
          {/* Main KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              label="MRR"
              value={formatCurrency(metrics?.mrr || 0)}
              subValue="Monthly Recurring Revenue"
              icon={DollarSign}
              color="emerald"
            />
            <MetricCard
              label="ARR"
              value={formatCurrency(metrics?.arr || 0)}
              subValue="Annual Recurring Revenue"
              icon={TrendingUp}
              color="blue"
            />
            <MetricCard
              label="ARPU"
              value={formatCurrency(calculatedMetrics.avgRevenuePerUser)}
              subValue="Average Revenue Per User"
              icon={Users}
              color="violet"
            />
            <MetricCard
              label="Churn Rate"
              value={`${calculatedMetrics.churnRate.toFixed(1)}%`}
              subValue={`${metrics?.cancelledThisMonth || 0} résiliation(s) ce mois`}
              icon={TrendingDown}
              color={calculatedMetrics.churnRate > 5 ? 'red' : 'amber'}
            />
          </div>

          {/* Secondary metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status breakdown */}
            <div className="p-6 bg-zinc-900/20 border border-zinc-900">
              <h3 className="text-lg font-medium text-white mb-6">Répartition par statut</h3>
              <div className="space-y-4">
                {Object.entries(calculatedMetrics.statusBreakdown).map(([status, count]) => {
                  const total = subscriptions.length;
                  const percent = total > 0 ? (count / total) * 100 : 0;
                  const colors: Record<string, string> = {
                    active: 'bg-emerald-500',
                    trial: 'bg-blue-500',
                    paused: 'bg-amber-500',
                    cancelled: 'bg-red-500',
                    expired: 'bg-zinc-500',
                  };

                  return (
                    <div key={status}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-zinc-400 capitalize">{status}</span>
                        <span className="text-sm text-white">{count}</span>
                      </div>
                      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${colors[status]} transition-all`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Revenue by billing period */}
            <div className="p-6 bg-zinc-900/20 border border-zinc-900">
              <h3 className="text-lg font-medium text-white mb-6">MRR par période de facturation</h3>
              <div className="space-y-4">
                {Object.entries(calculatedMetrics.revenueByPeriod).map(([period, mrr]) => {
                  const total = Object.values(calculatedMetrics.revenueByPeriod).reduce((a, b) => a + b, 0);
                  const percent = total > 0 ? (mrr / total) * 100 : 0;
                  const labels: Record<string, string> = {
                    monthly: 'Mensuel',
                    quarterly: 'Trimestriel',
                    yearly: 'Annuel',
                  };
                  const colors: Record<string, string> = {
                    monthly: 'bg-blue-500',
                    quarterly: 'bg-violet-500',
                    yearly: 'bg-emerald-500',
                  };

                  return (
                    <div key={period}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-zinc-400">{labels[period]}</span>
                        <span className="text-sm text-white">{formatCurrency(mrr)}/mois</span>
                      </div>
                      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${colors[period]} transition-all`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-6 border-t border-zinc-800">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Total MRR</span>
                  <span className="text-xl text-white font-light">{formatCurrency(metrics?.mrr || 0)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-zinc-900/20 border border-zinc-900 text-center">
              <p className="text-2xl font-light text-white">{metrics?.totalSubscriptions || 0}</p>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Total abonnements</p>
            </div>
            <div className="p-4 bg-zinc-900/20 border border-zinc-900 text-center">
              <p className="text-2xl font-light text-emerald-400">{metrics?.activeSubscriptions || 0}</p>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Actifs</p>
            </div>
            <div className="p-4 bg-zinc-900/20 border border-zinc-900 text-center">
              <p className="text-2xl font-light text-blue-400">{metrics?.trialSubscriptions || 0}</p>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">En essai</p>
            </div>
            <div className="p-4 bg-zinc-900/20 border border-zinc-900 text-center">
              <p className="text-2xl font-light text-amber-400">{metrics?.pausedSubscriptions || 0}</p>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">En pause</p>
            </div>
          </div>

          {/* Info note */}
          <div className="p-4 bg-blue-500/5 border border-blue-900/30">
            <div className="flex items-start gap-3">
              <BarChart3 className="h-5 w-5 text-blue-400 mt-0.5" />
              <div>
                <p className="text-blue-400 font-medium">Métriques en temps réel</p>
                <p className="text-sm text-zinc-400 mt-1">
                  Les métriques sont calculées en temps réel à partir des données d'abonnements.
                  Pour des analyses historiques (tendances, cohortes), un système de snapshots sera nécessaire.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
