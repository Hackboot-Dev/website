'use client';
// /workspaces/website/apps/web/components/products/ProductCard.tsx
// Description: Carte produit avec design Awwwards
// Last modified: 2025-08-16
// Related docs: /docs/JOURNAL.md

// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface Product {
  name: string;
  usage: string;
  vcpu?: string;
  gpu?: string;
  vram?: string;
  ram?: string;
  storage?: string;
  bandwidth?: string;
  hourly?: number;
  monthly?: number;
  annual?: number;
  trial?: string | boolean;
  category: string;
  sites?: number | string;
  databases?: number | string;
  emails?: number | string;
  ssl?: string;
  performance?: string;
  interconnect?: string;
  
  // PaaS fields
  containers?: number | string;
  ram_per_container?: string;
  cpu_per_container?: string;
  deployments_per_day?: number | string;
  environments?: string;
  auto_scaling?: boolean | string;
  ci_cd?: string;
  
  // Load Balancer fields
  backends_max?: number | string;
  requests_per_sec?: string;
  ssl_tls?: string;
  protocols?: string;
  health_checks?: string;
  algorithms?: string;
  regions?: number | string;
  ddos_protection?: string;
  
  // Storage fields
  type?: string;
  iops_per_tb?: string;
  latency?: string;
  throughput?: string;
  min_size?: string;
  max_size?: string;
  snapshots?: string;
  replication?: boolean | string;
  price_per_gb_month?: number;
  
  // CDN fields
  pops?: string;
  traffic_included?: string;
  domains?: number | string;
  purge?: string;
  analytics?: string;
  waf?: boolean | string;
  image_optimization?: boolean | string;
  traffic_extra_per_gb?: number;
}

interface ProductCardProps {
  product: Product;
  pricingMode: 'monthly' | 'annual' | 'hourly';
  index: number;
}

