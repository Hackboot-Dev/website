// /workspaces/website/apps/web/lib/services/database-supabase.ts
// Description: Supabase database service (replaces Firebase)
// Last modified: 2025-12-16

import { supabase } from '../supabase';
import type { Database, Tables, InsertTables, UpdateTables } from '../types/supabase';
import type {
  CompanyId,
  Client,
  CreateClient,
  UpdateClient,
  Product,
  CreateProduct,
  UpdateProduct,
  ProductCategory,
  Transaction,
  CreateTransaction,
  UpdateTransaction,
  Invoice,
  CreateInvoice,
  UpdateInvoice,
  PnLData,
  AggregatedClientStats,
} from '../types/database';

// ============================================================
// UTILS
// ============================================================

function generateId(prefix: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}${random}`;
}

// Convert snake_case to camelCase
function toCamelCase<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key in obj) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    result[camelKey] = obj[key];
  }
  return result;
}

// Convert camelCase to snake_case
function toSnakeCase<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key in obj) {
    const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
    result[snakeKey] = obj[key];
  }
  return result;
}

// Map Supabase row to Client type
function mapToClient(row: Tables<'clients'>): Client {
  return {
    id: row.id,
    companyId: row.company_id as CompanyId,
    name: row.name,
    email: row.email,
    phone: row.phone || undefined,
    country: row.country || undefined,
    company: row.company || undefined,
    vatNumber: row.vat_number || undefined,
    registrationNumber: row.registration_number || undefined,
    type: row.type,
    status: row.status,
    tags: row.tags || [],
    currency: row.currency,
    paymentTerms: row.payment_terms || undefined,
    creditLimit: row.credit_limit || undefined,
    totalRevenue: row.total_revenue || 0,
    totalTransactions: row.total_transactions || 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    firstPurchaseAt: row.first_purchase_at || undefined,
    lastPurchaseAt: row.last_purchase_at || undefined,
    notes: row.notes || undefined,
    metadata: (row.metadata as Record<string, unknown>) || {},
  };
}

// Map Supabase row to Product type
function mapToProduct(row: Tables<'products'>): Product {
  return {
    id: row.id,
    companyId: row.company_id as CompanyId,
    name: row.name,
    description: row.description || undefined,
    sku: row.sku || undefined,
    categoryId: row.category_id || '',
    type: row.type,
    status: row.status,
    tags: row.tags || [],
    pricing: {
      unitPrice: row.unit_price,
      currency: row.currency,
      billingPeriod: row.billing_period || undefined,
      setupFee: row.setup_fee || undefined,
    },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    metadata: (row.metadata as Record<string, unknown>) || {},
  };
}

// Map Supabase row to Transaction type
function mapToTransaction(row: Tables<'transactions'>): Transaction {
  return {
    id: row.id,
    companyId: row.company_id as CompanyId,
    clientId: row.client_id || undefined,
    productId: row.product_id || undefined,
    subscriptionId: row.subscription_id || undefined,
    invoiceId: row.invoice_id || undefined,
    description: row.description || undefined,
    quantity: row.quantity,
    unitPrice: row.unit_price,
    subtotal: row.subtotal,
    taxRate: row.tax_rate,
    taxAmount: row.tax_amount,
    discountAmount: row.discount_amount,
    total: row.total,
    status: row.status,
    year: row.year,
    month: row.month,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    completedAt: row.completed_at || undefined,
    metadata: (row.metadata as Record<string, unknown>) || {},
  };
}

// ============================================================
// DATABASE SERVICE CLASS
// ============================================================

export class SupabaseDatabaseService {
  private companyId: CompanyId;

  constructor(companyId: CompanyId) {
    this.companyId = companyId;
  }

  // ============================================================
  // CLIENTS
  // ============================================================

  async getClient(clientId: string): Promise<Client | null> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .single();

    if (error || !data) return null;
    return mapToClient(data);
  }

  async getClients(options?: {
    status?: Client['status'];
    type?: Client['type'];
    search?: string;
    limitCount?: number;
  }): Promise<Client[]> {
    let query = supabase
      .from('clients')
      .select('*')
      .eq('company_id', this.companyId)
      .order('created_at', { ascending: false });

    if (options?.status) {
      query = query.eq('status', options.status);
    }
    if (options?.type) {
      query = query.eq('type', options.type);
    }
    if (options?.limitCount) {
      query = query.limit(options.limitCount);
    }

    const { data, error } = await query;

    if (error || !data) return [];

    let clients = data.map(mapToClient);

    // Client-side search for now (can use full-text search later)
    if (options?.search) {
      const searchLower = options.search.toLowerCase();
      clients = clients.filter(
        (c) =>
          c.name.toLowerCase().includes(searchLower) ||
          c.email.toLowerCase().includes(searchLower) ||
          c.company?.toLowerCase().includes(searchLower)
      );
    }

    return clients;
  }

  async createClient(data: CreateClient): Promise<Client> {
    const id = generateId('cli');

    const insertData: InsertTables<'clients'> = {
      id,
      company_id: this.companyId,
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      country: data.country || null,
      company: data.company || null,
      vat_number: data.vatNumber || null,
      registration_number: data.registrationNumber || null,
      type: data.type || 'individual',
      status: data.status || 'lead',
      tags: data.tags || [],
      currency: data.currency || 'EUR',
      payment_terms: data.paymentTerms || null,
      credit_limit: data.creditLimit || null,
      notes: data.notes || null,
      metadata: (data.metadata as Record<string, unknown>) || {},
    };

    const { data: result, error } = await supabase
      .from('clients')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;
    return mapToClient(result);
  }

  async updateClient(clientId: string, data: UpdateClient): Promise<Client | null> {
    const updateData: UpdateTables<'clients'> = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.phone !== undefined) updateData.phone = data.phone || null;
    if (data.country !== undefined) updateData.country = data.country || null;
    if (data.company !== undefined) updateData.company = data.company || null;
    if (data.vatNumber !== undefined) updateData.vat_number = data.vatNumber || null;
    if (data.registrationNumber !== undefined) updateData.registration_number = data.registrationNumber || null;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.currency !== undefined) updateData.currency = data.currency;
    if (data.paymentTerms !== undefined) updateData.payment_terms = data.paymentTerms || null;
    if (data.creditLimit !== undefined) updateData.credit_limit = data.creditLimit || null;
    if (data.notes !== undefined) updateData.notes = data.notes || null;
    // Stats fields
    if (data.totalRevenue !== undefined) updateData.total_revenue = data.totalRevenue;
    if (data.totalTransactions !== undefined) updateData.total_transactions = data.totalTransactions;
    if (data.firstPurchaseAt !== undefined) updateData.first_purchase_at = data.firstPurchaseAt || null;
    if (data.lastPurchaseAt !== undefined) updateData.last_purchase_at = data.lastPurchaseAt || null;

    const { error } = await supabase
      .from('clients')
      .update(updateData)
      .eq('id', clientId);

    if (error) throw error;
    return this.getClient(clientId);
  }

  async deleteClient(clientId: string): Promise<void> {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', clientId);

    if (error) throw error;
  }

  // ============================================================
  // CLIENT SEARCH (Full-text with ILIKE)
  // ============================================================

  async searchClients(searchQuery: string, limitCount: number = 10): Promise<Client[]> {
    const pattern = `%${searchQuery}%`;

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('company_id', this.companyId)
      .or(`name.ilike.${pattern},email.ilike.${pattern},company.ilike.${pattern}`)
      .limit(limitCount);

    if (error || !data) return [];
    return data.map(mapToClient);
  }

  // ============================================================
  // AGGREGATED CLIENT STATS (real-time with PostgreSQL)
  // ============================================================

  async getAggregatedClientStats(): Promise<AggregatedClientStats> {
    // PostgreSQL calcule tout en temps réel - pas besoin de cache !
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    // Toutes les requêtes sont instantanées avec PostgreSQL
    const [
      { count: total },
      { count: active },
      { count: inactive },
      { count: leads },
      { count: churned },
      { count: business },
      { count: individual },
      { count: newThisMonth },
      { data: revenueData },
      { data: topClientData },
    ] = await Promise.all([
      supabase.from('clients').select('*', { count: 'exact', head: true }).eq('company_id', this.companyId),
      supabase.from('clients').select('*', { count: 'exact', head: true }).eq('company_id', this.companyId).eq('status', 'active'),
      supabase.from('clients').select('*', { count: 'exact', head: true }).eq('company_id', this.companyId).eq('status', 'inactive'),
      supabase.from('clients').select('*', { count: 'exact', head: true }).eq('company_id', this.companyId).eq('status', 'lead'),
      supabase.from('clients').select('*', { count: 'exact', head: true }).eq('company_id', this.companyId).eq('status', 'churned'),
      supabase.from('clients').select('*', { count: 'exact', head: true }).eq('company_id', this.companyId).in('type', ['business', 'enterprise']),
      supabase.from('clients').select('*', { count: 'exact', head: true }).eq('company_id', this.companyId).eq('type', 'individual'),
      supabase.from('clients').select('*', { count: 'exact', head: true }).eq('company_id', this.companyId).gte('created_at', startOfMonth),
      supabase.from('clients').select('total_revenue').eq('company_id', this.companyId),
      supabase.from('clients').select('id, name, email, type, total_revenue, total_transactions').eq('company_id', this.companyId).order('total_revenue', { ascending: false }).limit(1),
    ]);

    const totalRevenue = revenueData?.reduce((sum, c) => sum + (c.total_revenue || 0), 0) || 0;
    const avgRevenue = (total || 0) > 0 ? totalRevenue / (total || 1) : 0;

    const topClient = topClientData?.[0] ? {
      id: topClientData[0].id,
      name: topClientData[0].name,
      email: topClientData[0].email,
      type: topClientData[0].type as Client['type'],
      totalRevenue: topClientData[0].total_revenue || 0,
      totalTransactions: topClientData[0].total_transactions || 0,
    } : null;

    return {
      total: total || 0,
      active: active || 0,
      inactive: inactive || 0,
      leads: leads || 0,
      churned: churned || 0,
      business: business || 0,
      individual: individual || 0,
      totalRevenue,
      avgRevenue,
      newThisMonth: newThisMonth || 0,
      topClient,
      updatedAt: new Date().toISOString(),
      lastFullRefreshAt: new Date().toISOString(),
    };
  }

  // Alias pour compatibilité (même fonction, pas de cache)
  async refreshAggregatedClientStats(): Promise<AggregatedClientStats> {
    return this.getAggregatedClientStats();
  }

  // ============================================================
  // PRODUCTS
  // ============================================================

  async getProduct(productId: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (error || !data) return null;
    return mapToProduct(data);
  }

  async getProducts(options?: {
    categoryId?: string;
    status?: Product['status'];
    type?: Product['type'];
    limitCount?: number;
  }): Promise<Product[]> {
    let query = supabase
      .from('products')
      .select('*')
      .eq('company_id', this.companyId)
      .order('created_at', { ascending: false });

    if (options?.categoryId) {
      query = query.eq('category_id', options.categoryId);
    }
    if (options?.status) {
      query = query.eq('status', options.status);
    }
    if (options?.type) {
      query = query.eq('type', options.type);
    }
    if (options?.limitCount) {
      query = query.limit(options.limitCount);
    }

    const { data, error } = await query;

    if (error || !data) return [];
    return data.map(mapToProduct);
  }

  async createProduct(data: CreateProduct): Promise<Product> {
    const id = generateId('prod');

    const insertData: InsertTables<'products'> = {
      id,
      company_id: this.companyId,
      name: data.name,
      description: data.description || null,
      sku: data.sku || null,
      category_id: data.categoryId || null,
      type: data.type || 'one_time',
      status: data.status || 'active',
      tags: data.tags || [],
      unit_price: data.pricing.unitPrice,
      currency: data.pricing.currency || 'EUR',
      billing_period: data.pricing.billingPeriod || null,
      setup_fee: data.pricing.setupFee || null,
      metadata: (data.metadata as Record<string, unknown>) || {},
    };

    const { data: result, error } = await supabase
      .from('products')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;
    return mapToProduct(result);
  }

  async updateProduct(productId: string, data: UpdateProduct): Promise<Product | null> {
    const updateData: UpdateTables<'products'> = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description || null;
    if (data.sku !== undefined) updateData.sku = data.sku || null;
    if (data.categoryId !== undefined) updateData.category_id = data.categoryId || null;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.pricing?.unitPrice !== undefined) updateData.unit_price = data.pricing.unitPrice;
    if (data.pricing?.currency !== undefined) updateData.currency = data.pricing.currency;
    if (data.pricing?.billingPeriod !== undefined) updateData.billing_period = data.pricing.billingPeriod || null;
    if (data.pricing?.setupFee !== undefined) updateData.setup_fee = data.pricing.setupFee || null;

    const { error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', productId);

    if (error) throw error;
    return this.getProduct(productId);
  }

  async deleteProduct(productId: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) throw error;
  }

  // ============================================================
  // PRODUCT CATEGORIES
  // ============================================================

  async getProductCategory(categoryId: string): Promise<ProductCategory | null> {
    const { data, error } = await supabase
      .from('product_categories')
      .select('*')
      .eq('id', categoryId)
      .single();

    if (error || !data) return null;
    return {
      id: data.id,
      companyId: data.company_id as CompanyId,
      name: data.name,
      description: data.description || undefined,
      color: data.color || undefined,
      icon: data.icon || undefined,
      sortOrder: data.sort_order,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async getProductCategories(): Promise<ProductCategory[]> {
    const { data, error } = await supabase
      .from('product_categories')
      .select('*')
      .eq('company_id', this.companyId)
      .order('sort_order', { ascending: true });

    if (error || !data) return [];
    return data.map((row) => ({
      id: row.id,
      companyId: row.company_id as CompanyId,
      name: row.name,
      description: row.description || undefined,
      color: row.color || undefined,
      icon: row.icon || undefined,
      sortOrder: row.sort_order,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  // ============================================================
  // TRANSACTIONS
  // ============================================================

  async getTransaction(transactionId: string): Promise<Transaction | null> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .single();

    if (error || !data) return null;
    return mapToTransaction(data);
  }

  async getTransactions(options?: {
    clientId?: string;
    productId?: string;
    status?: Transaction['status'];
    year?: number;
    month?: string;
    limitCount?: number;
  }): Promise<Transaction[]> {
    let query = supabase
      .from('transactions')
      .select('*')
      .eq('company_id', this.companyId)
      .order('created_at', { ascending: false });

    if (options?.clientId) {
      query = query.eq('client_id', options.clientId);
    }
    if (options?.productId) {
      query = query.eq('product_id', options.productId);
    }
    if (options?.status) {
      query = query.eq('status', options.status);
    }
    if (options?.year) {
      query = query.eq('year', options.year);
    }
    if (options?.month) {
      query = query.eq('month', options.month);
    }
    if (options?.limitCount) {
      query = query.limit(options.limitCount);
    }

    const { data, error } = await query;

    if (error || !data) return [];
    return data.map(mapToTransaction);
  }

  async createTransaction(data: CreateTransaction): Promise<Transaction> {
    const id = generateId('tx');

    const insertData: InsertTables<'transactions'> = {
      id,
      company_id: this.companyId,
      client_id: data.clientId || null,
      product_id: data.productId || null,
      subscription_id: data.subscriptionId || null,
      invoice_id: data.invoiceId || null,
      description: data.description || null,
      quantity: data.quantity || 1,
      unit_price: data.unitPrice,
      subtotal: data.subtotal,
      tax_rate: data.taxRate || 0,
      tax_amount: data.taxAmount || 0,
      discount_amount: data.discountAmount || 0,
      total: data.total,
      status: data.status || 'completed',
      year: data.year,
      month: data.month,
      completed_at: data.status === 'completed' ? new Date().toISOString() : null,
      metadata: (data.metadata as Record<string, unknown>) || {},
    };

    const { data: result, error } = await supabase
      .from('transactions')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;
    return mapToTransaction(result);
  }

  async updateTransaction(transactionId: string, data: UpdateTransaction): Promise<Transaction | null> {
    const updateData: UpdateTables<'transactions'> = {};

    if (data.clientId !== undefined) updateData.client_id = data.clientId || null;
    if (data.productId !== undefined) updateData.product_id = data.productId || null;
    if (data.description !== undefined) updateData.description = data.description || null;
    if (data.quantity !== undefined) updateData.quantity = data.quantity;
    if (data.unitPrice !== undefined) updateData.unit_price = data.unitPrice;
    if (data.subtotal !== undefined) updateData.subtotal = data.subtotal;
    if (data.taxRate !== undefined) updateData.tax_rate = data.taxRate;
    if (data.taxAmount !== undefined) updateData.tax_amount = data.taxAmount;
    if (data.discountAmount !== undefined) updateData.discount_amount = data.discountAmount;
    if (data.total !== undefined) updateData.total = data.total;
    if (data.status !== undefined) updateData.status = data.status;

    const { error } = await supabase
      .from('transactions')
      .update(updateData)
      .eq('id', transactionId);

    if (error) throw error;
    return this.getTransaction(transactionId);
  }

  async deleteTransaction(transactionId: string): Promise<void> {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', transactionId);

    if (error) throw error;
  }

  // ============================================================
  // P&L DATA
  // ============================================================

  async getPnLData(year: number): Promise<PnLData | null> {
    const { data, error } = await supabase
      .from('pnl_data')
      .select('data')
      .eq('company_id', this.companyId)
      .eq('year', year)
      .single();

    if (error || !data) return null;
    return data.data as unknown as PnLData;
  }

  async savePnLData(pnlData: PnLData): Promise<void> {
    const { error } = await supabase
      .from('pnl_data')
      .upsert({
        id: `${this.companyId}_${pnlData.year}`,
        company_id: this.companyId,
        year: pnlData.year,
        data: pnlData as unknown as Record<string, unknown>,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;
  }

  // ============================================================
  // PNL TRANSACTIONS (new relational model)
  // ============================================================

  async createPnLTransaction(data: {
    id?: string; // Optional: use provided ID or generate new one
    clientId: string | null;
    clientName?: string; // Client name for display purposes
    productId: string;
    productLabel: string;
    categoryId: string;
    categoryLabel: string;
    amount: number;
    discount?: number;
    note?: string;
    month: string;
    year: number;
    isRecurring?: boolean;
  }): Promise<Tables<'pnl_transactions'>> {
    const id = data.id || generateId('tx');

    const { data: result, error } = await supabase
      .from('pnl_transactions')
      .insert({
        id,
        company_id: this.companyId,
        client_id: data.clientId,
        client_name: data.clientName || null,
        product_id: data.productId,
        product_label: data.productLabel,
        category_id: data.categoryId,
        category_label: data.categoryLabel,
        amount: data.amount,
        discount: data.discount || 0,
        note: data.note || null,
        month: data.month,
        year: data.year,
        is_recurring: data.isRecurring || false,
      })
      .select()
      .single();

    if (error) throw error;
    // Note: client stats are auto-updated via PostgreSQL trigger
    return result;
  }

  async deletePnLTransaction(transactionId: string): Promise<void> {
    const { error } = await supabase
      .from('pnl_transactions')
      .delete()
      .eq('id', transactionId);

    if (error) throw error;
    // Note: client stats are auto-updated via PostgreSQL trigger
  }

  async getPnLTransactions(year: number, month?: string): Promise<Tables<'pnl_transactions'>[]> {
    let query = supabase
      .from('pnl_transactions')
      .select('*')
      .eq('company_id', this.companyId)
      .eq('year', year)
      .order('created_at', { ascending: false });

    if (month) {
      query = query.eq('month', month);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async getPnLTransactionsByProduct(year: number, productId: string): Promise<Tables<'pnl_transactions'>[]> {
    const { data, error } = await supabase
      .from('pnl_transactions')
      .select('*')
      .eq('company_id', this.companyId)
      .eq('year', year)
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getPnLSummary(year: number): Promise<{
    month: string;
    categoryId: string;
    categoryLabel: string;
    productId: string;
    productLabel: string;
    transactionCount: number;
    grossRevenue: number;
    totalDiscounts: number;
    netRevenue: number;
  }[]> {
    const { data, error } = await supabase
      .rpc('get_pnl_summary', {
        p_company_id: this.companyId,
        p_year: year,
      });

    if (error) throw error;
    return (data || []).map((row: {
      month: string;
      category_id: string;
      category_label: string;
      product_id: string;
      product_label: string;
      transaction_count: number;
      gross_revenue: number;
      total_discounts: number;
      net_revenue: number;
    }) => ({
      month: row.month,
      categoryId: row.category_id,
      categoryLabel: row.category_label,
      productId: row.product_id,
      productLabel: row.product_label,
      transactionCount: Number(row.transaction_count),
      grossRevenue: Number(row.gross_revenue),
      totalDiscounts: Number(row.total_discounts),
      netRevenue: Number(row.net_revenue),
    }));
  }

  // ============================================================
  // CLIENT STATS (now auto-updated by PostgreSQL trigger)
  // ============================================================
  // Note: Client stats are automatically updated when pnl_transactions are inserted/deleted
  // via the trigger_update_client_stats trigger. No need to call updateClientStats manually.

  // ============================================================
  // OBJECTIVES
  // ============================================================

  async getObjectives(year?: number): Promise<{
    id: string;
    companyId: string;
    type: string;
    period: string;
    year: number;
    month?: number;
    quarter?: number;
    targetAmount: number;
    name?: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    // New v2 fields
    category?: string;
    targetUnit?: string;
    priority?: string;
    productId?: string;
    productName?: string;
    productCategoryId?: string;
    productCategoryName?: string;
    clientId?: string;
    clientName?: string;
    clientSegment?: string;
    expenseCategory?: string;
  }[]> {
    let query = supabase
      .from('objectives')
      .select('*')
      .eq('company_id', this.companyId)
      .order('year', { ascending: false })
      .order('month', { ascending: true });

    if (year) {
      query = query.eq('year', year);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map(row => ({
      id: row.id,
      companyId: row.company_id,
      type: row.type,
      period: row.period,
      year: row.year,
      month: row.month || undefined,
      quarter: row.quarter || undefined,
      targetAmount: Number(row.target_amount),
      name: row.name || undefined,
      description: row.description || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      // New v2 fields
      category: row.category || 'financial',
      targetUnit: row.target_unit || 'currency',
      priority: row.priority || 'medium',
      productId: row.product_id || undefined,
      productName: row.product_name || undefined,
      productCategoryId: row.product_category_id || undefined,
      productCategoryName: row.product_category_name || undefined,
      clientId: row.client_id || undefined,
      clientName: row.client_name || undefined,
      clientSegment: row.client_segment || undefined,
      expenseCategory: row.expense_category || undefined,
    }));
  }

  async createObjective(data: {
    type: string;
    period: string;
    year: number;
    month?: number;
    quarter?: number;
    targetAmount: number;
    name?: string;
    description?: string;
    // New v2 fields
    category?: string;
    targetUnit?: string;
    priority?: string;
    productId?: string;
    productName?: string;
    productCategoryId?: string;
    productCategoryName?: string;
    clientId?: string;
    clientName?: string;
    clientSegment?: string;
    expenseCategory?: string;
  }): Promise<{ id: string }> {
    const id = generateId('obj');

    const { error } = await supabase
      .from('objectives')
      .insert({
        id,
        company_id: this.companyId,
        type: data.type,
        period: data.period,
        year: data.year,
        month: data.month || null,
        quarter: data.quarter || null,
        target_amount: data.targetAmount,
        name: data.name || null,
        description: data.description || null,
        // New v2 fields
        category: data.category || 'financial',
        target_unit: data.targetUnit || 'currency',
        priority: data.priority || 'medium',
        product_id: data.productId || null,
        product_name: data.productName || null,
        product_category_id: data.productCategoryId || null,
        product_category_name: data.productCategoryName || null,
        client_id: data.clientId || null,
        client_name: data.clientName || null,
        client_segment: data.clientSegment || null,
        expense_category: data.expenseCategory || null,
      });

    if (error) throw error;
    return { id };
  }

  async updateObjective(objectiveId: string, data: {
    targetAmount?: number;
    name?: string;
    description?: string;
  }): Promise<void> {
    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (data.targetAmount !== undefined) updateData.target_amount = data.targetAmount;
    if (data.name !== undefined) updateData.name = data.name || null;
    if (data.description !== undefined) updateData.description = data.description || null;

    const { error } = await supabase
      .from('objectives')
      .update(updateData)
      .eq('id', objectiveId);

    if (error) throw error;
  }

  async deleteObjective(objectiveId: string): Promise<void> {
    const { error } = await supabase
      .from('objectives')
      .delete()
      .eq('id', objectiveId);

    if (error) throw error;
  }

  async getObjectivesWithProgress(year: number): Promise<{
    id: string;
    type: string;
    period: string;
    month?: number;
    quarter?: number;
    targetAmount: number;
    actualAmount: number;
    progressPercent: number;
    status: string;
  }[]> {
    const { data, error } = await supabase.rpc('get_objective_progress', {
      p_company_id: this.companyId,
      p_year: year,
    });

    if (error) {
      console.error('Error getting objective progress:', error);
      // Fallback to manual calculation if RPC doesn't exist yet
      return [];
    }

    return (data || []).map((row: {
      objective_id: string;
      type: string;
      period: string;
      month: number | null;
      quarter: number | null;
      target_amount: number;
      actual_amount: number;
      progress_percent: number;
      status: string;
    }) => ({
      id: row.objective_id,
      type: row.type,
      period: row.period,
      month: row.month || undefined,
      quarter: row.quarter || undefined,
      targetAmount: Number(row.target_amount),
      actualAmount: Number(row.actual_amount),
      progressPercent: Number(row.progress_percent),
      status: row.status,
    }));
  }

  // ============================================================
  // ALERTS
  // ============================================================

  async getAlerts(options?: {
    unreadOnly?: boolean;
    severity?: string;
    limit?: number;
  }): Promise<{
    id: string;
    companyId: string;
    severity: string;
    type: string;
    title: string;
    message: string;
    relatedEntityType?: string;
    relatedEntityId?: string;
    metadata?: Record<string, unknown>;
    isRead: boolean;
    isAcknowledged: boolean;
    acknowledgedAt?: string;
    createdAt: string;
  }[]> {
    let query = supabase
      .from('alerts')
      .select('*')
      .eq('company_id', this.companyId)
      .order('created_at', { ascending: false });

    if (options?.unreadOnly) {
      query = query.eq('is_read', false);
    }
    if (options?.severity) {
      query = query.eq('severity', options.severity);
    }
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map(row => ({
      id: row.id,
      companyId: row.company_id,
      severity: row.severity,
      type: row.type,
      title: row.title,
      message: row.message,
      relatedEntityType: row.related_entity_type || undefined,
      relatedEntityId: row.related_entity_id || undefined,
      metadata: row.metadata as Record<string, unknown> || undefined,
      isRead: row.is_read,
      isAcknowledged: row.is_acknowledged,
      acknowledgedAt: row.acknowledged_at || undefined,
      createdAt: row.created_at,
    }));
  }

  async getAlertCounts(): Promise<{
    total: number;
    critical: number;
    warning: number;
    info: number;
  }> {
    const { data, error } = await supabase.rpc('get_unread_alerts_count', {
      p_company_id: this.companyId,
    });

    if (error) {
      console.error('Error getting alert counts:', error);
      // Fallback
      return { total: 0, critical: 0, warning: 0, info: 0 };
    }

    const row = data?.[0] || { total: 0, critical: 0, warning: 0, info: 0 };
    return {
      total: row.total || 0,
      critical: row.critical || 0,
      warning: row.warning || 0,
      info: row.info || 0,
    };
  }

  async createAlert(data: {
    severity: string;
    type: string;
    title: string;
    message: string;
    relatedEntityType?: string;
    relatedEntityId?: string;
    metadata?: Record<string, unknown>;
    autoDismissAt?: string;
  }): Promise<{ id: string }> {
    const id = generateId('alert');

    const { error } = await supabase
      .from('alerts')
      .insert({
        id,
        company_id: this.companyId,
        severity: data.severity,
        type: data.type,
        title: data.title,
        message: data.message,
        related_entity_type: data.relatedEntityType || null,
        related_entity_id: data.relatedEntityId || null,
        metadata: data.metadata || {},
        auto_dismiss_at: data.autoDismissAt || null,
      });

    if (error) throw error;
    return { id };
  }

  async markAlertAsRead(alertId: string): Promise<void> {
    const { error } = await supabase
      .from('alerts')
      .update({ is_read: true })
      .eq('id', alertId);

    if (error) throw error;
  }

  async markAllAlertsAsRead(): Promise<void> {
    const { error } = await supabase
      .from('alerts')
      .update({ is_read: true })
      .eq('company_id', this.companyId)
      .eq('is_read', false);

    if (error) throw error;
  }

  async acknowledgeAlert(alertId: string): Promise<void> {
    const { error } = await supabase
      .from('alerts')
      .update({
        is_acknowledged: true,
        acknowledged_at: new Date().toISOString(),
      })
      .eq('id', alertId);

    if (error) throw error;
  }

  async deleteAlert(alertId: string): Promise<void> {
    const { error } = await supabase
      .from('alerts')
      .delete()
      .eq('id', alertId);

    if (error) throw error;
  }

  // ============================================================
  // METRICS FOR DASHBOARD
  // ============================================================

  async getRevenueByMonth(year: number): Promise<{ month: string; revenue: number }[]> {
    const { data, error } = await supabase
      .from('pnl_transactions')
      .select('month, amount, discount')
      .eq('company_id', this.companyId)
      .eq('year', year);

    if (error) throw error;

    const monthlyRevenue: Record<string, number> = {};
    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

    // Initialize all months
    months.forEach(m => { monthlyRevenue[m] = 0; });

    // Sum revenue by month
    (data || []).forEach(tx => {
      const netAmount = Number(tx.amount) - Number(tx.discount || 0);
      monthlyRevenue[tx.month] = (monthlyRevenue[tx.month] || 0) + netAmount;
    });

    return months.map(month => ({
      month,
      revenue: monthlyRevenue[month],
    }));
  }

  async getYoYComparison(currentYear: number): Promise<{
    currentYearRevenue: number;
    previousYearRevenue: number;
    changePercent: number;
  }> {
    const [currentData, previousData] = await Promise.all([
      supabase
        .from('pnl_transactions')
        .select('amount, discount')
        .eq('company_id', this.companyId)
        .eq('year', currentYear),
      supabase
        .from('pnl_transactions')
        .select('amount, discount')
        .eq('company_id', this.companyId)
        .eq('year', currentYear - 1),
    ]);

    const currentYearRevenue = (currentData.data || []).reduce(
      (sum, tx) => sum + Number(tx.amount) - Number(tx.discount || 0), 0
    );
    const previousYearRevenue = (previousData.data || []).reduce(
      (sum, tx) => sum + Number(tx.amount) - Number(tx.discount || 0), 0
    );

    const changePercent = previousYearRevenue > 0
      ? ((currentYearRevenue - previousYearRevenue) / previousYearRevenue) * 100
      : 0;

    return {
      currentYearRevenue,
      previousYearRevenue,
      changePercent: Math.round(changePercent * 10) / 10,
    };
  }

  async getMoMComparison(year: number, month: number): Promise<{
    currentMonthRevenue: number;
    previousMonthRevenue: number;
    changePercent: number;
  }> {
    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const currentMonthKey = months[month - 1];
    const previousMonthKey = month === 1 ? 'dec' : months[month - 2];
    const previousYear = month === 1 ? year - 1 : year;

    const [currentData, previousData] = await Promise.all([
      supabase
        .from('pnl_transactions')
        .select('amount, discount')
        .eq('company_id', this.companyId)
        .eq('year', year)
        .eq('month', currentMonthKey),
      supabase
        .from('pnl_transactions')
        .select('amount, discount')
        .eq('company_id', this.companyId)
        .eq('year', previousYear)
        .eq('month', previousMonthKey),
    ]);

    const currentMonthRevenue = (currentData.data || []).reduce(
      (sum, tx) => sum + Number(tx.amount) - Number(tx.discount || 0), 0
    );
    const previousMonthRevenue = (previousData.data || []).reduce(
      (sum, tx) => sum + Number(tx.amount) - Number(tx.discount || 0), 0
    );

    const changePercent = previousMonthRevenue > 0
      ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
      : 0;

    return {
      currentMonthRevenue,
      previousMonthRevenue,
      changePercent: Math.round(changePercent * 10) / 10,
    };
  }
}

// ============================================================
// SINGLETON INSTANCES
// ============================================================

const dbInstances: Record<CompanyId, SupabaseDatabaseService> = {} as Record<CompanyId, SupabaseDatabaseService>;

export function getSupabaseDatabase(companyId: CompanyId): SupabaseDatabaseService {
  if (!dbInstances[companyId]) {
    dbInstances[companyId] = new SupabaseDatabaseService(companyId);
  }
  return dbInstances[companyId];
}

// Default export for VMCloud
export default getSupabaseDatabase('vmcloud');
