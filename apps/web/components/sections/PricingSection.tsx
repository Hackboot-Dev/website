'use client';
import Link from 'next/link';
import { useRevealAnimation, useStaggerReveal } from '../../hooks/useAwwardsAnimation';
import { useLanguage } from '../../contexts/LanguageContext';


export default function PricingSection() {
  const { t } = useLanguage();
  
  const plans = [
    {
      name: t('pricing.starter.name'),
      price: '15',
      description: t('pricing.starter.desc'),
      recommended: false,
      features: [
        '100GB Bandwidth',
        '10GB Storage',
        'Custom Domain',
        'SSL Certificate',
        'Basic Analytics'
      ]
    },
    {
      name: t('pricing.pro.name'),
      price: '49',
      description: t('pricing.pro.desc'),
      recommended: true,
      features: [
        '1TB Bandwidth',
        '100GB Storage',
        'Multiple Domains',
        'Advanced Analytics',
        'Priority Support',
        'Team Collaboration'
      ]
    },
    {
      name: t('pricing.enterprise.name'),
      price: 'Custom',
      description: t('pricing.enterprise.desc'),
      recommended: false,
      features: [
        'Unlimited Bandwidth',
        'Unlimited Storage',
        'White-label Solutions',
        'Dedicated Support',
        'SLA Guarantee',
        'Custom Integrations'
      ]
    }
  ];

  const titleReveal = useRevealAnimation({ delay: 100 });
  const subtitleReveal = useRevealAnimation({ delay: 300 });
  const { containerRef, visibleItems } = useStaggerReveal(plans.length, 200);

  return (
    <section className="relative py-16 sm:py-24 lg:py-32 bg-zinc-900 overflow-hidden">
      {/* Geometric background elements - Pricing specific - responsive */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="hidden sm:block absolute top-1/4 left-1/3 w-px h-32 bg-gradient-to-b from-transparent via-zinc-500 to-transparent"></div>
        <div className="hidden sm:block absolute bottom-1/4 right-1/3 w-20 h-px bg-gradient-to-r from-transparent via-zinc-500 to-transparent"></div>
        <div className="hidden md:block absolute top-1/2 left-1/4 w-1 h-1 bg-zinc-500 rounded-full animate-subtle-float"></div>
        {/* Diagonal accent lines for pricing - hidden on mobile */}
        <div className="hidden lg:block absolute top-1/3 right-1/4 w-12 h-px bg-zinc-600 transform rotate-45"></div>
        <div className="hidden lg:block absolute bottom-1/3 left-1/3 w-8 h-px bg-zinc-600 transform -rotate-45"></div>
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/10 via-transparent to-zinc-800/5"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          {/* Section Header */}
          <div className="mb-12 sm:mb-16 lg:mb-20 text-center lg:text-left">
            <div className="mb-8">
              <span className="text-xs tracking-[0.3em] text-zinc-500 font-mono">
                {t('pricing.label')}
              </span>
            </div>
            
            <div 
              ref={titleReveal.elementRef}
              style={titleReveal.style}
              className="mb-6"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight tracking-tight text-white leading-[1.1] max-w-4xl mx-auto lg:mx-0">
                {t('pricing.title.1')}
                <span className="block text-gradient-subtle">
                  {t('pricing.title.2')}
                </span>
              </h2>
            </div>
            
            <div 
              ref={subtitleReveal.elementRef}
              style={subtitleReveal.style}
            >
              <p className="text-base sm:text-lg text-zinc-400 max-w-2xl font-light mx-auto lg:mx-0">
                {t('pricing.subtitle')}
              </p>
            </div>
          </div>

          {/* Pricing Grid */}
          <div ref={containerRef} className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-sm sm:max-w-none mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative group ${plan.recommended ? 'lg:-mt-8' : ''}`}
                style={{
                  opacity: visibleItems[index] ? 1 : 0,
                  transform: visibleItems[index] ? 'translateY(0px)' : 'translateY(30px)',
                  transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-white text-zinc-950 px-4 py-1 text-xs tracking-wide font-medium">
                      {t('pricing.recommended')}
                    </span>
                  </div>
                )}

                <div className={`card-minimal p-8 h-full transition-all duration-300 ${
                  plan.recommended 
                    ? 'bg-zinc-900/60 border-zinc-600' 
                    : 'hover:border-zinc-600'
                }`}>
                  
                  {/* Plan header */}
                  <div className="mb-8">
                    <h3 className="text-xl font-light text-white mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-zinc-400 text-sm">
                      {plan.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-baseline space-x-1">
                      {plan.price !== 'Custom' ? (
                        <>
                          <span className="text-zinc-400 text-sm">$</span>
                          <span className="text-4xl font-light text-white">{plan.price}</span>
                          <span className="text-zinc-400 text-sm">/month</span>
                        </>
                      ) : (
                        <span className="text-4xl font-light text-white">Custom</span>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-8 space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <div className="w-1 h-1 bg-zinc-400 rounded-full flex-shrink-0"></div>
                        <span className="text-sm text-zinc-400">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="mt-auto">
                    <Link
                      href={plan.price === 'Custom' ? '/contact' : '/demo'}
                      className={`w-full py-3 text-sm tracking-wide transition-all duration-300 inline-flex items-center justify-center group ${
                        plan.recommended
                          ? 'bg-white text-zinc-950 hover:bg-zinc-100'
                          : 'border border-zinc-700 text-white hover:border-zinc-500 hover:bg-zinc-800/50'
                      }`}
                    >
                      {plan.price === 'Custom' ? t('pricing.cta.contact') : t('pricing.cta.trial')}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom note */}
          <div className="mt-16 text-center">
            <p className="text-sm text-zinc-500">
              {t('pricing.note')}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}