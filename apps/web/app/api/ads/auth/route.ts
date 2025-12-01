// apps/web/app/api/ads/auth/route.ts
// Description: API endpoint for ads admin authentication - server-side only
// Last modified: 2025-11-30

import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { createSessionToken, verifySessionToken } from '../../../../lib/ads-session';

// Session duration: 24 hours
const SESSION_DURATION = 24 * 60 * 60 * 1000;

// Hash password with SHA-256
function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

// Get valid password hash from env or fallback to default
function getValidPasswordHash(): string {
  const envPassword = process.env.ADS_ADMIN_PASSWORD;
  if (envPassword) {
    return hashPassword(envPassword);
  }
  // Default hash for 'admin123' - CHANGE IN PRODUCTION
  // SHA-256('admin123') = 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9
  return '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    // Hash the provided password
    const providedHash = hashPassword(password);
    const validHash = getValidPasswordHash();

    // Compare hashes
    if (providedHash !== validHash) {
      // Add delay to prevent brute force attacks
      await new Promise(resolve => setTimeout(resolve, 1000));
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Create session token
    const token = createSessionToken({
      userId: 'admin',
      role: 'admin',
      expiresAt: Date.now() + SESSION_DURATION
    });

    // Create response with httpOnly cookie
    const response = NextResponse.json(
      { success: true, message: 'Authentication successful' },
      { status: 200 }
    );

    // Set secure httpOnly cookie - NEVER accessible from JavaScript
    response.cookies.set('ads_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: SESSION_DURATION / 1000, // in seconds
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Verify session endpoint
export async function GET(request: NextRequest) {
  const token = request.cookies.get('ads_session')?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const payload = verifySessionToken(token);

  if (!payload) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    userId: payload.userId,
    role: payload.role
  }, { status: 200 });
}
