// /workspaces/website/apps/web/components/ui/LocalizedLink.tsx
// Description: Link component with automatic locale prefix
// Last modified: 2025-09-05
// Related docs: /docs/JOURNAL.md

// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

'use client';

import Link from 'next/link';
import { useLocalizedPath } from '../../hooks/useLocalizedPath';

interface LocalizedLinkProps extends Omit<React.ComponentProps<typeof Link>, 'href'> {
  href: string;
}

export default function LocalizedLink({ href, children, ...props }: LocalizedLinkProps) {
  const { localizedPath } = useLocalizedPath();
  
  // Don't localize external links or anchors
  if (href.startsWith('http') || href.startsWith('#')) {
    return <Link href={href} {...props}>{children}</Link>;
  }
  
  return <Link href={localizedPath(href)} {...props}>{children}</Link>;
}