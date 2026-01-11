// /workspaces/website/apps/web/app/[locale]/admin/pnl/components/TransactionsModal.tsx
// Description: Transaction management modal component - extracted from PnLPageClient
// Last modified: 2024-12-14
// Status: Integrated with subscription support

'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Minus,
  X,
  Users,
  Package,
  Percent,
  ChevronDown,
  Trash2,
  Search,
  UserPlus,
  Shuffle,
  Loader2,
  Check,
  Calendar,
} from 'lucide-react';
import { generateRandomClient, type GeneratedClient } from '../../../../../lib/utils/clientGenerator';
import type { Client } from '../../../../../lib/types/database';
import type { Product, Transaction, ClientSelectionMode, SubscriptionCycle, CreateSubscriptionData } from '../types';
import { MONTHS, formatCurrency } from '../types';

// ============================================================
// TYPES
// ============================================================

type TransactionsModalProps = {
  // Modal state
  isOpen: boolean;
  catId: string;
  catLabel: string;
  product: Product;
  selectedMonth: number;
  selectedYear: number;
  currentMonthKey: string;
  companyId: 'vmcloud' | 'hackboot';

  // Client data
  clients: Client[];
  loadingClients: boolean;

  // Callbacks
  onClose: () => void;
  onAddTransaction: (
    catId: string,
    productId: string,
    month: string,
    transactions: Transaction[]
  ) => void;
  onDeleteTransaction: (
    catId: string,
    productId: string,
    month: string,
    txId: string
  ) => void;
  onCreateClient: (clientData: GeneratedClient) => Promise<Client>;
  onUpdateClientStats: (clientId: string, amount: number) => Promise<void>;
  onCreateSubscription?: (data: CreateSubscriptionData) => Promise<void>;

  // Helpers
  getTransactionsCount: (product: Product, month: string) => number;
  getTransactionsRevenue: (product: Product, month: string) => number;
};

// ============================================================
// COMPONENT
// ============================================================

