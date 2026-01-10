// /workspaces/website/apps/web/app/[locale]/admin/pnl/hooks/useSubscriptions.ts
// Description: Hook for managing subscriptions (CRUD operations + stats) - Supabase version
// Last modified: 2025-01-10
// Migrated from Firebase to Supabase

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../../../../../lib/supabase';
import type {
  Subscription,
  CreateSubscriptionData,
  UpdateSubscriptionData,
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
// HELPER: Map DB row to Subscription type
// ============================================================

interface SubscriptionRow {
  id: string;
  company_id: string;
  client_id: string | null;
  product_id: string | null;
  name: string;
  unit_price: number;
  quantity: number;
  billing_period: 'hourly' | 'daily' | 'monthly' | 'yearly';
  status: 'active' | 'paused' | 'cancelled' | 'expired';
  start_date: string;
  end_date: string | null;
  next_billing_date: string | null;
  last_billed_date: string | null;
  created_at: string;
  updated_at: string;
  metadata: Record<string, unknown> | null;
}

const mapRowToSubscription = (row: SubscriptionRow): Subscription => {
  const metadata = row.metadata || {};
  return {
    id: row.id,
    companyId: row.company_id as 'vmcloud' | 'hackboot',
    clientId: row.client_id || '',
    clientName: (metadata.clientName as string) || '',
    clientEmail: (metadata.clientEmail as string) || undefined,
    productCategoryId: (metadata.productCategoryId as string) || '',
    productCategoryLabel: (metadata.productCategoryLabel as string) || '',
    productId: row.product_id || '',
    productLabel: row.name,
    amount: row.unit_price * row.quantity,
    discount: (metadata.discount as number) || undefined,
    finalAmount: row.unit_price * row.quantity - ((metadata.discount as number) || 0),
    cycle: row.billing_period === 'yearly' ? 'annual' : 'monthly',
    startDate: row.start_date,
    endDate: row.end_date || undefined,
    dayOfMonth: (metadata.dayOfMonth as number) || new Date(row.start_date).getDate(),
    status: row.status,
    pausedAt: (metadata.pausedAt as string) || undefined,
    cancelledAt: (metadata.cancelledAt as string) || undefined,
    cancelReason: (metadata.cancelReason as string) || undefined,
    lastRenewalDate: row.last_billed_date || row.start_date,
    nextRenewalDate: row.next_billing_date || row.start_date,
    renewalCount: (metadata.renewalCount as number) || 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    note: (metadata.note as string) || undefined,
  };
};

const mapSubscriptionToRow = (sub: Subscription): Partial<SubscriptionRow> => {
  return {
    id: sub.id,
    company_id: sub.companyId,
    client_id: sub.clientId || null,
    product_id: sub.productId || null,
    name: sub.productLabel,
    unit_price: sub.amount,
    quantity: 1,
    billing_period: sub.cycle === 'annual' ? 'yearly' : 'monthly',
    status: sub.status,
    start_date: sub.startDate,
    end_date: sub.endDate || null,
    next_billing_date: sub.nextRenewalDate,
    last_billed_date: sub.lastRenewalDate,
    metadata: {
      clientName: sub.clientName,
      clientEmail: sub.clientEmail,
      productCategoryId: sub.productCategoryId,
      productCategoryLabel: sub.productCategoryLabel,
      discount: sub.discount,
      dayOfMonth: sub.dayOfMonth,
      pausedAt: sub.pausedAt,
      cancelledAt: sub.cancelledAt,
      cancelReason: sub.cancelReason,
      renewalCount: sub.renewalCount,
      note: sub.note,
    },
  };
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

  // Pagination
  const offsetRef = useRef(0);
  const [hasMore, setHasMore] = useState(true);

  // --------------------------------------------------------
  // REFRESH COUNT
  // --------------------------------------------------------
  const refreshCount = useCallback(async () => {
    try {
      const { count, error: countError } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', companyId);

      if (countError) throw countError;
      setTotalCount(count || 0);
    } catch (err) {
      console.error('Error getting count:', err);
    }
  }, [companyId]);

  // --------------------------------------------------------
  // LOAD ALL FOR SYNC
  // --------------------------------------------------------
  const loadAllForSync = useCallback(async (): Promise<Subscription[]> => {
    try {
      const { data, error: loadError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (loadError) throw loadError;

      return (data || []).map(row => mapRowToSubscription(row as SubscriptionRow));
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
    offsetRef.current = 0;

    try {
      // Get total count
      const { count, error: countError } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', companyId);

      if (countError) throw countError;
      setTotalCount(count || 0);

      // Load first page
      const { data, error: loadError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })
        .range(0, PAGE_SIZE - 1);

      if (loadError) throw loadError;

      const subs = (data || []).map(row => mapRowToSubscription(row as SubscriptionRow));
      offsetRef.current = subs.length;
      setHasMore(subs.length === PAGE_SIZE);
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
    if (!hasMore || loading) return;

    setLoading(true);

    try {
      const { data, error: loadError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })
        .range(offsetRef.current, offsetRef.current + PAGE_SIZE - 1);

      if (loadError) throw loadError;

      const newSubs = (data || []).map(row => mapRowToSubscription(row as SubscriptionRow));
      offsetRef.current += newSubs.length;
      setHasMore(newSubs.length === PAGE_SIZE);
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
      renewalCount: 1,
      createdAt: now,
      updatedAt: now,
    };

    // Add optional fields
    if (data.clientEmail) subscription.clientEmail = data.clientEmail;
    if (data.discount !== undefined && data.discount > 0) subscription.discount = data.discount;
    if (data.endDate) subscription.endDate = data.endDate;
    if (data.note) subscription.note = data.note;

    const row = mapSubscriptionToRow(subscription);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: insertError } = await (supabase as any)
      .from('subscriptions')
      .insert({
        ...row,
        created_at: now,
        updated_at: now,
      });

    if (insertError) throw insertError;

    setSubscriptions((prev) => [subscription, ...prev]);
    setTotalCount((prev) => prev + 1);
    return subscription;
  }, []);

  // --------------------------------------------------------
  // UPDATE SUBSCRIPTION
  // --------------------------------------------------------
  const updateSubscription = useCallback(async (id: string, data: UpdateSubscriptionData): Promise<void> => {
    const current = subscriptions.find((s) => s.id === id);
    if (!current) return;

    const updates: Partial<Subscription> = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    // Recalculate finalAmount if amount or discount changed
    if (data.amount !== undefined || data.discount !== undefined) {
      const newAmount = data.amount ?? current.amount;
      const newDiscount = data.discount ?? current.discount;
      updates.finalAmount = calculateFinalAmount(newAmount, newDiscount);
    }

    const updatedSub = { ...current, ...updates };
    const row = mapSubscriptionToRow(updatedSub);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateError } = await (supabase as any)
      .from('subscriptions')
      .update({
        ...row,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (updateError) throw updateError;

    setSubscriptions((prev) =>
      prev.map((s) => (s.id === id ? updatedSub : s))
    );
  }, [subscriptions]);

  // --------------------------------------------------------
  // DELETE SUBSCRIPTION
  // --------------------------------------------------------
  const deleteSubscription = useCallback(async (id: string): Promise<void> => {
    const { error: deleteError } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
    setTotalCount((prev) => Math.max(0, prev - 1));
  }, []);

  // --------------------------------------------------------
  // DELETE ALL SUBSCRIPTIONS
  // --------------------------------------------------------
  const deleteAllSubscriptions = useCallback(async (): Promise<void> => {
    setDeleting(true);
    setDeleteProgress({ current: 0, total: totalCount });

    try {
      const { error: deleteError } = await supabase
        .from('subscriptions')
        .delete()
        .eq('company_id', companyId);

      if (deleteError) throw deleteError;

      setSubscriptions([]);
      setTotalCount(0);
      setHasMore(false);
      offsetRef.current = 0;
      setDeleteProgress({ current: totalCount, total: totalCount });
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

    const updatedSub = {
      ...sub,
      status: 'active' as const,
      pausedAt: undefined,
      nextRenewalDate: nextRenewalDate.toISOString().split('T')[0],
      updatedAt: new Date().toISOString(),
    };

    const row = mapSubscriptionToRow(updatedSub);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateError } = await (supabase as any)
      .from('subscriptions')
      .update({
        ...row,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (updateError) throw updateError;

    setSubscriptions((prev) =>
      prev.map((s) => (s.id === id ? updatedSub : s))
    );
  }, [subscriptions]);

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
  // STATS
  // --------------------------------------------------------
  const stats: SubscriptionStats = {
    total: totalCount,
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
    arr: 0,
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
