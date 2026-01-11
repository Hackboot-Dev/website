// apps/web/app/[locale]/admin/pnl/PnLPageClient.tsx
// Description: P&L Dashboard - Refactored with modular components
// Last modified: 2025-12-19
// Related docs: /docs/features/ADMIN_PNL_V2.md

'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Database
import { getDatabase } from '../../../../lib/services/database';
import { supabase } from '../../../../lib/supabase';
import { generateRandomClient, type GeneratedClient } from '../../../../lib/utils/clientGenerator';
import type { Client } from '../../../../lib/types/database';

// Types & Constants
import type {
  PnLData,
  Product,
  ProductCategory,
  ProductRule,
  Transaction,
  ExpenseCategory,
  CompanyId,
} from './types';
import { MONTH_KEYS, COMPANY_CONFIG, CATALOGUE_CACHE_TTL, AUTO_SAVE_DELAY } from './constants';
import type { PnLTabId } from './constants';
import type { CreateSubscriptionData } from './types/subscription';

// Hooks
import { useSubscriptions } from './hooks/useSubscriptions';
import { usePnLCalculations } from './hooks/usePnLCalculations';

// Utils
import { getDefaultData } from './utils/defaultData';
import { formatCurrency } from '../_shared/utils/formatters';

// Components
import { PnLHeader, MonthNavigator, PnLTabs } from './components/layout';
import { KPIGrid } from './components/kpi';
import { OverviewTab, ProductsTab, ExpensesTab, AnnualTab } from './components/tabs';
import { RulesModal, TransactionsModal, SubscriptionsModal, ClientsModal } from './components';

type PnLPageClientProps = {
  company: CompanyId;
};

