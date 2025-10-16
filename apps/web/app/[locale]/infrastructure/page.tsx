'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import './infrastructure.css';
import {
  CpuChipIcon,
  CubeIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  CloudArrowUpIcon,
  CommandLineIcon
} from '@heroicons/react/24/outline';
import Badge from '../../../components/ui/Badge';
import Link from 'next/link';
import { useLanguage } from '../../../contexts/LanguageContext';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import SophisticatedBackground from '../../../components/animations/SophisticatedBackground';

type Translations = Record<string, unknown>;

export default function InfrastructurePage() {
  const { language } = useLanguage();
  const [translations, setTranslations] = useState<Translations>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const locale = language || 'fr';
        const trans = await import(`../../../locales/${locale}/infrastructure.json`);
        const loaded = (trans.infrastructure || trans.default?.infrastructure || {}) as Translations;
        setTranslations(loaded);
      } catch (error) {
        try {
          const frenchTrans = await import(`../../../locales/fr/infrastructure.json`);
          const fallback = (frenchTrans.infrastructure || frenchTrans.default?.infrastructure || {}) as Translations;
          setTranslations(fallback);
        } catch (fallbackError) {
          console.error('Failed to load translations', fallbackError);
          setTranslations({});
        }
      }
    };

    loadTranslations();
  }, [language]);

  const t = useCallback(
    <T,>(key: string, fallback: T): T => {
      const keys = key.split('.');
      let value: unknown = translations;

      for (const k of keys) {
        if (value == null || typeof value !== 'object') {
          value = undefined;
          break;
        }
        value = (value as Record<string, unknown>)[k];
      }

      if (value === undefined || value === null) {
        return fallback;
      }

      return value as T;
    },
    [translations]
  );

  const hoverableRef = useRef<HTMLDivElement | null>(null);

  const handleGlobalPointerMove = useCallback((event: PointerEvent) => {
    if (!hoverableRef.current) return;
    const element = hoverableRef.current;
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    element.style.setProperty('--pointer-x', `${x}px`);
    element.style.setProperty('--pointer-y', `${y}px`);
  }, []);

  useEffect(() => {
    const current = hoverableRef.current;
    if (!current) return;
    current.style.setProperty('--pointer-x', '50%');
    current.style.setProperty('--pointer-y', '50%');
    const handleLeave = () => {
      current.style.setProperty('--pointer-x', '50%');
      current.style.setProperty('--pointer-y', '50%');
    };

    window.addEventListener('pointermove', handleGlobalPointerMove);
    current.addEventListener('pointerleave', handleLeave);

    return () => {
      window.removeEventListener('pointermove', handleGlobalPointerMove);
      current.removeEventListener('pointerleave', handleLeave);
    };
  }, [handleGlobalPointerMove]);

  if (!mounted) {
    return null;
  }

  const AnimatedPanel: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => {
    const panelRef = useRef<HTMLDivElement | null>(null);

    const handlePointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
      if (!panelRef.current) return;
      const element = panelRef.current;
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      element.style.setProperty('--pointer-x', `${x}px`);
      element.style.setProperty('--pointer-y', `${y}px`);
    }, []);

    const handlePointerLeave = useCallback(() => {
      if (!panelRef.current) return;
      panelRef.current.style.setProperty('--pointer-x', '50%');
      panelRef.current.style.setProperty('--pointer-y', '50%');
    }, []);

    return (
      <div
        ref={panelRef}
        className={`interactive-panel ${className}`.trim()}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        {...props}
      >
        <div className="interactive-panel__glow" aria-hidden />
        <div className="interactive-panel__border" aria-hidden />
        <div className="relative z-[1]">{children}</div>
      </div>
    );
  };

  const heroHighlights = [
    {
      key: 'compute',
      icon: CpuChipIcon,
      text: t('hero.highlights.compute', 'Clusters compute AMD EPYC optimisés pour la charge')
    },
    {
      key: 'gpu',
      icon: CubeIcon,
      text: t('hero.highlights.gpu', 'Pods GPU NVLink dédiés aux workloads IA, rendu et streaming')
    },
    {
      key: 'network',
      icon: GlobeAltIcon,
      text: t('hero.highlights.network', 'Backbone multi-site avec routage actif-actif et filtrage avancé')
    },
    {
      key: 'ops',
      icon: ArrowPathIcon,
      text: t('hero.highlights.ops', 'Ingénierie SRE européenne, supervision continue et opérations automatisées')
    }
  ];

  const pillarItems = [
    {
      key: 'compute',
      icon: CpuChipIcon,
      title: t('pillars.items.compute.title', 'Compute fabric sur-mesure'),
      description: t('pillars.items.compute.description', 'Bare-metal optimisé AMD EPYC orchestré par notre control-plane.'),
      points: t(
        'pillars.items.compute.points',
        [
          'Processeurs AMD EPYC dernière génération avec profil NUMA accordé',
          'Provisionnement automatique via images durcies et cloud-init maison',
          'Observation temps réel sur densité, thermique et latence disque'
        ]
      )
    },
    {
      key: 'gpu',
      icon: CubeIcon,
      title: t('pillars.items.gpu.title', 'Fermes GPU spécialisées'),
      description: t('pillars.items.gpu.description', 'Pods GPU dédiés pour IA, rendu et streaming, isolés par design.'),
      points: t(
        'pillars.items.gpu.points',
        [
          'Pods NVLink et NVSwitch isolés par usage IA, rendu et streaming',
          'Routage PCIe optimisé pour faible latence et bande passante continue',
          'Refroidissement liquide supervisé avec alerting prédictif'
        ]
      )
    },
    {
      key: 'network',
      icon: GlobeAltIcon,
      title: t('pillars.items.network.title', 'Backbone et edge contrôlés'),
      description: t('pillars.items.network.description', 'Réseau actif-actif pensé pour absorber les pics et sécuriser le trafic.'),
      points: t(
        'pillars.items.network.points',
        [
          'Topologie spine-leaf redondée entre sites européens',
          'BGP interne avec politiques adaptées aux workloads sensibles',
          'Protection DDoS multi-couches et inspection applicative permanente'
        ]
      )
    },
    {
      key: 'data',
      icon: CloudArrowUpIcon,
      title: t('pillars.items.data.title', 'Données et stockage souverains'),
      description: t('pillars.items.data.description', 'Conçu pour la consistance, la sécurité et la proximité réglementaire.'),
      points: t(
        'pillars.items.data.points',
        [
          'Volumes NVMe haute endurance agrégés par logiciel maison',
          'Ceph multi-domaines pour objets, blocs et snapshots cohérents',
          'Chiffrement systématique avec gestion de clés via HSM interne'
        ]
      )
    },
    {
      key: 'ops',
      icon: ArrowPathIcon,
      title: t('pillars.items.ops.title', 'Opérations pilotées par le code'),
      description: t('pillars.items.ops.description', 'Processus SRE, GitOps et observabilité intégrés à la plateforme.'),
      points: t(
        'pillars.items.ops.points',
        [
          'Infrastructure-as-code GitOps avec revues systématiques',
          'Pipeline CI/CD dédié à chaque composant plateforme',
          'Runbooks SRE et exercices de chaos engineering programmés'
        ]
      )
    }
  ].map((item) => ({
    ...item,
    points: Array.isArray(item.points) ? item.points : []
  }));

  const architectureColumns = [
    {
      key: 'hardware',
      title: t('architecture.columns.hardware.title', 'Fondation matériel'),
      description: t('architecture.columns.hardware.description', 'Nous maîtrisons le cycle de vie des hôtes et de la connectivité.'),
      points: t(
        'architecture.columns.hardware.points',
        [
          'Bare-metal propriétaire avec alimentation et refroidissement redondés',
          'Segmentation physique par familles de services et zones de sécurité',
          'Capteurs continus sur énergie, thermique et acoustique'
        ]
      )
    },
    {
      key: 'platform',
      title: t('architecture.columns.platform.title', 'Plateforme cloud'),
      description: t('architecture.columns.platform.description', 'Orchestration applicative et services managés unifiés.'),
      points: t(
        'architecture.columns.platform.points',
        [
          'Control-plane Kubernetes et Nomad opérés par notre équipe',
          'Services managés : bases de données, message bus, observabilité',
          'Réseaux virtuels privés, load-balancing logiciel et edge BGP'
        ]
      )
    },
    {
      key: 'experience',
      title: t('architecture.columns.experience.title', 'Expérience développeur'),
      description: t('architecture.columns.experience.description', 'Interfaces cohérentes pour construire, déployer et suivre.'),
      points: t(
        'architecture.columns.experience.points',
        [
          'API publique, CLI et provider Terraform maintenus ensemble',
          'Portail unifié avec métriques temps réel et journaux corrélés',
          "Support technique senior avec escalade directe vers l'ingénierie"
        ]
      )
    }
  ].map((column) => ({
    ...column,
    points: Array.isArray(column.points) ? column.points : []
  }));

  const assuranceBlocks = [
    {
      key: 'security',
      icon: ShieldCheckIcon,
      title: t('assurance.blocks.security.title', 'Sécurité'),
      points: t(
        'assurance.blocks.security.points',
        [
          'Accès physique biométrique et salles surveillées en permanence',
          'Segmentation réseau micro-segmentée avec politiques zero-trust',
          'Audits de sécurité continus, durcissement kernel et patching automatisé'
        ]
      )
    },
    {
      key: 'resilience',
      icon: ArrowPathIcon,
      title: t('assurance.blocks.resilience.title', 'Résilience'),
      points: t(
        'assurance.blocks.resilience.points',
        [
          'Opérations multi-sites actives avec bascule orchestrée',
          'Sauvegardes orchestrées et tests de restauration réguliers',
          'Plans de reprise validés par exercices conjoints avec les clients'
        ]
      )
    },
    {
      key: 'governance',
      icon: CommandLineIcon,
      title: t('assurance.blocks.governance.title', 'Gouvernance'),
      points: t(
        'assurance.blocks.governance.points',
        [
          'Processus conformes RGPD avec supervision interne dédiée',
          'Traçabilité complète des changements et journaux immuables',
          'Revues de conformité menées avec partenaires européens'
        ]
      )
    }
  ].map((block) => ({
    ...block,
    points: Array.isArray(block.points) ? block.points : []
  }));

  return (
    <>
      <SophisticatedBackground />
      <div className="min-h-screen bg-zinc-950" ref={hoverableRef}>
        <div className="fixed inset-0 opacity-[0.015] bg-noise pointer-events-none" />

        <Header />

        <main className="relative">
          <section className="relative min-h-[70vh] flex items-center py-24 sm:py-32 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-grid opacity-[0.02]" />
              <div className="absolute top-1/3 right-1/4 w-px h-32 bg-gradient-to-b from-transparent via-zinc-700 to-transparent" />
              <div className="absolute bottom-1/3 left-1/4 w-24 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
              <div className="absolute top-20 left-10 w-2 h-2 bg-zinc-800 rounded-full animate-subtle-float" />
              <div className="absolute bottom-16 right-24 w-1 h-1 bg-zinc-700 rounded-full animate-subtle-float" />
              <div className="hero-spotlight" aria-hidden />
              <div className="hero-spotlight hero-spotlight--alt" aria-hidden />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="max-w-5xl mx-auto text-center">
                <Badge variant="outline" className="mb-6 animate-fade-in-up">
                  {t('hero.badge', 'Infrastructure cloud premium')}
                </Badge>

                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-light text-white mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  {t('hero.title', 'Architecture souveraine pensée pour la performance')}
                </h1>

                <p className="text-lg text-zinc-400 mb-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  {t('hero.subtitle', 'Nous opérons chaque brique de bout en bout.')}
                </p>

                <p className="text-base sm:text-lg text-zinc-400 max-w-3xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                  {t(
                    'hero.description',
                    'Bare-metal propriétaire, équipe SRE européenne et chaîne logicielle intégrée. Notre objectif : délivrer une plateforme stable, prédictive et maîtrisée, sans overselling ni compromis.'
                  )}
                </p>

                <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                  <Link
                    href="/support"
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-4 rounded-xl font-medium hover:opacity-90 transition-all hover:scale-105"
                  >
                    {t('hero.cta.primary', 'Parler à un ingénieur')}
                  </Link>
                  <Link
                    href="/products"
                    className="bg-zinc-800 text-white px-8 py-4 rounded-xl font-medium hover:bg-zinc-700 transition-all hover:scale-105"
                  >
                    {t('hero.cta.secondary', 'Explorer les offres')}
                  </Link>
                  <Link
                    href="/docs"
                    className="bg-transparent text-white px-8 py-4 rounded-xl font-medium border border-zinc-600 hover:bg-zinc-800/50 transition-all hover:scale-105"
                  >
                    {t('hero.cta.tertiary', 'Documentation technique')}
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-16">
                {heroHighlights.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <AnimatedPanel
                      key={item.key}
                      className="backdrop-blur-sm rounded-2xl p-6 text-left animate-fade-in-up"
                      style={{ animationDelay: `${0.1 * index}s` }}
                    >
                      <Icon className="w-6 h-6 text-zinc-400 mb-4" />
                      <p className="text-sm text-zinc-300 leading-relaxed">{item.text}</p>
                    </AnimatedPanel>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="py-24 bg-zinc-900/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto text-center mb-16">
                <Badge variant="secondary" className="mb-4">
                  {t('pillars.badge', 'Piliers techniques')}
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-light text-white mb-4">
                  {t('pillars.title', 'Ce que nous maîtrisons de bout en bout')}
                </h2>
                <p className="text-zinc-400">
                  {t(
                    'pillars.description',
                    'Nos ingénieurs conçoivent le matériel, l\'orchestration et les processus opérationnels en parallèle pour absorber vos charges critiques.'
                  )}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-grid">
                {pillarItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <AnimatedPanel key={item.key} className="rounded-2xl p-6 flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800">
                          <Icon className="w-6 h-6 text-zinc-300" />
                        </span>
                        <div>
                          <h3 className="text-xl font-light text-white">{item.title}</h3>
                          <p className="text-sm text-zinc-400">{item.description}</p>
                        </div>
                      </div>
                      <ul className="space-y-3 text-sm text-zinc-300">
                        {item.points.map((point, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-400" />
                            <span className="leading-relaxed">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </AnimatedPanel>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto text-center mb-16">
                <Badge variant="outline" className="mb-4">
                  {t('architecture.badge', 'Architecture')}
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-light text-white mb-4">
                  {t('architecture.title', 'Trois couches pour servir vos charges')}
                </h2>
                <p className="text-zinc-400">
                  {t(
                    'architecture.description',
                    'Une chaîne matérielle, logicielle et opérationnelle alignée pour délivrer une expérience cohérente.'
                  )}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-grid">
                {architectureColumns.map((column) => (
                  <AnimatedPanel key={column.key} className="rounded-2xl p-6 flex flex-col gap-4">
                    <div>
                      <h3 className="text-2xl font-light text-white mb-2">{column.title}</h3>
                      <p className="text-sm text-zinc-400">{column.description}</p>
                    </div>
                    <ul className="space-y-3 text-sm text-zinc-300">
                      {column.points.map((point, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-400" />
                          <span className="leading-relaxed">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </AnimatedPanel>
                ))}
              </div>
            </div>
          </section>

          <section className="py-24 bg-zinc-900/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto text-center mb-16">
                <Badge variant="warning" className="mb-4">
                  {t('assurance.badge', 'Fiabilité et conformité')}
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-light text-white mb-4">
                  {t('assurance.title', 'Ce qui garantit la continuité')}
                </h2>
                <p className="text-zinc-400">
                  {t(
                    'assurance.description',
                    'Nos engagements s\'appuient sur une gouvernance stricte et une supervision permanente.'
                  )}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-grid">
                {assuranceBlocks.map((block) => {
                  const Icon = block.icon;
                  return (
                    <AnimatedPanel key={block.key} className="rounded-2xl p-6 flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800">
                          <Icon className="w-6 h-6 text-zinc-300" />
                        </span>
                        <h3 className="text-xl font-light text-white">{block.title}</h3>
                      </div>
                      <ul className="space-y-3 text-sm text-zinc-300">
                        {block.points.map((point, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            <span className="leading-relaxed">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </AnimatedPanel>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-cyan-500/10 border border-zinc-800 rounded-3xl px-8 py-16 text-center">
                <Badge variant="outline" className="mb-4">
                  {t('cta.badge', 'Prêt à avancer ?')}
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-light text-white mb-4">
                  {t('cta.title', 'Construisons votre architecture')}
                </h2>
                <p className="text-zinc-300 max-w-2xl mx-auto mb-10">
                  {t(
                    'cta.description',
                    'Contactez-nous pour une revue technique de vos workloads, une architecture personnalisée et un accompagnement par nos ingénieurs européens.'
                  )}
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="/support"
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-4 rounded-xl font-medium hover:opacity-90 transition-all hover:scale-105"
                  >
                    {t('cta.primary', 'Parler à un ingénieur')}
                  </Link>
                  <Link
                    href="/products"
                    className="bg-zinc-900 text-white px-8 py-4 rounded-xl font-medium border border-zinc-700 hover:bg-zinc-800 transition-all hover:scale-105"
                  >
                    {t('cta.secondary', 'Explorer les offres')}
                  </Link>
                  <Link
                    href="/docs"
                    className="bg-transparent text-white px-8 py-4 rounded-xl font-medium border border-zinc-600 hover:bg-zinc-800/50 transition-all hover:scale-105"
                  >
                    {t('cta.tertiary', 'Documentation technique')}
                  </Link>
                </div>

                <p className="text-xs text-zinc-500 uppercase tracking-[0.2em] mt-12">
                  {t('cta.footer', 'Hackboot OÜ • Entreprise estonienne • Infrastructure opérée en Europe')}
                </p>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
