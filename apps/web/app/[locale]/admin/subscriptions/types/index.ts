// /workspaces/website/apps/web/app/[locale]/admin/subscriptions/types/index.ts
// Description: Type definitions for the Subscriptions module
// Last modified: 2025-12-19

// ============================================================
// BILLING TYPES
// ============================================================

export type BillingPeriod = 'monthly' | 'quarterly' | 'yearly';

export type SubscriptionStatus = 'trial' | 'active' | 'paused' | 'cancelled' | 'expired' | 'past_due';

export type EventType =
  | 'created'
  | 'activated'
  | 'trial_started'
  | 'trial_ended'
  | 'upgraded'
  | 'downgraded'
  | 'price_changed'
  | 'paused'
  | 'resumed'
  | 'cancelled'
  | 'cancel_scheduled'
  | 'renewed'
  | 'expired'
  | 'payment_failed'
  | 'payment_succeeded';

// ============================================================
// SUBSCRIPTION PLAN
// ============================================================

export type SubscriptionPlan = {
  id: string;
  companyId: string;

  // Basic info
  name: string;
  description?: string;

  // Pricing
  price: number;
  currency: string;
  billingPeriod: BillingPeriod;
  billingPeriodCount: number;

  // Trial
  trialDays: number;

  // Product link
  productId?: string;

  // Features
  features: string[];

  // Limits
  maxUsers?: number;
  maxStorageGb?: number;

  // Status
  isActive: boolean;
  sortOrder: number;

  // Metadata
  metadata: Record<string, unknown>;

  createdAt: string;
  updatedAt: string;
};

export type CreateSubscriptionPlan = Omit<SubscriptionPlan, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateSubscriptionPlan = Partial<Omit<SubscriptionPlan, 'id' | 'companyId' | 'createdAt'>>;

// ============================================================
// SUBSCRIPTION
// ============================================================

export type Subscription = {
  id: string;
  companyId: string;
  clientId: string;
  planId?: string;

  // Status
  status: SubscriptionStatus;

  // Dates
  startedAt: string;
  trialEndsAt?: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelledAt?: string;
  cancelAtPeriodEnd: boolean;
  pausedAt?: string;
  endedAt?: string;

  // Pricing
  price: number;
  currency: string;
  billingPeriod: BillingPeriod;
  discountPercent: number;

  // Billing
  nextInvoiceAt?: string;
  lastInvoiceId?: string;

  // Metadata
  cancelReason?: string;
  pauseReason?: string;
  notes?: string;
  metadata: Record<string, unknown>;

  createdAt: string;
  updatedAt: string;

  // Relations (populated by joins)
  client?: {
    id: string;
    name: string;
    email: string;
    company?: string;
  };
  plan?: SubscriptionPlan;
};

export type CreateSubscription = {
  companyId: string;
  clientId: string;
  planId?: string;
  status?: SubscriptionStatus;
  startedAt?: string;
  trialEndsAt?: string;
  currentPeriodEnd: string;
  price: number;
  currency?: string;
  billingPeriod: BillingPeriod;
  discountPercent?: number;
  notes?: string;
  metadata?: Record<string, unknown>;
};

export type UpdateSubscription = Partial<{
  planId: string;
  status: SubscriptionStatus;
  trialEndsAt: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelledAt: string;
  cancelAtPeriodEnd: boolean;
  pausedAt: string;
  endedAt: string;
  price: number;
  discountPercent: number;
  nextInvoiceAt: string;
  cancelReason: string;
  pauseReason: string;
  notes: string;
  metadata: Record<string, unknown>;
}>;

// ============================================================
// SUBSCRIPTION EVENT
// ============================================================

export type SubscriptionEvent = {
  id: string;
  subscriptionId: string;

  eventType: EventType;

  // Changes
  oldPlanId?: string;
  newPlanId?: string;
  oldPrice?: number;
  newPrice?: number;

  // Context
  reason?: string;
  performedBy?: string;

  metadata: Record<string, unknown>;
  createdAt: string;
};

export type CreateSubscriptionEvent = {
  subscriptionId: string;
  eventType: EventType;
  oldPlanId?: string;
  newPlanId?: string;
  oldPrice?: number;
  newPrice?: number;
  reason?: string;
  performedBy?: string;
  metadata?: Record<string, unknown>;
};

