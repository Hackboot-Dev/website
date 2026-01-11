// /workspaces/website/apps/web/app/[locale]/admin/objectives/components/dashboard/ObjectivesCategoryBreakdown.tsx
// Description: Bar chart showing objectives breakdown by category
// Last modified: 2026-01-10
// COMPLETE FILE

'use client';

import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import type { ObjectiveWithProgress, ObjectiveCategory } from '../../types';
import { OBJECTIVE_CATEGORY_LABELS, getCategoryForType } from '../../types';

type ObjectivesCategoryBreakdownProps = {
  objectives: ObjectiveWithProgress[];
};

const CATEGORY_COLORS: Record<ObjectiveCategory, string> = {
  financial: '#3b82f6',
  clients: '#8b5cf6',
  subscriptions: '#10b981',
  products: '#f59e0b',
};

export function ObjectivesCategoryBreakdown({ objectives }: ObjectivesCategoryBreakdownProps) {
  // Filter out invalid objectives
  const validObjectives = (objectives || []).filter(obj => obj && obj.type && obj.status);

  // Group by category and calculate average progress
  const categoryData = validObjectives.reduce((acc, obj) => {
    const category = getCategoryForType(obj.type);
    if (!acc[category]) {
      acc[category] = { total: 0, progress: 0, count: 0 };
    }
    acc[category].total += obj.targetAmount;
    acc[category].progress += obj.progressPercent;
    acc[category].count += 1;
    return acc;
  }, {} as Record<ObjectiveCategory, { total: number; progress: number; count: number }>);

  const data = (Object.entries(categoryData) as [ObjectiveCategory, { total: number; progress: number; count: number }][])
    .map(([category, stats]) => ({
      category,
      name: OBJECTIVE_CATEGORY_LABELS[category],
      avgProgress: stats.progress / stats.count,
      count: stats.count,
      color: CATEGORY_COLORS[category],
    }))
    .sort((a, b) => b.avgProgress - a.avgProgress);

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;
    return (
      <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 shadow-xl">
        <p className="text-white font-medium">{data.name}</p>
        <p className="text-zinc-400 text-sm">
          Progression moyenne: <span className="text-white">{data.avgProgress.toFixed(1)}%</span>
        </p>
        <p className="text-zinc-500 text-xs mt-1">
          {data.count} objectif{data.count > 1 ? 's' : ''}
        </p>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="h-5 w-5 text-zinc-400" />
        <h3 className="text-lg font-medium text-white">Progression par catégorie</h3>
      </div>

      {data.length === 0 ? (
        <div className="h-64 flex items-center justify-center">
          <p className="text-zinc-500">Aucune donnée disponible</p>
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 20, bottom: 0, left: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
              <XAxis
                type="number"
                domain={[0, 100]}
                stroke="#71717a"
                tick={{ fill: '#71717a', fontSize: 12 }}
                axisLine={{ stroke: '#3f3f46' }}
                tickFormatter={(value) => `${value}%`}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#71717a"
                tick={{ fill: '#a1a1aa', fontSize: 12 }}
                axisLine={{ stroke: '#3f3f46' }}
                width={75}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
              <Bar
                dataKey="avgProgress"
                radius={[0, 4, 4, 0]}
                maxBarSize={30}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-zinc-800">
        {data.map((entry) => (
          <div key={entry.category} className="text-center">
            <p className="text-lg font-semibold" style={{ color: entry.color }}>
              {entry.avgProgress.toFixed(0)}%
            </p>
            <p className="text-xs text-zinc-500">{entry.name}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
