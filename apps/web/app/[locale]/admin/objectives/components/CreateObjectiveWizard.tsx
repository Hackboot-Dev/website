// /workspaces/website/apps/web/app/[locale]/admin/objectives/components/CreateObjectiveWizard.tsx
// Description: Step-by-step wizard for creating objectives with milestones
// Last modified: 2026-01-11

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
  Plus,
  Trash2,
  Calendar,
  TrendingUp,
  Sparkles,
  Loader2,
  Info,
} from 'lucide-react';
import { Select } from '../../../../../components/ui/Select';
import type {
  ObjectiveCategory,
  ObjectiveType,
  ObjectivePeriod,
  ObjectivePriority,
  Objective,
  DistributionType,
  ObjectiveMilestone,
} from '../types';
import {
  OBJECTIVE_CATEGORY_LABELS,
  OBJECTIVE_CATEGORY_DESCRIPTIONS,
  OBJECTIVE_TYPE_LABELS,
  OBJECTIVE_TYPE_DESCRIPTIONS,
  OBJECTIVE_TYPE_BY_CATEGORY,
  OBJECTIVE_TYPE_UNITS,
  OBJECTIVE_PERIOD_LABELS,
  DISTRIBUTION_TYPE_LABELS,
  DISTRIBUTION_TYPE_DESCRIPTIONS,
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
} from '../types';
import { useRealMetrics } from '../hooks/useRealMetrics';
import type { CompanyId } from '../../pnl/types';

const CATEGORY_ICONS: Record<ObjectiveCategory, typeof DollarSign> = {
  financial: DollarSign,
  clients: Users,
  subscriptions: CreditCard,
  products: Package,
};

type WizardStep = 'category' | 'type' | 'details' | 'target' | 'distribution' | 'review';

type CreateObjectiveWizardProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Objective>) => Promise<void>;
  existingObjectives?: Objective[];
  products?: { id: string; name: string; categoryId?: string }[];
  productCategories?: { id: string; name: string }[];
  clients?: { id: string; name: string }[];
  companyId?: CompanyId;
};

