// /workspaces/website/apps/web/app/[locale]/admin/pnl/hackboot/page.tsx
// Description: P&L page for Hackboot company
// Last modified: 2025-12-11

import PnLPageClient from '../PnLPageClient';

export const metadata = {
  title: 'P&L Hackboot - Admin',
};

export default function HackbootPnLPage() {
  return <PnLPageClient company="hackboot" />;
}
