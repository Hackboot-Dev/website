'use client';
// /workspaces/website/apps/web/components/products/CategoryToggle.tsx
// Description: Toggle pour les catégories de produits
// Last modified: 2025-08-16
// Related docs: /docs/JOURNAL.md

// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

interface CategoryToggleProps {
  name: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}

export default function CategoryToggle({ name, count, isActive, onClick }: CategoryToggleProps) {
  return (
    <button
      onClick={onClick}
      className={`group flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-300 ${
        isActive
          ? 'bg-white text-zinc-950 border-white shadow-sm'
          : 'bg-zinc-900/30 text-zinc-400 border-zinc-700/50 hover:text-white hover:bg-zinc-800/50 hover:border-zinc-600'
      }`}
    >
      <span className="text-sm font-medium tracking-wide">
        {name}
      </span>
      <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${
        isActive
          ? 'bg-zinc-950/10 text-zinc-600'
          : 'bg-zinc-800 text-zinc-500 group-hover:bg-zinc-700 group-hover:text-zinc-400'
      }`}>
        {count}
      </span>
    </button>
  );
}