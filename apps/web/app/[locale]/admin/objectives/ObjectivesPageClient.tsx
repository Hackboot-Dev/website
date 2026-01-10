// /workspaces/website/apps/web/app/[locale]/admin/objectives/ObjectivesPageClient.tsx
// Description: Client component for Objectives & Alerts page
// Last modified: 2026-01-10

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  Plus,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Users,
  Repeat,
  BarChart3,
  Filter,
} from 'lucide-react';
import { useObjectives } from './hooks/useObjectives';
import { useAlerts } from './hooks/useAlerts';
import { ObjectiveCard } from './components/ObjectiveCard';
import { CreateObjectiveWizard } from './components/CreateObjectiveWizard';
import { AlertsPanel } from './components/AlertsPanel';
import { Select } from '../../../../components/ui/Select';
import type { ObjectiveType, ObjectivePeriod, ObjectiveWithProgress, ObjectiveCategory, Objective } from './types';
import { OBJECTIVE_TYPE_LABELS, OBJECTIVE_PERIOD_LABELS, OBJECTIVE_CATEGORY_LABELS } from './types';

export default function ObjectivesPageClient() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [filterType, setFilterType] = useState<ObjectiveType | 'all'>('all');
  const [filterPeriod, setFilterPeriod] = useState<ObjectivePeriod | 'all'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingObjective, setEditingObjective] = useState<ObjectiveWithProgress | null>(null);

  // Use VMCloud by default (could be made dynamic)
  const companyId = 'vmcloud';

  const {
    objectives,
    objectivesWithProgress,
    loading: objectivesLoading,
    error: objectivesError,
    stats,
    createObjective,
    updateObjective,
    deleteObjective,
    refresh: refreshObjectives,
  } = useObjectives({ companyId, year: selectedYear });

  const {
    alerts,
    counts: alertCounts,
    loading: alertsLoading,
    markAsRead,
    markAllAsRead,
    acknowledgeAlert,
    deleteAlert,
    refresh: refreshAlerts,
  } = useAlerts({ companyId, autoRefresh: true });

  // Filter objectives
  const filteredObjectives = objectivesWithProgress.filter((obj) => {
    if (filterType !== 'all' && obj.type !== filterType) return false;
    if (filterPeriod !== 'all' && obj.period !== filterPeriod) return false;
    return true;
  });

  // Handlers
  const handleCreateObjective = async (data: Partial<Objective>) => {
    // Ensure required fields are present
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

  const handleEditObjective = (objective: ObjectiveWithProgress) => {
    setEditingObjective(objective);
    setShowCreateModal(true);
  };

  const handleDeleteObjective = async (objectiveId: string) => {
    if (confirm('Supprimer cet objectif ?')) {
      await deleteObjective(objectiveId);
    }
  };

  const handleRefresh = () => {
    refreshObjectives();
    refreshAlerts();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <Target className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Objectifs & Alertes</h1>
            <p className="text-zinc-500">Suivez vos cibles et recevez des alertes</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            title="Rafraîchir"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
          <button
            onClick={() => {
              setEditingObjective(null);
              setShowCreateModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nouvel objectif
          </button>
        </div>
      </div>

      {/* Year Navigation */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => setSelectedYear((y) => y - 1)}
          className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-xl font-semibold text-white min-w-[80px] text-center">
          {selectedYear}
        </span>
        <button
          onClick={() => setSelectedYear((y) => y + 1)}
          className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4"
        >
          <p className="text-zinc-500 text-sm">Total</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4"
        >
          <p className="text-zinc-500 text-sm">Atteints</p>
          <p className="text-2xl font-bold text-emerald-400">{stats.achieved}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4"
        >
          <p className="text-zinc-500 text-sm">En bonne voie</p>
          <p className="text-2xl font-bold text-blue-400">{stats.onTrack}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4"
        >
          <p className="text-zinc-500 text-sm">À risque</p>
          <p className="text-2xl font-bold text-amber-400">{stats.atRisk}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4"
        >
          <p className="text-zinc-500 text-sm">En retard</p>
          <p className="text-2xl font-bold text-red-400">{stats.behind}</p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Objectives */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-zinc-500" />
              <span className="text-sm text-zinc-500">Filtrer:</span>
            </div>
            <Select
              value={filterType}
              onChange={(value) => setFilterType(value as ObjectiveType | 'all')}
              size="sm"
              className="w-40"
              options={[
                { value: 'all', label: 'Tous les types' },
                ...Object.entries(OBJECTIVE_TYPE_LABELS).map(([value, label]) => ({
                  value,
                  label,
                })),
              ]}
            />
            <Select
              value={filterPeriod}
              onChange={(value) => setFilterPeriod(value as ObjectivePeriod | 'all')}
              size="sm"
              className="w-44"
              options={[
                { value: 'all', label: 'Toutes les périodes' },
                ...Object.entries(OBJECTIVE_PERIOD_LABELS).map(([value, label]) => ({
                  value,
                  label,
                })),
              ]}
            />
          </div>

          {/* Objectives Grid */}
          {objectivesLoading ? (
            <div className="text-center py-12 text-zinc-500">Chargement...</div>
          ) : objectivesError ? (
            <div className="text-center py-12 text-red-400">{objectivesError}</div>
          ) : filteredObjectives.length === 0 ? (
            <div className="text-center py-12">
              <Target className="h-12 w-12 text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-500">Aucun objectif défini</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 text-emerald-400 hover:text-emerald-300 text-sm"
              >
                Créer votre premier objectif
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredObjectives.map((objective) => (
                <ObjectiveCard
                  key={objective.id}
                  objective={objective}
                  onEdit={handleEditObjective}
                  onDelete={handleDeleteObjective}
                />
              ))}
            </div>
          )}
        </div>

        {/* Alerts Panel */}
        <div className="lg:col-span-1">
          <AlertsPanel
            alerts={alerts}
            counts={alertCounts}
            loading={alertsLoading}
            onMarkAsRead={markAsRead}
            onMarkAllAsRead={markAllAsRead}
            onAcknowledge={acknowledgeAlert}
            onDelete={deleteAlert}
          />
        </div>
      </div>

      {/* Create Wizard */}
      <CreateObjectiveWizard
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditingObjective(null);
        }}
        onSubmit={handleCreateObjective}
        existingObjectives={objectives}
        products={[]}
        productCategories={[]}
        clients={[]}
      />
    </div>
  );
}
