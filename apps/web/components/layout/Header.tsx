'use client';

import LocalizedLink from '../ui/LocalizedLink';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useScrollProgress } from '../../hooks/useAwwardsAnimation';
import { useContext } from 'react';
import { LanguageContext } from '../../contexts/LanguageContext';
import LanguageSelector from '../ui/LanguageSelector';
import ProductsDropdown from '../ui/ProductsDropdown';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollProgress = useScrollProgress();
  // Check if LanguageContext is available
  const context = useContext(LanguageContext);
  const t = context ? context.t : (key: string) => key;

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
          <LocalizedLink href="/" className="flex items-center group">
            <span className="text-white font-light text-lg tracking-wide group-hover:tracking-widest transition-all duration-300">
              VMCloud
            </span>
          </LocalizedLink>

          {/* Scroll progress bar */}
          <div className="absolute bottom-0 left-0 h-px bg-zinc-700 transition-all duration-300" style={{ width: `${scrollProgress * 100}%` }}></div>

          {/* Desktop Navigation avec micro-interactions */}
          <nav className="hidden md:flex items-center space-x-12">
            <LocalizedLink href="/infrastructure" className="link-minimal text-zinc-400 hover:text-white text-sm tracking-wide group relative">
              <span className="group-hover:tracking-wide transition-all duration-300">{t('nav.infrastructure')}</span>
            </LocalizedLink>
            <ProductsDropdown />
            <LocalizedLink href="/pricing" className="link-minimal text-zinc-400 hover:text-white text-sm tracking-wide group relative">
              <span className="group-hover:tracking-wide transition-all duration-300">{t('nav.pricing')}</span>
            </LocalizedLink>
            <LocalizedLink href="/support" className="link-minimal text-zinc-400 hover:text-white text-sm tracking-wide group relative">
              <span className="group-hover:tracking-wide transition-all duration-300">{t('nav.support')}</span>
            </LocalizedLink>
            <LocalizedLink href="/about" className="link-minimal text-zinc-400 hover:text-white text-sm tracking-wide group relative">
              <span className="group-hover:tracking-wide transition-all duration-300">{t('about.title')}</span>
            </LocalizedLink>
            <LocalizedLink href="/careers" className="link-minimal text-zinc-400 hover:text-white text-sm tracking-wide group relative">
              <span className="group-hover:tracking-wide transition-all duration-300">{t('nav.careers')}</span>
            </LocalizedLink>
          </nav>

          {/* CTA avec animations sophistiquées */}
          <div className="hidden md:flex items-center space-x-6">
            <LanguageSelector />
            <LocalizedLink href="/login" className="text-zinc-400 hover:text-white text-sm tracking-wide transition-all duration-300 hover:tracking-wide">
              {t('nav.signIn')}
            </LocalizedLink>
            <LocalizedLink 
              href="/products" 
              className="bg-white text-zinc-950 px-6 py-2 text-sm tracking-wide hover:bg-zinc-100 transition-all duration-300 hover:scale-105 hover:tracking-wide relative overflow-hidden group"
            >
              <span className="relative z-10">{t('nav.getStarted')}</span>
              <div className="absolute inset-0 bg-zinc-200 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </LocalizedLink>
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
              <LocalizedLink
                href="/infrastructure"
                className="text-zinc-300 hover:text-white py-2 text-sm tracking-wide"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.infrastructure')}
              </LocalizedLink>
              <LocalizedLink
                href="/products"
                className="text-zinc-300 hover:text-white py-2 text-sm tracking-wide"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.products')}
              </LocalizedLink>
              <LocalizedLink
                href="/pricing"
                className="text-zinc-300 hover:text-white py-2 text-sm tracking-wide"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.pricing')}
              </LocalizedLink>
              <LocalizedLink
                href="/support"
                className="text-zinc-300 hover:text-white py-2 text-sm tracking-wide"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.support')}
              </LocalizedLink>
              <LocalizedLink
                href="/about"
                className="text-zinc-300 hover:text-white py-2 text-sm tracking-wide"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('about.title')}
              </LocalizedLink>
              <LocalizedLink
                href="/careers"
                className="text-zinc-300 hover:text-white py-2 text-sm tracking-wide"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.careers')}
              </LocalizedLink>
              <div className="pt-4 border-t border-zinc-800 mt-4">
                <div className="mb-4">
                  <LanguageSelector />
                </div>
                <LocalizedLink
                  href="/login"
                  className="block text-zinc-300 hover:text-white py-2 text-sm tracking-wide"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.signIn')}
                </LocalizedLink>
                <LocalizedLink
                  href="/products"
                  className="block bg-white text-zinc-950 px-4 py-2 mt-2 text-sm tracking-wide rounded-lg shadow-sm hover:bg-zinc-100 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.getStarted')}
                </LocalizedLink>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
