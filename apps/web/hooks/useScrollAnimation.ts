'use client';
// /workspaces/website/apps/web/hooks/useScrollAnimation.ts
// Description: Hook personnalisé pour les animations de scroll et parallaxe
// Last modified: 2025-08-16
// Related docs: /docs/JOURNAL.md

// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

import { useEffect, useRef, useState } from 'react';

interface ScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  parallaxSpeed?: number;
}

export function useScrollAnimation(options: ScrollAnimationOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
    parallaxSpeed = 0.5
  } = options;

  const elementRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [parallaxY, setParallaxY] = useState(0);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Intersection Observer pour détecter quand l'élément est visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.disconnect();
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    // Gestion du scroll pour l'effet parallaxe
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrollY(scrollPosition);

      // Calcul de l'effet parallaxe
      const elementTop = element.offsetTop;
      const elementHeight = element.offsetHeight;
      const windowHeight = window.innerHeight;
      
      const elementMiddle = elementTop + elementHeight / 2;
      const distanceFromCenter = scrollPosition + windowHeight / 2 - elementMiddle;
      
      setParallaxY(distanceFromCenter * parallaxSpeed);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold, rootMargin, triggerOnce, parallaxSpeed]);

  return {
    elementRef,
    isVisible,
    scrollY,
    parallaxY,
    // Styles utiles pour les animations
    fadeInStyles: {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
      transition: 'opacity 0.8s ease, transform 0.8s ease'
    },
    slideInFromLeftStyles: {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateX(0)' : 'translateX(-100px)',
      transition: 'opacity 0.8s ease, transform 0.8s ease'
    },
    slideInFromRightStyles: {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateX(0)' : 'translateX(100px)',
      transition: 'opacity 0.8s ease, transform 0.8s ease'
    },
    parallaxStyles: {
      transform: `translateY(${parallaxY}px)`
    },
    scaleInStyles: {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'scale(1)' : 'scale(0.8)',
      transition: 'opacity 0.8s ease, transform 0.8s ease'
    }
  };
}

// Hook pour les compteurs animés
export function useAnimatedCounter(endValue: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          
          // Animation du compteur
          const startTime = Date.now();
          const startValue = 0;
          
          const animate = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Fonction d'easing (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(startValue + (endValue - startValue) * easeOut);
            
            setCount(currentValue);
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [endValue, duration, isVisible]);

  return { elementRef, count };
}

// Hook pour les animations de texte révélation
export function useTextReveal(delay: number = 0) {
  const elementRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [delay]);

  const textRevealStyles = {
    overflow: 'hidden',
  };

  const innerTextStyles = {
    display: 'inline-block',
    transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
    transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  };

  return {
    elementRef,
    isVisible,
    textRevealStyles,
    innerTextStyles
  };
}