'use client';
// /apps/web/components/sections/InfrastructureSection.tsx
// Description: Modern infrastructure showcase section with animated stats
// Last modified: 2025-09-17
// Related docs: /docs/FEATURES.md

import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  Globe, Shield, Cpu, Server,
  CheckCircle
} from 'lucide-react';

export default function InfrastructureSection() {
  const { t, language } = useLanguage();
  const isEn = language === 'en';

  const stats = [
    {
      value: '3',
      label: isEn ? 'Datacenters' : 'Datacenters',
      icon: Server
    },
    {
      value: '24/7',
      label: isEn ? 'Support' : 'Support',
      icon: Shield
    },
    {
      value: 'GPU',
      label: isEn ? 'Tesla & RTX' : 'Tesla & RTX',
      icon: Cpu
    },
    {
      value: isEn ? 'EU' : 'UE',
      label: isEn ? 'Coverage' : 'Couverture',
      icon: Globe
    }
  ];

  const datacenters = [
    {
      location: 'Paris, France',
      status: 'operational',
      latency: '< 5ms',
      tier: 'Tier IV'
    },
    {
      location: 'Amsterdam, Netherlands',
      status: 'operational',
      latency: '< 8ms',
      tier: 'Tier IV'
    },
    {
      location: 'Frankfurt, Germany',
      status: 'operational',
      latency: '< 10ms',
      tier: 'Tier III+'
    }
  ];

  return (
    <section className="relative py-32 overflow-hidden bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Animated background grid */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid opacity-[0.03]"></div>
        <motion.div
          className="absolute inset-0"
          initial={{ backgroundPosition: '0 0' }}
          animate={{ backgroundPosition: '100px 100px' }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, zinc-800 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
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
              {isEn ? 'Infrastructure' : 'Infrastructure'}
            </span>
            <h2 className="text-5xl lg:text-6xl font-extralight text-white mb-6">
              {isEn ? 'Enterprise-Grade Infrastructure' : 'Infrastructure Enterprise'}
            </h2>
            <p className="text-zinc-400 max-w-3xl mx-auto text-lg">
              {isEn
                ? 'Built on cutting-edge hardware with redundant systems across multiple tier-4 datacenters'
                : 'Construite sur du matériel de pointe avec systèmes redondants dans plusieurs datacenters tier-4'
              }
            </p>
          </motion.div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 p-6 hover:border-zinc-700/50 transition-all duration-300">
                  <stat.icon className="w-10 h-10 text-zinc-600 mb-4 group-hover:text-zinc-500 transition-colors" />
                  <div className="text-2xl font-light text-white mb-2">{stat.value}</div>
                  <div className="text-sm text-zinc-500">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Datacenters showcase */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-8 lg:p-12"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-light text-white mb-2">
                  {isEn ? 'Global Datacenter Network' : 'Réseau Global de Datacenters'}
                </h3>
                <p className="text-zinc-400">
                  {isEn ? 'Strategic locations for minimum latency' : 'Emplacements stratégiques pour une latence minimale'}
                </p>
              </div>
              <Globe className="w-8 h-8 text-zinc-600" />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {datacenters.map((dc, index) => (
                <div
                  key={index}
                  className="bg-zinc-800/30 rounded-lg p-6 hover:bg-zinc-800/50 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-light text-white mb-1">{dc.location}</h4>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-400 uppercase">{dc.status}</span>
                      </div>
                    </div>
                    <Shield className="w-5 h-5 text-zinc-600" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">{isEn ? 'Latency' : 'Latence'}</span>
                      <span className="text-zinc-400">{dc.latency}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">{isEn ? 'Certification' : 'Certification'}</span>
                      <span className="text-zinc-400">{dc.tier}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Features list */}
            <div className="mt-8 pt-8 border-t border-zinc-800">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  isEn ? 'DDoS Protection' : 'Protection DDoS',
                  isEn ? '24/7 Monitoring' : 'Surveillance 24/7',
                  isEn ? 'Auto Scaling' : 'Mise à l\'échelle auto',
                  isEn ? 'Daily Backups' : 'Sauvegardes quotidiennes',
                  isEn ? 'IPv6 Support' : 'Support IPv6',
                  isEn ? 'Private Network' : 'Réseau privé'
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-zinc-400">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}