'use client';
import Link from 'next/link';
import { useParallax } from '../../hooks/useAwwardsAnimation';
import { useEntryAnimation, useStaggerEntry } from '../../hooks/useEntryAnimation';
import { useLanguage } from '../../contexts/LanguageContext';

export default function HeroSection() {
  const { t } = useLanguage();
  
  // Animations d'entrée au chargement pour le hero
  const yearReveal = useEntryAnimation({ delay: 100 });
  const titleReveal = useEntryAnimation({ delay: 300 });
  const subtitleReveal = useEntryAnimation({ delay: 500 });
  const ctaReveal = useEntryAnimation({ delay: 700 });
  const { visibleItems } = useStaggerEntry(3, 150, 800); // 3 métriques, 150ms de délai, commence à 800ms
  const statusReveal = useEntryAnimation({ delay: 1150 });
  const scrollReveal = useEntryAnimation({ delay: 1300 });
  const geometryParallax = useParallax(0.3);

  return (
    <section className="relative min-h-screen bg-zinc-950 overflow-hidden">
      {/* Subtle noise texture */}
      <div className="absolute inset-0 opacity-[0.15] bg-noise"></div>
      
      {/* Geometric accent avec parallaxe */}
      <div 
        ref={geometryParallax.elementRef}
        className="absolute top-0 right-0 w-1/3 h-full"
        style={geometryParallax.style}
      >
        <div className="absolute top-32 right-16 w-px h-64 bg-gradient-to-b from-transparent via-zinc-600 to-transparent transition-all duration-700 hover:via-zinc-400"></div>
        <div className="absolute top-32 right-32 w-16 h-px bg-gradient-to-r from-transparent via-zinc-600 to-transparent transition-all duration-700 hover:via-zinc-400"></div>
        <div className="absolute top-48 right-24 w-1 h-1 bg-zinc-500 rounded-full animate-subtle-float"></div>
      </div>

      <div className="relative z-10 h-screen flex items-center">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-12 gap-8 items-center">
            
            {/* Left side - Main content */}
            <div className="col-span-12 lg:col-span-7">
              
              {/* Year indicator avec animation */}
              <div 
                ref={yearReveal.elementRef}
                className="mb-12"
                style={yearReveal.style}
              >
                <span className="text-xs tracking-[0.3em] text-zinc-500 font-mono">
                  {t('hero.label')}
                </span>
              </div>

              {/* Main title avec animations */}
              <div 
                ref={titleReveal.elementRef}
                className="space-y-4 mb-12"
                style={titleReveal.style}
              >
                <div className="overflow-hidden">
                  <h1 className="text-6xl md:text-7xl lg:text-8xl font-extralight tracking-tight text-white leading-[0.9] hover:tracking-wide transition-all duration-500">
                    {t('hero.title.1')}
                  </h1>
                </div>
                <div className="overflow-hidden">
                  <h1 className="text-6xl md:text-7xl lg:text-8xl font-extralight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 leading-[0.9] hover:from-zinc-100 hover:to-zinc-300 transition-all duration-500">
                    {t('hero.title.2')}
                  </h1>
                </div>
                <div className="flex items-center space-x-6 overflow-hidden">
                  <h1 className="text-6xl md:text-7xl lg:text-8xl font-extralight tracking-tight text-white leading-[0.9] hover:tracking-wide transition-all duration-500">
                    {t('hero.title.3')}
                  </h1>
                  <div className="hidden md:block w-16 h-px bg-zinc-700 hover:w-24 hover:bg-zinc-500 transition-all duration-500"></div>
                </div>
              </div>

              {/* Subtitle avec animation */}
              <p 
                ref={subtitleReveal.elementRef}
                className="text-lg text-zinc-400 max-w-md leading-relaxed mb-16 font-light hover:text-zinc-300 transition-colors duration-300"
                style={subtitleReveal.style}
              >
                {t('hero.subtitle')}
              </p>

              {/* CTA avec animations */}
              <div 
                ref={ctaReveal.elementRef}
                className="flex items-center space-x-8"
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
            <div className="col-span-12 lg:col-span-5">
              <div className="space-y-16">
                
                {/* Performance metrics avec stagger */}
                <div className="space-y-8">
                  <div 
                    className="flex justify-between items-end border-b border-zinc-800 pb-4 hover:border-zinc-600 transition-colors duration-300 group"
                    style={{
                      opacity: visibleItems[0] ? 1 : 0,
                      transform: visibleItems[0] ? 'translateY(0px)' : 'translateY(20px)',
                      transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    <span className="text-xs text-zinc-500 tracking-wider group-hover:text-zinc-400 transition-colors">{t('hero.metrics.uptime')}</span>
                    <span className="text-2xl font-light text-white group-hover:text-emerald-400 transition-colors duration-300">99.99%</span>
                  </div>
                  
                  <div 
                    className="flex justify-between items-end border-b border-zinc-800 pb-4 hover:border-zinc-600 transition-colors duration-300 group"
                    style={{
                      opacity: visibleItems[1] ? 1 : 0,
                      transform: visibleItems[1] ? 'translateY(0px)' : 'translateY(20px)',
                      transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    <span className="text-xs text-zinc-500 tracking-wider group-hover:text-zinc-400 transition-colors">{t('hero.metrics.responseTime')}</span>
                    <span className="text-2xl font-light text-white group-hover:text-blue-400 transition-colors duration-300">&lt;50ms</span>
                  </div>
                  
                  <div 
                    className="flex justify-between items-end border-b border-zinc-800 pb-4 hover:border-zinc-600 transition-colors duration-300 group"
                    style={{
                      opacity: visibleItems[2] ? 1 : 0,
                      transform: visibleItems[2] ? 'translateY(0px)' : 'translateY(20px)',
                      transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    <span className="text-xs text-zinc-500 tracking-wider group-hover:text-zinc-400 transition-colors">{t('hero.metrics.globalNodes')}</span>
                    <span className="text-2xl font-light text-white group-hover:text-purple-400 transition-colors duration-300">247</span>
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

      {/* Bottom scroll indicator animé */}
      <div 
        ref={scrollReveal.elementRef}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
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