export function TransactionsModal({
  isOpen,
  catId,
  catLabel,
  product,
  selectedMonth,
  selectedYear,
  currentMonthKey,
  companyId,
  clients,
  loadingClients,
  onClose,
  onAddTransaction,
  onDeleteTransaction,
  onCreateClient,
  onUpdateClientStats,
  onCreateSubscription,
  getTransactionsCount,
  getTransactionsRevenue,
}: TransactionsModalProps) {
  // Client selection state
  const [clientSelectionMode, setClientSelectionMode] = useState<ClientSelectionMode>('generate');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [clientSearchQuery, setClientSearchQuery] = useState('');
  const [generatedClientPreview, setGeneratedClientPreview] = useState<GeneratedClient | null>(null);

  // Manual client creation
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientCountry, setNewClientCountry] = useState('FR');
  const [newClientType, setNewClientType] = useState<'individual' | 'business'>('individual');
  const [emailError, setEmailError] = useState<string | null>(null);

  // Transaction state
  const [txCounter, setTxCounter] = useState(1);
  const [openAccordions, setOpenAccordions] = useState<string[]>([]);

  // Discount state
  const [discountAmount, setDiscountAmount] = useState('');
  const [discountNote, setDiscountNote] = useState('');
  const [activeDiscount, setActiveDiscount] = useState<{ amount: number; note: string } | null>(null);

  // Subscription state
  const [isRecurring, setIsRecurring] = useState(false);
  const [subscriptionCycle, setSubscriptionCycle] = useState<SubscriptionCycle>('monthly');

  // Bulk selection state
  const [selectedTxIds, setSelectedTxIds] = useState<Set<string>>(new Set());

  // Loading state for submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState({ current: 0, total: 0 });

  // Generate initial client preview
  useEffect(() => {
    if (isOpen && !generatedClientPreview) {
      setGeneratedClientPreview(generateRandomClient());
    }
  }, [isOpen, generatedClientPreview]);

  // Reset state on close
  const handleClose = () => {
    setClientSelectionMode('generate');
    setSelectedClientId(null);
    setClientSearchQuery('');
    setNewClientName('');
    setNewClientEmail('');
    setNewClientPhone('');
    setNewClientCountry('FR');
    setNewClientType('individual');
    setEmailError(null);
    setDiscountAmount('');
    setDiscountNote('');
    setActiveDiscount(null);
    setTxCounter(1);
    setIsRecurring(false);
    setSubscriptionCycle('monthly');
    setSelectedTxIds(new Set());
    onClose();
  };

  // Bulk selection helpers
  const transactions = product.transactions?.[currentMonthKey] || [];
  const allSelected = transactions.length > 0 && selectedTxIds.size === transactions.length;
  const someSelected = selectedTxIds.size > 0;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedTxIds(new Set());
    } else {
      setSelectedTxIds(new Set(transactions.map(tx => tx.id)));
    }
  };

  const toggleSelectTx = (txId: string) => {
    const newSet = new Set(selectedTxIds);
    if (newSet.has(txId)) {
      newSet.delete(txId);
    } else {
      newSet.add(txId);
    }
    setSelectedTxIds(newSet);
  };

  const handleBulkDelete = () => {
    if (selectedTxIds.size === 0) return;
    selectedTxIds.forEach(txId => {
      onDeleteTransaction(catId, product.id, currentMonthKey, txId);
    });
    setSelectedTxIds(new Set());
  };

  // Get start date for subscription (1st of current selected month/year)
  const getSubscriptionStartDate = (): string => {
    const monthIndex = selectedMonth;
    const date = new Date(selectedYear, monthIndex, 1);
    return date.toISOString().split('T')[0];
  };

  // Handle add transactions
  const handleAddTransactions = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitProgress({ current: 0, total: txCounter });

    try {
      const finalPrice = activeDiscount
        ? product.price - activeDiscount.amount
        : product.price;

      // Get client info based on selection mode
      let clientInfo: { id: string; name: string; email?: string };

      if (clientSelectionMode === 'existing' && selectedClientId) {
        const client = clients.find(c => c.id === selectedClientId);
        if (!client) return;
        clientInfo = { id: client.id, name: client.name, email: client.email };
      } else if (clientSelectionMode === 'create' && newClientName && newClientEmail) {
        const manualClient: GeneratedClient = {
          id: `cli_${Date.now().toString(36)}${Math.random().toString(36).substring(2, 8)}`,
          name: newClientName.trim(),
          email: newClientEmail.trim().toLowerCase(),
          phone: newClientPhone?.trim() || '',
          type: newClientType,
          isGenerated: false,
          generatedAt: new Date().toISOString(),
          country: newClientCountry,
        };
        const newClient = await onCreateClient(manualClient);
        clientInfo = { id: newClient.id, name: newClient.name, email: newClient.email };
        setNewClientName('');
        setNewClientEmail('');
        setNewClientPhone('');
        setNewClientCountry('FR');
        setNewClientType('individual');
      } else if (clientSelectionMode === 'generate' && generatedClientPreview) {
        // Special case: multiple transactions with generate = multiple random clients
        if (txCounter > 1) {
          const newTxs: Transaction[] = [];
          for (let i = 0; i < txCounter; i++) {
            setSubmitProgress({ current: i + 1, total: txCounter });

            const randomClient = generateRandomClient(generatedClientPreview.type);
            const newClient = await onCreateClient(randomClient);

            // Create subscription for each client if recurring is enabled
            if (isRecurring && onCreateSubscription) {
              const subscriptionData: CreateSubscriptionData = {
                companyId,
                clientId: newClient.id,
                clientName: newClient.name,
                clientEmail: newClient.email,
                productCategoryId: catId,
                productCategoryLabel: catLabel,
                productId: product.id,
                productLabel: product.label,
                amount: product.price,
                discount: activeDiscount?.amount,
                cycle: subscriptionCycle,
                startDate: getSubscriptionStartDate(),
                note: activeDiscount?.note || `Abonnement ${subscriptionCycle === 'monthly' ? 'mensuel' : 'annuel'} - ${product.label}`,
              };
              await onCreateSubscription(subscriptionData);
            }

            const tx: Transaction = {
              id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 11)}_${i}`,
              amount: finalPrice,
              isCustom: !!activeDiscount,
              discount: activeDiscount?.amount,
              note: activeDiscount?.note,
              clientId: newClient.id,
              clientName: newClient.name,
              clientEmail: newClient.email,
              isRecurring: isRecurring,
            };
            newTxs.push(tx);
            await onUpdateClientStats(newClient.id, finalPrice);
          }
          onAddTransaction(catId, product.id, currentMonthKey, newTxs);
          setTxCounter(1);
          if (isRecurring) {
            setIsRecurring(false);
            setSubscriptionCycle('monthly');
          }
          setGeneratedClientPreview(generateRandomClient(generatedClientPreview.type));
          return;
        }

        const newClient = await onCreateClient(generatedClientPreview);
        clientInfo = { id: newClient.id, name: newClient.name, email: newClient.email };
        setGeneratedClientPreview(generateRandomClient(generatedClientPreview.type));
      } else {
        return;
      }

      // Create subscription if recurring is enabled (single client case)
      if (isRecurring && onCreateSubscription) {
        const subscriptionData: CreateSubscriptionData = {
          companyId,
          clientId: clientInfo.id,
          clientName: clientInfo.name,
          clientEmail: clientInfo.email,
          productCategoryId: catId,
          productCategoryLabel: catLabel,
          productId: product.id,
          productLabel: product.label,
          amount: product.price,
          discount: activeDiscount?.amount,
          cycle: subscriptionCycle,
          startDate: getSubscriptionStartDate(),
          note: activeDiscount?.note || `Abonnement ${subscriptionCycle === 'monthly' ? 'mensuel' : 'annuel'} - ${product.label}`,
        };
        await onCreateSubscription(subscriptionData);
      }

      // Create transactions
      const newTxs: Transaction[] = Array.from({ length: txCounter }, () => ({
        id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
        amount: finalPrice,
        isCustom: !!activeDiscount,
        discount: activeDiscount?.amount,
        note: activeDiscount?.note,
        clientId: clientInfo.id,
        clientName: clientInfo.name,
        clientEmail: clientInfo.email,
        isRecurring: isRecurring,
      }));

      onAddTransaction(catId, product.id, currentMonthKey, newTxs);
      await onUpdateClientStats(clientInfo.id, finalPrice * txCounter);
      setTxCounter(1);
      if (isRecurring) {
        setIsRecurring(false);
        setSubscriptionCycle('monthly');
      }
    } finally {
      setIsSubmitting(false);
      setSubmitProgress({ current: 0, total: 0 });
    }
  };

  if (!isOpen || typeof window === 'undefined') return null;

  const filteredClients = clients.filter(c =>
    !clientSearchQuery ||
    c.name.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(clientSearchQuery.toLowerCase())
  );

  const isAddDisabled =
    (clientSelectionMode === 'existing' && !selectedClientId) ||
    (clientSelectionMode === 'create' && (!newClientName || !newClientEmail || emailError !== null));

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div className="h-full w-full flex items-stretch">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full bg-zinc-950 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 flex-shrink-0">
            <div className="flex items-center gap-6">
              <div>
                <h2 className="text-lg font-medium text-white">{product.label}</h2>
                <p className="text-sm text-zinc-500">{MONTHS[selectedMonth]} {selectedYear}</p>
              </div>
              <div className="flex items-center gap-6 pl-6 border-l border-zinc-800">
                <div className="text-center">
                  <p className="text-xl font-light text-white">{getTransactionsCount(product, currentMonthKey)}</p>
                  <p className="text-xs text-zinc-500">ventes</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-light text-emerald-400">{formatCurrency(getTransactionsRevenue(product, currentMonthKey))}</p>
                  <p className="text-xs text-zinc-500">revenue</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-light text-zinc-400">{formatCurrency(product.price)}</p>
                  <p className="text-xs text-zinc-500">/ unité</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content - 2 columns */}
          <div className="flex-1 overflow-hidden flex">
            {/* Left: Nouvelle vente */}
            <div className="flex-1 border-r border-zinc-800 p-6 overflow-y-auto"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-6">Nouvelle vente</h3>

              {/* Client Selection */}
              <div className="space-y-4 pb-6 border-b border-zinc-800/50">
                <label className="text-sm text-zinc-300 font-medium">Client</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setClientSelectionMode('existing')}
                    className={`py-2.5 px-3 border text-sm flex items-center justify-center gap-2 transition-all ${
                      clientSelectionMode === 'existing'
                        ? 'bg-white text-zinc-950 border-white'
                        : 'bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-white'
                    }`}
                  >
                    <Search className="h-4 w-4" />
                    Existant
                  </button>
                  <button
                    onClick={() => {
                      setClientSelectionMode('create');
                      setSelectedClientId(null);
                      setNewClientName('');
                      setNewClientEmail('');
                    }}
                    className={`py-2.5 px-3 border text-sm flex items-center justify-center gap-2 transition-all ${
                      clientSelectionMode === 'create'
                        ? 'bg-white text-zinc-950 border-white'
                        : 'bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-white'
                    }`}
                  >
                    <UserPlus className="h-4 w-4" />
                    Créer
                  </button>
                  <button
                    onClick={() => {
                      setClientSelectionMode('generate');
                      setSelectedClientId(null);
                      if (!generatedClientPreview) setGeneratedClientPreview(generateRandomClient());
                    }}
                    className={`py-2.5 px-3 border text-sm flex items-center justify-center gap-2 transition-all ${
                      clientSelectionMode === 'generate'
                        ? 'bg-white text-zinc-950 border-white'
                        : 'bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-white'
                    }`}
                  >
                    <Shuffle className="h-4 w-4" />
                    Générer
                  </button>
                </div>

                {/* Mode content */}
                <div className="min-h-[120px]">
                  {clientSelectionMode === 'existing' && (
                    <div className="space-y-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <input
                          type="text"
                          value={clientSearchQuery}
                          onChange={(e) => setClientSearchQuery(e.target.value)}
                          placeholder="Rechercher..."
                          className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 text-white text-[16px] placeholder-zinc-600 focus:border-zinc-600 focus:outline-none"
                        />
                      </div>
                      <div className="border border-zinc-800 max-h-32 overflow-y-auto">
                        {loadingClients ? (
                          <div className="flex items-center justify-center py-6">
                            <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
                          </div>
                        ) : filteredClients.length === 0 ? (
                          <div className="py-6 text-center text-zinc-600 text-sm">Aucun client</div>
                        ) : (
                          filteredClients.slice(0, 10).map((client) => (
                            <button
                              key={client.id}
                              onClick={() => setSelectedClientId(client.id)}
                              className={`w-full text-left px-3 py-2 flex items-center justify-between text-sm border-b border-zinc-800 last:border-0 transition-all ${
                                selectedClientId === client.id ? 'bg-zinc-900' : 'hover:bg-zinc-900/50'
                              }`}
                            >
                              <span className="text-white truncate">{client.name}</span>
                              {selectedClientId === client.id && <Check className="h-4 w-4 text-white flex-shrink-0" />}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {clientSelectionMode === 'create' && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setNewClientType('individual')}
                          className={`py-2 px-3 border text-sm flex items-center justify-center gap-2 transition-all ${
                            newClientType === 'individual'
                              ? 'bg-zinc-900 border-zinc-600 text-white'
                              : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-white'
                          }`}
                        >
                          <Users className="h-3.5 w-3.5" />
                          Particulier
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewClientType('business')}
                          className={`py-2 px-3 border text-sm flex items-center justify-center gap-2 transition-all ${
                            newClientType === 'business'
                              ? 'bg-zinc-900 border-zinc-600 text-white'
                              : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-white'
                          }`}
                        >
                          <Package className="h-3.5 w-3.5" />
                          Entreprise
                        </button>
                      </div>
                      <input
                        type="text"
                        value={newClientName}
                        onChange={(e) => setNewClientName(e.target.value)}
                        placeholder={newClientType === 'business' ? "Nom de l'entreprise" : "Nom complet"}
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-white text-[16px] placeholder-zinc-600 focus:border-zinc-600 focus:outline-none"
                      />
                      <div>
                        <input
                          type="email"
                          value={newClientEmail}
                          onChange={(e) => {
                            const email = e.target.value.toLowerCase();
                            setNewClientEmail(email);
                            if (email && clients.some(c => c.email?.toLowerCase() === email)) {
                              setEmailError('Cet email existe déjà');
                            } else {
                              setEmailError(null);
                            }
                          }}
                          placeholder="Email"
                          className={`w-full px-3 py-2 bg-zinc-900 border text-white text-[16px] placeholder-zinc-600 focus:outline-none ${
                            emailError ? 'border-red-500 focus:border-red-500' : 'border-zinc-800 focus:border-zinc-600'
                          }`}
                        />
                        {emailError && <p className="text-red-400 text-xs mt-1">{emailError}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="tel"
                          value={newClientPhone || ''}
                          onChange={(e) => setNewClientPhone(e.target.value)}
                          placeholder="Téléphone"
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-white text-[16px] placeholder-zinc-600 focus:border-zinc-600 focus:outline-none"
                        />
                        <select
                          value={newClientCountry}
                          onChange={(e) => setNewClientCountry(e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-white text-[16px] focus:border-zinc-600 focus:outline-none"
                        >
                          <option value="FR">France</option>
                          <option value="BE">Belgique</option>
                          <option value="CH">Suisse</option>
                          <option value="CA">Canada</option>
                          <option value="OTHER">Autre</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {clientSelectionMode === 'generate' && generatedClientPreview && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setGeneratedClientPreview(generateRandomClient('individual'))}
                          className={`py-2 px-3 border text-sm flex items-center justify-center gap-2 transition-all ${
                            generatedClientPreview?.type === 'individual'
                              ? 'bg-zinc-900 border-zinc-600 text-white'
                              : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-white'
                          }`}
                        >
                          <Users className="h-3.5 w-3.5" />
                          Particulier
                        </button>
                        <button
                          onClick={() => setGeneratedClientPreview(generateRandomClient('business'))}
                          className={`py-2 px-3 border text-sm flex items-center justify-center gap-2 transition-all ${
                            generatedClientPreview?.type === 'business'
                              ? 'bg-zinc-900 border-zinc-600 text-white'
                              : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-white'
                          }`}
                        >
                          <Package className="h-3.5 w-3.5" />
                          Entreprise
                        </button>
                      </div>
                      <div className="bg-zinc-900 border border-zinc-800 p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              generatedClientPreview.type === 'business' ? 'bg-violet-500/20 text-violet-400' : 'bg-emerald-500/20 text-emerald-400'
                            }`}>
                              {generatedClientPreview.type === 'business' ? <Package className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                            </div>
                            <div>
                              <p className="text-white text-sm font-medium">{generatedClientPreview.name}</p>
                              {generatedClientPreview.company && <p className="text-zinc-500 text-xs">{generatedClientPreview.company}</p>}
                            </div>
                          </div>
                          <button
                            onClick={() => setGeneratedClientPreview(generateRandomClient(generatedClientPreview.type))}
                            className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
                            title="Régénérer"
                          >
                            <Shuffle className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="space-y-1.5 text-xs">
                          <div className="flex items-center gap-2 text-zinc-400">
                            <span className="text-zinc-600 w-14">Email</span>
                            <span className="truncate">{generatedClientPreview.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-zinc-400">
                            <span className="text-zinc-600 w-14">Tél</span>
                            <span>{generatedClientPreview.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quantity */}
              <div className="space-y-3 py-6 border-b border-zinc-800/50">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-zinc-300 font-medium">Quantité</label>
                  {isRecurring && (
                    <span className="text-xs text-violet-400">{txCounter} abonnement{txCounter > 1 ? 's' : ''} seront créés</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setTxCounter(Math.max(1, txCounter - 1))}
                    className="w-10 h-10 border border-zinc-800 hover:border-zinc-600 text-white flex items-center justify-center transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={txCounter}
                    onChange={(e) => setTxCounter(Math.max(1, Number(e.target.value.replace(/\D/g, '')) || 1))}
                    className="w-16 text-center text-xl font-light text-white bg-transparent border-b border-zinc-700 focus:border-zinc-500 outline-none text-[16px]"
                  />
                  <button
                    onClick={() => setTxCounter(txCounter + 1)}
                    className="w-10 h-10 border border-zinc-800 hover:border-zinc-600 text-white flex items-center justify-center transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <div className="flex gap-1.5 ml-auto">
                    {[1, 5, 10, 25].map((n) => (
                      <button
                        key={n}
                        onClick={() => setTxCounter(n)}
                        className={`w-9 h-9 text-xs border transition-all ${
                          txCounter === n
                            ? 'bg-zinc-800 border-zinc-600 text-white'
                            : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-white'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Discount Section */}
              <div className="mt-4 pt-6">
                <button
                  onClick={() => setOpenAccordions(prev => prev.includes('discount') ? prev.filter(a => a !== 'discount') : [...prev, 'discount'])}
                  className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  <ChevronDown className={`h-4 w-4 transition-transform ${openAccordions.includes('discount') ? 'rotate-180' : ''}`} />
                  <Percent className="h-4 w-4" />
                  Appliquer une réduction
                </button>
                {openAccordions.includes('discount') && (
                  <div className="mt-3 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <input
                          type="text"
                          inputMode="decimal"
                          value={discountAmount}
                          onChange={(e) => setDiscountAmount(e.target.value.replace(/[^0-9.,]/g, ''))}
                          placeholder="0"
                          className="w-24 px-3 py-2 bg-zinc-900 border border-zinc-700 text-white text-[16px] placeholder-zinc-600 focus:border-zinc-500 focus:outline-none"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">€</span>
                      </div>
                      <div className="flex-1 text-sm">
                        {Number(discountAmount) > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-500">Prix final:</span>
                            <span className="text-emerald-400 font-medium">
                              {formatCurrency(Math.max(0, product.price - Number(discountAmount)))}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <input
                      type="text"
                      value={discountNote}
                      onChange={(e) => setDiscountNote(e.target.value)}
                      placeholder="Raison (ex: Fidélité, Promo...)"
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-white text-[16px] placeholder-zinc-600 focus:border-zinc-600 focus:outline-none"
                    />
                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => {
                          const discount = Number(discountAmount);
                          if (discount <= 0 || discount > product.price) return;
                          setActiveDiscount({ amount: discount, note: discountNote || `Réduction de ${formatCurrency(discount)}` });
                          setDiscountAmount('');
                          setDiscountNote('');
                          setOpenAccordions(prev => prev.filter(a => a !== 'discount'));
                        }}
                        disabled={!discountAmount || Number(discountAmount) <= 0 || Number(discountAmount) > product.price}
                        className="px-4 py-2 bg-zinc-800 text-white text-sm hover:bg-zinc-700 disabled:bg-zinc-900 disabled:text-zinc-600 transition-colors border border-zinc-700"
                      >
                        Activer
                      </button>
                    </div>
                  </div>
                )}
                {activeDiscount && (
                  <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Percent className="h-4 w-4 text-emerald-400" />
                      <span className="text-emerald-400 text-sm font-medium">-{formatCurrency(activeDiscount.amount)}</span>
                      <span className="text-zinc-500 text-xs ml-2">{activeDiscount.note}</span>
                    </div>
                    <button onClick={() => setActiveDiscount(null)} className="p-1 text-zinc-500 hover:text-red-400 transition-colors">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Subscription Section */}
              {onCreateSubscription && (
                <div className="mt-6 pt-6 border-t border-zinc-800/50">
                  <button
                    onClick={() => setOpenAccordions(prev => prev.includes('subscription') ? prev.filter(a => a !== 'subscription') : [...prev, 'subscription'])}
                    className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    <ChevronDown className={`h-4 w-4 transition-transform ${openAccordions.includes('subscription') ? 'rotate-180' : ''}`} />
                    <Calendar className="h-4 w-4" />
                    Créer un abonnement récurrent
                  </button>
                  {openAccordions.includes('subscription') && (
                    <div className="mt-3 space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-zinc-300">Activer l'abonnement</label>
                        <button
                          onClick={() => setIsRecurring(!isRecurring)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            isRecurring ? 'bg-violet-500' : 'bg-zinc-700'
                          }`}
                        >
                          <div
                            className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                              isRecurring ? 'translate-x-7' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      {isRecurring && (
                        <>
                          <div className="space-y-2">
                            <label className="text-sm text-zinc-400">Cycle de facturation</label>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => setSubscriptionCycle('monthly')}
                                className={`py-2.5 px-3 border text-sm flex items-center justify-center gap-2 transition-all ${
                                  subscriptionCycle === 'monthly'
                                    ? 'bg-violet-500/20 text-violet-400 border-violet-500/50'
                                    : 'bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-white'
                                }`}
                              >
                                <Calendar className="h-4 w-4" />
                                Mensuel
                              </button>
                              <button
                                onClick={() => setSubscriptionCycle('annual')}
                                className={`py-2.5 px-3 border text-sm flex items-center justify-center gap-2 transition-all ${
                                  subscriptionCycle === 'annual'
                                    ? 'bg-violet-500/20 text-violet-400 border-violet-500/50'
                                    : 'bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-white'
                                }`}
                              >
                                <Calendar className="h-4 w-4" />
                                Annuel
                              </button>
                            </div>
                          </div>
                          <div className="p-3 bg-violet-500/10 border border-violet-500/30 text-xs text-violet-300">
                            <div className="flex items-center gap-2 mb-1">
                              <Calendar className="h-3.5 w-3.5" />
                              <span className="font-medium">Abonnement {subscriptionCycle === 'monthly' ? 'mensuel' : 'annuel'}</span>
                            </div>
                            <p className="text-violet-400/80">
                              Début: {MONTHS[selectedMonth]} {selectedYear} •
                              {subscriptionCycle === 'monthly' ? ' Renouvellement chaque mois' : ' Renouvellement chaque année'}
                            </p>
                            {activeDiscount && (
                              <p className="text-emerald-400/80 mt-1">
                                Réduction de {formatCurrency(activeDiscount.amount)} appliquée à chaque renouvellement
                              </p>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                  {isRecurring && !openAccordions.includes('subscription') && (
                    <div className="mt-3 p-3 bg-violet-500/10 border border-violet-500/30 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-violet-400" />
                        <span className="text-violet-400 text-sm font-medium">
                          Abonnement {subscriptionCycle === 'monthly' ? 'mensuel' : 'annuel'}
                        </span>
                      </div>
                      <button onClick={() => setIsRecurring(false)} className="p-1 text-zinc-500 hover:text-red-400 transition-colors">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right: Historique */}
            <div className="w-96 flex-shrink-0 flex flex-col bg-zinc-900/30">
              <div className="px-5 py-4 border-b border-zinc-800">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Historique</h3>
                  <span className="text-xs text-zinc-600">{getTransactionsCount(product, currentMonthKey)} tx</span>
                </div>
                {transactions.length > 0 && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs text-zinc-500 cursor-pointer hover:text-zinc-300">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleSelectAll}
                        className="w-3.5 h-3.5 rounded border-zinc-700 bg-zinc-900 text-violet-500 focus:ring-violet-500 focus:ring-offset-0"
                      />
                      Tout sélectionner
                    </label>
                    {someSelected && (
                      <button
                        onClick={handleBulkDelete}
                        className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                        Supprimer ({selectedTxIds.size})
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {transactions.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-zinc-600 text-sm">
                    Aucune transaction
                  </div>
                ) : (
                  <div className="divide-y divide-zinc-800/50">
                    {transactions.map((tx, index) => (
                      <div
                        key={tx.id}
                        className={`px-5 py-3 flex items-center gap-3 group hover:bg-zinc-900/50 transition-colors ${
                          selectedTxIds.has(tx.id) ? 'bg-violet-500/10' : ''
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedTxIds.has(tx.id)}
                          onChange={() => toggleSelectTx(tx.id)}
                          className="w-3.5 h-3.5 rounded border-zinc-700 bg-zinc-900 text-violet-500 focus:ring-violet-500 focus:ring-offset-0 flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-zinc-600">#{index + 1}</span>
                            <span className={`text-sm font-medium ${tx.discount ? 'text-emerald-400' : tx.isCustom ? 'text-amber-400' : 'text-white'}`}>
                              {formatCurrency(tx.amount)}
                            </span>
                            {tx.discount && (
                              <span className="text-[10px] px-1.5 py-0.5 bg-zinc-800 text-zinc-400 flex items-center gap-0.5">
                                <Minus className="h-2.5 w-2.5" />
                                {formatCurrency(tx.discount)}
                              </span>
                            )}
                            {tx.isRecurring && (
                              <Calendar className="h-3 w-3 text-violet-400" />
                            )}
                          </div>
                          <p className="text-xs text-zinc-500 truncate">{tx.clientName || 'Client inconnu'}</p>
                        </div>
                        <button
                          onClick={() => onDeleteTransaction(catId, product.id, currentMonthKey, tx.id)}
                          className="p-1 text-zinc-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800 flex-shrink-0 bg-zinc-900/50">
            <div className="text-sm">
              <span className="text-zinc-500">Total : </span>
              {activeDiscount ? (
                <>
                  <span className="text-emerald-400 font-medium text-lg">
                    {formatCurrency(txCounter * (product.price - activeDiscount.amount))}
                  </span>
                  <span className="text-zinc-600 line-through text-sm ml-2">
                    {formatCurrency(txCounter * product.price)}
                  </span>
                </>
              ) : (
                <span className="text-white font-medium text-lg">{formatCurrency(txCounter * product.price)}</span>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="px-5 py-2.5 border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors text-sm"
              >
                Annuler
              </button>
              <button
                onClick={handleAddTransactions}
                disabled={isAddDisabled || isSubmitting}
                className={`px-6 py-2.5 hover:opacity-90 disabled:bg-zinc-800 disabled:text-zinc-600 transition-colors text-sm font-medium flex items-center gap-2 min-w-[180px] justify-center ${
                  isRecurring ? 'bg-violet-500 text-white' : 'bg-white text-zinc-950 hover:bg-zinc-200'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {submitProgress.total > 1 ? (
                      <span>
                        {Math.round((submitProgress.current / submitProgress.total) * 100)}%
                        <span className="text-xs opacity-70 ml-1">({submitProgress.current}/{submitProgress.total})</span>
                      </span>
                    ) : (
                      <span>En cours...</span>
                    )}
                  </>
                ) : isRecurring ? (
                  <>
                    <Plus className="h-4 w-4" />
                    Créer abonnement
                    <Calendar className="h-3.5 w-3.5 ml-1" />
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Ajouter {txCounter} vente{txCounter > 1 ? 's' : ''}
                    {activeDiscount && <span className="text-emerald-600 text-xs">(-{formatCurrency(activeDiscount.amount)}/u)</span>}
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>,
    document.body
  );
}

export default TransactionsModal;
