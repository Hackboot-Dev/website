// /workspaces/website/apps/web/app/[locale]/admin/objectives/[id]/ObjectiveDetailClient.tsx
// Description: Main client component for objective detail page
// Last modified: 2026-01-10
// COMPLETE FILE

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  RefreshCw,
  Download,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Calendar,
  Target,
  Zap,
  BarChart3,
  PieChart,
  Activity,
} from 'lucide-react';
import { useObjectiveDetail } from '../hooks/useObjectiveDetail';
import { ObjectiveChart } from '../components/detail/ObjectiveChart';
import { ObjectiveGauge } from '../components/detail/ObjectiveGauge';
import { ObjectiveForecast } from '../components/detail/ObjectiveForecast';
import { ObjectiveActions } from '../components/detail/ObjectiveActions';
import { ObjectiveTransactions } from '../components/detail/ObjectiveTransactions';
import { ObjectiveInsights } from '../components/detail/ObjectiveInsights';
import type { ObjectiveWithProgress } from '../types';
import {
  OBJECTIVE_TYPE_LABELS,
  OBJECTIVE_STATUS_CONFIG,
  OBJECTIVE_CATEGORY_LABELS,
  MONTHS_FR,
  QUARTERS_FR,
  formatObjectiveValue,
  OBJECTIVE_TYPE_UNITS,
  getCategoryForType,
} from '../types';

type ObjectiveDetailClientProps = {
  objectiveId: string;
};

type Tab = 'overview' | 'analytics' | 'actions' | 'transactions';

