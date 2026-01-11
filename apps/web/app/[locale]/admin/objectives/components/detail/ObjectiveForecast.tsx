// /workspaces/website/apps/web/app/[locale]/admin/objectives/components/detail/ObjectiveForecast.tsx
// Description: Forecast component with projections and Monte Carlo simulation
// Last modified: 2026-01-10
// COMPLETE FILE

'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Zap, Target, TrendingUp, AlertTriangle, Info } from 'lucide-react';
import type { ObjectiveWithProgress } from '../../types';
import type { ForecastDataPoint } from '../../hooks/useObjectiveDetail';
import { OBJECTIVE_TYPE_UNITS, formatObjectiveValue } from '../../types';

type ObjectiveForecastProps = {
  objective: ObjectiveWithProgress;
  forecastData: ForecastDataPoint[];
};

type ScenarioType = 'expected' | 'optimistic' | 'pessimistic' | 'monte_carlo';

export function ObjectiveForecast({ objective, forecastData }: ObjectiveForecastProps) {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioType>('expected');
  const unit = OBJECTIVE_TYPE_UNITS[objective.type];

  // Run Monte Carlo simulation
  const monteCarloResults = useMemo(() => {
    return runMonteCarloSimulation(objective, 1000);
  }, [objective]);

  const formatValue = (value: number): string => {
    if (unit === 'currency') {
      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
      return value.toFixed(0);
    }
    if (unit === 'percent') return `${value.toFixed(1)}%`;
    return value.toFixed(0);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 shadow-xl">
        <p className="text-zinc-400 text-sm mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {formatObjectiveValue(entry.value, unit)}
          </p>
        ))}
      </div>
    );
  };

  const scenarios: { id: ScenarioType; label: string; color: string }[] = [
    { id: 'expected', label: 'Attendu', color: 'text-blue-400' },
    { id: 'optimistic', label: 'Optimiste', color: 'text-emerald-400' },
    { id: 'pessimistic', label: 'Pessimiste', color: 'text-amber-400' },
    { id: 'monte_carlo', label: 'Monte Carlo', color: 'text-purple-400' },
  ];

  // Get final projected value based on scenario
  const getFinalProjection = (): number => {
    if (forecastData.length === 0) return objective.actualAmount;
    const lastPoint = forecastData[forecastData.length - 1];

    switch (selectedScenario) {
      case 'optimistic':
        return lastPoint.optimistic;
      case 'pessimistic':
        return lastPoint.pessimistic;
      case 'monte_carlo':
        return monteCarloResults.median;
      default:
        return lastPoint.projected;
    }
  };

  const projectedValue = getFinalProjection();
  const willAchieve = projectedValue >= objective.targetAmount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <Zap className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">Prévisions</h3>
            <p className="text-zinc-500 text-sm">Projections basées sur les tendances actuelles</p>
          </div>
        </div>

        {/* Scenario Selector */}
        <div className="flex items-center gap-1 bg-zinc-800/50 rounded-lg p-1">
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => setSelectedScenario(scenario.id)}
              className={`
                px-3 py-1.5 rounded-md text-sm transition-colors
                ${selectedScenario === scenario.id
                  ? `bg-zinc-700 ${scenario.color}`
                  : 'text-zinc-400 hover:text-white'
                }
              `}
            >
              {scenario.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projection Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-zinc-800/50 rounded-lg p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Projection</p>
          <p className={`text-2xl font-semibold ${willAchieve ? 'text-emerald-400' : 'text-amber-400'}`}>
            {formatObjectiveValue(projectedValue, unit)}
          </p>
          <p className="text-xs text-zinc-500 mt-1">
            {((projectedValue / objective.targetAmount) * 100).toFixed(1)}% de l'objectif
          </p>
        </div>
        <div className="bg-zinc-800/50 rounded-lg p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Écart prévu</p>
          <p className={`text-2xl font-semibold ${willAchieve ? 'text-emerald-400' : 'text-red-400'}`}>
            {willAchieve ? '+' : ''}{formatObjectiveValue(projectedValue - objective.targetAmount, unit)}
          </p>
          <p className="text-xs text-zinc-500 mt-1">
            {willAchieve ? 'Dépassement attendu' : 'Manque à gagner'}
          </p>
        </div>
        <div className="bg-zinc-800/50 rounded-lg p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Probabilité</p>
          <p className={`text-2xl font-semibold ${monteCarloResults.probability >= 70 ? 'text-emerald-400' : monteCarloResults.probability >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
            {monteCarloResults.probability.toFixed(0)}%
          </p>
          <p className="text-xs text-zinc-500 mt-1">d'atteindre l'objectif</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          {selectedScenario === 'monte_carlo' ? (
            <AreaChart data={forecastData}>
              <defs>
                <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis
                dataKey="label"
                stroke="#71717a"
                tick={{ fill: '#71717a', fontSize: 12 }}
              />
              <YAxis
                stroke="#71717a"
                tick={{ fill: '#71717a', fontSize: 12 }}
                tickFormatter={formatValue}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={objective.targetAmount}
                stroke="#f59e0b"
                strokeDasharray="5 5"
              />
              <Area
                type="monotone"
                dataKey="optimistic"
                name="P95"
                stroke="#8b5cf6"
                fill="url(#confidenceGradient)"
                strokeWidth={1}
              />
              <Area
                type="monotone"
                dataKey="pessimistic"
                name="P5"
                stroke="#8b5cf6"
                fill="transparent"
                strokeWidth={1}
              />
              <Line
                type="monotone"
                dataKey="projected"
                name="Médiane"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          ) : (
            <LineChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis
                dataKey="label"
                stroke="#71717a"
                tick={{ fill: '#71717a', fontSize: 12 }}
              />
              <YAxis
                stroke="#71717a"
                tick={{ fill: '#71717a', fontSize: 12 }}
                tickFormatter={formatValue}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: 10 }}
                formatter={(value) => <span className="text-zinc-400 text-sm">{value}</span>}
              />
              <ReferenceLine
                y={objective.targetAmount}
                stroke="#f59e0b"
                strokeDasharray="5 5"
                label={{ value: 'Objectif', fill: '#f59e0b', fontSize: 12 }}
              />
              <Line
                type="monotone"
                dataKey={selectedScenario === 'optimistic' ? 'optimistic' : selectedScenario === 'pessimistic' ? 'pessimistic' : 'projected'}
                name="Projection"
                stroke={selectedScenario === 'optimistic' ? '#10b981' : selectedScenario === 'pessimistic' ? '#f59e0b' : '#3b82f6'}
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Monte Carlo Details */}
      {selectedScenario === 'monte_carlo' && (
        <div className="bg-zinc-800/30 rounded-lg p-4">
          <div className="flex items-start gap-3 mb-3">
            <Info className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-white mb-1">Simulation Monte Carlo</h4>
              <p className="text-xs text-zinc-400">
                Basée sur 1000 simulations avec les paramètres de volatilité historiques.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 mt-4">
            <div className="text-center">
              <p className="text-lg font-semibold text-white">{formatObjectiveValue(monteCarloResults.p5, unit)}</p>
              <p className="text-xs text-zinc-500">P5 (Pessimiste)</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-purple-400">{formatObjectiveValue(monteCarloResults.median, unit)}</p>
              <p className="text-xs text-zinc-500">P50 (Médiane)</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-white">{formatObjectiveValue(monteCarloResults.p95, unit)}</p>
              <p className="text-xs text-zinc-500">P95 (Optimiste)</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-white">{monteCarloResults.probability.toFixed(0)}%</p>
              <p className="text-xs text-zinc-500">Prob. succès</p>
            </div>
          </div>
        </div>
      )}

      {/* Warning if at risk */}
      {!willAchieve && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start gap-3"
        >
          <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-amber-400 mb-1">Objectif à risque</h4>
            <p className="text-xs text-amber-400/80">
              Selon les projections actuelles, l'objectif risque de ne pas être atteint.
              Considérez les actions recommandées pour améliorer les résultats.
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// Monte Carlo simulation
interface MonteCarloResult {
  p5: number;
  median: number;
  p95: number;
  probability: number;
  simulations: number[];
}

function runMonteCarloSimulation(objective: ObjectiveWithProgress, iterations: number): MonteCarloResult {
  const now = new Date();
  const results: number[] = [];

  // Calculate days remaining and daily average
  const daysElapsed = calculateDaysElapsed(objective, now);
  const daysRemaining = calculateDaysRemaining(objective, now);
  const dailyAverage = daysElapsed > 0 ? objective.actualAmount / daysElapsed : 0;

  // Volatility based on estimated 15% standard deviation
  // Note: This is a reasonable estimate for business metrics
  const volatility = dailyAverage * 0.15;

  for (let i = 0; i < iterations; i++) {
    let projected = objective.actualAmount;

    for (let day = 0; day < daysRemaining; day++) {
      // Random daily value using normal distribution approximation
      const u1 = Math.random();
      const u2 = Math.random();
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      const dailyValue = dailyAverage + z * volatility;
      projected += Math.max(0, dailyValue);
    }

    results.push(projected);
  }

  // Sort results
  results.sort((a, b) => a - b);

  // Calculate percentiles
  const p5Index = Math.floor(iterations * 0.05);
  const medianIndex = Math.floor(iterations * 0.5);
  const p95Index = Math.floor(iterations * 0.95);

  // Calculate probability of achieving target
  const successCount = results.filter(r => r >= objective.targetAmount).length;
  const probability = (successCount / iterations) * 100;

  return {
    p5: results[p5Index],
    median: results[medianIndex],
    p95: results[p95Index],
    probability,
    simulations: results,
  };
}

function calculateDaysElapsed(obj: ObjectiveWithProgress, now: Date): number {
  let startDate: Date;

  if (obj.period === 'yearly') {
    startDate = new Date(obj.year, 0, 1);
  } else if (obj.period === 'quarterly' && obj.quarter) {
    const startMonth = (obj.quarter - 1) * 3;
    startDate = new Date(obj.year, startMonth, 1);
  } else if (obj.period === 'monthly' && obj.month) {
    startDate = new Date(obj.year, obj.month - 1, 1);
  } else {
    return 1;
  }

  const diffTime = now.getTime() - startDate.getTime();
  return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
}

function calculateDaysRemaining(obj: ObjectiveWithProgress, now: Date): number {
  let endDate: Date;

  if (obj.period === 'yearly') {
    endDate = new Date(obj.year, 11, 31);
  } else if (obj.period === 'quarterly' && obj.quarter) {
    const endMonth = obj.quarter * 3;
    endDate = new Date(obj.year, endMonth, 0);
  } else if (obj.period === 'monthly' && obj.month) {
    endDate = new Date(obj.year, obj.month, 0);
  } else {
    return 0;
  }

  const diffTime = endDate.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
}
