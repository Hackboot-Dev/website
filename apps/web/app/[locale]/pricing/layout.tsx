import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale as 'fr' | 'en';
  const isEN = locale === 'en';

  return {
    title: isEN
      ? 'Pricing & Plans | VPS from €29, GPU from €199 - VMCloud'
      : 'Tarifs et Prix | VPS dès 29€, GPU dès 199€ - VMCloud',
    description: isEN
      ? 'Transparent pricing with no hidden fees. VPS from €29/month, GPU from €199/month, web hosting from €9.99/month. Hourly, monthly or annual billing with up to 20% discount.'
      : 'Tarifs transparents sans frais cachés. VPS dès 29€/mois, GPU dès 199€/mois, hébergement web dès 9.99€/mois. Facturation horaire, mensuelle ou annuelle avec jusqu\'à 20% de réduction.',
    keywords: isEN
      ? 'cloud pricing, vps pricing, gpu pricing, hosting prices, vmcloud tariffs, pay as you go'
      : 'tarifs cloud, prix vps, tarifs gpu, prix hébergement, tarifs vmcloud, paiement usage',
    openGraph: {
      title: isEN
        ? 'VMCloud Pricing - Simple, Transparent Cloud Pricing'
        : 'Tarifs VMCloud - Prix Cloud Simples et Transparents',
      description: isEN
        ? 'No surprises, no hidden fees. VPS starting at €29/month with hourly billing available. Save up to 20% with annual plans.'
        : 'Pas de surprises, pas de frais cachés. VPS à partir de 29€/mois avec facturation horaire disponible. Économisez jusqu\'à 20% avec les plans annuels.',
      type: 'website',
      locale: isEN ? 'en_US' : 'fr_FR',
      url: `https://vmcl.fr/${locale}/pricing`,
    },
    twitter: {
      card: 'summary_large_image',
      title: isEN
        ? 'VMCloud Pricing - Fair & Transparent'
        : 'Tarifs VMCloud - Justes & Transparents',
      description: isEN
        ? 'Cloud infrastructure pricing that makes sense. No setup fees, pay only for what you use.'
        : 'Tarifs infrastructure cloud qui ont du sens. Pas de frais d\'installation, payez uniquement ce que vous utilisez.',
    },
    alternates: {
      canonical: `/${locale}/pricing`,
      languages: {
        'x-default': 'https://vmcl.fr/pricing',
        'en-US': 'https://vmcl.fr/en/pricing',
        'fr-FR': 'https://vmcl.fr/fr/pricing',
      },
    },
  };
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

