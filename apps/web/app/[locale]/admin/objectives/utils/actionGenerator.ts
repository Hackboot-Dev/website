// /workspaces/website/apps/web/app/[locale]/admin/objectives/utils/actionGenerator.ts
// Description: Generate recommended actions for objectives at risk
// Last modified: 2026-01-10
// COMPLETE FILE

import type { ObjectiveWithProgress, ObjectiveType } from '../types';

export interface RecommendedAction {
  id: string;
  objectiveId: string;
  title: string;
  description: string;
  actionType: ActionType;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedImpact: number;
  impactUnit: 'currency' | 'percent' | 'count';
  effort: 'low' | 'medium' | 'high';
  category: string;
  steps?: string[];
  targetEntities?: { type: string; id: string; name: string }[];
}

export type ActionType =
  | 'lead_followup'
  | 'upsell'
  | 'cross_sell'
  | 'retention'
  | 'reactivation'
  | 'cost_reduction'
  | 'process_optimization'
  | 'marketing_campaign'
  | 'pricing_adjustment'
  | 'product_improvement'
  | 'team_training'
  | 'other';

const ACTION_TYPE_CONFIG: Record<ActionType, { label: string; icon: string }> = {
  lead_followup: { label: 'Relance leads', icon: 'Users' },
  upsell: { label: 'Upsell', icon: 'TrendingUp' },
  cross_sell: { label: 'Cross-sell', icon: 'Layers' },
  retention: { label: 'Rétention', icon: 'Heart' },
  reactivation: { label: 'Réactivation', icon: 'RefreshCw' },
  cost_reduction: { label: 'Réduction coûts', icon: 'Scissors' },
  process_optimization: { label: 'Optimisation', icon: 'Zap' },
  marketing_campaign: { label: 'Marketing', icon: 'Megaphone' },
  pricing_adjustment: { label: 'Prix', icon: 'DollarSign' },
  product_improvement: { label: 'Produit', icon: 'Package' },
  team_training: { label: 'Formation', icon: 'GraduationCap' },
  other: { label: 'Autre', icon: 'MoreHorizontal' },
};

/**
 * Generate recommended actions for an objective
 */
export function generateActions(objective: ObjectiveWithProgress): RecommendedAction[] {
  const actions: RecommendedAction[] = [];

  // Only generate actions for objectives at risk or behind
  if (objective.status !== 'at_risk' && objective.status !== 'behind') {
    return actions;
  }

  const gap = objective.targetAmount - objective.actualAmount;
  const gapPercent = 100 - objective.progressPercent;

  // Generate actions based on objective type
  const typeActions = getActionsByType(objective, gap, gapPercent);
  actions.push(...typeActions);

  // Add general actions based on status
  if (objective.status === 'behind') {
    actions.push(createAction({
      objectiveId: objective.id,
      title: 'Revoir la stratégie',
      description: 'Analysez les causes du retard et ajustez la stratégie en conséquence.',
      actionType: 'process_optimization',
      priority: 'high',
      estimatedImpact: gap * 0.1,
      impactUnit: objective.targetUnit as 'currency' | 'percent' | 'count',
      effort: 'medium',
      category: 'stratégie',
      steps: [
        'Analyser les données de performance',
        'Identifier les blocages',
        'Proposer des actions correctives',
        'Valider avec l\'équipe',
        'Implémenter les changements',
      ],
    }));
  }

  // Sort by priority and impact
  return actions.sort((a, b) => {
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return b.estimatedImpact - a.estimatedImpact;
  });
}

/**
 * Generate actions for multiple objectives
 */
export function generateBulkActions(objectives: ObjectiveWithProgress[]): RecommendedAction[] {
  const allActions: RecommendedAction[] = [];

  for (const objective of objectives) {
    const actions = generateActions(objective);
    allActions.push(...actions);
  }

  // Remove duplicates (same action type for similar objectives)
  const uniqueActions = deduplicateActions(allActions);

  return uniqueActions.slice(0, 20); // Limit to top 20 actions
}

