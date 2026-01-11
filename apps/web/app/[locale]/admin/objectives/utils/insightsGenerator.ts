// /workspaces/website/apps/web/app/[locale]/admin/objectives/utils/insightsGenerator.ts
// Description: Generate insights and analysis for objectives
// Last modified: 2026-01-10
// COMPLETE FILE

import type { ObjectiveWithProgress, ObjectiveCategory } from '../types';
import { OBJECTIVE_TYPE_LABELS, getCategoryForType, formatObjectiveValue, OBJECTIVE_TYPE_UNITS } from '../types';

export interface Insight {
  id: string;
  type: InsightType;
  severity: 'positive' | 'negative' | 'neutral' | 'warning';
  title: string;
  message: string;
  metric?: string;
  value?: number;
  change?: number;
  comparison?: string;
  relatedObjectiveIds?: string[];
}

export type InsightType =
  | 'top_performer'
  | 'underperformer'
  | 'trend_positive'
  | 'trend_negative'
  | 'milestone'
  | 'forecast'
  | 'comparison'
  | 'anomaly'
  | 'recommendation';

/**
 * Generate insights for a single objective
 */
export function generateObjectiveInsights(objective: ObjectiveWithProgress): Insight[] {
  const insights: Insight[] = [];
  const now = new Date();

  // Progress vs expected
  const expectedProgress = calculateExpectedProgress(objective, now);
  const progressDiff = objective.progressPercent - expectedProgress;

  if (progressDiff > 15) {
    insights.push(createInsight({
      type: 'top_performer',
      severity: 'positive',
      title: 'En avance sur le planning',
      message: `Progression de ${progressDiff.toFixed(1)}% au-dessus du rythme attendu.`,
      metric: 'Avance',
      value: progressDiff,
    }));
  } else if (progressDiff < -15) {
    insights.push(createInsight({
      type: 'underperformer',
      severity: 'warning',
      title: 'En retard sur le planning',
      message: `Retard de ${Math.abs(progressDiff).toFixed(1)}% par rapport au rythme attendu.`,
      metric: 'Retard',
      value: Math.abs(progressDiff),
    }));
  }

  // Milestone achievements
  const milestones = [25, 50, 75, 100];
  for (const milestone of milestones) {
    if (objective.progressPercent >= milestone && objective.progressPercent < milestone + 5) {
      insights.push(createInsight({
        type: 'milestone',
        severity: milestone === 100 ? 'positive' : 'neutral',
        title: milestone === 100 ? 'Objectif atteint !' : `Jalon ${milestone}% atteint`,
        message: milestone === 100
          ? `Félicitations, l'objectif a été atteint avec ${objective.progressPercent.toFixed(1)}% de progression.`
          : `${milestone}% de l'objectif a été atteint.`,
        value: objective.progressPercent,
      }));
      break;
    }
  }

  // Trend insights
  if (objective.trend === 'up') {
    insights.push(createInsight({
      type: 'trend_positive',
      severity: 'positive',
      title: 'Tendance positive',
      message: 'La progression est en hausse par rapport à la période précédente.',
    }));
  } else if (objective.trend === 'down') {
    insights.push(createInsight({
      type: 'trend_negative',
      severity: 'negative',
      title: 'Tendance négative',
      message: 'La progression ralentit par rapport à la période précédente.',
    }));
  }

  // Forecast insight
  if (objective.forecastedAmount !== undefined) {
    const willAchieve = objective.forecastedAmount >= objective.targetAmount;
    insights.push(createInsight({
      type: 'forecast',
      severity: willAchieve ? 'positive' : 'warning',
      title: willAchieve ? 'Projection favorable' : 'Projection défavorable',
      message: willAchieve
        ? `Selon les tendances actuelles, l'objectif devrait être atteint à ${((objective.forecastedAmount / objective.targetAmount) * 100).toFixed(0)}%.`
        : `La projection actuelle prévoit ${((objective.forecastedAmount / objective.targetAmount) * 100).toFixed(0)}% de l'objectif.`,
      value: objective.forecastedAmount,
    }));
  }

  return insights;
}

