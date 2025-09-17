'use client';

// /workspaces/website/apps/web/app/[locale]/careers/CareersPageClient.tsx
// Description: Client component for careers page with job listings and culture
// Last modified: 2025-09-13
// Related docs: /docs/JOURNAL.md

import { useLanguage } from '../../../contexts/LanguageContext';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import SophisticatedBackground from '../../../components/animations/SophisticatedBackground';
import { motion } from 'framer-motion';
import {
  Briefcase, MapPin, Clock, Euro, Rocket, Globe, Heart, Users,
  Code, Server, Shield, Cpu, TrendingUp, Star, ChevronRight,
  Zap, Target, Award, Coffee, Gamepad2, Home
} from 'lucide-react';
import Link from 'next/link';
// Import dynamique basé sur la langue
import positionsDataFr from '../../../data/careers/positions-fr.json';
import positionsDataEn from '../../../data/careers/positions-en.json';
import JobDetailsModal, { JobOffer } from '../../../components/careers/JobDetailsModal';
import { useState } from 'react';

export default function CareersPageClient() {
  const { t, language } = useLanguage();
  const isEn = language === 'en';
  const [selectedJob, setSelectedJob] = useState<JobOffer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Charger les bonnes offres selon la langue
  const positionsData = isEn ? positionsDataEn : positionsDataFr;

  const benefits = [
    {
      icon: Home,
      title: t('careers.benefits.remote.title') || (isEn ? 'Remote First' : 'Remote First'),
      description: t('careers.benefits.remote.description') || (isEn ? 'Work from anywhere in the world' : 'Travaillez de n\'importe où dans le monde')
    },
    {
      icon: Euro,
      title: t('careers.benefits.salary.title') || (isEn ? 'Competitive Salary' : 'Salaire Compétitif'),
      description: t('careers.benefits.salary.description') || (isEn ? 'Top market salaries + equity' : 'Salaires top marché + equity')
    },
    {
      icon: Coffee,
      title: t('careers.benefits.flexibility.title') || (isEn ? 'Total Flexibility' : 'Flexibilité Totale'),
      description: t('careers.benefits.flexibility.description') || (isEn ? 'Choose your hours, your tools' : 'Choisissez vos horaires, vos outils')
    },
    {
      icon: Rocket,
      title: t('careers.benefits.growth.title') || (isEn ? 'Fast Growth' : 'Croissance Rapide'),
      description: t('careers.benefits.growth.description') || (isEn ? 'Evolve quickly with real responsibilities' : 'Évoluez rapidement avec de vraies responsabilités')
    },
    {
      icon: Gamepad2,
      title: t('careers.benefits.fun.title') || (isEn ? 'Gaming Culture' : 'Culture Gaming'),
      description: t('careers.benefits.fun.description') || (isEn ? 'Team gaming sessions, latest hardware' : 'Sessions gaming en équipe, matériel dernier cri')
    },
    {
      icon: Heart,
      title: t('careers.benefits.passion.title') || (isEn ? 'Passion Projects' : 'Projets Passion'),
      description: t('careers.benefits.passion.description') || (isEn ? '20% time for personal projects' : '20% du temps pour vos projets personnels')
    }
  ];

  // Extraire les catégories uniques des positions actives
  const allActivePositions = positionsData.positions
    .filter(position => position.active)
    .sort((a, b) => a.priority - b.priority);

  const categories = ['all', ...new Set(allActivePositions.map(pos => pos.category))];

  // Définir les labels de catégories
  const categoryLabels: Record<string, { en: string; fr: string }> = {
    all: { en: 'All Positions', fr: 'Tous les Postes' },
    infrastructure: { en: 'Infrastructure', fr: 'Infrastructure' },
    engineering: { en: 'Engineering', fr: 'Ingénierie' },
    security: { en: 'Security', fr: 'Sécurité' },
    gpu: { en: 'GPU / AI', fr: 'GPU / IA' },
    ai: { en: 'AI / ML', fr: 'IA / ML' },
    product: { en: 'Product', fr: 'Produit' },
    data: { en: 'Data', fr: 'Data' },
    business: { en: 'Business', fr: 'Business' },
    sales: { en: 'Sales', fr: 'Commercial' },
    support: { en: 'Support', fr: 'Support' },
    blockchain: { en: 'Blockchain', fr: 'Blockchain' },
    edge: { en: 'Edge Computing', fr: 'Edge Computing' },
    leadership: { en: 'Leadership', fr: 'Leadership' },
    research: { en: 'Research', fr: 'Recherche' },
    hr: { en: 'HR / People', fr: 'RH / People' }
  };

  // Filtrer les positions selon la catégorie sélectionnée
  const activePositions = selectedCategory === 'all'
    ? allActivePositions
    : allActivePositions.filter(position => position.category === selectedCategory);

  const handleJobClick = (job: any) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  const handleApply = (jobId: string) => {
    // Redirection vers la page de détail du poste
    window.location.href = `/${language}/careers/${jobId}`;
    handleCloseModal();
  };

  return (
    <>
      <Header />
      <SophisticatedBackground />

      <main className="relative min-h-screen bg-zinc-950">
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex items-center overflow-hidden pt-20 lg:pt-28">
          <div className="absolute inset-0">
            <div className="absolute inset-0 opacity-[0.15] bg-noise"></div>
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent"></div>
          </div>

          <div className="container mx-auto px-8 relative z-10">
            <div className="max-w-5xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-8"
              >
                <div className="inline-flex items-center space-x-4 mb-8">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-zinc-600"></div>
                  <span className="text-xs tracking-[0.3em] text-zinc-500 uppercase font-light">
                    {t('careers.label') || (isEn ? 'Join VMCloud' : 'Rejoignez VMCloud')}
                  </span>
                  <div className="h-px w-12 bg-gradient-to-l from-transparent to-zinc-600"></div>
                </div>

                <h1 className="text-5xl lg:text-7xl font-extralight text-white mb-6 tracking-tight">
                  {t('careers.hero.title1') || (isEn ? 'Build the Future' : 'Construisez le Futur')}
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-300 to-zinc-500 mt-2">
                    {t('careers.hero.title2') || (isEn ? 'of Cloud Infrastructure' : 'de l\'Infrastructure Cloud')}
                  </span>
                </h1>

                <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-12 font-light">
                  {t('careers.hero.subtitle') || (isEn
                    ? 'Join our passionate team building next-generation cloud solutions. Remote-first, no bullshit, just pure tech excellence.'
                    : 'Rejoignez notre équipe passionnée qui construit les solutions cloud de nouvelle génération. Remote-first, pas de bullshit, juste l\'excellence technique pure.')}
                </p>

                <div className="flex flex-wrap gap-4 justify-center">
                  <motion.a
                    href="#positions"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center px-8 py-4 bg-white text-zinc-950 hover:bg-zinc-100 transition-all duration-300"
                  >
                    <span className="text-sm tracking-wide font-medium">
                      {t('careers.hero.cta.positions') || (isEn ? 'View Open Positions' : 'Voir les Postes Ouverts')}
                    </span>
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </motion.a>
                  <motion.a
                    href="#culture"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center px-8 py-4 border border-zinc-700 text-white hover:border-zinc-500 transition-all duration-300"
                  >
                    <span className="text-sm tracking-wide">
                      {t('careers.hero.cta.culture') || (isEn ? 'Discover Our Culture' : 'Découvrir Notre Culture')}
                    </span>
                  </motion.a>
                </div>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20"
              >
                {[
                  { value: '15+', label: t('careers.stats.team') || (isEn ? 'Team Members' : 'Membres de l\'Équipe') },
                  { value: '100%', label: t('careers.stats.remote') || (isEn ? 'Remote' : 'Remote') },
                  { value: '7', label: t('careers.stats.nationalities') || (isEn ? 'Nationalities' : 'Nationalités') },
                  { value: '∞', label: t('careers.stats.opportunities') || (isEn ? 'Opportunities' : 'Opportunités') }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl font-extralight text-white mb-2">{stat.value}</div>
                    <div className="text-xs text-zinc-500 uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Why VMCloud Section */}
        <section className="py-32 relative">
          <div className="container mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl lg:text-5xl font-extralight text-white mb-6 tracking-tight">
                {t('careers.why.title') || (isEn ? 'Why VMCloud?' : 'Pourquoi VMCloud ?')}
              </h2>
              <p className="text-zinc-500 max-w-2xl mx-auto">
                {t('careers.why.subtitle') || (isEn
                  ? 'We\'re not just another cloud company. We\'re building something special.'
                  : 'Nous ne sommes pas juste une autre entreprise cloud. Nous construisons quelque chose de spécial.')}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 p-8 hover:border-zinc-700/50 transition-all duration-300 h-full">
                    <benefit.icon className="w-10 h-10 text-zinc-600 mb-4 group-hover:text-zinc-500 transition-colors" />
                    <h3 className="text-xl font-light text-white mb-3">{benefit.title}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section id="positions" className="py-32 relative border-t border-zinc-800/50">
          <div className="container mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl lg:text-5xl font-extralight text-white mb-6 tracking-tight">
                {t('careers.positions.title') || (isEn ? 'Open Positions' : 'Postes Ouverts')}
              </h2>
              <p className="text-zinc-500 max-w-2xl mx-auto">
                {t('careers.positions.subtitle') || (isEn
                  ? 'Ready to join the adventure? Check out our current openings.'
                  : 'Prêt à rejoindre l\'aventure ? Consultez nos ouvertures actuelles.')}
              </p>
            </motion.div>

            {/* Category Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="max-w-5xl mx-auto mb-12"
            >
              <div className="flex flex-wrap gap-3 justify-center">
                {categories.map((category) => {
                  const label = categoryLabels[category]
                    ? (isEn ? categoryLabels[category].en : categoryLabels[category].fr)
                    : category;

                  const count = category === 'all'
                    ? allActivePositions.length
                    : allActivePositions.filter(p => p.category === category).length;

                  return (
                    <motion.button
                      key={category}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCategory(category)}
                      className={`
                        px-6 py-3 transition-all duration-300
                        ${selectedCategory === category
                          ? 'bg-white text-zinc-950 font-medium'
                          : 'bg-zinc-900/30 border border-zinc-800/50 text-zinc-400 hover:border-zinc-700/50 hover:text-white'
                        }
                      `}
                    >
                      <span className="text-sm tracking-wide">
                        {label}
                        <span className="ml-2 opacity-60">({count})</span>
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Résultat du filtre */}
              {selectedCategory !== 'all' && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center mt-6 text-zinc-500 text-sm"
                >
                  {isEn
                    ? `Showing ${activePositions.length} position${activePositions.length !== 1 ? 's' : ''} in ${categoryLabels[selectedCategory]?.en || selectedCategory}`
                    : `Affichage de ${activePositions.length} poste${activePositions.length !== 1 ? 's' : ''} en ${categoryLabels[selectedCategory]?.fr || selectedCategory}`
                  }
                </motion.p>
              )}
            </motion.div>

            <div className="space-y-6 max-w-5xl mx-auto">
              {activePositions.length > 0 ? (
                activePositions.map((position, index) => (
                <motion.div
                  key={position.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 p-8 hover:border-zinc-700/50 transition-all duration-300">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                      <div className="flex-1">
                        <h3 className="text-2xl font-light text-white mb-2 group-hover:text-zinc-100 transition-colors cursor-pointer"
                            onClick={() => handleJobClick(position)}>
                          {position.title}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-sm text-zinc-500 mb-4">
                          <span className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {position.team}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {position.location}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {position.contractType}
                          </span>
                          <span className="flex items-center">
                            <Euro className="w-4 h-4 mr-1" />
                            {`${Math.floor(position.salaryMin/1000)}-${Math.floor(position.salaryMax/1000)}K€`}
                          </span>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleJobClick(position)}
                        className="inline-flex items-center px-6 py-3 bg-white text-zinc-950 hover:bg-zinc-100 transition-all duration-300 mt-4 lg:mt-0"
                      >
                        <span className="text-sm tracking-wide font-medium">
                          {t('careers.positions.viewDetails') || (isEn ? 'View Details' : 'Voir Détails')}
                        </span>
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </motion.button>
                    </div>
                    <p className="text-zinc-400 mb-4">{position.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {position.skills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-3 py-1 bg-zinc-800/50 text-zinc-400 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
                >
                  <Briefcase className="w-16 h-16 text-zinc-700 mx-auto mb-6" />
                  <h3 className="text-2xl font-light text-white mb-4">
                    {isEn
                      ? `No positions available in ${categoryLabels[selectedCategory]?.en || selectedCategory}`
                      : `Aucun poste disponible en ${categoryLabels[selectedCategory]?.fr || selectedCategory}`
                    }
                  </h3>
                  <p className="text-zinc-400 mb-8">
                    {isEn
                      ? 'Check back soon or explore other categories.'
                      : 'Revenez bientôt ou explorez d\'autres catégories.'
                    }
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory('all')}
                    className="inline-flex items-center px-6 py-3 border border-zinc-700 text-white hover:border-zinc-500 transition-all duration-300"
                  >
                    <span className="text-sm tracking-wide">
                      {isEn ? 'View All Positions' : 'Voir Tous les Postes'}
                    </span>
                  </motion.button>
                </motion.div>
              )}
            </div>

            {/* Spontaneous Application */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16 text-center"
            >
              <p className="text-zinc-400 mb-6">
                {t('careers.spontaneous.text') || (isEn
                  ? 'Don\'t see a perfect match? We\'re always looking for exceptional talents.'
                  : 'Pas de match parfait ? Nous recherchons toujours des talents exceptionnels.')}
              </p>
              <Link href={`/${language}/careers/spontaneous`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center px-8 py-4 border border-zinc-700 text-white hover:border-zinc-500 transition-all duration-300"
                >
                  <span className="text-sm tracking-wide">
                    {t('careers.spontaneous.cta') || (isEn ? 'Send Spontaneous Application' : 'Envoyer une Candidature Spontanée')}
                  </span>
                  <ChevronRight className="w-4 h-4 ml-2" />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Culture Section */}
        <section id="culture" className="py-32 relative bg-gradient-to-b from-transparent via-zinc-900/20 to-transparent">
          <div className="container mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center"
            >
              <h2 className="text-4xl lg:text-5xl font-extralight text-white mb-12 tracking-tight">
                {t('careers.culture.title') || (isEn ? 'Our Culture' : 'Notre Culture')}
              </h2>

              <div className="space-y-16">
                <div>
                  <Rocket className="w-12 h-12 text-zinc-600 mx-auto mb-6" />
                  <h3 className="text-2xl font-light text-white mb-4">
                    {t('careers.culture.innovation.title') || (isEn ? 'Innovation Without Limits' : 'Innovation Sans Limites')}
                  </h3>
                  <p className="text-zinc-400 leading-relaxed max-w-2xl mx-auto">
                    {t('careers.culture.innovation.content') || (isEn
                      ? 'We encourage crazy ideas. The best innovations come from thinking differently. If you have an idea, we\'ll give you the resources to test it.'
                      : 'Nous encourageons les idées folles. Les meilleures innovations viennent de penser différemment. Si vous avez une idée, nous vous donnons les ressources pour la tester.')}
                  </p>
                </div>

                <div>
                  <Globe className="w-12 h-12 text-zinc-600 mx-auto mb-6" />
                  <h3 className="text-2xl font-light text-white mb-4">
                    {t('careers.culture.remote.title') || (isEn ? 'Remote by Design' : 'Remote par Design')}
                  </h3>
                  <p className="text-zinc-400 leading-relaxed max-w-2xl mx-auto">
                    {t('careers.culture.remote.content') || (isEn
                      ? 'We\'ve been remote since day one. No return to office, no hybrid bullshit. Work from your couch, a beach, or a mountain. We don\'t care as long as you deliver.'
                      : 'Nous sommes remote depuis le jour un. Pas de retour au bureau, pas de bullshit hybride. Travaillez depuis votre canapé, une plage, ou une montagne. On s\'en fout tant que vous délivrez.')}
                  </p>
                </div>

                <div>
                  <Heart className="w-12 h-12 text-zinc-600 mx-auto mb-6" />
                  <h3 className="text-2xl font-light text-white mb-4">
                    {t('careers.culture.passion.title') || (isEn ? 'Passion First' : 'La Passion d\'Abord')}
                  </h3>
                  <p className="text-zinc-400 leading-relaxed max-w-2xl mx-auto">
                    {t('careers.culture.passion.content') || (isEn
                      ? 'We\'re not here just for a paycheck. We\'re building something we believe in. If you\'re not passionate about what we do, this isn\'t the place for you.'
                      : 'Nous ne sommes pas là juste pour un salaire. Nous construisons quelque chose en quoi nous croyons. Si vous n\'êtes pas passionné par ce que nous faisons, ce n\'est pas l\'endroit pour vous.')}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 relative">
          <div className="container mx-auto px-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-4xl lg:text-5xl font-extralight text-white mb-8 tracking-tight">
                {t('careers.cta.title') || (isEn ? 'Ready to Join?' : 'Prêt à Nous Rejoindre ?')}
              </h2>
              <p className="text-xl text-zinc-400 mb-12 font-light">
                {t('careers.cta.subtitle') || (isEn
                  ? 'Take the next step in your career with VMCloud'
                  : 'Franchissez la prochaine étape de votre carrière avec VMCloud')}
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <motion.a
                  href="mailto:contact@vmcloud.fr"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center px-10 py-4 bg-white text-zinc-950 hover:bg-zinc-100 transition-all duration-300"
                >
                  <span className="text-sm tracking-wide font-medium">
                    {t('careers.cta.contact') || (isEn ? 'Contact Us' : 'Nous Contacter')}
                  </span>
                  <ChevronRight className="w-4 h-4 ml-2" />
                </motion.a>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/about"
                    className="inline-flex items-center justify-center px-10 py-4 border border-zinc-700 text-white hover:border-zinc-500 transition-all duration-300"
                  >
                    <span className="text-sm tracking-wide">
                      {t('careers.cta.about') || (isEn ? 'Learn More About Us' : 'En Savoir Plus Sur Nous')}
                    </span>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Job Details Modal */}
      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onApply={handleApply}
        />
      )}
    </>
  );
}