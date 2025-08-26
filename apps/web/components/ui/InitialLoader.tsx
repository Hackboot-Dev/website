// /workspaces/website/apps/web/components/ui/InitialLoader.tsx
// Description: Initial loader that only shows on first page load (not on client-side navigation)
// Last modified: 2025-08-26
// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function InitialLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check if this is the first load (not from navigation)
    const isFirstLoad = sessionStorage.getItem('hasNavigated') === null;
    
    if (isFirstLoad) {
      setIsInitialLoad(true);
      setIsLoading(true);
      
      // Mark that we've navigated
      sessionStorage.setItem('hasNavigated', 'true');
      
      // Hide loader after 800ms
      const timer = setTimeout(() => {
        setIsLoading(false);
        // Remove loader from DOM after fade out
        setTimeout(() => {
          setIsInitialLoad(false);
        }, 300);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, []);

  // Don't render anything if not initial load
  if (!isInitialLoad) return null;

  return (
    <div 
      className={`fixed inset-0 bg-zinc-950 z-[9999] flex items-center justify-center transition-opacity duration-300 ${
        isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Spinner */}
      <div className="relative">
        <div className="w-12 h-12 border-2 border-zinc-800 border-t-white/80 rounded-full animate-spin"></div>
      </div>
    </div>
  );
}