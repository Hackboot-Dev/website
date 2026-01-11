// apps/web/app/[locale]/admin/clients/constants/index.ts
// Description: Clients module constants
// Last modified: 2025-12-19

import { User, Building2 } from 'lucide-react';
import type { ClientStatus, ClientType } from '../types';

export const STATUS_CONFIG: Record<ClientStatus, { label: string; color: string; bgColor: string }> = {
  lead: { label: 'Lead', color: 'text-blue-400', bgColor: 'bg-blue-500/10 border-blue-500/30' },
  active: { label: 'Actif', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10 border-emerald-500/30' },
  inactive: { label: 'Inactif', color: 'text-zinc-400', bgColor: 'bg-zinc-500/10 border-zinc-500/30' },
  churned: { label: 'Churned', color: 'text-red-400', bgColor: 'bg-red-500/10 border-red-500/30' },
};

export const TYPE_CONFIG: Record<ClientType, { label: string; icon: typeof User }> = {
  individual: { label: 'Particulier', icon: User },
  business: { label: 'Entreprise', icon: Building2 },
  enterprise: { label: 'Grand Compte', icon: Building2 },
};

export const SEARCH_DEBOUNCE_MS = 300;
export const RECENT_CLIENTS_LIMIT = 20;
