// /workspaces/website/apps/web/utils/formatNumber.ts
// Description: Consistent number formatting to prevent hydration errors
// Last modified: 2025-08-26
// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

/**
 * Format a number consistently between server and client
 * Avoids hydration errors caused by locale differences
 */
export function formatNumber(value: number | string): string {
  // Convert to number if it's a string
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  // Return as-is if not a valid number
  if (isNaN(num)) {
    return String(value);
  }
  
  // Use a simple formatting that's consistent everywhere
  // No locale-specific formatting to avoid SSR/CSR mismatch
  if (num >= 1000) {
    // Add comma separators manually for thousands
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  
  return num.toString();
}

/**
 * Format currency consistently
 */
export function formatCurrency(value: number, currency: string = '€'): string {
  return `${formatNumber(value)}${currency}`;
}

/**
 * Format percentage consistently
 */
export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}