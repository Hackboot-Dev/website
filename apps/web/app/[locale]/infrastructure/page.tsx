'use client';

// /workspaces/website/apps/web/app/infrastructure/page.tsx  
// Description: Technical infrastructure page showcasing Hackboot premium capabilities
// Last modified: 2025-08-27
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
  FireIcon
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

  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />
      
      <main className="relative">
        {/* Hero Section with Evolution Story */}
        <section className="pt-32 pb-12 sm:pt-36 sm:pb-16 lg:pt-40 lg:pb-24 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div 
                ref={heroRef}
                className="text-center mb-12"
                style={{
                  opacity: mounted ? (heroInView ? 1 : 0) : 0,
                  transform: mounted ? (heroInView ? 'translateY(0)' : 'translateY(20px)') : 'translateY(20px)',
                  transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <Badge variant="outline" className="mb-6">
                  {t('hero.badge', 'Infrastructure Cloud Premium')}
                </Badge>
                
                {/* Evolution subtitle */}
                <p className="text-zinc-500 text-sm mb-4 italic">
                  {t('hero.evolution', 'Du pionnier du cloud gaming haute performance à l\'infrastructure cloud européenne premium')}
                </p>
                
                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-light text-white mb-6">
                  {t('hero.title', 'Infrastructure Technique')}
                  <br />
                  <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
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
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-4 rounded-xl font-medium hover:opacity-90 transition-opacity inline-block"
                  >
                    {t('hero.cta.products', 'Voir les Produits')}
                  </Link>
                  <Link 
                    href="/pricing" 
                    className="bg-zinc-800 text-white px-8 py-4 rounded-xl font-medium hover:bg-zinc-700 transition-colors inline-block"
                  >
                    {t('hero.cta.pricing', 'Tarification')}
                  </Link>
                  <a 
                    href="https://status.hackboot.com" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-transparent text-white px-8 py-4 rounded-xl font-medium border border-zinc-600 hover:bg-zinc-800/50 transition-colors inline-block"
                  >
                    {t('hero.cta.status', 'Status Page')}
                  </a>
                </div>
              </div>

              {/* Real Stats Grid */}
              <div 
                ref={capacityRef}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-16"
              >
                {infrastructureData.stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800 hover:border-zinc-700 transition-all"
                    style={{
                      opacity: capacityInView ? 1 : 0,
                      transform: capacityInView ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
                      transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 100}ms`
                    }}
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
        <section className="py-12 sm:py-16 lg:py-20 bg-zinc-900/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <Badge variant="secondary" className="mb-4">
                  {t('capacity.badge', 'Capacité Totale')}
                </Badge>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-4">
                  {t('capacity.title', 'Vue d\'Ensemble Infrastructure')}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
                  <ServerIcon className="w-8 h-8 text-cyan-400 mb-4" />
                  <h3 className="text-lg font-medium text-white mb-4">{t('capacity.compute.title', 'Compute')}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">{t('capacity.compute.totalVcpus', 'Total vCPUs')}</span>
                      <span className="text-white">{infrastructureData.capacity.compute}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">{t('capacity.compute.totalRam', 'RAM Total')}</span>
                      <span className="text-white">{infrastructureData.capacity.ram}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">{t('capacity.compute.utilization', 'Utilisation')}</span>
                      <span className="text-cyan-400">{infrastructureData.capacity.utilization.compute}%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
                  <CircleStackIcon className="w-8 h-8 text-purple-400 mb-4" />
                  <h3 className="text-lg font-medium text-white mb-4">{t('capacity.storage.title', 'Stockage')}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">{t('capacity.storage.nvmeCapacity', 'Capacité NVMe')}</span>
                      <span className="text-white">{infrastructureData.capacity.storage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">{t('capacity.storage.performance', 'Performance')}</span>
                      <span className="text-white">7 GB/s read</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">{t('capacity.compute.utilization', 'Utilisation')}</span>
                      <span className="text-purple-400">{infrastructureData.capacity.utilization.storage}%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
                  <SignalIcon className="w-8 h-8 text-green-400 mb-4" />
                  <h3 className="text-lg font-medium text-white mb-4">{t('capacity.network.title', 'Réseau')}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">{t('capacity.network.capacity', 'Capacité')}</span>
                      <span className="text-white">{infrastructureData.capacity.network}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">{t('capacity.network.burst', 'Burst')}</span>
                      <span className="text-white">1 Tbps</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">{t('capacity.compute.utilization', 'Utilisation')}</span>
                      <span className="text-green-400">{infrastructureData.capacity.utilization.network}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* GPU Inventory with high demand indicator */}
              <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-2xl p-8 border border-cyan-500/20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-medium text-white">{t('capacity.gpu.title', 'Inventaire GPU')}</h3>
                  <Badge variant="primary">
                    {infrastructureData.capacity.utilization.gpu}% {t('capacity.gpu.highDemand', 'Utilisé - Forte Demande')}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {infrastructureData.compute.gpuInventory.map((gpu, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl font-bold text-white mb-2">{gpu.model}</div>
                      <p className="text-sm text-zinc-400 mb-1">{gpu.count} unités • {gpu.vram}</p>
                      <p className="text-xs text-zinc-500">{gpu.distribution}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Datacenters Section */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div 
                ref={regionsRef}
                className="text-center mb-12"
                style={{
                  opacity: regionsInView ? 1 : 0,
                  transform: regionsInView ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <Badge variant="primary" className="mb-4">
                  {t('regions.badge', 'Présence Européenne')}
                </Badge>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-4">
                  {t('regions.title', 'Datacenters Tier III+')}
                </h2>
                <p className="text-zinc-400 max-w-3xl mx-auto">
                  {t('regions.description', 'Colocation premium chez Equinix et Interxion. Redondance 2N sur l\'alimentation, refroidissement DX avec PUE < 1.3')}
                </p>
              </div>

              {/* Regions Grid with technical details */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {infrastructureData.regions.map((region, index) => (
                  <div
                    key={region.code}
                    className="bg-zinc-900/40 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800 hover:border-zinc-700 transition-all"
                    style={{
                      opacity: regionsInView ? 1 : 0,
                      transform: regionsInView ? 'translateY(0)' : 'translateY(30px)',
                      transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${index * 80}ms`
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-medium text-white">{region.name}</h3>
                        <p className="text-sm text-zinc-500">{region.code} • {region.capacity}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        region.status === 'operational' 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : region.status === 'maintenance'
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          : 'bg-zinc-500/20 text-zinc-400 border border-zinc-500/30'
                      }`}>
                        {region.status === 'operational' 
                          ? t('regions.status.operational', 'Opérationnel')
                          : region.status === 'maintenance'
                          ? t('regions.status.maintenance', 'Maintenance')
                          : t('regions.status.coming', 'Bientôt')}
                      </div>
                    </div>
                    
                    <div className="mb-4 p-3 bg-zinc-800/50 rounded-lg">
                      <div className="text-xs text-zinc-400 mb-1">{t('regions.gpuAvailable', 'GPU Disponibles')}</div>
                      <div className="text-sm text-white font-mono">{region.gpus}</div>
                    </div>
                    
                    <div className="mb-4 p-3 bg-zinc-800/50 rounded-lg">
                      <div className="text-xs text-zinc-400 mb-1">{t('regions.peering', 'Peering')}</div>
                      <div className="text-sm text-cyan-400">{region.peering}</div>
                    </div>
                    
                    <div className="space-y-2">
                      {region.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm text-zinc-400">
                          <CheckCircleIcon className="w-4 h-4 text-cyan-400 mr-2 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Technical Architecture Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-zinc-900/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div 
                ref={computeRef}
                className="text-center mb-12"
                style={{
                  opacity: computeInView ? 1 : 0,
                  transform: computeInView ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <Badge variant="outline" className="mb-4">
                  {t('compute.badge', 'Architecture Technique')}
                </Badge>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-4">
                  {t('compute.title', 'Compute & Virtualisation')}
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* VPS Host Configuration */}
                <div 
                  className="bg-zinc-900/40 backdrop-blur-sm rounded-2xl p-8 border border-zinc-800"
                  style={{
                    opacity: computeInView ? 1 : 0,
                    transform: computeInView ? 'scale(1)' : 'scale(0.95)',
                    transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 100ms'
                  }}
                >
                  <div className="flex items-center mb-6">
                    <CpuChipIcon className="w-10 h-10 text-cyan-400 mr-4" />
                    <div>
                      <h3 className="text-2xl font-medium text-white">{t('compute.vpsHosts.title', 'VPS Hosts')}</h3>
                      <p className="text-sm text-zinc-500">{infrastructureData.compute.servers.vpsHosts.model}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-3 bg-zinc-800/30 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-300">{t('compute.cpu', 'CPU')}</span>
                        <span className="text-white font-mono text-sm">{infrastructureData.compute.servers.vpsHosts.cores}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-zinc-800/30 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-300">{t('compute.ram', 'RAM')}</span>
                        <span className="text-white font-mono text-sm">{infrastructureData.compute.servers.vpsHosts.ram}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-zinc-800/30 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-300">{t('compute.storage', 'Storage')}</span>
                        <span className="text-white font-mono text-sm">{infrastructureData.compute.servers.vpsHosts.storage}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-zinc-800/30 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-300">{t('compute.network', 'Network')}</span>
                        <span className="text-white font-mono text-sm">{infrastructureData.compute.servers.vpsHosts.network}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-zinc-800/30 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-300">{t('compute.density', 'Density')}</span>
                        <span className="text-white font-mono text-sm">{infrastructureData.compute.servers.vpsHosts.density}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* GPU Host Configuration */}
                <div 
                  className="bg-zinc-900/40 backdrop-blur-sm rounded-2xl p-8 border border-zinc-800"
                  style={{
                    opacity: computeInView ? 1 : 0,
                    transform: computeInView ? 'scale(1)' : 'scale(0.95)',
                    transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 250ms'
                  }}
                >
                  <div className="flex items-center mb-6">
                    <CubeIcon className="w-10 h-10 text-purple-400 mr-4" />
                    <div>
                      <h3 className="text-2xl font-medium text-white">{t('compute.gpuHosts.title', 'GPU Hosts')}</h3>
                      <p className="text-sm text-zinc-500">{infrastructureData.compute.servers.gpuHosts.model}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-3 bg-zinc-800/30 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-300">{t('compute.cpu', 'CPU')}</span>
                        <span className="text-white font-mono text-sm">{infrastructureData.compute.servers.gpuHosts.cores}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-zinc-800/30 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-300">{t('compute.ram', 'RAM')}</span>
                        <span className="text-white font-mono text-sm">{infrastructureData.compute.servers.gpuHosts.ram}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-zinc-800/30 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-300">{t('compute.gpuSlots', 'GPU Slots')}</span>
                        <span className="text-white font-mono text-sm">{infrastructureData.compute.servers.gpuHosts.gpuSlots}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-zinc-800/30 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-300">{t('compute.network', 'Network')}</span>
                        <span className="text-white font-mono text-sm">{infrastructureData.compute.servers.gpuHosts.network}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-zinc-800/30 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-300">{t('compute.cooling', 'Cooling')}</span>
                        <span className="text-white font-mono text-sm">{infrastructureData.compute.servers.gpuHosts.cooling}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Virtualization Stack */}
              <div className="mt-8 bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
                <h3 className="text-xl font-medium text-white mb-4">{t('compute.virtualization.title', 'Stack Virtualisation')}</h3>
                <div className="mb-4">
                  <span className="text-zinc-400">{t('compute.virtualization.hypervisor', 'Hyperviseur')}:</span>
                  <span className="text-white ml-2">{infrastructureData.compute.virtualization.hypervisor}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {infrastructureData.compute.virtualization.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <CheckCircleIcon className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                      <span className="text-zinc-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Network Section */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div 
                ref={networkRef}
                className="text-center mb-12"
                style={{
                  opacity: networkInView ? 1 : 0,
                  transform: networkInView ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <Badge variant="primary" className="mb-4">
                  {t('network.badge', 'Infrastructure Réseau')}
                </Badge>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-4">
                  {t('network.title', 'Backbone & Protection')}
                </h2>
                <p className="text-zinc-400 max-w-3xl mx-auto">
                  {infrastructureData.network.totalCapacity} {t('network.description', 'de capacité avec burst jusqu\'à')} {infrastructureData.network.burstCapacity}.
                  {infrastructureData.network.peering} {t('network.description2', 'directs, CDN via')} {infrastructureData.network.cdn}.
                </p>
              </div>

              {/* DDoS Protection Tiers */}
              <div className="mb-12">
                <h3 className="text-xl font-medium text-white mb-6 text-center">{t('network.ddos.title', 'Protection DDoS Multi-Couches')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {infrastructureData.network.ddosProtection.map((tier, index) => (
                    <div 
                      key={index}
                      className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800"
                      style={{
                        opacity: networkInView ? 1 : 0,
                        transform: networkInView ? 'translateY(0)' : 'translateY(30px)',
                        transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${index * 100}ms`
                      }}
                    >
                      <ShieldCheckIcon className="w-8 h-8 text-cyan-400 mb-4" />
                      <h4 className="text-lg font-medium text-white mb-2">{tier.tier}</h4>
                      <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
                        {tier.capacity}
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-zinc-400">{t('network.ddos.mitigation', 'Mitigation')}</span>
                          <span className="text-white">{tier.mitigation}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400">{t('network.ddos.provider', 'Provider')}</span>
                          <span className="text-white">{tier.provider}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400">{t('network.ddos.sla', 'SLA')}</span>
                          <span className="text-green-400">{tier.sla}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Peering Points */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
                  <h3 className="text-xl font-medium text-white mb-4">{t('network.peering.title', 'Points de Peering')}</h3>
                  <div className="space-y-3">
                    {infrastructureData.network.peeringPoints.map((point) => (
                      <div key={point.name} className="flex items-center justify-between p-3 bg-zinc-800/30 rounded-lg">
                        <div>
                          <span className="text-zinc-300">{point.name}</span>
                          <span className="text-xs text-zinc-500 ml-2">({point.location})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-mono text-sm">{point.capacity}</span>
                          <span className={`text-xs ${point.status === 'connected' ? 'text-green-400' : 'text-yellow-400'}`}>
                            ● {point.status === 'connected' ? t('network.peering.connected', 'Connected') : t('network.peering.planned', 'Planned')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
                  <h3 className="text-xl font-medium text-white mb-4">{t('network.transit.title', 'Transit & CDN')}</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-zinc-400 mb-2">{t('network.transit.providers', 'Transit Providers')}</p>
                      <div className="flex flex-wrap gap-2">
                        {infrastructureData.network.transitProviders.map((provider, index) => (
                          <Badge key={index} variant="secondary">{provider}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-lg border border-cyan-500/20">
                      <p className="text-sm text-zinc-300">
                        <span className="text-cyan-400 font-medium">{t('network.transit.cdnPartnership', 'CDN Partnership')}</span>
                        <br />
                        {infrastructureData.network.cdn} {t('network.transit.cdnDescription', 'pour edge caching global')}
                      </p>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">{t('network.transit.avgLatency', 'Latence moyenne EU')}</span>
                        <span className="text-green-400">{'< 15ms'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">{t('network.transit.guaranteedLatency', 'Latence garantie')}</span>
                        <span className="text-white">{'< 30ms intra-EU'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Storage Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-zinc-900/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div 
                ref={storageRef}
                className="text-center mb-12"
                style={{
                  opacity: storageInView ? 1 : 0,
                  transform: storageInView ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <Badge variant="outline" className="mb-4">
                  {t('storage.badge', 'Infrastructure Stockage')}
                </Badge>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-4">
                  {t('storage.title', 'NVMe Gen4 & Distributed Storage')}
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Local NVMe */}
                <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
                  <CircleStackIcon className="w-8 h-8 text-purple-400 mb-4" />
                  <h3 className="text-lg font-medium text-white mb-4">{t('storage.local.title', 'Stockage Local')}</h3>
                  <div className="mb-4">
                    <p className="text-sm text-zinc-400 mb-2">{t('storage.local.models', 'Modèles')}</p>
                    <div className="flex flex-wrap gap-2">
                      {infrastructureData.storage.local.models.map((model, index) => (
                        <span key={index} className="text-xs bg-zinc-800 px-2 py-1 rounded text-white">
                          {model}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">{t('storage.local.readSpeed', 'Read Speed')}</span>
                      <span className="text-white font-mono">{infrastructureData.storage.local.performance.read}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">{t('storage.local.writeSpeed', 'Write Speed')}</span>
                      <span className="text-white font-mono">{infrastructureData.storage.local.performance.write}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">{t('storage.local.iops', 'IOPS')}</span>
                      <span className="text-white font-mono">{infrastructureData.storage.local.performance.iops}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">{t('storage.local.latency', 'Latency')}</span>
                      <span className="text-green-400 font-mono">{infrastructureData.storage.local.performance.latency}</span>
                    </div>
                  </div>
                </div>

                {/* Distributed Ceph */}
                <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
                  <CloudArrowUpIcon className="w-8 h-8 text-cyan-400 mb-4" />
                  <h3 className="text-lg font-medium text-white mb-4">{t('storage.distributed.title', 'Stockage Distribué')}</h3>
                  <div className="mb-4">
                    <Badge variant="secondary">{infrastructureData.storage.distributed.technology}</Badge>
                  </div>
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">{t('capacity.network.capacity', 'Capacité')}</span>
                      <span className="text-white">{infrastructureData.storage.distributed.capacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">{t('storage.distributed.replication', 'Replication')}</span>
                      <span className="text-white">{infrastructureData.storage.distributed.replication}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">{t('capacity.storage.performance', 'Performance')}</span>
                      <span className="text-white">{infrastructureData.storage.distributed.performance}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 mb-2">{t('storage.distributed.useCases', 'Use Cases')}</p>
                    <div className="flex flex-wrap gap-1">
                      {infrastructureData.storage.distributed.useCases.map((useCase, index) => (
                        <span key={index} className="text-xs text-zinc-400">
                          {useCase}{index < infrastructureData.storage.distributed.useCases.length - 1 && ' •'}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Backup */}
                <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
                  <ArrowPathIcon className="w-8 h-8 text-green-400 mb-4" />
                  <h3 className="text-lg font-medium text-white mb-4">{t('storage.backup.title', 'Backup & Recovery')}</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-zinc-400 mb-1">{t('storage.backup.method', 'Méthode')}</p>
                      <p className="text-white text-xs">{infrastructureData.storage.backup.method}</p>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">{t('storage.backup.frequency', 'Fréquence')}</span>
                      <span className="text-white">{infrastructureData.storage.backup.frequency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">{t('storage.backup.retention', 'Rétention')}</span>
                      <span className="text-white text-xs">{infrastructureData.storage.backup.retention}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 bg-zinc-800/50 rounded text-center">
                        <p className="text-xs text-zinc-400">{t('storage.backup.rpo', 'RPO')}</p>
                        <p className="text-sm text-cyan-400">{infrastructureData.storage.backup.rpo}</p>
                      </div>
                      <div className="p-2 bg-zinc-800/50 rounded text-center">
                        <p className="text-xs text-zinc-400">{t('storage.backup.rto', 'RTO')}</p>
                        <p className="text-sm text-green-400">{infrastructureData.storage.backup.rto}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security & Compliance Section */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div 
                ref={securityRef}
                className="text-center mb-12"
                style={{
                  opacity: securityInView ? 1 : 0,
                  transform: securityInView ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <Badge variant="secondary" className="mb-4">
                  Sécurité & Conformité
                </Badge>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-4">
                  Protection Multi-Couches
                </h2>
              </div>

              {/* Certifications */}
              <div className="mb-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {infrastructureData.security.certifications.map((cert, index) => (
                    <div key={index} className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-4 border border-zinc-800 text-center">
                      <div className="text-2xl mb-2">{cert.icon}</div>
                      <p className="text-sm font-medium text-white">{cert.name}</p>
                      <p className="text-xs text-zinc-500">
                        {cert.status === 'obtained' ? t('security.certifications.obtained', 'Obtenu') : cert.status === 'compliant' ? t('security.certifications.compliant', 'Conforme') : cert.status === 'ready' ? t('security.certifications.ready', 'Prêt') : cert.target}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Physical Security */}
                <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
                  <LockClosedIcon className="w-6 h-6 text-green-400 mb-3" />
                  <h3 className="text-sm font-medium text-white mb-3">{t('security.physical.title', 'Sécurité Physique')}</h3>
                  <ul className="space-y-2 text-xs text-zinc-400">
                    {infrastructureData.security.physical.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-400 mr-1">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Network Security */}
                <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
                  <ShieldCheckIcon className="w-6 h-6 text-blue-400 mb-3" />
                  <h3 className="text-sm font-medium text-white mb-3">{t('security.network.title', 'Sécurité Réseau')}</h3>
                  <ul className="space-y-2 text-xs text-zinc-400">
                    {infrastructureData.security.network.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-400 mr-1">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Encryption */}
                <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
                  <CommandLineIcon className="w-6 h-6 text-purple-400 mb-3" />
                  <h3 className="text-sm font-medium text-white mb-3">{t('security.encryption.title', 'Chiffrement')}</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">{t('security.encryption.atRest', 'At Rest')}</span>
                      <span className="text-white">{infrastructureData.security.encryption.atRest}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">{t('security.encryption.inTransit', 'In Transit')}</span>
                      <span className="text-white">{infrastructureData.security.encryption.inTransit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">{t('security.encryption.keys', 'Keys')}</span>
                      <span className="text-white">{infrastructureData.security.encryption.keyManagement}</span>
                    </div>
                  </div>
                </div>

                {/* Compliance */}
                <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
                  <CheckCircleIcon className="w-6 h-6 text-cyan-400 mb-3" />
                  <h3 className="text-sm font-medium text-white mb-3">{t('security.compliance.title', 'RGPD/GDPR')}</h3>
                  <ul className="space-y-2 text-xs text-zinc-400">
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-1">✓</span>
                      {t('security.compliance.dataResidency', 'Data residency EU')}
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-1">✓</span>
                      {t('security.compliance.dpa', 'DPA disponible')}
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-1">✓</span>
                      {t('security.compliance.rightToForget', 'Droit à l\'oubli')}
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-1">✓</span>
                      {t('security.compliance.auditTrails', 'Audit trails')}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reliability & SLA Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-zinc-900/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div 
                ref={reliabilityRef}
                className="text-center mb-12"
                style={{
                  opacity: reliabilityInView ? 1 : 0,
                  transform: reliabilityInView ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <Badge variant="primary" className="mb-4">
                  {t('reliability.badge', 'Fiabilité & SLA')}
                </Badge>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-4">
                  {t('reliability.title', 'Garanties de Service')}
                </h2>
                <p className="text-zinc-400 max-w-3xl mx-auto">
                  {t('reliability.description', 'Uptime réel 2024 :')} {infrastructureData.reliability.metrics2024.actualUptime}. 
                  {t('reliability.description2', 'Seulement')} {infrastructureData.reliability.metrics2024.incidents}.
                </p>
              </div>

              {/* SLA Tiers */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {infrastructureData.reliability.sla.map((tier, index) => {
                  const colors = ['', 'from-cyan-500/10 to-purple-500/10', 'from-purple-500/10 to-pink-500/10'];
                  const borderColors = ['border-zinc-800', 'border-cyan-500/30', 'border-purple-500/30'];
                  
                  return (
                    <div 
                      key={index}
                      className={`${index > 0 ? `bg-gradient-to-br ${colors[index]}` : 'bg-zinc-900/40'} backdrop-blur-sm rounded-xl p-6 border ${borderColors[index]} text-center`}
                      style={{
                        opacity: reliabilityInView ? 1 : 0,
                        transform: reliabilityInView ? 'translateY(0)' : 'translateY(30px)',
                        transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${index * 100}ms`
                      }}
                    >
                      <h3 className="text-lg font-medium text-white mb-2">{tier.tier}</h3>
                      <div className={`text-4xl font-bold mb-2 ${
                        index === 0 ? 'text-zinc-400' : 
                        index === 1 ? 'bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent' :
                        'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'
                      }`}>
                        {tier.uptime}
                      </div>
                      <p className="text-xs text-zinc-500 mb-4">{tier.products}</p>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-zinc-400">{t('reliability.sla.mttr', 'MTTR')}</span>
                          <span className="text-white">{tier.mttr}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400">{t('reliability.sla.support', 'Support')}</span>
                          <span className="text-white">{tier.support}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400">{t('reliability.sla.credits', 'Crédits')}</span>
                          <span className="text-green-400">{tier.credits}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Redundancy & Metrics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
                  <h3 className="text-xl font-medium text-white mb-4">{t('reliability.redundancy.title', 'Redondance Infrastructure')}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-zinc-800/30 rounded-lg">
                      <span className="text-zinc-300">{t('reliability.redundancy.power', 'Alimentation')}</span>
                      <span className="text-white font-mono text-sm">{infrastructureData.reliability.redundancy.power}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-zinc-800/30 rounded-lg">
                      <span className="text-zinc-300">{t('reliability.redundancy.network', 'Réseau')}</span>
                      <span className="text-white font-mono text-sm">{infrastructureData.reliability.redundancy.network}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-zinc-800/30 rounded-lg">
                      <span className="text-zinc-300">{t('reliability.redundancy.cooling', 'Cooling')}</span>
                      <span className="text-white font-mono text-sm">{infrastructureData.reliability.redundancy.cooling}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-zinc-800/30 rounded-lg">
                      <span className="text-zinc-300">{t('reliability.redundancy.storage', 'Stockage')}</span>
                      <span className="text-white font-mono text-sm">{infrastructureData.reliability.redundancy.storage}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
                  <h3 className="text-xl font-medium text-white mb-4">{t('reliability.metrics.title', 'Métriques Réelles 2024')}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-zinc-800/30 rounded-lg">
                      <span className="text-zinc-300">{t('reliability.metrics.actualUptime', 'Uptime Réel')}</span>
                      <span className="text-green-400 font-mono text-sm">{infrastructureData.reliability.metrics2024.actualUptime}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-zinc-800/30 rounded-lg">
                      <span className="text-zinc-300">{t('reliability.metrics.majorIncidents', 'Incidents Majeurs')}</span>
                      <span className="text-white font-mono text-sm">{infrastructureData.reliability.metrics2024.incidents}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-zinc-800/30 rounded-lg">
                      <span className="text-zinc-300">{t('reliability.metrics.avgLatency', 'Latence Moyenne')}</span>
                      <span className="text-cyan-400 font-mono text-sm">{infrastructureData.reliability.metrics2024.avgLatency}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-zinc-800/30 rounded-lg">
                      <span className="text-zinc-300">{t('reliability.metrics.packetLoss', 'Packet Loss')}</span>
                      <span className="text-green-400 font-mono text-sm">{infrastructureData.reliability.metrics2024.packetLoss}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Stack Section */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div 
                ref={stackRef}
                className="text-center mb-12"
                style={{
                  opacity: stackInView ? 1 : 0,
                  transform: stackInView ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <Badge variant="outline" className="mb-4">
                  {t('stack.badge', 'Stack Technique')}
                </Badge>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-4">
                  {t('stack.title', 'Orchestration & Monitoring')}
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Orchestration */}
                <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
                  <WrenchScrewdriverIcon className="w-8 h-8 text-cyan-400 mb-4" />
                  <h3 className="text-lg font-medium text-white mb-4">{t('stack.orchestration.title', 'Orchestration')}</h3>
                  <div className="space-y-3">
                    {infrastructureData.stack.orchestration.map((tool, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-white font-medium">{tool.name}</span>
                        <span className="text-xs text-zinc-500">{tool.role}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Monitoring */}
                <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
                  <ChartBarIcon className="w-8 h-8 text-purple-400 mb-4" />
                  <h3 className="text-lg font-medium text-white mb-4">{t('stack.monitoring.title', 'Monitoring')}</h3>
                  <div className="space-y-3">
                    {infrastructureData.stack.monitoring.map((tool, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-white font-medium">{tool.name}</span>
                        <span className="text-xs text-zinc-500">{tool.role}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Automation */}
                <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
                  <BeakerIcon className="w-8 h-8 text-green-400 mb-4" />
                  <h3 className="text-lg font-medium text-white mb-4">{t('stack.automation.title', 'API & Automation')}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-300">{t('stack.automation.api', 'API')}</span>
                      <span className="text-white text-sm">{infrastructureData.stack.automation.api}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-300">{t('stack.automation.graphql', 'GraphQL')}</span>
                      <span className="text-white text-sm">{infrastructureData.stack.automation.graphql}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-300">{t('stack.automation.terraform', 'Terraform')}</span>
                      <span className="text-white text-sm">{infrastructureData.stack.automation.terraform}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-300">{t('stack.automation.cli', 'CLI')}</span>
                      <span className="text-white text-sm">{infrastructureData.stack.automation.cli}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-300">{t('stack.automation.webhooks', 'Webhooks')}</span>
                      <span className="text-white text-sm">{infrastructureData.stack.automation.webhooks}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Roadmap 2025 Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-zinc-900/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div 
                ref={roadmapRef}
                className="text-center mb-12"
                style={{
                  opacity: roadmapInView ? 1 : 0,
                  transform: roadmapInView ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <Badge variant="primary" className="mb-4">
                  {t('roadmap.badge', 'Roadmap 2025')}
                </Badge>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-4">
                  {t('roadmap.title', 'Évolution de la Plateforme')}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Q1 */}
                <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-white">{t('roadmap.q1.title', 'Q1 2025')}</h3>
                    <ClockIcon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start text-sm">
                      <span className="text-green-400 mr-2">✓</span>
                      <span className="text-zinc-300 line-through">
                        {t('roadmap.q1.networkUpgrade', 'Network upgrade Paris 100G')}
                      </span>
                    </div>
                    <div className="flex items-start text-sm">
                      <span className="text-green-400 mr-2">✓</span>
                      <span className="text-zinc-300 line-through">
                        {t('roadmap.q1.gpuDeployment', 'New A100 GPUs deployment')}
                      </span>
                    </div>
                    <div className="flex items-start text-sm">
                      <span className="text-yellow-400 mr-2">⏳</span>
                      <span className="text-white">
                        {t('roadmap.q1.apiDevelopment', 'API v2 development')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Q2 */}
                <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-white">{t('roadmap.q2.title', 'Q2 2025')}</h3>
                    <ClockIcon className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start text-sm">
                      <span className="text-zinc-500 mr-2">○</span>
                      <span className="text-zinc-400">
                        {t('roadmap.q2.madridLaunch', 'Madrid datacenter launch')}
                      </span>
                    </div>
                    <div className="flex items-start text-sm">
                      <span className="text-zinc-500 mr-2">○</span>
                      <span className="text-zinc-400">
                        {t('roadmap.q2.objectStorage', 'Object Storage S3 (MinIO)')}
                      </span>
                    </div>
                    <div className="flex items-start text-sm">
                      <span className="text-zinc-500 mr-2">○</span>
                      <span className="text-zinc-400">
                        {t('roadmap.q2.terraformProvider', 'Terraform provider')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Q3 */}
                <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-white">{t('roadmap.q3.title', 'Q3 2025')}</h3>
                    <ClockIcon className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start text-sm">
                      <span className="text-zinc-500 mr-2">○</span>
                      <span className="text-zinc-400">
                        {t('roadmap.q3.milanLaunch', 'Milan datacenter launch')}
                      </span>
                    </div>
                    <div className="flex items-start text-sm">
                      <span className="text-zinc-500 mr-2">○</span>
                      <span className="text-zinc-400">
                        {t('roadmap.q3.kubernetes', 'Kubernetes managed service')}
                      </span>
                    </div>
                    <div className="flex items-start text-sm">
                      <span className="text-zinc-500 mr-2">○</span>
                      <span className="text-zinc-400">
                        {t('roadmap.q3.isoCertification', 'ISO 27001 certification')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Q4 */}
                <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-white">{t('roadmap.q4.title', 'Q4 2025')}</h3>
                    <ClockIcon className="w-5 h-5 text-pink-400" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start text-sm">
                      <span className="text-zinc-500 mr-2">○</span>
                      <span className="text-zinc-400">
                        {t('roadmap.q4.multiRegion', 'Multi-region replication')}
                      </span>
                    </div>
                    <div className="flex items-start text-sm">
                      <span className="text-zinc-500 mr-2">○</span>
                      <span className="text-zinc-400">
                        {t('roadmap.q4.edgeComputing', 'Edge computing (CDN)')}
                      </span>
                    </div>
                    <div className="flex items-start text-sm">
                      <span className="text-zinc-500 mr-2">○</span>
                      <span className="text-zinc-400">
                        {t('roadmap.q4.quantumCrypto', 'Quantum-safe cryptography')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
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
                    href="/contact" 
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-4 rounded-xl font-medium hover:opacity-90 transition-opacity inline-block"
                  >
                    {t('cta.talkExpert', 'Parler à un Expert')}
                  </Link>
                  <Link 
                    href="/products" 
                    className="bg-zinc-800 text-white px-8 py-4 rounded-xl font-medium hover:bg-zinc-700 transition-colors inline-block"
                  >
                    {t('cta.exploreProducts', 'Explorer les Produits')}
                  </Link>
                  <Link 
                    href="/demo" 
                    className="bg-transparent text-white px-8 py-4 rounded-xl font-medium border border-zinc-600 hover:bg-zinc-800/50 transition-colors inline-block"
                  >
                    {t('cta.requestDemo', 'Demander une Démo')}
                  </Link>
                </div>
                
                <div className="mt-8 pt-8 border-t border-zinc-800">
                  <p className="text-sm text-zinc-500">
                    {t('cta.footer', 'Hackboot OÜ • Entreprise estonienne • Infrastructure 100% européenne')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}