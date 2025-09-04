import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: '/infrastructure',
    languages: {
      'x-default': 'https://vmcl.fr/infrastructure',
      'en-US': 'https://vmcl.fr/infrastructure',
      'fr-FR': 'https://vmcl.fr/fr/infrastructure',
    },
  },
};

export default function InfrastructureLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

