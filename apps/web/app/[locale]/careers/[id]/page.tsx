// /workspaces/website/apps/web/app/[locale]/careers/[id]/page.tsx
// Description: Server component for job detail page with SEO metadata
// Last modified: 2025-09-14
// Related docs: /docs/JOURNAL.md

import { Metadata } from 'next';
import JobDetailPageClient from './JobDetailPageClient';
import positionsDataFr from '../../../../data/careers/positions-fr.json';
import positionsDataEn from '../../../../data/careers/positions-en.json';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    locale: string;
    id: string;
  };
}

export async function generateStaticParams() {
  const frParams = positionsDataFr.positions.map(job => ({
    locale: 'fr',
    id: job.id
  }));

  const enParams = positionsDataEn.positions.map(job => ({
    locale: 'en',
    id: job.id
  }));

  return [...frParams, ...enParams];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const isEn = params.locale === 'en';
  const positionsData = isEn ? positionsDataEn : positionsDataFr;
  const job = positionsData.positions.find(p => p.id === params.id);

  if (!job) {
    return {
      title: isEn ? 'Job Not Found | VMCloud' : 'Poste Non Trouvé | VMCloud'
    };
  }

  return {
    title: isEn
      ? `${job.title} - Careers | VMCloud`
      : `${job.title} - Carrières | VMCloud`,
    description: job.description,
    keywords: job.skills.join(', '),
    openGraph: {
      title: job.title,
      description: job.description,
      type: 'website',
      images: ['/og-careers.jpg']
    },
    twitter: {
      card: 'summary_large_image',
      title: job.title,
      description: job.description,
      images: ['/og-careers.jpg']
    },
    alternates: {
      canonical: `https://vmcl.fr/${params.locale}/careers/${params.id}`,
      languages: {
        'en': `https://vmcl.fr/en/careers/${params.id}`,
        'fr': `https://vmcl.fr/fr/careers/${params.id}`
      }
    }
  };
}

export default function JobDetailPage({ params }: PageProps) {
  const isEn = params.locale === 'en';
  const positionsData = isEn ? positionsDataEn : positionsDataFr;
  const job = positionsData.positions.find(p => p.id === params.id);

  if (!job) {
    notFound();
  }

  return <JobDetailPageClient job={job} locale={params.locale} />;
}