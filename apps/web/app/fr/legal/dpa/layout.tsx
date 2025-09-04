import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: '/fr/legal/dpa',
    languages: {
      'x-default': 'https://vmcl.fr/legal/dpa',
      'en-US': 'https://vmcl.fr/legal/dpa',
      'fr-FR': 'https://vmcl.fr/fr/legal/dpa',
    },
  },
};

export default function LegalDPALayoutFR({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

