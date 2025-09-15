// /workspaces/website/apps/web/app/api/docs/read/route.ts
// Description: API endpoint to read markdown file content
// Last modified: 2025-08-28
// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DOCS_DIR = path.join(process.cwd(), 'data', 'docs');

export async function GET(request: NextRequest) {
  try {
    if (process.env.NODE_ENV === 'production' || process.env.APP_ENV === 'production') {
      return NextResponse.json({ error: 'Documentation interdite en production' }, { status: 403 });
    }
    const searchParams = request.nextUrl.searchParams;
    const docId = searchParams.get('id');
    const language = searchParams.get('lang') || 'fr';
    const category = searchParams.get('category');

    if (!docId) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }

    // Ensure the docId is safe (no path traversal)
    const safeDocId = path.basename(docId);

    // If category is provided, look inside that subfolder first
    const filePath = category
      ? path.join(DOCS_DIR, language, path.basename(category), `${safeDocId}.md`)
      : path.join(DOCS_DIR, language, `${safeDocId}.md`);

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      
      // Extract metadata from content
      const lines = content.split('\n');
      let title = safeDocId.replace(/-/g, ' ');
      let description = '';
      
      // Extract title (first H1)
      const titleMatch = content.match(/^#\s+(.+)$/m);
      if (titleMatch) {
        title = titleMatch[1];
      }
      
      // Extract description (first bold text or first paragraph)
      const boldMatch = content.match(/\*\*(.+?)\*\*/s);
      if (boldMatch) {
        description = boldMatch[1].trim();
      }

      return NextResponse.json({
        id: safeDocId,
        title,
        description,
        content,
        language
      });
    } catch (error) {
      // Try fallback: if category specified, try same category in fallback language,
      // else try to find the file in any category for the given language
      const fallbackLang = language === 'fr' ? 'en' : 'fr';
      const fallbackPath = category
        ? path.join(DOCS_DIR, fallbackLang, path.basename(category), `${safeDocId}.md`)
        : path.join(DOCS_DIR, fallbackLang, `${safeDocId}.md`);
      
      try {
        const content = await fs.readFile(fallbackPath, 'utf-8');
        
        // Extract metadata
        let title = safeDocId.replace(/-/g, ' ');
        const titleMatch = content.match(/^#\s+(.+)$/m);
        if (titleMatch) {
          title = titleMatch[1];
        }
        
        return NextResponse.json({
          id: safeDocId,
          title,
          content,
          language: fallbackLang,
          fallback: true
        });
      } catch {
        // As a last resort, search across categories for the language
        try {
          const langDir = path.join(DOCS_DIR, language);
          const categories = await fs.readdir(langDir);
          for (const cat of categories) {
            const possible = path.join(langDir, cat, `${safeDocId}.md`);
            try {
              const content = await fs.readFile(possible, 'utf-8');
              let title = safeDocId.replace(/-/g, ' ');
              const titleMatch = content.match(/^#\s+(.+)$/m);
              if (titleMatch) {
                title = titleMatch[1];
              }
              return NextResponse.json({
                id: safeDocId,
                title,
                content,
                language,
              });
            } catch {
              // ignore
            }
          }
        } catch (e) {
          // Ignore parse errors
        }

        return NextResponse.json(
          { error: 'Document not found' },
          { status: 404 }
        );
      }
    }
  } catch (error) {
    console.error('Error reading document:', error);
    return NextResponse.json(
      { error: 'Failed to read document' },
      { status: 500 }
    );
  }
}
