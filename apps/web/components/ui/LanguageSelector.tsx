'use client';
// /workspaces/website/apps/web/components/ui/LanguageSelector.tsx
// Description: Sélecteur de langue minimaliste
// Last modified: 2025-08-16
// Related docs: /docs/JOURNAL.md

// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

import { useLanguage, Language } from '../../contexts/LanguageContext';

const languages = [
  { code: 'en' as Language, name: 'EN', flag: '🇺🇸' },
  { code: 'fr' as Language, name: 'FR', flag: '🇫🇷' }
];

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="relative group">
      {/* Current language */}
      <button className="flex items-center space-x-2 text-zinc-400 hover:text-white transition-colors duration-300 text-sm tracking-wide">
        <span className="text-xs">{languages.find(l => l.code === language)?.flag}</span>
        <span>{languages.find(l => l.code === language)?.name}</span>
      </button>

      {/* Dropdown */}
      <div className="absolute top-full right-0 mt-2 py-2 bg-zinc-900/95 backdrop-blur-md border border-zinc-700 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[80px]">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-2 transition-colors duration-200 ${
              language === lang.code
                ? 'text-white bg-zinc-700/50'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-700/30'
            }`}
          >
            <span className="text-xs">{lang.flag}</span>
            <span>{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}