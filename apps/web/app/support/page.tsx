'use client';

// /workspaces/website/apps/web/app/support/page.tsx
// Description: Support page with complete help center
// Last modified: 2025-08-27
// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Badge from '../../components/ui/Badge';
import { Icons } from '../../components/ui/Icons';
import { useLanguage } from '../../contexts/LanguageContext';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import {
  ChatBubbleLeftRightIcon,
  TicketIcon,
  EnvelopeIcon,
  PhoneIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  ClockIcon,
  StarIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  WrenchScrewdriverIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  ServerIcon,
  GlobeAltIcon,
  CpuChipIcon,
  CircleStackIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

// Support data structure
const supportData = {
  en: {
    hero: {
      badge: "Support & Assistance",
      title: "Hackboot Help Center",
      subtitle: "We're Here to Help",
      description: "Expert technical support available 24/7. Average response time < 15 minutes.",
      searchPlaceholder: "Search knowledge base...",
      popularSearches: ["How to create a VM", "SSH Configuration", "API Documentation", "Billing"]
    },
    stats: [
      { label: "Response Time", value: "< 15 min" },
      { label: "Satisfaction", value: "98%" },
      { label: "Availability", value: "24/7" },
      { label: "Tickets/Month", value: "2,500+" }
    ],
    channels: [
      {
        icon: TicketIcon,
        title: "Ticket System",
        description: "Track your request with detailed history",
        features: ["Real-time tracking", "File attachments", "Priority queue"],
        responseTime: "< 2 hours",
        cta: "Create Ticket"
      },
      {
        icon: ChatBubbleLeftRightIcon,
        title: "Live Chat",
        description: "Instant help from our experts",
        features: ["Immediate response", "Screen sharing", "Multilingual"],
        responseTime: "< 1 minute",
        cta: "Start Chat"
      },
      {
        icon: EnvelopeIcon,
        title: "Email Support",
        description: "For non-urgent detailed requests",
        features: ["Detailed responses", "Documentation", "Ticket tracking"],
        responseTime: "< 4 hours",
        cta: "Send Email"
      },
      {
        icon: PhoneIcon,
        title: "Phone Support",
        description: "Direct line for Enterprise customers",
        features: ["Dedicated line", "Senior engineers", "24/7 availability"],
        responseTime: "Immediate",
        cta: "Call Now"
      }
    ],
    faq: {
      title: "Frequently Asked Questions",
      items: [
        {
          question: "How do I create my first virtual machine?",
          answer: "Log in to your dashboard, click 'Create VM', choose your configuration, select a region, and click 'Deploy'. Your VM will be ready in less than 55 seconds."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept credit/debit cards (Visa, Mastercard, Amex), PayPal, SEPA transfers, and Bitcoin. Enterprise customers can benefit from monthly invoicing."
        },
        {
          question: "How do I configure SSH access?",
          answer: "Add your public SSH key when creating your VM. Once deployed, connect via: ssh root@[your-vm-ip]. Manage keys from the 'Security' dashboard section."
        },
        {
          question: "What is your refund policy?",
          answer: "We offer a 7-day money-back guarantee for new customers. Unused credits can be refunded pro-rata for annual commitments."
        },
        {
          question: "How can I upgrade my VM resources?",
          answer: "Resize your VM anytime from the dashboard. RAM and CPU upgrades require a quick reboot (< 30 seconds). Storage can be added hot."
        },
        {
          question: "Do you offer automatic backups?",
          answer: "Yes, automatic snapshots every 6h with 7-day retention as an option. Business/Enterprise get daily backups with 30-day retention included."
        }
      ]
    },
    resources: {
      title: "Knowledge Base",
      categories: [
        { icon: "🚀", title: "Getting Started", count: "25 articles" },
        { icon: "📚", title: "API Documentation", count: "150+ endpoints" },
        { icon: "🎓", title: "Tutorials", count: "45 guides" },
        { icon: "🔧", title: "Troubleshooting", count: "80 solutions" },
        { icon: "💳", title: "Billing", count: "15 articles" },
        { icon: "🔒", title: "Security", count: "30 guides" }
      ]
    },
    emergency: {
      title: "24/7 Emergency Support",
      description: "For critical production incidents",
      phone: "+372 555 0911",
      note: "Reserved for Business and Enterprise customers"
    }
  },
  fr: {
    hero: {
      badge: "Support & Assistance",
      title: "Centre d'Aide Hackboot",
      subtitle: "Nous sommes là pour vous",
      description: "Support technique expert disponible 24/7. Temps de réponse moyen < 15 minutes.",
      searchPlaceholder: "Rechercher dans la base de connaissances...",
      popularSearches: ["Créer une VM", "Configuration SSH", "Documentation API", "Facturation"]
    },
    stats: [
      { label: "Temps de réponse", value: "< 15 min" },
      { label: "Satisfaction", value: "98%" },
      { label: "Disponibilité", value: "24/7" },
      { label: "Tickets/Mois", value: "2 500+" }
    ],
    channels: [
      {
        icon: TicketIcon,
        title: "Système de Tickets",
        description: "Suivez votre demande avec historique détaillé",
        features: ["Suivi temps réel", "Pièces jointes", "File prioritaire"],
        responseTime: "< 2 heures",
        cta: "Créer un Ticket"
      },
      {
        icon: ChatBubbleLeftRightIcon,
        title: "Chat en Direct",
        description: "Aide instantanée de nos experts",
        features: ["Réponse immédiate", "Partage d'écran", "Multilingue"],
        responseTime: "< 1 minute",
        cta: "Démarrer le Chat"
      },
      {
        icon: EnvelopeIcon,
        title: "Support Email",
        description: "Pour les demandes détaillées non urgentes",
        features: ["Réponses détaillées", "Documentation", "Suivi par ticket"],
        responseTime: "< 4 heures",
        cta: "Envoyer un Email"
      },
      {
        icon: PhoneIcon,
        title: "Support Téléphonique",
        description: "Ligne directe pour clients Enterprise",
        features: ["Ligne dédiée", "Ingénieurs senior", "Disponible 24/7"],
        responseTime: "Immédiat",
        cta: "Appeler"
      }
    ],
    faq: {
      title: "Questions Fréquemment Posées",
      items: [
        {
          question: "Comment créer ma première machine virtuelle ?",
          answer: "Connectez-vous au dashboard, cliquez sur 'Créer une VM', choisissez votre configuration, sélectionnez une région et cliquez sur 'Déployer'. Votre VM sera prête en moins de 55 secondes."
        },
        {
          question: "Quels moyens de paiement acceptez-vous ?",
          answer: "Nous acceptons les cartes de crédit/débit (Visa, Mastercard, Amex), PayPal, virements SEPA et Bitcoin. Les clients Enterprise peuvent bénéficier de la facturation mensuelle."
        },
        {
          question: "Comment configurer l'accès SSH ?",
          answer: "Ajoutez votre clé SSH publique lors de la création de votre VM. Une fois déployée, connectez-vous via : ssh root@[ip-de-votre-vm]. Gérez vos clés depuis la section 'Sécurité' du dashboard."
        },
        {
          question: "Quelle est votre politique de remboursement ?",
          answer: "Nous offrons une garantie de remboursement de 7 jours pour les nouveaux clients. Les crédits non utilisés peuvent être remboursés au prorata pour les engagements annuels."
        },
        {
          question: "Comment augmenter les ressources de ma VM ?",
          answer: "Redimensionnez votre VM à tout moment depuis le dashboard. Les augmentations de RAM et CPU nécessitent un redémarrage rapide (< 30 secondes). Le stockage peut être ajouté à chaud."
        },
        {
          question: "Proposez-vous des sauvegardes automatiques ?",
          answer: "Oui, snapshots automatiques toutes les 6h avec rétention de 7 jours en option. Business/Enterprise obtiennent des sauvegardes quotidiennes avec 30 jours de rétention inclus."
        }
      ]
    },
    resources: {
      title: "Base de Connaissances",
      categories: [
        { icon: "🚀", title: "Débuter", count: "25 articles" },
        { icon: "📚", title: "Documentation API", count: "150+ endpoints" },
        { icon: "🎓", title: "Tutoriels", count: "45 guides" },
        { icon: "🔧", title: "Dépannage", count: "80 solutions" },
        { icon: "💳", title: "Facturation", count: "15 articles" },
        { icon: "🔒", title: "Sécurité", count: "30 guides" }
      ]
    },
    emergency: {
      title: "Support d'Urgence 24/7",
      description: "Pour les incidents critiques en production",
      phone: "+372 555 0911",
      note: "Réservé aux clients Business et Enterprise"
    }
  }
};

// Optimized intersection observer hook
function useInView(options = {}) {
  const [ref, setRef] = useState(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref);
        }
      },
      {
        rootMargin: options.rootMargin || '-50px',
        threshold: options.threshold || 0.1
      }
    );

    observer.observe(ref);

    return () => {
      if (ref) observer.unobserve(ref);
    };
  }, [ref, options.rootMargin, options.threshold]);

  return [setRef, inView];
}

