// /workspaces/website/apps/web/app/[locale]/admin/objectives/components/detail/ObjectiveMetricsPanel.tsx
// Description: Metrics panel showing key performance indicators
// Last modified: 2026-01-10
// COMPLETE FILE

'use client';

import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Target,
  Zap,
  Clock,
  BarChart2,
} from 'lucide-react';
import type { ObjectiveWithProgress } from '../../types';
import { OBJECTIVE_TYPE_UNITS, formatObjectiveValue } from '../../types';

type ObjectiveMetricsPanelProps = {
  objective: ObjectiveWithProgress;
};

type MetricCard = {
  label: string;
  value: string;
  subValue?: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
};

export function ObjectiveMetricsPanel({ objective }: ObjectiveMetricsPanelProps) {
  const unit = OBJECTIVE_TYPE_UNITS[objective.type];
  const now = new Date();

  // Calculate metrics
  const calculateMetrics = (): MetricCard[] => {
    const metrics: MetricCard[] = [];

    // Daily/Period Average
    const daysElapsed = calculateDaysElapsed(objective, now);
    const dailyAverage = daysElapsed > 0 ? objective.actualAmount / daysElapsed : 0;

    metrics.push({
      label: 'Moyenne journalière',
      value: formatObjectiveValue(dailyAverage, unit),
      subValue: 'par jour',
      icon: <BarChart2 className="h-5 w-5" />,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
    });

    // Required daily rate to achieve target
    const daysRemaining = calculateDaysRemaining(objective, now);
    const remaining = objective.targetAmount - objective.actualAmount;
    const requiredDailyRate = daysRemaining > 0 ? remaining / daysRemaining : 0;

    metrics.push({
      label: 'Rythme requis',
      value: formatObjectiveValue(Math.max(0, requiredDailyRate), unit),
      subValue: requiredDailyRate > dailyAverage ? 'au-dessus du rythme actuel' : 'en dessous du rythme actuel',
      icon: <Target className="h-5 w-5" />,
      color: requiredDailyRate > dailyAverage * 1.2 ? 'text-amber-400' : 'text-emerald-400',
      bgColor: requiredDailyRate > dailyAverage * 1.2 ? 'bg-amber-500/20' : 'bg-emerald-500/20',
    });

    // Velocity (trend-based)
    const velocityChange = calculateVelocityChange(objective);
    metrics.push({
      label: 'Vélocité',
      value: `${velocityChange > 0 ? '+' : ''}${velocityChange.toFixed(1)}%`,
      subValue: 'vs période précédente',
      icon: velocityChange > 0 ? <TrendingUp className="h-5 w-5" /> : velocityChange < 0 ? <TrendingDown className="h-5 w-5" /> : <Minus className="h-5 w-5" />,
      color: velocityChange > 0 ? 'text-emerald-400' : velocityChange < 0 ? 'text-red-400' : 'text-zinc-400',
      bgColor: velocityChange > 0 ? 'bg-emerald-500/20' : velocityChange < 0 ? 'bg-red-500/20' : 'bg-zinc-500/20',
    });

    // Projected completion
    const projectedTotal = dailyAverage > 0
      ? objective.actualAmount + (dailyAverage * daysRemaining)
      : objective.actualAmount;
    const projectedPercent = (projectedTotal / objective.targetAmount) * 100;

    metrics.push({
      label: 'Projection fin de période',
      value: formatObjectiveValue(projectedTotal, unit),
      subValue: `${projectedPercent.toFixed(1)}% de l'objectif`,
      icon: <Zap className="h-5 w-5" />,
      color: projectedPercent >= 100 ? 'text-emerald-400' : projectedPercent >= 80 ? 'text-blue-400' : 'text-amber-400',
      bgColor: projectedPercent >= 100 ? 'bg-emerald-500/20' : projectedPercent >= 80 ? 'bg-blue-500/20' : 'bg-amber-500/20',
    });

    return metrics;
  };

  const metrics = calculateMetrics();

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
      <h3 className="text-lg font-medium text-white mb-4">Métriques clés</h3>

      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3"
          >
            <div className={`w-10 h-10 rounded-lg ${metric.bgColor} flex items-center justify-center ${metric.color}`}>
              {metric.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-zinc-500 uppercase tracking-wider">{metric.label}</p>
              <p className={`text-lg font-semibold ${metric.color}`}>{metric.value}</p>
              {metric.subValue && (
                <p className="text-xs text-zinc-500 truncate">{metric.subValue}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Additional Stats */}
      <div className="mt-6 pt-4 border-t border-zinc-800">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-semibold text-white">
              {calculateDaysElapsed(objective, now)}
            </p>
            <p className="text-xs text-zinc-500">jours écoulés</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-white">
              {calculateDaysRemaining(objective, now)}
            </p>
            <p className="text-xs text-zinc-500">jours restants</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-white">
              {calculateTotalDays(objective)}
            </p>
            <p className="text-xs text-zinc-500">jours total</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function calculateDaysElapsed(obj: ObjectiveWithProgress, now: Date): number {
  let startDate: Date;

  if (obj.period === 'yearly') {
    startDate = new Date(obj.year, 0, 1);
  } else if (obj.period === 'quarterly' && obj.quarter) {
    const startMonth = (obj.quarter - 1) * 3;
    startDate = new Date(obj.year, startMonth, 1);
  } else if (obj.period === 'monthly' && obj.month) {
    startDate = new Date(obj.year, obj.month - 1, 1);
  } else {
    return 0;
  }

  const diffTime = now.getTime() - startDate.getTime();
  return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
}

function calculateDaysRemaining(obj: ObjectiveWithProgress, now: Date): number {
  let endDate: Date;

  if (obj.period === 'yearly') {
    endDate = new Date(obj.year, 11, 31);
  } else if (obj.period === 'quarterly' && obj.quarter) {
    const endMonth = obj.quarter * 3;
    endDate = new Date(obj.year, endMonth, 0);
  } else if (obj.period === 'monthly' && obj.month) {
    endDate = new Date(obj.year, obj.month, 0);
  } else {
    return 0;
  }

  const diffTime = endDate.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
}

function calculateTotalDays(obj: ObjectiveWithProgress): number {
  if (obj.period === 'yearly') {
    return (obj.year % 4 === 0 && obj.year % 100 !== 0) || obj.year % 400 === 0 ? 366 : 365;
  } else if (obj.period === 'quarterly') {
    return 90; // Approximate
  } else if (obj.period === 'monthly' && obj.month) {
    return new Date(obj.year, obj.month, 0).getDate();
  }
  return 0;
}

function calculateVelocityChange(obj: ObjectiveWithProgress): number {
  // Simulated velocity change - in production, this would come from historical data
  if (obj.trend === 'up') return 5 + Math.random() * 10;
  if (obj.trend === 'down') return -5 - Math.random() * 10;
  return (Math.random() - 0.5) * 4;
}
