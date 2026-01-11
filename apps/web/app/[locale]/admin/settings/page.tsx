// /workspaces/website/apps/web/app/[locale]/admin/settings/page.tsx
// Description: Admin settings page
// Last modified: 2025-01-10

import { Metadata } from 'next';
import SettingsPageClient from './SettingsPageClient';

export const metadata: Metadata = {
  title: 'Settings - Admin',
  robots: {
    index: false,
    follow: false,
  },
};

export default function SettingsPage() {
  return <SettingsPageClient />;
}
