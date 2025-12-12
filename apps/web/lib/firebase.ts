// /workspaces/website/apps/web/lib/firebase.ts
// Description: Multi-company Firebase configuration (VMCloud + Hackboot)
// Last modified: 2025-12-11
// Related docs: /docs/features/ADMIN_PANEL.md

// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

// VMCloud Firebase Config (existing - from env variables)
const vmcloudConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Hackboot Firebase Config (new project)
const hackbootConfig = {
  apiKey: process.env.NEXT_PUBLIC_HACKBOOT_FIREBASE_API_KEY || 'AIzaSyCwxfW6gF7HleGYUno-0rnd2kNnGDGFewo',
  authDomain: process.env.NEXT_PUBLIC_HACKBOOT_FIREBASE_AUTH_DOMAIN || 'hackbootadmin.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_HACKBOOT_FIREBASE_PROJECT_ID || 'hackbootadmin',
  storageBucket: process.env.NEXT_PUBLIC_HACKBOOT_FIREBASE_STORAGE_BUCKET || 'hackbootadmin.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_HACKBOOT_FIREBASE_MESSAGING_SENDER_ID || '885606292524',
  appId: process.env.NEXT_PUBLIC_HACKBOOT_FIREBASE_APP_ID || '1:885606292524:web:11dccb48bd119d40098589',
};

// Firebase instances
let vmcloudApp: FirebaseApp | null = null;
let hackbootApp: FirebaseApp | null = null;
let vmcloudDb: Firestore | null = null;
let hackbootDb: Firestore | null = null;
let auth: Auth | null = null;

// Initialize Firebase apps only on client side
if (typeof window !== 'undefined') {
  // Initialize VMCloud (default app or get existing)
  const apps = getApps();
  const existingVmcloud = apps.find(app => app.name === 'vmcloud');
  const existingHackboot = apps.find(app => app.name === 'hackboot');

  // VMCloud app
  if (vmcloudConfig.apiKey) {
    vmcloudApp = existingVmcloud || initializeApp(vmcloudConfig, 'vmcloud');
    vmcloudDb = getFirestore(vmcloudApp);
  }

  // Hackboot app
  if (hackbootConfig.apiKey) {
    hackbootApp = existingHackboot || initializeApp(hackbootConfig, 'hackboot');
    hackbootDb = getFirestore(hackbootApp);
  }

  // Auth uses VMCloud by default (or Hackboot if VMCloud not configured)
  const primaryApp = vmcloudApp || hackbootApp;
  if (primaryApp) {
    auth = getAuth(primaryApp);
  }
}

// Get Firestore instance by company
export function getCompanyDb(company: 'vmcloud' | 'hackboot'): Firestore | null {
  if (company === 'hackboot') {
    return hackbootDb;
  }
  return vmcloudDb;
}

// Legacy exports (for backward compatibility - uses VMCloud)
export const app = vmcloudApp;
export const db = vmcloudDb;
export { auth };

// Named exports for specific companies
export { vmcloudApp, hackbootApp, vmcloudDb, hackbootDb };
export default vmcloudApp;
