// /workspaces/website/apps/web/app/[locale]/admin/objectives/types.ts
// Description: Comprehensive types for business objectives, validation and coherence checking
// Last modified: 2026-01-11

// ============================================================
// OBJECTIVE CATEGORIES & TYPES
// ============================================================

export type ObjectiveCategory =
  | 'financial'     // Revenue, expenses, profit
  | 'clients'       // Client acquisition, retention
  | 'subscriptions' // MRR, churn
  | 'products';     // Product-specific targets

export type ObjectiveType =
  // Financial - Revenue
  | 'revenue_total'       // Chiffre d'affaires total
  | 'revenue_product'     // CA par produit spécifique
  | 'revenue_category'    // CA par catégorie de produit
  | 'revenue_client'      // CA par client spécifique
  | 'revenue_segment'     // CA par segment client

  // Financial - Expenses
  | 'expenses_total'      // Dépenses totales
  | 'expenses_category'   // Dépenses par catégorie

  // Financial - Profit & Margins
  | 'gross_profit'        // Marge brute (Revenue - COGS)
  | 'net_profit'          // Bénéfice net (Revenue - All Expenses)
  | 'gross_margin_pct'    // Marge brute en %
  | 'net_margin_pct'      // Marge nette en %

  // Clients - Acquisition
  | 'new_clients_total'   // Nouveaux clients total sur la période
  | 'new_clients_segment' // Nouveaux clients par segment
  | 'conversion_rate'     // Taux de conversion leads → clients
  | 'cac'                 // Coût d'acquisition client

  // Clients - Retention
  | 'churn_rate'          // Taux de churn clients %
  | 'retention_rate'      // Taux de rétention %
  | 'active_clients'      // Nombre de clients actifs
  | 'avg_tenure'          // Ancienneté moyenne (en mois)

  // Clients - Value
  | 'arpu'                // Revenu moyen par client (Average Revenue Per User)
  | 'ltv'                 // Valeur vie client (Lifetime Value)
  | 'ltv_cac_ratio'       // Ratio LTV/CAC
  | 'avg_basket'          // Panier moyen par transaction

  // Clients - Engagement
  | 'active_ratio'        // % clients actifs vs total
  | 'upsell_rate'         // Taux d'upsell (clients ayant upgradé)

  // Subscriptions - Recurring Revenue
  | 'mrr_total'              // MRR total
  | 'arr_total'              // ARR total
  | 'mrr_growth_pct'         // Croissance MRR %
  | 'net_new_mrr'            // Net New MRR (new + expansion - churn - contraction)

  // Subscriptions - Churn & Retention
  | 'subscription_churn_rate' // Taux de churn abonnés %
  | 'mrr_churn'              // MRR perdu (montant)
  | 'mrr_churn_pct'          // MRR perdu %
  | 'nrr'                    // Net Revenue Retention %
  | 'grr'                    // Gross Revenue Retention %

  // Subscriptions - Expansion & Contraction
  | 'expansion_mrr'          // MRR gagné via upgrades
  | 'contraction_mrr'        // MRR perdu via downgrades
  | 'expansion_rate'         // % clients ayant upgradé
  | 'upgrades_count'         // Nombre d'upgrades
  | 'downgrades_count'       // Nombre de downgrades

  // Subscriptions - Acquisition
  | 'new_subscriptions'      // Nouveaux abonnements
  | 'new_mrr'                // MRR des nouveaux abonnés
  | 'paid_conversion'        // % clients → abonnés payants

  // Subscriptions - Advanced SaaS Metrics
  | 'arpu_subscribers'       // ARPU des abonnés
  | 'ltv_mrr'                // LTV basée sur MRR
  | 'quick_ratio'            // (New + Expansion) / (Churn + Contraction)
  | 'payback_months'         // Mois pour récupérer CAC
  | 'magic_number';          // Net New ARR / S&M spend

export type ObjectivePeriod = 'monthly' | 'quarterly' | 'yearly';

export type ObjectiveStatus = 'achieved' | 'on_track' | 'at_risk' | 'behind' | 'not_started';

