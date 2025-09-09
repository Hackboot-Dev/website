// /workspaces/website/apps/web/hooks/useLocalizedPath.ts
// Description: Hook for generating localized paths
// Last modified: 2025-09-05
// Related docs: /docs/JOURNAL.md

// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

'use client';

import { usePathname } from 'next/navigation';

export function useLocalizedPath() {
  const pathname = usePathname();
  
  // Extract current locale from pathname
  const currentLocale = pathname.split('/')[1];
  const locales = ['fr', 'en'];
  const locale = locales.includes(currentLocale) ? currentLocale : 'fr';
  
  // Function to generate localized path
  const localizedPath = (path: string): string => {
    // If path already has a locale, return as is
    if (locales.some(l => path.startsWith(`/${l}/`) || path === `/${l}`)) {
      return path;
    }
    
    // If it's a root path, add locale
    if (path === '/') {
      return `/${locale}`;
    }
    
    // Add locale prefix to the path
    return `/${locale}${path}`;
  };
  
  return { localizedPath, locale };
}