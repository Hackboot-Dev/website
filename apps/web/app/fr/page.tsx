'use client';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import HeroSection from '../../components/sections/HeroSection';
import FeaturesSection from '../../components/sections/FeaturesSection';
import PricingSection from '../../components/sections/PricingSection';
import CTASection from '../../components/sections/CTASection';
import SophisticatedBackground from '../../components/animations/SophisticatedBackground';
import { useLanguage } from '../../contexts/LanguageContext';

export default function HomePageFR() {
  // Ensure context is mounted (initialLanguage comes from layout for SSR)
  const { language } = useLanguage();
  void language;

  return (
    <>
      <SophisticatedBackground />
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}

