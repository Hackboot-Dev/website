'use client';

// /workspaces/website/apps/web/app/[locale]/infrastructure/page.tsx
// Description: Technical infrastructure page showcasing Hackboot premium capabilities
// Last modified: 2024-12-18
// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

import React, { useEffect, useState, useCallback, useMemo } from 'react';
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
        // Charger directement depuis /locales/
        const locale = language || 'fr';
        const trans = await import(`../../../locales/${locale}/infrastructure.json`);
        setTranslations(trans.infrastructure || trans.default?.infrastructure || {});
      } catch (error) {
        // Fallback to French
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

  const t = useCallback((key: string, fallback: string) => {
    const keys = key.split('.');
    let value: any = translations;

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        return fallback;
      }
    }

    return value || fallback;
  }, [translations]);

  // Progress animations
  const AnimatedProgress = ({ value, delay = 0 }) => {
    const [width, setWidth] = useState(0);

    useEffect(() => {
      const timer = setTimeout(() => {
        setWidth(value);
      }, delay);

      return () => clearTimeout(timer);
    }, [value, delay]);

    return (
      <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${width}%` }}
        />
      </div>
    );
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />

      <main className="relative">
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
        >
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent" />

          <div className="container mx-auto px-6 relative z-10">
            <div
              className="text-center max-w-4xl mx-auto"
              style={{
                opacity: heroInView ? 1 : 0,
                transform: heroInView ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <Badge variant="primary" className="mb-6">
                {t('hero.badge', 'Infrastructure Premium')}
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white mb-6">
                {t('hero.title', 'Infrastructure Cloud')}
                <br />
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  {t('hero.subtitle', '100% Européenne')}
                </span>
              </h1>
              <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
                {t('hero.description', 'Datacenters Tier IV • Support 24/7 • SLA 99.99% • RGPD Natif')}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/products"
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-4 rounded-xl font-medium hover:opacity-90 transition-opacity inline-block"
                >
                  {t('hero.cta.products', 'Voir les Produits')}
                </Link>
                <Link
                  href="/pricing"
                  className="bg-zinc-800 text-white px-8 py-4 rounded-xl font-medium hover:bg-zinc-700 transition-colors inline-block"
                >
                  {t('hero.cta.pricing', 'Tarifs')}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Infrastructure Overview */}
        <section ref={capacityRef} className="py-20 px-6">
          <div className="container mx-auto">
            <div
              className="text-center mb-12"
              style={{
                opacity: capacityInView ? 1 : 0,
                transform: capacityInView ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <Badge variant="secondary" className="mb-4">
                {t('capacity.badge', 'Vue d\'ensemble')}
              </Badge>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-4">
                {t('capacity.title', 'Infrastructure en Temps Réel')}
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Compute */}
              <div className="bg-zinc-900/40 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <CpuChipIcon className="w-6 h-6 text-cyan-400" />
                    <h3 className="text-lg font-medium text-white">{t('capacity.compute.title', 'Compute')}</h3>
                  </div>
                  <Badge variant="success">
                    {t('capacity.compute.status', 'Opérationnel')}
                  </Badge>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-zinc-400">{t('capacity.compute.cpu', 'CPU Cores')}</span>
                      <span className="text-sm text-white">{infrastructureData.capacity.compute.totalCores.toLocaleString()}</span>
                    </div>
                    <AnimatedProgress value={75} delay={100} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-zinc-400">{t('capacity.compute.ram', 'RAM')}</span>
                      <span className="text-sm text-white">{infrastructureData.capacity.compute.totalRam}</span>
                    </div>
                    <AnimatedProgress value={60} delay={200} />
                  </div>
                  <div className="pt-3 border-t border-zinc-800">
                    <p className="text-xs text-zinc-500">
                      {infrastructureData.capacity.compute.nodes} {t('capacity.compute.nodes', 'nodes actifs')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Storage */}
              <div className="bg-zinc-900/40 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <CircleStackIcon className="w-6 h-6 text-purple-400" />
                    <h3 className="text-lg font-medium text-white">{t('capacity.storage.title', 'Stockage')}</h3>
                  </div>
                  <Badge variant="success">
                    {t('capacity.storage.status', 'Opérationnel')}
                  </Badge>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-zinc-400">{t('capacity.storage.nvme', 'NVMe')}</span>
                      <span className="text-sm text-white">{infrastructureData.capacity.storage.nvme}</span>
                    </div>
                    <AnimatedProgress value={45} delay={300} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-zinc-400">{t('capacity.storage.ssd', 'SSD')}</span>
                      <span className="text-sm text-white">{infrastructureData.capacity.storage.ssd}</span>
                    </div>
                    <AnimatedProgress value={55} delay={400} />
                  </div>
                  <div className="pt-3 border-t border-zinc-800">
                    <p className="text-xs text-zinc-500">
                      {t('capacity.storage.replication', 'Réplication triple')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Network */}
              <div className="bg-zinc-900/40 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <SignalIcon className="w-6 h-6 text-green-400" />
                    <h3 className="text-lg font-medium text-white">{t('capacity.network.title', 'Réseau')}</h3>
                  </div>
                  <Badge variant="success">
                    {t('capacity.network.status', 'Opérationnel')}
                  </Badge>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-zinc-400">{t('capacity.network.backbone', 'Backbone')}</span>
                      <span className="text-sm text-white">{infrastructureData.capacity.network.backbone}</span>
                    </div>
                    <AnimatedProgress value={30} delay={500} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-zinc-400">{t('capacity.network.peering', 'Peering')}</span>
                      <span className="text-sm text-white">{infrastructureData.capacity.network.peering}</span>
                    </div>
                    <AnimatedProgress value={100} delay={600} />
                  </div>
                  <div className="pt-3 border-t border-zinc-800">
                    <p className="text-xs text-zinc-500">
                      {t('capacity.network.ddos', 'DDoS Protection 10Tbps')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* GPU Inventory - Improved */}
            <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-2xl p-6 border border-cyan-500/20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <CpuChipIcon className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-xl font-medium text-white">{t('capacity.gpu.title', 'Inventaire GPU')}</h3>
                </div>
                <Badge variant="primary">
                  {infrastructureData.capacity.utilization?.gpu || 72}% {t('capacity.gpu.highDemand', 'Utilisé - Forte Demande')}
                </Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {infrastructureData.capacity.gpu && infrastructureData.capacity.gpu.map((gpu, index) => (
                  <div key={index} className="bg-zinc-900/60 rounded-lg p-4">
                    <p className="text-white font-medium mb-1">{gpu.model}</p>
                    <p className="text-2xl font-bold text-cyan-400 mb-1">{gpu.available}</p>
                    <p className="text-xs text-zinc-500">{t('capacity.gpu.available', 'disponibles')}</p>
                    <div className="mt-2 pt-2 border-t border-zinc-800">
                      <p className="text-xs text-zinc-400">{gpu.memory} VRAM</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section ref={securityRef} className="py-20 px-6 bg-zinc-900/20">
          <div className="container mx-auto">
            <div
              className="text-center mb-12"
              style={{
                opacity: securityInView ? 1 : 0,
                transform: securityInView ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
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
                <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800 text-center">
                  <ShieldCheckIcon className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <p className="text-sm font-medium text-white">ISO 27001</p>
                  <p className="text-xs text-zinc-500 mt-1">
                    {t('security.certifications.obtained', 'Certifié')}
                  </p>
                </div>
                <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800 text-center">
                  <DocumentCheckIcon className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                  <p className="text-sm font-medium text-white">SOC 2 Type II</p>
                  <p className="text-xs text-zinc-500 mt-1">
                    {t('security.certifications.compliant', 'Conforme')}
                  </p>
                </div>
                <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800 text-center">
                  <KeyIcon className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                  <p className="text-sm font-medium text-white">RGPD</p>
                  <p className="text-xs text-zinc-500 mt-1">
                    {t('security.certifications.native', 'Natif')}
                  </p>
                </div>
                <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800 text-center">
                  <FingerPrintIcon className="w-12 h-12 text-cyan-400 mx-auto mb-3" />
                  <p className="text-sm font-medium text-white">PCI DSS</p>
                  <p className="text-xs text-zinc-500 mt-1">
                    {t('security.certifications.ready', 'Q2 2025')}
                  </p>
                </div>
              </div>
            </div>

            {/* Security Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
                <ShieldCheckIcon className="w-8 h-8 text-green-400 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">{t('security.physical.title', 'Sécurité Physique')}</h3>
                <ul className="space-y-2 text-sm text-zinc-400">
                  <li>• Biométrie multicouche</li>
                  <li>• Surveillance 24/7</li>
                  <li>• Sas anti-retour</li>
                  <li>• Détection intrusion</li>
                </ul>
              </div>

              <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
                <LockClosedIcon className="w-8 h-8 text-blue-400 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">{t('security.network.title', 'Sécurité Réseau')}</h3>
                <ul className="space-y-2 text-sm text-zinc-400">
                  <li>• DDoS 10Tbps</li>
                  <li>• Firewall distribué</li>
                  <li>• IDS/IPS actif</li>
                  <li>• VPN IPSec/WireGuard</li>
                </ul>
              </div>

              <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
                <KeyIcon className="w-8 h-8 text-purple-400 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">{t('security.encryption.title', 'Chiffrement')}</h3>
                <ul className="space-y-2 text-sm text-zinc-400">
                  <li>• AES-256 au repos</li>
                  <li>• TLS 1.3 en transit</li>
                  <li>• HSM dédié</li>
                  <li>• Rotation des clés</li>
                </ul>
              </div>

              <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
                <ShieldExclamationIcon className="w-8 h-8 text-amber-400 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">{t('security.compliance.title', 'RGPD')}</h3>
                <ul className="space-y-2 text-sm text-zinc-400">
                  <li>• DPA standard</li>
                  <li>• Droit à l'oubli</li>
                  <li>• Portabilité</li>
                  <li>• Audit trail</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Orchestration & Monitoring - Fixed with content */}
        <section ref={stackRef} className="py-20 px-6">
          <div className="container mx-auto">
            <div
              className="text-center mb-12"
              style={{
                opacity: stackInView ? 1 : 0,
                transform: stackInView ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <Badge variant="success" className="mb-4">
                {t('stack.badge', 'Stack Technique')}
              </Badge>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-4">
                {t('stack.title', 'Orchestration & Monitoring')}
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Orchestration */}
              <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
                <div className="flex items-center gap-3 mb-6">
                  <WrenchScrewdriverIcon className="w-8 h-8 text-cyan-400" />
                  <h3 className="text-xl font-medium text-white">{t('stack.orchestration.title', 'Orchestration')}</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-800/50 rounded-lg p-4">
                    <p className="text-white font-medium mb-1">Nomad</p>
                    <p className="text-xs text-zinc-400">Container orchestration</p>
                  </div>
                  <div className="bg-zinc-800/50 rounded-lg p-4">
                    <p className="text-white font-medium mb-1">Kubernetes</p>
                    <p className="text-xs text-zinc-400">Coming Q2 2025</p>
                  </div>
                  <div className="bg-zinc-800/50 rounded-lg p-4">
                    <p className="text-white font-medium mb-1">Consul</p>
                    <p className="text-xs text-zinc-400">Service mesh</p>
                  </div>
                  <div className="bg-zinc-800/50 rounded-lg p-4">
                    <p className="text-white font-medium mb-1">Terraform</p>
                    <p className="text-xs text-zinc-400">IaC provider</p>
                  </div>
                </div>
              </div>

              {/* Monitoring */}
              <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
                <div className="flex items-center gap-3 mb-6">
                  <ChartBarIcon className="w-8 h-8 text-purple-400" />
                  <h3 className="text-xl font-medium text-white">{t('stack.monitoring.title', 'Monitoring')}</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-800/50 rounded-lg p-4">
                    <p className="text-white font-medium mb-1">Prometheus</p>
                    <p className="text-xs text-zinc-400">Metrics collection</p>
                  </div>
                  <div className="bg-zinc-800/50 rounded-lg p-4">
                    <p className="text-white font-medium mb-1">Grafana</p>
                    <p className="text-xs text-zinc-400">Visualization</p>
                  </div>
                  <div className="bg-zinc-800/50 rounded-lg p-4">
                    <p className="text-white font-medium mb-1">Loki</p>
                    <p className="text-xs text-zinc-400">Log aggregation</p>
                  </div>
                  <div className="bg-zinc-800/50 rounded-lg p-4">
                    <p className="text-white font-medium mb-1">Tempo</p>
                    <p className="text-xs text-zinc-400">Distributed tracing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Updated Roadmap - Starting from Sept 2024 */}
        <section ref={roadmapRef} className="py-20 px-6 bg-zinc-900/20">
          <div className="container mx-auto">
            <div
              className="text-center mb-12"
              style={{
                opacity: roadmapInView ? 1 : 0,
                transform: roadmapInView ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <Badge variant="primary" className="mb-4">
                {t('roadmap.badge', 'Roadmap 2024-2026')}
              </Badge>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-4">
                {t('roadmap.title', 'Évolution de la Plateforme')}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Q4 2024 - Launch */}
              <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-white">Q4 2024</h3>
                  <ClockIcon className="w-5 h-5 text-cyan-400" />
                </div>
                <p className="text-xs text-zinc-500 mb-3">Sept - Déc 2024</p>
                <div className="space-y-3">
                  <div className="flex items-start text-sm">
                    <CheckCircleIcon className="w-4 h-4 text-green-400 mr-2 mt-0.5" />
                    <span className="text-zinc-300 line-through">
                      Lancement plateforme
                    </span>
                  </div>
                  <div className="flex items-start text-sm">
                    <CheckCircleIcon className="w-4 h-4 text-green-400 mr-2 mt-0.5" />
                    <span className="text-zinc-300 line-through">
                      VPS & GPU disponibles
                    </span>
                  </div>
                  <div className="flex items-start text-sm">
                    <span className="text-zinc-500 mr-2">○</span>
                    <span className="text-white">
                      API v1 finalisée
                    </span>
                  </div>
                  <div className="flex items-start text-sm">
                    <span className="text-zinc-500 mr-2">○</span>
                    <span className="text-white">
                      Paris DC opérationnel
                    </span>
                  </div>
                </div>
              </div>

              {/* Q1 2025 */}
              <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-white">Q1 2025</h3>
                  <ClockIcon className="w-5 h-5 text-purple-400" />
                </div>
                <p className="text-xs text-zinc-500 mb-3">Jan - Mars 2025</p>
                <div className="space-y-3">
                  <div className="flex items-start text-sm">
                    <span className="text-zinc-500 mr-2">○</span>
                    <span className="text-zinc-400">
                      Network 100G upgrade
                    </span>
                  </div>
                  <div className="flex items-start text-sm">
                    <span className="text-zinc-500 mr-2">○</span>
                    <span className="text-zinc-400">
                      A100/H100 GPUs
                    </span>
                  </div>
                  <div className="flex items-start text-sm">
                    <span className="text-zinc-500 mr-2">○</span>
                    <span className="text-zinc-400">
                      Storage S3 (MinIO)
                    </span>
                  </div>
                  <div className="flex items-start text-sm">
                    <span className="text-zinc-500 mr-2">○</span>
                    <span className="text-zinc-400">
                      API v2 beta
                    </span>
                  </div>
                </div>
              </div>

              {/* Q2 2025 */}
              <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-white">Q2 2025</h3>
                  <ClockIcon className="w-5 h-5 text-green-400" />
                </div>
                <p className="text-xs text-zinc-500 mb-3">Avr - Juin 2025</p>
                <div className="space-y-3">
                  <div className="flex items-start text-sm">
                    <span className="text-zinc-500 mr-2">○</span>
                    <span className="text-zinc-400">
                      Frankfurt DC launch
                    </span>
                  </div>
                  <div className="flex items-start text-sm">
                    <span className="text-zinc-500 mr-2">○</span>
                    <span className="text-zinc-400">
                      Kubernetes managed
                    </span>
                  </div>
                  <div className="flex items-start text-sm">
                    <span className="text-zinc-500 mr-2">○</span>
                    <span className="text-zinc-400">
                      Terraform provider
                    </span>
                  </div>
                  <div className="flex items-start text-sm">
                    <span className="text-zinc-500 mr-2">○</span>
                    <span className="text-zinc-400">
                      PCI DSS certification
                    </span>
                  </div>
                </div>
              </div>

              {/* 2026 */}
              <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-white">2026</h3>
                  <ClockIcon className="w-5 h-5 text-pink-400" />
                </div>
                <p className="text-xs text-zinc-500 mb-3">Vision long terme</p>
                <div className="space-y-3">
                  <div className="flex items-start text-sm">
                    <span className="text-zinc-500 mr-2">○</span>
                    <span className="text-zinc-400">
                      Amsterdam DC
                    </span>
                  </div>
                  <div className="flex items-start text-sm">
                    <span className="text-zinc-500 mr-2">○</span>
                    <span className="text-zinc-400">
                      Edge computing
                    </span>
                  </div>
                  <div className="flex items-start text-sm">
                    <span className="text-zinc-500 mr-2">○</span>
                    <span className="text-zinc-400">
                      AI/ML Platform
                    </span>
                  </div>
                  <div className="flex items-start text-sm">
                    <span className="text-zinc-500 mr-2">○</span>
                    <span className="text-zinc-400">
                      Quantum-ready
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Updated Links */}
        <section className="py-20 px-6">
          <div className="container mx-auto">
            <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-3xl p-8 sm:p-12 border border-cyan-500/20 text-center">
              <FireIcon className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-4">
                {t('cta.title', 'Infrastructure Premium Européenne')}
              </h2>
              <p className="text-zinc-400 text-lg mb-8 max-w-2xl mx-auto">
                {t('cta.description', 'Rejoignez les entreprises qui ont choisi Hackboot pour leur infrastructure critique. Support 24/7, SLA garanti, et une équipe d\'experts européens.')}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/support"
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-4 rounded-xl font-medium hover:opacity-90 transition-opacity inline-block"
                >
                  {t('cta.support', 'Contacter le Support')}
                </Link>
                <Link
                  href="/products"
                  className="bg-zinc-800 text-white px-8 py-4 rounded-xl font-medium hover:bg-zinc-700 transition-colors inline-block"
                >
                  {t('cta.exploreProducts', 'Explorer les Produits')}
                </Link>
                <Link
                  href="/pricing"
                  className="bg-transparent text-white px-8 py-4 rounded-xl font-medium border border-zinc-600 hover:bg-zinc-800/50 transition-colors inline-block"
                >
                  {t('cta.pricing', 'Voir les Tarifs')}
                </Link>
              </div>

              <div className="mt-8 pt-8 border-t border-zinc-800">
                <p className="text-sm text-zinc-500">
                  {t('cta.footer', 'Hackboot OÜ • Entreprise estonienne • Infrastructure 100% européenne')}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}