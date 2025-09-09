import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: '/terms',
    languages: {
      'x-default': 'https://vmcl.fr/terms',
      'en-US': 'https://vmcl.fr/terms',
      'fr-FR': 'https://vmcl.fr/fr/terms',
    },
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

