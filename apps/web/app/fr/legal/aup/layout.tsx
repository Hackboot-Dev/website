import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: '/fr/legal/aup',
    languages: {
      'x-default': 'https://vmcl.fr/legal/aup',
      'en-US': 'https://vmcl.fr/legal/aup',
      'fr-FR': 'https://vmcl.fr/fr/legal/aup',
    },
  },
};

export default function LegalAUPLayoutFR({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

