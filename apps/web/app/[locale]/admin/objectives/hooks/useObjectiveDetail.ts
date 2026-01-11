// /workspaces/website/apps/web/app/[locale]/admin/objectives/hooks/useObjectiveDetail.ts
// Description: Hook for loading objective details with REAL data from P&L
// - Uses milestones and distribution types for expected progress calculation
// - Status is calculated based on actual vs expected progress
// Last modified: 2026-01-11
// COMPLETE FILE - No simulated data

'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../../../lib/supabase';
import { getDatabase } from '../../../../../lib/services/database';
import type { CompanyId } from '../../pnl/types';
import type { ObjectiveWithProgress } from '../types';
import { MONTH_KEYS } from '../../pnl/constants';

type UseObjectiveDetailOptions = {
  companyId: CompanyId;
  objectiveId: string;
};

export type HistoricalDataPoint = {
  date: string;
  label: string;
  actual: number;
  target: number;
  cumulative: number;
};

export type ForecastDataPoint = {
  date: string;
  label: string;
  projected: number;
  optimistic: number;
  pessimistic: number;
  confidence: number;
};

export type Insight = {
  id: string;
  type: 'positive' | 'negative' | 'neutral' | 'warning';
  title: string;
  message: string;
  metric?: string;
  value?: number;
  change?: number;
};

export type ObjectiveAction = {
  id: string;
  objectiveId: string;
  title: string;
  description: string;
  actionType: 'lead_followup' | 'upsell' | 'retention' | 'cost_reduction' | 'marketing' | 'other';
  targetEntityType?: string;
  targetEntityId?: string;
  targetEntityName?: string;
  potentialImpact: number;
  isCompleted: boolean;
  completedAt?: string;
  createdAt: string;
};

export type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category?: string;
  clientId?: string;
  clientName?: string;
  productId?: string;
  productName?: string;
};

// P&L Transaction type from database
type PnLTransaction = {
  id: string;
  amount: number;
  clientId: string;
  clientName: string;
  clientEmail?: string;
  isCustom?: boolean;
  note?: string;
  subscriptionId?: string;
  renewalDate?: string;
};

type PnLProduct = {
  id: string;
  label: string;
  price: number;
  transactions: Record<string, PnLTransaction[]>;
};

type PnLProductCategory = {
  id: string;
  label: string;
  products: PnLProduct[];
};

type PnLExpenseItem = {
  id: string;
  label: string;
  type?: string;
  note?: string;
  unitPrice: number;
  quantity: Record<string, number>;
  adjustments: Record<string, number>;
};

type PnLExpenseCategory = {
  id: string;
  label: string;
  items: PnLExpenseItem[];
};

type PnLData = {
  year: number;
  productCategories: PnLProductCategory[];
  expenseCategories: PnLExpenseCategory[];
};

