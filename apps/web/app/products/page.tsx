'use client';
// /workspaces/website/apps/web/app/products/page.tsx
// Description: Page principale des produits avec toggles et design Awwwards
// Last modified: 2025-08-16
// Related docs: /docs/JOURNAL.md

// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import productsData from '../../data/products.json';
import ProductCard from '../../components/products/ProductCard';
import CategoryToggle from '../../components/products/CategoryToggle';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

type Category = 'all' | 'vps' | 'gpu' | 'webhosting' | 'paas' | 'loadbalancer' | 'storage' | 'cdn';
type PricingMode = 'monthly' | 'annual' | 'hourly';

export default function ProductsPage() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [pricingMode, setPricingMode] = useState<PricingMode>('monthly');

  const getTotalProductCount = () => {
    return Object.values(productsData).reduce((total, category) => total + category.length, 0);
  };

  const categories = [
    {
      key: 'all' as Category,
      name: 'Tous les produits',
      count: getTotalProductCount()
    },
    {
      key: 'vps' as Category,
      name: t('products.categories.vps.name'),
      count: productsData.vps.length
    },
    {
      key: 'gpu' as Category,
      name: t('products.categories.gpu.name'),
      count: productsData.gpu.length
    },
    {
      key: 'webhosting' as Category,
      name: t('products.categories.webhosting.name'),
      count: productsData.webhosting.length
    },
    {
      key: 'paas' as Category,
      name: 'Platform as a Service',
      count: productsData.paas.length
    },
    {
      key: 'loadbalancer' as Category,
      name: 'Load Balancer',
      count: productsData.loadbalancer.length
    },
    {
      key: 'storage' as Category,
      name: 'Stockage',
      count: productsData.storage.length
    },
    {
      key: 'cdn' as Category,
      name: 'CDN',
      count: productsData.cdn.length
    }
  ];

  const pricingModes = [
    { key: 'monthly' as PricingMode, label: 'Mensuel', suffix: '/mois' },
    { key: 'annual' as PricingMode, label: 'Annuel', suffix: '/an' },
    { key: 'hourly' as PricingMode, label: 'Horaire', suffix: '/h' }
  ];

  const getFilteredProducts = () => {
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
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
        {/* Geometric background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-px h-32 bg-gradient-to-b from-transparent via-zinc-600 to-transparent"></div>
          <div className="absolute bottom-1/3 left-1/4 w-24 h-px bg-gradient-to-r from-transparent via-zinc-600 to-transparent"></div>
          <div className="absolute top-1/3 left-1/6 w-2 h-2 bg-zinc-700 rounded-full animate-subtle-float"></div>
        </div>

        <div className="container mx-auto px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <span className="text-xs tracking-[0.3em] text-zinc-500 font-mono">
                NOS SOLUTIONS
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extralight tracking-tight text-white leading-[0.9] mb-6">
              {t('products.title')}
            </h1>
            
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto font-light">
              {t('products.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Explanation Section */}
      <section className="py-12 bg-zinc-900/30 border-b border-zinc-800/50">
        <div className="container mx-auto px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Hourly */}
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-white font-medium mb-2">Facturation Horaire</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Payez à l'usage réel. Démarrez et arrêtez quand vous voulez. 
                  Parfait pour développement, tests et charges variables.
                </p>
                <div className="mt-3 text-xs text-zinc-500">
                  💳 Débit automatique • 🔄 Start/Stop libre
                </div>
              </div>

              {/* Monthly */}
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📅</span>
                </div>
                <h3 className="text-white font-medium mb-2">Abonnement Mensuel</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Prix fixe mensuel. Ressources garanties 24/7. 
                  Idéal pour production et applications critiques.
                </p>
                <div className="mt-3 text-xs text-zinc-500">
                  💰 Prix stable • 🛡️ SLA garanti • 📈 ~30% d'économies
                </div>
              </div>

              {/* Annual */}
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💎</span>
                </div>
                <h3 className="text-white font-medium mb-2">Engagement Annuel</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Réservation longue durée. Jusqu'à 50% d'économies. 
                  Ressources dédiées et support prioritaire.
                </p>
                <div className="mt-3 text-xs text-zinc-500">
                  🏆 Support prioritaire • 💸 Max économies • 🔒 Ressources réservées
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Controls Section */}
      <section className="py-12 bg-zinc-950 border-b border-zinc-800/50">
        <div className="container mx-auto px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-8 lg:space-y-0">
              
              {/* Category Toggles */}
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <CategoryToggle
                    key={category.key}
                    name={category.name}
                    count={category.count}
                    isActive={selectedCategory === category.key}
                    onClick={() => setSelectedCategory(category.key)}
                  />
                ))}
              </div>

              {/* Pricing Mode Toggle */}
              <div className="flex flex-col space-y-3">
                <div className="flex items-center bg-zinc-900/50 rounded-lg p-1 border border-zinc-800/50">
                  {pricingModes.map((mode) => (
                    <button
                      key={mode.key}
                      onClick={() => setPricingMode(mode.key)}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                        pricingMode === mode.key
                          ? 'bg-white text-zinc-950 shadow-sm'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
                
                {/* Pricing Explanation */}
                <div className="text-xs text-zinc-500 max-w-md">
                  {pricingMode === 'hourly' && (
                    "💡 Facturation à l'usage - Payez uniquement ce que vous consommez, parfait pour les tests et charges variables."
                  )}
                  {pricingMode === 'monthly' && (
                    "📅 Engagement mensuel - Prix fixe, ressources garanties 24/7, idéal pour la production."
                  )}
                  {pricingMode === 'annual' && (
                    "💰 Engagement annuel - Jusqu'à 50% d'économies, ressources réservées, facturation annuelle."
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20 bg-zinc-950">
        <div className="container mx-auto px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {getFilteredProducts().map((product, index) => (
                <ProductCard
                  key={`${product.category}-${index}`}
                  product={product}
                  pricingMode={pricingMode}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-zinc-950 via-zinc-800 to-zinc-900">
        <div className="container mx-auto px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extralight tracking-tight text-white leading-[1.1] mb-6">
              Besoin d'aide pour choisir ?
            </h2>
            <p className="text-lg text-zinc-400 mb-8 font-light max-w-2xl mx-auto">
              Notre équipe d'experts est là pour vous conseiller et trouver la solution parfaite pour votre projet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group flex items-center justify-center space-x-3 text-white hover:text-zinc-300 transition-colors duration-300 px-6 py-3">
                <span className="text-sm tracking-wide">Parler à un expert</span>
                <div className="w-12 h-px bg-white group-hover:w-16 transition-all duration-300"></div>
              </button>
              <button className="text-sm text-zinc-500 hover:text-zinc-300 tracking-wide transition-colors duration-300 px-6 py-3">
                Voir la documentation
              </button>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}