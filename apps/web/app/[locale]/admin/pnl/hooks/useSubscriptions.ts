// /workspaces/website/apps/web/app/[locale]/admin/pnl/hooks/useSubscriptions.ts
// Description: Hook for managing subscriptions (CRUD operations + stats)
// Last modified: 2024-12-14

import { useState, useEffect, useCallback, useRef } from 'react';
import { getCompanyDb } from '../../../../../lib/firebase';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  limit,
  startAfter,
  getCountFromServer,
  QueryDocumentSnapshot,
  DocumentData,
  writeBatch,
} from 'firebase/firestore';
import type {
  Subscription,
  CreateSubscriptionData,
  UpdateSubscriptionData,
  SubscriptionStatus,
  SubscriptionCycle,
  SubscriptionStats,
} from '../types/subscription';
import {
  generateSubscriptionId,
  getSafeDayOfMonth,
  calculateFinalAmount,
  calculateNextRenewalDate,
} from '../types/subscription';

const PAGE_SIZE = 50;

// ============================================================
// TYPES
// ============================================================

type UseSubscriptionsOptions = {
  companyId: 'vmcloud' | 'hackboot';
  autoLoad?: boolean;
};

type UseSubscriptionsReturn = {
  // Data
  subscriptions: Subscription[];
  stats: SubscriptionStats;
  totalCount: number;
  hasMore: boolean;

  // State
  loading: boolean;
  error: string | null;
  deleting: boolean;
  deleteProgress: { current: number; total: number };

  // Actions
  loadSubscriptions: () => Promise<void>;
  loadMore: () => Promise<void>;
  loadAllForSync: () => Promise<Subscription[]>;
  refreshCount: () => Promise<void>;
  createSubscription: (data: CreateSubscriptionData) => Promise<Subscription>;
  updateSubscription: (id: string, data: UpdateSubscriptionData) => Promise<void>;
  deleteSubscription: (id: string) => Promise<void>;
  deleteAllSubscriptions: () => Promise<void>;
  pauseSubscription: (id: string) => Promise<void>;
  resumeSubscription: (id: string) => Promise<void>;
  cancelSubscription: (id: string, reason?: string) => Promise<void>;

  // Queries
  getSubscription: (id: string) => Subscription | undefined;
  getSubscriptionsByClient: (clientId: string) => Subscription[];
  getSubscriptionsByProduct: (productId: string) => Subscription[];
  getActiveSubscriptions: () => Subscription[];
  getSubscriptionsDueForRenewal: (asOfDate?: Date) => Subscription[];
};

// ============================================================
// HOOK
// ============================================================

