// apps/web/lib/ads-session.ts
// Description: Session token utilities for ads admin authentication
// Last modified: 2025-11-30

// Secret key for signing tokens - use env variable in production
const SECRET_KEY = process.env.ADS_SESSION_SECRET || 'vmcloud-ads-secret-key-change-in-production';

// Simple base64 encoding/decoding
function base64Encode(str: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(str).toString('base64url');
  }
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function base64Decode(str: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(str, 'base64url').toString();
  }
  const padded = str.replace(/-/g, '+').replace(/_/g, '/');
  return atob(padded);
}

// Simple HMAC-like signature using XOR (for Edge Runtime compatibility)
// In production, use proper HMAC with Web Crypto API
function createSignature(data: string, secret: string): string {
  let hash = 0;
  const combined = data + secret;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  // Add more entropy
  for (let i = 0; i < secret.length; i++) {
    hash = ((hash << 3) + hash) ^ secret.charCodeAt(i);
  }
  return Math.abs(hash).toString(36) + Math.abs(hash >> 16).toString(36);
}

export interface SessionPayload {
  userId: string;
  role: string;
  expiresAt: number;
}

// Create a signed session token
export function createSessionToken(payload: SessionPayload): string {
  const data = JSON.stringify(payload);
  const encoded = base64Encode(data);
  const signature = createSignature(encoded, SECRET_KEY);
  return `${encoded}.${signature}`;
}

// Verify and decode a session token
export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) {
      return null;
    }

    const [encoded, signature] = parts;
    const expectedSignature = createSignature(encoded, SECRET_KEY);

    // Verify signature
    if (signature !== expectedSignature) {
      return null;
    }

    // Decode payload
    const data = base64Decode(encoded);
    const payload = JSON.parse(data) as SessionPayload;

    // Check expiration
    if (payload.expiresAt < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

// Check if session is valid
export function isValidSession(token: string | undefined): boolean {
  if (!token) return false;
  return verifySessionToken(token) !== null;
}
