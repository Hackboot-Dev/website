'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useScrollProgress } from '../../hooks/useAwwardsAnimation';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSelector from '../ui/LanguageSelector';
import ProductsDropdown from '../ui/ProductsDropdown';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollProgress = useScrollProgress();
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-zinc-950/95 backdrop-blur-lg border-zinc-700/60' 
        : 'bg-zinc-950/80 backdrop-blur-md border-zinc-800/50'
    } border-b`}>
      <div className="container mx-auto px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo avec micro-animation */}
          <Link href="/" className="flex items-center group">
            <span className="text-white font-light text-lg tracking-wide group-hover:tracking-widest transition-all duration-300">
              VMCloud
            </span>
          </Link>

          {/* Scroll progress bar */}
          <div className="absolute bottom-0 left-0 h-px bg-zinc-700 transition-all duration-300" style={{ width: `${scrollProgress * 100}%` }}></div>

          {/* Desktop Navigation avec micro-interactions */}
          <nav className="hidden md:flex items-center space-x-12">
            <Link href="/infrastructure" className="link-minimal text-zinc-400 hover:text-white text-sm tracking-wide group relative">
              <span className="group-hover:tracking-wide transition-all duration-300">{t('nav.infrastructure')}</span>
            </Link>
            <ProductsDropdown />
            <Link href="/pricing" className="link-minimal text-zinc-400 hover:text-white text-sm tracking-wide group relative">
              <span className="group-hover:tracking-wide transition-all duration-300">{t('nav.pricing')}</span>
            </Link>
            <Link href="/docs" className="link-minimal text-zinc-400 hover:text-white text-sm tracking-wide group relative">
              <span className="group-hover:tracking-wide transition-all duration-300">{t('nav.documentation')}</span>
            </Link>
            <Link href="/support" className="link-minimal text-zinc-400 hover:text-white text-sm tracking-wide group relative">
              <span className="group-hover:tracking-wide transition-all duration-300">{t('nav.support')}</span>
            </Link>
          </nav>

          {/* CTA avec animations sophistiquées */}
          <div className="hidden md:flex items-center space-x-6">
            <LanguageSelector />
            <Link href="/login" className="text-zinc-400 hover:text-white text-sm tracking-wide transition-all duration-300 hover:tracking-wide">
              {t('nav.signIn')}
            </Link>
            <Link 
              href="/demo" 
              className="bg-white text-zinc-950 px-6 py-2 text-sm tracking-wide hover:bg-zinc-100 transition-all duration-300 hover:scale-105 hover:tracking-wide relative overflow-hidden group"
            >
              <span className="relative z-10">{t('nav.getStarted')}</span>
              <div className="absolute inset-0 bg-zinc-200 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-zinc-800">
            <nav className="flex flex-col space-y-4">
              <Link href="/infrastructure" className="text-zinc-300 hover:text-white py-2 text-sm tracking-wide">
                {t('nav.infrastructure')}
              </Link>
              <Link href="/products" className="text-zinc-300 hover:text-white py-2 text-sm tracking-wide">
                {t('nav.products')}
              </Link>
              <Link href="/pricing" className="text-zinc-300 hover:text-white py-2 text-sm tracking-wide">
                {t('nav.pricing')}
              </Link>
              <Link href="/docs" className="text-zinc-300 hover:text-white py-2 text-sm tracking-wide">
                {t('nav.documentation')}
              </Link>
              <Link href="/support" className="text-zinc-300 hover:text-white py-2 text-sm tracking-wide">
                {t('nav.support')}
              </Link>
              <div className="pt-4 border-t border-zinc-800 mt-4">
                <div className="mb-4">
                  <LanguageSelector />
                </div>
                <Link href="/login" className="block text-zinc-300 hover:text-white py-2 text-sm tracking-wide">
                  {t('nav.signIn')}
                </Link>
                <Link href="/demo" className="block bg-white text-zinc-950 px-4 py-2 mt-2 text-sm tracking-wide">
                  {t('nav.getStarted')}
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}