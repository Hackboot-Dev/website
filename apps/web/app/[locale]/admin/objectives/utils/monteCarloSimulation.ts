// /workspaces/website/apps/web/app/[locale]/admin/objectives/utils/monteCarloSimulation.ts
// Description: Monte Carlo simulation for objective forecasting
// Last modified: 2026-01-10
// COMPLETE FILE

import type { ObjectiveWithProgress } from '../types';

export interface MonteCarloParams {
  baseValue: number;
  growthRate: number;
  volatility: number;
  daysRemaining: number;
  simulations?: number;
}

export interface MonteCarloResult {
  p5: number;
  p25: number;
  p50: number;
  p75: number;
  p95: number;
  mean: number;
  stdDev: number;
  probability: number;
  simulations: number[];
  distribution: { bucket: number; count: number }[];
}

/**
 * Run Monte Carlo simulation for objective projection
 * Uses geometric Brownian motion model
 */
export function runMonteCarloSimulation(
  objective: ObjectiveWithProgress,
  iterations: number = 1000
): MonteCarloResult {
  const now = new Date();
  const { daysElapsed, daysRemaining, totalDays } = calculateDayMetrics(objective, now);

  if (daysRemaining <= 0) {
    return createEmptyResult(objective.actualAmount);
  }

  // Calculate parameters from historical performance
  const dailyAverage = daysElapsed > 0 ? objective.actualAmount / daysElapsed : 0;

  // Estimate volatility (in production, use historical standard deviation)
  const estimatedVolatility = dailyAverage * 0.15; // 15% daily volatility

  const results: number[] = [];

  for (let i = 0; i < iterations; i++) {
    let projected = objective.actualAmount;

    for (let day = 0; day < daysRemaining; day++) {
      // Generate random daily increment using Box-Muller transform
      const u1 = Math.random();
      const u2 = Math.random();
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

      const dailyIncrement = dailyAverage + z * estimatedVolatility;
      projected += Math.max(0, dailyIncrement); // Can't have negative daily values
    }

    results.push(projected);
  }

  // Sort for percentile calculation
  results.sort((a, b) => a - b);

  // Calculate percentiles
  const p5 = results[Math.floor(iterations * 0.05)];
  const p25 = results[Math.floor(iterations * 0.25)];
  const p50 = results[Math.floor(iterations * 0.5)];
  const p75 = results[Math.floor(iterations * 0.75)];
  const p95 = results[Math.floor(iterations * 0.95)];

  // Calculate mean and standard deviation
  const mean = results.reduce((a, b) => a + b, 0) / iterations;
  const variance = results.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / iterations;
  const stdDev = Math.sqrt(variance);

  // Calculate probability of achieving target
  const successCount = results.filter(r => r >= objective.targetAmount).length;
  const probability = (successCount / iterations) * 100;

  // Create distribution buckets
  const distribution = createDistribution(results, 20);

  return {
    p5,
    p25,
    p50,
    p75,
    p95,
    mean,
    stdDev,
    probability,
    simulations: results,
    distribution,
  };
}

/**
 * Run simulation with custom parameters
 */
export function runCustomSimulation(params: MonteCarloParams): MonteCarloResult {
  const iterations = params.simulations || 1000;
  const results: number[] = [];

  for (let i = 0; i < iterations; i++) {
    let projected = params.baseValue;

    for (let day = 0; day < params.daysRemaining; day++) {
      const u1 = Math.random();
      const u2 = Math.random();
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

      const dailyGrowth = (params.growthRate / 365) * projected;
      const randomComponent = z * params.volatility * projected / Math.sqrt(365);
      projected += dailyGrowth + randomComponent;
      projected = Math.max(0, projected);
    }

    results.push(projected);
  }

  results.sort((a, b) => a - b);

  const p5 = results[Math.floor(iterations * 0.05)];
  const p25 = results[Math.floor(iterations * 0.25)];
  const p50 = results[Math.floor(iterations * 0.5)];
  const p75 = results[Math.floor(iterations * 0.75)];
  const p95 = results[Math.floor(iterations * 0.95)];

  const mean = results.reduce((a, b) => a + b, 0) / iterations;
  const variance = results.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / iterations;
  const stdDev = Math.sqrt(variance);

  return {
    p5,
    p25,
    p50,
    p75,
    p95,
    mean,
    stdDev,
    probability: 0, // Caller should calculate based on their target
    simulations: results,
    distribution: createDistribution(results, 20),
  };
}

/**
 * Calculate confidence interval
 */
export function calculateConfidenceInterval(
  result: MonteCarloResult,
  confidenceLevel: number = 0.95
): { lower: number; upper: number } {
  const alpha = 1 - confidenceLevel;
  const lowerIndex = Math.floor(result.simulations.length * (alpha / 2));
  const upperIndex = Math.floor(result.simulations.length * (1 - alpha / 2));

  return {
    lower: result.simulations[lowerIndex],
    upper: result.simulations[upperIndex],
  };
}

// Helper functions
function calculateDayMetrics(objective: ObjectiveWithProgress, now: Date) {
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

  return { daysElapsed, daysRemaining, totalDays };
}

function createEmptyResult(value: number): MonteCarloResult {
  return {
    p5: value,
    p25: value,
    p50: value,
    p75: value,
    p95: value,
    mean: value,
    stdDev: 0,
    probability: value >= value ? 100 : 0,
    simulations: [value],
    distribution: [{ bucket: value, count: 1 }],
  };
}

function createDistribution(results: number[], buckets: number): { bucket: number; count: number }[] {
  const min = results[0];
  const max = results[results.length - 1];
  const bucketSize = (max - min) / buckets;

  const distribution: { bucket: number; count: number }[] = [];

  for (let i = 0; i < buckets; i++) {
    const bucketStart = min + i * bucketSize;
    const bucketEnd = bucketStart + bucketSize;
    const count = results.filter(r => r >= bucketStart && r < bucketEnd).length;
    distribution.push({ bucket: bucketStart + bucketSize / 2, count });
  }

  return distribution;
}