export type ObjectivePriority = 'low' | 'medium' | 'high' | 'critical';

// Distribution types for progress tracking
export type DistributionType = 'linear' | 'front_loaded' | 'back_loaded' | 'custom';

// Milestone for custom distribution
export interface ObjectiveMilestone {
  id: string;
  day: number;              // Day of period (1-31 for monthly, 1-90 for quarterly, 1-365 for yearly)
  expectedAmount: number;   // Cumulative amount expected by this day
  label?: string;           // Optional label (e.g., "Mi-mois", "Fin de sprint")
}

// ============================================================
// OBJECTIVE STRUCTURE
// ============================================================

export interface Objective {
  id: string;
  companyId: string;

  // Classification
  category: ObjectiveCategory;
  type: ObjectiveType;

  // Period
  period: ObjectivePeriod;
  year: number;
  month?: number;      // 1-12 for monthly
  quarter?: number;    // 1-4 for quarterly

  // Target
  targetAmount: number;
  targetUnit: 'currency' | 'count' | 'percent';

  // Distribution & Milestones
  distributionType: DistributionType;
  startingAmount?: number;           // Amount already achieved at start of period
  milestones?: ObjectiveMilestone[]; // Custom milestones (if distributionType === 'custom')

  // Optional filters (for granular objectives)
  productId?: string;
  productName?: string;
  productCategoryId?: string;
  productCategoryName?: string;
  clientId?: string;
  clientName?: string;
  clientSegment?: 'individual' | 'business' | 'enterprise';
  expenseCategory?: string;

  // Metadata
  name?: string;
  description?: string;
  priority: ObjectivePriority;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface ObjectiveWithProgress extends Objective {
  actualAmount: number;
  progressPercent: number;
  status: ObjectiveStatus;
  trend?: 'up' | 'down' | 'stable';
  forecastedAmount?: number;
  daysRemaining?: number;
  expectedProgress?: number; // What progress should be at this point in time
}

// ============================================================
// COHERENCE VALIDATION
// ============================================================

export type CoherenceIssueType =
  | 'profit_mismatch'           // Revenue - Expenses ≠ Net Profit
  | 'margin_mismatch'           // Calculated margin ≠ Margin objective
  | 'sum_mismatch'              // Sum of parts ≠ Total
  | 'impossible_target'         // Target can't be achieved (e.g., 150% retention)
  | 'conflicting_objectives'    // Two objectives contradict each other
  | 'missing_dependency';       // Objective depends on another that doesn't exist

export type CoherenceSeverity = 'error' | 'warning' | 'info';

export interface CoherenceIssue {
  id: string;
  type: CoherenceIssueType;
  severity: CoherenceSeverity;
  title: string;
  message: string;
  details: string;
  affectedObjectiveIds: string[];
  suggestion?: CoherenceSuggestion;
}

export interface CoherenceSuggestion {
  message: string;
  options: CoherenceCorrectionOption[];
}

export interface CoherenceCorrectionOption {
  id: string;
  label: string;
  description: string;
  corrections: ObjectiveCorrection[];
}

export interface ObjectiveCorrection {
  objectiveId: string;
  objectiveLabel: string;
  field: 'targetAmount';
  currentValue: number;
  suggestedValue: number;
}

export interface CoherenceCheckResult {
  isCoherent: boolean;
  issues: CoherenceIssue[];
  summary: {
    errors: number;
    warnings: number;
    infos: number;
  };
  lastChecked: string;
}

// ============================================================
// BUDGET PLAN
// ============================================================

export interface BudgetPlan {
  id: string;
  companyId: string;
  year: number;
  name: string;
  description?: string;

