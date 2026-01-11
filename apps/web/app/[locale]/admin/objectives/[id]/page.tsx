// /workspaces/website/apps/web/app/[locale]/admin/objectives/[id]/page.tsx
// Description: Server component wrapper for objective detail page
// Last modified: 2026-01-10

import { ObjectiveDetailClient } from './ObjectiveDetailClient';

type Props = {
  params: Promise<{ id: string; locale: string }>;
};

export default async function ObjectiveDetailPage({ params }: Props) {
  const { id } = await params;

  return <ObjectiveDetailClient objectiveId={id} />;
}
