import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: '/fr/legal/terms',
    languages: {
      'x-default': 'https://vmcl.fr/legal/terms',
      'en-US': 'https://vmcl.fr/legal/terms',
      'fr-FR': 'https://vmcl.fr/fr/legal/terms',
    },
  },
};

export default function LegalTermsLayoutFR({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

