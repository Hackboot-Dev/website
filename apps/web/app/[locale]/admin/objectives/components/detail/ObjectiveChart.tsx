// /workspaces/website/apps/web/app/[locale]/admin/objectives/components/detail/ObjectiveChart.tsx
// Description: Line chart showing objective progression over time
// Last modified: 2026-01-10
// COMPLETE FILE

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { BarChart2, TrendingUp, Layers } from 'lucide-react';
import type { ObjectiveWithProgress } from '../../types';
import type { HistoricalDataPoint } from '../../hooks/useObjectiveDetail';
import { OBJECTIVE_TYPE_UNITS, formatObjectiveValue } from '../../types';

type ObjectiveChartProps = {
  objective: ObjectiveWithProgress;
  historicalData: HistoricalDataPoint[];
  showComparison?: boolean;
};

type ChartMode = 'cumulative' | 'daily' | 'comparison';

export function ObjectiveChart({
  objective,
  historicalData,
  showComparison = false,
}: ObjectiveChartProps) {
  const [chartMode, setChartMode] = useState<ChartMode>('cumulative');
  const unit = OBJECTIVE_TYPE_UNITS[objective.type];

  const formatValue = (value: number): string => {
    if (unit === 'currency') {
      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
      return value.toFixed(0);
    }
    if (unit === 'percent') return `${value.toFixed(1)}%`;
    return value.toFixed(0);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 shadow-xl">
        <p className="text-zinc-400 text-sm mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {formatObjectiveValue(entry.value, unit)}
          </p>
        ))}
      </div>
    );
  };

  const modes: { id: ChartMode; label: string; icon: React.ReactNode }[] = [
    { id: 'cumulative', label: 'Cumulatif', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'daily', label: 'Par période', icon: <BarChart2 className="h-4 w-4" /> },
    ...(showComparison ? [{ id: 'comparison' as ChartMode, label: 'Comparaison', icon: <Layers className="h-4 w-4" /> }] : []),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-white">Évolution</h3>
        <div className="flex items-center gap-1 bg-zinc-800/50 rounded-lg p-1">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setChartMode(mode.id)}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors
                ${chartMode === mode.id
                  ? 'bg-zinc-700 text-white'
                  : 'text-zinc-400 hover:text-white'
                }
              `}
            >
              {mode.icon}
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartMode === 'cumulative' ? (
            <AreaChart data={historicalData}>
              <defs>
                <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis
                dataKey="label"
                stroke="#71717a"
                tick={{ fill: '#71717a', fontSize: 12 }}
                axisLine={{ stroke: '#3f3f46' }}
              />
              <YAxis
                stroke="#71717a"
                tick={{ fill: '#71717a', fontSize: 12 }}
                axisLine={{ stroke: '#3f3f46' }}
                tickFormatter={formatValue}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: 20 }}
                formatter={(value) => <span className="text-zinc-400 text-sm">{value}</span>}
              />
              <ReferenceLine
                y={objective.targetAmount}
                stroke="#f59e0b"
                strokeDasharray="5 5"
                label={{
                  value: 'Objectif',
                  fill: '#f59e0b',
                  fontSize: 12,
                  position: 'right',
                }}
              />
              <Area
                type="monotone"
                dataKey="cumulative"
                name="Cumulatif"
                stroke="#3b82f6"
                fill="url(#actualGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          ) : chartMode === 'daily' ? (
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis
                dataKey="label"
                stroke="#71717a"
                tick={{ fill: '#71717a', fontSize: 12 }}
                axisLine={{ stroke: '#3f3f46' }}
              />
              <YAxis
                stroke="#71717a"
                tick={{ fill: '#71717a', fontSize: 12 }}
                axisLine={{ stroke: '#3f3f46' }}
                tickFormatter={formatValue}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: 20 }}
                formatter={(value) => <span className="text-zinc-400 text-sm">{value}</span>}
              />
              <ReferenceLine
                y={historicalData.length > 0 ? historicalData[0].target : 0}
                stroke="#f59e0b"
                strokeDasharray="5 5"
                label={{
                  value: 'Cible journalière',
                  fill: '#f59e0b',
                  fontSize: 12,
                  position: 'right',
                }}
              />
              <Line
                type="monotone"
                dataKey="actual"
                name="Réel"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, fill: '#3b82f6' }}
              />
              <Line
                type="monotone"
                dataKey="target"
                name="Cible"
                stroke="#71717a"
                strokeDasharray="5 5"
                strokeWidth={1}
                dot={false}
              />
            </LineChart>
          ) : (
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis
                dataKey="label"
                stroke="#71717a"
                tick={{ fill: '#71717a', fontSize: 12 }}
                axisLine={{ stroke: '#3f3f46' }}
              />
              <YAxis
                stroke="#71717a"
                tick={{ fill: '#71717a', fontSize: 12 }}
                axisLine={{ stroke: '#3f3f46' }}
                tickFormatter={formatValue}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: 20 }}
                formatter={(value) => <span className="text-zinc-400 text-sm">{value}</span>}
              />
              <Line
                type="monotone"
                dataKey="cumulative"
                name="Cette période"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="target"
                name="Période précédente"
                stroke="#8b5cf6"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-zinc-800">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-lg font-semibold text-white">
              {formatObjectiveValue(objective.actualAmount, unit)}
            </p>
            <p className="text-xs text-zinc-500">Actuel</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-white">
              {formatObjectiveValue(objective.targetAmount, unit)}
            </p>
            <p className="text-xs text-zinc-500">Objectif</p>
          </div>
          <div>
            <p className={`text-lg font-semibold ${
              objective.progressPercent >= 100 ? 'text-emerald-400' : 'text-blue-400'
            }`}>
              {objective.progressPercent.toFixed(1)}%
            </p>
            <p className="text-xs text-zinc-500">Progression</p>
          </div>
          <div>
            <p className={`text-lg font-semibold ${
              objective.actualAmount >= objective.targetAmount ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {formatObjectiveValue(Math.abs(objective.targetAmount - objective.actualAmount), unit)}
            </p>
            <p className="text-xs text-zinc-500">
              {objective.actualAmount >= objective.targetAmount ? 'Dépassement' : 'Reste'}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
