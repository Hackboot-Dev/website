// /workspaces/website/apps/web/app/[locale]/admin/pnl/components/ClientsModal.tsx
// Description: Modal for client management with animated search and stats
// Last modified: 2025-12-16

'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Search,
  Users,
  TrendingUp,
  ShoppingBag,
  Calendar,
  Mail,
  Phone,
  Building,
  User,
  Star,
  ArrowUpRight,
  Loader2,
} from 'lucide-react';
import type { Client } from '../../../../../lib/types/database';

// ============================================================
// TYPES
// ============================================================

type ClientsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  clients?: Client[];
  loading?: boolean;
  companyId?: 'vmcloud' | 'hackboot';
};

type ClientStats = {
  total: number;
  active: number;
  business: number;
  individual: number;
  totalRevenue: number;
  avgRevenue: number;
  newThisMonth: number;
  topClient: Client | null;
};

// ============================================================
// HELPERS
// ============================================================

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const getClientTypeIcon = (type: string) => {
  return type === 'business' ? Building : User;
};

// ============================================================
// COMPONENT
// ============================================================

export function ClientsModal({
  isOpen,
  onClose,
  clients,
  loading,
}: ClientsModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Default to empty array if clients not provided
  const clientsList = clients ?? [];

  // Calculate stats
  const stats: ClientStats = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const totalRevenue = clientsList.reduce((sum, c) => sum + (c.totalRevenue || 0), 0);
    const activeClients = clientsList.filter(c => c.status === 'active');
    const topClient = clientsList.reduce((top, c) =>
      (!top || (c.totalRevenue || 0) > (top.totalRevenue || 0)) ? c : top
    , null as Client | null);

    return {
      total: clientsList.length,
      active: activeClients.length,
      business: clientsList.filter(c => c.type === 'business').length,
      individual: clientsList.filter(c => c.type === 'individual').length,
      totalRevenue,
      avgRevenue: clientsList.length > 0 ? totalRevenue / clientsList.length : 0,
      newThisMonth: clientsList.filter(c => new Date(c.createdAt) >= startOfMonth).length,
      topClient,
    };
  }, [clientsList]);

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    return clientsList.filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      (c.company && c.company.toLowerCase().includes(query)) ||
      c.id.toLowerCase().includes(query)
    ).slice(0, 10); // Limit to 10 results
  }, [clientsList, searchQuery]);

  // Focus search on open
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      // Small delay to allow animation
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setIsSearchFocused(false);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isSearchFocused && searchQuery) {
          setSearchQuery('');
          setIsSearchFocused(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, isSearchFocused, searchQuery]);

  if (!isOpen) return null;

  const showStats = !isSearchFocused && !searchQuery;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl mx-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-violet-400" />
              <h2 className="text-lg font-medium text-white">Clients</h2>
              <span className="text-sm text-zinc-500">
                {stats.total} enregistré{stats.total > 1 ? 's' : ''}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors rounded"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 min-h-[400px]">
            {/* Search Bar */}
            <motion.div
              layout
              className={`relative mx-auto transition-all duration-300 ${
                isSearchFocused || searchQuery ? 'w-full' : 'w-2/3'
              }`}
            >
              <motion.div
                layout
                className={`relative flex items-center border transition-all duration-300 ${
                  isSearchFocused
                    ? 'border-violet-500 bg-zinc-900 shadow-lg shadow-violet-500/10'
                    : 'border-zinc-700 bg-zinc-900/50 hover:border-zinc-600'
                }`}
              >
                <Search className={`h-5 w-5 ml-4 transition-colors ${
                  isSearchFocused ? 'text-violet-400' : 'text-zinc-500'
                }`} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => !searchQuery && setIsSearchFocused(false)}
                  placeholder="Rechercher un client par nom, email, entreprise..."
                  className={`flex-1 bg-transparent border-none outline-none text-white placeholder-zinc-500 transition-all duration-300 ${
                    isSearchFocused ? 'py-4 px-4 text-lg' : 'py-3 px-3'
                  }`}
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      searchInputRef.current?.focus();
                    }}
                    className="p-2 mr-2 text-zinc-500 hover:text-white transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </motion.div>

              {/* Search hint */}
              <AnimatePresence>
                {isSearchFocused && !searchQuery && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-0 right-0 text-center text-xs text-zinc-500 mt-2"
                  >
                    Tapez pour rechercher • Échap pour annuler
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Stats Grid - Hide when searching */}
            <AnimatePresence>
              {showStats && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-8"
                >
                  {/* Main Stats */}
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-zinc-900/50 border border-zinc-800 p-4 text-center">
                      <Users className="h-6 w-6 text-violet-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">{stats.total}</p>
                      <p className="text-xs text-zinc-500">Total clients</p>
                    </div>
                    <div className="bg-zinc-900/50 border border-zinc-800 p-4 text-center">
                      <TrendingUp className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-emerald-400">{formatCurrency(stats.totalRevenue)}</p>
                      <p className="text-xs text-zinc-500">Revenu total</p>
                    </div>
                    <div className="bg-zinc-900/50 border border-zinc-800 p-4 text-center">
                      <ShoppingBag className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">{formatCurrency(stats.avgRevenue)}</p>
                      <p className="text-xs text-zinc-500">Revenu moyen</p>
                    </div>
                    <div className="bg-zinc-900/50 border border-zinc-800 p-4 text-center">
                      <Calendar className="h-6 w-6 text-amber-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">{stats.newThisMonth}</p>
                      <p className="text-xs text-zinc-500">Nouveaux ce mois</p>
                    </div>
                  </div>

                  {/* Secondary Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-zinc-900/30 border border-zinc-800/50 p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Building className="h-5 w-5 text-zinc-500" />
                        <span className="text-zinc-400">Entreprises</span>
                      </div>
                      <span className="text-lg font-medium text-white">{stats.business}</span>
                    </div>
                    <div className="bg-zinc-900/30 border border-zinc-800/50 p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-zinc-500" />
                        <span className="text-zinc-400">Particuliers</span>
                      </div>
                      <span className="text-lg font-medium text-white">{stats.individual}</span>
                    </div>
                  </div>

                  {/* Top Client */}
                  {stats.topClient && (
                    <div className="bg-gradient-to-r from-violet-500/10 to-transparent border border-violet-500/30 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Star className="h-4 w-4 text-violet-400" />
                        <span className="text-sm text-violet-400 font-medium">Meilleur client</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            stats.topClient.type === 'business'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-emerald-500/20 text-emerald-400'
                          }`}>
                            {stats.topClient.type === 'business' ? (
                              <Building className="h-5 w-5" />
                            ) : (
                              <User className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <p className="text-white font-medium">{stats.topClient.name}</p>
                            <p className="text-xs text-zinc-500">{stats.topClient.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-emerald-400">
                            {formatCurrency(stats.topClient.totalRevenue || 0)}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {stats.topClient.totalTransactions || 0} transaction{(stats.topClient.totalTransactions || 0) > 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Quick tip */}
                  <p className="text-center text-xs text-zinc-600 mt-6">
                    Cliquez sur la barre de recherche pour trouver un client
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Search Results */}
            <AnimatePresence>
              {(isSearchFocused || searchQuery) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-6"
                >
                  {searchQuery ? (
                    searchResults.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-xs text-zinc-500 mb-3">
                          {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''} pour "{searchQuery}"
                        </p>
                        {searchResults.map((client) => {
                          const TypeIcon = getClientTypeIcon(client.type);
                          return (
                            <motion.div
                              key={client.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer group"
                            >
                              <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  client.type === 'business'
                                    ? 'bg-blue-500/20 text-blue-400'
                                    : 'bg-emerald-500/20 text-emerald-400'
                                }`}>
                                  <TypeIcon className="h-5 w-5" />
                                </div>
                                <div>
                                  <p className="text-white font-medium group-hover:text-violet-400 transition-colors">
                                    {client.name}
                                  </p>
                                  <div className="flex items-center gap-3 text-xs text-zinc-500">
                                    <span className="flex items-center gap-1">
                                      <Mail className="h-3 w-3" />
                                      {client.email}
                                    </span>
                                    {client.phone && (
                                      <span className="flex items-center gap-1">
                                        <Phone className="h-3 w-3" />
                                        {client.phone}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-medium text-white">
                                  {formatCurrency(client.totalRevenue || 0)}
                                </p>
                                <p className="text-xs text-zinc-500">
                                  {client.totalTransactions || 0} achat{(client.totalTransactions || 0) > 1 ? 's' : ''}
                                </p>
                              </div>
                              <ArrowUpRight className="h-4 w-4 text-zinc-600 group-hover:text-violet-400 transition-colors ml-2" />
                            </motion.div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Search className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
                        <p className="text-zinc-500">Aucun client trouvé pour "{searchQuery}"</p>
                        <p className="text-xs text-zinc-600 mt-1">
                          Essayez un autre terme de recherche
                        </p>
                      </div>
                    )
                  ) : (
                    <div className="text-center py-12 text-zinc-600">
                      <Search className="h-8 w-8 mx-auto mb-3 opacity-50" />
                      <p>Commencez à taper pour rechercher...</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading state */}
            {loading && (
              <div className="absolute inset-0 bg-zinc-950/80 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-violet-400 animate-spin" />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>,
    document.body
  );
}

export default ClientsModal;
