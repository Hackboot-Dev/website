// /workspaces/website/apps/web/app/[locale]/admin/objectives/utils/coherenceChecker.ts
// Description: Utility to check coherence between objectives and suggest corrections
// Last modified: 2026-01-10

import { nanoid } from 'nanoid';
import type {
  Objective,
  ObjectiveWithProgress,
  CoherenceCheckResult,
  CoherenceIssue,
  CoherenceSuggestion,
  ObjectiveCorrection,
  ObjectiveType,
  ObjectivePeriod,
} from '../types';
import {
  OBJECTIVE_TYPE_LABELS,
  formatObjectiveValue,
  OBJECTIVE_TYPE_UNITS,
} from '../types';

/**
 * Check coherence between a set of objectives for the same period
 * Returns issues and suggestions for corrections
 */
export function checkObjectivesCoherence(
  objectives: (Objective | ObjectiveWithProgress)[],
  period: ObjectivePeriod,
  year: number,
  month?: number,
  quarter?: number
): CoherenceCheckResult {
  const issues: CoherenceIssue[] = [];

  // Filter objectives for the specified period
  const periodObjectives = objectives.filter(obj => {
    if (obj.year !== year) return false;
    if (obj.period !== period) return false;
    if (period === 'monthly' && obj.month !== month) return false;
    if (period === 'quarterly' && obj.quarter !== quarter) return false;
    return true;
  });

  // Get objectives by type
  const getByType = (type: ObjectiveType) => periodObjectives.find(o => o.type === type);

  const revenueTotal = getByType('revenue_total');
  const expensesTotal = getByType('expenses_total');
  const grossProfit = getByType('gross_profit');
  const netProfit = getByType('net_profit');
  const grossMarginPct = getByType('gross_margin_pct');
  const netMarginPct = getByType('net_margin_pct');

  // ============================================================
  // Check 1: Net Profit = Revenue - Expenses
  // ============================================================
  if (revenueTotal && expensesTotal && netProfit) {
    const calculatedNetProfit = revenueTotal.targetAmount - expensesTotal.targetAmount;
    const difference = Math.abs(calculatedNetProfit - netProfit.targetAmount);

    if (difference > 0.01) { // Allow small rounding differences
      const issue: CoherenceIssue = {
        id: nanoid(),
        type: 'profit_mismatch',
        severity: 'error',
        title: 'Incohérence du bénéfice net',
        message: `Le bénéfice net objectif (${formatObjectiveValue(netProfit.targetAmount, 'currency')}) ne correspond pas à Revenus - Dépenses`,
        details: `${formatObjectiveValue(revenueTotal.targetAmount, 'currency')} (revenus) - ${formatObjectiveValue(expensesTotal.targetAmount, 'currency')} (dépenses) = ${formatObjectiveValue(calculatedNetProfit, 'currency')}`,
        affectedObjectiveIds: [revenueTotal.id, expensesTotal.id, netProfit.id],
        suggestion: createProfitMismatchSuggestion(
          revenueTotal,
          expensesTotal,
          netProfit,
          calculatedNetProfit
        ),
      };
      issues.push(issue);
    }
  }

  // ============================================================
  // Check 2: Net Margin % = (Net Profit / Revenue) * 100
  // ============================================================
  if (revenueTotal && netProfit && netMarginPct) {
    const calculatedMargin = revenueTotal.targetAmount > 0
      ? (netProfit.targetAmount / revenueTotal.targetAmount) * 100
      : 0;
    const difference = Math.abs(calculatedMargin - netMarginPct.targetAmount);

    if (difference > 0.5) { // Allow 0.5% tolerance
      const issue: CoherenceIssue = {
        id: nanoid(),
        type: 'margin_mismatch',
        severity: 'warning',
        title: 'Incohérence de la marge nette',
        message: `La marge nette objectif (${netMarginPct.targetAmount.toFixed(1)}%) ne correspond pas au calcul`,
        details: `${formatObjectiveValue(netProfit.targetAmount, 'currency')} / ${formatObjectiveValue(revenueTotal.targetAmount, 'currency')} × 100 = ${calculatedMargin.toFixed(1)}%`,
        affectedObjectiveIds: [revenueTotal.id, netProfit.id, netMarginPct.id],
        suggestion: {
          message: 'Vous pouvez ajuster la marge ou les montants pour les faire correspondre',
          options: [
            {
              id: 'adjust-margin',
              label: 'Ajuster la marge',
              description: `Mettre la marge nette à ${calculatedMargin.toFixed(1)}%`,
              corrections: [{
                objectiveId: netMarginPct.id,
                objectiveLabel: OBJECTIVE_TYPE_LABELS[netMarginPct.type],
                field: 'targetAmount',
                currentValue: netMarginPct.targetAmount,
                suggestedValue: Math.round(calculatedMargin * 10) / 10,
              }],
            },
            {
              id: 'adjust-profit',
              label: 'Ajuster le bénéfice',
              description: `Mettre le bénéfice net à ${formatObjectiveValue(revenueTotal.targetAmount * (netMarginPct.targetAmount / 100), 'currency')}`,
              corrections: [{
                objectiveId: netProfit.id,
                objectiveLabel: OBJECTIVE_TYPE_LABELS[netProfit.type],
                field: 'targetAmount',
                currentValue: netProfit.targetAmount,
                suggestedValue: revenueTotal.targetAmount * (netMarginPct.targetAmount / 100),
              }],
            },
          ],
        },
      };
      issues.push(issue);
    }
  }

  // ============================================================
  // Check 3: Gross Margin % = (Gross Profit / Revenue) * 100
  // ============================================================
  if (revenueTotal && grossProfit && grossMarginPct) {
    const calculatedMargin = revenueTotal.targetAmount > 0
      ? (grossProfit.targetAmount / revenueTotal.targetAmount) * 100
      : 0;
    const difference = Math.abs(calculatedMargin - grossMarginPct.targetAmount);

    if (difference > 0.5) {
      const issue: CoherenceIssue = {
        id: nanoid(),
        type: 'margin_mismatch',
        severity: 'warning',
        title: 'Incohérence de la marge brute',
        message: `La marge brute objectif (${grossMarginPct.targetAmount.toFixed(1)}%) ne correspond pas au calcul`,
        details: `${formatObjectiveValue(grossProfit.targetAmount, 'currency')} / ${formatObjectiveValue(revenueTotal.targetAmount, 'currency')} × 100 = ${calculatedMargin.toFixed(1)}%`,
        affectedObjectiveIds: [revenueTotal.id, grossProfit.id, grossMarginPct.id],
        suggestion: {
          message: 'Vous pouvez ajuster la marge ou les montants pour les faire correspondre',
          options: [
            {
              id: 'adjust-margin',
              label: 'Ajuster la marge',
              description: `Mettre la marge brute à ${calculatedMargin.toFixed(1)}%`,
              corrections: [{
                objectiveId: grossMarginPct.id,
                objectiveLabel: OBJECTIVE_TYPE_LABELS[grossMarginPct.type],
                field: 'targetAmount',
                currentValue: grossMarginPct.targetAmount,
                suggestedValue: Math.round(calculatedMargin * 10) / 10,
              }],
            },
          ],
        },
      };
      issues.push(issue);
    }
  }

  // ============================================================
  // Check 4: Gross Profit > Net Profit (makes sense)
  // ============================================================
  if (grossProfit && netProfit && grossProfit.targetAmount < netProfit.targetAmount) {
    const issue: CoherenceIssue = {
      id: nanoid(),
      type: 'conflicting_objectives',
      severity: 'error',
      title: 'Bénéfice net supérieur à la marge brute',
      message: 'Le bénéfice net ne peut pas être supérieur à la marge brute',
      details: `Marge brute: ${formatObjectiveValue(grossProfit.targetAmount, 'currency')}, Bénéfice net: ${formatObjectiveValue(netProfit.targetAmount, 'currency')}`,
      affectedObjectiveIds: [grossProfit.id, netProfit.id],
      suggestion: {
        message: 'Le bénéfice net doit être inférieur ou égal à la marge brute (après déduction des frais)',
        options: [
          {
            id: 'adjust-gross',
            label: 'Augmenter la marge brute',
            description: `Mettre la marge brute au moins à ${formatObjectiveValue(netProfit.targetAmount, 'currency')}`,
            corrections: [{
              objectiveId: grossProfit.id,
              objectiveLabel: OBJECTIVE_TYPE_LABELS[grossProfit.type],
              field: 'targetAmount',
              currentValue: grossProfit.targetAmount,
              suggestedValue: netProfit.targetAmount * 1.2, // Add 20% buffer for operating expenses
            }],
          },
          {
            id: 'adjust-net',
            label: 'Réduire le bénéfice net',
            description: `Mettre le bénéfice net à ${formatObjectiveValue(grossProfit.targetAmount * 0.8, 'currency')}`,
            corrections: [{
              objectiveId: netProfit.id,
              objectiveLabel: OBJECTIVE_TYPE_LABELS[netProfit.type],
              field: 'targetAmount',
              currentValue: netProfit.targetAmount,
              suggestedValue: grossProfit.targetAmount * 0.8,
            }],
          },
        ],
      },
    };
    issues.push(issue);
  }

  // ============================================================
  // Check 5: Expenses should be less than Revenue (for positive profit)
  // ============================================================
  if (revenueTotal && expensesTotal && netProfit) {
    if (netProfit.targetAmount > 0 && expensesTotal.targetAmount >= revenueTotal.targetAmount) {
      const issue: CoherenceIssue = {
        id: nanoid(),
        type: 'conflicting_objectives',
        severity: 'error',
        title: 'Dépenses supérieures aux revenus',
        message: 'Impossible d\'avoir un bénéfice positif si les dépenses dépassent les revenus',
        details: `Revenus: ${formatObjectiveValue(revenueTotal.targetAmount, 'currency')}, Dépenses: ${formatObjectiveValue(expensesTotal.targetAmount, 'currency')}`,
        affectedObjectiveIds: [revenueTotal.id, expensesTotal.id, netProfit.id],
        suggestion: {
          message: 'Ajustez les dépenses ou les revenus pour permettre le bénéfice souhaité',
          options: [
            {
              id: 'increase-revenue',
              label: 'Augmenter les revenus',
              description: `Mettre les revenus à ${formatObjectiveValue(expensesTotal.targetAmount + netProfit.targetAmount, 'currency')}`,
              corrections: [{
                objectiveId: revenueTotal.id,
                objectiveLabel: OBJECTIVE_TYPE_LABELS[revenueTotal.type],
                field: 'targetAmount',
                currentValue: revenueTotal.targetAmount,
                suggestedValue: expensesTotal.targetAmount + netProfit.targetAmount,
              }],
            },
            {
              id: 'reduce-expenses',
              label: 'Réduire les dépenses',
              description: `Mettre les dépenses à ${formatObjectiveValue(revenueTotal.targetAmount - netProfit.targetAmount, 'currency')}`,
              corrections: [{
                objectiveId: expensesTotal.id,
                objectiveLabel: OBJECTIVE_TYPE_LABELS[expensesTotal.type],
                field: 'targetAmount',
                currentValue: expensesTotal.targetAmount,
                suggestedValue: revenueTotal.targetAmount - netProfit.targetAmount,
              }],
            },
          ],
        },
      };
      issues.push(issue);
    }
  }

  // ============================================================
  // Check 6: Impossible percentages
  // ============================================================
  const retentionObj = getByType('retention_rate');
  if (retentionObj && retentionObj.targetAmount > 100) {
    const issue: CoherenceIssue = {
      id: nanoid(),
      type: 'impossible_target',
      severity: 'error',
      title: 'Taux de rétention impossible',
      message: `Le taux de rétention ne peut pas dépasser 100%`,
      details: `Valeur actuelle: ${retentionObj.targetAmount}%`,
      affectedObjectiveIds: [retentionObj.id],
      suggestion: {
        message: 'Corrigez le taux de rétention',
        options: [
          {
            id: 'fix-retention',
            label: 'Corriger à 100%',
            description: 'Mettre le taux de rétention maximum',
            corrections: [{
              objectiveId: retentionObj.id,
              objectiveLabel: OBJECTIVE_TYPE_LABELS[retentionObj.type],
              field: 'targetAmount',
              currentValue: retentionObj.targetAmount,
              suggestedValue: 100,
            }],
          },
        ],
      },
    };
    issues.push(issue);
  }

  // ============================================================
  // Check 7: Churn rate should be reasonable
  // ============================================================
  const churnObj = getByType('churn_rate');
  if (churnObj && churnObj.targetAmount > 50) {
    const issue: CoherenceIssue = {
      id: nanoid(),
      type: 'impossible_target',
      severity: 'warning',
      title: 'Taux de churn très élevé',
      message: `Un taux de churn de ${churnObj.targetAmount}% semble anormalement élevé`,
      details: 'Un taux de churn sain est généralement inférieur à 10% mensuel',
      affectedObjectiveIds: [churnObj.id],
    };
    issues.push(issue);
  }

  // ============================================================
  // Check 8: Sum of product/category revenues should equal total
  // ============================================================
  const productRevenues = periodObjectives.filter(o =>
    o.type === 'revenue_product' || o.type === 'revenue_category'
  );
  if (revenueTotal && productRevenues.length > 0) {
    const productSum = productRevenues.reduce((sum, o) => sum + o.targetAmount, 0);
    const difference = Math.abs(productSum - revenueTotal.targetAmount);

    if (difference > revenueTotal.targetAmount * 0.05) { // 5% tolerance
      const issue: CoherenceIssue = {
        id: nanoid(),
        type: 'sum_mismatch',
        severity: 'warning',
        title: 'Somme des revenus produits ≠ Total',
        message: `La somme des objectifs par produit/catégorie ne correspond pas au CA total`,
        details: `Somme: ${formatObjectiveValue(productSum, 'currency')}, Total objectif: ${formatObjectiveValue(revenueTotal.targetAmount, 'currency')}`,
        affectedObjectiveIds: [revenueTotal.id, ...productRevenues.map(o => o.id)],
        suggestion: {
          message: 'Ajustez le total ou les objectifs individuels',
          options: [
            {
              id: 'adjust-total',
              label: 'Ajuster le total',
              description: `Mettre le CA total à ${formatObjectiveValue(productSum, 'currency')}`,
              corrections: [{
                objectiveId: revenueTotal.id,
                objectiveLabel: OBJECTIVE_TYPE_LABELS[revenueTotal.type],
                field: 'targetAmount',
                currentValue: revenueTotal.targetAmount,
                suggestedValue: productSum,
              }],
            },
          ],
        },
      };
      issues.push(issue);
    }
  }

  // ============================================================
  // Build result
  // ============================================================
  return {
    isCoherent: issues.filter(i => i.severity === 'error').length === 0,
    issues,
    summary: {
      errors: issues.filter(i => i.severity === 'error').length,
      warnings: issues.filter(i => i.severity === 'warning').length,
      infos: issues.filter(i => i.severity === 'info').length,
    },
    lastChecked: new Date().toISOString(),
  };
}

