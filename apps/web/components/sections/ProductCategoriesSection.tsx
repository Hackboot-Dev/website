'use client';
// /apps/web/components/sections/ProductCategoriesSection.tsx
// Description: Product categories section with smooth expanding cards on hover
// Last modified: 2025-09-17
// Related docs: /docs/FEATURES.md

import { useState, useRef } from 'react';
import { motion, LayoutGroup } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  Server, Cpu, Globe, Layers, BarChart, Database, Zap, Gamepad2,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function ProductCategoriesSection() {
  const { t, language } = useLanguage();
  const isEn = language === 'en';
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle hover with delay to prevent accidental triggers during scroll
  const handleMouseEnter = (id: string) => {
    // Clear any existing leave timeout
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }

    // Clear any existing hover timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Set a delay before triggering the expansion
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredCard(id);
    }, 200); // 200ms delay to ensure intentional hover
  };

  const handleMouseLeave = () => {
    // Clear hover timeout if mouse leaves before expansion
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    // Small delay before collapsing to prevent flickering
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
    }

    leaveTimeoutRef.current = setTimeout(() => {
      setHoveredCard(null);
    }, 100);
  };

  // Product categories matching the actual data structure
  const categories = [
    {
      id: 'vps',
      name: 'VPS',
      description: isEn
        ? 'High-performance virtual private servers'
        : 'Serveurs virtuels haute performance',
      extendedDescription: isEn
        ? 'Deploy scalable virtual machines with dedicated resources. Perfect for web applications, databases, and development environments.'
        : 'Déployez des machines virtuelles évolutives avec ressources dédiées. Parfait pour applications web et développement.',
      specs: isEn
        ? ['2-32 vCPU', '4-128 GB RAM', 'NVMe SSD', '10 Gbps']
        : ['2-32 vCPU', '4-128 GB RAM', 'SSD NVMe', '10 Gbps'],
      icon: Server,
      link: '/products?category=vps'
    },
    {
      id: 'gpu',
      name: 'GPU Computing',
      description: isEn
        ? 'NVIDIA Tesla & RTX for AI and ML'
        : 'NVIDIA Tesla & RTX pour IA et ML',
      extendedDescription: isEn
        ? 'Accelerate your workloads with powerful GPUs. Ideal for machine learning, rendering, and scientific computing.'
        : 'Accélérez vos charges de travail avec des GPU puissants. Idéal pour machine learning et calcul scientifique.',
      specs: isEn
        ? ['Tesla T4/A100', '80GB VRAM', '312 TFLOPS', 'CUDA']
        : ['Tesla T4/A100', '80GB VRAM', '312 TFLOPS', 'CUDA'],
      icon: Cpu,
      link: '/products?category=gpu'
    },
    {
      id: 'webhosting',
      name: 'Web Hosting',
      description: isEn
        ? 'Managed hosting for websites'
        : 'Hébergement géré pour sites web',
      extendedDescription: isEn
        ? 'Fully managed hosting with automatic backups, SSL certificates, and one-click installations.'
        : 'Hébergement géré avec sauvegardes auto, SSL et installations en un clic.',
      specs: isEn
        ? ['cPanel/Plesk', 'Auto Backup', 'Free SSL', 'PHP/Node']
        : ['cPanel/Plesk', 'Backup Auto', 'SSL Gratuit', 'PHP/Node'],
      icon: Globe,
      link: '/products?category=webhosting'
    },
    {
      id: 'paas',
      name: 'PaaS',
      description: isEn
        ? 'Platform for modern apps'
        : 'Plateforme pour apps modernes',
      extendedDescription: isEn
        ? 'Deploy and scale applications without managing infrastructure. Docker, Kubernetes, and serverless support.'
        : 'Déployez et scalez sans gérer l\'infrastructure. Support Docker, Kubernetes et serverless.',
      specs: isEn
        ? ['Docker/K8s', 'Auto-scale', 'CI/CD', 'Multi-region']
        : ['Docker/K8s', 'Auto-scale', 'CI/CD', 'Multi-région'],
      icon: Layers,
      link: '/products?category=paas'
    },
    {
      id: 'loadbalancer',
      name: 'Load Balancer',
      description: isEn
        ? 'Traffic distribution solution'
        : 'Solution de distribution du trafic',
      extendedDescription: isEn
        ? 'Distribute traffic across multiple servers for optimal performance. SSL termination included.'
        : 'Distribuez le trafic sur plusieurs serveurs. Terminaison SSL incluse.',
      specs: isEn
        ? ['Layer 4/7', 'SSL Term', 'Health Check', 'DDoS Pro']
        : ['Layer 4/7', 'SSL Term', 'Health Check', 'DDoS Pro'],
      icon: BarChart,
      link: '/products?category=loadbalancer'
    },
    {
      id: 'storage',
      name: 'Block Storage',
      description: isEn
        ? 'Scalable SSD storage'
        : 'Stockage SSD évolutif',
      extendedDescription: isEn
        ? 'Attach additional storage to your instances. Replicated across zones for data durability.'
        : 'Attachez du stockage supplémentaire. Répliqué sur plusieurs zones.',
      specs: isEn
        ? ['100GB-50TB', '80K IOPS', 'Snapshots', '3x Replica']
        : ['100GB-50TB', '80K IOPS', 'Snapshots', 'Replica 3x'],
      icon: Database,
      link: '/products?category=storage'
    },
    {
      id: 'cdn',
      name: 'CDN',
      description: isEn
        ? 'Global content delivery'
        : 'Diffusion de contenu globale',
      extendedDescription: isEn
        ? 'Accelerate content delivery worldwide with edge locations. Integrated DDoS protection.'
        : 'Accélérez la diffusion mondiale. Protection DDoS intégrée.',
      specs: isEn
        ? ['200+ PoPs', 'Instant Purge', 'HTTP/3', 'WAF']
        : ['200+ PoPs', 'Purge Instant', 'HTTP/3', 'WAF'],
      icon: Zap,
      link: '/products?category=cdn'
    },
    {
      id: 'gaming',
      name: 'Gaming Cloud',
      description: isEn
        ? 'Specialized gaming infrastructure'
        : 'Infrastructure gaming spécialisée',
      extendedDescription: isEn
        ? 'Optimized for gaming with low latency, anti-DDoS, and one-click game server deployment.'
        : 'Optimisé pour le gaming avec faible latence, anti-DDoS et déploiement en un clic.',
      specs: isEn
        ? ['< 10ms', 'Anti-DDoS', 'Game Panel', 'Mod Support']
        : ['< 10ms', 'Anti-DDoS', 'Panel Jeux', 'Support Mods'],
      icon: Gamepad2,
      link: '/products?category=gaming'
    }
  ];

  return (
    <section className="relative py-32 bg-zinc-950 overflow-visible">
      {/* Subtle background gradient - no animation */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid opacity-[0.02]"></div>
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
              {isEn ? 'Infrastructure Premium' : 'Infrastructure Premium'}
            </span>
            <h2 className="text-5xl lg:text-6xl font-extralight text-white mb-6">
              {isEn ? 'Choose Your Solution' : 'Choisissez Votre Solution'}
            </h2>
            <p className="text-zinc-400 max-w-3xl mx-auto text-lg">
              {isEn
                ? 'From web hosting to AI training, our infrastructure scales with your needs'
                : "De l'hébergement web à l'entraînement IA, notre infrastructure s'adapte à vos besoins"}
            </p>
          </motion.div>

          {/* Categories grid with smooth expanding cards */}
          <LayoutGroup>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => {
                const isHovered = hoveredCard === category.id;

                return (
                  <motion.div
                    key={category.id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      opacity: { delay: index * 0.05 },
                      layout: {
                        type: "spring",
                        stiffness: 400,
                        damping: 25
                      }
                    }}
                    className={`group relative ${
                      isHovered
                        ? 'lg:col-span-2 lg:row-span-2 z-20'
                        : 'col-span-1 row-span-1 z-10'
                    }`}
                    onMouseEnter={() => handleMouseEnter(category.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link href={category.link}>
                      <motion.div
                        className={`
                          bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50
                          hover:border-zinc-700/50 transition-colors duration-300
                          h-full overflow-hidden relative
                          ${isHovered ? 'p-8' : 'p-6'}
                        `}
                        layout
                      >
                        <motion.div
                          layout
                          className=""
                        >
                          {/* Icon */}
                          <motion.div
                            layout
                            className="mb-4"
                          >
                            <category.icon className={`
                              text-zinc-600 transition-all duration-300
                              ${isHovered ? 'w-12 h-12 text-zinc-500' : 'w-10 h-10 group-hover:text-zinc-500'}
                            `} />
                          </motion.div>

                          {/* Title */}
                          <motion.h3
                            layout
                            className={`
                              font-light text-white mb-3 transition-all duration-300
                              ${isHovered ? 'text-2xl' : 'text-lg'}
                            `}
                          >
                            {category.name}
                          </motion.h3>

                          {/* Description */}
                          <motion.p
                            layout
                            className={`
                              text-zinc-400 leading-relaxed transition-all duration-300
                              ${isHovered ? 'text-base mb-6' : 'text-sm'}
                            `}
                          >
                            {isHovered ? category.extendedDescription : category.description}
                          </motion.p>

                          {/* Extended content - only show when expanded */}
                          {isHovered && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ delay: 0.1 }}
                            >
                              {/* Specs grid */}
                              <div className="grid grid-cols-2 gap-3 mb-6">
                                {category.specs.map((spec, idx) => (
                                  <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15 + idx * 0.05 }}
                                    className="bg-zinc-800/30 rounded-lg px-3 py-2"
                                  >
                                    <span className="text-xs text-zinc-500">{spec}</span>
                                  </motion.div>
                                ))}
                              </div>

                              {/* CTA */}
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="flex items-center justify-between"
                              >
                                <span className="text-sm text-zinc-400">
                                  {isEn ? 'Learn more' : 'En savoir plus'}
                                </span>
                                <ArrowRight className="w-4 h-4 text-zinc-600" />
                              </motion.div>
                            </motion.div>
                          )}
                        </motion.div>
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </LayoutGroup>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <Link
              href="/products"
              className="inline-flex items-center space-x-3 px-8 py-4 bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all duration-300"
            >
              <span className="text-sm text-white">
                {isEn ? 'Explore All Products' : 'Explorer Tous les Produits'}
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}