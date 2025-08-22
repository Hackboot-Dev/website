'use client';
// /workspaces/website/apps/web/components/layout/Footer.tsx
// Description: Footer avec design Awwwards minimal
// Last modified: 2025-08-16
// Related docs: /docs/JOURNAL.md

// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

import Link from 'next/link';

export default function Footer() {
  const footerLinks = {
    products: [
      { name: 'VPS', href: '/products#vps' },
      { name: 'GPU Cloud', href: '/products#gpu' },
      { name: 'Hébergement Web', href: '/products#webhosting' },
      { name: 'Tarifs', href: '/pricing' }
    ],
    company: [
      { name: 'À propos', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Carrières', href: '/careers' },
      { name: 'Contact', href: '/contact' }
    ],
    support: [
      { name: 'Documentation', href: '/docs' },
      { name: 'Status', href: '/status' },
      { name: 'Support', href: '/support' },
      { name: 'API', href: '/api' }
    ],
    legal: [
      { name: 'Conditions', href: '/terms' },
      { name: 'Confidentialité', href: '/privacy' },
      { name: 'Cookies', href: '/cookies' },
      { name: 'RGPD', href: '/gdpr' }
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
            <h3 className="text-white text-sm font-medium tracking-wide mb-4">Produits</h3>
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
            <h3 className="text-white text-sm font-medium tracking-wide mb-4">Entreprise</h3>
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
            <h3 className="text-white text-sm font-medium tracking-wide mb-4">Support</h3>
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
            <h3 className="text-white text-sm font-medium tracking-wide mb-4">Légal</h3>
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
            © 2025 VMCloud. Tous droits réservés.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-zinc-500 text-xs tracking-wider">Tous les systèmes opérationnels</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}