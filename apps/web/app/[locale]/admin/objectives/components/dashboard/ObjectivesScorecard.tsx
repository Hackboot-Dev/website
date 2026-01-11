// /workspaces/website/apps/web/app/[locale]/admin/objectives/components/dashboard/ObjectivesScorecard.tsx
// Description: Scorecard showing key objectives at a glance
// Last modified: 2026-01-10
// COMPLETE FILE

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
  Target,
} from 'lucide-react';
import type { ObjectiveWithProgress } from '../../types';
import {
  OBJECTIVE_TYPE_LABELS,
  OBJECTIVE_STATUS_CONFIG,
  formatObjectiveValue,
  OBJECTIVE_TYPE_UNITS,
} from '../../types';

type ObjectivesScorecardProps = {
  objectives: ObjectiveWithProgress[];
};

export function ObjectivesScorecard({ objectives }: ObjectivesScorecardProps) {
  const params = useParams();
  const locale = params.locale as string || 'fr';

  // Filter out invalid objectives first
  const validObjectives = (objectives || []).filter(obj => obj && obj.status && obj.type);

  // Get key objectives (revenue_total, expenses_total, net_profit, etc.)
  const keyTypes = ['revenue_total', 'expenses_total', 'net_profit', 'mrr_total', 'clients_new', 'churn_rate'];

  const keyObjectives = keyTypes
    .map(type => validObjectives.find(o => o.type === type && o.period === 'yearly'))
    .filter((o): o is ObjectiveWithProgress => o !== undefined && o !== null);

  if (keyObjectives.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <Target className="h-5 w-5 text-zinc-400" />
          <h3 className="text-lg font-medium text-white">Scorecard</h3>
        </div>
        <div className="text-center py-8">
          <Target className="h-12 w-12 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-500">Aucun objectif annuel défini.</p>
          <Link
            href={`/${locale}/admin/objectives`}
            className="inline-flex items-center gap-2 mt-4 text-sm text-blue-400 hover:text-blue-300"
          >
            Créer des objectifs
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Target className="h-5 w-5 text-zinc-400" />
          <h3 className="text-lg font-medium text-white">Scorecard - Objectifs clés</h3>
        </div>
        <Link
          href={`/${locale}/admin/objectives`}
          className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
        >
          Voir tout
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {keyObjectives.map((obj, index) => {
          const statusConfig = OBJECTIVE_STATUS_CONFIG[obj.status];
          const unit = OBJECTIVE_TYPE_UNITS[obj.type];

          return (
            <motion.div
              key={obj.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={`/${locale}/admin/objectives/${obj.id}`}
                className="block p-4 bg-zinc-800/50 border border-zinc-700/50 rounded-lg hover:border-zinc-600 transition-colors"
              >
                <p className="text-xs text-zinc-500 truncate mb-2">
                  {OBJECTIVE_TYPE_LABELS[obj.type]}
                </p>
                <p className="text-xl font-semibold text-white mb-1">
                  {formatObjectiveValue(obj.actualAmount, unit)}
                </p>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${statusConfig.color}`}>
                    {obj.progressPercent.toFixed(0)}%
                  </span>
                  <span className="flex items-center gap-0.5">
                    {obj.trend === 'up' ? (
                      <TrendingUp className="h-3 w-3 text-emerald-400" />
                    ) : obj.trend === 'down' ? (
                      <TrendingDown className="h-3 w-3 text-red-400" />
                    ) : (
                      <Minus className="h-3 w-3 text-zinc-400" />
                    )}
                  </span>
                </div>
                {/* Mini progress bar */}
                <div className="mt-2 h-1 bg-zinc-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      obj.status === 'achieved'
                        ? 'bg-emerald-500'
                        : obj.status === 'on_track'
                        ? 'bg-blue-500'
                        : obj.status === 'at_risk'
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(100, obj.progressPercent)}%` }}
                  />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
