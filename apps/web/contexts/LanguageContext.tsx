'use client';
// /workspaces/website/apps/web/contexts/LanguageContext.tsx
// Description: Context pour la gestion multilingue avec chargement dynamique
// Last modified: 2025-08-16
// Related docs: /docs/JOURNAL.md

// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Language, 
  Translations, 
  loadTranslations, 
  supportedLanguages, 
  languageInfo,
  getDefaultLanguage,
  isLanguageInCache
} from '../utils/loadTranslations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  loading: boolean;
  isChangingLanguage: boolean;
  supportedLanguages: Language[];
  languageInfo: typeof languageInfo;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState<Translations>({});
  const [loading, setLoading] = useState(true);
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);
  const [previousTranslations, setPreviousTranslations] = useState<Translations>({});

  // Charge les traductions pour une langue donnée (uniquement au premier chargement)
  const loadLanguageTranslations = async (lang: Language, isInitial = false) => {
    if (isInitial) {
      setLoading(true);
    } else {
      setIsChangingLanguage(true);
      // Garder les traductions précédentes pendant le chargement
      setPreviousTranslations(translations);
    }
    
    try {
      const newTranslations = await loadTranslations(lang);
      setTranslations(newTranslations);
      setPreviousTranslations({});
    } catch (error) {
      console.error('Failed to load translations:', error);
    } finally {
      if (isInitial) {
        setLoading(false);
      } else {
        // Délai rapide pour transition smooth
        setTimeout(() => {
          setIsChangingLanguage(false);
        }, 150);
      }
    }
  };

  // Initialisation : récupère la langue sauvegardée ou détecte celle du navigateur
  useEffect(() => {
    const initializeLanguage = async () => {
      let initialLanguage: Language = 'en';
      
      // 1. Vérifier localStorage
      const savedLanguage = localStorage.getItem('vmcloud-language');
      if (savedLanguage && supportedLanguages.includes(savedLanguage as Language)) {
        initialLanguage = savedLanguage as Language;
      } else {
        // 2. Détecter la langue du navigateur
        initialLanguage = getDefaultLanguage();
      }
      
      setLanguage(initialLanguage);
      await loadLanguageTranslations(initialLanguage, true);
    };
    
    initializeLanguage();
  }, []);

  // Changement de langue (chargement à la demande)
  const handleSetLanguage = async (lang: Language) => {
    if (lang === language) return;
    
    // Vérifier si la langue est en cache AVANT de montrer le loader
    const isInCache = isLanguageInCache(lang);
    
    setLanguage(lang);
    localStorage.setItem('vmcloud-language', lang);
    
    if (isInCache) {
      // Si en cache, pas de loader, chargement instantané
      const translations = await loadTranslations(lang);
      setTranslations(translations);
    } else {
      // Si pas en cache, montrer le loader
      await loadLanguageTranslations(lang, false);
    }
  };

  // Fonction de traduction avec support des clés imbriquées et fallback
  const t = (key: string): string => {
    // Pendant le loading initial, retourner string vide pour éviter les clés
    if (loading) return '';
    
    // Pendant le changement de langue, TOUJOURS utiliser les traductions précédentes
    const currentTranslations = isChangingLanguage && Object.keys(previousTranslations).length > 0 
      ? previousTranslations 
      : translations;
    
    // Si aucune traduction disponible, retourner string vide au lieu de la clé
    if (!currentTranslations || Object.keys(currentTranslations).length === 0) return '';
    
    // Support des clés imbriquées comme "hero.title.1"
    const keys = key.split('.');
    let result: any = currentTranslations;
    
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        // Si pas trouvé, utiliser les traductions actuelles comme fallback
        let fallbackResult: any = translations;
        for (const fallbackKey of keys) {
          if (fallbackResult && typeof fallbackResult === 'object' && fallbackKey in fallbackResult) {
            fallbackResult = fallbackResult[fallbackKey];
          } else {
            return ''; // Retourner vide si vraiment pas trouvé
          }
        }
        return typeof fallbackResult === 'string' ? fallbackResult : '';
      }
    }
    
    return typeof result === 'string' ? result : '';
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage: handleSetLanguage, 
      t, 
      loading,
      isChangingLanguage,
      supportedLanguages,
      languageInfo
    }}>
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