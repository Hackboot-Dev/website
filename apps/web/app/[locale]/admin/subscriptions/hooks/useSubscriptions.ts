// /workspaces/website/apps/web/app/[locale]/admin/subscriptions/hooks/useSubscriptions.ts
// Description: React hook for subscription data management
// Last modified: 2025-12-19

'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type {
  Subscription,
  SubscriptionPlan,
  SubscriptionEvent,
  SubscriptionMetrics,
  CreateSubscription,
  UpdateSubscription,
  CreateSubscriptionPlan,
  UpdateSubscriptionPlan,
  SubscriptionFilters,
  BillingPeriod,
} from '../types';

type CompanyId = 'vmcloud' | 'hackboot';

// ============================================================
// HOOK: useSubscriptions
// ============================================================

export function useSubscriptions(companyId: CompanyId = 'vmcloud') {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [metrics, setMetrics] = useState<SubscriptionMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ============================================================
  // FETCH SUBSCRIPTIONS
  // ============================================================

  const fetchSubscriptions = useCallback(async (filters?: SubscriptionFilters) => {
    try {
      let query = supabase
        .from('subscriptions')
        .select(`
          *,
          client:clients(id, name, email, company),
          plan:subscription_plans(*)
        `)
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.status) {
        if (Array.isArray(filters.status)) {
          query = query.in('status', filters.status);
        } else {
          query = query.eq('status', filters.status);
        }
      }
      if (filters?.planId) {
        query = query.eq('plan_id', filters.planId);
      }
      if (filters?.clientId) {
        query = query.eq('client_id', filters.clientId);
      }
      if (filters?.billingPeriod) {
        query = query.eq('billing_period', filters.billingPeriod);
      }

      const { data, error: queryError } = await query;

      if (queryError) throw queryError;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mapped: Subscription[] = ((data || []) as any[]).map((row) => ({
        id: row.id,
        companyId: row.company_id,
        clientId: row.client_id,
        planId: row.plan_id,
        status: row.status as Subscription['status'],
        startedAt: row.start_date,
        trialEndsAt: row.trial_ends_at,
        currentPeriodStart: row.current_period_start || row.start_date,
        currentPeriodEnd: row.current_period_end || row.end_date,
        cancelledAt: row.cancelled_at,
        cancelAtPeriodEnd: row.cancel_at_period_end || false,
        pausedAt: row.paused_at,
        endedAt: row.end_date,
        price: row.price || row.unit_price,
        currency: row.currency || 'EUR',
        billingPeriod: row.billing_period as BillingPeriod,
        discountPercent: row.discount_percent || 0,
        nextInvoiceAt: row.next_billing_date,
        lastInvoiceId: row.last_invoice_id,
        cancelReason: row.cancel_reason,
        pauseReason: row.pause_reason,
        notes: row.notes,
        metadata: row.metadata || {},
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        client: row.client ? {
          id: row.client.id,
          name: row.client.name,
          email: row.client.email,
          company: row.client.company,
        } : undefined,
        plan: row.plan ? mapPlan(row.plan) : undefined,
      }));

      setSubscriptions(mapped);
      return mapped;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch subscriptions';
      setError(message);
      throw err;
    }
  }, [companyId]);

  // ============================================================
  // FETCH PLANS
  // ============================================================

  const fetchPlans = useCallback(async () => {
    try {
      const { data, error: queryError } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('company_id', companyId)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (queryError) throw queryError;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mapped = ((data || []) as any[]).map(mapPlan);
      setPlans(mapped);
      return mapped;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch plans';
      setError(message);
      throw err;
    }
  }, [companyId]);

  // ============================================================
  // FETCH METRICS
  // ============================================================

  const fetchMetrics = useCallback(async () => {
    // Calculate metrics manually from subscriptions data
    await calculateMetricsManually();
  }, [companyId]);

  const calculateMetricsManually = async () => {
    const { data: subs } = await supabase
      .from('subscriptions')
      .select('status, price, unit_price, billing_period, discount_percent, cancelled_at')
      .eq('company_id', companyId);

    if (!subs) return;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let mrr = 0;
    const stats = {
      total: subs.length,
      active: 0,
      trial: 0,
      paused: 0,
      cancelledThisMonth: 0,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (subs as any[]).forEach((sub) => {
      if (sub.status === 'active') {
        stats.active++;
        const price = sub.price || sub.unit_price || 0;
        const discount = sub.discount_percent || 0;
        const discountedPrice = price * (1 - discount / 100);

        switch (sub.billing_period) {
          case 'monthly':
            mrr += discountedPrice;
            break;
          case 'quarterly':
            mrr += discountedPrice / 3;
            break;
          case 'yearly':
            mrr += discountedPrice / 12;
            break;
        }
      } else if (sub.status === 'trial') {
        stats.trial++;
      } else if (sub.status === 'paused') {
        stats.paused++;
      }

      if (sub.status === 'cancelled' && sub.cancelled_at) {
        const cancelDate = new Date(sub.cancelled_at);
        if (cancelDate >= startOfMonth) {
          stats.cancelledThisMonth++;
        }
      }
    });

    setMetrics({
      totalSubscriptions: stats.total,
      activeSubscriptions: stats.active,
      trialSubscriptions: stats.trial,
      pausedSubscriptions: stats.paused,
      cancelledThisMonth: stats.cancelledThisMonth,
      mrr,
      arr: mrr * 12,
    });
  };

  // ============================================================
  // CREATE SUBSCRIPTION
  // ============================================================

  const createSubscription = async (data: CreateSubscription): Promise<Subscription> => {
    const id = `sub_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 9)}`;

    const insertData = {
      id,
      company_id: companyId,
      client_id: data.clientId,
      plan_id: data.planId,
      name: 'Subscription',
      status: data.status || 'active',
      start_date: data.startedAt || new Date().toISOString(),
      trial_ends_at: data.trialEndsAt,
      current_period_start: data.startedAt || new Date().toISOString(),
      current_period_end: data.currentPeriodEnd,
      unit_price: data.price,
      price: data.price,
      currency: data.currency || 'EUR',
      billing_period: data.billingPeriod,
      discount_percent: data.discountPercent || 0,
      notes: data.notes,
      metadata: data.metadata || {},
    };

    const { data: result, error: insertError } = await supabase
      .from('subscriptions')
      .insert(insertData)
      .select()
      .single();

    if (insertError) throw insertError;

    // Create event
    await createEvent({
      subscriptionId: id,
      eventType: 'created',
      newPrice: data.price,
      newPlanId: data.planId,
    });

    await fetchSubscriptions();
    await fetchMetrics();

    return result as unknown as Subscription;
  };

  // ============================================================
  // UPDATE SUBSCRIPTION
  // ============================================================

  const updateSubscription = async (id: string, data: UpdateSubscription): Promise<void> => {
    const updateData: Record<string, unknown> = {};

    if (data.planId !== undefined) updateData.plan_id = data.planId;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.trialEndsAt !== undefined) updateData.trial_ends_at = data.trialEndsAt;
    if (data.currentPeriodStart !== undefined) updateData.current_period_start = data.currentPeriodStart;
    if (data.currentPeriodEnd !== undefined) updateData.current_period_end = data.currentPeriodEnd;
    if (data.cancelledAt !== undefined) updateData.cancelled_at = data.cancelledAt;
    if (data.cancelAtPeriodEnd !== undefined) updateData.cancel_at_period_end = data.cancelAtPeriodEnd;
    if (data.pausedAt !== undefined) updateData.paused_at = data.pausedAt;
    if (data.endedAt !== undefined) updateData.end_date = data.endedAt;
    if (data.price !== undefined) {
      updateData.price = data.price;
      updateData.unit_price = data.price;
    }
    if (data.discountPercent !== undefined) updateData.discount_percent = data.discountPercent;
    if (data.nextInvoiceAt !== undefined) updateData.next_billing_date = data.nextInvoiceAt;
    if (data.cancelReason !== undefined) updateData.cancel_reason = data.cancelReason;
    if (data.pauseReason !== undefined) updateData.pause_reason = data.pauseReason;
    if (data.notes !== undefined) updateData.notes = data.notes;

    const { error: updateError } = await supabase
      .from('subscriptions')
      .update(updateData)
      .eq('id', id);

    if (updateError) throw updateError;

    await fetchSubscriptions();
    await fetchMetrics();
  };

  // ============================================================
  // SUBSCRIPTION ACTIONS
  // ============================================================

  const pauseSubscription = async (id: string, reason?: string) => {
    await updateSubscription(id, {
      status: 'paused',
      pausedAt: new Date().toISOString(),
      pauseReason: reason,
    });

    await createEvent({
      subscriptionId: id,
      eventType: 'paused',
      reason,
    });
  };

  const resumeSubscription = async (id: string) => {
    await updateSubscription(id, {
      status: 'active',
      pausedAt: undefined,
      pauseReason: undefined,
    });

    await createEvent({
      subscriptionId: id,
      eventType: 'resumed',
    });
  };

  const cancelSubscription = async (id: string, immediate: boolean = false, reason?: string) => {
    if (immediate) {
      await updateSubscription(id, {
        status: 'cancelled',
        cancelledAt: new Date().toISOString(),
        cancelReason: reason,
      });

      await createEvent({
        subscriptionId: id,
        eventType: 'cancelled',
        reason,
      });
    } else {
      await updateSubscription(id, {
        cancelAtPeriodEnd: true,
        cancelReason: reason,
      });

      await createEvent({
        subscriptionId: id,
        eventType: 'cancel_scheduled',
        reason,
      });
    }
  };

  const reactivateSubscription = async (id: string) => {
    await updateSubscription(id, {
      status: 'active',
      cancelledAt: undefined,
      cancelAtPeriodEnd: false,
      cancelReason: undefined,
    });

    await createEvent({
      subscriptionId: id,
      eventType: 'activated',
    });
  };

  // ============================================================
  // PLANS CRUD
  // ============================================================

  const createPlan = async (data: CreateSubscriptionPlan): Promise<SubscriptionPlan> => {
    const id = `plan_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 9)}`;

    const insertData = {
      id,
      company_id: companyId,
      name: data.name,
      description: data.description,
      price: data.price,
      currency: data.currency || 'EUR',
      billing_period: data.billingPeriod,
      billing_period_count: data.billingPeriodCount || 1,
      trial_days: data.trialDays || 0,
      product_id: data.productId,
      features: data.features || [],
      max_users: data.maxUsers,
      max_storage_gb: data.maxStorageGb,
      is_active: data.isActive ?? true,
      sort_order: data.sortOrder || 0,
      metadata: data.metadata || {},
    };

    const { data: result, error: insertError } = await supabase
      .from('subscription_plans')
      .insert(insertData)
      .select()
      .single();

    if (insertError) throw insertError;

    await fetchPlans();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return mapPlan(result as any);
  };

  const updatePlan = async (id: string, data: UpdateSubscriptionPlan): Promise<void> => {
    const updateData: Record<string, unknown> = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.currency !== undefined) updateData.currency = data.currency;
    if (data.billingPeriod !== undefined) updateData.billing_period = data.billingPeriod;
    if (data.billingPeriodCount !== undefined) updateData.billing_period_count = data.billingPeriodCount;
    if (data.trialDays !== undefined) updateData.trial_days = data.trialDays;
    if (data.productId !== undefined) updateData.product_id = data.productId;
    if (data.features !== undefined) updateData.features = data.features;
    if (data.maxUsers !== undefined) updateData.max_users = data.maxUsers;
    if (data.maxStorageGb !== undefined) updateData.max_storage_gb = data.maxStorageGb;
    if (data.isActive !== undefined) updateData.is_active = data.isActive;
    if (data.sortOrder !== undefined) updateData.sort_order = data.sortOrder;

    const { error: updateError } = await supabase
      .from('subscription_plans')
      .update(updateData)
      .eq('id', id);

    if (updateError) throw updateError;

    await fetchPlans();
  };

  const deletePlan = async (id: string): Promise<void> => {
    // Soft delete by marking as inactive
    await updatePlan(id, { isActive: false });
  };

  // ============================================================
  // EVENTS
  // ============================================================

  const createEvent = async (data: {
    subscriptionId: string;
    eventType: string;
    oldPlanId?: string;
    newPlanId?: string;
    oldPrice?: number;
    newPrice?: number;
    reason?: string;
  }) => {
    const id = `evt_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 9)}`;

    try {
      await supabase
        .from('subscription_events')
        .insert({
          id,
          subscription_id: data.subscriptionId,
          event_type: data.eventType,
          old_plan_id: data.oldPlanId,
          new_plan_id: data.newPlanId,
          old_price: data.oldPrice,
          new_price: data.newPrice,
          reason: data.reason,
          performed_by: 'admin',
        });
    } catch (err) {
      console.warn('Could not create subscription event:', err);
    }
  };

  const fetchEvents = async (subscriptionId: string): Promise<SubscriptionEvent[]> => {
    const { data, error: queryError } = await supabase
      .from('subscription_events')
      .select('*')
      .eq('subscription_id', subscriptionId)
      .order('created_at', { ascending: false });

    if (queryError) throw queryError;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ((data || []) as any[]).map((row) => ({
      id: row.id,
      subscriptionId: row.subscription_id,
      eventType: row.event_type,
      oldPlanId: row.old_plan_id,
      newPlanId: row.new_plan_id,
      oldPrice: row.old_price,
      newPrice: row.new_price,
      reason: row.reason,
      performedBy: row.performed_by,
      metadata: row.metadata || {},
      createdAt: row.created_at,
    }));
  };

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([
          fetchSubscriptions(),
          fetchPlans(),
          fetchMetrics(),
        ]);
      } catch (err) {
        console.error('Error loading subscriptions:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [companyId, fetchSubscriptions, fetchPlans, fetchMetrics]);

  return {
    // Data
    subscriptions,
    plans,
    metrics,
    loading,
    error,

    // Fetch
    fetchSubscriptions,
    fetchPlans,
    fetchMetrics,
    refresh: () => Promise.all([fetchSubscriptions(), fetchPlans(), fetchMetrics()]),

    // Subscription CRUD
    createSubscription,
    updateSubscription,

    // Subscription actions
    pauseSubscription,
    resumeSubscription,
    cancelSubscription,
    reactivateSubscription,

    // Plans CRUD
    createPlan,
    updatePlan,
    deletePlan,

    // Events
    fetchEvents,
  };
}

// ============================================================
// HELPERS
// ============================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPlan(row: any): SubscriptionPlan {
  return {
    id: row.id,
    companyId: row.company_id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    currency: row.currency || 'EUR',
    billingPeriod: row.billing_period,
    billingPeriodCount: Number(row.billing_period_count) || 1,
    trialDays: Number(row.trial_days) || 0,
    productId: row.product_id,
    features: row.features || [],
    maxUsers: row.max_users,
    maxStorageGb: row.max_storage_gb,
    isActive: row.is_active,
    sortOrder: Number(row.sort_order) || 0,
    metadata: row.metadata || {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export default useSubscriptions;
