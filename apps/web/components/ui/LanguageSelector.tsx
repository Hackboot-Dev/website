'use client';
// /workspaces/website/apps/web/components/ui/LanguageSelector.tsx
// Description: Sélecteur de langue minimaliste
// Last modified: 2025-08-16
// Related docs: /docs/JOURNAL.md

// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

import { useLanguage } from '../../contexts/LanguageContext';

export default function LanguageSelector() {
  const { language, setLanguage, supportedLanguages, languageInfo, loading, isChangingLanguage } = useLanguage();
  
  if (loading) {
    return (
      <div className="flex items-center space-x-2 text-zinc-400 text-sm">
        <span>...</span>
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Current language */}
      <button className={`flex items-center space-x-2 text-zinc-400 hover:text-white transition-all duration-300 text-sm tracking-wide ${
        isChangingLanguage ? 'opacity-60' : ''
      }`}>
        <span className={`text-xs transition-transform duration-300 ${
          isChangingLanguage ? 'animate-pulse' : ''
        }`}>
          {languageInfo[language]?.flag}
        </span>
        <span className={isChangingLanguage ? 'animate-pulse' : ''}>
          {languageInfo[language]?.name}
        </span>
        {isChangingLanguage && (
          <div className="w-1 h-1 bg-zinc-400 rounded-full animate-pulse ml-1"></div>
        )}
      </button>

      {/* Dropdown */}
      <div className="absolute top-full right-0 mt-2 py-2 bg-zinc-900/95 backdrop-blur-md border border-zinc-700 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[80px]">
        {supportedLanguages.map((langCode) => (
          <button
            key={langCode}
            onClick={() => setLanguage(langCode)}
            className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-2 transition-colors duration-200 ${
              language === langCode
                ? 'text-white bg-zinc-700/50'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-700/30'
            }`}
            title={languageInfo[langCode]?.fullName}
          >
            <span className="text-xs">{languageInfo[langCode]?.flag}</span>
            <span>{languageInfo[langCode]?.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}