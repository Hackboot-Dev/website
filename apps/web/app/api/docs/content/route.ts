// /workspaces/website/apps/web/app/api/docs/content/route.ts
// Description: API endpoint to retrieve documentation content
// Last modified: 2025-09-02
// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DOCS_DIR = path.join(process.cwd(), 'public', 'data', 'docs');

export async function GET(request: NextRequest) {
  try {
    if (process.env.NODE_ENV === 'production' || process.env.APP_ENV === 'production') {
      return NextResponse.json({ error: 'Documentation interdite en production' }, { status: 403 });
    }
    const searchParams = request.nextUrl.searchParams;
    const language = searchParams.get('lang') || 'en';
    const category = searchParams.get('category');
    const docId = searchParams.get('doc');
    
    if (!category || !docId) {
      return NextResponse.json(
        { error: 'Category and doc parameters are required' },
        { status: 400 }
      );
    }
    
    // Build file path
    const filePath = path.join(DOCS_DIR, language, category, `${docId}.md`);
    
    // Try to read the file, fallback to English if not found
    let content: string;
    let actualLang = language;
    
    try {
      content = await fs.readFile(filePath, 'utf-8');
    } catch {
      // Try English fallback
      const fallbackPath = path.join(DOCS_DIR, 'en', category, `${docId}.md`);
      try {
        content = await fs.readFile(fallbackPath, 'utf-8');
        actualLang = 'en';
      } catch {
        return NextResponse.json(
          { error: 'Document not found' },
          { status: 404 }
        );
      }
    }
    
    // Parse frontmatter
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);
    
    let title = docId.replace(/-/g, ' ');
    let description = '';
    let order = 999;
    let tags: string[] = [];
    let markdownContent = content;
    
    if (match) {
      const frontmatter = match[1];
      markdownContent = match[2];
      
      // Parse frontmatter
      const lines = frontmatter.split('\n');
      for (const line of lines) {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
          const value = valueParts.join(':').trim();
          if (key.trim().toLowerCase() === 'title') {
            title = value.replace(/["']/g, '');
          } else if (key.trim().toLowerCase() === 'description') {
            description = value.replace(/["']/g, '');
          } else if (key.trim().toLowerCase() === 'order') {
            order = parseInt(value, 10) || 999;
          } else if (key.trim().toLowerCase() === 'tags') {
            // Parse tags array
            const tagsMatch = value.match(/\[(.*)\]/);
            if (tagsMatch) {
              tags = tagsMatch[1]
                .split(',')
                .map(tag => tag.trim().replace(/^["']|["']$/g, ''));
            }
          }
        }
      }
    }
    
    // Calculate read time
    const wordCount = markdownContent.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);
    
    // Get file stats
    const stats = await fs.stat(
      actualLang === language ? filePath : path.join(DOCS_DIR, 'en', category, `${docId}.md`)
    );
    
    return NextResponse.json({
      id: docId,
      title,
      description,
      content: markdownContent,
      order,
      tags,
      readTime,
      lastModified: stats.mtime.toISOString().split('T')[0],
      language: actualLang,
      category
    });
    
  } catch (error) {
    console.error('Error retrieving document content:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve document content' },
      { status: 500 }
    );
  }
}
