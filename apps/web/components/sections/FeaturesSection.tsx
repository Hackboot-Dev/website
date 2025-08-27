'use client';
import { useRevealAnimation, useStaggerReveal } from '../../hooks/useAwwardsAnimation';
import { useLanguage } from '../../contexts/LanguageContext';


export default function FeaturesSection() {
  const { t } = useLanguage();
  
  const features = [
    {
      title: t('features.globalInfra.title'),
      description: t('features.globalInfra.desc'),
      metric: t('features.globalInfra.metric')
    },
    {
      title: t('features.security.title'),
      description: t('features.security.desc'),
      metric: t('features.security.metric')
    },
    {
      title: t('features.devExp.title'),
      description: t('features.devExp.desc'),
      metric: t('features.devExp.metric')
    },
    {
      title: t('features.autoScale.title'),
      description: t('features.autoScale.desc'),
      metric: t('features.autoScale.metric')
    }
  ];

  const titleReveal = useRevealAnimation({ delay: 100 });
  const subtitleReveal = useRevealAnimation({ delay: 300 });
  const { containerRef, visibleItems } = useStaggerReveal(features.length, 200);

  return (
    <section className="relative py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 overflow-hidden">
      {/* Geometric background elements - Features specific - hidden on mobile */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="hidden sm:block absolute top-1/3 right-1/4 w-px h-24 bg-gradient-to-b from-transparent via-zinc-600 to-transparent"></div>
        <div className="hidden sm:block absolute bottom-1/3 left-1/4 w-16 h-px bg-gradient-to-r from-transparent via-zinc-600 to-transparent"></div>
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-grid opacity-[0.02]"></div>
        {/* Floating elements specific to features - hidden on mobile */}
        <div className="hidden md:block absolute top-1/4 left-1/6 w-2 h-2 bg-zinc-700 rounded-full animate-subtle-float"></div>
        <div className="hidden md:block absolute bottom-1/4 right-1/6 w-1 h-1 bg-zinc-600 rounded-full animate-subtle-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          {/* Section Header */}
          <div className="mb-12 sm:mb-16 lg:mb-20">
            <div className="mb-8">
              <span className="text-xs tracking-[0.3em] text-zinc-500 font-mono">
                {t('features.label')}
              </span>
            </div>
            
            <div 
              ref={titleReveal.elementRef}
              style={titleReveal.style}
              className="mb-6"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight tracking-tight text-white leading-[1.1] max-w-4xl">
                {t('features.title.1')}
                <span className="block text-gradient-subtle">
                  {t('features.title.2')}
                </span>
              </h2>
            </div>
            
            <div 
              ref={subtitleReveal.elementRef}
              style={subtitleReveal.style}
            >
              <p className="text-base sm:text-lg text-zinc-400 max-w-2xl font-light">
                {t('features.subtitle')}
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div ref={containerRef} className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group"
                style={{
                  opacity: visibleItems[index] ? 1 : 0,
                  transform: visibleItems[index] ? 'translateY(0px)' : 'translateY(30px)',
                  transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                {/* Feature metric */}
                <div className="mb-4">
                  <span className="text-xs text-zinc-500 tracking-wider font-mono">
                    {feature.metric}
                  </span>
                </div>
                
                {/* Feature content */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-light text-white group-hover:text-zinc-200 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
                
                {/* Decorative line */}
                <div className="mt-6 w-12 h-px bg-zinc-700 group-hover:w-16 group-hover:bg-zinc-500 transition-all duration-300"></div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}