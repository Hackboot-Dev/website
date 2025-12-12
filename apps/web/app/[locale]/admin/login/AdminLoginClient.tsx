// /workspaces/website/apps/web/app/[locale]/admin/login/AdminLoginClient.tsx
// Description: Admin login form component - Refined design matching site style
// Last modified: 2025-12-10
// Related docs: /docs/features/ADMIN_PANEL.md

// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Loader2, AlertCircle, Lock, User } from 'lucide-react';
import Header from '../../../../components/layout/Header';
import Footer from '../../../../components/layout/Footer';
import SophisticatedBackground from '../../../../components/animations/SophisticatedBackground';

export default function AdminLoginClient() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Redirect to admin dashboard
      router.push(`/${locale}/admin`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SophisticatedBackground />

      {/* Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04] z-[1] mix-blend-overlay"
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
             backgroundSize: '128px 128px'
           }} />

      <div className="min-h-screen bg-zinc-950 text-white selection:bg-zinc-700/50">
        <Header />

        <main className="relative min-h-screen flex items-center justify-center pt-20 pb-20 px-4">
          {/* Geometric accent */}
          <div className="absolute top-0 right-0 w-1/3 h-full pointer-events-none z-0 hidden lg:block">
            <div className="absolute top-32 right-16 w-px h-64 bg-gradient-to-b from-transparent via-zinc-800 to-transparent"></div>
            <div className="absolute top-32 right-32 w-16 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md relative z-10"
          >
            {/* Header */}
            <div className="text-center mb-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-white/5 border border-zinc-800 rounded-2xl mb-6"
              >
                <Shield className="h-7 w-7 text-white" />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-3xl font-extralight tracking-tight text-white mb-2"
              >
                Administration
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-zinc-500 text-sm font-light"
              >
                Accès réservé aux administrateurs VMCloud
              </motion.p>
            </div>

            {/* Login Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-zinc-900/20 border border-zinc-900 p-8"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-4 bg-red-500/5 border border-red-900/30 text-red-400 text-sm"
                  >
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {error}
                  </motion.div>
                )}

                {/* Username */}
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-zinc-500 mb-3">
                    Identifiant
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      autoComplete="username"
                      placeholder="Entrez votre identifiant"
                      className="w-full bg-zinc-900/50 border border-zinc-800 pl-12 pr-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors font-light"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-zinc-500 mb-3">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      placeholder="Entrez votre mot de passe"
                      className="w-full bg-zinc-900/50 border border-zinc-800 pl-12 pr-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors font-light"
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-white text-zinc-950 font-medium tracking-wide hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Connexion...
                    </>
                  ) : (
                    'Se connecter'
                  )}
                </button>
              </form>
            </motion.div>

            {/* Footer */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-center text-zinc-600 text-xs mt-8 tracking-wide"
            >
              Zone protégée. Accès non autorisé interdit.
            </motion.p>
          </motion.div>
        </main>

        <Footer />
      </div>
    </>
  );
}
