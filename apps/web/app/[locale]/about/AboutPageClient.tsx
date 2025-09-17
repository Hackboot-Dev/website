'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useEntryAnimation, useStaggerEntry } from '../../../hooks/useEntryAnimation';
import { useParallax } from '../../../hooks/useAwwardsAnimation';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import SophisticatedBackground from '../../../components/animations/SophisticatedBackground';
import {
  Building2, Users, TrendingUp, Award, Globe, Shield, Zap, Clock,
  ArrowRight, Sparkles, Target,
  Rocket
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AboutPageClient() {
  const { t, language } = useLanguage();
  const isEn = language === 'en';
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateViewport = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 768);
      }
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  // Animations
  const titleReveal = useEntryAnimation({ delay: 100 });
  const subtitleReveal = useEntryAnimation({ delay: 300 });
  const { visibleItems: statsVisible } = useStaggerEntry(4, 150, 500);
  const { visibleItems: partnersVisible } = useStaggerEntry(6, 100, 800);
  const { visibleItems: timelineVisible } = useStaggerEntry(6, 100, 600);
  const geometryParallax = useParallax(0.3);

  return (
    <>
      <Header />
      {!isMobile && <SophisticatedBackground />}

      <main className="relative min-h-screen bg-zinc-950 overflow-x-hidden">
        {/* Hero Section Améliorée */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          {/* Background patterns */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 opacity-[0.15] bg-noise"></div>
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent"></div>
          </div>

          {/* Floating elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="hidden md:block absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-zinc-800/20 to-transparent rounded-full blur-3xl"
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ duration: 10, repeat: Infinity }}
            />
            <motion.div
              className="hidden md:block absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-tr from-zinc-800/20 to-transparent rounded-full blur-3xl"
              animate={{
                y: [0, 20, 0],
                rotate: [0, -5, 0]
              }}
              transition={{ duration: 12, repeat: Infinity }}
            />
          </div>

          {/* Geometric accents */}
          <div
            ref={geometryParallax.elementRef}
            className="hidden lg:block absolute top-0 right-0 w-1/2 h-full"
            style={geometryParallax.style}
          >
            <div className="absolute top-32 right-16 w-px h-96 bg-gradient-to-b from-transparent via-zinc-600 to-transparent"></div>
            <div className="absolute top-64 right-32 w-32 h-px bg-gradient-to-r from-transparent via-zinc-600 to-transparent"></div>
            <div className="absolute top-48 right-48 w-px h-32 bg-gradient-to-b from-zinc-700 to-transparent"></div>
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-56 right-24 w-2 h-2 bg-zinc-500 rounded-full"
            />
          </div>

          <div className="container mx-auto px-6 sm:px-8 relative z-10">
            <div className="max-w-6xl">
              {/* Label amélioré */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8 flex items-center space-x-4"
              >
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-zinc-600"></div>
                <span className="text-xs tracking-[0.3em] text-zinc-500 uppercase font-light">
                  {t('about.label') || '2023 - 2026 • L\'Innovation Continue'}
                </span>
              </motion.div>

              {/* Titre avec meilleur style */}
              <div
                ref={titleReveal.elementRef}
                className="mb-16"
                style={titleReveal.style}
              >
                <h1 className="relative">
                  <motion.span
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="block text-5xl lg:text-6xl xl:text-7xl font-extralight tracking-tight text-white leading-[0.9]"
                  >
                    {t('about.hero.title1') || (isEn ? 'From Hackboot' : 'De Hackboot')}
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45, duration: 0.6 }}
                    className="block text-5xl lg:text-6xl xl:text-7xl font-extralight tracking-tight leading-[0.9] mt-2"
                  >
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-300 to-zinc-500">
                      {t('about.hero.title2') || 'À VMCloud'}
                    </span>
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="block text-5xl lg:text-6xl xl:text-7xl font-extralight tracking-tight text-white leading-[0.9] mt-2"
                  >
                    {t('about.hero.title3') || 'L\'Évolution'}
                  </motion.span>
                </h1>
              </div>

              {/* Subtitle amélioré */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="max-w-3xl"
              >
                <p className="text-lg lg:text-xl text-zinc-400 font-light leading-relaxed mb-8">
                  {t('about.hero.subtitle') || 'Depuis 2023, nous avons évolué de la vente de clés de jeux au développement logiciel, puis au cloud gaming. Fin 2025, avec 2.5M€ levés, VMCloud structure cette expertise pour conquérir le marché européen depuis l\'Estonie.'}
                </p>

                {/* CTA buttons */}
                <div className="flex flex-wrap gap-6">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href="/products"
                      className="inline-flex items-center space-x-3 group"
                    >
                      <span className="text-white text-sm tracking-wide">{t('about.buttons.exploreSolutions') || 'Explorer nos solutions'}</span>
                      <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </Link>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href="#story"
                      className="inline-flex items-center space-x-3 group"
                    >
                      <span className="text-zinc-500 hover:text-zinc-300 text-sm tracking-wide transition-colors">{t('about.buttons.ourStory') || 'Notre histoire'}</span>
                      <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-px h-16 bg-gradient-to-b from-zinc-600 to-transparent"
            />
          </motion.div>
        </section>

        {/* Stats Section Améliorée */}
        <section className="py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-900/20 to-transparent"></div>
          <div className="container mx-auto px-6 sm:px-8 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-6xl mx-auto">
              {[
                {
                  number: '2023',
                  label: t('about.stats.founded') || 'Création Hackboot',
                  icon: Rocket,
                  description: t('about.stats.descriptions.keySales') || 'Vente de clés & logiciels'
                },
                {
                  number: '2.5M€',
                  label: t('about.stats.funding') || 'Investissements',
                  icon: TrendingUp,
                  description: t('about.stats.descriptions.investors') || 'OVH, SEB Pank & plus'
                },
                {
                  number: '3',
                  label: t('about.stats.datacenters') || 'Datacenters',
                  icon: Globe,
                  description: t('about.stats.descriptions.locations') || 'Paris, Amsterdam, Frankfurt'
                },
                {
                  number: '99.99%',
                  label: t('about.stats.sla') || 'SLA Garanti',
                  icon: Shield,
                  description: t('about.stats.descriptions.availability') || 'Disponibilité maximale'
                }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={statsVisible[index] ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="text-center p-6 sm:p-8 bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 hover:border-zinc-700/50 transition-all duration-500 hover:bg-zinc-900/50">
                    <stat.icon className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-4 sm:mb-6 text-zinc-600 group-hover:text-zinc-500 transition-colors" />
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-extralight text-white mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
                      {stat.number}
                    </div>
                    <div className="text-sm text-zinc-400 tracking-wider mb-2 uppercase">{stat.label}</div>
                    <div className="text-xs text-zinc-600 font-light">{stat.description}</div>
                  </div>

                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-800/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section - Histoire complète */}
        <section id="story" className="py-32 relative">
          <div className="container mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl lg:text-5xl font-extralight text-white mb-6 tracking-tight">
                {t('about.timeline.title') || 'De Hackboot à VMCloud'}
              </h2>
              <p className="text-zinc-500 max-w-2xl mx-auto">
                {t('about.timeline.subtitle') || 'L\'évolution d\'une vision gaming vers une infrastructure cloud complète'}
              </p>
            </motion.div>

            <div className="max-w-5xl mx-auto relative">
              {/* Timeline line */}
              <div className="absolute left-6 lg:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-zinc-700 to-transparent"></div>

              {/* Timeline items */}
              {[
                {
                  year: '2023',
                  title: t('about.timeline.items.hackbootCreation.title') || (isEn ? 'Creation of Hackboot' : 'Création de Hackboot'),
                  description: t('about.timeline.items.hackbootCreation.description') || 'Début avec la vente de clés de jeux à prix compétitifs. Construction d\'une première base client et compréhension du marché gaming.',
                  icon: Rocket,
                  highlight: false
                },
                {
                  year: t('common.year2023End') || (isEn ? 'Late 2023' : 'Fin 2023'),
                  title: t('about.timeline.items.softwareDev.title') || (isEn ? 'Software Development' : 'Développement Logiciel'),
                  description: t('about.timeline.items.softwareDev.description') || 'Pivot vers le développement de logiciels sur mesure. Création d\'outils et d\'applications pour la communauté gaming.',
                  icon: Code,
                  highlight: false
                },
                {
                  year: t('common.year2025Mid') || (isEn ? 'Mid-2025' : 'Mi-2025'),
                  title: t('about.timeline.items.cloudGaming.title') || (isEn ? 'Cloud Gaming & Cheats' : 'Cloud Gaming & Cheats'),
                  description: t('about.timeline.items.cloudGaming.description') || (isEn ? 'Launch of cloud gaming and legal cheat development in Estonia. Deep technical expertise in GPU optimization.' : 'Lancement du cloud gaming et développement de cheats légaux en Estonie. Expertise technique approfondie en optimisation GPU.'),
                  icon: Cpu,
                  highlight: false
                },
                {
                  year: t('common.year2025End') || (isEn ? 'Late 2025' : 'Fin 2025'),
                  title: t('about.timeline.items.vmcloudBirth.title') || (isEn ? 'Birth of VMCloud' : 'Naissance de VMCloud'),
                  description: t('about.timeline.items.vmcloudBirth.description') || (isEn ? '€2.5M raised with OVHCloud and SEB Pank. Company structuring and transformation into VMCloud for the European market.' : 'Levée de 2.5M€ avec OVHCloud et SEB Pank. Structuration de l\'entreprise et transformation en VMCloud pour le marché européen.'),
                  icon: Sparkles,
                  highlight: true
                },
                {
                  year: t('common.year2025End') || (isEn ? 'Late 2025' : 'Fin 2025'),
                  title: t('about.timeline.items.rapidExpansion.title') || (isEn ? 'Rapid Expansion' : 'Expansion Rapide'),
                  description: t('about.timeline.items.rapidExpansion.description') || (isEn ? 'Acquiring thousands of customers, European expansion from Estonia. Enterprise infrastructure deployed in 3 major datacenters.' : 'Acquisition de milliers de clients, expansion européenne depuis l\'Estonie. Infrastructure enterprise déployée dans 3 datacenters majeurs.'),
                  icon: Globe,
                  highlight: false
                },
                {
                  year: '2026',
                  title: t('about.timeline.items.innovation.title') || (isEn ? 'Innovation & Growth' : 'Innovation & Croissance'),
                  description: t('about.timeline.items.innovation.description') || (isEn ? 'Consolidating achievements, adding innovative new services. New datacenters planned in Madrid and Milan. AI solutions development.' : 'Consolidation des acquis, ajout de nouveaux services innovants. Nouveaux datacenters prévus à Madrid et Milan. Développement de solutions IA.'),
                  icon: Target,
                  highlight: false
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className={`relative flex items-center mb-16 ${
                    index % 2 === 0 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Content */}
                  <div className={`w-full lg:w-5/12 ${index % 2 === 0 ? 'lg:text-right lg:pr-12' : 'lg:pl-12'} pl-16 lg:pl-0`}>
                    <div className={`${item.highlight ? 'bg-zinc-900/50 border border-zinc-700 p-6' : 'p-6'} hover:bg-zinc-900/30 transition-all duration-300`}>
                      <div className={`text-sm text-zinc-500 mb-2 ${index % 2 === 0 ? 'lg:text-right' : ''}`}>
                        {item.year}
                      </div>
                      <h3 className={`text-xl font-light text-white mb-3 ${item.highlight ? 'text-2xl' : ''}`}>
                        {item.title}
                      </h3>
                      <p className="text-zinc-400 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="absolute left-0 lg:left-1/2 transform lg:-translate-x-1/2 w-14 h-14 sm:w-16 sm:h-16 bg-zinc-900 border-2 border-zinc-700 rounded-full flex items-center justify-center z-10">
                    <item.icon className={`w-6 h-6 ${item.highlight ? 'text-white' : 'text-zinc-500'}`} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Partners Grid Amélioré */}
        <section className="py-32 relative bg-gradient-to-b from-transparent via-zinc-900/30 to-transparent">
          <div className="container mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl lg:text-5xl font-extralight text-white mb-6 tracking-tight">
                {t('about.partners.title') || (isEn ? 'Ecosystem & Partners' : 'Écosystème & Partenaires')}
              </h2>
              <p className="text-zinc-500 max-w-2xl mx-auto">
                {t('about.partners.subtitle') || (isEn ? 'Industry leaders trust us' : 'Les leaders de l\'industrie nous font confiance')}
              </p>
            </motion.div>

            {/* Main investors */}
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
              {[
                {
                  name: t('about.partners.ovh.name') || 'OVHCloud',
                  role: t('about.partners.ovh.role') || (isEn ? 'Principal Investor' : 'Investisseur Principal'),
                  description: t('about.partners.ovh.description') || (isEn ? 'European cloud leader, OVHCloud invests €1.5M and brings global technical expertise.' : 'Leader européen du cloud, OVHCloud investit 1.5M€ et apporte son expertise technique mondiale.'),
                  investment: '1.5M€',
                  gradient: 'from-blue-600/20 to-transparent'
                },
                {
                  name: t('about.partners.seb.name') || 'SEB Pank',
                  role: t('about.partners.seb.role') || (isEn ? 'Banking Partner' : 'Partenaire Bancaire'),
                  description: t('about.partners.seb.description') || (isEn ? 'Major Baltic banking institution, invests €800K and facilitates our European expansion.' : 'Institution bancaire majeure des pays baltes, investit 800K€ et facilite notre expansion européenne.'),
                  investment: '800K€',
                  gradient: 'from-green-600/20 to-transparent'
                }
              ].map((partner, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="relative group"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${partner.gradient} opacity-50 group-hover:opacity-70 transition-opacity blur-xl`}></div>
                  <div className="relative bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 p-8 hover:border-zinc-700 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-light text-white">{partner.name}</h3>
                      </div>
                      <span className="bg-gradient-to-r from-zinc-700 to-zinc-800 text-white text-sm px-3 py-1 rounded-full">
                        {partner.investment}
                      </span>
                    </div>
                    <div className="text-sm text-zinc-500 mb-4">{partner.role}</div>
                    <p className="text-zinc-400 leading-relaxed">
                      {partner.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Tech partners */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                { name: t('about.partners.tech.amd.name') || 'AMD', icon: Cpu, description: t('about.partners.tech.amd.description') || 'Processeurs EPYC' },
                { name: t('about.partners.tech.nvidia.name') || 'NVIDIA', icon: Zap, description: t('about.partners.tech.nvidia.description') || 'GPU Tesla & RTX' },
                { name: t('about.partners.tech.equinix.name') || 'Equinix', icon: Globe, description: t('about.partners.tech.equinix.description') || 'Infrastructure réseau' },
                { name: t('about.partners.tech.cloudflare.name') || 'Cloudflare', icon: Shield, description: t('about.partners.tech.cloudflare.description') || 'Sécurité & CDN' }
              ].map((partner, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-zinc-900/30 border border-zinc-800/50 p-6 text-center hover:border-zinc-700/50 hover:bg-zinc-900/50 transition-all duration-300"
                >
                  <partner.icon className="w-8 h-8 mx-auto mb-4 text-zinc-600" />
                  <h4 className="text-white font-light mb-1">{partner.name}</h4>
                  <p className="text-xs text-zinc-500">{partner.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Legal Framework Section */}
        <section className="py-32 relative bg-gradient-to-b from-transparent via-zinc-900/20 to-transparent">
          <div className="container mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-16">
                <h2 className="text-4xl lg:text-5xl font-extralight text-white mb-6 tracking-tight">
                  {t('about.legal.title') || 'Cadre Légal & Conformité'}
                </h2>
                <p className="text-zinc-500 max-w-2xl mx-auto">
                  {t('about.legal.subtitle') || 'Opérant depuis l\'Estonie avec une conformité totale'}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-zinc-900/30 border border-zinc-800 p-8 hover:border-zinc-700 transition-all h-full"
                >
                  <Shield className="w-10 h-10 text-zinc-600 mb-4" />
                  <h3 className="text-xl font-light text-white mb-4">
                    {t('about.legal.estonia.title') || 'Juridiction Estonienne'}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                    {t('about.legal.estonia.content') || 'En Estonie, le développement et l\'utilisation de modifications de jeux (cheats) sont entièrement légaux. Cette juridiction nous permet d\'innover librement tout en respectant les réglementations européennes.'}
                  </p>
                  <ul className="space-y-2 text-sm text-zinc-500">
                    <li className="flex items-start">
                      <span className="text-zinc-600 mr-2">•</span>
                      <span>{t('about.legal.bullets.legalActivity') || (isEn ? '100% legal activity in Estonia' : 'Activité 100% légale en Estonie')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-zinc-600 mr-2">•</span>
                      <span>{t('about.legal.bullets.gdprCompliance') || (isEn ? 'Full GDPR compliance' : 'Conformité RGPD complète')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-zinc-600 mr-2">•</span>
                      <span>{t('about.legal.bullets.euLicense') || (isEn ? 'European operating license' : 'Licence d\'exploitation européenne')}</span>
                    </li>
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-zinc-900/30 border border-zinc-800 p-8 hover:border-zinc-700 transition-all h-full"
                >
                  <Globe className="w-10 h-10 text-zinc-600 mb-4" />
                  <h3 className="text-xl font-light text-white mb-4">
                    {t('about.legal.expansion.title') || (isEn ? 'European Expansion' : 'Expansion Européenne')}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                    {t('about.legal.expansion.content') || (isEn ? 'Our Estonian structure provides an ideal framework for European expansion. We adapt our services to each market while maintaining operational excellence.' : 'Notre structure estonienne nous offre un cadre idéal pour l\'expansion européenne. Nous adaptons nos services à chaque marché tout en maintenant notre excellence opérationnelle.')}
                  </p>
                  <ul className="space-y-2 text-sm text-zinc-500">
                    <li className="flex items-start">
                      <span className="text-zinc-600 mr-2">•</span>
                      <span>{t('about.legal.bullets.euPassport') || (isEn ? 'European services passport' : 'Passeport européen des services')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-zinc-600 mr-2">•</span>
                      <span>{t('about.legal.bullets.multiJurisdiction') || 'Infrastructure multi-juridictionnelle'}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-zinc-600 mr-2">•</span>
                      <span>{t('about.legal.bullets.support247') || 'Support multilingue 24/7'}</span>
                    </li>
                  </ul>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-12 p-6 bg-zinc-900/20 border border-zinc-800/50 text-center"
              >
                <p className="text-sm text-zinc-500">
                  <span className="text-zinc-400">{t('about.legal.note') || 'Note:'}</span> {t('about.legal.note.content') || 'VMCloud opère en totale transparence avec les autorités estoniennes et européennes. Notre activité gaming, incluant le développement de cheats, est déclarée et conforme à la législation locale.'}
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Vision Cards Améliorées */}
        <section className="py-32">
          <div className="container mx-auto px-8">
            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-2xl"></div>
                <div className="relative p-10 border border-zinc-800 hover:border-zinc-700 transition-all duration-500 h-full flex flex-col">
                  <Target className="w-12 h-12 text-zinc-600 mb-6" />
                  <h3 className="text-3xl font-extralight text-white mb-6 tracking-tight">
                    {t('about.vision.title') || 'Notre Vision'}
                  </h3>
                  <p className="text-zinc-400 leading-relaxed flex-grow">
                    {t('about.vision.content') || 'Créer la meilleure infrastructure cloud européenne par et pour des passionnés. Nous croyons qu\'en combinant excellence technique et passion authentique, nous pouvons offrir des solutions sans compromis. Business et passion ne sont pas incompatibles : nous voulons réussir financièrement tout en restant fidèles à nos valeurs.'}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-bl from-zinc-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-2xl"></div>
                <div className="relative p-10 border border-zinc-800 hover:border-zinc-700 transition-all duration-500 h-full flex flex-col">
                  <Code className="w-12 h-12 text-zinc-600 mb-6" />
                  <h3 className="text-3xl font-extralight text-white mb-6 tracking-tight">
                    {t('about.mission.title') || 'Notre Mission'}
                  </h3>
                  <p className="text-zinc-400 leading-relaxed flex-grow">
                    {t('about.mission.content') || 'Libérer le potentiel de chaque projet en fournissant une infrastructure sans limites. Donner à nos clients et à nos équipes tous les outils nécessaires pour réaliser leurs ambitions. Être transparents, ouverts et toujours à l\'écoute. Permettre à chacun de construire ce qu\'il veut, comme il veut.'}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Culture Section */}
        <section className="py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-900/10 to-transparent"></div>
          <div className="container mx-auto px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-5xl mx-auto"
            >
              <div className="text-center mb-16">
                <h2 className="text-4xl lg:text-5xl font-extralight text-white mb-6 tracking-tight">
                  {t('about.culture.title') || (isEn ? 'Our Culture' : 'Notre Culture')}
                </h2>
                <p className="text-zinc-500 max-w-3xl mx-auto text-lg">
                  {t('about.culture.subtitle') || (isEn ? 'A unique corporate philosophy, inspired by tech world best practices' : 'Une philosophie d\'entreprise unique, inspirée des meilleures pratiques du monde tech')}
                </p>
              </div>

              <div className="grid lg:grid-cols-3 gap-8 mb-16">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800 p-8 hover:border-zinc-700 transition-all"
                >
                  <Rocket className="w-10 h-10 text-zinc-600 mb-4" />
                  <h3 className="text-xl font-light text-white mb-3">
                    {t('about.culture.talent.title') || (isEn ? 'Talent & Feeling' : 'Talent & Feeling')}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {t('about.culture.talent.content') || (isEn ? 'We recruit on talent AND feeling. Technical skills are essential, but shared vision and human chemistry are equally important. If you don\'t feel the passion, it won\'t work.' : 'Nous recrutons sur le talent ET le feeling. Les compétences techniques sont essentielles, mais la vision partagée et l\'alchimie humaine le sont tout autant. Si tu ne ressens pas la passion, ça ne marchera pas.')}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800 p-8 hover:border-zinc-700 transition-all"
                >
                  <Globe className="w-10 h-10 text-zinc-600 mb-4" />
                  <h3 className="text-xl font-light text-white mb-3">
                    {t('about.culture.freedom.title') || (isEn ? 'Total Freedom' : 'Liberté Totale')}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {t('about.culture.freedom.content') || (isEn ? 'Work how you want, where you want, when you want. No micro-management, no corporate bullshit. We believe in autonomy and responsibility. Results speak for themselves.' : 'Travaille comme tu veux, où tu veux, quand tu veux. Pas de micro-management, pas de bullshit corporate. Nous croyons en l\'autonomie et la responsabilité. Les résultats parlent d\'eux-mêmes.')}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800 p-8 hover:border-zinc-700 transition-all"
                >
                  <Sparkles className="w-10 h-10 text-zinc-600 mb-4" />
                  <h3 className="text-xl font-light text-white mb-3">
                    {t('about.culture.passion.title') || (isEn ? 'Passion First' : 'Passion Avant Tout')}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {t('about.culture.passion.content') || (isEn ? 'Yes, we\'re a business and we want to succeed financially. But we\'re first and foremost enthusiasts who want to build the best possible solutions. Excellence is non-negotiable.' : 'Oui, nous sommes un business et nous voulons réussir financièrement. Mais nous sommes d\'abord des passionnés qui veulent construire les meilleures solutions possibles. L\'excellence n\'est pas négociable.')}
                  </p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-zinc-900/50 to-zinc-800/30 border border-zinc-700/50 p-10 text-center"
              >
                <h3 className="text-2xl font-light text-white mb-4">
                  {t('about.culture.philosophy.title') || (isEn ? 'Our Philosophy' : 'Notre Philosophie')}
                </h3>
                <p className="text-zinc-300 leading-relaxed mb-6 max-w-3xl mx-auto">
                  {t('about.culture.philosophy.content') || (isEn ? 'We believe in a flat organization where everyone can take initiative, inspired by innovative tech company models. No rigid hierarchy, no corporate politics. Just talented people working together on exciting projects.' : 'Nous croyons en une organisation plate où chacun peut prendre des initiatives, inspirés par les modèles d\'entreprises tech innovantes. Pas de hiérarchie rigide, pas de politique d\'entreprise. Juste des gens talentueux qui travaillent ensemble sur des projets passionnants.')}
                </p>
                <div className="flex flex-wrap gap-4 justify-center text-sm">
                  <span className="px-4 py-2 bg-zinc-800/50 text-zinc-400 rounded-full">{t('about.culture.badges.remoteFirst') || 'Remote First'}</span>
                  <span className="px-4 py-2 bg-zinc-800/50 text-zinc-400 rounded-full">{t('about.culture.badges.noUselessMeetings') || (isEn ? 'No Useless Meetings' : 'Pas de Réunions Inutiles')}</span>
                  <span className="px-4 py-2 bg-zinc-800/50 text-zinc-400 rounded-full">{t('about.culture.badges.fullAutonomy') || (isEn ? 'Full Autonomy' : 'Autonomie Totale')}</span>
                  <span className="px-4 py-2 bg-zinc-800/50 text-zinc-400 rounded-full">{t('about.culture.badges.personalProjects') || 'Projets Personnels'}</span>
                  <span className="px-4 py-2 bg-zinc-800/50 text-zinc-400 rounded-full">{t('about.culture.badges.totalTransparency') || 'Transparence Totale'}</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Team Section avec hover effects */}
        <section className="py-32 border-t border-zinc-800/50">
          <div className="container mx-auto px-6 sm:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl lg:text-5xl font-extralight text-white mb-6 tracking-tight">
                {t('about.team.title') || (isEn ? 'The Core Team' : 'L\'Équipe Principale')}
              </h2>
              <p className="text-zinc-500 max-w-2xl mx-auto">
                {t('about.team.subtitle') || (isEn ? 'The talents building VMCloud\'s future' : 'Les talents qui construisent l\'avenir de VMCloud')}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  name: t('about.team.members.gaylor.name') || 'Gaylor Loche',
                  role: t('about.team.members.gaylor.role') || (isEn ? 'CEO & Founder' : 'CEO & Fondateur'),
                  bio: t('about.team.members.gaylor.bio') || (isEn ? 'Founder of DVP Holding, entrepreneur and AI consultant. Strategic vision and business expertise.' : 'Fondateur de DVP Holding, entrepreneur et consultant IA. Vision stratégique et expertise business.'),
                  image: '/images/team/gaylor.jpg',
                  expertise: [
                    t('about.team.expertise.strategy') || (isEn ? 'Strategy' : 'Stratégie'),
                    t('about.team.expertise.aiConsulting') || (isEn ? 'AI Consulting' : 'Consulting IA'),
                    t('about.team.expertise.businessDev') || (isEn ? 'Business Dev' : 'Business Dev'),
                    t('about.team.expertise.investment') || (isEn ? 'Investment' : 'Investissement')
                  ]
                },
                {
                  name: t('about.team.members.julien.name') || 'Julien Larmanaud',
                  role: t('about.team.members.julien.role') || 'COO & Lead Developer',
                  bio: t('about.team.members.julien.bio') || (isEn ? 'Ex-AWS senior engineer. Expert in GPU computing and high-performance cloud infrastructure.' : 'Ex-AWS senior engineer. Expert GPU computing et infrastructure cloud haute performance.'),
                  image: '/images/team/julien.png',
                  expertise: [
                    t('about.team.expertise.gpuComputing') || (isEn ? 'GPU Computing' : 'GPU Computing'),
                    t('about.team.expertise.cloudInfra') || (isEn ? 'Cloud Infrastructure' : 'Infrastructure Cloud'),
                    t('about.team.expertise.performance') || (isEn ? 'Performance' : 'Performance'),
                    t('about.team.expertise.research') || (isEn ? 'Research' : 'Recherche')
                  ]
                },
                {
                  name: t('about.team.members.gengis.name') || 'Gengis Lahoui',
                  role: t('about.team.members.gengis.role') || (isEn ? 'Technical Director' : 'Directeur Technique'),
                  bio: t('about.team.members.gengis.bio') || (isEn ? 'Ex-O2Switch ML/GenAI engineer. Expert in development and architecture of complex systems.' : 'Ex-O2Switch ML/GenAI engineer. Expert en développement et architecture de systèmes complexes.'),
                  image: '/images/team/gengis.png',
                  expertise: [
                    t('about.team.expertise.machineLearning') || (isEn ? 'Machine Learning' : 'Machine Learning'),
                    t('about.team.expertise.genai') || (isEn ? 'GenAI' : 'GenAI'),
                    t('about.team.expertise.development') || (isEn ? 'Development' : 'Développement'),
                    t('about.team.expertise.architecture') || (isEn ? 'Architecture' : 'Architecture')
                  ]
                }
              ].map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="text-center p-8 bg-zinc-900/30 border border-zinc-800/50 hover:border-zinc-700/50 hover:bg-zinc-900/50 transition-all duration-500 h-full flex flex-col">
                    <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden bg-zinc-800/40">
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    </div>
                    <h4 className="text-xl font-light text-white mb-2">{member.name}</h4>
                    <div className="text-sm text-zinc-500 mb-4">{member.role}</div>
                    <p className="text-sm text-zinc-400 leading-relaxed mb-6 flex-grow">{member.bio}</p>
                    <div className="flex flex-wrap gap-2 justify-center mt-auto">
                      {member.expertise.map((skill, i) => (
                        <span key={i} className="text-xs bg-zinc-800/50 text-zinc-500 px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/50 to-transparent"></div>
          <div className="container mx-auto px-6 sm:px-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-4xl lg:text-5xl font-extralight text-white mb-8 tracking-tight">
                {t('about.cta.title') || (isEn ? 'Ready to Get Started?' : 'Prêt à Démarrer ?')}
              </h2>
              <p className="text-xl text-zinc-400 mb-12 font-light">
                {t('about.cta.subtitle') || (isEn ? 'Join the companies that trust us' : 'Rejoignez les entreprises qui nous font confiance')}
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center px-10 py-4 bg-white text-zinc-950 hover:bg-zinc-100 transition-all duration-300 group"
                  >
                    <span className="text-sm tracking-wide font-medium">{t('about.cta.discoverSolutions') || (isEn ? 'Discover Our Solutions' : 'Découvrir Nos Solutions')}</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/support"
                    className="inline-flex items-center justify-center px-10 py-4 border border-zinc-700 text-white hover:border-zinc-500 hover:bg-zinc-900/50 transition-all duration-300"
                  >
                    <span className="text-sm tracking-wide">{t('about.cta.talkToExpert') || (isEn ? 'Talk to an Expert' : 'Parler à un Expert')}</span>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
