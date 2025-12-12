# Admin P&L Dashboard v2 - Feature Enhancement

## Overview
Enhancement of the P&L dashboard to match Hackboot.xlsx Excel functionality.

## New Features to Implement

### 1. Expense Item Type/Note Fields
- Add `type` field (e.g., "Freelance", "sub constant")
- Add `note` field (e.g., "t3.large", "90/user")
- Display as badges next to item names

### 2. Additional Expense Categories
New default categories:
- **Banking & Finance**: Bank Fees, Bad Debts, Interest Paid, Loan Fees, Insurance
- **Vehicle**: Gas, Maintenance, Licensing, Insurance
- **Enhanced General Business**: Depreciation, Travel, Freight, Patents, Professional Dues, Meals
- **Enhanced Taxes**: Property Tax, B&O Tax, Disbursement fees

### 3. Reductions Section (COGS)
New data structure between Revenue and Expenses:
- Sales Returns
- Sales Discounts
- Cost of Goods Sold (COGS)
- Gross Profit = Revenue - Reductions
- Net Profit = Gross Profit - Expenses

### 4. Export Functionality
- **CSV Export**: Native JS, client-side generation
- **PDF Export**: Using jspdf + jspdf-autotable

### 5. Annual View (12-Month Table)
- New tab "Vue annuelle"
- Horizontal table with Jan→Dec + YTD columns
- Rows: Revenue, Reductions, Gross Profit, Expenses by category, Net Profit
- Collapsible sections

### 6. Trend Charts (Recharts)
- Line chart: Revenue vs Expenses vs Profit over 12 months
- Placement: Overview tab
- Library: recharts (already installed)

## Technical Changes

### Types Updated
```typescript
type ExpenseItem = {
  id: string;
  label: string;
  type?: string;       // NEW
  note?: string;       // NEW
  unitPrice: number;
  quantity: Record<string, number>;
  adjustments: Record<string, number>;
};

type ReductionData = {
  salesReturns: Record<string, number>;
  salesDiscounts: Record<string, number>;
  costOfGoodsSold: Record<string, number>;
};

type PnLData = {
  year: number;
  productCategories: ProductCategory[];
  reductions: ReductionData;  // NEW
  expenseCategories: ExpenseCategory[];
  updatedAt: string;
};
```

### New Dependencies
- `recharts` - Charts library (installed)
- `jspdf` + `jspdf-autotable` - PDF export (to install)

### Files Modified
- `/apps/web/app/[locale]/admin/pnl/PnLPageClient.tsx` - Main component
- `/apps/web/package.json` - Dependencies

## Implementation Order
1. Update types (ExpenseItem with type/note, ReductionData)
2. Update getDefaultData() with new categories
3. Add Reductions section UI
4. Add export buttons (CSV, PDF)
5. Add Annual View tab
6. Add Recharts trend charts
7. Test all features

## Status
- [x] Types updated
- [x] Default categories added
- [x] Reductions section
- [x] CSV export
- [x] PDF export
- [x] Annual view tab
- [x] Trend charts

## Completed: 2025-12-11
All features implemented successfully.
