// /workspaces/website/apps/web/app/[locale]/admin/clients/ClientsPageClient.tsx
// Description: Clients page with animated search and stats-first interface
// Last modified: 2025-12-16

'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Users,
  Building2,
  Mail,
  Phone,
  Loader2,
  Sparkles,
  TrendingUp,
  Calendar,
  Star,
  User,
  ArrowUpRight,
  ShoppingBag,
  X,
  Plus,
  Edit3,
  Trash2,
  Eye,
  Check,
  Tag,
  MoreVertical,
} from 'lucide-react';
import { getDatabase } from '../../../../lib/services/database';
import type {
  Client,
  CreateClient,
  ClientStatus,
  ClientType,
  AggregatedClientStats,
} from '../../../../lib/types/database';

// ============================================================
// CONSTANTS
// ============================================================

const STATUS_CONFIG: Record<ClientStatus, { label: string; color: string; bgColor: string }> = {
  lead: { label: 'Lead', color: 'text-blue-400', bgColor: 'bg-blue-500/10 border-blue-500/30' },
  active: { label: 'Actif', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10 border-emerald-500/30' },
  inactive: { label: 'Inactif', color: 'text-zinc-400', bgColor: 'bg-zinc-500/10 border-zinc-500/30' },
  churned: { label: 'Churned', color: 'text-red-400', bgColor: 'bg-red-500/10 border-red-500/30' },
};

const TYPE_CONFIG: Record<ClientType, { label: string; icon: typeof Users }> = {
  individual: { label: 'Particulier', icon: User },
  business: { label: 'Entreprise', icon: Building2 },
  enterprise: { label: 'Grand Compte', icon: Building2 },
};

// ============================================================
// TYPES
// ============================================================

type ModalMode = 'create' | 'edit' | 'view' | null;

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

// ============================================================
// CLIENT MODAL COMPONENT
// ============================================================

function ClientModal({
  mode,
  client,
  onClose,
  onSave,
  saving,
}: {
  mode: ModalMode;
  client: Client | null;
  onClose: () => void;
  onSave: (data: CreateClient) => void;
  saving: boolean;
}) {
  const [formData, setFormData] = useState<CreateClient>({
    companyId: client?.companyId || 'vmcloud',
    name: client?.name || '',
    email: client?.email || '',
    phone: client?.phone || '',
    company: client?.company || '',
    type: client?.type || 'individual',
    status: client?.status || 'lead',
    currency: client?.currency || 'EUR',
    notes: client?.notes || '',
    tags: client?.tags || [],
  });

  const [newTag, setNewTag] = useState('');
  const isViewMode = mode === 'view';
  const title = mode === 'create' ? 'Nouveau Client' : mode === 'edit' ? 'Modifier Client' : 'Détails Client';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isViewMode) onSave(formData);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData({ ...formData, tags: [...(formData.tags || []), newTag.trim()] });
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags?.filter((t) => t !== tag) });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <h2 className="text-xl font-light text-white">{title}</h2>
          <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm text-zinc-400 mb-2">Nom *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={isViewMode}
                required
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:border-zinc-700 focus:outline-none disabled:opacity-60"
                placeholder="John Doe"
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm text-zinc-400 mb-2">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={isViewMode}
                required
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:border-zinc-700 focus:outline-none disabled:opacity-60"
                placeholder="john@company.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Téléphone</label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={isViewMode}
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:border-zinc-700 focus:outline-none disabled:opacity-60"
                placeholder="+33 6 12 34 56 78"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Société</label>
              <input
                type="text"
                value={formData.company || ''}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                disabled={isViewMode}
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:border-zinc-700 focus:outline-none disabled:opacity-60"
                placeholder="Company SAS"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as ClientType })}
                disabled={isViewMode}
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 text-white focus:border-zinc-700 focus:outline-none disabled:opacity-60"
              >
                <option value="individual">Particulier</option>
                <option value="business">Entreprise</option>
                <option value="enterprise">Grand Compte</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Statut</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ClientStatus })}
                disabled={isViewMode}
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 text-white focus:border-zinc-700 focus:outline-none disabled:opacity-60"
              >
                <option value="lead">Lead</option>
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
                <option value="churned">Churned</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags?.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-zinc-800 border border-zinc-700 text-sm text-zinc-300">
                  <Tag className="h-3 w-3" />
                  {tag}
                  {!isViewMode && (
                    <button type="button" onClick={() => removeTag(tag)} className="ml-1 text-zinc-500 hover:text-red-400">
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
            {!isViewMode && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-4 py-2 bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:border-zinc-700 focus:outline-none text-sm"
                  placeholder="Ajouter un tag..."
                />
                <button type="button" onClick={addTag} className="px-4 py-2 bg-zinc-800 border border-zinc-700 text-white hover:bg-zinc-700 transition-colors">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Notes internes</label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              disabled={isViewMode}
              rows={3}
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:border-zinc-700 focus:outline-none disabled:opacity-60 resize-none"
              placeholder="Notes sur ce client..."
            />
          </div>

          {isViewMode && client && (
            <div className="pt-4 border-t border-zinc-800">
              <h3 className="text-sm text-zinc-400 mb-4">Statistiques</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-zinc-900/50 border border-zinc-800">
                  <p className="text-xs text-zinc-500 mb-1">CA Total</p>
                  <p className="text-lg font-light text-white">{formatCurrency(client.totalRevenue || 0)}</p>
                </div>
                <div className="p-3 bg-zinc-900/50 border border-zinc-800">
                  <p className="text-xs text-zinc-500 mb-1">Transactions</p>
                  <p className="text-lg font-light text-white">{client.totalTransactions || 0}</p>
                </div>
                <div className="p-3 bg-zinc-900/50 border border-zinc-800">
                  <p className="text-xs text-zinc-500 mb-1">Premier achat</p>
                  <p className="text-lg font-light text-white">
                    {client.firstPurchaseAt ? new Date(client.firstPurchaseAt).toLocaleDateString('fr-FR') : '—'}
                  </p>
                </div>
                <div className="p-3 bg-zinc-900/50 border border-zinc-800">
                  <p className="text-xs text-zinc-500 mb-1">Dernier achat</p>
                  <p className="text-lg font-light text-white">
                    {client.lastPurchaseAt ? new Date(client.lastPurchaseAt).toLocaleDateString('fr-FR') : '—'}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-medium text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 transition-colors">
              {isViewMode ? 'Fermer' : 'Annuler'}
            </button>
            {!isViewMode && (
              <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium bg-white text-black hover:bg-zinc-200 disabled:opacity-50 transition-colors">
                {saving ? <><Loader2 className="h-4 w-4 animate-spin" />Enregistrement...</> : <><Check className="h-4 w-4" />{mode === 'create' ? 'Créer' : 'Enregistrer'}</>}
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function ClientsPageClient() {
  const db = getDatabase('vmcloud');

  // Stats pré-calculées (temps réel avec PostgreSQL)
  const [stats, setStats] = useState<AggregatedClientStats | null>(null);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Client[]>([]);
  const [searching, setSearching] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Recent clients list (loaded by default)
  const [recentClients, setRecentClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [saving, setSaving] = useState(false);

  // Load stats (temps réel avec PostgreSQL - pas de cache)
  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      const data = await db.getAggregatedClientStats();
      setStats(data);
    } catch (err) {
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  }, [db]);

  // Load recent clients (derniers 20 clients)
  const loadRecentClients = useCallback(async () => {
    try {
      setLoadingClients(true);
      const clients = await db.getClients({ limitCount: 20 });
      setRecentClients(clients);
    } catch (err) {
      console.error('Error loading recent clients:', err);
    } finally {
      setLoadingClients(false);
    }
  }, [db]);

  useEffect(() => {
    loadStats();
    loadRecentClients();
  }, [loadStats, loadRecentClients]);

  // Search with debounce (only queries when user types)
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await db.searchClients(searchQuery, 10);
        setSearchResults(results);
      } catch (err) {
        console.error('Error searching:', err);
      } finally {
        setSearching(false);
      }
    }, 300); // Debounce 300ms

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, db]);

  // Handlers
  const handleCreate = () => {
    setSelectedClient(null);
    setModalMode('create');
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setModalMode('edit');
  };

  const handleView = (client: Client) => {
    setSelectedClient(client);
    setModalMode('view');
  };

  const handleDelete = async (client: Client) => {
    if (confirm(`Supprimer le client "${client.name}" ?`)) {
      try {
        await db.deleteClient(client.id);
        // Refresh data
        await Promise.all([loadStats(), loadRecentClients()]);
        // Refresh search results if needed
        if (searchQuery) {
          const results = await db.searchClients(searchQuery, 10);
          setSearchResults(results);
        }
      } catch (err) {
        console.error('Error deleting client:', err);
      }
    }
  };

  const handleSave = async (data: CreateClient) => {
    try {
      setSaving(true);
      if (modalMode === 'create') {
        await db.createClient(data);
      } else if (modalMode === 'edit' && selectedClient) {
        await db.updateClient(selectedClient.id, data);
      }
      setModalMode(null);
      setSelectedClient(null);
      // Refresh data
      await Promise.all([loadStats(), loadRecentClients()]);
    } catch (err) {
      console.error('Error saving client:', err);
    } finally {
      setSaving(false);
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isSearchFocused && searchQuery) {
          setSearchQuery('');
          setIsSearchFocused(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchFocused, searchQuery]);

  const showStats = !isSearchFocused && !searchQuery;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="space-y-4 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/50 border border-zinc-800 text-xs uppercase tracking-[0.2em] text-zinc-400"
        >
          <Sparkles className="w-3.5 h-3.5" />
          CRM
        </motion.div>
        <div className="flex items-center justify-between">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-extralight tracking-tight text-white"
            >
              Clients
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-zinc-500 font-light mt-1"
            >
              {stats?.total ?? 0} client{(stats?.total ?? 0) > 1 ? 's' : ''} enregistré{(stats?.total ?? 0) > 1 ? 's' : ''}
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-white text-black hover:bg-zinc-200 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Nouveau
            </button>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-zinc-900/20 border border-zinc-900 p-8 md:p-12"
      >
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
          </div>
        ) : (
          <>
            {/* Search Bar */}
            <motion.div
              layout
              className={`relative mx-auto transition-all duration-300 ${
                isSearchFocused || searchQuery ? 'w-full' : 'w-full md:w-2/3'
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
                <Search className={`h-5 w-5 ml-4 transition-colors ${isSearchFocused ? 'text-violet-400' : 'text-zinc-500'}`} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => !searchQuery && setIsSearchFocused(false)}
                  placeholder="Rechercher un client par nom, email, entreprise..."
                  className={`flex-1 bg-transparent border-none outline-none text-white placeholder-zinc-500 transition-all duration-300 ${
                    isSearchFocused ? 'py-5 px-4 text-lg' : 'py-4 px-3'
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
                    className="absolute left-0 right-0 text-center text-xs text-zinc-500 mt-3"
                  >
                    Tapez pour rechercher • Échap pour annuler
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Stats Grid */}
            <AnimatePresence>
              {showStats && stats && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-10"
                >
                  {/* Main Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-zinc-900/50 border border-zinc-800 p-5 text-center">
                      <Users className="h-6 w-6 text-violet-400 mx-auto mb-3" />
                      <p className="text-3xl font-light text-white">{stats.total}</p>
                      <p className="text-xs text-zinc-500 mt-1">Total clients</p>
                    </div>
                    <div className="bg-zinc-900/50 border border-zinc-800 p-5 text-center">
                      <TrendingUp className="h-6 w-6 text-emerald-400 mx-auto mb-3" />
                      <p className="text-3xl font-light text-emerald-400">{formatCurrency(stats.totalRevenue)}</p>
                      <p className="text-xs text-zinc-500 mt-1">Revenu total</p>
                    </div>
                    <div className="bg-zinc-900/50 border border-zinc-800 p-5 text-center">
                      <ShoppingBag className="h-6 w-6 text-blue-400 mx-auto mb-3" />
                      <p className="text-3xl font-light text-white">{formatCurrency(stats.avgRevenue)}</p>
                      <p className="text-xs text-zinc-500 mt-1">Revenu moyen</p>
                    </div>
                    <div className="bg-zinc-900/50 border border-zinc-800 p-5 text-center">
                      <Calendar className="h-6 w-6 text-amber-400 mx-auto mb-3" />
                      <p className="text-3xl font-light text-white">{stats.newThisMonth}</p>
                      <p className="text-xs text-zinc-500 mt-1">Nouveaux ce mois</p>
                    </div>
                  </div>

                  {/* Secondary Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-zinc-900/30 border border-zinc-800/50 p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-zinc-500" />
                        <span className="text-zinc-400">Entreprises</span>
                      </div>
                      <span className="text-xl font-light text-white">{stats.business}</span>
                    </div>
                    <div className="bg-zinc-900/30 border border-zinc-800/50 p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-zinc-500" />
                        <span className="text-zinc-400">Particuliers</span>
                      </div>
                      <span className="text-xl font-light text-white">{stats.individual}</span>
                    </div>
                  </div>

                  {/* Top Client */}
                  {stats.topClient && (
                    <div
                      className="bg-gradient-to-r from-violet-500/10 to-transparent border border-violet-500/30 p-5 cursor-pointer hover:border-violet-500/50 transition-colors"
                      onClick={async () => {
                        // Load full client data for viewing
                        const fullClient = await db.getClient(stats.topClient!.id);
                        if (fullClient) handleView(fullClient);
                      }}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <Star className="h-4 w-4 text-violet-400" />
                        <span className="text-sm text-violet-400 font-medium">Meilleur client</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            stats.topClient.type === 'business' || stats.topClient.type === 'enterprise'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-emerald-500/20 text-emerald-400'
                          }`}>
                            {stats.topClient.type === 'business' || stats.topClient.type === 'enterprise' ? (
                              <Building2 className="h-6 w-6" />
                            ) : (
                              <User className="h-6 w-6" />
                            )}
                          </div>
                          <div>
                            <p className="text-white font-medium text-lg">{stats.topClient.name}</p>
                            <p className="text-sm text-zinc-500">{stats.topClient.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-light text-emerald-400">
                            {formatCurrency(stats.topClient.totalRevenue || 0)}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {stats.topClient.totalTransactions || 0} transaction{(stats.topClient.totalTransactions || 0) > 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Recent Clients List */}
                  <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-zinc-400">Derniers clients</h3>
                      <span className="text-xs text-zinc-600">{recentClients.length} affichés</span>
                    </div>
                    {loadingClients ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
                      </div>
                    ) : recentClients.length > 0 ? (
                      <div className="space-y-2">
                        {recentClients.map((client) => {
                          const TypeIcon = TYPE_CONFIG[client.type].icon;
                          const statusConfig = STATUS_CONFIG[client.status];
                          return (
                            <motion.div
                              key={client.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="flex items-center justify-between p-3 bg-zinc-900/30 border border-zinc-800/50 hover:border-zinc-700 transition-colors group cursor-pointer"
                              onClick={() => handleView(client)}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  client.type === 'business' || client.type === 'enterprise'
                                    ? 'bg-blue-500/20 text-blue-400'
                                    : 'bg-emerald-500/20 text-emerald-400'
                                }`}>
                                  <TypeIcon className="h-4 w-4" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="text-white text-sm font-medium">{client.name}</p>
                                    <span className={`px-1.5 py-0.5 text-xs ${statusConfig.bgColor} ${statusConfig.color}`}>
                                      {statusConfig.label}
                                    </span>
                                  </div>
                                  <p className="text-xs text-zinc-500">{client.email}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="text-right">
                                  <p className="text-sm font-medium text-white">
                                    {formatCurrency(client.totalRevenue || 0)}
                                  </p>
                                  <p className="text-xs text-zinc-600">
                                    {client.totalTransactions || 0} achat{(client.totalTransactions || 0) > 1 ? 's' : ''}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleEdit(client); }}
                                    className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
                                    title="Modifier"
                                  >
                                    <Edit3 className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleDelete(client); }}
                                    className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors"
                                    title="Supprimer"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-center text-sm text-zinc-600 py-8">Aucun client</p>
                    )}
                  </div>
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
                  className="mt-8"
                >
                  {searchQuery ? (
                    searching ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-violet-400" />
                        <span className="ml-2 text-sm text-zinc-500">Recherche...</span>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-xs text-zinc-500 mb-4">
                          {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''} pour "{searchQuery}"
                        </p>
                        {searchResults.map((client) => {
                          const TypeIcon = TYPE_CONFIG[client.type].icon;
                          const statusConfig = STATUS_CONFIG[client.status];
                          return (
                            <motion.div
                              key={client.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors group"
                            >
                              <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                  client.type === 'business' || client.type === 'enterprise'
                                    ? 'bg-blue-500/20 text-blue-400'
                                    : 'bg-emerald-500/20 text-emerald-400'
                                }`}>
                                  <TypeIcon className="h-5 w-5" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="text-white font-medium">{client.name}</p>
                                    <span className={`px-2 py-0.5 text-xs ${statusConfig.bgColor} ${statusConfig.color}`}>
                                      {statusConfig.label}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
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
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <p className="text-lg font-medium text-white">
                                    {formatCurrency(client.totalRevenue || 0)}
                                  </p>
                                  <p className="text-xs text-zinc-500">
                                    {client.totalTransactions || 0} achat{(client.totalTransactions || 0) > 1 ? 's' : ''}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => handleView(client)}
                                    className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
                                    title="Voir"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleEdit(client)}
                                    className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
                                    title="Modifier"
                                  >
                                    <Edit3 className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(client)}
                                    className="p-2 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors"
                                    title="Supprimer"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <Search className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
                        <p className="text-zinc-500">Aucun client trouvé pour "{searchQuery}"</p>
                        <p className="text-xs text-zinc-600 mt-1">Essayez un autre terme de recherche</p>
                      </div>
                    )
                  ) : (
                    <div className="text-center py-16 text-zinc-600">
                      <Search className="h-8 w-8 mx-auto mb-3 opacity-50" />
                      <p>Commencez à taper pour rechercher...</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {modalMode && (
          <ClientModal
            mode={modalMode}
            client={selectedClient}
            onClose={() => {
              setModalMode(null);
              setSelectedClient(null);
            }}
            onSave={handleSave}
            saving={saving}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
