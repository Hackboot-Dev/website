// apps/web/app/[locale]/admin/pnl/components/layout/MonthNavigator.tsx
// Description: Month/year navigation component
// Last modified: 2025-12-19

'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MONTHS } from '../../constants';

type MonthNavigatorProps = {
  selectedMonth: number;
  selectedYear: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
};

export function MonthNavigator({
  selectedMonth,
  selectedYear,
  onPrevMonth,
  onNextMonth,
}: MonthNavigatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="flex items-center justify-center gap-6 bg-zinc-900/20 border border-zinc-900 p-4"
    >
      <button
        onClick={onPrevMonth}
        className="p-2 hover:bg-zinc-800/50 text-zinc-400 hover:text-white transition-colors"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <div className="text-center min-w-[160px]">
        <div className="text-xl font-extralight text-white tracking-wide">
          {MONTHS[selectedMonth]} {selectedYear}
        </div>
      </div>
      <button
        onClick={onNextMonth}
        className="p-2 hover:bg-zinc-800/50 text-zinc-400 hover:text-white transition-colors"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </motion.div>
  );
}
