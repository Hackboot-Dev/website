// /workspaces/website/apps/web/app/[locale]/admin/page.tsx
// Description: Admin dashboard main page
// Last modified: 2025-12-10
// Related docs: /docs/features/ADMIN_PANEL.md

// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

import { Metadata } from 'next';
import AdminDashboardClient from './AdminDashboardClient';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminDashboardClient />;
}
