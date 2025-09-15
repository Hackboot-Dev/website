'use client';
// /workspaces/website/apps/web/components/ui/ProductsDropdown.tsx
// Description: Dropdown pour les produits dans le header
// Last modified: 2025-08-16
// Related docs: /docs/JOURNAL.md

// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

import Link from 'next/link';
import { useState, useContext } from 'react';
import { LanguageContext } from '../../contexts/LanguageContext';
import productsData from '../../data/products/base.json';

interface ProductCategory {
  name: string;
  description: string;
  subtitle: string;
  href: string;
  icon: string;
  count: number;
}

export default function ProductsDropdown() {
  const context = useContext(LanguageContext);
  const t = context ? context.t : (key: string) => key;
  const [isOpen, setIsOpen] = useState(false);
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);

  const categories: ProductCategory[] = [
    {
      name: t('products.categories.vps.name'),
      description: t('products.categories.vps.description'),
      subtitle: t('products.categories.vps.subtitle'),
      href: '/products#vps',
      icon: '🖥️',
      count: productsData.vps.length
    },
    {
      name: t('products.categories.gpu.name'),
      description: t('products.categories.gpu.description'),
      subtitle: t('products.categories.gpu.subtitle'),
      href: '/products#gpu',
      icon: '⚡',
      count: productsData.gpu.length
    },
    {
      name: t('products.categories.webhosting.name'),
      description: t('products.categories.webhosting.description'),
      subtitle: t('products.categories.webhosting.subtitle'),
      href: '/products#webhosting',
      icon: '🌐',
      count: productsData.webhosting.length
    },
    {
      name: 'Platform as a Service',
      description: 'Containers et applications managés',
      subtitle: 'Docker, Kubernetes, CI/CD',
      href: '/products#paas',
      icon: '🐳',
      count: productsData.paas.length
    },
    {
      name: 'Load Balancer',
      description: 'Répartition de charge haute disponibilité',
      subtitle: 'HTTP/HTTPS, TCP/UDP, SSL',
      href: '/products#loadbalancer',
      icon: '⚖️',
      count: productsData.loadbalancer.length
    },
    {
      name: 'Stockage',
      description: 'Solutions de stockage haute performance',
      subtitle: 'SSD, NVMe, Block Storage',
      href: '/products#storage',
      icon: '💾',
      count: productsData.storage.length
    },
    {
      name: 'CDN',
      description: 'Content Delivery Network global',
      subtitle: 'PoPs mondiaux, Cache, WAF',
      href: '/products#cdn',
      icon: '🌍',
      count: productsData.cdn.length
    }
  ];

  const handleMouseEnter = () => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsOpen(false);
    }, 150);
    setCloseTimeout(timeout);
  };

  return (
    <div 
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger */}
      <Link 
        href="/products"
        className="text-zinc-400 hover:text-white transition-colors duration-300 text-sm tracking-wide flex items-center space-x-1 relative z-[70]"
        onClick={() => setIsOpen(false)}
      >
        <span>{t('nav.products')}</span>
        <svg 
          className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </Link>

      {/* Dropdown */}
      <div className={`absolute top-full left-0 mt-2 w-[28rem] bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl transition-all duration-300 z-[60] ${
        isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'
      }`}>
        
        {/* Header */}
        <div className="p-4 border-b border-zinc-700/50">
          <h3 className="text-white font-medium text-sm tracking-wide">
            {t('products.title')}
          </h3>
          <p className="text-zinc-400 text-xs mt-1">
            {t('products.subtitle')}
          </p>
        </div>

        {/* Categories - Grid Layout */}
        <div className="p-3 grid grid-cols-2 gap-2">
          {categories.map((category, index) => (
            <Link
              key={index}
              href={category.href}
              className="block p-3 rounded-md hover:bg-zinc-800/50 transition-colors duration-200 group/item"
            >
              <div className="flex items-center space-x-2">
                <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-sm">
                  {category.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-white text-xs font-medium group-hover/item:text-zinc-100 transition-colors truncate">
                      {category.name}
                    </h4>
                    <span className="text-xs text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded-full ml-1">
                      {category.count}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-xs mt-0.5 truncate group-hover/item:text-zinc-300 transition-colors">
                    {category.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-zinc-700/50">
          <Link
            href="/products"
            className="flex items-center justify-center w-full py-2 text-sm text-zinc-300 hover:text-white transition-colors duration-200 group/footer"
          >
            <span>{t('products.viewAll')}</span>
            <svg 
              className="w-4 h-4 ml-2 group-hover/footer:translate-x-1 transition-transform duration-200" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}