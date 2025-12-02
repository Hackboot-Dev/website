// apps/web/app/[locale]/ads/login/page.tsx
// Description: Login page for ads admin area
// Last modified: 2025-11-30

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, ArrowRight, AlertCircle, Eye, EyeOff, Sparkles } from 'lucide-react';

export default function AdsLoginPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const locale = params.locale || 'fr';

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const t = locale === 'fr' ? {
    title: 'Ads Admin',
    subtitle: 'Entrez le mot de passe pour accéder',
    password: 'Mot de passe',
    passwordPlaceholder: 'Votre mot de passe',
    login: 'Se connecter',
    logging: 'Connexion...',
    errorMessage: 'Mot de passe incorrect',
    backHome: "← Retour à l'accueil"
  } : {
    title: 'Ads Admin',
    subtitle: 'Enter password to access',
    password: 'Password',
    passwordPlaceholder: 'Your password',
    login: 'Login',
    logging: 'Logging in...',
    errorMessage: 'Invalid password',
    backHome: '← Back to home'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ads/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (response.ok) {
        // Redirect to ads page
        router.push(`/${locale}/ads`);
        router.refresh();
      } else {
        setError(t.errorMessage);
        setIsLoading(false);
      }
    } catch {
      setError(t.errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="w-full max-w-md">
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-cyan-500/10 rounded-xl">
              <Sparkles className="w-8 h-8 text-cyan-400" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-light text-white mb-2">
              {t.title}
            </h1>
            <p className="text-zinc-400 text-sm">
              {t.subtitle}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">
                {t.password}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                  placeholder={t.passwordPlaceholder}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative group bg-gradient-to-r from-cyan-600 to-cyan-500 text-black py-3 px-6 rounded-lg font-medium hover:from-cyan-500 hover:to-cyan-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="flex items-center justify-center gap-2">
                {isLoading ? t.logging : t.login}
                {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </span>
            </button>
          </form>

          {/* Back link */}
          <div className="mt-6 pt-6 border-t border-zinc-800 text-center">
            <Link
              href={`/${locale}`}
              className="text-zinc-400 hover:text-zinc-300 transition-colors text-sm"
            >
              {t.backHome}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
