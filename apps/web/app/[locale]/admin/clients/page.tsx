// /workspaces/website/apps/web/app/[locale]/admin/clients/page.tsx
// Description: Clients admin page (server component wrapper)
// Last modified: 2025-12-11
// Related docs: /docs/features/CLIENTS_MODULE.md

import ClientsPageClient from './ClientsPageClient';

export const metadata = {
  title: 'Clients | Admin - VMCloud',
  description: 'Gestion des clients VMCloud',
};

export default function ClientsPage() {
  return <ClientsPageClient />;
}
