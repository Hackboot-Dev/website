'use client';
import { useLanguage } from '../../contexts/LanguageContext';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import HeroSection from '../../components/sections/HeroSection';
import FeaturesSection from '../../components/sections/FeaturesSection';
import PricingSection from '../../components/sections/PricingSection';
import TrustSection from '../../components/sections/TrustSection';
import CTASection from '../../components/sections/CTASection';
import SophisticatedBackground from '../../components/animations/SophisticatedBackground';
import seoConfig from '../../data/seo-config.json';
import Script from 'next/script';

export default function HomePage() {
  const { language } = useLanguage();
  const seo = seoConfig[language as 'fr' | 'en']?.home;
  
  // Generate JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://vmcl.fr/#organization",
        "name": "VMCloud",
        "url": "https://vmcl.fr",
        "logo": {
          "@type": "ImageObject",
          "url": "https://vmcl.fr/logo.png",
          "width": 600,
          "height": 60
        },
        "description": language === 'fr' 
          ? "Leader français de l'hébergement cloud haute performance"
          : "Leading European cloud infrastructure provider",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "FR",
          "addressRegion": "Île-de-France",
          "addressLocality": "Paris"
        },
        "sameAs": [
          "https://twitter.com/vmcloud",
          "https://linkedin.com/company/vmcloud",
          "https://github.com/vmcloud"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+33-1-70-70-70-70",
          "contactType": "customer support",
          "availableLanguage": ["French", "English"],
          "areaServed": "EU"
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://vmcl.fr/#website",
        "url": "https://vmcl.fr",
        "name": "VMCloud",
        "description": language === 'fr' 
          ? "Infrastructure cloud premium - VPS, GPU, Web Hosting"
          : "Premium cloud infrastructure - VPS, GPU, Web Hosting",
        "publisher": {
          "@id": "https://vmcl.fr/#organization"
        },
        "inLanguage": language === 'fr' ? "fr-FR" : "en-US",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://vmcl.fr/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "WebPage",
        "@id": `https://vmcl.fr/${language}#webpage`,
        "url": `https://vmcl.fr/${language}`,
        "name": seo?.title,
        "isPartOf": {
          "@id": "https://vmcl.fr/#website"
        },
        "about": {
          "@id": "https://vmcl.fr/#organization"
        },
        "description": seo?.description,
        "breadcrumb": {
          "@id": `https://vmcl.fr/${language}#breadcrumb`
        },
        "inLanguage": language === 'fr' ? "fr-FR" : "en-US"
      },
      {
        "@type": "BreadcrumbList",
        "@id": `https://vmcl.fr/${language}#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": language === 'fr' ? "Accueil" : "Home",
            "item": `https://vmcl.fr/${language}`
          }
        ]
      },
      {
        "@type": "Service",
        "serviceType": language === 'fr' ? "Hébergement Cloud" : "Cloud Hosting",
        "provider": {
          "@id": "https://vmcl.fr/#organization"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": language === 'fr' ? "Services Cloud" : "Cloud Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "VPS",
                "description": language === 'fr' 
                  ? "Serveurs virtuels privés haute performance avec SSD NVMe"
                  : "High-performance virtual private servers with NVMe SSD"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "GPU Cloud",
                "description": language === 'fr'
                  ? "Serveurs GPU pour IA, machine learning et calcul intensif"
                  : "GPU servers for AI, machine learning and intensive computing"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Web Hosting",
                "description": language === 'fr'
                  ? "Hébergement web managé optimisé pour WordPress et applications"
                  : "Managed web hosting optimized for WordPress and applications"
              }
            }
          ]
        },
        "areaServed": {
          "@type": "GeoShape",
          "addressCountry": ["FR", "BE", "CH", "LU", "MC", "EU"]
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": language === 'fr' 
              ? "Qu'est-ce qu'un VPS et pourquoi en ai-je besoin ?"
              : "What is a VPS and why do I need one?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": language === 'fr'
                ? "Un VPS (Serveur Virtuel Privé) est un serveur virtualisé qui vous offre des ressources dédiées (CPU, RAM, stockage) sur une infrastructure cloud. Idéal pour héberger des sites web, applications, bases de données avec plus de contrôle qu'un hébergement mutualisé et moins cher qu'un serveur dédié. VMCloud propose des VPS NVMe haute performance dès 4.99€/mois."
                : "A VPS (Virtual Private Server) is a virtualized server that provides dedicated resources (CPU, RAM, storage) on cloud infrastructure. Perfect for hosting websites, applications, databases with more control than shared hosting and cheaper than dedicated servers. VMCloud offers high-performance NVMe VPS from €4.99/month."
            }
          },
          {
            "@type": "Question",
            "name": language === 'fr'
              ? "Quelle est la différence entre facturation horaire et mensuelle ?"
              : "What's the difference between hourly and monthly billing?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": language === 'fr'
                ? "La facturation horaire vous permet de payer uniquement pour le temps d'utilisation réel (idéal pour tests et développement). La facturation mensuelle offre un tarif fixe avec jusqu'à 30% d'économie pour une utilisation continue. L'engagement annuel offre 2 mois gratuits (17% de remise supplémentaire)."
                : "Hourly billing lets you pay only for actual usage time (ideal for testing and development). Monthly billing offers a fixed rate with up to 30% savings for continuous use. Annual commitment provides 2 free months (17% additional discount)."
            }
          },
          {
            "@type": "Question",
            "name": language === 'fr'
              ? "Vos serveurs GPU conviennent-ils pour l'IA et le machine learning ?"
              : "Are your GPU servers suitable for AI and machine learning?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": language === 'fr'
                ? "Oui, nos serveurs GPU sont optimisés pour l'IA/ML avec des cartes NVIDIA Tesla T4, RTX 4090 et A100. Pré-installés avec CUDA, cuDNN, TensorRT et frameworks (PyTorch, TensorFlow). Performances jusqu'à 312 TFLOPS en FP16. Idéal pour l'entraînement de modèles, l'inférence et le calcul intensif."
                : "Yes, our GPU servers are optimized for AI/ML with NVIDIA Tesla T4, RTX 4090, and A100 cards. Pre-installed with CUDA, cuDNN, TensorRT and frameworks (PyTorch, TensorFlow). Performance up to 312 TFLOPS in FP16. Perfect for model training, inference, and intensive computing."
            }
          },
          {
            "@type": "Question",
            "name": language === 'fr'
              ? "Quel est votre SLA et que couvre-t-il ?"
              : "What is your SLA and what does it cover?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": language === 'fr'
                ? "Nous garantissons un SLA de 99.99% sur tous nos services (99.9% pour les offres starter). Cela couvre la disponibilité du réseau, de l'infrastructure et des services. En cas de non-respect, vous recevez des crédits au prorata. Support 24/7 inclus avec temps de réponse < 15 minutes pour les incidents critiques."
                : "We guarantee 99.99% SLA on all services (99.9% for starter plans). This covers network, infrastructure, and service availability. If we fail to meet it, you receive pro-rata credits. 24/7 support included with < 15 minute response time for critical incidents."
            }
          },
          {
            "@type": "Question",
            "name": language === 'fr'
              ? "Puis-je migrer gratuitement depuis un autre hébergeur ?"
              : "Can I migrate for free from another host?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": language === 'fr'
                ? "Oui, nous offrons une migration gratuite pour tous les plans business et enterprise. Notre équipe d'experts s'occupe du transfert complet de vos données, applications et configurations. Pour les autres plans, nous proposons une assistance à la migration et des guides détaillés. Essai gratuit de 30 jours disponible."
                : "Yes, we offer free migration for all business and enterprise plans. Our expert team handles the complete transfer of your data, applications, and configurations. For other plans, we provide migration assistance and detailed guides. 30-day free trial available."
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      <Script
        id="json-ld-home"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd)
        }}
      />
      
      <SophisticatedBackground />
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <TrustSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
