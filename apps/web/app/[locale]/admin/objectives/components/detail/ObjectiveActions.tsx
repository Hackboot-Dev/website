// /workspaces/website/apps/web/app/[locale]/admin/objectives/components/detail/ObjectiveActions.tsx
// Description: Actions panel showing recommended actions to achieve objective
// Last modified: 2026-01-10
// COMPLETE FILE

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Users,
  TrendingUp,
  Scissors,
  Megaphone,
  Check,
  Clock,
  ChevronRight,
  Target,
  Plus,
} from 'lucide-react';
import type { ObjectiveWithProgress } from '../../types';
import type { ObjectiveAction } from '../../hooks/useObjectiveDetail';
import { formatObjectiveValue, OBJECTIVE_TYPE_UNITS } from '../../types';

type ObjectiveActionsProps = {
  objective: ObjectiveWithProgress;
  actions: ObjectiveAction[];
  onRefresh?: () => void;
};

const ActionTypeIcon = ({ type }: { type: ObjectiveAction['actionType'] }) => {
  switch (type) {
    case 'lead_followup':
      return <Users className="h-5 w-5" />;
    case 'upsell':
      return <TrendingUp className="h-5 w-5" />;
    case 'retention':
      return <Target className="h-5 w-5" />;
    case 'cost_reduction':
      return <Scissors className="h-5 w-5" />;
    case 'marketing':
      return <Megaphone className="h-5 w-5" />;
    default:
      return <Zap className="h-5 w-5" />;
  }
};

const ActionTypeConfig: Record<ObjectiveAction['actionType'], { label: string; color: string; bgColor: string }> = {
  lead_followup: { label: 'Relance leads', color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
  upsell: { label: 'Upsell', color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
  retention: { label: 'Rétention', color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
  cost_reduction: { label: 'Réduction coûts', color: 'text-amber-400', bgColor: 'bg-amber-500/20' },
  marketing: { label: 'Marketing', color: 'text-pink-400', bgColor: 'bg-pink-500/20' },
  other: { label: 'Autre', color: 'text-zinc-400', bgColor: 'bg-zinc-500/20' },
};

export function ObjectiveActions({ objective, actions, onRefresh }: ObjectiveActionsProps) {
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());
  const [expandedAction, setExpandedAction] = useState<string | null>(null);
  const unit = OBJECTIVE_TYPE_UNITS[objective.type];

  const handleCompleteAction = (actionId: string) => {
    setCompletedActions(prev => {
      const next = new Set(prev);
      if (next.has(actionId)) {
        next.delete(actionId);
      } else {
        next.add(actionId);
      }
      return next;
    });
  };

  const totalPotentialImpact = actions.reduce((sum, a) => sum + a.potentialImpact, 0);
  const completedCount = completedActions.size;
  const pendingActions = actions.filter(a => !completedActions.has(a.id) && !a.isCompleted);
  const completedActionsList = actions.filter(a => completedActions.has(a.id) || a.isCompleted);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Zap className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">Plan d'actions</h3>
              <p className="text-zinc-500 text-sm">
                {pendingActions.length} action{pendingActions.length > 1 ? 's' : ''} recommandée{pendingActions.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors text-sm">
            <Plus className="h-4 w-4" />
            Ajouter une action
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-zinc-800/50 rounded-lg p-4">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Impact potentiel</p>
            <p className="text-2xl font-semibold text-emerald-400">
              +{formatObjectiveValue(totalPotentialImpact, unit)}
            </p>
          </div>
          <div className="bg-zinc-800/50 rounded-lg p-4">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Actions à faire</p>
            <p className="text-2xl font-semibold text-white">{pendingActions.length}</p>
          </div>
          <div className="bg-zinc-800/50 rounded-lg p-4">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Complétées</p>
            <p className="text-2xl font-semibold text-blue-400">{completedCount}</p>
          </div>
        </div>
      </div>

      {/* Pending Actions */}
      {pendingActions.length > 0 && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h4 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">
            Actions à réaliser
          </h4>
          <div className="space-y-3">
            {pendingActions.map((action, index) => {
              const config = ActionTypeConfig[action.actionType];
              const isExpanded = expandedAction === action.id;

              return (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg overflow-hidden"
                >
                  <div
                    className="p-4 cursor-pointer hover:bg-zinc-800/80 transition-colors"
                    onClick={() => setExpandedAction(isExpanded ? null : action.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg ${config.bgColor} flex items-center justify-center ${config.color}`}>
                        <ActionTypeIcon type={action.actionType} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-white font-medium">{action.title}</h5>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${config.bgColor} ${config.color}`}>
                            {config.label}
                          </span>
                          <span className="text-xs text-emerald-400">
                            +{formatObjectiveValue(action.potentialImpact, unit)} impact
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCompleteAction(action.id);
                          }}
                          className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <ChevronRight
                          className={`h-5 w-5 text-zinc-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                        />
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-zinc-700/50"
                      >
                        <div className="p-4 bg-zinc-900/50">
                          <p className="text-zinc-400 text-sm mb-4">{action.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-xs text-zinc-500">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Créée {new Date(action.createdAt).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCompleteAction(action.id);
                              }}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm transition-colors"
                            >
                              Marquer comme terminée
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed Actions */}
      {completedActionsList.length > 0 && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h4 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">
            Actions terminées ({completedActionsList.length})
          </h4>
          <div className="space-y-2">
            {completedActionsList.map((action) => {
              const config = ActionTypeConfig[action.actionType];

              return (
                <div
                  key={action.id}
                  className="flex items-center gap-4 p-3 bg-zinc-800/30 rounded-lg opacity-60"
                >
                  <div className={`w-8 h-8 rounded-lg ${config.bgColor} flex items-center justify-center ${config.color}`}>
                    <Check className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-zinc-400 line-through">{action.title}</p>
                  </div>
                  <span className="text-xs text-emerald-400/60">
                    +{formatObjectiveValue(action.potentialImpact, unit)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {actions.length === 0 && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-12 text-center">
          <Target className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Aucune action recommandée</h3>
          <p className="text-zinc-500 max-w-md mx-auto">
            L'objectif est en bonne voie. Les actions seront suggérées automatiquement si la situation change.
          </p>
        </div>
      )}
    </motion.div>
  );
}