export function useSubscriptions(options: UseSubscriptionsOptions): UseSubscriptionsReturn {
  const { companyId, autoLoad = true } = options;

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteProgress, setDeleteProgress] = useState({ current: 0, total: 0 });

  // Pagination cursor
  const lastDocRef = useRef<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // --------------------------------------------------------
  // REFRESH COUNT (without loading all docs)
  // --------------------------------------------------------
  const refreshCount = useCallback(async () => {
    try {
      const db = getCompanyDb(companyId);
      if (!db) return;

      const subsRef = collection(db, 'subscriptions');
      const countSnapshot = await getCountFromServer(query(subsRef));
      setTotalCount(countSnapshot.data().count);
    } catch (err) {
      console.error('Error getting count:', err);
    }
  }, [companyId]);

  // --------------------------------------------------------
  // LOAD ALL FOR SYNC (bypasses pagination, for sync only)
  // --------------------------------------------------------
  const loadAllForSync = useCallback(async (): Promise<Subscription[]> => {
    const db = getCompanyDb(companyId);
    if (!db) return [];

    try {
      const subsRef = collection(db, 'subscriptions');
      const q = query(subsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      const allSubs: Subscription[] = [];
      snapshot.forEach((docSnap) => {
        allSubs.push({ id: docSnap.id, ...docSnap.data() } as Subscription);
      });

      return allSubs;
    } catch (err) {
      console.error('Error loading all subscriptions for sync:', err);
      return [];
    }
  }, [companyId]);

  // --------------------------------------------------------
  // LOAD SUBSCRIPTIONS (paginated)
  // --------------------------------------------------------
  const loadSubscriptions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const db = getCompanyDb(companyId);
      if (!db) {
        throw new Error(`Database not available for ${companyId}`);
      }

      const subsRef = collection(db, 'subscriptions');

      // Get total count first
      const countSnapshot = await getCountFromServer(query(subsRef));
      setTotalCount(countSnapshot.data().count);

      // Load first page
      const q = query(subsRef, orderBy('createdAt', 'desc'), limit(PAGE_SIZE));
      const snapshot = await getDocs(q);

      const subs: Subscription[] = [];
      snapshot.forEach((docSnap) => {
        subs.push({ id: docSnap.id, ...docSnap.data() } as Subscription);
      });

      // Store last doc for pagination
      lastDocRef.current = snapshot.docs[snapshot.docs.length - 1] || null;
      setHasMore(snapshot.docs.length === PAGE_SIZE);

      setSubscriptions(subs);
    } catch (err) {
      console.error('Error loading subscriptions:', err);
      setError(err instanceof Error ? err.message : 'Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  // --------------------------------------------------------
  // LOAD MORE (pagination)
  // --------------------------------------------------------
  const loadMore = useCallback(async () => {
    if (!hasMore || loading || !lastDocRef.current) return;

    setLoading(true);

    try {
      const db = getCompanyDb(companyId);
      if (!db) return;

      const subsRef = collection(db, 'subscriptions');
      const q = query(
        subsRef,
        orderBy('createdAt', 'desc'),
        startAfter(lastDocRef.current),
        limit(PAGE_SIZE)
      );
      const snapshot = await getDocs(q);

      const newSubs: Subscription[] = [];
      snapshot.forEach((docSnap) => {
        newSubs.push({ id: docSnap.id, ...docSnap.data() } as Subscription);
      });

      lastDocRef.current = snapshot.docs[snapshot.docs.length - 1] || null;
      setHasMore(snapshot.docs.length === PAGE_SIZE);

      setSubscriptions((prev) => [...prev, ...newSubs]);
    } catch (err) {
      console.error('Error loading more:', err);
    } finally {
      setLoading(false);
    }
  }, [companyId, hasMore, loading]);

  // Auto-load on mount
  useEffect(() => {
    if (autoLoad) {
      loadSubscriptions();
    }
  }, [autoLoad, loadSubscriptions]);

  // --------------------------------------------------------
  // CREATE SUBSCRIPTION
  // --------------------------------------------------------
  const createSubscription = useCallback(async (data: CreateSubscriptionData): Promise<Subscription> => {
    const db = getCompanyDb(companyId);
    if (!db) {
      throw new Error(`Database not available for ${companyId}`);
    }

    const now = new Date().toISOString();
    const startDate = new Date(data.startDate);
    const dayOfMonth = getSafeDayOfMonth(startDate);
    const finalAmount = calculateFinalAmount(data.amount, data.discount);
    const nextRenewalDate = calculateNextRenewalDate(startDate, data.cycle, dayOfMonth);

    const subscription: Subscription = {
      id: generateSubscriptionId(),
      companyId: data.companyId,
      clientId: data.clientId,
      clientName: data.clientName,
      productCategoryId: data.productCategoryId,
      productCategoryLabel: data.productCategoryLabel,
      productId: data.productId,
      productLabel: data.productLabel,
      amount: data.amount,
      finalAmount,
      cycle: data.cycle,
      startDate: data.startDate,
      dayOfMonth,
      status: 'active',
      lastRenewalDate: data.startDate,
      nextRenewalDate: nextRenewalDate.toISOString().split('T')[0],
      renewalCount: 1, // Initial transaction counts as first renewal
      createdAt: now,
      updatedAt: now,
    };

    // Add optional fields only if they have values (Firebase doesn't accept undefined)
    if (data.clientEmail) subscription.clientEmail = data.clientEmail;
    if (data.discount !== undefined && data.discount > 0) subscription.discount = data.discount;
    if (data.endDate) subscription.endDate = data.endDate;
    if (data.note) subscription.note = data.note;

    const docRef = doc(db, 'subscriptions', subscription.id);
    await setDoc(docRef, subscription);

    setSubscriptions((prev) => [subscription, ...prev]);
    return subscription;
  }, [companyId]);

  // --------------------------------------------------------
  // UPDATE SUBSCRIPTION
  // --------------------------------------------------------
  const updateSubscription = useCallback(async (id: string, data: UpdateSubscriptionData): Promise<void> => {
    const db = getCompanyDb(companyId);
    if (!db) {
      throw new Error(`Database not available for ${companyId}`);
    }

    const updates: Partial<Subscription> = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    // Recalculate finalAmount if amount or discount changed
    if (data.amount !== undefined || data.discount !== undefined) {
      const current = subscriptions.find((s) => s.id === id);
      if (current) {
        const newAmount = data.amount ?? current.amount;
        const newDiscount = data.discount ?? current.discount;
        updates.finalAmount = calculateFinalAmount(newAmount, newDiscount);
      }
    }

    const docRef = doc(db, 'subscriptions', id);
    await setDoc(docRef, updates, { merge: true });

    setSubscriptions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  }, [companyId, subscriptions]);

  // --------------------------------------------------------
  // DELETE SUBSCRIPTION
  // --------------------------------------------------------
  const deleteSubscription = useCallback(async (id: string): Promise<void> => {
    const db = getCompanyDb(companyId);
    if (!db) {
      throw new Error(`Database not available for ${companyId}`);
    }

    const docRef = doc(db, 'subscriptions', id);
    await deleteDoc(docRef);

    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
    setTotalCount((prev) => Math.max(0, prev - 1));
  }, [companyId]);

  // --------------------------------------------------------
  // DELETE ALL SUBSCRIPTIONS (batch delete without loading all in memory)
  // --------------------------------------------------------
  const deleteAllSubscriptions = useCallback(async (): Promise<void> => {
    const db = getCompanyDb(companyId);
    if (!db) {
      throw new Error(`Database not available for ${companyId}`);
    }

    setDeleting(true);
    setDeleteProgress({ current: 0, total: totalCount });

    try {
      const subsRef = collection(db, 'subscriptions');
      let deleted = 0;

      // Delete in batches of 500 (Firebase limit)
      while (true) {
        const q = query(subsRef, limit(500));
        const snapshot = await getDocs(q);

        if (snapshot.empty) break;

        const batch = writeBatch(db);
        snapshot.docs.forEach((docSnap) => {
          batch.delete(docSnap.ref);
        });

        await batch.commit();
        deleted += snapshot.docs.length;
        setDeleteProgress({ current: deleted, total: totalCount });
      }

      setSubscriptions([]);
      setTotalCount(0);
      setHasMore(false);
      lastDocRef.current = null;
    } catch (err) {
      console.error('Error deleting all subscriptions:', err);
      throw err;
    } finally {
      setDeleting(false);
      setDeleteProgress({ current: 0, total: 0 });
    }
  }, [companyId, totalCount]);

  // --------------------------------------------------------
  // PAUSE SUBSCRIPTION
  // --------------------------------------------------------
  const pauseSubscription = useCallback(async (id: string): Promise<void> => {
    await updateSubscription(id, {
      status: 'paused',
      pausedAt: new Date().toISOString(),
    });
  }, [updateSubscription]);

  // --------------------------------------------------------
  // RESUME SUBSCRIPTION
  // --------------------------------------------------------
  const resumeSubscription = useCallback(async (id: string): Promise<void> => {
    const sub = subscriptions.find((s) => s.id === id);
    if (!sub) return;

    // Recalculate next renewal date from today
    const today = new Date();
    const nextRenewalDate = calculateNextRenewalDate(today, sub.cycle, sub.dayOfMonth);

    await updateSubscription(id, {
      status: 'active',
      pausedAt: undefined,
    });

    // Also update nextRenewalDate
    const db = getCompanyDb(companyId);
    if (db) {
      const docRef = doc(db, 'subscriptions', id);
      await setDoc(docRef, { nextRenewalDate: nextRenewalDate.toISOString().split('T')[0] }, { merge: true });

      setSubscriptions((prev) =>
        prev.map((s) =>
          s.id === id
            ? { ...s, status: 'active', pausedAt: undefined, nextRenewalDate: nextRenewalDate.toISOString().split('T')[0] }
            : s
        )
      );
    }
  }, [companyId, subscriptions, updateSubscription]);

  // --------------------------------------------------------
  // CANCEL SUBSCRIPTION
  // --------------------------------------------------------
  const cancelSubscription = useCallback(async (id: string, reason?: string): Promise<void> => {
    await updateSubscription(id, {
      status: 'cancelled',
      cancelledAt: new Date().toISOString(),
      cancelReason: reason,
    });
  }, [updateSubscription]);

  // --------------------------------------------------------
  // QUERIES
  // --------------------------------------------------------
  const getSubscription = useCallback((id: string): Subscription | undefined => {
    return subscriptions.find((s) => s.id === id);
  }, [subscriptions]);

  const getSubscriptionsByClient = useCallback((clientId: string): Subscription[] => {
    return subscriptions.filter((s) => s.clientId === clientId);
  }, [subscriptions]);

  const getSubscriptionsByProduct = useCallback((productId: string): Subscription[] => {
    return subscriptions.filter((s) => s.productId === productId);
  }, [subscriptions]);

  const getActiveSubscriptions = useCallback((): Subscription[] => {
    return subscriptions.filter((s) => s.status === 'active');
  }, [subscriptions]);

  const getSubscriptionsDueForRenewal = useCallback((asOfDate: Date = new Date()): Subscription[] => {
    return subscriptions.filter((s) => {
      if (s.status !== 'active') return false;
      const nextRenewal = new Date(s.nextRenewalDate);
      return nextRenewal <= asOfDate;
    });
  }, [subscriptions]);

  // --------------------------------------------------------
  // STATS (based on loaded subscriptions, not total)
  // --------------------------------------------------------
  const stats: SubscriptionStats = {
    total: totalCount, // Use server count for total
    active: subscriptions.filter((s) => s.status === 'active').length,
    paused: subscriptions.filter((s) => s.status === 'paused').length,
    cancelled: subscriptions.filter((s) => s.status === 'cancelled').length,
    expired: subscriptions.filter((s) => s.status === 'expired').length,
    mrr: subscriptions
      .filter((s) => s.status === 'active')
      .reduce((sum, s) => {
        if (s.cycle === 'monthly') return sum + s.finalAmount;
        if (s.cycle === 'annual') return sum + s.finalAmount / 12;
        return sum;
      }, 0),
    arr: 0, // Will be calculated below
  };
  stats.arr = stats.mrr * 12;

  // --------------------------------------------------------
  // RETURN
  // --------------------------------------------------------
  return {
    subscriptions,
    stats,
    totalCount,
    hasMore,
    loading,
    error,
    deleting,
    deleteProgress,
    loadSubscriptions,
    loadMore,
    loadAllForSync,
    refreshCount,
    createSubscription,
    updateSubscription,
    deleteSubscription,
    deleteAllSubscriptions,
    pauseSubscription,
    resumeSubscription,
    cancelSubscription,
    getSubscription,
    getSubscriptionsByClient,
    getSubscriptionsByProduct,
    getActiveSubscriptions,
    getSubscriptionsDueForRenewal,
  };
}

export default useSubscriptions;
