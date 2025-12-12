// /workspaces/website/apps/web/app/api/admin/session/route.ts
// Description: Check admin session API endpoint
// Last modified: 2025-12-10
// Related docs: /docs/features/ADMIN_PANEL.md

// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

import { NextResponse } from 'next/server';
import { getSession } from '../../../../lib/auth';

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    user: session.user,
  });
}
