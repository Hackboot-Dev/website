// /workspaces/website/apps/web/app/[locale]/admin/settings/SettingsPageClient.tsx
// Description: Admin settings client component
// Last modified: 2025-01-10

'use client';

import { motion } from 'framer-motion';
import { Settings, Database, Bell, Shield, Palette, Globe } from 'lucide-react';

const settingsSections = [
  {
    id: 'database',
    title: 'Base de données',
    description: 'Configuration Supabase et cache',
    icon: Database,
    status: 'configured',
    items: [
      { label: 'Supabase URL', value: 'dxydeqzxjpohigqohwkm.supabase.co' },
      { label: 'Cache TTL', value: '5 minutes' },
    ],
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Alertes et emails',
    icon: Bell,
    status: 'coming_soon',
    items: [],
  },
  {
    id: 'security',
    title: 'Sécurité',
    description: 'Sessions et permissions',
    icon: Shield,
    status: 'coming_soon',
    items: [],
  },
  {
    id: 'appearance',
    title: 'Apparence',
    description: 'Thème et personnalisation',
    icon: Palette,
    status: 'coming_soon',
    items: [],
  },
  {
    id: 'localization',
    title: 'Localisation',
    description: 'Langue et devise',
    icon: Globe,
    status: 'configured',
    items: [
      { label: 'Langue par défaut', value: 'Français' },
      { label: 'Devise', value: 'EUR (€)' },
    ],
  },
];

export default function SettingsPageClient() {
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
          <Settings className="w-3.5 h-3.5" />
          Settings
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-5xl font-extralight tracking-tight text-white"
        >
          Paramètres
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-zinc-400 font-light max-w-xl"
        >
          Configuration du panneau d&apos;administration
        </motion.p>
      </div>

      {/* Settings Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {settingsSections.map((section, index) => {
          const Icon = section.icon;
          const isComingSoon = section.status === 'coming_soon';

          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className={`
                p-6 bg-zinc-900/20 border border-zinc-900
                ${isComingSoon ? 'opacity-60' : 'hover:border-zinc-800 hover:bg-zinc-900/40'}
                transition-all duration-300
              `}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-white/5 border border-zinc-800 rounded-lg flex items-center justify-center">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                {isComingSoon && (
                  <span className="px-2 py-1 text-[10px] uppercase tracking-wider bg-zinc-800 text-zinc-400 rounded">
                    Bientôt
                  </span>
                )}
                {section.status === 'configured' && (
                  <span className="px-2 py-1 text-[10px] uppercase tracking-wider bg-emerald-500/20 text-emerald-400 rounded">
                    Configuré
                  </span>
                )}
              </div>

              <h3 className="text-lg font-light text-white mb-2">{section.title}</h3>
              <p className="text-sm text-zinc-500 mb-4">{section.description}</p>

              {section.items.length > 0 && (
                <div className="space-y-2 pt-4 border-t border-zinc-800">
                  {section.items.map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-sm">
                      <span className="text-zinc-500">{item.label}</span>
                      <span className="text-zinc-300 font-mono text-xs">{item.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="p-6 bg-blue-500/5 border border-blue-900/30"
      >
        <p className="text-blue-400/80 text-sm font-light">
          <strong className="font-medium">Info :</strong> Les paramètres avancés seront disponibles dans une prochaine version.
          Pour modifier la configuration Supabase, éditez le fichier <code className="bg-blue-900/30 px-1 rounded">.env.local</code>.
        </p>
      </motion.div>
    </div>
  );
}
