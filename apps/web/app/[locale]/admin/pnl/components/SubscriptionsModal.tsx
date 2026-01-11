// /workspaces/website/apps/web/app/[locale]/admin/pnl/components/SubscriptionsModal.tsx
// Description: Modal for managing subscriptions - view, pause, resume, cancel, sync
// Last modified: 2024-12-14

'use client';

import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Pause,
  Play,
  Trash2,
  Calendar,
  TrendingUp,
  Users,
  Search,
  Filter,
  ChevronDown,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
} from 'lucide-react';
import type { Subscription, SubscriptionStats } from '../types/subscription';
import { formatCurrency } from '../types';

// ============================================================
// TYPES
// ============================================================

type SubscriptionsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  subscriptions: Subscription[];
  stats: SubscriptionStats;
  totalCount: number;
  hasMore: boolean;
  loading: boolean;
  deleting: boolean;
  deleteProgress: { current: number; total: number };
  onPause: (id: string) => Promise<void>;
  onResume: (id: string) => Promise<void>;
  onCancel: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onDeleteAll: () => Promise<void>;
  onLoadMore: () => Promise<void>;
  onUpdate?: (id: string, data: Partial<Subscription>) => Promise<void>;
};

type FilterStatus = 'all' | 'active' | 'paused' | 'cancelled' | 'expired';
type SortBy = 'nextRenewal' | 'amount' | 'clientName' | 'createdAt';

// ============================================================
// HELPERS
// ============================================================

const getStatusIcon = (status: Subscription['status']) => {
  switch (status) {
    case 'active':
      return <CheckCircle className="h-4 w-4 text-emerald-400" />;
    case 'paused':
      return <Pause className="h-4 w-4 text-amber-400" />;
    case 'cancelled':
      return <XCircle className="h-4 w-4 text-red-400" />;
    case 'expired':
      return <Clock className="h-4 w-4 text-zinc-500" />;
  }
};

const getStatusLabel = (status: Subscription['status']) => {
  switch (status) {
    case 'active':
      return 'Actif';
    case 'paused':
      return 'En pause';
    case 'cancelled':
      return 'Annulé';
    case 'expired':
      return 'Expiré';
  }
};

const getStatusColor = (status: Subscription['status']) => {
  switch (status) {
    case 'active':
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'paused':
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'cancelled':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'expired':
      return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
  }
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
};

// ============================================================
// COMPONENT
// ============================================================

