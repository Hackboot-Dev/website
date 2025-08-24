'use client';

// /workspaces/website/apps/web/components/ui/Icons.tsx
// Description: Collection d'icônes SVG monochromes pour le design system
// Last modified: 2025-08-24
// Related docs: /docs/JOURNAL.md

// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

import React from 'react';

interface IconProps {
  className?: string;
  size?: 'sm' | 'md';
}

export const VPSIcon: React.FC<IconProps> = ({ className = '', size = 'md' }) => (
  <svg 
    className={`icon ${size === 'sm' ? 'icon-sm' : ''} ${className}`}
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
    <line x1="8" y1="21" x2="16" y2="21"/>
    <line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
);

export const GPUIcon: React.FC<IconProps> = ({ className = '', size = 'md' }) => (
  <svg 
    className={`icon ${size === 'sm' ? 'icon-sm' : ''} ${className}`}
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

export const WebHostingIcon: React.FC<IconProps> = ({ className = '', size = 'md' }) => (
  <svg 
    className={`icon ${size === 'sm' ? 'icon-sm' : ''} ${className}`}
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="m12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

export const PaaSIcon: React.FC<IconProps> = ({ className = '', size = 'md' }) => (
  <svg 
    className={`icon ${size === 'sm' ? 'icon-sm' : ''} ${className}`}
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <rect x="2" y="6" width="20" height="12" rx="2"/>
    <path d="m6 12h12"/>
    <path d="m8 18v4"/>
    <path d="m16 18v4"/>
    <path d="m6 2v4"/>
    <path d="m10 2v4"/>
    <path d="m14 2v4"/>
    <path d="m18 2v4"/>
  </svg>
);

export const LoadBalancerIcon: React.FC<IconProps> = ({ className = '', size = 'md' }) => (
  <svg 
    className={`icon ${size === 'sm' ? 'icon-sm' : ''} ${className}`}
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path d="M9 12l2 2 4-4"/>
    <path d="M21 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z"/>
    <path d="M3 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z"/>
    <path d="M12 3c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z"/>
    <path d="M12 21c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z"/>
    <path d="m8.5 8.5l7 7"/>
    <path d="m15.5 8.5l-7 7"/>
  </svg>
);

export const StorageIcon: React.FC<IconProps> = ({ className = '', size = 'md' }) => (
  <svg 
    className={`icon ${size === 'sm' ? 'icon-sm' : ''} ${className}`}
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <ellipse cx="12" cy="5" rx="9" ry="3"/>
    <path d="m3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/>
    <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/>
  </svg>
);

export const CDNIcon: React.FC<IconProps> = ({ className = '', size = 'md' }) => (
  <svg 
    className={`icon ${size === 'sm' ? 'icon-sm' : ''} ${className}`}
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="10"/>
    <path d="m12 2a7 7 0 1 0 10 10"/>
    <path d="M12 8v8"/>
    <path d="m8 12h8"/>
  </svg>
);

export const CPUIcon: React.FC<IconProps> = ({ className = '', size = 'md' }) => (
  <svg 
    className={`icon ${size === 'sm' ? 'icon-sm' : ''} ${className}`}
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <rect x="4" y="4" width="16" height="16" rx="2"/>
    <rect x="9" y="9" width="6" height="6"/>
    <line x1="9" y1="1" x2="9" y2="4"/>
    <line x1="15" y1="1" x2="15" y2="4"/>
    <line x1="9" y1="20" x2="9" y2="23"/>
    <line x1="15" y1="20" x2="15" y2="23"/>
    <line x1="20" y1="9" x2="23" y2="9"/>
    <line x1="20" y1="14" x2="23" y2="14"/>
    <line x1="1" y1="9" x2="4" y2="9"/>
    <line x1="1" y1="14" x2="4" y2="14"/>
  </svg>
);

export const RAMIcon: React.FC<IconProps> = ({ className = '', size = 'md' }) => (
  <svg 
    className={`icon ${size === 'sm' ? 'icon-sm' : ''} ${className}`}
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path d="M6 18.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-2z"/>
    <line x1="6" y1="8" x2="6" y2="18"/>
    <line x1="18" y1="8" x2="18" y2="18"/>
    <line x1="8" y1="3" x2="8" y2="8"/>
    <line x1="10" y1="3" x2="10" y2="8"/>
    <line x1="12" y1="3" x2="12" y2="8"/>
    <line x1="14" y1="3" x2="14" y2="8"/>
    <line x1="16" y1="3" x2="16" y2="8"/>
  </svg>
);

export const NetworkIcon: React.FC<IconProps> = ({ className = '', size = 'md' }) => (
  <svg 
    className={`icon ${size === 'sm' ? 'icon-sm' : ''} ${className}`}
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <circle cx="8.5" cy="8.5" r=".5"/>
    <circle cx="15.5" cy="8.5" r=".5"/>
    <circle cx="8.5" cy="15.5" r=".5"/>
    <circle cx="15.5" cy="15.5" r=".5"/>
  </svg>
);

export const ArrowRightIcon: React.FC<IconProps> = ({ className = '', size = 'md' }) => (
  <svg 
    className={`icon ${size === 'sm' ? 'icon-sm' : ''} ${className}`}
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12,5 19,12 12,19"/>
  </svg>
);

export const ChevronDownIcon: React.FC<IconProps> = ({ className = '', size = 'md' }) => (
  <svg 
    className={`icon ${size === 'sm' ? 'icon-sm' : ''} ${className}`}
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <polyline points="6,9 12,15 18,9"/>
  </svg>
);

// Helper pour obtenir l'icône par catégorie
export const getCategoryIcon = (category: string, props?: IconProps) => {
  switch (category) {
    case 'vps':
      return <VPSIcon {...props} />;
    case 'gpu':
      return <GPUIcon {...props} />;
    case 'webhosting':
      return <WebHostingIcon {...props} />;
    case 'paas':
      return <PaaSIcon {...props} />;
    case 'loadbalancer':
      return <LoadBalancerIcon {...props} />;
    case 'storage':
      return <StorageIcon {...props} />;
    case 'cdn':
      return <CDNIcon {...props} />;
    default:
      return <VPSIcon {...props} />;
  }
};

export default {
  VPS: VPSIcon,
  GPU: GPUIcon,
  WebHosting: WebHostingIcon,
  PaaS: PaaSIcon,
  LoadBalancer: LoadBalancerIcon,
  Storage: StorageIcon,
  CDN: CDNIcon,
  CPU: CPUIcon,
  RAM: RAMIcon,
  Network: NetworkIcon,
  ArrowRight: ArrowRightIcon,
  ChevronDown: ChevronDownIcon,
  getCategoryIcon
};