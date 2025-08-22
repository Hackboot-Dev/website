'use client';
// /workspaces/website/apps/web/components/animations/PageTransition.tsx
// Description: Composant pour les transitions de page fluides
// Last modified: 2025-08-16
// Related docs: /docs/JOURNAL.md

// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionKey, setTransitionKey] = useState(0);

  useEffect(() => {
    setIsTransitioning(true);
    setTransitionKey(prev => prev + 1);

    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {/* Overlay de transition */}
      <div
        className={`fixed inset-0 z-50 pointer-events-none transition-all duration-500 ease-in-out ${
          isTransitioning 
            ? 'opacity-100 scale-100' 
            : 'opacity-0 scale-105'
        }`}
      >
        {/* Rideau liquide */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-darker">
          <div className="absolute inset-0 bg-grid opacity-20"></div>
          
          {/* Vagues animées */}
          <div className="absolute bottom-0 left-0 right-0 h-32">
            <svg viewBox="0 0 1200 120" className="w-full h-full">
              <path
                d="M0,60 C300,120 600,0 900,60 C1050,90 1150,30 1200,60 L1200,120 L0,120 Z"
                fill="rgba(99, 102, 241, 0.3)"
                className="animate-pulse"
              />
              <path
                d="M0,80 C300,20 600,100 900,40 C1050,10 1150,70 1200,40 L1200,120 L0,120 Z"
                fill="rgba(79, 70, 229, 0.2)"
                style={{ animationDelay: '0.5s' }}
                className="animate-pulse"
              />
            </svg>
          </div>

          {/* Particules flottantes */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full opacity-30"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float-gentle ${3 + Math.random() * 4}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              />
            ))}
          </div>

          {/* Loading spinner central */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Cercle externe */}
              <div className="w-16 h-16 border-4 border-white/20 rounded-full animate-spin border-t-white"></div>
              
              {/* Cercle interne */}
              <div className="absolute inset-2 w-12 h-12 border-2 border-white/30 rounded-full animate-spin border-b-white/80" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              
              {/* Point central */}
              <div className="absolute inset-6 w-4 h-4 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Texte de chargement */}
          <div className="absolute bottom-32 left-0 right-0 text-center">
            <div className="text-white font-medium text-lg mb-2">
              Chargement en cours...
            </div>
            <div className="flex justify-center space-x-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-white rounded-full animate-pulse"
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '1.5s'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contenu de la page avec animation */}
      <div
        key={transitionKey}
        className={`transition-all duration-700 ease-out ${
          isTransitioning
            ? 'opacity-0 translate-y-8 scale-95'
            : 'opacity-100 translate-y-0 scale-100'
        }`}
      >
        {children}
      </div>
    </>
  );
}

// Hook pour déclencher des animations de sortie
export function usePageTransition() {
  const [isLeaving, setIsLeaving] = useState(false);

  const triggerExit = () => {
    setIsLeaving(true);
    return new Promise(resolve => {
      setTimeout(resolve, 300);
    });
  };

  return {
    isLeaving,
    triggerExit,
    exitStyles: {
      opacity: isLeaving ? 0 : 1,
      transform: isLeaving ? 'translateY(-20px) scale(0.95)' : 'translateY(0) scale(1)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }
  };
}