// /workspaces/website/apps/web/app/[locale]/admin/pnl/vmcloud/page.tsx
// Description: P&L page for VMCloud company
// Last modified: 2025-12-11

import PnLPageClient from '../PnLPageClient';

export const metadata = {
  title: 'P&L VMCloud - Admin',
};

export default function VMCloudPnLPage() {
  return <PnLPageClient company="vmcloud" />;
}