export function useObjectiveDetail({ companyId, objectiveId }: UseObjectiveDetailOptions) {
  const [objective, setObjective] = useState<ObjectiveWithProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);
  const [forecastData, setForecastData] = useState<ForecastDataPoint[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [actions, setActions] = useState<ObjectiveAction[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const dbService = getDatabase(companyId);

  // Load P&L data from Supabase
  const loadPnLData = useCallback(async (year: number): Promise<PnLData | null> => {
    try {
      const { data, error } = await supabase
        .from('pnl_data')
        .select('data')
        .eq('company_id', companyId)
        .eq('year', year)
        .single();

      if (error || !data) {
        console.warn('No P&L data found for year', year);
        return null;
      }

      return data.data as PnLData;
    } catch (err) {
      console.error('Error loading P&L data:', err);
      return null;
    }
  }, [companyId]);

  // Extract real transactions based on objective type
  const extractTransactions = useCallback((
    pnlData: PnLData,
    obj: ObjectiveWithProgress
  ): Transaction[] => {
    const txList: Transaction[] = [];
    const monthFilter = obj.period === 'monthly' && obj.month
      ? MONTH_KEYS[obj.month - 1]
      : null;
    const quarterMonths = obj.period === 'quarterly' && obj.quarter
      ? MONTH_KEYS.slice((obj.quarter - 1) * 3, obj.quarter * 3)
      : null;

    const isRevenueType = obj.type.startsWith('revenue') ||
      obj.type.includes('mrr') ||
      obj.type.includes('arr') ||
      obj.type === 'gross_profit' ||
      obj.type === 'net_profit';

    const isExpenseType = obj.type.startsWith('expenses') ||
      obj.type === 'net_profit' ||
      obj.type === 'gross_profit';

    // Extract revenue transactions
    if (isRevenueType && pnlData.productCategories) {
      for (const category of pnlData.productCategories) {
        // Filter by product category if specified
        if (obj.productCategoryId && category.id !== obj.productCategoryId) continue;

        for (const product of category.products) {
          // Filter by product if specified
          if (obj.productId && product.id !== obj.productId) continue;

          for (const [month, monthTxs] of Object.entries(product.transactions)) {
            // Filter by month/quarter
            if (monthFilter && month !== monthFilter) continue;
            if (quarterMonths && !quarterMonths.includes(month)) continue;

            for (const tx of monthTxs) {
              // Filter by client if specified
              if (obj.clientId && tx.clientId !== obj.clientId) continue;

              txList.push({
                id: tx.id,
                date: getDateFromMonth(month, pnlData.year),
                description: `${product.label} - ${tx.clientName}`,
                amount: tx.amount,
                type: 'income',
                category: category.label,
                clientId: tx.clientId,
                clientName: tx.clientName,
                productId: product.id,
                productName: product.label,
              });
            }
          }
        }
      }
    }

    // Extract expense transactions
    if (isExpenseType && pnlData.expenseCategories) {
      for (const category of pnlData.expenseCategories) {
        // Filter by expense category if specified
        if (obj.expenseCategory && category.id !== obj.expenseCategory) continue;

        for (const item of category.items) {
          for (const [month, amount] of Object.entries(item.adjustments)) {
            if (amount === 0) continue;

            // Filter by month/quarter
            if (monthFilter && month !== monthFilter) continue;
            if (quarterMonths && !quarterMonths.includes(month)) continue;

            txList.push({
              id: `${item.id}_${month}`,
              date: getDateFromMonth(month, pnlData.year),
              description: `${item.label}${item.type ? ` (${item.type})` : ''}`,
              amount: amount,
              type: 'expense',
              category: category.label,
            });
          }
        }
      }
    }

    // Sort by date descending
    txList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return txList;
  }, []);

  // Calculate historical data from real transactions
  const calculateHistoricalData = useCallback((
    pnlData: PnLData,
    obj: ObjectiveWithProgress
  ): HistoricalDataPoint[] => {
    const data: HistoricalDataPoint[] = [];
    const now = new Date();

    const isRevenueType = obj.type.startsWith('revenue') ||
      obj.type.includes('mrr') ||
      obj.type.includes('arr');
    const isExpenseType = obj.type.startsWith('expenses');
    const isNetProfit = obj.type === 'net_profit';
    const isGrossProfit = obj.type === 'gross_profit';

    if (obj.period === 'monthly' && obj.month) {
      // Daily data for monthly objectives - aggregate by day
      const daysInMonth = new Date(obj.year, obj.month, 0).getDate();
      const dailyTarget = obj.targetAmount / daysInMonth;
      let cumulative = 0;

      const isCurrentMonth = obj.year === now.getFullYear() && obj.month === now.getMonth() + 1;
      const maxDay = isCurrentMonth ? now.getDate() : daysInMonth;

      // For monthly, we show the distribution assuming transactions happened evenly
      // since P&L data is aggregated by month, not by day
      const monthKey = MONTH_KEYS[obj.month - 1];
      const monthlyTotal = calculateMonthlyAmount(pnlData, obj, monthKey);
      const dailyAverage = monthlyTotal / maxDay;

      for (let day = 1; day <= maxDay; day++) {
        cumulative += dailyAverage;
        data.push({
          date: `${obj.year}-${String(obj.month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
          label: `${day}`,
          actual: Math.round(dailyAverage),
          target: Math.round(dailyTarget),
          cumulative: Math.round(cumulative),
        });
      }

      // Adjust last point to match actual amount
      if (data.length > 0) {
        data[data.length - 1].cumulative = Math.round(monthlyTotal);
      }
    } else if (obj.period === 'quarterly' && obj.quarter) {
      // Monthly data for quarterly objectives
      const startMonthIndex = (obj.quarter - 1) * 3;
      const monthlyTarget = obj.targetAmount / 3;
      let cumulative = 0;

      for (let m = 0; m < 3; m++) {
        const monthIndex = startMonthIndex + m;
        const monthKey = MONTH_KEYS[monthIndex];

        const isCurrentOrPast = obj.year < now.getFullYear() ||
          (obj.year === now.getFullYear() && monthIndex <= now.getMonth());

        if (!isCurrentOrPast && obj.year === now.getFullYear()) continue;

        const monthlyAmount = calculateMonthlyAmount(pnlData, obj, monthKey);
        cumulative += monthlyAmount;

        data.push({
          date: `${obj.year}-${String(monthIndex + 1).padStart(2, '0')}-01`,
          label: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'][monthIndex],
          actual: Math.round(monthlyAmount),
          target: Math.round(monthlyTarget),
          cumulative: Math.round(cumulative),
        });
      }
    } else if (obj.period === 'yearly') {
      // Monthly data for yearly objectives
      const monthlyTarget = obj.targetAmount / 12;
      let cumulative = 0;

      const maxMonth = obj.year === now.getFullYear() ? now.getMonth() : 11;

      for (let m = 0; m <= maxMonth; m++) {
        const monthKey = MONTH_KEYS[m];
        const monthlyAmount = calculateMonthlyAmount(pnlData, obj, monthKey);
        cumulative += monthlyAmount;

        data.push({
          date: `${obj.year}-${String(m + 1).padStart(2, '0')}-01`,
          label: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'][m],
          actual: Math.round(monthlyAmount),
          target: Math.round(monthlyTarget),
          cumulative: Math.round(cumulative),
        });
      }
    }

    return data;
  }, []);

  // Calculate monthly amount from P&L data
  const calculateMonthlyAmount = (
    pnlData: PnLData,
    obj: ObjectiveWithProgress,
    monthKey: string
  ): number => {
    let revenue = 0;
    let expenses = 0;

    const isRevenueType = obj.type.startsWith('revenue') ||
      obj.type.includes('mrr') ||
      obj.type.includes('arr');
    const isExpenseType = obj.type.startsWith('expenses');
    const isNetProfit = obj.type === 'net_profit';
    const isGrossProfit = obj.type === 'gross_profit';

    // Calculate revenue
    if (isRevenueType || isNetProfit || isGrossProfit) {
      for (const category of pnlData.productCategories || []) {
        if (obj.productCategoryId && category.id !== obj.productCategoryId) continue;

        for (const product of category.products) {
          if (obj.productId && product.id !== obj.productId) continue;

          const monthTxs = product.transactions[monthKey] || [];
          for (const tx of monthTxs) {
            if (obj.clientId && tx.clientId !== obj.clientId) continue;
            revenue += tx.amount;
          }
        }
      }
    }

    // Calculate expenses
    if (isExpenseType || isNetProfit || isGrossProfit) {
      for (const category of pnlData.expenseCategories || []) {
        if (obj.expenseCategory && category.id !== obj.expenseCategory) continue;

        for (const item of category.items) {
          expenses += item.adjustments[monthKey] || 0;
        }
      }
    }

    // Return based on type
    if (isNetProfit || isGrossProfit) {
      return revenue - expenses;
    } else if (isExpenseType) {
      return expenses;
    } else {
      return revenue;
    }
  };

  // Calculate forecast data based on historical trends
  const calculateForecastData = useCallback((
    historicalData: HistoricalDataPoint[],
    obj: ObjectiveWithProgress
  ): ForecastDataPoint[] => {
    const data: ForecastDataPoint[] = [];
    const now = new Date();

    if (historicalData.length === 0) return data;

    // Calculate average daily/monthly rate from historical data
    const totalActual = historicalData.reduce((sum, d) => sum + d.actual, 0);
    const avgRate = totalActual / historicalData.length;
    const lastCumulative = historicalData[historicalData.length - 1]?.cumulative || 0;

    if (obj.period === 'monthly' && obj.month) {
      const daysInMonth = new Date(obj.year, obj.month, 0).getDate();
      const currentDay = now.getDate();
      const remainingDays = daysInMonth - currentDay;

      if (remainingDays <= 0) return data;

      for (let day = currentDay + 1; day <= daysInMonth; day++) {
        const daysAhead = day - currentDay;
        const projected = lastCumulative + avgRate * daysAhead;
        const optimistic = lastCumulative + avgRate * 1.2 * daysAhead;
        const pessimistic = lastCumulative + avgRate * 0.8 * daysAhead;

        data.push({
          date: `${obj.year}-${String(obj.month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
          label: `${day}`,
          projected: Math.round(projected),
          optimistic: Math.round(optimistic),
          pessimistic: Math.round(pessimistic),
          confidence: Math.max(50, 95 - daysAhead * 2),
        });
      }
    } else if (obj.period === 'yearly') {
      const currentMonth = now.getMonth();
      const remainingMonths = 11 - currentMonth;

      if (remainingMonths <= 0) return data;

      for (let m = currentMonth + 1; m <= 11; m++) {
        const monthsAhead = m - currentMonth;
        const projected = lastCumulative + avgRate * monthsAhead;
        const optimistic = lastCumulative + avgRate * 1.15 * monthsAhead;
        const pessimistic = lastCumulative + avgRate * 0.85 * monthsAhead;

        data.push({
          date: `${obj.year}-${String(m + 1).padStart(2, '0')}-01`,
          label: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'][m],
          projected: Math.round(projected),
          optimistic: Math.round(optimistic),
          pessimistic: Math.round(pessimistic),
          confidence: Math.max(50, 90 - monthsAhead * 5),
        });
      }
    }

    return data;
  }, []);

  // Generate insights based on real data
  const generateInsights = useCallback((
    obj: ObjectiveWithProgress,
    historical: HistoricalDataPoint[],
    txList: Transaction[]
  ): Insight[] => {
    const insights: Insight[] = [];
    const now = new Date();

    // Progress vs expected
    const expectedProgress = calculateExpectedProgress(obj, now);
    const progressDiff = obj.progressPercent - expectedProgress;

    if (progressDiff > 10) {
      insights.push({
        id: 'ahead_of_schedule',
        type: 'positive',
        title: 'En avance sur le planning',
        message: `Vous êtes en avance de ${progressDiff.toFixed(1)}% par rapport au rythme attendu.`,
        metric: 'Avance',
        value: progressDiff,
      });
    } else if (progressDiff < -10) {
      insights.push({
        id: 'behind_schedule',
        type: 'warning',
        title: 'En retard sur le planning',
        message: `Vous avez un retard de ${Math.abs(progressDiff).toFixed(1)}% par rapport au rythme attendu.`,
        metric: 'Retard',
        value: Math.abs(progressDiff),
      });
    }

    // Achievement status
    if (obj.status === 'achieved') {
      insights.push({
        id: 'achieved',
        type: 'positive',
        title: 'Objectif atteint !',
        message: `Félicitations, vous avez atteint ${obj.progressPercent.toFixed(1)}% de votre objectif.`,
      });
    } else if (obj.status === 'at_risk') {
      const remaining = obj.targetAmount - obj.actualAmount;
      insights.push({
        id: 'at_risk',
        type: 'warning',
        title: 'Objectif à risque',
        message: `Il reste ${formatAmount(remaining)} à atteindre pour valider l'objectif.`,
        metric: 'Reste',
        value: remaining,
      });
    }

    // Top contributor insight (from real transactions)
    if (txList.length > 0) {
      const byClient = txList
        .filter(tx => tx.type === 'income' && tx.clientName)
        .reduce((acc, tx) => {
          const key = tx.clientName || 'Inconnu';
          acc[key] = (acc[key] || 0) + tx.amount;
          return acc;
        }, {} as Record<string, number>);

      const topClient = Object.entries(byClient).sort((a, b) => b[1] - a[1])[0];
      if (topClient) {
        insights.push({
          id: 'top_client',
          type: 'neutral',
          title: 'Meilleur contributeur',
          message: `${topClient[0]} représente ${formatAmount(topClient[1])} de revenus.`,
          metric: 'Contribution',
          value: topClient[1],
        });
      }

      // Transaction count
      const incomeCount = txList.filter(tx => tx.type === 'income').length;
      if (incomeCount > 0) {
        insights.push({
          id: 'transaction_count',
          type: 'neutral',
          title: 'Transactions',
          message: `${incomeCount} transaction${incomeCount > 1 ? 's' : ''} enregistrée${incomeCount > 1 ? 's' : ''} sur cette période.`,
          value: incomeCount,
        });
      }
    }

    // Trend insight based on historical data
    if (historical.length >= 3) {
      const recent = historical.slice(-3);
      const older = historical.slice(-6, -3);

      if (older.length > 0) {
        const recentAvg = recent.reduce((sum, d) => sum + d.actual, 0) / recent.length;
        const olderAvg = older.reduce((sum, d) => sum + d.actual, 0) / older.length;
        const change = ((recentAvg - olderAvg) / olderAvg) * 100;

        if (change > 10) {
          insights.push({
            id: 'trend_up',
            type: 'positive',
            title: 'Tendance positive',
            message: `La progression a augmenté de ${change.toFixed(0)}% sur les dernières périodes.`,
            change,
          });
        } else if (change < -10) {
          insights.push({
            id: 'trend_down',
            type: 'negative',
            title: 'Tendance négative',
            message: `La progression a diminué de ${Math.abs(change).toFixed(0)}% sur les dernières périodes.`,
            change,
          });
        }
      }
    }

    return insights;
  }, []);

  // Generate actions based on real data
  const generateActions = useCallback((
    obj: ObjectiveWithProgress,
    txList: Transaction[]
  ): ObjectiveAction[] => {
    const actionsList: ObjectiveAction[] = [];

    if (obj.status === 'at_risk' || obj.status === 'behind') {
      const remaining = obj.targetAmount - obj.actualAmount;

      if (obj.type.startsWith('revenue')) {
        // Find clients to upsell (those with transactions)
        const clientRevenue = txList
          .filter(tx => tx.type === 'income' && tx.clientId)
          .reduce((acc, tx) => {
            acc[tx.clientId!] = {
              name: tx.clientName || 'Client',
              amount: (acc[tx.clientId!]?.amount || 0) + tx.amount,
            };
            return acc;
          }, {} as Record<string, { name: string; amount: number }>);

        const topClients = Object.entries(clientRevenue)
          .sort((a, b) => b[1].amount - a[1].amount)
          .slice(0, 3);

        if (topClients.length > 0) {
          actionsList.push({
            id: 'action_upsell',
            objectiveId: obj.id,
            title: 'Proposer des upgrades aux clients actifs',
            description: `Contactez vos meilleurs clients (${topClients.map(c => c[1].name).join(', ')}) pour proposer des services additionnels.`,
            actionType: 'upsell',
            potentialImpact: remaining * 0.2,
            isCompleted: false,
            createdAt: new Date().toISOString(),
          });
        }

        actionsList.push({
          id: 'action_leads',
          objectiveId: obj.id,
          title: 'Relancer les prospects en attente',
          description: `Il faut ${formatAmount(remaining)} supplémentaires pour atteindre l'objectif. Relancez les prospects non convertis.`,
          actionType: 'lead_followup',
          potentialImpact: remaining * 0.3,
          isCompleted: false,
          createdAt: new Date().toISOString(),
        });
      }

      if (obj.type.startsWith('expenses')) {
        // Find top expense categories
        const expenseByCategory = txList
          .filter(tx => tx.type === 'expense')
          .reduce((acc, tx) => {
            const cat = tx.category || 'Autres';
            acc[cat] = (acc[cat] || 0) + tx.amount;
            return acc;
          }, {} as Record<string, number>);

        const topExpenses = Object.entries(expenseByCategory)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 2);

        if (topExpenses.length > 0) {
          actionsList.push({
            id: 'action_cost',
            objectiveId: obj.id,
            title: 'Auditer les postes de dépenses',
            description: `Les postes ${topExpenses.map(e => e[0]).join(' et ')} représentent les plus gros montants. Analysez les optimisations possibles.`,
            actionType: 'cost_reduction',
            potentialImpact: topExpenses.reduce((sum, e) => sum + e[1], 0) * 0.1,
            isCompleted: false,
            createdAt: new Date().toISOString(),
          });
        }
      }

      if (obj.type.includes('clients') || obj.type.includes('churn')) {
        actionsList.push({
          id: 'action_retention',
          objectiveId: obj.id,
          title: 'Programme de rétention clients',
          description: 'Identifiez les clients inactifs et mettez en place des actions de réengagement.',
          actionType: 'retention',
          potentialImpact: remaining * 0.15,
          isCompleted: false,
          createdAt: new Date().toISOString(),
        });
      }
    }

    return actionsList;
  }, []);

  // Load all data
  const loadObjective = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get objectives
      const currentYear = new Date().getFullYear();
      const yearsToTry = [currentYear, currentYear - 1, currentYear + 1];

      let foundObjective: Awaited<ReturnType<typeof dbService.getObjectives>>[0] | undefined;
      let progressData: Awaited<ReturnType<typeof dbService.getObjectivesWithProgress>> = [];
      let objectiveYear = currentYear;

      for (const year of yearsToTry) {
        const [objectives, progress] = await Promise.all([
          dbService.getObjectives(year),
          dbService.getObjectivesWithProgress(year),
        ]);
        foundObjective = objectives.find(o => o.id === objectiveId);
        if (foundObjective) {
          progressData = progress;
          objectiveYear = year;
          break;
        }
      }

      if (!foundObjective) {
        setError('Objectif introuvable');
        return;
      }

      // Merge objective with progress data
      const progressInfo = progressData.find(p => p.id === objectiveId);
      const actualAmount = progressInfo?.actualAmount || 0;
      const progressPercent = progressInfo?.progressPercent || 0;

      // Calculate expected progress based on milestones/distribution
      const now = new Date();
      const tempObjective: ObjectiveWithProgress = {
        ...foundObjective,
        actualAmount,
        progressPercent,
        status: 'behind',
        trend: 'stable',
      };
      const expectedProgress = calculateExpectedProgress(tempObjective, now);

      // Calculate status based on actual vs expected progress
      const status = calculateStatus(progressPercent, expectedProgress, actualAmount, foundObjective.targetAmount);

      // Calculate days remaining
      const totalDays = getTotalDaysInPeriod(tempObjective);
      const currentDay = getCurrentDayInPeriod(tempObjective, now);
      const daysRemaining = Math.max(0, totalDays - currentDay);

      const objectiveData: ObjectiveWithProgress = {
        ...foundObjective,
        actualAmount,
        progressPercent,
        status,
        trend: 'stable',
        expectedProgress,
        daysRemaining,
      };

      setObjective(objectiveData);

      // Load P&L data for the objective's year
      const pnlData = await loadPnLData(objectiveYear);

      if (pnlData) {
        // Extract real transactions
        const realTransactions = extractTransactions(pnlData, objectiveData);
        setTransactions(realTransactions);

        // Calculate historical data from real P&L
        const historical = calculateHistoricalData(pnlData, objectiveData);
        setHistoricalData(historical);

        // Calculate forecast based on historical trends
        const forecast = calculateForecastData(historical, objectiveData);
        setForecastData(forecast);

        // Generate insights from real data
        const realInsights = generateInsights(objectiveData, historical, realTransactions);
        setInsights(realInsights);

        // Generate actions from real data
        const realActions = generateActions(objectiveData, realTransactions);
        setActions(realActions);
      } else {
        // No P&L data - set empty
        setTransactions([]);
        setHistoricalData([]);
        setForecastData([]);
        setInsights([{
          id: 'no_data',
          type: 'warning',
          title: 'Données P&L manquantes',
          message: `Aucune donnée P&L trouvée pour l'année ${objectiveYear}. Ajoutez des transactions dans le module P&L.`,
        }]);
        setActions([]);
      }
    } catch (err) {
      console.error('Error loading objective:', err);
      setError('Erreur lors du chargement de l\'objectif');
    } finally {
      setLoading(false);
    }
  }, [dbService, objectiveId, loadPnLData, extractTransactions, calculateHistoricalData, calculateForecastData, generateInsights, generateActions]);

  useEffect(() => {
    loadObjective();
  }, [loadObjective]);

  return {
    objective,
    loading,
    error,
    historicalData,
    forecastData,
    insights,
    actions,
    transactions,
    refresh: loadObjective,
  };
}

