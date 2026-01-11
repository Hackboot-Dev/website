// /workspaces/website/apps/web/app/[locale]/admin/objectives/utils/anomalyDetector.ts
// Description: Utilities for detecting anomalies in objective performance
// Last modified: 2026-01-10
// COMPLETE FILE

import type { ObjectiveWithProgress } from '../types';

export interface Anomaly {
  id: string;
  objectiveId: string;
  type: AnomalyType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  metric: string;
  currentValue: number;
  expectedValue: number;
  zScore: number;
  detectedAt: string;
}

export type AnomalyType =
  | 'sudden_drop'
  | 'sudden_spike'
  | 'stagnation'
  | 'acceleration'
  | 'deceleration'
  | 'threshold_breach'
  | 'trend_reversal';

export interface AnomalyDetectorConfig {
  zScoreThreshold?: number;
  minDataPoints?: number;
  sensitivity?: 'low' | 'medium' | 'high';
}

const DEFAULT_CONFIG: Required<AnomalyDetectorConfig> = {
  zScoreThreshold: 2,
  minDataPoints: 5,
  sensitivity: 'medium',
};

/**
 * Detect anomalies in objective performance
 */
export function detectAnomalies(
  objective: ObjectiveWithProgress,
  historicalData: number[],
  config: AnomalyDetectorConfig = {}
): Anomaly[] {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const anomalies: Anomaly[] = [];

  if (historicalData.length < cfg.minDataPoints) {
    return anomalies;
  }

  // Calculate statistics
  const mean = calculateMean(historicalData);
  const stdDev = calculateStdDev(historicalData, mean);

  // Current value is the last data point
  const currentValue = historicalData[historicalData.length - 1];
  const zScore = stdDev !== 0 ? (currentValue - mean) / stdDev : 0;

  // Adjust threshold based on sensitivity
  const threshold = getThreshold(cfg.sensitivity, cfg.zScoreThreshold);

  // Check for anomalies
  if (Math.abs(zScore) > threshold) {
    if (zScore < -threshold) {
      anomalies.push(createAnomaly({
        objectiveId: objective.id,
        type: 'sudden_drop',
        severity: getSeverity(zScore),
        title: 'Chute soudaine détectée',
        description: `La valeur actuelle est ${Math.abs(zScore).toFixed(1)} écarts-types en dessous de la moyenne.`,
        metric: 'progression',
        currentValue,
        expectedValue: mean,
        zScore,
      }));
    } else if (zScore > threshold) {
      anomalies.push(createAnomaly({
        objectiveId: objective.id,
        type: 'sudden_spike',
        severity: getSeverity(zScore),
        title: 'Pic inhabituel détecté',
        description: `La valeur actuelle est ${zScore.toFixed(1)} écarts-types au-dessus de la moyenne.`,
        metric: 'progression',
        currentValue,
        expectedValue: mean,
        zScore,
      }));
    }
  }

  // Check for stagnation (no change over recent periods)
  const recentData = historicalData.slice(-5);
  const recentVariance = calculateVariance(recentData);
  if (recentVariance < mean * 0.01 && objective.progressPercent < 80) {
    anomalies.push(createAnomaly({
      objectiveId: objective.id,
      type: 'stagnation',
      severity: 'medium',
      title: 'Stagnation détectée',
      description: 'Aucune progression significative sur les dernières périodes.',
      metric: 'variance',
      currentValue: recentVariance,
      expectedValue: mean * 0.1,
      zScore: 0,
    }));
  }

  // Check for trend reversal
  const trendAnomaly = detectTrendReversal(objective, historicalData);
  if (trendAnomaly) {
    anomalies.push(trendAnomaly);
  }

  // Check for threshold breach
  if (objective.progressPercent < 50 && isLateInPeriod(objective)) {
    anomalies.push(createAnomaly({
      objectiveId: objective.id,
      type: 'threshold_breach',
      severity: 'high',
      title: 'Seuil critique franchi',
      description: 'La progression est inférieure à 50% alors que la période est avancée.',
      metric: 'progression',
      currentValue: objective.progressPercent,
      expectedValue: 80,
      zScore: 0,
    }));
  }

  return anomalies;
}

/**
 * Detect anomalies across multiple objectives
 */
