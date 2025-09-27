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

  const intlLocale = isEn ? 'en-US' : 'fr-FR';
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat(intlLocale, {
      style: 'currency',
      currency: job.currency || 'EUR',
      maximumFractionDigits: 0,
    }).format(value);

  const salaryRange = job.salaryMin && job.salaryMax
    ? `${formatCurrency(job.salaryMin)} – ${formatCurrency(job.salaryMax)}`
    : undefined;

  const coreSkills = job.skills?.slice(0, 4).join(', ');
  const metaDescription = isEn
    ? `${job.title} at VMCloud (${job.location}). ${salaryRange ? `Salary ${salaryRange}. ` : ''}Key skills: ${coreSkills}. Join Hackboot’s sovereign cloud team.`
    : `${job.title} chez VMCloud (${job.location}). ${salaryRange ? `Salaire ${salaryRange}. ` : ''}Compétences clés : ${coreSkills}. Rejoignez l'équipe cloud souverain Hackboot.`;

  const keywords = [
    job.title,
    job.team,
    job.location,
    ...(job.skills || []),
    isEn ? 'VMCloud careers' : 'carrières VMCloud',
    isEn ? 'sovereign cloud job' : 'emploi cloud souverain',
  ].filter(Boolean).join(', ');

  return {
    title: isEn
      ? `${job.title} - Careers | VMCloud`
      : `${job.title} - Carrières | VMCloud`,
    description: metaDescription,
    keywords,
    openGraph: {
      title: job.title,
      description: metaDescription,
      type: 'website',
      url: `https://vmcl.fr/${params.locale}/careers/${params.id}`,
      images: [
        {
          url: `/${params.locale}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${job.title} – VMCloud`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: job.title,
      description: metaDescription,
      images: [`/${params.locale}/twitter-image`]
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