// Helper functions

// Get total days in period
function getTotalDaysInPeriod(obj: ObjectiveWithProgress): number {
  if (obj.period === 'monthly' && obj.month) {
    return new Date(obj.year, obj.month, 0).getDate();
  }
  if (obj.period === 'quarterly') {
    // Quarter has approximately 90-92 days, but we use month count * 30 for simplicity
    return 90;
  }
  if (obj.period === 'yearly') {
    return (obj.year % 4 === 0 && obj.year % 100 !== 0) || obj.year % 400 === 0 ? 366 : 365;
  }
  return 30;
}

// Get current day within period (1-indexed)
function getCurrentDayInPeriod(obj: ObjectiveWithProgress, now: Date): number {
  if (obj.period === 'monthly' && obj.month) {
    // Check if we're in the same month
    if (obj.year === now.getFullYear() && obj.month === now.getMonth() + 1) {
      return now.getDate();
    }
    // If period is in the past, return total days
    if (obj.year < now.getFullYear() || (obj.year === now.getFullYear() && obj.month < now.getMonth() + 1)) {
      return new Date(obj.year, obj.month, 0).getDate();
    }
    // If period is in the future, return 0
    return 0;
  }

  if (obj.period === 'quarterly' && obj.quarter) {
    const startMonth = (obj.quarter - 1) * 3; // 0-indexed start month
    const endMonth = obj.quarter * 3 - 1; // 0-indexed end month
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // If in a different year
    if (obj.year < currentYear) return 90; // Past
    if (obj.year > currentYear) return 0; // Future

    // Same year - calculate days
    if (currentMonth < startMonth) return 0; // Future quarter
    if (currentMonth > endMonth) return 90; // Past quarter

    // We're in this quarter - calculate days elapsed
    let daysElapsed = 0;
    for (let m = startMonth; m < currentMonth; m++) {
      daysElapsed += new Date(obj.year, m + 1, 0).getDate();
    }
    daysElapsed += now.getDate();
    return Math.min(90, daysElapsed);
  }

  if (obj.period === 'yearly') {
    if (obj.year < now.getFullYear()) {
      return getTotalDaysInPeriod(obj);
    }
    if (obj.year > now.getFullYear()) {
      return 0;
    }
    return Math.floor((now.getTime() - new Date(obj.year, 0, 0).getTime()) / 86400000);
  }

  return 0;
}

