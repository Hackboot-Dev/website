// /workspaces/website/apps/web/app/[locale]/admin/objectives/components/dashboard/ObjectivesTimeline.tsx
// Description: Timeline showing objectives completion over time
// Last modified: 2026-01-10
// COMPLETE FILE

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  CheckCircle,
  AlertTriangle,
  Clock,
  ArrowRight,
  Calendar,
} from 'lucide-react';
import type { ObjectiveWithProgress } from '../../types';
import {
  OBJECTIVE_TYPE_LABELS,
  OBJECTIVE_STATUS_CONFIG,
  MONTHS_FR,
  formatObjectiveValue,
  OBJECTIVE_TYPE_UNITS,
} from '../../types';

type ObjectivesTimelineProps = {
  objectives: ObjectiveWithProgress[];
};

export function ObjectivesTimeline({ objectives }: ObjectivesTimelineProps) {
  const params = useParams();
  const locale = params.locale as string || 'fr';

  // Filter out invalid objectives
  const validObjectives = (objectives || []).filter(obj => obj && obj.status && obj.type);

  // Get monthly objectives and sort by month
  const monthlyObjectives = validObjectives
    .filter(o => o.period === 'monthly' && o.month)
    .sort((a, b) => (a.month || 0) - (b.month || 0));

  // Group by month
  const groupedByMonth = monthlyObjectives.reduce((acc, obj) => {
    const month = obj.month || 0;
    if (!acc[month]) acc[month] = [];
    acc[month].push(obj);
    return acc;
  }, {} as Record<number, ObjectiveWithProgress[]>);

  const currentMonth = new Date().getMonth() + 1;

  if (Object.keys(groupedByMonth).length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="h-5 w-5 text-zinc-400" />
          <h3 className="text-lg font-medium text-white">Timeline mensuelle</h3>
        </div>
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-500">Aucun objectif mensuel défini.</p>
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
          <Calendar className="h-5 w-5 text-zinc-400" />
          <h3 className="text-lg font-medium text-white">Timeline mensuelle</h3>
        </div>
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-zinc-800" />

        {/* Months */}
        <div className="space-y-6">
          {Object.entries(groupedByMonth).map(([monthStr, objs], index) => {
            const month = parseInt(monthStr);
            const isPast = month < currentMonth;
            const isCurrent = month === currentMonth;

            // Calculate month summary
            const achieved = objs.filter(o => o.status === 'achieved').length;
            const atRisk = objs.filter(o => o.status === 'at_risk' || o.status === 'behind').length;
            const total = objs.length;

            return (
              <motion.div
                key={month}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative pl-10"
              >
                {/* Timeline Dot */}
                <div className={`
                  absolute left-2 top-0 w-5 h-5 rounded-full border-2 flex items-center justify-center
                  ${isCurrent
                    ? 'bg-blue-500 border-blue-500'
                    : isPast
                    ? achieved === total
                      ? 'bg-emerald-500 border-emerald-500'
                      : 'bg-amber-500 border-amber-500'
                    : 'bg-zinc-800 border-zinc-700'
                  }
                `}>
                  {isPast && achieved === total && (
                    <CheckCircle className="h-3 w-3 text-white" />
                  )}
                  {isPast && achieved < total && (
                    <AlertTriangle className="h-3 w-3 text-white" />
                  )}
                  {isCurrent && (
                    <Clock className="h-3 w-3 text-white" />
                  )}
                </div>

                {/* Month Content */}
                <div className={`
                  p-4 rounded-lg border transition-colors
                  ${isCurrent
                    ? 'bg-blue-500/10 border-blue-500/30'
                    : 'bg-zinc-800/50 border-zinc-700/50 hover:border-zinc-600'
                  }
                `}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className={`font-medium ${isCurrent ? 'text-blue-400' : 'text-white'}`}>
                      {MONTHS_FR[month - 1]}
                      {isCurrent && (
                        <span className="ml-2 text-xs px-2 py-0.5 bg-blue-500/20 rounded-full">
                          En cours
                        </span>
                      )}
                    </h4>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-emerald-400">{achieved} atteints</span>
                      {atRisk > 0 && (
                        <span className="text-amber-400">{atRisk} à risque</span>
                      )}
                      <span className="text-zinc-500">/ {total}</span>
                    </div>
                  </div>

                  {/* Objectives List */}
                  <div className="space-y-2">
                    {objs.slice(0, 3).map((obj) => {
                      const statusConfig = OBJECTIVE_STATUS_CONFIG[obj.status];
                      const unit = OBJECTIVE_TYPE_UNITS[obj.type];

                      return (
                        <Link
                          key={obj.id}
                          href={`/${locale}/admin/objectives/${obj.id}`}
                          className="flex items-center justify-between p-2 rounded bg-zinc-900/50 hover:bg-zinc-900 transition-colors group"
                        >
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${statusConfig.bgColor.replace('/20', '')}`} />
                            <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">
                              {obj.name || OBJECTIVE_TYPE_LABELS[obj.type]}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-zinc-400">
                              {formatObjectiveValue(obj.actualAmount, unit)} / {formatObjectiveValue(obj.targetAmount, unit)}
                            </span>
                            <span className={`text-sm font-medium ${statusConfig.color}`}>
                              {obj.progressPercent.toFixed(0)}%
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                    {objs.length > 3 && (
                      <Link
                        href={`/${locale}/admin/objectives`}
                        className="flex items-center justify-center gap-1 p-2 text-sm text-zinc-500 hover:text-white transition-colors"
                      >
                        +{objs.length - 3} autres objectifs
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