export function SubscriptionsModal({
  isOpen,
  onClose,
  subscriptions,
  stats,
  totalCount,
  hasMore,
  loading,
  deleting,
  deleteProgress,
  onPause,
  onResume,
  onCancel,
  onDelete,
  onDeleteAll,
  onLoadMore,
}: SubscriptionsModalProps) {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortBy, setSortBy] = useState<SortBy>('nextRenewal');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Bulk selection (for local selection UI only)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Filter and sort subscriptions
  const filteredSubscriptions = useMemo(() => {
    let result = [...subscriptions];

    // Filter by status
    if (filterStatus !== 'all') {
      result = result.filter((s) => s.status === filterStatus);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.clientName.toLowerCase().includes(query) ||
          s.productLabel.toLowerCase().includes(query) ||
          s.clientEmail?.toLowerCase().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'nextRenewal':
          return new Date(a.nextRenewalDate).getTime() - new Date(b.nextRenewalDate).getTime();
        case 'amount':
          return b.finalAmount - a.finalAmount;
        case 'clientName':
          return a.clientName.localeCompare(b.clientName);
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    return result;
  }, [subscriptions, filterStatus, sortBy, searchQuery]);

  // Reset selection when filters change
  const handleFilterChange = (status: FilterStatus) => {
    setFilterStatus(status);
    setSelectedIds(new Set());
  };

  // Bulk selection helpers
  const allSelected = filteredSubscriptions.length > 0 &&
    filteredSubscriptions.every(s => selectedIds.has(s.id));
  const someSelected = selectedIds.size > 0;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredSubscriptions.map(s => s.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  // Handle delete all (uses hook's batch delete)
  const handleDeleteAll = async () => {
    if (!confirm(`⚠️ ATTENTION: Vous allez supprimer définitivement ${totalCount} abonnement${totalCount > 1 ? 's' : ''}.\n\nCette action est irréversible. Continuer ?`)) {
      return;
    }
    await onDeleteAll();
    setSelectedIds(new Set());
  };

  // Handle actions
  const handlePause = async (id: string) => {
    setActionLoading(id);
    try {
      await onPause(id);
    } finally {
      setActionLoading(null);
    }
  };

  const handleResume = async (id: string) => {
    setActionLoading(id);
    try {
      await onResume(id);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cet abonnement ?')) return;
    setActionLoading(id);
    try {
      await onCancel(id);
    } finally {
      setActionLoading(null);
    }
  };

  if (!isOpen || typeof window === 'undefined') return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="h-full w-full flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-5xl max-h-[90vh] bg-zinc-950 border border-zinc-800 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 flex-shrink-0">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-violet-500/20 rounded-lg">
                <Calendar className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-white">Abonnements</h2>
                <p className="text-sm text-zinc-500">{stats.total} abonnement{stats.total > 1 ? 's' : ''}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-4 px-6 py-4 border-b border-zinc-800 bg-zinc-900/30">
            <div className="text-center">
              <p className="text-2xl font-light text-violet-400">{formatCurrency(stats.mrr)}</p>
              <p className="text-xs text-zinc-500 flex items-center justify-center gap-1">
                <TrendingUp className="h-3 w-3" /> MRR
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-light text-emerald-400">{formatCurrency(stats.arr)}</p>
              <p className="text-xs text-zinc-500 flex items-center justify-center gap-1">
                <Calendar className="h-3 w-3" /> ARR
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-light text-white">{stats.active}</p>
              <p className="text-xs text-zinc-500 flex items-center justify-center gap-1">
                <CheckCircle className="h-3 w-3 text-emerald-400" /> Actifs
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-light text-zinc-400">{stats.paused + stats.cancelled}</p>
              <p className="text-xs text-zinc-500 flex items-center justify-center gap-1">
                <Users className="h-3 w-3" /> Inactifs
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="px-6 py-3 border-b border-zinc-800 flex items-center gap-4">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 text-white text-sm placeholder-zinc-600 focus:border-zinc-600 focus:outline-none"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 py-2 border text-sm flex items-center gap-2 transition-colors ${
                showFilters || filterStatus !== 'all'
                  ? 'bg-zinc-800 border-zinc-600 text-white'
                  : 'border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white'
              }`}
            >
              <Filter className="h-4 w-4" />
              Filtres
              {filterStatus !== 'all' && (
                <span className="px-1.5 py-0.5 bg-violet-500 text-white text-xs rounded-full">1</span>
              )}
            </button>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-zinc-500">Trier par:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="px-3 py-2 bg-zinc-900 border border-zinc-800 text-white text-sm focus:border-zinc-600 focus:outline-none"
              >
                <option value="nextRenewal">Prochain renouvellement</option>
                <option value="amount">Montant</option>
                <option value="clientName">Client</option>
                <option value="createdAt">Date de création</option>
              </select>
            </div>
          </div>

          {/* Filter Options */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-6 py-3 border-b border-zinc-800 bg-zinc-900/30">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500 mr-2">Statut:</span>
                    {(['all', 'active', 'paused', 'cancelled', 'expired'] as FilterStatus[]).map((status) => (
                      <button
                        key={status}
                        onClick={() => handleFilterChange(status)}
                        className={`px-3 py-1.5 text-xs border transition-colors ${
                          filterStatus === status
                            ? 'bg-zinc-800 border-zinc-600 text-white'
                            : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-white'
                        }`}
                      >
                        {status === 'all' ? 'Tous' : getStatusLabel(status as Subscription['status'])}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bulk Actions Bar */}
          {totalCount > 0 && (
            <div className="px-6 py-3 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm text-zinc-400">
                  {subscriptions.length} chargé{subscriptions.length > 1 ? 's' : ''} sur {totalCount}
                </span>
                {hasMore && (
                  <button
                    onClick={onLoadMore}
                    disabled={loading || deleting}
                    className="text-xs text-violet-400 hover:text-violet-300 underline disabled:opacity-50"
                  >
                    Charger plus
                  </button>
                )}
              </div>
              <button
                onClick={handleDeleteAll}
                disabled={deleting || totalCount === 0}
                className="px-3 py-1.5 bg-red-500/20 text-red-400 text-xs border border-red-500/30 hover:bg-red-500/30 transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <Trash2 className="h-3 w-3" />
                Supprimer tout ({totalCount})
              </button>
            </div>
          )}

          {/* Delete Progress Overlay */}
          {deleting && (
            <div className="px-6 py-3 bg-red-500/10 border-b border-red-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-red-400 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Suppression en cours...
                </span>
                <span className="text-sm text-red-400">
                  {deleteProgress.current}/{deleteProgress.total}
                </span>
              </div>
              <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-red-500 h-full transition-all duration-300"
                  style={{ width: `${deleteProgress.total > 0 ? (deleteProgress.current / deleteProgress.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
              </div>
            ) : filteredSubscriptions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                <Calendar className="h-12 w-12 mb-4 opacity-30" />
                <p className="text-lg">Aucun abonnement</p>
                <p className="text-sm text-zinc-600 mt-1">
                  {searchQuery || filterStatus !== 'all'
                    ? 'Essayez de modifier vos filtres'
                    : 'Créez un abonnement depuis la modal de transactions'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-800/50">
                {filteredSubscriptions.map((sub) => (
                  <div
                    key={sub.id}
                    className="px-6 py-4 hover:bg-zinc-900/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Left: Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-2 py-0.5 text-xs border rounded-full flex items-center gap-1.5 ${getStatusColor(sub.status)}`}>
                            {getStatusIcon(sub.status)}
                            {getStatusLabel(sub.status)}
                          </span>
                          <span className={`px-2 py-0.5 text-xs border rounded-full ${
                            sub.cycle === 'monthly'
                              ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                              : 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                          }`}>
                            {sub.cycle === 'monthly' ? 'Mensuel' : 'Annuel'}
                          </span>
                        </div>
                        <h4 className="text-white font-medium truncate">{sub.clientName}</h4>
                        <p className="text-sm text-zinc-500 truncate">{sub.productLabel}</p>
                      </div>

                      {/* Center: Dates */}
                      <div className="text-center px-4">
                        <p className="text-xs text-zinc-500 mb-1">Prochain renouvellement</p>
                        <p className="text-sm text-white font-medium">
                          {sub.status === 'active' ? formatDate(sub.nextRenewalDate) : '-'}
                        </p>
                        <p className="text-xs text-zinc-600 mt-1">
                          {sub.renewalCount} renouvellement{sub.renewalCount > 1 ? 's' : ''}
                        </p>
                      </div>

                      {/* Right: Amount & Actions */}
                      <div className="text-right">
                        <div className="mb-2">
                          {sub.discount ? (
                            <>
                              <p className="text-lg font-medium text-emerald-400">{formatCurrency(sub.finalAmount)}</p>
                              <p className="text-xs text-zinc-500 line-through">{formatCurrency(sub.amount)}</p>
                            </>
                          ) : (
                            <p className="text-lg font-medium text-white">{formatCurrency(sub.finalAmount)}</p>
                          )}
                          <p className="text-xs text-zinc-600">/{sub.cycle === 'monthly' ? 'mois' : 'an'}</p>
                        </div>
                        <div className="flex items-center gap-1 justify-end">
                          {actionLoading === sub.id ? (
                            <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
                          ) : (
                            <>
                              {sub.status === 'active' && (
                                <button
                                  onClick={() => handlePause(sub.id)}
                                  className="p-1.5 text-zinc-500 hover:text-amber-400 hover:bg-zinc-800 transition-colors rounded"
                                  title="Mettre en pause"
                                >
                                  <Pause className="h-4 w-4" />
                                </button>
                              )}
                              {sub.status === 'paused' && (
                                <button
                                  onClick={() => handleResume(sub.id)}
                                  className="p-1.5 text-zinc-500 hover:text-emerald-400 hover:bg-zinc-800 transition-colors rounded"
                                  title="Reprendre"
                                >
                                  <Play className="h-4 w-4" />
                                </button>
                              )}
                              {(sub.status === 'active' || sub.status === 'paused') && (
                                <button
                                  onClick={() => handleCancel(sub.id)}
                                  className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors rounded"
                                  title="Annuler"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Load More Button */}
                {hasMore && (
                  <div className="p-4 text-center border-t border-zinc-800/50">
                    <button
                      onClick={onLoadMore}
                      disabled={loading}
                      className="px-4 py-2 text-sm text-violet-400 hover:text-violet-300 border border-violet-500/30 hover:border-violet-500/50 transition-colors disabled:opacity-50 flex items-center gap-2 mx-auto"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Chargement...
                        </>
                      ) : (
                        <>
                          Charger plus
                          <span className="text-zinc-500">
                            ({subscriptions.length}/{totalCount})
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800 flex-shrink-0 bg-zinc-900/50">
            <div className="text-sm text-zinc-500">
              {subscriptions.length} chargé{subscriptions.length > 1 ? 's' : ''} sur {totalCount} total
            </div>
            <button
              onClick={onClose}
              className="px-5 py-2 border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors text-sm"
            >
              Fermer
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>,
    document.body
  );
}

export default SubscriptionsModal;
