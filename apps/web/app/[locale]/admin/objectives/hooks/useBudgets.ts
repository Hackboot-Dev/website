// /workspaces/website/apps/web/app/[locale]/admin/objectives/hooks/useBudgets.ts
// Description: Hook for managing budgets (connected to DB)
// Last modified: 2026-01-11
// COMPLETE FILE

'use client';

import { useState, useEffect, useCallback } from 'react';
import { getDatabase } from '../../../../../lib/services/database';
import type { CompanyId } from '../../pnl/types';

type UseBudgetsOptions = {
  companyId: CompanyId;
  year?: number;
};

export type BudgetCategory =
  | 'salaries'
  | 'infrastructure'
  | 'marketing'
  | 'software'
  | 'office'
  | 'legal'
  | 'telecom'
  | 'travel'
  | 'training'
  | 'other';

export type BudgetStatus = 'on_track' | 'at_risk' | 'exceeded';

export interface Budget {
  id: string;
  companyId: string;
  year: number;
  name: string;
  description?: string;
  category: BudgetCategory;
  totalAmount: number;
  spentAmount: number;
  status: BudgetStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetWithProgress extends Budget {
  spentPercent: number;
  remainingAmount: number;
  projectedTotal: number;
  willExceed: boolean;
  monthlyAverage: number;
}

export interface BudgetStats {
  totalAllocated: number;
  totalSpent: number;
  totalRemaining: number;
  spentPercent: number;
  onTrack: number;
  atRisk: number;
  exceeded: number;
}

export type CreateBudgetData = {
  name: string;
  description?: string;
  category: BudgetCategory;
  totalAmount: number;
  year: number;
};

export const BUDGET_CATEGORY_CONFIG: Record<BudgetCategory, { label: string; color: string; bgColor: string }> = {
  salaries: { label: 'Salaires', color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
  infrastructure: { label: 'Infrastructure', color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
  marketing: { label: 'Marketing', color: 'text-pink-400', bgColor: 'bg-pink-500/20' },
  software: { label: 'Logiciels', color: 'text-cyan-400', bgColor: 'bg-cyan-500/20' },
  office: { label: 'Locaux', color: 'text-amber-400', bgColor: 'bg-amber-500/20' },
  legal: { label: 'Juridique', color: 'text-indigo-400', bgColor: 'bg-indigo-500/20' },
  telecom: { label: 'Télécoms', color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
  travel: { label: 'Déplacements', color: 'text-orange-400', bgColor: 'bg-orange-500/20' },
  training: { label: 'Formation', color: 'text-teal-400', bgColor: 'bg-teal-500/20' },
  other: { label: 'Autres', color: 'text-zinc-400', bgColor: 'bg-zinc-500/20' },
};

export function useBudgets({ companyId, year }: UseBudgetsOptions) {
  const [budgets, setBudgets] = useState<BudgetWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dbService = getDatabase(companyId);
  const selectedYear = year || new Date().getFullYear();

  // Calculate budget status and progress
  const calculateBudgetProgress = useCallback((budget: {
    id: string;
    companyId: string;
    year: number;
    name: string;
    description?: string;
    category: string;
    totalAmount: number;
    spentAmount: number;
    createdAt: string;
    updatedAt: string;
  }): BudgetWithProgress => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const monthsElapsed = budget.year === now.getFullYear() ? currentMonth : 12;

    const spentPercent = budget.totalAmount > 0
      ? (budget.spentAmount / budget.totalAmount) * 100
      : 0;
    const expectedPercent = (monthsElapsed / 12) * 100;

    let status: BudgetStatus = 'on_track';
    if (spentPercent > 100) {
      status = 'exceeded';
    } else if (spentPercent > expectedPercent * 1.1) {
      status = 'at_risk';
    }

    const remainingAmount = Math.max(0, budget.totalAmount - budget.spentAmount);
    const monthlyAverage = monthsElapsed > 0 ? budget.spentAmount / monthsElapsed : 0;
    const remainingMonths = 12 - monthsElapsed;
    const projectedTotal = budget.spentAmount + (monthlyAverage * remainingMonths);

    return {
      ...budget,
      category: budget.category as BudgetCategory,
      status,
      spentPercent,
      remainingAmount,
      projectedTotal,
      willExceed: projectedTotal > budget.totalAmount,
      monthlyAverage,
    };
  }, []);

  // Load budgets from DB
  const loadBudgets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await dbService.getBudgets(selectedYear);
      const budgetsWithProgress = data.map(calculateBudgetProgress);
      setBudgets(budgetsWithProgress);
    } catch (err) {
      console.error('Error loading budgets:', err);
      setError('Erreur lors du chargement des budgets');
    } finally {
      setLoading(false);
    }
  }, [dbService, selectedYear, calculateBudgetProgress]);

  useEffect(() => {
    loadBudgets();
  }, [loadBudgets]);

  // Calculate stats
  const stats: BudgetStats = {
    totalAllocated: budgets.reduce((sum, b) => sum + b.totalAmount, 0),
    totalSpent: budgets.reduce((sum, b) => sum + b.spentAmount, 0),
    totalRemaining: budgets.reduce((sum, b) => sum + b.remainingAmount, 0),
    spentPercent: budgets.length > 0
      ? (budgets.reduce((sum, b) => sum + b.spentAmount, 0) / budgets.reduce((sum, b) => sum + b.totalAmount, 0)) * 100
      : 0,
    onTrack: budgets.filter(b => b.status === 'on_track').length,
    atRisk: budgets.filter(b => b.status === 'at_risk').length,
    exceeded: budgets.filter(b => b.status === 'exceeded').length,
  };

  // Create budget
  const createBudget = async (data: CreateBudgetData): Promise<string | null> => {
    try {
      const result = await dbService.createBudget({
        name: data.name,
        description: data.description,
        category: data.category,
        totalAmount: data.totalAmount,
        year: data.year,
      });
      await loadBudgets();
      return result.id;
    } catch (err) {
      console.error('Error creating budget:', err);
      setError('Erreur lors de la création du budget');
      return null;
    }
  };

  // Update budget
  const updateBudget = async (budgetId: string, data: {
    name?: string;
    description?: string;
    totalAmount?: number;
  }): Promise<boolean> => {
    try {
      await dbService.updateBudget(budgetId, data);
      await loadBudgets();
      return true;
    } catch (err) {
      console.error('Error updating budget:', err);
      setError('Erreur lors de la mise à jour du budget');
      return false;
    }
  };

  // Delete budget
  const deleteBudget = async (budgetId: string): Promise<boolean> => {
    try {
      await dbService.deleteBudget(budgetId);
      await loadBudgets();
      return true;
    } catch (err) {
      console.error('Error deleting budget:', err);
      setError('Erreur lors de la suppression du budget');
      return false;
    }
  };

  return {
    budgets,
    loading,
    error,
    stats,
    refresh: loadBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
  };
}
