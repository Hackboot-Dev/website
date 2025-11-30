// apps/web/app/api/ads/logout/route.ts
// Description: API endpoint to logout from ads admin
// Last modified: 2025-11-30

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const response = NextResponse.json(
    { success: true, message: 'Logged out successfully' },
    { status: 200 }
  );

  // Clear the session cookie
  response.cookies.set('ads_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/'
  });

  return response;
}
