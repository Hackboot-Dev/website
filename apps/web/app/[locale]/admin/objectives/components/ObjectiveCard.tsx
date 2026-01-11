// /workspaces/website/apps/web/app/[locale]/admin/objectives/components/ObjectiveCard.tsx
// Description: Card component for displaying an objective with progress
// Last modified: 2026-01-11

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  TrendingUp,
  TrendingDown,
  Repeat,
  Users,
  PiggyBank,
  BarChart3,
  Trash2,
  Edit2,
  Target,
  ExternalLink,
} from 'lucide-react';
import type { ObjectiveWithProgress, ObjectiveType } from '../types';
import {
  OBJECTIVE_TYPE_LABELS,
  OBJECTIVE_STATUS_CONFIG,
  OBJECTIVE_TYPE_UNITS,
  MONTHS_FR,
  QUARTERS_FR,
  formatObjectiveValue,
} from '../types';

type ObjectiveCardProps = {
  objective: ObjectiveWithProgress;
  onEdit?: (objective: ObjectiveWithProgress) => void;
  onDelete?: (objectiveId: string) => void;
};

const TYPE_ICONS: Record<ObjectiveType, React.ReactNode> = {
  // Financial - Revenue
  revenue_total: <TrendingUp className="h-5 w-5" />,
  revenue_product: <TrendingUp className="h-5 w-5" />,
  revenue_category: <TrendingUp className="h-5 w-5" />,
  revenue_client: <TrendingUp className="h-5 w-5" />,
  revenue_segment: <TrendingUp className="h-5 w-5" />,
  // Financial - Expenses
  expenses_total: <TrendingDown className="h-5 w-5" />,
  expenses_category: <TrendingDown className="h-5 w-5" />,
  // Financial - Profit
  gross_profit: <BarChart3 className="h-5 w-5" />,
  net_profit: <PiggyBank className="h-5 w-5" />,
  gross_margin_pct: <BarChart3 className="h-5 w-5" />,
  net_margin_pct: <BarChart3 className="h-5 w-5" />,
  // Clients
  clients_total: <Users className="h-5 w-5" />,
  clients_new: <Users className="h-5 w-5" />,
  clients_retention: <Users className="h-5 w-5" />,
  clients_segment: <Users className="h-5 w-5" />,
  // Subscriptions
  mrr_total: <Repeat className="h-5 w-5" />,
  mrr_growth: <Repeat className="h-5 w-5" />,
  arr_total: <Repeat className="h-5 w-5" />,
  churn_rate: <Repeat className="h-5 w-5" />,
  arpu: <Repeat className="h-5 w-5" />,
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('fr-FR').format(value);
}

export function ObjectiveCard({ objective, onEdit, onDelete }: ObjectiveCardProps) {
  const params = useParams();
  const locale = params.locale as string || 'fr';
  const statusConfig = OBJECTIVE_STATUS_CONFIG[objective.status];
  const unit = OBJECTIVE_TYPE_UNITS[objective.type] || 'currency';

  const getPeriodLabel = (): string => {
    if (objective.period === 'yearly') return `Année ${objective.year}`;
    if (objective.period === 'quarterly' && objective.quarter) {
      return `${QUARTERS_FR[objective.quarter - 1]} ${objective.year}`;
    }
    if (objective.period === 'monthly' && objective.month) {
      return `${MONTHS_FR[objective.month - 1]} ${objective.year}`;
    }
    return `${objective.year}`;
  };

  const progressWidth = Math.min(100, Math.max(0, objective.progressPercent));

  return (
    <Link href={`/${locale}/admin/objectives/${objective.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors cursor-pointer"
      >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
            {TYPE_ICONS[objective.type]}
          </div>
          <div>
            <h3 className="text-white font-medium">
              {objective.name || OBJECTIVE_TYPE_LABELS[objective.type]}
            </h3>
            <p className="text-zinc-500 text-sm">{getPeriodLabel()}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {onEdit && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(objective); }}
              className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <Edit2 className="h-4 w-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(objective.id); }}
              className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Actuel</p>
            <p className="text-2xl font-semibold text-white">
              {formatObjectiveValue(objective.actualAmount, unit)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Objectif</p>
            <p className="text-lg text-zinc-400">
              {formatObjectiveValue(objective.targetAmount, unit)}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative">
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressWidth}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                objective.status === 'achieved'
                  ? 'bg-emerald-500'
                  : objective.status === 'on_track'
                  ? 'bg-blue-500'
                  : objective.status === 'at_risk'
                  ? 'bg-amber-500'
                  : 'bg-red-500'
              }`}
            />
          </div>
          {/* Target marker at 100% */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-zinc-600" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1">
          <span className={`text-sm font-medium ${statusConfig.color}`}>
            {objective.progressPercent.toFixed(1)}%
          </span>
          <span
            className={`text-xs px-2 py-1 rounded-full ${statusConfig.bgColor} ${statusConfig.color}`}
          >
            {statusConfig.label}
          </span>
        </div>
      </div>

      {/* Description */}
      {objective.description && (
        <p className="text-zinc-500 text-sm mt-3 pt-3 border-t border-zinc-800">
          {objective.description}
        </p>
      )}

      {/* View Details Indicator */}
      <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-zinc-800 text-sm text-zinc-400 group-hover:text-white transition-colors">
        Voir les détails
        <ExternalLink className="h-4 w-4" />
      </div>
      </motion.div>
    </Link>
  );
}
