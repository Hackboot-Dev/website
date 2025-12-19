// /workspaces/website/apps/web/app/[locale]/admin/pnl/utils/renewalEngine.ts
// Description: Renewal engine for subscription-based transactions
// Last modified: 2024-12-14

import type { Subscription, RenewalResult, SyncResult } from '../types/subscription';
import {
  calculateNextRenewalDate,
  getMonthKeyFromDate,
  isRenewalDue,
} from '../types/subscription';
import type { PnLData, Transaction, ProductCategory } from '../types';

// ============================================================
// TYPES
// ============================================================

export type RenewalEngineConfig = {
  asOfDate?: Date;           // Date to use for renewal calculation (default: now)
  dryRun?: boolean;          // If true, don't actually create transactions
  maxRenewalsPerSub?: number; // Max renewals to process per subscription (safety)
};

export type PendingRenewal = {
  subscription: Subscription;
  renewalDate: Date;
  monthKey: string;
  year: number;
};

// ============================================================
// HELPERS
// ============================================================

/**
 * Generate a unique transaction ID
 */
export const generateTransactionId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 7);
  return `tx_${timestamp}${random}`;
};

/**
 * Get all pending renewals for a subscription up to a given date
 * Starts from nextRenewalDate (for new renewals only)
 */
export const getPendingRenewals = (
  subscription: Subscription,
  asOfDate: Date,
  maxRenewals: number = 24 // Safety limit: max 2 years of monthly renewals
): PendingRenewal[] => {
  if (subscription.status !== 'active') return [];

  // Check if subscription has ended
  if (subscription.endDate) {
    const endDate = new Date(subscription.endDate);
    if (endDate < asOfDate) return [];
  }

  const renewals: PendingRenewal[] = [];
  let currentRenewalDate = new Date(subscription.nextRenewalDate);
  let count = 0;

  while (currentRenewalDate <= asOfDate && count < maxRenewals) {
    // Check if past end date
    if (subscription.endDate) {
      const endDate = new Date(subscription.endDate);
      if (currentRenewalDate > endDate) break;
    }

    const monthKey = getMonthKeyFromDate(currentRenewalDate);
    const year = currentRenewalDate.getFullYear();

    renewals.push({
      subscription,
      renewalDate: new Date(currentRenewalDate),
      monthKey,
      year,
    });

    // Calculate next renewal
    currentRenewalDate = calculateNextRenewalDate(
      currentRenewalDate,
      subscription.cycle,
      subscription.dayOfMonth
    );
    count++;
  }

  return renewals;
};

/**
 * Get ALL renewals since startDate (for gap detection / guard-rail)
 * This finds missing transactions that may have been deleted
 */
export const getAllRenewalsSinceStart = (
  subscription: Subscription,
  asOfDate: Date,
  maxRenewals: number = 48 // Safety limit: max 4 years of monthly renewals
): PendingRenewal[] => {
  if (subscription.status !== 'active') return [];

  // Check if subscription has ended
  if (subscription.endDate) {
    const endDate = new Date(subscription.endDate);
    if (endDate < asOfDate) return [];
  }

  const renewals: PendingRenewal[] = [];
  let currentRenewalDate = new Date(subscription.startDate);
  let count = 0;

  // Start from startDate and generate all expected renewals
  while (currentRenewalDate <= asOfDate && count < maxRenewals) {
    // Check if past end date
    if (subscription.endDate) {
      const endDate = new Date(subscription.endDate);
      if (currentRenewalDate > endDate) break;
    }

    const monthKey = getMonthKeyFromDate(currentRenewalDate);
    const year = currentRenewalDate.getFullYear();

    renewals.push({
      subscription,
      renewalDate: new Date(currentRenewalDate),
      monthKey,
      year,
    });

    // Calculate next renewal
    currentRenewalDate = calculateNextRenewalDate(
      currentRenewalDate,
      subscription.cycle,
      subscription.dayOfMonth
    );
    count++;
  }

  return renewals;
};

/**
 * Check if a transaction already exists for a subscription in a given month/year
 */
export const transactionExists = (
  pnlData: PnLData,
  subscriptionId: string,
  monthKey: string,
  productCategoryId: string,
  productId: string
): boolean => {
  const category = pnlData.productCategories.find((c) => c.id === productCategoryId);
  if (!category) return false;

  const product = category.products.find((p) => p.id === productId);
  if (!product) return false;

  const transactions = product.transactions?.[monthKey] || [];
  return transactions.some(
    (tx) => tx.subscriptionId === subscriptionId && tx.renewalDate?.startsWith(String(pnlData.year))
  );
};

