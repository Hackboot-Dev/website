'use client';
// /workspaces/website/apps/web/contexts/LanguageContext.tsx
// Description: Context pour la gestion multilingue
// Last modified: 2025-08-16
// Related docs: /docs/JOURNAL.md

// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations object
const translations = {
  en: {
    // Header
    'nav.infrastructure': 'Infrastructure',
    'nav.pricing': 'Pricing',
    'nav.documentation': 'Documentation',
    'nav.support': 'Support',
    'nav.signIn': 'Sign In',
    'nav.getStarted': 'Get Started',
    
    // Hero Section
    'hero.label': '2025 INFRASTRUCTURE',
    'hero.title.1': 'Cloud',
    'hero.title.2': 'Computing',
    'hero.title.3': 'Redefined',
    'hero.subtitle': 'Infrastructure as code meets enterprise-grade security. Deploy, scale, monitor—effortlessly.',
    'hero.cta.primary': 'Start Building',
    'hero.cta.secondary': 'View Pricing',
    'hero.metrics.uptime': 'UPTIME',
    'hero.metrics.responseTime': 'RESPONSE TIME',
    'hero.metrics.globalNodes': 'GLOBAL NODES',
    'hero.status': 'ALL SYSTEMS OPERATIONAL',
    'hero.scroll': 'SCROLL',
    
    // Features Section
    'features.label': 'PLATFORM FEATURES',
    'features.title.1': 'Built for scale.',
    'features.title.2': 'Designed for developers.',
    'features.subtitle': 'Enterprise-grade infrastructure with developer-first tooling. Ship faster without compromising on reliability.',
    'features.globalInfra.title': 'Global Infrastructure',
    'features.globalInfra.desc': 'Multi-region deployment with edge optimization for minimal latency worldwide.',
    'features.globalInfra.metric': '5 Regions',
    'features.security.title': 'Enterprise Security',
    'features.security.desc': 'End-to-end encryption with SOC2 compliance and automated threat detection.',
    'features.security.metric': '99.9% SLA',
    'features.devExp.title': 'Developer Experience',
    'features.devExp.desc': 'Git-based workflows with instant previews and collaborative development tools.',
    'features.devExp.metric': '<2min Deploy',
    'features.autoScale.title': 'Auto Scaling',
    'features.autoScale.desc': 'Intelligent resource allocation that adapts to traffic patterns automatically.',
    'features.autoScale.metric': '0-100K RPS',
    
    // Pricing Section
    'pricing.label': 'TRANSPARENT PRICING',
    'pricing.title.1': 'Simple pricing.',
    'pricing.title.2': 'No surprises.',
    'pricing.subtitle': 'Choose the plan that fits your needs. Scale up or down anytime. Cancel whenever you want.',
    'pricing.starter.name': 'Starter',
    'pricing.starter.desc': 'Perfect for side projects',
    'pricing.pro.name': 'Professional',
    'pricing.pro.desc': 'For growing businesses',
    'pricing.enterprise.name': 'Enterprise',
    'pricing.enterprise.desc': 'For large organizations',
    'pricing.recommended': 'RECOMMENDED',
    'pricing.cta.trial': 'Start Free Trial',
    'pricing.cta.contact': 'Contact Sales',
    'pricing.note': 'All plans include 14-day free trial. No credit card required.',
    
    // CTA Section
    'cta.label': 'READY TO BUILD',
    'cta.title.1': 'Ship faster.',
    'cta.title.2': 'Scale smarter.',
    'cta.subtitle': 'Join developers who choose performance over complexity. Deploy in minutes, not hours.',
    'cta.primary': 'Start Free Trial',
    'cta.secondary': 'View Plans',
    'cta.metrics.deployTime': 'DEPLOYMENT TIME',
    'cta.metrics.satisfaction': 'DEVELOPER SATISFACTION',
    'cta.metrics.projects': 'PROJECTS DEPLOYED',
    'cta.features.config': 'Zero configuration required',
    'cta.features.scaling': 'Auto-scaling infrastructure',
    'cta.features.monitoring': '24/7 monitoring included',
  },
  
  fr: {
    // Header
    'nav.infrastructure': 'Infrastructure',
    'nav.pricing': 'Tarifs',
    'nav.documentation': 'Documentation',
    'nav.support': 'Support',
    'nav.signIn': 'Connexion',
    'nav.getStarted': 'Commencer',
    
    // Hero Section
    'hero.label': 'INFRASTRUCTURE 2025',
    'hero.title.1': 'Cloud',
    'hero.title.2': 'Computing',
    'hero.title.3': 'Redéfini',
    'hero.subtitle': 'Infrastructure as code avec sécurité enterprise. Déployez, adaptez, surveillez—sans effort.',
    'hero.cta.primary': 'Commencer',
    'hero.cta.secondary': 'Voir les tarifs',
    'hero.metrics.uptime': 'DISPONIBILITÉ',
    'hero.metrics.responseTime': 'TEMPS DE RÉPONSE',
    'hero.metrics.globalNodes': 'NŒUDS GLOBAUX',
    'hero.status': 'TOUS LES SYSTÈMES OPÉRATIONNELS',
    'hero.scroll': 'DÉFILER',
    
    // Features Section
    'features.label': 'FONCTIONNALITÉS',
    'features.title.1': 'Conçu pour l\'échelle.',
    'features.title.2': 'Pensé pour les développeurs.',
    'features.subtitle': 'Infrastructure enterprise avec outils développeur. Livrez plus rapidement sans compromettre la fiabilité.',
    'features.globalInfra.title': 'Infrastructure Globale',
    'features.globalInfra.desc': 'Déploiement multi-régions avec optimisation edge pour une latence minimale.',
    'features.globalInfra.metric': '5 Régions',
    'features.security.title': 'Sécurité Enterprise',
    'features.security.desc': 'Chiffrement bout-en-bout avec conformité SOC2 et détection automatique des menaces.',
    'features.security.metric': '99.9% SLA',
    'features.devExp.title': 'Expérience Développeur',
    'features.devExp.desc': 'Workflows Git avec aperçus instantanés et outils de collaboration.',
    'features.devExp.metric': '<2min Déploiement',
    'features.autoScale.title': 'Auto-Scaling',
    'features.autoScale.desc': 'Allocation intelligente des ressources qui s\'adapte automatiquement au trafic.',
    'features.autoScale.metric': '0-100K RPS',
    
    // Pricing Section
    'pricing.label': 'TARIFS TRANSPARENTS',
    'pricing.title.1': 'Tarifs simples.',
    'pricing.title.2': 'Sans surprises.',
    'pricing.subtitle': 'Choisissez le plan qui vous convient. Adaptez à tout moment. Annulez quand vous voulez.',
    'pricing.starter.name': 'Starter',
    'pricing.starter.desc': 'Parfait pour les projets personnels',
    'pricing.pro.name': 'Professionnel',
    'pricing.pro.desc': 'Pour les entreprises en croissance',
    'pricing.enterprise.name': 'Entreprise',
    'pricing.enterprise.desc': 'Pour les grandes organisations',
    'pricing.recommended': 'RECOMMANDÉ',
    'pricing.cta.trial': 'Essai Gratuit',
    'pricing.cta.contact': 'Contacter Commercial',
    'pricing.note': 'Tous les plans incluent 14 jours d\'essai gratuit. Aucune carte de crédit requise.',
    
    // CTA Section
    'cta.label': 'PRÊT À CRÉER',
    'cta.title.1': 'Livrez plus vite.',
    'cta.title.2': 'Adaptez intelligemment.',
    'cta.subtitle': 'Rejoignez les développeurs qui choisissent la performance plutôt que la complexité. Déployez en minutes, pas en heures.',
    'cta.primary': 'Essai Gratuit',
    'cta.secondary': 'Voir les Plans',
    'cta.metrics.deployTime': 'TEMPS DE DÉPLOIEMENT',
    'cta.metrics.satisfaction': 'SATISFACTION DÉVELOPPEUR',
    'cta.metrics.projects': 'PROJETS DÉPLOYÉS',
    'cta.features.config': 'Aucune configuration requise',
    'cta.features.scaling': 'Infrastructure auto-adaptative',
    'cta.features.monitoring': 'Surveillance 24/7 incluse',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('en');

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('vmcloud-language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'fr')) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language to localStorage when changed
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('vmcloud-language', lang);
  };

  // Translation function
  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook to use language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}