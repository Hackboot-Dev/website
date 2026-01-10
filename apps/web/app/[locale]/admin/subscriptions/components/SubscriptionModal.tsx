// /workspaces/website/apps/web/app/[locale]/admin/subscriptions/components/SubscriptionModal.tsx
// Description: Modal for creating a new subscription
// Last modified: 2025-12-19

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Search, Loader2, User, CreditCard } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useSubscriptions } from '../hooks';
import type { SubscriptionPlan, BillingPeriod } from '../types';

type Client = {
  id: string;
  name: string;
  email: string;
  company?: string;
};

type SubscriptionModalProps = {
  plans: SubscriptionPlan[];
  onClose: () => void;
  onSuccess: () => void;
};

export default function SubscriptionModal({ plans, onClose, onSuccess }: SubscriptionModalProps) {
  const { createSubscription } = useSubscriptions('vmcloud');

  const [step, setStep] = useState<'client' | 'plan' | 'details'>('client');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Client selection
  const [clients, setClients] = useState<Client[]>([]);
  const [clientSearch, setClientSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [loadingClients, setLoadingClients] = useState(false);

  // Plan selection
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  // Details
  const [customPrice, setCustomPrice] = useState<number | null>(null);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  // Search clients
  useEffect(() => {
    const searchClients = async () => {
      if (clientSearch.length < 2) {
        setClients([]);
        return;
      }

      setLoadingClients(true);
      const { data, error } = await supabase
        .from('clients')
        .select('id, name, email, company')
        .eq('company_id', 'vmcloud')
        .or(`name.ilike.%${clientSearch}%,email.ilike.%${clientSearch}%,company.ilike.%${clientSearch}%`)
        .limit(10);

      if (!error && data) {
        setClients(data);
      }
      setLoadingClients(false);
    };

    const debounce = setTimeout(searchClients, 300);
    return () => clearTimeout(debounce);
  }, [clientSearch]);

  // Calculate period end
  const calculatePeriodEnd = () => {
    const start = new Date(startDate);
    switch (billingPeriod) {
      case 'monthly':
        start.setMonth(start.getMonth() + 1);
        break;
      case 'quarterly':
        start.setMonth(start.getMonth() + 3);
        break;
      case 'yearly':
        start.setFullYear(start.getFullYear() + 1);
        break;
    }
    return start.toISOString();
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!selectedClient || !selectedPlan) return;

    setLoading(true);
    setError(null);

    try {
      const price = customPrice ?? selectedPlan.price;

      await createSubscription({
        companyId: 'vmcloud',
        clientId: selectedClient.id,
        planId: selectedPlan.id,
        status: 'active',
        startedAt: new Date(startDate).toISOString(),
        currentPeriodEnd: calculatePeriodEnd(),
        price,
        billingPeriod,
        discountPercent,
        notes: notes || undefined,
      });

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  const finalPrice = customPrice ?? (selectedPlan?.price || 0);
  const discountedPrice = finalPrice * (1 - discountPercent / 100);

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
        className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <h2 className="text-lg font-medium text-white">Nouvel abonnement</h2>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Steps indicator */}
        <div className="flex border-b border-zinc-800">
          {['client', 'plan', 'details'].map((s, i) => (
            <button
              key={s}
              onClick={() => {
                if (s === 'client') setStep('client');
                else if (s === 'plan' && selectedClient) setStep('plan');
                else if (s === 'details' && selectedClient && selectedPlan) setStep('details');
              }}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                step === s
                  ? 'text-white border-b-2 border-white'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {i + 1}. {s === 'client' ? 'Client' : s === 'plan' ? 'Plan' : 'Détails'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Step 1: Client Selection */}
          {step === 'client' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Rechercher un client..."
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                  autoFocus
                />
              </div>

              {loadingClients && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
                </div>
              )}

              {!loadingClients && clients.length > 0 && (
                <div className="space-y-2">
                  {clients.map((client) => (
                    <button
                      key={client.id}
                      onClick={() => {
                        setSelectedClient(client);
                        setStep('plan');
                      }}
                      className={`w-full flex items-center gap-3 p-3 border transition-colors ${
                        selectedClient?.id === client.id
                          ? 'border-white bg-white/5'
                          : 'border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-zinc-500" />
                      </div>
                      <div className="text-left">
                        <p className="text-white font-medium">{client.name}</p>
                        <p className="text-xs text-zinc-500">{client.email}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {!loadingClients && clientSearch.length >= 2 && clients.length === 0 && (
                <p className="text-center text-zinc-500 py-8">Aucun client trouvé</p>
              )}

              {!loadingClients && clientSearch.length < 2 && (
                <p className="text-center text-zinc-500 py-8">
                  Tapez au moins 2 caractères pour rechercher
                </p>
              )}
            </div>
          )}

          {/* Step 2: Plan Selection */}
          {step === 'plan' && (
            <div className="space-y-4">
              <div className="p-3 bg-zinc-800/50 border border-zinc-700 flex items-center gap-3">
                <User className="h-5 w-5 text-zinc-500" />
                <div>
                  <p className="text-white text-sm">{selectedClient?.name}</p>
                  <p className="text-xs text-zinc-500">{selectedClient?.email}</p>
                </div>
              </div>

              <div className="grid gap-3">
                {plans.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => {
                      setSelectedPlan(plan);
                      setCustomPrice(null);
                      setBillingPeriod(plan.billingPeriod);
                      setStep('details');
                    }}
                    className={`p-4 border text-left transition-colors ${
                      selectedPlan?.id === plan.id
                        ? 'border-white bg-white/5'
                        : 'border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-white font-medium">{plan.name}</p>
                        <p className="text-sm text-zinc-500 mt-1">{plan.description}</p>
                        {plan.features.length > 0 && (
                          <ul className="mt-2 space-y-1">
                            {plan.features.slice(0, 3).map((feature, i) => (
                              <li key={i} className="text-xs text-zinc-400">
                                • {feature}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xl text-white font-light">
                          {plan.price.toFixed(2)}€
                        </p>
                        <p className="text-xs text-zinc-500">/{plan.billingPeriod === 'monthly' ? 'mois' : plan.billingPeriod === 'yearly' ? 'an' : 'trimestre'}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Details */}
          {step === 'details' && (
            <div className="space-y-6">
              <div className="p-3 bg-zinc-800/50 border border-zinc-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-zinc-500" />
                  <div>
                    <p className="text-white text-sm">{selectedClient?.name}</p>
                    <p className="text-xs text-zinc-500">{selectedPlan?.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white">{selectedPlan?.price.toFixed(2)}€</p>
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  Prix personnalisé (optionnel)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    placeholder={selectedPlan?.price.toFixed(2)}
                    value={customPrice ?? ''}
                    onChange={(e) => setCustomPrice(e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">€</span>
                </div>
              </div>

              {/* Discount */}
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Remise (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value))}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-zinc-600"
                />
              </div>

              {/* Billing period */}
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Période de facturation</label>
                <select
                  value={billingPeriod}
                  onChange={(e) => setBillingPeriod(e.target.value as BillingPeriod)}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-zinc-600"
                >
                  <option value="monthly">Mensuel</option>
                  <option value="quarterly">Trimestriel</option>
                  <option value="yearly">Annuel</option>
                </select>
              </div>

              {/* Start date */}
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Date de début</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-zinc-600"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Notes (optionnel)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 resize-none"
                  placeholder="Notes internes..."
                />
              </div>

              {/* Summary */}
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Prix final</span>
                  <span className="text-xl text-emerald-400 font-medium">
                    {discountedPrice.toFixed(2)}€
                    <span className="text-sm text-zinc-500">/{billingPeriod === 'monthly' ? 'mois' : billingPeriod === 'yearly' ? 'an' : 'trim.'}</span>
                  </span>
                </div>
                {discountPercent > 0 && (
                  <p className="text-xs text-emerald-400 mt-1">
                    Remise de {discountPercent}% appliquée
                  </p>
                )}
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800">
          <button
            onClick={() => {
              if (step === 'plan') setStep('client');
              else if (step === 'details') setStep('plan');
              else onClose();
            }}
            className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            {step === 'client' ? 'Annuler' : 'Retour'}
          </button>

          {step === 'details' && (
            <button
              onClick={handleSubmit}
              disabled={loading || !selectedClient || !selectedPlan}
              className="flex items-center gap-2 px-6 py-2 text-sm bg-white text-zinc-900 hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CreditCard className="h-4 w-4" />
              )}
              Créer l'abonnement
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
