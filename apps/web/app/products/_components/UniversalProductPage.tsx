'use client';

// /workspaces/website/apps/web/app/products/_components/UniversalProductPage.tsx
// Description: Universal dynamic product page with exact VPSPremiumPage design
// Last modified: 2025-08-26
// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

import { useState, useMemo } from 'react';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import SophisticatedBackground from '../../../components/animations/SophisticatedBackground';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useRevealAnimation, useStaggerReveal } from '../../../hooks/useAwwardsAnimation';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { CPUIcon, RAMIcon, StorageIcon, NetworkIcon, CheckIcon } from '../../../components/ui/Icons';
import SpecsModal from '../../../components/ui/SpecsModal';
import displayConfig from '../../../data/products/display-config.json';

type PricingMode = 'hourly' | 'monthly' | 'annual';

interface UniversalProductPageProps {
  product: any;
  category: string;
  allProducts: any[];
}

interface ModalState {
  isOpen: boolean;
  category: string;
  specs: Array<{ name: string; value: string; }>;
}

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  'CPU': CPUIcon,
  'RAM': RAMIcon,
  'Storage': StorageIcon,
  'Network': NetworkIcon,
};

export default function UniversalProductPage({ product, category }: UniversalProductPageProps) {
  const { t, language } = useLanguage();
  const [pricingMode, setPricingMode] = useState<PricingMode>('monthly');
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    category: '',
    specs: []
  });
  
  // Modal handlers
  const openSpecsModal = (section: any) => {
    const translatedSpecs = section.specs.map((spec: any) => ({
      name: language === 'fr' && spec.name_fr ? spec.name_fr : spec.name,
      value: language === 'fr' && spec.value_fr ? spec.value_fr : spec.value
    }));
    
    setModalState({
      isOpen: true,
      category: language === 'fr' && section.category_fr ? section.category_fr : section.category,
      specs: translatedSpecs
    });
  };
  
  const closeSpecsModal = () => {
    setModalState({
      isOpen: false,
      category: '',
      specs: []
    });
  };
  
  // Get configuration for this category
  const config = useMemo(() => {
    return (displayConfig as any)[category] || {
      displayName: category.toUpperCase(),
      mainSpecs: [],
      cardSpecs: [],
      contactExpert: false
    };
  }, [category]);

  // Awwwards animations
  const titleReveal = useRevealAnimation({ delay: 100 });
  const subtitleReveal = useRevealAnimation({ delay: 300 });
  const priceReveal = useRevealAnimation({ delay: 500 });

  const getCurrentPrice = () => {
    switch (pricingMode) {
      case 'hourly': return product.hourly;
      case 'annual': return Math.round(product.annual / 12 * 100) / 100;
      default: return product.monthly;
    }
  };

  const getDiscountPercentage = () => {
    const monthlyTotal = product.monthly * 12;
    const annualTotal = product.annual;
    const discount = ((monthlyTotal - annualTotal) / monthlyTotal) * 100;
    return Math.round(discount);
  };

  const getAnnualSavings = () => {
    return (product.monthly * 12) - product.annual;
  };

  // Dynamic specs based on configuration
  const specs = useMemo(() => {
    return config.mainSpecs.map((specConfig: any) => {
      const IconComponent = iconMap[specConfig.icon] || CPUIcon;
      return {
        icon: IconComponent,
        value: product[specConfig.key] || 'N/A',
        label: specConfig.label,
        tech: specConfig.tech,
        detail: specConfig.detail
      };
    });
  }, [config.mainSpecs, product]);

  const { containerRef: specsContainerRef, visibleItems: visibleSpecs } = useStaggerReveal(specs.length, 150);

  const technicalSpecs = config.technicalSections || [];

  const benchmarks = config.benchmarks?.metrics?.map((metric: any) => ({
    test: language === 'fr' && metric.name_fr ? metric.name_fr : metric.name,
    score: metric.value.toLocaleString() + ' ' + (language === 'fr' && metric.unit_fr ? metric.unit_fr : metric.unit),
    percentile: language === 'fr' && metric.comparison_fr ? metric.comparison_fr : metric.comparison
  })) || [];

  // Helper function to get translated items
  const getTranslatedItems = (items: any[]) => {
    if (!items) return [];
    return items.map((item: any) => {
      if (typeof item === 'string') {
        return item;
      }
      return language === 'fr' ? (item.fr || item.en || item) : (item.en || item);
    });
  };

  const securityFeatures = getTranslatedItems(config.security?.items);
  const features = getTranslatedItems(config.features?.items);
  const useCases = getTranslatedItems(config.useCases?.items);

  return (
    <>
      <SophisticatedBackground />
      <Header />
      
      {/* Hero Section with exact VPSPremiumPage design */}
      <section className="relative py-32 overflow-hidden">
        {/* Geometric elements - EXACT COPY from VPSPremiumPage */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/3 w-px h-32 bg-gradient-to-b from-transparent via-zinc-700 to-transparent"></div>
          <div className="absolute bottom-1/3 left-1/4 w-24 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent"></div>
          <div className="absolute inset-0 bg-grid opacity-[0.02]"></div>
          <div className="absolute top-1/3 right-1/5 w-1.5 h-1.5 bg-zinc-700 rounded-full animate-subtle-float"></div>
          <div className="absolute bottom-1/3 left-1/5 w-1 h-1 bg-zinc-600 rounded-full animate-subtle-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
              
              {/* Left: Product Info - 2/3 width */}
              <div className="lg:col-span-2">
                {/* Label */}
                <div className="mb-8">
                  <span className="text-xs tracking-[0.3em] text-zinc-500 font-mono">
                    {product.usage && product.usage !== 'N/A' 
                      ? product.usage.toUpperCase() 
                      : config.displayName.toUpperCase()}
                  </span>
                </div>
                
                {/* Title with animation */}
                <div 
                  ref={titleReveal.elementRef as React.RefObject<HTMLDivElement>}
                  style={titleReveal.style}
                  className="mb-6"
                >
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-extralight tracking-tight text-white leading-[0.9]">
                    {product.name}
                  </h1>
                </div>
                
                {/* Subtitle with animation */}
                <div 
                  ref={subtitleReveal.elementRef as React.RefObject<HTMLDivElement>}
                  style={subtitleReveal.style}
                  className="mb-12"
                >
                  <p className="text-xl text-zinc-400 font-light leading-relaxed max-w-2xl">
                    {product.description !== 'N/A' ? product.description : (
                      language === 'fr' 
                        ? "Description non disponible"
                        : language === 'en'
                        ? "Description not available"
                        : "N/A"
                    )}
                  </p>
                </div>

                {/* Specs Grid with stagger animation - EXACT DESIGN */}
                <div ref={specsContainerRef as React.RefObject<HTMLDivElement>} className="grid grid-cols-2 gap-4">
                  {specs.map((spec, index) => (
                    <div 
                      key={index} 
                      className="group relative bg-zinc-900/30 backdrop-blur border border-zinc-800/50 rounded-lg p-6 hover:bg-zinc-900/50 transition-all duration-500"
                      style={{
                        opacity: visibleSpecs[index] ? 1 : 0,
                        transform: visibleSpecs[index] ? 'translateY(0)' : 'translateY(20px)',
                        transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s`
                      }}
                    >
                      {/* Hover glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-lg"></div>
                      
                      <div className="relative">
                        <spec.icon className="w-5 h-5 text-zinc-400 mb-3" />
                        <div className="text-2xl font-light text-white mb-1">{spec.value}</div>
                        <div className="text-xs text-zinc-500 uppercase tracking-wider mb-2">{spec.label}</div>
                        <div className="text-[10px] text-zinc-600 leading-tight">
                          {spec.tech}<br />
                          {spec.detail}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Pricing Card - 1/3 width */}
              <div className="lg:sticky lg:top-32 h-fit">
                <div 
                  ref={priceReveal.elementRef as React.RefObject<HTMLDivElement>}
                  style={priceReveal.style}
                  className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-8"
                >
                  {/* Pricing toggle - EXACT DESIGN */}
                  <div className="flex bg-zinc-800/50 rounded-xl p-1 mb-8">
                    {['monthly', 'annual', 'hourly'].map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setPricingMode(mode as PricingMode)}
                        className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                          pricingMode === mode
                            ? 'bg-white text-zinc-900'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        {mode === 'monthly' && (language === 'fr' ? 'Mensuel' : 'Monthly')}
                        {mode === 'annual' && (language === 'fr' ? 'Annuel' : 'Annual')}
                        {mode === 'hourly' && (language === 'fr' ? 'Horaire' : 'Hourly')}
                      </button>
                    ))}
                  </div>

                  {/* Price display */}
                  <div className="text-center mb-8">
                    <div className="text-4xl font-extralight text-white mb-2">
                      <span className="text-5xl">{getCurrentPrice()}</span>
                      <span className="text-2xl text-zinc-400">€</span>
                      <span className="text-lg text-zinc-500">
                        {pricingMode === 'hourly' && '/h'}
                        {pricingMode === 'monthly' && (language === 'fr' ? '/mois' : '/mo')}
                        {pricingMode === 'annual' && (language === 'fr' ? '/mois' : '/mo')}
                      </span>
                    </div>
                    
                    {pricingMode === 'annual' && (
                      <div className="space-y-1">
                        <Badge variant="success" className="text-xs">
                          {language === 'fr' 
                            ? `${getDiscountPercentage()}% de réduction`
                            : `Save ${getDiscountPercentage()}%`
                          }
                        </Badge>
                        <p className="text-xs text-zinc-500">
                          {language === 'fr' 
                            ? `${getAnnualSavings()}€ d'économies par an`
                            : `${getAnnualSavings()}€ saved per year`
                          }
                        </p>
                      </div>
                    )}
                  </div>

                  {/* CTA buttons */}
                  <div className="space-y-3">
                    <Button variant="primary" className="w-full">
                      {language === 'fr' ? 'Configurer' : 'Configure'}
                    </Button>
                    {product.trial && (
                      <Button variant="outline" className="w-full">
                        {language === 'fr' ? `Essai ${product.trial}` : `${product.trial} Trial`}
                      </Button>
                    )}
                  </div>

                  {/* Guarantees */}
                  <div className="mt-6 pt-6 border-t border-zinc-800/50 space-y-2">
                    <div className="flex items-center text-sm text-zinc-500">
                      <CheckIcon className="w-4 h-4 text-emerald-400 mr-2" />
                      <span>SLA {product.sla || '99.9%'}</span>
                    </div>
                    <div className="flex items-center text-sm text-zinc-500">
                      <CheckIcon className="w-4 h-4 text-emerald-400 mr-2" />
                      <span>24/7 Support</span>
                    </div>
                    <div className="flex items-center text-sm text-zinc-500">
                      <CheckIcon className="w-4 h-4 text-emerald-400 mr-2" />
                      <span>{language === 'fr' ? 'Migration gratuite' : 'Free migration'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specifications - EXACT DESIGN */}
      {technicalSpecs.length > 0 && (
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-grid opacity-[0.02]"></div>
            <div className="absolute top-1/2 left-1/3 w-64 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>
          </div>

          <div className="container mx-auto px-8 relative z-10">
            <div className="max-w-7xl mx-auto">
              <div className="mb-16 text-center">
                <h2 className="text-4xl font-extralight text-white mb-4">
                  {language === 'fr' ? 'Spécifications Techniques' : 'Technical Specifications'}
                </h2>
                <p className="text-lg text-zinc-400">
                  {language === 'fr' ? 'Performance et fiabilité garanties' : 'Guaranteed performance and reliability'}
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {technicalSpecs.map((section: any, index) => (
                  <div key={index} className="bg-zinc-900/30 backdrop-blur border border-zinc-800/50 rounded-xl p-6 overflow-hidden">
                    <h3 className="text-lg font-medium text-white mb-6 truncate" title={section.category}>
                      {language === 'fr' && section.category_fr ? section.category_fr : section.category}
                    </h3>
                    <div className="space-y-3">
                      {section.specs.slice(0, 5).map((spec: any, specIndex: number) => (
                        <div key={specIndex} className="group">
                          <div className="flex flex-col space-y-0.5">
                            <span className="text-xs text-zinc-500 uppercase tracking-wide truncate" title={spec.name}>
                              {language === 'fr' && spec.name_fr ? spec.name_fr : spec.name}
                            </span>
                            <span className="text-xs text-white/90 font-medium truncate" title={spec.value}>
                              {language === 'fr' && spec.value_fr ? spec.value_fr : spec.value}
                            </span>
                          </div>
                        </div>
                      ))}
                      {section.specs.length > 5 && (
                        <div className="pt-2 border-t border-zinc-800/50">
                          <button
                            onClick={() => openSpecsModal(section)}
                            className="text-xs text-zinc-500 hover:text-blue-400 transition-colors cursor-pointer group flex items-center gap-1"
                          >
                            <span className="group-hover:underline">
                              {language === 'fr' 
                                ? `+${section.specs.length - 5} de plus` 
                                : `+${section.specs.length - 5} more`}
                            </span>
                            <svg 
                              className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Performance Benchmarks - EXACT DESIGN */}
      {benchmarks.length > 0 && (
        <section className="py-32 bg-zinc-900/20">
          <div className="container mx-auto px-8">
            <div className="max-w-7xl mx-auto">
              <div className="mb-16 text-center">
                <h2 className="text-4xl font-extralight text-white mb-4">
                  {language === 'fr' 
                    ? (config.benchmarks?.title_fr || config.benchmarks?.title || 'Benchmarks de Performance')
                    : (config.benchmarks?.title || 'Performance Benchmarks')}
                </h2>
                <p className="text-lg text-zinc-400">
                  {language === 'fr'
                    ? (config.benchmarks?.subtitle_fr || config.benchmarks?.subtitle || 'Métriques de performance de pointe')
                    : (config.benchmarks?.subtitle || 'Industry-leading performance metrics')}
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {benchmarks.map((benchmark, index) => (
                  <div key={index} className="text-center group">
                    <div className="text-3xl font-extralight text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {benchmark.score}
                    </div>
                    <div className="text-sm text-zinc-400 mb-1">{benchmark.test}</div>
                    <div className="text-xs text-zinc-600">{benchmark.percentile}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Security & Compliance - EXACT DESIGN */}
      {securityFeatures.length > 0 && (
        <section className="py-32 relative overflow-hidden">
          <div className="container mx-auto px-8">
            <div className="max-w-7xl mx-auto">
              <div className="mb-16 text-center">
                <h2 className="text-4xl font-extralight text-white mb-4">
                  {language === 'fr'
                    ? (config.security?.title_fr || config.security?.title || 'Sécurité & Conformité')
                    : (config.security?.title || 'Security & Compliance')}
                </h2>
                <p className="text-lg text-zinc-400">
                  {language === 'fr'
                    ? (config.security?.subtitle_fr || config.security?.subtitle || 'Sécurité de niveau entreprise')
                    : (config.security?.subtitle || 'Enterprise-grade security')}
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {securityFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckIcon className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-sm text-zinc-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Contact Expert Section */}
      {config.contactExpert && config.contactExpertText && (
        <section className="py-32 bg-gradient-to-b from-zinc-900/20 to-transparent">
          <div className="container mx-auto px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-extralight text-white mb-6">
                {language === 'fr' ? 'Besoin d\'assistance ?' : 'Need assistance?'}
              </h2>
              <p className="text-lg text-zinc-400 mb-8">
                {config.contactExpertText}
              </p>
              <Button variant="outline" className="mx-auto">
                {language === 'fr' ? 'Parler à un expert' : 'Talk to an expert'}
              </Button>
            </div>
          </div>
        </section>
      )}

      <Footer />
      
      {/* Specs Modal */}
      <SpecsModal
        isOpen={modalState.isOpen}
        onClose={closeSpecsModal}
        category={modalState.category}
        specs={modalState.specs}
        language={language}
      />
    </>
  );
}