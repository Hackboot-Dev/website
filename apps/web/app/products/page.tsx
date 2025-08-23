'use client';

// /workspaces/website/apps/web/app/products/page.tsx
// Description: Product listing page with curated offers, clear cards, subtle animations
// Last modified: 2025-08-22
// Related docs: /docs/JOURNAL.md

import { useState, useEffect, useMemo } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import productsData from '../../data/products.json';
import { useStaggerEntry } from '../../hooks/useEntryAnimation';
import { useLanguage } from '../../contexts/LanguageContext';

type Category = 'all' | 'vps' | 'gpu' | 'webhosting' | 'paas' | 'loadbalancer' | 'storage' | 'cdn';
type PricingMode = 'monthly' | 'annual' | 'hourly';

export default function ProductsPage() {
  const { t, language } = useLanguage();
  const tt = (key: string, fr: string, en: string) => {
    const v = t(key);
    if (v && v.trim() !== '') return v;
    if (language === 'fr') return fr;
    if (language === 'en') return en;
    return t('common.langUnavailable') || 'Language unavailable';
  };
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [pricingMode, setPricingMode] = useState<PricingMode>('monthly');
  const [isLoaded, setIsLoaded] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  
  const filteredProducts = getFilteredProducts();
  const { visibleItems } = useStaggerEntry(filteredProducts.length, 100, 600);
  
  useEffect(() => {
    // Animation d'entrée de la page
    const timer = setTimeout(() => setIsLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);
  
  function getFilteredProducts() {
    if (selectedCategory === 'all') {
      return [
        ...productsData.vps.map(p => ({ ...p, category: 'vps' })),
        ...productsData.gpu.map(p => ({ ...p, category: 'gpu' })),
        ...productsData.webhosting.map(p => ({ ...p, category: 'webhosting' })),
        ...productsData.paas.map(p => ({ ...p, category: 'paas' })),
        ...productsData.loadbalancer.map(p => ({ ...p, category: 'loadbalancer' })),
        ...productsData.storage.map(p => ({ ...p, category: 'storage' })),
        ...productsData.cdn.map(p => ({ ...p, category: 'cdn' }))
      ];
    }
    return productsData[selectedCategory].map(p => ({ ...p, category: selectedCategory }));
  }

  const getTotalProductCount = () => {
    return Object.values(productsData).reduce((total, category) => total + category.length, 0);
  };

  const categories = [
    { key: 'all' as Category, name: 'Tous les produits', count: getTotalProductCount() },
    { key: 'vps' as Category, name: 'VPS Cloud', count: productsData.vps.length },
    { key: 'gpu' as Category, name: 'GPU Computing', count: productsData.gpu.length },
    { key: 'webhosting' as Category, name: 'Web Hosting', count: productsData.webhosting.length },
    { key: 'paas' as Category, name: 'Platform as a Service', count: productsData.paas.length },
    { key: 'loadbalancer' as Category, name: 'Load Balancer', count: productsData.loadbalancer.length },
    { key: 'storage' as Category, name: 'Stockage', count: productsData.storage.length },
    { key: 'cdn' as Category, name: 'CDN', count: productsData.cdn.length }
  ];

  // Helper: base monthly-like price for curation (storage uses price_per_gb_month)
  const getBaseMonthly = (product: any) => {
    if (product.price_per_gb_month && product.category === 'storage') return product.price_per_gb_month;
    return product.monthly ?? product.annual ?? product.hourly ?? 0;
  };

  // Helper: pick 3 curated offers (entry, balanced, max) for clarity
  const curatedOffers = useMemo(() => {
    const list = [...filteredProducts].sort((a, b) => getBaseMonthly(a) - getBaseMonthly(b));
    if (list.length === 0) return [] as any[];
    if (list.length <= 3) return list;
    const first = list[0];
    const middle = list[Math.floor(list.length / 2)];
    const last = list[list.length - 1];
    return [first, middle, last];
  }, [filteredProducts]);

  const { visibleItems: visibleCurated } = useStaggerEntry(curatedOffers.length, 120, 300);

  const initialGridCount = 8;

  const toggleCard = (key: string) => setExpandedCards(prev => ({ ...prev, [key]: !prev[key] }));

  const getHighlights = (product: any): { label: string; value: string }[] => {
    // keep it short: usage + 2 key specs based on category
    const specs: { label: string; value: string | number }[] = [];
    if (product.usage) specs.push({ label: 'Idéal pour', value: String(product.usage) });
    if (product.category === 'gpu') {
      if (product.gpu) specs.push({ label: 'GPU', value: String(product.gpu) });
      if (product.vram) specs.push({ label: 'VRAM', value: String(product.vram) });
    } else if (product.category === 'vps') {
      if (product.vcpu) specs.push({ label: 'CPU', value: String(product.vcpu) });
      if (product.ram) specs.push({ label: 'RAM', value: String(product.ram) });
    } else if (product.category === 'webhosting') {
      if (product.sites) specs.push({ label: 'Sites', value: String(product.sites) });
      if (product.storage) specs.push({ label: 'Stockage', value: String(product.storage) });
    } else if (product.category === 'paas') {
      if (product.containers) specs.push({ label: 'Containers', value: String(product.containers) });
      if (product.auto_scaling) specs.push({ label: 'Scaling', value: String(product.auto_scaling) });
    } else if (product.category === 'loadbalancer') {
      if (product.requests_per_sec) specs.push({ label: 'RPS', value: String(product.requests_per_sec) });
      if (product.protocols) specs.push({ label: 'Protocoles', value: String(product.protocols) });
    } else if (product.category === 'storage') {
      if (product.type) specs.push({ label: 'Type', value: String(product.type) });
      if (product.throughput) specs.push({ label: 'Débit', value: String(product.throughput) });
    } else if (product.category === 'cdn') {
      if (product.pops) specs.push({ label: 'PoPs', value: String(product.pops) });
      if (product.traffic_included) specs.push({ label: 'Trafic inclus', value: String(product.traffic_included) });
    }
    return specs.slice(0, 3) as { label: string; value: string }[];
  };


  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />
      
      {/* Hero compact pour accès rapide aux produits */}
      <section className="relative bg-zinc-950 overflow-hidden">
        {/* Arrière-plan sophistiqué avec effets */}
        <div className="absolute inset-0 bg-zinc-950">
          {/* Grain texture */}
          <div className="absolute inset-0 opacity-[0.15] bg-noise"></div>
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/50 via-zinc-950 to-zinc-950"></div>
          
          {/* Geometric patterns */}
          <div className="absolute inset-0 opacity-[0.02]">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 border border-white rotate-45 rounded-lg"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 border border-white rotate-12 rounded-lg"></div>
            <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-white/5 rotate-45 rounded-lg"></div>
          </div>
          
          {/* Subtle animated elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20% left-10% w-2 h-2 bg-blue-400/30 rounded-full animate-pulse" style={{animationDelay: '0s'}}></div>
            <div className="absolute top-40% right-20% w-1 h-1 bg-emerald-400/40 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
            <div className="absolute bottom-30% left-30% w-1.5 h-1.5 bg-purple-400/30 rounded-full animate-pulse" style={{animationDelay: '4s'}}></div>
          </div>
          
        </div>
        
        <div className={`relative z-10 pt-28 pb-10 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
          <div className="container mx-auto px-8">
            <div className="grid grid-cols-12 gap-8 items-center">
              
              <div className={`col-span-12 lg:col-span-8 transition-all duration-700 delay-150 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                <div className="mb-8">
                  <span className="text-xs tracking-[0.4em] text-zinc-500 font-mono uppercase">
                    Infrastructure Premium
                  </span>
                </div>
                
                <div className="space-y-6 mb-12">
                  <div className="overflow-hidden">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extralight tracking-tight text-white leading-[0.95] hover:tracking-wide transition-all duration-700">
                      {tt('products.ui.hero.title1','Solutions','Solutions')}
                      <br />
                      <span className="text-zinc-400">{tt('products.ui.hero.title2','Cloud','Cloud')}</span>
                    </h1>
                  </div>
                  
                  <p className="text-lg text-zinc-400 max-w-2xl font-light leading-relaxed">
                    {tt('products.ui.hero.subtitle1','De la simple instance aux clusters GPU haute performance.','From simple instances to high‑performance GPU clusters.')}
                    <br />
                    <span className="text-zinc-500">{tt('products.ui.hero.subtitle2','Infrastructure européenne premium, facturation transparente.','European premium infrastructure, transparent billing.')}</span>
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-8 max-w-lg">
                  <div className="text-center group">
                    <div className="text-2xl font-extralight text-white mb-1 group-hover:text-zinc-300 transition-colors">
                      {getTotalProductCount()}
                    </div>
                    <div className="text-xs text-zinc-500 uppercase tracking-wide">{tt('products.ui.stats.configurations','Configurations','Configurations')}</div>
                  </div>
                  <div className="text-center group">
                    <div className="text-2xl font-extralight text-white mb-1 group-hover:text-zinc-300 transition-colors">
                      8
                    </div>
                    <div className="text-xs text-zinc-500 uppercase tracking-wide">{tt('products.ui.stats.categories','Catégories','Categories')}</div>
                  </div>
                  <div className="text-center group">
                    <div className="text-2xl font-extralight text-white mb-1 group-hover:text-zinc-300 transition-colors">
                      3
                    </div>
                    <div className="text-xs text-zinc-500 uppercase tracking-wide">{tt('products.ui.stats.modes','Modes Prix','Pricing Modes')}</div>
                  </div>
                </div>
              </div>
              
              <div className={`col-span-12 lg:col-span-4 transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
                <div className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 rounded-xl p-6">
                  <h3 className="text-white font-light mb-4">{tt('products.ui.billing.title','Facturation intelligente','Smart billing')}</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-zinc-400">{tt("products.ui.billing.hourly","Horaire : payez à l'usage réel","Hourly: pay for actual usage")}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      <span className="text-zinc-400">{tt('products.ui.billing.monthly','Mensuel : prix fixe, garanties','Monthly: fixed price, guarantees')}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-zinc-400">{tt("products.ui.billing.annual","Annuel : jusqu'à 50% d'économies","Annual: up to 50% savings")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filtres en sidebar (desktop) + barre sticky (mobile), offres et grille */}
      <section className="py-8 bg-zinc-950">
        <div className="container mx-auto px-8 max-w-7xl">
          {/* Barre filtres mobile sticky */}
          <div className="md:hidden sticky top-20 z-40 -mt-2 mb-4">
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar bg-zinc-900/40 border border-zinc-800/40 px-3 py-2 rounded-xl">
              {categories.map((category) => (
                <button
                  key={`m-${category.key}`}
                  onClick={() => setSelectedCategory(category.key)}
                  className={`shrink-0 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs border transition-all ${selectedCategory === category.key ? 'bg-white text-zinc-950 border-white' : 'text-zinc-400 border-zinc-800/50'}`}
                >
                  {category.name}
                </button>
              ))}
              {/* Pricing toggle compact */}
              <div className="ml-auto flex items-center gap-1 border border-zinc-800/50 rounded-lg p-1">
                {['monthly','annual','hourly'].map((pm) => (
                  <button key={`m-${pm}`} onClick={() => setPricingMode(pm as PricingMode)} className={`shrink-0 px-2 py-1 text-[10px] rounded-md ${pricingMode===pm?'bg-white text-zinc-950':'text-zinc-400'}`}>{pm==='monthly'?(t('products.ui.toggle.monthly')||'Mensuel'):pm==='annual'?(t('products.ui.toggle.annualShort')||'Annuel'):(t('products.ui.toggle.hourly')||'Horaire')}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Sidebar Desktop */}
            <aside className="hidden md:block md:col-span-4 lg:col-span-3">
              <div className="sticky top-24 space-y-6">
                <div className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/40 rounded-2xl p-4">
                  <h4 className="text-sm text-white mb-3">Catégories</h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={`d-${category.key}`}
                        onClick={() => setSelectedCategory(category.key)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-sm transition-all ${selectedCategory===category.key? 'bg-white text-zinc-950 border-white':'bg-zinc-900/20 text-zinc-400 border-zinc-800/40 hover:text-white hover:border-zinc-700/60'}`}
                      >
                        <span className="truncate pr-3">{category.name}</span>
                        <span className={`text-xs font-mono px-2 py-0.5 rounded ${selectedCategory===category.key?'bg-zinc-950/10 text-zinc-700':'bg-zinc-800/50 text-zinc-500'}`}>{category.count}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/40 rounded-2xl p-4">
                  <h4 className="text-sm text-white mb-3">Mode de prix</h4>
                  <div className="relative flex items-center bg-zinc-900/20 rounded-xl p-1.5 border border-zinc-800/30 overflow-hidden">
                    <div 
                      className="absolute bg-white rounded-lg transition-all duration-300 ease-out shadow-xl" 
                      style={{ width: '33.333%', height: 'calc(100% - 12px)', top: '6px', left: `calc(${['monthly', 'annual', 'hourly'].indexOf(pricingMode) * 33.333}% + 6px)` }}
                    />
                    {[
                      (t('products.ui.toggle.monthly')||'Mensuel'),
                      (t('products.ui.toggle.annualShort')||'Annuel'),
                      (t('products.ui.toggle.hourly')||'Horaire')
                    ].map((mode, index) => {
                      const isActive = pricingMode === ['monthly', 'annual', 'hourly'][index];
                      return (
                        <button
                          key={`d-${mode}`}
                          onClick={() => setPricingMode(['monthly', 'annual', 'hourly'][index] as PricingMode)}
                          className={`relative z-10 px-3 py-3 text-[12px] md:text-xs font-light rounded-lg transition-all basis-1/3 min-w-0 ${isActive? 'text-zinc-950':'text-zinc-400 hover:text-white'}`}
                        >
                          <span className="block w-full truncate">{mode}</span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-2 text-[11px] text-zinc-500">{pricingMode==='annual'?(t('products.ui.annualNote')||'Prix mensuel équivalent sur engagement annuel'):(t('products.ui.switchNote')||'Basculer entre les modes')}</p>
                </div>
                <button onClick={() => { setSelectedCategory('all'); setPricingMode('monthly'); }} className="w-full text-sm text-zinc-300 hover:text-white border border-zinc-800/40 hover:border-zinc-700/60 rounded-xl py-2">Réinitialiser</button>
              </div>
            </aside>

            {/* Content */}
            <div className="col-span-12 md:col-span-8 lg:col-span-9">
              <div className={`flex items-end justify-between mb-6 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                <div>
                  <h4 className="text-xl text-white font-extralight tracking-tight">{t('products.ui.configurationsTitle') || 'Configurations'}</h4>
                  <p className="text-zinc-500 text-xs">{filteredProducts.length} configuration{filteredProducts.length > 1 ? 's' : ''} disponible{filteredProducts.length > 1 ? 's' : ''}</p>
                </div>
                <div className="hidden md:block text-xs text-zinc-500">{t('products.ui.modeLabel') || 'Mode'}: <span className="text-zinc-300">{
                  pricingMode === 'hourly' 
                    ? (t('products.ui.toggle.hourly') || 'Horaire') 
                    : pricingMode === 'annual' 
                      ? (t('products.ui.toggle.annualShort') || 'Annuel') 
                      : (t('products.ui.toggle.monthly') || 'Mensuel')
                }</span></div>
              </div>

              {/* Offres recommandées */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {curatedOffers.map((product, i) => {
                  const key = `${product.category}-${product.name}-curated`;
                  const price = (() => {
                    if (product.price_per_gb_month && product.category === 'storage') return product.price_per_gb_month;
                    switch (pricingMode) {
                      case 'hourly': return product.hourly ?? product.monthly;
                      case 'annual': return product.annual ? Math.round(product.annual / 12) : product.monthly;
                      default: return product.monthly ?? product.hourly ?? product.annual;
                    }
                  })();
                  const suffix = product.category === 'storage' && product.price_per_gb_month ? '/GB/mois' : pricingMode === 'hourly' ? '/h' : '/mois';
                  const hl = getHighlights(product);
                  return (
                    <div
                      key={key}
                      className={`group relative rounded-2xl border border-zinc-800/40 bg-zinc-900/30 backdrop-blur-sm p-6 transition-all duration-700 overflow-hidden ${visibleCurated[i] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
                      style={{ transitionDelay: `${i * 80}ms` }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="text-xs text-zinc-500 tracking-wide mb-1">{String(product.category).toUpperCase()}</div>
                          <h4 className="text-lg text-white tracking-tight">{product.name}</h4>
                        </div>
                        {product.trial && (
                          <div className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{(t('products.ui.trial') || (language==='fr'?'Essai':'Trial'))} {product.trial}</div>
                        )}
                      </div>
                      <ul className="space-y-2 mb-4">
                        {hl.map(({ label, value }, idx) => (
                          <li key={idx} className="flex items-center justify-between">
                            <span className="text-xs text-zinc-500">{label}</span>
                            <span className="text-xs text-zinc-300 font-mono bg-zinc-800/30 rounded px-2 py-0.5">{value}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex items-baseline space-x-2 mb-5">
                        <span className="text-3xl text-white font-extralight">{price}</span>
                        <span className="text-lg text-white">€</span>
                        <span className="text-sm text-zinc-500">{suffix}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="flex-1 bg-white text-zinc-950 py-2.5 rounded-xl text-sm tracking-wide transition-all duration-300 hover:bg-zinc-100 hover:shadow-lg">{t('products.ui.choose') || (language==='fr'?'Choisir':'Choose')}</button>
                        <button onClick={() => toggleCard(key)} className="px-3 py-2 rounded-lg border border-zinc-800/40 text-zinc-400 hover:text-white hover:border-zinc-700/60 text-xs">{t('products.ui.details') || (language==='fr'?'Détails':'Details')}</button>
                      </div>
                      {expandedCards[key] && (
                        <div className="mt-4 border-t border-zinc-800/40 pt-4">
                          <p className="text-xs text-zinc-500">{t('products.ui.included') || (language==='fr'?'Inclus :':'Included:')}</p>
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            {[product.vcpu && `CPU: ${product.vcpu}`, product.gpu && `GPU: ${product.gpu}`, product.ram && `RAM: ${product.ram}`, product.storage && `Stockage: ${product.storage}`, product.bandwidth && `Bande passante: ${product.bandwidth}`]
                              .filter(Boolean)
                              .slice(0, 6)
                              .map((line, idx) => (
                                <div key={idx} className="text-xs text-zinc-400 bg-zinc-800/20 rounded px-2 py-1">{line as string}</div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Grille produits */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {(showAllProducts ? filteredProducts : filteredProducts.slice(0, initialGridCount)).map((product, index) => {
                const getPrice = () => {
                  if (product.price_per_gb_month && product.category === 'storage') {
                    return product.price_per_gb_month;
                  }
                  switch (pricingMode) {
                    case 'hourly': return product.hourly;
                    case 'monthly': return product.monthly;
                    case 'annual': return product.annual ? Math.round(product.annual / 12) : product.monthly;
                    default: return product.monthly;
                  }
                };

                const getPriceSuffix = () => {
                  if (product.price_per_gb_month && product.category === 'storage') {
                    return t('products.ui.price.perGbPerMonth') || '/GB/mois';
                  }
                  switch (pricingMode) {
                    case 'hourly': return t('products.ui.price.perHour') || '/h';
                    case 'monthly': return t('products.ui.price.perMonth') || '/mois';
                    case 'annual': return t('products.ui.price.perMonthStar') || '/mois*';
                    default: return '/mois';
                  }
                };

                const getCategoryIcon = () => {
                  const icons = {
                    vps: '🖥️', gpu: '⚡', webhosting: '🌐', paas: '🐳',
                    loadbalancer: '⚖️', storage: '💾', cdn: '🌍'
                  };
                  return icons[product.category] || '💻';
                };

                const getCategoryColor = () => {
                  const colors = {
                    vps: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                    gpu: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
                    webhosting: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                    paas: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
                    loadbalancer: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
                    storage: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
                    cdn: 'bg-green-500/10 text-green-400 border-green-500/20'
                  };
                  return colors[product.category] || 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
                };

                const cardKey = `${product.category}-${index}`;
                return (
                <div
                  key={cardKey}
                  className={`group relative bg-zinc-900/20 backdrop-blur-sm border border-zinc-800/30 rounded-2xl p-6 transition-all duration-700 hover:bg-zinc-900/40 hover:border-zinc-700/50 hover:shadow-2xl hover:shadow-zinc-950/30 hover:-translate-y-1 overflow-hidden ${visibleItems[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ 
                    transitionDelay: `${index * 100}ms`,
                    transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
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
                        <span className="text-emerald-300">✨</span> {tt('products.ui.trial','Essai','Trial')} {product.trial}
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
                          {tt('products.ui.saves','Économise','Saves')} {Math.round(((product.monthly * 12 - product.annual) / (product.monthly * 12)) * 100)}%
                        </span>
                      </div>
                    )}
                    
                    {pricingMode === 'hourly' && (
                      <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-1 mb-2">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></span>
                        <span className="text-xs text-blue-400 font-light">{tt("products.ui.badges.hourly","Facturation à l'usage","Usage-based billing")}</span>
                      </div>
                    )}
                    
                    {pricingMode === 'monthly' && (
                      <div className="inline-flex items-center space-x-2 bg-zinc-500/10 border border-zinc-500/20 rounded-lg px-3 py-1 mb-2">
                        <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full"></span>
                        <span className="text-xs text-zinc-400 font-light">{tt("products.ui.badges.monthly","Ressources garanties 24/7","Guaranteed resources 24/7")}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Specs Section Sophistiquée */}
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-3 h-px bg-gradient-to-r from-zinc-600 to-transparent"></div>
                      <span className="text-xs text-zinc-500 uppercase tracking-wider font-light">{tt('products.ui.specs.title','Spécifications','Specifications')}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        product.vcpu && { label: tt('products.ui.specs.cpu','CPU','CPU'), value: product.vcpu },
                        product.gpu && { label: tt('products.ui.specs.gpu','GPU','GPU'), value: product.gpu },
                        product.ram && { label: tt('products.ui.specs.ram','RAM','RAM'), value: product.ram },
                        product.storage && { label: tt('products.ui.specs.storage','Stockage','Storage'), value: product.storage },
                        product.bandwidth && { label: tt('products.ui.specs.bandwidth','Bande passante','Bandwidth'), value: product.bandwidth },
                        product.sites && { label: tt('products.ui.specs.sites','Sites','Sites'), value: product.sites },
                        product.containers && { label: tt('products.ui.specs.containers','Containers','Containers'), value: product.containers }
                      ].filter(Boolean).slice(0, 3).map((spec: any, specIndex: number) => (
                        <div key={specIndex} className="flex items-center justify-between py-2 border-b border-zinc-800/30 last:border-b-0">
                          <span className="text-sm text-zinc-400 font-light">{spec.label}</span>
                          <span className="text-sm text-zinc-300 font-mono tracking-tight bg-zinc-800/20 px-2 py-1 rounded text-xs">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA + Details toggle */}
                  <div className="relative flex items-center gap-3">
                    <button className="flex-1 bg-white text-zinc-950 py-3 px-4 rounded-xl text-sm font-light tracking-wide transition-all duration-300 hover:bg-zinc-100 hover:shadow-lg relative overflow-hidden">
                      <span className="relative z-10">{t('products.ui.chooseConfig') || 'Choisir cette configuration'}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    </button>
                    <button onClick={() => toggleCard(cardKey)} className="px-3 py-3 rounded-xl border border-zinc-800/40 text-zinc-400 hover:text-white hover:border-zinc-700/60 text-xs min-w-[92px]">
                      {expandedCards[cardKey] ? (t('products.ui.hide') || 'Masquer') : (t('products.ui.details') || 'Détails')}
                    </button>
                  </div>

                  {/* Expandable details */}
                  {expandedCards[cardKey] && (
                    <div className="mt-4 border-t border-zinc-800/30 pt-4">
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          product.vcpu && { label: 'CPU', value: product.vcpu },
                          product.gpu && { label: 'GPU', value: product.gpu },
                          product.vram && { label: 'VRAM', value: product.vram },
                          product.ram && { label: 'RAM', value: product.ram },
                          product.storage && { label: 'Stockage', value: product.storage },
                          product.bandwidth && { label: 'Bande passante', value: product.bandwidth },
                          product.ipv4 && { label: 'IPv4', value: product.ipv4 },
                          product.network && { label: 'Réseau', value: product.network },
                          product.databases && { label: 'Bases', value: product.databases },
                          product.emails && { label: 'Emails', value: product.emails },
                          product.ssl && { label: 'SSL', value: product.ssl },
                          product.containers && { label: 'Containers', value: product.containers },
                          product.auto_scaling && { label: 'Scaling', value: product.auto_scaling },
                          product.protocols && { label: 'Protocoles', value: product.protocols },
                          product.requests_per_sec && { label: 'RPS', value: product.requests_per_sec },
                          product.type && { label: 'Type', value: product.type },
                          product.throughput && { label: 'Débit', value: product.throughput },
                          product.pops && { label: 'PoPs', value: product.pops },
                          product.traffic_included && { label: 'Trafic', value: product.traffic_included },
                        ]
                          .filter(Boolean)
                          .slice(0, 10)
                          .map((spec: any, si: number) => (
                            <div key={si} className="flex items-center justify-between text-xs">
                              <span className="text-zinc-500">{spec.label}</span>
                              <span className="text-zinc-300 font-mono bg-zinc-800/20 px-2 py-1 rounded">{String(spec.value)}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

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
              );})}
            </div>

            {/* Show more */}
            {!showAllProducts && filteredProducts.length > initialGridCount && (
              <div className="flex justify-center mt-10">
                <button onClick={() => setShowAllProducts(true)} className="px-5 py-3 rounded-xl border border-zinc-800/40 text-zinc-300 hover:text-white hover:border-zinc-700/60 text-sm">
                  {(t('products.ui.showMore') || 'Afficher plus')} ({filteredProducts.length - initialGridCount})
                </button>
              </div>
            )}
          </div>
          </div>
        </div>
      </section>
      
      <div className={`transition-all duration-1000 delay-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <Footer />
      </div>
    </div>
  );
}
