// /workspaces/website/apps/web/app/[locale]/admin/objectives/components/CreateObjectiveWizard.tsx
// Description: Step-by-step wizard for creating comprehensive objectives
// Last modified: 2026-01-10

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Target,
  Save,
  ChevronRight,
  ChevronLeft,
  DollarSign,
  Users,
  CreditCard,
  Package,
  AlertTriangle,
  Check,
  Info,
} from 'lucide-react';
import { Select } from '../../../../../components/ui/Select';
import type {
  ObjectiveCategory,
  ObjectiveType,
  ObjectivePeriod,
  ObjectivePriority,
  Objective,
  CoherenceCheckResult,
} from '../types';
import {
  OBJECTIVE_CATEGORY_LABELS,
  OBJECTIVE_CATEGORY_DESCRIPTIONS,
  OBJECTIVE_TYPE_LABELS,
  OBJECTIVE_TYPE_DESCRIPTIONS,
  OBJECTIVE_TYPE_BY_CATEGORY,
  OBJECTIVE_TYPE_UNITS,
  OBJECTIVE_PERIOD_LABELS,
  PRIORITY_CONFIG,
  MONTHS_FR,
  QUARTERS_FR,
  CLIENT_SEGMENTS,
  EXPENSE_CATEGORIES,
  formatObjectiveValue,
  requiresProductSelection,
  requiresCategorySelection,
  requiresClientSelection,
  requiresSegmentSelection,
  getCategoryForType,
} from '../types';
import { checkObjectivesCoherence } from '../utils/coherenceChecker';

const CATEGORY_ICONS: Record<ObjectiveCategory, typeof DollarSign> = {
  financial: DollarSign,
  clients: Users,
  subscriptions: CreditCard,
  products: Package,
};

type WizardStep = 'category' | 'type' | 'details' | 'target' | 'review';

type CreateObjectiveWizardProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Objective>) => Promise<void>;
  existingObjectives?: Objective[];
  products?: { id: string; name: string; categoryId?: string }[];
  productCategories?: { id: string; name: string }[];
  clients?: { id: string; name: string }[];
};

