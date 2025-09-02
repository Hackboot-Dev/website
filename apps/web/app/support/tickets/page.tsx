'use client';

import { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { LanguageContext } from '../../../contexts/LanguageContext';
import { 
  TicketIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChevronRightIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  UserIcon,
  TagIcon,
  PaperClipIcon,
  ChatBubbleBottomCenterTextIcon,
  ArrowPathIcon,
  ArchiveBoxIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const translations = {
  en: {
    hero: {
      badge: 'SUPPORT CENTER',
      title: 'Ticket Management',
      subtitle: 'Track and manage your support requests',
      description: 'Create, view, and manage all your support tickets in one centralized location. Our team is here to help you resolve any issues quickly and efficiently.',
      newTicket: 'Create New Ticket',
      viewAll: 'View All Tickets'
    },
    stats: [
      { label: 'Active Tickets', value: '3', icon: 'ticket', color: 'blue' },
      { label: 'In Progress', value: '2', icon: 'clock', color: 'yellow' },
      { label: 'Resolved', value: '47', icon: 'check', color: 'green' },
      { label: 'Avg Response', value: '2h', icon: 'timer', color: 'purple' }
    ],
    filters: {
      all: 'All Tickets',
      open: 'Open',
      inProgress: 'In Progress',
      resolved: 'Resolved',
      closed: 'Closed'
    },
    priorities: {
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      critical: 'Critical'
    },
    tickets: [
      {
        id: 'TKT-2024-001',
        title: 'Unable to connect to VPS instance',
        status: 'open',
        priority: 'high',
        created: '2 hours ago',
        category: 'Technical',
        messages: 3,
        attachments: 1
      },
      {
        id: 'TKT-2024-002',
        title: 'Billing discrepancy for monthly subscription',
        status: 'inProgress',
        priority: 'medium',
        created: '1 day ago',
        category: 'Billing',
        messages: 5,
        attachments: 2
      },
      {
        id: 'TKT-2024-003',
        title: 'Feature request: API rate limit increase',
        status: 'inProgress',
        priority: 'low',
        created: '3 days ago',
        category: 'Feature Request',
        messages: 2,
        attachments: 0
      }
    ],
    form: {
      title: 'Create New Ticket',
      subject: 'Subject',
      subjectPlaceholder: 'Brief description of your issue',
      category: 'Category',
      categories: ['Technical', 'Billing', 'Account', 'Feature Request', 'Other'],
      priority: 'Priority',
      description: 'Description',
      descriptionPlaceholder: 'Provide detailed information about your issue...',
      attachments: 'Attachments',
      attachButton: 'Attach Files',
      submitButton: 'Submit Ticket',
      cancelButton: 'Cancel'
    },
    actions: {
      view: 'View Details',
      reply: 'Reply',
      close: 'Close Ticket',
      escalate: 'Escalate'
    }
  },
  fr: {
    hero: {
      badge: 'CENTRE DE SUPPORT',
      title: 'Gestion des Tickets',
      subtitle: 'Suivez et gérez vos demandes de support',
      description: 'Créez, consultez et gérez tous vos tickets de support en un seul endroit centralisé. Notre équipe est là pour vous aider à résoudre rapidement et efficacement tout problème.',
      newTicket: 'Créer un Nouveau Ticket',
      viewAll: 'Voir Tous les Tickets'
    },
    stats: [
      { label: 'Tickets Actifs', value: '3', icon: 'ticket', color: 'blue' },
      { label: 'En Cours', value: '2', icon: 'clock', color: 'yellow' },
      { label: 'Résolus', value: '47', icon: 'check', color: 'green' },
      { label: 'Réponse Moy.', value: '2h', icon: 'timer', color: 'purple' }
    ],
    filters: {
      all: 'Tous les Tickets',
      open: 'Ouverts',
      inProgress: 'En Cours',
      resolved: 'Résolus',
      closed: 'Fermés'
    },
    priorities: {
      low: 'Faible',
      medium: 'Moyen',
      high: 'Élevé',
      critical: 'Critique'
    },
    tickets: [
      {
        id: 'TKT-2024-001',
        title: 'Impossible de se connecter à l\'instance VPS',
        status: 'open',
        priority: 'high',
        created: 'Il y a 2 heures',
        category: 'Technique',
        messages: 3,
        attachments: 1
      },
      {
        id: 'TKT-2024-002',
        title: 'Écart de facturation pour l\'abonnement mensuel',
        status: 'inProgress',
        priority: 'medium',
        created: 'Il y a 1 jour',
        category: 'Facturation',
        messages: 5,
        attachments: 2
      },
      {
        id: 'TKT-2024-003',
        title: 'Demande de fonctionnalité : Augmentation limite API',
        status: 'inProgress',
        priority: 'low',
        created: 'Il y a 3 jours',
        category: 'Demande de Fonctionnalité',
        messages: 2,
        attachments: 0
      }
    ],
    form: {
      title: 'Créer un Nouveau Ticket',
      subject: 'Sujet',
      subjectPlaceholder: 'Brève description de votre problème',
      category: 'Catégorie',
      categories: ['Technique', 'Facturation', 'Compte', 'Demande de Fonctionnalité', 'Autre'],
      priority: 'Priorité',
      description: 'Description',
      descriptionPlaceholder: 'Fournissez des informations détaillées sur votre problème...',
      attachments: 'Pièces Jointes',
      attachButton: 'Joindre des Fichiers',
      submitButton: 'Soumettre le Ticket',
      cancelButton: 'Annuler'
    },
    actions: {
      view: 'Voir les Détails',
      reply: 'Répondre',
      close: 'Fermer le Ticket',
      escalate: 'Escalader'
    }
  }
};

interface Ticket {
  id: string;
  title: string;
  status: string;
  priority: string;
  created: string;
  category: string;
  messages: number;
  attachments: number;
}

export default function TicketsPage() {
  const router = useRouter();
  const { language } = useContext(LanguageContext);
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('medium');
  const [selectedCategory, setSelectedCategory] = useState('Technical');
  const formRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const ticketsRef = useRef<HTMLDivElement>(null);

  const t = translations[language as keyof typeof translations];

  // Animation on mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '-50px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    [heroRef, ticketsRef, formRef].forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'inProgress': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'resolved': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'closed': return 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20';
      default: return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-400 bg-red-500/10';
      case 'high': return 'text-orange-400 bg-orange-500/10';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10';
      case 'low': return 'text-blue-400 bg-blue-500/10';
      default: return 'text-zinc-400 bg-zinc-500/10';
    }
  };

  const filteredTickets = t.tickets.filter((ticket: Ticket) => {
    if (filter !== 'all' && ticket.status !== filter) return false;
    if (searchQuery && !ticket.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative pt-32 pb-20 px-4 overflow-hidden opacity-0 transition-all duration-1000"
        style={{ 
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(20px)'
        }}
      >
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 blur-3xl rounded-full" />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
              <TicketIcon className="w-4 h-4" />
              {t.hero.badge}
            </div>
            
            <h1 className="text-6xl font-bold text-white mb-6 tracking-tight">
              {t.hero.title}
            </h1>
            
            <p className="text-xl text-zinc-400 mb-4 max-w-2xl mx-auto">
              {t.hero.subtitle}
            </p>
            
            <p className="text-base text-zinc-500 max-w-3xl mx-auto mb-8">
              {t.hero.description}
            </p>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setShowForm(!showForm)}
                className="group px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 flex items-center gap-2"
              >
                <PlusIcon className="w-5 h-5 transition-transform group-hover:rotate-90" />
                {t.hero.newTicket}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {t.stats.map((stat, idx) => (
              <div 
                key={idx}
                className="relative group"
                style={{
                  animationDelay: `${idx * 100}ms`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-800/50 to-zinc-900/50 rounded-xl blur-xl transition-all duration-500 group-hover:blur-2xl" />
                <div className="relative p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm">
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-sm text-zinc-400">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ticket Form */}
      {showForm && (
        <section 
          ref={formRef}
          className="px-4 pb-20"
        >
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl" />
              <div className="relative bg-zinc-900/90 backdrop-blur-sm rounded-2xl border border-zinc-800 p-8">
                <h2 className="text-2xl font-bold text-white mb-6">{t.form.title}</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                      {t.form.subject}
                    </label>
                    <input
                      type="text"
                      placeholder={t.form.subjectPlaceholder}
                      className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">
                        {t.form.category}
                      </label>
                      <select 
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                      >
                        {t.form.categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">
                        {t.form.priority}
                      </label>
                      <select 
                        value={selectedPriority}
                        onChange={(e) => setSelectedPriority(e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                      >
                        {Object.entries(t.priorities).map(([key, label]) => (
                          <option key={key} value={key}>{label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                      {t.form.description}
                    </label>
                    <textarea
                      rows={6}
                      placeholder={t.form.descriptionPlaceholder}
                      className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                      {t.form.attachments}
                    </label>
                    <button className="px-6 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-400 hover:text-white hover:border-zinc-600 transition-all flex items-center gap-2">
                      <PaperClipIcon className="w-5 h-5" />
                      {t.form.attachButton}
                    </button>
                  </div>

                  <div className="flex items-center justify-end gap-4 pt-4">
                    <button
                      onClick={() => setShowForm(false)}
                      className="px-6 py-3 text-zinc-400 hover:text-white transition-colors"
                    >
                      {t.form.cancelButton}
                    </button>
                    <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all">
                      {t.form.submitButton}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tickets List */}
      <section 
        ref={ticketsRef}
        className="px-4 pb-32"
      >
        <div className="max-w-7xl mx-auto">
          {/* Filters */}
          <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              {Object.entries(t.filters).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filter === key
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-zinc-900/50 text-zinc-400 border border-zinc-800 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Ticket Cards */}
          <div className="space-y-4">
            {filteredTickets.map((ticket, idx) => (
              <div 
                key={ticket.id}
                className="group relative"
                style={{
                  animationDelay: `${idx * 50}ms`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-800/30 to-zinc-900/30 rounded-xl blur transition-all duration-500 group-hover:blur-xl" />
                <div className="relative bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 p-6 transition-all duration-300 hover:border-zinc-700">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-mono text-zinc-500">{ticket.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                          {t.filters[ticket.status as keyof typeof t.filters]}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                          {t.priorities[ticket.priority as keyof typeof t.priorities]}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                        {ticket.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-zinc-400">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          {ticket.created}
                        </span>
                        <span className="flex items-center gap-1">
                          <TagIcon className="w-4 h-4" />
                          {ticket.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquareIcon className="w-4 h-4" />
                          {ticket.messages}
                        </span>
                        {ticket.attachments > 0 && (
                          <span className="flex items-center gap-1">
                            <PaperClipIcon className="w-4 h-4" />
                            {ticket.attachments}
                          </span>
                        )}
                      </div>
                    </div>
                    <button className="p-2 text-zinc-400 hover:text-white transition-colors">
                      <ChevronRightIcon className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-800/50">
                    <button className="px-3 py-1.5 text-sm text-zinc-400 hover:text-white transition-colors">
                      {t.actions.view}
                    </button>
                    <button className="px-3 py-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                      {t.actions.reply}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}