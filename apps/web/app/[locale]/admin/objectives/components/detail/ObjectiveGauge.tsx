// /workspaces/website/apps/web/app/[locale]/admin/objectives/components/detail/ObjectiveGauge.tsx
// Description: Radial gauge showing objective progress
// Last modified: 2026-01-10
// COMPLETE FILE

'use client';

import { motion } from 'framer-motion';
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
} from 'recharts';
import { Target, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { ObjectiveWithProgress } from '../../types';
import { OBJECTIVE_STATUS_CONFIG, formatObjectiveValue, OBJECTIVE_TYPE_UNITS } from '../../types';

type ObjectiveGaugeProps = {
  objective: ObjectiveWithProgress;
};

export function ObjectiveGauge({ objective }: ObjectiveGaugeProps) {
  const statusConfig = OBJECTIVE_STATUS_CONFIG[objective.status];
  const unit = OBJECTIVE_TYPE_UNITS[objective.type];
  const progressPercent = Math.min(100, objective.progressPercent);

  const getGaugeColor = () => {
    if (objective.status === 'achieved') return '#10b981';
    if (objective.status === 'on_track') return '#3b82f6';
    if (objective.status === 'at_risk') return '#f59e0b';
    return '#ef4444';
  };

  const data = [
    {
      name: 'Progress',
      value: progressPercent,
      fill: getGaugeColor(),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 h-full flex flex-col"
    >
      <h3 className="text-lg font-medium text-white mb-4">Progression</h3>

      {/* Gauge */}
      <div className="flex-1 flex items-center justify-center relative">
        <div className="w-48 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="70%"
              outerRadius="100%"
              barSize={12}
              data={data}
              startAngle={180}
              endAngle={0}
            >
              <PolarAngleAxis
                type="number"
                domain={[0, 100]}
                angleAxisId={0}
                tick={false}
              />
              <RadialBar
                background={{ fill: '#27272a' }}
                dataKey="value"
                cornerRadius={10}
                fill={getGaugeColor()}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-bold ${statusConfig.color}`}>
            {objective.progressPercent.toFixed(0)}%
          </span>
          <span className="text-zinc-500 text-sm mt-1">
            {statusConfig.label}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-400">Actuel</span>
          <span className="text-white font-medium">
            {formatObjectiveValue(objective.actualAmount, unit)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-400">Objectif</span>
          <span className="text-zinc-300">
            {formatObjectiveValue(objective.targetAmount, unit)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm pt-2 border-t border-zinc-800">
          <span className="text-zinc-400">Tendance</span>
          <span className="flex items-center gap-1">
            {objective.trend === 'up' ? (
              <>
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-400">Hausse</span>
              </>
            ) : objective.trend === 'down' ? (
              <>
                <TrendingDown className="h-4 w-4 text-red-400" />
                <span className="text-red-400">Baisse</span>
              </>
            ) : (
              <>
                <Minus className="h-4 w-4 text-zinc-400" />
                <span className="text-zinc-400">Stable</span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* Achievement Indicator */}
      {objective.status === 'achieved' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-center"
        >
          <Target className="h-5 w-5 text-emerald-400 mx-auto mb-1" />
          <p className="text-emerald-400 text-sm font-medium">Objectif atteint !</p>
        </motion.div>
      )}
    </motion.div>
  );
}
