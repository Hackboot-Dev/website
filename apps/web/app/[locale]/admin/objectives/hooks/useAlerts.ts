// /workspaces/website/apps/web/app/[locale]/admin/objectives/hooks/useAlerts.ts
// Description: Hook for managing alerts
// Last modified: 2026-01-10

'use client';

import { useState, useEffect, useCallback } from 'react';
import { getDatabase } from '../../../../../lib/services/database';
import type { CompanyId } from '../../pnl/types';
import type { Alert, AlertCounts, AlertSeverity } from '../types';

type UseAlertsOptions = {
  companyId: CompanyId;
  autoRefresh?: boolean;
  refreshInterval?: number; // ms
};

export function useAlerts({
  companyId,
  autoRefresh = false,
  refreshInterval = 60000, // 1 minute
}: UseAlertsOptions) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [counts, setCounts] = useState<AlertCounts>({ total: 0, critical: 0, warning: 0, info: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dbService = getDatabase(companyId);

  // Load alerts
  const loadAlerts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [alertsData, countsData] = await Promise.all([
        dbService.getAlerts({ limit: 50 }),
        dbService.getAlertCounts(),
      ]);

      setAlerts(alertsData as Alert[]);
      setCounts(countsData);
    } catch (err) {
      console.error('Error loading alerts:', err);
      setError('Erreur lors du chargement des alertes');
    } finally {
      setLoading(false);
    }
  }, [dbService]);

  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(loadAlerts, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, loadAlerts]);

  // Mark alert as read
  const markAsRead = async (alertId: string): Promise<boolean> => {
    try {
      await dbService.markAlertAsRead(alertId);
      setAlerts(prev =>
        prev.map(a => (a.id === alertId ? { ...a, isRead: true } : a))
      );
      setCounts(prev => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
        // Decrement specific severity count
        critical: alerts.find(a => a.id === alertId)?.severity === 'critical'
          ? Math.max(0, prev.critical - 1) : prev.critical,
        warning: alerts.find(a => a.id === alertId)?.severity === 'warning'
          ? Math.max(0, prev.warning - 1) : prev.warning,
        info: alerts.find(a => a.id === alertId)?.severity === 'info'
          ? Math.max(0, prev.info - 1) : prev.info,
      }));
      return true;
    } catch (err) {
      console.error('Error marking alert as read:', err);
      return false;
    }
  };

  // Mark all as read
  const markAllAsRead = async (): Promise<boolean> => {
    try {
      await dbService.markAllAlertsAsRead();
      setAlerts(prev => prev.map(a => ({ ...a, isRead: true })));
      setCounts({ total: 0, critical: 0, warning: 0, info: 0 });
      return true;
    } catch (err) {
      console.error('Error marking all alerts as read:', err);
      return false;
    }
  };

  // Acknowledge alert
  const acknowledgeAlert = async (alertId: string): Promise<boolean> => {
    try {
      await dbService.acknowledgeAlert(alertId);
      setAlerts(prev =>
        prev.map(a =>
          a.id === alertId
            ? { ...a, isAcknowledged: true, acknowledgedAt: new Date().toISOString() }
            : a
        )
      );
      return true;
    } catch (err) {
      console.error('Error acknowledging alert:', err);
      return false;
    }
  };

  // Delete alert
  const deleteAlert = async (alertId: string): Promise<boolean> => {
    try {
      const alert = alerts.find(a => a.id === alertId);
      await dbService.deleteAlert(alertId);
      setAlerts(prev => prev.filter(a => a.id !== alertId));
      if (alert && !alert.isRead) {
        setCounts(prev => ({
          ...prev,
          total: Math.max(0, prev.total - 1),
          [alert.severity]: Math.max(0, prev[alert.severity as keyof AlertCounts] as number - 1),
        }));
      }
      return true;
    } catch (err) {
      console.error('Error deleting alert:', err);
      return false;
    }
  };

  // Create alert (for manual alerts)
  const createAlert = async (data: {
    severity: AlertSeverity;
    type: Alert['type'];
    title: string;
    message: string;
  }): Promise<string | null> => {
    try {
      const result = await dbService.createAlert(data);
      await loadAlerts();
      return result.id;
    } catch (err) {
      console.error('Error creating alert:', err);
      return null;
    }
  };

  // Filter helpers
  const unreadAlerts = alerts.filter(a => !a.isRead);
  const criticalAlerts = alerts.filter(a => a.severity === 'critical');
  const warningAlerts = alerts.filter(a => a.severity === 'warning');
  const infoAlerts = alerts.filter(a => a.severity === 'info');

  return {
    alerts,
    counts,
    loading,
    error,
    unreadAlerts,
    criticalAlerts,
    warningAlerts,
    infoAlerts,
    markAsRead,
    markAllAsRead,
    acknowledgeAlert,
    deleteAlert,
    createAlert,
    refresh: loadAlerts,
  };
}
