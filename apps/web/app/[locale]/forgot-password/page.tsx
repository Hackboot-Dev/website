'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import { Mail, ArrowLeft, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

export default function ForgotPasswordPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const t = language === 'fr' ? {
    title: 'Mot de passe oublié',
    subtitle: 'Réinitialisez votre mot de passe VMCloud',
    description: 'Entrez votre adresse email et nous vous enverrons les instructions pour réinitialiser votre mot de passe.',
    email: 'Adresse email',
    emailPlaceholder: 'vous@exemple.com',
    submit: 'Envoyer les instructions',
    submitting: 'Envoi en cours...',
    backToLogin: 'Retour à la connexion',
    errorMessage: 'Compte inexistant - Aucune adresse email associée',
    successTitle: 'Email envoyé !',
    successMessage: 'Si un compte existe avec cette adresse, vous recevrez un email avec les instructions de réinitialisation.',
    checkEmail: 'Vérifiez votre boîte de réception',
    didntReceive: 'Email non reçu ?',
    resend: 'Renvoyer l\'email',
    tips: {
      title: 'Conseils de sécurité',
      items: [
        'Utilisez un mot de passe unique pour chaque service',
        'Minimum 12 caractères avec majuscules, minuscules et chiffres',
        'Activez l\'authentification à deux facteurs',
        'Ne partagez jamais vos identifiants'
      ]
    }
  } : {
    title: 'Forgot Password',
    subtitle: 'Reset your VMCloud password',
    description: 'Enter your email address and we\'ll send you instructions to reset your password.',
    email: 'Email address',
    emailPlaceholder: 'you@example.com',
    submit: 'Send instructions',
    submitting: 'Sending...',
    backToLogin: 'Back to login',
    errorMessage: 'Account does not exist - No email address associated',
    successTitle: 'Email sent!',
    successMessage: 'If an account exists with this email, you will receive reset instructions.',
    checkEmail: 'Check your inbox',
    didntReceive: 'Didn\'t receive email?',
    resend: 'Resend email',
    tips: {
      title: 'Security Tips',
      items: [
        'Use a unique password for each service',
        'Minimum 12 characters with uppercase, lowercase and numbers',
        'Enable two-factor authentication',
        'Never share your credentials'
      ]
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Always show error for now as requested - account doesn't exist
    setError(t.errorMessage);
    setIsLoading(false);
    // Don't show success message - account doesn't exist so no email sent
  };

  const handleResend = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setError(t.errorMessage);
  };

  return (
    <>
      <Header />

      <main className="relative min-h-screen bg-zinc-950 pt-20">
        {/* Animated background gradients */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700" />
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

              {/* Left side - Form */}
              <div className="order-2 lg:order-1">
                {!isSubmitted ? (
                  <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8 shadow-2xl">
                    <Link
                      href={`/${language}/login`}
                      className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      {t.backToLogin}
                    </Link>

                    <div className="mb-8">
                      <h1 className="text-3xl font-light text-white mb-2">
                        {t.title}
                      </h1>
                      <p className="text-zinc-400">
                        {t.subtitle}
                      </p>
                    </div>

                    <p className="text-zinc-300 mb-6">
                      {t.description}
                    </p>

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
                            autoFocus
                          />
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
                        className="w-full relative group bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-500 hover:to-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="flex items-center justify-center gap-2">
                          {isLoading ? t.submitting : t.submit}
                          {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                        </span>
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8 shadow-2xl">
                    <div className="text-center space-y-6">
                      <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="w-8 h-8 text-green-400" />
                      </div>

                      <div>
                        <h2 className="text-2xl font-light text-white mb-2">
                          {t.successTitle}
                        </h2>
                        <p className="text-zinc-400">
                          {t.successMessage}
                        </p>
                      </div>

                      <div className="p-4 bg-zinc-800/30 rounded-lg">
                        <p className="text-zinc-300 text-sm">
                          {t.checkEmail}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <p className="text-zinc-500 text-sm">
                          {t.didntReceive}
                        </p>
                        <button
                          onClick={handleResend}
                          disabled={isLoading}
                          className="text-blue-400 hover:text-blue-300 transition-colors font-medium disabled:opacity-50"
                        >
                          {t.resend}
                        </button>
                      </div>

                      <Link
                        href={`/${language}/login`}
                        className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        {t.backToLogin}
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Right side - Security tips */}
              <div className="order-1 lg:order-2">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-light text-white mb-4">
                      {t.tips.title}
                    </h2>
                    <ul className="space-y-3">
                      {t.tips.items.map((item, index) => (
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
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-white font-medium mb-2">
                          {language === 'fr' ? 'Besoin d\'aide ?' : 'Need help?'}
                        </h3>
                        <p className="text-zinc-400 text-sm">
                          {language === 'fr'
                            ? 'Notre équipe support est disponible 24/7 pour vous aider avec votre compte.'
                            : 'Our support team is available 24/7 to help you with your account.'
                          }
                        </p>
                      </div>
                      <Link
                        href={`/${language}/support`}
                        className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
                      >
                        {language === 'fr' ? 'Contacter le support' : 'Contact support'}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <p className="text-yellow-400 text-sm">
                      <strong>{language === 'fr' ? 'Attention :' : 'Warning:'}</strong>{' '}
                      {language === 'fr'
                        ? 'VMCloud ne vous demandera jamais votre mot de passe par email ou téléphone.'
                        : 'VMCloud will never ask for your password via email or phone.'
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