export default function PnLPageClient({ company }: PnLPageClientProps) {
  const config = COMPANY_CONFIG[company];
  const dbService = getDatabase(company);

  // ============================================================
  // STATE
  // ============================================================
  const [data, setData] = useState<PnLData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [activeTab, setActiveTab] = useState<PnLTabId>('overview');
  const [hasChanges, setHasChanges] = useState(false);

  // Edit state
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  // Modal state
  const [rulesModal, setRulesModal] = useState<{ catId: string; product: Product } | null>(null);
  const [transactionsModal, setTransactionsModal] = useState<{ catId: string; catLabel: string; productId: string } | null>(null);
  const [subscriptionsModal, setSubscriptionsModal] = useState(false);
  const [clientsModal, setClientsModal] = useState(false);

  // Clients
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);

  const currentMonthKey = MONTH_KEYS[selectedMonth];

  // ============================================================
  // HOOKS
  // ============================================================
  const subscriptionHook = useSubscriptions({ companyId: company });
  const calculations = usePnLCalculations({ data });

  // Get current product for modal
  const getModalProduct = (): Product | null => {
    if (!transactionsModal || !data) return null;
    const category = data.productCategories.find(c => c.id === transactionsModal.catId);
    return category?.products.find(p => p.id === transactionsModal.productId) || null;
  };
  const modalProduct = getModalProduct();

  // ============================================================
  // DATA LOADING
  // ============================================================
  const loadCatalogue = useCallback(async (): Promise<ProductCategory[]> => {
    const cached = localStorage.getItem('catalogue_cache');
    if (cached) {
      try {
        const { data: cachedData, timestamp } = JSON.parse(cached);
        if (Date.now() - new Date(timestamp).getTime() < CATALOGUE_CACHE_TTL) {
          return cachedData.map((cat: { id: string; name: string; products: Array<{ id: string; name: string; monthly?: number; hourly?: number; annual?: number; price_per_gb_month?: number }> }) => ({
            id: cat.id,
            label: cat.name || cat.id,
            isFromCatalogue: true,
            products: (cat.products || []).map((p) => ({
              id: p.id,
              label: p.name || p.id,
              price: p.monthly || p.hourly || p.annual || p.price_per_gb_month || 0,
              transactions: {},
            })),
          }));
        }
      } catch { /* Invalid cache */ }
    }

    try {
      // Load categories from Supabase
      const { data: categoriesData, error: catError } = await supabase
        .from('product_categories')
        .select('*')
        .eq('company_id', 'vmcloud')
        .order('sort_order');

      if (catError) throw catError;

      // Load products from Supabase
      const { data: productsData, error: prodError } = await supabase
        .from('products')
        .select('*')
        .eq('company_id', 'vmcloud')
        .eq('status', 'active');

      if (prodError) throw prodError;

      // Group products by category
      type CategoryRow = { id: string; name: string; sort_order: number };
      type ProductRow = { id: string; name: string; category_id: string | null; unit_price: number };
      const categories: ProductCategory[] = (categoriesData || []).map((cat: CategoryRow) => ({
        id: cat.id,
        label: cat.name,
        isFromCatalogue: true,
        products: (productsData || [])
          .filter((p: ProductRow) => p.category_id === cat.id)
          .map((p: ProductRow) => ({
            id: p.id,
            label: p.name,
            price: p.unit_price || 0,
            transactions: {},
          })),
      }));

      // Cache the result
      localStorage.setItem('catalogue_cache', JSON.stringify({
        data: categories.map(c => ({
          id: c.id,
          name: c.label,
          products: c.products.map(p => ({ id: p.id, name: p.label, monthly: p.price })),
        })),
        timestamp: new Date().toISOString(),
      }));

      return categories;
    } catch (err) {
      console.error('Error loading catalogue:', err);
      return [];
    }
  }, []);

  const loadData = useCallback(async () => {
    let pnlData: PnLData | null = null;

    try {
      setLoading(true);
      pnlData = await dbService.getPnLData(selectedYear) as PnLData | null;
    } catch (err) {
      console.error('Error loading:', err);
      setError('Erreur de chargement');
      setData(getDefaultData(selectedYear, company));
      setLoading(false);
      return;
    }

    try {
      let newData: PnLData;
      if (pnlData) {
        newData = pnlData;
      } else {
        newData = getDefaultData(selectedYear, company);
      }

      // For VMCloud, merge with catalogue categories
      if (company === 'vmcloud') {
        const catalogueCategories = await loadCatalogue();
        // Merge logic (simplified - keep existing if has transactions)
        const mergedCategories: ProductCategory[] = [...catalogueCategories];
        for (const existingCat of newData.productCategories) {
          if (!catalogueCategories.find(c => c.id === existingCat.id)) {
            mergedCategories.push(existingCat);
          }
        }
        newData.productCategories = mergedCategories;
      }

      // Load transactions from pnl_transactions table and merge with pnl_data
      // This ensures consistency even if auto-save hasn't completed yet
      try {
        const dbTransactions = await dbService.getPnLTransactions(selectedYear);
        if (dbTransactions && dbTransactions.length > 0) {
          // Collect all unique client IDs to load their names
          const clientIds = new Set<string>();
          for (const dbTx of dbTransactions) {
            if (dbTx.client_id) clientIds.add(dbTx.client_id);
          }

          // Load client names from clients table
          const clientNameMap = new Map<string, string>();
          if (clientIds.size > 0) {
            try {
              const { data: clientsData } = await supabase
                .from('clients')
                .select('id, name')
                .in('id', Array.from(clientIds)) as { data: { id: string; name: string }[] | null };
              if (clientsData) {
                for (const client of clientsData) {
                  clientNameMap.set(client.id, client.name);
                }
              }
            } catch (clientErr) {
              console.error('Error loading client names:', clientErr);
            }
          }

          // Group transactions by category, product, and month
          const txMap: Record<string, Record<string, Record<string, Transaction[]>>> = {};

          for (const dbTx of dbTransactions) {
            const catId = dbTx.category_id;
            const prodId = dbTx.product_id;
            const month = dbTx.month;

            if (!txMap[catId]) txMap[catId] = {};
            if (!txMap[catId][prodId]) txMap[catId][prodId] = {};
            if (!txMap[catId][prodId][month]) txMap[catId][prodId][month] = [];

            // Get client name from: 1) stored in tx, 2) clients table, 3) empty
            const storedClientName = (dbTx as { client_name?: string }).client_name;
            const clientName = storedClientName || (dbTx.client_id ? clientNameMap.get(dbTx.client_id) : '') || '';

            txMap[catId][prodId][month].push({
              id: dbTx.id,
              amount: dbTx.amount,
              isCustom: (dbTx.discount || 0) > 0,
              discount: dbTx.discount || undefined,
              note: dbTx.note || undefined,
              clientId: dbTx.client_id || '',
              clientName,
              isRecurring: dbTx.is_recurring || false,
            });
          }

          // Merge transactions into newData
          newData = {
            ...newData,
            productCategories: newData.productCategories.map((cat) => ({
              ...cat,
              products: cat.products.map((prod) => {
                const prodTxs = txMap[cat.id]?.[prod.id] || {};
                // Use DB transactions as source of truth
                const mergedTxs: Record<string, Transaction[]> = {};
                for (const month of MONTH_KEYS) {
                  mergedTxs[month] = prodTxs[month] || [];
                }

                return {
                  ...prod,
                  transactions: mergedTxs,
                };
              }),
            })),
          };
        }
      } catch (txErr) {
        console.error('Error loading transactions from pnl_transactions:', txErr);
        // Continue with pnl_data transactions as fallback
      }

      setData(newData);
      setError(null);
      setHasChanges(false);
    } catch (err) {
      console.error('Error loading:', err);
      setError('Erreur de chargement');
      setData(getDefaultData(selectedYear, company));
    } finally {
      setLoading(false);
    }
  }, [selectedYear, dbService, company, loadCatalogue]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auto-save
  useEffect(() => {
    if (!hasChanges || !data) return;

    const timeoutId = setTimeout(async () => {
      try {
        setSaving(true);
        const updatedData = { ...data, companyId: company, updatedAt: new Date().toISOString() };
        await dbService.savePnLData(updatedData as Parameters<typeof dbService.savePnLData>[0]);
        setHasChanges(false);
      } catch (err) {
        console.error('Error auto-saving:', err);
      } finally {
        setSaving(false);
      }
    }, AUTO_SAVE_DELAY);

    return () => clearTimeout(timeoutId);
  }, [hasChanges, data, dbService, company]);

  // Load clients
  const loadClients = useCallback(async () => {
    try {
      setLoadingClients(true);
      const clientsData = await dbService.getClients();
      setClients(clientsData);
    } catch (err) {
      console.error('Error loading clients:', err);
    } finally {
      setLoadingClients(false);
    }
  }, [dbService]);

  useEffect(() => {
    if (transactionsModal) {
      loadClients();
    }
  }, [transactionsModal, loadClients]);

  // ============================================================
  // DATA MUTATIONS
  // ============================================================
  const updateData = (updater: (prev: PnLData) => PnLData) => {
    setData((prev) => {
      if (!prev) return prev;
      return updater(prev);
    });
    setHasChanges(true);
  };

  // Products
  const addProduct = (catId: string) => {
    const name = prompt('Nom du produit:');
    const priceStr = prompt('Prix unitaire (€):');
    if (!name || !priceStr) return;

    const id = `${name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;
    updateData((prev) => ({
      ...prev,
      productCategories: prev.productCategories.map((cat) =>
        cat.id === catId
          ? { ...cat, products: [...cat.products, { id, label: name, price: Number(priceStr) || 0, transactions: {} }] }
          : cat
      ),
    }));
  };

  const deleteProduct = (catId: string, productId: string) => {
    const category = data?.productCategories.find(c => c.id === catId);
    if (category?.isFromCatalogue) {
      alert('Ce produit provient du catalogue et ne peut pas être supprimé.');
      return;
    }
    if (!confirm('Supprimer ce produit ?')) return;
    updateData((prev) => ({
      ...prev,
      productCategories: prev.productCategories.map((cat) =>
        cat.id === catId
          ? { ...cat, products: cat.products.filter((p) => p.id !== productId) }
          : cat
      ),
    }));
  };

  const updateProductPrice = (catId: string, productId: string, price: number) => {
    updateData((prev) => ({
      ...prev,
      productCategories: prev.productCategories.map((cat) =>
        cat.id === catId
          ? { ...cat, products: cat.products.map((p) => (p.id === productId ? { ...p, price } : p)) }
          : cat
      ),
    }));
  };

  const renameProduct = (catId: string, productId: string, label: string) => {
    updateData((prev) => ({
      ...prev,
      productCategories: prev.productCategories.map((cat) =>
        cat.id === catId
          ? { ...cat, products: cat.products.map((p) => (p.id === productId ? { ...p, label } : p)) }
          : cat
      ),
    }));
  };

  // Product Categories
  const addProductCategory = () => {
    const name = prompt('Nom de la catégorie:');
    if (!name) return;
    const id = `cat_${name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;
    updateData((prev) => ({
      ...prev,
      productCategories: [...prev.productCategories, { id, label: name, products: [] }],
    }));
  };

  const deleteProductCategory = (catId: string) => {
    const category = data?.productCategories.find(c => c.id === catId);
    if (category?.isFromCatalogue) {
      alert('Cette catégorie provient du catalogue et ne peut pas être supprimée.');
      return;
    }
    if (!confirm('Supprimer cette catégorie ?')) return;
    updateData((prev) => ({
      ...prev,
      productCategories: prev.productCategories.filter((c) => c.id !== catId),
    }));
  };

  const renameProductCategory = (catId: string, label: string) => {
    updateData((prev) => ({
      ...prev,
      productCategories: prev.productCategories.map((cat) => (cat.id === catId ? { ...cat, label } : cat)),
    }));
  };

  // Expenses
  const addExpenseItem = (catId: string) => {
    const name = prompt('Nom:');
    if (!name) return;
    const id = `${name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;
    updateData((prev) => ({
      ...prev,
      expenseCategories: prev.expenseCategories.map((cat) =>
        cat.id === catId
          ? { ...cat, items: [...cat.items, { id, label: name, unitPrice: 0, quantity: {}, adjustments: {} }] }
          : cat
      ),
    }));
  };

  const deleteExpenseItem = (catId: string, itemId: string) => {
    if (!confirm('Supprimer ?')) return;
    updateData((prev) => ({
      ...prev,
      expenseCategories: prev.expenseCategories.map((cat) =>
        cat.id === catId ? { ...cat, items: cat.items.filter((i) => i.id !== itemId) } : cat
      ),
    }));
  };

  const updateExpenseUnitPrice = (catId: string, itemId: string, unitPrice: number) => {
    updateData((prev) => ({
      ...prev,
      expenseCategories: prev.expenseCategories.map((cat) =>
        cat.id === catId
          ? { ...cat, items: cat.items.map((item) => (item.id === itemId ? { ...item, unitPrice } : item)) }
          : cat
      ),
    }));
  };

  const updateExpenseQuantity = (catId: string, itemId: string, month: string, qty: number) => {
    updateData((prev) => ({
      ...prev,
      expenseCategories: prev.expenseCategories.map((cat) =>
        cat.id === catId
          ? {
              ...cat,
              items: cat.items.map((item) =>
                item.id === itemId ? { ...item, quantity: { ...(item.quantity || {}), [month]: qty } } : item
              ),
            }
          : cat
      ),
    }));
  };

  const updateExpenseAdjustment = (catId: string, itemId: string, month: string, value: number) => {
    updateData((prev) => ({
      ...prev,
      expenseCategories: prev.expenseCategories.map((cat) =>
        cat.id === catId
          ? {
              ...cat,
              items: cat.items.map((item) =>
                item.id === itemId ? { ...item, adjustments: { ...(item.adjustments || {}), [month]: value } } : item
              ),
            }
          : cat
      ),
    }));
  };

  const renameExpenseItem = (catId: string, itemId: string, label: string) => {
    updateData((prev) => ({
      ...prev,
      expenseCategories: prev.expenseCategories.map((cat) =>
        cat.id === catId
          ? { ...cat, items: cat.items.map((item) => (item.id === itemId ? { ...item, label } : item)) }
          : cat
      ),
    }));
  };

  // Expense Categories
  const addExpenseCategory = () => {
    const name = prompt('Nom de la catégorie:');
    if (!name) return;
    const id = `expcat_${name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;
    updateData((prev) => ({
      ...prev,
      expenseCategories: [...prev.expenseCategories, { id, label: name, items: [], isProtected: false }],
    }));
  };

  const deleteExpenseCategory = (catId: string) => {
    const cat = data?.expenseCategories.find((c) => c.id === catId);
    if (cat?.isProtected) {
      alert('Cette catégorie est protégée.');
      return;
    }
    if (!confirm('Supprimer cette catégorie ?')) return;
    updateData((prev) => ({
      ...prev,
      expenseCategories: prev.expenseCategories.filter((c) => c.id !== catId),
    }));
  };

  const renameExpenseCategory = (catId: string, label: string) => {
    updateData((prev) => ({
      ...prev,
      expenseCategories: prev.expenseCategories.map((cat) => (cat.id === catId ? { ...cat, label } : cat)),
    }));
  };

  // Reductions & Taxes
  const updateReduction = (field: 'salesReturns' | 'salesDiscounts' | 'costOfGoodsSold', month: string, value: number) => {
    updateData((prev) => ({
      ...prev,
      reductions: { ...prev.reductions, [field]: { ...prev.reductions[field], [month]: value } },
    }));
  };

  const updateTax = (field: 'tva' | 'corporateTax' | 'otherTaxes', month: string, value: number) => {
    const currentTaxes = data?.taxes || { tva: {}, corporateTax: {}, otherTaxes: {} };
    updateData((prev) => ({
      ...prev,
      taxes: { ...currentTaxes, [field]: { ...currentTaxes[field], [month]: value } },
    }));
  };

  // Product Rules
  const addProductRule = (catId: string, productId: string, rule: Omit<ProductRule, 'id'>) => {
    const ruleId = `rule_${Date.now()}`;
    updateData((prev) => ({
      ...prev,
      productCategories: prev.productCategories.map((cat) =>
        cat.id === catId
          ? {
              ...cat,
              products: cat.products.map((p) =>
                p.id === productId ? { ...p, rules: [...(p.rules || []), { ...rule, id: ruleId }] } : p
              ),
            }
          : cat
      ),
    }));
  };

  const deleteProductRule = (catId: string, productId: string, ruleId: string) => {
    updateData((prev) => ({
      ...prev,
      productCategories: prev.productCategories.map((cat) =>
        cat.id === catId
          ? {
              ...cat,
              products: cat.products.map((p) =>
                p.id === productId ? { ...p, rules: (p.rules || []).filter((r) => r.id !== ruleId) } : p
              ),
            }
          : cat
      ),
    }));
  };

  const updateRuleMultiplier = (catId: string, productId: string, ruleId: string, multiplier: number) => {
    updateData((prev) => ({
      ...prev,
      productCategories: prev.productCategories.map((cat) =>
        cat.id === catId
          ? {
              ...cat,
              products: cat.products.map((p) =>
                p.id === productId
                  ? { ...p, rules: (p.rules || []).map((r) => (r.id === ruleId ? { ...r, multiplier } : r)) }
                  : p
              ),
            }
          : cat
      ),
    }));
  };

  // Transactions
  const addTransactions = async (catId: string, productId: string, month: string, newTxs: Transaction[]) => {
    if (!data || newTxs.length === 0) return;

    const category = data.productCategories.find(c => c.id === catId);
    const product = category?.products.find(p => p.id === productId);
    const categoryLabel = category?.label || catId;
    const productLabel = product?.label || productId;
    const totalDiscount = newTxs.reduce((sum, tx) => sum + (tx.discount || 0), 0);

    // Insert transactions into DB
    for (const tx of newTxs) {
      try {
        await dbService.createPnLTransaction({
          id: tx.id,
          clientId: tx.clientId || null,
          clientName: tx.clientName || undefined,
          productId,
          productLabel,
          categoryId: catId,
          categoryLabel,
          amount: tx.amount,
          discount: tx.discount,
          note: tx.note,
          month,
          year: selectedYear,
          isRecurring: tx.isRecurring,
        });
      } catch (err) {
        console.error('Error creating transaction:', err);
      }
    }

    updateData((prev) => ({
      ...prev,
      reductions: totalDiscount > 0
        ? {
            ...prev.reductions,
            salesDiscounts: {
              ...prev.reductions.salesDiscounts,
              [month]: (prev.reductions.salesDiscounts[month] || 0) + totalDiscount,
            },
          }
        : prev.reductions,
      productCategories: prev.productCategories.map((cat) =>
        cat.id === catId
          ? {
              ...cat,
              products: cat.products.map((p) =>
                p.id === productId
                  ? { ...p, transactions: { ...p.transactions, [month]: [...(p.transactions?.[month] || []), ...newTxs] } }
                  : p
              ),
            }
          : cat
      ),
    }));
  };

  const deleteTransaction = async (catId: string, productId: string, month: string, txId: string) => {
    const category = data?.productCategories.find((c) => c.id === catId);
    const product = category?.products.find((p) => p.id === productId);
    const transaction = product?.transactions?.[month]?.find((tx) => tx.id === txId);
    const discountToRemove = transaction?.discount || 0;

    try {
      await dbService.deletePnLTransaction(txId);
    } catch (err) {
      console.error('Error deleting transaction:', err);
    }

    updateData((prev) => ({
      ...prev,
      reductions: discountToRemove > 0
        ? {
            ...prev.reductions,
            salesDiscounts: {
              ...prev.reductions.salesDiscounts,
              [month]: Math.max(0, (prev.reductions.salesDiscounts[month] || 0) - discountToRemove),
            },
          }
        : prev.reductions,
      productCategories: prev.productCategories.map((cat) =>
        cat.id === catId
          ? {
              ...cat,
              products: cat.products.map((p) =>
                p.id === productId
                  ? { ...p, transactions: { ...p.transactions, [month]: (p.transactions?.[month] || []).filter((tx) => tx.id !== txId) } }
                  : p
              ),
            }
          : cat
      ),
    }));
  };

  // Client creation
  const createClientInDb = async (clientData: GeneratedClient): Promise<Client> => {
    const client = await dbService.createClient({
      companyId: company,
      name: clientData.name,
      email: clientData.email,
      phone: clientData.phone || undefined,
      type: clientData.type,
      status: 'active',
      currency: 'EUR',
      company: clientData.company || undefined,
      country: clientData.country || undefined,
      metadata: {
        isGenerated: clientData.isGenerated ?? true,
        generatedAt: clientData.generatedAt,
      },
    });
    setClients((prev) => [client, ...prev]);
    return client;
  };

  // Update client stats (revenue tracking)
  // Note: Database stats are auto-updated by PostgreSQL trigger on pnl_transactions
  // This function only updates local state for UI reactivity
  const updateClientStats = async (clientId: string, amount: number): Promise<void> => {
    setClients((prev) =>
      prev.map((c) =>
        c.id === clientId
          ? {
              ...c,
              totalRevenue: (c.totalRevenue || 0) + amount,
              totalTransactions: (c.totalTransactions || 0) + 1,
              lastPurchaseAt: new Date().toISOString(),
            }
          : c
      )
    );
  };

  // ============================================================
  // NAVIGATION
  // ============================================================
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

  // ============================================================
  // EDIT HELPERS
  // ============================================================
  const startEdit = (key: string, value: number | string) => {
    setEditingCell(key);
    setEditValue(String(value || ''));
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  // ============================================================
  // EXPORTS
  // ============================================================
  const exportCSV = () => {
    if (!data) return;
    const rows: string[][] = [];
    rows.push([`P&L Report - ${config.name}`, String(selectedYear)]);
    // ... (CSV generation logic)
    const csvContent = rows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `pnl_${company}_${selectedYear}.csv`;
    link.click();
  };

  const exportPDF = () => {
    if (!data) return;
    const doc = new jsPDF('landscape');
    doc.setFontSize(18);
    doc.text(`P&L Report - ${config.name} - ${selectedYear}`, 14, 22);
    doc.save(`pnl_${company}_${selectedYear}.pdf`);
  };

  // ============================================================
  // COMPUTED VALUES
  // ============================================================
  const revenue = calculations.getTotalRevenue(currentMonthKey);
  const expenses = calculations.getTotalExpenses(currentMonthKey);
  const grossProfit = calculations.getGrossProfit(currentMonthKey);
  const operatingProfit = calculations.getOperatingProfit(currentMonthKey);
  const taxes = calculations.getTotalTaxes(currentMonthKey);
  const netProfit = calculations.getNetProfit(currentMonthKey);
  const totalClientsCount = calculations.getTotalClients(currentMonthKey);
  const margin = revenue > 0 ? (netProfit / revenue) * 100 : 0;

  // ============================================================
  // RENDER
  // ============================================================
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4">
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
      <PnLHeader
        config={config}
        saving={saving}
        subscriptionCount={subscriptionHook.stats.active}
        onExportCSV={exportCSV}
        onExportPDF={exportPDF}
        onOpenSubscriptions={() => setSubscriptionsModal(true)}
      />

      <MonthNavigator
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onPrevMonth={prevMonth}
        onNextMonth={nextMonth}
      />

      <KPIGrid
        totalClients={totalClientsCount}
        ytdClients={calculations.ytd.clients}
        totalClientsInDb={clients.length}
        revenue={revenue}
        ytdRevenue={calculations.ytd.revenue}
        expenses={expenses}
        ytdExpenses={calculations.ytd.expenses}
        netProfit={netProfit}
        ytdNetProfit={calculations.ytd.netProfit}
        margin={margin}
        onOpenClients={() => setClientsModal(true)}
      />

      <PnLTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">{error}</div>
      )}

      {activeTab === 'overview' && (
        <OverviewTab
          data={data}
          selectedYear={selectedYear}
          currentMonthKey={currentMonthKey}
          chartData={calculations.chartData}
          subscriptionStats={subscriptionHook.stats}
          revenue={revenue}
          grossProfit={grossProfit}
          operatingProfit={operatingProfit}
          expenses={expenses}
          taxes={taxes}
          netProfit={netProfit}
          getCategoryRevenue={calculations.getCategoryRevenue}
          getCategoryClients={calculations.getCategoryClients}
          getExpenseCategoryTotal={calculations.getExpenseCategoryTotal}
          getCalculatedDiscounts={calculations.getCalculatedDiscounts}
          editingCell={editingCell}
          editValue={editValue}
          onStartEdit={startEdit}
          onCancelEdit={cancelEdit}
          onEditValueChange={setEditValue}
          onUpdateReduction={updateReduction}
          onUpdateTax={updateTax}
          onOpenSubscriptions={() => setSubscriptionsModal(true)}
        />
      )}

      {activeTab === 'products' && (
        <ProductsTab
          data={data}
          currentMonthKey={currentMonthKey}
          getCategoryRevenue={calculations.getCategoryRevenue}
          getCategoryClients={calculations.getCategoryClients}
          getProductRevenue={calculations.getProductRevenue}
          getTransactionsCount={calculations.getTransactionsCount}
          editingCell={editingCell}
          editValue={editValue}
          onStartEdit={startEdit}
          onCancelEdit={cancelEdit}
          onEditValueChange={setEditValue}
          onAddProduct={addProduct}
          onDeleteProduct={deleteProduct}
          onUpdateProductPrice={updateProductPrice}
          onRenameProduct={renameProduct}
          onAddProductCategory={addProductCategory}
          onDeleteProductCategory={deleteProductCategory}
          onRenameProductCategory={renameProductCategory}
          onOpenTransactionsModal={(catId, catLabel, productId) =>
            setTransactionsModal({ catId, catLabel, productId })
          }
          onOpenRulesModal={(catId, product) => setRulesModal({ catId, product })}
        />
      )}

      {activeTab === 'expenses' && (
        <ExpensesTab
          data={data}
          currentMonthKey={currentMonthKey}
          getExpenseCategoryTotal={calculations.getExpenseCategoryTotal}
          getExpenseItemTotal={calculations.getExpenseItemTotal}
          getAutoQuantity={calculations.getAutoQuantity}
          editingCell={editingCell}
          editValue={editValue}
          onStartEdit={startEdit}
          onCancelEdit={cancelEdit}
          onEditValueChange={setEditValue}
          onAddExpenseItem={addExpenseItem}
          onDeleteExpenseItem={deleteExpenseItem}
          onUpdateExpenseUnitPrice={updateExpenseUnitPrice}
          onUpdateExpenseQuantity={updateExpenseQuantity}
          onUpdateExpenseAdjustment={updateExpenseAdjustment}
          onRenameExpenseItem={renameExpenseItem}
          onAddExpenseCategory={addExpenseCategory}
          onDeleteExpenseCategory={deleteExpenseCategory}
          onRenameExpenseCategory={renameExpenseCategory}
        />
      )}

      {activeTab === 'annual' && (
        <AnnualTab
          data={data}
          getTotalRevenue={calculations.getTotalRevenue}
          getTotalReductions={calculations.getTotalReductions}
          getGrossProfit={calculations.getGrossProfit}
          getTotalExpenses={calculations.getTotalExpenses}
          getOperatingProfit={calculations.getOperatingProfit}
          getTotalTaxes={calculations.getTotalTaxes}
          getNetProfit={calculations.getNetProfit}
          getCategoryRevenue={calculations.getCategoryRevenue}
          getExpenseCategoryTotal={calculations.getExpenseCategoryTotal}
          getCalculatedDiscounts={calculations.getCalculatedDiscounts}
          ytd={calculations.ytd}
        />
      )}

      {/* Modals */}
      {rulesModal && data && (
        <RulesModal
          isOpen={!!rulesModal}
          catId={rulesModal.catId}
          product={rulesModal.product}
          expenseCategories={data.expenseCategories}
          onClose={() => setRulesModal(null)}
          onAddRule={(catId, productId, rule) => {
            addProductRule(catId, productId, rule);
            const newRule: ProductRule = { id: `rule_${Date.now()}`, ...rule };
            setRulesModal({
              ...rulesModal,
              product: { ...rulesModal.product, rules: [...(rulesModal.product.rules || []), newRule] },
            });
          }}
          onDeleteRule={(catId, productId, ruleId) => {
            deleteProductRule(catId, productId, ruleId);
            setRulesModal({
              ...rulesModal,
              product: { ...rulesModal.product, rules: rulesModal.product.rules?.filter((r) => r.id !== ruleId) },
            });
          }}
          onUpdateRuleMultiplier={(catId, productId, ruleId, multiplier) => {
            updateRuleMultiplier(catId, productId, ruleId, multiplier);
            setRulesModal({
              ...rulesModal,
              product: {
                ...rulesModal.product,
                rules: rulesModal.product.rules?.map((r) => (r.id === ruleId ? { ...r, multiplier } : r)),
              },
            });
          }}
          getExpenseItem={calculations.getExpenseItem}
          getExpenseItemLabel={calculations.getExpenseItemLabel}
        />
      )}

      {transactionsModal && modalProduct && (
        <TransactionsModal
          isOpen={!!transactionsModal}
          catId={transactionsModal.catId}
          catLabel={transactionsModal.catLabel}
          product={modalProduct}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          currentMonthKey={currentMonthKey}
          companyId={company}
          clients={clients}
          loadingClients={loadingClients}
          onClose={() => setTransactionsModal(null)}
          onAddTransaction={addTransactions}
          onDeleteTransaction={deleteTransaction}
          onCreateClient={createClientInDb}
          onUpdateClientStats={updateClientStats}
          onCreateSubscription={async (data) => { await subscriptionHook.createSubscription(data); }}
          getTransactionsCount={calculations.getTransactionsCount}
          getTransactionsRevenue={calculations.getTransactionsRevenue}
        />
      )}

      {subscriptionsModal && (
        <SubscriptionsModal
          isOpen={subscriptionsModal}
          onClose={() => setSubscriptionsModal(false)}
          subscriptions={subscriptionHook.subscriptions}
          stats={subscriptionHook.stats}
          loading={subscriptionHook.loading}
          deleting={subscriptionHook.deleting}
          deleteProgress={subscriptionHook.deleteProgress}
          hasMore={subscriptionHook.hasMore}
          totalCount={subscriptionHook.totalCount}
          onLoadMore={subscriptionHook.loadMore}
          onPause={subscriptionHook.pauseSubscription}
          onResume={subscriptionHook.resumeSubscription}
          onCancel={subscriptionHook.cancelSubscription}
          onDelete={subscriptionHook.deleteSubscription}
          onDeleteAll={subscriptionHook.deleteAllSubscriptions}
          onUpdate={subscriptionHook.updateSubscription}
        />
      )}

      {clientsModal && (
        <ClientsModal
          isOpen={clientsModal}
          onClose={() => setClientsModal(false)}
          companyId={company}
        />
      )}
    </div>
  );
}
