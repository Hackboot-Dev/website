import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: '/legal/terms',
    languages: {
      'x-default': 'https://vmcl.fr/legal/terms',
      'en-US': 'https://vmcl.fr/legal/terms',
      'fr-FR': 'https://vmcl.fr/fr/legal/terms',
    },
  },
};

export default function LegalTermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

