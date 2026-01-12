// /workspaces/website/apps/web/app/[locale]/admin/objectives/ObjectivesPageClient.tsx
// Description: Main objectives dashboard page (merged dashboard + objectives list)
// Last modified: 2026-01-11
// COMPLETE FILE

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Target,
  Plus,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  BarChart3,
  Activity,
  Wallet,
} from 'lucide-react';
import { useObjectives } from './hooks/useObjectives';
import { ObjectivesScorecard } from './components/dashboard/ObjectivesScorecard';
import { ObjectivesStatusChart } from './components/dashboard/ObjectivesStatusChart';
import { ObjectivesCategoryBreakdown } from './components/dashboard/ObjectivesCategoryBreakdown';
import { ObjectivesTimeline } from './components/dashboard/ObjectivesTimeline';
import { ObjectivesHeatmap } from './components/dashboard/ObjectivesHeatmap';
import { CreateObjectiveWizard } from './components/CreateObjectiveWizard';
import { ObjectiveCard } from './components/ObjectiveCard';
import { OBJECTIVE_CATEGORY_LABELS } from './types';
import type { ObjectiveCategory, Objective } from './types';

export default function ObjectivesPageClient() {
  const params = useParams();
  const locale = params.locale as string || 'fr';
  const companyId = 'vmcloud';
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedCategory, setSelectedCategory] = useState<ObjectiveCategory | 'all'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { objectivesWithProgress, loading, error, stats, refresh, createObjective } = useObjectives({
    companyId,
    year: selectedYear,
  });

  const years = [currentYear - 1, currentYear, currentYear + 1];

  // Filter out invalid objectives first
  const validObjectives = (objectivesWithProgress || []).filter(obj => obj && obj.status && obj.type);

  // Filter by category
  const filteredObjectives = selectedCategory === 'all'
    ? validObjectives
    : validObjectives.filter(o => {
        if (selectedCategory === 'financial') {
          return o.type.startsWith('revenue') || o.type.startsWith('expenses') || o.type.includes('profit') || o.type.includes('margin');
        }
        if (selectedCategory === 'clients') {
          return o.type.startsWith('clients');
        }
        if (selectedCategory === 'subscriptions') {
          return o.type.startsWith('mrr') || o.type.startsWith('arr') || o.type === 'churn_rate' || o.type === 'arpu';
        }
        return false;
      });

  // Calculate summary metrics
  const summaryMetrics = {
    totalObjectives: filteredObjectives.length,
    achieved: filteredObjectives.filter(o => o.status === 'achieved').length,
    onTrack: filteredObjectives.filter(o => o.status === 'on_track').length,
    atRisk: filteredObjectives.filter(o => o.status === 'at_risk').length,
    behind: filteredObjectives.filter(o => o.status === 'behind').length,
    averageProgress: filteredObjectives.length > 0
      ? filteredObjectives.reduce((sum, o) => sum + o.progressPercent, 0) / filteredObjectives.length
      : 0,
  };

  const formatPercent = (value: number): string => `${value.toFixed(1)}%`;

  // Handle create objective
  const handleCreateObjective = async (data: Partial<Objective>) => {
    if (!data.type || !data.period || !data.year || !data.targetAmount) {
      console.error('Missing required fields for objective creation');
      return;
    }

    await createObjective({
      type: data.type,
      period: data.period,
      year: data.year,
      month: data.month,
      quarter: data.quarter,
      targetAmount: data.targetAmount,
      name: data.name,
      description: data.description,
      category: data.category,
      priority: data.priority,
      targetUnit: data.targetUnit,
      productId: data.productId,
      productName: data.productName,
      productCategoryId: data.productCategoryId,
      productCategoryName: data.productCategoryName,
      clientId: data.clientId,
      clientName: data.clientName,
      clientSegment: data.clientSegment,
      expenseCategory: data.expenseCategory,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-8 w-8 text-zinc-500 animate-spin" />
          <p className="text-zinc-500">Chargement des objectifs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <Target className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Objectifs</h1>
            <p className="text-zinc-500">Vue d'ensemble et suivi de vos objectifs</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Category Filter */}
          <div className="flex items-center gap-1 bg-zinc-800/50 rounded-lg p-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                selectedCategory === 'all' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Tout
            </button>
            {(Object.keys(OBJECTIVE_CATEGORY_LABELS) as ObjectiveCategory[]).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  selectedCategory === cat ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {OBJECTIVE_CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>

          {/* Year Selector */}
          <div className="flex items-center gap-1 bg-zinc-800/50 rounded-lg p-1">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
                  selectedYear === year ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {year}
              </button>
            ))}
          </div>

          <button
            onClick={refresh}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <RefreshCw className="h-5 w-5" />
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nouvel objectif
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-zinc-400" />
            <span className="text-zinc-500 text-xs">Total</span>
          </div>
          <p className="text-2xl font-semibold text-white">{summaryMetrics.totalObjectives}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            <span className="text-zinc-500 text-xs">Atteints</span>
          </div>
          <p className="text-2xl font-semibold text-emerald-400">{summaryMetrics.achieved}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-blue-400" />
            <span className="text-zinc-500 text-xs">En bonne voie</span>
          </div>
          <p className="text-2xl font-semibold text-blue-400">{summaryMetrics.onTrack}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <span className="text-zinc-500 text-xs">À risque</span>
          </div>
          <p className="text-2xl font-semibold text-amber-400">{summaryMetrics.atRisk}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="h-4 w-4 text-red-400" />
            <span className="text-zinc-500 text-xs">En retard</span>
          </div>
          <p className="text-2xl font-semibold text-red-400">{summaryMetrics.behind}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-purple-400" />
            <span className="text-zinc-500 text-xs">Progression moy.</span>
          </div>
          <p className="text-2xl font-semibold text-purple-400">{formatPercent(summaryMetrics.averageProgress)}</p>
        </motion.div>
      </div>

      {/* Objectives List */}
      {filteredObjectives.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Mes objectifs</h2>
            <span className="text-sm text-zinc-500">{filteredObjectives.length} objectif{filteredObjectives.length > 1 ? 's' : ''}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredObjectives.map((objective) => (
              <ObjectiveCard
                key={objective.id}
                objective={objective}
              />
            ))}
          </div>
        </div>
      )}

      {filteredObjectives.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 bg-zinc-900/50 border border-zinc-800 rounded-xl"
        >
          <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
            <Target className="h-8 w-8 text-zinc-600" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Aucun objectif</h3>
          <p className="text-zinc-500 text-center mb-6 max-w-sm">
            {selectedCategory === 'all'
              ? "Vous n'avez pas encore créé d'objectifs pour cette année."
              : `Aucun objectif dans la catégorie "${OBJECTIVE_CATEGORY_LABELS[selectedCategory as ObjectiveCategory]}".`}
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            Créer un objectif
          </button>
        </motion.div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ObjectivesStatusChart objectives={filteredObjectives} />
        <ObjectivesCategoryBreakdown objectives={filteredObjectives} />
      </div>

      {/* Scorecard */}
      <ObjectivesScorecard objectives={filteredObjectives} />

      {/* Heatmap */}
      <ObjectivesHeatmap objectives={filteredObjectives} year={selectedYear} />

      {/* Timeline */}
      <ObjectivesTimeline objectives={filteredObjectives} />

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href={`/${locale}/admin/objectives/budgets`}
          className="flex items-center gap-4 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors group"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <Wallet className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-white font-medium group-hover:text-emerald-400 transition-colors">Budgets</p>
            <p className="text-zinc-500 text-sm">Suivi des enveloppes budgétaires</p>
          </div>
        </Link>

        <Link
          href={`/${locale}/admin/pnl`}
          className="flex items-center gap-4 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors group"
        >
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <p className="text-white font-medium group-hover:text-purple-400 transition-colors">Voir le P&L</p>
            <p className="text-zinc-500 text-sm">Transactions et résultats</p>
          </div>
        </Link>
      </div>

      {/* Create Objective Modal */}
      <CreateObjectiveWizard
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={async (data) => {
          await handleCreateObjective(data);
          setShowCreateModal(false);
        }}
        companyId={companyId}
      />
    </div>
  );
}
