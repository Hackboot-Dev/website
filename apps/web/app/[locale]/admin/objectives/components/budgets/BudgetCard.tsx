// /workspaces/website/apps/web/app/[locale]/admin/objectives/components/budgets/BudgetCard.tsx
// Description: Card component for displaying a budget with progress
// Last modified: 2026-01-10
// COMPLETE FILE

'use client';

import { motion } from 'framer-motion';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Trash2,
  Edit2,
  MoreVertical,
} from 'lucide-react';
import { useState } from 'react';
import type { BudgetWithProgress } from '../../hooks/useBudgets';
import { BUDGET_CATEGORY_CONFIG } from '../../hooks/useBudgets';

type BudgetCardProps = {
  budget: BudgetWithProgress;
  onEdit?: (budget: BudgetWithProgress) => void;
  onDelete?: (budgetId: string) => void;
  delay?: number;
};

export function BudgetCard({ budget, onEdit, onDelete, delay = 0 }: BudgetCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const categoryConfig = BUDGET_CATEGORY_CONFIG[budget.category];

  const formatCurrency = (value: number): string => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M€`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}k€`;
    return `${value.toFixed(0)}€`;
  };

  const getStatusConfig = () => {
    switch (budget.status) {
      case 'on_track':
        return { label: 'En bonne voie', color: 'text-emerald-400', bgColor: 'bg-emerald-500/20', icon: CheckCircle };
      case 'at_risk':
        return { label: 'À surveiller', color: 'text-amber-400', bgColor: 'bg-amber-500/20', icon: AlertTriangle };
      case 'exceeded':
        return { label: 'Dépassé', color: 'text-red-400', bgColor: 'bg-red-500/20', icon: AlertTriangle };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  const progressWidth = Math.min(100, budget.spentPercent);
  const projectionWidth = Math.min(100, (budget.projectedTotal / budget.totalAmount) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors relative"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg ${categoryConfig.bgColor} flex items-center justify-center`}>
            <Wallet className={`h-5 w-5 ${categoryConfig.color}`} />
          </div>
          <div>
            <h3 className="text-white font-medium">{budget.name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-xs px-2 py-0.5 rounded-full ${categoryConfig.bgColor} ${categoryConfig.color}`}>
                {categoryConfig.label}
              </span>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-full mt-1 w-40 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-20 py-1">
                {onEdit && (
                  <button
                    onClick={() => {
                      onEdit(budget);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                    Modifier
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => {
                      onDelete(budget.id);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-zinc-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    Supprimer
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Amounts */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Consommé</p>
          <p className="text-xl font-semibold text-white">{formatCurrency(budget.spentAmount)}</p>
        </div>
        <div className="text-right">
          <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Budget</p>
          <p className="text-lg text-zinc-400">{formatCurrency(budget.totalAmount)}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2 mb-4">
        <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden">
          {/* Projection indicator */}
          {budget.willExceed && (
            <div
              className="absolute h-full bg-red-500/20 rounded-full"
              style={{ width: `${projectionWidth}%` }}
            />
          )}
          {/* Actual progress */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressWidth}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`h-full rounded-full ${
              budget.status === 'exceeded'
                ? 'bg-red-500'
                : budget.status === 'at_risk'
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${statusConfig.color}`}>
            {budget.spentPercent.toFixed(1)}% utilisé
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${statusConfig.bgColor} ${statusConfig.color} flex items-center gap-1`}>
            <StatusIcon className="h-3 w-3" />
            {statusConfig.label}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="pt-3 border-t border-zinc-800 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-500">Restant</span>
          <span className={budget.remainingAmount < 0 ? 'text-red-400' : 'text-white'}>
            {formatCurrency(budget.remainingAmount)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-500">Moyenne mensuelle</span>
          <span className="text-zinc-300">{formatCurrency(budget.monthlyAverage)}/mois</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-500">Projection fin d'année</span>
          <span className={budget.willExceed ? 'text-red-400' : 'text-emerald-400'}>
            {formatCurrency(budget.projectedTotal)}
            {budget.willExceed && (
              <TrendingUp className="inline h-3 w-3 ml-1" />
            )}
          </span>
        </div>
      </div>

      {/* Warning for at-risk budgets */}
      {budget.willExceed && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="text-red-400 font-medium">Dépassement prévu</p>
              <p className="text-red-400/70 mt-0.5">
                +{formatCurrency(budget.projectedTotal - budget.totalAmount)} au-delà du budget
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Description */}
      {budget.description && (
        <p className="text-zinc-500 text-xs mt-3 pt-3 border-t border-zinc-800">
          {budget.description}
        </p>
      )}
    </motion.div>
  );
}
