'use client';

// /workspaces/website/apps/web/app/support/page.tsx
// Description: Support page with sophisticated Awwwards-level design
// Last modified: 2025-08-28

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../contexts/LanguageContext';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import SupportChannelsAdvanced from '../../components/support/SupportChannelsAdvanced';
import SophisticatedBackground from '../../components/animations/SophisticatedBackground';
import { useRevealAnimation, useStaggerReveal, useParallax } from '../../hooks/useAwwardsAnimation';
import {
  ChevronDownIcon,
  ArrowUpRightIcon
} from '@heroicons/react/24/outline';

const supportData = {
  en: {
    label: "SUPPORT",
    title: {
      1: "Enterprise-grade support",
      2: "built for scale"
    },
    subtitle: "Connecting you with solutions through intelligent routing and expert assistance.",
    stats: [
      { value: "15", unit: "min", label: "AVG RESPONSE" },
      { value: "98", unit: "%", label: "SATISFACTION" },
      { value: "24", unit: "/7", label: "AVAILABILITY" },
      { value: "95", unit: "%", label: "RESOLUTION" }
    ],
    knowledge: {
      label: "RESOURCES",
      title: {
        1: "Self-service",
        2: "knowledge base"
      },
      categories: [
        { name: "Getting Started", count: "25", metric: "GUIDES" },
        { name: "API Reference", count: "150+", metric: "ENDPOINTS" },
        { name: "Tutorials", count: "45", metric: "LESSONS" },
        { name: "Troubleshooting", count: "80", metric: "SOLUTIONS" },
        { name: "Security", count: "30", metric: "PRACTICES" },
        { name: "Billing", count: "15", metric: "ARTICLES" }
      ]
    },
    faq: {
      label: "FAQ",
      title: {
        1: "Common questions",
        2: "answered"
      },
      items: [
        {
          q: "How do I create my first virtual machine?",
          a: "Access dashboard → Create VM → Configure resources → Select region → Deploy. Ready in under 55 seconds."
        },
        {
          q: "What payment methods are supported?",
          a: "Credit/debit cards, PayPal, SEPA transfers, Bitcoin. Monthly invoicing available for Enterprise."
        },
        {
          q: "How to configure SSH access?",
          a: "Add public SSH key during VM creation. Connect: ssh root@[vm-ip]. Manage keys in Security dashboard."
        },
        {
          q: "What is the refund policy?",
          a: "7-day money-back guarantee for new customers. Pro-rata refunds for annual commitments."
        },
        {
          q: "Can I upgrade VM resources?",
          a: "Resize anytime from dashboard. RAM/CPU upgrades require quick reboot. Storage hot-addable."
        },
        {
          q: "Are automatic backups available?",
          a: "Snapshots every 6h with 7-day retention. Business/Enterprise: daily backups, 30-day retention."
        }
      ]
    },
    emergency: {
      label: "CRITICAL",
      title: "Emergency hotline",
      phone: "+372 555 0911",
      note: "Business & Enterprise only"
    }
  },
  fr: {
    label: "SUPPORT",
    title: {
      1: "Support de niveau",
      2: "entreprise"
    },
    subtitle: "Solutions intelligentes et assistance experte pour votre infrastructure.",
    stats: [
      { value: "15", unit: "min", label: "TEMPS RÉPONSE" },
      { value: "98", unit: "%", label: "SATISFACTION" },
      { value: "24", unit: "/7", label: "DISPONIBILITÉ" },
      { value: "95", unit: "%", label: "RÉSOLUTION" }
    ],
    knowledge: {
      label: "RESSOURCES",
      title: {
        1: "Base de",
        2: "connaissances"
      },
      categories: [
        { name: "Démarrage", count: "25", metric: "GUIDES" },
        { name: "Référence API", count: "150+", metric: "ENDPOINTS" },
        { name: "Tutoriels", count: "45", metric: "LEÇONS" },
        { name: "Dépannage", count: "80", metric: "SOLUTIONS" },
        { name: "Sécurité", count: "30", metric: "PRATIQUES" },
        { name: "Facturation", count: "15", metric: "ARTICLES" }
      ]
    },
    faq: {
      label: "FAQ",
      title: {
        1: "Questions",
        2: "fréquentes"
      },
      items: [
        {
          q: "Comment créer ma première machine virtuelle ?",
          a: "Dashboard → Créer VM → Configurer ressources → Région → Déployer. Prête en moins de 55 secondes."
        },
        {
          q: "Quels moyens de paiement acceptés ?",
          a: "Cartes crédit/débit, PayPal, SEPA, Bitcoin. Facturation mensuelle pour Enterprise."
        },
        {
          q: "Comment configurer l'accès SSH ?",
          a: "Ajouter clé SSH publique à la création. Connexion : ssh root@[ip-vm]. Gérer dans dashboard Sécurité."
        },
        {
          q: "Politique de remboursement ?",
          a: "Garantie 7 jours nouveaux clients. Remboursements pro-rata pour engagements annuels."
        },
        {
          q: "Puis-je augmenter les ressources ?",
          a: "Redimensionner depuis dashboard. RAM/CPU nécessitent redémarrage. Stockage ajout à chaud."
        },
        {
          q: "Sauvegardes automatiques disponibles ?",
          a: "Snapshots 6h avec rétention 7j. Business/Enterprise : quotidiennes, rétention 30j."
        }
      ]
    },
    emergency: {
      label: "CRITIQUE",
      title: "Ligne d'urgence",
      phone: "+372 555 0911",
      note: "Business & Enterprise uniquement"
    }
  }
};

