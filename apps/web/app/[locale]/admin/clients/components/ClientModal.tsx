// apps/web/app/[locale]/admin/clients/components/ClientModal.tsx
// Description: Client create/edit/view modal component
// Last modified: 2025-12-19

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Loader2, Check, Tag } from 'lucide-react';
import type { Client, CreateClient, ClientStatus, ClientType, ModalMode } from '../types';
import { formatCurrency } from '../../_shared/utils';

type ClientModalProps = {
  mode: ModalMode;
  client: Client | null;
  onClose: () => void;
  onSave: (data: CreateClient) => void;
  saving: boolean;
};

export function ClientModal({
  mode,
  client,
  onClose,
  onSave,
  saving,
}: ClientModalProps) {
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

  if (!mode) return null;

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
