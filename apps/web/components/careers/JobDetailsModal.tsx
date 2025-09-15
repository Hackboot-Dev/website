// /workspaces/website/apps/web/components/careers/JobDetailsModal.tsx
// Description: Modal component displaying complete job offer details
// Last modified: 2025-09-14
// Related docs: /docs/JOURNAL.md

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  X, MapPin, Clock, Euro, Users, Briefcase, Calendar,
  CheckCircle, Star, Globe, Code, Award, Heart,
  Building, Languages, Target, ArrowRight
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export interface JobOffer {
  id: string;
  title: string;
  team: string;
  category: string;
  level: string;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  type: string;
  location: string;
  contractType: string;
  active: boolean;
  priority: number;
  skills: string[];
  description: string;
  requirements: string[];
  benefits: string[];
  languages?: string[];
  schedule?: string;
  startDate?: string;
  experience?: string;
}

interface JobDetailsModalProps {
  job: JobOffer;
  isOpen: boolean;
  onClose: () => void;
  onApply: (jobId: string) => void;
}

export default function JobDetailsModal({ job, isOpen, onClose, onApply }: JobDetailsModalProps) {
  const { t, language } = useLanguage();
  const isEn = language === 'en';

  if (!isOpen || !job) return null;

  const formatSalary = (min: number, max: number, currency: string) => {
    return `${Math.floor(min/1000)}-${Math.floor(max/1000)}K ${currency}`;
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'junior':
        return 'bg-green-900/30 text-green-400 border-green-800/50';
      case 'mid':
      case 'junior-mid':
        return 'bg-blue-900/30 text-blue-400 border-blue-800/50';
      case 'senior':
        return 'bg-purple-900/30 text-purple-400 border-purple-800/50';
      case 'lead':
      case 'principal':
        return 'bg-orange-900/30 text-orange-400 border-orange-800/50';
      default:
        return 'bg-zinc-800/50 text-zinc-400 border-zinc-700/50';
    }
  };

  const getContractTypeLabel = (type: string) => {
    const labels = {
      'CDI': isEn ? 'Permanent Contract' : 'CDI',
      'CDD': isEn ? 'Fixed Term Contract' : 'CDD',
      'freelance': isEn ? 'Freelance' : 'Freelance',
      'internship': isEn ? 'Internship' : 'Stage',
      'fulltime': isEn ? 'Full Time' : 'Temps Plein',
      'parttime': isEn ? 'Part Time' : 'Temps Partiel'
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-4xl max-h-[90vh] bg-zinc-900 border border-zinc-800 overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-zinc-800/50 to-zinc-900/50 p-8 border-b border-zinc-800 shrink-0">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pr-12">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-light text-white mb-2">{job.title}</h1>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-400">
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {job.team}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {job.location}
                    </span>
                    <span className={`px-3 py-1 border text-xs font-medium uppercase tracking-wider ${getLevelBadgeColor(job.level)}`}>
                      {job.level}
                    </span>
                  </div>
                </div>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center p-4 bg-zinc-800/30 border border-zinc-700/50">
                  <Euro className="w-5 h-5 text-zinc-500 mx-auto mb-2" />
                  <div className="text-sm text-zinc-300 font-medium">{formatSalary(job.salaryMin, job.salaryMax, job.currency)}</div>
                  <div className="text-xs text-zinc-500">{isEn ? 'Annual' : 'Annuel'}</div>
                </div>
                <div className="text-center p-4 bg-zinc-800/30 border border-zinc-700/50">
                  <Briefcase className="w-5 h-5 text-zinc-500 mx-auto mb-2" />
                  <div className="text-sm text-zinc-300 font-medium">{getContractTypeLabel(job.contractType)}</div>
                  <div className="text-xs text-zinc-500">{isEn ? 'Contract' : 'Contrat'}</div>
                </div>
                <div className="text-center p-4 bg-zinc-800/30 border border-zinc-700/50">
                  <Clock className="w-5 h-5 text-zinc-500 mx-auto mb-2" />
                  <div className="text-sm text-zinc-300 font-medium">
                    {job.schedule || (job.type === 'fulltime' ? (isEn ? '40h/week' : '40h/semaine') : job.type)}
                  </div>
                  <div className="text-xs text-zinc-500">{isEn ? 'Schedule' : 'Horaires'}</div>
                </div>
                <div className="text-center p-4 bg-zinc-800/30 border border-zinc-700/50">
                  <Calendar className="w-5 h-5 text-zinc-500 mx-auto mb-2" />
                  <div className="text-sm text-zinc-300 font-medium">
                    {job.startDate || (isEn ? 'ASAP' : 'ASAP')}
                  </div>
                  <div className="text-xs text-zinc-500">{isEn ? 'Start Date' : 'Date de début'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="space-y-8">
              {/* Description */}
              <section>
                <h2 className="text-xl font-light text-white mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-zinc-500" />
                  {isEn ? 'Job Description' : 'Description du Poste'}
                </h2>
                <p className="text-zinc-400 leading-relaxed">{job.description}</p>
              </section>

              {/* Requirements */}
              <section>
                <h2 className="text-xl font-light text-white mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-zinc-500" />
                  {isEn ? 'Requirements' : 'Exigences'}
                </h2>
                <ul className="space-y-3">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start text-zinc-400">
                      <CheckCircle className="w-4 h-4 mr-3 mt-0.5 text-zinc-600 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Skills */}
              <section>
                <h2 className="text-xl font-light text-white mb-4 flex items-center">
                  <Code className="w-5 h-5 mr-2 text-zinc-500" />
                  {isEn ? 'Technical Skills' : 'Compétences Techniques'}
                </h2>
                <div className="flex flex-wrap gap-3">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-zinc-800 text-zinc-300 text-sm border border-zinc-700 hover:border-zinc-600 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>

              {/* Benefits */}
              <section>
                <h2 className="text-xl font-light text-white mb-4 flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-zinc-500" />
                  {isEn ? 'Benefits' : 'Avantages'}
                </h2>
                <ul className="grid md:grid-cols-2 gap-3">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start text-zinc-400">
                      <Star className="w-4 h-4 mr-3 mt-0.5 text-zinc-600 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Languages Required */}
              {job.languages && job.languages.length > 0 && (
                <section>
                  <h2 className="text-xl font-light text-white mb-4 flex items-center">
                    <Languages className="w-5 h-5 mr-2 text-zinc-500" />
                    {isEn ? 'Languages Required' : 'Langues Demandées'}
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {job.languages.map((lang, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-zinc-800/50 text-zinc-300 text-sm border border-zinc-700/50"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Company Culture Note */}
              <section className="bg-gradient-to-r from-zinc-800/30 to-zinc-900/30 p-6 border border-zinc-700/50">
                <h2 className="text-lg font-light text-white mb-3 flex items-center">
                  <Building className="w-5 h-5 mr-2 text-zinc-500" />
                  {isEn ? 'Why VMCloud?' : 'Pourquoi VMCloud ?'}
                </h2>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {isEn
                    ? 'Join a team that values innovation, remote-first culture, and technical excellence. We offer real growth opportunities, cutting-edge projects, and a work environment where your ideas matter.'
                    : 'Rejoignez une équipe qui valorise l\'innovation, la culture remote-first et l\'excellence technique. Nous offrons de vraies opportunités de croissance, des projets de pointe et un environnement de travail où vos idées comptent.'
                  }
                </p>
              </section>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-zinc-800 p-6 bg-zinc-900/50 shrink-0">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="text-sm text-zinc-500">
                {isEn ? 'Position ID:' : 'ID du poste :'} <span className="text-zinc-400 font-mono">{job.id}</span>
              </div>
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="px-6 py-3 border border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:text-white transition-all duration-200"
                >
                  {isEn ? 'Close' : 'Fermer'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onApply(job.id)}
                  className="px-8 py-3 bg-white text-zinc-950 hover:bg-zinc-100 transition-all duration-200 flex items-center font-medium"
                >
                  {isEn ? 'Apply for this Position' : 'Postuler à ce Poste'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
