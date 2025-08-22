'use client';
// /workspaces/website/apps/web/components/products/ProductCard.tsx
// Description: Carte produit sophistiquée avec design Awwwards
// Last modified: 2025-08-22
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
      className="group relative bg-zinc-900/20 backdrop-blur-sm border border-zinc-800/30 rounded-2xl p-6 transition-all duration-700 hover:bg-zinc-900/40 hover:border-zinc-700/50 hover:shadow-2xl hover:shadow-zinc-950/30 hover:-translate-y-1 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow effect subtil */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent"></div>
      </div>
      
      {/* Header sophistiqué */}
      <div className="relative flex items-center justify-between mb-6">
        <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-light border backdrop-blur-sm ${getCategoryColor()}`}>
          <span className="text-sm">{getCategoryIcon()}</span>
          <span className="tracking-wide">{product.category.toUpperCase()}</span>
        </div>
        
        {product.trial && (
          <div className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 backdrop-blur-sm font-light">
            <span className="text-emerald-300">✨</span> Essai {product.trial}
          </div>
        )}
      </div>

      {/* Product Name & Usage */}
      <div className="relative mb-6">
        <h3 className="text-xl font-extralight text-white mb-2 group-hover:text-zinc-100 transition-all duration-500 tracking-tight">
          {product.name}
        </h3>
        <p className="text-sm text-zinc-500 group-hover:text-zinc-400 transition-all duration-500 font-light leading-relaxed">
          {product.usage}
        </p>
        
        {/* Ligne décorative */}
        <div className="absolute -left-6 top-0 w-1 h-full bg-gradient-to-b from-transparent via-zinc-700/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      </div>

      {/* Price Section Sophistiquée */}
      <div className="relative mb-8">
        <div className="flex items-baseline space-x-2 mb-3">
          <span className="text-3xl font-extralight text-white group-hover:text-zinc-100 transition-colors duration-500">
            {getPrice()}
          </span>
          <span className="text-lg font-light text-white">€</span>
          <span className="text-sm text-zinc-500 font-light tracking-wide">
            {getPriceSuffix()}
          </span>
        </div>
        
        {/* Badge d'économie ou info */}
        {pricingMode === 'annual' && product.annual && product.monthly && (
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-1 mb-2">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
            <span className="text-xs text-emerald-400 font-light">
              Économise {Math.round(((product.monthly * 12 - product.annual) / (product.monthly * 12)) * 100)}%
            </span>
          </div>
        )}
        
        {pricingMode === 'hourly' && (
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-1 mb-2">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></span>
            <span className="text-xs text-blue-400 font-light">Facturation à l'usage</span>
          </div>
        )}
        
        {pricingMode === 'monthly' && (
          <div className="inline-flex items-center space-x-2 bg-zinc-500/10 border border-zinc-500/20 rounded-lg px-3 py-1 mb-2">
            <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full"></span>
            <span className="text-xs text-zinc-400 font-light">Ressources garanties 24/7</span>
          </div>
        )}
        
        {/* Info contextuelle discrète */}
        <div className="text-xs text-zinc-500 font-light">
          {pricingMode === 'annual' && product.annual && (
            <span>Payé annuellement • {product.annual}€/an</span>
          )}
          {pricingMode === 'hourly' && product.hourly && (
            <span>≈ {Math.round(product.hourly * 24 * 30)}€/mois en continu</span>
          )}
          {pricingMode === 'monthly' && product.hourly && (
            <span>≈ {product.hourly.toFixed(3)}€/heure</span>
          )}
        </div>
      </div>

      {/* Specs Section Sophistiquée */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-3 h-px bg-gradient-to-r from-zinc-600 to-transparent"></div>
          <span className="text-xs text-zinc-500 uppercase tracking-wider font-light">Spécifications</span>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {getMainSpecs().slice(0, 3).map((spec, specIndex) => (
            <div key={specIndex} className="flex items-center justify-between py-2 border-b border-zinc-800/30 last:border-b-0">
              <span className="text-sm text-zinc-400 font-light">{spec.label}</span>
              <span className="text-sm text-zinc-300 font-mono tracking-tight bg-zinc-800/20 px-2 py-1 rounded text-xs">
                {spec.value}
              </span>
            </div>
          ))}
          
          {getMainSpecs().length > 3 && (
            <div className="text-center pt-2">
              <span className="text-xs text-zinc-500 hover:text-zinc-400 transition-colors cursor-pointer">
                +{getMainSpecs().length - 3} autres specs
              </span>
            </div>
          )}
        </div>
      </div>

      {/* CTA Button Sophistiqué */}
      <div className="relative">
        <button className="w-full bg-white text-zinc-950 py-3 px-4 rounded-xl text-sm font-light tracking-wide transition-all duration-500 hover:bg-zinc-100 hover:shadow-xl hover:shadow-white/20 group-hover:transform group-hover:scale-[1.02] relative overflow-hidden">
          <span className="relative z-10">Choisir cette configuration</span>
          
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        </button>
        
        {/* Prix rapide en hover */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1 opacity-0 group-hover:opacity-100 transition-all duration-300 text-xs text-white whitespace-nowrap pointer-events-none">
          {getPrice()}€{getPriceSuffix()}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full border-4 border-transparent border-t-zinc-900"></div>
        </div>
      </div>

      {/* Effets de hover sophistiqués */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        {/* Border glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-zinc-600/20 via-transparent to-zinc-800/20"></div>
        
        {/* Corner accents */}
        <div className="absolute top-0 right-0 w-8 h-8">
          <div className="absolute top-2 right-2 w-1 h-1 bg-zinc-400 rounded-full animate-pulse"></div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-8 h-8">
          <div className="absolute bottom-2 left-2 w-1 h-1 bg-zinc-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
        </div>
      </div>
    </div>
  );
}