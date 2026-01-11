// /workspaces/website/apps/web/app/[locale]/admin/objectives/components/dashboard/ObjectivesStatusChart.tsx
// Description: Pie chart showing objectives by status
// Last modified: 2026-01-10
// COMPLETE FILE

'use client';

import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import type { ObjectiveWithProgress, ObjectiveStatus } from '../../types';
import { OBJECTIVE_STATUS_CONFIG } from '../../types';

type ObjectivesStatusChartProps = {
  objectives: ObjectiveWithProgress[];
};

const STATUS_COLORS: Record<ObjectiveStatus, string> = {
  achieved: '#10b981',
  on_track: '#3b82f6',
  at_risk: '#f59e0b',
  behind: '#ef4444',
  not_started: '#71717a',
};

export function ObjectivesStatusChart({ objectives }: ObjectivesStatusChartProps) {
  // Filter out invalid objectives
  const validObjectives = (objectives || []).filter(obj => obj && obj.status);

  // Count by status
  const statusCounts = validObjectives.reduce((acc, obj) => {
    acc[obj.status] = (acc[obj.status] || 0) + 1;
    return acc;
  }, {} as Record<ObjectiveStatus, number>);

  const data = (Object.entries(statusCounts) as [ObjectiveStatus, number][])
    .map(([status, count]) => ({
      name: OBJECTIVE_STATUS_CONFIG[status].label,
      value: count,
      status,
      color: STATUS_COLORS[status],
    }))
    .filter(d => d.value > 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;
    return (
      <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 shadow-xl">
        <p className="text-white font-medium">{data.name}</p>
        <p className="text-zinc-400 text-sm">
          {data.value} objectif{data.value > 1 ? 's' : ''} ({validObjectives.length > 0 ? ((data.value / validObjectives.length) * 100).toFixed(0) : 0}%)
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
        <PieChartIcon className="h-5 w-5 text-zinc-400" />
        <h3 className="text-lg font-medium text-white">Répartition par statut</h3>
      </div>

      {data.length === 0 ? (
        <div className="h-64 flex items-center justify-center">
          <p className="text-zinc-500">Aucune donnée disponible</p>
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        {data.map((entry) => (
          <div key={entry.status} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-zinc-400">
              {entry.name}: <span className="text-white">{entry.value}</span>
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