  // Status
  status: 'draft' | 'active' | 'archived';

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface BudgetPlanWithObjectives extends BudgetPlan {
  objectives: ObjectiveWithProgress[];
  coherenceResult: CoherenceCheckResult;

  // Aggregated summary
  summary: {
    totalObjectives: number;
    achieved: number;
    onTrack: number;
    atRisk: number;
    behind: number;
    revenueTarget: number;
    expensesTarget: number;
    netProfitTarget: number;
  };
}

// ============================================================
// ALERTS
// ============================================================

export type AlertSeverity = 'critical' | 'warning' | 'info';

export type AlertType =
  | 'revenue_miss'
  | 'revenue_beat'
  | 'expense_overrun'
  | 'churn_spike'
  | 'mrr_drop'
  | 'mrr_growth'
  | 'client_milestone'
  | 'payment_overdue'
  | 'subscription_expiring'
  | 'objective_at_risk'
  | 'objective_achieved'
  | 'coherence_issue';

export interface Alert {
  id: string;
  companyId: string;
  severity: AlertSeverity;
  type: AlertType;
  title: string;
  message: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  metadata?: Record<string, unknown>;
  isRead: boolean;
  isAcknowledged: boolean;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  autoDismissAt?: string;
  createdAt: string;
}

export interface AlertCounts {
  total: number;
  critical: number;
  warning: number;
  info: number;
}

export type AlertRuleCondition = 'above' | 'below' | 'equals' | 'change_percent';
export type AlertRuleFrequency = 'hourly' | 'daily' | 'weekly' | 'monthly';

export interface AlertRule {
  id: string;
  companyId: string;
  name: string;
  description?: string;
  isActive: boolean;
  metric: string;
  condition: AlertRuleCondition;
  threshold: number;
  alertSeverity: AlertSeverity;
  alertTitleTemplate: string;
  alertMessageTemplate: string;
  checkFrequency: AlertRuleFrequency;
  lastTriggeredAt?: string;
  cooldownHours: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// LABELS & CONSTANTS
// ============================================================

export const OBJECTIVE_CATEGORY_LABELS: Record<ObjectiveCategory, string> = {
  financial: 'Financier',
  clients: 'Clients',
  subscriptions: 'Abonnements',
  products: 'Produits',
};

export const OBJECTIVE_CATEGORY_DESCRIPTIONS: Record<ObjectiveCategory, string> = {
  financial: 'Revenus, dépenses, marges et bénéfices',
  clients: 'Acquisition, rétention et segments clients',
  subscriptions: 'MRR, ARR, churn, NRR, expansion et métriques SaaS',
  products: 'Performance par produit ou catégorie',
};

export const OBJECTIVE_TYPE_LABELS: Record<ObjectiveType, string> = {
  // Revenue
  revenue_total: 'Chiffre d\'affaires total',
  revenue_product: 'CA par produit',
  revenue_category: 'CA par catégorie',
  revenue_client: 'CA par client',
  revenue_segment: 'CA par segment',
  // Expenses
  expenses_total: 'Dépenses totales',
  expenses_category: 'Dépenses par catégorie',
  // Profit
  gross_profit: 'Marge brute',
  net_profit: 'Bénéfice net',
  gross_margin_pct: 'Marge brute %',
  net_margin_pct: 'Marge nette %',
  // Clients - Acquisition
  new_clients_total: 'Nouveaux clients',
  new_clients_segment: 'Nouveaux clients par segment',
  conversion_rate: 'Taux de conversion',
  cac: 'Coût d\'acquisition (CAC)',
  // Clients - Retention
  churn_rate: 'Taux de churn',
  retention_rate: 'Taux de rétention',
  active_clients: 'Clients actifs',
  avg_tenure: 'Ancienneté moyenne',
  // Clients - Value
  arpu: 'ARPU (Revenu/client)',
  ltv: 'LTV (Valeur vie client)',
  ltv_cac_ratio: 'Ratio LTV/CAC',
  avg_basket: 'Panier moyen',
  // Clients - Engagement
  active_ratio: 'Ratio clients actifs',
  upsell_rate: 'Taux d\'upsell',
  // Subscriptions - Recurring Revenue
  mrr_total: 'MRR total',
  arr_total: 'ARR total',
  mrr_growth_pct: 'Croissance MRR',
  net_new_mrr: 'Net New MRR',
  // Subscriptions - Churn & Retention
  subscription_churn_rate: 'Churn abonnés',
  mrr_churn: 'MRR perdu',
  mrr_churn_pct: 'Churn MRR %',
  nrr: 'NRR (Net Revenue Retention)',
  grr: 'GRR (Gross Revenue Retention)',
  // Subscriptions - Expansion & Contraction
  expansion_mrr: 'Expansion MRR',
  contraction_mrr: 'Contraction MRR',
  expansion_rate: 'Taux d\'expansion',
  upgrades_count: 'Nombre d\'upgrades',
  downgrades_count: 'Nombre de downgrades',
  // Subscriptions - Acquisition
  new_subscriptions: 'Nouveaux abonnements',
  new_mrr: 'New MRR',
  paid_conversion: 'Conversion payante',
  // Subscriptions - Advanced SaaS
  arpu_subscribers: 'ARPU abonnés',
  ltv_mrr: 'LTV (basée MRR)',
  quick_ratio: 'Quick Ratio',
  payback_months: 'Payback Period',
  magic_number: 'Magic Number',
};

export const OBJECTIVE_TYPE_DESCRIPTIONS: Record<ObjectiveType, string> = {
  // Financial
  revenue_total: 'Chiffre d\'affaires total sur la période',
  revenue_product: 'Revenus générés par un produit spécifique',
  revenue_category: 'Revenus par catégorie de produits (VPS, GPU, etc.)',
  revenue_client: 'Revenus générés par un client spécifique',
  revenue_segment: 'Revenus par segment client (particulier, pro, entreprise)',
  expenses_total: 'Total des dépenses sur la période',
  expenses_category: 'Dépenses par catégorie (salaires, infra, marketing...)',
  gross_profit: 'Revenus moins coûts directs',
  net_profit: 'Bénéfice après toutes les dépenses',
  gross_margin_pct: 'Marge brute en pourcentage du CA',
  net_margin_pct: 'Marge nette en pourcentage du CA',
  // Clients - Acquisition
  new_clients_total: 'Nombre total de nouveaux clients acquis sur la période',
  new_clients_segment: 'Nouveaux clients filtrés par segment (particulier, pro, entreprise)',
  conversion_rate: 'Pourcentage de leads convertis en clients actifs',
  cac: 'Coût moyen pour acquérir un nouveau client (dépenses marketing / nouveaux clients)',
  // Clients - Retention
  churn_rate: 'Pourcentage de clients perdus sur la période',
  retention_rate: 'Pourcentage de clients conservés (100% - churn)',
  active_clients: 'Nombre de clients avec statut actif',
  avg_tenure: 'Ancienneté moyenne des clients en mois',
  // Clients - Value
  arpu: 'Revenu moyen par client actif (CA / clients actifs)',
  ltv: 'Valeur totale générée par un client sur sa durée de vie',
  ltv_cac_ratio: 'Ratio entre LTV et CAC (objectif > 3)',
  avg_basket: 'Montant moyen par transaction',
  // Clients - Engagement
  active_ratio: 'Pourcentage de clients avec activité récente',
  upsell_rate: 'Pourcentage de clients ayant upgradé leur offre',
  // Subscriptions - Recurring Revenue
  mrr_total: 'Revenu mensuel récurrent total des abonnements actifs',
  arr_total: 'Revenu annuel récurrent (MRR × 12)',
  mrr_growth_pct: 'Croissance du MRR en pourcentage vs période précédente',
  net_new_mrr: 'MRR net ajouté = New MRR + Expansion - Churn - Contraction',
  // Subscriptions - Churn & Retention
  subscription_churn_rate: 'Pourcentage d\'abonnés perdus sur la période',
  mrr_churn: 'Montant de MRR perdu suite aux annulations',
  mrr_churn_pct: 'Pourcentage du MRR perdu suite aux annulations',
  nrr: 'Net Revenue Retention : rétention incluant expansion (objectif > 100%)',
  grr: 'Gross Revenue Retention : rétention pure sans expansion (max 100%)',
  // Subscriptions - Expansion & Contraction
  expansion_mrr: 'MRR additionnel gagné via upgrades de plan',
  contraction_mrr: 'MRR perdu via downgrades de plan (sans annulation)',
  expansion_rate: 'Pourcentage de clients ayant upgradé leur plan',
  upgrades_count: 'Nombre total d\'upgrades de plan sur la période',
  downgrades_count: 'Nombre total de downgrades de plan sur la période',
  // Subscriptions - Acquisition
  new_subscriptions: 'Nombre de nouveaux abonnements créés',
  new_mrr: 'MRR apporté par les nouveaux abonnés',
  paid_conversion: 'Pourcentage de clients convertis en abonnés payants',
  // Subscriptions - Advanced SaaS
  arpu_subscribers: 'Revenu moyen par abonné actif (MRR / abonnés)',
  ltv_mrr: 'Valeur vie client basée sur MRR (ARPU / churn rate mensuel)',
  quick_ratio: 'Ratio croissance saine = (New + Expansion) / (Churn + Contraction). > 4 excellent',
  payback_months: 'Nombre de mois pour récupérer le CAC (CAC / ARPU × marge)',
  magic_number: 'Efficacité commerciale = Net New ARR / Dépenses S&M trimestre précédent',
};

export const OBJECTIVE_TYPE_UNITS: Record<ObjectiveType, 'currency' | 'count' | 'percent'> = {
  // Financial
  revenue_total: 'currency',
  revenue_product: 'currency',
  revenue_category: 'currency',
  revenue_client: 'currency',
  revenue_segment: 'currency',
  expenses_total: 'currency',
  expenses_category: 'currency',
  gross_profit: 'currency',
  net_profit: 'currency',
  gross_margin_pct: 'percent',
  net_margin_pct: 'percent',
  // Clients - Acquisition
  new_clients_total: 'count',
  new_clients_segment: 'count',
  conversion_rate: 'percent',
  cac: 'currency',
  // Clients - Retention
  churn_rate: 'percent',
  retention_rate: 'percent',
  active_clients: 'count',
  avg_tenure: 'count', // months as count
  // Clients - Value
  arpu: 'currency',
  ltv: 'currency',
  ltv_cac_ratio: 'count', // ratio displayed as number (e.g., 3.5)
  avg_basket: 'currency',
  // Clients - Engagement
  active_ratio: 'percent',
  upsell_rate: 'percent',
  // Subscriptions - Recurring Revenue
  mrr_total: 'currency',
  arr_total: 'currency',
  mrr_growth_pct: 'percent',
  net_new_mrr: 'currency',
  // Subscriptions - Churn & Retention
  subscription_churn_rate: 'percent',
  mrr_churn: 'currency',
  mrr_churn_pct: 'percent',
  nrr: 'percent',
  grr: 'percent',
  // Subscriptions - Expansion & Contraction
  expansion_mrr: 'currency',
  contraction_mrr: 'currency',
  expansion_rate: 'percent',
  upgrades_count: 'count',
  downgrades_count: 'count',
  // Subscriptions - Acquisition
  new_subscriptions: 'count',
  new_mrr: 'currency',
  paid_conversion: 'percent',
  // Subscriptions - Advanced SaaS
  arpu_subscribers: 'currency',
  ltv_mrr: 'currency',
  quick_ratio: 'count', // ratio displayed as number (e.g., 4.2)
  payback_months: 'count', // months as count
  magic_number: 'count', // ratio displayed as number (e.g., 0.8)
};

export const OBJECTIVE_TYPE_BY_CATEGORY: Record<ObjectiveCategory, ObjectiveType[]> = {
  financial: [
    'revenue_total',
    'expenses_total',
    'gross_profit',
    'net_profit',
    'gross_margin_pct',
    'net_margin_pct',
  ],
  clients: [
    // Acquisition
    'new_clients_total',
    'new_clients_segment',
    'conversion_rate',
    'cac',
    // Retention
    'churn_rate',
    'retention_rate',
    'active_clients',
    'avg_tenure',
    // Value
    'arpu',
    'ltv',
    'ltv_cac_ratio',
    'avg_basket',
    // Engagement
    'active_ratio',
    'upsell_rate',
  ],
  subscriptions: [
    // Recurring Revenue
    'mrr_total',
    'arr_total',
    'mrr_growth_pct',
    'net_new_mrr',
    // Churn & Retention
    'subscription_churn_rate',
    'mrr_churn',
    'mrr_churn_pct',
    'nrr',
    'grr',
    // Expansion & Contraction
    'expansion_mrr',
    'contraction_mrr',
    'expansion_rate',
    'upgrades_count',
    'downgrades_count',
    // Acquisition
    'new_subscriptions',
    'new_mrr',
    'paid_conversion',
    // Advanced SaaS Metrics
    'arpu_subscribers',
    'ltv_mrr',
    'quick_ratio',
    'payback_months',
    'magic_number',
  ],
  products: [
    'revenue_product',
    'revenue_category',
    'expenses_category',
    'revenue_client',
    'revenue_segment',
  ],
};

export const OBJECTIVE_PERIOD_LABELS: Record<ObjectivePeriod, string> = {
  monthly: 'Mensuel',
  quarterly: 'Trimestriel',
  yearly: 'Annuel',
};

export const DISTRIBUTION_TYPE_LABELS: Record<DistributionType, string> = {
  linear: 'Linéaire',
  front_loaded: 'Début de période',
  back_loaded: 'Fin de période',
  custom: 'Personnalisé',
};

export const DISTRIBUTION_TYPE_DESCRIPTIONS: Record<DistributionType, string> = {
  linear: 'Progression régulière tout au long de la période',
  front_loaded: 'Plus de résultats attendus en début de période',
  back_loaded: 'Plus de résultats attendus en fin de période',
  custom: 'Définir des jalons personnalisés',
};

export const OBJECTIVE_STATUS_CONFIG: Record<ObjectiveStatus, { label: string; color: string; bgColor: string; borderColor: string }> = {
  achieved: { label: 'Atteint', color: 'text-emerald-400', bgColor: 'bg-emerald-500/20', borderColor: 'border-emerald-500/50' },
  on_track: { label: 'En bonne voie', color: 'text-blue-400', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-500/50' },
  at_risk: { label: 'À risque', color: 'text-amber-400', bgColor: 'bg-amber-500/20', borderColor: 'border-amber-500/50' },
  behind: { label: 'En retard', color: 'text-red-400', bgColor: 'bg-red-500/20', borderColor: 'border-red-500/50' },
  not_started: { label: 'Non commencé', color: 'text-zinc-400', bgColor: 'bg-zinc-500/20', borderColor: 'border-zinc-500/50' },
};

export const PRIORITY_CONFIG: Record<ObjectivePriority, { label: string; color: string; bgColor: string }> = {
  low: { label: 'Basse', color: 'text-zinc-400', bgColor: 'bg-zinc-500/20' },
  medium: { label: 'Moyenne', color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
  high: { label: 'Haute', color: 'text-amber-400', bgColor: 'bg-amber-500/20' },
  critical: { label: 'Critique', color: 'text-red-400', bgColor: 'bg-red-500/20' },
};

export const ALERT_SEVERITY_CONFIG: Record<AlertSeverity, { label: string; color: string; bgColor: string }> = {
  critical: { label: 'Critique', color: 'text-red-400', bgColor: 'bg-red-500/20' },
  warning: { label: 'Attention', color: 'text-amber-400', bgColor: 'bg-amber-500/20' },
  info: { label: 'Info', color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
};

export const COHERENCE_SEVERITY_CONFIG: Record<CoherenceSeverity, { label: string; color: string; bgColor: string; icon: string }> = {
  error: { label: 'Erreur', color: 'text-red-400', bgColor: 'bg-red-500/20', icon: 'XCircle' },
  warning: { label: 'Attention', color: 'text-amber-400', bgColor: 'bg-amber-500/20', icon: 'AlertTriangle' },
  info: { label: 'Info', color: 'text-blue-400', bgColor: 'bg-blue-500/20', icon: 'Info' },
};

export const MONTHS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

export const QUARTERS_FR = ['T1 (Jan-Mar)', 'T2 (Avr-Jun)', 'T3 (Jul-Sep)', 'T4 (Oct-Déc)'];

export const CLIENT_SEGMENTS = [
  { value: 'individual', label: 'Particulier' },
  { value: 'business', label: 'Professionnel' },
  { value: 'enterprise', label: 'Entreprise' },
] as const;

export const EXPENSE_CATEGORIES = [
  { value: 'salaries', label: 'Salaires' },
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'software', label: 'Logiciels & SaaS' },
  { value: 'office', label: 'Locaux & Bureau' },
  { value: 'legal', label: 'Juridique & Comptable' },
  { value: 'telecom', label: 'Télécoms' },
  { value: 'travel', label: 'Déplacements' },
  { value: 'training', label: 'Formation' },
  { value: 'other', label: 'Autres' },
] as const;

// ============================================================
// HELPERS
// ============================================================

export function getUnitSymbol(unit: 'currency' | 'count' | 'percent'): string {
  switch (unit) {
    case 'currency': return '€';
    case 'percent': return '%';
    case 'count': return '';
  }
}

export function formatObjectiveValue(value: number, unit: 'currency' | 'count' | 'percent'): string {
  switch (unit) {
    case 'currency':
      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M€`;
      if (value >= 1000) return `${(value / 1000).toFixed(1)}k€`;
      return `${value.toFixed(0)}€`;
    case 'percent':
      return `${value.toFixed(1)}%`;
    case 'count':
      return value.toFixed(0);
  }
}

export function getCategoryForType(type: ObjectiveType): ObjectiveCategory {
  for (const [category, types] of Object.entries(OBJECTIVE_TYPE_BY_CATEGORY)) {
    if (types.includes(type)) {
      return category as ObjectiveCategory;
    }
  }
  return 'financial';
}

export function requiresProductSelection(type: ObjectiveType): boolean {
  return type === 'revenue_product';
}

export function requiresCategorySelection(type: ObjectiveType): boolean {
  return type === 'revenue_category' || type === 'expenses_category';
}

export function requiresClientSelection(type: ObjectiveType): boolean {
  return type === 'revenue_client';
}

export function requiresSegmentSelection(type: ObjectiveType): boolean {
  return type === 'revenue_segment' || type === 'new_clients_segment';
}

// Helper to check if this is a client-category objective type
export function isClientObjectiveType(type: ObjectiveType): boolean {
  const clientTypes: ObjectiveType[] = [
    'new_clients_total', 'new_clients_segment', 'conversion_rate', 'cac',
    'churn_rate', 'retention_rate', 'active_clients', 'avg_tenure',
    'arpu', 'ltv', 'ltv_cac_ratio', 'avg_basket',
    'active_ratio', 'upsell_rate',
  ];
  return clientTypes.includes(type);
}

// Helper to check if this is a subscription-category objective type
export function isSubscriptionObjectiveType(type: ObjectiveType): boolean {
  const subscriptionTypes: ObjectiveType[] = [
    // Recurring Revenue
    'mrr_total', 'arr_total', 'mrr_growth_pct', 'net_new_mrr',
    // Churn & Retention
    'subscription_churn_rate', 'mrr_churn', 'mrr_churn_pct', 'nrr', 'grr',
    // Expansion & Contraction
    'expansion_mrr', 'contraction_mrr', 'expansion_rate', 'upgrades_count', 'downgrades_count',
    // Acquisition
    'new_subscriptions', 'new_mrr', 'paid_conversion',
    // Advanced SaaS Metrics
    'arpu_subscribers', 'ltv_mrr', 'quick_ratio', 'payback_months', 'magic_number',
  ];
  return subscriptionTypes.includes(type);
}

// Helper to check if objective type is "lower is better" (for status calculation)
export function isLowerBetterObjectiveType(type: ObjectiveType): boolean {
  const lowerBetterTypes: ObjectiveType[] = [
    // Client churn
    'churn_rate', 'cac',
    // Subscription churn
    'subscription_churn_rate', 'mrr_churn', 'mrr_churn_pct',
    'contraction_mrr', 'downgrades_count',
    // Expenses
    'expenses_total', 'expenses_category',
    // Payback (lower is better)
    'payback_months',
  ];
  return lowerBetterTypes.includes(type);
}
