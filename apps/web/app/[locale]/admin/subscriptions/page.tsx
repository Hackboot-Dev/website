// /workspaces/website/apps/web/app/[locale]/admin/subscriptions/page.tsx
// Description: Subscriptions management page (server component)
// Last modified: 2025-12-19

import SubscriptionsPageClient from './SubscriptionsPageClient';

export const metadata = {
  title: 'Abonnements | Admin',
  description: 'Gestion des abonnements clients',
};

export default function SubscriptionsPage() {
  return <SubscriptionsPageClient />;
}
