'use client';

// /workspaces/website/apps/web/app/[locale]/careers/spontaneous/SpontaneousApplicationClient.tsx
// Description: Client component for spontaneous job applications
// Last modified: 2025-09-14
// Related docs: /docs/JOURNAL.md

import { useState } from 'react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import Header from '../../../../components/layout/Header';
import Footer from '../../../../components/layout/Footer';
import SophisticatedBackground from '../../../../components/animations/SophisticatedBackground';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Upload, Send, Check, AlertCircle,
  Star, Rocket, Heart, Users, Globe, Zap
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SpontaneousApplicationClientProps {
  locale: string;
}

export default function SpontaneousApplicationClient({ locale }: SpontaneousApplicationClientProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const isEn = locale === 'en';

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    portfolio: '',
    position: '',
    expertise: '',
    experience: '',
    salary: '',
    availability: '',
    location: '',
    motivation: '',
    skills: '',
    languages: '',
    achievements: '',
    references: false,
    gdprConsent: false
  });

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const expertiseAreas = isEn ? [
    'DevOps / Infrastructure',
    'Backend Development',
    'Frontend Development',
    'Full Stack Development',
    'GPU / AI / ML',
    'Cloud Architecture',
    'Security Engineering',
    'Data Engineering',
    'Product Management',
    'Sales / Business Development',
    'Marketing / Growth',
    'Customer Success',
    'Other'
  ] : [
    'DevOps / Infrastructure',
    'Développement Backend',
    'Développement Frontend',
    'Développement Full Stack',
    'GPU / IA / ML',
    'Architecture Cloud',
    'Ingénierie Sécurité',
    'Ingénierie Data',
    'Product Management',
    'Sales / Business Development',
    'Marketing / Growth',
    'Customer Success',
    'Autre'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'cv' | 'portfolio') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert(isEn ? 'File size must be less than 10MB' : 'Le fichier doit faire moins de 10Mo');
        return;
      }
      if (type === 'cv') {
        setCvFile(file);
      } else {
        setPortfolioFile(file);
      }
    }
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
      // Créer un objet JSON pour l'envoi
      const jsonData = {
        // Email requis pour Formspree
        email: formData.email,

        // Identifiant et type pour le tri
        jobId: 'spontaneous',
        type: 'spontaneous',
        _subject: `[SPONTANEOUS] ${formData.position || 'General Application'} - ${formData.firstName} ${formData.lastName}`,

        // Informations personnelles
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || 'Non fourni',

        // Liens professionnels
        linkedin: formData.linkedin || 'Non fourni',
        github: formData.github || 'Non fourni',
        portfolio: formData.portfolio || 'Non fourni',

        // Position souhaitée
        desiredPosition: formData.position || 'Non spécifié',
        expertise: formData.expertise || 'Non spécifié',

        // Informations professionnelles
        yearsExperience: formData.experience || 'Non spécifié',
        salaryExpectations: formData.salary || 'Non spécifié',
        availability: formData.availability || 'Non spécifié',
        currentLocation: formData.location || 'Non spécifié',

        // Motivation et compétences
        motivation: formData.motivation || 'Non fourni',
        keySkills: formData.skills || 'Non spécifié',
        languages: formData.languages || 'Non spécifié',
        achievements: formData.achievements || 'Non fourni',

        // Consentements
        canProvideReferences: formData.references ? 'Oui' : 'Non',
        gdprConsent: formData.gdprConsent ? 'Oui' : 'Non',

        // Info sur les fichiers
        cvAttached: cvFile ? `Oui - ${cvFile.name}` : 'Non',
        portfolioAttached: portfolioFile ? `Oui - ${portfolioFile.name}` : 'Non',

        // Metadata
        submittedAt: new Date().toISOString(),
        locale: locale
      };

      console.log('Sending spontaneous application to Formspree:', jsonData);

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
        setTimeout(() => {
          router.push(`/${locale}/careers`);
        }, 3000);
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

  const reasons = [
    {
      icon: Rocket,
      title: isEn ? 'Innovation First' : 'Innovation d\'Abord',
      description: isEn
        ? 'Work on cutting-edge cloud technology'
        : 'Travaillez sur des technologies cloud de pointe'
    },
    {
      icon: Globe,
      title: isEn ? '100% Remote' : '100% Remote',
      description: isEn
        ? 'Work from anywhere in the world'
        : 'Travaillez de n\'importe où dans le monde'
    },
    {
      icon: Heart,
      title: isEn ? 'Passionate Team' : 'Équipe Passionnée',
      description: isEn
        ? 'Join people who love what they do'
        : 'Rejoignez des gens qui aiment ce qu\'ils font'
    },
    {
      icon: Zap,
      title: isEn ? 'Fast Growth' : 'Croissance Rapide',
      description: isEn
        ? 'Evolve quickly with real impact'
        : 'Évoluez rapidement avec un vrai impact'
    }
  ];

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

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl lg:text-6xl font-extralight text-white mb-6">
              {isEn ? 'Spontaneous Application' : 'Candidature Spontanée'}
            </h1>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              {isEn
                ? 'Don\'t see a perfect match in our open positions? We\'re always looking for exceptional talents. Tell us what you can bring to VMCloud.'
                : 'Pas de match parfait dans nos postes ouverts ? Nous recherchons toujours des talents exceptionnels. Dites-nous ce que vous pouvez apporter à VMCloud.'}
            </p>
          </motion.div>

          {/* Why Join Us */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {reasons.map((reason, index) => (
                <div
                  key={index}
                  className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 p-6 hover:border-zinc-700/50 transition-all"
                >
                  <reason.icon className="w-8 h-8 text-zinc-600 mb-3" />
                  <h3 className="text-lg font-light text-white mb-2">{reason.title}</h3>
                  <p className="text-sm text-zinc-400">{reason.description}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Application Form */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 p-8 lg:p-12">
              <AnimatePresence mode="wait">
                {submitStatus === 'success' ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16"
                  >
                    <Check className="w-20 h-20 text-green-500 mx-auto mb-6" />
                    <h2 className="text-3xl font-light text-white mb-4">
                      {isEn ? 'Application Sent Successfully!' : 'Candidature Envoyée avec Succès !'}
                    </h2>
                    <p className="text-zinc-400">
                      {isEn
                        ? 'We\'ll review your application and get back to you soon if there\'s a match.'
                        : 'Nous examinerons votre candidature et vous contacterons bientôt s\'il y a une correspondance.'}
                    </p>
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
                        ? 'Please try again later or contact us directly at contact@vmcloud.fr'
                        : 'Veuillez réessayer plus tard ou nous contacter directement à contact@vmcloud.fr'}
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
                    {/* Personal Information */}
                    <div>
                      <h3 className="text-xl font-light text-white mb-6">
                        {isEn ? 'Personal Information' : 'Informations Personnelles'}
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <input
                          type="text"
                          name="firstName"
                          placeholder={isEn ? 'First Name *' : 'Prénom *'}
                          required
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="px-4 py-3 bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                        />
                        <input
                          type="text"
                          name="lastName"
                          placeholder={isEn ? 'Last Name *' : 'Nom *'}
                          required
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="px-4 py-3 bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                        />
                        <input
                          type="email"
                          name="email"
                          placeholder={isEn ? 'Email *' : 'Email *'}
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="px-4 py-3 bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                        />
                        <input
                          type="tel"
                          name="phone"
                          placeholder={isEn ? 'Phone' : 'Téléphone'}
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="px-4 py-3 bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                        />
                        <input
                          type="url"
                          name="linkedin"
                          placeholder="LinkedIn URL"
                          value={formData.linkedin}
                          onChange={handleInputChange}
                          className="px-4 py-3 bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                        />
                        <input
                          type="url"
                          name="github"
                          placeholder="GitHub URL"
                          value={formData.github}
                          onChange={handleInputChange}
                          className="px-4 py-3 bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                        />
                        <input
                          type="url"
                          name="portfolio"
                          placeholder={isEn ? 'Portfolio / Website' : 'Portfolio / Site Web'}
                          value={formData.portfolio}
                          onChange={handleInputChange}
                          className="px-4 py-3 bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                        />
                        <input
                          type="text"
                          name="location"
                          placeholder={isEn ? 'Current Location' : 'Localisation Actuelle'}
                          value={formData.location}
                          onChange={handleInputChange}
                          className="px-4 py-3 bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                        />
                      </div>
                    </div>

                    {/* Professional Information */}
                    <div>
                      <h3 className="text-xl font-light text-white mb-6">
                        {isEn ? 'Professional Information' : 'Informations Professionnelles'}
                      </h3>
                      <div className="space-y-6">
                        <input
                          type="text"
                          name="position"
                          placeholder={isEn ? 'Desired Position *' : 'Poste Souhaité *'}
                          required
                          value={formData.position}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                        />

                        <select
                          name="expertise"
                          required
                          value={formData.expertise}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 text-white focus:outline-none focus:border-zinc-600"
                        >
                          <option value="">
                            {isEn ? 'Select Area of Expertise *' : 'Sélectionnez Domaine d\'Expertise *'}
                          </option>
                          {expertiseAreas.map((area) => (
                            <option key={area} value={area}>{area}</option>
                          ))}
                        </select>

                        <div className="grid md:grid-cols-2 gap-6">
                          <input
                            type="text"
                            name="experience"
                            placeholder={isEn ? 'Years of Experience' : 'Années d\'Expérience'}
                            value={formData.experience}
                            onChange={handleInputChange}
                            className="px-4 py-3 bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                          />
                          <input
                            type="text"
                            name="salary"
                            placeholder={isEn ? 'Salary Expectations (€)' : 'Prétentions Salariales (€)'}
                            value={formData.salary}
                            onChange={handleInputChange}
                            className="px-4 py-3 bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                          />
                        </div>

                        <input
                          type="text"
                          name="availability"
                          placeholder={isEn ? 'Availability (e.g., Immediately, 2 weeks)' : 'Disponibilité (ex: Immédiatement, 2 semaines)'}
                          value={formData.availability}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                        />

                        <textarea
                          name="skills"
                          placeholder={isEn ? 'Key Skills (comma separated)' : 'Compétences Clés (séparées par des virgules)'}
                          rows={3}
                          value={formData.skills}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 resize-none"
                        />

                        <input
                          type="text"
                          name="languages"
                          placeholder={isEn ? 'Languages Spoken' : 'Langues Parlées'}
                          value={formData.languages}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                        />
                      </div>
                    </div>

                    {/* Motivation */}
                    <div>
                      <h3 className="text-xl font-light text-white mb-6">
                        {isEn ? 'Your Motivation' : 'Votre Motivation'}
                      </h3>
                      <div className="space-y-6">
                        <textarea
                          name="motivation"
                          placeholder={isEn
                            ? 'Why do you want to join VMCloud? What unique value can you bring? *'
                            : 'Pourquoi voulez-vous rejoindre VMCloud ? Quelle valeur unique pouvez-vous apporter ? *'}
                          rows={6}
                          required
                          value={formData.motivation}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 resize-none"
                        />

                        <textarea
                          name="achievements"
                          placeholder={isEn
                            ? 'Tell us about your proudest professional achievements'
                            : 'Parlez-nous de vos réalisations professionnelles dont vous êtes le plus fier'}
                          rows={4}
                          value={formData.achievements}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 resize-none"
                        />
                      </div>
                    </div>

                    {/* Files */}
                    <div>
                      <h3 className="text-xl font-light text-white mb-6">
                        {isEn ? 'Documents' : 'Documents'}
                      </h3>
                      <div className="space-y-4">
                        <div className="relative">
                          <input
                            type="file"
                            id="cv-upload"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => handleFileChange(e, 'cv')}
                            className="hidden"
                          />
                          <label
                            htmlFor="cv-upload"
                            className="w-full px-4 py-4 bg-zinc-800/50 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors cursor-pointer flex items-center justify-center"
                          >
                            <Upload className="w-5 h-5 mr-3" />
                            {cvFile ? cvFile.name : (isEn ? 'Upload CV/Resume (PDF, DOC) *' : 'Télécharger CV (PDF, DOC) *')}
                          </label>
                        </div>

                        <div className="relative">
                          <input
                            type="file"
                            id="portfolio-upload"
                            accept=".pdf,.zip"
                            onChange={(e) => handleFileChange(e, 'portfolio')}
                            className="hidden"
                          />
                          <label
                            htmlFor="portfolio-upload"
                            className="w-full px-4 py-4 bg-zinc-800/50 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors cursor-pointer flex items-center justify-center"
                          >
                            <Upload className="w-5 h-5 mr-3" />
                            {portfolioFile
                              ? portfolioFile.name
                              : (isEn ? 'Upload Portfolio (Optional, PDF/ZIP)' : 'Télécharger Portfolio (Optionnel, PDF/ZIP)')}
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Consent */}
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          name="gdprConsent"
                          id="gdpr"
                          required
                          checked={formData.gdprConsent}
                          onChange={handleInputChange}
                          className="mt-1 mr-3"
                        />
                        <label htmlFor="gdpr" className="text-sm text-zinc-400">
                          {isEn
                            ? 'I agree to the processing of my personal data for recruitment purposes in accordance with VMCloud\'s privacy policy.'
                            : 'J\'accepte le traitement de mes données personnelles à des fins de recrutement conformément à la politique de confidentialité de VMCloud.'}
                        </label>
                      </div>

                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          name="references"
                          id="references"
                          checked={formData.references}
                          onChange={handleInputChange}
                          className="mt-1 mr-3"
                        />
                        <label htmlFor="references" className="text-sm text-zinc-400">
                          {isEn
                            ? 'I can provide professional references upon request'
                            : 'Je peux fournir des références professionnelles sur demande'}
                        </label>
                      </div>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-center pt-8">
                      <motion.button
                        type="submit"
                        disabled={isSubmitting || !cvFile}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-12 py-4 bg-white text-zinc-950 hover:bg-zinc-100 transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <span className="text-sm tracking-wide font-medium">
                            {isEn ? 'Sending...' : 'Envoi...'}
                          </span>
                        ) : (
                          <>
                            <Send className="w-5 h-5 mr-3" />
                            <span className="text-sm tracking-wide font-medium">
                              {isEn ? 'Send Application' : 'Envoyer Candidature'}
                            </span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </form>
                )}
              </AnimatePresence>
            </div>
          </motion.section>
        </div>
      </main>

      <Footer />
    </>
  );
}