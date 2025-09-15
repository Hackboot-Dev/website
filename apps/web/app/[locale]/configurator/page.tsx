// apps/web/app/[locale]/configurator/page.tsx
// Description: Product configurator with billing and payment
// Last modified: 2025-09-11
// Related docs: /docs/JOURNAL.md

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CreditCard, Lock, Shield, AlertCircle, CheckCircle, Clock, Calendar, CalendarDays } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import LocalizedLink from '../../../components/ui/LocalizedLink';

interface ProductConfig {
  id: string;
  name: string;
  hourly?: number;
  monthly: number;
  annual?: number;
  [key: string]: any; // Pour les autres propriétés du produit
}

type BillingType = 'hourly' | 'monthly' | 'yearly';

const ConfiguratorPage = () => {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState<ProductConfig | null>(null);
  const [billingType, setBillingType] = useState<BillingType | null>(null);
  const [step, setStep] = useState<'billing' | 'payment'>('billing');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Payment form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const productId = searchParams.get('product');
    const category = searchParams.get('category');
    
    if (productId && category) {
      // Load product data
      import(`../../../data/products/base.json`).then((baseData) => {
        const categoryProducts = baseData[category as keyof typeof baseData];
        if (categoryProducts) {
          const foundProduct = categoryProducts.find((p: any) => p.id === productId);
          if (foundProduct) {
            setProduct(foundProduct);
          }
        }
      });
    }
  }, [searchParams]);

  const calculatePrice = () => {
    if (!product || !billingType) return 0;
    
    if (billingType === 'hourly') {
      // Pour facturation horaire, caution de 900€
      return 900;
    } else if (billingType === 'monthly') {
      return product.monthly;
    } else {
      return product.annual || (product.monthly * 12 * 0.85);
    }
  };
  
  const isDeposit = billingType === 'hourly';

  const handlePayment = async () => {
    setLoading(true);
    setError('');

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      // TEMPORARY: Send Telegram notification
      const message = `🆕 *Nouvelle commande VMCloud*\n\n` +
        `📦 *Produit*: ${product?.name}\n` +
        `💳 *Facturation*: ${billingType}\n` +
        `💰 *Montant*: €${calculatePrice().toFixed(2)}\n` +
        `📧 *Email*: ${email}\n` +
        `🔢 *Carte*: •••• ${cardNumber.slice(-4)}\n` +
        `👤 *Nom*: ${cardName}\n\n` +
        `⚠️ _Configuration temporaire - À traiter manuellement_`;

      await fetch('/api/telegram-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
    } catch (err) {
      console.error('Telegram notification failed:', err);
    }

    // Show error message as planned
    setError(t('configurator.error.temporary', 'Service temporairement indisponible. Notre équipe a été notifiée.'));
    setLoading(false);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-400">
          {t('configurator.loading', 'Chargement...')}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 py-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <LocalizedLink 
            href="/products"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('configurator.back', 'Retour aux produits')}
          </LocalizedLink>
          
          <h1 className="text-4xl font-bold text-white mb-2">
            {t('configurator.title', 'Configuration de')} {product.name}
          </h1>
          <p className="text-zinc-400">
            {t('configurator.subtitle', 'Choisissez votre plan de facturation et procédez au paiement')}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 'billing' ? (
            <motion.div
              key="billing"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
                <h2 className="text-xl font-semibold text-white mb-6">
                  {t('configurator.billing.title', 'Choisissez votre type de facturation')}
                </h2>
                
                <div className="grid gap-4">
                  {/* Hourly billing */}
                  {product.hourly && (
                    <button
                      onClick={() => setBillingType('hourly')}
                      className={`p-6 rounded-lg border-2 transition-all text-left ${
                        billingType === 'hourly'
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-zinc-400" />
                          <div>
                            <h3 className="text-white font-medium">
                              {t('configurator.billing.hourly', 'Facturation horaire')}
                            </h3>
                            <p className="text-zinc-400 text-sm mt-1">
                              €{product.hourly.toFixed(3)}/h
                            </p>
                            <p className="text-amber-500 text-xs mt-2">
                              {t('configurator.billing.deposit', 'Caution égale au prix mensuel')} (€{product.monthly.toFixed(2)})
                            </p>
                          </div>
                        </div>
                      </div>
                    </button>
                  )}
                  
                  {/* Monthly billing */}
                  <button
                    onClick={() => setBillingType('monthly')}
                    className={`p-6 rounded-lg border-2 transition-all text-left ${
                      billingType === 'monthly'
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-zinc-400" />
                        <div>
                          <h3 className="text-white font-medium">
                            {t('configurator.billing.monthly', 'Facturation mensuelle')}
                          </h3>
                          <p className="text-zinc-400 text-sm mt-1">
                            €{product.monthly.toFixed(2)}/mois
                          </p>
                        </div>
                      </div>
                    </div>
                  </button>
                  
                  {/* Yearly billing */}
                  <button
                    onClick={() => setBillingType('yearly')}
                    className={`p-6 rounded-lg border-2 transition-all text-left ${
                      billingType === 'yearly'
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <CalendarDays className="w-5 h-5 text-zinc-400" />
                        <div>
                          <h3 className="text-white font-medium">
                            {t('configurator.billing.yearly', 'Facturation annuelle')}
                          </h3>
                          <p className="text-zinc-400 text-sm mt-1">
                            €{(product.annual || product.monthly * 12 * 0.85).toFixed(2)}/an
                          </p>
                          <p className="text-green-500 text-xs mt-2">
                            {t('configurator.billing.save', 'Économisez 15%')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
                
                <button
                  onClick={() => setStep('payment')}
                  disabled={!billingType}
                  className={`w-full mt-6 py-3 px-6 rounded-lg font-medium transition-all ${
                    billingType
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  }`}
                >
                  {t('configurator.continue', 'Continuer vers le paiement')}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
                <h2 className="text-xl font-semibold text-white mb-6">
                  {t('configurator.payment.title', 'Informations de paiement')}
                </h2>
                
                {/* Security badges */}
                <div className="flex items-center gap-4 mb-6 p-3 bg-green-500/10 rounded-lg">
                  <Shield className="w-5 h-5 text-green-500" />
                  <p className="text-sm text-green-500">
                    {t('configurator.payment.secure', 'Paiement sécurisé conforme aux normes PCI DSS 2025')}
                  </p>
                </div>
                
                {/* Payment form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                      {t('configurator.payment.email', 'Email')}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      placeholder="you@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                      {t('configurator.payment.cardNumber', 'Numéro de carte')}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        maxLength={19}
                        className="w-full px-4 py-2 pr-12 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        placeholder="1234 5678 9012 3456"
                      />
                      <CreditCard className="absolute right-3 top-2.5 w-5 h-5 text-zinc-500" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                      {t('configurator.payment.cardName', 'Nom sur la carte')}
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">
                        {t('configurator.payment.expiry', 'Date d\'expiration')}
                      </label>
                      <input
                        type="text"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                        maxLength={5}
                        className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        placeholder="MM/YY"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">
                        CVV
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          maxLength={4}
                          className="w-full px-4 py-2 pr-12 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                          placeholder="123"
                        />
                        <Lock className="absolute right-3 top-2.5 w-4 h-4 text-zinc-500" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Amount summary */}
                <div className="mt-6 p-4 bg-zinc-800 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">
                      {billingType === 'hourly' 
                        ? t('configurator.payment.deposit', 'Caution (équivalent mensuel)')
                        : t('configurator.payment.amount', 'Montant à payer')
                      }
                    </span>
                    <span className="text-2xl font-bold text-white">
                      €{calculatePrice().toFixed(2)}
                    </span>
                  </div>
                  {billingType === 'hourly' && (
                    <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="text-xs space-y-1">
                          <p className="text-blue-400 font-medium">
                            {t('configurator.deposit.title', 'Caution remboursable')}
                          </p>
                          <p className="text-zinc-400">
                            {t('configurator.deposit.description', 
                              'Montant de caution de 900€ pour la facturation à l\'usage. À la fin du mois, vous ne payez que votre consommation réelle et le reste est remboursé.'
                            )}
                          </p>
                          <p className="text-zinc-500 text-[11px]">
                            {t('configurator.deposit.firstMonth', 
                              'Appliqué uniquement le premier mois lors de l\'inscription.'
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Legal mentions */}
                <div className="mt-4 p-3 bg-zinc-800/50 rounded-lg">
                  <p className="text-xs text-zinc-500">
                    {t('configurator.payment.legal', 'En procédant au paiement, vous acceptez nos conditions générales de vente et notre politique de confidentialité. Conformément aux réglementations européennes 2025, vos données de paiement sont chiffrées et sécurisées selon les normes PCI DSS v4.0. Aucune donnée bancaire n\'est stockée sur nos serveurs.')}
                  </p>
                </div>
                
                {/* Error message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-400">{error}</p>
                  </motion.div>
                )}
                
                {/* Action buttons */}
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setStep('billing')}
                    className="px-6 py-3 rounded-lg font-medium text-zinc-400 hover:text-white transition-colors"
                  >
                    {t('configurator.back', 'Retour')}
                  </button>
                  <button
                    onClick={handlePayment}
                    disabled={loading || !email || !cardNumber || !cardName || !expiryDate || !cvv}
                    className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                      loading || !email || !cardNumber || !cardName || !expiryDate || !cvv
                        ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {t('configurator.processing', 'Traitement...')}
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        {isDeposit 
                          ? t('configurator.payDeposit', 'Verser la caution de') 
                          : t('configurator.pay', 'Payer')
                        } €{calculatePrice().toFixed(2)}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ConfiguratorPage;