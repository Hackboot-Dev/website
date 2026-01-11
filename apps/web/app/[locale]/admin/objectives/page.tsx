// /workspaces/website/apps/web/app/[locale]/admin/objectives/page.tsx
// Description: Objectives & Alerts page
// Last modified: 2026-01-10

import ObjectivesPageClient from './ObjectivesPageClient';

export const metadata = {
  title: 'Objectifs & Alertes | Admin',
  description: 'Gérez vos objectifs business et alertes automatiques',
};

export default function ObjectivesPage() {
  return <ObjectivesPageClient />;
}
