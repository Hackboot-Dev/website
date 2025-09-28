'use client';

// /workspaces/website/apps/web/app/[locale]/infrastructure/page.tsx
// Description: Technical infrastructure page showcasing VMCloud premium capabilities with animations
// Last modified: 2025-01-16
// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

import React, { useEffect, useState, useCallback } from 'react';
import './infrastructure.css';
import {
  ServerIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  CircleStackIcon,
  CpuChipIcon,
  CloudArrowUpIcon,
  BoltIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  LockClosedIcon,
  CommandLineIcon,
  ChartBarIcon,
  CubeIcon,
  BeakerIcon,
  WrenchScrewdriverIcon,
  ClockIcon,
  SignalIcon,
  FireIcon,
  ShieldExclamationIcon,
  FingerPrintIcon,
  KeyIcon,
  DocumentCheckIcon
} from '@heroicons/react/24/outline';
import Badge from '../../../components/ui/Badge';
import Link from 'next/link';
import { useLanguage } from '../../../contexts/LanguageContext';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import { infrastructureData } from '../../../data/infrastructure';
import SophisticatedBackground from '../../../components/animations/SophisticatedBackground';
import { useParallax } from '../../../hooks/useAwwardsAnimation';

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
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
        ...options
      }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, options]);

  return [setRef, inView];
}

