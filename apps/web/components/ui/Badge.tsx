'use client';

// /workspaces/website/apps/web/components/ui/Badge.tsx
// Description: Component Badge unifié selon le design system
// Last modified: 2025-08-24
// Related docs: /docs/JOURNAL.md

// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant: 'category' | 'tier' | 'trial' | 'info';
  type?: 'vps' | 'gpu' | 'webhosting' | 'paas' | 'loadbalancer' | 'storage' | 'cdn' | 'starter' | 'pro' | 'enterprise';
  icon?: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant, 
  type, 
  icon, 
  className = '' 
}) => {
  const getVariantClasses = () => {
    if (variant === 'category' && type) {
      return `badge-category-${type}`;
    }
    if (variant === 'tier' && type) {
      return `badge-tier-${type}`;
    }
    if (variant === 'trial') {
      return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    }
    if (variant === 'info') {
      return 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30';
    }
    return '';
  };

  return (
    <div className={`badge ${getVariantClasses()} ${className}`}>
      {icon && <span className="mr-1.5">{icon}</span>}
      {children}
    </div>
  );
};

export default Badge;