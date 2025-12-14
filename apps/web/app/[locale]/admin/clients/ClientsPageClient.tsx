// /workspaces/website/apps/web/app/[locale]/admin/clients/ClientsPageClient.tsx
// Description: Clients management page with CRUD operations - VMCloud only - Mobile-first responsive
// Last modified: 2025-12-14
// Related docs: /docs/features/CLIENTS_MODULE.md

// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Users,
  Building2,
  Mail,
  Phone,
  MoreVertical,
  Edit3,
  Trash2,
  Eye,
  X,
  Check,
  Loader2,
  Sparkles,
  TrendingUp,
  DollarSign,
  Calendar,
  RefreshCw,
  ChevronDown,
  Tag,
  AlertCircle,
  UserPlus,
} from 'lucide-react';
import { getDatabase } from '../../../../lib/services/database';
import type {
  Client,
  CreateClient,
  ClientStatus,
  ClientType,
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
  individual: { label: 'Particulier', icon: Users },
  business: { label: 'Entreprise', icon: Building2 },
  enterprise: { label: 'Grand Compte', icon: Building2 },
};

// ============================================================
// TYPES
// ============================================================

type ViewMode = 'list' | 'grid';
type ModalMode = 'create' | 'edit' | 'view' | null;

// ============================================================
// COMPONENTS
// ============================================================

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: typeof Users;
  color: string;
}) {
  return (
    <div className="p-3 md:p-5 bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800 transition-all rounded-xl md:rounded-none active:scale-[0.98]">
      <div className="flex items-center justify-between mb-2 md:mb-3">
        <div className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border bg-zinc-900/50 rounded-lg ${color}`}>
          <Icon className="h-4 w-4 md:h-5 md:w-5" />
        </div>
      </div>
      <p className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-wider mb-0.5 md:mb-1 truncate">{label}</p>
      <p className="text-lg md:text-2xl font-extralight text-white truncate">{value}</p>
    </div>
  );
}

function ClientRow({
  client,
  onEdit,
  onView,
  onDelete,
}: {
  client: Client;
  onEdit: () => void;
  onView: () => void;
  onDelete: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const statusConfig = STATUS_CONFIG[client.status];
  const typeConfig = TYPE_CONFIG[client.type];
  const TypeIcon = typeConfig.icon;

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="group border-b border-zinc-900 hover:bg-zinc-900/30 transition-colors"
    >
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400">
            <TypeIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium text-white">{client.name}</p>
            {client.company && client.company !== client.name && (
              <p className="text-xs text-zinc-500">{client.company}</p>
            )}
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Mail className="h-3.5 w-3.5" />
            {client.email}
          </div>
          {client.phone && (
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <Phone className="h-3.5 w-3.5" />
              {client.phone}
            </div>
          )}
        </div>
      </td>
      <td className="px-4 py-4">
        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium border ${statusConfig.bgColor} ${statusConfig.color}`}>
          {statusConfig.label}
        </span>
      </td>
      <td className="px-4 py-4">
        <span className="text-sm text-zinc-400">{typeConfig.label}</span>
      </td>
      <td className="px-4 py-4">
        <span className="text-white font-medium">
          {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(client.totalRevenue || 0)}
        </span>
      </td>
      <td className="px-4 py-4">
        <span className="text-zinc-400">{client.totalTransactions || 0}</span>
      </td>
      <td className="px-4 py-4">
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 top-full mt-1 w-40 bg-zinc-900 border border-zinc-800 shadow-xl z-20"
                >
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onView();
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-zinc-300 hover:bg-zinc-800 flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Voir détails
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit();
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-zinc-300 hover:bg-zinc-800 flex items-center gap-2"
                  >
                    <Edit3 className="h-4 w-4" />
                    Modifier
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete();
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-zinc-800 flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Supprimer
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </td>
    </motion.tr>
  );
}

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
    if (!isViewMode) {
      onSave(formData);
    }
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
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm md:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full md:max-w-2xl bg-zinc-950 border-t md:border border-zinc-800 max-h-[85vh] md:max-h-[90vh] overflow-y-auto rounded-t-2xl md:rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Sticky on mobile */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-zinc-800 bg-zinc-950">
          <h2 className="text-lg md:text-xl font-light text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors rounded-lg active:scale-95"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Basic Info */}
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

          {/* Tags */}
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags?.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-zinc-800 border border-zinc-700 text-sm text-zinc-300"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                  {!isViewMode && (
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-zinc-500 hover:text-red-400"
                    >
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
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-zinc-800 border border-zinc-700 text-white hover:bg-zinc-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Notes */}
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

          {/* Client Stats (view mode only) */}
          {isViewMode && client && (
            <div className="pt-4 border-t border-zinc-800">
              <h3 className="text-sm text-zinc-400 mb-4">Statistiques</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-zinc-900/50 border border-zinc-800">
                  <p className="text-xs text-zinc-500 mb-1">CA Total</p>
                  <p className="text-lg font-light text-white">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(client.totalRevenue || 0)}
                  </p>
                </div>
                <div className="p-3 bg-zinc-900/50 border border-zinc-800">
                  <p className="text-xs text-zinc-500 mb-1">Transactions</p>
                  <p className="text-lg font-light text-white">{client.totalTransactions || 0}</p>
                </div>
                <div className="p-3 bg-zinc-900/50 border border-zinc-800">
                  <p className="text-xs text-zinc-500 mb-1">Premier achat</p>
                  <p className="text-lg font-light text-white">
                    {client.firstPurchaseAt
                      ? new Date(client.firstPurchaseAt).toLocaleDateString('fr-FR')
                      : '—'}
                  </p>
                </div>
                <div className="p-3 bg-zinc-900/50 border border-zinc-800">
                  <p className="text-xs text-zinc-500 mb-1">Dernier achat</p>
                  <p className="text-lg font-light text-white">
                    {client.lastPurchaseAt
                      ? new Date(client.lastPurchaseAt).toLocaleDateString('fr-FR')
                      : '—'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions - Sticky on mobile */}
          <div className="sticky bottom-0 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4 pb-safe border-t border-zinc-800 bg-zinc-950 -mx-4 md:mx-0 px-4 md:px-0">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 sm:py-2.5 text-sm font-medium text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 transition-colors rounded-xl sm:rounded-none active:scale-[0.98]"
            >
              {isViewMode ? 'Fermer' : 'Annuler'}
            </button>
            {!isViewMode && (
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 sm:py-2.5 text-sm font-medium bg-white text-black hover:bg-zinc-200 disabled:opacity-50 transition-colors rounded-xl sm:rounded-none active:scale-[0.98]"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    {mode === 'create' ? 'Créer' : 'Enregistrer'}
                  </>
                )}
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

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ClientStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<ClientType | 'all'>('all');

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [saving, setSaving] = useState(false);

  const [syncing, setSyncing] = useState(false);

  // Load clients
  const loadClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await db.getClients({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        type: typeFilter !== 'all' ? typeFilter : undefined,
        search: searchQuery || undefined,
      });

      setClients(data);
    } catch (err) {
      console.error('Error loading clients:', err);
      setError('Erreur lors du chargement des clients');
    } finally {
      setLoading(false);
    }
  }, [db, statusFilter, typeFilter, searchQuery]);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

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
    if (confirm(`Supprimer le client "${client.name}" ? Cette action est irréversible.`)) {
      try {
        await db.deleteClient(client.id);
        await loadClients();
      } catch (err) {
        console.error('Error deleting client:', err);
        alert('Erreur lors de la suppression');
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
      await loadClients();
    } catch (err) {
      console.error('Error saving client:', err);
      alert('Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    await loadClients();
    setSyncing(false);
  };

  // Stats
  const stats = {
    total: clients.length,
    active: clients.filter((c) => c.status === 'active').length,
    leads: clients.filter((c) => c.status === 'lead').length,
    totalRevenue: clients.reduce((sum, c) => sum + (c.totalRevenue || 0), 0),
  };

  // Filtered clients (client-side search for better UX)
  const filteredClients = clients.filter((client) => {
    if (searchQuery) {
      const search = searchQuery.toLowerCase();
      return (
        client.name.toLowerCase().includes(search) ||
        client.email.toLowerCase().includes(search) ||
        client.company?.toLowerCase().includes(search)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4 md:space-y-8">
      {/* Header - Compact on mobile */}
      <div className="space-y-2 md:space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-2.5 md:px-3 py-1 rounded-full bg-zinc-900/50 border border-zinc-800 text-[10px] md:text-xs uppercase tracking-[0.2em] text-zinc-400"
        >
          <Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5" />
          CRM
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl sm:text-3xl md:text-4xl font-extralight tracking-tight text-white"
        >
          Clients
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm md:text-base text-zinc-500 font-light"
        >
          VMCloud — Gestion des clients et prospects
        </motion.p>
      </div>

      {/* Stats - 2 columns grid on mobile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4"
      >
        <StatCard
          label="Total Clients"
          value={stats.total}
          icon={Users}
          color="border-blue-900/30 text-blue-500"
        />
        <StatCard
          label="Clients Actifs"
          value={stats.active}
          icon={Check}
          color="border-emerald-900/30 text-emerald-500"
        />
        <StatCard
          label="Leads"
          value={stats.leads}
          icon={UserPlus}
          color="border-amber-900/30 text-amber-500"
        />
        <StatCard
          label="CA Total"
          value={new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(stats.totalRevenue)}
          icon={DollarSign}
          color="border-violet-900/30 text-violet-500"
        />
      </motion.div>

      {/* Actions Bar - Stack on mobile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col gap-3 md:gap-4"
      >
        {/* Search - Full width on mobile */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un client..."
            className="w-full pl-10 pr-4 py-3 md:py-2.5 bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:border-zinc-700 focus:outline-none rounded-xl md:rounded-none text-sm"
          />
        </div>

        {/* Filters and Actions Row */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="flex gap-2 flex-1 overflow-x-auto pb-1 sm:pb-0">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ClientStatus | 'all')}
              className="flex-shrink-0 px-3 md:px-4 py-2.5 bg-zinc-900 border border-zinc-800 text-white text-sm focus:border-zinc-700 focus:outline-none rounded-xl md:rounded-none"
            >
              <option value="all">Tous statuts</option>
              <option value="lead">Leads</option>
              <option value="active">Actifs</option>
              <option value="inactive">Inactifs</option>
              <option value="churned">Churned</option>
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as ClientType | 'all')}
              className="flex-shrink-0 px-3 md:px-4 py-2.5 bg-zinc-900 border border-zinc-800 text-white text-sm focus:border-zinc-700 focus:outline-none rounded-xl md:rounded-none"
            >
              <option value="all">Tous types</option>
              <option value="individual">Particuliers</option>
              <option value="business">Entreprises</option>
              <option value="enterprise">Grands Comptes</option>
            </select>
          </div>

          <div className="flex gap-2">
            {/* Sync Button */}
            <button
              onClick={handleSync}
              disabled={syncing}
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 disabled:opacity-50 transition-colors rounded-xl md:rounded-none active:scale-95"
            >
              <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sync</span>
            </button>

            {/* Create Button */}
            <button
              onClick={handleCreate}
              className="flex items-center justify-center gap-2 flex-1 sm:flex-none px-4 sm:px-5 py-2.5 text-sm font-medium bg-white text-black hover:bg-zinc-200 transition-colors rounded-xl md:rounded-none active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden xs:inline">Nouveau</span>
              <span className="hidden sm:inline">Client</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Content - Better scroll on mobile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-zinc-900/20 border border-zinc-900 rounded-xl md:rounded-none -mx-4 md:mx-0"
      >
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
            <AlertCircle className="h-12 w-12 mb-4" />
            <p>{error}</p>
            <button
              onClick={loadClients}
              className="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm transition-colors"
            >
              Réessayer
            </button>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
            <Users className="h-12 w-12 mb-4" />
            <p className="text-lg">Aucun client trouvé</p>
            <p className="text-sm mt-1">
              {searchQuery ? 'Essayez une autre recherche' : 'Créez votre premier client'}
            </p>
            {!searchQuery && (
              <button
                onClick={handleCreate}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-zinc-200 text-sm transition-colors"
              >
                <Plus className="h-4 w-4" />
                Nouveau Client
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    CA Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Transactions
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredClients.map((client) => (
                    <ClientRow
                      key={client.id}
                      client={client}
                      onEdit={() => handleEdit(client)}
                      onView={() => handleView(client)}
                      onDelete={() => handleDelete(client)}
                    />
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
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
