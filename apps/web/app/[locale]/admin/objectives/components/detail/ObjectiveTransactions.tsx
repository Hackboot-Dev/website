// /workspaces/website/apps/web/app/[locale]/admin/objectives/components/detail/ObjectiveTransactions.tsx
// Description: Transactions list linked to the objective
// Last modified: 2026-01-10
// COMPLETE FILE

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  ExternalLink,
  Calendar,
  Building2,
  Package,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { ObjectiveWithProgress } from '../../types';
import type { Transaction } from '../../hooks/useObjectiveDetail';

type ObjectiveTransactionsProps = {
  objective: ObjectiveWithProgress;
  transactions: Transaction[];
};

export function ObjectiveTransactions({ objective, transactions }: ObjectiveTransactionsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter transactions
  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.productName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || tx.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate totals
  const totalIncome = filteredTransactions
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);
  const totalExpenses = filteredTransactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header with Stats */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-white">Transactions liées</h3>
          <Link
            href="/admin/pnl"
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Voir dans P&L
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-zinc-800/50 rounded-lg p-4">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Total entrées</p>
            <p className="text-2xl font-semibold text-emerald-400">{formatCurrency(totalIncome)}</p>
          </div>
          <div className="bg-zinc-800/50 rounded-lg p-4">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Total sorties</p>
            <p className="text-2xl font-semibold text-red-400">{formatCurrency(totalExpenses)}</p>
          </div>
          <div className="bg-zinc-800/50 rounded-lg p-4">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Transactions</p>
            <p className="text-2xl font-semibold text-white">{filteredTransactions.length}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Rechercher une transaction..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1 bg-zinc-800/50 rounded-lg p-1">
            {(['all', 'income', 'expense'] as const).map((type) => (
              <button
                key={type}
                onClick={() => {
                  setTypeFilter(type);
                  setCurrentPage(1);
                }}
                className={`
                  px-3 py-1.5 rounded-md text-sm transition-colors
                  ${typeFilter === type
                    ? 'bg-zinc-700 text-white'
                    : 'text-zinc-400 hover:text-white'
                  }
                `}
              >
                {type === 'all' ? 'Tout' : type === 'income' ? 'Entrées' : 'Sorties'}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-2">
          {paginatedTransactions.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500">Aucune transaction trouvée.</p>
            </div>
          ) : (
            paginatedTransactions.map((tx, index) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="flex items-center gap-4 p-4 bg-zinc-800/30 hover:bg-zinc-800/50 rounded-lg transition-colors cursor-pointer"
              >
                {/* Icon */}
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center
                  ${tx.type === 'income' ? 'bg-emerald-500/20' : 'bg-red-500/20'}
                `}>
                  {tx.type === 'income' ? (
                    <ArrowUpRight className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <ArrowDownRight className="h-5 w-5 text-red-400" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{tx.description}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(tx.date)}
                    </span>
                    {tx.clientName && (
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {tx.clientName}
                      </span>
                    )}
                    {tx.productName && (
                      <span className="flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        {tx.productName}
                      </span>
                    )}
                    {tx.category && (
                      <span className="px-2 py-0.5 bg-zinc-700/50 rounded">
                        {tx.category}
                      </span>
                    )}
                  </div>
                </div>

                {/* Amount */}
                <div className="text-right">
                  <p className={`text-lg font-semibold ${tx.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-800">
            <p className="text-sm text-zinc-500">
              {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredTransactions.length)} sur {filteredTransactions.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4 text-zinc-400" />
              </button>
              <span className="text-sm text-zinc-400">
                Page {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4 text-zinc-400" />
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
