import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: '/fr/support',
    languages: {
      'x-default': 'https://vmcl.fr/support',
      'en-US': 'https://vmcl.fr/support',
      'fr-FR': 'https://vmcl.fr/fr/support',
    },
  },
};

export default function SupportLayoutFR({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

