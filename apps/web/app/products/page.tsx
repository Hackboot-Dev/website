'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import productsData from '../../data/products.json';
import { useStaggerEntry } from '../../hooks/useEntryAnimation';

type Category = 'all' | 'vps' | 'gpu' | 'webhosting' | 'paas' | 'loadbalancer' | 'storage' | 'cdn';
type PricingMode = 'monthly' | 'annual' | 'hourly';

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [pricingMode, setPricingMode] = useState<PricingMode>('monthly');
  const [isLoaded, setIsLoaded] = useState(false);
  
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


  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />
      
      {/* Hero Section Sophistiqué */}
      <section className="relative min-h-screen bg-zinc-950 overflow-hidden">
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
        
        <div className={`relative z-10 h-screen flex items-center pt-20 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="container mx-auto px-8">
            <div className="grid grid-cols-12 gap-8 items-center">
              
              <div className={`col-span-12 lg:col-span-8 transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                <div className="mb-8">
                  <span className="text-xs tracking-[0.4em] text-zinc-500 font-mono uppercase">
                    Infrastructure Premium
                  </span>
                </div>
                
                <div className="space-y-6 mb-12">
                  <div className="overflow-hidden">
                    <h1 className="text-6xl md:text-7xl lg:text-8xl font-extralight tracking-tight text-white leading-[0.85] hover:tracking-wide transition-all duration-700">
                      Solutions
                      <br />
                      <span className="text-zinc-400">Cloud</span>
                    </h1>
                  </div>
                  
                  <p className="text-xl text-zinc-400 max-w-2xl font-light leading-relaxed">
                    De la simple instance aux clusters GPU haute performance.
                    <br />
                    <span className="text-zinc-500">Infrastructure européenne premium, facturation transparente.</span>
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-8 max-w-lg">
                  <div className="text-center group">
                    <div className="text-2xl font-extralight text-white mb-1 group-hover:text-zinc-300 transition-colors">
                      {getTotalProductCount()}
                    </div>
                    <div className="text-xs text-zinc-500 uppercase tracking-wide">Configurations</div>
                  </div>
                  <div className="text-center group">
                    <div className="text-2xl font-extralight text-white mb-1 group-hover:text-zinc-300 transition-colors">
                      8
                    </div>
                    <div className="text-xs text-zinc-500 uppercase tracking-wide">Catégories</div>
                  </div>
                  <div className="text-center group">
                    <div className="text-2xl font-extralight text-white mb-1 group-hover:text-zinc-300 transition-colors">
                      3
                    </div>
                    <div className="text-xs text-zinc-500 uppercase tracking-wide">Modes Prix</div>
                  </div>
                </div>
              </div>
              
              <div className={`col-span-12 lg:col-span-4 transition-all duration-1000 delay-400 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
                <div className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 rounded-xl p-6">
                  <h3 className="text-white font-light mb-4">Facturation intelligente</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-zinc-400">Horaire : payez à l'usage réel</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      <span className="text-zinc-400">Mensuel : prix fixe, garanties</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-zinc-400">Annuel : jusqu'à 50% d'économies</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Controls */}
      <section className="relative py-20 bg-zinc-950">
        <div className="container mx-auto px-8">
          <div className="max-w-7xl mx-auto">
            
            <div className={`text-center mb-16 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h2 className="text-3xl md:text-4xl font-extralight text-white mb-4 tracking-tight">
                Trouvez votre
                <span className="text-zinc-400"> configuration</span>
              </h2>
              <p className="text-zinc-500 max-w-2xl mx-auto">
                Filtrez par catégorie et choisissez votre mode de facturation préféré
              </p>
            </div>

            {/* Toggles catégories sophistiqués */}
            <div className={`flex flex-wrap gap-3 justify-center mb-12 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {categories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => setSelectedCategory(category.key)}
                  className={`group relative flex items-center space-x-3 px-5 py-3 rounded-xl border transition-all duration-500 overflow-hidden ${
                    selectedCategory === category.key
                      ? 'bg-white text-zinc-950 border-white shadow-lg transform scale-105'
                      : 'bg-zinc-900/20 backdrop-blur-sm text-zinc-400 border-zinc-800/30 hover:text-white hover:bg-zinc-800/40 hover:border-zinc-700/50 hover:transform hover:scale-102'
                  }`}
                >
                  {/* Glow effect pour l'état actif */}
                  {selectedCategory === category.key && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-xl"></div>
                  )}
                  
                  {/* Shimmer effect au hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  
                  <span className={`relative z-10 text-sm font-light tracking-wide transition-all duration-300 ${
                    selectedCategory === category.key ? 'font-medium' : ''
                  }`}>
                    {category.name}
                  </span>
                  
                  <span className={`relative z-10 text-xs px-2.5 py-1 rounded-lg font-mono transition-all duration-300 ${
                    selectedCategory === category.key
                      ? 'bg-zinc-950/10 text-zinc-600 shadow-sm'
                      : 'bg-zinc-800/50 text-zinc-500 group-hover:bg-zinc-700/50 group-hover:text-zinc-400'
                  }`}>
                    {category.count}
                  </span>
                  
                  {/* Indicateur subtil pour l'état actif */}
                  {selectedCategory === category.key && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-zinc-950/20 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Mode prix sophistiqué */}
            <div className={`flex justify-center mb-12 transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="relative flex items-center bg-zinc-900/20 backdrop-blur-sm rounded-2xl p-1.5 border border-zinc-800/30">
                {/* Background slider */}
                <div 
                  className="absolute bg-white rounded-xl transition-all duration-500 ease-out shadow-xl" 
                  style={{
                    width: '33.333%',
                    height: 'calc(100% - 12px)',
                    top: '6px',
                    left: `calc(${['monthly', 'annual', 'hourly'].indexOf(pricingMode) * 33.333}% + 6px)`,
                    transform: 'translateX(0)'
                  }}
                />
                
                {['Mensuel', 'Annuel', 'Horaire'].map((mode, index) => {
                  const isActive = pricingMode === ['monthly', 'annual', 'hourly'][index];
                  return (
                    <button
                      key={mode}
                      onClick={() => setPricingMode(['monthly', 'annual', 'hourly'][index] as PricingMode)}
                      className={`relative z-10 px-8 py-4 text-sm font-light rounded-xl transition-all duration-500 min-w-[120px] ${
                        isActive
                          ? 'text-zinc-950 shadow-lg'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <span className="relative z-10">{mode}</span>
                      {mode === 'Annuel' && (
                        <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                          -50%
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grille de Produits Sophistiquée */}
      <section className="py-20 bg-zinc-950">
        <div className="container mx-auto px-8">
          <div className="max-w-7xl mx-auto">
            
            <div className={`text-center mb-12 transition-all duration-1000 delay-900 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <p className="text-zinc-500 text-sm">
                {filteredProducts.length} configuration{filteredProducts.length > 1 ? 's' : ''} disponible{filteredProducts.length > 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => {
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
                    return '/GB/mois';
                  }
                  switch (pricingMode) {
                    case 'hourly': return '/h';
                    case 'monthly': return '/mois';
                    case 'annual': return '/mois*';
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

                return (
                <div
                  key={`${product.category}-${index}`}
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
                  </div>
                  
                  {/* Specs Section Sophistiquée */}
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-3 h-px bg-gradient-to-r from-zinc-600 to-transparent"></div>
                      <span className="text-xs text-zinc-500 uppercase tracking-wider font-light">Spécifications</span>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        product.vcpu && { label: 'CPU', value: product.vcpu },
                        product.gpu && { label: 'GPU', value: product.gpu },
                        product.ram && { label: 'RAM', value: product.ram },
                        product.storage && { label: 'Storage', value: product.storage },
                        product.bandwidth && { label: 'Bande passante', value: product.bandwidth },
                        product.sites && { label: 'Sites', value: product.sites },
                        product.containers && { label: 'Containers', value: product.containers }
                      ].filter(Boolean).slice(0, 3).map((spec, specIndex) => (
                        <div key={specIndex} className="flex items-center justify-between py-2 border-b border-zinc-800/30 last:border-b-0">
                          <span className="text-sm text-zinc-400 font-light">{spec.label}</span>
                          <span className="text-sm text-zinc-300 font-mono tracking-tight bg-zinc-800/20 px-2 py-1 rounded text-xs">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button Sophistiqué */}
                  <div className="relative">
                    <button className="w-full bg-white text-zinc-950 py-3 px-4 rounded-xl text-sm font-light tracking-wide transition-all duration-500 hover:bg-zinc-100 hover:shadow-xl hover:shadow-white/20 group-hover:transform group-hover:scale-[1.02] relative overflow-hidden">
                      <span className="relative z-10">Choisir cette configuration</span>
                      
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    </button>
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
          </div>
        </div>
      </section>
      
      <div className={`transition-all duration-1000 delay-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <Footer />
      </div>
    </div>
  );
}