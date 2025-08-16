import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-darker text-gray-300 border-t border-white/5">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">VM</span>
              </div>
              <span className="text-white font-semibold text-xl">VMCloud</span>
            </div>
            <p className="text-sm mb-4">
              Votre partenaire de confiance pour l'hébergement cloud haute performance.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white font-semibold mb-4">Produits</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/vps" className="hover:text-primary transition-colors">
                  VPS Linux
                </Link>
              </li>
              <li>
                <Link href="/vps-windows" className="hover:text-primary transition-colors">
                  VPS Windows
                </Link>
              </li>
              <li>
                <Link href="/dedicated" className="hover:text-primary transition-colors">
                  Serveurs Dédiés
                </Link>
              </li>
              <li>
                <Link href="/cloud" className="hover:text-primary transition-colors">
                  Cloud Computing
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/docs" className="hover:text-blue-400 transition">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-blue-400 transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/status" className="hover:text-blue-400 transition">
                  Statut des services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-400 transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <Mail className="w-4 h-4 mt-0.5" />
                <span>support@vmcloud.com</span>
              </li>
              <li className="flex items-start space-x-2">
                <Phone className="w-4 h-4 mt-0.5" />
                <span>+33 1 23 45 67 89</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>Paris, France</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 mb-4 md:mb-0">
            © 2024 VMCloud. Tous droits réservés.
          </p>
          <div className="flex space-x-6 text-sm">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Confidentialité
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Conditions
            </Link>
            <Link href="/legal" className="hover:text-primary transition-colors">
              Mentions légales
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}