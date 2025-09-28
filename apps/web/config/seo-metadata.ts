// /workspaces/website/apps/web/config/seo-metadata.ts
// Description: SEO metadata configuration for all pages
// Last modified: 2025-09-27
// Related docs: /docs/JOURNAL.md

export type PageMetadata = {
  title: {
    fr: string;
    en: string;
  };
  description: {
    fr: string;
    en: string;
  };
  keywords?: {
    fr: string[];
    en: string[];
  };
  ogTitle?: {
    fr: string;
    en: string;
  };
  ogDescription?: {
    fr: string;
    en: string;
  };
};

export const seoMetadata: Record<string, PageMetadata> = {
  home: {
    title: {
      fr: 'VMCloud — Infrastructure Cloud Premium | VPS, GPU & Hébergement Web',
      en: 'VMCloud — Premium Cloud Infrastructure | VPS, GPU & Web Hosting',
    },
    description: {
      fr: 'Infrastructure cloud haute performance. VPS NVMe dès 29€/mois, serveurs GPU Tesla/RTX pour IA/ML, hébergement web managé. Datacenters européens, support NOC 24/7 et conformité RGPD renforcée.',
      en: 'High-performance cloud infrastructure. NVMe VPS from €29/month, Tesla/RTX GPU servers for AI/ML, managed web hosting. European datacenters, 24/7 NOC support and reinforced GDPR compliance.',
    },
    keywords: {
      fr: ['cloud', 'vps', 'serveur gpu', 'hébergement web', 'vmcloud', 'infrastructure', 'iaas', 'cloud souverain'],
      en: ['cloud', 'vps', 'gpu server', 'web hosting', 'vmcloud', 'infrastructure', 'iaas', 'sovereign cloud'],
    },
  },
  products: {
    title: {
      fr: 'Nos Produits Cloud | VPS, GPU, Hébergement, CDN',
      en: 'Cloud Products | VPS, GPU, Hosting, CDN',
    },
    description: {
      fr: 'Découvrez notre gamme complète de produits cloud : VPS haute performance dès 29€/mois, serveurs GPU pour IA/ML, hébergement web managé, CDN global, stockage et plus.',
      en: 'Explore our complete cloud product range: High-performance VPS from €29/month, GPU servers for AI/ML, managed web hosting, global CDN, storage and more.',
    },
    keywords: {
      fr: ['produits cloud', 'vps', 'gpu', 'cdn', 'stockage', 'paas', 'load balancer', 'vmcloud'],
      en: ['cloud products', 'vps', 'gpu', 'cdn', 'storage', 'paas', 'load balancer', 'vmcloud'],
    },
  },
  pricing: {
    title: {
      fr: 'Tarifs et Prix | Plans VPS, GPU et Hébergement',
      en: 'Pricing & Plans | VPS, GPU and Hosting Solutions',
    },
    description: {
      fr: 'Tarifs transparents sans frais cachés. VPS dès 29€/mois, GPU dès 199€/mois, hébergement web dès 9.99€/mois. Facturation horaire, mensuelle ou annuelle avec jusqu\'à 20% de réduction.',
      en: 'Transparent pricing with no hidden fees. VPS from €29/month, GPU from €199/month, web hosting from €9.99/month. Hourly, monthly or annual billing with up to 20% discount.',
    },
  },
  infrastructure: {
    title: {
      fr: 'Infrastructure Cloud Européenne | Datacenters & Réseau',
      en: 'European Cloud Infrastructure | Datacenters & Network',
    },
    description: {
      fr: 'Infrastructure premium avec 6 datacenters en Europe, 2500+ vCPUs AMD EPYC, 48 GPUs Tesla/RTX, réseau 400 Gbps, protection DDoS multi-tiers et audits de sécurité trimestriels.',
      en: 'Premium infrastructure with 6 European datacenters, 2500+ AMD EPYC vCPUs, 48 Tesla/RTX GPUs, 400 Gbps network, multi-tier DDoS protection and quarterly security audits.',
    },
  },
  support: {
    title: {
      fr: 'Support Technique 24/7 | Centre d\'Aide VMCloud',
      en: '24/7 Technical Support | VMCloud Help Center',
    },
    description: {
      fr: 'Support technique expert disponible 24/7. Temps de réponse moyen < 15 minutes. Chat IA Gemini, système de tickets, base de connaissances complète et hotline dédiée.',
      en: 'Expert technical support available 24/7. Average response time < 15 minutes. Gemini AI chat, ticketing system, comprehensive knowledge base and dedicated hotline.',
    },
  },
  about: {
    title: {
      fr: 'À Propos de VMCloud | Notre Histoire et Mission',
      en: 'About VMCloud | Our Story and Mission',
    },
    description: {
      fr: 'VMCloud : infrastructure cloud européenne bâtie par des experts du cloud gaming depuis 2019. Opérée par la société estonienne VMCloud OÜ.',
      en: 'VMCloud: European cloud infrastructure engineered by cloud gaming specialists since 2019. Operated by Estonian company VMCloud OÜ.',
    },
  },
  careers: {
    title: {
      fr: 'Carrières | Rejoignez l\'Équipe VMCloud',
      en: 'Careers | Join the VMCloud Team',
    },
    description: {
      fr: 'Rejoignez une équipe passionnée d\'experts cloud. Postes ouverts en développement, infrastructure, support et ventes. Environnement international, télétravail flexible.',
      en: 'Join a passionate team of cloud experts. Open positions in development, infrastructure, support and sales. International environment, flexible remote work.',
    },
  },
  login: {
    title: {
      fr: 'Connexion | Espace Client VMCloud',
      en: 'Login | VMCloud Customer Portal',
    },
    description: {
      fr: 'Accédez à votre espace client VMCloud pour gérer vos services cloud, VPS, serveurs GPU et hébergement. Interface sécurisée avec authentification 2FA.',
      en: 'Access your VMCloud customer portal to manage your cloud services, VPS, GPU servers and hosting. Secure interface with 2FA authentication.',
    },
  },
  'forgot-password': {
    title: {
      fr: 'Mot de Passe Oublié | Réinitialisation',
      en: 'Forgot Password | Reset',
    },
    description: {
      fr: 'Réinitialisez votre mot de passe VMCloud en toute sécurité. Processus de récupération rapide avec validation par email.',
      en: 'Securely reset your VMCloud password. Fast recovery process with email validation.',
    },
  },
  'legal-terms': {
    title: {
      fr: 'Conditions Générales d\'Utilisation | VMCloud',
      en: 'Terms of Service | VMCloud',
    },
    description: {
      fr: 'Conditions générales d\'utilisation de VMCloud. Société VMCloud OÜ immatriculée en Estonie (31644377). Cadre juridique complet pour nos services cloud.',
      en: 'VMCloud terms of service. VMCloud OÜ company registered in Estonia (31644377). Complete legal framework for our cloud services.',
    },
  },
  'legal-aup': {
    title: {
      fr: 'Politique d\'Utilisation Acceptable | VMCloud',
      en: 'Acceptable Use Policy | VMCloud',
    },
    description: {
      fr: 'Politique d\'utilisation acceptable des services VMCloud. Règles et restrictions pour garantir un environnement sûr et performant pour tous.',
      en: 'VMCloud acceptable use policy. Rules and restrictions to ensure a safe and performant environment for all.',
    },
  },
  'legal-sla': {
    title: {
      fr: 'Accord de Niveau de Service (SLA) | VMCloud',
      en: 'Service Level Agreement (SLA) | VMCloud',
    },
    description: {
      fr: 'Accord de niveau de service VMCloud : engagements de disponibilité, crédits de service et processus d\'escalade détaillés.',
      en: 'VMCloud service level agreement: documented availability commitments, service credits and clear escalation process.',
    },
  },
  'legal-dpa': {
    title: {
      fr: 'Accord de Traitement des Données (DPA) | VMCloud',
      en: 'Data Processing Agreement (DPA) | VMCloud',
    },
    description: {
      fr: 'Accord de traitement des données conforme au RGPD. Protection et sécurité de vos données dans l\'infrastructure VMCloud.',
      en: 'GDPR-compliant data processing agreement. Protection and security of your data in VMCloud infrastructure.',
    },
  },
  'legal-changes': {
    title: {
      fr: 'Politique de Changements | VMCloud',
      en: 'Change Policy | VMCloud',
    },
    description: {
      fr: 'Politique de gestion des changements et dépréciations VMCloud. Processus de migration et calendrier des modifications.',
      en: 'VMCloud change management and deprecation policy. Migration process and modification schedule.',
    },
  },
};

export function getPageMetadata(page: string, locale: 'fr' | 'en'): PageMetadata | null {
  const metadata = seoMetadata[page];
  if (!metadata) return null;

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    ogTitle: metadata.ogTitle || metadata.title,
    ogDescription: metadata.ogDescription || metadata.description,
  };
}
