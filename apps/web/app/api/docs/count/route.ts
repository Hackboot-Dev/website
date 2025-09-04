// /workspaces/website/apps/web/app/api/docs/count/route.ts
// Description: API endpoint to count documentation files per category
// Last modified: 2025-08-31
// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    if (process.env.NODE_ENV === 'production' || process.env.APP_ENV === 'production') {
      return NextResponse.json({ error: 'Documentation interdite en production' }, { status: 403 });
    }
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const lang = searchParams.get('lang') || 'en';

    if (!category) {
      return NextResponse.json({ error: 'Category parameter is required' }, { status: 400 });
    }

    // Build path to category folder
    const docsPath = path.join(process.cwd(), 'data', 'docs', lang, category);

    try {
      // Check if directory exists
      await fs.access(docsPath);
      
      // Read directory contents
      const files = await fs.readdir(docsPath);
      
      // Count .md files
      const mdFiles = files.filter(file => file.endsWith('.md'));
      
      return NextResponse.json({ 
        count: mdFiles.length,
        category,
        lang 
      });
    } catch (error) {
      // Directory doesn't exist or can't be read
      return NextResponse.json({ 
        count: 0,
        category,
        lang 
      });
    }
  } catch (error) {
    console.error('Error counting docs:', error);
    return NextResponse.json({ error: 'Failed to count documentation files' }, { status: 500 });
  }
}