export function CreateObjectiveWizard({
  isOpen,
  onClose,
  onSubmit,
  existingObjectives = [],
  products = [],
  productCategories = [],
  clients = [],
  companyId = 'vmcloud',
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
  const [startingAmount, setStartingAmount] = useState('');
  const [priority, setPriority] = useState<ObjectivePriority>('medium');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // Granular filters
  const [productId, setProductId] = useState('');
  const [productCategoryId, setProductCategoryId] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientSegment, setClientSegment] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('');

  // Distribution & Milestones
  const [distributionType, setDistributionType] = useState<DistributionType>('linear');
  const [milestones, setMilestones] = useState<ObjectiveMilestone[]>([]);

  // Real metrics for suggestions
  const realMetrics = useRealMetrics({
    companyId,
    type,
    period,
    year,
    month: period === 'monthly' ? month : undefined,
    quarter: period === 'quarterly' ? quarter : undefined,
  });

  // Get max days for period
  const getMaxDays = (): number => {
    if (period === 'monthly' && month) {
      return new Date(year, month, 0).getDate();
    }
    if (period === 'quarterly') return 90;
    if (period === 'yearly') return 365;
    return 31;
  };

  // Generate default milestones based on distribution type
  const generateDefaultMilestones = (distType: DistributionType): ObjectiveMilestone[] => {
    const target = parseFloat(targetAmount) || 0;
    const starting = parseFloat(startingAmount) || 0;
    const totalToAchieve = target - starting;
    const maxDays = getMaxDays();

    if (distType === 'linear' || distType === 'custom') {
      // For linear or custom, create milestones at 25%, 50%, 75%, 100%
      return [
        { id: 'ms_1', day: Math.round(maxDays * 0.25), expectedAmount: starting + totalToAchieve * 0.25, label: '25%' },
        { id: 'ms_2', day: Math.round(maxDays * 0.5), expectedAmount: starting + totalToAchieve * 0.5, label: '50%' },
        { id: 'ms_3', day: Math.round(maxDays * 0.75), expectedAmount: starting + totalToAchieve * 0.75, label: '75%' },
        { id: 'ms_4', day: maxDays, expectedAmount: target, label: '100%' },
      ];
    }

    if (distType === 'front_loaded') {
      // More expected early
      return [
        { id: 'ms_1', day: Math.round(maxDays * 0.25), expectedAmount: starting + totalToAchieve * 0.5, label: '50% attendu' },
        { id: 'ms_2', day: Math.round(maxDays * 0.5), expectedAmount: starting + totalToAchieve * 0.75, label: '75% attendu' },
        { id: 'ms_3', day: Math.round(maxDays * 0.75), expectedAmount: starting + totalToAchieve * 0.9, label: '90% attendu' },
        { id: 'ms_4', day: maxDays, expectedAmount: target, label: '100%' },
      ];
    }

    if (distType === 'back_loaded') {
      // More expected late
      return [
        { id: 'ms_1', day: Math.round(maxDays * 0.25), expectedAmount: starting + totalToAchieve * 0.1, label: '10% attendu' },
        { id: 'ms_2', day: Math.round(maxDays * 0.5), expectedAmount: starting + totalToAchieve * 0.25, label: '25% attendu' },
        { id: 'ms_3', day: Math.round(maxDays * 0.75), expectedAmount: starting + totalToAchieve * 0.5, label: '50% attendu' },
        { id: 'ms_4', day: maxDays, expectedAmount: target, label: '100%' },
      ];
    }

    return [];
  };

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
      setStartingAmount('');
      setPriority('medium');
      setName('');
      setDescription('');
      setProductId('');
      setProductCategoryId('');
      setClientId('');
      setClientSegment('');
      setExpenseCategory('');
      setDistributionType('linear');
      setMilestones([]);
    }
  }, [isOpen, currentYear, currentMonth]);

  // Update type when category changes
  useEffect(() => {
    const typesForCategory = OBJECTIVE_TYPE_BY_CATEGORY[category];
    if (typesForCategory && typesForCategory.length > 0) {
      setType(typesForCategory[0]);
    }
  }, [category]);

  // Generate milestones when entering distribution step
  useEffect(() => {
    if (step === 'distribution' && milestones.length === 0) {
      setMilestones(generateDefaultMilestones(distributionType));
    }
  }, [step]);

  // Update milestones when distribution type changes
  useEffect(() => {
    if (step === 'distribution') {
      setMilestones(generateDefaultMilestones(distributionType));
    }
  }, [distributionType, targetAmount, startingAmount]);

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
        startingAmount: parseFloat(startingAmount) || 0,
        distributionType,
        milestones: distributionType === 'custom' ? milestones : generateDefaultMilestones(distributionType),
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
        if (requiresProductSelection(type) && !productId) return false;
        if (requiresCategorySelection(type) && !productCategoryId && type !== 'expenses_category') return false;
        if (type === 'expenses_category' && !expenseCategory) return false;
        if (requiresClientSelection(type) && !clientId) return false;
        if (requiresSegmentSelection(type) && !clientSegment) return false;
        return true;
      case 'target':
        const num = parseFloat(targetAmount);
        return !isNaN(num) && num > 0;
      case 'distribution':
        return milestones.length > 0;
      case 'review':
        return true;
      default:
        return false;
    }
  };

  const goNext = () => {
    const steps: WizardStep[] = ['category', 'type', 'details', 'target', 'distribution', 'review'];
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
    const steps: WizardStep[] = ['category', 'type', 'details', 'target', 'distribution', 'review'];
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

  // Milestone management
  const addMilestone = () => {
    const maxDays = getMaxDays();
    const lastDay = milestones.length > 0 ? milestones[milestones.length - 1].day : 0;
    const newDay = Math.min(lastDay + 7, maxDays);

    setMilestones([
      ...milestones,
      {
        id: `ms_${Date.now()}`,
        day: newDay,
        expectedAmount: parseFloat(targetAmount) || 0,
        label: '',
      },
    ].sort((a, b) => a.day - b.day));
  };

  const updateMilestone = (id: string, field: 'day' | 'expectedAmount' | 'label', value: number | string) => {
    setMilestones(milestones.map(ms =>
      ms.id === id ? { ...ms, [field]: value } : ms
    ).sort((a, b) => a.day - b.day));
  };

  const removeMilestone = (id: string) => {
    setMilestones(milestones.filter(ms => ms.id !== id));
  };

  if (!isOpen) return null;

  const unit = OBJECTIVE_TYPE_UNITS[type];
  const maxDays = getMaxDays();

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
                  {step === 'distribution' && 'Configurez la progression'}
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
              {['category', 'type', 'details', 'target', 'distribution', 'review'].map((s, i) => (
                <div
                  key={s}
                  className={`flex-1 h-1 mx-1 rounded-full transition-colors ${
                    ['category', 'type', 'details', 'target', 'distribution', 'review'].indexOf(step) >= i
                      ? 'bg-emerald-500'
                      : 'bg-zinc-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-5 min-h-[300px] max-h-[60vh] overflow-y-auto">
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

                  {/* Starting Amount */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                      Montant de départ
                      <span className="text-zinc-600 ml-2">(optionnel - si vous partez pas de 0)</span>
                    </label>
                    <input
                      type="number"
                      value={startingAmount}
                      onChange={(e) => setStartingAmount(e.target.value)}
                      placeholder="0"
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                      min="0"
                    />
                  </div>

                  {/* Current Value Info */}
                  {!realMetrics.loading && realMetrics.currentValue > 0 && (
                    <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                          <Info className="h-5 w-5 text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-white mb-1">Données actuelles</h4>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-zinc-400">Valeur actuelle: </span>
                              <span className="text-white font-medium">
                                {formatObjectiveValue(realMetrics.currentValue, unit)}
                              </span>
                            </div>
                            {realMetrics.lastPeriodValue > 0 && (
                              <div>
                                <span className="text-zinc-400">Période précédente: </span>
                                <span className="text-white font-medium">
                                  {formatObjectiveValue(realMetrics.lastPeriodValue, unit)}
                                </span>
                              </div>
                            )}
                            {realMetrics.growthRate !== 0 && (
                              <div>
                                <span className="text-zinc-400">Croissance: </span>
                                <span className={`font-medium ${realMetrics.growthRate > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                  {realMetrics.growthRate > 0 ? '+' : ''}{realMetrics.growthRate.toFixed(1)}%
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Target Amount */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                      Objectif cible
                      <span className="text-zinc-600 ml-2">
                        ({unit === 'currency' ? 'en €' : unit === 'percent' ? 'en %' : 'nombre'})
                      </span>
                    </label>

                    {/* Suggestions */}
                    {!realMetrics.loading && realMetrics.suggestions.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-zinc-500 mb-2 flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          Suggestions basées sur vos données
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {realMetrics.suggestions.slice(0, 4).map((suggestion, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setTargetAmount(suggestion.value.toString())}
                              className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
                                targetAmount === suggestion.value.toString()
                                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                                  : 'bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:border-zinc-600'
                              }`}
                              title={suggestion.description}
                            >
                              {suggestion.label}: {formatObjectiveValue(suggestion.value, unit)}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {realMetrics.loading && (
                      <div className="mb-3 flex items-center gap-2 text-zinc-500 text-sm">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Chargement des suggestions...
                      </div>
                    )}

                    {/* Manual Input */}
                    <div className="relative">
                      <input
                        type="number"
                        value={targetAmount}
                        onChange={(e) => setTargetAmount(e.target.value)}
                        placeholder={unit === 'currency' ? 'ex: 10000' : unit === 'percent' ? 'ex: 15' : 'ex: 50'}
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                        min="0"
                        step={unit === 'percent' ? '0.1' : '1'}
                      />
                      {unit === 'currency' && (
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">€</span>
                      )}
                      {unit === 'percent' && (
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">%</span>
                      )}
                    </div>
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

              {/* Step 5: Distribution & Milestones */}
              {step === 'distribution' && (
                <motion.div
                  key="distribution"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  {/* Distribution Type */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                      Type de répartition
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {(Object.keys(DISTRIBUTION_TYPE_LABELS) as DistributionType[]).map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setDistributionType(d)}
                          className={`p-3 text-left rounded-xl border transition-all ${
                            distributionType === d
                              ? 'bg-emerald-500/20 border-emerald-500/50'
                              : 'bg-zinc-800/50 border-zinc-700 hover:border-zinc-600'
                          }`}
                        >
                          <h4 className={`font-medium ${distributionType === d ? 'text-white' : 'text-zinc-300'}`}>
                            {DISTRIBUTION_TYPE_LABELS[d]}
                          </h4>
                          <p className="text-xs text-zinc-500 mt-1">
                            {DISTRIBUTION_TYPE_DESCRIPTIONS[d]}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Milestones */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium text-zinc-400">
                        Jalons de progression
                      </label>
                      {distributionType === 'custom' && (
                        <button
                          type="button"
                          onClick={addMilestone}
                          className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300"
                        >
                          <Plus className="h-3 w-3" />
                          Ajouter
                        </button>
                      )}
                    </div>

                    <div className="space-y-2">
                      {milestones.map((ms, index) => (
                        <div
                          key={ms.id}
                          className="flex items-center gap-3 p-3 bg-zinc-800/50 border border-zinc-700 rounded-lg"
                        >
                          <Calendar className="h-4 w-4 text-zinc-500 flex-shrink-0" />

                          <div className="flex-1 grid grid-cols-3 gap-3">
                            <div>
                              <label className="text-xs text-zinc-500">Jour</label>
                              <input
                                type="number"
                                value={ms.day}
                                onChange={(e) => updateMilestone(ms.id, 'day', parseInt(e.target.value) || 1)}
                                disabled={distributionType !== 'custom'}
                                min="1"
                                max={maxDays}
                                className="w-full px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-white text-sm disabled:opacity-50"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-zinc-500">Montant attendu</label>
                              <input
                                type="number"
                                value={ms.expectedAmount}
                                onChange={(e) => updateMilestone(ms.id, 'expectedAmount', parseFloat(e.target.value) || 0)}
                                disabled={distributionType !== 'custom'}
                                className="w-full px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-white text-sm disabled:opacity-50"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-zinc-500">Label</label>
                              <input
                                type="text"
                                value={ms.label || ''}
                                onChange={(e) => updateMilestone(ms.id, 'label', e.target.value)}
                                disabled={distributionType !== 'custom'}
                                placeholder="ex: Mi-mois"
                                className="w-full px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-white text-sm placeholder-zinc-600 disabled:opacity-50"
                              />
                            </div>
                          </div>

                          {distributionType === 'custom' && milestones.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeMilestone(ms.id)}
                              className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Visual preview */}
                    <div className="mt-4 p-3 bg-zinc-800/30 rounded-lg">
                      <p className="text-xs text-zinc-500 mb-2">Aperçu de la progression attendue</p>
                      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden flex">
                        {milestones.map((ms, i) => {
                          const prevDay = i > 0 ? milestones[i - 1].day : 0;
                          const width = ((ms.day - prevDay) / maxDays) * 100;
                          return (
                            <div
                              key={ms.id}
                              className="h-full bg-emerald-500/50 border-r border-zinc-900"
                              style={{ width: `${width}%` }}
                              title={`Jour ${ms.day}: ${formatObjectiveValue(ms.expectedAmount, unit)}`}
                            />
                          );
                        })}
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-zinc-600">
                        <span>Jour 1</span>
                        <span>Jour {maxDays}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 6: Review */}
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
                        <span className="text-zinc-500">Départ:</span>
                        <span className="text-white ml-2">
                          {formatObjectiveValue(parseFloat(startingAmount) || 0, unit)}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500">Cible:</span>
                        <span className="text-white ml-2 font-semibold">
                          {targetAmount && formatObjectiveValue(parseFloat(targetAmount), unit)}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500">Répartition:</span>
                        <span className="text-white ml-2">{DISTRIBUTION_TYPE_LABELS[distributionType]}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500">Priorité:</span>
                        <span className={`ml-2 ${PRIORITY_CONFIG[priority].color}`}>
                          {PRIORITY_CONFIG[priority].label}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500">Jalons:</span>
                        <span className="text-white ml-2">{milestones.length}</span>
                      </div>
                    </div>
                  </div>

                  {/* Milestones preview */}
                  <div className="bg-zinc-800/30 rounded-xl p-4">
                    <h4 className="text-sm font-medium text-zinc-400 mb-3">Progression attendue</h4>
                    <div className="space-y-2">
                      {milestones.slice(0, 4).map((ms) => (
                        <div key={ms.id} className="flex items-center justify-between text-sm">
                          <span className="text-zinc-500">
                            Jour {ms.day} {ms.label && `(${ms.label})`}
                          </span>
                          <span className="text-white font-medium">
                            {formatObjectiveValue(ms.expectedAmount, unit)}
                          </span>
                        </div>
                      ))}
                      {milestones.length > 4 && (
                        <p className="text-xs text-zinc-600">+{milestones.length - 4} autres jalons</p>
                      )}
                    </div>
                  </div>

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