export function CreateObjectiveWizard({
  isOpen,
  onClose,
  onSubmit,
  existingObjectives = [],
  products = [],
  productCategories = [],
  clients = [],
}: CreateObjectiveWizardProps) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // Wizard state
  const [step, setStep] = useState<WizardStep>('category');
  const [submitting, setSubmitting] = useState(false);

  // Objective data
  const [category, setCategory] = useState<ObjectiveCategory>('financial');
  const [type, setType] = useState<ObjectiveType>('revenue_total');
  const [period, setPeriod] = useState<ObjectivePeriod>('monthly');
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);
  const [quarter, setQuarter] = useState(Math.ceil(currentMonth / 3));
  const [targetAmount, setTargetAmount] = useState('');
  const [priority, setPriority] = useState<ObjectivePriority>('medium');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // Granular filters
  const [productId, setProductId] = useState('');
  const [productCategoryId, setProductCategoryId] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientSegment, setClientSegment] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('');

  // Coherence check
  const [coherenceResult, setCoherenceResult] = useState<CoherenceCheckResult | null>(null);

  // Reset when opening
  useEffect(() => {
    if (isOpen) {
      setStep('category');
      setCategory('financial');
      setType('revenue_total');
      setPeriod('monthly');
      setYear(currentYear);
      setMonth(currentMonth);
      setQuarter(Math.ceil(currentMonth / 3));
      setTargetAmount('');
      setPriority('medium');
      setName('');
      setDescription('');
      setProductId('');
      setProductCategoryId('');
      setClientId('');
      setClientSegment('');
      setExpenseCategory('');
      setCoherenceResult(null);
    }
  }, [isOpen, currentYear, currentMonth]);

  // Update type when category changes
  useEffect(() => {
    const typesForCategory = OBJECTIVE_TYPE_BY_CATEGORY[category];
    if (typesForCategory && typesForCategory.length > 0) {
      setType(typesForCategory[0]);
    }
  }, [category]);

  // Check coherence when reaching review step
  useEffect(() => {
    if (step === 'review' && targetAmount) {
      const targetNum = parseFloat(targetAmount);
      if (!isNaN(targetNum)) {
        // Create temporary objective for coherence check
        const tempObjective: Objective = {
          id: 'temp',
          companyId: 'vmcloud',
          category,
          type,
          period,
          year,
          month: period === 'monthly' ? month : undefined,
          quarter: period === 'quarterly' ? quarter : undefined,
          targetAmount: targetNum,
          targetUnit: OBJECTIVE_TYPE_UNITS[type],
          priority,
          name,
          description,
          productId: productId || undefined,
          clientId: clientId || undefined,
          clientSegment: clientSegment as 'individual' | 'business' | 'enterprise' | undefined,
          expenseCategory: expenseCategory || undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const result = checkObjectivesCoherence(
          [...existingObjectives, tempObjective],
          period,
          year,
          period === 'monthly' ? month : undefined,
          period === 'quarterly' ? quarter : undefined
        );
        setCoherenceResult(result);
      }
    }
  }, [step, targetAmount, category, type, period, year, month, quarter, priority, name, description, productId, clientId, clientSegment, expenseCategory, existingObjectives]);

  const handleSubmit = async () => {
    const targetNum = parseFloat(targetAmount);
    if (isNaN(targetNum) || targetNum <= 0) {
      alert('Veuillez entrer un montant valide');
      return;
    }

    setSubmitting(true);
    try {
      const selectedProduct = products.find(p => p.id === productId);
      const selectedCategory = productCategories.find(c => c.id === productCategoryId);
      const selectedClient = clients.find(c => c.id === clientId);

      await onSubmit({
        category,
        type,
        period,
        year,
        month: period === 'monthly' ? month : undefined,
        quarter: period === 'quarterly' ? quarter : undefined,
        targetAmount: targetNum,
        targetUnit: OBJECTIVE_TYPE_UNITS[type],
        priority,
        name: name || undefined,
        description: description || undefined,
        productId: productId || undefined,
        productName: selectedProduct?.name,
        productCategoryId: productCategoryId || undefined,
        productCategoryName: selectedCategory?.name,
        clientId: clientId || undefined,
        clientName: selectedClient?.name,
        clientSegment: clientSegment as 'individual' | 'business' | 'enterprise' | undefined,
        expenseCategory: expenseCategory || undefined,
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const canProceed = (): boolean => {
    switch (step) {
      case 'category':
        return true;
      case 'type':
        return true;
      case 'details':
        // Check if required selections are made
        if (requiresProductSelection(type) && !productId) return false;
        if (requiresCategorySelection(type) && !productCategoryId && type !== 'expenses_category') return false;
        if (type === 'expenses_category' && !expenseCategory) return false;
        if (requiresClientSelection(type) && !clientId) return false;
        if (requiresSegmentSelection(type) && !clientSegment) return false;
        return true;
      case 'target':
        const num = parseFloat(targetAmount);
        return !isNaN(num) && num > 0;
      case 'review':
        return true;
      default:
        return false;
    }
  };

  const goNext = () => {
    const steps: WizardStep[] = ['category', 'type', 'details', 'target', 'review'];
    const currentIndex = steps.indexOf(step);

    // Skip details step if no additional selection needed
    if (step === 'type') {
      const needsDetails = requiresProductSelection(type) ||
        requiresCategorySelection(type) ||
        requiresClientSelection(type) ||
        requiresSegmentSelection(type);
      if (!needsDetails) {
        setStep('target');
        return;
      }
    }

    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const goBack = () => {
    const steps: WizardStep[] = ['category', 'type', 'details', 'target', 'review'];
    const currentIndex = steps.indexOf(step);

    // Skip details step when going back if not needed
    if (step === 'target') {
      const needsDetails = requiresProductSelection(type) ||
        requiresCategorySelection(type) ||
        requiresClientSelection(type) ||
        requiresSegmentSelection(type);
      if (!needsDetails) {
        setStep('type');
        return;
      }
    }

    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  if (!isOpen) return null;

  const unit = OBJECTIVE_TYPE_UNITS[type];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Target className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Nouvel objectif</h2>
                <p className="text-sm text-zinc-500">
                  {step === 'category' && 'Choisissez une catégorie'}
                  {step === 'type' && 'Sélectionnez le type d\'objectif'}
                  {step === 'details' && 'Précisez les détails'}
                  {step === 'target' && 'Définissez la cible'}
                  {step === 'review' && 'Vérification finale'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="px-5 pt-4">
            <div className="flex items-center justify-between mb-2">
              {['category', 'type', 'details', 'target', 'review'].map((s, i) => (
                <div
                  key={s}
                  className={`flex-1 h-1 mx-1 rounded-full transition-colors ${
                    ['category', 'type', 'details', 'target', 'review'].indexOf(step) >= i
                      ? 'bg-emerald-500'
                      : 'bg-zinc-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-5 min-h-[300px]">
            <AnimatePresence mode="wait">
              {/* Step 1: Category */}
              {step === 'category' && (
                <motion.div
                  key="category"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    {(Object.keys(OBJECTIVE_CATEGORY_LABELS) as ObjectiveCategory[]).map((cat) => {
                      const Icon = CATEGORY_ICONS[cat];
                      return (
                        <button
                          key={cat}
                          onClick={() => setCategory(cat)}
                          className={`p-4 text-left rounded-xl border transition-all ${
                            category === cat
                              ? 'bg-emerald-500/20 border-emerald-500/50'
                              : 'bg-zinc-800/50 border-zinc-700 hover:border-zinc-600'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                            category === cat ? 'bg-emerald-500/30' : 'bg-zinc-700'
                          }`}>
                            <Icon className={`h-5 w-5 ${category === cat ? 'text-emerald-400' : 'text-zinc-400'}`} />
                          </div>
                          <h3 className={`font-medium ${category === cat ? 'text-white' : 'text-zinc-300'}`}>
                            {OBJECTIVE_CATEGORY_LABELS[cat]}
                          </h3>
                          <p className="text-sm text-zinc-500 mt-1">
                            {OBJECTIVE_CATEGORY_DESCRIPTIONS[cat]}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Type */}
              {step === 'type' && (
                <motion.div
                  key="type"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 gap-3 max-h-[350px] overflow-y-auto pr-2">
                    {OBJECTIVE_TYPE_BY_CATEGORY[category].map((t) => (
                      <button
                        key={t}
                        onClick={() => setType(t)}
                        className={`p-4 text-left rounded-xl border transition-all ${
                          type === t
                            ? 'bg-emerald-500/20 border-emerald-500/50'
                            : 'bg-zinc-800/50 border-zinc-700 hover:border-zinc-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className={`font-medium ${type === t ? 'text-white' : 'text-zinc-300'}`}>
                              {OBJECTIVE_TYPE_LABELS[t]}
                            </h3>
                            <p className="text-sm text-zinc-500 mt-1">
                              {OBJECTIVE_TYPE_DESCRIPTIONS[t]}
                            </p>
                          </div>
                          {type === t && (
                            <Check className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Details */}
              {step === 'details' && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  {requiresProductSelection(type) && (
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">
                        Produit
                      </label>
                      <Select
                        value={productId}
                        onChange={setProductId}
                        placeholder="Sélectionner un produit"
                        options={products.map(p => ({ value: p.id, label: p.name }))}
                      />
                    </div>
                  )}

                  {requiresCategorySelection(type) && type !== 'expenses_category' && (
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">
                        Catégorie de produit
                      </label>
                      <Select
                        value={productCategoryId}
                        onChange={setProductCategoryId}
                        placeholder="Sélectionner une catégorie"
                        options={productCategories.map(c => ({ value: c.id, label: c.name }))}
                      />
                    </div>
                  )}

                  {type === 'expenses_category' && (
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">
                        Catégorie de dépense
                      </label>
                      <Select
                        value={expenseCategory}
                        onChange={setExpenseCategory}
                        placeholder="Sélectionner une catégorie"
                        options={EXPENSE_CATEGORIES.map(c => ({ value: c.value, label: c.label }))}
                      />
                    </div>
                  )}

                  {requiresClientSelection(type) && (
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">
                        Client
                      </label>
                      <Select
                        value={clientId}
                        onChange={setClientId}
                        placeholder="Sélectionner un client"
                        options={clients.map(c => ({ value: c.id, label: c.name }))}
                      />
                    </div>
                  )}

                  {requiresSegmentSelection(type) && (
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">
                        Segment client
                      </label>
                      <Select
                        value={clientSegment}
                        onChange={setClientSegment}
                        placeholder="Sélectionner un segment"
                        options={CLIENT_SEGMENTS.map(s => ({ value: s.value, label: s.label }))}
                      />
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 4: Target */}
              {step === 'target' && (
                <motion.div
                  key="target"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  {/* Period */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                      Période
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(Object.keys(OBJECTIVE_PERIOD_LABELS) as ObjectivePeriod[]).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPeriod(p)}
                          className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                            period === p
                              ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                              : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                          }`}
                        >
                          {OBJECTIVE_PERIOD_LABELS[p]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Year + Month/Quarter */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">
                        Année
                      </label>
                      <Select
                        value={year.toString()}
                        onChange={(v) => setYear(parseInt(v))}
                        options={[currentYear - 1, currentYear, currentYear + 1].map(y => ({
                          value: y.toString(),
                          label: y.toString(),
                        }))}
                      />
                    </div>

                    {period === 'monthly' && (
                      <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">
                          Mois
                        </label>
                        <Select
                          value={month.toString()}
                          onChange={(v) => setMonth(parseInt(v))}
                          options={MONTHS_FR.map((m, i) => ({
                            value: (i + 1).toString(),
                            label: m,
                          }))}
                        />
                      </div>
                    )}

                    {period === 'quarterly' && (
                      <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">
                          Trimestre
                        </label>
                        <Select
                          value={quarter.toString()}
                          onChange={(v) => setQuarter(parseInt(v))}
                          options={QUARTERS_FR.map((q, i) => ({
                            value: (i + 1).toString(),
                            label: q,
                          }))}
                        />
                      </div>
                    )}
                  </div>

                  {/* Target Amount */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                      Objectif cible
                      <span className="text-zinc-600 ml-2">
                        ({unit === 'currency' ? 'en €' : unit === 'percent' ? 'en %' : 'nombre'})
                      </span>
                    </label>
                    <input
                      type="number"
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(e.target.value)}
                      placeholder={unit === 'currency' ? 'ex: 10000' : unit === 'percent' ? 'ex: 15' : 'ex: 50'}
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                      min="0"
                      step={unit === 'percent' ? '0.1' : '1'}
                    />
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                      Priorité
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {(Object.keys(PRIORITY_CONFIG) as ObjectivePriority[]).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPriority(p)}
                          className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                            priority === p
                              ? `${PRIORITY_CONFIG[p].bgColor} ${PRIORITY_CONFIG[p].color} border-current`
                              : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                          }`}
                        >
                          {PRIORITY_CONFIG[p].label}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 5: Review */}
              {step === 'review' && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  {/* Summary */}
                  <div className="bg-zinc-800/50 rounded-xl p-4 space-y-3">
                    <h3 className="font-medium text-white">Récapitulatif</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-zinc-500">Catégorie:</span>
                        <span className="text-white ml-2">{OBJECTIVE_CATEGORY_LABELS[category]}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500">Type:</span>
                        <span className="text-white ml-2">{OBJECTIVE_TYPE_LABELS[type]}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500">Période:</span>
                        <span className="text-white ml-2">
                          {OBJECTIVE_PERIOD_LABELS[period]} {year}
                          {period === 'monthly' && ` - ${MONTHS_FR[month - 1]}`}
                          {period === 'quarterly' && ` - T${quarter}`}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500">Cible:</span>
                        <span className="text-white ml-2 font-semibold">
                          {targetAmount && formatObjectiveValue(parseFloat(targetAmount), unit)}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500">Priorité:</span>
                        <span className={`ml-2 ${PRIORITY_CONFIG[priority].color}`}>
                          {PRIORITY_CONFIG[priority].label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Coherence warnings */}
                  {coherenceResult && !coherenceResult.isCoherent && (
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-amber-400">
                            Incohérence détectée ({coherenceResult.summary.errors} erreur{coherenceResult.summary.errors > 1 ? 's' : ''}, {coherenceResult.summary.warnings} avertissement{coherenceResult.summary.warnings > 1 ? 's' : ''})
                          </h4>
                          <ul className="mt-2 space-y-2">
                            {coherenceResult.issues.slice(0, 2).map((issue) => (
                              <li key={issue.id} className="text-sm text-amber-300/80">
                                <strong>{issue.title}:</strong> {issue.message}
                              </li>
                            ))}
                          </ul>
                          {coherenceResult.issues.length > 2 && (
                            <p className="text-sm text-amber-400/60 mt-2">
                              +{coherenceResult.issues.length - 2} autre(s) problème(s)
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {coherenceResult?.isCoherent && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-emerald-400" />
                        <span className="text-emerald-400">
                          Objectif cohérent avec les autres objectifs de la période
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Optional name/description */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                      Nom personnalisé <span className="text-zinc-600">(optionnel)</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="ex: Objectif CA Janvier 2026"
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-5 border-t border-zinc-800">
            <button
              onClick={step === 'category' ? onClose : goBack}
              className="flex items-center gap-2 px-4 py-2 text-zinc-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              {step === 'category' ? 'Annuler' : 'Retour'}
            </button>

            {step === 'review' ? (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {submitting ? 'Création...' : 'Créer l\'objectif'}
              </button>
            ) : (
              <button
                onClick={goNext}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-2 bg-zinc-700 hover:bg-zinc-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuer
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default CreateObjectiveWizard;
