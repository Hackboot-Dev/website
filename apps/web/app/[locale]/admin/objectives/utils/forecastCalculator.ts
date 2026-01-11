// /workspaces/website/apps/web/app/[locale]/admin/objectives/utils/forecastCalculator.ts
// Description: Utilities for calculating forecasts and projections
// Last modified: 2026-01-10
// COMPLETE FILE

import type { ObjectiveWithProgress } from '../types';

export interface ForecastResult {
  projected: number;
  optimistic: number;
  pessimistic: number;
  confidence: number;
  daysRemaining: number;
  dailyRequired: number;
  willAchieve: boolean;
}

export interface ProjectionPoint {
  date: string;
  label: string;
  projected: number;
  optimistic: number;
  pessimistic: number;
  target: number;
}

/**
 * Calculate linear projection for an objective
 */
export function calculateLinearProjection(objective: ObjectiveWithProgress): ForecastResult {
  const now = new Date();
  const { daysElapsed, daysRemaining, totalDays } = calculateDayMetrics(objective, now);

  if (daysElapsed === 0) {
    return {
      projected: 0,
      optimistic: 0,
      pessimistic: 0,
      confidence: 0,
      daysRemaining,
      dailyRequired: objective.targetAmount / totalDays,
      willAchieve: false,
    };
  }

  const dailyRate = objective.actualAmount / daysElapsed;
  const projected = objective.actualAmount + (dailyRate * daysRemaining);
  const optimistic = objective.actualAmount + (dailyRate * 1.2 * daysRemaining);
  const pessimistic = objective.actualAmount + (dailyRate * 0.8 * daysRemaining);

  const dailyRequired = daysRemaining > 0
    ? (objective.targetAmount - objective.actualAmount) / daysRemaining
    : 0;

  // Confidence decreases as we have less time
  const timeConfidence = Math.max(50, 100 - (daysRemaining / totalDays) * 30);

  // Confidence based on current progress vs expected
  const expectedProgress = (daysElapsed / totalDays) * 100;
  const progressDiff = objective.progressPercent - expectedProgress;
  const progressConfidence = Math.min(100, Math.max(0, 70 + progressDiff));

  const confidence = (timeConfidence + progressConfidence) / 2;

  return {
    projected,
    optimistic,
    pessimistic,
    confidence,
    daysRemaining,
    dailyRequired,
    willAchieve: projected >= objective.targetAmount,
  };
}

/**
 * Calculate seasonal projection using historical patterns
 */
export function calculateSeasonalProjection(
  objective: ObjectiveWithProgress,
  historicalData: number[]
): ForecastResult {
  const linearResult = calculateLinearProjection(objective);

  if (historicalData.length < 12) {
    return linearResult;
  }

  const now = new Date();
  const currentMonth = now.getMonth();

  // Calculate seasonal factor for remaining months
  const yearlyAverage = historicalData.reduce((a, b) => a + b, 0) / 12;
  const remainingMonthsFactors = historicalData
    .slice(currentMonth + 1)
    .map(monthValue => monthValue / yearlyAverage);

  const avgRemainingFactor = remainingMonthsFactors.length > 0
    ? remainingMonthsFactors.reduce((a, b) => a + b, 0) / remainingMonthsFactors.length
    : 1;

  const seasonalProjected = linearResult.projected * avgRemainingFactor;

  return {
    ...linearResult,
    projected: seasonalProjected,
    optimistic: seasonalProjected * 1.15,
    pessimistic: seasonalProjected * 0.85,
  };
}

/**
 * Generate projection points for charting
 */
export function generateProjectionPoints(
  objective: ObjectiveWithProgress,
  numberOfPoints: number = 10
): ProjectionPoint[] {
  const points: ProjectionPoint[] = [];
  const now = new Date();
  const { daysRemaining, totalDays, endDate } = calculateDayMetrics(objective, now);

  if (daysRemaining <= 0) return points;

  const dailyRate = objective.actualAmount / Math.max(1, totalDays - daysRemaining);
  const interval = Math.max(1, Math.floor(daysRemaining / numberOfPoints));

  for (let i = 1; i <= numberOfPoints; i++) {
    const daysFromNow = Math.min(i * interval, daysRemaining);
    const date = new Date(now);
    date.setDate(date.getDate() + daysFromNow);

    const projected = objective.actualAmount + (dailyRate * daysFromNow);
    const optimistic = objective.actualAmount + (dailyRate * 1.2 * daysFromNow);
    const pessimistic = objective.actualAmount + (dailyRate * 0.8 * daysFromNow);

    points.push({
      date: date.toISOString(),
      label: formatDateLabel(date, objective.period),
      projected: Math.round(projected),
      optimistic: Math.round(optimistic),
      pessimistic: Math.round(pessimistic),
      target: objective.targetAmount,
    });
  }

  return points;
}

/**
 * Calculate scenario projections
 */
export function calculateScenarios(objective: ObjectiveWithProgress): {
  optimistic: number;
  expected: number;
  pessimistic: number;
} {
  const forecast = calculateLinearProjection(objective);

  return {
    optimistic: Math.round(forecast.projected * 1.2),
    expected: Math.round(forecast.projected),
    pessimistic: Math.round(forecast.projected * 0.8),
  };
}

// Helper functions
function calculateDayMetrics(objective: ObjectiveWithProgress, now: Date): {
  daysElapsed: number;
  daysRemaining: number;
  totalDays: number;
  startDate: Date;
  endDate: Date;
} {
  let startDate: Date;
  let endDate: Date;

  if (objective.period === 'yearly') {
    startDate = new Date(objective.year, 0, 1);
    endDate = new Date(objective.year, 11, 31);
  } else if (objective.period === 'quarterly' && objective.quarter) {
    const startMonth = (objective.quarter - 1) * 3;
    startDate = new Date(objective.year, startMonth, 1);
    endDate = new Date(objective.year, startMonth + 3, 0);
  } else if (objective.period === 'monthly' && objective.month) {
    startDate = new Date(objective.year, objective.month - 1, 1);
    endDate = new Date(objective.year, objective.month, 0);
  } else {
    startDate = new Date(objective.year, 0, 1);
    endDate = new Date(objective.year, 11, 31);
  }

  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysElapsed = Math.max(0, Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
  const daysRemaining = Math.max(0, totalDays - daysElapsed);

  return { daysElapsed, daysRemaining, totalDays, startDate, endDate };
}

function formatDateLabel(date: Date, period: string): string {
  if (period === 'monthly') {
    return date.getDate().toString();
  }
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}
