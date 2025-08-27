'use client';

// /workspaces/website/apps/web/components/ui/Icons.tsx
// Description: Collection d'icônes SVG monochromes pour le design system
// Last modified: 2025-08-27
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

export const CheckIcon: React.FC<IconProps> = ({ className = '', size = 'md' }) => (
  <svg 
    className={`icon ${size === 'sm' ? 'icon-sm' : ''} ${className}`}
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <polyline points="20,6 9,17 4,12"/>
  </svg>
);

export const ClockIcon: React.FC<IconProps> = ({ className = '', size = 'md' }) => (
  <svg 
    className={`icon ${size === 'sm' ? 'icon-sm' : ''} ${className}`}
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

export const CalendarIcon: React.FC<IconProps> = ({ className = '', size = 'md' }) => (
  <svg 
    className={`icon ${size === 'sm' ? 'icon-sm' : ''} ${className}`}
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

export const TrophyIcon: React.FC<IconProps> = ({ className = '', size = 'md' }) => (
  <svg 
    className={`icon ${size === 'sm' ? 'icon-sm' : ''} ${className}`}
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
    <path d="M4 22h16"/>
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
  </svg>
);

export const SearchIcon: React.FC<IconProps> = ({ className = '', size = 'md' }) => (
  <svg 
    className={`icon ${size === 'sm' ? 'icon-sm' : ''} ${className}`}
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
);

export const TicketIcon: React.FC<IconProps> = ({ className = '', size = 'md' }) => (
  <svg 
    className={`icon ${size === 'sm' ? 'icon-sm' : ''} ${className}`}
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>
    <path d="M13 5v2"/>
    <path d="M13 17v2"/>
    <path d="M13 11v2"/>
  </svg>
);

export const ChatIcon: React.FC<IconProps> = ({ className = '', size = 'md' }) => (
  <svg 
    className={`icon ${size === 'sm' ? 'icon-sm' : ''} ${className}`}
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path d="m7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
  </svg>
);

export const MailIcon: React.FC<IconProps> = ({ className = '', size = 'md' }) => (
  <svg 
    className={`icon ${size === 'sm' ? 'icon-sm' : ''} ${className}`}
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-10 5L2 7"/>
  </svg>
);

export const PhoneIcon: React.FC<IconProps> = ({ className = '', size = 'md' }) => (
  <svg 
    className={`icon ${size === 'sm' ? 'icon-sm' : ''} ${className}`}
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

export const StarIcon: React.FC<IconProps> = ({ className = '', size = 'md' }) => (
  <svg 
    className={`icon ${size === 'sm' ? 'icon-sm' : ''} ${className}`}
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

export const ExternalLinkIcon: React.FC<IconProps> = ({ className = '', size = 'md' }) => (
  <svg 
    className={`icon ${size === 'sm' ? 'icon-sm' : ''} ${className}`}
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
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

export const Icons = {
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
  Check: CheckIcon,
  Clock: ClockIcon,
  Calendar: CalendarIcon,
  Trophy: TrophyIcon,
  Search: SearchIcon,
  Ticket: TicketIcon,
  Chat: ChatIcon,
  Mail: MailIcon,
  Phone: PhoneIcon,
  Star: StarIcon,
  ExternalLink: ExternalLinkIcon,
  getCategoryIcon
};

export default Icons;