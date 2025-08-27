'use client';

// /workspaces/website/apps/web/app/support/page.tsx
// Description: Support page with dynamic channel status from channels.json
// Last modified: 2025-08-27
// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Badge from '../../components/ui/Badge';
import { useLanguage } from '../../contexts/LanguageContext';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import channelsConfig from '../../data/support/channels.json';
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
  XCircleIcon,
  WrenchIcon,
  BeakerIcon,
  ArrowRightIcon,
  UserGroupIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

// Icon mapping
const iconMap = {
  ticket: TicketIcon,
  chat: ChatBubbleLeftRightIcon,
  email: EnvelopeIcon,
  phone: PhoneIcon,
  community: UserGroupIcon,
  ai: SparklesIcon
};

// Status icon mapping
const statusIcons = {
  'check-circle': CheckCircleIcon,
  'x-circle': XCircleIcon,
  'exclamation-triangle': ExclamationTriangleIcon,
  'wrench': WrenchIcon,
  'beaker': BeakerIcon
};

// Status colors
const statusColors = {
  green: 'text-green-500 bg-green-500/10 border-green-500/30',
  yellow: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
  red: 'text-red-500 bg-red-500/10 border-red-500/30',
  orange: 'text-orange-500 bg-orange-500/10 border-orange-500/30',
  purple: 'text-purple-500 bg-purple-500/10 border-purple-500/30'
};

// Support data translations
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
    channelLabels: {
      responseTime: "Response Time",
      availability: "Availability",
      status: "Status",
      getSupport: "Get Support",
      notAvailable: "Not Available",
      requiresPlan: "Requires",
      comingSoon: "Coming Soon"
    },
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
    channelLabels: {
      responseTime: "Temps de réponse",
      availability: "Disponibilité",
      status: "Statut",
      getSupport: "Obtenir du support",
      notAvailable: "Non disponible",
      requiresPlan: "Nécessite",
      comingSoon: "Bientôt disponible"
    },
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
function useInView(options: { rootMargin?: string; threshold?: number } = {}) {
  const [ref, setRef] = useState<HTMLElement | null>(null);
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
  const { language } = useLanguage();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const t = supportData[language] || supportData['en'];
  const { channels, statusDefinitions } = channelsConfig;

  // Get channel features for display
  const getChannelFeatures = (channel: any) => {
    const features = [];
    if (channel.id === 'tickets') {
      features.push('Real-time tracking', 'File attachments', 'Priority queue');
    } else if (channel.id === 'livechat') {
      features.push('Instant messaging', 'AI Assistant', 'Screen sharing');
    } else if (channel.id === 'email') {
      features.push('Detailed responses', 'Ticket tracking', 'Auto-reply');
    } else if (channel.id === 'phone') {
      features.push('Dedicated line', 'Senior engineers', 'Emergency hotline');
    }
    return features;
  };

  // Get channel availability text
  const getAvailabilityText = (channel: any) => {
    if (channel.availability.always) return '24/7';
    if (typeof channel.availability.schedule === 'string') return channel.availability.schedule;
    if (channel.availability.schedule?.weekdays) return 'Business hours';
    return 'Limited';
  };

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
                {t.hero.popularSearches.map((search: string, idx: number) => (
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
              {t.stats.map((stat: any, idx: number) => (
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
              {channels.filter((ch: any) => ch.enabled).map((channel: any) => {
                const Icon = iconMap[channel.icon as keyof typeof iconMap];
                const status = statusDefinitions[channel.status as keyof typeof statusDefinitions];
                const StatusIcon = statusIcons[status.icon as keyof typeof statusIcons];
                
                return (
                  <div
                    key={channel.id}
                    className="group relative bg-zinc-950 border border-zinc-900 rounded-2xl p-6 hover:border-zinc-800 transition-all duration-300"
                  >
                    {/* Status Badge */}
                    <div className={`absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-full border ${statusColors[status.color as keyof typeof statusColors]}`}>
                      <StatusIcon className="w-3 h-3" />
                      <span className="text-xs font-medium">{status.label}</span>
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity" />
                    
                    <Icon className="w-12 h-12 text-cyan-500 mb-4" />
                    
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {channel.name}
                    </h3>
                    
                    <p className="text-zinc-500 text-sm mb-4">
                      {channel.id === 'tickets' && 'Track your request with detailed history'}
                      {channel.id === 'livechat' && 'Instant help from our AI & experts'}
                      {channel.id === 'email' && 'For non-urgent detailed requests'}
                      {channel.id === 'phone' && 'Direct line for urgent issues'}
                    </p>
                    
                    <ul className="space-y-2 mb-4">
                      {getChannelFeatures(channel).map((feature: string, idx: number) => (
                        <li key={idx} className="text-zinc-400 text-sm flex items-start">
                          <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-600">{t.channelLabels.responseTime}:</span>
                        <span className="text-zinc-400">
                          {channel.responseTime.average} {channel.responseTime.unit}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-600">{t.channelLabels.availability}:</span>
                        <span className="text-zinc-400">{getAvailabilityText(channel)}</span>
                      </div>
                    </div>
                    
                    {channel.status === 'available' || channel.status === 'beta' ? (
                      <Link
                        href={channel.url}
                        className="block w-full py-2 bg-white/5 hover:bg-white/10 text-white text-center rounded-lg transition-colors"
                      >
                        {t.channelLabels.getSupport}
                      </Link>
                    ) : channel.status === 'limited' ? (
                      <div className="w-full py-2 bg-zinc-900/50 text-zinc-500 text-center rounded-lg text-sm">
                        {t.channelLabels.requiresPlan} {channel.minPlan}
                      </div>
                    ) : (
                      <div className="w-full py-2 bg-zinc-900/50 text-zinc-600 text-center rounded-lg text-sm">
                        {t.channelLabels.notAvailable}
                      </div>
                    )}
                    
                    {/* AI Badge for AI-powered channels */}
                    {(channel.features?.aiAssistant || channel.id === 'ai_assistant') && (
                      <div className="mt-3 flex items-center justify-center gap-1 text-xs text-purple-500">
                        <SparklesIcon className="w-3 h-3" />
                        <span>Powered by Gemini AI</span>
                      </div>
                    )}
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
              {t.faq.items.map((item: any, idx: number) => (
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
              {t.resources.categories.map((category: any, idx: number) => (
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
function AnimatedSection({ children }: { children: React.ReactNode }) {
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