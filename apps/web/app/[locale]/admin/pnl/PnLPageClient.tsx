// /workspaces/website/apps/web/app/[locale]/admin/pnl/PnLPageClient.tsx
// Description: P&L Dashboard with products (clients × price) - Refined design with v2 features
// Last modified: 2025-12-11
// Related docs: /docs/features/ADMIN_PNL_V2.md

// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Minus,
  Save,
  Loader2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Edit3,
  X,
  Check,
  Users,
  Package,
  FolderPlus,
  Pencil,
  Settings,
  Link,
  ChevronDown,
  Receipt,
  Sparkles,
  Download,
  FileText,
  Calendar,
  BarChart3,
  RefreshCw,
  Search,
  UserPlus,
  Shuffle,
} from 'lucide-react';
import { getCompanyDb, getPublicDb } from '../../../../lib/firebase';
import { doc, setDoc, getDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { generateRandomClient, type GeneratedClient } from '../../../../lib/utils/clientGenerator';
import type { Client } from '../../../../lib/types/database';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Types
type ProductRule = {
  id: string;
  expenseCategoryId: string;
  expenseItemId: string;
  multiplier: number; // Nombre d'unités ajoutées par client (ex: 1 = +1 employé)
};

type Transaction = {
  id: string;
  amount: number; // Montant réel de cette transaction
  isCustom: boolean; // false = prix standard, true = prix spécial
  note?: string; // Note optionnelle (ex: "Réduction fidélité")
  discount?: number; // Montant de la réduction appliquée (si > 0, lié à COGS salesDiscounts)
  // Client info (required)
  clientId: string; // Reference to client document
  clientName: string; // Snapshot for quick display
  clientEmail?: string; // Snapshot of email
};

// Client selection mode in transaction modal
type ClientSelectionMode = 'existing' | 'create' | 'generate';

type Product = {
  id: string;
  label: string;
  price: number; // Prix unitaire de base
  transactions: Record<string, Transaction[]>; // month -> liste de transactions
  rules?: ProductRule[]; // Règles de coûts auto
};

type ProductCategory = {
  id: string;
  label: string;
  products: Product[];
  isFromCatalogue?: boolean; // true = from catalogue, cannot be deleted
};

type ExpenseItem = {
  id: string;
  label: string;
  type?: string;       // NEW: Type badge (e.g., "Freelance", "sub constant")
  note?: string;       // NEW: Note badge (e.g., "t3.large", "90/user")
  unitPrice: number; // Prix unitaire (ex: salaire mensuel)
  quantity: Record<string, number>; // Quantité manuelle par mois
  adjustments: Record<string, number>; // Ajustements manuels par mois (€)
};

// NEW: Reductions data (COGS)
type ReductionData = {
  salesReturns: Record<string, number>;
  salesDiscounts: Record<string, number>;
  costOfGoodsSold: Record<string, number>;
};

// NEW: Taxes data (separate from expenses)
type TaxesData = {
  tva: Record<string, number>;
  corporateTax: Record<string, number>;  // Impôt sur les sociétés
  otherTaxes: Record<string, number>;
};

type ExpenseCategory = {
  id: string;
  label: string;
  items: ExpenseItem[];
  isProtected?: boolean; // Catégories qu'on ne peut pas supprimer
};

type PnLData = {
  year: number;
  productCategories: ProductCategory[];
  reductions: ReductionData;  // COGS section
  expenseCategories: ExpenseCategory[];
  taxes: TaxesData;  // Taxes section (separate from expenses)
  updatedAt: string;
};

// Months
const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
const MONTH_KEYS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

// Helper: Generate transactions from client count and price (with generated clients)
const generateTransactions = (counts: Record<string, number>, price: number): Record<string, Transaction[]> => {
  const result: Record<string, Transaction[]> = {};
  for (const [month, count] of Object.entries(counts)) {
    result[month] = Array.from({ length: count }, (_, i) => {
      const client = generateRandomClient();
      return {
        id: `${month}_${i}`,
        amount: price,
        isCustom: false,
        clientId: client.id,
        clientName: client.name,
        clientEmail: client.email,
      };
    });
  }
  return result;
};

// Default data - Imported from Hackboot.xlsx
const getDefaultData = (year: number): PnLData => ({
  year,
  updatedAt: new Date().toISOString(),
  productCategories: [
    {
      id: 'packs',
      label: 'Packs Coaching',
      products: [
        { id: 'pack_essentiel', label: 'Pack Essentiel', price: 19.99, transactions: generateTransactions({ jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 12, oct: 49, nov: 89, dec: 132 }, 19.99) },
        { id: 'pack_avantage', label: 'Pack Avantage', price: 35, transactions: generateTransactions({ jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 4, oct: 16, nov: 51, dec: 78 }, 35) },
        { id: 'pack_elite', label: 'Pack Élite', price: 60, transactions: generateTransactions({ jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 7, nov: 21, dec: 34 }, 60) },
      ],
    },
    {
      id: 'vms',
      label: 'VMs Gaming',
      products: [
        { id: 'vm_clash', label: 'VM Clash Royal', price: 160, transactions: generateTransactions({ jan: 23, feb: 31, mar: 12, apr: 7, may: 4, jun: 26, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 }, 160) },
        { id: 'vm_cod', label: 'VM Call Of Duty', price: 1650, transactions: generateTransactions({ jan: 8, feb: 4, mar: 9, apr: 13, may: 3, jun: 7, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 }, 1650) },
        { id: 'vm_overwatch', label: 'VM Overwatch 2', price: 880.4, transactions: generateTransactions({ jan: 2, feb: 1, mar: 6, apr: 4, may: 8, jun: 11, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 }, 880.4) },
      ],
    },
  ],
  // Reductions (COGS) - from Hackboot.xlsx
  reductions: {
    salesReturns: { jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
    salesDiscounts: { jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
    costOfGoodsSold: { jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
  },
  expenseCategories: [
    // EMPLOYEE - from Hackboot.xlsx
    {
      id: 'employee',
      label: 'Employés',
      isProtected: true,
      items: [
        { id: 'emp_luf', label: 'Luf', type: 'Freelance', unitPrice: 0, quantity: {}, adjustments: { jan: 4000, feb: 4000, mar: 4000, apr: 4000, may: 4000, jun: 4000, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 } },
        { id: 'emp_gengis', label: 'Gengis', unitPrice: 0, quantity: {}, adjustments: {} },
      ],
    },
    // SOFTWARE & CLOUD - AWS costs from Hackboot.xlsx
    {
      id: 'software',
      label: 'Software & Cloud',
      items: [
        { id: 'aws_clash', label: 'AWS - Clash Royal', type: 'AWS', note: 't3.large', unitPrice: 0, quantity: {}, adjustments: { jan: 1377.7, feb: 1856.9, mar: 718.8, apr: 419.3, may: 239.6, jun: 1557.4, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 } },
        { id: 'aws_overwatch', label: 'AWS - Overwatch 2', type: 'AWS', note: 'g4dn.2xlarge', unitPrice: 0, quantity: {}, adjustments: { jan: 1612.8, feb: 806.4, mar: 4838.4, apr: 3225.6, may: 6451.2, jun: 8870.4, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 } },
        { id: 'aws_cod', label: 'AWS - Call Of Duty', type: 'AWS', note: 'g4dn.2xlarge', unitPrice: 0, quantity: {}, adjustments: { jan: 6451.2, feb: 3225.6, mar: 7257.6, apr: 10483.2, may: 2419.2, jun: 5644.8, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 } },
        { id: 'lms', label: 'LMS', type: 'sub constant', unitPrice: 0, quantity: {}, adjustments: {} },
      ],
    },
    // BANKING & FINANCE - from Hackboot.xlsx
    {
      id: 'banking',
      label: 'Banque & Finance',
      items: [
        { id: 'bank_fees', label: 'Frais bancaires', unitPrice: 0, quantity: {}, adjustments: {} },
        { id: 'bad_debts', label: 'Créances douteuses', unitPrice: 0, quantity: {}, adjustments: {} },
        { id: 'interest_paid', label: 'Intérêts payés', unitPrice: 0, quantity: {}, adjustments: {} },
        { id: 'insurance_bank', label: 'Assurance', unitPrice: 0, quantity: {}, adjustments: {} },
        { id: 'loan_fees', label: 'Frais de prêt', unitPrice: 0, quantity: {}, adjustments: {} },
      ],
    },
    // GENERAL BUSINESS - from Hackboot.xlsx
    {
      id: 'business',
      label: 'Business Général',
      items: [
        { id: 'aws_infra', label: 'AWS Infrastructure', type: 'sub constant', note: '20/user', unitPrice: 0, quantity: {}, adjustments: {} },
        { id: 'ovh_cloud', label: 'OVH Cloud', type: 'sub constant', unitPrice: 0, quantity: {}, adjustments: {} },
        { id: 'telecom', label: 'Télécommunication', note: '90/user', unitPrice: 0, quantity: {}, adjustments: {} },
        { id: 'marketing', label: 'Marketing & Publicité', type: 'sub constant', unitPrice: 0, quantity: {}, adjustments: {} },
        { id: 'web_hosting', label: 'Web Hosting', type: 'sub constant', unitPrice: 0, quantity: {}, adjustments: {} },
        { id: 'lms_manager', label: 'LMS Manager', type: 'sub constant', unitPrice: 0, quantity: {}, adjustments: {} },
        { id: 'office_supplies', label: 'Fournitures bureau', unitPrice: 0, quantity: {}, adjustments: {} },
        { id: 'professional_dues', label: 'Cotisations professionnelles', unitPrice: 0, quantity: {}, adjustments: {} },
        { id: 'subscriptions', label: 'Abonnements', unitPrice: 0, quantity: {}, adjustments: {} },
        { id: 'freight', label: 'Fret', unitPrice: 0, quantity: {}, adjustments: {} },
        { id: 'postage', label: 'Expédition & Courrier', unitPrice: 0, quantity: {}, adjustments: {} },
        { id: 'depreciation', label: 'Amortissements', unitPrice: 0, quantity: {}, adjustments: {} },
        { id: 'travel', label: 'Déplacements', unitPrice: 0, quantity: {}, adjustments: {} },
        { id: 'tech_licenses', label: 'Licences techniques', unitPrice: 0, quantity: {}, adjustments: {} },
        { id: 'meals', label: 'Repas & Réceptions', unitPrice: 0, quantity: {}, adjustments: {} },
        { id: 'patent_fees', label: 'Brevets', unitPrice: 0, quantity: {}, adjustments: {} },
        { id: 'legal_losses', label: 'Pertes juridiques', unitPrice: 0, quantity: {}, adjustments: {} },
      ],
    },
  ],
  // Taxes (separate from expenses - shown after Operating Profit)
  taxes: {
    tva: { jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
    corporateTax: { jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
    otherTaxes: { jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
  },
});

// Format
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Company configurations
const companyConfig = {
  hackboot: {
    name: 'Hackboot',
    collection: 'pnl_data', // Each company has its own Firebase DB
    color: 'violet',
  },
  vmcloud: {
    name: 'VMCloud',
    collection: 'pnl_data', // Each company has its own Firebase DB
    color: 'emerald',
  },
};

type CompanyId = keyof typeof companyConfig;

type PnLPageClientProps = {
  company: CompanyId;
};

export default function PnLPageClient({ company }: PnLPageClientProps) {
  const config = companyConfig[company];
  const db = getCompanyDb(company);

  const [data, setData] = useState<PnLData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'expenses' | 'annual'>('overview');
  const [hasChanges, setHasChanges] = useState(false);
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [rulesModal, setRulesModal] = useState<{ catId: string; product: Product } | null>(null);
  const [transactionsModal, setTransactionsModal] = useState<{ catId: string; product: Product } | null>(null);
  const [openAccordions, setOpenAccordions] = useState<string[]>([]);
  const [txCounter, setTxCounter] = useState(1);
  const [customTxAmount, setCustomTxAmount] = useState('');
  const [customTxNote, setCustomTxNote] = useState('');
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [syncing, setSyncing] = useState(false);

  // Client selection for transactions
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [clientSelectionMode, setClientSelectionMode] = useState<ClientSelectionMode>('generate');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [clientSearchQuery, setClientSearchQuery] = useState('');
  const [generatedClientPreview, setGeneratedClientPreview] = useState<GeneratedClient | null>(null);
  // Manual client creation
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientCountry, setNewClientCountry] = useState('FR');
  const [newClientType, setNewClientType] = useState<'individual' | 'company'>('individual');
  const [emailError, setEmailError] = useState<string | null>(null);
  // Discount for transaction (active discount applies to next sales)
  const [discountAmount, setDiscountAmount] = useState('');
  const [discountNote, setDiscountNote] = useState('');
  const [activeDiscount, setActiveDiscount] = useState<{ amount: number; note: string } | null>(null);
  const [showDiscountTransactions, setShowDiscountTransactions] = useState(false);

  const currentMonthKey = MONTH_KEYS[selectedMonth];

  // Toggle accordion
  const toggleAccordion = (id: string) => {
    setOpenAccordions((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  // Catalogue cache (shared across P&L)
  const catalogueCacheKey = 'catalogue_cache';
  const CATALOGUE_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  // Load catalogue from vmclpublic
  const loadCatalogue = useCallback(async (): Promise<ProductCategory[]> => {
    // Check cache first
    const cached = localStorage.getItem(catalogueCacheKey);
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - new Date(timestamp).getTime() < CATALOGUE_CACHE_TTL) {
          // Convert catalogue categories to ProductCategory format
          return data.map((cat: { id: string; name: string; products: Array<{ id: string; name: string; monthly?: number; hourly?: number; annual?: number; price_per_gb_month?: number }> }) => ({
            id: cat.id,
            label: cat.name || cat.id,
            isFromCatalogue: true,
            products: (cat.products || []).map((p: { id: string; name: string; monthly?: number; hourly?: number; annual?: number; price_per_gb_month?: number }) => ({
              id: p.id,
              label: p.name || p.id,
              price: p.monthly || p.hourly || p.annual || p.price_per_gb_month || 0,
              transactions: {},
            })),
          }));
        }
      } catch { /* Invalid cache */ }
    }

    // Load from Firebase
    const publicDb = getPublicDb();
    if (!publicDb) return [];

    try {
      const snapshot = await getDocs(collection(publicDb, 'catalogue'));
      const categories: ProductCategory[] = [];

      snapshot.forEach((docSnap) => {
        if (docSnap.id !== '_manifest') {
          const catData = docSnap.data();
          categories.push({
            id: catData.id || docSnap.id,
            label: catData.name || catData.displayName || docSnap.id,
            isFromCatalogue: true,
            products: (catData.products || []).map((p: { id: string; name: string; monthly?: number; hourly?: number; annual?: number; price_per_gb_month?: number }) => ({
              id: p.id,
              label: p.name || p.id,
              price: p.monthly || p.hourly || p.annual || p.price_per_gb_month || 0,
              transactions: {},
            })),
          });
        }
      });

      return categories;
    } catch (err) {
      console.error('Error loading catalogue:', err);
      return [];
    }
  }, []);

  // Cache key for localStorage (per company)
  const cacheKey = `pnl_cache_${company}_${selectedYear}`;

  // Load data (from cache first, then Firebase)
  const loadData = useCallback(async (forceSync = false) => {
    // Clear cache if forcing sync
    if (forceSync) {
      localStorage.removeItem(cacheKey);
    }

    // Try cache first (unless forcing sync)
    let pnlData: PnLData | null = null;
    let fromCache = false;

    if (!forceSync) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const { data: cachedData, timestamp } = JSON.parse(cached);
          pnlData = cachedData;
          fromCache = true;
          setLastSynced(new Date(timestamp));
        } catch {
          // Invalid cache, continue to Firebase
        }
      }
    }

    // If not from cache, load from Firebase
    if (!pnlData) {
      if (!db) {
        setError('Firebase not configured');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        if (forceSync) setSyncing(true);
        const docRef = doc(db, config.collection, `year_${selectedYear}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          pnlData = docSnap.data() as PnLData;
        }
      } catch (err) {
        console.error('Error loading:', err);
        setError('Erreur de chargement');
        setData(getDefaultData(selectedYear));
        setLoading(false);
        setSyncing(false);
        return;
      }
    }

    try {
      let newData: PnLData;
      if (pnlData) {
        newData = pnlData;
      } else {
        // DB is empty - use default data only for Hackboot, empty structure for others
        if (company === 'hackboot') {
          newData = getDefaultData(selectedYear);
        } else {
          // Empty P&L structure for VMCloud and others
          newData = {
            year: selectedYear,
            productCategories: [],
            reductions: { salesReturns: {}, salesDiscounts: {}, costOfGoodsSold: {} },
            expenseCategories: [],
            taxes: { tva: {}, corporateTax: {}, otherTaxes: {} },
            updatedAt: new Date().toISOString(),
          };
        }
      }

      // For VMCloud, merge with catalogue categories
      if (company === 'vmcloud') {
        const catalogueCategories = await loadCatalogue();

        // Merge catalogue categories with existing P&L categories
        const mergedCategories: ProductCategory[] = [];
        const existingCatIds = new Set(newData.productCategories.map(c => c.id));

        // First, add catalogue categories (with existing transactions if any)
        for (const catCat of catalogueCategories) {
          const existingCat = newData.productCategories.find(c => c.id === catCat.id);

          if (existingCat) {
            // Category exists in P&L - merge products keeping transactions
            const mergedProducts: Product[] = [];
            const existingProductIds = new Set(existingCat.products.map(p => p.id));

            // Add catalogue products with existing transactions
            for (const catProd of catCat.products) {
              const existingProd = existingCat.products.find(p => p.id === catProd.id);
              if (existingProd) {
                // Keep existing product with its transactions, update price from catalogue
                mergedProducts.push({
                  ...existingProd,
                  label: catProd.label, // Update label from catalogue
                  price: catProd.price, // Update price from catalogue
                });
              } else {
                // New product from catalogue
                mergedProducts.push(catProd);
              }
            }

            // Keep products that have transactions but are no longer in catalogue
            for (const existingProd of existingCat.products) {
              if (!catCat.products.find(p => p.id === existingProd.id)) {
                // Product removed from catalogue but has transactions - keep it
                const hasTransactions = Object.values(existingProd.transactions).some(t => t.length > 0);
                if (hasTransactions) {
                  mergedProducts.push({
                    ...existingProd,
                    label: `${existingProd.label} (archivé)`,
                  });
                }
              }
            }

            mergedCategories.push({
              ...catCat,
              products: mergedProducts,
            });
          } else {
            // New category from catalogue
            mergedCategories.push(catCat);
          }
        }

        // Keep categories that are not in catalogue
        for (const existingCat of newData.productCategories) {
          if (!catalogueCategories.find(c => c.id === existingCat.id)) {
            // Check if this was previously a catalogue category (now removed)
            if (existingCat.isFromCatalogue) {
              // Was from catalogue but removed - only keep if has transactions
              const hasTransactions = existingCat.products.some(p =>
                Object.values(p.transactions).some(t => t.length > 0)
              );
              if (hasTransactions) {
                mergedCategories.push({
                  ...existingCat,
                  label: existingCat.label.includes('(archivé)') ? existingCat.label : `${existingCat.label} (archivé)`,
                  isFromCatalogue: false, // No longer protected
                });
              }
            } else {
              // Manual category - always keep it
              mergedCategories.push(existingCat);
            }
          }
        }

        newData.productCategories = mergedCategories;
      }

      setData(newData);
      setError(null);
      setHasChanges(false);

      // Update cache - but don't cache catalogue categories (they're loaded fresh each time)
      // Only cache if we loaded from Firebase (not from cache)
      if (!fromCache) {
        const now = new Date();
        // For VMCloud, save without catalogue categories (they're merged on load)
        const dataToCache = company === 'vmcloud'
          ? { ...newData, productCategories: newData.productCategories.filter(c => !c.isFromCatalogue) }
          : newData;
        localStorage.setItem(cacheKey, JSON.stringify({ data: dataToCache, timestamp: now.toISOString() }));
        setLastSynced(now);
      }
    } catch (err) {
      console.error('Error loading:', err);
      setError('Erreur de chargement');
      setData(getDefaultData(selectedYear));
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }, [selectedYear, cacheKey, db, config, company, loadCatalogue]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Warn before leaving with unsaved changes (reload, close, back button, links)
  useEffect(() => {
    if (!hasChanges) return;

    // Handler for page refresh/close
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'Vous avez des modifications non sauvegardées. Êtes-vous sûr de vouloir quitter ?';
      return e.returnValue;
    };

    // Handler for browser back/forward buttons
    const handlePopState = (e: PopStateEvent) => {
      if (hasChanges) {
        const confirmLeave = window.confirm(
          'Vous avez des modifications non sauvegardées.\n\nVoulez-vous vraiment quitter cette page ?'
        );
        if (!confirmLeave) {
          // Push current state back to prevent navigation
          window.history.pushState(null, '', window.location.href);
        }
      }
    };

    // Handler for link clicks (internal navigation)
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');

      if (link && link.href && !link.href.startsWith('javascript:') && !link.target) {
        // Check if it's an internal link (same origin)
        const url = new URL(link.href, window.location.origin);
        if (url.origin === window.location.origin && url.pathname !== window.location.pathname) {
          const confirmLeave = window.confirm(
            'Vous avez des modifications non sauvegardées.\n\nVoulez-vous vraiment quitter cette page ?'
          );
          if (!confirmLeave) {
            e.preventDefault();
            e.stopPropagation();
          }
        }
      }
    };

    // Push initial state for popstate handling
    window.history.pushState(null, '', window.location.href);

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    document.addEventListener('click', handleLinkClick, true);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', handleLinkClick, true);
    };
  }, [hasChanges]);

  // Keyboard shortcut: Cmd+Enter or Ctrl+Enter to save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && hasChanges && !saving) {
        e.preventDefault();
        saveDataRef.current?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasChanges, saving]);

  // Save data ref for keyboard shortcut
  const saveDataRef = useRef<() => void>();

  // Save data
  const saveData = async () => {
    if (!db || !data) return;

    try {
      setSaving(true);
      const updatedData = { ...data, updatedAt: new Date().toISOString() };
      const docRef = doc(db, config.collection, `year_${selectedYear}`);
      await setDoc(docRef, updatedData);
      setHasChanges(false);

      // Update cache
      const now = new Date();
      localStorage.setItem(cacheKey, JSON.stringify({ data: updatedData, timestamp: now.toISOString() }));
      setLastSynced(now);
    } catch (err) {
      console.error('Error saving:', err);
      setError('Erreur de sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  // Sync from Firebase (force refresh)
  const syncData = () => loadData(true);

  // Load clients from Firebase
  const loadClients = useCallback(async () => {
    if (!db) return;
    try {
      setLoadingClients(true);
      const q = query(collection(db, 'clients'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const clientsData = snapshot.docs.map((doc) => doc.data() as Client);
      setClients(clientsData);
    } catch (err) {
      console.error('Error loading clients:', err);
    } finally {
      setLoadingClients(false);
    }
  }, [db]);

  // Create client in Firebase
  const createClientInDb = async (clientData: GeneratedClient): Promise<Client> => {
    if (!db) throw new Error('Database not initialized');

    const now = new Date().toISOString();
    const client: Client = {
      id: clientData.id,
      companyId: company,
      name: clientData.name,
      email: clientData.email,
      phone: clientData.phone || '',
      type: clientData.type,
      status: 'active',
      currency: 'EUR',
      isGenerated: clientData.isGenerated ?? true,
      generatedAt: clientData.generatedAt,
      createdAt: now,
      updatedAt: now,
      totalRevenue: 0,
      totalTransactions: 0,
    };

    // Add optional fields only if defined (Firestore rejects undefined)
    if (clientData.company) client.company = clientData.company;
    if (clientData.country) client.country = clientData.country;

    await setDoc(doc(db, 'clients', client.id), client);
    setClients((prev) => [client, ...prev]);
    return client;
  };

  // Update client stats after transaction
  const updateClientStats = async (clientId: string, amount: number) => {
    if (!db) return;
    try {
      const clientRef = doc(db, 'clients', clientId);
      const clientSnap = await getDoc(clientRef);
      if (clientSnap.exists()) {
        const clientData = clientSnap.data() as Client;
        const now = new Date().toISOString();
        await setDoc(clientRef, {
          ...clientData,
          totalRevenue: (clientData.totalRevenue || 0) + amount,
          totalTransactions: (clientData.totalTransactions || 0) + 1,
          lastPurchaseAt: now,
          firstPurchaseAt: clientData.firstPurchaseAt || now,
          updatedAt: now,
        });
      }
    } catch (err) {
      console.error('Error updating client stats:', err);
    }
  };

  // Load clients when modal opens
  useEffect(() => {
    if (transactionsModal) {
      loadClients();
      // Generate a preview client
      setGeneratedClientPreview(generateRandomClient());
    }
  }, [transactionsModal, loadClients]);

  // Update ref for keyboard shortcut
  saveDataRef.current = saveData;

  // Get transactions count for a product/month
  const getTransactionsCount = (product: Product, month: string) => {
    return product.transactions?.[month]?.length || 0;
  };

  // Get all transactions with discounts for a month (across all products)
  const getDiscountedTransactions = (month: string) => {
    if (!data?.productCategories) return [];
    const result: Array<{
      catId: string;
      catName: string;
      productId: string;
      productName: string;
      transaction: Transaction;
    }> = [];

    data.productCategories.forEach((cat) => {
      cat.products.forEach((product) => {
        const txs = product.transactions?.[month] || [];
        txs.forEach((tx) => {
          if (tx.discount && tx.discount > 0) {
            result.push({
              catId: cat.id,
              catName: cat.name,
              productId: product.id,
              productName: product.name,
              transaction: tx,
            });
          }
        });
      });
    });
    return result;
  };

  // Get transactions revenue for a product/month
  const getTransactionsRevenue = (product: Product, month: string) => {
    const txs = product.transactions?.[month] || [];
    return txs.reduce((sum, tx) => sum + tx.amount, 0);
  };

  // Add standard transaction(s) with client info
  const addStandardTransactions = async (
    catId: string,
    productId: string,
    month: string,
    count: number,
    clientInfo: { id: string; name: string; email?: string }
  ) => {
    if (!data) return;
    const product = data.productCategories.find((c) => c.id === catId)?.products.find((p) => p.id === productId);
    if (!product) return;

    const newTransactions: Transaction[] = Array.from({ length: count }, () => ({
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount: product.price,
      isCustom: false,
      clientId: clientInfo.id,
      clientName: clientInfo.name,
      clientEmail: clientInfo.email,
    }));

    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        productCategories: prev.productCategories.map((cat) => {
          if (cat.id !== catId) return cat;
          return {
            ...cat,
            products: cat.products.map((p) => {
              if (p.id !== productId) return p;
              const existing = p.transactions?.[month] || [];
              return { ...p, transactions: { ...p.transactions, [month]: [...existing, ...newTransactions] } };
            }),
          };
        }),
      };
    });
    setHasChanges(true);

    // Update client stats
    const totalAmount = product.price * count;
    await updateClientStats(clientInfo.id, totalAmount);
  };

  // Add custom transaction with client info (and optional discount linked to COGS)
  const addCustomTransaction = async (
    catId: string,
    productId: string,
    month: string,
    amount: number,
    clientInfo: { id: string; name: string; email?: string },
    note?: string,
    discount?: number
  ) => {
    if (!data) return;

    const newTransaction: Transaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount,
      isCustom: discount ? false : true, // If discount applied, it's based on product price
      note,
      discount: discount || undefined,
      clientId: clientInfo.id,
      clientName: clientInfo.name,
      clientEmail: clientInfo.email,
    };

    setData((prev) => {
      if (!prev) return prev;
      // Update salesDiscounts in reductions if discount is applied
      const updatedReductions = discount && discount > 0
        ? {
            ...prev.reductions,
            salesDiscounts: {
              ...prev.reductions.salesDiscounts,
              [month]: (prev.reductions.salesDiscounts[month] || 0) + discount,
            },
          }
        : prev.reductions;

      return {
        ...prev,
        reductions: updatedReductions,
        productCategories: prev.productCategories.map((cat) => {
          if (cat.id !== catId) return cat;
          return {
            ...cat,
            products: cat.products.map((p) => {
              if (p.id !== productId) return p;
              const existing = p.transactions?.[month] || [];
              return { ...p, transactions: { ...p.transactions, [month]: [...existing, newTransaction] } };
            }),
          };
        }),
      };
    });
    setHasChanges(true);

    // Update client stats
    await updateClientStats(clientInfo.id, amount);
  };

  // Delete transaction
  const deleteTransaction = (catId: string, productId: string, month: string, txId: string) => {
    if (!data) return;
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        productCategories: prev.productCategories.map((cat) => {
          if (cat.id !== catId) return cat;
          return {
            ...cat,
            products: cat.products.map((p) => {
              if (p.id !== productId) return p;
              const existing = p.transactions?.[month] || [];
              return { ...p, transactions: { ...p.transactions, [month]: existing.filter((tx) => tx.id !== txId) } };
            }),
          };
        }),
      };
    });
    setHasChanges(true);
  };

  // Update transaction amount
  const updateTransactionAmount = (catId: string, productId: string, month: string, txId: string, amount: number) => {
    if (!data) return;
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        productCategories: prev.productCategories.map((cat) => {
          if (cat.id !== catId) return cat;
          return {
            ...cat,
            products: cat.products.map((p) => {
              if (p.id !== productId) return p;
              const existing = p.transactions?.[month] || [];
              return {
                ...p,
                transactions: {
                  ...p.transactions,
                  [month]: existing.map((tx) => (tx.id === txId ? { ...tx, amount, isCustom: true } : tx)),
                },
              };
            }),
          };
        }),
      };
    });
    setHasChanges(true);
  };

  // Update product price
  const updateProductPrice = (catId: string, productId: string, price: number) => {
    if (!data) return;
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        productCategories: prev.productCategories.map((cat) => {
          if (cat.id !== catId) return cat;
          return {
            ...cat,
            products: cat.products.map((p) => {
              if (p.id !== productId) return p;
              return { ...p, price };
            }),
          };
        }),
      };
    });
    setHasChanges(true);
  };

  // Update expense adjustment (manual €)
  const updateExpenseAdjustment = (catId: string, itemId: string, month: string, value: number) => {
    if (!data) return;
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        expenseCategories: prev.expenseCategories.map((cat) => {
          if (cat.id !== catId) return cat;
          return {
            ...cat,
            items: cat.items.map((item) => {
              if (item.id !== itemId) return item;
              return { ...item, adjustments: { ...(item.adjustments || {}), [month]: value } };
            }),
          };
        }),
      };
    });
    setHasChanges(true);
  };

  // Update expense quantity (manual qty)
  const updateExpenseQuantity = (catId: string, itemId: string, month: string, qty: number) => {
    if (!data) return;
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        expenseCategories: prev.expenseCategories.map((cat) => {
          if (cat.id !== catId) return cat;
          return {
            ...cat,
            items: cat.items.map((item) => {
              if (item.id !== itemId) return item;
              return { ...item, quantity: { ...(item.quantity || {}), [month]: qty } };
            }),
          };
        }),
      };
    });
    setHasChanges(true);
  };

  // Add product
  const addProduct = (catId: string) => {
    const name = prompt('Nom du produit:');
    const priceStr = prompt('Prix unitaire (€):');
    if (!name || !priceStr || !data) return;

    const id = `${name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        productCategories: prev.productCategories.map((cat) => {
          if (cat.id !== catId) return cat;
          return {
            ...cat,
            products: [...cat.products, { id, label: name, price: Number(priceStr) || 0, transactions: {} }],
          };
        }),
      };
    });
    setHasChanges(true);
  };

  // Delete product
  const deleteProduct = (catId: string, productId: string) => {
    if (!data) return;

    // Check if category is from catalogue
    const category = data.productCategories.find(c => c.id === catId);
    if (category?.isFromCatalogue) {
      alert('Ce produit provient du catalogue et ne peut pas être supprimé.\nModifiez le catalogue pour supprimer ce produit.');
      return;
    }

    if (!confirm('Supprimer ce produit ?')) return;
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        productCategories: prev.productCategories.map((cat) => {
          if (cat.id !== catId) return cat;
          return { ...cat, products: cat.products.filter((p) => p.id !== productId) };
        }),
      };
    });
    setHasChanges(true);
  };

  // Add expense item
  const addExpenseItem = (catId: string) => {
    const name = prompt('Nom:');
    if (!name || !data) return;

    const id = `${name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        expenseCategories: prev.expenseCategories.map((cat) => {
          if (cat.id !== catId) return cat;
          return { ...cat, items: [...cat.items, { id, label: name, unitPrice: 0, quantity: {}, adjustments: {} }] };
        }),
      };
    });
    setHasChanges(true);
  };

  // Delete expense item
  const deleteExpenseItem = (catId: string, itemId: string) => {
    if (!confirm('Supprimer ?') || !data) return;
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        expenseCategories: prev.expenseCategories.map((cat) => {
          if (cat.id !== catId) return cat;
          return { ...cat, items: cat.items.filter((i) => i.id !== itemId) };
        }),
      };
    });
    setHasChanges(true);
  };

  // Update expense item unit price
  const updateExpenseUnitPrice = (catId: string, itemId: string, unitPrice: number) => {
    if (!data) return;
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        expenseCategories: prev.expenseCategories.map((cat) => {
          if (cat.id !== catId) return cat;
          return {
            ...cat,
            items: cat.items.map((item) => {
              if (item.id !== itemId) return item;
              return { ...item, unitPrice };
            }),
          };
        }),
      };
    });
    setHasChanges(true);
  };

  // Add expense category
  const addExpenseCategory = () => {
    const name = prompt('Nom de la catégorie:');
    if (!name || !data) return;

    const id = `expcat_${name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        expenseCategories: [...prev.expenseCategories, { id, label: name, items: [], isProtected: false }],
      };
    });
    setHasChanges(true);
  };

  // Delete expense category (only if not protected)
  const deleteExpenseCategory = (catId: string) => {
    const cat = data?.expenseCategories.find((c) => c.id === catId);
    if (cat?.isProtected) {
      alert('Cette catégorie est protégée et ne peut pas être supprimée.');
      return;
    }
    if (!confirm('Supprimer cette catégorie et tous ses éléments ?') || !data) return;
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        expenseCategories: prev.expenseCategories.filter((c) => c.id !== catId),
      };
    });
    setHasChanges(true);
  };

  // Rename expense category
  const renameExpenseCategory = (catId: string, newName: string) => {
    if (!data) return;
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        expenseCategories: prev.expenseCategories.map((cat) => {
          if (cat.id !== catId) return cat;
          return { ...cat, label: newName };
        }),
      };
    });
    setHasChanges(true);
  };

  // Rename expense item
  const renameExpenseItem = (catId: string, itemId: string, newName: string) => {
    if (!data) return;
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        expenseCategories: prev.expenseCategories.map((cat) => {
          if (cat.id !== catId) return cat;
          return {
            ...cat,
            items: cat.items.map((item) => {
              if (item.id !== itemId) return item;
              return { ...item, label: newName };
            }),
          };
        }),
      };
    });
    setHasChanges(true);
  };

  // Add product category
  const addProductCategory = () => {
    const name = prompt('Nom de la catégorie:');
    if (!name || !data) return;

    const id = `cat_${name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        productCategories: [...prev.productCategories, { id, label: name, products: [] }],
      };
    });
    setHasChanges(true);
  };

  // Delete product category
  const deleteProductCategory = (catId: string) => {
    if (!data) return;

    // Check if category is from catalogue
    const category = data.productCategories.find(c => c.id === catId);
    if (category?.isFromCatalogue) {
      alert('Cette catégorie provient du catalogue et ne peut pas être supprimée.\nModifiez le catalogue pour supprimer cette catégorie.');
      return;
    }

    if (!confirm('Supprimer cette catégorie et tous ses produits ?')) return;
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        productCategories: prev.productCategories.filter((c) => c.id !== catId),
      };
    });
    setHasChanges(true);
  };

  // Rename product category
  const renameProductCategory = (catId: string, newName: string) => {
    if (!data) return;
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        productCategories: prev.productCategories.map((cat) => {
          if (cat.id !== catId) return cat;
          return { ...cat, label: newName };
        }),
      };
    });
    setHasChanges(true);
  };

  // Rename product
  const renameProduct = (catId: string, productId: string, newName: string) => {
    if (!data) return;
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        productCategories: prev.productCategories.map((cat) => {
          if (cat.id !== catId) return cat;
          return {
            ...cat,
            products: cat.products.map((p) => {
              if (p.id !== productId) return p;
              return { ...p, label: newName };
            }),
          };
        }),
      };
    });
    setHasChanges(true);
  };

  // Add rule to product
  const addProductRule = (catId: string, productId: string, rule: Omit<ProductRule, 'id'>) => {
    if (!data) return;
    const ruleId = `rule_${Date.now()}`;
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        productCategories: prev.productCategories.map((cat) => {
          if (cat.id !== catId) return cat;
          return {
            ...cat,
            products: cat.products.map((p) => {
              if (p.id !== productId) return p;
              return { ...p, rules: [...(p.rules || []), { ...rule, id: ruleId }] };
            }),
          };
        }),
      };
    });
    setHasChanges(true);
  };

  // Update rule multiplier
  const updateRuleMultiplier = (catId: string, productId: string, ruleId: string, multiplier: number) => {
    if (!data) return;
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        productCategories: prev.productCategories.map((cat) => {
          if (cat.id !== catId) return cat;
          return {
            ...cat,
            products: cat.products.map((p) => {
              if (p.id !== productId) return p;
              return {
                ...p,
                rules: (p.rules || []).map((r) => {
                  if (r.id !== ruleId) return r;
                  return { ...r, multiplier };
                }),
              };
            }),
          };
        }),
      };
    });
    setHasChanges(true);
  };

  // Delete rule from product
  const deleteProductRule = (catId: string, productId: string, ruleId: string) => {
    if (!data) return;
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        productCategories: prev.productCategories.map((cat) => {
          if (cat.id !== catId) return cat;
          return {
            ...cat,
            products: cat.products.map((p) => {
              if (p.id !== productId) return p;
              return { ...p, rules: (p.rules || []).filter((r) => r.id !== ruleId) };
            }),
          };
        }),
      };
    });
    setHasChanges(true);
  };

  // Get expense item label
  const getExpenseItemLabel = (catId: string, itemId: string): string => {
    const cat = data?.expenseCategories.find((c) => c.id === catId);
    const item = cat?.items.find((i) => i.id === itemId);
    return item ? `${cat?.label} → ${item.label}` : 'Unknown';
  };

  // Get expense item by ID
  const getExpenseItem = (catId: string, itemId: string): ExpenseItem | undefined => {
    const cat = data?.expenseCategories.find((c) => c.id === catId);
    return cat?.items.find((i) => i.id === itemId);
  };

  // Calculate rule-based quantity for a month (auto qty from products)
  const getRuleBasedQuantity = (month: string): Record<string, Record<string, number>> => {
    const qty: Record<string, Record<string, number>> = {};

    data?.productCategories.forEach((cat) => {
      cat.products.forEach((product) => {
        const txCount = getTransactionsCount(product, month);
        (product.rules || []).forEach((rule) => {
          if (!qty[rule.expenseCategoryId]) qty[rule.expenseCategoryId] = {};
          if (!qty[rule.expenseCategoryId][rule.expenseItemId]) {
            qty[rule.expenseCategoryId][rule.expenseItemId] = 0;
          }
          // Quantité auto = nb transactions × multiplier
          qty[rule.expenseCategoryId][rule.expenseItemId] += txCount * rule.multiplier;
        });
      });
    });

    return qty;
  };

  // Calculations
  const getProductRevenue = (product: Product, month: string) => {
    return getTransactionsRevenue(product, month);
  };

  const getCategoryRevenue = (cat: ProductCategory, month: string) => {
    return cat.products.reduce((sum, p) => sum + getProductRevenue(p, month), 0);
  };

  const getCategoryClients = (cat: ProductCategory, month: string) => {
    return cat.products.reduce((sum, p) => sum + getTransactionsCount(p, month), 0);
  };

  const getTotalRevenue = (month: string) => {
    return data?.productCategories.reduce((sum, cat) => sum + getCategoryRevenue(cat, month), 0) || 0;
  };

  const getTotalClients = (month: string) => {
    return data?.productCategories.reduce((sum, cat) => sum + getCategoryClients(cat, month), 0) || 0;
  };

  // Get auto quantity for an expense item (from rules)
  const getAutoQuantity = (catId: string, itemId: string, month: string) => {
    const ruleQty = getRuleBasedQuantity(month);
    return ruleQty[catId]?.[itemId] || 0;
  };

  const getExpenseItemTotal = (catId: string, itemId: string, month: string) => {
    const cat = data?.expenseCategories.find((c) => c.id === catId);
    const item = cat?.items.find((i) => i.id === itemId);
    const unitPrice = item?.unitPrice || 0;
    const manualQty = item?.quantity?.[month] || 0;
    const adjustment = item?.adjustments?.[month] || 0;
    const autoQty = getAutoQuantity(catId, itemId, month);

    // Total = (manualQty + autoQty) × unitPrice + adjustment
    return (manualQty + autoQty) * unitPrice + adjustment;
  };

  const getExpenseCategoryTotal = (cat: ExpenseCategory, month: string) => {
    return cat.items.reduce((sum, item) => sum + getExpenseItemTotal(cat.id, item.id, month), 0);
  };

  const getTotalExpenses = (month: string) => {
    return data?.expenseCategories.reduce((sum, cat) => sum + getExpenseCategoryTotal(cat, month), 0) || 0;
  };

  // Get auto cost for display (auto qty × unit price)
  const getAutoCostForItem = (catId: string, itemId: string, month: string) => {
    const item = getExpenseItem(catId, itemId);
    const autoQty = getAutoQuantity(catId, itemId, month);
    return autoQty * (item?.unitPrice || 0);
  };

  const getYTDRevenue = () => MONTH_KEYS.reduce((sum, m) => sum + getTotalRevenue(m), 0);
  const getYTDExpenses = () => MONTH_KEYS.reduce((sum, m) => sum + getTotalExpenses(m), 0);
  const getYTDClients = () => MONTH_KEYS.reduce((sum, m) => sum + getTotalClients(m), 0);

  // NEW: Reductions calculations
  const getTotalReductions = (month: string) => {
    if (!data?.reductions) return 0;
    return (
      (data.reductions.salesReturns[month] || 0) +
      (data.reductions.salesDiscounts[month] || 0) +
      (data.reductions.costOfGoodsSold[month] || 0)
    );
  };

  const getGrossProfit = (month: string) => {
    return getTotalRevenue(month) - getTotalReductions(month);
  };

  // Operating Profit = Gross Profit - Expenses (before taxes)
  const getNetProfit = (month: string) => {
    return getGrossProfit(month) - getTotalExpenses(month) - getTotalTaxes(month);
  };

  // Taxes calculations (need to define before use)
  const getTotalTaxes = (month: string) => {
    if (!data?.taxes) return 0;
    return (
      (data.taxes.tva[month] || 0) +
      (data.taxes.corporateTax[month] || 0) +
      (data.taxes.otherTaxes[month] || 0)
    );
  };

  const getYTDReductions = () => MONTH_KEYS.reduce((sum, m) => sum + getTotalReductions(m), 0);
  const getYTDGrossProfit = () => getYTDRevenue() - getYTDReductions();

  // NEW: Operating Profit (before taxes) = Gross Profit - Expenses
  const getOperatingProfit = (month: string) => {
    return getGrossProfit(month) - getTotalExpenses(month);
  };
  const getYTDOperatingProfit = () => getYTDGrossProfit() - getYTDExpenses();

  // YTD Taxes
  const getYTDTaxes = () => MONTH_KEYS.reduce((sum, m) => sum + getTotalTaxes(m), 0);

  // Net Profit = Operating Profit - Taxes
  const getYTDNetProfit = () => getYTDOperatingProfit() - getYTDTaxes();

  // Update reductions
  const updateReduction = (field: 'salesReturns' | 'salesDiscounts' | 'costOfGoodsSold', month: string, value: number) => {
    if (!data) return;
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        reductions: {
          ...prev.reductions,
          [field]: { ...prev.reductions[field], [month]: value },
        },
      };
    });
    setHasChanges(true);
  };

  // Update taxes
  const updateTax = (field: 'tva' | 'corporateTax' | 'otherTaxes', month: string, value: number) => {
    if (!data) return;
    setData((prev) => {
      if (!prev) return prev;
      const currentTaxes = prev.taxes || { tva: {}, corporateTax: {}, otherTaxes: {} };
      return {
        ...prev,
        taxes: {
          ...currentTaxes,
          [field]: { ...currentTaxes[field], [month]: value },
        },
      };
    });
    setHasChanges(true);
  };

  // Chart data for Recharts
  const getChartData = () => {
    return MONTH_KEYS.map((month, index) => ({
      name: MONTHS[index],
      revenue: getTotalRevenue(month),
      reductions: getTotalReductions(month),
      grossProfit: getGrossProfit(month),
      expenses: getTotalExpenses(month),
      operatingProfit: getOperatingProfit(month),
      taxes: getTotalTaxes(month),
      netProfit: getNetProfit(month),
    }));
  };

  // Export CSV
  const exportCSV = () => {
    if (!data) return;

    const rows: string[][] = [];
    rows.push([`P&L Report - ${config.name}`, selectedYear.toString(), '', '', '', '', '', '', '', '', '', '', '', 'YTD']);
    rows.push(['', ...MONTHS, 'YTD']);

    // Revenue
    rows.push(['REVENUE']);
    data.productCategories.forEach((cat) => {
      rows.push([cat.label, ...MONTH_KEYS.map((m) => String(getCategoryRevenue(cat, m))), String(MONTH_KEYS.reduce((s, m) => s + getCategoryRevenue(cat, m), 0))]);
    });
    rows.push(['Total Revenue', ...MONTH_KEYS.map((m) => String(getTotalRevenue(m))), String(getYTDRevenue())]);

    // Reductions
    rows.push(['']);
    rows.push(['REDUCTIONS (COGS)']);
    rows.push(['Sales Returns', ...MONTH_KEYS.map((m) => String(data.reductions?.salesReturns[m] || 0)), String(MONTH_KEYS.reduce((s, m) => s + (data.reductions?.salesReturns[m] || 0), 0))]);
    rows.push(['Sales Discounts', ...MONTH_KEYS.map((m) => String(data.reductions?.salesDiscounts[m] || 0)), String(MONTH_KEYS.reduce((s, m) => s + (data.reductions?.salesDiscounts[m] || 0), 0))]);
    rows.push(['COGS', ...MONTH_KEYS.map((m) => String(data.reductions?.costOfGoodsSold[m] || 0)), String(MONTH_KEYS.reduce((s, m) => s + (data.reductions?.costOfGoodsSold[m] || 0), 0))]);
    rows.push(['Total Reductions', ...MONTH_KEYS.map((m) => String(getTotalReductions(m))), String(getYTDReductions())]);
    rows.push(['GROSS PROFIT', ...MONTH_KEYS.map((m) => String(getGrossProfit(m))), String(getYTDGrossProfit())]);

    // Expenses
    rows.push(['']);
    rows.push(['EXPENSES']);
    data.expenseCategories.forEach((cat) => {
      rows.push([cat.label, ...MONTH_KEYS.map((m) => String(getExpenseCategoryTotal(cat, m))), String(MONTH_KEYS.reduce((s, m) => s + getExpenseCategoryTotal(cat, m), 0))]);
    });
    rows.push(['Total Expenses', ...MONTH_KEYS.map((m) => String(getTotalExpenses(m))), String(getYTDExpenses())]);

    // Operating Profit
    rows.push(['']);
    rows.push(['OPERATING PROFIT', ...MONTH_KEYS.map((m) => String(getOperatingProfit(m))), String(getYTDOperatingProfit())]);

    // Taxes
    rows.push(['']);
    rows.push(['TAXES']);
    rows.push(['TVA', ...MONTH_KEYS.map((m) => String(data.taxes?.tva[m] || 0)), String(MONTH_KEYS.reduce((s, m) => s + (data.taxes?.tva[m] || 0), 0))]);
    rows.push(['Corporate Tax', ...MONTH_KEYS.map((m) => String(data.taxes?.corporateTax[m] || 0)), String(MONTH_KEYS.reduce((s, m) => s + (data.taxes?.corporateTax[m] || 0), 0))]);
    rows.push(['Other Taxes', ...MONTH_KEYS.map((m) => String(data.taxes?.otherTaxes[m] || 0)), String(MONTH_KEYS.reduce((s, m) => s + (data.taxes?.otherTaxes[m] || 0), 0))]);
    rows.push(['Total Taxes', ...MONTH_KEYS.map((m) => String(getTotalTaxes(m))), String(getYTDTaxes())]);

    // Net Profit
    rows.push(['']);
    rows.push(['NET PROFIT', ...MONTH_KEYS.map((m) => String(getNetProfit(m))), String(getYTDNetProfit())]);

    const csvContent = rows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `pnl_${company}_${selectedYear}.csv`;
    link.click();
  };

  // Export PDF
  const exportPDF = () => {
    if (!data) return;

    const doc = new jsPDF('landscape');
    doc.setFontSize(18);
    doc.text(`P&L Report - ${config.name} - ${selectedYear}`, 14, 22);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString('fr-FR')}`, 14, 30);

    // Summary table
    const summaryData = [
      ['', ...MONTHS, 'YTD'],
      ['Revenue', ...MONTH_KEYS.map((m) => formatCurrency(getTotalRevenue(m))), formatCurrency(getYTDRevenue())],
      ['Reductions', ...MONTH_KEYS.map((m) => formatCurrency(getTotalReductions(m))), formatCurrency(getYTDReductions())],
      ['Gross Profit', ...MONTH_KEYS.map((m) => formatCurrency(getGrossProfit(m))), formatCurrency(getYTDGrossProfit())],
      ['Expenses', ...MONTH_KEYS.map((m) => formatCurrency(getTotalExpenses(m))), formatCurrency(getYTDExpenses())],
      ['Operating Profit', ...MONTH_KEYS.map((m) => formatCurrency(getOperatingProfit(m))), formatCurrency(getYTDOperatingProfit())],
      ['Taxes', ...MONTH_KEYS.map((m) => formatCurrency(getTotalTaxes(m))), formatCurrency(getYTDTaxes())],
      ['Net Profit', ...MONTH_KEYS.map((m) => formatCurrency(getNetProfit(m))), formatCurrency(getYTDNetProfit())],
    ];

    autoTable(doc, {
      head: [summaryData[0]],
      body: summaryData.slice(1),
      startY: 40,
      theme: 'striped',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [39, 39, 42] },
    });

    doc.save(`pnl_${company}_${selectedYear}.pdf`);
  };

  const revenue = getTotalRevenue(currentMonthKey);
  const reductions = getTotalReductions(currentMonthKey);
  const grossProfit = getGrossProfit(currentMonthKey);
  const expenses = getTotalExpenses(currentMonthKey);
  const totalClientsCount = getTotalClients(currentMonthKey);
  const operatingProfit = getOperatingProfit(currentMonthKey);
  const taxes = getTotalTaxes(currentMonthKey);
  const netProfit = getNetProfit(currentMonthKey);
  const margin = revenue > 0 ? (netProfit / revenue) * 100 : 0;

  // Navigation
  const prevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((y) => y - 1);
    } else {
      setSelectedMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((y) => y + 1);
    } else {
      setSelectedMonth((m) => m + 1);
    }
  };

  // Edit helpers
  const startEdit = (key: string, value: number | string) => {
    setEditingCell(key);
    setEditValue(String(value || ''));
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 bg-zinc-900/50 border border-zinc-800 rounded-xl flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          </div>
          <p className="text-zinc-500 text-sm">Chargement des données...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/50 border border-zinc-800 text-xs uppercase tracking-[0.2em] text-zinc-400"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Finance
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-extralight tracking-tight text-white"
          >
            Profit & Loss
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-zinc-500 font-light"
          >
            {config.name} — Suivi financier
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center gap-2"
        >
          {/* Sync from Firebase */}
          <button
            onClick={() => {
              if (hasChanges) {
                if (confirm('Vous avez des modifications non sauvegardées. Synchroniser quand même ?')) {
                  syncData();
                }
              } else {
                syncData();
              }
            }}
            disabled={syncing}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-zinc-900 border border-zinc-800 text-blue-400 hover:text-blue-300 hover:border-blue-500/50 disabled:opacity-50 transition-all duration-200"
            title={lastSynced ? `Dernière sync: ${lastSynced.toLocaleTimeString('fr-FR')}` : 'Synchroniser avec Firebase'}
          >
            <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Sync...' : lastSynced ? lastSynced.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : 'Sync'}
          </button>
          {/* Export CSV */}
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all duration-200"
            title="Export CSV"
          >
            <Download className="h-4 w-4" />
            CSV
          </button>
          {/* Export PDF */}
          <button
            onClick={exportPDF}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all duration-200"
            title="Export PDF"
          >
            <FileText className="h-4 w-4" />
            PDF
          </button>
          {/* Save */}
          <button
            onClick={saveData}
            disabled={saving || !hasChanges}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
              hasChanges ? 'bg-white text-zinc-950 hover:bg-zinc-100' : 'bg-zinc-900 border border-zinc-800 text-zinc-500'
            }`}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Sauvegarder
          </button>
        </motion.div>
      </div>

      {/* Month Navigator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex items-center justify-center gap-6 bg-zinc-900/20 border border-zinc-900 p-4"
      >
        <button onClick={prevMonth} className="p-2 hover:bg-zinc-800/50 text-zinc-400 hover:text-white transition-colors">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="text-center min-w-[160px]">
          <div className="text-xl font-extralight text-white tracking-wide">{MONTHS[selectedMonth]} {selectedYear}</div>
        </div>
        <button onClick={nextMonth} className="p-2 hover:bg-zinc-800/50 text-zinc-400 hover:text-white transition-colors">
          <ChevronRight className="h-5 w-5" />
        </button>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-2 lg:grid-cols-5 gap-4"
      >
        <div className="p-5 bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800 transition-colors">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-500/10 border border-blue-900/30 rounded-lg flex items-center justify-center">
              <Users className="h-4 w-4 text-blue-500" />
            </div>
          </div>
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Clients</p>
          <p className="text-2xl font-extralight text-white">{totalClientsCount}</p>
          <p className="text-xs text-zinc-600 mt-2">YTD: {getYTDClients()}</p>
        </div>

        <div className="p-5 bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800 transition-colors">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-emerald-500/10 border border-emerald-900/30 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
          </div>
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Revenue</p>
          <p className="text-2xl font-extralight text-emerald-400">{formatCurrency(revenue)}</p>
          <p className="text-xs text-zinc-600 mt-2">YTD: {formatCurrency(getYTDRevenue())}</p>
        </div>

        <div className="p-5 bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800 transition-colors">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-red-500/10 border border-red-900/30 rounded-lg flex items-center justify-center">
              <TrendingDown className="h-4 w-4 text-red-500" />
            </div>
          </div>
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Dépenses</p>
          <p className="text-2xl font-extralight text-red-400">{formatCurrency(expenses)}</p>
          <p className="text-xs text-zinc-600 mt-2">YTD: {formatCurrency(getYTDExpenses())}</p>
        </div>

        <div className="p-5 bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800 transition-colors">
          <div className="flex items-center gap-2 mb-4">
            <div className={`w-8 h-8 ${netProfit >= 0 ? 'bg-emerald-500/10 border-emerald-900/30' : 'bg-red-500/10 border-red-900/30'} border rounded-lg flex items-center justify-center`}>
              <DollarSign className={`h-4 w-4 ${netProfit >= 0 ? 'text-emerald-500' : 'text-red-500'}`} />
            </div>
          </div>
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Profit Net</p>
          <p className={`text-2xl font-extralight ${netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {formatCurrency(netProfit)}
          </p>
          <p className="text-xs text-zinc-600 mt-2">YTD: {formatCurrency(getYTDNetProfit())}</p>
        </div>

        <div className="p-5 bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800 transition-colors">
          <div className="flex items-center gap-2 mb-4">
            <div className={`w-8 h-8 ${margin >= 0 ? 'bg-violet-500/10 border-violet-900/30' : 'bg-red-500/10 border-red-900/30'} border rounded-lg flex items-center justify-center`}>
              <Percent className={`h-4 w-4 ${margin >= 0 ? 'text-violet-500' : 'text-red-500'}`} />
            </div>
          </div>
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Marge</p>
          <p className={`text-2xl font-extralight ${margin >= 0 ? 'text-white' : 'text-red-400'}`}>
            {margin.toFixed(1)}%
          </p>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex gap-1 bg-zinc-900/20 border border-zinc-900 p-1"
      >
        {[
          { id: 'overview', label: 'Vue globale', icon: BarChart3 },
          { id: 'products', label: 'Produits & Clients', icon: Package },
          { id: 'expenses', label: 'Dépenses', icon: TrendingDown },
          { id: 'annual', label: 'Vue annuelle', icon: Calendar },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 py-2.5 px-4 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === tab.id ? 'bg-white text-zinc-950' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </motion.div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">{error}</div>
      )}

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {/* Trend Chart */}
          <div className="bg-zinc-900/20 border border-zinc-900 p-5">
            <h3 className="font-medium text-white flex items-center gap-2 mb-4">
              <BarChart3 className="h-4 w-4 text-violet-500" /> Tendances {selectedYear}
            </h3>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={12} />
                  <YAxis stroke="#71717a" fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff' }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="expenses" name="Dépenses" stroke="#ef4444" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="netProfit" name="Profit Net" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Products Summary */}
            <div className="bg-zinc-900/20 border border-zinc-900 overflow-hidden">
              <div className="px-5 py-4 border-b border-zinc-900 bg-emerald-500/5">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-white flex items-center gap-2">
                    <Package className="h-4 w-4 text-emerald-500" /> Revenue
                  </h3>
                  <span className="text-emerald-400 font-medium">{formatCurrency(revenue)}</span>
                </div>
              </div>
              <div className="divide-y divide-zinc-900">
                {data?.productCategories.map((cat) => (
                  <div key={cat.id} className="px-5 py-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-white font-light">{cat.label}</span>
                      <div className="text-right">
                        <span className="text-emerald-400">{formatCurrency(getCategoryRevenue(cat, currentMonthKey))}</span>
                        <span className="text-zinc-600 text-xs ml-2">({getCategoryClients(cat, currentMonthKey)} clients)</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      {cat.products.map((product) => (
                        <div key={product.id} className="flex justify-between text-sm text-zinc-500">
                          <span>{product.label}</span>
                          <span>
                            {getTransactionsCount(product, currentMonthKey)} tx → {formatCurrency(getProductRevenue(product, currentMonthKey))}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reductions (COGS) */}
            <div className="bg-zinc-900/20 border border-zinc-900 overflow-hidden">
              <div className="px-5 py-4 border-b border-zinc-900 bg-orange-500/5">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-white flex items-center gap-2">
                    <Minus className="h-4 w-4 text-orange-500" /> Réductions (COGS)
                  </h3>
                  <span className="text-orange-400 font-medium">{formatCurrency(reductions)}</span>
                </div>
              </div>
              <div className="divide-y divide-zinc-900">
                {/* Sales Returns */}
                <div className="px-5 py-3 flex justify-between items-center group">
                  <span className="text-zinc-400">Retours</span>
                  {editingCell === 'red_returns' ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        autoFocus
                        className="w-24 bg-zinc-800 border border-orange-500 rounded px-2 py-1 text-right text-white text-sm"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            updateReduction('salesReturns', currentMonthKey, Number(editValue) || 0);
                            cancelEdit();
                          }
                          if (e.key === 'Escape') cancelEdit();
                        }}
                      />
                      <button onClick={() => { updateReduction('salesReturns', currentMonthKey, Number(editValue) || 0); cancelEdit(); }} className="text-emerald-400"><Check className="h-4 w-4" /></button>
                      <button onClick={cancelEdit} className="text-zinc-400"><X className="h-4 w-4" /></button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEdit('red_returns', data?.reductions?.salesReturns[currentMonthKey] || 0)}
                      className="text-orange-400 hover:text-orange-300 flex items-center gap-1"
                    >
                      {formatCurrency(data?.reductions?.salesReturns[currentMonthKey] || 0)}
                      <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-100" />
                    </button>
                  )}
                </div>
                {/* Sales Discounts - Auto-calculated from transactions */}
                <div className="px-5 py-3 flex justify-between items-center group">
                  <span className="text-zinc-400">Remises</span>
                  <div className="flex items-center gap-2">
                    {getDiscountedTransactions(currentMonthKey).length > 0 && (
                      <button
                        onClick={() => setShowDiscountTransactions(true)}
                        className="p-1 rounded transition-colors text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800"
                        title="Voir les transactions"
                      >
                        <Receipt className="h-4 w-4" />
                      </button>
                    )}
                    <span className="text-orange-400">{formatCurrency(data?.reductions?.salesDiscounts[currentMonthKey] || 0)}</span>
                  </div>
                </div>
                {/* COGS */}
                <div className="px-5 py-3 flex justify-between items-center group">
                  <span className="text-zinc-400">COGS</span>
                  {editingCell === 'red_cogs' ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        autoFocus
                        className="w-24 bg-zinc-800 border border-orange-500 rounded px-2 py-1 text-right text-white text-sm"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            updateReduction('costOfGoodsSold', currentMonthKey, Number(editValue) || 0);
                            cancelEdit();
                          }
                          if (e.key === 'Escape') cancelEdit();
                        }}
                      />
                      <button onClick={() => { updateReduction('costOfGoodsSold', currentMonthKey, Number(editValue) || 0); cancelEdit(); }} className="text-emerald-400"><Check className="h-4 w-4" /></button>
                      <button onClick={cancelEdit} className="text-zinc-400"><X className="h-4 w-4" /></button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEdit('red_cogs', data?.reductions?.costOfGoodsSold[currentMonthKey] || 0)}
                      className="text-orange-400 hover:text-orange-300 flex items-center gap-1"
                    >
                      {formatCurrency(data?.reductions?.costOfGoodsSold[currentMonthKey] || 0)}
                      <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-100" />
                    </button>
                  )}
                </div>
              </div>
              {/* Gross Profit */}
              <div className="px-5 py-3 border-t border-zinc-800 bg-zinc-800/30">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">Profit Brut</span>
                  <span className={`font-bold ${grossProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {formatCurrency(grossProfit)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Expenses Summary */}
          <div className="bg-zinc-900/20 border border-zinc-900 overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-900 bg-red-500/5">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-white flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-500" /> Dépenses
                </h3>
                <span className="text-red-400 font-medium">{formatCurrency(expenses)}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 divide-x divide-y divide-zinc-900">
              {data?.expenseCategories.map((cat) => (
                <div key={cat.id} className="px-4 py-3">
                  <span className="text-zinc-500 text-xs block mb-1">{cat.label}</span>
                  <span className="text-white font-light">{formatCurrency(getExpenseCategoryTotal(cat, currentMonthKey))}</span>
                </div>
              ))}
            </div>
            {/* Operating Profit */}
            <div className="px-5 py-3 border-t border-zinc-800 bg-zinc-800/30">
              <div className="flex justify-between items-center">
                <span className="text-white font-medium">Résultat d&apos;exploitation</span>
                <span className={`font-bold ${operatingProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {formatCurrency(operatingProfit)}
                </span>
              </div>
            </div>
          </div>

          {/* Taxes Section */}
          <div className="bg-zinc-900/20 border border-zinc-900 overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-900 bg-amber-500/5">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-white flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-amber-500" /> Taxes & Impôts
                </h3>
                <span className="text-amber-400 font-medium">{formatCurrency(taxes)}</span>
              </div>
            </div>
            <div className="divide-y divide-zinc-800/50">
              {/* TVA */}
              <div className="flex justify-between items-center px-5 py-3 group">
                <span className="text-zinc-400">TVA collectée</span>
                {editingCell === 'tax_tva' ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      autoFocus
                      className="w-24 bg-zinc-800 border border-violet-500 rounded px-2 py-1 text-right text-white"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          updateTax('tva', currentMonthKey, parseFloat(editValue) || 0);
                          cancelEdit();
                        }
                        if (e.key === 'Escape') cancelEdit();
                      }}
                    />
                    <button onClick={() => { updateTax('tva', currentMonthKey, parseFloat(editValue) || 0); cancelEdit(); }} className="text-emerald-400"><Check className="h-4 w-4" /></button>
                    <button onClick={cancelEdit} className="text-zinc-400"><X className="h-4 w-4" /></button>
                  </div>
                ) : (
                  <button
                    onClick={() => startEdit('tax_tva', data?.taxes?.tva[currentMonthKey] || 0)}
                    className="text-amber-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    {formatCurrency(data?.taxes?.tva[currentMonthKey] || 0)}
                    <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-100" />
                  </button>
                )}
              </div>
              {/* Corporate Tax */}
              <div className="flex justify-between items-center px-5 py-3 group">
                <span className="text-zinc-400">Impôt sur les sociétés</span>
                {editingCell === 'tax_corporate' ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      autoFocus
                      className="w-24 bg-zinc-800 border border-violet-500 rounded px-2 py-1 text-right text-white"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          updateTax('corporateTax', currentMonthKey, parseFloat(editValue) || 0);
                          cancelEdit();
                        }
                        if (e.key === 'Escape') cancelEdit();
                      }}
                    />
                    <button onClick={() => { updateTax('corporateTax', currentMonthKey, parseFloat(editValue) || 0); cancelEdit(); }} className="text-emerald-400"><Check className="h-4 w-4" /></button>
                    <button onClick={cancelEdit} className="text-zinc-400"><X className="h-4 w-4" /></button>
                  </div>
                ) : (
                  <button
                    onClick={() => startEdit('tax_corporate', data?.taxes?.corporateTax[currentMonthKey] || 0)}
                    className="text-amber-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    {formatCurrency(data?.taxes?.corporateTax[currentMonthKey] || 0)}
                    <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-100" />
                  </button>
                )}
              </div>
              {/* Other Taxes */}
              <div className="flex justify-between items-center px-5 py-3 group">
                <span className="text-zinc-400">Autres taxes</span>
                {editingCell === 'tax_other' ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      autoFocus
                      className="w-24 bg-zinc-800 border border-violet-500 rounded px-2 py-1 text-right text-white"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          updateTax('otherTaxes', currentMonthKey, parseFloat(editValue) || 0);
                          cancelEdit();
                        }
                        if (e.key === 'Escape') cancelEdit();
                      }}
                    />
                    <button onClick={() => { updateTax('otherTaxes', currentMonthKey, parseFloat(editValue) || 0); cancelEdit(); }} className="text-emerald-400"><Check className="h-4 w-4" /></button>
                    <button onClick={cancelEdit} className="text-zinc-400"><X className="h-4 w-4" /></button>
                  </div>
                ) : (
                  <button
                    onClick={() => startEdit('tax_other', data?.taxes?.otherTaxes[currentMonthKey] || 0)}
                    className="text-amber-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    {formatCurrency(data?.taxes?.otherTaxes[currentMonthKey] || 0)}
                    <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-100" />
                  </button>
                )}
              </div>
            </div>
            {/* Net Profit */}
            <div className="px-5 py-4 border-t border-zinc-800 bg-violet-500/10">
              <div className="flex justify-between items-center">
                <span className="text-white font-medium text-lg">Résultat Net</span>
                <span className={`font-bold text-xl ${netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {formatCurrency(netProfit)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          {data?.productCategories.map((cat) => {
            const catNameKey = `catname_${cat.id}`;

            return (
            <div key={cat.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-zinc-800 bg-emerald-500/5 flex items-center justify-between group/header">
                {/* Category name - editable */}
                {editingCell === catNameKey ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      autoFocus
                      className="bg-zinc-800 border border-violet-500 rounded px-2 py-1 text-white font-semibold"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          renameProductCategory(cat.id, editValue);
                          cancelEdit();
                        }
                        if (e.key === 'Escape') cancelEdit();
                      }}
                    />
                    <button onClick={() => { renameProductCategory(cat.id, editValue); cancelEdit(); }} className="text-emerald-400"><Check className="h-4 w-4" /></button>
                    <button onClick={cancelEdit} className="text-zinc-400"><X className="h-4 w-4" /></button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white">{cat.label}</h3>
                    {cat.isFromCatalogue && (
                      <span className="text-[10px] text-violet-400 bg-violet-400/10 px-1.5 py-0.5 rounded">
                        catalogue
                      </span>
                    )}
                    {!cat.isFromCatalogue && (
                      <button
                        onClick={() => startEdit(catNameKey, cat.label)}
                        className="opacity-0 group-hover/header:opacity-100 p-1 text-zinc-500 hover:text-violet-400"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                    )}
                    {!cat.isFromCatalogue && (
                      <button
                        onClick={() => deleteProductCategory(cat.id)}
                        className="opacity-0 group-hover/header:opacity-100 p-1 text-zinc-500 hover:text-red-400"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <span className="text-zinc-400 text-sm">{getCategoryClients(cat, currentMonthKey)} clients</span>
                  <span className="text-emerald-400 font-bold">{formatCurrency(getCategoryRevenue(cat, currentMonthKey))}</span>
                </div>
              </div>

              {/* Table header */}
              <div className="grid grid-cols-12 gap-2 px-4 py-2 border-b border-zinc-800 text-xs text-zinc-500 font-medium">
                <div className="col-span-4">Produit</div>
                <div className="col-span-2 text-right">Prix unitaire</div>
                <div className="col-span-2 text-right">Transactions</div>
                <div className="col-span-3 text-right">Revenue</div>
                <div className="col-span-1"></div>
              </div>

              {/* Products */}
              <div className="divide-y divide-zinc-800/50">
                {cat.products.map((product) => {
                  const priceKey = `price_${product.id}`;
                  const nameKey = `name_${product.id}`;
                  const txCount = getTransactionsCount(product, currentMonthKey);

                  return (
                    <div key={product.id} className="grid grid-cols-12 gap-2 px-4 py-3 items-center group">
                      {/* Product name - editable */}
                      <div className="col-span-4">
                        {cat.isFromCatalogue ? (
                          // Catalogue products: name is read-only
                          <span className="text-zinc-300">{product.label}</span>
                        ) : editingCell === nameKey ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              autoFocus
                              className="w-full bg-zinc-800 border border-violet-500 rounded px-2 py-1 text-white text-sm"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  renameProduct(cat.id, product.id, editValue);
                                  cancelEdit();
                                }
                                if (e.key === 'Escape') cancelEdit();
                              }}
                            />
                            <button onClick={() => { renameProduct(cat.id, product.id, editValue); cancelEdit(); }} className="text-emerald-400"><Check className="h-4 w-4" /></button>
                            <button onClick={cancelEdit} className="text-zinc-400"><X className="h-4 w-4" /></button>
                          </div>
                        ) : (
                          <button
                            onClick={() => { setEditingCell(nameKey); setEditValue(product.label); }}
                            className="text-zinc-300 hover:text-white flex items-center gap-1 text-left"
                          >
                            {product.label}
                            <Pencil className="h-3 w-3 opacity-0 group-hover:opacity-100 text-zinc-500" />
                          </button>
                        )}
                      </div>

                      {/* Price */}
                      <div className="col-span-2 text-right">
                        {cat.isFromCatalogue ? (
                          // Catalogue products: price is read-only
                          <span className="text-zinc-400">{formatCurrency(product.price)}</span>
                        ) : editingCell === priceKey ? (
                          <div className="flex items-center justify-end gap-1">
                            <input
                              type="number"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              autoFocus
                              className="w-20 bg-zinc-800 border border-violet-500 rounded px-2 py-1 text-right text-white text-sm"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  updateProductPrice(cat.id, product.id, Number(editValue) || 0);
                                  cancelEdit();
                                }
                                if (e.key === 'Escape') cancelEdit();
                              }}
                            />
                            <button onClick={() => { updateProductPrice(cat.id, product.id, Number(editValue) || 0); cancelEdit(); }} className="text-emerald-400"><Check className="h-4 w-4" /></button>
                            <button onClick={cancelEdit} className="text-zinc-400"><X className="h-4 w-4" /></button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEdit(priceKey, product.price)}
                            className="text-zinc-400 hover:text-white flex items-center justify-end gap-1 w-full"
                          >
                            {formatCurrency(product.price)}
                            <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-100" />
                          </button>
                        )}
                      </div>

                      {/* Transactions - click to open modal */}
                      <div className="col-span-2 text-right">
                        <button
                          onClick={() => setTransactionsModal({ catId: cat.id, product })}
                          className="text-blue-400 font-medium hover:text-blue-300 flex items-center justify-end gap-1 w-full"
                        >
                          <Receipt className="h-3 w-3" />
                          {txCount}
                        </button>
                      </div>

                      {/* Revenue */}
                      <div className="col-span-3 text-right text-emerald-400 font-semibold">
                        {formatCurrency(getProductRevenue(product, currentMonthKey))}
                      </div>

                      {/* Actions */}
                      <div className="col-span-1 text-right flex items-center justify-end gap-1">
                        <button
                          onClick={() => setRulesModal({ catId: cat.id, product })}
                          className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-violet-400 relative"
                          title="Règles de coûts"
                        >
                          <Settings className="h-4 w-4" />
                          {(product.rules?.length || 0) > 0 && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-violet-500 rounded-full text-[8px] flex items-center justify-center text-white">
                              {product.rules?.length}
                            </span>
                          )}
                        </button>
                        {!cat.isFromCatalogue && (
                          <button
                            onClick={() => deleteProduct(cat.id, product.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add product - hidden for catalogue categories */}
              {!cat.isFromCatalogue && (
                <div className="px-4 py-2 border-t border-zinc-800">
                  <button
                    onClick={() => addProduct(cat.id)}
                    className="flex items-center gap-1 text-xs text-zinc-500 hover:text-violet-400"
                  >
                    <Plus className="h-3 w-3" /> Ajouter un produit
                  </button>
                </div>
              )}
            </div>
          );
          })}

          {/* Add category button */}
          <button
            onClick={addProductCategory}
            className="w-full py-4 border-2 border-dashed border-zinc-700 hover:border-violet-500 rounded-xl text-zinc-500 hover:text-violet-400 transition-colors flex items-center justify-center gap-2"
          >
            <FolderPlus className="h-5 w-5" />
            Ajouter une catégorie
          </button>
        </div>
      )}

      {/* Expenses Tab */}
      {activeTab === 'expenses' && (
        <div className="space-y-6">
          {data?.expenseCategories.map((cat) => {
            const expCatNameKey = `expcatname_${cat.id}`;

            return (
              <div key={cat.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-zinc-800 bg-red-500/5 flex items-center justify-between group/header">
                  {/* Category name - editable */}
                  {editingCell === expCatNameKey ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        autoFocus
                        className="bg-zinc-800 border border-violet-500 rounded px-2 py-1 text-white font-semibold"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            renameExpenseCategory(cat.id, editValue);
                            cancelEdit();
                          }
                          if (e.key === 'Escape') cancelEdit();
                        }}
                      />
                      <button onClick={() => { renameExpenseCategory(cat.id, editValue); cancelEdit(); }} className="text-emerald-400"><Check className="h-4 w-4" /></button>
                      <button onClick={cancelEdit} className="text-zinc-400"><X className="h-4 w-4" /></button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white">{cat.label}</h3>
                      {cat.isProtected && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-zinc-700 text-zinc-400 rounded">Protégé</span>
                      )}
                      <button
                        onClick={() => startEdit(expCatNameKey, cat.label)}
                        className="opacity-0 group-hover/header:opacity-100 p-1 text-zinc-500 hover:text-violet-400"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                      {!cat.isProtected && (
                        <button
                          onClick={() => deleteExpenseCategory(cat.id)}
                          className="opacity-0 group-hover/header:opacity-100 p-1 text-zinc-500 hover:text-red-400"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  )}
                  <span className="text-red-400 font-bold">{formatCurrency(getExpenseCategoryTotal(cat, currentMonthKey))}</span>
                </div>

                {/* Table header */}
                <div className="grid grid-cols-12 gap-2 px-4 py-2 border-b border-zinc-800 text-xs text-zinc-500 font-medium">
                  <div className="col-span-3">Élément</div>
                  <div className="col-span-2 text-right">Prix unit.</div>
                  <div className="col-span-2 text-right">Qté</div>
                  <div className="col-span-2 text-right">Ajust. €</div>
                  <div className="col-span-2 text-right">Total</div>
                  <div className="col-span-1"></div>
                </div>

                {/* Items */}
                <div className="divide-y divide-zinc-800/50">
                  {cat.items.map((item) => {
                    const unitPriceKey = `unitprice_${item.id}`;
                    const qtyKey = `qty_${item.id}_${currentMonthKey}`;
                    const adjustKey = `adjust_${item.id}_${currentMonthKey}`;
                    const nameKey = `expname_${item.id}`;
                    const manualQty = item.quantity?.[currentMonthKey] || 0;
                    const autoQty = getAutoQuantity(cat.id, item.id, currentMonthKey);
                    const adjustValue = item.adjustments?.[currentMonthKey] || 0;

                    return (
                      <div key={item.id} className="grid grid-cols-12 gap-2 px-4 py-3 items-center group">
                        {/* Item name - editable */}
                        <div className="col-span-3">
                          {editingCell === nameKey ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                autoFocus
                                className="w-full bg-zinc-800 border border-violet-500 rounded px-2 py-1 text-white text-sm"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    renameExpenseItem(cat.id, item.id, editValue);
                                    cancelEdit();
                                  }
                                  if (e.key === 'Escape') cancelEdit();
                                }}
                              />
                              <button onClick={() => { renameExpenseItem(cat.id, item.id, editValue); cancelEdit(); }} className="text-emerald-400"><Check className="h-4 w-4" /></button>
                              <button onClick={cancelEdit} className="text-zinc-400"><X className="h-4 w-4" /></button>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-1">
                              <button
                                onClick={() => { setEditingCell(nameKey); setEditValue(item.label); }}
                                className="text-zinc-300 hover:text-white flex items-center gap-1 text-left"
                              >
                                {item.label}
                                <Pencil className="h-3 w-3 opacity-0 group-hover:opacity-100 text-zinc-500" />
                              </button>
                              {/* Type/Note badges */}
                              {(item.type || item.note) && (
                                <div className="flex items-center gap-1 flex-wrap">
                                  {item.type && (
                                    <span className="text-[10px] px-1.5 py-0.5 bg-violet-500/20 text-violet-400 rounded">{item.type}</span>
                                  )}
                                  {item.note && (
                                    <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded">{item.note}</span>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Unit Price */}
                        <div className="col-span-2 text-right">
                          {editingCell === unitPriceKey ? (
                            <div className="flex items-center justify-end gap-1">
                              <input
                                type="number"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                autoFocus
                                className="w-20 bg-zinc-800 border border-violet-500 rounded px-2 py-1 text-right text-white text-sm"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    updateExpenseUnitPrice(cat.id, item.id, Number(editValue) || 0);
                                    cancelEdit();
                                  }
                                  if (e.key === 'Escape') cancelEdit();
                                }}
                              />
                              <button onClick={() => { updateExpenseUnitPrice(cat.id, item.id, Number(editValue) || 0); cancelEdit(); }} className="text-emerald-400"><Check className="h-4 w-4" /></button>
                              <button onClick={cancelEdit} className="text-zinc-400"><X className="h-4 w-4" /></button>
                            </div>
                          ) : (
                            <button
                              onClick={() => startEdit(unitPriceKey, item.unitPrice || 0)}
                              className="text-zinc-400 hover:text-white flex items-center justify-end gap-1 w-full"
                            >
                              {formatCurrency(item.unitPrice || 0)}
                              <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-100" />
                            </button>
                          )}
                        </div>

                        {/* Quantity (manual + auto) */}
                        <div className="col-span-2 text-right">
                          {editingCell === qtyKey ? (
                            <div className="flex items-center justify-end gap-1">
                              <input
                                type="number"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                autoFocus
                                min="0"
                                className="w-14 bg-zinc-800 border border-violet-500 rounded px-2 py-1 text-right text-white text-sm"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    updateExpenseQuantity(cat.id, item.id, currentMonthKey, Number(editValue) || 0);
                                    cancelEdit();
                                  }
                                  if (e.key === 'Escape') cancelEdit();
                                }}
                              />
                              <button onClick={() => { updateExpenseQuantity(cat.id, item.id, currentMonthKey, Number(editValue) || 0); cancelEdit(); }} className="text-emerald-400"><Check className="h-4 w-4" /></button>
                              <button onClick={cancelEdit} className="text-zinc-400"><X className="h-4 w-4" /></button>
                            </div>
                          ) : (
                            <button
                              onClick={() => startEdit(qtyKey, manualQty)}
                              className="text-blue-400 hover:text-blue-300 flex items-center justify-end gap-1 w-full text-sm"
                            >
                              {manualQty > 0 && <span>{manualQty}</span>}
                              {manualQty > 0 && autoQty > 0 && <span className="text-zinc-600">+</span>}
                              {autoQty > 0 && <span className="text-violet-400">{autoQty}</span>}
                              {manualQty === 0 && autoQty === 0 && <span className="text-zinc-600">0</span>}
                              <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-100" />
                            </button>
                          )}
                        </div>

                        {/* Adjustment (manual €) */}
                        <div className="col-span-2 text-right">
                          {editingCell === adjustKey ? (
                            <div className="flex items-center justify-end gap-1">
                              <input
                                type="number"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                autoFocus
                                className="w-16 bg-zinc-800 border border-violet-500 rounded px-2 py-1 text-right text-white text-sm"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    updateExpenseAdjustment(cat.id, item.id, currentMonthKey, Number(editValue) || 0);
                                    cancelEdit();
                                  }
                                  if (e.key === 'Escape') cancelEdit();
                                }}
                              />
                              <button onClick={() => { updateExpenseAdjustment(cat.id, item.id, currentMonthKey, Number(editValue) || 0); cancelEdit(); }} className="text-emerald-400"><Check className="h-4 w-4" /></button>
                              <button onClick={cancelEdit} className="text-zinc-400"><X className="h-4 w-4" /></button>
                            </div>
                          ) : (
                            <button
                              onClick={() => startEdit(adjustKey, adjustValue)}
                              className="text-orange-400/70 hover:text-orange-400 flex items-center justify-end gap-1 w-full text-sm"
                            >
                              {adjustValue !== 0 ? (adjustValue > 0 ? '+' : '') + formatCurrency(adjustValue) : '—'}
                              <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-100" />
                            </button>
                          )}
                        </div>

                        {/* Total */}
                        <div className="col-span-2 text-right text-red-400 font-semibold">
                          {formatCurrency(getExpenseItemTotal(cat.id, item.id, currentMonthKey))}
                        </div>

                        {/* Actions */}
                        <div className="col-span-1 text-right">
                          <button
                            onClick={() => deleteExpenseItem(cat.id, item.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Add item */}
                <div className="px-4 py-2 border-t border-zinc-800">
                  <button
                    onClick={() => addExpenseItem(cat.id)}
                    className="flex items-center gap-1 text-xs text-zinc-500 hover:text-violet-400"
                  >
                    <Plus className="h-3 w-3" /> Ajouter un élément
                  </button>
                </div>
              </div>
            );
          })}

          {/* Add expense category button */}
          <button
            onClick={addExpenseCategory}
            className="w-full py-4 border-2 border-dashed border-zinc-700 hover:border-red-500 rounded-xl text-zinc-500 hover:text-red-400 transition-colors flex items-center justify-center gap-2"
          >
            <FolderPlus className="h-5 w-5" />
            Ajouter une catégorie de dépenses
          </button>
        </div>
      )}

      {/* Annual View Tab */}
      {activeTab === 'annual' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {/* Annual Summary Table */}
          <div className="bg-zinc-900/20 border border-zinc-900 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-800/50">
                  <th className="text-left px-4 py-3 text-zinc-400 font-medium sticky left-0 bg-zinc-800/50 min-w-[150px]">Catégorie</th>
                  {MONTHS.map((month) => (
                    <th key={month} className="text-right px-3 py-3 text-zinc-400 font-medium min-w-[80px]">{month}</th>
                  ))}
                  <th className="text-right px-4 py-3 text-white font-bold min-w-[100px] bg-zinc-700/30">YTD</th>
                </tr>
              </thead>
              <tbody>
                {/* Revenue Section */}
                <tr className="border-b border-zinc-800 bg-emerald-500/5">
                  <td className="px-4 py-3 text-emerald-400 font-semibold sticky left-0 bg-emerald-500/5">Revenue</td>
                  {MONTH_KEYS.map((month) => (
                    <td key={month} className="text-right px-3 py-3 text-emerald-400">{formatCurrency(getTotalRevenue(month))}</td>
                  ))}
                  <td className="text-right px-4 py-3 text-emerald-400 font-bold bg-zinc-700/30">{formatCurrency(getYTDRevenue())}</td>
                </tr>
                {/* Products breakdown - collapsible */}
                {data?.productCategories.map((cat) => (
                  <tr key={cat.id} className="border-b border-zinc-800/50">
                    <td className="px-4 py-2 text-zinc-500 text-xs pl-8 sticky left-0 bg-zinc-900/20">{cat.label}</td>
                    {MONTH_KEYS.map((month) => (
                      <td key={month} className="text-right px-3 py-2 text-zinc-500 text-xs">{formatCurrency(getCategoryRevenue(cat, month))}</td>
                    ))}
                    <td className="text-right px-4 py-2 text-zinc-400 text-xs bg-zinc-700/30">{formatCurrency(MONTH_KEYS.reduce((s, m) => s + getCategoryRevenue(cat, m), 0))}</td>
                  </tr>
                ))}

                {/* Reductions Section */}
                <tr className="border-b border-zinc-800 bg-orange-500/5">
                  <td className="px-4 py-3 text-orange-400 font-semibold sticky left-0 bg-orange-500/5">Réductions</td>
                  {MONTH_KEYS.map((month) => (
                    <td key={month} className="text-right px-3 py-3 text-orange-400">{formatCurrency(getTotalReductions(month))}</td>
                  ))}
                  <td className="text-right px-4 py-3 text-orange-400 font-bold bg-zinc-700/30">{formatCurrency(getYTDReductions())}</td>
                </tr>
                <tr className="border-b border-zinc-800/50">
                  <td className="px-4 py-2 text-zinc-500 text-xs pl-8 sticky left-0 bg-zinc-900/20">Retours</td>
                  {MONTH_KEYS.map((month) => (
                    <td key={month} className="text-right px-3 py-2 text-zinc-500 text-xs">{formatCurrency(data?.reductions?.salesReturns[month] || 0)}</td>
                  ))}
                  <td className="text-right px-4 py-2 text-zinc-400 text-xs bg-zinc-700/30">{formatCurrency(MONTH_KEYS.reduce((s, m) => s + (data?.reductions?.salesReturns[m] || 0), 0))}</td>
                </tr>
                <tr className="border-b border-zinc-800/50">
                  <td className="px-4 py-2 text-zinc-500 text-xs pl-8 sticky left-0 bg-zinc-900/20">Remises</td>
                  {MONTH_KEYS.map((month) => (
                    <td key={month} className="text-right px-3 py-2 text-zinc-500 text-xs">{formatCurrency(data?.reductions?.salesDiscounts[month] || 0)}</td>
                  ))}
                  <td className="text-right px-4 py-2 text-zinc-400 text-xs bg-zinc-700/30">{formatCurrency(MONTH_KEYS.reduce((s, m) => s + (data?.reductions?.salesDiscounts[m] || 0), 0))}</td>
                </tr>
                <tr className="border-b border-zinc-800/50">
                  <td className="px-4 py-2 text-zinc-500 text-xs pl-8 sticky left-0 bg-zinc-900/20">COGS</td>
                  {MONTH_KEYS.map((month) => (
                    <td key={month} className="text-right px-3 py-2 text-zinc-500 text-xs">{formatCurrency(data?.reductions?.costOfGoodsSold[month] || 0)}</td>
                  ))}
                  <td className="text-right px-4 py-2 text-zinc-400 text-xs bg-zinc-700/30">{formatCurrency(MONTH_KEYS.reduce((s, m) => s + (data?.reductions?.costOfGoodsSold[m] || 0), 0))}</td>
                </tr>

                {/* Gross Profit */}
                <tr className="border-b border-zinc-800 bg-zinc-800/30">
                  <td className="px-4 py-3 text-white font-semibold sticky left-0 bg-zinc-800/30">Profit Brut</td>
                  {MONTH_KEYS.map((month) => {
                    const gp = getGrossProfit(month);
                    return (
                      <td key={month} className={`text-right px-3 py-3 font-medium ${gp >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{formatCurrency(gp)}</td>
                    );
                  })}
                  <td className={`text-right px-4 py-3 font-bold bg-zinc-700/30 ${getYTDGrossProfit() >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{formatCurrency(getYTDGrossProfit())}</td>
                </tr>

                {/* Expenses Section */}
                <tr className="border-b border-zinc-800 bg-red-500/5">
                  <td className="px-4 py-3 text-red-400 font-semibold sticky left-0 bg-red-500/5">Dépenses</td>
                  {MONTH_KEYS.map((month) => (
                    <td key={month} className="text-right px-3 py-3 text-red-400">{formatCurrency(getTotalExpenses(month))}</td>
                  ))}
                  <td className="text-right px-4 py-3 text-red-400 font-bold bg-zinc-700/30">{formatCurrency(getYTDExpenses())}</td>
                </tr>
                {/* Expenses breakdown */}
                {data?.expenseCategories.map((cat) => (
                  <tr key={cat.id} className="border-b border-zinc-800/50">
                    <td className="px-4 py-2 text-zinc-500 text-xs pl-8 sticky left-0 bg-zinc-900/20">{cat.label}</td>
                    {MONTH_KEYS.map((month) => (
                      <td key={month} className="text-right px-3 py-2 text-zinc-500 text-xs">{formatCurrency(getExpenseCategoryTotal(cat, month))}</td>
                    ))}
                    <td className="text-right px-4 py-2 text-zinc-400 text-xs bg-zinc-700/30">{formatCurrency(MONTH_KEYS.reduce((s, m) => s + getExpenseCategoryTotal(cat, m), 0))}</td>
                  </tr>
                ))}

                {/* Operating Profit */}
                <tr className="border-b border-zinc-800 bg-zinc-800/30">
                  <td className="px-4 py-3 text-white font-semibold sticky left-0 bg-zinc-800/30">Résultat d&apos;exploitation</td>
                  {MONTH_KEYS.map((month) => {
                    const op = getOperatingProfit(month);
                    return (
                      <td key={month} className={`text-right px-3 py-3 font-medium ${op >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{formatCurrency(op)}</td>
                    );
                  })}
                  <td className={`text-right px-4 py-3 font-bold bg-zinc-700/30 ${getYTDOperatingProfit() >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{formatCurrency(getYTDOperatingProfit())}</td>
                </tr>

                {/* Taxes Section */}
                <tr className="border-b border-zinc-800 bg-amber-500/5">
                  <td className="px-4 py-3 text-amber-400 font-semibold sticky left-0 bg-amber-500/5">Taxes & Impôts</td>
                  {MONTH_KEYS.map((month) => (
                    <td key={month} className="text-right px-3 py-3 text-amber-400">{formatCurrency(getTotalTaxes(month))}</td>
                  ))}
                  <td className="text-right px-4 py-3 text-amber-400 font-bold bg-zinc-700/30">{formatCurrency(getYTDTaxes())}</td>
                </tr>
                {/* TVA */}
                <tr className="border-b border-zinc-800/50">
                  <td className="px-4 py-2 text-zinc-500 text-xs pl-8 sticky left-0 bg-zinc-900/20">TVA collectée</td>
                  {MONTH_KEYS.map((month) => (
                    <td key={month} className="text-right px-3 py-2 text-zinc-500 text-xs">{formatCurrency(data?.taxes?.tva[month] || 0)}</td>
                  ))}
                  <td className="text-right px-4 py-2 text-zinc-400 text-xs bg-zinc-700/30">{formatCurrency(MONTH_KEYS.reduce((s, m) => s + (data?.taxes?.tva[m] || 0), 0))}</td>
                </tr>
                {/* Corporate Tax */}
                <tr className="border-b border-zinc-800/50">
                  <td className="px-4 py-2 text-zinc-500 text-xs pl-8 sticky left-0 bg-zinc-900/20">Impôt sur les sociétés</td>
                  {MONTH_KEYS.map((month) => (
                    <td key={month} className="text-right px-3 py-2 text-zinc-500 text-xs">{formatCurrency(data?.taxes?.corporateTax[month] || 0)}</td>
                  ))}
                  <td className="text-right px-4 py-2 text-zinc-400 text-xs bg-zinc-700/30">{formatCurrency(MONTH_KEYS.reduce((s, m) => s + (data?.taxes?.corporateTax[m] || 0), 0))}</td>
                </tr>
                {/* Other Taxes */}
                <tr className="border-b border-zinc-800/50">
                  <td className="px-4 py-2 text-zinc-500 text-xs pl-8 sticky left-0 bg-zinc-900/20">Autres taxes</td>
                  {MONTH_KEYS.map((month) => (
                    <td key={month} className="text-right px-3 py-2 text-zinc-500 text-xs">{formatCurrency(data?.taxes?.otherTaxes[month] || 0)}</td>
                  ))}
                  <td className="text-right px-4 py-2 text-zinc-400 text-xs bg-zinc-700/30">{formatCurrency(MONTH_KEYS.reduce((s, m) => s + (data?.taxes?.otherTaxes[m] || 0), 0))}</td>
                </tr>

                {/* Net Profit */}
                <tr className="bg-violet-500/10 border-t-2 border-violet-500/30">
                  <td className="px-4 py-4 text-white font-bold text-base sticky left-0 bg-violet-500/10">Résultat Net</td>
                  {MONTH_KEYS.map((month) => {
                    const np = getNetProfit(month);
                    return (
                      <td key={month} className={`text-right px-3 py-4 font-bold ${np >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{formatCurrency(np)}</td>
                    );
                  })}
                  <td className={`text-right px-4 py-4 font-bold text-lg bg-zinc-700/30 ${getYTDNetProfit() >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{formatCurrency(getYTDNetProfit())}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Annual Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-zinc-900/20 border border-zinc-900">
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Revenue YTD</p>
              <p className="text-xl font-extralight text-emerald-400">{formatCurrency(getYTDRevenue())}</p>
            </div>
            <div className="p-4 bg-zinc-900/20 border border-zinc-900">
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Réductions YTD</p>
              <p className="text-xl font-extralight text-orange-400">{formatCurrency(getYTDReductions())}</p>
            </div>
            <div className="p-4 bg-zinc-900/20 border border-zinc-900">
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Dépenses YTD</p>
              <p className="text-xl font-extralight text-red-400">{formatCurrency(getYTDExpenses())}</p>
            </div>
            <div className="p-4 bg-zinc-900/20 border border-zinc-900">
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Profit Net YTD</p>
              <p className={`text-xl font-extralight ${getYTDNetProfit() >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{formatCurrency(getYTDNetProfit())}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Rules Modal - Redesigned */}
      {rulesModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && setRulesModal(null)}
        >
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl shadow-2xl shadow-violet-500/10">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-zinc-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-violet-500/20 rounded-xl flex items-center justify-center">
                    <Settings className="h-5 w-5 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg">Règles automatiques</h3>
                    <p className="text-sm text-zinc-500">{rulesModal.product.label}</p>
                  </div>
                </div>
                <button
                  onClick={() => setRulesModal(null)}
                  className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">
              {/* Info */}
              <div className="bg-zinc-800/50 rounded-xl px-4 py-3 border border-zinc-700/50">
                <p className="text-sm text-zinc-400">
                  <span className="text-violet-400 font-medium">Par client ajouté</span>, multiplie le prix unitaire de la dépense par le facteur défini.
                </p>
              </div>

              {/* Rules List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Règles actives</span>
                  <span className="text-xs text-zinc-600">{rulesModal.product.rules?.length || 0} règle(s)</span>
                </div>

                {(rulesModal.product.rules?.length || 0) === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-zinc-800 rounded-xl">
                    <Link className="h-8 w-8 text-zinc-700 mx-auto mb-2" />
                    <p className="text-sm text-zinc-600">Aucune règle configurée</p>
                    <p className="text-xs text-zinc-700 mt-1">Sélectionnez une dépense ci-dessous</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                    {rulesModal.product.rules?.map((rule, index) => {
                      const expItem = getExpenseItem(rule.expenseCategoryId, rule.expenseItemId);
                      const unitPrice = expItem?.unitPrice || 0;
                      const editMultKey = `mult_${rule.id}`;

                      return (
                        <div
                          key={rule.id}
                          className="group flex items-center gap-3 bg-zinc-800/70 hover:bg-zinc-800 rounded-xl px-4 py-3 transition-colors"
                        >
                          <div className="flex-shrink-0 w-6 h-6 bg-violet-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-xs font-medium text-violet-400">{index + 1}</span>
                          </div>
                          <div className="flex-grow min-w-0">
                            <p className="text-sm text-white truncate">
                              {getExpenseItemLabel(rule.expenseCategoryId, rule.expenseItemId)}
                            </p>
                            <p className="text-[10px] text-zinc-500">
                              Prix unitaire: {formatCurrency(unitPrice)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {/* Multiplier - editable inline */}
                            {editingCell === editMultKey ? (
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  autoFocus
                                  min="0"
                                  step="1"
                                  className="w-14 bg-zinc-700 border border-violet-500 rounded px-2 py-1 text-center text-white text-sm"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      updateRuleMultiplier(rulesModal.catId, rulesModal.product.id, rule.id, Number(editValue) || 1);
                                      // Update modal state
                                      setRulesModal({
                                        ...rulesModal,
                                        product: {
                                          ...rulesModal.product,
                                          rules: rulesModal.product.rules?.map((r) =>
                                            r.id === rule.id ? { ...r, multiplier: Number(editValue) || 1 } : r
                                          ),
                                        },
                                      });
                                      cancelEdit();
                                    }
                                    if (e.key === 'Escape') cancelEdit();
                                  }}
                                />
                                <button
                                  onClick={() => {
                                    updateRuleMultiplier(rulesModal.catId, rulesModal.product.id, rule.id, Number(editValue) || 1);
                                    setRulesModal({
                                      ...rulesModal,
                                      product: {
                                        ...rulesModal.product,
                                        rules: rulesModal.product.rules?.map((r) =>
                                          r.id === rule.id ? { ...r, multiplier: Number(editValue) || 1 } : r
                                        ),
                                      },
                                    });
                                    cancelEdit();
                                  }}
                                  className="text-emerald-400"
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => startEdit(editMultKey, rule.multiplier || 1)}
                                className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-lg hover:bg-blue-500/30 transition-colors"
                              >
                                ×{rule.multiplier || 1}
                              </button>
                            )}
                            <span className="text-zinc-600">=</span>
                            <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-lg min-w-[70px] text-center">
                              {formatCurrency((rule.multiplier || 1) * unitPrice)}
                            </span>
                            <button
                              onClick={() => {
                                deleteProductRule(rulesModal.catId, rulesModal.product.id, rule.id);
                                setRulesModal({
                                  ...rulesModal,
                                  product: {
                                    ...rulesModal.product,
                                    rules: rulesModal.product.rules?.filter((r) => r.id !== rule.id),
                                  },
                                });
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Add Rule - Accordion Selector */}
              <div className="pt-4 border-t border-zinc-800">
                <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3 block">Ajouter une règle</span>
                <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                  {data?.expenseCategories.map((cat) => {
                    const isOpen = openAccordions.includes(cat.id);
                    const itemsWithRules = cat.items.filter((item) =>
                      rulesModal.product.rules?.some((r) => r.expenseCategoryId === cat.id && r.expenseItemId === item.id)
                    ).length;

                    return (
                      <div key={cat.id} className="border border-zinc-800 rounded-xl overflow-hidden">
                        <button
                          onClick={() => toggleAccordion(cat.id)}
                          className="w-full px-4 py-3 flex items-center justify-between bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <ChevronDown className={`h-4 w-4 text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                            <span className="text-white font-medium">{cat.label}</span>
                            <span className="text-xs text-zinc-600">({cat.items.length})</span>
                          </div>
                          {itemsWithRules > 0 && (
                            <span className="text-xs text-emerald-400">{itemsWithRules} lié(s)</span>
                          )}
                        </button>
                        {isOpen && (
                          <div className="p-2 space-y-1 bg-zinc-900/50">
                            {cat.items.map((item) => {
                              const hasRule = rulesModal.product.rules?.some(
                                (r) => r.expenseCategoryId === cat.id && r.expenseItemId === item.id
                              );
                              return (
                                <button
                                  key={item.id}
                                  disabled={hasRule}
                                  onClick={() => {
                                    const newRule: ProductRule = {
                                      id: `rule_${Date.now()}`,
                                      expenseCategoryId: cat.id,
                                      expenseItemId: item.id,
                                      multiplier: 1,
                                    };
                                    addProductRule(rulesModal.catId, rulesModal.product.id, {
                                      expenseCategoryId: cat.id,
                                      expenseItemId: item.id,
                                      multiplier: 1,
                                    });
                                    setRulesModal({
                                      ...rulesModal,
                                      product: {
                                        ...rulesModal.product,
                                        rules: [...(rulesModal.product.rules || []), newRule],
                                      },
                                    });
                                  }}
                                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-all ${
                                    hasRule
                                      ? 'bg-emerald-500/10 border border-emerald-500/30'
                                      : 'bg-zinc-800/50 hover:bg-zinc-800 border border-transparent hover:border-violet-500'
                                  }`}
                                >
                                  <span className={hasRule ? 'text-emerald-400' : 'text-zinc-300'}>{item.label}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-zinc-500">{formatCurrency(item.unitPrice || 0)}</span>
                                    {hasRule && <Check className="h-4 w-4 text-emerald-500" />}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-900/50">
              <button
                onClick={() => setRulesModal(null)}
                className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transactions Modal - Professional Design (Portal to escape stacking context) */}
      {transactionsModal && typeof window !== 'undefined' && createPortal(
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
          onClick={() => {
            setTransactionsModal(null);
            setClientSelectionMode('generate');
            setSelectedClientId(null);
            setClientSearchQuery('');
            setNewClientName('');
            setNewClientEmail('');
            setNewClientPhone('');
            setNewClientCountry('FR');
            setNewClientType('individual');
            setEmailError(null);
            setDiscountAmount('');
            setDiscountNote('');
            setActiveDiscount(null);
          }}
        >
          <div className="h-full w-full flex items-stretch">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full bg-zinc-950 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header compact */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 flex-shrink-0">
                <div className="flex items-center gap-6">
                  <div>
                    <h2 className="text-lg font-medium text-white">{transactionsModal.product.label}</h2>
                    <p className="text-sm text-zinc-500">{MONTHS[selectedMonth]} {selectedYear}</p>
                  </div>
                  <div className="flex items-center gap-6 pl-6 border-l border-zinc-800">
                    <div className="text-center">
                      <p className="text-xl font-light text-white">{getTransactionsCount(transactionsModal.product, currentMonthKey)}</p>
                      <p className="text-xs text-zinc-500">ventes</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-light text-emerald-400">{formatCurrency(getTransactionsRevenue(transactionsModal.product, currentMonthKey))}</p>
                      <p className="text-xs text-zinc-500">revenue</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-light text-zinc-400">{formatCurrency(transactionsModal.product.price)}</p>
                      <p className="text-xs text-zinc-500">/ unité</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setTransactionsModal(null);
                    setClientSelectionMode('generate');
                    setSelectedClientId(null);
                    setClientSearchQuery('');
                    setNewClientName('');
                    setNewClientEmail('');
                    setNewClientPhone('');
                    setNewClientCountry('FR');
                    setNewClientType('individual');
                    setEmailError(null);
                    setDiscountAmount('');
                    setDiscountNote('');
                    setActiveDiscount(null);
                  }}
                  className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content - 2 columns */}
              <div className="flex-1 overflow-hidden flex">
                {/* Left: Nouvelle vente */}
                <div className="flex-1 border-r border-zinc-800 p-6 overflow-y-auto"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-6">Nouvelle vente</h3>

                  {/* Client Selection */}
                  <div className="space-y-4 pb-6 border-b border-zinc-800/50">
                    <label className="text-sm text-zinc-300 font-medium">Client</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setClientSelectionMode('existing')}
                        className={`py-2.5 px-3 border text-sm flex items-center justify-center gap-2 transition-all ${
                          clientSelectionMode === 'existing'
                            ? 'bg-white text-zinc-950 border-white'
                            : 'bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-white'
                        }`}
                      >
                        <Search className="h-4 w-4" />
                        Existant
                      </button>
                      <button
                        onClick={() => {
                          setClientSelectionMode('create');
                          setSelectedClientId(null);
                          setNewClientName('');
                          setNewClientEmail('');
                        }}
                        className={`py-2.5 px-3 border text-sm flex items-center justify-center gap-2 transition-all ${
                          clientSelectionMode === 'create'
                            ? 'bg-white text-zinc-950 border-white'
                            : 'bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-white'
                        }`}
                      >
                        <UserPlus className="h-4 w-4" />
                        Créer
                      </button>
                      <button
                        onClick={() => {
                          setClientSelectionMode('generate');
                          setSelectedClientId(null);
                          if (!generatedClientPreview) setGeneratedClientPreview(generateRandomClient());
                        }}
                        className={`py-2.5 px-3 border text-sm flex items-center justify-center gap-2 transition-all ${
                          clientSelectionMode === 'generate'
                            ? 'bg-white text-zinc-950 border-white'
                            : 'bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-white'
                        }`}
                      >
                        <Shuffle className="h-4 w-4" />
                        Générer
                      </button>
                    </div>

                    {/* Mode content */}
                    <div className="min-h-[120px]">
                      {clientSelectionMode === 'existing' && (
                        <div className="space-y-3">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                            <input
                              type="text"
                              value={clientSearchQuery}
                              onChange={(e) => setClientSearchQuery(e.target.value)}
                              placeholder="Rechercher..."
                              className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 text-white text-[16px] placeholder-zinc-600 focus:border-zinc-600 focus:outline-none"
                            />
                          </div>
                          <div className="border border-zinc-800 max-h-32 overflow-y-auto">
                            {loadingClients ? (
                              <div className="flex items-center justify-center py-6">
                                <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
                              </div>
                            ) : clients.filter(c =>
                              !clientSearchQuery ||
                              c.name.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
                              c.email.toLowerCase().includes(clientSearchQuery.toLowerCase())
                            ).length === 0 ? (
                              <div className="py-6 text-center text-zinc-600 text-sm">Aucun client</div>
                            ) : (
                              clients
                                .filter(c =>
                                  !clientSearchQuery ||
                                  c.name.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
                                  c.email.toLowerCase().includes(clientSearchQuery.toLowerCase())
                                )
                                .slice(0, 10)
                                .map((client) => (
                                  <button
                                    key={client.id}
                                    onClick={() => setSelectedClientId(client.id)}
                                    className={`w-full text-left px-3 py-2 flex items-center justify-between text-sm border-b border-zinc-800 last:border-0 transition-all ${
                                      selectedClientId === client.id ? 'bg-zinc-900' : 'hover:bg-zinc-900/50'
                                    }`}
                                  >
                                    <span className="text-white truncate">{client.name}</span>
                                    {selectedClientId === client.id && <Check className="h-4 w-4 text-white flex-shrink-0" />}
                                  </button>
                                ))
                            )}
                          </div>
                        </div>
                      )}

                      {clientSelectionMode === 'create' && (
                        <div className="space-y-3">
                          {/* Type selection */}
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setNewClientType('individual')}
                              className={`py-2 px-3 border text-sm flex items-center justify-center gap-2 transition-all ${
                                newClientType === 'individual'
                                  ? 'bg-zinc-900 border-zinc-600 text-white'
                                  : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-white'
                              }`}
                            >
                              <Users className="h-3.5 w-3.5" />
                              Particulier
                            </button>
                            <button
                              type="button"
                              onClick={() => setNewClientType('company')}
                              className={`py-2 px-3 border text-sm flex items-center justify-center gap-2 transition-all ${
                                newClientType === 'company'
                                  ? 'bg-zinc-900 border-zinc-600 text-white'
                                  : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-white'
                              }`}
                            >
                              <Package className="h-3.5 w-3.5" />
                              Entreprise
                            </button>
                          </div>
                          <input
                            type="text"
                            value={newClientName}
                            onChange={(e) => setNewClientName(e.target.value)}
                            placeholder={newClientType === 'company' ? "Nom de l'entreprise" : "Nom complet"}
                            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-white text-[16px] placeholder-zinc-600 focus:border-zinc-600 focus:outline-none"
                          />
                          <div>
                            <input
                              type="email"
                              value={newClientEmail}
                              onChange={(e) => {
                                const email = e.target.value.toLowerCase();
                                setNewClientEmail(email);
                                // Check if email exists
                                if (email && clients.some(c => c.email?.toLowerCase() === email)) {
                                  setEmailError('Cet email existe déjà');
                                } else {
                                  setEmailError(null);
                                }
                              }}
                              placeholder="Email"
                              className={`w-full px-3 py-2 bg-zinc-900 border text-white text-[16px] placeholder-zinc-600 focus:outline-none ${
                                emailError ? 'border-red-500 focus:border-red-500' : 'border-zinc-800 focus:border-zinc-600'
                              }`}
                            />
                            {emailError && (
                              <p className="text-red-400 text-xs mt-1">{emailError}</p>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="tel"
                              value={newClientPhone || ''}
                              onChange={(e) => setNewClientPhone(e.target.value)}
                              placeholder="Téléphone"
                              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-white text-[16px] placeholder-zinc-600 focus:border-zinc-600 focus:outline-none"
                            />
                            <select
                              value={newClientCountry}
                              onChange={(e) => setNewClientCountry(e.target.value)}
                              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-white text-[16px] focus:border-zinc-600 focus:outline-none"
                            >
                              <option value="FR">France</option>
                              <option value="BE">Belgique</option>
                              <option value="CH">Suisse</option>
                              <option value="CA">Canada</option>
                              <option value="LU">Luxembourg</option>
                              <option value="DE">Allemagne</option>
                              <option value="ES">Espagne</option>
                              <option value="IT">Italie</option>
                              <option value="UK">Royaume-Uni</option>
                              <option value="US">États-Unis</option>
                              <option value="MA">Maroc</option>
                              <option value="TN">Tunisie</option>
                              <option value="DZ">Algérie</option>
                              <option value="SN">Sénégal</option>
                              <option value="CI">Côte d'Ivoire</option>
                              <option value="OTHER">Autre</option>
                            </select>
                          </div>
                        </div>
                      )}

                      {clientSelectionMode === 'generate' && (
                        <div className="space-y-3">
                          {/* Type selection */}
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => setGeneratedClientPreview(generateRandomClient('individual'))}
                              className={`py-2 px-3 border text-sm flex items-center justify-center gap-2 transition-all ${
                                generatedClientPreview?.type === 'individual'
                                  ? 'bg-zinc-900 border-zinc-600 text-white'
                                  : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-white'
                              }`}
                            >
                              <Users className="h-3.5 w-3.5" />
                              Particulier
                            </button>
                            <button
                              onClick={() => setGeneratedClientPreview(generateRandomClient('business'))}
                              className={`py-2 px-3 border text-sm flex items-center justify-center gap-2 transition-all ${
                                generatedClientPreview?.type === 'business'
                                  ? 'bg-zinc-900 border-zinc-600 text-white'
                                  : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-white'
                              }`}
                            >
                              <Package className="h-3.5 w-3.5" />
                              Entreprise
                            </button>
                          </div>
                          {/* Generated client preview */}
                          {generatedClientPreview && (
                            <div className="bg-zinc-900 border border-zinc-800 p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    generatedClientPreview.type === 'business' ? 'bg-violet-500/20 text-violet-400' : 'bg-emerald-500/20 text-emerald-400'
                                  }`}>
                                    {generatedClientPreview.type === 'business' ? (
                                      <Package className="h-4 w-4" />
                                    ) : (
                                      <Users className="h-4 w-4" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-white text-sm font-medium">{generatedClientPreview.name}</p>
                                    {generatedClientPreview.company && (
                                      <p className="text-zinc-500 text-xs">{generatedClientPreview.company}</p>
                                    )}
                                  </div>
                                </div>
                                <button
                                  onClick={() => setGeneratedClientPreview(generateRandomClient(generatedClientPreview.type))}
                                  className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
                                  title="Régénérer"
                                >
                                  <Shuffle className="h-4 w-4" />
                                </button>
                              </div>
                              <div className="space-y-1.5 text-xs">
                                <div className="flex items-center gap-2 text-zinc-400">
                                  <span className="text-zinc-600 w-14">Email</span>
                                  <span className="truncate">{generatedClientPreview.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-zinc-400">
                                  <span className="text-zinc-600 w-14">Tél</span>
                                  <span>{generatedClientPreview.phone}</span>
                                </div>
                                {generatedClientPreview.origin && (
                                  <div className="flex items-center gap-2 text-zinc-500">
                                    <span className="text-zinc-600 w-14">Origine</span>
                                    <span className="capitalize">{generatedClientPreview.origin}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="space-y-3 py-6 border-b border-zinc-800/50">
                    <label className="text-sm text-zinc-300 font-medium">Quantité</label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setTxCounter(Math.max(1, txCounter - 1))}
                        className="w-10 h-10 border border-zinc-800 hover:border-zinc-600 text-white flex items-center justify-center transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={txCounter}
                        onChange={(e) => setTxCounter(Math.max(1, Number(e.target.value.replace(/\D/g, '')) || 1))}
                        className="w-16 text-center text-xl font-light text-white bg-transparent border-b border-zinc-700 focus:border-zinc-500 outline-none text-[16px]"
                      />
                      <button
                        onClick={() => setTxCounter(txCounter + 1)}
                        className="w-10 h-10 border border-zinc-800 hover:border-zinc-600 text-white flex items-center justify-center transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <div className="flex gap-1.5 ml-auto">
                        {[1, 5, 10, 25].map((n) => (
                          <button
                            key={n}
                            onClick={() => setTxCounter(n)}
                            className={`w-9 h-9 text-xs border transition-all ${
                              txCounter === n
                                ? 'bg-zinc-800 border-zinc-600 text-white'
                                : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-white'
                            }`}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Discount Section - Linked to COGS */}
                  <div className="pt-6">
                    <button
                      onClick={() => setOpenAccordions(prev => prev.includes('discount') ? prev.filter(a => a !== 'discount') : [...prev, 'discount'])}
                      className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
                    >
                      <ChevronDown className={`h-4 w-4 transition-transform ${openAccordions.includes('discount') ? 'rotate-180' : ''}`} />
                      <Percent className="h-4 w-4" />
                      Appliquer une réduction
                    </button>
                    {openAccordions.includes('discount') && (
                      <div className="mt-3 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <input
                              type="text"
                              inputMode="decimal"
                              value={discountAmount}
                              onChange={(e) => setDiscountAmount(e.target.value.replace(/[^0-9.,]/g, ''))}
                              placeholder="0"
                              className="w-24 px-3 py-2 bg-zinc-900 border border-zinc-700 text-white text-[16px] placeholder-zinc-600 focus:border-zinc-500 focus:outline-none"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">€</span>
                          </div>
                          <div className="flex-1 text-sm">
                            {Number(discountAmount) > 0 && (
                              <div className="flex items-center gap-2">
                                <span className="text-zinc-500">Prix final:</span>
                                <span className="text-emerald-400 font-medium">
                                  {formatCurrency(Math.max(0, transactionsModal.product.price - Number(discountAmount)))}
                                </span>
                                <span className="text-zinc-600 line-through text-xs">
                                  {formatCurrency(transactionsModal.product.price)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <input
                          type="text"
                          value={discountNote}
                          onChange={(e) => setDiscountNote(e.target.value)}
                          placeholder="Raison (ex: Fidélité, Promo...)"
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-white text-[16px] placeholder-zinc-600 focus:border-zinc-600 focus:outline-none"
                        />
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-zinc-600 flex items-center gap-1">
                            <Minus className="h-3 w-3 text-zinc-500" />
                            S'applique aux prochaines ventes
                          </div>
                          <button
                            onClick={() => {
                              const discount = Number(discountAmount);
                              if (discount <= 0 || discount > transactionsModal.product.price) return;
                              setActiveDiscount({
                                amount: discount,
                                note: discountNote || `Réduction de ${formatCurrency(discount)}`
                              });
                              setDiscountAmount('');
                              setDiscountNote('');
                              // Close accordion
                              setOpenAccordions(prev => prev.filter(a => a !== 'discount'));
                            }}
                            disabled={
                              !discountAmount ||
                              Number(discountAmount) <= 0 ||
                              Number(discountAmount) > transactionsModal.product.price
                            }
                            className="px-4 py-2 bg-zinc-800 text-white text-sm hover:bg-zinc-700 disabled:bg-zinc-900 disabled:text-zinc-600 transition-colors border border-zinc-700"
                          >
                            Activer
                          </button>
                        </div>
                      </div>
                    )}
                    {/* Active discount indicator */}
                    {activeDiscount && (
                      <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Percent className="h-4 w-4 text-emerald-400" />
                          <div>
                            <span className="text-emerald-400 text-sm font-medium">-{formatCurrency(activeDiscount.amount)}</span>
                            <span className="text-zinc-500 text-xs ml-2">{activeDiscount.note}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => setActiveDiscount(null)}
                          className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                          title="Désactiver la réduction"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Historique */}
                <div className="w-80 flex-shrink-0 flex flex-col bg-zinc-900/30">
                  <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
                    <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Historique</h3>
                    <span className="text-xs text-zinc-600">{getTransactionsCount(transactionsModal.product, currentMonthKey)} tx</span>
                  </div>
                  <div className="flex-1 overflow-y-auto scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {getTransactionsCount(transactionsModal.product, currentMonthKey) === 0 ? (
                      <div className="h-full flex items-center justify-center text-zinc-600 text-sm">
                        Aucune transaction
                      </div>
                    ) : (
                      <div className="divide-y divide-zinc-800/50">
                        {(transactionsModal.product.transactions?.[currentMonthKey] || []).map((tx, index) => (
                          <div key={tx.id} className="px-5 py-3 flex items-center justify-between group hover:bg-zinc-900/50 transition-colors">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-zinc-600">#{index + 1}</span>
                                <span className={`text-sm font-medium ${tx.discount ? 'text-emerald-400' : tx.isCustom ? 'text-amber-400' : 'text-white'}`}>
                                  {formatCurrency(tx.amount)}
                                </span>
                                {tx.discount && (
                                  <span className="text-[10px] px-1.5 py-0.5 bg-zinc-800 text-zinc-400 flex items-center gap-0.5">
                                    <Minus className="h-2.5 w-2.5" />
                                    {formatCurrency(tx.discount)}
                                  </span>
                                )}
                                {tx.isCustom && !tx.discount && <span className="text-[10px] px-1 py-0.5 bg-amber-500/10 text-amber-500">Custom</span>}
                              </div>
                              <p className="text-xs text-zinc-500 truncate">{tx.clientName || 'Client inconnu'}</p>
                              {tx.note && <p className="text-[10px] text-zinc-600 truncate">{tx.note}</p>}
                            </div>
                            <button
                              onClick={() => {
                                deleteTransaction(transactionsModal.catId, transactionsModal.product.id, currentMonthKey, tx.id);
                                setTransactionsModal({
                                  ...transactionsModal,
                                  product: {
                                    ...transactionsModal.product,
                                    transactions: {
                                      ...transactionsModal.product.transactions,
                                      [currentMonthKey]: (transactionsModal.product.transactions?.[currentMonthKey] || []).filter((t) => t.id !== tx.id),
                                    },
                                  },
                                });
                              }}
                              className="p-1 text-zinc-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800 flex-shrink-0 bg-zinc-900/50">
                <div className="text-sm">
                  <span className="text-zinc-500">Total : </span>
                  {activeDiscount ? (
                    <>
                      <span className="text-emerald-400 font-medium text-lg">
                        {formatCurrency(txCounter * (transactionsModal.product.price - activeDiscount.amount))}
                      </span>
                      <span className="text-zinc-600 line-through text-sm ml-2">
                        {formatCurrency(txCounter * transactionsModal.product.price)}
                      </span>
                    </>
                  ) : (
                    <span className="text-white font-medium text-lg">{formatCurrency(txCounter * transactionsModal.product.price)}</span>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setTransactionsModal(null);
                      setClientSelectionMode('generate');
                      setSelectedClientId(null);
                      setClientSearchQuery('');
                      setNewClientName('');
                      setNewClientEmail('');
                      setNewClientPhone('');
                      setNewClientCountry('FR');
                      setNewClientType('individual');
                      setEmailError(null);
                      setDiscountAmount('');
                      setDiscountNote('');
                      setActiveDiscount(null);
                    }}
                    className="px-5 py-2.5 border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors text-sm"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={async () => {
                      const finalPrice = activeDiscount
                        ? transactionsModal.product.price - activeDiscount.amount
                        : transactionsModal.product.price;
                      const totalDiscount = activeDiscount ? activeDiscount.amount * txCounter : 0;

                      // Special case: generate mode with multiple transactions = multiple random clients
                      if (clientSelectionMode === 'generate' && txCounter > 1) {
                        const clientType = generatedClientPreview?.type;
                        const newTxs: Transaction[] = [];

                        for (let i = 0; i < txCounter; i++) {
                          // Generate a unique random client for each transaction
                          const randomClient = generateRandomClient(clientType);
                          const newClient = await createClientInDb(randomClient);

                          // Create transaction for this client
                          const tx: Transaction = {
                            id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${i}`,
                            amount: finalPrice,
                            isCustom: false,
                            discount: activeDiscount?.amount,
                            note: activeDiscount?.note,
                            clientId: newClient.id,
                            clientName: newClient.name,
                            clientEmail: newClient.email,
                          };
                          newTxs.push(tx);

                          // Update client stats
                          await updateClientStats(newClient.id, finalPrice);
                        }

                        // Update data state with all new transactions
                        setData((prev) => {
                          if (!prev) return prev;
                          // Update salesDiscounts if discount is applied
                          const updatedReductions = activeDiscount
                            ? {
                                ...prev.reductions,
                                salesDiscounts: {
                                  ...prev.reductions.salesDiscounts,
                                  [currentMonthKey]: (prev.reductions.salesDiscounts[currentMonthKey] || 0) + totalDiscount,
                                },
                              }
                            : prev.reductions;
                          return {
                            ...prev,
                            reductions: updatedReductions,
                            productCategories: prev.productCategories.map((cat) => {
                              if (cat.id !== transactionsModal.catId) return cat;
                              return {
                                ...cat,
                                products: cat.products.map((p) => {
                                  if (p.id !== transactionsModal.product.id) return p;
                                  const existing = p.transactions?.[currentMonthKey] || [];
                                  return { ...p, transactions: { ...p.transactions, [currentMonthKey]: [...existing, ...newTxs] } };
                                }),
                              };
                            }),
                          };
                        });
                        setHasChanges(true);

                        // Update modal state
                        setTransactionsModal({
                          ...transactionsModal,
                          product: {
                            ...transactionsModal.product,
                            transactions: {
                              ...transactionsModal.product.transactions,
                              [currentMonthKey]: [...(transactionsModal.product.transactions?.[currentMonthKey] || []), ...newTxs],
                            },
                          },
                        });
                        setTxCounter(1);
                        setGeneratedClientPreview(generateRandomClient(clientType));
                        return;
                      }

                      // Standard case: single client for all transactions
                      let clientInfo: { id: string; name: string; email?: string };

                      if (clientSelectionMode === 'existing' && selectedClientId) {
                        const client = clients.find(c => c.id === selectedClientId);
                        if (!client) return;
                        clientInfo = { id: client.id, name: client.name, email: client.email };
                      } else if (clientSelectionMode === 'create' && newClientName && newClientEmail) {
                        const manualClient: GeneratedClient = {
                          id: `cli_${Date.now().toString(36)}${Math.random().toString(36).substring(2, 8)}`,
                          name: newClientName.trim(),
                          email: newClientEmail.trim().toLowerCase(),
                          phone: newClientPhone?.trim() || '',
                          type: newClientType,
                          isGenerated: false,
                          generatedAt: new Date().toISOString(),
                          country: newClientCountry,
                        };
                        const newClient = await createClientInDb(manualClient);
                        clientInfo = { id: newClient.id, name: newClient.name, email: newClient.email };
                        setNewClientName('');
                        setNewClientEmail('');
                        setNewClientPhone('');
                        setNewClientCountry('FR');
                        setNewClientType('individual');
                      } else if (clientSelectionMode === 'generate' && generatedClientPreview) {
                        const newClient = await createClientInDb(generatedClientPreview);
                        clientInfo = { id: newClient.id, name: newClient.name, email: newClient.email };
                      } else {
                        return;
                      }

                      // If discount is active, use addCustomTransaction for each
                      if (activeDiscount) {
                        for (let i = 0; i < txCounter; i++) {
                          await addCustomTransaction(
                            transactionsModal.catId,
                            transactionsModal.product.id,
                            currentMonthKey,
                            finalPrice,
                            clientInfo,
                            activeDiscount.note,
                            activeDiscount.amount
                          );
                        }
                      } else {
                        await addStandardTransactions(
                          transactionsModal.catId,
                          transactionsModal.product.id,
                          currentMonthKey,
                          txCounter,
                          clientInfo
                        );
                      }

                      const newTxs: Transaction[] = Array.from({ length: txCounter }, () => ({
                        id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                        amount: finalPrice,
                        isCustom: false,
                        discount: activeDiscount?.amount,
                        note: activeDiscount?.note,
                        clientId: clientInfo.id,
                        clientName: clientInfo.name,
                        clientEmail: clientInfo.email,
                      }));
                      setTransactionsModal({
                        ...transactionsModal,
                        product: {
                          ...transactionsModal.product,
                          transactions: {
                            ...transactionsModal.product.transactions,
                            [currentMonthKey]: [...(transactionsModal.product.transactions?.[currentMonthKey] || []), ...newTxs],
                          },
                        },
                      });
                      setTxCounter(1);

                      if (clientSelectionMode === 'generate') {
                        setGeneratedClientPreview(generateRandomClient(generatedClientPreview?.type));
                      }
                    }}
                    disabled={
                      (clientSelectionMode === 'existing' && !selectedClientId) ||
                      (clientSelectionMode === 'create' && (!newClientName || !newClientEmail || emailError !== null))
                    }
                    className="px-6 py-2.5 bg-white text-zinc-950 hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-600 transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Ajouter {txCounter} vente{txCounter > 1 ? 's' : ''}
                    {activeDiscount && <span className="text-emerald-600 text-xs">(-{formatCurrency(activeDiscount.amount)}/u)</span>}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>,
        document.body
      )}

      {/* Sticky Save Bar */}
      {hasChanges && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-zinc-950/95 backdrop-blur-sm border-t border-zinc-800 px-6 py-3 z-50"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              <span className="text-zinc-300 text-sm">Modifications non sauvegardées</span>
              <span className="text-zinc-600 text-xs hidden sm:inline">⌘/Ctrl+Enter</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (confirm('Annuler toutes les modifications ?')) {
                    loadData();
                  }
                }}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all duration-200"
              >
                Annuler
              </button>
              <button
                onClick={saveData}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-violet-600 border border-violet-500 text-white hover:bg-violet-500 disabled:opacity-50 transition-all duration-200"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Sauvegarder
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Modal: Discounted Transactions */}
      {showDiscountTransactions && createPortal(
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowDiscountTransactions(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-zinc-950 border border-zinc-800 w-full max-w-lg max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-zinc-400" />
                  Transactions avec réductions
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  {MONTHS[selectedMonth]} {selectedYear} • {getDiscountedTransactions(currentMonthKey).length} transaction(s)
                </p>
              </div>
              <button
                onClick={() => setShowDiscountTransactions(false)}
                className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {getDiscountedTransactions(currentMonthKey).length === 0 ? (
                <div className="h-40 flex items-center justify-center text-zinc-600 text-sm">
                  Aucune transaction avec réduction
                </div>
              ) : (
                <div className="divide-y divide-zinc-800/50">
                  {getDiscountedTransactions(currentMonthKey).map((item) => (
                    <div
                      key={item.transaction.id}
                      className="px-5 py-3 hover:bg-zinc-900/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-white font-medium">{item.productName}</span>
                            <span className="text-[10px] px-1.5 py-0.5 bg-zinc-800 text-zinc-400 rounded">
                              {item.catName}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-500 mt-1">
                            {item.transaction.clientName}
                          </p>
                          {item.transaction.note && (
                            <p className="text-xs text-zinc-600 mt-0.5 italic">
                              {item.transaction.note}
                            </p>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-sm text-white font-medium">
                            {formatCurrency(item.transaction.amount)}
                          </div>
                          <div className="text-xs text-red-400 flex items-center justify-end gap-1">
                            <Minus className="h-3 w-3" />
                            {formatCurrency(item.transaction.discount || 0)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-zinc-800 bg-zinc-900/50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Total des réductions</span>
                <span className="text-lg font-medium text-red-400">
                  -{formatCurrency(getDiscountedTransactions(currentMonthKey).reduce((sum, item) => sum + (item.transaction.discount || 0), 0))}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>,
        document.body
      )}
    </div>
  );
}