export default function InfrastructurePage() {
  const { language } = useLanguage();
  const [translations, setTranslations] = useState({});
  const [mounted, setMounted] = useState(false);
  const geometricParallax = useParallax(0.3);

  // Refs for scroll animations
  const [heroRef, heroInView] = useInView();
  const [capacityRef, capacityInView] = useInView();
  const [regionsRef, regionsInView] = useInView();
  const [computeRef, computeInView] = useInView();
  const [networkRef, networkInView] = useInView();
  const [storageRef, storageInView] = useInView();
  const [securityRef, securityInView] = useInView();
  const [reliabilityRef, reliabilityInView] = useInView();
  const [stackRef, stackInView] = useInView();
  const [roadmapRef, roadmapInView] = useInView();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const locale = language || 'fr';
        const trans = await import(`../../../locales/${locale}/infrastructure.json`);
        setTranslations(trans.infrastructure || trans.default?.infrastructure || {});
      } catch (error) {
        try {
          const frenchTrans = await import(`../../../locales/fr/infrastructure.json`);
          setTranslations(frenchTrans.infrastructure || frenchTrans.default?.infrastructure || {});
        } catch (fallbackError) {
          console.error('Failed to load translations', fallbackError);
          setTranslations({});
        }
      }
    };
    loadTranslations();
  }, [language]);

  const t = useCallback((key: string, fallback: string = '') => {
    const keys = key.split('.');
    let value: any = translations;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || fallback || key;
  }, [translations]);

  // Get stat icon
  const getStatIcon = (key: string) => {
    switch(key) {
      case 'uptime': return <CheckCircleIcon className="w-5 h-5" />;
      case 'latency': return <BoltIcon className="w-5 h-5" />;
      case 'vcpus': return <CpuChipIcon className="w-5 h-5" />;
      case 'gpus': return <CubeIcon className="w-5 h-5" />;
      default: return null;
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      <SophisticatedBackground />
      <div className="min-h-screen bg-zinc-950">
        {/* Subtle noise texture */}
        <div className="fixed inset-0 opacity-[0.015] bg-noise pointer-events-none" />

        <Header />

        <main className="relative">
          {/* Hero Section with Evolution Story */}
          <section className="relative min-h-screen flex items-center py-24 sm:py-32 overflow-hidden">
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

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="max-w-7xl mx-auto">
                <div
                  ref={heroRef}
                  className={`text-center mb-12 ${heroInView ? 'animate-fade-in-up' : 'opacity-0'}`}
                >
                  <Badge variant="outline" className={`mb-6 ${heroInView ? 'animate-scale-in' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>
                    {t('hero.badge', 'Infrastructure Cloud Premium')}
                  </Badge>

                  {/* Evolution subtitle */}
                  <p className={`text-zinc-500 text-sm mb-4 italic ${heroInView ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
                    {t('hero.evolution', 'Du pionnier du cloud gaming haute performance à l\'infrastructure cloud européenne premium')}
                  </p>

                  <h1 className={`text-3xl sm:text-4xl lg:text-6xl font-light text-white mb-6 ${heroInView ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
                    {t('hero.title', 'Infrastructure Technique')}
                    <br />
                    <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent animate-gradient-text">
                      {t('hero.subtitle', '> 3M€ d\'Investissement')}
                    </span>
                  </h1>
                  <p className="text-zinc-400 text-base sm:text-lg max-w-3xl mx-auto mb-8">
                    {t('hero.description', 'Hardware propriétaire dernière génération. Performance garantie sans overselling. Infrastructure 100% européenne avec une expertise unique en latence ultra-faible.')}
                  </p>

                  {/* CTAs */}
                  <div className="flex flex-wrap justify-center gap-4">
                    <Link
                      href="/products"
                      className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-4 rounded-xl font-medium hover:opacity-90 transition-all hover:scale-105 inline-block animate-fade-in-up"
                      style={{ animationDelay: '0.4s' }}
                    >
                      {t('hero.cta.products', 'Voir les Produits')}
                    </Link>
                    <Link
                      href="/pricing"
                      className="bg-zinc-800 text-white px-8 py-4 rounded-xl font-medium hover:bg-zinc-700 transition-all hover:scale-105 inline-block animate-fade-in-up"
                      style={{ animationDelay: '0.5s' }}
                    >
                      {t('hero.cta.pricing', 'Tarification')}
                    </Link>
                    <Link
                      href="/support"
                      className="bg-transparent text-white px-8 py-4 rounded-xl font-medium border border-zinc-600 hover:bg-zinc-800/50 transition-all hover:scale-105 inline-block animate-fade-in-up"
                      style={{ animationDelay: '0.6s' }}
                    >
                      {t('hero.cta.support', 'Support 24/7')}
                    </Link>
                  </div>
                </div>

                {/* Real Stats Grid */}
                <div
                  ref={capacityRef}
                  className={`grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-16 ${capacityInView ? 'animate-grid' : ''}`}
                >
                  {infrastructureData.stats.map((stat, index) => (
                    <div
                      key={index}
                      className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800 hover:border-zinc-700 transition-all hover-lift hover-glow"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                          {stat.value}
                        </div>
                        <div className="text-zinc-500">
                          {getStatIcon(stat.key)}
                        </div>
                      </div>
                      <p className="text-zinc-400 text-sm">
                        {t(`stats.${stat.key}`, stat.label)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Infrastructure Capacity Overview */}
          <section className="py-20 px-6 bg-zinc-900/20">
            <div className="container mx-auto">
              <div className="text-center mb-12">
                <Badge variant="secondary" className="mb-4">
                  {t('capacity.badge', 'Capacité Totale')}
                </Badge>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-4">
                  {t('capacity.title', 'Vue d\'Ensemble Infrastructure')}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Compute */}
                <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
                  <ServerIcon className="w-8 h-8 text-cyan-400 mb-4" />
                  <h3 className="text-lg font-medium text-white mb-4">{t('capacity.compute.title', 'Compute')}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Total vCPUs</span>
                      <span className="text-white">{infrastructureData.capacity.compute.totalCores.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">RAM Total</span>
                      <span className="text-white">{infrastructureData.capacity.compute.totalRam}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Nodes</span>
                      <span className="text-white">{infrastructureData.capacity.compute.nodes}</span>
                    </div>
                  </div>
                </div>

                {/* Storage */}
                <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
                  <CircleStackIcon className="w-8 h-8 text-purple-400 mb-4" />
                  <h3 className="text-lg font-medium text-white mb-4">{t('capacity.storage.title', 'Stockage')}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">NVMe</span>
                      <span className="text-white">{infrastructureData.capacity.storage.nvme}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">SSD</span>
                      <span className="text-white">{infrastructureData.capacity.storage.ssd}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Utilisation</span>
                      <span className="text-purple-400">{infrastructureData.capacity.utilization?.storage || 61}%</span>
                    </div>
                  </div>
                </div>

                {/* Network */}
                <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
                  <SignalIcon className="w-8 h-8 text-green-400 mb-4" />
                  <h3 className="text-lg font-medium text-white mb-4">{t('capacity.network.title', 'Réseau')}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Backbone</span>
                      <span className="text-white">{infrastructureData.capacity.network.backbone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Peering</span>
                      <span className="text-white">{infrastructureData.capacity.network.peering}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Utilisation</span>
                      <span className="text-green-400">{infrastructureData.capacity.utilization?.network || 54}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* GPU Capacity - Without detailed inventory */}
              <div className="mt-8 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-2xl p-6 border border-cyan-500/20">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <CpuChipIcon className="w-6 h-6 text-cyan-400" />
                    <h3 className="text-xl font-medium text-white">{t('capacity.gpu.title', 'Capacité GPU')}</h3>
                  </div>
                  <Badge variant="primary" size="sm" className="self-start sm:self-auto">
                    {t('capacity.gpu.badge', 'Infrastructure GPU Premium')}
                  </Badge>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-zinc-900/60 rounded-lg p-4 border border-zinc-800">
                      <p className="text-sm text-zinc-500 mb-1">{t('capacity.gpu.models', 'Modèles disponibles')}</p>
                      <p className="text-xl font-medium text-white">RTX 4090, A100, H100, L40S</p>
                    </div>
                    <div className="bg-zinc-900/60 rounded-lg p-4 border border-zinc-800">
                      <p className="text-sm text-zinc-500 mb-1">{t('capacity.gpu.totalGpus', 'GPUs dédiés')}</p>
                      <p className="text-xl font-medium text-white">500+</p>
                    </div>
                  </div>
                  <div className="bg-zinc-900/60 rounded-lg p-4 border border-zinc-800">
                    <p className="text-sm text-zinc-500 mb-2">{t('capacity.gpu.features', 'Caractéristiques')}</p>
                    <ul className="text-sm text-zinc-300 space-y-1">
                      <li>• {t('capacity.gpu.vram', 'VRAM jusqu\'à 80GB HBM3')}</li>
                      <li>• {t('capacity.gpu.pcie', 'PCIe Gen4/5, NVLink disponible')}</li>
                      <li>• {t('capacity.gpu.cooling', 'Refroidissement liquide dédié')}</li>
                      <li>• {t('capacity.gpu.allocation', 'Allocation flexible et instantanée')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Security Section */}
          <section ref={securityRef} className="py-20 px-6 bg-zinc-900/20">
            <div className="container mx-auto">
              <div
                className={`text-center mb-12 ${securityInView ? 'animate-fade-in-up' : 'opacity-0'}`}
              >
                <Badge variant="warning" className="mb-4">
                  {t('security.badge', 'Sécurité')}
                </Badge>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-4">
                  {t('security.title', 'Protection Multicouches')}
                </h2>
              </div>

              {/* Certifications - Fixed to show 4 cards */}
              <div className="mb-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800 text-center hover-lift transition-all">
                    <ShieldCheckIcon className="w-12 h-12 text-green-400 mx-auto mb-3" />
                    <h4 className="text-white font-medium mb-1">ISO 27001</h4>
                    <p className="text-xs text-zinc-500">
                      {t('security.certifications.inProgress', 'En cours')}
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">
                      {t('security.certifications.q2_2025', 'Q2 2025')}
                    </p>
                  </div>
                  <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800 text-center hover-lift transition-all">
                    <DocumentCheckIcon className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                    <h4 className="text-white font-medium mb-1">SOC 2 Type II</h4>
                    <p className="text-xs text-green-400">
                      {t('security.certifications.compliant', 'Conforme')}
                    </p>
                  </div>
                  <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800 text-center hover-lift transition-all">
                    <FingerPrintIcon className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                    <h4 className="text-white font-medium mb-1">RGPD/GDPR</h4>
                    <p className="text-xs text-green-400">
                      {t('security.certifications.compliant', 'Conforme')}
                    </p>
                  </div>
                  <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800 text-center hover-lift transition-all">
                    <KeyIcon className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                    <h4 className="text-white font-medium mb-1">PCI DSS</h4>
                    <p className="text-xs text-zinc-500">
                      {t('security.certifications.scope', 'Scope limité')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Physical & Network Security */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
                  <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                    <ShieldExclamationIcon className="w-5 h-5 text-cyan-400" />
                    {t('security.physical.title', 'Sécurité Physique')}
                  </h3>
                  <ul className="space-y-2">
                    {infrastructureData.security.physical.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircleIcon className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-zinc-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
                  <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                    <LockClosedIcon className="w-5 h-5 text-purple-400" />
                    {t('security.network.title', 'Sécurité Réseau')}
                  </h3>
                  <ul className="space-y-2">
                    {infrastructureData.security.network.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircleIcon className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-zinc-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Encryption */}
              <div className="mt-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20">
                <h3 className="text-lg font-medium text-white mb-4">{t('security.encryption.title', 'Chiffrement')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-xs text-zinc-500 mb-1">{t('security.encryption.atRest', 'Au Repos')}</p>
                    <p className="text-sm text-white font-mono">{infrastructureData.security.encryption.atRest}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-zinc-500 mb-1">{t('security.encryption.inTransit', 'En Transit')}</p>
                    <p className="text-sm text-white font-mono">{infrastructureData.security.encryption.inTransit}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-zinc-500 mb-1">{t('security.encryption.keyManagement', 'Gestion des Clés')}</p>
                    <p className="text-sm text-white font-mono">{infrastructureData.security.encryption.keyManagement}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Orchestration & Monitoring Section */}
          <section ref={stackRef} className="py-20 px-6">
            <div className="container mx-auto">
              <div
                className={`text-center mb-12 ${stackInView ? 'animate-fade-in-up' : 'opacity-0'}`}
              >
                <Badge variant="primary" className="mb-4">
                  {t('stack.badge', 'Stack Technique')}
                </Badge>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-4">
                  {t('stack.title', 'Orchestration & Monitoring')}
                </h2>
              </div>

              <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${stackInView ? 'animate-grid' : ''}`}>
                {/* Orchestration */}
                <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800 hover-lift transition-all">
                  <CommandLineIcon className="w-8 h-8 text-cyan-400 mb-4" />
                  <h3 className="text-lg font-medium text-white mb-4">{t('stack.orchestration.title', 'Orchestration')}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-zinc-800/50 rounded-lg p-3">
                      <p className="text-white font-medium mb-1">Nomad</p>
                      <p className="text-xs text-zinc-400">Production ready</p>
                    </div>
                    <div className="bg-zinc-800/50 rounded-lg p-3">
                      <p className="text-white font-medium mb-1">Consul</p>
                      <p className="text-xs text-zinc-400">Service mesh</p>
                    </div>
                    <div className="bg-zinc-800/50 rounded-lg p-3">
                      <p className="text-white font-medium mb-1">Vault</p>
                      <p className="text-xs text-zinc-400">Secrets management</p>
                    </div>
                    <div className="bg-zinc-800/50 rounded-lg p-3">
                      <p className="text-white font-medium mb-1">Kubernetes</p>
                      <p className="text-xs text-zinc-400">Coming Q2 2026</p>
                    </div>
                  </div>
                </div>

                {/* Monitoring */}
                <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800 hover-lift transition-all">
                  <ChartBarIcon className="w-8 h-8 text-purple-400 mb-4" />
                  <h3 className="text-lg font-medium text-white mb-4">{t('stack.monitoring.title', 'Monitoring')}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-zinc-800/50 rounded-lg p-3">
                      <p className="text-white font-medium mb-1">Prometheus</p>
                      <p className="text-xs text-zinc-400">Metrics collection</p>
                    </div>
                    <div className="bg-zinc-800/50 rounded-lg p-3">
                      <p className="text-white font-medium mb-1">Grafana</p>
                      <p className="text-xs text-zinc-400">Visualization</p>
                    </div>
                    <div className="bg-zinc-800/50 rounded-lg p-3">
                      <p className="text-white font-medium mb-1">Loki</p>
                      <p className="text-xs text-zinc-400">Log aggregation</p>
                    </div>
                    <div className="bg-zinc-800/50 rounded-lg p-3">
                      <p className="text-white font-medium mb-1">Tempo</p>
                      <p className="text-xs text-zinc-400">Distributed tracing</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Automation */}
              <div className={`mt-8 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl p-6 border border-cyan-500/20 hover-glow transition-all ${stackInView ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
                <h3 className="text-lg font-medium text-white mb-4">{t('stack.automation.title', 'Automation & API')}</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <p className="text-xs text-zinc-500 mb-1">API</p>
                    <p className="text-sm text-white">REST Public</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-zinc-500 mb-1">GraphQL</p>
                    <p className="text-sm text-white">Partner Beta</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-zinc-500 mb-1">Terraform</p>
                    <p className="text-sm text-white">Official Provider</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-zinc-500 mb-1">CLI</p>
                    <p className="text-sm text-white">vmcl CLI</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-zinc-500 mb-1">Webhooks</p>
                    <p className="text-sm text-white">Events & Billing</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Updated Roadmap - Starting from Sept 2025 */}
          <section ref={roadmapRef} className="py-20 px-6 bg-zinc-900/20">
            <div className="container mx-auto">
              <div
                className={`text-center mb-12 ${roadmapInView ? 'animate-fade-in-up' : 'opacity-0'}`}
              >
                <Badge variant="primary" className="mb-4">
                  {t('roadmap.badge', 'Roadmap 2025-2026')}
                </Badge>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-4">
                  {t('roadmap.title', 'Évolution de la Plateforme')}
                </h2>
              </div>

              <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${roadmapInView ? 'animate-grid' : ''}`}>
                {/* Q4 2025 - Launch */}
                <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800 hover-lift transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-white">Q4 2025</h3>
                    <ClockIcon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <p className="text-xs text-zinc-500 mb-3">Sept - Déc 2025</p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircleIcon className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-white">Lancement Plateforme</p>
                        <p className="text-xs text-zinc-500">Infrastructure complète</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircleIcon className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-white">Produits disponibles</p>
                        <p className="text-xs text-zinc-500">VPS, GPU, Web, PaaS, CDN</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircleIcon className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-white">API & Terraform</p>
                        <p className="text-xs text-zinc-500">Automatisation complète</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Q1 2026 */}
                <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800 hover-lift transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-white">Q1 2026</h3>
                    <ClockIcon className="w-5 h-5 text-purple-400" />
                  </div>
                  <p className="text-xs text-zinc-500 mb-3">Jan - Mars 2026</p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="text-zinc-500">○</span>
                      <div>
                        <p className="text-sm text-zinc-400">Expansion EU</p>
                        <p className="text-xs text-zinc-500">Amsterdam datacenter</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-zinc-500">○</span>
                      <div>
                        <p className="text-sm text-zinc-400">Kubernetes GA</p>
                        <p className="text-xs text-zinc-500">Production ready</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-zinc-500">○</span>
                      <div>
                        <p className="text-sm text-zinc-400">Network Upgrade</p>
                        <p className="text-xs text-zinc-500">400G backbone</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Q2 2026 */}
                <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800 hover-lift transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-white">Q2 2026</h3>
                    <ClockIcon className="w-5 h-5 text-green-400" />
                  </div>
                  <p className="text-xs text-zinc-500 mb-3">Avr - Juin 2026</p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="text-zinc-500">○</span>
                      <div>
                        <p className="text-sm text-zinc-400">AI Platform</p>
                        <p className="text-xs text-zinc-500">MLOps & Training</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-zinc-500">○</span>
                      <div>
                        <p className="text-sm text-zinc-400">Bare Metal</p>
                        <p className="text-xs text-zinc-500">Dedicated servers</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-zinc-500">○</span>
                      <div>
                        <p className="text-sm text-zinc-400">ISO 27001</p>
                        <p className="text-xs text-zinc-500">Certification</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Q3 2026 */}
                <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800 hover-lift transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-white">Q3 2026</h3>
                    <ClockIcon className="w-5 h-5 text-pink-400" />
                  </div>
                  <p className="text-xs text-zinc-500 mb-3">Juil - Sept 2026</p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="text-zinc-500">○</span>
                      <div>
                        <p className="text-sm text-zinc-400">Frankfurt DC</p>
                        <p className="text-xs text-zinc-500">German market</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-zinc-500">○</span>
                      <div>
                        <p className="text-sm text-zinc-400">Edge Computing</p>
                        <p className="text-xs text-zinc-500">20+ PoPs EU</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-zinc-500">○</span>
                      <div>
                        <p className="text-sm text-zinc-400">Quantum Ready</p>
                        <p className="text-xs text-zinc-500">Post-quantum crypto</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 px-6">
            <div className="container mx-auto">
              <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-2xl p-12 border border-cyan-500/20 text-center animate-fade-in-up hover-glow">
                <FireIcon className="w-16 h-16 text-cyan-400 mx-auto mb-6 animate-pulse" />
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-4">
                  {t('cta.title', 'Infrastructure Premium Européenne')}
                </h2>
                <p className="text-zinc-400 text-lg mb-8 max-w-2xl mx-auto">
                  {t('cta.description', 'Rejoignez les entreprises qui ont choisi VMCloud pour leur infrastructure critique. Support 24/7, résilience multi-site et une équipe d\'experts européens.')}
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="/support"
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-4 rounded-xl font-medium hover:opacity-90 transition-all hover:scale-105 inline-block animate-fade-in-up"
                    style={{ animationDelay: '0.2s' }}
                  >
                    {t('cta.contactSupport', 'Contacter le Support')}
                  </Link>
                  <Link
                    href="/products"
                    className="bg-zinc-800 text-white px-8 py-4 rounded-xl font-medium hover:bg-zinc-700 transition-all hover:scale-105 inline-block animate-fade-in-up"
                    style={{ animationDelay: '0.3s' }}
                  >
                    {t('cta.exploreProducts', 'Explorer les Produits')}
                  </Link>
                  <Link
                    href="/pricing"
                    className="bg-transparent text-white px-8 py-4 rounded-xl font-medium border border-zinc-600 hover:bg-zinc-800/50 transition-all hover:scale-105 inline-block animate-fade-in-up"
                    style={{ animationDelay: '0.4s' }}
                  >
                    {t('cta.seePricing', 'Voir les Tarifs')}
                  </Link>
                </div>

                <div className="mt-8 pt-8 border-t border-zinc-800">
                  <p className="text-sm text-zinc-500">
                    {t('cta.footer', 'VMCloud OÜ • Entreprise estonienne • Infrastructure 100% européenne')}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
