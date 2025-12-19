// /workspaces/website/apps/web/app/[locale]/admin/pnl/types/subscription.ts
// Description: Subscription type definitions for recurring transactions
// Last modified: 2024-12-14

// ============================================================
// SUBSCRIPTION TYPES
// ============================================================

export type SubscriptionCycle = 'monthly' | 'annual';

export type SubscriptionStatus = 'active' | 'paused' | 'cancelled' | 'expired';

export type Subscription = {
  id: string;                    // sub_xxx

  // Company
  companyId: 'vmcloud' | 'hackboot';

  // Client reference
  clientId: string;
  clientName: string;
  clientEmail?: string;

  // Product reference
  productCategoryId: string;
  productCategoryLabel: string;
  productId: string;
  productLabel: string;

  // Pricing
  amount: number;                // Prix par période (avant remise)
  discount?: number;             // Remise appliquée par période
  finalAmount: number;           // amount - discount

  // Cycle configuration
  cycle: SubscriptionCycle;
  startDate: string;             // ISO date (ex: "2024-12-14")
  endDate?: string;              // ISO date si date de fin prévue
  dayOfMonth: number;            // Jour de renouvellement (1-28)

  // Status
  status: SubscriptionStatus;
  pausedAt?: string;
  cancelledAt?: string;
  cancelReason?: string;

  // Renewal tracking
  lastRenewalDate: string;       // Dernière date de renouvellement effectuée
  nextRenewalDate: string;       // Prochaine date prévue
  renewalCount: number;          // Nombre de renouvellements effectués (incluant création initiale)

  // Metadata
  createdAt: string;
  updatedAt: string;
  note?: string;
};

// ============================================================
// CREATE/UPDATE TYPES
// ============================================================

export type CreateSubscriptionData = {
  companyId: 'vmcloud' | 'hackboot';
  clientId: string;
  clientName: string;
  clientEmail?: string;
  productCategoryId: string;
  productCategoryLabel: string;
  productId: string;
  productLabel: string;
  amount: number;
  discount?: number;
  cycle: SubscriptionCycle;
  startDate: string;
  endDate?: string;
  note?: string;
};

export type UpdateSubscriptionData = Partial<{
  amount: number;
  discount: number;
  cycle: SubscriptionCycle;
  endDate: string;
  status: SubscriptionStatus;
  pausedAt: string;
  cancelledAt: string;
  cancelReason: string;
  note: string;
}>;

// ============================================================
// STATS TYPES
// ============================================================

export type SubscriptionStats = {
  total: number;
  active: number;
  paused: number;
  cancelled: number;
  expired: number;
  mrr: number;    // Monthly Recurring Revenue
  arr: number;    // Annual Recurring Revenue
};

// ============================================================
// RENEWAL TYPES
// ============================================================

export type RenewalResult = {
  subscriptionId: string;
  renewalDate: string;
  monthKey: string;            // 'jan', 'feb', etc.
  year: number;
  transactionId: string;
  amount: number;
};

export type SyncResult = {
  processed: number;
  renewalsCreated: RenewalResult[];
  errors: Array<{ subscriptionId: string; error: string }>;
  expiredSubscriptions: string[];
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Generate a unique subscription ID
 */
export const generateSubscriptionId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 9);
  return `sub_${timestamp}${random}`;
};

/**
 * Get day of month, capped at 28 to avoid issues with short months
 */
export const getSafeDayOfMonth = (date: Date): number => {
  return Math.min(date.getDate(), 28);
};

/**
 * Calculate the final amount (after discount)
 */
export const calculateFinalAmount = (amount: number, discount?: number): number => {
  return amount - (discount || 0);
};

/**
 * Check if a subscription is due for renewal
 */
export const isRenewalDue = (subscription: Subscription, asOfDate: Date = new Date()): boolean => {
  if (subscription.status !== 'active') return false;
  const nextRenewal = new Date(subscription.nextRenewalDate);
  return nextRenewal <= asOfDate;
};

/**
 * Calculate next renewal date from a given date
 */
export const calculateNextRenewalDate = (
  fromDate: Date,
  cycle: SubscriptionCycle,
  dayOfMonth: number
): Date => {
  const next = new Date(fromDate);

  if (cycle === 'monthly') {
    next.setMonth(next.getMonth() + 1);
  } else {
    next.setFullYear(next.getFullYear() + 1);
  }

  // Set day of month, handling months with fewer days
  const maxDay = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
  next.setDate(Math.min(dayOfMonth, maxDay));

  return next;
};

/**
 * Get month key from date
 */
export const getMonthKeyFromDate = (date: Date): string => {
  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  return months[date.getMonth()];
};

/**
 * Format subscription cycle for display
 */
export const formatCycle = (cycle: SubscriptionCycle): string => {
  return cycle === 'monthly' ? 'Mensuel' : 'Annuel';
};

/**
 * Format subscription status for display
 */
export const formatStatus = (status: SubscriptionStatus): string => {
  const labels: Record<SubscriptionStatus, string> = {
    active: 'Actif',
    paused: 'En pause',
    cancelled: 'Résilié',
    expired: 'Expiré',
  };
  return labels[status];
};

/**
 * Get status color for UI
 */
export const getStatusColor = (status: SubscriptionStatus): string => {
  const colors: Record<SubscriptionStatus, string> = {
    active: 'text-emerald-400',
    paused: 'text-amber-400',
    cancelled: 'text-red-400',
    expired: 'text-zinc-500',
  };
  return colors[status];
};