// ============================================================
// METRICS
// ============================================================

export type SubscriptionMetrics = {
  totalSubscriptions: number;
  activeSubscriptions: number;
  trialSubscriptions: number;
  pausedSubscriptions: number;
  cancelledThisMonth: number;
  mrr: number;  // Monthly Recurring Revenue
  arr: number;  // Annual Recurring Revenue
};

export type ChurnMetrics = {
  rate: number;           // % of churned subscriptions
  count: number;          // Number of churned subscriptions
  revenue: number;        // MRR lost to churn
  reasons: {
    reason: string;
    count: number;
  }[];
};

export type GrowthMetrics = {
  newMrr: number;         // New subscriptions MRR
  expansionMrr: number;   // Upgrades MRR
  contractionMrr: number; // Downgrades MRR
  churnMrr: number;       // Lost MRR
  netMrr: number;         // Net change
};

// ============================================================
// FILTERS
// ============================================================

export type SubscriptionFilters = {
  status?: SubscriptionStatus | SubscriptionStatus[];
  planId?: string;
  clientId?: string;
  billingPeriod?: BillingPeriod;
  search?: string;
  startDateFrom?: string;
  startDateTo?: string;
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export const generateSubscriptionId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 9);
  return `sub_${timestamp}${random}`;
};

export const generatePlanId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 9);
  return `plan_${timestamp}${random}`;
};

export const generateEventId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 9);
  return `evt_${timestamp}${random}`;
};

export const formatBillingPeriod = (period: BillingPeriod): string => {
  const labels: Record<BillingPeriod, string> = {
    monthly: 'Mensuel',
    quarterly: 'Trimestriel',
    yearly: 'Annuel',
  };
  return labels[period];
};

export const formatStatus = (status: SubscriptionStatus): string => {
  const labels: Record<SubscriptionStatus, string> = {
    trial: 'Essai',
    active: 'Actif',
    paused: 'En pause',
    cancelled: 'Résilié',
    expired: 'Expiré',
    past_due: 'Impayé',
  };
  return labels[status];
};

export const getStatusColor = (status: SubscriptionStatus): string => {
  const colors: Record<SubscriptionStatus, string> = {
    trial: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    active: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    paused: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    cancelled: 'text-red-400 bg-red-400/10 border-red-400/20',
    expired: 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20',
    past_due: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  };
  return colors[status];
};

export const getEventTypeLabel = (eventType: EventType): string => {
  const labels: Record<EventType, string> = {
    created: 'Créé',
    activated: 'Activé',
    trial_started: 'Essai démarré',
    trial_ended: 'Essai terminé',
    upgraded: 'Mis à niveau',
    downgraded: 'Rétrogradé',
    price_changed: 'Prix modifié',
    paused: 'Mis en pause',
    resumed: 'Repris',
    cancelled: 'Résilié',
    cancel_scheduled: 'Résiliation programmée',
    renewed: 'Renouvelé',
    expired: 'Expiré',
    payment_failed: 'Paiement échoué',
    payment_succeeded: 'Paiement réussi',
  };
  return labels[eventType];
};

export const calculateMonthlyPrice = (price: number, billingPeriod: BillingPeriod, discountPercent: number = 0): number => {
  const discountedPrice = price * (1 - discountPercent / 100);
  switch (billingPeriod) {
    case 'monthly':
      return discountedPrice;
    case 'quarterly':
      return discountedPrice / 3;
    case 'yearly':
      return discountedPrice / 12;
    default:
      return discountedPrice;
  }
};

export const calculateNextPeriodEnd = (currentEnd: Date, billingPeriod: BillingPeriod): Date => {
  const next = new Date(currentEnd);
  switch (billingPeriod) {
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      break;
    case 'quarterly':
      next.setMonth(next.getMonth() + 3);
      break;
    case 'yearly':
      next.setFullYear(next.getFullYear() + 1);
      break;
  }
  return next;
};

export const isTrialExpired = (subscription: Subscription): boolean => {
  if (subscription.status !== 'trial' || !subscription.trialEndsAt) return false;
  return new Date(subscription.trialEndsAt) < new Date();
};

export const daysUntilRenewal = (subscription: Subscription): number => {
  const end = new Date(subscription.currentPeriodEnd);
  const now = new Date();
  const diffTime = end.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
