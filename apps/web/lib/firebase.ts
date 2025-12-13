// /workspaces/website/apps/web/lib/firebase.ts
// Description: Multi-project Firebase configuration
// Last modified: 2025-12-12
// Related docs: /docs/features/ADMIN_PANEL.md

// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { initializeFirestore, Firestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

// =============================================================================
// FIREBASE PROJECTS OVERVIEW
// =============================================================================
// 1. vmcloud     - Admin VMCloud (P&L, clients, internal data)
// 2. hackboot    - Admin Hackboot (P&L, clients, internal data)
// 3. vmclpublic  - Public data (catalogue, products) - READ by visitors, WRITE by admins
// =============================================================================

// VMCloud Admin Firebase Config (private - admin only)
const vmcloudConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Hackboot Admin Firebase Config (private - admin only)
const hackbootConfig = {
  apiKey: process.env.NEXT_PUBLIC_HACKBOOT_FIREBASE_API_KEY || 'AIzaSyCwxfW6gF7HleGYUno-0rnd2kNnGDGFewo',
  authDomain: process.env.NEXT_PUBLIC_HACKBOOT_FIREBASE_AUTH_DOMAIN || 'hackbootadmin.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_HACKBOOT_FIREBASE_PROJECT_ID || 'hackbootadmin',
  storageBucket: process.env.NEXT_PUBLIC_HACKBOOT_FIREBASE_STORAGE_BUCKET || 'hackbootadmin.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_HACKBOOT_FIREBASE_MESSAGING_SENDER_ID || '885606292524',
  appId: process.env.NEXT_PUBLIC_HACKBOOT_FIREBASE_APP_ID || '1:885606292524:web:11dccb48bd119d40098589',
};

// VMCloud Public Firebase Config (public data - catalogue, products)
// This project is for PUBLIC data that visitors can read
// Admins write to it, visitors read from it with caching
const publicConfig = {
  apiKey: process.env.NEXT_PUBLIC_VMCL_PUBLIC_FIREBASE_API_KEY || 'AIzaSyA1XJlyUZz4vvr8puov3S4Ek6WuXDwgDpc',
  authDomain: process.env.NEXT_PUBLIC_VMCL_PUBLIC_FIREBASE_AUTH_DOMAIN || 'vmclpublic.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_VMCL_PUBLIC_FIREBASE_PROJECT_ID || 'vmclpublic',
  storageBucket: process.env.NEXT_PUBLIC_VMCL_PUBLIC_FIREBASE_STORAGE_BUCKET || 'vmclpublic.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_VMCL_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '260729958114',
  appId: process.env.NEXT_PUBLIC_VMCL_PUBLIC_FIREBASE_APP_ID || '1:260729958114:web:c8a7ad590132f58a0978bb',
};

// Firebase instances
let vmcloudApp: FirebaseApp | null = null;
let hackbootApp: FirebaseApp | null = null;
let publicApp: FirebaseApp | null = null;
let vmcloudDb: Firestore | null = null;
let hackbootDb: Firestore | null = null;
let publicDb: Firestore | null = null;
let auth: Auth | null = null;

// Initialize Firebase apps only on client side
if (typeof window !== 'undefined') {
  const apps = getApps();
  const existingVmcloud = apps.find(app => app.name === 'vmcloud');
  const existingHackboot = apps.find(app => app.name === 'hackboot');
  const existingPublic = apps.find(app => app.name === 'vmclpublic');

  // VMCloud Admin app
  if (vmcloudConfig.apiKey) {
    vmcloudApp = existingVmcloud || initializeApp(vmcloudConfig, 'vmcloud');
    vmcloudDb = getFirestore(vmcloudApp);
  }

  // Hackboot Admin app
  if (hackbootConfig.apiKey) {
    hackbootApp = existingHackboot || initializeApp(hackbootConfig, 'hackboot');
    hackbootDb = getFirestore(hackbootApp);
  }

  // Public app (for catalogue/products - with offline persistence for caching)
  if (publicConfig.apiKey) {
    publicApp = existingPublic || initializeApp(publicConfig, 'vmclpublic');

    // Initialize Firestore with persistent cache (reduces Firebase reads)
    // Visitors will use cached data, only fetching when cache is stale
    try {
      publicDb = initializeFirestore(publicApp, {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager(),
        }),
      });
    } catch {
      // If already initialized, get the existing instance
      publicDb = getFirestore(publicApp);
    }
  }

  // Auth uses VMCloud by default
  const primaryApp = vmcloudApp || hackbootApp;
  if (primaryApp) {
    auth = getAuth(primaryApp);
  }
}

// Get Firestore instance by company (for admin data)
export function getCompanyDb(company: 'vmcloud' | 'hackboot'): Firestore | null {
  if (company === 'hackboot') {
    return hackbootDb;
  }
  return vmcloudDb;
}

// Get Public Firestore instance (for catalogue/products)
export function getPublicDb(): Firestore | null {
  return publicDb;
}

// Legacy exports (for backward compatibility - uses VMCloud)
export const app = vmcloudApp;
export const db = vmcloudDb;
export { auth };

// Named exports for specific projects
export { vmcloudApp, hackbootApp, publicApp, vmcloudDb, hackbootDb, publicDb };
export default vmcloudApp;
