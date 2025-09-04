import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: '/support',
    languages: {
      'x-default': 'https://vmcl.fr/support',
      'en-US': 'https://vmcl.fr/support',
      'fr-FR': 'https://vmcl.fr/fr/support',
    },
  },
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

