// /workspaces/website/apps/web/app/[locale]/admin/pnl/page.tsx
// Description: P&L (Profit & Loss) company selector page
// Last modified: 2025-12-11

// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

import { redirect } from 'next/navigation';

export const metadata = {
  title: 'P&L - Sélection entreprise',
  robots: {
    index: false,
    follow: false,
  },
};

type Props = {
  params: { locale: string };
};

export default function PnLPage({ params }: Props) {
  // Redirect to Hackboot by default
  redirect(`/${params.locale}/admin/pnl/hackboot`);
}
