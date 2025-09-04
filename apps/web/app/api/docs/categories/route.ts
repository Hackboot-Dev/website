// /workspaces/website/apps/web/app/api/docs/categories/route.ts
// Description: API route to get all documentation categories
// Last modified: 2025-08-29
// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

import { NextResponse } from 'next/server';
import { getCategories, getDocsByCategory } from '../../../../lib/docs';

export async function GET() {
  try {
    if (process.env.NODE_ENV === 'production' || process.env.APP_ENV === 'production') {
      return NextResponse.json({ success: false, error: 'Documentation interdite en production' }, { status: 403 });
    }
    const categories = getCategories();
    
    // Add doc count for each category
    const categoriesWithCount = categories.map(category => ({
      ...category,
      docCount: getDocsByCategory(category.id).length
    }));
    
    return NextResponse.json({
      success: true,
      categories: categoriesWithCount
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
