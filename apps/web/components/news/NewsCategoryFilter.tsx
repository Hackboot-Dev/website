'use client';

// components/news/NewsCategoryFilter.tsx
// Description: Category filter component for news page
// Last modified: 2025-11-15

import { motion } from 'framer-motion';

interface Category {
  id: string;
  name: {
    en: string;
    fr: string;
  };
  color: string;
}

interface NewsCategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  locale: string;
}

export default function NewsCategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  locale,
}: NewsCategoryFilterProps) {
  const lang = locale as 'en' | 'fr';

  const categoryColors: Record<string, { bg: string; border: string; text: string }> = {
    white: {
      bg: 'bg-white/10',
      border: 'border-white/30',
      text: 'text-white',
    },
    cyan: {
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/30',
      text: 'text-cyan-500',
    },
    purple: {
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/30',
      text: 'text-purple-500',
    },
    blue: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-500',
    },
    green: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      text: 'text-green-500',
    },
  };

  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((category, index) => {
        const isSelected = selectedCategory === category.id;
        const colors = categoryColors[category.color] || categoryColors.cyan;

        return (
          <motion.button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`relative px-6 py-3 rounded-full border transition-all duration-300 ${
              isSelected
                ? `${colors.bg} ${colors.border} ${colors.text}`
                : 'bg-zinc-900/30 border-zinc-800/50 text-zinc-400 hover:bg-zinc-900/50 hover:border-zinc-700'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 font-medium text-sm">{category.name[lang]}</span>

            {/* Selected Indicator */}
            {isSelected && (
              <motion.div
                className={`absolute inset-0 rounded-full ${colors.bg} blur-xl`}
                layoutId="categoryHighlight"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