/**
 * Generate insights across multiple objectives
 */
export function generateMultiObjectiveInsights(objectives: ObjectiveWithProgress[]): Insight[] {
  const insights: Insight[] = [];

  if (objectives.length === 0) return insights;

  // Top performers
  const sortedByProgress = [...objectives].sort((a, b) => b.progressPercent - a.progressPercent);
  const topPerformer = sortedByProgress[0];
  const unit = OBJECTIVE_TYPE_UNITS[topPerformer.type];

  if (topPerformer.progressPercent > 80) {
    insights.push(createInsight({
      type: 'top_performer',
      severity: 'positive',
      title: 'Meilleure performance',
      message: `${topPerformer.name || OBJECTIVE_TYPE_LABELS[topPerformer.type]} est l'objectif le plus avancé avec ${topPerformer.progressPercent.toFixed(1)}%.`,
      relatedObjectiveIds: [topPerformer.id],
    }));
  }

  // Underperformers
  const underperformer = sortedByProgress[sortedByProgress.length - 1];
  if (underperformer.progressPercent < 50 && underperformer.id !== topPerformer.id) {
    insights.push(createInsight({
      type: 'underperformer',
      severity: 'negative',
      title: 'Objectif en difficulté',
      message: `${underperformer.name || OBJECTIVE_TYPE_LABELS[underperformer.type]} nécessite une attention particulière (${underperformer.progressPercent.toFixed(1)}%).`,
      relatedObjectiveIds: [underperformer.id],
    }));
  }

  // Category analysis
  const byCategory = groupByCategory(objectives);
  for (const [category, objs] of Object.entries(byCategory)) {
    const avgProgress = objs.reduce((sum, o) => sum + o.progressPercent, 0) / objs.length;
    const achieved = objs.filter(o => o.status === 'achieved').length;

    if (achieved > 0) {
      insights.push(createInsight({
        type: 'milestone',
        severity: 'positive',
        title: `${achieved} objectif(s) atteint(s) en ${getCategoryLabel(category as ObjectiveCategory)}`,
        message: `Progression moyenne de la catégorie: ${avgProgress.toFixed(1)}%.`,
        value: achieved,
      }));
    }
  }

  // Revenue vs Expenses comparison
  const revenueObj = objectives.find(o => o.type === 'revenue_total');
  const expensesObj = objectives.find(o => o.type === 'expenses_total');

  if (revenueObj && expensesObj) {
    const revenueProgress = revenueObj.progressPercent;
    const expensesProgress = expensesObj.progressPercent;

    if (revenueProgress > expensesProgress + 10) {
      insights.push(createInsight({
        type: 'comparison',
        severity: 'positive',
        title: 'Bon équilibre revenus/dépenses',
        message: `Les revenus progressent plus vite (${revenueProgress.toFixed(0)}%) que les dépenses (${expensesProgress.toFixed(0)}%).`,
        comparison: 'Revenus vs Dépenses',
        relatedObjectiveIds: [revenueObj.id, expensesObj.id],
      }));
    } else if (expensesProgress > revenueProgress + 10) {
      insights.push(createInsight({
        type: 'comparison',
        severity: 'warning',
        title: 'Attention à l\'équilibre revenus/dépenses',
        message: `Les dépenses progressent plus vite (${expensesProgress.toFixed(0)}%) que les revenus (${revenueProgress.toFixed(0)}%).`,
        comparison: 'Revenus vs Dépenses',
        relatedObjectiveIds: [revenueObj.id, expensesObj.id],
      }));
    }
  }

  // Overall status summary
  const achievedCount = objectives.filter(o => o.status === 'achieved').length;
  const atRiskCount = objectives.filter(o => o.status === 'at_risk' || o.status === 'behind').length;

  if (achievedCount > objectives.length / 2) {
    insights.push(createInsight({
      type: 'milestone',
      severity: 'positive',
      title: 'Plus de la moitié des objectifs atteints',
      message: `${achievedCount} objectifs sur ${objectives.length} sont déjà atteints.`,
      value: achievedCount,
    }));
  }

  if (atRiskCount > objectives.length / 3) {
    insights.push(createInsight({
      type: 'recommendation',
      severity: 'warning',
      title: 'Attention requise',
      message: `${atRiskCount} objectifs sur ${objectives.length} sont à risque ou en retard. Une action rapide est recommandée.`,
      value: atRiskCount,
    }));
  }

  return insights.slice(0, 10); // Limit to top 10 insights
}

