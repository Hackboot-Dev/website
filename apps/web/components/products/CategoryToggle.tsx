'use client';
// /workspaces/website/apps/web/components/products/CategoryToggle.tsx
// Description: Toggle sophistiqué pour les catégories de produits
// Last modified: 2025-08-22
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
      className={`group relative flex items-center space-x-3 px-5 py-3 rounded-xl border transition-all duration-500 overflow-hidden ${
        isActive
          ? 'bg-white text-zinc-950 border-white shadow-lg transform scale-105'
          : 'bg-zinc-900/20 backdrop-blur-sm text-zinc-400 border-zinc-800/30 hover:text-white hover:bg-zinc-800/40 hover:border-zinc-700/50 hover:transform hover:scale-102'
      }`}
    >
      {/* Glow effect pour l'état actif */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-xl"></div>
      )}
      
      {/* Shimmer effect au hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      
      <span className={`relative z-10 text-sm font-light tracking-wide transition-all duration-300 ${
        isActive ? 'font-medium' : ''
      }`}>
        {name}
      </span>
      
      <span className={`relative z-10 text-xs px-2.5 py-1 rounded-lg font-mono transition-all duration-300 ${
        isActive
          ? 'bg-zinc-950/10 text-zinc-600 shadow-sm'
          : 'bg-zinc-800/50 text-zinc-500 group-hover:bg-zinc-700/50 group-hover:text-zinc-400'
      }`}>
        {count}
      </span>
      
      {/* Indicateur subtil pour l'état actif */}
      {isActive && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-zinc-950/20 rounded-full"></div>
      )}
    </button>
  );
}