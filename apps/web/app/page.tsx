// /workspaces/website/apps/web/app/page.tsx
// Description: Root redirect to default locale
// Last modified: 2025-09-05
// Related docs: /docs/JOURNAL.md

// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export default function RootPage() {
  // Get preferred language from cookie or header
  const headersList = headers();
  const acceptLanguage = headersList.get('accept-language') || '';
  
  // Simple language detection
  const preferredLocale = acceptLanguage.toLowerCase().includes('fr') ? 'fr' : 'en';
  
  // Redirect to locale-specific page
  redirect(`/${preferredLocale}`);
}