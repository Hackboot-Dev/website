// /workspaces/website/apps/web/app/[locale]/admin/objectives/budgets/BudgetsPageClient.tsx
// Description: Main client component for budgets management
// Last modified: 2026-01-11
// COMPLETE FILE

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Plus,
  Wallet,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { useBudgets } from '../hooks/useBudgets';
import { BudgetCard } from '../components/budgets/BudgetCard';
import { CreateBudgetWizard } from '../components/budgets/CreateBudgetWizard';

export function BudgetsPageClient() {
  const params = useParams();
  const locale = params.locale as string || 'fr';
  const companyId = 'vmcloud';
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [showCreateWizard, setShowCreateWizard] = useState(false);

  const { budgets, loading, error, stats, refresh, createBudget, deleteBudget } = useBudgets({
    companyId,
    year: selectedYear,
  });

  const years = [currentYear - 1, currentYear, currentYear + 1];

  const formatCurrency = (value: number): string => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M€`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}k€`;
    return `${value.toFixed(0)}€`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-8 w-8 text-zinc-500 animate-spin" />
          <p className="text-zinc-500">Chargement des budgets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={`/${locale}/admin/objectives`}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <Wallet className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Budgets</h1>
            <p className="text-zinc-500">Suivi des enveloppes budgétaires</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Year Selector */}
          <div className="flex items-center gap-1 bg-zinc-800/50 rounded-lg p-1">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
                  selectedYear === year
                    ? 'bg-zinc-700 text-white'
                    : 'text-zinc-400 hover:text-white'
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
            onClick={() => setShowCreateWizard(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nouveau budget
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="h-4 w-4 text-blue-400" />
            <span className="text-zinc-500 text-xs">Budget total</span>
          </div>
          <p className="text-2xl font-semibold text-white">{formatCurrency(stats.totalAllocated)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <span className="text-zinc-500 text-xs">Consommé</span>
          </div>
          <p className="text-2xl font-semibold text-emerald-400">{formatCurrency(stats.totalSpent)}</p>
          <p className="text-xs text-zinc-500 mt-1">{stats.spentPercent.toFixed(1)}% du budget</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="h-4 w-4 text-amber-400" />
            <span className="text-zinc-500 text-xs">Restant</span>
          </div>
          <p className="text-2xl font-semibold text-amber-400">{formatCurrency(stats.totalRemaining)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className={`h-4 w-4 ${stats.atRisk > 0 ? 'text-red-400' : 'text-zinc-400'}`} />
            <span className="text-zinc-500 text-xs">À risque</span>
          </div>
          <p className={`text-2xl font-semibold ${stats.atRisk > 0 ? 'text-red-400' : 'text-white'}`}>
            {stats.atRisk}
          </p>
        </motion.div>
      </div>

      {/* Budgets Grid */}
      {budgets.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-zinc-900/50 border border-zinc-800 rounded-xl"
        >
          <Wallet className="h-16 w-16 text-zinc-700 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-white mb-2">Aucun budget pour {selectedYear}</h2>
          <p className="text-zinc-500 max-w-md mx-auto mb-6">
            Créez votre premier budget pour commencer à suivre vos dépenses par catégorie.
          </p>
          <button
            onClick={() => setShowCreateWizard(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
          >
            <Plus className="h-5 w-5" />
            Créer un budget
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((budget, index) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              onDelete={() => deleteBudget(budget.id)}
              delay={index * 0.05}
            />
          ))}
        </div>
      )}

      {/* Create Budget Wizard */}
      <AnimatePresence>
        {showCreateWizard && (
          <CreateBudgetWizard
            year={selectedYear}
            onClose={() => setShowCreateWizard(false)}
            onCreate={async (data) => {
              await createBudget(data);
              setShowCreateWizard(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
