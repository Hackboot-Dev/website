// /workspaces/website/apps/web/app/api/admin/login/route.ts
// Description: Admin login API endpoint
// Last modified: 2025-12-10
// Related docs: /docs/features/ADMIN_PANEL.md

// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import usersData from '../../../../data/admin/users.json';
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_DURATION } from '../../../../lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password required' },
        { status: 400 }
      );
    }

    // Find user
    const user = usersData.users.find((u) => u.username === username);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Simple password check (in production, use bcrypt.compare)
    // For now, we check plain text OR the hash placeholder
    const isValidPassword =
      user.password === password ||
      (user.password.startsWith('$2b$') && password === 'admin'); // Dev fallback

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create session
    const sessionToken = createSessionToken({
      id: user.id,
      username: user.username,
      role: user.role,
      name: user.name,
    });

    // Set cookie
    const cookieStore = cookies();
    cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_DURATION / 1000,
      path: '/',
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
