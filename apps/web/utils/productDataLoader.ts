// /workspaces/website/apps/web/utils/productDataLoader.ts
// Description: Utility to load and merge base product data with translations
// Last modified: 2025-08-24

import baseData from '../data/products/base.json';

// Import French translations
import frVps from '../data/products/fr/vps.json';
import frGpu from '../data/products/fr/gpu.json';
import frWebhosting from '../data/products/fr/webhosting.json';
import frPaas from '../data/products/fr/paas.json';
import frLoadbalancer from '../data/products/fr/loadbalancer.json';
import frStorage from '../data/products/fr/storage.json';
import frCdn from '../data/products/fr/cdn.json';

// Import English translations
import enVps from '../data/products/en/vps.json';
import enGpu from '../data/products/en/gpu.json';
import enWebhosting from '../data/products/en/webhosting.json';
import enPaas from '../data/products/en/paas.json';
import enLoadbalancer from '../data/products/en/loadbalancer.json';
import enStorage from '../data/products/en/storage.json';
import enCdn from '../data/products/en/cdn.json';


const translations = {
  fr: {
    vps: frVps,
    gpu: frGpu,
    webhosting: frWebhosting,
    paas: frPaas,
    loadbalancer: frLoadbalancer,
    storage: frStorage,
    cdn: frCdn
  },
  en: {
    vps: enVps,
    gpu: enGpu,
    webhosting: enWebhosting,
    paas: enPaas,
    loadbalancer: enLoadbalancer,
    storage: enStorage,
    cdn: enCdn
  }
};

export function getEnrichedProductData(language: string = 'fr') {
  // Check if language is supported, otherwise return data with N/A
  const supportedLanguages = ['fr', 'en'];
  const isSupported = supportedLanguages.includes(language);
  
  const enrichedData = {} as any;
  
  // If language not supported, return base data with N/A for translations
  if (!isSupported) {
    Object.keys(baseData).forEach(category => {
      const categoryProducts = baseData[category as keyof typeof baseData];
      
      enrichedData[category] = categoryProducts.map((product: any) => {
        return {
          ...product,
          usage: 'N/A',
          description: 'N/A',
          use_cases: ['N/A'],
          features: ['N/A'],
          target_audience: 'N/A',
          highlight: 'N/A'
        };
      });
    });
    
    return enrichedData;
  }
  
  // Language is supported, get translations
  const langTranslations = translations[language as keyof typeof translations];
  
  // Process each category
  Object.keys(baseData).forEach(category => {
    const categoryProducts = baseData[category as keyof typeof baseData];
    const categoryTranslations = langTranslations[category as keyof typeof langTranslations];
    
    enrichedData[category] = categoryProducts.map((product: any) => {
      const translation = categoryTranslations?.[product.id as keyof typeof categoryTranslations];
      
      // If no translation exists for this product, use N/A
      if (!translation) {
        return {
          ...product,
          usage: 'N/A',
          description: 'N/A',
          use_cases: ['N/A'],
          features: ['N/A'],
          target_audience: 'N/A',
          highlight: 'N/A'
        };
      }
      
      return {
        ...product,
        ...translation
      };
    });
  });
  
  return enrichedData;
}

// Legacy compatibility - returns data in same format as old products.json
export default function getProductsData(language: string = 'fr') {
  return getEnrichedProductData(language);
}