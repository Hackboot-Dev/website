'use client';

// /workspaces/website/apps/web/components/support/SupportChannels.tsx
// Description: Support channels component with availability checking
// Last modified: 2025-08-28
// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChatBubbleLeftRightIcon,
  TicketIcon,
  EnvelopeIcon,
  PhoneIcon,
  CommandLineIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';
import channelsConfig from '../../data/support/channels-config.json';

const iconMap = {
  ticket: TicketIcon,
  chat: ChatBubbleLeftRightIcon,
  email: EnvelopeIcon,
  phone: PhoneIcon,
  api: CommandLineIcon
};

interface ChannelAvailability {
  isAvailable: boolean;
  reason?: string;
  nextAvailable?: string;
}

export default function SupportChannels() {
  const { language } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userPlan] = useState('starter'); // This would come from user context

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Check if channel is currently available based on schedule
  const checkAvailability = (channel: any): ChannelAvailability => {
    if (!channel.enabled) {
      return { 
        isAvailable: false, 
        reason: language === 'fr' ? 'Service désactivé' : 'Service disabled' 
      };
    }

    // Check plan requirements
    const planHierarchy = ['starter', 'business', 'enterprise'];
    const userPlanIndex = planHierarchy.indexOf(userPlan);
    const requiredPlanIndex = planHierarchy.indexOf(channel.minPlan);
    
    if (userPlanIndex < requiredPlanIndex) {
      return { 
        isAvailable: false, 
        reason: language === 'fr' 
          ? `Nécessite plan ${channel.minPlan}` 
          : `Requires ${channel.minPlan} plan`
      };
    }

    const availability = channel.availability;
    
    // Always available
    if (availability.type === 'always') {
      return { isAvailable: true };
    }

    // Schedule-based availability
    if (availability.type === 'schedule') {
      return checkScheduleAvailability(availability);
    }

    // Plan-based availability
    if (availability.type === 'plan_based' && availability.plans[userPlan]) {
      const planAvailability = availability.plans[userPlan];
      if (planAvailability.type === 'always') {
        return { isAvailable: true };
      }
      if (planAvailability.type === 'schedule') {
        return checkScheduleAvailability(planAvailability);
      }
    }

    return { 
      isAvailable: false, 
      reason: language === 'fr' ? 'Non disponible' : 'Not available' 
    };
  };

  const checkScheduleAvailability = (schedule: any): ChannelAvailability => {
    const now = new Date();
    const utcHours = now.getUTCHours();
    const utcMinutes = now.getUTCMinutes();
    const currentTimeMinutes = utcHours * 60 + utcMinutes;
    
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = dayNames[now.getUTCDay()];
    
    const todaySchedule = schedule.hours?.[currentDay];
    
    if (!todaySchedule) {
      return { 
        isAvailable: false, 
        reason: language === 'fr' ? 'Fermé aujourd\'hui' : 'Closed today',
        nextAvailable: getNextAvailableTime(schedule.hours, currentDay)
      };
    }

    const [startHour, startMinute] = todaySchedule.start.split(':').map(Number);
    const [endHour, endMinute] = todaySchedule.end.split(':').map(Number);
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    if (currentTimeMinutes >= startMinutes && currentTimeMinutes < endMinutes) {
      return { isAvailable: true };
    }

    if (currentTimeMinutes < startMinutes) {
      return { 
        isAvailable: false, 
        reason: language === 'fr' 
          ? `Ouvre à ${todaySchedule.start} UTC` 
          : `Opens at ${todaySchedule.start} UTC`,
        nextAvailable: todaySchedule.start
      };
    }

    return { 
      isAvailable: false, 
      reason: language === 'fr' ? 'Fermé pour aujourd\'hui' : 'Closed for today',
      nextAvailable: getNextAvailableTime(schedule.hours, currentDay)
    };
  };

  const getNextAvailableTime = (hours: any, currentDay: string): string => {
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDayIndex = dayNames.indexOf(currentDay);
    
    for (let i = 1; i <= 7; i++) {
      const nextDayIndex = (currentDayIndex + i) % 7;
      const nextDay = dayNames[nextDayIndex];
      if (hours[nextDay]) {
        const dayLabel = language === 'fr' 
          ? ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'][nextDayIndex]
          : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][nextDayIndex];
        return `${dayLabel} ${hours[nextDay].start}`;
      }
    }
    return '';
  };

  const getChannelStatus = (channel: any) => {
    const availability = checkAvailability(channel);
    
    if (availability.isAvailable) {
      return {
        dot: 'bg-green-500',
        text: language === 'fr' ? 'Disponible' : 'Available',
        icon: CheckCircleIcon,
        color: 'text-green-500'
      };
    }

    if (availability.reason?.includes('plan')) {
      return {
        dot: 'bg-yellow-500',
        text: availability.reason,
        icon: LockClosedIcon,
        color: 'text-yellow-500'
      };
    }

    return {
      dot: 'bg-red-500',
      text: availability.reason || (language === 'fr' ? 'Indisponible' : 'Unavailable'),
      icon: XCircleIcon,
      color: 'text-red-500'
    };
  };

  const translations = {
    en: {
      title: "Support Channels",
      subtitle: "Choose the channel that works best for you",
      responseTime: "Response Time",
      availability: "Availability",
      getSupport: "Get Support",
      currentTime: "Current time"
    },
    fr: {
      title: "Canaux de Support",
      subtitle: "Choisissez le canal qui vous convient le mieux",
      responseTime: "Temps de réponse",
      availability: "Disponibilité",
      getSupport: "Obtenir du support",
      currentTime: "Heure actuelle"
    }
  };

  const t = translations[language] || translations.en;

  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">{t.title}</h2>
          <p className="text-zinc-500 max-w-2xl mx-auto mb-4">{t.subtitle}</p>
          <p className="text-sm text-zinc-600">
            {t.currentTime}: {currentTime.toUTCString()}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {channelsConfig.channels.map((channel) => {
            const Icon = iconMap[channel.icon as keyof typeof iconMap];
            const availability = checkAvailability(channel);
            const status = getChannelStatus(channel);
            const StatusIcon = status.icon;

            return (
              <div
                key={channel.id}
                className={`group relative bg-zinc-950/50 backdrop-blur-sm border rounded-2xl p-6 transition-all duration-300 flex flex-col ${
                  availability.isAvailable 
                    ? 'border-zinc-800/50 hover:border-cyan-500/30 hover:bg-zinc-950/70' 
                    : 'border-zinc-900/50 opacity-75'
                }`}
              >
                {/* Status indicator */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${status.dot} ${
                    availability.isAvailable ? 'animate-pulse' : ''
                  }`} />
                  <StatusIcon className={`w-4 h-4 ${status.color}`} />
                </div>

                <Icon className={`w-12 h-12 mb-4 ${
                  availability.isAvailable ? 'text-cyan-500' : 'text-zinc-600'
                }`} />

                <h3 className="text-xl font-semibold text-white mb-2">
                  {channel.name}
                </h3>

                <p className="text-zinc-500 text-sm mb-4">
                  {channel.description[language] || channel.description.en}
                </p>

                <ul className="space-y-2 mb-4 flex-grow">
                  {channel.features.map((feature: any, idx: number) => (
                    <li key={idx} className="text-zinc-400 text-sm flex items-start">
                      <CheckCircleIcon className={`w-4 h-4 mr-2 mt-0.5 flex-shrink-0 ${
                        availability.isAvailable ? 'text-green-500' : 'text-zinc-600'
                      }`} />
                      {feature[language] || feature.en}
                    </li>
                  ))}
                </ul>

                <div className="space-y-2 mb-4 pt-4 border-t border-zinc-800">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-600">{t.responseTime}:</span>
                    <span className="text-zinc-400">
                      {channel.responseTime.value} {channel.responseTime.unit[language] || channel.responseTime.unit.en}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-600">{t.availability}:</span>
                    <span className={`${status.color} text-right`}>
                      {status.text}
                    </span>
                  </div>
                  {availability.nextAvailable && (
                    <div className="text-xs text-zinc-500 text-right">
                      Next: {availability.nextAvailable}
                    </div>
                  )}
                </div>

                {availability.isAvailable ? (
                  channel.url.startsWith('mailto:') || channel.url.startsWith('tel:') ? (
                    <a
                      href={channel.url}
                      className="block w-full py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-500 text-center rounded-lg transition-colors border border-cyan-500/30"
                    >
                      {t.getSupport}
                    </a>
                  ) : (
                    <Link
                      href={channel.url}
                      className="block w-full py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-500 text-center rounded-lg transition-colors border border-cyan-500/30"
                    >
                      {t.getSupport}
                    </Link>
                  )
                ) : (
                  <div className="w-full py-2 bg-zinc-900/50 text-zinc-600 text-center rounded-lg text-sm border border-zinc-800">
                    {availability.reason}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
