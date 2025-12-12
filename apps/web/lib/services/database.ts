// /workspaces/website/apps/web/lib/services/database.ts
// Description: Unified database service for Firebase operations (CRUD for all collections)
// Last modified: 2025-12-11
// Related docs: /docs/features/DATABASE_SCHEMA.md

// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Firestore,
  DocumentData,
  QueryConstraint,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { getCompanyDb } from '../firebase';
import {
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
} from '../types/database';

// ============================================================
// UTILS
// ============================================================

function generateId(prefix: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}${random}`;
}

function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

// ============================================================
// DATABASE SERVICE CLASS
// ============================================================

export class DatabaseService {
  private db: Firestore | null;
  private companyId: CompanyId;

  constructor(companyId: CompanyId) {
    this.companyId = companyId;
    this.db = getCompanyDb(companyId);
  }

  private getDb(): Firestore {
    if (!this.db) {
      throw new Error(`Firebase not configured for ${this.companyId}`);
    }
    return this.db;
  }

  // ============================================================
  // CLIENTS
  // ============================================================

  async getClient(clientId: string): Promise<Client | null> {
    const db = this.getDb();
    const docRef = doc(db, 'clients', clientId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as Client) : null;
  }

  async getClients(options?: {
    status?: Client['status'];
    type?: Client['type'];
    search?: string;
    limitCount?: number;
    startAfterId?: string;
  }): Promise<Client[]> {
    const db = this.getDb();
    const constraints: QueryConstraint[] = [];

    if (options?.status) {
      constraints.push(where('status', '==', options.status));
    }
    if (options?.type) {
      constraints.push(where('type', '==', options.type));
    }

    constraints.push(orderBy('createdAt', 'desc'));

    if (options?.limitCount) {
      constraints.push(limit(options.limitCount));
    }

    const q = query(collection(db, 'clients'), ...constraints);
    const snapshot = await getDocs(q);

    let clients = snapshot.docs.map((doc) => doc.data() as Client);

    // Client-side search (Firebase doesn't support full-text search)
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
    const db = this.getDb();
    const id = generateId('cli');
    const now = getCurrentTimestamp();

    const client: Client = {
      ...data,
      id,
      companyId: this.companyId,
      createdAt: now,
      updatedAt: now,
      totalRevenue: 0,
      totalTransactions: 0,
    };

    await setDoc(doc(db, 'clients', id), client);
    return client;
  }

  async updateClient(clientId: string, data: UpdateClient): Promise<Client | null> {
    const db = this.getDb();
    const docRef = doc(db, 'clients', clientId);

    const updateData = {
      ...data,
      updatedAt: getCurrentTimestamp(),
    };

    await updateDoc(docRef, updateData as DocumentData);
    return this.getClient(clientId);
  }

  async deleteClient(clientId: string): Promise<void> {
    const db = this.getDb();
    await deleteDoc(doc(db, 'clients', clientId));
  }

  // ============================================================
  // PRODUCTS
  // ============================================================

  async getProduct(productId: string): Promise<Product | null> {
    const db = this.getDb();
    const docRef = doc(db, 'products', productId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as Product) : null;
  }

  async getProducts(options?: {
    categoryId?: string;
    status?: Product['status'];
    type?: Product['type'];
    limitCount?: number;
  }): Promise<Product[]> {
    const db = this.getDb();
    const constraints: QueryConstraint[] = [];

    if (options?.categoryId) {
      constraints.push(where('categoryId', '==', options.categoryId));
    }
    if (options?.status) {
      constraints.push(where('status', '==', options.status));
    }
    if (options?.type) {
      constraints.push(where('type', '==', options.type));
    }

    constraints.push(orderBy('createdAt', 'desc'));

    if (options?.limitCount) {
      constraints.push(limit(options.limitCount));
    }

    const q = query(collection(db, 'products'), ...constraints);
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => doc.data() as Product);
  }

  async createProduct(data: CreateProduct): Promise<Product> {
    const db = this.getDb();
    const id = generateId('prod');
    const now = getCurrentTimestamp();

    const product: Product = {
      ...data,
      id,
      companyId: this.companyId,
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(doc(db, 'products', id), product);
    return product;
  }

  async updateProduct(productId: string, data: UpdateProduct): Promise<Product | null> {
    const db = this.getDb();
    const docRef = doc(db, 'products', productId);

    const updateData = {
      ...data,
      updatedAt: getCurrentTimestamp(),
    };

    await updateDoc(docRef, updateData as DocumentData);
    return this.getProduct(productId);
  }

  async deleteProduct(productId: string): Promise<void> {
    const db = this.getDb();
    await deleteDoc(doc(db, 'products', productId));
  }

  // ============================================================
  // PRODUCT CATEGORIES
  // ============================================================

  async getProductCategories(): Promise<ProductCategory[]> {
    const db = this.getDb();
    const q = query(collection(db, 'product_categories'), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data() as ProductCategory);
  }

  async createProductCategory(name: string, description?: string): Promise<ProductCategory> {
    const db = this.getDb();
    const id = generateId('cat');
    const now = getCurrentTimestamp();

    // Get current max order
    const categories = await this.getProductCategories();
    const maxOrder = categories.reduce((max, c) => Math.max(max, c.order), 0);

    const category: ProductCategory = {
      id,
      companyId: this.companyId,
      name,
      description,
      order: maxOrder + 1,
      createdAt: now,
    };

    await setDoc(doc(db, 'product_categories', id), category);
    return category;
  }

  // ============================================================
  // TRANSACTIONS
  // ============================================================

  async getTransaction(transactionId: string): Promise<Transaction | null> {
    const db = this.getDb();
    const docRef = doc(db, 'transactions', transactionId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as Transaction) : null;
  }

  async getTransactions(options?: {
    clientId?: string;
    status?: Transaction['status'];
    year?: number;
    month?: string;
    limitCount?: number;
  }): Promise<Transaction[]> {
    const db = this.getDb();
    const constraints: QueryConstraint[] = [];

    if (options?.clientId) {
      constraints.push(where('clientId', '==', options.clientId));
    }
    if (options?.status) {
      constraints.push(where('status', '==', options.status));
    }
    if (options?.year) {
      constraints.push(where('year', '==', options.year));
    }
    if (options?.month) {
      constraints.push(where('month', '==', options.month));
    }

    constraints.push(orderBy('createdAt', 'desc'));

    if (options?.limitCount) {
      constraints.push(limit(options.limitCount));
    }

    const q = query(collection(db, 'transactions'), ...constraints);
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => doc.data() as Transaction);
  }

  async getClientTransactions(clientId: string): Promise<Transaction[]> {
    return this.getTransactions({ clientId });
  }

  async createTransaction(data: CreateTransaction): Promise<Transaction> {
    const db = this.getDb();
    const id = generateId('tx');
    const now = getCurrentTimestamp();

    const transaction: Transaction = {
      ...data,
      id,
      companyId: this.companyId,
      createdAt: now,
      updatedAt: now,
    };

    // Create transaction
    await setDoc(doc(db, 'transactions', id), transaction);

    // Update client stats
    await this.updateClientStats(data.clientId);

    return transaction;
  }

  async updateTransaction(
    transactionId: string,
    data: UpdateTransaction
  ): Promise<Transaction | null> {
    const db = this.getDb();
    const docRef = doc(db, 'transactions', transactionId);

    const updateData = {
      ...data,
      updatedAt: getCurrentTimestamp(),
    };

    await updateDoc(docRef, updateData as DocumentData);

    // Get the updated transaction to update client stats
    const transaction = await this.getTransaction(transactionId);
    if (transaction) {
      await this.updateClientStats(transaction.clientId);
    }

    return transaction;
  }

  async deleteTransaction(transactionId: string): Promise<void> {
    const db = this.getDb();

    // Get transaction first to update client stats after
    const transaction = await this.getTransaction(transactionId);

    await deleteDoc(doc(db, 'transactions', transactionId));

    // Update client stats
    if (transaction) {
      await this.updateClientStats(transaction.clientId);
    }
  }

  // ============================================================
  // INVOICES
  // ============================================================

  async getInvoice(invoiceId: string): Promise<Invoice | null> {
    const db = this.getDb();
    const docRef = doc(db, 'invoices', invoiceId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as Invoice) : null;
  }

  async getInvoices(options?: {
    clientId?: string;
    status?: Invoice['status'];
    limitCount?: number;
  }): Promise<Invoice[]> {
    const db = this.getDb();
    const constraints: QueryConstraint[] = [];

    if (options?.clientId) {
      constraints.push(where('clientId', '==', options.clientId));
    }
    if (options?.status) {
      constraints.push(where('status', '==', options.status));
    }

    constraints.push(orderBy('issuedAt', 'desc'));

    if (options?.limitCount) {
      constraints.push(limit(options.limitCount));
    }

    const q = query(collection(db, 'invoices'), ...constraints);
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => doc.data() as Invoice);
  }

  async createInvoice(data: CreateInvoice): Promise<Invoice> {
    const db = this.getDb();
    const id = generateId('inv');

    const invoice: Invoice = {
      ...data,
      id,
      companyId: this.companyId,
    };

    await setDoc(doc(db, 'invoices', id), invoice);
    return invoice;
  }

  async updateInvoice(invoiceId: string, data: UpdateInvoice): Promise<Invoice | null> {
    const db = this.getDb();
    const docRef = doc(db, 'invoices', invoiceId);

    await updateDoc(docRef, data as DocumentData);
    return this.getInvoice(invoiceId);
  }

  // ============================================================
  // P&L DATA
  // ============================================================

  async getPnLData(year: number): Promise<PnLData | null> {
    const db = this.getDb();
    const docRef = doc(db, 'pnl_data', `year_${year}`);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as PnLData) : null;
  }

  async savePnLData(data: PnLData): Promise<void> {
    const db = this.getDb();
    const docRef = doc(db, 'pnl_data', `year_${data.year}`);
    await setDoc(docRef, {
      ...data,
      companyId: this.companyId,
      updatedAt: getCurrentTimestamp(),
    });
  }

  // ============================================================
  // STATS & AGGREGATIONS
  // ============================================================

  async updateClientStats(clientId: string): Promise<void> {
    const db = this.getDb();

    // Get all completed transactions for this client
    const transactions = await this.getTransactions({
      clientId,
      status: 'completed',
    });

    const totalRevenue = transactions.reduce((sum, tx) => sum + tx.total, 0);
    const totalTransactions = transactions.length;

    const firstPurchase = transactions.length > 0
      ? transactions[transactions.length - 1].createdAt
      : undefined;
    const lastPurchase = transactions.length > 0
      ? transactions[0].createdAt
      : undefined;

    await updateDoc(doc(db, 'clients', clientId), {
      totalRevenue,
      totalTransactions,
      firstPurchaseAt: firstPurchase,
      lastPurchaseAt: lastPurchase,
      updatedAt: getCurrentTimestamp(),
    });
  }

  async getDashboardStats(): Promise<{
    totalClients: number;
    activeClients: number;
    monthlyRevenue: number;
    yearlyRevenue: number;
    recentTransactions: Transaction[];
  }> {
    const db = this.getDb();
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.toLocaleString('en-US', { month: 'short' }).toLowerCase();

    // Get all clients
    const clients = await this.getClients();
    const activeClients = clients.filter((c) => c.status === 'active');

    // Get transactions for this month and year
    const yearTransactions = await this.getTransactions({
      year: currentYear,
      status: 'completed',
    });

    const monthTransactions = yearTransactions.filter((tx) => tx.month === currentMonth);

    const monthlyRevenue = monthTransactions.reduce((sum, tx) => sum + tx.total, 0);
    const yearlyRevenue = yearTransactions.reduce((sum, tx) => sum + tx.total, 0);

    // Recent transactions
    const recentTransactions = await this.getTransactions({ limitCount: 10 });

    return {
      totalClients: clients.length,
      activeClients: activeClients.length,
      monthlyRevenue,
      yearlyRevenue,
      recentTransactions,
    };
  }

  // ============================================================
  // SYNC P&L FROM TRANSACTIONS
  // ============================================================

  async syncPnLFromTransactions(year: number): Promise<PnLData> {
    // Get all transactions for the year
    const transactions = await this.getTransactions({
      year,
      status: 'completed',
    });

    // Get products
    const products = await this.getProducts();
    const categories = await this.getProductCategories();

    // Build P&L structure from transactions
    // This is a basic implementation - can be enhanced

    const existingPnL = await this.getPnLData(year);

    // For now, keep existing P&L structure and just update totals
    // Full sync would require more complex logic

    const pnlData: PnLData = existingPnL || {
      year,
      companyId: this.companyId,
      productCategories: [],
      reductions: {
        salesReturns: {},
        salesDiscounts: {},
        costOfGoodsSold: {},
      },
      expenseCategories: [],
      taxes: {
        tva: {},
        corporateTax: {},
        otherTaxes: {},
      },
      updatedAt: getCurrentTimestamp(),
    };

    await this.savePnLData(pnlData);
    return pnlData;
  }
}

// ============================================================
// SINGLETON INSTANCES
// ============================================================

const dbInstances: Record<CompanyId, DatabaseService> = {} as Record<CompanyId, DatabaseService>;

export function getDatabase(companyId: CompanyId): DatabaseService {
  if (!dbInstances[companyId]) {
    dbInstances[companyId] = new DatabaseService(companyId);
  }
  return dbInstances[companyId];
}

// Default export for VMCloud
export default getDatabase('vmcloud');
