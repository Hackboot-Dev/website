// Product page translation helpers
// Provides common translations for product pages

export const getCommonTranslations = (language: string) => {
  const translations = {
    fr: {
      // Headers
      technicalSpecs: 'SPÉCIFICATIONS TECHNIQUES',
      performanceMetrics: 'MÉTRIQUES DE PERFORMANCE',
      securityCompliance: 'SÉCURITÉ & CONFORMITÉ',
      architecturePerf: 'Architecture & Performance',
      benchmarks: 'Benchmarks Leaders du Marché',
      protection: 'Protection Niveau Entreprise',
      
      // CTAs
      deployIn60s: 'Déployer en 60 secondes',
      configure: 'Configurer',
      configureOrder: 'Configurer & Commander',
      viewDetails: 'Voir les détails',
      startTrial: 'Essai gratuit',
      contactExpert: 'Contacter un expert',
      
      // Pricing
      monthly: 'Mensuel',
      annual: 'Annuel',
      hourly: 'Horaire',
      month: 'mois',
      year: 'an',
      hour: 'heure',
      discount: 'de réduction',
      save: 'économisez',
      totalAnnual: 'Total annuel',
      withoutDiscount: 'sans réduction',
      
      // Features
      included: 'Inclus',
      unlimited: 'Illimité',
      available: 'Disponible',
      guaranteed: 'Garanti',
      
      // Sections
      readyToScale: 'Prêt à scaler votre infrastructure?',
      automatedDeployment: 'Déploiement automatisé. Migration assistée. Support 24/7.',
      performance: 'Performance',
      security: 'Sécurité',
      compliance: 'Conformité',
      network: 'Réseau',
      storage: 'Stockage',
      compute: 'Calcul',
      memory: 'Mémoire',
      
      // Product specific
      ddosProtection: 'Protection DDoS',
      sslCertificate: 'Certificat SSL',
      backup: 'Sauvegarde',
      monitoring: 'Monitoring',
      support247: 'Support 24/7',
      sla: 'SLA',
      migration: 'Migration gratuite',
      
      // Test periods
      freeTrialDays: (days: number) => `Essai gratuit ${days} jours`,
      moneyBack: (days: number) => `${days} jours satisfait ou remboursé`,
    },
    en: {
      // Headers
      technicalSpecs: 'TECHNICAL SPECIFICATIONS',
      performanceMetrics: 'PERFORMANCE METRICS',
      securityCompliance: 'SECURITY & COMPLIANCE',
      architecturePerf: 'Architecture & Performance',
      benchmarks: 'Industry-Leading Benchmarks',
      protection: 'Enterprise-Grade Protection',
      
      // CTAs
      deployIn60s: 'Deploy in 60 seconds',
      configure: 'Configure',
      configureOrder: 'Configure & Order',
      viewDetails: 'View details',
      startTrial: 'Free trial',
      contactExpert: 'Contact an expert',
      
      // Pricing
      monthly: 'Monthly',
      annual: 'Annual',
      hourly: 'Hourly',
      month: 'month',
      year: 'year',
      hour: 'hour',
      discount: 'discount',
      save: 'save',
      totalAnnual: 'Annual total',
      withoutDiscount: 'without discount',
      
      // Features
      included: 'Included',
      unlimited: 'Unlimited',
      available: 'Available',
      guaranteed: 'Guaranteed',
      
      // Sections
      readyToScale: 'Ready to scale your infrastructure?',
      automatedDeployment: 'Automated deployment. Assisted migration. 24/7 Support.',
      performance: 'Performance',
      security: 'Security',
      compliance: 'Compliance',
      network: 'Network',
      storage: 'Storage',
      compute: 'Compute',
      memory: 'Memory',
      
      // Product specific
      ddosProtection: 'DDoS Protection',
      sslCertificate: 'SSL Certificate',
      backup: 'Backup',
      monitoring: 'Monitoring',
      support247: '24/7 Support',
      sla: 'SLA',
      migration: 'Free migration',
      
      // Test periods
      freeTrialDays: (days: number) => `${days}-day free trial`,
      moneyBack: (days: number) => `${days}-day money back`,
    },
    es: {
      // Spanish translations (fallback to English for now)
      ...{} // Will be filled later
    }
  };
  
  return translations[language as keyof typeof translations] || translations.en;
};

// Helper to get a specific translation
export const getTranslation = (language: string, key: string, fallback?: string): string => {
  const translations = getCommonTranslations(language);
  const keys = key.split('.');
  let value: any = translations;
  
  for (const k of keys) {
    value = value?.[k];
    if (!value) break;
  }
  
  return value || fallback || key;
};

// Format price with proper currency and period
export const formatProductPrice = (price: number, period: 'monthly' | 'annual' | 'hourly', language: string) => {
  const t = getCommonTranslations(language);
  const periodText = {
    monthly: `/${t.month}`,
    annual: `/${t.year}`,
    hourly: `/${t.hour}`
  };
  
  return `${price}€${periodText[period]}`;
};

// Get product category label
export const getCategoryLabel = (category: string, language: string): string => {
  const labels = {
    fr: {
      vps: 'Serveurs VPS',
      gpu: 'GPU Cloud',
      webhosting: 'Hébergement Web',
      paas: 'Platform as a Service',
      loadbalancer: 'Load Balancer',
      storage: 'Stockage',
      cdn: 'CDN'
    },
    en: {
      vps: 'VPS Servers',
      gpu: 'GPU Cloud',
      webhosting: 'Web Hosting',
      paas: 'Platform as a Service',
      loadbalancer: 'Load Balancer',
      storage: 'Storage',
      cdn: 'CDN'
    }
  };
  
  return labels[language as keyof typeof labels]?.[category] || category.toUpperCase();
};