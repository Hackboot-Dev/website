// /workspaces/website/apps/web/app/api/admin/logout/route.ts
// Description: Admin logout API endpoint
// Last modified: 2025-12-10
// Related docs: /docs/features/ADMIN_PANEL.md

// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME } from '../../../../lib/auth';

export async function POST() {
  const cookieStore = cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);

  return NextResponse.json({ success: true });
}
