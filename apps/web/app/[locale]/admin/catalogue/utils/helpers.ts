// apps/web/app/[locale]/admin/catalogue/utils/helpers.ts
// Description: Catalogue utility functions
// Last modified: 2025-12-19

import type { Product } from '../types';
import { TIER_COLORS, BASE_FIELDS, SPEC_LABELS } from '../constants';

/**
 * Get tier color classes for product tier badge
 */
export function getTierColor(tier: string): string {
  return TIER_COLORS[tier] || 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
}

/**
 * Format a spec value for display
 */
export function formatSpecValue(value: unknown): string {
  if (typeof value === 'boolean') return value ? 'Oui' : 'Non';
  if (Array.isArray(value)) return value.join(', ');
  return String(value);
}

/**
 * Get product specs (excluding base fields)
 */
export function getProductSpecs(product: Product): [string, unknown][] {
  return Object.entries(product).filter(([key]) => !BASE_FIELDS.includes(key));
}

/**
 * Get spec label (French translation if available)
 */
export function getSpecLabel(key: string): string {
  return SPEC_LABELS[key] || key;
}

/**
 * Clean a translation object (remove empty values)
 */
export function cleanTranslation<T extends Record<string, unknown>>(t: T): Partial<T> {
  const cleaned: Partial<T> = {};

  for (const [key, value] of Object.entries(t)) {
    if (typeof value === 'string' && value.trim()) {
      (cleaned as Record<string, unknown>)[key] = value;
    } else if (Array.isArray(value) && value.length > 0 && value.some(v => typeof v === 'string' && v.trim())) {
      (cleaned as Record<string, unknown>)[key] = value.filter(v => typeof v === 'string' && v.trim());
    }
  }

  return cleaned;
}

/**
 * Validate product ID format
 */
export function isValidProductId(id: string): boolean {
  return /^[a-z0-9-_]+$/.test(id);
}
