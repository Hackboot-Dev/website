import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: '/fr/pricing',
    languages: {
      'x-default': 'https://vmcl.fr/pricing',
      'en-US': 'https://vmcl.fr/pricing',
      'fr-FR': 'https://vmcl.fr/fr/pricing',
    },
  },
};

export default function PricingLayoutFR({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

