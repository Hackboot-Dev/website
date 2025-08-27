// /workspaces/website/apps/web/hooks/useScrollAnimation.ts
// Description: Performant scroll animation hook using Intersection Observer
// Last modified: 2025-08-27

import { useEffect, useRef, useState } from 'react';

interface ScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  animateOnce?: boolean;
}

export function useScrollAnimation(
  options: ScrollAnimationOptions = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '-50px',
    animateOnce = true
  } = options;

  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Add will-change for better performance
    element.style.willChange = 'transform, opacity';

    const observer = new IntersectionObserver(
      ([entry]) => {
        const shouldAnimate = entry.isIntersecting && (!animateOnce || !hasAnimated.current);
        
        if (shouldAnimate) {
          requestAnimationFrame(() => {
            setIsVisible(true);
            hasAnimated.current = true;
          });
        } else if (!animateOnce && !entry.isIntersecting) {
          requestAnimationFrame(() => {
            setIsVisible(false);
          });
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      // Clean up will-change
      if (element) {
        element.style.willChange = 'auto';
      }
    };
  }, [threshold, rootMargin, animateOnce]);

  return {
    elementRef,
    isVisible,
    animationClass: isVisible ? 'animate-in' : 'animate-out'
  };
}