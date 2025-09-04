// /workspaces/website/apps/web/app/api/docs/[category]/route.ts
// Description: API route to get docs for a specific category
// Last modified: 2025-08-29
// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

import { NextResponse } from 'next/server';
import { getDocsByCategory, getCategories } from '../../../../lib/docs';

export async function GET(
  request: Request,
  { params }: { params: { category: string } }
) {
  try {
    if (process.env.NODE_ENV === 'production' || process.env.APP_ENV === 'production') {
      return NextResponse.json({ success: false, error: 'Documentation interdite en production' }, { status: 403 });
    }
    const { category } = params;
    
    // Verify category exists
    const categories = getCategories();
    const categoryExists = categories.some(c => c.id === category);
    
    if (!categoryExists) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }
    
    const docs = getDocsByCategory(category);
    const categoryInfo = categories.find(c => c.id === category);
    
    return NextResponse.json({
      success: true,
      category: categoryInfo,
      docs
    });
  } catch (error) {
    console.error('Error fetching category docs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch docs' },
      { status: 500 }
    );
  }
}
