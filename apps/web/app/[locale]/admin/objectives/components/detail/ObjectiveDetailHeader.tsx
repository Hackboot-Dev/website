// /workspaces/website/apps/web/app/[locale]/admin/objectives/components/detail/ObjectiveDetailHeader.tsx
// Description: Header component for objective detail page
// Last modified: 2026-01-10
// COMPLETE FILE

'use client';

import { motion } from 'framer-motion';
import {
  RefreshCw,
  Download,
  Edit2,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Target,
  Clock,
} from 'lucide-react';
import type { ObjectiveWithProgress } from '../../types';
import {
  OBJECTIVE_TYPE_LABELS,
  OBJECTIVE_STATUS_CONFIG,
  OBJECTIVE_TYPE_UNITS,
  PRIORITY_CONFIG,
  MONTHS_FR,
  QUARTERS_FR,
  formatObjectiveValue,
} from '../../types';

type ObjectiveDetailHeaderProps = {
  objective: ObjectiveWithProgress;
  onRefresh?: () => void;
  onEdit?: () => void;
  onExport?: () => void;
};

export function ObjectiveDetailHeader({
  objective,
  onRefresh,
  onEdit,
  onExport,
}: ObjectiveDetailHeaderProps) {
  const statusConfig = OBJECTIVE_STATUS_CONFIG[objective.status];
  const priorityConfig = PRIORITY_CONFIG[objective.priority];
  const unit = OBJECTIVE_TYPE_UNITS[objective.type];

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

  const getDaysRemaining = (): number => {
    const now = new Date();
    let endDate: Date;

    if (objective.period === 'yearly') {
      endDate = new Date(objective.year, 11, 31);
    } else if (objective.period === 'quarterly' && objective.quarter) {
      const endMonth = objective.quarter * 3;
      endDate = new Date(objective.year, endMonth, 0);
    } else if (objective.period === 'monthly' && objective.month) {
      endDate = new Date(objective.year, objective.month, 0);
    } else {
      return 0;
    }

    const diffTime = endDate.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  const trendIcon = objective.trend === 'up'
    ? <TrendingUp className="h-4 w-4 text-emerald-400" />
    : objective.trend === 'down'
    ? <TrendingDown className="h-4 w-4 text-red-400" />
    : <Minus className="h-4 w-4 text-zinc-400" />;

  const daysRemaining = getDaysRemaining();

  return (
    <div className="space-y-6">
      {/* Title Row */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-semibold text-white">
              {objective.name || OBJECTIVE_TYPE_LABELS[objective.type]}
            </h1>
            <span className={`text-xs px-2.5 py-1 rounded-full ${statusConfig.bgColor} ${statusConfig.color} font-medium`}>
              {statusConfig.label}
            </span>
            <span className={`text-xs px-2.5 py-1 rounded-full ${priorityConfig.bgColor} ${priorityConfig.color}`}>
              {priorityConfig.label}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {getPeriodLabel()}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {daysRemaining > 0 ? `${daysRemaining} jours restants` : 'Période terminée'}
            </span>
            <span className="flex items-center gap-1.5">
              {trendIcon}
              {objective.trend === 'up' ? 'En hausse' : objective.trend === 'down' ? 'En baisse' : 'Stable'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
              title="Actualiser"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          )}
          {onExport && (
            <button
              onClick={onExport}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
              title="Exporter PDF"
            >
              <Download className="h-5 w-5" />
            </button>
          )}
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
            >
              <Edit2 className="h-4 w-4" />
              Modifier
            </button>
          )}
        </div>
      </div>

      {/* Progress Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Actual */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4"
        >
          <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Actuel</p>
          <p className="text-2xl font-semibold text-white">
            {formatObjectiveValue(objective.actualAmount, unit)}
          </p>
        </motion.div>

        {/* Target */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4"
        >
          <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Objectif</p>
          <p className="text-2xl font-semibold text-zinc-300">
            {formatObjectiveValue(objective.targetAmount, unit)}
          </p>
        </motion.div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4"
        >
          <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Progression</p>
          <p className={`text-2xl font-semibold ${statusConfig.color}`}>
            {objective.progressPercent.toFixed(1)}%
          </p>
        </motion.div>

        {/* Gap */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4"
        >
          <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Écart</p>
          <p className={`text-2xl font-semibold ${
            objective.actualAmount >= objective.targetAmount ? 'text-emerald-400' : 'text-zinc-300'
          }`}>
            {objective.actualAmount >= objective.targetAmount
              ? `+${formatObjectiveValue(objective.actualAmount - objective.targetAmount, unit)}`
              : `-${formatObjectiveValue(objective.targetAmount - objective.actualAmount, unit)}`
            }
          </p>
        </motion.div>
      </div>

      {/* Large Progress Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="relative"
      >
        <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, objective.progressPercent)}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full rounded-full ${
              objective.status === 'achieved'
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                : objective.status === 'on_track'
                ? 'bg-gradient-to-r from-blue-600 to-blue-400'
                : objective.status === 'at_risk'
                ? 'bg-gradient-to-r from-amber-600 to-amber-400'
                : 'bg-gradient-to-r from-red-600 to-red-400'
            }`}
          />
        </div>
        {/* Target marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-1 h-5 bg-white/50 rounded-full"
          style={{ left: '100%', transform: 'translateX(-50%) translateY(-50%)' }}
        />
        {/* Expected progress marker */}
        {objective.expectedProgress && (
          <div
            className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-zinc-500"
            style={{ left: `${objective.expectedProgress}%` }}
            title={`Progression attendue: ${objective.expectedProgress.toFixed(1)}%`}
          />
        )}
      </motion.div>

      {/* Description */}
      {objective.description && (
        <p className="text-zinc-400 text-sm">{objective.description}</p>
      )}
    </div>
  );
}
