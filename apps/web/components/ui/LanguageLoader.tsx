'use client';
// /workspaces/website/apps/web/components/ui/LanguageLoader.tsx
// Description: Loader global pour les changements de langue
// Last modified: 2025-08-16
// Related docs: /docs/JOURNAL.md

// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

import { useLanguage } from '../../contexts/LanguageContext';

export default function LanguageLoader() {
  const { isChangingLanguage } = useLanguage();

  if (!isChangingLanguage) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-zinc-950/95 backdrop-blur-md flex items-center justify-center transition-all duration-150">
      <div className="flex flex-col items-center space-y-3">
        {/* Loader élégant avec effet de vague */}
        <div className="flex space-x-1">
          <div 
            className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce" 
            style={{ animationDelay: '0ms', animationDuration: '600ms' }}
          ></div>
          <div 
            className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" 
            style={{ animationDelay: '100ms', animationDuration: '600ms' }}
          ></div>
          <div 
            className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce" 
            style={{ animationDelay: '200ms', animationDuration: '600ms' }}
          ></div>
        </div>
      </div>
    </div>
  );
}