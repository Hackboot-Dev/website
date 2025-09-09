import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: '/products',
    languages: {
      'x-default': 'https://vmcl.fr/products',
      'en-US': 'https://vmcl.fr/products',
      'fr-FR': 'https://vmcl.fr/fr/products',
    },
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