/**
 * Create suggestions for profit mismatch
 */
function createProfitMismatchSuggestion(
  revenue: Objective,
  expenses: Objective,
  netProfit: Objective,
  calculatedNetProfit: number
): CoherenceSuggestion {
  const options = [];

  // Option 1: Adjust net profit to match calculation
  options.push({
    id: 'adjust-profit',
    label: 'Ajuster le bénéfice net',
    description: `Mettre le bénéfice net à ${formatObjectiveValue(calculatedNetProfit, 'currency')} (calculé)`,
    corrections: [{
      objectiveId: netProfit.id,
      objectiveLabel: OBJECTIVE_TYPE_LABELS[netProfit.type],
      field: 'targetAmount' as const,
      currentValue: netProfit.targetAmount,
      suggestedValue: calculatedNetProfit,
    }],
  });

  // Option 2: Adjust expenses to get desired profit
  const requiredExpenses = revenue.targetAmount - netProfit.targetAmount;
  if (requiredExpenses > 0) {
    options.push({
      id: 'adjust-expenses',
      label: 'Ajuster les dépenses',
      description: `Mettre les dépenses à ${formatObjectiveValue(requiredExpenses, 'currency')} pour atteindre le bénéfice souhaité`,
      corrections: [{
        objectiveId: expenses.id,
        objectiveLabel: OBJECTIVE_TYPE_LABELS[expenses.type],
        field: 'targetAmount' as const,
        currentValue: expenses.targetAmount,
        suggestedValue: requiredExpenses,
      }],
    });
  }

  // Option 3: Adjust revenue to get desired profit with current expenses
  const requiredRevenue = expenses.targetAmount + netProfit.targetAmount;
  options.push({
    id: 'adjust-revenue',
    label: 'Ajuster le chiffre d\'affaires',
    description: `Mettre le CA à ${formatObjectiveValue(requiredRevenue, 'currency')} pour atteindre le bénéfice souhaité`,
    corrections: [{
      objectiveId: revenue.id,
      objectiveLabel: OBJECTIVE_TYPE_LABELS[revenue.type],
      field: 'targetAmount' as const,
      currentValue: revenue.targetAmount,
      suggestedValue: requiredRevenue,
    }],
  });

  return {
    message: 'Choisissez comment résoudre l\'incohérence :',
    options,
  };
}

/**
 * Apply a correction to objectives
 */
export function applyCorrection(
  objectives: Objective[],
  correction: ObjectiveCorrection
): Objective[] {
  return objectives.map(obj => {
    if (obj.id === correction.objectiveId) {
      return {
        ...obj,
        [correction.field]: correction.suggestedValue,
        updatedAt: new Date().toISOString(),
      };
    }
    return obj;
  });
}

/**
 * Apply multiple corrections
 */
export function applyCorrections(
  objectives: Objective[],
  corrections: ObjectiveCorrection[]
): Objective[] {
  let result = [...objectives];
  for (const correction of corrections) {
    result = applyCorrection(result, correction);
  }
  return result;
}
