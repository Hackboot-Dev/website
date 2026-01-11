// /workspaces/website/apps/web/app/[locale]/admin/subscriptions/SubscriptionsPageClient.tsx
// Description: Subscriptions page client component with list, KPIs, and actions
// Last modified: 2025-12-19

'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  RefreshCw,
  Plus,
  Search,
  Filter,
  TrendingUp,
  Users,
  Pause,
  XCircle,
  DollarSign,
  Calendar,
  MoreHorizontal,
  Play,
  Trash2,
  Edit,
  Eye,
  CreditCard,
  ArrowUpRight,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { useSubscriptions } from './hooks';
import {
  formatStatus,
  getStatusColor,
  formatBillingPeriod,
  calculateMonthlyPrice,
  daysUntilRenewal,
  type Subscription,
  type SubscriptionStatus,
} from './types';
import SubscriptionModal from './components/SubscriptionModal';
import SubscriptionDetailModal from './components/SubscriptionDetailModal';

// ============================================================
// FORMATTERS
// ============================================================

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
    month: 'short',
    year: 'numeric',
  });
};

// ============================================================
// KPI CARD COMPONENT
// ============================================================

type KPICardProps = {
  label: string;
  value: string | number;
  subValue?: string;
  icon: React.ElementType;
  color: 'emerald' | 'blue' | 'violet' | 'amber' | 'red';
  trend?: number;
};

