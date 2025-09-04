// /workspaces/website/apps/web/app/api/docs/list/route.ts
// Description: API endpoint to list and parse markdown documentation files
// Last modified: 2025-09-02
// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

interface DocFile {
  id: string;
  filename: string;
  title: string;
  description: string;
  category: string;
  readTime: number;
  lastModified: string;
  order?: number;
  tags?: string[];
}

// Keep base path consistent with other endpoints (read/count)
const DOCS_DIR = path.join(process.cwd(), 'data', 'docs');

function extractMetadata(content: string, filename: string, category: string): Omit<DocFile, 'id' | 'filename' | 'lastModified'> {
  let title = filename.replace('.md', '').replace(/-/g, ' ');
  let description = '';
  let order = 999;
  let tags: string[] = [];
  let processedContent = content;
  let frontmatter = '';
  
  // Check for YAML frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  
  if (frontmatterMatch) {
    frontmatter = frontmatterMatch[1];
    processedContent = frontmatterMatch[2];
    
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
  
  // If no title in frontmatter, extract from content
  if (frontmatterMatch && !frontmatter.includes('title:')) {
    const titleMatch = processedContent.match(/^#\s+(.+)$/m);
    if (titleMatch) {
      title = titleMatch[1];
    }
  } else if (!frontmatterMatch) {
    const titleMatch = content.match(/^#\s+(.+)$/m);
    if (titleMatch) {
      title = titleMatch[1];
    }
  }
  
  // If no description, extract from content
  if (!description) {
    const contentToSearch = processedContent || content;
    const boldMatch = contentToSearch.match(/\*\*(.+?)\*\*/s);
    if (boldMatch) {
      description = boldMatch[1].trim();
    } else {
      const paragraphs = contentToSearch.split('\n\n');
      for (const para of paragraphs) {
        if (!para.startsWith('#') && para.trim() && !para.startsWith('*') && !para.startsWith('---')) {
          description = para.trim().substring(0, 150);
          if (description.length === 150) description += '...';
          break;
        }
      }
    }
  }
  
  // Calculate read time
  const wordCount = content.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 200);
  
  return {
    title,
    description,
    category,
    readTime,
    order,
    tags
  };
}

export async function GET(request: NextRequest) {
  try {
    // Block in production
    if (process.env.NODE_ENV === 'production' || process.env.APP_ENV === 'production') {
      return NextResponse.json({ error: 'Documentation interdite en production' }, { status: 403 });
    }
    const searchParams = request.nextUrl.searchParams;
    const language = searchParams.get('lang') || 'en';
    const category = searchParams.get('category');
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category parameter is required' },
        { status: 400 }
      );
    }
    
    // Path to documentation files for the specific category
    const categoryDir = path.join(DOCS_DIR, language, category);
    
    // Check if category directory exists, fallback to English if not
    let actualDir = categoryDir;
    let actualLang = language;
    
    try {
      await fs.access(categoryDir);
    } catch {
      // Try English fallback
      const fallbackDir = path.join(DOCS_DIR, 'en', category);
      try {
        await fs.access(fallbackDir);
        actualDir = fallbackDir;
        actualLang = 'en';
      } catch {
        return NextResponse.json({ documents: [], language: actualLang });
      }
    }
    
    // Read all markdown files in the category directory
    const files = await fs.readdir(actualDir);
    const mdFiles = files.filter(file => file.endsWith('.md'));
    
    const documents: DocFile[] = [];
    
    for (const file of mdFiles) {
      const filePath = path.join(actualDir, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const stats = await fs.stat(filePath);
      
      const metadata = extractMetadata(content, file, category);
      
      documents.push({
        id: file.replace('.md', ''),
        filename: file,
        ...metadata,
        lastModified: stats.mtime.toISOString()
      });
    }
    
    // Sort by order, then by title
    documents.sort((a, b) => {
      if (a.order !== b.order) {
        return (a.order || 999) - (b.order || 999);
      }
      return a.title.localeCompare(b.title);
    });
    
    return NextResponse.json({
      documents,
      language: actualLang,
      total: documents.length,
      category
    });
    
  } catch (error) {
    console.error('Error listing docs:', error);
    return NextResponse.json(
      { error: 'Failed to list documentation files' },
      { status: 500 }
    );
  }
}
