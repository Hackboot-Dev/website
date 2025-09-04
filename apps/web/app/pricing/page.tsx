// /workspaces/website/apps/web/app/pricing/page.tsx
// Description: Comprehensive pricing page with billing models and product comparator
// Last modified: 2025-08-27
// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

'use client';

import '../../styles/custom-select.css';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { useLanguage } from '../../contexts/LanguageContext';
import { useRevealAnimation, useStaggerReveal } from '../../hooks/useAwwardsAnimation';
import { CheckIcon, ArrowRightIcon, CPUIcon, ClockIcon, CalendarIcon, TrophyIcon } from '../../components/ui/Icons';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ProductComparator from '../../components/pricing/ProductComparator';
import SophisticatedBackground from '../../components/animations/SophisticatedBackground';
import productsData from '../../data/products/base.json';

// Load translations
const loadTranslations = (lang: string) => {
  try {
    return require(`../../data/translations/pricing/${lang}.json`);
  } catch (error) {
    console.warn(`Pricing translations for ${lang} not found, falling back to English`);
    return require('../../data/translations/pricing/en.json');
  }
};

type PricingModel = 'hourly' | 'monthly' | 'annual';

export default function PricingPage() {
  const { language } = useLanguage();
  const [translations, setTranslations] = useState<any>({});
  const [selectedModel, setSelectedModel] = useState<PricingModel>('monthly');
  const [usageHours, setUsageHours] = useState(720); // Default full month
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedProductCategory, setSelectedProductCategory] = useState<string>('vps');

  // Load translations based on language
  useEffect(() => {
    const loadedTranslations = loadTranslations(language || 'fr');
    setTranslations(loadedTranslations.pricing || {});
  }, [language]);

  const t = (key: string) => {
    const keys = key.split('.');
    let value = translations;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  // Animations
  const heroReveal = useRevealAnimation({ delay: 100 });
  const modelsReveal = useRevealAnimation({ delay: 300 });
  const { containerRef: modelsContainerRef, visibleItems: visibleModels } = useStaggerReveal(3, 150);

  // Get all products flat list
  const allProducts = Object.values(productsData).flat();
  
  // Calculate prices based on selected product
  const calculatePrices = () => {
    if (!selectedProduct) return null;
    
    const hourlyTotal = selectedProduct.hourly ? selectedProduct.hourly * usageHours : null;
    const monthlyTotal = selectedProduct.monthly || null;
    const annualTotal = selectedProduct.annual || null;
    
    return {
      hourly: hourlyTotal?.toFixed(2),
      monthly: monthlyTotal?.toFixed(2),
      annual: annualTotal?.toFixed(2),
      monthlySavings: hourlyTotal && monthlyTotal ? 
        ((hourlyTotal - monthlyTotal) / hourlyTotal * 100).toFixed(0) : '20',
      annualSavings: monthlyTotal && annualTotal ? 
        (((monthlyTotal * 12) - annualTotal) / (monthlyTotal * 12) * 100).toFixed(0) : '17'
    };
  };

  const examplePrices = calculatePrices();

  const pricingModels = [
    {
      id: 'hourly',
      icon: ClockIcon,
      color: 'blue' as const,
      ...translations.models?.hourly
    },
    {
      id: 'monthly',
      icon: CalendarIcon,
      color: 'emerald' as const,
      ...translations.models?.monthly
    },
    {
      id: 'annual',
      icon: TrophyIcon,
      color: 'purple' as const,
      ...translations.models?.annual
    }
  ];

  return (
    <div className="overflow-x-hidden">
      <SophisticatedBackground />
      <Header />
      <main className="overflow-x-hidden relative">
        {/* Hero Section */}
      <section className="pt-32 pb-12 sm:pt-36 sm:pb-16 lg:pt-40 lg:pb-24 overflow-hidden relative">

        <div 
          ref={heroReveal.elementRef as any}
          style={heroReveal.style}
          className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20"
        >
          <div className="text-center max-w-4xl mx-auto relative">
            <Badge variant="outline" className="mb-4 sm:mb-6 inline-block relative z-20">
              {t('hero.badge')}
            </Badge>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extralight tracking-tight text-white mb-4 px-4">
              {t('hero.title')}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400">
                {t('hero.subtitle')}
              </span>
            </h1>
            
            <p className="text-sm sm:text-base lg:text-lg text-zinc-400 max-w-3xl mx-auto font-light px-4">
              {t('hero.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Models Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={modelsReveal.elementRef as any}
            style={modelsReveal.style}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extralight text-white mb-4">
              {t('models.title')}
            </h2>
            <p className="text-zinc-400 text-base sm:text-lg">
              {t('models.subtitle')}
            </p>
          </div>

          <div 
            ref={modelsContainerRef as any}
            className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto px-4 sm:px-6"
          >
            {pricingModels.map((model, index) => (
              <div
                key={model.id}
                className={`relative group ${visibleModels[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{
                  transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: `${index * 150}ms`
                }}
              >
                <div className="h-full p-6 sm:p-8 rounded-2xl border bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 transition-all duration-500 flex flex-col">
                  {/* Header */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <model.icon className="w-8 h-8 text-white/80" />
                      {model.savings && (
                        <Badge variant="success" size="sm">
                          {model.savings}
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="text-2xl font-light text-white mb-2">
                      {model.name}
                    </h3>
                    <p className="text-sm text-zinc-500">
                      {model.tagline}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-zinc-400 mb-6 min-h-[48px]">
                    {model.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-3 mb-8 flex-grow">
                    {model.features?.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <CheckIcon className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-zinc-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Best for */}
                  <div className="pt-6 border-t border-zinc-800 mt-auto">
                    <p className="text-xs text-zinc-500 mb-2">{t('models.bestForLabel')}</p>
                    <p className="text-sm text-zinc-300">{model.bestFor}</p>
                    {model.example && (
                      <p className="text-xs text-zinc-500 mt-3">
                        {t('models.exampleLabel')} {model.example}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">
                {t('calculator.badge') || 'Calculateur interactif'}
              </Badge>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-4 px-4">
                {t('calculator.title') || 'Estimez vos économies'}
              </h2>
              <p className="text-zinc-400 max-w-2xl mx-auto">
                {t('calculator.subtitle') || 'Sélectionnez un produit et ajustez votre utilisation pour voir les économies potentielles avec nos différents modes de facturation'}
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-zinc-800 backdrop-blur">
              {/* Product Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    {t('calculator.productCategory') || 'Catégorie de produit'}
                  </label>
                  <select
                    value={selectedProductCategory}
                    onChange={(e) => {
                      setSelectedProductCategory(e.target.value);
                      setSelectedProduct(null);
                    }}
                    style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none' }}
                    className="custom-select w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors text-white"
                  >
                    {Object.keys(productsData).map(cat => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    {t('calculator.specificProduct') || 'Produit spécifique'}
                  </label>
                  <select
                    value={selectedProduct?.id || ''}
                    onChange={(e) => {
                      const product = allProducts.find(p => p.id === e.target.value);
                      setSelectedProduct(product);
                    }}
                    style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none' }}
                    className="custom-select w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors text-white"
                  >
                    <option value="">{t('calculator.selectProduct') || 'Sélectionner un produit'}</option>
                    {(productsData as any)[selectedProductCategory]?.map((product: any) => (
                      <option key={product.id} value={product.id}>
                        {product.name} - {product.vcpu || product.cpu} / {product.ram} / {product.storage}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Product Info Display */}
              {selectedProduct && (
                <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-zinc-800/30 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">{selectedProduct.name}</h3>
                    <Badge variant="primary">{selectedProduct.tier}</Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm">
                    <div>
                      <span className="text-zinc-500">{t('calculator.specs.cpu') || 'Processeur'}:</span>
                      <span className="text-zinc-300 ml-2">{selectedProduct.vcpu || selectedProduct.cpu}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500">{t('calculator.specs.ram') || 'Mémoire'}:</span>
                      <span className="text-zinc-300 ml-2">{selectedProduct.ram}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500">{t('calculator.specs.storage') || 'Stockage'}:</span>
                      <span className="text-zinc-300 ml-2">{selectedProduct.storage}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500">{t('calculator.specs.network') || 'Réseau'}:</span>
                      <span className="text-zinc-300 ml-2">{selectedProduct.bandwidth}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Usage slider */}
              {selectedProduct?.hourly && (
                <div className="mb-8">
                  <label className="flex justify-between items-center mb-4">
                    <span className="text-zinc-300">{t('calculator.estimatedUsage') || 'Utilisation estimée'}</span>
                    <span className="text-white font-mono text-lg">
                      {usageHours} {t('calculator.hoursMonth') || 'heures/mois'}
                    </span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="720"
                    value={usageHours}
                    onChange={(e) => setUsageHours(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-zinc-500 mt-2 gap-1">
                    <span>1h</span>
                    <span className="hidden sm:inline">180h (1 semaine)</span>
                    <span className="hidden sm:inline">360h (2 semaines)</span>
                    <span>720h</span>
                  </div>
                </div>
              )}

              {/* Price comparison */}
              {selectedProduct && examplePrices && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  {selectedProduct.hourly && (
                    <div className="relative p-4 sm:p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl border border-blue-500/20">
                      <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                        <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                      </div>
                      <p className="text-sm font-medium text-blue-400 mb-2">{t('calculator.hourlyBilling') || 'Facturation Horaire'}</p>
                      <p className="text-3xl font-light text-white mb-1">€{examplePrices.hourly}</p>
                      <p className="text-xs text-zinc-400">{t('calculator.forUsage') || 'pour'} {usageHours}{t('calculator.hoursUsage') || 'h d\'utilisation'}</p>
                      <p className="text-xs text-zinc-500 mt-2">€{selectedProduct.hourly}{t('calculator.perHour') || '/heure'}</p>
                    </div>
                  )}
                  
                  {selectedProduct.monthly && (
                    <div className="relative p-4 sm:p-6 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 rounded-xl border border-emerald-500/20">
                      <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                        <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                      </div>
                      <p className="text-sm font-medium text-emerald-400 mb-2">{t('calculator.monthlySubscription') || 'Abonnement Mensuel'}</p>
                      <p className="text-3xl font-light text-white mb-1">€{selectedProduct.monthly}</p>
                      <p className="text-xs text-zinc-400">{t('calculator.perMonthUnlimited') || 'par mois, usage illimité'}</p>
                      {examplePrices.monthlySavings && parseInt(examplePrices.monthlySavings) > 0 && (
                        <p className="text-xs text-emerald-400 mt-2">{t('calculator.savingsOf') || 'Économie de'} {examplePrices.monthlySavings}%</p>
                      )}
                    </div>
                  )}
                  
                  {selectedProduct.annual && (
                    <div className="relative p-4 sm:p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-xl border border-purple-500/20">
                      <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                        <TrophyIcon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                      </div>
                      <p className="text-sm font-medium text-purple-400 mb-2">{t('calculator.annualCommitment') || 'Engagement Annuel'}</p>
                      <p className="text-3xl font-light text-white mb-1">€{selectedProduct.annual}</p>
                      <p className="text-xs text-zinc-400">{t('calculator.perYearBonus') || 'par an (2 mois offerts)'}</p>
                      {examplePrices.annualSavings && parseInt(examplePrices.annualSavings) > 0 && (
                        <p className="text-xs text-purple-400 mt-2">{t('calculator.savingsOf') || 'Économie de'} {examplePrices.annualSavings}%</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Call to action if no product selected */}
              {!selectedProduct && (
                <div className="text-center py-12">
                  <p className="text-zinc-400 mb-4">{t('calculator.noProductSelected') || 'Sélectionnez un produit pour voir les économies potentielles'}</p>
                  <Link href="/products">
                    <Button variant="secondary" size="md">
                      {t('calculator.viewAllProducts') || 'Voir tous les produits'}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Product Comparator Section - Redesigned */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">
                {translations.comparator?.badge || 'Outil de comparaison'}
              </Badge>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-4 px-4">
                {translations.comparator?.title || 'Comparez nos offres'}
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto px-4">
                {translations.comparator?.subtitle || 'Analysez côte à côte deux produits de la même catégorie pour faire le meilleur choix selon vos besoins'}
              </p>
            </div>
            
            <ProductComparator translations={translations} locale={language || 'fr'} />
          </div>
        </div>
      </section>

      {/* Billing Details */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-light text-white mb-8 sm:mb-12 text-center px-4">
              {t('billing.title')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {/* Payment Methods */}
              <div className="bg-zinc-900/60 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-zinc-800">
                <h3 className="text-lg text-white mb-4">{t('billing.sections.payment.title')}</h3>
                <ul className="space-y-3">
                  {translations.billing?.sections?.payment?.methods?.map((method: string, idx: number) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <CheckIcon className="w-5 h-5 text-zinc-400 mt-0.5" />
                      <span className="text-sm text-zinc-300">{method}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Billing Cycle */}
              <div className="bg-zinc-900/60 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-zinc-800">
                <h3 className="text-lg text-white mb-4">{t('billing.sections.billing.title')}</h3>
                <ul className="space-y-3">
                  {translations.billing?.sections?.billing?.details?.map((detail: string, idx: number) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <div className="w-1 h-1 bg-zinc-400 rounded-full mt-2"></div>
                      <span className="text-sm text-zinc-300">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Guarantees */}
              <div className="bg-zinc-900/60 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-zinc-800">
                <h3 className="text-lg text-white mb-4">{t('billing.sections.guarantees.title')}</h3>
                <ul className="space-y-3">
                  {translations.billing?.sections?.guarantees?.items?.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <CheckIcon className="w-5 h-5 text-emerald-400 mt-0.5" />
                      <span className="text-sm text-zinc-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-light text-white mb-8 sm:mb-12 text-center px-4">
              {t('faq.title')}
            </h2>

            <div className="space-y-6">
              {translations.faq?.items?.map((item: any, idx: number) => (
                <details key={idx} className="group">
                  <summary className="flex justify-between items-center cursor-pointer p-4 sm:p-6 bg-zinc-900/40 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors">
                    <span className="text-white pr-4">{item.question}</span>
                    <span className="text-zinc-400 group-open:rotate-180 transition-transform">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-6 pt-4 text-zinc-400">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-4 px-4">
            {t('cta.title')}
          </h2>
          <p className="text-zinc-400 mb-8 max-w-2xl mx-auto">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button variant="primary" size="lg" icon={<ArrowRightIcon />}>
                {t('cta.buttons.viewProducts')}
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="secondary" size="lg">
                {t('cta.buttons.contact')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
      </main>
      <Footer />
    </div>
  );
}