export default function ProductCard({ product, pricingMode, index }: ProductCardProps) {
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  const getPrice = () => {
    // Pour les produits Storage qui ont un prix au GB
    if (product.price_per_gb_month && product.category === 'storage') {
      return product.price_per_gb_month;
    }
    
    // Pour les autres produits avec prix standard
    switch (pricingMode) {
      case 'hourly':
        return product.hourly;
      case 'monthly':
        return product.monthly;
      case 'annual':
        return product.annual ? Math.round(product.annual / 12) : product.monthly; // Prix mensuel équivalent
      default:
        return product.monthly;
    }
  };

  const getPriceSuffix = () => {
    // Pour les produits Storage qui ont un prix au GB
    if (product.price_per_gb_month && product.category === 'storage') {
      return '/GB/mois';
    }
    
    switch (pricingMode) {
      case 'hourly':
        return '/h';
      case 'monthly':
        return '/mois';
      case 'annual':
        return '/mois*';
      default:
        return '/mois';
    }
  };

  const getCategoryIcon = () => {
    switch (product.category) {
      case 'vps':
        return '🖥️';
      case 'gpu':
        return '⚡';
      case 'webhosting':
        return '🌐';
      case 'paas':
        return '🐳';
      case 'loadbalancer':
        return '⚖️';
      case 'storage':
        return '💾';
      case 'cdn':
        return '🌍';
      default:
        return '💻';
    }
  };

  const getCategoryColor = () => {
    switch (product.category) {
      case 'vps':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'gpu':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'webhosting':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'paas':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'loadbalancer':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'storage':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'cdn':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    }
  };

  const getMainSpecs = () => {
    const specs = [];
    
    // Specs communes
    if (product.vcpu) specs.push({ label: 'CPU', value: product.vcpu });
    if (product.gpu) specs.push({ label: 'GPU', value: product.gpu });
    if (product.ram) specs.push({ label: 'RAM', value: product.ram });
    if (product.storage) specs.push({ label: 'Storage', value: product.storage });
    
    // Specs spécifiques selon la catégorie
    switch (product.category) {
      case 'vps':
      case 'gpu':
        if (product.bandwidth) specs.push({ label: 'Bande passante', value: product.bandwidth });
        if (product.performance) specs.push({ label: 'Performance', value: product.performance });
        if (product.interconnect) specs.push({ label: 'Interconnect', value: product.interconnect });
        break;
        
      case 'webhosting':
        if (product.sites) specs.push({ label: 'Sites', value: product.sites });
        if (product.databases) specs.push({ label: 'Bases de données', value: product.databases });
        if (product.emails) specs.push({ label: 'Emails', value: product.emails });
        if (product.ssl) specs.push({ label: 'SSL', value: product.ssl });
        break;
        
      case 'paas':
        if (product.containers) specs.push({ label: 'Containers', value: product.containers });
        if (product.environments) specs.push({ label: 'Environnements', value: product.environments });
        if (product.auto_scaling) specs.push({ label: 'Auto-scaling', value: product.auto_scaling === true ? 'Oui' : product.auto_scaling });
        break;
        
      case 'loadbalancer':
        if (product.backends_max) specs.push({ label: 'Backends max', value: product.backends_max });
        if (product.requests_per_sec) specs.push({ label: 'Requêtes/sec', value: product.requests_per_sec });
        if (product.protocols) specs.push({ label: 'Protocoles', value: product.protocols });
        break;
        
      case 'storage':
        if (product.type) specs.push({ label: 'Type', value: product.type });
        if (product.iops_per_tb) specs.push({ label: 'IOPS/TB', value: product.iops_per_tb });
        if (product.latency) specs.push({ label: 'Latence', value: product.latency });
        if (product.min_size && product.max_size) specs.push({ label: 'Taille', value: `${product.min_size} - ${product.max_size}` });
        break;
        
      case 'cdn':
        if (product.pops) specs.push({ label: 'PoPs', value: product.pops });
        if (product.traffic_included) specs.push({ label: 'Trafic inclus', value: product.traffic_included });
        if (product.domains) specs.push({ label: 'Domaines', value: product.domains });
        if (product.waf) specs.push({ label: 'WAF', value: product.waf === true ? 'Inclus' : product.waf || 'Non' });
        break;
    }

    return specs.slice(0, 4); // Limite à 4 specs principales
  };

  return (
    <div
      className={`group relative bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 rounded-xl p-6 transition-all duration-500 hover:bg-zinc-900/50 hover:border-zinc-700/60 hover:shadow-xl hover:shadow-zinc-950/20 ${
        isHovered ? 'transform hover:-translate-y-2' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Category Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-mono border ${getCategoryColor()}`}>
          <span>{getCategoryIcon()}</span>
          <span>{product.category.toUpperCase()}</span>
        </div>
        
        {product.trial && (
          <div className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
            Essai {product.trial}
          </div>
        )}
      </div>

      {/* Product Name & Usage */}
      <div className="mb-4">
        <h3 className="text-lg font-light text-white mb-1 group-hover:text-zinc-100 transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors">
          {product.usage}
        </p>
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline space-x-1">
          <span className="text-2xl font-light text-white">
            {getPrice()}€
          </span>
          <span className="text-sm text-zinc-400">
            {getPriceSuffix()}
          </span>
        </div>
        
        {/* Price Explanations */}
        {pricingMode === 'annual' && product.annual && (
          <div className="mt-2 space-y-1">
            <p className="text-xs text-zinc-500">
              *payé annuellement ({product.annual}€/an)
            </p>
            {product.monthly && (
              <p className="text-xs text-emerald-400">
                💰 Économise {Math.round(((product.monthly * 12 - product.annual) / (product.monthly * 12)) * 100)}% vs mensuel
              </p>
            )}
          </div>
        )}
        
        {pricingMode === 'hourly' && product.hourly && (
          <div className="mt-2">
            <p className="text-xs text-zinc-500">
              ≈ {Math.round(product.hourly * 24 * 30)}€/mois si 24/7
            </p>
            <p className="text-xs text-blue-400">
              ⚡ Facturation à l'usage réel
            </p>
          </div>
        )}
        
        {pricingMode === 'monthly' && product.hourly && product.monthly && (
          <div className="mt-2">
            <p className="text-xs text-zinc-500">
              ≈ {product.hourly.toFixed(3)}€/heure
            </p>
            <p className="text-xs text-emerald-400">
              📅 Prix fixe, ressources garanties
            </p>
          </div>
        )}
        
        {/* Special cases for storage and CDN */}
        {product.category === 'storage' && (
          <div className="mt-2">
            <p className="text-xs text-zinc-500">
              Minimum {product.min_size}, maximum {product.max_size}
            </p>
            <p className="text-xs text-blue-400">
              💾 Stockage haute performance
            </p>
          </div>
        )}
        
        {product.category === 'cdn' && product.traffic_extra_per_gb && (
          <div className="mt-2">
            <p className="text-xs text-zinc-500">
              Trafic supplémentaire: {product.traffic_extra_per_gb}€/GB
            </p>
            <p className="text-xs text-green-400">
              🌍 Réseau global optimisé
            </p>
          </div>
        )}
      </div>

      {/* Specs */}
      <div className="space-y-3 mb-6">
        {getMainSpecs().map((spec, specIndex) => (
          <div key={specIndex} className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">{spec.label}</span>
            <span className="text-zinc-300 font-mono text-xs">{spec.value}</span>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <button className="w-full bg-white text-zinc-950 py-2.5 px-4 rounded-lg text-sm font-medium tracking-wide transition-all duration-300 hover:bg-zinc-100 hover:shadow-lg hover:shadow-white/10 group-hover:transform group-hover:scale-105">
        Choisir ce plan
      </button>

      {/* Hover Effect Line */}
      <div className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-zinc-600 to-transparent group-hover:w-full transition-all duration-500"></div>
    </div>
  );
}