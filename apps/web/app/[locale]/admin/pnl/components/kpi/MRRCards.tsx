// apps/web/app/[locale]/admin/pnl/components/kpi/MRRCards.tsx
// Description: MRR/ARR subscription metrics cards
// Last modified: 2025-12-19

'use client';

import { TrendingUp, Calendar, Users } from 'lucide-react';
import { formatCurrency } from '../../../_shared/utils/formatters';

type SubscriptionStats = {
  total: number;
  active: number;
  paused: number;
  cancelled: number;
  mrr: number;
  arr: number;
};

type MRRCardsProps = {
  stats: SubscriptionStats;
  onOpenSubscriptions: () => void;
};

export function MRRCards({ stats, onOpenSubscriptions }: MRRCardsProps) {
  if (stats.total === 0) return null;

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* MRR */}
      <div className="bg-zinc-900/20 border border-zinc-900 p-4">
        <div className="flex items-center gap-2 text-zinc-500 text-sm mb-1">
          <TrendingUp className="h-4 w-4 text-violet-500" />
          MRR
        </div>
        <div className="text-2xl font-light text-violet-400">{formatCurrency(stats.mrr)}</div>
        <div className="text-xs text-zinc-600 mt-1">Revenu mensuel récurrent</div>
      </div>

      {/* ARR */}
      <div className="bg-zinc-900/20 border border-zinc-900 p-4">
        <div className="flex items-center gap-2 text-zinc-500 text-sm mb-1">
          <Calendar className="h-4 w-4 text-emerald-500" />
          ARR
        </div>
        <div className="text-2xl font-light text-emerald-400">{formatCurrency(stats.arr)}</div>
        <div className="text-xs text-zinc-600 mt-1">Revenu annuel récurrent</div>
      </div>

      {/* Active subscriptions */}
      <div className="bg-zinc-900/20 border border-zinc-900 p-4">
        <div className="flex items-center gap-2 text-zinc-500 text-sm mb-1">
          <Users className="h-4 w-4 text-blue-500" />
          Abonnements actifs
        </div>
        <div className="text-2xl font-light text-white">{stats.active}</div>
        <div className="text-xs text-zinc-600 mt-1">
          {stats.paused} en pause • {stats.cancelled} annulés
        </div>
      </div>

      {/* Manage button */}
      <div className="bg-zinc-900/20 border border-zinc-900 p-4">
        <button
          onClick={onOpenSubscriptions}
          className="w-full h-full flex flex-col items-center justify-center text-zinc-400 hover:text-violet-400 transition-colors"
        >
          <Calendar className="h-6 w-6 mb-2" />
          <span className="text-sm">Gérer les abonnements</span>
        </button>
      </div>
    </div>
  );
}