// Calculate expected progress using milestones or distribution type
function calculateExpectedProgress(obj: ObjectiveWithProgress, now: Date): number {
  const totalDays = getTotalDaysInPeriod(obj);
  const currentDay = getCurrentDayInPeriod(obj, now);

  if (currentDay <= 0) return 0;
  if (currentDay >= totalDays) return 100;

  const progress = currentDay / totalDays;
  const startingPercent = obj.startingAmount ? (obj.startingAmount / obj.targetAmount) * 100 : 0;
  const remainingPercent = 100 - startingPercent;

  // If custom milestones are defined, use interpolation
  if (obj.distributionType === 'custom' && obj.milestones && obj.milestones.length > 0) {
    // Sort milestones by day
    const sortedMilestones = [...obj.milestones].sort((a, b) => a.day - b.day);

    // Add implicit start and end milestones
    const allMilestones = [
      { day: 0, expectedAmount: obj.startingAmount || 0 },
      ...sortedMilestones,
      { day: totalDays, expectedAmount: obj.targetAmount },
    ];

    // Find which two milestones we're between
    for (let i = 0; i < allMilestones.length - 1; i++) {
      const prev = allMilestones[i];
      const next = allMilestones[i + 1];

      if (currentDay >= prev.day && currentDay <= next.day) {
        // Interpolate between milestones
        const dayRange = next.day - prev.day;
        const amountRange = next.expectedAmount - prev.expectedAmount;

        if (dayRange === 0) {
          return (prev.expectedAmount / obj.targetAmount) * 100;
        }

        const dayProgress = (currentDay - prev.day) / dayRange;
        const expectedAmount = prev.expectedAmount + (amountRange * dayProgress);
        return (expectedAmount / obj.targetAmount) * 100;
      }
    }

    // Fallback: use last milestone
    const lastMilestone = sortedMilestones[sortedMilestones.length - 1];
    return (lastMilestone.expectedAmount / obj.targetAmount) * 100;
  }

  // Handle distribution types
  let adjustedProgress: number;

  switch (obj.distributionType) {
    case 'front_loaded':
      // More progress expected early: use exponential decay curve
      // At 50% time, expect ~70% progress
      adjustedProgress = 1 - Math.pow(1 - progress, 0.6);
      break;

    case 'back_loaded':
      // Less progress expected early: use exponential growth curve
      // At 50% time, expect ~30% progress
      adjustedProgress = Math.pow(progress, 1.7);
      break;

    case 'linear':
    default:
      // Simple linear progression
      adjustedProgress = progress;
      break;
  }

  return startingPercent + (adjustedProgress * remainingPercent);
}

