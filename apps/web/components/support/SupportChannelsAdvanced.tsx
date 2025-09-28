'use client';

// /workspaces/website/apps/web/components/support/SupportChannelsAdvanced.tsx  
// Description: Support channels with sophisticated Awwwards-level design
// Last modified: 2025-08-28
// Related docs: /docs/JOURNAL.md

// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useRevealAnimation, useStaggerReveal, useParallax, useMousePosition } from '../../hooks/useAwwardsAnimation';
import channelsConfig from '../../data/support/channels-config.json';

const channelsData = {
  en: {
    label: "CONTACT METHODS",
    title: {
      1: "Choose your",
      2: "preferred channel"
    },
    channels: [
      {
        id: 'email',
        name: 'Email',
        description: 'Detailed technical inquiries',
        response: '< 2 hours',
        priority: 'Standard',
        address: 'contact@vmcloud.fr',
        availability: '24/7',
        features: ['Ticket tracking', 'File attachments', 'Thread history']
      },
      {
        id: 'chat',
        name: 'Live Chat',
        description: 'Real-time assistance (currently offline)',
        response: 'Unavailable',
        priority: 'Temporarily offline',
        availability: 'Offline',
        features: ['Instant response', 'Screen sharing', 'AI assistant']
      },
      {
        id: 'phone',
        name: 'Phone',
        description: 'Critical issues & emergencies',
        response: 'Unavailable',
        priority: 'Temporarily offline',
        phone: '+372 555 0100',
        availability: 'Offline',
        features: ['Direct expert', 'Priority queue', 'Call recording']
      },
      {
        id: 'api',
        name: 'API',
        description: 'Automated ticket creation',
        response: '< 1 minute',
        priority: 'Programmatic',
        endpoint: '/api/v1/tickets',
        availability: 'Monitored 24/7',
        features: ['REST/GraphQL', 'Webhooks', 'Bulk operations']
      }
    ],
    action: {
      primary: "Connect",
      secondary: "Learn more"
    }
  },
  fr: {
    label: "MÉTHODES DE CONTACT",
    title: {
      1: "Choisissez votre",
      2: "canal préféré"
    },
    channels: [
      {
        id: 'email',
        name: 'Email',
        description: 'Demandes techniques détaillées',
        response: '< 2 heures',
        priority: 'Standard',
        address: 'contact@vmcloud.fr',
        availability: '24/7',
        features: ['Suivi tickets', 'Pièces jointes', 'Historique']
      },
      {
        id: 'chat',
        name: 'Chat Live',
        description: 'Assistance en temps réel (actuellement indisponible)',
        response: 'Indisponible',
        priority: 'Hors service',
        availability: 'Hors ligne',
        features: ['Réponse instantanée', 'Partage écran', 'Assistant IA']
      },
      {
        id: 'phone',
        name: 'Téléphone',
        description: 'Urgences et incidents critiques',
        response: 'Indisponible',
        priority: 'Hors service',
        phone: '+372 555 0100',
        availability: 'Hors ligne',
        features: ['Expert direct', 'File prioritaire', 'Enregistrement']
      },
      {
        id: 'api',
        name: 'API',
        description: 'Création automatisée de tickets',
        response: '< 1 minute',
        priority: 'Programmatique',
        endpoint: '/api/v1/tickets',
        availability: 'Surveillance 24/7',
        features: ['REST/GraphQL', 'Webhooks', 'Opérations bulk']
      }
    ],
    action: {
      primary: "Connecter",
      secondary: "En savoir plus"
    }
  }
};

