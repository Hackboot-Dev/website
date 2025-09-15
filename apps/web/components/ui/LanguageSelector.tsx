'use client';
// /workspaces/website/apps/web/components/ui/LanguageSelector.tsx
// Description: Sélecteur de langue amélioré avec modal d'information
// Last modified: 2025-12-18
// Related docs: /docs/JOURNAL.md

import { useContext, useState, useEffect, useRef } from 'react';
import { LanguageContext } from '../../contexts/LanguageContext';
import { usePathname, useRouter } from 'next/navigation';
import {
  GlobeAltIcon,
  ChevronDownIcon,
  InformationCircleIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

export default function LanguageSelector() {
  const context = useContext(LanguageContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [detectedCountry, setDetectedCountry] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // If context is not available, return null
  if (!context) {
    return null;
  }

  const { language, setLanguage, supportedLanguages, languageInfo, loading, isChangingLanguage } = context;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.language-selector')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Detect user's country
  useEffect(() => {
    const detectCountry = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        if (data.country_name) {
          setDetectedCountry(data.country_name);
        }
      } catch (error) {
        console.error('Could not detect country:', error);
      }
    };
    detectCountry();
  }, []);

  // Center modal when it opens
  useEffect(() => {
    if (showInfoModal && modalRef.current) {
      modalRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [showInfoModal]);

  const handleLanguageChange = (langCode: string) => {
    // Build new path with the new locale
    const segments = pathname.split('/');
    segments[1] = langCode; // Replace locale segment
    const newPath = segments.join('/');

    // Update localStorage and redirect
    localStorage.setItem('vmcloud-language', langCode);
    router.push(newPath);
    setShowDropdown(false);
  };

  const translations = {
    fr: {
      selectLanguage: 'Sélectionner la langue',
      languageNotice: 'La langue détermine les informations et données affichées',
      learnMore: 'En savoir plus',
      modalTitle: 'Impact du choix de langue',
      modalContent: {
        intro: 'Le choix de la langue sur notre plateforme n\'est pas qu\'une simple traduction.',
        impact: 'Cette sélection détermine :',
        impacts: [
          'Les tarifs affichés et la devise utilisée',
          'Les conditions générales applicables',
          'La localisation des serveurs disponibles',
          'Les réglementations et lois en vigueur',
          'Les options de support et horaires'
        ],
        important: 'Important :',
        notice: 'Les données affichées correspondent aux réglementations et offres du pays sélectionné. La société décline toute responsabilité en cas de sélection incorrecte de la région.',
        conclusion: 'Choisissez la langue correspondant à votre pays de résidence pour obtenir les informations les plus pertinentes.'
      },
      close: 'Fermer'
    },
    en: {
      selectLanguage: 'Select Language',
      languageNotice: 'Language determines the information and data displayed',
      learnMore: 'Learn more',
      modalTitle: 'Language Selection Impact',
      modalContent: {
        intro: 'Language selection on our platform is more than just translation.',
        impact: 'Your selection determines:',
        impacts: [
          'Displayed prices and currency',
          'Applicable terms and conditions',
          'Available server locations',
          'Applicable regulations and laws',
          'Support options and schedules'
        ],
        important: 'Important:',
        notice: 'The data displayed corresponds to the regulations and offers of the selected country. The company disclaims any responsibility in case of incorrect region selection.',
        conclusion: 'Choose the language corresponding to your country of residence for the most relevant information.'
      },
      close: 'Close'
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  if (loading) {
    return (
      <div className="flex items-center space-x-2 text-zinc-400 text-sm">
        <div className="w-4 h-4 border-2 border-zinc-600 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const currentLangInfo = {
    fr: { name: 'Français', fullName: 'Français (France)', code: 'FR' },
    en: { name: 'English', fullName: 'English (US)', code: 'EN' }
  };

  return (
    <>
      <div className="language-selector relative">
        {/* Main Button */}
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className={`
            flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 md:py-2
            bg-zinc-900 hover:bg-zinc-800
            border border-zinc-700/50 hover:border-zinc-600
            rounded-lg transition-all duration-300
            ${isChangingLanguage ? 'opacity-60' : ''}
            ${showDropdown ? 'ring-2 ring-blue-500/20 border-blue-500/50' : ''}
          `}
          disabled={isChangingLanguage}
        >
          <GlobeAltIcon className="w-3.5 md:w-4 h-3.5 md:h-4 text-zinc-400" />
          <span className="text-xs md:text-sm font-medium text-zinc-200">
            {currentLangInfo[language as keyof typeof currentLangInfo]?.code}
          </span>
          <ChevronDownIcon className={`w-2.5 md:w-3 h-2.5 md:h-3 text-zinc-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown */}
        {showDropdown && (
          <div className="absolute top-full right-0 mt-2 w-64 md:w-72 max-w-[calc(100vw-2rem)] bg-zinc-900 border border-zinc-700/50 rounded-xl shadow-2xl overflow-hidden z-50">
            {/* Notice */}
            <div className="px-4 py-3 bg-blue-500/10 border-b border-zinc-700/50">
              <div className="flex items-start gap-2">
                <InformationCircleIcon className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {t.languageNotice}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowInfoModal(true);
                      setShowDropdown(false);
                    }}
                    className="text-xs text-blue-400 hover:text-blue-300 mt-1 transition-colors"
                  >
                    {t.learnMore} →
                  </button>
                </div>
              </div>
            </div>

            {/* Language Options */}
            <div className="py-2">
              {Object.entries(currentLangInfo).map(([langCode, info]) => (
                <button
                  key={langCode}
                  onClick={() => handleLanguageChange(langCode)}
                  className={`
                    w-full px-4 py-3 flex items-center gap-3
                    transition-all duration-200
                    ${language === langCode
                      ? 'bg-blue-500/10 text-white'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                    }
                  `}
                >
                  <div className="w-8 h-6 bg-zinc-800 rounded flex items-center justify-center text-xs font-bold text-zinc-400">
                    {langCode.toUpperCase()}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm">{info.name}</div>
                    <div className="text-xs opacity-60">{info.fullName}</div>
                  </div>
                  {language === langCode && (
                    <CheckIcon className="w-4 h-4 text-blue-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Information Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowInfoModal(false)}
          />

          {/* Modal */}
          <div ref={modalRef} className="relative bg-zinc-900 border border-zinc-700 rounded-xl md:rounded-2xl max-w-2xl w-full my-8 shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 md:w-10 h-8 md:h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <GlobeAltIcon className="w-4 md:w-5 h-4 md:h-5 text-blue-400" />
                </div>
                <h2 className="text-lg md:text-xl font-semibold text-white">
                  {t.modalTitle}
                </h2>
              </div>
              <button
                onClick={() => setShowInfoModal(false)}
                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            {/* Content */}
            <div className="px-4 md:px-6 py-4 md:py-6 space-y-4 md:space-y-6 max-h-[60vh] overflow-y-auto">
              <p className="text-zinc-300 leading-relaxed">
                {t.modalContent.intro}
              </p>

              <div>
                <p className="text-zinc-200 font-medium mb-3">
                  {t.modalContent.impact}
                </p>
                <ul className="space-y-2">
                  {t.modalContent.impacts.map((impact, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-zinc-400 text-sm">{impact}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {detectedCountry && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                  <p className="text-blue-200 text-sm">
                    {language === 'fr' ? `Vous avez été détecté comme étant en : ${detectedCountry}` : `You have been detected as being in: ${detectedCountry}`}
                  </p>
                </div>
              )}

              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <InformationCircleIcon className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div className="space-y-2">
                    <p className="text-amber-200 font-medium text-sm">
                      {t.modalContent.important}
                    </p>
                    <p className="text-zinc-300 text-sm leading-relaxed">
                      {t.modalContent.notice}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-zinc-400 text-sm italic">
                {t.modalContent.conclusion}
              </p>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-zinc-900 border-t border-zinc-800 px-4 md:px-6 py-3 md:py-4">
              <button
                onClick={() => setShowInfoModal(false)}
                className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}