export default function SupportPage() {
  const { language } = useLanguage();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [hoveredResource, setHoveredResource] = useState<number | null>(null);
  
  const t = supportData[language] || supportData['en'];

  // Animations
  const titleReveal = useRevealAnimation({ delay: 100 });
  const subtitleReveal = useRevealAnimation({ delay: 300 });
  const { containerRef: statsRef, visibleItems: statsVisible } = useStaggerReveal(4, 150);
  const { containerRef: resourcesRef, visibleItems: resourcesVisible } = useStaggerReveal(6, 100);
  const { containerRef: faqRef, visibleItems: faqVisible } = useStaggerReveal(6, 80);
  const geometricParallax = useParallax(0.3);
  const emergencyReveal = useRevealAnimation({ delay: 200 });

  return (
    <>
      <SophisticatedBackground />
      <div className="min-h-screen bg-zinc-950">
        {/* Subtle noise texture */}
        <div className="fixed inset-0 opacity-[0.015] bg-noise pointer-events-none" />
        
        <Header />
      
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex items-center py-24 sm:py-32 overflow-hidden">
          {/* Geometric background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/3 right-1/4 w-px h-32 bg-gradient-to-b from-transparent via-zinc-700 to-transparent" />
            <div className="absolute bottom-1/3 left-1/4 w-24 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
            <div className="absolute inset-0 bg-grid opacity-[0.02]" />
            <div 
              ref={geometricParallax.elementRef}
              style={geometricParallax.style}
              className="absolute top-1/4 left-1/6 w-2 h-2 bg-zinc-800 rounded-full animate-subtle-float"
            />
            <div className="absolute bottom-1/4 right-1/6 w-1 h-1 bg-zinc-700 rounded-full animate-subtle-float" style={{ animationDelay: '2s' }} />
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
            <div className="flex flex-col items-center justify-center text-center">
              {/* Label */}
              <div className="mb-8">
                <span className="text-xs tracking-[0.3em] text-zinc-500 font-mono uppercase">
                  {t.label}
                </span>
              </div>
              
              {/* Title */}
              <div 
                ref={titleReveal.elementRef}
                style={titleReveal.style}
                className="mb-8 max-w-5xl"
              >
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extralight tracking-tight leading-[0.95]">
                  <span className="block text-white hover:tracking-wide transition-all duration-700">
                    {t.title[1]}
                  </span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 to-zinc-600 mt-2">
                    {t.title[2]}
                  </span>
                </h1>
              </div>

              {/* Subtitle */}
              <div 
                ref={subtitleReveal.elementRef}
                style={subtitleReveal.style}
                className="max-w-3xl"
              >
                <p className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed">
                  {t.subtitle}
                </p>
              </div>
              
              {/* CTA Line */}
              <div className="mt-16 flex items-center space-x-8">
                <div className="w-24 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent"></div>
                <div className="w-2 h-2 bg-zinc-700 rounded-full animate-pulse"></div>
                <div className="w-24 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 border-y border-zinc-900/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-12">
              {t.stats.map((stat, idx) => (
                <div 
                  key={idx} 
                  className="group relative"
                  style={{
                    opacity: statsVisible[idx] ? 1 : 0,
                    transform: statsVisible[idx] ? 'translateY(0)' : 'translateY(20px)',
                    transition: `all 600ms cubic-bezier(0.16, 1, 0.3, 1) ${idx * 100}ms`
                  }}
                >
                  <div className="text-center">
                    <div className="mb-3">
                      <span className="text-4xl font-extralight text-white group-hover:text-zinc-200 transition-colors">
                        {stat.value}
                      </span>
                      <span className="text-xl font-extralight text-zinc-600 ml-1">
                        {stat.unit}
                      </span>
                    </div>
                    <span className="text-[10px] tracking-[0.3em] text-zinc-600 font-mono uppercase">
                      {stat.label}
                    </span>
                    <div className="mt-4 mx-auto w-8 h-px bg-zinc-800 group-hover:w-12 group-hover:bg-zinc-600 transition-all duration-300" />
                  </div>
                  {/* Subtle corner accent on hover */}
                  <div className="absolute -top-2 -right-2 w-4 h-4 border-t border-r border-zinc-800/0 group-hover:border-zinc-700 transition-all duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Support Channels Component */}
        <SupportChannelsAdvanced />

        {/* Knowledge Base */}
        <section className="relative py-24 lg:py-32 bg-gradient-to-b from-zinc-950 via-zinc-900/50 to-zinc-950">
          {/* Geometric accents */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/3 w-12 h-px bg-zinc-800 transform rotate-45" />
            <div className="absolute bottom-1/3 right-1/4 w-8 h-px bg-zinc-800 transform -rotate-45" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-6xl mx-auto">
              {/* Section Header */}
              <div className="mb-16">
                <div className="mb-8">
                  <span className="text-xs tracking-[0.3em] text-zinc-500 font-mono">
                    {t.knowledge.label}
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight leading-[1.1]">
                  <span className="block text-white">{t.knowledge.title[1]}</span>
                  <span className="block text-gradient-subtle">{t.knowledge.title[2]}</span>
                </h2>
              </div>

              {/* Resources Grid */}
              <div ref={resourcesRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {t.knowledge.categories.map((cat, idx) => (
                  <div
                    key={idx}
                    className="group relative"
                    style={{
                      opacity: resourcesVisible[idx] ? 1 : 0,
                      transform: resourcesVisible[idx] ? 'translateY(0)' : 'translateY(30px)',
                      transition: `all 600ms cubic-bezier(0.16, 1, 0.3, 1) ${idx * 100}ms`
                    }}
                    onMouseEnter={() => setHoveredResource(idx)}
                    onMouseLeave={() => setHoveredResource(null)}
                  >
                    <div className="card-minimal p-8 h-full">
                      {/* Metric */}
                      <div className="mb-4">
                        <span className="text-[10px] text-zinc-500 tracking-[0.3em] font-mono">
                          {cat.metric}
                        </span>
                      </div>
                      
                      {/* Content */}
                      <div className="space-y-4">
                        <h3 className="text-xl font-light text-white group-hover:text-zinc-200 transition-colors">
                          {cat.name}
                        </h3>
                        <div className="flex items-baseline space-x-2">
                          <span className="text-3xl font-extralight text-zinc-400">
                            {cat.count}
                          </span>
                        </div>
                      </div>
                      
                      {/* Decorative line */}
                      <div className="mt-6 w-8 h-px bg-zinc-700 group-hover:w-12 group-hover:bg-zinc-500 transition-all duration-300" />
                      
                      {/* Hover arrow */}
                      <div className={`absolute top-8 right-8 transition-all duration-300 ${
                        hoveredResource === idx ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                      }`}>
                        <ArrowUpRightIcon className="w-4 h-4 text-zinc-500" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="relative py-24 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {/* Section Header */}
              <div className="mb-16">
                <div className="mb-8">
                  <span className="text-xs tracking-[0.3em] text-zinc-500 font-mono">
                    {t.faq.label}
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight leading-[1.1]">
                  <span className="block text-white">{t.faq.title[1]}</span>
                  <span className="block text-gradient-subtle">{t.faq.title[2]}</span>
                </h2>
              </div>

              {/* FAQ Items */}
              <div ref={faqRef} className="space-y-px">
                {t.faq.items.map((item, idx) => (
                  <div 
                    key={idx}
                    style={{
                      opacity: faqVisible[idx] ? 1 : 0,
                      transform: faqVisible[idx] ? 'translateY(0)' : 'translateY(20px)',
                      transition: `all 600ms cubic-bezier(0.16, 1, 0.3, 1) ${idx * 80}ms`
                    }}
                  >
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                      className="w-full py-6 text-left flex items-start justify-between group hover:pl-2 transition-all duration-300"
                    >
                      <span className="text-zinc-300 font-light pr-4 group-hover:text-white transition-colors">
                        {item.q}
                      </span>
                      <ChevronDownIcon
                        className={`w-4 h-4 text-zinc-600 flex-shrink-0 mt-1 transition-transform duration-300 ${
                          expandedFaq === idx ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    
                    <div className={`overflow-hidden transition-all duration-500 ${
                      expandedFaq === idx ? 'max-h-48' : 'max-h-0'
                    }`}>
                      <p className="pb-6 pl-2 pr-12 text-zinc-500 font-light text-sm leading-relaxed">
                        {item.a}
                      </p>
                    </div>
                    
                    {/* Separator line */}
                    <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Emergency Support - Premium Card Design */}
        <section className="relative py-32 lg:py-40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div 
              ref={emergencyReveal.elementRef}
              style={emergencyReveal.style}
              className="max-w-4xl mx-auto"
            >
              {/* Premium Emergency Card */}
              <div className="relative group">
                {/* Background glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-zinc-900/20 to-red-900/10 blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-1000" />
                
                {/* Main card */}
                <div className="relative bg-gradient-to-br from-zinc-900/90 via-zinc-900/70 to-zinc-900/90 backdrop-blur-xl border border-red-900/30 rounded-2xl overflow-hidden">
                  {/* Corner accent */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-900/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-red-900/10 to-transparent" />
                  
                  {/* Grid pattern overlay */}
                  <div className="absolute inset-0 bg-grid opacity-[0.01]" />
                  
                  {/* Content */}
                  <div className="relative p-12 lg:p-16">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                      {/* Left side - Info */}
                      <div className="text-left">
                        <div className="mb-6">
                          <span className="text-[10px] tracking-[0.4em] text-red-800/70 font-mono uppercase">
                            {language === 'fr' ? 'ASSISTANCE CRITIQUE' : 'CRITICAL ASSISTANCE'}
                          </span>
                        </div>
                        
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight text-white mb-6 leading-[1.1]">
                          {language === 'fr' ? 'Ligne urgence' : 'Emergency'}
                          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-700 to-red-900 mt-2">
                            {language === 'fr' ? 'entreprise' : 'hotline'}
                          </span>
                        </h2>
                        
                        <p className="text-zinc-400 font-light text-lg mb-8 leading-relaxed">
                          {language === 'fr' 
                            ? 'Accès direct à nos ingénieurs seniors pour incidents critiques affectant votre production.'
                            : 'Direct access to senior engineers for critical incidents affecting your production environment.'
                          }
                        </p>
                        
                        {/* Features list */}
                        <div className="space-y-3 mb-8">
                          <div className="flex items-center space-x-3">
                            <div className="w-1 h-1 bg-red-700/50 rounded-full" />
                            <span className="text-sm text-zinc-500">
                              {language === 'fr' ? 'Réponse immédiate garantie' : 'Guaranteed immediate response'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-1 h-1 bg-red-700/50 rounded-full" />
                            <span className="text-sm text-zinc-500">
                              {language === 'fr' ? 'Escalade prioritaire niveau 1' : 'Priority level 1 escalation'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-1 h-1 bg-red-700/50 rounded-full" />
                            <span className="text-sm text-zinc-500">
                              {language === 'fr' ? 'Équipe dédiée 24/7/365' : 'Dedicated team 24/7/365'}
                            </span>
                          </div>
                        </div>
                        
                        {/* Availability badge */}
                        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-full">
                          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                          <span className="text-xs text-zinc-400 font-mono uppercase tracking-wider">
                            {t.emergency.note}
                          </span>
                        </div>
                      </div>
                      
                      {/* Right side - Phone */}
                      <div className="text-center lg:text-right">
                        <div className="inline-block">
                          <a 
                            href={`tel:${t.emergency.phone.replace(/\s/g, '')}`}
                            className="group/phone block p-8 bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-red-900/30 rounded-xl hover:border-red-800/50 transition-all duration-500 hover:scale-[1.02]"
                          >
                            <div className="mb-4">
                              <span className="text-xs text-zinc-500 uppercase tracking-wider">
                                {language === 'fr' ? 'Appel direct' : 'Direct call'}
                              </span>
                            </div>
                            <div className="text-4xl lg:text-5xl font-extralight text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800 group-hover/phone:from-red-500 group-hover/phone:to-red-700 transition-all duration-300">
                              {t.emergency.phone}
                            </div>
                            <div className="mt-6 mx-auto w-16 h-px bg-gradient-to-r from-transparent via-red-800/50 to-transparent group-hover/phone:w-24 transition-all duration-300" />
                          </a>
                          
                          {/* Operating hours */}
                          <div className="mt-6 text-center">
                            <p className="text-xs text-zinc-600">
                              {language === 'fr' ? 'Disponible 24h/24, 7j/7' : 'Available 24/7'}
                            </p>
                            <p className="text-xs text-zinc-600 mt-1">
                              {language === 'fr' ? 'Temps de réponse < 30s' : 'Response time < 30s'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}