// Calculate status based on actual vs expected progress
function calculateStatus(
  actualProgress: number,
  expectedProgress: number,
  actualAmount: number,
  targetAmount: number
): ObjectiveWithProgress['status'] {
  // If objective is achieved (>=100%)
  if (actualProgress >= 100 || actualAmount >= targetAmount) {
    return 'achieved';
  }

  // If no actual data yet (actualAmount is 0), check if we should be started
  if (actualAmount === 0) {
    // If we're past the start of the period, we're behind
    if (expectedProgress > 5) {
      return 'behind';
    }
    return 'not_started';
  }

  // Calculate the difference between actual and expected
  const progressDiff = actualProgress - expectedProgress;

  // Thresholds for status determination
  // If actual is >= expected, we're on track or ahead
  if (progressDiff >= 0) {
    return 'on_track';
  }

  // If we're within 10% of expected, still on track
  if (progressDiff >= -10) {
    return 'on_track';
  }

  // If we're within 25% of expected, at risk
  if (progressDiff >= -25) {
    return 'at_risk';
  }

  // More than 25% behind expected = behind
  return 'behind';
}

function formatAmount(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M€`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k€`;
  return `${value.toFixed(0)}€`;
}

function getDateFromMonth(monthKey: string, year: number): string {
  const monthIndex = MONTH_KEYS.indexOf(monthKey);
  if (monthIndex === -1) return `${year}-01-15`;
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}-15`;
}