/**
 * Create a transaction from a pending renewal
 */
export const createTransactionFromRenewal = (renewal: PendingRenewal): Transaction => {
  const { subscription, renewalDate } = renewal;

  return {
    id: generateTransactionId(),
    amount: subscription.finalAmount,
    isCustom: false,
    clientId: subscription.clientId,
    clientName: subscription.clientName,
    clientEmail: subscription.clientEmail,
    discount: subscription.discount,
    subscriptionId: subscription.id,
    renewalDate: renewalDate.toISOString().split('T')[0],
    isRecurring: true,
    note: `Renouvellement auto - ${subscription.productLabel}`,
  };
};

// ============================================================
// MAIN ENGINE
// ============================================================

/**
 * Process all pending renewals for subscriptions
 * Returns the updated P&L data and sync results
 */
export const processRenewals = (
  subscriptions: Subscription[],
  pnlData: PnLData,
  config: RenewalEngineConfig = {}
): { updatedPnlData: PnLData; syncResult: SyncResult; subscriptionUpdates: Map<string, Partial<Subscription>> } => {
  const {
    asOfDate = new Date(),
    dryRun = false,
    maxRenewalsPerSub = 24,
  } = config;

  const syncResult: SyncResult = {
    processed: 0,
    renewalsCreated: [],
    errors: [],
    expiredSubscriptions: [],
  };

  // Track subscription updates (for updating Firestore later)
  const subscriptionUpdates = new Map<string, Partial<Subscription>>();

  // Clone P&L data for modifications
  let updatedPnlData: PnLData = JSON.parse(JSON.stringify(pnlData));

  // Only process subscriptions for the P&L year
  const targetYear = pnlData.year;

  for (const subscription of subscriptions) {
    if (subscription.status !== 'active') continue;

    // Check if subscription has expired
    if (subscription.endDate) {
      const endDate = new Date(subscription.endDate);
      if (endDate < asOfDate) {
        syncResult.expiredSubscriptions.push(subscription.id);
        subscriptionUpdates.set(subscription.id, { status: 'expired' });
        continue;
      }
    }

    try {
      // Use getAllRenewalsSinceStart to detect missing transactions (guard-rail)
      // This catches any gaps where transactions were deleted after sync
      const allRenewals = getAllRenewalsSinceStart(subscription, asOfDate, maxRenewalsPerSub);

      // Filter renewals for the target year only
      const yearRenewals = allRenewals.filter((r) => r.year === targetYear);

      for (const renewal of yearRenewals) {
        // Check if transaction already exists
        if (transactionExists(
          updatedPnlData,
          subscription.id,
          renewal.monthKey,
          subscription.productCategoryId,
          subscription.productId
        )) {
          continue; // Skip - already processed
        }

        // Find or create the product category and product
        let categoryIndex = updatedPnlData.productCategories.findIndex(
          (c) => c.id === subscription.productCategoryId
        );

        if (categoryIndex === -1) {
          // Category doesn't exist - log error
          syncResult.errors.push({
            subscriptionId: subscription.id,
            error: `Category ${subscription.productCategoryId} not found`,
          });
          continue;
        }

        let productIndex = updatedPnlData.productCategories[categoryIndex].products.findIndex(
          (p) => p.id === subscription.productId
        );

        if (productIndex === -1) {
          // Product doesn't exist - log error
          syncResult.errors.push({
            subscriptionId: subscription.id,
            error: `Product ${subscription.productId} not found in category ${subscription.productCategoryId}`,
          });
          continue;
        }

        if (!dryRun) {
          // Create the transaction
          const transaction = createTransactionFromRenewal(renewal);

          // Initialize transactions object if needed
          if (!updatedPnlData.productCategories[categoryIndex].products[productIndex].transactions) {
            updatedPnlData.productCategories[categoryIndex].products[productIndex].transactions = {};
          }

          // Initialize month array if needed
          if (!updatedPnlData.productCategories[categoryIndex].products[productIndex].transactions[renewal.monthKey]) {
            updatedPnlData.productCategories[categoryIndex].products[productIndex].transactions[renewal.monthKey] = [];
          }

          // Add transaction
          updatedPnlData.productCategories[categoryIndex].products[productIndex].transactions[renewal.monthKey].push(
            transaction
          );

          // Add discount to reductions if applicable
          if (subscription.discount && subscription.discount > 0) {
            if (!updatedPnlData.reductions.salesDiscounts[renewal.monthKey]) {
              updatedPnlData.reductions.salesDiscounts[renewal.monthKey] = 0;
            }
            updatedPnlData.reductions.salesDiscounts[renewal.monthKey] += subscription.discount;
          }

          syncResult.renewalsCreated.push({
            subscriptionId: subscription.id,
            renewalDate: renewal.renewalDate.toISOString().split('T')[0],
            monthKey: renewal.monthKey,
            year: renewal.year,
            transactionId: transaction.id,
            amount: transaction.amount,
          });
        }

        syncResult.processed++;
      }

      // Update subscription with latest renewal info (only if we created transactions)
      if (syncResult.renewalsCreated.length > 0 && !dryRun) {
        const lastRenewal = allRenewals[allRenewals.length - 1];
        const nextRenewalDate = calculateNextRenewalDate(
          lastRenewal.renewalDate,
          subscription.cycle,
          subscription.dayOfMonth
        );

        subscriptionUpdates.set(subscription.id, {
          lastRenewalDate: lastRenewal.renewalDate.toISOString().split('T')[0],
          nextRenewalDate: nextRenewalDate.toISOString().split('T')[0],
          renewalCount: allRenewals.length, // Total renewals since start
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      syncResult.errors.push({
        subscriptionId: subscription.id,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }

  // Update timestamp
  if (!dryRun && syncResult.renewalsCreated.length > 0) {
    updatedPnlData.updatedAt = new Date().toISOString();
  }

  return { updatedPnlData, syncResult, subscriptionUpdates };
};

/**
 * Get summary of pending renewals without processing (uses guard-rail)
 */
export const getPendingRenewalsSummary = (
  subscriptions: Subscription[],
  pnlData: PnLData,
  asOfDate: Date = new Date()
): { totalPending: number; totalAmount: number; byMonth: Record<string, number> } => {
  const summary = {
    totalPending: 0,
    totalAmount: 0,
    byMonth: {} as Record<string, number>,
  };

  const targetYear = pnlData.year;

  for (const subscription of subscriptions) {
    if (subscription.status !== 'active') continue;

    // Use getAllRenewalsSinceStart to detect all missing (guard-rail)
    const allRenewals = getAllRenewalsSinceStart(subscription, asOfDate);
    const yearRenewals = allRenewals.filter((r) => r.year === targetYear);

    for (const renewal of yearRenewals) {
      // Check if already exists
      if (!transactionExists(
        pnlData,
        subscription.id,
        renewal.monthKey,
        subscription.productCategoryId,
        subscription.productId
      )) {
        summary.totalPending++;
        summary.totalAmount += subscription.finalAmount;
        summary.byMonth[renewal.monthKey] = (summary.byMonth[renewal.monthKey] || 0) + subscription.finalAmount;
      }
    }
  }

  return summary;
};

/**
 * Preview what renewals would be created (uses guard-rail to detect gaps)
 */
export const previewRenewals = (
  subscriptions: Subscription[],
  pnlData: PnLData,
  asOfDate: Date = new Date()
): PendingRenewal[] => {
  const allPending: PendingRenewal[] = [];
  const targetYear = pnlData.year;

  for (const subscription of subscriptions) {
    if (subscription.status !== 'active') continue;

    // Use getAllRenewalsSinceStart to detect all missing transactions (guard-rail)
    const allRenewals = getAllRenewalsSinceStart(subscription, asOfDate);
    const yearRenewals = allRenewals.filter((r) => r.year === targetYear);

    for (const renewal of yearRenewals) {
      if (!transactionExists(
        pnlData,
        subscription.id,
        renewal.monthKey,
        subscription.productCategoryId,
        subscription.productId
      )) {
        allPending.push(renewal);
      }
    }
  }

  return allPending;
};

export default {
  processRenewals,
  getPendingRenewalsSummary,
  previewRenewals,
  getPendingRenewals,
  getAllRenewalsSinceStart,
  createTransactionFromRenewal,
  generateTransactionId,
};
