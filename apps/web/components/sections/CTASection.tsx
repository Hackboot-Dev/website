'use client';
import Link from 'next/link';
import { useRevealAnimation } from '../../hooks/useAwwardsAnimation';
import { useLanguage } from '../../contexts/LanguageContext';

export default function CTASection() {
  const { t } = useLanguage();
  const titleReveal = useRevealAnimation({ delay: 100 });
  const contentReveal = useRevealAnimation({ delay: 300 });
  const ctaReveal = useRevealAnimation({ delay: 500 });

  return (
    <section className="relative py-16 sm:py-24 lg:py-32 bg-zinc-950 overflow-hidden">
      {/* Geometric background elements - CTA specific - responsive */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="hidden sm:block absolute top-1/4 left-1/4 w-px h-32 bg-gradient-to-b from-transparent via-zinc-400 to-transparent"></div>
        <div className="hidden sm:block absolute bottom-1/4 right-1/3 w-24 h-px bg-gradient-to-r from-transparent via-zinc-400 to-transparent"></div>
        <div className="hidden md:block absolute top-1/2 right-1/4 w-1 h-1 bg-zinc-400 rounded-full animate-subtle-float"></div>
        {/* Unique pattern for CTA - hidden on mobile */}
        <div className="hidden lg:block absolute top-1/3 left-1/2 w-16 h-16 border border-zinc-700/30 rounded-full"></div>
        <div className="hidden lg:block absolute bottom-1/3 right-1/2 w-8 h-8 border border-zinc-600/40 rounded-full animate-subtle-float" style={{ animationDelay: '2s' }}></div>
        {/* Noise texture for final section */}
        <div className="absolute inset-0 bg-noise opacity-[0.03]"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          {/* Two-column layout */}
          <div className="grid grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center">
            
            {/* Left side - Content */}
            <div className="col-span-12 lg:col-span-7">
              
              {/* Label */}
              <div className="mb-8">
                <span className="text-xs tracking-[0.3em] text-zinc-500 font-mono">
                  {t('cta.label')}
                </span>
              </div>

              {/* Title */}
              <div 
                ref={titleReveal.elementRef}
                style={titleReveal.style}
                className="mb-8"
              >
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight tracking-tight text-white leading-[1.1]">
                  {t('cta.title.1')}
                  <span className="block text-gradient-subtle">
                    {t('cta.title.2')}
                  </span>
                </h2>
              </div>

              {/* Description */}
              <div 
                ref={contentReveal.elementRef}
                style={contentReveal.style}
                className="mb-12"
              >
                <p className="text-base sm:text-lg text-zinc-400 max-w-lg leading-relaxed font-light">
                  {t('cta.subtitle')}
                </p>
              </div>

              {/* CTA Buttons */}
              <div 
                ref={ctaReveal.elementRef}
                style={ctaReveal.style}
                className="flex flex-col sm:flex-row gap-6"
              >
                <Link 
                  href="/demo"
                  className="group flex items-center space-x-4 text-white hover:text-zinc-300 transition-colors duration-300"
                >
                  <span className="text-sm tracking-wide">{t('cta.primary')}</span>
                  <div className="w-16 h-px bg-white group-hover:w-20 transition-all duration-300"></div>
                  <div className="w-1 h-1 bg-white rounded-full group-hover:w-1.5 group-hover:h-1.5 transition-all duration-300"></div>
                </Link>
                
                <Link 
                  href="/pricing"
                  className="text-sm text-zinc-500 hover:text-zinc-300 tracking-wide transition-colors duration-300 relative"
                >
                  <span>{t('cta.secondary')}</span>
                  <div className="absolute bottom-0 left-0 w-0 h-px bg-zinc-400 hover:w-full transition-all duration-300"></div>
                </Link>
              </div>

            </div>

            {/* Right side - Stats/Features */}
            <div className="col-span-12 lg:col-span-5">
              <div className="space-y-12">
                
                {/* Key points */}
                <div className="space-y-6">
                  <div className="flex justify-between items-end border-b border-zinc-800 pb-3 hover:border-zinc-600 transition-colors duration-300">
                    <span className="text-xs text-zinc-500 tracking-wider">{t('cta.metrics.infrastructure') || 'Infrastructure'}</span>
                    <span className="text-xl font-light text-white">{t('cta.metrics.enterprise') || 'Enterprise'}</span>
                  </div>

                  <div className="flex justify-between items-end border-b border-zinc-800 pb-3 hover:border-zinc-600 transition-colors duration-300">
                    <span className="text-xs text-zinc-500 tracking-wider">{t('cta.metrics.support') || 'Support'}</span>
                    <span className="text-xl font-light text-white">24/7</span>
                  </div>

                  <div className="flex justify-between items-end border-b border-zinc-800 pb-3 hover:border-zinc-600 transition-colors duration-300">
                    <span className="text-xs text-zinc-500 tracking-wider">{t('cta.metrics.location') || 'Datacenters'}</span>
                    <span className="text-xl font-light text-white">{t('cta.metrics.europe') || 'Europe'}</span>
                  </div>
                </div>

                {/* Features list */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-zinc-400 hover:text-zinc-300 transition-colors duration-300">
                    <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
                    <span className="text-sm tracking-wide">{t('cta.features.config')}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-zinc-400 hover:text-zinc-300 transition-colors duration-300">
                    <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                    <span className="text-sm tracking-wide">{t('cta.features.scaling')}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-zinc-400 hover:text-zinc-300 transition-colors duration-300">
                    <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                    <span className="text-sm tracking-wide">{t('cta.features.monitoring')}</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}