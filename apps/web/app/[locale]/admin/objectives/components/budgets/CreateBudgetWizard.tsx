// /workspaces/website/apps/web/app/[locale]/admin/objectives/components/budgets/CreateBudgetWizard.tsx
// Description: Modal for creating a new budget (simplified)
// Last modified: 2026-01-11
// COMPLETE FILE

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Wallet, Check } from 'lucide-react';
import type { BudgetCategory, CreateBudgetData } from '../../hooks/useBudgets';
import { BUDGET_CATEGORY_CONFIG } from '../../hooks/useBudgets';

type CreateBudgetWizardProps = {
  year: number;
  onClose: () => void;
  onCreate: (data: CreateBudgetData) => Promise<void>;
};

export function CreateBudgetWizard({ year, onClose, onCreate }: CreateBudgetWizardProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [category, setCategory] = useState<BudgetCategory>('other');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [totalAmount, setTotalAmount] = useState<string>('');

  const canCreate = name.trim() !== '' && Number(totalAmount) > 0;

  const handleCreate = async () => {
    if (!canCreate) return;

    setIsCreating(true);
    try {
      await onCreate({
        name: name.trim(),
        description: description.trim() || undefined,
        category,
        totalAmount: Number(totalAmount),
        year,
      });
    } finally {
      setIsCreating(false);
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const categoryEntries = Object.entries(BUDGET_CATEGORY_CONFIG) as [BudgetCategory, typeof BUDGET_CATEGORY_CONFIG[BudgetCategory]][];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Wallet className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Nouveau budget</h2>
              <p className="text-zinc-500 text-sm">Année {year}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-5 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Nom du budget
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Marketing Digital"
              className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
              autoFocus
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Montant annuel (€)
            </label>
            <input
              type="number"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              placeholder="50000"
              min={0}
              className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
            />
            {Number(totalAmount) > 0 && (
              <p className="text-zinc-500 text-xs mt-1">
                ≈ {formatCurrency(Number(totalAmount) / 12)}/mois
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Catégorie
            </label>
            <div className="grid grid-cols-5 gap-2">
              {categoryEntries.map(([key, config]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCategory(key)}
                  className={`
                    p-2 rounded-lg border text-center transition-all
                    ${category === key
                      ? 'bg-emerald-500/20 border-emerald-500/50'
                      : 'bg-zinc-800/50 border-zinc-700 hover:border-zinc-600'
                    }
                  `}
                  title={config.label}
                >
                  <div className={`w-6 h-6 mx-auto rounded ${config.bgColor} flex items-center justify-center`}>
                    <span className={`text-xs font-bold ${config.color}`}>
                      {config.label.charAt(0)}
                    </span>
                  </div>
                  <p className={`text-[10px] mt-1 truncate ${category === key ? 'text-white' : 'text-zinc-500'}`}>
                    {config.label}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Description <span className="text-zinc-500 font-normal">(optionnel)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez ce budget..."
              rows={2}
              className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-zinc-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleCreate}
            disabled={!canCreate || isCreating}
            className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white rounded-lg transition-colors"
          >
            {isCreating ? (
              <>
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Création...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Créer
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
