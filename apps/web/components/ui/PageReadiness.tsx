// /workspaces/website/apps/web/components/ui/PageReadiness.tsx
// Description: Component that ensures page is fully loaded before showing content
// Last modified: 2025-08-26
// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function PageReadiness() {
  const [isReady, setIsReady] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Reset readiness when route changes
    setIsReady(false);

    // Function to check if page is ready
    const checkReadiness = async () => {
      try {
        // Wait for document to be fully loaded
        if (document.readyState !== 'complete') {
          await new Promise(resolve => {
            window.addEventListener('load', resolve, { once: true });
          });
        }

        // Wait for fonts to be loaded
        if ('fonts' in document) {
          await document.fonts.ready;
        }

        // Small delay to ensure CSS is applied
        await new Promise(resolve => setTimeout(resolve, 100));

        // Mark as ready
        setIsReady(true);
        document.body.classList.add('page-ready');
        document.body.classList.remove('page-loading');
      } catch (error) {
        // In case of error, show content anyway after delay
        setTimeout(() => {
          setIsReady(true);
          document.body.classList.add('page-ready');
          document.body.classList.remove('page-loading');
        }, 500);
      }
    };

    // Start readiness check
    document.body.classList.add('page-loading');
    document.body.classList.remove('page-ready');
    checkReadiness();

    return () => {
      document.body.classList.remove('page-loading');
      document.body.classList.add('page-ready');
    };
  }, [pathname]);

  // Show a subtle loader while waiting
  if (!isReady) {
    return (
      <div className="fixed inset-0 bg-zinc-950 z-[10000] flex items-center justify-center transition-opacity duration-500">
        <div className="relative">
          {/* Simple animated loader */}
          <div className="w-12 h-12 border-2 border-zinc-800 rounded-full">
            <div className="w-full h-full border-t-2 border-white/60 rounded-full animate-spin"></div>
          </div>
          
          {/* Optional: subtle text */}
          <div className="mt-4 text-xs text-zinc-600 animate-pulse">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return null;
}