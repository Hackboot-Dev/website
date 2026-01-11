// apps/web/app/[locale]/admin/pnl/utils/defaultData.ts
// Description: Default P&L data for new companies
// Last modified: 2025-12-19

import type { PnLData, Transaction, CompanyId } from '../types';
import { generateRandomClient } from '../../../../../lib/utils/clientGenerator';

/**
 * Generate transactions from client count and price (with generated clients)
 */
export const generateTransactions = (
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

/**
 * Get empty P&L structure for a company
 */
export const getEmptyPnLData = (year: number, companyId: CompanyId): PnLData => ({
  year,
  companyId,
  productCategories: [],
  reductions: { salesReturns: {}, salesDiscounts: {}, costOfGoodsSold: {} },
  expenseCategories: [],
  taxes: { tva: {}, corporateTax: {}, otherTaxes: {} },
  updatedAt: new Date().toISOString(),
});

/**
 * Get default P&L data with sample data (for Hackboot)
 */
export const getDefaultHackbootData = (year: number): PnLData => ({
  year,
  companyId: 'hackboot',
  updatedAt: new Date().toISOString(),
  productCategories: [
    {
      id: 'packs',
      label: 'Packs Coaching',
      products: [
        {
          id: 'pack_essentiel',
          label: 'Pack Essentiel',
          price: 19.99,
          transactions: generateTransactions(
            { jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 12, oct: 49, nov: 89, dec: 132 },
            19.99
          ),
        },
        {
          id: 'pack_avantage',
          label: 'Pack Avantage',
          price: 35,
          transactions: generateTransactions(
            { jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 4, oct: 16, nov: 51, dec: 78 },
            35
          ),
        },
        {
          id: 'pack_elite',
          label: 'Pack Élite',
          price: 60,
          transactions: generateTransactions(
            { jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 7, nov: 21, dec: 34 },
            60
          ),
        },
      ],
    },
    {
      id: 'vms',
      label: 'VMs Gaming',
      products: [
        {
          id: 'vm_clash',
          label: 'VM Clash Royal',
          price: 160,
          transactions: generateTransactions(
            { jan: 23, feb: 31, mar: 12, apr: 7, may: 4, jun: 26, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
            160
          ),
        },
        {
          id: 'vm_cod',
          label: 'VM Call Of Duty',
          price: 1650,
          transactions: generateTransactions(
            { jan: 8, feb: 4, mar: 9, apr: 13, may: 3, jun: 7, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
            1650
          ),
        },
        {
          id: 'vm_overwatch',
          label: 'VM Overwatch 2',
          price: 880.4,
          transactions: generateTransactions(
            { jan: 2, feb: 1, mar: 6, apr: 4, may: 8, jun: 11, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
            880.4
          ),
        },
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
        {
          id: 'emp_luf',
          label: 'Luf',
          type: 'Freelance',
          unitPrice: 0,
          quantity: {},
          adjustments: { jan: 4000, feb: 4000, mar: 4000, apr: 4000, may: 4000, jun: 4000, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
        },
        { id: 'emp_gengis', label: 'Gengis', unitPrice: 0, quantity: {}, adjustments: {} },
      ],
    },
    {
      id: 'software',
      label: 'Software & Cloud',
      items: [
        {
          id: 'aws_clash',
          label: 'AWS - Clash Royal',
          type: 'AWS',
          note: 't3.large',
          unitPrice: 0,
          quantity: {},
          adjustments: { jan: 1377.7, feb: 1856.9, mar: 718.8, apr: 419.3, may: 239.6, jun: 1557.4, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
        },
        {
          id: 'aws_overwatch',
          label: 'AWS - Overwatch 2',
          type: 'AWS',
          note: 'g4dn.2xlarge',
          unitPrice: 0,
          quantity: {},
          adjustments: { jan: 1612.8, feb: 806.4, mar: 4838.4, apr: 3225.6, may: 6451.2, jun: 8870.4, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
        },
        {
          id: 'aws_cod',
          label: 'AWS - Call Of Duty',
          type: 'AWS',
          note: 'g4dn.2xlarge',
          unitPrice: 0,
          quantity: {},
          adjustments: { jan: 6451.2, feb: 3225.6, mar: 7257.6, apr: 10483.2, may: 2419.2, jun: 5644.8, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
        },
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

/**
 * Get default data based on company
 */
export const getDefaultData = (year: number, companyId: CompanyId = 'hackboot'): PnLData => {
  if (companyId === 'hackboot') {
    return getDefaultHackbootData(year);
  }
  return getEmptyPnLData(year, companyId);
};
