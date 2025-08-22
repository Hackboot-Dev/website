'use client';
// /workspaces/website/apps/web/components/animations/AnimatedStats.tsx
// Description: Composant de statistiques avec compteurs animés
// Last modified: 2025-08-16
// Related docs: /docs/JOURNAL.md

// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

import { useAnimatedCounter, useScrollAnimation } from '../../hooks/useScrollAnimation';

interface StatItemProps {
  value: number;
  suffix?: string;
  label: string;
  decimals?: number;
  delay?: number;
}

function StatItem({ value, suffix = '', label, decimals = 0, delay = 0 }: StatItemProps) {
  const { elementRef, count } = useAnimatedCounter(value, 2000 + delay);
  const { scaleInStyles } = useScrollAnimation({ 
    threshold: 0.3,
    triggerOnce: true 
  });

  const formatValue = (num: number) => {
    if (decimals > 0) {
      return (num / Math.pow(10, decimals)).toFixed(1);
    }
    return num.toString();
  };

  return (
    <div 
      ref={elementRef}
      className="text-center group"
      style={scaleInStyles}
    >
      <div className="relative">
        <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
          {formatValue(count)}{suffix}
        </div>
        {/* Effet de lueur au survol */}
        <div className="absolute inset-0 bg-primary/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
        {label}
      </div>
    </div>
  );
}

export default function AnimatedStats() {
  const { elementRef, fadeInStyles } = useScrollAnimation({ 
    threshold: 0.2,
    triggerOnce: true 
  });

  return (
    <div 
      ref={elementRef}
      className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
      style={fadeInStyles}
    >
      <StatItem
        value={999}
        suffix="%"
        label="Uptime garanti"
        decimals={1}
        delay={0}
      />
      <StatItem
        value={10000}
        suffix="+"
        label="Serveurs actifs"
        delay={200}
      />
      <StatItem
        value={5}
        label="Datacenters"
        delay={400}
      />
      <StatItem
        value={247}
        label="Support 24/7"
        delay={600}
      />
    </div>
  );
}