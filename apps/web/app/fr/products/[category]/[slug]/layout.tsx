import type { Metadata } from 'next';

type Params = { params: { category: string; slug: string } };

export function generateMetadata({ params }: Params): Metadata {
  const { category, slug } = params;
  const path = `/products/${category}/${slug}`;
  return {
    alternates: {
      canonical: `/fr${path}`,
      languages: {
        'x-default': `https://vmcl.fr${path}`,
        'en-US': `https://vmcl.fr${path}`,
        'fr-FR': `https://vmcl.fr/fr${path}`,
      },
    },
  };
}

export default function DynamicProductLayoutFR({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