export function detectMultiObjectiveAnomalies(
  objectives: ObjectiveWithProgress[]
): Anomaly[] {
  const anomalies: Anomaly[] = [];

  // Check for correlated objectives with divergent behavior
  const revenueObj = objectives.find(o => o.type === 'revenue_total');
  const expensesObj = objectives.find(o => o.type === 'expenses_total');

  if (revenueObj && expensesObj) {
    // If revenue is down but expenses are up, flag it
    if (revenueObj.progressPercent < 70 && expensesObj.progressPercent > 100) {
      anomalies.push(createAnomaly({
        objectiveId: revenueObj.id,
        type: 'threshold_breach',
        severity: 'critical',
        title: 'Déséquilibre revenus/dépenses',
        description: 'Les revenus sont en retard alors que les dépenses dépassent le budget.',
        metric: 'ratio',
        currentValue: revenueObj.progressPercent,
        expectedValue: expensesObj.progressPercent,
        zScore: 0,
      }));
    }
  }

  // Check for objectives that are significantly behind others in same category
  const categoryGroups = groupByCategory(objectives);
  for (const [category, objs] of Object.entries(categoryGroups)) {
    if (objs.length < 2) continue;

    const avgProgress = calculateMean(objs.map(o => o.progressPercent));
    for (const obj of objs) {
      if (obj.progressPercent < avgProgress * 0.5) {
        anomalies.push(createAnomaly({
          objectiveId: obj.id,
          type: 'deceleration',
          severity: 'medium',
          title: 'Objectif en retard significatif',
          description: `Cet objectif est significativement en retard par rapport aux autres objectifs de la catégorie ${category}.`,
          metric: 'comparaison',
          currentValue: obj.progressPercent,
          expectedValue: avgProgress,
          zScore: 0,
        }));
      }
    }
  }

  return anomalies;
}

// Helper functions
function calculateMean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function calculateStdDev(values: number[], mean?: number): number {
  if (values.length < 2) return 0;
  const m = mean ?? calculateMean(values);
  const variance = values.reduce((sum, val) => sum + Math.pow(val - m, 2), 0) / values.length;
  return Math.sqrt(variance);
}

function calculateVariance(values: number[]): number {
  const mean = calculateMean(values);
  return values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
}

function getThreshold(sensitivity: 'low' | 'medium' | 'high', base: number): number {
  switch (sensitivity) {
    case 'low':
      return base * 1.5;
    case 'high':
      return base * 0.75;
    default:
      return base;
  }
}

function getSeverity(zScore: number): 'low' | 'medium' | 'high' | 'critical' {
  const absZ = Math.abs(zScore);
  if (absZ > 4) return 'critical';
  if (absZ > 3) return 'high';
  if (absZ > 2) return 'medium';
  return 'low';
}

function detectTrendReversal(
  objective: ObjectiveWithProgress,
  historicalData: number[]
): Anomaly | null {
  if (historicalData.length < 6) return null;

  const firstHalf = historicalData.slice(0, Math.floor(historicalData.length / 2));
  const secondHalf = historicalData.slice(Math.floor(historicalData.length / 2));

  const firstTrend = calculateTrend(firstHalf);
  const secondTrend = calculateTrend(secondHalf);

  // If trends have opposite signs with significant magnitude
  if (firstTrend * secondTrend < 0 && Math.abs(firstTrend) > 0.1 && Math.abs(secondTrend) > 0.1) {
    return createAnomaly({
      objectiveId: objective.id,
      type: 'trend_reversal',
      severity: secondTrend < 0 ? 'high' : 'low',
      title: secondTrend < 0 ? 'Renversement de tendance négatif' : 'Renversement de tendance positif',
      description: `La tendance est passée de ${firstTrend > 0 ? 'positive' : 'négative'} à ${secondTrend > 0 ? 'positive' : 'négative'}.`,
      metric: 'trend',
      currentValue: secondTrend,
      expectedValue: firstTrend,
      zScore: 0,
    });
  }

  return null;
}

function calculateTrend(values: number[]): number {
  if (values.length < 2) return 0;

  const n = values.length;
  const xMean = (n - 1) / 2;
  const yMean = calculateMean(values);

  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i++) {
    numerator += (i - xMean) * (values[i] - yMean);
    denominator += Math.pow(i - xMean, 2);
  }

  return denominator !== 0 ? numerator / denominator : 0;
}

function isLateInPeriod(objective: ObjectiveWithProgress): boolean {
  const now = new Date();

  if (objective.period === 'monthly' && objective.month) {
    const daysInMonth = new Date(objective.year, objective.month, 0).getDate();
    return now.getDate() > daysInMonth * 0.7;
  }

  if (objective.period === 'quarterly' && objective.quarter) {
    const quarterMonth = now.getMonth() % 3;
    return quarterMonth >= 2;
  }

  if (objective.period === 'yearly') {
    return now.getMonth() >= 9; // October onwards
  }

  return false;
}

function groupByCategory(objectives: ObjectiveWithProgress[]): Record<string, ObjectiveWithProgress[]> {
  return objectives.reduce((acc, obj) => {
    const category = obj.type.split('_')[0];
    if (!acc[category]) acc[category] = [];
    acc[category].push(obj);
    return acc;
  }, {} as Record<string, ObjectiveWithProgress[]>);
}

function createAnomaly(data: Omit<Anomaly, 'id' | 'detectedAt'>): Anomaly {
  return {
    ...data,
    id: `anomaly_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    detectedAt: new Date().toISOString(),
  };
}
