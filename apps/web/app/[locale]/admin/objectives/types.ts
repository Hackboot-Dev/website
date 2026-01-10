// /workspaces/website/apps/web/app/[locale]/admin/objectives/types.ts
// Description: Comprehensive types for business objectives, validation and coherence checking
// Last modified: 2026-01-10

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

  // Clients
  | 'clients_total'       // Nombre total de clients actifs
  | 'clients_new'         // Nouveaux clients (acquisition)
  | 'clients_retention'   // Taux de rétention %
  | 'clients_segment'     // Clients par segment

  // Subscriptions
  | 'mrr_total'           // MRR total
  | 'mrr_growth'          // Croissance MRR %
  | 'arr_total'           // ARR total
  | 'churn_rate'          // Taux de churn %
  | 'arpu';               // Average Revenue Per User

export type ObjectivePeriod = 'monthly' | 'quarterly' | 'yearly';

export type ObjectiveStatus = 'achieved' | 'on_track' | 'at_risk' | 'behind' | 'not_started';

export type ObjectivePriority = 'low' | 'medium' | 'high' | 'critical';

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
  subscriptions: 'MRR, ARR, churn et croissance',
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
  // Clients
  clients_total: 'Clients actifs',
  clients_new: 'Nouveaux clients',
  clients_retention: 'Taux de rétention',
  clients_segment: 'Clients par segment',
  // Subscriptions
  mrr_total: 'MRR total',
  mrr_growth: 'Croissance MRR',
  arr_total: 'ARR total',
  churn_rate: 'Taux de churn',
  arpu: 'ARPU',
};

export const OBJECTIVE_TYPE_DESCRIPTIONS: Record<ObjectiveType, string> = {
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
  clients_total: 'Nombre de clients actifs',
  clients_new: 'Nouveaux clients acquis sur la période',
  clients_retention: 'Pourcentage de clients conservés',
  clients_segment: 'Nombre de clients par segment',
  mrr_total: 'Revenu mensuel récurrent total',
  mrr_growth: 'Croissance du MRR en pourcentage',
  arr_total: 'Revenu annuel récurrent (MRR × 12)',
  churn_rate: 'Taux de résiliation des abonnements',
  arpu: 'Revenu moyen par utilisateur',
};

export const OBJECTIVE_TYPE_UNITS: Record<ObjectiveType, 'currency' | 'count' | 'percent'> = {
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
  clients_total: 'count',
  clients_new: 'count',
  clients_retention: 'percent',
  clients_segment: 'count',
  mrr_total: 'currency',
  mrr_growth: 'percent',
  arr_total: 'currency',
  churn_rate: 'percent',
  arpu: 'currency',
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
    'clients_total',
    'clients_new',
    'clients_retention',
    'clients_segment',
  ],
  subscriptions: [
    'mrr_total',
    'mrr_growth',
    'arr_total',
    'churn_rate',
    'arpu',
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
  return type === 'revenue_segment' || type === 'clients_segment';
}
