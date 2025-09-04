'use client';
import Link from 'next/link';
import { useLanguage } from '../../contexts/LanguageContext';

export default function Footer() {
  const { language } = useLanguage();
  const isProd = process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_APP_ENV === 'production';
  const docsEnabled = !isProd;

  const isFr = (language || 'fr') === 'fr';
  const labels = {
    products: isFr ? 'Produits' : 'Products',
    company: isFr ? 'Entreprise' : 'Company',
    support: isFr ? 'Support' : 'Support',
    legal: isFr ? 'Légal' : 'Legal',
  };

  const footerLinks = {
    products: [
      { name: isFr ? 'VPS' : 'VPS', href: '/products#vps' },
      { name: isFr ? 'GPU Cloud' : 'GPU Cloud', href: '/products#gpu' },
      { name: isFr ? 'Hébergement Web' : 'Web Hosting', href: '/products#webhosting' },
      { name: isFr ? 'Tarifs' : 'Pricing', href: '/pricing' }
    ],
    company: [
      { name: isFr ? 'À propos' : 'About', href: '/about' },
      { name: isFr ? 'Blog' : 'Blog', href: '/blog' },
      { name: isFr ? 'Carrières' : 'Careers', href: '/careers' },
      { name: isFr ? 'Contact' : 'Contact', href: '/contact' }
    ],
    support: [
      ...(docsEnabled ? [{ name: isFr ? 'Documentation' : 'Documentation', href: '/docs' }] : []),
      { name: isFr ? 'Statut' : 'Status', href: '/status' },
      { name: isFr ? 'Support' : 'Support', href: '/support' },
      { name: isFr ? 'API' : 'API', href: '/api' }
    ],
    legal: [
      { name: isFr ? 'Conditions' : 'Terms', href: '/legal/terms' },
      { name: isFr ? 'SLA' : 'SLA', href: '/legal/sla' },
      { name: isFr ? 'Usage Acceptable' : 'Acceptable Use', href: '/legal/aup' },
      { name: isFr ? 'RGPD/DPA' : 'GDPR/DPA', href: '/legal/dpa' },
      { name: isFr ? 'Changements' : 'Changes', href: '/legal/changes' }
    ]
  };

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800/50">
      <div className="container mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="text-white font-light text-xl tracking-wide hover:tracking-widest transition-all duration-300">
              VMCloud
            </Link>
            <p className="text-zinc-400 text-sm mt-4 font-light max-w-xs">
              Infrastructure cloud haute performance pour développeurs et entreprises.
            </p>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white text-sm font-medium tracking-wide mb-4">{labels.products}</h3>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-zinc-400 text-sm hover:text-white transition-colors duration-300 hover:tracking-wide"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white text-sm font-medium tracking-wide mb-4">{labels.company}</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-zinc-400 text-sm hover:text-white transition-colors duration-300 hover:tracking-wide"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white text-sm font-medium tracking-wide mb-4">{labels.support}</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-zinc-400 text-sm hover:text-white transition-colors duration-300 hover:tracking-wide"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white text-sm font-medium tracking-wide mb-4">{labels.legal}</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-zinc-400 text-sm hover:text-white transition-colors duration-300 hover:tracking-wide"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-zinc-800/50 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-zinc-500 text-sm">
            {isFr ? '© 2025 VMCloud. Tous droits réservés.' : '© 2025 VMCloud. All rights reserved.'}
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-zinc-500 text-xs tracking-wider">{isFr ? 'Tous les systèmes opérationnels' : 'All systems operational'}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