// Action generators by objective type
function getActionsByType(
  objective: ObjectiveWithProgress,
  gap: number,
  gapPercent: number
): RecommendedAction[] {
  const actions: RecommendedAction[] = [];
  const type = objective.type;

  // Revenue objectives
  if (type.startsWith('revenue')) {
    actions.push(createAction({
      objectiveId: objective.id,
      title: 'Relancer les leads en attente',
      description: 'Contactez les prospects qui n\'ont pas encore converti pour accélérer les ventes.',
      actionType: 'lead_followup',
      priority: gapPercent > 30 ? 'urgent' : 'high',
      estimatedImpact: gap * 0.15,
      impactUnit: 'currency',
      effort: 'low',
      category: 'ventes',
      steps: [
        'Extraire la liste des leads non convertis',
        'Prioriser par potentiel',
        'Préparer les messages personnalisés',
        'Lancer la campagne de relance',
        'Suivre les conversions',
      ],
    }));

    actions.push(createAction({
      objectiveId: objective.id,
      title: 'Proposer des upgrades aux clients existants',
      description: 'Identifiez les clients éligibles à un upgrade et proposez-leur des offres.',
      actionType: 'upsell',
      priority: 'high',
      estimatedImpact: gap * 0.2,
      impactUnit: 'currency',
      effort: 'medium',
      category: 'ventes',
    }));

    actions.push(createAction({
      objectiveId: objective.id,
      title: 'Lancer une campagne promotionnelle',
      description: 'Créez une offre limitée dans le temps pour stimuler les ventes.',
      actionType: 'marketing_campaign',
      priority: 'medium',
      estimatedImpact: gap * 0.1,
      impactUnit: 'currency',
      effort: 'high',
      category: 'marketing',
    }));
  }

  // Expense objectives
  if (type.startsWith('expenses')) {
    actions.push(createAction({
      objectiveId: objective.id,
      title: 'Auditer les dépenses récurrentes',
      description: 'Passez en revue les abonnements et services pour identifier des économies.',
      actionType: 'cost_reduction',
      priority: 'high',
      estimatedImpact: gap * 0.15,
      impactUnit: 'currency',
      effort: 'low',
      category: 'finance',
      steps: [
        'Lister tous les abonnements actifs',
        'Évaluer l\'utilisation réelle',
        'Identifier les doublons',
        'Négocier ou résilier',
        'Suivre les économies',
      ],
    }));

    actions.push(createAction({
      objectiveId: objective.id,
      title: 'Renégocier les contrats fournisseurs',
      description: 'Contactez vos fournisseurs principaux pour obtenir de meilleures conditions.',
      actionType: 'cost_reduction',
      priority: 'medium',
      estimatedImpact: gap * 0.1,
      impactUnit: 'currency',
      effort: 'medium',
      category: 'achats',
    }));
  }

  // Client objectives
  if (type.includes('clients')) {
    actions.push(createAction({
      objectiveId: objective.id,
      title: 'Améliorer l\'onboarding client',
      description: 'Optimisez le processus d\'accueil pour améliorer la conversion et la rétention.',
      actionType: 'process_optimization',
      priority: 'medium',
      estimatedImpact: gap * 0.2,
      impactUnit: 'count',
      effort: 'high',
      category: 'produit',
    }));

    if (type === 'clients_new') {
      actions.push(createAction({
        objectiveId: objective.id,
        title: 'Lancer un programme de parrainage',
        description: 'Incitez vos clients actuels à recommander votre service.',
        actionType: 'marketing_campaign',
        priority: 'high',
        estimatedImpact: gap * 0.25,
        impactUnit: 'count',
        effort: 'medium',
        category: 'acquisition',
      }));
    }
  }

  // Churn / Retention objectives
  if (type === 'churn_rate' || type === 'clients_retention') {
    actions.push(createAction({
      objectiveId: objective.id,
      title: 'Contacter les clients à risque',
      description: 'Identifiez et contactez proactivement les clients montrant des signes de désengagement.',
      actionType: 'retention',
      priority: 'urgent',
      estimatedImpact: gap * 0.3,
      impactUnit: 'percent',
      effort: 'medium',
      category: 'rétention',
      steps: [
        'Identifier les signaux de churn',
        'Créer la liste des clients à risque',
        'Préparer des offres de rétention',
        'Contacter chaque client',
        'Documenter les retours',
      ],
    }));

    actions.push(createAction({
      objectiveId: objective.id,
      title: 'Améliorer le support client',
      description: 'Réduisez les temps de réponse et améliorez la satisfaction.',
      actionType: 'process_optimization',
      priority: 'high',
      estimatedImpact: gap * 0.15,
      impactUnit: 'percent',
      effort: 'high',
      category: 'support',
    }));
  }

  // MRR objectives
  if (type.includes('mrr') || type.includes('arr')) {
    actions.push(createAction({
      objectiveId: objective.id,
      title: 'Réactiver les clients inactifs',
      description: 'Lancez une campagne pour réengager les clients qui ont suspendu leur abonnement.',
      actionType: 'reactivation',
      priority: 'high',
      estimatedImpact: gap * 0.15,
      impactUnit: 'currency',
      effort: 'medium',
      category: 'revenus',
    }));

    actions.push(createAction({
      objectiveId: objective.id,
      title: 'Revoir la stratégie de pricing',
      description: 'Analysez si vos prix sont alignés avec la valeur perçue.',
      actionType: 'pricing_adjustment',
      priority: 'medium',
      estimatedImpact: gap * 0.1,
      impactUnit: 'currency',
      effort: 'high',
      category: 'stratégie',
    }));
  }

  return actions;
}

function createAction(data: Omit<RecommendedAction, 'id'>): RecommendedAction {
  return {
    ...data,
    id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  };
}

function deduplicateActions(actions: RecommendedAction[]): RecommendedAction[] {
  const seen = new Map<string, RecommendedAction>();

  for (const action of actions) {
    const key = `${action.actionType}_${action.category}`;
    const existing = seen.get(key);

    if (!existing || action.estimatedImpact > existing.estimatedImpact) {
      seen.set(key, action);
    }
  }

  return Array.from(seen.values());
}

export { ACTION_TYPE_CONFIG };
