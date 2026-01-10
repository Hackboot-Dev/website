// /workspaces/website/apps/web/app/[locale]/admin/AdminDashboardClient.tsx
// Description: Admin dashboard client component with overview cards, forecasting, YoY/MoM comparisons
// Last modified: 2026-01-10
// Related docs: /docs/features/ADMIN_PANEL.md

// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

'use client';

import { motion } from 'framer-motion';
import {
  TrendingUp,
  DollarSign,
  Users,
  Server,
  ArrowUpRight,
  Sparkles,
  Building2,
  UserPlus,
  RefreshCw,
  Target,
  AlertTriangle,
  AlertCircle,
  Calendar,
  LineChart,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useDashboardStats } from './hooks/useDashboardStats';

const companies = [
  {
    id: 'hackboot',
    name: 'Hackboot',
    description: 'Formation et services tech',
    href: '/admin/pnl/hackboot',
    color: 'violet',
  },
  {
    id: 'vmcloud',
    name: 'VMCloud',
    description: 'Infrastructure cloud et VPS',
    href: '/admin/pnl/vmcloud',
    color: 'emerald',
  },
];

const quickLinks = [
  {
    href: '/admin/clients',
    title: 'Clients',
    description: 'Gérer les clients et prospects VMCloud',
    icon: UserPlus,
    color: 'blue',
  },
  {
    href: '/admin/objectives',
    title: 'Objectifs',
    description: 'Suivre les objectifs et gérer les alertes',
    icon: Target,
    color: 'emerald',
  },
  {
    href: '/admin/settings',
    title: 'Settings',
    description: 'Configure admin panel and preferences',
    icon: Sparkles,
    color: 'zinc',
  },
];

// Stats are now fetched from Supabase via useDashboardStats hook

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
} as const;

// Format currency
const formatCurrency = (amount: number): string => {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M€`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}k€`;
  }
  return `${amount.toFixed(0)}€`;
};

