// /workspaces/website/apps/web/app/[locale]/admin/subscriptions/plans/page.tsx
// Description: Subscription plans management page
// Last modified: 2025-12-19

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ChevronLeft,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Loader2,
  Package,
  RefreshCw,
} from 'lucide-react';

import { useSubscriptions } from '../hooks';
import { formatBillingPeriod, type SubscriptionPlan, type BillingPeriod } from '../types';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};

export default function PlansPage() {
  const params = useParams();
  const locale = params.locale as string;

  const { plans, loading, createPlan, updatePlan, deletePlan, fetchPlans } = useSubscriptions('vmcloud');

  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    billingPeriod: 'monthly' as BillingPeriod,
    trialDays: 0,
    features: [] as string[],
  });
  const [newFeature, setNewFeature] = useState('');

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      billingPeriod: 'monthly',
      trialDays: 0,
      features: [],
    });
    setNewFeature('');
  };

  const startEdit = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description || '',
      price: plan.price,
      billingPeriod: plan.billingPeriod,
      trialDays: plan.trialDays,
      features: plan.features || [],
    });
    setIsCreating(false);
  };

  const startCreate = () => {
    resetForm();
    setEditingPlan(null);
    setIsCreating(true);
  };

  const cancelEdit = () => {
    setEditingPlan(null);
    setIsCreating(false);
    resetForm();
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isCreating) {
        await createPlan({
          companyId: 'vmcloud',
          name: formData.name,
          description: formData.description || undefined,
          price: formData.price,
          currency: 'EUR',
          billingPeriod: formData.billingPeriod,
          billingPeriodCount: 1,
          trialDays: formData.trialDays,
          features: formData.features,
          isActive: true,
          sortOrder: plans.length,
          metadata: {},
        });
      } else if (editingPlan) {
        await updatePlan(editingPlan.id, {
          name: formData.name,
          description: formData.description || undefined,
          price: formData.price,
          billingPeriod: formData.billingPeriod,
          trialDays: formData.trialDays,
          features: formData.features,
        });
      }
      cancelEdit();
    } catch (err) {
      console.error('Error saving plan:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce plan ?')) {
      await deletePlan(id);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href={`/${locale}/admin/subscriptions`}
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-4 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Retour aux abonnements
          </Link>
          <h1 className="text-3xl font-extralight text-white">Plans d'abonnement</h1>
          <p className="text-zinc-500 mt-1">{plans.length} plan{plans.length !== 1 ? 's' : ''} configuré{plans.length !== 1 ? 's' : ''}</p>
        </div>

        <button
          onClick={startCreate}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-white text-zinc-900 hover:bg-zinc-200 transition-all"
        >
          <Plus className="h-4 w-4" />
          Nouveau plan
        </button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingPlan) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-zinc-900/50 border border-zinc-800"
        >
          <h2 className="text-lg font-medium text-white mb-6">
            {isCreating ? 'Nouveau plan' : `Modifier "${editingPlan?.name}"`}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Nom du plan</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-zinc-600"
                placeholder="VPS Pro"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Prix</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData((prev) => ({ ...prev, price: Number(e.target.value) }))}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-zinc-600"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">€</span>
              </div>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Période de facturation</label>
              <select
                value={formData.billingPeriod}
                onChange={(e) => setFormData((prev) => ({ ...prev, billingPeriod: e.target.value as BillingPeriod }))}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-zinc-600"
              >
                <option value="monthly">Mensuel</option>
                <option value="quarterly">Trimestriel</option>
                <option value="yearly">Annuel</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Jours d'essai</label>
              <input
                type="number"
                value={formData.trialDays}
                onChange={(e) => setFormData((prev) => ({ ...prev, trialDays: Number(e.target.value) }))}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-zinc-600"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-zinc-400 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                rows={2}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-zinc-600 resize-none"
                placeholder="Description du plan..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-zinc-400 mb-2">Fonctionnalités</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-zinc-600"
                  placeholder="Ajouter une fonctionnalité..."
                />
                <button
                  onClick={addFeature}
                  className="px-4 py-2 bg-zinc-700 text-white hover:bg-zinc-600 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {formData.features.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-800 border border-zinc-700 text-sm text-zinc-300"
                    >
                      {feature}
                      <button onClick={() => removeFeature(i)} className="text-zinc-500 hover:text-white">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-zinc-800">
            <button
              onClick={cancelEdit}
              className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !formData.name || formData.price <= 0}
              className="flex items-center gap-2 px-6 py-2 text-sm bg-white text-zinc-900 hover:bg-zinc-200 disabled:opacity-50 transition-all"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              Enregistrer
            </button>
          </div>
        </motion.div>
      )}

      {/* Plans Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
        </div>
      ) : plans.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-500 mb-4">Aucun plan configuré</p>
          <button
            onClick={startCreate}
            className="px-4 py-2 text-sm bg-white text-zinc-900 hover:bg-zinc-200 transition-all"
          >
            Créer un plan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-white">{plan.name}</h3>
                  {plan.description && (
                    <p className="text-sm text-zinc-500 mt-1">{plan.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEdit(plan)}
                    className="p-2 text-zinc-500 hover:text-white transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(plan.id)}
                    className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <span className="text-3xl font-light text-white">{formatCurrency(plan.price)}</span>
                <span className="text-zinc-500">/{formatBillingPeriod(plan.billingPeriod).toLowerCase()}</span>
              </div>

              {plan.trialDays > 0 && (
                <p className="text-sm text-blue-400 mb-4">
                  {plan.trialDays} jours d'essai gratuit
                </p>
              )}

              {plan.features.length > 0 && (
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-zinc-400">
                      <Check className="h-4 w-4 text-emerald-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
