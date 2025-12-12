// /workspaces/website/apps/web/lib/types/database.ts
// Description: Unified database types for all modules (Clients, Products, Transactions, P&L)
// Last modified: 2025-12-11
// Related docs: /docs/features/DATABASE_SCHEMA.md

// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

// ============================================================
// CORE TYPES
// ============================================================

export type CompanyId = 'vmcloud' | 'hackboot';

export type Timestamp = string; // ISO 8601 format

// ============================================================
// CLIENTS
// ============================================================

export type ClientType = 'individual' | 'business' | 'enterprise';
export type ClientStatus = 'lead' | 'active' | 'inactive' | 'churned';

export type ClientContact = {
  name: string;
  email: string;
  phone?: string;
  role?: string; // "CEO", "CTO", "Billing", etc.
  isPrimary: boolean;
};

export type ClientAddress = {
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

export type Client = {
  id: string;                    // cli_xxx
  companyId: CompanyId;          // Which company this client belongs to

  // Basic info
  name: string;                  // Display name (person or company name)
  email: string;                 // Primary email
  phone?: string;                // Primary phone

  // Business info (for B2B)
  company?: string;              // Company name if different from name
  vatNumber?: string;            // TVA number
  registrationNumber?: string;   // SIRET, etc.

  // Classification
  type: ClientType;
  status: ClientStatus;
  tags?: string[];               // Custom tags: "VIP", "Gaming", "Startup", etc.

  // Multiple contacts (for businesses)
  contacts?: ClientContact[];

  // Addresses
  addresses?: ClientAddress[];

  // Financial
  currency: string;              // EUR, USD, etc.
  paymentTerms?: number;         // Days to pay (30, 45, 60)
  creditLimit?: number;          // Max outstanding amount

  // Dates
  createdAt: Timestamp;
  updatedAt: Timestamp;
  firstPurchaseAt?: Timestamp;
  lastPurchaseAt?: Timestamp;

  // Stats (computed)
  totalRevenue?: number;         // Lifetime revenue
  totalTransactions?: number;    // Number of transactions

  // Notes
  notes?: string;                // Internal notes

  // Custom fields
  metadata?: Record<string, unknown>;
};

// ============================================================
// PRODUCTS (Catalog)
// ============================================================

export type ProductType = 'one_time' | 'subscription' | 'usage_based';
export type ProductStatus = 'active' | 'inactive' | 'discontinued';
export type BillingPeriod = 'hourly' | 'daily' | 'monthly' | 'yearly';

export type ProductPricing = {
  unitPrice: number;
  currency: string;
  billingPeriod?: BillingPeriod;      // For subscriptions
  setupFee?: number;                   // One-time setup fee
  minQuantity?: number;
  maxQuantity?: number;
  volumeDiscounts?: {
    minQuantity: number;
    discountPercent: number;
  }[];
};

export type Product = {
  id: string;                    // prod_xxx
  companyId: CompanyId;

  // Basic info
  name: string;
  description?: string;
  sku?: string;                  // Stock Keeping Unit

  // Classification
  categoryId: string;            // Reference to product category
  type: ProductType;
  status: ProductStatus;
  tags?: string[];

  // Pricing
  pricing: ProductPricing;

  // For P&L linking
  revenueCategory?: string;      // Which P&L revenue category
  costCategory?: string;         // Which P&L expense category (COGS)

  // Dates
  createdAt: Timestamp;
  updatedAt: Timestamp;

  // Metadata
  metadata?: Record<string, unknown>;
};

export type ProductCategory = {
  id: string;                    // cat_xxx
  companyId: CompanyId;
  name: string;
  description?: string;
  parentId?: string;             // For nested categories
  order: number;
  createdAt: Timestamp;
};

// ============================================================
// TRANSACTIONS (Sales)
// ============================================================

export type TransactionStatus = 'pending' | 'completed' | 'refunded' | 'cancelled';
export type PaymentMethod = 'card' | 'transfer' | 'cash' | 'crypto' | 'other';

export type TransactionItem = {
  productId: string;
  productName: string;           // Snapshot at time of sale
  quantity: number;
  unitPrice: number;
  discount?: number;             // In currency
  discountPercent?: number;      // As percentage
  total: number;                 // quantity * unitPrice - discount
};

export type Transaction = {
  id: string;                    // tx_xxx
  companyId: CompanyId;

  // References
  clientId: string;              // Required: link to client
  invoiceId?: string;            // Optional: link to invoice

  // Items
  items: TransactionItem[];

  // Totals
  subtotal: number;              // Before taxes
  taxAmount: number;             // TVA amount
  taxRate: number;               // TVA rate (20, 10, 5.5, etc.)
  total: number;                 // Final amount

  // Status
  status: TransactionStatus;
  paymentMethod?: PaymentMethod;
  paidAt?: Timestamp;

  // For P&L
  month: string;                 // 'jan', 'feb', etc. for P&L aggregation
  year: number;

  // Dates
  createdAt: Timestamp;
  updatedAt: Timestamp;

  // Notes
  notes?: string;

  // Metadata
  metadata?: Record<string, unknown>;
};

// ============================================================
// INVOICES
// ============================================================

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | 'refunded';

export type Invoice = {
  id: string;                    // inv_xxx
  companyId: CompanyId;
  number: string;                // INV-2025-0001

  // References
  clientId: string;
  transactionIds: string[];      // Transactions included

  // Client snapshot (in case client data changes)
  clientSnapshot: {
    name: string;
    email: string;
    address?: ClientAddress;
    vatNumber?: string;
  };

  // Amounts
  subtotal: number;
  taxAmount: number;
  taxRate: number;
  total: number;

  // Status
  status: InvoiceStatus;

  // Dates
  issuedAt: Timestamp;
  dueAt: Timestamp;
  paidAt?: Timestamp;

  // Notes
  notes?: string;
  termsAndConditions?: string;

  // Metadata
  metadata?: Record<string, unknown>;
};

// ============================================================
// P&L DATA (Aggregated from transactions)
// ============================================================

// This keeps backward compatibility with existing P&L structure
// but adds references to transactions

export type PnLTransaction = {
  id: string;
  transactionId?: string;        // NEW: Reference to Transaction collection
  clientId?: string;             // NEW: Reference to Client
  amount: number;
  isCustom: boolean;
  note?: string;
  createdAt?: Timestamp;
};

export type PnLProduct = {
  id: string;
  productId?: string;            // NEW: Reference to Product catalog
  label: string;
  price: number;
  transactions: Record<string, PnLTransaction[]>; // month -> transactions
  rules?: PnLProductRule[];
};

export type PnLProductRule = {
  id: string;
  expenseCategoryId: string;
  expenseItemId: string;
  multiplier: number;
};

export type PnLProductCategory = {
  id: string;
  label: string;
  products: PnLProduct[];
};

export type PnLExpenseItem = {
  id: string;
  label: string;
  type?: string;
  note?: string;
  unitPrice: number;
  quantity: Record<string, number>;
  adjustments: Record<string, number>;
};

export type PnLExpenseCategory = {
  id: string;
  label: string;
  items: PnLExpenseItem[];
  isProtected?: boolean;
};

export type PnLReductions = {
  salesReturns: Record<string, number>;
  salesDiscounts: Record<string, number>;
  costOfGoodsSold: Record<string, number>;
};

export type PnLTaxes = {
  tva: Record<string, number>;
  corporateTax: Record<string, number>;
  otherTaxes: Record<string, number>;
};

export type PnLData = {
  year: number;
  companyId: CompanyId;
  productCategories: PnLProductCategory[];
  reductions: PnLReductions;
  expenseCategories: PnLExpenseCategory[];
  taxes: PnLTaxes;
  updatedAt: Timestamp;
};

// ============================================================
// FIREBASE COLLECTIONS STRUCTURE
// ============================================================
/*
Firebase Database Structure (per company):

vmcladmin/hackbootadmin
├── clients/                    # Client documents
│   ├── cli_001
│   ├── cli_002
│   └── ...
│
├── products/                   # Product catalog
│   ├── prod_001
│   ├── prod_002
│   └── ...
│
├── product_categories/         # Product categories
│   ├── cat_001
│   └── ...
│
├── transactions/               # All sales transactions
│   ├── tx_001
│   ├── tx_002
│   └── ...
│
├── invoices/                   # Invoices
│   ├── inv_001
│   └── ...
│
└── pnl_data/                   # P&L aggregated data (for quick access)
    ├── year_2024
    ├── year_2025
    └── ...

*/

// ============================================================
// HELPER TYPES
// ============================================================

export type FirebaseCollections =
  | 'clients'
  | 'products'
  | 'product_categories'
  | 'transactions'
  | 'invoices'
  | 'pnl_data';

export type CreateClient = Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'totalRevenue' | 'totalTransactions'>;
export type UpdateClient = Partial<Omit<Client, 'id' | 'companyId' | 'createdAt'>>;

export type CreateProduct = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateProduct = Partial<Omit<Product, 'id' | 'companyId' | 'createdAt'>>;

export type CreateTransaction = Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTransaction = Partial<Omit<Transaction, 'id' | 'companyId' | 'createdAt'>>;

export type CreateInvoice = Omit<Invoice, 'id'>;
export type UpdateInvoice = Partial<Omit<Invoice, 'id' | 'companyId' | 'number'>>;
