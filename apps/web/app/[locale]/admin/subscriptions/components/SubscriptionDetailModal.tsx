// /workspaces/website/apps/web/app/[locale]/admin/subscriptions/components/SubscriptionDetailModal.tsx
// Description: Modal showing subscription details and history
// Last modified: 2025-12-19

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  User,
  Calendar,
  CreditCard,
  Clock,
  Pause,
  Play,
  XCircle,
  RefreshCw,
  History,
  DollarSign,
  Loader2,
} from 'lucide-react';
import { useSubscriptions } from '../hooks';
import {
  formatStatus,
  getStatusColor,
  formatBillingPeriod,
  getEventTypeLabel,
  calculateMonthlyPrice,
  daysUntilRenewal,
  type Subscription,
  type SubscriptionEvent,
} from '../types';

type SubscriptionDetailModalProps = {
  subscription: Subscription;
  onClose: () => void;
  onAction: () => void;
};

const formatCurrency = (amount: number, currency = 'EUR') => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function SubscriptionDetailModal({
  subscription: sub,
  onClose,
  onAction,
}: SubscriptionDetailModalProps) {
  const {
    pauseSubscription,
    resumeSubscription,
    cancelSubscription,
    reactivateSubscription,
    fetchEvents,
  } = useSubscriptions('vmcloud');

  const [events, setEvents] = useState<SubscriptionEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  // Load events
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchEvents(sub.id);
        setEvents(data);
      } catch (err) {
        console.error('Error loading events:', err);
      } finally {
        setLoadingEvents(false);
      }
    };
    loadEvents();
  }, [sub.id, fetchEvents]);

  // Action handlers
  const handlePause = async () => {
    setActionLoading(true);
    await pauseSubscription(sub.id);
    setActionLoading(false);
    onAction();
  };

  const handleResume = async () => {
    setActionLoading(true);
    await resumeSubscription(sub.id);
    setActionLoading(false);
    onAction();
  };

  const handleCancel = async () => {
    setActionLoading(true);
    await cancelSubscription(sub.id, false, cancelReason || undefined);
    setActionLoading(false);
    setShowCancelConfirm(false);
    onAction();
  };

  const handleReactivate = async () => {
    setActionLoading(true);
    await reactivateSubscription(sub.id);
    setActionLoading(false);
    onAction();
  };

  const days = daysUntilRenewal(sub);
  const monthlyPrice = calculateMonthlyPrice(sub.price, sub.billingPeriod, sub.discountPercent);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-zinc-400" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-white">
                {sub.plan?.name || 'Abonnement personnalisé'}
              </h2>
              <p className="text-sm text-zinc-500">{sub.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status */}
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 text-sm font-medium border rounded ${getStatusColor(sub.status)}`}>
              {formatStatus(sub.status)}
            </span>
            {sub.cancelAtPeriodEnd && (
              <span className="px-3 py-1 text-sm text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded">
                Résiliation programmée
              </span>
            )}
          </div>

          {/* Client info */}
          <div className="p-4 bg-zinc-800/50 border border-zinc-700">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-zinc-500" />
              <div>
                <p className="text-white font-medium">{sub.client?.name || 'Client inconnu'}</p>
                <p className="text-sm text-zinc-500">{sub.client?.email}</p>
                {sub.client?.company && (
                  <p className="text-sm text-zinc-600">{sub.client.company}</p>
                )}
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-zinc-800/30 border border-zinc-800">
              <div className="flex items-center gap-2 text-zinc-500 mb-2">
                <DollarSign className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wider">Prix</span>
              </div>
              <p className="text-2xl text-white font-light">{formatCurrency(sub.price)}</p>
              <p className="text-sm text-zinc-500">{formatBillingPeriod(sub.billingPeriod)}</p>
              {sub.discountPercent > 0 && (
                <p className="text-sm text-emerald-400 mt-1">-{sub.discountPercent}% de remise</p>
              )}
            </div>
            <div className="p-4 bg-zinc-800/30 border border-zinc-800">
              <div className="flex items-center gap-2 text-zinc-500 mb-2">
                <RefreshCw className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wider">MRR</span>
              </div>
              <p className="text-2xl text-emerald-400 font-light">{formatCurrency(monthlyPrice)}</p>
              <p className="text-sm text-zinc-500">par mois</p>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-zinc-800/30 border border-zinc-800">
              <div className="flex items-center gap-2 text-zinc-500 mb-2">
                <Calendar className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wider">Début</span>
              </div>
              <p className="text-white">{formatDate(sub.startedAt)}</p>
            </div>
            <div className="p-4 bg-zinc-800/30 border border-zinc-800">
              <div className="flex items-center gap-2 text-zinc-500 mb-2">
                <Clock className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wider">Prochain renouvellement</span>
              </div>
              {sub.currentPeriodEnd ? (
                <>
                  <p className="text-white">{formatDate(sub.currentPeriodEnd)}</p>
                  <p className={`text-sm ${days <= 7 ? 'text-amber-400' : 'text-zinc-500'}`}>
                    Dans {days} jour{days !== 1 ? 's' : ''}
                  </p>
                </>
              ) : (
                <p className="text-zinc-500">-</p>
              )}
            </div>
          </div>

          {/* Notes */}
          {sub.notes && (
            <div className="p-4 bg-zinc-800/30 border border-zinc-800">
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Notes</p>
              <p className="text-zinc-300">{sub.notes}</p>
            </div>
          )}

          {/* Cancel reason */}
          {sub.cancelReason && (
            <div className="p-4 bg-red-500/10 border border-red-500/20">
              <p className="text-xs text-red-400 uppercase tracking-wider mb-2">Raison de résiliation</p>
              <p className="text-red-300">{sub.cancelReason}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            {sub.status === 'active' && (
              <button
                onClick={handlePause}
                disabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2 text-sm text-amber-400 border border-amber-400/30 hover:bg-amber-400/10 transition-colors disabled:opacity-50"
              >
                <Pause className="h-4 w-4" />
                Mettre en pause
              </button>
            )}

            {sub.status === 'paused' && (
              <button
                onClick={handleResume}
                disabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2 text-sm text-emerald-400 border border-emerald-400/30 hover:bg-emerald-400/10 transition-colors disabled:opacity-50"
              >
                <Play className="h-4 w-4" />
                Reprendre
              </button>
            )}

            {sub.status === 'cancelled' && (
              <button
                onClick={handleReactivate}
                disabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2 text-sm text-emerald-400 border border-emerald-400/30 hover:bg-emerald-400/10 transition-colors disabled:opacity-50"
              >
                <RefreshCw className="h-4 w-4" />
                Réactiver
              </button>
            )}

            {(sub.status === 'active' || sub.status === 'trial') && !sub.cancelAtPeriodEnd && (
              <button
                onClick={() => setShowCancelConfirm(true)}
                disabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 border border-red-400/30 hover:bg-red-400/10 transition-colors disabled:opacity-50"
              >
                <XCircle className="h-4 w-4" />
                Résilier
              </button>
            )}
          </div>

          {/* Cancel confirmation */}
          {showCancelConfirm && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 space-y-4">
              <p className="text-red-400 font-medium">Confirmer la résiliation</p>
              <p className="text-sm text-zinc-400">
                L'abonnement sera résilié à la fin de la période en cours ({sub.currentPeriodEnd ? formatDate(sub.currentPeriodEnd) : 'date inconnue'}).
              </p>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Raison de la résiliation (optionnel)..."
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 text-sm resize-none"
                rows={2}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleCancel}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {actionLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Confirmer la résiliation
                </button>
              </div>
            </div>
          )}

          {/* Events history */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <History className="h-4 w-4 text-zinc-500" />
              <span className="text-sm text-zinc-400 uppercase tracking-wider">Historique</span>
            </div>

            {loadingEvents ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
              </div>
            ) : events.length === 0 ? (
              <p className="text-center text-zinc-500 py-8">Aucun événement</p>
            ) : (
              <div className="space-y-3">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-3 p-3 bg-zinc-800/30 border border-zinc-800"
                  >
                    <div className="w-2 h-2 mt-2 rounded-full bg-zinc-600" />
                    <div className="flex-1">
                      <p className="text-sm text-white">{getEventTypeLabel(event.eventType)}</p>
                      {event.reason && (
                        <p className="text-xs text-zinc-500 mt-1">{event.reason}</p>
                      )}
                      {event.oldPrice !== undefined && event.newPrice !== undefined && (
                        <p className="text-xs text-zinc-500 mt-1">
                          Prix: {formatCurrency(event.oldPrice)} → {formatCurrency(event.newPrice)}
                        </p>
                      )}
                      <p className="text-xs text-zinc-600 mt-1">
                        {formatDateTime(event.createdAt)}
                        {event.performedBy && ` • ${event.performedBy}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-zinc-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Fermer
          </button>
        </div>
      </motion.div>
    </div>
  );
}