export function ObjectiveDetailClient({ objectiveId }: ObjectiveDetailClientProps) {
  const params = useParams();
  const locale = params.locale as string || 'fr';
  const companyId = 'vmcloud';
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const {
    objective,
    loading,
    error,
    historicalData,
    forecastData,
    insights,
    actions,
    transactions,
    refresh,
  } = useObjectiveDetail({
    companyId,
    objectiveId,
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-8 w-8 text-zinc-500 animate-spin" />
          <p className="text-zinc-500">Chargement de l'objectif...</p>
        </div>
      </div>
    );
  }

  if (error || !objective) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertTriangle className="h-12 w-12 text-red-400" />
          <h2 className="text-xl font-semibold text-white">Objectif introuvable</h2>
          <p className="text-zinc-500 max-w-md">
            {error || "L'objectif demandé n'existe pas ou a été supprimé."}
          </p>
          <Link
            href={`/${locale}/admin/objectives`}
            className="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
          >
            Retour aux objectifs
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = OBJECTIVE_STATUS_CONFIG[objective.status];
  const unit = OBJECTIVE_TYPE_UNITS[objective.type];
  const category = getCategoryForType(objective.type);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: <PieChart className="h-4 w-4" /> },
    { id: 'analytics', label: 'Analytiques', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'actions', label: 'Actions', icon: <Zap className="h-4 w-4" /> },
    { id: 'transactions', label: 'Transactions', icon: <Activity className="h-4 w-4" /> },
  ];

  // Check if we have real data
  const hasRealData = objective.actualAmount > 0 || transactions.length > 0;

  // Determine display status - if no data, show "no_data" instead of "behind"
  const displayStatus = !hasRealData && objective.status === 'behind' ? 'no_data' : objective.status;
  const displayStatusConfig = displayStatus === 'no_data'
    ? { label: 'Pas de données', color: 'text-zinc-400', bgColor: 'bg-zinc-800' }
    : statusConfig;

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header - same style as other admin pages */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <Link
            href={`/${locale}/admin/objectives`}
            className="text-zinc-500 hover:text-white transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Objectifs
          </Link>
          <span className="text-zinc-700">/</span>
          <span className="text-zinc-400">{OBJECTIVE_CATEGORY_LABELS[category]}</span>
          <span className="text-zinc-700">/</span>
          <span className="text-white">{objective.name || OBJECTIVE_TYPE_LABELS[objective.type]}</span>
        </div>

        {/* Title + Status */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-zinc-900/50 border border-zinc-800 rounded-xl flex items-center justify-center">
              <Target className="h-6 w-6 text-zinc-400" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white">
                {objective.name || OBJECTIVE_TYPE_LABELS[objective.type]}
              </h1>
              <p className="text-zinc-500 text-sm">
                {objective.period === 'monthly' && objective.month && `${MONTHS_FR[objective.month - 1]} ${objective.year}`}
                {objective.period === 'quarterly' && objective.quarter && `${QUARTERS_FR[objective.quarter - 1]} ${objective.year}`}
                {objective.period === 'yearly' && `Année ${objective.year}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs px-3 py-1.5 rounded-full ${displayStatusConfig.bgColor} ${displayStatusConfig.color} font-medium`}>
              {displayStatusConfig.label}
            </span>
            <button
              onClick={refresh}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
              title="Actualiser"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Warning if no data */}
        {!hasRealData && (
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-400 font-medium">Aucune donnée P&L disponible</p>
              <p className="text-amber-400/70 text-sm mt-1">
                Les statistiques affichées sont à 0 car il n'y a pas encore de transactions enregistrées dans le module P&L pour cette période.
                <Link href={`/${locale}/admin/pnl`} className="ml-1 underline hover:text-amber-300">
                  Ajouter des transactions →
                </Link>
              </p>
            </div>
          </div>
        )}

        {/* Simple metrics row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-zinc-900/20 border border-zinc-900 rounded-xl p-4">
            <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Actuel</p>
            <p className="text-2xl font-semibold text-white">
              {formatObjectiveValue(objective.actualAmount, unit)}
            </p>
          </div>
          <div className="bg-zinc-900/20 border border-zinc-900 rounded-xl p-4">
            <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Objectif</p>
            <p className="text-2xl font-semibold text-zinc-300">
              {formatObjectiveValue(objective.targetAmount, unit)}
            </p>
          </div>
          <div className="bg-zinc-900/20 border border-zinc-900 rounded-xl p-4">
            <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Progression</p>
            <p className={`text-2xl font-semibold ${hasRealData ? statusConfig.color : 'text-zinc-500'}`}>
              {objective.progressPercent.toFixed(1)}%
            </p>
          </div>
          <div className="bg-zinc-900/20 border border-zinc-900 rounded-xl p-4">
            <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Écart</p>
            <p className={`text-2xl font-semibold ${
              objective.actualAmount >= objective.targetAmount ? 'text-emerald-400' : 'text-zinc-400'
            }`}>
              {objective.actualAmount >= objective.targetAmount
                ? `+${formatObjectiveValue(objective.actualAmount - objective.targetAmount, unit)}`
                : `${formatObjectiveValue(objective.actualAmount - objective.targetAmount, unit)}`
              }
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        {hasRealData && (
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden mb-8">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                objective.status === 'achieved'
                  ? 'bg-emerald-500'
                  : objective.status === 'on_track'
                  ? 'bg-blue-500'
                  : objective.status === 'at_risk'
                  ? 'bg-amber-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(100, objective.progressPercent)}%` }}
            />
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors
                  ${activeTab === tab.id
                    ? 'text-white border-white'
                    : 'text-zinc-500 border-transparent hover:text-zinc-300'
                  }
                `}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Chart + Gauge Row */}
              {hasRealData ? (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <ObjectiveChart
                        objective={objective}
                        historicalData={historicalData}
                      />
                    </div>
                    <div>
                      <ObjectiveGauge objective={objective} />
                    </div>
                  </div>

                  {/* Insights */}
                  <ObjectiveInsights insights={insights} />
                </>
              ) : (
                <div className="text-center py-12 bg-zinc-900/20 border border-zinc-900 rounded-xl">
                  <Target className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
                  <p className="text-zinc-500">Aucune donnée à afficher</p>
                  <p className="text-zinc-600 text-sm mt-1">
                    Ajoutez des transactions dans le P&L pour voir les graphiques
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Forecast */}
              <ObjectiveForecast
                objective={objective}
                forecastData={forecastData}
              />

              {/* Chart with more options */}
              <ObjectiveChart
                objective={objective}
                historicalData={historicalData}
                showComparison
              />
            </motion.div>
          )}

          {activeTab === 'actions' && (
            <motion.div
              key="actions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <ObjectiveActions
                objective={objective}
                actions={actions}
                onRefresh={refresh}
              />
            </motion.div>
          )}

          {activeTab === 'transactions' && (
            <motion.div
              key="transactions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <ObjectiveTransactions
                objective={objective}
                transactions={transactions}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