/**
 * Generate a summary insight for the period
 */
export function generatePeriodSummary(
  objectives: ObjectiveWithProgress[],
  period: 'monthly' | 'quarterly' | 'yearly'
): Insight {
  const filtered = objectives.filter(o => o.period === period);
  const total = filtered.length;
  const achieved = filtered.filter(o => o.status === 'achieved').length;
  const onTrack = filtered.filter(o => o.status === 'on_track').length;
  const atRisk = filtered.filter(o => o.status === 'at_risk').length;
  const behind = filtered.filter(o => o.status === 'behind').length;

  const avgProgress = total > 0
    ? filtered.reduce((sum, o) => sum + o.progressPercent, 0) / total
    : 0;

  const periodLabel = period === 'monthly' ? 'mensuels' : period === 'quarterly' ? 'trimestriels' : 'annuels';

  let severity: Insight['severity'] = 'neutral';
  if (achieved / total >= 0.7) severity = 'positive';
  else if (atRisk + behind > total / 2) severity = 'warning';
  else if (behind > total / 3) severity = 'negative';

  return createInsight({
    type: 'comparison',
    severity,
    title: `Résumé des objectifs ${periodLabel}`,
    message: `${achieved} atteints, ${onTrack} en bonne voie, ${atRisk} à risque, ${behind} en retard. Progression moyenne: ${avgProgress.toFixed(1)}%.`,
    value: avgProgress,
  });
}

// Helper functions
function calculateExpectedProgress(objective: ObjectiveWithProgress, now: Date): number {
  const year = objective.year;

  if (objective.period === 'monthly' && objective.month) {
    const daysInMonth = new Date(year, objective.month, 0).getDate();
    const currentDay = Math.min(now.getDate(), daysInMonth);
    return (currentDay / daysInMonth) * 100;
  }

  if (objective.period === 'quarterly' && objective.quarter) {
    const startMonth = (objective.quarter - 1) * 3;
    const currentMonth = now.getMonth();
    const monthsElapsed = Math.max(0, Math.min(3, currentMonth - startMonth + 1));
    return (monthsElapsed / 3) * 100;
  }

  if (objective.period === 'yearly') {
    const dayOfYear = Math.floor((now.getTime() - new Date(year, 0, 0).getTime()) / 86400000);
    const daysInYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 366 : 365;
    return (dayOfYear / daysInYear) * 100;
  }

  return 0;
}

function groupByCategory(objectives: ObjectiveWithProgress[]): Record<ObjectiveCategory, ObjectiveWithProgress[]> {
  return objectives.reduce((acc, obj) => {
    const category = getCategoryForType(obj.type);
    if (!acc[category]) acc[category] = [];
    acc[category].push(obj);
    return acc;
  }, {} as Record<ObjectiveCategory, ObjectiveWithProgress[]>);
}

function getCategoryLabel(category: ObjectiveCategory): string {
  const labels: Record<ObjectiveCategory, string> = {
    financial: 'Financier',
    clients: 'Clients',
    subscriptions: 'Abonnements',
    products: 'Produits',
  };
  return labels[category] || category;
}

function createInsight(data: Omit<Insight, 'id'>): Insight {
  return {
    ...data,
    id: `insight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  };
}
