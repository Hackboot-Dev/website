// /workspaces/website/apps/web/app/[locale]/admin/pnl/hooks/usePnLData.ts
// Description: Hook for P&L data loading, saving, and caching - Supabase version
// Last modified: 2025-01-10
// Migrated from Firebase to Supabase

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../../../../../lib/supabase';
import type {
  PnLData,
  ProductCategory,
  Product,
  Transaction,
  CompanyId,
  CompanyConfig,
} from '../types';
import { COMPANY_CONFIG } from '../types';
import { generateRandomClient } from '../../../../../lib/utils/clientGenerator';

// ============================================================
// CACHE CONSTANTS
// ============================================================

const CATALOGUE_CACHE_KEY = 'catalogue_cache';
const CATALOGUE_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// ============================================================
// HELPERS
// ============================================================

const generateTransactions = (
  counts: Record<string, number>,
  price: number
): Record<string, Transaction[]> => {
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

// ============================================================
// DEFAULT DATA (Hackboot)
// ============================================================

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
  reductions: {
    salesReturns: { jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
    salesDiscounts: { jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
    costOfGoodsSold: { jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
  },
  expenseCategories: [
    {
      id: 'employee',
      label: 'Employés',
      isProtected: true,
      items: [
        { id: 'emp_luf', label: 'Luf', type: 'Freelance', unitPrice: 0, quantity: {}, adjustments: { jan: 4000, feb: 4000, mar: 4000, apr: 4000, may: 4000, jun: 4000, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 } },
        { id: 'emp_gengis', label: 'Gengis', unitPrice: 0, quantity: {}, adjustments: {} },
      ],
    },
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
  taxes: {
    tva: { jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
    corporateTax: { jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
    otherTaxes: { jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
  },
});

const getEmptyData = (year: number): PnLData => ({
  year,
  productCategories: [],
  reductions: { salesReturns: {}, salesDiscounts: {}, costOfGoodsSold: {} },
  expenseCategories: [],
  taxes: { tva: {}, corporateTax: {}, otherTaxes: {} },
  updatedAt: new Date().toISOString(),
});

// ============================================================
// HOOK: usePnLData
// ============================================================

type UsePnLDataOptions = {
  company: CompanyId;
  year: number;
};

type UsePnLDataReturn = {
  // State
  data: PnLData | null;
  setData: React.Dispatch<React.SetStateAction<PnLData | null>>;
  loading: boolean;
  saving: boolean;
  syncing: boolean;
  error: string | null;
  hasChanges: boolean;
  setHasChanges: React.Dispatch<React.SetStateAction<boolean>>;
  lastSynced: Date | null;

  // Actions
  saveData: () => Promise<void>;
  syncData: () => Promise<void>;

  // Config
  config: CompanyConfig;
};

export function usePnLData({ company, year }: UsePnLDataOptions): UsePnLDataReturn {
  const config = COMPANY_CONFIG[company];
  const cacheKey = `pnl_cache_${company}_${year}`;

  // State
  const [data, setData] = useState<PnLData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  // Load catalogue from Supabase (for VMCloud)
  const loadCatalogue = useCallback(async (): Promise<ProductCategory[]> => {
    // Check cache first
    const cached = localStorage.getItem(CATALOGUE_CACHE_KEY);
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
      const { data: categories, error: catError } = await supabase
        .from('product_categories')
        .select('*')
        .eq('company_id', 'vmcloud')
        .order('sort_order');

      if (catError) throw catError;

      // Load products from Supabase
      const { data: products, error: prodError } = await supabase
        .from('products')
        .select('*')
        .eq('company_id', 'vmcloud')
        .eq('status', 'active');

      if (prodError) throw prodError;

      // Group products by category
      type CategoryRow = { id: string; name: string; sort_order: number };
      type ProductRow = { id: string; name: string; category_id: string | null; unit_price: number };
      const result: ProductCategory[] = (categories || []).map((cat: CategoryRow) => ({
        id: cat.id,
        label: cat.name,
        isFromCatalogue: true,
        products: (products || [])
          .filter((p: ProductRow) => p.category_id === cat.id)
          .map((p: ProductRow) => ({
            id: p.id,
            label: p.name,
            price: p.unit_price || 0,
            transactions: {},
          })),
      }));

      // Cache the result
      localStorage.setItem(CATALOGUE_CACHE_KEY, JSON.stringify({
        data: result.map(c => ({
          id: c.id,
          name: c.label,
          products: c.products.map(p => ({ id: p.id, name: p.label, monthly: p.price })),
        })),
        timestamp: new Date().toISOString(),
      }));

      return result;
    } catch (err) {
      console.error('Error loading catalogue:', err);
      return [];
    }
  }, []);

  // Merge catalogue with existing P&L data
  const mergeCatalogueWithPnL = useCallback(
    (pnlData: PnLData, catalogueCategories: ProductCategory[]): PnLData => {
      const mergedCategories: ProductCategory[] = [];

      for (const catCat of catalogueCategories) {
        const existingCat = pnlData.productCategories.find((c) => c.id === catCat.id);

        if (existingCat) {
          const mergedProducts: Product[] = [];

          for (const catProd of catCat.products) {
            const existingProd = existingCat.products.find((p) => p.id === catProd.id);
            if (existingProd) {
              mergedProducts.push({
                ...existingProd,
                label: catProd.label,
                price: catProd.price,
              });
            } else {
              mergedProducts.push(catProd);
            }
          }

          for (const existingProd of existingCat.products) {
            if (!catCat.products.find((p) => p.id === existingProd.id)) {
              const hasTransactions = Object.values(existingProd.transactions).some((t) => t.length > 0);
              if (hasTransactions) {
                mergedProducts.push({
                  ...existingProd,
                  label: `${existingProd.label} (archivé)`,
                });
              }
            }
          }

          mergedCategories.push({ ...catCat, products: mergedProducts });
        } else {
          mergedCategories.push(catCat);
        }
      }

      for (const existingCat of pnlData.productCategories) {
        if (!catalogueCategories.find((c) => c.id === existingCat.id)) {
          if (existingCat.isFromCatalogue) {
            const hasTransactions = existingCat.products.some((p) =>
              Object.values(p.transactions).some((t) => t.length > 0)
            );
            if (hasTransactions) {
              mergedCategories.push({
                ...existingCat,
                label: existingCat.label.includes('(archivé)') ? existingCat.label : `${existingCat.label} (archivé)`,
                isFromCatalogue: false,
              });
            }
          } else {
            mergedCategories.push(existingCat);
          }
        }
      }

      return { ...pnlData, productCategories: mergedCategories };
    },
    []
  );

  // Load data from Supabase
  const loadData = useCallback(
    async (forceSync = false) => {
      if (forceSync) {
        localStorage.removeItem(cacheKey);
      }

      let pnlData: PnLData | null = null;
      let fromCache = false;

      // Try cache first (if not forcing sync)
      if (!forceSync) {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          try {
            const { data: cachedData, timestamp } = JSON.parse(cached);
            pnlData = cachedData;
            fromCache = true;
            setLastSynced(new Date(timestamp));
          } catch { /* Invalid cache */ }
        }
      }

      // Load from Supabase if no cache
      if (!pnlData) {
        try {
          setLoading(true);
          if (forceSync) setSyncing(true);

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data: dbData, error: dbError } = await (supabase as any)
            .from('pnl_data')
            .select('*')
            .eq('company_id', company)
            .eq('year', year)
            .single();

          if (dbError && dbError.code !== 'PGRST116') { // PGRST116 = no rows returned
            throw dbError;
          }

          if (dbData?.data) {
            pnlData = dbData.data as PnLData;
          }
        } catch (err) {
          console.error('Error loading from Supabase:', err);
          setError('Erreur de chargement');
          setData(company === 'hackboot' ? getDefaultData(year) : getEmptyData(year));
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
          newData = company === 'hackboot' ? getDefaultData(year) : getEmptyData(year);
        }

        // For VMCloud, merge with catalogue
        if (company === 'vmcloud') {
          const catalogueCategories = await loadCatalogue();
          newData = mergeCatalogueWithPnL(newData, catalogueCategories);
        }

        setData(newData);
        setError(null);
        setHasChanges(false);

        // Cache the data
        if (!fromCache) {
          const now = new Date();
          const dataToCache =
            company === 'vmcloud'
              ? { ...newData, productCategories: newData.productCategories.filter((c) => !c.isFromCatalogue) }
              : newData;
          localStorage.setItem(cacheKey, JSON.stringify({ data: dataToCache, timestamp: now.toISOString() }));
          setLastSynced(now);
        }
      } catch (err) {
        console.error('Error loading:', err);
        setError('Erreur de chargement');
        setData(company === 'hackboot' ? getDefaultData(year) : getEmptyData(year));
      } finally {
        setLoading(false);
        setSyncing(false);
      }
    },
    [year, cacheKey, company, loadCatalogue, mergeCatalogueWithPnL]
  );

  // Save data to Supabase
  const saveData = useCallback(async () => {
    if (!data) return;

    try {
      setSaving(true);
      const updatedData = { ...data, updatedAt: new Date().toISOString() };
      const docId = `${company}_${year}`;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: upsertError } = await (supabase as any)
        .from('pnl_data')
        .upsert({
          id: docId,
          company_id: company,
          year: year,
          data: updatedData,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'company_id,year',
        });

      if (upsertError) throw upsertError;

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
  }, [data, company, year, cacheKey]);

  // Sync data (force refresh)
  const syncData = useCallback(() => loadData(true), [loadData]);

  // Initial load
  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    setData,
    loading,
    saving,
    syncing,
    error,
    hasChanges,
    setHasChanges,
    lastSynced,
    saveData,
    syncData,
    config,
  };
}

export default usePnLData;
