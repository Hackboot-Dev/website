// /workspaces/website/apps/web/app/[locale]/admin/objectives/hooks/useObjectives.ts
// Description: Hook for managing objectives
// Last modified: 2026-01-10

'use client';

import { useState, useEffect, useCallback } from 'react';
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

  // Load objectives
  const loadObjectives = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [objectivesData, progressData] = await Promise.all([
        dbService.getObjectives(selectedYear),
        dbService.getObjectivesWithProgress(selectedYear),
      ]);

      setObjectives(objectivesData as Objective[]);

      // Merge objectives with progress data
      const merged: ObjectiveWithProgress[] = objectivesData.map(obj => {
        const progress = progressData.find(p => p.id === obj.id);
        return {
          ...obj,
          actualAmount: progress?.actualAmount || 0,
          progressPercent: progress?.progressPercent || 0,
          status: (progress?.status || 'behind') as ObjectiveStatus,
        } as ObjectiveWithProgress;
      });

      setObjectivesWithProgress(merged);
    } catch (err) {
      console.error('Error loading objectives:', err);
      setError('Erreur lors du chargement des objectifs');
    } finally {
      setLoading(false);
    }
  }, [dbService, selectedYear]);

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
