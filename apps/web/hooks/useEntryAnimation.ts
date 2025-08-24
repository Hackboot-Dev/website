'use client';
// /workspaces/website/apps/web/hooks/useEntryAnimation.ts
// Description: Hook pour animations d'entrée au chargement de page
// Last modified: 2025-08-16
// Related docs: /docs/JOURNAL.md

// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

import { useEffect, useRef, useState } from 'react';

interface EntryAnimationOptions {
  delay?: number;
  duration?: number;
  easing?: string;
}

export function useEntryAnimation(options: EntryAnimationOptions = {}) {
  const {
    delay = 0,
    duration = 800,
    easing = 'cubic-bezier(0.16, 1, 0.3, 1)'
  } = options;

  const elementRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animation d'entrée au chargement avec délai
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return {
    elementRef,
    isVisible,
    style: {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0px)' : 'translateY(30px)',
      transition: `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`,
    }
  };
}

export function useStaggerEntry(itemsCount: number, staggerDelay: number = 100, initialDelay: number = 0, resetKey?: string) {
  const [visibleItems, setVisibleItems] = useState<boolean[]>([]);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    // Nettoyer les timeouts précédents
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current = [];

    // Réinitialiser avec le nouveau nombre d'items
    setVisibleItems(new Array(itemsCount).fill(false));

    if (itemsCount === 0) return;

    // Démarrer après le délai initial
    const initialTimeout = setTimeout(() => {
      // Révélation progressive des items
      Array.from({ length: itemsCount }, (_, i) => {
        const timeout = setTimeout(() => {
          setVisibleItems(prev => {
            const newState = [...prev];
            newState[i] = true;
            return newState;
          });
        }, i * staggerDelay);
        timeoutsRef.current.push(timeout);
      });
    }, initialDelay);
    
    timeoutsRef.current.push(initialTimeout);

    return () => {
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      timeoutsRef.current = [];
    };
  }, [itemsCount, staggerDelay, initialDelay, resetKey]);

  return { visibleItems };
}