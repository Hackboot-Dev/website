// /workspaces/website/apps/web/app/[locale]/admin/objectives/components/dashboard/ObjectivesHeatmap.tsx
// Description: Heatmap showing performance by month
// Last modified: 2026-01-10
// COMPLETE FILE

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Grid, Calendar } from 'lucide-react';
import type { ObjectiveWithProgress } from '../../types';
import { MONTHS_FR } from '../../types';

type ObjectivesHeatmapProps = {
  objectives: ObjectiveWithProgress[];
  year: number;
};

export function ObjectivesHeatmap({ objectives, year }: ObjectivesHeatmapProps) {
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

  // Filter out invalid objectives
  const validObjectives = (objectives || []).filter(obj => obj && obj.status && obj.type);

  // Calculate performance by month
  const monthlyPerformance = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const monthObjectives = validObjectives.filter(
      o => o.period === 'monthly' && o.month === month
    );

    if (monthObjectives.length === 0) {
      return { month, avgProgress: null, count: 0, achieved: 0 };
    }

    const avgProgress = monthObjectives.reduce((sum, o) => sum + o.progressPercent, 0) / monthObjectives.length;
    const achieved = monthObjectives.filter(o => o.status === 'achieved').length;

    return { month, avgProgress, count: monthObjectives.length, achieved };
  });

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const getHeatmapColor = (progress: number | null, month: number): string => {
    if (progress === null) return 'bg-zinc-800/30';
    if (year === currentYear && month > currentMonth) return 'bg-zinc-800/30';

    if (progress >= 100) return 'bg-emerald-500';
    if (progress >= 80) return 'bg-emerald-500/70';
    if (progress >= 60) return 'bg-blue-500/70';
    if (progress >= 40) return 'bg-amber-500/70';
    if (progress >= 20) return 'bg-orange-500/70';
    return 'bg-red-500/70';
  };

  const hoveredData = hoveredMonth !== null ? monthlyPerformance[hoveredMonth - 1] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Grid className="h-5 w-5 text-zinc-400" />
          <h3 className="text-lg font-medium text-white">Performance mensuelle {year}</h3>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">Performance:</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-red-500/70" title="< 20%" />
            <div className="w-4 h-4 rounded bg-orange-500/70" title="20-40%" />
            <div className="w-4 h-4 rounded bg-amber-500/70" title="40-60%" />
            <div className="w-4 h-4 rounded bg-blue-500/70" title="60-80%" />
            <div className="w-4 h-4 rounded bg-emerald-500/70" title="80-100%" />
            <div className="w-4 h-4 rounded bg-emerald-500" title="100%+" />
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="grid grid-cols-12 gap-2 mb-4">
        {monthlyPerformance.map((data, index) => {
          const isFuture = year === currentYear && data.month > currentMonth;
          const isCurrent = year === currentYear && data.month === currentMonth;

          return (
            <motion.div
              key={data.month}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              onMouseEnter={() => setHoveredMonth(data.month)}
              onMouseLeave={() => setHoveredMonth(null)}
              className={`
                relative aspect-square rounded-lg flex flex-col items-center justify-center cursor-pointer
                transition-all
                ${getHeatmapColor(data.avgProgress, data.month)}
                ${hoveredMonth === data.month ? 'ring-2 ring-white scale-110 z-10' : ''}
                ${isCurrent ? 'ring-2 ring-blue-500' : ''}
                ${isFuture ? 'opacity-50' : ''}
              `}
            >
              <span className={`text-xs font-medium ${data.avgProgress !== null ? 'text-white' : 'text-zinc-600'}`}>
                {MONTHS_FR[index].slice(0, 3)}
              </span>
              {data.avgProgress !== null && !isFuture && (
                <span className="text-[10px] text-white/80">
                  {data.avgProgress.toFixed(0)}%
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Hover Details */}
      <div className="h-16 bg-zinc-800/50 rounded-lg p-3">
        {hoveredData ? (
          <div className="flex items-center justify-between h-full">
            <div>
              <p className="text-white font-medium">{MONTHS_FR[hoveredData.month - 1]} {year}</p>
              <p className="text-zinc-500 text-sm">
                {hoveredData.count > 0
                  ? `${hoveredData.count} objectif${hoveredData.count > 1 ? 's' : ''}`
                  : 'Aucun objectif'
                }
              </p>
            </div>
            {hoveredData.avgProgress !== null && (
              <div className="text-right">
                <p className={`text-2xl font-semibold ${
                  hoveredData.avgProgress >= 100 ? 'text-emerald-400' :
                  hoveredData.avgProgress >= 80 ? 'text-blue-400' :
                  hoveredData.avgProgress >= 60 ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {hoveredData.avgProgress.toFixed(1)}%
                </p>
                <p className="text-zinc-500 text-xs">
                  {hoveredData.achieved}/{hoveredData.count} atteints
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-500">
            <Calendar className="h-4 w-4 mr-2" />
            Survolez un mois pour voir les détails
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-zinc-800">
        <div className="text-center">
          <p className="text-lg font-semibold text-white">
            {monthlyPerformance.filter(m => m.avgProgress !== null && m.avgProgress >= 100).length}
          </p>
          <p className="text-xs text-zinc-500">Mois atteints</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-blue-400">
            {monthlyPerformance.filter(m => m.avgProgress !== null && m.avgProgress >= 80 && m.avgProgress < 100).length}
          </p>
          <p className="text-xs text-zinc-500">En bonne voie</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-amber-400">
            {monthlyPerformance.filter(m => m.avgProgress !== null && m.avgProgress >= 40 && m.avgProgress < 80).length}
          </p>
          <p className="text-xs text-zinc-500">À surveiller</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-red-400">
            {monthlyPerformance.filter(m => m.avgProgress !== null && m.avgProgress < 40).length}
          </p>
          <p className="text-xs text-zinc-500">En retard</p>
        </div>
      </div>
    </motion.div>
  );
}
