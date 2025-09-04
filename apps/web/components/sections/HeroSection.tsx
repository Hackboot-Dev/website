'use client';
import Link from 'next/link';
import { useParallax } from '../../hooks/useAwwardsAnimation';
import { useEntryAnimation, useStaggerEntry } from '../../hooks/useEntryAnimation';
import { useLanguage } from '../../contexts/LanguageContext';

export default function HeroSection() {
  const { t } = useLanguage();
  
  // Animations d'entrée au chargement pour le hero
  const titleReveal = useEntryAnimation({ delay: 100 });
  const subtitleReveal = useEntryAnimation({ delay: 300 });
  const ctaReveal = useEntryAnimation({ delay: 500 });
  const { visibleItems } = useStaggerEntry(3, 150, 600); // 3 métriques, 150ms de délai, commence à 600ms
  const statusReveal = useEntryAnimation({ delay: 950 });
  const scrollReveal = useEntryAnimation({ delay: 1100 });
  const geometryParallax = useParallax(0.3);

  return (
    <section className="relative min-h-screen bg-zinc-950 overflow-hidden">
      {/* Subtle noise texture */}
      <div className="absolute inset-0 opacity-[0.15] bg-noise"></div>
      
      {/* Geometric accent avec parallaxe - hidden on mobile */}
      <div 
        ref={geometryParallax.elementRef}
        className="hidden lg:block absolute top-0 right-0 w-1/3 h-full"
        style={geometryParallax.style}
      >
        <div className="absolute top-32 right-16 w-px h-64 bg-gradient-to-b from-transparent via-zinc-600 to-transparent transition-all duration-700 hover:via-zinc-400"></div>
        <div className="absolute top-32 right-32 w-16 h-px bg-gradient-to-r from-transparent via-zinc-600 to-transparent transition-all duration-700 hover:via-zinc-400"></div>
        <div className="absolute top-48 right-24 w-1 h-1 bg-zinc-500 rounded-full animate-subtle-float"></div>
      </div>

      <div className="relative z-10 h-screen flex items-center pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-12 gap-8 items-center">
            
            {/* Left side - Main content */}
            <div className="col-span-12 lg:col-span-7">
              

              {/* Main title avec animations */}
              <div 
                ref={titleReveal.elementRef}
                className="space-y-4 mb-12"
                style={titleReveal.style}
              >
                <h1 aria-label={`${t('hero.title.1')} ${t('hero.title.2')} ${t('hero.title.3')}`}>
                  <div className="overflow-hidden">
                    <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extralight tracking-tight text-white leading-[0.9] hover:tracking-wide transition-all duration-500">
                      {t('hero.title.1')}
                    </span>
                  </div>
                  <div className="overflow-hidden">
                    <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extralight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 leading-[0.9] hover:from-zinc-100 hover:to-zinc-300 transition-all duration-500">
                      {t('hero.title.2')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 sm:space-x-6 overflow-hidden">
                    <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extralight tracking-tight text-white leading-[0.9] hover:tracking-wide transition-all duration-500">
                      {t('hero.title.3')}
                    </span>
                    <div className="hidden md:block w-16 h-px bg-zinc-700 hover:w-24 hover:bg-zinc-500 transition-all duration-500"></div>
                  </div>
                </h1>
              </div>

              {/* Subtitle avec animation */}
              <p 
                ref={subtitleReveal.elementRef}
                className="text-base sm:text-lg text-zinc-400 max-w-md leading-relaxed mb-8 sm:mb-12 lg:mb-16 font-light hover:text-zinc-300 transition-colors duration-300"
                style={subtitleReveal.style}
              >
                {t('hero.subtitle')}
              </p>

              {/* CTA avec animations */}
              <div 
                ref={ctaReveal.elementRef}
                className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-8"
                style={ctaReveal.style}
              >
                <Link 
                  href="/demo"
                  className="group flex items-center space-x-3 text-white hover:text-zinc-300 transition-colors duration-300"
                >
                  <span className="text-sm tracking-wide">{t('hero.cta.primary')}</span>
                  <div className="w-12 h-px bg-white group-hover:w-16 transition-all duration-300"></div>
                  <div className="w-1 h-1 bg-white rounded-full group-hover:w-1.5 group-hover:h-1.5 transition-all duration-300"></div>
                </Link>
                
                <Link 
                  href="/pricing"
                  className="text-sm text-zinc-500 hover:text-zinc-300 tracking-wide transition-colors duration-300 relative"
                >
                  <span>{t('hero.cta.secondary')}</span>
                  <div className="absolute bottom-0 left-0 w-0 h-px bg-zinc-400 group-hover:w-full transition-all duration-300"></div>
                </Link>
              </div>
            </div>

            {/* Right side - Stats/Info avec animations staggered */}
            <div className="col-span-12 lg:col-span-5 mt-12 lg:mt-0 px-4 sm:px-0">
              <div className="space-y-8 sm:space-y-12 lg:space-y-16">
                
                {/* Performance metrics avec stagger */}
                <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                  <div 
                    className="flex justify-between items-end border-b border-zinc-800 pb-3 sm:pb-4 hover:border-zinc-600 transition-colors duration-300 group"
                    style={{
                      opacity: visibleItems[0] ? 1 : 0,
                      transform: visibleItems[0] ? 'translateY(0px)' : 'translateY(20px)',
                      transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    <span className="text-xs text-zinc-500 tracking-wide sm:tracking-wider group-hover:text-zinc-400 transition-colors">{t('hero.metrics.uptime')}</span>
                    <span className="text-xl sm:text-2xl font-light text-white group-hover:text-emerald-400 transition-colors duration-300">99.99%</span>
                  </div>
                  
                  <div 
                    className="flex justify-between items-end border-b border-zinc-800 pb-3 sm:pb-4 hover:border-zinc-600 transition-colors duration-300 group"
                    style={{
                      opacity: visibleItems[1] ? 1 : 0,
                      transform: visibleItems[1] ? 'translateY(0px)' : 'translateY(20px)',
                      transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    <span className="text-xs text-zinc-500 tracking-wide sm:tracking-wider group-hover:text-zinc-400 transition-colors">{t('hero.metrics.responseTime')}</span>
                    <span className="text-xl sm:text-2xl font-light text-white group-hover:text-blue-400 transition-colors duration-300">&lt;50ms</span>
                  </div>
                  
                  <div 
                    className="flex justify-between items-end border-b border-zinc-800 pb-3 sm:pb-4 hover:border-zinc-600 transition-colors duration-300 group"
                    style={{
                      opacity: visibleItems[2] ? 1 : 0,
                      transform: visibleItems[2] ? 'translateY(0px)' : 'translateY(20px)',
                      transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    <span className="text-xs text-zinc-500 tracking-wide sm:tracking-wider group-hover:text-zinc-400 transition-colors">{t('hero.metrics.globalNodes')}</span>
                    <span className="text-xl sm:text-2xl font-light text-white group-hover:text-purple-400 transition-colors duration-300">247</span>
                  </div>
                </div>

                {/* Status indicator avec animation */}
                <div 
                  ref={statusReveal.elementRef}
                  className="flex items-center space-x-3"
                  style={statusReveal.style}
                >
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-zinc-500 tracking-wider hover:text-zinc-400 transition-colors duration-300">{t('hero.status')}</span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom scroll indicator animé - hidden on mobile */}
      <div 
        ref={scrollReveal.elementRef}
        className="hidden sm:block absolute bottom-8 left-1/2 transform -translate-x-1/2"
        style={scrollReveal.style}
      >
        <div className="flex flex-col items-center space-y-2 group cursor-pointer">
          <span className="text-xs text-zinc-600 tracking-widest group-hover:text-zinc-400 transition-colors duration-300">{t('hero.scroll')}</span>
          <div className="w-px h-8 bg-gradient-to-b from-zinc-600 to-transparent group-hover:from-zinc-400 transition-colors duration-300 animate-subtle-float"></div>
        </div>
      </div>

    </section>
  );
}
