// /workspaces/website/apps/web/app/api/docs/[category]/[slug]/route.ts
// Description: API route to get a specific doc
// Last modified: 2025-08-29
// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

import { NextResponse } from 'next/server';
import { getDoc, getRelatedDocs } from '../../../../../lib/docs';

export async function GET(
  request: Request,
  { params }: { params: { category: string; slug: string } }
) {
  try {
    const { category, slug } = params;
    
    const doc = await getDoc(category, slug);
    
    if (!doc) {
      return NextResponse.json(
        { success: false, error: 'Document not found' },
        { status: 404 }
      );
    }
    
    // Get related docs
    const relatedDocs = getRelatedDocs(doc, 3);
    
    return NextResponse.json({
      success: true,
      doc,
      relatedDocs
    });
  } catch (error) {
    console.error('Error fetching doc:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch document' },
      { status: 500 }
    );
  }
}