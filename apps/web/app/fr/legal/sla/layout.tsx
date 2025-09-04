import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: '/fr/legal/sla',
    languages: {
      'x-default': 'https://vmcl.fr/legal/sla',
      'en-US': 'https://vmcl.fr/legal/sla',
      'fr-FR': 'https://vmcl.fr/fr/legal/sla',
    },
  },
};

export default function LegalSLALayoutFR({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

