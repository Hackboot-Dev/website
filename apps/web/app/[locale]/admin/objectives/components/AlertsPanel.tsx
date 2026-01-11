// /workspaces/website/apps/web/app/[locale]/admin/objectives/components/AlertsPanel.tsx
// Description: Panel for displaying and managing alerts
// Last modified: 2026-01-10

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  Check,
  CheckCheck,
  Trash2,
  Bell,
  BellOff,
} from 'lucide-react';
import type { Alert, AlertSeverity, AlertCounts } from '../types';
import { ALERT_SEVERITY_CONFIG } from '../types';

type AlertsPanelProps = {
  alerts: Alert[];
  counts: AlertCounts;
  loading?: boolean;
  onMarkAsRead: (alertId: string) => void;
  onMarkAllAsRead: () => void;
  onAcknowledge: (alertId: string) => void;
  onDelete: (alertId: string) => void;
};

const SEVERITY_ICONS: Record<AlertSeverity, React.ReactNode> = {
  critical: <AlertTriangle className="h-4 w-4" />,
  warning: <AlertCircle className="h-4 w-4" />,
  info: <Info className="h-4 w-4" />,
};

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'À l\'instant';
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays < 7) return `Il y a ${diffDays}j`;
  return date.toLocaleDateString('fr-FR');
}

export function AlertsPanel({
  alerts,
  counts,
  loading,
  onMarkAsRead,
  onMarkAllAsRead,
  onAcknowledge,
  onDelete,
}: AlertsPanelProps) {
  const hasUnread = counts.total > 0;

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="h-5 w-5 text-zinc-400" />
            {hasUnread && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                {counts.total > 9 ? '9+' : counts.total}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-white font-medium">Alertes</h3>
            <p className="text-xs text-zinc-500">
              {counts.critical > 0 && (
                <span className="text-red-400">{counts.critical} critique{counts.critical > 1 ? 's' : ''}</span>
              )}
              {counts.critical > 0 && counts.warning > 0 && ' • '}
              {counts.warning > 0 && (
                <span className="text-amber-400">{counts.warning} attention</span>
              )}
              {(counts.critical > 0 || counts.warning > 0) && counts.info > 0 && ' • '}
              {counts.info > 0 && (
                <span className="text-blue-400">{counts.info} info</span>
              )}
              {counts.total === 0 && 'Aucune alerte non lue'}
            </p>
          </div>
        </div>
        {hasUnread && (
          <button
            onClick={onMarkAllAsRead}
            className="flex items-center gap-1 px-3 py-1.5 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Tout marquer lu
          </button>
        )}
      </div>

      {/* Alert List */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center text-zinc-500">
            Chargement...
          </div>
        ) : alerts.length === 0 ? (
          <div className="p-8 text-center">
            <BellOff className="h-8 w-8 text-zinc-700 mx-auto mb-2" />
            <p className="text-zinc-500">Aucune alerte</p>
          </div>
        ) : (
          <AnimatePresence>
            {alerts.map((alert) => {
              const config = ALERT_SEVERITY_CONFIG[alert.severity];
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`border-b border-zinc-800 last:border-0 ${
                    !alert.isRead ? 'bg-zinc-800/30' : ''
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${config.bgColor} ${config.color}`}
                      >
                        {SEVERITY_ICONS[alert.severity]}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className={`text-sm font-medium ${!alert.isRead ? 'text-white' : 'text-zinc-400'}`}>
                              {alert.title}
                            </h4>
                            <p className="text-sm text-zinc-500 mt-0.5">{alert.message}</p>
                          </div>
                          <span className="text-xs text-zinc-600 flex-shrink-0">
                            {formatRelativeTime(alert.createdAt)}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 mt-2">
                          {!alert.isRead && (
                            <button
                              onClick={() => onMarkAsRead(alert.id)}
                              className="flex items-center gap-1 px-2 py-1 text-xs text-zinc-500 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                            >
                              <Check className="h-3 w-3" />
                              Marquer lu
                            </button>
                          )}
                          {!alert.isAcknowledged && alert.severity !== 'info' && (
                            <button
                              onClick={() => onAcknowledge(alert.id)}
                              className="flex items-center gap-1 px-2 py-1 text-xs text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded transition-colors"
                            >
                              <CheckCheck className="h-3 w-3" />
                              Acquitter
                            </button>
                          )}
                          <button
                            onClick={() => onDelete(alert.id)}
                            className="flex items-center gap-1 px-2 py-1 text-xs text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
