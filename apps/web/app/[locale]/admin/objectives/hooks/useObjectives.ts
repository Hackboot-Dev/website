// /workspaces/website/apps/web/app/[locale]/admin/objectives/hooks/useObjectives.ts
// Description: Hook for managing objectives with REAL P&L data calculation
// Last modified: 2026-01-11

'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../../../lib/supabase';
import { getDatabase } from '../../../../../lib/services/database';
import type { CompanyId } from '../../pnl/types';
import type {
  Objective,
  ObjectiveWithProgress,
  ObjectiveType,
  ObjectivePeriod,
  ObjectiveStatus,
  ObjectiveCategory,
  ObjectivePriority,
} from '../types';
import { isClientObjectiveType, isSubscriptionObjectiveType } from '../types';
import { calculateSubscriptionMetric } from './useSubscriptionMetrics';
import { MONTH_KEYS } from '../../pnl/constants';

// P&L Types for calculation
type PnLTransaction = {
  id: string;
  amount: number;
  clientId: string;
  clientName: string;
};

type PnLProduct = {
  id: string;
  label: string;
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

// Client record for client objectives
type ClientRecord = {
  id: string;
  status: 'lead' | 'active' | 'inactive' | 'churned';
  type: 'individual' | 'business' | 'enterprise';
  total_revenue: number;
  total_transactions: number;
  created_at: string;
  updated_at: string;
};

type UseObjectivesOptions = {
  companyId: CompanyId;
  year?: number;
};

// New comprehensive objective data type supporting all fields
type CreateObjectiveData = Partial<Omit<Objective, 'id' | 'companyId' | 'createdAt' | 'updatedAt'>> & {
  type: ObjectiveType;
  period: ObjectivePeriod;
  year: number;
  targetAmount: number;
};

export function useObjectives({ companyId, year }: UseObjectivesOptions) {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [objectivesWithProgress, setObjectivesWithProgress] = useState<ObjectiveWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dbService = getDatabase(companyId);
  const selectedYear = year || new Date().getFullYear();

  // Load P&L data for calculations
  const loadPnLData = useCallback(async (targetYear: number): Promise<PnLData | null> => {
    try {
      const { data, error } = await supabase
        .from('pnl_data')
        .select('data')
        .eq('company_id', companyId)
        .eq('year', targetYear)
        .single();

      if (error || !data) return null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (data as any).data as PnLData;
    } catch {
      return null;
    }
  }, [companyId]);

  // Load clients for client objectives
  const loadClients = useCallback(async (): Promise<ClientRecord[]> => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('company_id', companyId);

      if (error) return [];
      return (data || []) as ClientRecord[];
    } catch {
      return [];
    }
  }, [companyId]);

  // Calculate monthly amount for financial objectives
  const calculateMonthlyAmount = (
    pnlData: PnLData,
    obj: Objective,
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

    if (isNetProfit || isGrossProfit) {
      return revenue - expenses;
    } else if (isExpenseType) {
      return expenses;
    } else {
      return revenue;
    }
  };

  // Calculate actual amount from P&L for a financial objective
  const calculateFinancialActual = (pnlData: PnLData, obj: Objective): number => {
    let total = 0;

    if (obj.period === 'monthly' && obj.month) {
      const monthKey = MONTH_KEYS[obj.month - 1];
      total = calculateMonthlyAmount(pnlData, obj, monthKey);
    } else if (obj.period === 'quarterly' && obj.quarter) {
      const startMonthIndex = (obj.quarter - 1) * 3;
      for (let m = 0; m < 3; m++) {
        const monthKey = MONTH_KEYS[startMonthIndex + m];
        total += calculateMonthlyAmount(pnlData, obj, monthKey);
      }
    } else if (obj.period === 'yearly') {
      for (let m = 0; m < 12; m++) {
        const monthKey = MONTH_KEYS[m];
        total += calculateMonthlyAmount(pnlData, obj, monthKey);
      }
    }

    return total;
  };

  // Calculate client objective actual value
  const calculateClientActual = (clients: ClientRecord[], obj: Objective): number => {
    const { year: objYear, period, month, quarter, type: objType } = obj;

    // Get date range for the period
    let startDate: Date;
    let endDate: Date;

    if (period === 'monthly' && month) {
      startDate = new Date(objYear, month - 1, 1);
      endDate = new Date(objYear, month, 0, 23, 59, 59);
    } else if (period === 'quarterly' && quarter) {
      const startMonth = (quarter - 1) * 3;
      startDate = new Date(objYear, startMonth, 1);
      endDate = new Date(objYear, startMonth + 3, 0, 23, 59, 59);
    } else {
      startDate = new Date(objYear, 0, 1);
      endDate = new Date(objYear, 11, 31, 23, 59, 59);
    }

    switch (objType) {
      case 'new_clients_total':
      case 'new_clients_segment':
        return clients.filter(c => {
          const created = new Date(c.created_at);
          return created >= startDate && created <= endDate;
        }).length;

      case 'active_clients':
        return clients.filter(c => c.status === 'active').length;

      case 'churn_rate': {
        const activeAtStart = clients.filter(c => {
          const created = new Date(c.created_at);
          return created < startDate && (c.status === 'active' || c.status === 'churned');
        }).length;
        const churned = clients.filter(c => c.status === 'churned').length;
        return activeAtStart > 0 ? (churned / activeAtStart) * 100 : 0;
      }

      case 'retention_rate': {
        const activeAtStart = clients.filter(c => {
          const created = new Date(c.created_at);
          return created < startDate && (c.status === 'active' || c.status === 'churned');
        }).length;
        const retained = clients.filter(c => c.status === 'active').length;
        return activeAtStart > 0 ? (retained / activeAtStart) * 100 : 0;
      }

      case 'arpu': {
        const active = clients.filter(c => c.status === 'active');
        const totalRev = active.reduce((sum, c) => sum + (c.total_revenue || 0), 0);
        return active.length > 0 ? totalRev / active.length : 0;
      }

      case 'avg_basket': {
        const totalRev = clients.reduce((sum, c) => sum + (c.total_revenue || 0), 0);
        const totalTx = clients.reduce((sum, c) => sum + (c.total_transactions || 0), 0);
        return totalTx > 0 ? totalRev / totalTx : 0;
      }

      default:
        return 0;
    }
  };

  // Determine status based on progress
  const determineStatus = (progressPercent: number, obj: Objective): ObjectiveStatus => {
    // For rate-based objectives where lower is better (churn, expenses)
    const isLowerBetter = obj.type === 'churn_rate' ||
      obj.type.startsWith('expenses') ||
      obj.type === 'cac';

    if (isLowerBetter) {
      if (progressPercent <= 100) return 'achieved';
      if (progressPercent <= 110) return 'on_track';
      if (progressPercent <= 125) return 'at_risk';
      return 'behind';
    }

    // Normal objectives where higher is better
    if (progressPercent >= 100) return 'achieved';
    if (progressPercent >= 80) return 'on_track';
    if (progressPercent >= 60) return 'at_risk';
    return 'behind';
  };

  // Load objectives
  const loadObjectives = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Load objectives, P&L data, and clients in parallel
      const [objectivesData, pnlData, clients] = await Promise.all([
        dbService.getObjectives(selectedYear),
        loadPnLData(selectedYear),
        loadClients(),
      ]);

      const safeObjectives = (objectivesData || []) as Objective[];
      setObjectives(safeObjectives);

      // Calculate progress for each objective using real data
      // Use Promise.all for async subscription metrics
      const merged: ObjectiveWithProgress[] = await Promise.all(
        safeObjectives.map(async (obj) => {
          if (!obj) return null;

          let actualAmount = 0;

          // Calculate actual based on objective type
          if (isSubscriptionObjectiveType(obj.type)) {
            // Use subscription metrics for subscription objectives
            actualAmount = await calculateSubscriptionMetric(companyId, obj);
          } else if (isClientObjectiveType(obj.type)) {
            actualAmount = calculateClientActual(clients, obj);
          } else if (pnlData) {
            actualAmount = calculateFinancialActual(pnlData, obj);
          }

          // Calculate progress percentage
          const progressPercent = obj.targetAmount > 0
            ? (actualAmount / obj.targetAmount) * 100
            : 0;

          // Determine status
          const status = determineStatus(progressPercent, obj);

          return {
            ...obj,
            actualAmount,
            progressPercent,
            status,
            trend: 'stable' as const,
          } as ObjectiveWithProgress;
        })
      ).then(results => results.filter((obj): obj is ObjectiveWithProgress => obj !== null));

      setObjectivesWithProgress(merged);
    } catch (err) {
      console.error('Error loading objectives:', err);
      setError('Erreur lors du chargement des objectifs');
    } finally {
      setLoading(false);
    }
  }, [dbService, selectedYear, loadPnLData, loadClients]);

  useEffect(() => {
    loadObjectives();
  }, [loadObjectives]);

  // Create objective
  const createObjective = async (data: CreateObjectiveData): Promise<string | null> => {
    try {
      const result = await dbService.createObjective(data);
      await loadObjectives();
      return result.id;
    } catch (err) {
      console.error('Error creating objective:', err);
      setError('Erreur lors de la création de l\'objectif');
      return null;
    }
  };

  // Update objective
  const updateObjective = async (
    objectiveId: string,
    data: { targetAmount?: number; name?: string; description?: string }
  ): Promise<boolean> => {
    try {
      await dbService.updateObjective(objectiveId, data);
      await loadObjectives();
      return true;
    } catch (err) {
      console.error('Error updating objective:', err);
      setError('Erreur lors de la mise à jour de l\'objectif');
      return false;
    }
  };

  // Delete objective
  const deleteObjective = async (objectiveId: string): Promise<boolean> => {
    try {
      await dbService.deleteObjective(objectiveId);
      await loadObjectives();
      return true;
    } catch (err) {
      console.error('Error deleting objective:', err);
      setError('Erreur lors de la suppression de l\'objectif');
      return false;
    }
  };

  // Get objectives by type
  const getObjectivesByType = (type: ObjectiveType): ObjectiveWithProgress[] => {
    return objectivesWithProgress.filter(obj => obj.type === type);
  };

  // Get objectives by period
  const getObjectivesByPeriod = (period: ObjectivePeriod): ObjectiveWithProgress[] => {
    return objectivesWithProgress.filter(obj => obj.period === period);
  };

  // Get current month objective for a type
  const getCurrentMonthObjective = (type: ObjectiveType): ObjectiveWithProgress | null => {
    const currentMonth = new Date().getMonth() + 1;
    return objectivesWithProgress.find(
      obj => obj.type === type && obj.period === 'monthly' && obj.month === currentMonth
    ) || null;
  };

  // Get yearly objective for a type
  const getYearlyObjective = (type: ObjectiveType): ObjectiveWithProgress | null => {
    return objectivesWithProgress.find(
      obj => obj.type === type && obj.period === 'yearly'
    ) || null;
  };

  // Calculate summary stats
  const stats = {
    total: objectives.length,
    achieved: objectivesWithProgress.filter(o => o.status === 'achieved').length,
    onTrack: objectivesWithProgress.filter(o => o.status === 'on_track').length,
    atRisk: objectivesWithProgress.filter(o => o.status === 'at_risk').length,
    behind: objectivesWithProgress.filter(o => o.status === 'behind').length,
  };

  return {
    objectives,
    objectivesWithProgress,
    loading,
    error,
    stats,
    createObjective,
    updateObjective,
    deleteObjective,
    refresh: loadObjectives,
    getObjectivesByType,
    getObjectivesByPeriod,
    getCurrentMonthObjective,
    getYearlyObjective,
  };
}
