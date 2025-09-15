'use client';

// /workspaces/website/apps/web/app/[locale]/careers/[id]/JobDetailPageClient.tsx
// Description: Client component for job detail page with application form
// Last modified: 2025-09-14
// Related docs: /docs/JOURNAL.md

import { useState, useEffect } from 'react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import Header from '../../../../components/layout/Header';
import Footer from '../../../../components/layout/Footer';
import SophisticatedBackground from '../../../../components/animations/SophisticatedBackground';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, MapPin, Clock, Euro, Users, Briefcase,
  Check, ChevronRight, Upload, Send, AlertCircle,
  Globe, Shield, Rocket, Star, Code, Server,
  Target, Heart, Zap, Award, BookOpen, Cpu,
  GitBranch, Database, Cloud, Terminal, Activity,
  CheckCircle, XCircle, Loader2, Sparkles, PartyPopper,
  Calendar, TrendingUp, Building, GraduationCap, Coffee
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';

interface JobPosition {
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
  missions?: string[];
  profile?: string[];
  process?: string[];
  techStack?: {
    [key: string]: string[];
  };
}

interface JobDetailPageClientProps {
  job: JobPosition;
  locale: string;
}

export default function JobDetailPageClient({ job, locale }: JobDetailPageClientProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const isEn = locale === 'en';

  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'apply'>('overview');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    portfolio: '',
    coverLetter: '',
    experience: '',
    salary: '',
    availability: '',
    location: '',
    whyUs: '',
    references: false,
    gdprConsent: false
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert(isEn ? 'File size must be less than 5MB' : 'Le fichier doit faire moins de 5Mo');
        return;
      }
      setCvFile(file);
    }
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation de l'email côté client
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert(isEn ? 'Please enter a valid email address' : 'Veuillez entrer une adresse email valide');
      return;
    }

    // Validation du CV requis
    if (!cvFile) {
      alert(isEn ? 'Please upload your CV' : 'Veuillez télécharger votre CV');
      return;
    }

    setIsSubmitting(true);

    try {
      // Créer un objet JSON pour l'envoi (sans fichier pour le moment)
      const jsonData = {
        // Email requis pour Formspree
        email: formData.email,

        // Sujet personnalisé
        _subject: `Nouvelle candidature - ${job.title} (${job.id})`,

        // Informations du poste
        jobId: job.id,
        jobTitle: job.title,
        jobTeam: job.team,
        jobLocation: job.location,
        jobSalary: `${Math.floor(job.salaryMin/1000)}-${Math.floor(job.salaryMax/1000)}K€`,
        jobType: job.type,
        jobContract: job.contractType,
        jobLevel: job.level,

        // Informations personnelles
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || 'Non fourni',

        // Liens professionnels
        linkedin: formData.linkedin || 'Non fourni',
        github: formData.github || 'Non fourni',
        portfolio: formData.portfolio || 'Non fourni',

        // Informations professionnelles
        experience: formData.experience || 'Non spécifié',
        salaryExpectations: formData.salary || 'Non spécifié',
        availability: formData.availability || 'Non spécifié',
        currentLocation: formData.location || 'Non spécifié',

        // Motivation
        whyUs: formData.whyUs || 'Non fourni',
        coverLetter: formData.coverLetter || 'Non fourni',

        // Consentements
        references: formData.references ? 'Oui' : 'Non',
        gdprConsent: formData.gdprConsent ? 'Oui' : 'Non',

        // Info sur le CV
        cvAttached: cvFile ? `Oui - ${cvFile.name}` : 'Non'
      };

      console.log('Sending to Formspree:', jsonData);

      // Envoyer à Formspree en JSON
      const response = await fetch('https://formspree.io/f/xwpnjvqp', {
        method: 'POST',
        body: JSON.stringify(jsonData),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      const responseData = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        triggerConfetti();
        setTimeout(() => {
          router.push(`/${locale}/careers`);
        }, 5000);
      } else {
        console.error('Formspree response:', responseData);
        if (responseData.errors) {
          console.error('Formspree validation errors:', responseData.errors);
        }
        throw new Error('Application failed');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'infrastructure': return Server;
      case 'engineering': return Code;
      case 'gpu': return Rocket;
      case 'security': return Shield;
      case 'ai': return Star;
      default: return Briefcase;
    }
  };

  const CategoryIcon = getCategoryIcon(job.category);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'junior': return 'text-green-400 border-green-800/50 bg-green-900/20';
      case 'mid':
      case 'junior-mid': return 'text-blue-400 border-blue-800/50 bg-blue-900/20';
      case 'senior': return 'text-purple-400 border-purple-800/50 bg-purple-900/20';
      case 'mid-senior': return 'text-indigo-400 border-indigo-800/50 bg-indigo-900/20';
      default: return 'text-zinc-400 border-zinc-700/50 bg-zinc-800/50';
    }
  };

  return (
    <>
      <Header />
      <SophisticatedBackground />

      <main className="relative min-h-screen bg-zinc-950 pt-20 lg:pt-28">
        <div className="container mx-auto px-8 py-12">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link
              href={`/${locale}/careers`}
              className="inline-flex items-center text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {isEn ? 'Back to Careers' : 'Retour aux Carrières'}
            </Link>
          </div>

          {/* Job Header Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 bg-gradient-to-br from-zinc-900/50 via-zinc-900/30 to-transparent border border-zinc-800/50 p-8 lg:p-12"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <CategoryIcon className="w-10 h-10 text-zinc-600" />
                  <span className="text-sm text-zinc-500 uppercase tracking-wider">{job.team}</span>
                  <span className={`px-3 py-1 text-xs font-medium uppercase tracking-wider border ${getLevelColor(job.level)}`}>
                    {job.level}
                  </span>
                </div>
                <h1 className="text-4xl lg:text-6xl font-extralight text-white mb-4">{job.title}</h1>
                <p className="text-xl text-zinc-300 leading-relaxed max-w-4xl">{job.description}</p>
              </div>
            </div>

            {/* Key Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-10">
              <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800/50 p-4 text-center">
                <Euro className="w-5 h-5 text-zinc-500 mx-auto mb-2" />
                <div className="text-lg font-medium text-white">
                  {`${Math.floor(job.salaryMin/1000)}-${Math.floor(job.salaryMax/1000)}K€`}
                </div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider">
                  {isEn ? 'Salary Range' : 'Salaire'}
                </div>
              </div>
              <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800/50 p-4 text-center">
                <MapPin className="w-5 h-5 text-zinc-500 mx-auto mb-2" />
                <div className="text-lg font-medium text-white">{job.location}</div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider">
                  {isEn ? 'Location' : 'Localisation'}
                </div>
              </div>
              <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800/50 p-4 text-center">
                <Briefcase className="w-5 h-5 text-zinc-500 mx-auto mb-2" />
                <div className="text-lg font-medium text-white">{job.contractType}</div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider">
                  {isEn ? 'Contract' : 'Contrat'}
                </div>
              </div>
              <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800/50 p-4 text-center">
                <Clock className="w-5 h-5 text-zinc-500 mx-auto mb-2" />
                <div className="text-lg font-medium text-white">
                  {job.type === 'fulltime' ? (isEn ? 'Full Time' : 'Temps Plein') : job.type}
                </div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider">
                  {isEn ? 'Type' : 'Type'}
                </div>
              </div>
              <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800/50 p-4 text-center">
                <Calendar className="w-5 h-5 text-zinc-500 mx-auto mb-2" />
                <div className="text-lg font-medium text-white">ASAP</div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider">
                  {isEn ? 'Start Date' : 'Début'}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tabs Navigation */}
          <div className="flex gap-1 mb-8 border-b border-zinc-800">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 text-sm font-medium transition-all ${
                activeTab === 'overview'
                  ? 'text-white border-b-2 border-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {isEn ? 'Overview' : 'Vue d\'ensemble'}
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`px-6 py-3 text-sm font-medium transition-all ${
                activeTab === 'details'
                  ? 'text-white border-b-2 border-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {isEn ? 'Details & Tech' : 'Détails & Tech'}
            </button>
            <button
              onClick={() => setActiveTab('apply')}
              className={`px-6 py-3 text-sm font-medium transition-all ${
                activeTab === 'apply'
                  ? 'text-white border-b-2 border-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {isEn ? 'Apply Now' : 'Postuler'}
            </button>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid lg:grid-cols-3 gap-8"
              >
                <div className="lg:col-span-2 space-y-10">
                  {/* Missions */}
                  {job.missions && job.missions.length > 0 && (
                    <section>
                      <h2 className="text-2xl font-light text-white mb-6 flex items-center">
                        <Target className="w-6 h-6 mr-3 text-zinc-500" />
                        {isEn ? 'Your Missions' : 'Vos Missions'}
                      </h2>
                      <div className="space-y-3">
                        {job.missions.map((mission, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start bg-zinc-900/30 border border-zinc-800/50 p-4 hover:border-zinc-700/50 transition-all"
                          >
                            <Zap className="w-5 h-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-zinc-300">{mission}</span>
                          </motion.div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Requirements */}
                  <section>
                    <h2 className="text-2xl font-light text-white mb-6 flex items-center">
                      <CheckCircle className="w-6 h-6 mr-3 text-zinc-500" />
                      {isEn ? 'Requirements' : 'Exigences'}
                    </h2>
                    <div className="grid gap-3">
                      {job.requirements.map((req, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-start"
                        >
                          <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-zinc-300">{req}</span>
                        </motion.div>
                      ))}
                    </div>
                  </section>

                  {/* Ideal Profile */}
                  {job.profile && job.profile.length > 0 && (
                    <section>
                      <h2 className="text-2xl font-light text-white mb-6 flex items-center">
                        <GraduationCap className="w-6 h-6 mr-3 text-zinc-500" />
                        {isEn ? 'Ideal Profile' : 'Profil Idéal'}
                      </h2>
                      <div className="grid gap-3">
                        {job.profile.map((trait, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-start"
                          >
                            <Heart className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-zinc-300">{trait}</span>
                          </motion.div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>

                <div className="space-y-8">
                  {/* Benefits */}
                  <section className="bg-zinc-900/30 backdrop-blur border border-zinc-800/50 p-6">
                    <h3 className="text-xl font-light text-white mb-4 flex items-center">
                      <Star className="w-5 h-5 mr-2 text-zinc-500" />
                      {isEn ? 'Benefits' : 'Avantages'}
                    </h3>
                    <div className="space-y-3">
                      {job.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-start">
                          <Award className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-zinc-300">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Recruitment Process */}
                  {job.process && job.process.length > 0 && (
                    <section className="bg-zinc-900/30 backdrop-blur border border-zinc-800/50 p-6">
                      <h3 className="text-xl font-light text-white mb-4 flex items-center">
                        <Activity className="w-5 h-5 mr-2 text-zinc-500" />
                        {isEn ? 'Recruitment Process' : 'Processus de Recrutement'}
                      </h3>
                      <div className="space-y-3">
                        {job.process.map((step, index) => (
                          <div key={index} className="flex items-start">
                            <div className="w-6 h-6 rounded-full bg-zinc-800 text-white text-xs flex items-center justify-center mr-3 flex-shrink-0">
                              {index + 1}
                            </div>
                            <span className="text-sm text-zinc-300">{step}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Quick Apply CTA */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gradient-to-br from-white to-zinc-100 p-6 text-center cursor-pointer"
                    onClick={() => setActiveTab('apply')}
                  >
                    <Sparkles className="w-8 h-8 text-zinc-900 mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-zinc-900 mb-2">
                      {isEn ? 'Ready to Apply?' : 'Prêt à Postuler ?'}
                    </h3>
                    <p className="text-zinc-700 text-sm mb-4">
                      {isEn
                        ? 'Join us and shape the future of cloud infrastructure'
                        : 'Rejoignez-nous et façonnez l\'avenir du cloud'}
                    </p>
                    <div className="inline-flex items-center text-zinc-900 font-medium">
                      {isEn ? 'Apply Now' : 'Postuler Maintenant'}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {activeTab === 'details' && (
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-10"
              >
                {/* Skills Required */}
                <section>
                  <h2 className="text-2xl font-light text-white mb-6 flex items-center">
                    <Code className="w-6 h-6 mr-3 text-zinc-500" />
                    {isEn ? 'Technical Skills Required' : 'Compétences Techniques Requises'}
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {job.skills.map((skill, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        className="px-4 py-2 bg-zinc-900/50 border border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white transition-all cursor-default"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </section>

                {/* Tech Stack */}
                {job.techStack && (
                  <section>
                    <h2 className="text-2xl font-light text-white mb-6 flex items-center">
                      <Terminal className="w-6 h-6 mr-3 text-zinc-500" />
                      {isEn ? 'Our Tech Stack' : 'Notre Stack Technique'}
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Object.entries(job.techStack).map(([category, techs], index) => (
                        <motion.div
                          key={category}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-zinc-900/30 border border-zinc-800/50 p-6 hover:border-zinc-700/50 transition-all"
                        >
                          <h3 className="text-lg font-light text-white mb-4 capitalize flex items-center">
                            {category === 'cloud' && <Cloud className="w-5 h-5 mr-2 text-zinc-500" />}
                            {category === 'orchestration' && <Server className="w-5 h-5 mr-2 text-zinc-500" />}
                            {category === 'ci' && <GitBranch className="w-5 h-5 mr-2 text-zinc-500" />}
                            {category === 'monitoring' && <Activity className="w-5 h-5 mr-2 text-zinc-500" />}
                            {category === 'iac' && <Cpu className="w-5 h-5 mr-2 text-zinc-500" />}
                            {category === 'languages' && <Code className="w-5 h-5 mr-2 text-zinc-500" />}
                            {category === 'databases' && <Database className="w-5 h-5 mr-2 text-zinc-500" />}
                            {category}
                          </h3>
                          <div className="space-y-2">
                            {techs.map((tech, techIndex) => (
                              <div key={techIndex} className="text-sm text-zinc-400">
                                • {tech}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Company Culture */}
                <section className="bg-gradient-to-br from-zinc-900/50 via-zinc-900/30 to-transparent border border-zinc-800/50 p-8">
                  <h2 className="text-2xl font-light text-white mb-6 flex items-center">
                    <Building className="w-6 h-6 mr-3 text-zinc-500" />
                    {isEn ? 'Why Join VMCloud?' : 'Pourquoi Rejoindre VMCloud ?'}
                  </h2>
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center">
                      <Rocket className="w-10 h-10 text-zinc-500 mx-auto mb-3" />
                      <h3 className="text-lg font-light text-white mb-2">
                        {isEn ? 'Innovation' : 'Innovation'}
                      </h3>
                      <p className="text-sm text-zinc-400">
                        {isEn
                          ? 'Work on cutting-edge cloud technology'
                          : 'Travaillez sur des technologies de pointe'}
                      </p>
                    </div>
                    <div className="text-center">
                      <Globe className="w-10 h-10 text-zinc-500 mx-auto mb-3" />
                      <h3 className="text-lg font-light text-white mb-2">
                        {isEn ? 'Remote First' : 'Remote First'}
                      </h3>
                      <p className="text-sm text-zinc-400">
                        {isEn
                          ? 'Work from anywhere in the world'
                          : 'Travaillez de n\'importe où'}
                      </p>
                    </div>
                    <div className="text-center">
                      <TrendingUp className="w-10 h-10 text-zinc-500 mx-auto mb-3" />
                      <h3 className="text-lg font-light text-white mb-2">
                        {isEn ? 'Growth' : 'Croissance'}
                      </h3>
                      <p className="text-sm text-zinc-400">
                        {isEn
                          ? 'Fast career progression opportunities'
                          : 'Évolution rapide de carrière'}
                      </p>
                    </div>
                  </div>
                  <p className="text-zinc-300 text-center max-w-3xl mx-auto">
                    {isEn
                      ? 'VMCloud is building the future of European cloud infrastructure. We\'re a team of passionate engineers, designers, and innovators who believe in the power of technology to transform businesses. Join us and be part of something extraordinary.'
                      : 'VMCloud construit l\'avenir de l\'infrastructure cloud européenne. Nous sommes une équipe d\'ingénieurs, de designers et d\'innovateurs passionnés qui croient au pouvoir de la technologie pour transformer les entreprises. Rejoignez-nous et faites partie de quelque chose d\'extraordinaire.'}
                  </p>
                </section>
              </motion.div>
            )}

            {activeTab === 'apply' && (
              <motion.div
                key="apply"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto"
              >
                <div className="bg-zinc-900/30 backdrop-blur border border-zinc-800/50 p-8 lg:p-12">
                  <AnimatePresence mode="wait">
                    {submitStatus === 'success' ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-16"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", duration: 0.5 }}
                        >
                          <PartyPopper className="w-24 h-24 text-yellow-500 mx-auto mb-6" />
                        </motion.div>
                        <h2 className="text-4xl font-light text-white mb-4">
                          {isEn ? 'Application Sent!' : 'Candidature Envoyée !'}
                        </h2>
                        <p className="text-xl text-zinc-300 mb-2">
                          {isEn
                            ? 'Thank you for your interest in joining VMCloud!'
                            : 'Merci de votre intérêt pour rejoindre VMCloud !'}
                        </p>
                        <p className="text-zinc-400">
                          {isEn
                            ? 'We\'ll review your application and get back to you within 2-3 business days.'
                            : 'Nous examinerons votre candidature et vous répondrons sous 2-3 jours ouvrés.'}
                        </p>
                        <div className="mt-8 flex justify-center gap-4">
                          <Link
                            href={`/${locale}/careers`}
                            className="px-6 py-3 bg-white text-zinc-900 hover:bg-zinc-100 transition-all"
                          >
                            {isEn ? 'View Other Positions' : 'Voir d\'Autres Postes'}
                          </Link>
                        </div>
                      </motion.div>
                    ) : submitStatus === 'error' ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                      >
                        <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
                        <h2 className="text-3xl font-light text-white mb-4">
                          {isEn ? 'Something Went Wrong' : 'Une Erreur s\'est Produite'}
                        </h2>
                        <p className="text-zinc-400 mb-6">
                          {isEn
                            ? 'Please try again later or contact us directly at careers@vmcl.fr'
                            : 'Veuillez réessayer plus tard ou nous contacter directement à careers@vmcl.fr'}
                        </p>
                        <button
                          onClick={() => setSubmitStatus('idle')}
                          className="px-6 py-3 border border-zinc-700 text-white hover:border-zinc-500 transition-colors"
                        >
                          {isEn ? 'Try Again' : 'Réessayer'}
                        </button>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                          <h2 className="text-3xl font-light text-white mb-2">
                            {isEn ? 'Apply for' : 'Postuler pour'} {job.title}
                          </h2>
                          <p className="text-zinc-400">
                            {isEn
                              ? 'Fill out the form below and we\'ll get back to you soon.'
                              : 'Remplissez le formulaire ci-dessous et nous vous répondrons rapidement.'}
                          </p>
                        </div>

                        {/* Personal Information */}
                        <div>
                          <h3 className="text-xl font-light text-white mb-6">
                            {isEn ? 'Personal Information' : 'Informations Personnelles'}
                          </h3>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm text-zinc-400 mb-2">
                                {isEn ? 'First Name *' : 'Prénom *'}
                              </label>
                              <input
                                type="text"
                                name="firstName"
                                required
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-zinc-400 mb-2">
                                {isEn ? 'Last Name *' : 'Nom *'}
                              </label>
                              <input
                                type="text"
                                name="lastName"
                                required
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-zinc-400 mb-2">
                                {isEn ? 'Email *' : 'Email *'}
                              </label>
                              <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-zinc-400 mb-2">
                                {isEn ? 'Phone' : 'Téléphone'}
                              </label>
                              <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Professional Links */}
                        <div>
                          <h3 className="text-xl font-light text-white mb-6">
                            {isEn ? 'Professional Links' : 'Liens Professionnels'}
                          </h3>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm text-zinc-400 mb-2">LinkedIn</label>
                              <input
                                type="url"
                                name="linkedin"
                                placeholder="https://linkedin.com/in/..."
                                value={formData.linkedin}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-zinc-400 mb-2">GitHub</label>
                              <input
                                type="url"
                                name="github"
                                placeholder="https://github.com/..."
                                value={formData.github}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm text-zinc-400 mb-2">
                                {isEn ? 'Portfolio / Website' : 'Portfolio / Site Web'}
                              </label>
                              <input
                                type="url"
                                name="portfolio"
                                placeholder="https://..."
                                value={formData.portfolio}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Professional Information */}
                        <div>
                          <h3 className="text-xl font-light text-white mb-6">
                            {isEn ? 'Professional Information' : 'Informations Professionnelles'}
                          </h3>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm text-zinc-400 mb-2">
                                {isEn ? 'Years of Experience' : 'Années d\'Expérience'}
                              </label>
                              <input
                                type="text"
                                name="experience"
                                placeholder={isEn ? 'e.g., 5 years' : 'ex: 5 ans'}
                                value={formData.experience}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-zinc-400 mb-2">
                                {isEn ? 'Salary Expectations (€)' : 'Prétentions Salariales (€)'}
                              </label>
                              <input
                                type="text"
                                name="salary"
                                placeholder={isEn ? 'e.g., 60000' : 'ex: 60000'}
                                value={formData.salary}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-zinc-400 mb-2">
                                {isEn ? 'Availability' : 'Disponibilité'}
                              </label>
                              <input
                                type="text"
                                name="availability"
                                placeholder={isEn ? 'e.g., Immediately' : 'ex: Immédiatement'}
                                value={formData.availability}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-zinc-400 mb-2">
                                {isEn ? 'Current Location' : 'Localisation Actuelle'}
                              </label>
                              <input
                                type="text"
                                name="location"
                                placeholder={isEn ? 'e.g., Paris, France' : 'ex: Paris, France'}
                                value={formData.location}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Motivation */}
                        <div>
                          <h3 className="text-xl font-light text-white mb-6">
                            {isEn ? 'Your Motivation' : 'Votre Motivation'}
                          </h3>
                          <div className="space-y-6">
                            <div>
                              <label className="block text-sm text-zinc-400 mb-2">
                                {isEn ? 'Why do you want to join VMCloud? *' : 'Pourquoi voulez-vous rejoindre VMCloud ? *'}
                              </label>
                              <textarea
                                name="whyUs"
                                required
                                rows={4}
                                value={formData.whyUs}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors resize-none"
                                placeholder={isEn
                                  ? 'Tell us what motivates you about this position and VMCloud...'
                                  : 'Dites-nous ce qui vous motive dans ce poste et chez VMCloud...'}
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-zinc-400 mb-2">
                                {isEn ? 'Cover Letter' : 'Lettre de Motivation'}
                              </label>
                              <textarea
                                name="coverLetter"
                                rows={6}
                                value={formData.coverLetter}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors resize-none"
                                placeholder={isEn
                                  ? 'Optional: Add any additional information you\'d like to share...'
                                  : 'Optionnel : Ajoutez toute information supplémentaire que vous souhaitez partager...'}
                              />
                            </div>
                          </div>
                        </div>

                        {/* CV Upload */}
                        <div>
                          <h3 className="text-xl font-light text-white mb-6">
                            {isEn ? 'Resume / CV' : 'CV'}
                          </h3>
                          <div className="relative">
                            <input
                              type="file"
                              id="cv-upload"
                              accept=".pdf,.doc,.docx"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                            <label
                              htmlFor="cv-upload"
                              className="w-full px-6 py-8 bg-zinc-800/30 border-2 border-dashed border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors cursor-pointer flex flex-col items-center justify-center"
                            >
                              <Upload className="w-8 h-8 mb-3" />
                              <span className="text-lg mb-1">
                                {cvFile ? cvFile.name : (isEn ? 'Upload your CV' : 'Télécharger votre CV')}
                              </span>
                              <span className="text-sm text-zinc-500">
                                {isEn ? 'PDF, DOC, DOCX (max 5MB)' : 'PDF, DOC, DOCX (max 5Mo)'}
                              </span>
                            </label>
                          </div>
                        </div>

                        {/* Consent */}
                        <div className="space-y-4">
                          <label className="flex items-start cursor-pointer">
                            <input
                              type="checkbox"
                              name="references"
                              checked={formData.references}
                              onChange={handleInputChange}
                              className="mt-1 mr-3"
                            />
                            <span className="text-sm text-zinc-400">
                              {isEn
                                ? 'I can provide professional references upon request'
                                : 'Je peux fournir des références professionnelles sur demande'}
                            </span>
                          </label>
                          <label className="flex items-start cursor-pointer">
                            <input
                              type="checkbox"
                              name="gdprConsent"
                              required
                              checked={formData.gdprConsent}
                              onChange={handleInputChange}
                              className="mt-1 mr-3"
                            />
                            <span className="text-sm text-zinc-400">
                              {isEn
                                ? 'I agree to the processing of my personal data for recruitment purposes in accordance with VMCloud\'s privacy policy *'
                                : 'J\'accepte le traitement de mes données personnelles à des fins de recrutement conformément à la politique de confidentialité de VMCloud *'}
                            </span>
                          </label>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center pt-6">
                          <motion.button
                            type="submit"
                            disabled={isSubmitting || !cvFile || !formData.gdprConsent}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-12 py-4 bg-white text-zinc-950 hover:bg-zinc-100 transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                                {isEn ? 'Sending...' : 'Envoi...'}
                              </>
                            ) : (
                              <>
                                <Send className="w-5 h-5 mr-3" />
                                {isEn ? 'Send Application' : 'Envoyer Candidature'}
                              </>
                            )}
                          </motion.button>
                        </div>
                      </form>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </>
  );
}