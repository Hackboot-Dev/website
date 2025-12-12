// /workspaces/website/apps/web/lib/auth.ts
// Description: Admin authentication utilities
// Last modified: 2025-12-10
// Related docs: /docs/features/ADMIN_PANEL.md

// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

import { cookies } from 'next/headers';

export type AdminUser = {
  id: string;
  username: string;
  role: string;
  name: string;
};

export type AuthSession = {
  user: AdminUser;
  expiresAt: number;
};

const SESSION_COOKIE_NAME = 'vmcloud_admin_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Simple token encoding (in production, use JWT)
export function encodeSession(session: AuthSession): string {
  return Buffer.from(JSON.stringify(session)).toString('base64');
}

export function decodeSession(token: string): AuthSession | null {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const session = JSON.parse(decoded) as AuthSession;

    // Check expiration
    if (session.expiresAt < Date.now()) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<AuthSession | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return decodeSession(token);
}

export function createSessionToken(user: AdminUser): string {
  const session: AuthSession = {
    user,
    expiresAt: Date.now() + SESSION_DURATION,
  };
  return encodeSession(session);
}

export { SESSION_COOKIE_NAME, SESSION_DURATION };