export default function SupportChannelsAdvanced() {
  const { language } = useLanguage();
  const [hoveredChannel, setHoveredChannel] = useState<string | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userPlan] = useState<'starter' | 'business' | 'enterprise'>('business'); // This should come from user context
  
  const t = channelsData[language] || channelsData['en'];
  const mousePosition = useMousePosition();
  
  // Animations
  const titleReveal = useRevealAnimation({ delay: 100 });
  const { containerRef, visibleItems } = useStaggerReveal(4, 120);
  const geometricParallax = useParallax(0.05);
  
  // Handle channel connection based on type
  const handleChannelConnect = (channel: any) => {
    // Get configuration from channels-config.json
    const config = channelsConfig.channels.find(c => c.id === channel.id);
    
    // Check if channel is available
    if (!isChannelAvailable(channel)) {
      alert(language === 'fr' 
        ? 'Ce canal n\'est pas disponible actuellement.' 
        : 'This channel is not currently available.');
      return;
    }
    
    // Check if user has required plan
    if (config?.minPlan) {
      const planHierarchy = ['starter', 'business', 'enterprise'];
      const requiredPlanIndex = planHierarchy.indexOf(config.minPlan);
      const userPlanIndex = planHierarchy.indexOf(userPlan);
      
      if (userPlanIndex < requiredPlanIndex) {
        alert(language === 'fr' 
          ? `Ce canal nécessite un plan ${config.minPlan} ou supérieur.` 
          : `This channel requires ${config.minPlan} plan or higher.`);
        return;
      }
    }
    
    // Handle connection based on channel type
    switch (channel.id) {
      case 'email':
        // Open email client
        if (channel.address) {
          window.location.href = `mailto:${channel.address}`;
        } else if (config?.email) {
          window.location.href = `mailto:${config.email}`;
        }
        break;
        
      case 'phone':
        // Open phone dialer
        if (channel.phone) {
          window.location.href = `tel:${channel.phone.replace(/\s/g, '')}`;
        } else if (config?.phone) {
          window.location.href = `tel:${config.phone.replace(/\s/g, '')}`;
        }
        break;
        
      case 'chat':
      case 'livechat':
        // Navigate to chat page
        window.location.href = '/support/chat';
        break;
        
      case 'api':
        // Navigate to API documentation
        if (channel.endpoint) {
          window.location.href = '/docs/api';
        } else if (config?.url) {
          window.location.href = config.url;
        }
        break;
        
      case 'tickets':
        // Navigate to tickets page
        window.location.href = '/support/tickets';
        break;
        
      default:
        // Default action - navigate to URL if provided
        if (config?.url) {
          if (config.url.startsWith('http') || config.url.startsWith('tel:') || config.url.startsWith('mailto:')) {
            window.location.href = config.url;
          } else {
            window.location.href = config.url;
          }
        }
        break;
    }
  };
  
  // Update time every minute for real-time availability
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);
  
  // Check if channel is available based on schedule
  const isChannelAvailable = (channel: any) => {
    const config = channelsConfig.channels.find(c => c.id === channel.id);
    if (!config) return true;
    
    const availability = config.availability;
    
    if (availability.type === 'always') {
      return true;
    }
    
    if (availability.type === 'never') {
      return false;
    }
    
    if (availability.type === 'schedule') {
      const utcDay = currentTime.getUTCDay();
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const dayName = days[utcDay];
      const daySchedule = (availability as any).hours?.[dayName];
      
      if (!daySchedule) return false;
      
      const currentHour = currentTime.getUTCHours();
      const currentMinute = currentTime.getUTCMinutes();
      const currentTimeInMinutes = currentHour * 60 + currentMinute;
      
      const [startHour, startMinute] = daySchedule.start.split(':').map(Number);
      const [endHour, endMinute] = daySchedule.end.split(':').map(Number);
      const startTimeInMinutes = startHour * 60 + startMinute;
      const endTimeInMinutes = endHour * 60 + endMinute;
      
      return currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes < endTimeInMinutes;
    }
    
    if (availability.type === 'plan_based') {
      const planAvailability = (availability as any).plans?.[userPlan];
      if (!planAvailability) return false;
      
      if (planAvailability.type === 'always') return true;
      if (planAvailability.type === 'never') return false;
      
      if (planAvailability.type === 'schedule') {
        const utcDay = currentTime.getUTCDay();
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayName = days[utcDay];
        const daySchedule = planAvailability.hours?.[dayName];
        
        if (!daySchedule) return false;
        
        const currentHour = currentTime.getUTCHours();
        const currentMinute = currentTime.getUTCMinutes();
        const currentTimeInMinutes = currentHour * 60 + currentMinute;
        
        const [startHour, startMinute] = daySchedule.start.split(':').map(Number);
        const [endHour, endMinute] = daySchedule.end.split(':').map(Number);
        const startTimeInMinutes = startHour * 60 + startMinute;
        const endTimeInMinutes = endHour * 60 + endMinute;
        
        return currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes < endTimeInMinutes;
      }
    }
    
    return true;
  };

  const getChannelGradient = (id: string) => {
    const gradients = {
      email: 'from-blue-900/10 to-zinc-900/5',
      chat: 'from-emerald-900/10 to-zinc-900/5',
      phone: 'from-red-900/10 to-zinc-900/5',
      api: 'from-purple-900/10 to-zinc-900/5'
    };
    return gradients[id as keyof typeof gradients] || 'from-zinc-900/10 to-zinc-900/5';
  };

  const getChannelAccent = (id: string) => {
    const accents = {
      email: 'border-blue-800/30 hover:border-blue-700/50',
      chat: 'border-emerald-800/30 hover:border-emerald-700/50',
      phone: 'border-red-800/30 hover:border-red-700/50',
      api: 'border-purple-800/30 hover:border-purple-700/50'
    };
    return accents[id as keyof typeof accents] || 'border-zinc-800/30 hover:border-zinc-700/50';
  };

  return (
    <section className="relative py-24 lg:py-32">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          ref={geometricParallax.elementRef}
          style={geometricParallax.style}
          className="absolute inset-0"
        >
          {/* Floating grid */}
          <div className="absolute inset-0 opacity-[0.02]">
            <div className="absolute inset-0 bg-grid" />
          </div>
          
          {/* Geometric shapes */}
          <div 
            className="absolute top-1/3 left-1/4 w-32 h-32 border border-zinc-900/20 rounded-lg"
            style={{ transform: `rotate(${mousePosition.x * 0.02}deg)` }}
          />
          <div 
            className="absolute bottom-1/4 right-1/3 w-24 h-24 bg-zinc-900/10"
            style={{ transform: `rotate(${-mousePosition.x * 0.03}deg)` }}
          />
          
          {/* Dynamic lines */}
          <div 
            className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-800/20 to-transparent"
            style={{ transform: `translateY(${mousePosition.y * 0.1}px)` }}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-20">
            <div className="mb-8">
              <span className="text-xs tracking-[0.3em] text-zinc-500 font-mono">
                {t.label}
              </span>
            </div>
            <div 
              ref={titleReveal.elementRef}
              style={titleReveal.style}
            >
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extralight tracking-tight leading-[1.05]">
                <span className="block text-white">{t.title[1]}</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 to-zinc-600">
                  {t.title[2]}
                </span>
              </h2>
            </div>
          </div>

          {/* Channels Grid */}
          <div ref={containerRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.channels.map((channel, idx) => (
              <div
                key={channel.id}
                className={`group relative cursor-pointer ${selectedChannel === channel.id ? 'z-20' : 'z-10'}`}
                style={{
                  opacity: visibleItems[idx] ? 1 : 0,
                  transform: visibleItems[idx] ? 'translateY(0)' : 'translateY(40px)',
                  transition: `all 800ms cubic-bezier(0.16, 1, 0.3, 1) ${idx * 120}ms`
                }}
                onMouseEnter={() => setHoveredChannel(channel.id)}
                onMouseLeave={() => setHoveredChannel(null)}
                onClick={() => setSelectedChannel(channel.id === selectedChannel ? null : channel.id)}
              >
                {/* Card */}
                <div className={`
                  relative h-full border transition-all duration-500 flex flex-col
                  ${getChannelAccent(channel.id)}
                  ${selectedChannel === channel.id ? 'scale-[1.02] shadow-2xl' : ''}
                  bg-gradient-to-br ${getChannelGradient(channel.id)}
                  backdrop-blur-sm rounded-xl p-6 sm:p-8
                `}>
                  {/* Availability indicator */}
                  <div className="absolute top-4 right-4">
                    <div className={`
                      w-2 h-2 rounded-full transition-all duration-300
                      ${isChannelAvailable(channel) ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'}
                    `} />
                  </div>

                  {/* Content */}
                  <div className="space-y-4 sm:space-y-6 flex-1">
                    {/* Name */}
                    <div>
                      <h3 className="text-xl sm:text-2xl font-extralight text-white mb-2 group-hover:text-zinc-200 transition-colors">
                        {channel.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-500 font-light leading-relaxed">
                        {channel.description}
                      </p>
                    </div>

                    {/* Metrics */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-2 py-2 border-b border-zinc-800/30">
                        <span className="text-[11px] sm:text-xs text-zinc-600 uppercase tracking-wider flex-shrink-0">Response</span>
                        <span className="text-xs sm:text-sm text-zinc-400 font-light text-right">{channel.response}</span>
                      </div>
                      <div className="flex justify-between items-start gap-2 py-2 border-b border-zinc-800/30">
                        <span className="text-[11px] sm:text-xs text-zinc-600 uppercase tracking-wider flex-shrink-0">Priority</span>
                        <span className="text-xs sm:text-sm text-zinc-400 font-light text-right">{channel.priority}</span>
                      </div>
                      <div className="flex justify-between items-start gap-2 py-2">
                        <span className="text-[11px] sm:text-xs text-zinc-600 uppercase tracking-wider flex-shrink-0">Status</span>
                        <span className={`text-xs sm:text-sm font-light text-right ${isChannelAvailable(channel) ? 'text-emerald-400' : 'text-zinc-500'}`}>
                          {isChannelAvailable(channel) 
                            ? (language === 'fr' ? 'Disponible' : 'Available')
                            : (language === 'fr' ? 'Hors ligne' : 'Offline')
                          }
                        </span>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="pt-4 border-t border-zinc-800/30">
                      {channel.address && (
                        <p className="text-xs text-zinc-500 font-mono break-all">
                          {channel.address}
                        </p>
                      )}
                      {channel.phone && (
                        <p className="text-sm text-zinc-300 font-light">
                          {channel.phone}
                        </p>
                      )}
                      {channel.endpoint && (
                        <p className="text-xs text-zinc-500 font-mono">
                          {channel.endpoint}
                        </p>
                      )}
                    </div>

                    {/* Action button - Integrated in content flow */}
                    <div className={`
                      transition-all duration-500 overflow-hidden
                      ${hoveredChannel === channel.id ? 'max-h-20 opacity-100 mt-4 pt-4 border-t border-zinc-800/30' : 'max-h-0 opacity-0 mt-0'}
                    `}>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleChannelConnect(channel);
                        }}
                        className="w-full py-3 bg-zinc-800/30 border border-zinc-700/30 rounded-lg text-xs text-white font-light tracking-wider uppercase hover:tracking-widest hover:bg-zinc-700/30 hover:border-zinc-600/30 transition-all duration-300"
                      >
                        {t.action.primary}
                      </button>
                    </div>

                    {/* Features - Show on hover only */}
                    <div className={`
                      space-y-2 overflow-hidden transition-all duration-500
                      ${hoveredChannel === channel.id ? 
                        'max-h-32 opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'}
                    `}>
                      {channel.features.map((feature, fidx) => (
                        <div key={fidx} className="flex items-start space-x-2">
                          <div className="w-1 h-1 bg-zinc-600 rounded-full mt-1.5 flex-shrink-0" />
                          <span className="text-xs text-zinc-500 break-words">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Corner accent */}
                  <div className={`
                    absolute top-0 right-0 w-16 h-16 
                    border-t border-r border-zinc-700/0 rounded-tr-xl
                    transition-all duration-500
                    ${hoveredChannel === channel.id ? 'border-zinc-700/30' : ''}
                  `} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
