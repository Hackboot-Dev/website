// Removed 'use client' to allow server-side data loading
'use client';

// /workspaces/website/apps/web/app/products/page.tsx
// Description: Product listing page with curated offers, clear cards, subtle animations
// Last modified: 2025-08-22
// Related docs: /docs/JOURNAL.md

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import { getEnrichedProductData } from '../../../utils/productDataLoader';
import { useStaggerEntry } from '../../../hooks/useEntryAnimation';
import { useLanguage } from '../../../contexts/LanguageContext';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { getCategoryIcon, ArrowRightIcon, CPUIcon, RAMIcon, StorageIcon, NetworkIcon, ChevronDownIcon, CheckIcon } from '../../../components/ui/Icons';

type Category = 'all' | 'vps' | 'gpu' | 'webhosting' | 'paas' | 'loadbalancer' | 'storage' | 'cdn';
type PricingMode = 'monthly' | 'annual' | 'hourly';

export default function ProductsPage() {
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();

  const tt = (key: string, fr: string, en: string) => {
    const v = t(key);
    if (v && v.trim() !== '') return v;
    if (language === 'fr') return fr;
    if (language === 'en') return en;
    return t('common.langUnavailable') || 'Language unavailable';
  };

  // Load products data based on current language (default to 'fr' if not set)
  const productsData = getEnrichedProductData(language || 'fr');

  // Debug: Check if data is loaded
  if (!productsData || Object.keys(productsData).length === 0) {
    console.error('No products data loaded! Language:', language);
  }

  // Get category from URL params or default to 'all'
  const categoryFromUrl = searchParams.get('category') as Category | null;
  const initialCategory = categoryFromUrl && ['vps', 'gpu', 'webhosting', 'paas', 'loadbalancer', 'storage', 'cdn'].includes(categoryFromUrl)
    ? categoryFromUrl
    : 'all';

  const [selectedCategory, setSelectedCategory] = useState<Category>(initialCategory);
  const [pricingMode, setPricingMode] = useState<PricingMode>('monthly');
  const [isLoaded, setIsLoaded] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(true);
  const [isPricingSelectorOpen, setIsPricingSelectorOpen] = useState(false);
  
  // Ref pour la section des produits
  const productsGridRef = useRef<HTMLDivElement>(null);
  const pricingSelectorRef = useRef<HTMLDivElement>(null);
  
  const filteredProducts = getFilteredProducts();
  const filterKey = `${selectedCategory}-${pricingMode}-${language}`;
  const { visibleItems } = useStaggerEntry(filteredProducts.length, 80, 100, filterKey);
  
  useEffect(() => {
    // Animation d'entrée de la page
    const timer = setTimeout(() => setIsLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Update category when URL params change
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category') as Category | null;
    if (categoryFromUrl && ['vps', 'gpu', 'webhosting', 'paas', 'loadbalancer', 'storage', 'cdn'].includes(categoryFromUrl)) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pricingSelectorRef.current && !pricingSelectorRef.current.contains(event.target as Node)) {
        setIsPricingSelectorOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsPricingSelectorOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    setIsPricingSelectorOpen(false);
  }, [pricingMode]);

  useEffect(() => {
    // Reset when filter changes - keep showing all products
    setShowAllProducts(true);

    // Scroll to products grid only if needed (user can't see any products)
    const scrollToProductsIfNeeded = () => {
      if (productsGridRef.current) {
        const gridRect = productsGridRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const currentScrollY = window.pageYOffset;
        
        // Check if any part of the products grid is visible in the viewport
        const isGridVisible = gridRect.bottom > 0 && gridRect.top < viewportHeight;
        
        // Check if user is scrolled too far down (beyond the content)
        const isScrolledTooFar = currentScrollY + viewportHeight > documentHeight - 100;
        
        // Scroll if:
        // 1. Products grid is not visible at all, OR
        // 2. User is scrolled too far down (especially when content gets shorter after filtering)
        if (!isGridVisible || isScrolledTooFar) {
          const offsetTop = window.pageYOffset + gridRect.top - 100; // 100px de marge au-dessus
          
          window.scrollTo({
            top: Math.max(0, offsetTop), // Ensure we don't scroll to negative values
            behavior: 'smooth'
          });
        }
      }
    };
    
    // Add a small delay to ensure the content has updated
    const timeoutId = setTimeout(scrollToProductsIfNeeded, 100);
    
    return () => clearTimeout(timeoutId);
  }, [selectedCategory]); // Removed pricingMode from dependencies

  function getFilteredProducts() {
    let products = [];
    
    if (selectedCategory === 'all') {
      products = [
        ...(productsData.vps || []).map((p: any) => ({ ...p, category: 'vps' })),
        ...(productsData.gpu || []).map((p: any) => ({ ...p, category: 'gpu' })),
        ...(productsData.webhosting || []).map((p: any) => ({ ...p, category: 'webhosting' })),
        ...(productsData.paas || []).map((p: any) => ({ ...p, category: 'paas' })),
        ...(productsData.loadbalancer || []).map((p: any) => ({ ...p, category: 'loadbalancer' })),
        ...(productsData.storage || []).map((p: any) => ({ ...p, category: 'storage' })),
        ...(productsData.cdn || []).map((p: any) => ({ ...p, category: 'cdn' }))
      ];
    } else {
      products = ((productsData as any)[selectedCategory] || []).map((p: any) => ({ ...p, category: selectedCategory }));
    }

    // Tri intelligent : d'abord par catégorie, puis par prix
    return products.sort((a: any, b: any) => {
      // Si on affiche toutes les catégories, trier d'abord par catégorie
      if (selectedCategory === 'all') {
        const categoryOrder = ['vps', 'gpu', 'webhosting', 'paas', 'loadbalancer', 'storage', 'cdn'];
        const categoryA = categoryOrder.indexOf(a.category);
        const categoryB = categoryOrder.indexOf(b.category);
        
        if (categoryA !== categoryB) {
          return categoryA - categoryB;
        }
      }
      
      // Puis trier par prix
      const priceA = getPriceForSort(a);
      const priceB = getPriceForSort(b);
      return priceA - priceB;
    });
  }

  function getPriceForSort(product: any) {
    if (product.price_per_gb_month && product.category === 'storage') {
      return product.price_per_gb_month;
    }
    switch (pricingMode) {
      case 'hourly': return product.hourly || product.monthly || 999999;
      case 'annual': return product.annual ? product.annual / 12 : product.monthly || 999999;
      default: return product.monthly || product.hourly || 999999;
    }
  }

  const getTotalProductCount = () => {
    return Object.values(productsData).reduce((total, category: any) => total + category.length, 0);
  };

  const categories = [
    { key: 'all' as Category, name: tt('products.categories.all', 'Tous les produits', 'All products'), count: getTotalProductCount() },
    { key: 'vps' as Category, name: tt('products.categories.vps', 'VPS Cloud', 'VPS Cloud'), count: productsData.vps ? productsData.vps.length : 0 },
    { key: 'gpu' as Category, name: tt('products.categories.gpu', 'GPU Computing', 'GPU Computing'), count: productsData.gpu ? productsData.gpu.length : 0 },
    { key: 'webhosting' as Category, name: tt('products.categories.webhosting', 'Web Hosting', 'Web Hosting'), count: productsData.webhosting ? productsData.webhosting.length : 0 },
    { key: 'paas' as Category, name: tt('products.categories.paas', 'Platform as a Service', 'Platform as a Service'), count: productsData.paas ? productsData.paas.length : 0 },
    { key: 'loadbalancer' as Category, name: tt('products.categories.loadbalancer', 'Load Balancer', 'Load Balancer'), count: productsData.loadbalancer ? productsData.loadbalancer.length : 0 },
    { key: 'storage' as Category, name: tt('products.categories.storage', 'Stockage', 'Storage'), count: productsData.storage ? productsData.storage.length : 0 },
    { key: 'cdn' as Category, name: tt('products.categories.cdn', 'CDN', 'CDN'), count: productsData.cdn ? productsData.cdn.length : 0 }
  ];

  const pricingOptions: Array<{ key: PricingMode; title: string; short: string; description: string }> = [
    {
      key: 'monthly',
      title: language === 'en' ? 'Monthly billing' : 'Facturation mensuelle',
      short: language === 'en' ? 'Monthly' : 'Mensuelle',
      description: tt('products.ui.billing.monthly', "Mensuel : prix fixe, garanties", 'Monthly: fixed price, guarantees')
    },
    {
      key: 'annual',
      title: language === 'en' ? 'Yearly billing' : 'Facturation annuelle',
      short: language === 'en' ? 'Yearly' : 'Annuelle',
      description: tt('products.ui.billing.annual', "Annuel : jusqu'à 50% d'économies", 'Annual: up to 50% savings')
    },
    {
      key: 'hourly',
      title: language === 'en' ? 'Hourly billing' : 'Facturation horaire',
      short: language === 'en' ? 'Hourly' : 'Horaire',
      description: tt('products.ui.billing.hourly', "Horaire : payez à l'usage réel", 'Hourly: pay for actual usage')
    }
  ];

  const activePricingOption = pricingOptions.find((option) => option.key === pricingMode) || pricingOptions[0];



  const initialGridCount = 8;


  // Generate product URL based on category and product
  const getProductUrl = (product: any) => {
    // Create consistent URLs for all product categories
    const url = `/products/${product.category}/${product.id}`;
    console.log('Product:', product.name, 'Category:', product.category, 'ID:', product.id, 'URL:', url);
    return url;
  };

  // Fonction pour déterminer la gamme de prix et son style
  function getPriceRange(product: any) {
    const price = getPriceForSort(product);
    
    if (product.category === 'storage') {
      if (price <= 1) return { tier: 'starter', label: 'Économique', color: 'emerald' };
      if (price <= 5) return { tier: 'pro', label: 'Standard', color: 'blue' };
      return { tier: 'enterprise', label: 'Premium', color: 'purple' };
    }
    
    if (price <= 50) return { tier: 'starter', label: 'Starter', color: 'emerald' };
    if (price <= 500) return { tier: 'pro', label: 'Professional', color: 'blue' };
    return { tier: 'enterprise', label: 'Enterprise', color: 'purple' };
  }

  function getCategoryTheme(category: string) {
    const themes = {
      vps: { name: tt('products.badges.vps', 'VPS', 'VPS'), type: 'vps' as const },
      gpu: { name: tt('products.badges.gpu', 'GPU', 'GPU'), type: 'gpu' as const },
      webhosting: { name: tt('products.badges.webhosting', 'Web', 'Web'), type: 'webhosting' as const },
      paas: { name: tt('products.badges.paas', 'PaaS', 'PaaS'), type: 'paas' as const },
      loadbalancer: { name: tt('products.badges.loadbalancer', 'LB', 'LB'), type: 'loadbalancer' as const },
      storage: { name: tt('products.badges.storage', 'Stockage', 'Storage'), type: 'storage' as const },
      cdn: { name: tt('products.badges.cdn', 'CDN', 'CDN'), type: 'cdn' as const }
    };
    return (themes as any)[category] || { name: category, type: 'vps' as const };
  }

  const getHighlights = (product: any): { label: string; value: string }[] => {
    // keep it short: usage + 2 key specs based on category
    const specs: { label: string; value: string | number }[] = [];
    if (product.usage) specs.push({ label: tt('products.labels.idealFor', 'Idéal pour', 'Ideal for'), value: String(product.usage) });
    if (product.category === 'gpu') {
      if (product.gpu) specs.push({ label: tt('products.labels.gpu', 'GPU', 'GPU'), value: String(product.gpu) });
      if (product.vram) specs.push({ label: tt('products.labels.vram', 'VRAM', 'VRAM'), value: String(product.vram) });
    } else if (product.category === 'vps') {
      if (product.vcpu) specs.push({ label: tt('products.labels.cpu', 'CPU', 'CPU'), value: String(product.vcpu) });
      if (product.ram) specs.push({ label: tt('products.labels.ram', 'RAM', 'RAM'), value: String(product.ram) });
    } else if (product.category === 'webhosting') {
      if (product.sites) specs.push({ label: tt('products.labels.sites', 'Sites', 'Sites'), value: String(product.sites) });
      if (product.storage) specs.push({ label: tt('products.labels.storage', 'Stockage', 'Storage'), value: String(product.storage) });
    } else if (product.category === 'paas') {
      if (product.containers) specs.push({ label: tt('products.labels.containers', 'Containers', 'Containers'), value: String(product.containers) });
      if (product.auto_scaling) specs.push({ label: tt('products.labels.scaling', 'Scaling', 'Scaling'), value: String(product.auto_scaling) });
    } else if (product.category === 'loadbalancer') {
      if (product.requests_per_sec) specs.push({ label: tt('products.labels.rps', 'RPS', 'RPS'), value: String(product.requests_per_sec) });
      if (product.protocols) specs.push({ label: tt('products.labels.protocols', 'Protocoles', 'Protocols'), value: String(product.protocols) });
    } else if (product.category === 'storage') {
      if (product.type) specs.push({ label: tt('products.labels.type', 'Type', 'Type'), value: String(product.type) });
      if (product.throughput) specs.push({ label: tt('products.labels.throughput', 'Débit', 'Throughput'), value: String(product.throughput) });
    } else if (product.category === 'cdn') {
      if (product.pops) specs.push({ label: tt('products.labels.pops', 'PoPs', 'PoPs'), value: String(product.pops) });
      if (product.traffic_included) specs.push({ label: tt('products.labels.trafficIncluded', 'Trafic inclus', 'Traffic included'), value: String(product.traffic_included) });
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
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 max-w-xl w-full">
                  <div className="text-center sm:text-left group">
                    <div className="text-2xl font-extralight text-white mb-1 group-hover:text-zinc-300 transition-colors">
                      {getTotalProductCount()}
                    </div>
                    <div className="text-xs text-zinc-500 uppercase tracking-wide">{tt('products.ui.stats.configurations','Configurations','Configurations')}</div>
                  </div>
                  <div className="text-center sm:text-left group">
                    <div className="text-2xl font-extralight text-white mb-1 group-hover:text-zinc-300 transition-colors">
                      9
                    </div>
                    <div className="text-xs text-zinc-500 uppercase tracking-wide">{tt('products.ui.stats.categories','Catégories','Categories')}</div>
                  </div>
                  <div className="text-center sm:text-left group">
                    <div className="text-2xl font-extralight text-white mb-1 group-hover:text-zinc-300 transition-colors">
                      3
                    </div>
                    <div className="text-xs text-zinc-500 uppercase tracking-wide">{tt('products.ui.stats.billing','Modes de facturation','Billing modes')}</div>
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px]">
          {/* Barre filtres mobile sticky - pleine largeur */}
          <div className="md:hidden sticky top-20 z-40 -mt-2 mb-4 -mx-4 sm:-mx-6">
            <div className="bg-zinc-900/90 backdrop-blur-md border-t border-b border-zinc-800/60 shadow-lg">
              {/* Categories */}
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar px-4 py-3">
                {categories.map((category) => (
                  <button
                    key={`m-${category.key}`}
                    onClick={() => setSelectedCategory(category.key)}
                    className={`shrink-0 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs border transition-all ${
                      selectedCategory === category.key
                        ? 'bg-white text-zinc-950 border-white'
                        : 'text-zinc-400 border-zinc-800/50 hover:border-zinc-600 hover:text-zinc-300'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Sidebar Desktop */}
            <aside className="hidden md:block md:col-span-4 lg:col-span-3">
              <div className="sticky top-24 space-y-4">
                <div className="bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-4">
                  <h4 className="text-sm text-white mb-3">{tt('products.ui.categoriesTitle', 'Catégories', 'Categories')}</h4>
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
                    {/* Quick link to VPS dedicated page when VPS category is selected */}
                    {selectedCategory === 'vps' && (
                      <div className="mt-3 pt-3 border-t border-zinc-800/30">
                        <Link href="/products/vps">
                          <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-400 hover:text-emerald-400 transition-colors">
                            <ArrowRightIcon className="w-3 h-3" />
                            {tt('products.vps.viewAll', 'Voir tous les VPS', 'View all VPS')}
                          </button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
                <button onClick={() => { setSelectedCategory('all'); setPricingMode('monthly'); }} className="w-full text-sm text-zinc-300 hover:text-white border border-zinc-800/40 hover:border-zinc-700/60 rounded-xl py-2">{tt('products.ui.reset', 'Réinitialiser', 'Reset')}</button>
              </div>
            </aside>

            {/* Content */}
            <div className="col-span-12 md:col-span-8 lg:col-span-9">
              <div className={`relative z-20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                <div>
                  <h4 className="text-xl text-white font-extralight tracking-tight">{t('products.ui.configurationsTitle') || 'Configurations'}</h4>
                  <p className="text-zinc-500 text-xs">{filteredProducts.length} {tt('products.ui.configuration', 'configuration', 'configuration')}{filteredProducts.length > 1 ? 's' : ''} {tt('products.ui.available', 'disponible', 'available')}{filteredProducts.length > 1 ? 's' : ''}</p>
                </div>
                <div
                  ref={pricingSelectorRef}
                  className="relative flex flex-col items-start sm:items-end gap-1"
                >
                  <button
                    type="button"
                    onClick={() => setIsPricingSelectorOpen((prev) => !prev)}
                    className="inline-flex items-center gap-2 rounded-lg border border-zinc-800/70 bg-zinc-900/60 px-3 py-1.5 text-sm text-zinc-100 hover:border-zinc-700/70 hover:text-white transition-colors"
                    aria-haspopup="true"
                    aria-expanded={isPricingSelectorOpen}
                  >
                    <span className="font-medium tracking-wide">{activePricingOption.short}</span>
                    <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isPricingSelectorOpen ? 'rotate-180' : ''}`} size="sm" />
                  </button>
                  {isPricingSelectorOpen && (
                    <div
                      className="absolute top-full mt-2 sm:right-0 right-1/2 sm:translate-x-0 translate-x-1/2 rounded-2xl border border-zinc-800/70 bg-zinc-950 shadow-2xl ring-1 ring-black/40 p-2 z-50 origin-top"
                      style={{ width: 'min(260px, calc(100vw - 3rem))' }}
                    >
                      {pricingOptions.map((option) => (
                        <button
                          key={`config-${option.key}`}
                          type="button"
                          onClick={() => setPricingMode(option.key)}
                          className={`w-full px-3 py-2 rounded-xl text-left transition-colors ${
                            pricingMode === option.key
                              ? 'bg-white/10 text-white border border-white/10'
                              : 'text-zinc-300 hover:text-white hover:bg-zinc-900/60'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <span className="block text-sm font-medium tracking-wide">{option.title}</span>
                              <span className="block text-[11px] text-zinc-500 leading-relaxed">{option.description}</span>
                            </div>
                            {pricingMode === option.key && (
                              <CheckIcon className="w-4 h-4 text-cyan-400" size="sm" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>


              {/* Grille produits avec spacing optimisé et centrage responsive */}
              <div ref={productsGridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 justify-items-center sm:justify-items-stretch">
                {(showAllProducts ? filteredProducts : filteredProducts.slice(0, initialGridCount)).map((product, index) => {
                const getPrice = () => {
                  if (product.price_per_gb_month && product.category === 'storage') {
                    return product.price_per_gb_month;
                  }
                  switch (pricingMode) {
                    case 'hourly': return product.hourly || product.monthly;
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

                const categoryTheme = getCategoryTheme(product.category);
                const priceRange = getPriceRange(product);

                const cardKey = `${product.category}-${index}`;
                return (
                <div
                  key={cardKey}
                  className={`card group relative overflow-hidden flex flex-col w-full max-w-sm sm:max-w-none min-h-[320px] ${visibleItems[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ 
                    transitionDelay: `${index * 80}ms`,
                    transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                  }}
                >
                  {/* Glow effect subtil */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent"></div>
                  </div>
                  
                  {/* Contenu principal - flex-1 pour pousser les actions en bas */}
                  <div className="flex-1">
                  {/* Header avec badges - 2 badges max responsive */}
                  <div className="flex items-start justify-between mb-4 sm:mb-6">
                    <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                      <Badge 
                        variant="category" 
                        type={categoryTheme.type}
                        icon={getCategoryIcon(product.category, { size: 'sm' })}
                        className="text-xs"
                      >
                        {categoryTheme.name}
                      </Badge>
                      
                      <Badge 
                        variant="tier" 
                        type={priceRange.tier as any}
                        className="text-xs"
                      >
                        {priceRange.label}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Product Name & Usage - hauteur responsive */}
                  <div className="mb-4 sm:mb-5 min-h-[72px]">
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-white mb-1.5 sm:mb-2 leading-snug tracking-wide break-words">
                      {product.name || String(product.id || '').toUpperCase()}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed line-clamp-2">
                      {product.usage}
                    </p>
                  </div>

                  {/* Prix simplifié responsive */}
                  <div className="mb-5 sm:mb-6">
                    <div className="flex items-end space-x-1">
                      <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-none">
                        {getPrice()}€
                      </span>
                      <span className="text-xs sm:text-sm text-zinc-400 font-normal pb-0.5 ml-0.5">
                        {getPriceSuffix()}
                      </span>
                    </div>
                  </div>
                  
                  </div>

                  {/* Actions - footer fixé en bas */}
                  <div className="space-y-3">
                    <Button
                      variant="primary"
                      className="w-full"
                      icon={<ArrowRightIcon size="sm" />}
                      iconPosition="right"
                    >
                      {t('products.ui.configure') || 'Configurer'}
                    </Button>
                    
                    <Link 
                      href={getProductUrl(product)}
                      onClick={(e) => {
                        e.preventDefault();
                        const url = getProductUrl(product);
                        console.log('Navigating to:', url);
                        window.location.href = url;
                      }}
                    >
                      <Button
                        variant="secondary"
                        className="w-full mt-2"
                        icon={<ArrowRightIcon size="sm" />}
                        iconPosition="right"
                      >
                        {tt('products.ui.details', 'Voir détails', 'View details')}
                      </Button>
                    </Link>
                    
                    <p className="text-xs text-zinc-500 text-center leading-relaxed">
                      {tt('products.ui.configureInfo', 'Personnalisez les ressources • Paiement sécurisé', 'Customize resources • Secure payment')}
                    </p>
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
              );})}
            </div>

            {/* Show more */}
            {!showAllProducts && filteredProducts.length > initialGridCount && (
              <div className="flex justify-center mt-10">
                <button 
                  onClick={() => setShowAllProducts(true)} 
                  className="px-5 py-3 rounded-xl border border-zinc-800/40 text-zinc-300 hover:text-white hover:border-zinc-700/60 text-sm transition-all duration-300 hover:bg-zinc-900/20 hover:transform hover:scale-105"
                >
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
