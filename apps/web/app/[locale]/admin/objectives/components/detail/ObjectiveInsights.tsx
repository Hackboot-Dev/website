// /workspaces/website/apps/web/app/[locale]/admin/objectives/components/detail/ObjectiveInsights.tsx
// Description: Insights panel showing auto-generated insights and anomalies
// Last modified: 2026-01-10
// COMPLETE FILE

'use client';

import { motion } from 'framer-motion';
import {
  Lightbulb,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Info,
  Zap,
} from 'lucide-react';
import type { Insight } from '../../hooks/useObjectiveDetail';

type ObjectiveInsightsProps = {
  insights: Insight[];
};

const InsightIcon = ({ type }: { type: Insight['type'] }) => {
  switch (type) {
    case 'positive':
      return <CheckCircle className="h-5 w-5 text-emerald-400" />;
    case 'negative':
      return <TrendingDown className="h-5 w-5 text-red-400" />;
    case 'warning':
      return <AlertTriangle className="h-5 w-5 text-amber-400" />;
    default:
      return <Info className="h-5 w-5 text-blue-400" />;
  }
};

const getInsightColors = (type: Insight['type']) => {
  switch (type) {
    case 'positive':
      return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400' };
    case 'negative':
      return { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' };
    case 'warning':
      return { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400' };
    default:
      return { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' };
  }
};

export function ObjectiveInsights({ insights }: ObjectiveInsightsProps) {
  if (insights.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <Lightbulb className="h-5 w-5 text-blue-400" />
          </div>
          <h3 className="text-lg font-medium text-white">Insights</h3>
        </div>
        <div className="text-center py-8">
          <Zap className="h-12 w-12 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-500">Aucun insight disponible pour le moment.</p>
          <p className="text-zinc-600 text-sm mt-1">
            Les insights apparaîtront au fur et à mesure de la progression.
          </p>
        </div>
      </motion.div>
    );
  }

  // Group insights by type
  const positiveInsights = insights.filter(i => i.type === 'positive');
  const warningInsights = insights.filter(i => i.type === 'warning' || i.type === 'negative');
  const neutralInsights = insights.filter(i => i.type === 'neutral');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
          <Lightbulb className="h-5 w-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-white">Insights</h3>
          <p className="text-zinc-500 text-sm">
            {insights.length} insight{insights.length > 1 ? 's' : ''} détecté{insights.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {insights.map((insight, index) => {
          const colors = getInsightColors(insight.type);

          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg ${colors.bg} border ${colors.border}`}
            >
              <div className="flex items-start gap-3">
                <InsightIcon type={insight.type} />
                <div className="flex-1 min-w-0">
                  <h4 className={`font-medium ${colors.text}`}>{insight.title}</h4>
                  <p className="text-zinc-400 text-sm mt-1">{insight.message}</p>

                  {/* Metric details */}
                  {(insight.metric || insight.value !== undefined) && (
                    <div className="flex items-center gap-4 mt-3">
                      {insight.metric && (
                        <span className="text-xs text-zinc-500">
                          {insight.metric}: <span className={colors.text}>{insight.value?.toFixed(1)}%</span>
                        </span>
                      )}
                      {insight.change !== undefined && (
                        <span className="text-xs text-zinc-500 flex items-center gap-1">
                          {insight.change > 0 ? (
                            <TrendingUp className="h-3 w-3 text-emerald-400" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-400" />
                          )}
                          {insight.change > 0 ? '+' : ''}{insight.change.toFixed(1)}%
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-zinc-800">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            {positiveInsights.length > 0 && (
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle className="h-4 w-4" />
                {positiveInsights.length} positif{positiveInsights.length > 1 ? 's' : ''}
              </span>
            )}
            {warningInsights.length > 0 && (
              <span className="flex items-center gap-1 text-amber-400">
                <AlertTriangle className="h-4 w-4" />
                {warningInsights.length} attention
              </span>
            )}
            {neutralInsights.length > 0 && (
              <span className="flex items-center gap-1 text-blue-400">
                <Info className="h-4 w-4" />
                {neutralInsights.length} info{neutralInsights.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
