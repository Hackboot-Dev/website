// apps/web/app/[locale]/admin/catalogue/constants/index.ts
// Description: Catalogue module constants
// Last modified: 2025-12-19

import React from 'react';
import { Server, Cpu, Globe, Cloud, Network, HardDrive, Zap } from 'lucide-react';

// Category icons
export const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  vps: React.createElement(Server, { className: 'h-5 w-5' }),
  gpu: React.createElement(Cpu, { className: 'h-5 w-5' }),
  webhosting: React.createElement(Globe, { className: 'h-5 w-5' }),
  paas: React.createElement(Cloud, { className: 'h-5 w-5' }),
  loadbalancer: React.createElement(Network, { className: 'h-5 w-5' }),
  storage: React.createElement(HardDrive, { className: 'h-5 w-5' }),
  cdn: React.createElement(Zap, { className: 'h-5 w-5' }),
};

// Spec labels (French)
export const SPEC_LABELS: Record<string, string> = {
  vcpu: 'vCPU',
  ram: 'RAM',
  storage: 'Stockage',
  bandwidth: 'Bande passante',
  gpu: 'GPU',
  vram: 'VRAM',
  cuda_cores: 'CUDA Cores',
  tensor_cores: 'Tensor Cores',
  sites: 'Sites',
  databases: 'Bases de données',
  emails: 'Emails',
  ssl: 'SSL',
  backup: 'Backup',
  containers: 'Containers',
  auto_scaling: 'Auto-scaling',
  requests_per_sec: 'Requêtes/sec',
  protocols: 'Protocoles',
  health_checks: 'Health Checks',
  type: 'Type',
  iops: 'IOPS',
  throughput: 'Débit',
  redundancy: 'Redondance',
  min_size: 'Taille min',
  max_size: 'Taille max',
  pops: 'Points de présence',
  traffic_included: 'Trafic inclus',
  ddos_protection: 'Protection DDoS',
  waf: 'WAF',
  cache: 'Cache',
};

// Category order (as displayed on the website)
export const CATEGORY_ORDER = ['vps', 'gpu', 'webhosting', 'paas', 'loadbalancer', 'storage', 'cdn'] as const;

// Tier colors
export const TIER_COLORS: Record<string, string> = {
  starter: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  pro: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  business: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  enterprise: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  premium: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
};

// Base fields to exclude from specs
export const BASE_FIELDS = [
  'id',
  'name',
  'category',
  'tier',
  'monthly',
  'hourly',
  'annual',
  'price_per_gb_month',
  'technicalSections',
  'benchmarks',
  'security',
  'features',
  'useCases',
];

// Cache key and TTL
export const CATALOGUE_CACHE_KEY = 'catalogue_cache';
export const CATALOGUE_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