function KPICard({ label, value, subValue, icon: Icon, color, trend }: KPICardProps) {
  const colorClasses = {
    emerald: 'border-emerald-900/30 text-emerald-400 bg-emerald-500/10',
    blue: 'border-blue-900/30 text-blue-400 bg-blue-500/10',
    violet: 'border-violet-900/30 text-violet-400 bg-violet-500/10',
    amber: 'border-amber-900/30 text-amber-400 bg-amber-500/10',
    red: 'border-red-900/30 text-red-400 bg-red-500/10',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800 transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 flex items-center justify-center rounded-lg border ${colorClasses[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            <ArrowUpRight className={`h-3 w-3 ${trend < 0 ? 'rotate-180' : ''}`} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-light text-white">{value}</p>
      {subValue && <p className="text-xs text-zinc-500 mt-1">{subValue}</p>}
    </motion.div>
  );
}

// ============================================================
// STATUS BADGE COMPONENT
// ============================================================

function StatusBadge({ status }: { status: SubscriptionStatus }) {
  return (
    <span className={`px-2 py-0.5 text-xs font-medium border rounded ${getStatusColor(status)}`}>
      {formatStatus(status)}
    </span>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function SubscriptionsPageClient() {
  const params = useParams();
  const locale = params.locale as string;

  const {
    subscriptions,
    plans,
    metrics,
    loading,
    refresh,
    pauseSubscription,
    resumeSubscription,
    cancelSubscription,
    reactivateSubscription,
  } = useSubscriptions('vmcloud');

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<SubscriptionStatus | 'all'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  // Filter subscriptions
  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((sub) => {
      // Status filter
      if (statusFilter !== 'all' && sub.status !== statusFilter) return false;

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const clientName = sub.client?.name?.toLowerCase() || '';
        const clientEmail = sub.client?.email?.toLowerCase() || '';
        const planName = sub.plan?.name?.toLowerCase() || '';
        return (
          clientName.includes(query) ||
          clientEmail.includes(query) ||
          planName.includes(query) ||
          sub.id.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [subscriptions, statusFilter, searchQuery]);

  // Refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setIsRefreshing(false);
  };

  // Action handlers
  const handlePause = async (id: string) => {
    await pauseSubscription(id);
    setActionMenuId(null);
  };

  const handleResume = async (id: string) => {
    await resumeSubscription(id);
    setActionMenuId(null);
  };

  const handleCancel = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir résilier cet abonnement ?')) {
      await cancelSubscription(id, false);
      setActionMenuId(null);
    }
  };

  const handleReactivate = async (id: string) => {
    await reactivateSubscription(id);
    setActionMenuId(null);
  };

  const handleViewDetails = (sub: Subscription) => {
    setSelectedSubscription(sub);
    setShowDetailModal(true);
    setActionMenuId(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/50 border border-zinc-800 text-xs uppercase tracking-[0.2em] text-zinc-400 mb-3">
            <CreditCard className="w-3.5 h-3.5" />
            Abonnements
          </div>
          <h1 className="text-3xl font-extralight text-white">Gestion des abonnements</h1>
          <p className="text-zinc-500 mt-1">
            {metrics?.activeSubscriptions || 0} abonnements actifs
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 transition-all"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-white text-zinc-900 hover:bg-zinc-200 transition-all"
          >
            <Plus className="h-4 w-4" />
            Nouvel abonnement
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="MRR"
          value={formatCurrency(metrics?.mrr || 0)}
          subValue={`ARR: ${formatCurrency(metrics?.arr || 0)}`}
          icon={DollarSign}
          color="emerald"
        />
        <KPICard
          label="Abonnements actifs"
          value={metrics?.activeSubscriptions || 0}
          subValue={`${metrics?.trialSubscriptions || 0} en essai`}
          icon={Users}
          color="blue"
        />
        <KPICard
          label="En pause"
          value={metrics?.pausedSubscriptions || 0}
          icon={Pause}
          color="amber"
        />
        <KPICard
          label="Résiliés ce mois"
          value={metrics?.cancelledThisMonth || 0}
          icon={XCircle}
          color="red"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Rechercher un abonnement..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-900/50 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors"
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-zinc-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as SubscriptionStatus | 'all')}
            className="px-3 py-2 bg-zinc-900/50 border border-zinc-800 text-white focus:outline-none focus:border-zinc-700 transition-colors"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="trial">Essai</option>
            <option value="paused">En pause</option>
            <option value="cancelled">Résilié</option>
            <option value="expired">Expiré</option>
            <option value="past_due">Impayé</option>
          </select>
        </div>

        {/* Quick links */}
        <div className="flex items-center gap-2">
          <Link
            href={`/${locale}/admin/subscriptions/plans`}
            className="px-3 py-2 text-sm text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 transition-all"
          >
            Gérer les plans
          </Link>
          <Link
            href={`/${locale}/admin/subscriptions/metrics`}
            className="px-3 py-2 text-sm text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 transition-all flex items-center gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            Métriques
          </Link>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-zinc-900/20 border border-zinc-900 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-zinc-500 mx-auto mb-4" />
            <p className="text-zinc-500">Chargement des abonnements...</p>
          </div>
        ) : filteredSubscriptions.length === 0 ? (
          <div className="p-12 text-center">
            <CreditCard className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500 mb-4">Aucun abonnement trouvé</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 text-sm bg-white text-zinc-900 hover:bg-zinc-200 transition-all"
            >
              Créer un abonnement
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Prix
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Période
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Prochain renouvellement
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {filteredSubscriptions.map((sub) => {
                  const days = daysUntilRenewal(sub);
                  const isExpiringSoon = days <= 7 && days > 0;
                  const monthlyPrice = calculateMonthlyPrice(sub.price, sub.billingPeriod, sub.discountPercent);

                  return (
                    <tr
                      key={sub.id}
                      className="hover:bg-zinc-900/30 transition-colors cursor-pointer"
                      onClick={() => handleViewDetails(sub)}
                    >
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-white font-medium">{sub.client?.name || 'Client inconnu'}</p>
                          <p className="text-xs text-zinc-500">{sub.client?.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-zinc-300">{sub.plan?.name || 'Plan personnalisé'}</p>
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={sub.status} />
                        {sub.cancelAtPeriodEnd && (
                          <span className="ml-2 text-xs text-amber-400">
                            (résiliation programmée)
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-white">{formatCurrency(sub.price)}</p>
                          {sub.discountPercent > 0 && (
                            <p className="text-xs text-emerald-400">-{sub.discountPercent}%</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-zinc-400">{formatBillingPeriod(sub.billingPeriod)}</p>
                        <p className="text-xs text-zinc-600">{formatCurrency(monthlyPrice)}/mois</p>
                      </td>
                      <td className="px-4 py-4">
                        {sub.currentPeriodEnd ? (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-zinc-500" />
                            <span className={`${isExpiringSoon ? 'text-amber-400' : 'text-zinc-400'}`}>
                              {formatDate(sub.currentPeriodEnd)}
                            </span>
                            {isExpiringSoon && (
                              <AlertCircle className="h-4 w-4 text-amber-400" />
                            )}
                          </div>
                        ) : (
                          <span className="text-zinc-600">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="relative">
                          <button
                            onClick={() => setActionMenuId(actionMenuId === sub.id ? null : sub.id)}
                            className="p-2 text-zinc-500 hover:text-white transition-colors"
                          >
                            <MoreHorizontal className="h-5 w-5" />
                          </button>

                          {actionMenuId === sub.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-zinc-900 border border-zinc-800 shadow-xl z-10">
                              <button
                                onClick={() => handleViewDetails(sub)}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                              >
                                <Eye className="h-4 w-4" />
                                Voir les détails
                              </button>

                              {sub.status === 'active' && (
                                <button
                                  onClick={() => handlePause(sub.id)}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                                >
                                  <Pause className="h-4 w-4" />
                                  Mettre en pause
                                </button>
                              )}

                              {sub.status === 'paused' && (
                                <button
                                  onClick={() => handleResume(sub.id)}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                                >
                                  <Play className="h-4 w-4" />
                                  Reprendre
                                </button>
                              )}

                              {sub.status === 'cancelled' && (
                                <button
                                  onClick={() => handleReactivate(sub.id)}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                                >
                                  <RefreshCw className="h-4 w-4" />
                                  Réactiver
                                </button>
                              )}

                              {(sub.status === 'active' || sub.status === 'trial') && !sub.cancelAtPeriodEnd && (
                                <button
                                  onClick={() => handleCancel(sub.id)}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-zinc-800 transition-colors"
                                >
                                  <XCircle className="h-4 w-4" />
                                  Résilier
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="text-sm text-zinc-500">
        {filteredSubscriptions.length} abonnement{filteredSubscriptions.length !== 1 ? 's' : ''} affiché{filteredSubscriptions.length !== 1 ? 's' : ''}
        {statusFilter !== 'all' && ` (filtre: ${formatStatus(statusFilter)})`}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <SubscriptionModal
          plans={plans}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            refresh();
          }}
        />
      )}

      {showDetailModal && selectedSubscription && (
        <SubscriptionDetailModal
          subscription={selectedSubscription}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedSubscription(null);
          }}
          onAction={refresh}
        />
      )}
    </div>
  );
}
