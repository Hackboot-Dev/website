'use client';
import { useLanguage } from '../../contexts/LanguageContext';
import { useRevealAnimation, useStaggerReveal } from '../../hooks/useAwwardsAnimation';
import { CheckIcon, NetworkIcon, StorageIcon, CPUIcon } from '../../components/ui/Icons';
import Badge from '../../components/ui/Badge';

export default function TrustSection() {
  const { language } = useLanguage();
  const titleReveal = useRevealAnimation({ delay: 100 });
  const { containerRef, visibleItems } = useStaggerReveal(8, 100);

  const trustSignals = language === 'fr' ? [
    { icon: CheckIcon, title: 'ISO 27001', desc: 'Certification sécurité' },
    { icon: NetworkIcon, title: 'RGPD', desc: 'Conformité européenne' },
    { icon: CPUIcon, title: 'Tier III+', desc: 'Datacenters certifiés' },
    { icon: CheckIcon, title: '99.99% SLA', desc: 'Disponibilité garantie' },
    { icon: NetworkIcon, title: 'DDoS Protection', desc: 'Protection avancée' },
    { icon: StorageIcon, title: 'Backup 3-2-1', desc: 'Sauvegardes redondantes' },
    { icon: CPUIcon, title: 'Support 24/7', desc: 'Équipe experte' },
    { icon: CheckIcon, title: '30J Satisfait', desc: 'Ou remboursé' },
  ] : [
    { icon: CheckIcon, title: 'ISO 27001', desc: 'Security certified' },
    { icon: NetworkIcon, title: 'GDPR', desc: 'European compliance' },
    { icon: CPUIcon, title: 'Tier III+', desc: 'Certified datacenters' },
    { icon: CheckIcon, title: '99.99% SLA', desc: 'Guaranteed uptime' },
    { icon: NetworkIcon, title: 'DDoS Protection', desc: 'Advanced protection' },
    { icon: StorageIcon, title: '3-2-1 Backup', desc: 'Redundant backups' },
    { icon: CPUIcon, title: '24/7 Support', desc: 'Expert team' },
    { icon: CheckIcon, title: '30-Day Guarantee', desc: 'Money back' },
  ];

  const stats = language === 'fr' ? [
    { value: '50K+', label: 'Clients actifs' },
    { value: '99.99%', label: 'Uptime moyen' },
    { value: '15min', label: 'Temps réponse' },
    { value: '10+', label: 'Années d\'expérience' },
  ] : [
    { value: '50K+', label: 'Active clients' },
    { value: '99.99%', label: 'Average uptime' },
    { value: '15min', label: 'Response time' },
    { value: '10+', label: 'Years experience' },
  ];

  return (
    <section className="py-20 relative overflow-hidden bg-zinc-950/50">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid opacity-[0.02]"></div>
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title */}
        <div 
          ref={titleReveal.elementRef as any}
          style={titleReveal.style}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">
            {language === 'fr' ? 'Confiance & Sécurité' : 'Trust & Security'}
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extralight text-white mb-4">
            {language === 'fr' 
              ? 'Une infrastructure de confiance'
              : 'Infrastructure you can trust'}
          </h2>
          <p className="text-lg text-zinc-400 max-w-3xl mx-auto">
            {language === 'fr'
              ? 'Certifications internationales, conformité européenne et garanties solides pour votre tranquillité d\'esprit'
              : 'International certifications, European compliance and solid guarantees for your peace of mind'}
          </p>
        </div>

        {/* Trust signals grid */}
        <div 
          ref={containerRef as any}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {trustSignals.map((signal, index) => (
            <div
              key={index}
              className={`group bg-zinc-900/40 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all duration-300 ${
                visibleItems[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{
                transitionDelay: `${index * 100}ms`
              }}
            >
              <signal.icon className="w-8 h-8 text-zinc-400 mb-3 group-hover:text-white transition-colors" />
              <h3 className="text-white font-medium mb-1">{signal.title}</h3>
              <p className="text-xs text-zinc-500">{signal.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-zinc-800 pt-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl sm:text-4xl font-extralight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-zinc-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Partners/Certifications logos */}
        <div className="mt-16 pt-8 border-t border-zinc-800">
          <p className="text-center text-xs text-zinc-600 mb-8 uppercase tracking-wider">
            {language === 'fr' ? 'Ils nous font confiance' : 'Trusted by'}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
            {/* Placeholder for partner logos */}
            <div className="w-24 h-8 bg-zinc-800 rounded"></div>
            <div className="w-28 h-8 bg-zinc-800 rounded"></div>
            <div className="w-20 h-8 bg-zinc-800 rounded"></div>
            <div className="w-32 h-8 bg-zinc-800 rounded"></div>
            <div className="w-24 h-8 bg-zinc-800 rounded"></div>
          </div>
        </div>
      </div>
    </section>
  );
}