export default function SupportPage() {
  const { locale } = useLanguage();
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const t = supportData[locale] || supportData['en'];

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/20 to-transparent" />
        
        <div className="container mx-auto px-4 relative">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="outline" className="mb-6">
                {t.hero.badge}
              </Badge>
              
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                {t.hero.title}
              </h1>
              
              <p className="text-xl text-zinc-400 mb-4">
                {t.hero.subtitle}
              </p>
              
              <p className="text-zinc-500 mb-12 max-w-2xl mx-auto">
                {t.hero.description}
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto mb-8">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.hero.searchPlaceholder}
                  className="w-full px-12 py-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors"
                />
              </div>
              
              {/* Popular Searches */}
              <div className="flex items-center justify-center gap-3 flex-wrap">
                {t.hero.popularSearches.map((search, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSearchQuery(search)}
                    className="text-sm text-zinc-500 hover:text-white transition-colors border border-zinc-800 hover:border-zinc-700 px-3 py-1 rounded-full"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-zinc-900">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {t.stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <p className="text-3xl font-bold text-white mb-2">{stat.value}</p>
                  <p className="text-zinc-500 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Support Channels */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                Support Channels
              </h2>
              <p className="text-zinc-500 max-w-2xl mx-auto">
                Choose the channel that works best for you
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {t.channels.map((channel, idx) => {
                const Icon = channel.icon;
                return (
                  <div
                    key={idx}
                    className="group relative bg-zinc-950 border border-zinc-900 rounded-2xl p-6 hover:border-zinc-800 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity" />
                    
                    <Icon className="w-12 h-12 text-cyan-500 mb-4" />
                    
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {channel.title}
                    </h3>
                    
                    <p className="text-zinc-500 text-sm mb-4">
                      {channel.description}
                    </p>
                    
                    <ul className="space-y-2 mb-4">
                      {channel.features.map((feature, fidx) => (
                        <li key={fidx} className="text-zinc-400 text-sm flex items-start">
                          <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <p className="text-cyan-500 text-sm mb-4">
                      Response: {channel.responseTime}
                    </p>
                    
                    <button className="w-full py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors">
                      {channel.cta}
                    </button>
                  </div>
                );
              })}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 lg:py-32 bg-zinc-950/50">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                {t.faq.title}
              </h2>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {t.faq.items.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-zinc-900/80 transition-colors"
                  >
                    <span className="text-white font-medium">{item.question}</span>
                    <ChevronDownIcon
                      className={`w-5 h-5 text-zinc-500 transition-transform ${
                        expandedFaq === idx ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expandedFaq === idx && (
                    <div className="px-6 pb-4 text-zinc-400">
                      {item.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Knowledge Base */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                {t.resources.title}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {t.resources.categories.map((category, idx) => (
                <Link
                  key={idx}
                  href={`/docs/${category.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className="group bg-zinc-950 border border-zinc-900 rounded-2xl p-6 hover:border-zinc-800 transition-all duration-300"
                >
                  <div className="text-3xl mb-4">{category.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-cyan-500 transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-zinc-600 text-sm">
                    {category.count}
                  </p>
                </Link>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Emergency Support */}
      <section className="py-20 lg:py-32 bg-gradient-to-r from-red-500/10 to-orange-500/10">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center">
              <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">
                {t.emergency.title}
              </h2>
              <p className="text-zinc-400 mb-6">
                {t.emergency.description}
              </p>
              <p className="text-4xl font-bold text-red-500 mb-4">
                {t.emergency.phone}
              </p>
              <p className="text-zinc-500 text-sm">
                {t.emergency.note}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// Animation wrapper component
function AnimatedSection({ children }) {
  const [ref, inView] = useInView({ rootMargin: '-50px', threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`transform transition-all duration-1000 ${
        inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
    >
      {children}
    </div>
  );
}