export default function AdminDashboardClient() {
  const params = useParams();
  const locale = params.locale as string;
  const stats = useDashboardStats();

  // Build stats array from real data
  const statsData = [
    {
      label: 'Revenue (MTD)',
      value: stats.loading ? '...' : formatCurrency(stats.revenueMTD),
      change: stats.revenueChange,
      icon: DollarSign,
      color: 'emerald',
    },
    {
      label: 'Clients actifs',
      value: stats.loading ? '...' : stats.activeClients.toString(),
      change: stats.clientsChange,
      icon: Users,
      color: 'blue',
    },
    {
      label: 'Abonnements',
      value: stats.loading ? '...' : stats.activeSubscriptions.toString(),
      change: stats.subscriptionsChange,
      icon: Server,
      color: 'violet',
    },
    {
      label: 'MRR',
      value: stats.loading ? '...' : formatCurrency(stats.mrr),
      change: stats.mrrChange,
      icon: TrendingUp,
      color: 'amber',
    },
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/50 border border-zinc-800 text-xs uppercase tracking-[0.2em] text-zinc-400"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Dashboard
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-5xl font-extralight tracking-tight text-white"
        >
          Administration
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-zinc-400 font-light max-w-xl"
        >
          Vue d'ensemble des opérations et finances multi-sociétés
        </motion.p>
      </div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {statsData.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="group p-6 bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/40 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`
                  w-10 h-10 flex items-center justify-center rounded-lg border bg-zinc-900/50
                  ${stat.color === 'emerald' ? 'border-emerald-900/30 text-emerald-500' : ''}
                  ${stat.color === 'blue' ? 'border-blue-900/30 text-blue-500' : ''}
                  ${stat.color === 'violet' ? 'border-violet-900/30 text-violet-500' : ''}
                  ${stat.color === 'amber' ? 'border-amber-900/30 text-amber-500' : ''}
                `}>
                  {stats.loading ? (
                    <RefreshCw className="h-5 w-5 animate-spin" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                {stat.change !== 0 && !stats.loading && (
                  <span className={`text-xs font-medium ${stat.change > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {stat.change > 0 ? '+' : ''}{stat.change.toFixed(1)}%
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">{stat.label}</p>
              <p className="text-3xl font-extralight text-white">{stat.value}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* YoY Comparison + Alerts Summary Row */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {/* YoY Comparison Card */}
        <motion.div
          variants={itemVariants}
          className="p-6 bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/40 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg border bg-zinc-900/50 border-blue-900/30 text-blue-500">
              <Calendar className="h-5 w-5" />
            </div>
            {!stats.loading && stats.revenueYoYChange !== 0 && (
              <span className={`text-xs font-medium ${stats.revenueYoYChange > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {stats.revenueYoYChange > 0 ? '+' : ''}{stats.revenueYoYChange.toFixed(1)}% YoY
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Revenue YTD</p>
          <p className="text-3xl font-extralight text-white mb-2">
            {stats.loading ? '...' : formatCurrency(stats.revenueYTD)}
          </p>
          <p className="text-xs text-zinc-500">
            vs {stats.loading ? '...' : formatCurrency(stats.revenueYTDLastYear)} l'an dernier
          </p>
        </motion.div>

        {/* MRR Forecast Card */}
        <motion.div
          variants={itemVariants}
          className="p-6 bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/40 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg border bg-zinc-900/50 border-violet-900/30 text-violet-500">
              <LineChart className="h-5 w-5" />
            </div>
            {!stats.loading && stats.mrrGrowthRate !== 0 && (
              <span className={`text-xs font-medium ${stats.mrrGrowthRate > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {stats.mrrGrowthRate > 0 ? '+' : ''}{stats.mrrGrowthRate.toFixed(1)}%/mois
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">MRR Forecast (12 mois)</p>
          <p className="text-3xl font-extralight text-white mb-2">
            {stats.loading ? '...' : formatCurrency(stats.mrrForecast12Months)}
          </p>
          <div className="flex items-center gap-4 text-xs text-zinc-500">
            <span>3m: {stats.loading ? '...' : formatCurrency(stats.mrrForecast3Months)}</span>
            <span>6m: {stats.loading ? '...' : formatCurrency(stats.mrrForecast6Months)}</span>
          </div>
        </motion.div>

        {/* Alerts Summary Card */}
        <motion.div
          variants={itemVariants}
          className="p-6 bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/40 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg border bg-zinc-900/50 border-amber-900/30 text-amber-500">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <Link
              href={`/${locale}/admin/objectives`}
              className="text-xs text-zinc-500 hover:text-white transition-colors"
            >
              Voir tout
            </Link>
          </div>
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Alertes</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <span className="text-2xl font-extralight text-white">
                {stats.loading ? '...' : stats.alertsCritical}
              </span>
              <span className="text-xs text-zinc-500">critiques</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-400" />
              <span className="text-2xl font-extralight text-white">
                {stats.loading ? '...' : stats.alertsWarning}
              </span>
              <span className="text-xs text-zinc-500">attention</span>
            </div>
          </div>
          {/* Objectives summary */}
          <div className="mt-4 pt-4 border-t border-zinc-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-emerald-400" />
                <span className="text-xs text-zinc-500">Objectifs atteints</span>
              </div>
              <span className="text-sm text-white">
                {stats.loading ? '...' : `${stats.objectivesAchieved}/${stats.objectivesTotal}`}
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* P&L by Company */}
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center gap-4"
        >
          <h2 className="text-xl font-extralight text-white">P&L par société</h2>
          <div className="flex-1 h-px bg-zinc-800" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {companies.map((company) => (
            <motion.div key={company.id} variants={itemVariants}>
              <Link
                href={`/${locale}${company.href}`}
                className={`
                  group block p-6 bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/40 transition-all duration-300
                  ${company.color === 'violet' ? 'hover:border-violet-900/50' : ''}
                  ${company.color === 'emerald' ? 'hover:border-emerald-900/50' : ''}
                `}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`
                    w-12 h-12 border rounded-lg flex items-center justify-center transition-colors
                    ${company.color === 'violet' ? 'bg-violet-500/10 border-violet-900/30 text-violet-400 group-hover:border-violet-700' : ''}
                    ${company.color === 'emerald' ? 'bg-emerald-500/10 border-emerald-900/30 text-emerald-400 group-hover:border-emerald-700' : ''}
                  `}>
                    <Building2 className="h-5 w-5" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-zinc-600 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-light text-white group-hover:text-zinc-200 transition-colors">
                    {company.name}
                  </h3>
                  <div className={`
                    px-2 py-0.5 text-[10px] uppercase tracking-wider font-medium
                    ${company.color === 'violet' ? 'bg-violet-500/20 text-violet-400' : ''}
                    ${company.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' : ''}
                  `}>
                    P&L
                  </div>
                </div>
                <p className="text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors">
                  {company.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Quick Access */}
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex items-center gap-4"
        >
          <h2 className="text-xl font-extralight text-white">Accès rapide</h2>
          <div className="flex-1 h-px bg-zinc-800" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <motion.div key={link.href} variants={itemVariants}>
                <Link
                  href={`/${locale}${link.href}`}
                  className={`
                    group block p-6 bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/40 transition-all duration-300
                    ${link.color === 'emerald' ? 'hover:border-emerald-900/50' : ''}
                  `}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`
                      w-12 h-12 border rounded-lg flex items-center justify-center group-hover:border-zinc-700 transition-colors
                      ${link.color === 'emerald' ? 'bg-emerald-500/10 border-emerald-900/30 text-emerald-400' : 'bg-white/5 border-zinc-800 text-white'}
                      ${link.color === 'blue' ? 'bg-blue-500/10 border-blue-900/30 text-blue-400' : ''}
                    `}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-zinc-600 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                  <h3 className="text-lg font-light text-white mb-2 group-hover:text-zinc-200 transition-colors">
                    {link.title}
                  </h3>
                  <p className="text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors">
                    {link.description}
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="p-6 bg-emerald-500/5 border border-emerald-900/30"
      >
        <p className="text-emerald-400/80 text-sm font-light">
          <strong className="font-medium">Données temps réel :</strong> KPIs depuis Supabase avec comparaisons YoY/MoM.
          Forecasting MRR basé sur le taux de croissance mensuel moyen des 3 derniers mois.
        </p>
      </motion.div>
    </div>
  );
}
