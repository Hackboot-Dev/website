'use client';
// /apps/web/components/sections/PartnersSection.tsx
// Description: Modern partners showcase section with gradient cards
// Last modified: 2025-09-17
// Related docs: /docs/FEATURES.md

import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { Building2, Cpu, Globe, Shield, Sparkles } from 'lucide-react';

export default function PartnersSection() {
  const { t, language } = useLanguage();
  const isEn = language === 'en';

  const mainPartners = [
    {
      name: 'OVHCloud',
      role: isEn ? 'Technology Partner' : 'Partenaire Technologique',
      description: isEn
        ? 'European cloud leader providing infrastructure and expertise'
        : 'Leader européen du cloud fournissant infrastructure et expertise',
      amount: isEn ? 'Partner' : 'Partenaire',
      gradient: 'from-blue-500 to-cyan-500',
      icon: Building2
    },
    {
      name: 'SEB Pank',
      role: isEn ? 'Banking Partner' : 'Partenaire Bancaire',
      description: isEn
        ? 'Major Baltic bank facilitating our European expansion'
        : 'Banque majeure des pays baltes facilitant notre expansion européenne',
      amount: isEn ? 'Partner' : 'Partenaire',
      gradient: 'from-green-500 to-emerald-500',
      icon: Shield
    }
  ];

  const techPartners = [
    { name: 'AMD', description: 'EPYC Processors', icon: Cpu },
    { name: 'NVIDIA', description: 'Tesla & RTX GPUs', icon: Cpu },
    { name: 'Equinix', description: 'Network Infrastructure', icon: Globe },
    { name: 'Cloudflare', description: 'Security & CDN', icon: Shield }
  ];

  return (
    <section className="relative py-32 bg-zinc-950 overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 sm:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-xs tracking-[0.3em] text-zinc-500 uppercase font-light mb-4 block">
              {isEn ? 'Ecosystem' : 'Écosystème'}
            </span>
            <h2 className="text-5xl lg:text-6xl font-extralight text-white mb-6">
              <span className="block">{isEn ? 'Powered by' : 'Propulsé par'}</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                {isEn ? 'Industry Leaders' : 'Leaders de l\'Industrie'}
              </span>
            </h2>
            <p className="text-zinc-400 max-w-3xl mx-auto text-lg">
              {isEn
                ? 'Strategic partnerships with world-class companies to deliver exceptional infrastructure'
                : 'Partenariats stratégiques avec des entreprises de classe mondiale pour une infrastructure exceptionnelle'
              }
            </p>
          </motion.div>

          {/* Main investors */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {mainPartners.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >

                {/* Card content */}
                <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8 lg:p-10 hover:border-zinc-700 transition-all duration-300">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-3xl font-light text-white mb-2">{partner.name}</h3>
                      <p className="text-sm text-zinc-500 uppercase tracking-wider">{partner.role}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="px-4 py-2 bg-gradient-to-r from-zinc-800 to-zinc-700 rounded-full text-white font-medium">
                        {partner.amount}
                      </span>
                    </div>
                  </div>
                  <p className="text-zinc-400 leading-relaxed mb-6">
                    {partner.description}
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${partner.gradient} rounded-xl flex items-center justify-center`}>
                      <partner.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-zinc-600" />
                      <span className="text-xs text-zinc-500">{isEn ? 'Strategic Partner' : 'Partenaire Stratégique'}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Technology partners */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-light text-white mb-8 text-center">
              {isEn ? 'Technology Partners' : 'Partenaires Technologiques'}
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {techPartners.map((partner, index) => (
                <motion.div
                  key={partner.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="bg-zinc-800/30 rounded-xl p-6 text-center hover:bg-zinc-800/50 transition-all duration-300 group"
                >
                  <partner.icon className="w-10 h-10 mx-auto mb-4 text-zinc-600 group-hover:text-zinc-500 transition-colors" />
                  <h4 className="text-lg font-light text-white mb-2">{partner.name}</h4>
                  <p className="text-xs text-zinc-500">{partner.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}