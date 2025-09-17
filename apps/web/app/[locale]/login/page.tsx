'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import { Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

export default function LoginPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const t = language === 'fr' ? {
    title: 'Connexion',
    subtitle: 'Accédez à votre espace client VMCloud',
    email: 'Adresse email',
    emailPlaceholder: 'vous@exemple.com',
    password: 'Mot de passe',
    passwordPlaceholder: 'Votre mot de passe',
    forgotPassword: 'Mot de passe oublié ?',
    login: 'Se connecter',
    logging: 'Connexion...',
    noAccount: 'Pas encore de compte ?',
    register: 'Créer un compte',
    errorMessage: 'Compte inexistant - Utilisateur non trouvé',
    features: {
      title: 'Votre Dashboard VMCloud',
      items: [
        'Gérez vos serveurs VPS et GPU',
        'Monitorer vos ressources en temps réel',
        'Accès à l\'API complète',
        'Support prioritaire 24/7'
      ]
    }
  } : {
    title: 'Login',
    subtitle: 'Access your VMCloud dashboard',
    email: 'Email address',
    emailPlaceholder: 'you@example.com',
    password: 'Password',
    passwordPlaceholder: 'Your password',
    forgotPassword: 'Forgot password?',
    login: 'Sign in',
    logging: 'Signing in...',
    noAccount: 'Don\'t have an account?',
    register: 'Create account',
    errorMessage: 'Account does not exist - User not found',
    features: {
      title: 'Your VMCloud Dashboard',
      items: [
        'Manage your VPS and GPU servers',
        'Monitor resources in real-time',
        'Full API access',
        '24/7 priority support'
      ]
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Always show error for now as requested
    setError(t.errorMessage);
    setIsLoading(false);
  };

  return (
    <>
      <Header />

      <main className="relative min-h-screen bg-zinc-950 pt-20">
        {/* Animated background gradients */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="fixed inset-0 -z-10 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />

        <div className="relative z-10 flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-12">
          <div className="w-full max-w-5xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">

              {/* Left side - Login form */}
              <div className="order-2 lg:order-1">
                <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8 shadow-2xl">
                  <div className="mb-8">
                    <h1 className="text-3xl font-light text-white mb-2">
                      {t.title}
                    </h1>
                    <p className="text-zinc-400">
                      {t.subtitle}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
                        {t.email}
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                          placeholder={t.emailPlaceholder}
                          required
                        />
                      </div>
                    </div>

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
                          className="w-full pl-10 pr-12 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                          placeholder={t.passwordPlaceholder}
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

                    <div className="flex items-center justify-between">
                      <Link
                        href="/forgot-password"
                        className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        {t.forgotPassword}
                      </Link>
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
                      className="w-full relative group bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-500 hover:to-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="flex items-center justify-center gap-2">
                        {isLoading ? t.logging : t.login}
                        {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                      </span>
                    </button>
                  </form>

                  <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
                    <p className="text-zinc-400">
                      {t.noAccount}{' '}
                      <Link
                        href={`/${language}/products`}
                        className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                      >
                        {t.register}
                      </Link>
                    </p>
                  </div>
                </div>
              </div>

              {/* Right side - Features */}
              <div className="order-1 lg:order-2">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-light text-white mb-4">
                      {t.features.title}
                    </h2>
                    <ul className="space-y-3">
                      {t.features.items.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <div className="w-2 h-2 rounded-full bg-blue-400" />
                          </div>
                          <span className="text-zinc-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-sm text-green-400 font-medium">
                        {language === 'fr' ? 'Infrastructure disponible' : 'Infrastructure available'}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-sm">
                      {language === 'fr'
                        ? '3 datacenters • 99.99% uptime • Support 24/7'
                        : '3 datacenters • 99.99% uptime • 24/7 Support'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}