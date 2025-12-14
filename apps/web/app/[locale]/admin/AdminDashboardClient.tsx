// /workspaces/website/apps/web/app/[locale]/admin/AdminDashboardClient.tsx
// Description: Admin dashboard client component with overview cards - Mobile-first responsive design
// Last modified: 2025-12-14
// Related docs: /docs/features/ADMIN_PANEL.md

// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

'use client';

import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Users, Server, ArrowUpRight, Sparkles, Building2, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

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
    href: '/admin/settings',
    title: 'Settings',
    description: 'Configure admin panel and preferences',
    icon: Sparkles,
    color: 'zinc',
  },
];

const statsPlaceholder = [
  {
    label: 'Revenue (MTD)',
    value: '—',
    icon: DollarSign,
    color: 'emerald',
  },
  {
    label: 'Active Clients',
    value: '—',
    icon: Users,
    color: 'blue',
  },
  {
    label: 'Active Servers',
    value: '—',
    icon: Server,
    color: 'violet',
  },
  {
    label: 'Net Profit',
    value: '—',
    icon: TrendingUp,
    color: 'amber',
  },
];

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

export default function AdminDashboardClient() {
  const params = useParams();
  const locale = params.locale as string;

  return (
    <div className="space-y-6 md:space-y-12">
      {/* Header - More compact on mobile */}
      <div className="space-y-2 md:space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-2.5 md:px-3 py-1 rounded-full bg-zinc-900/50 border border-zinc-800 text-[10px] md:text-xs uppercase tracking-[0.2em] text-zinc-400"
        >
          <Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5" />
          Dashboard
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extralight tracking-tight text-white"
        >
          Administration
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm md:text-base text-zinc-400 font-light max-w-xl"
        >
          Vue d'ensemble des opérations et finances multi-sociétés
        </motion.p>
      </div>

      {/* Stats Grid - 2 columns on mobile for compact view */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4"
      >
        {statsPlaceholder.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="group p-3 md:p-6 bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/40 transition-all duration-300 rounded-xl md:rounded-none active:scale-[0.98]"
            >
              <div className="flex items-center justify-between mb-2 md:mb-4">
                <div className={`
                  w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg border bg-zinc-900/50
                  ${stat.color === 'emerald' ? 'border-emerald-900/30 text-emerald-500' : ''}
                  ${stat.color === 'blue' ? 'border-blue-900/30 text-blue-500' : ''}
                  ${stat.color === 'violet' ? 'border-violet-900/30 text-violet-500' : ''}
                  ${stat.color === 'amber' ? 'border-amber-900/30 text-amber-500' : ''}
                `}>
                  <Icon className="h-4 w-4 md:h-5 md:w-5" />
                </div>
              </div>
              <p className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-wider mb-1 md:mb-2 truncate">{stat.label}</p>
              <p className="text-xl md:text-3xl font-extralight text-white">{stat.value}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* P&L by Company */}
      <div className="space-y-3 md:space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center gap-3 md:gap-4"
        >
          <h2 className="text-base md:text-xl font-extralight text-white whitespace-nowrap">P&L par société</h2>
          <div className="flex-1 h-px bg-zinc-800" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6"
        >
          {companies.map((company) => (
            <motion.div key={company.id} variants={itemVariants}>
              <Link
                href={`/${locale}${company.href}`}
                className={`
                  group block p-4 md:p-6 bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/40 transition-all duration-300 rounded-xl md:rounded-none active:scale-[0.98]
                  ${company.color === 'violet' ? 'hover:border-violet-900/50' : ''}
                  ${company.color === 'emerald' ? 'hover:border-emerald-900/50' : ''}
                `}
              >
                <div className="flex items-start justify-between mb-3 md:mb-4">
                  <div className={`
                    w-10 h-10 md:w-12 md:h-12 border rounded-lg flex items-center justify-center transition-colors
                    ${company.color === 'violet' ? 'bg-violet-500/10 border-violet-900/30 text-violet-400 group-hover:border-violet-700' : ''}
                    ${company.color === 'emerald' ? 'bg-emerald-500/10 border-emerald-900/30 text-emerald-400 group-hover:border-emerald-700' : ''}
                  `}>
                    <Building2 className="h-4 w-4 md:h-5 md:w-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-zinc-600 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <div className="flex items-center gap-2 md:gap-3 mb-1.5 md:mb-2">
                  <h3 className="text-base md:text-lg font-light text-white group-hover:text-zinc-200 transition-colors">
                    {company.name}
                  </h3>
                  <div className={`
                    px-1.5 md:px-2 py-0.5 text-[9px] md:text-[10px] uppercase tracking-wider font-medium rounded
                    ${company.color === 'violet' ? 'bg-violet-500/20 text-violet-400' : ''}
                    ${company.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' : ''}
                  `}>
                    P&L
                  </div>
                </div>
                <p className="text-xs md:text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors">
                  {company.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Quick Access */}
      <div className="space-y-3 md:space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex items-center gap-3 md:gap-4"
        >
          <h2 className="text-base md:text-xl font-extralight text-white whitespace-nowrap">Accès rapide</h2>
          <div className="flex-1 h-px bg-zinc-800" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6"
        >
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <motion.div key={link.href} variants={itemVariants}>
                <Link
                  href={`/${locale}${link.href}`}
                  className="group block p-4 md:p-6 bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/40 transition-all duration-300 rounded-xl md:rounded-none active:scale-[0.98]"
                >
                  <div className="flex items-start justify-between mb-3 md:mb-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/5 border border-zinc-800 rounded-lg flex items-center justify-center group-hover:border-zinc-700 transition-colors">
                      <Icon className="h-4 w-4 md:h-5 md:w-5 text-white" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-zinc-600 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                  <h3 className="text-base md:text-lg font-light text-white mb-1.5 md:mb-2 group-hover:text-zinc-200 transition-colors">
                    {link.title}
                  </h3>
                  <p className="text-xs md:text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors">
                    {link.description}
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Notice - More compact on mobile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="p-4 md:p-6 bg-amber-500/5 border border-amber-900/30 rounded-xl md:rounded-none"
      >
        <p className="text-amber-400/80 text-xs md:text-sm font-light">
          <strong className="font-medium">Note :</strong> Chaque société dispose de sa propre base de données Firebase.
          Les données P&L sont isolées par entreprise.
        </p>
      </motion.div>
    </div>
  );
}
