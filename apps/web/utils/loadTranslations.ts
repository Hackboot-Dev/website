// /workspaces/website/apps/web/utils/loadTranslations.ts
// Description: Utilitaire pour charger dynamiquement les fichiers de traduction
// Last modified: 2025-08-16
// Related docs: /docs/JOURNAL.md

// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

export type Language = 'en' | 'fr' | 'es';

export interface Translations {
  [key: string]: any;
}

/**
 * Cache pour éviter de recharger les fichiers déjà importés
 * Map<Language, Promise<Translations>> pour éviter les double chargements
 */
const translationCache = new Map<Language, Translations>();
const loadingPromises = new Map<Language, Promise<Translations>>();

/**
 * Liste des langues supportées
 */
export const supportedLanguages: Language[] = ['en', 'fr', 'es'];

/**
 * Informations sur les langues pour l'interface
 */
export const languageInfo = {
  en: { name: 'EN', flag: '🇺🇸', fullName: 'English' },
  fr: { name: 'FR', flag: '🇫🇷', fullName: 'Français' },
  es: { name: 'ES', flag: '🇪🇸', fullName: 'Español' }
};

/**
 * Vérifie si une langue est déjà en cache
 */
export function isLanguageInCache(language: Language): boolean {
  return translationCache.has(language);
}

/**
 * Charge dynamiquement les traductions pour une langue donnée
 * Optimisé pour éviter les double chargements et gérer le cache
 */
export async function loadTranslations(language: Language): Promise<Translations> {
  // Vérifier le cache d'abord
  if (translationCache.has(language)) {
    return translationCache.get(language)!;
  }

  // Si déjà en cours de chargement, retourner la promesse existante
  if (loadingPromises.has(language)) {
    return loadingPromises.get(language)!;
  }

  // Créer la promesse de chargement
  const loadingPromise = (async () => {
    try {
      // Import dynamique du fichier JSON
      const translations = await import(`../locales/${language}.json`);
      
      // Mise en cache
      translationCache.set(language, translations.default);
      
      return translations.default;
    } catch (error) {
      console.error(`Failed to load translations for language: ${language}`, error);
      
      // Fallback vers l'anglais si la langue demandée échoue
      if (language !== 'en') {
        console.warn(`Falling back to English translations`);
        return loadTranslations('en');
      }
      
      // Si même l'anglais échoue, retourner un objet vide
      return {};
    } finally {
      // Nettoyer la promesse de chargement
      loadingPromises.delete(language);
    }
  })();

  // Stocker la promesse pour éviter les double chargements
  loadingPromises.set(language, loadingPromise);

  return loadingPromise;
}

/**
 * Vérifie si une langue est supportée
 */
export function isLanguageSupported(language: string): language is Language {
  return supportedLanguages.includes(language as Language);
}

/**
 * Obtient la langue par défaut du navigateur si supportée
 */
export function getDefaultLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  
  const browserLang = navigator.language.split('-')[0];
  
  if (isLanguageSupported(browserLang)) {
    return browserLang;
  }
  
  return 'en';
}