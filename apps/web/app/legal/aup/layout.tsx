import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: '/legal/aup',
    languages: {
      'x-default': 'https://vmcl.fr/legal/aup',
      'en-US': 'https://vmcl.fr/legal/aup',
      'fr-FR': 'https://vmcl.fr/fr/legal/aup',
    },
  },
};

export default function LegalAUPLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

