import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: '/pricing',
    languages: {
      'x-default': 'https://vmcl.fr/pricing',
      'en-US': 'https://vmcl.fr/pricing',
      'fr-FR': 'https://vmcl.fr/fr/pricing',
    },
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

