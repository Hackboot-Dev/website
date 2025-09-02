// /workspaces/website/apps/web/app/api/docs/list/route.ts
// Description: API endpoint to list and parse markdown documentation files
// Last modified: 2025-08-28
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
}

const DOCS_DIR = path.join(process.cwd(), 'data', 'docs');

function extractMetadata(content: string, filename: string): Omit<DocFile, 'id' | 'filename' | 'lastModified'> {
  let category = 'General';
  let title = filename.replace('.md', '').replace(/-/g, ' ');
  let description = '';
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
        if (key.trim().toLowerCase() === 'category') {
          category = value.replace(/["']/g, ''); // Remove quotes if present
        } else if (key.trim().toLowerCase() === 'title') {
          title = value.replace(/["']/g, '');
        } else if (key.trim().toLowerCase() === 'description') {
          description = value.replace(/["']/g, '');
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
    readTime
  };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const language = searchParams.get('lang') || 'fr';
    const category = searchParams.get('category');
    
    const langDir = path.join(DOCS_DIR, language);
    
    // Check if language directory exists
    try {
      await fs.access(langDir);
    } catch {
      return NextResponse.json({ docs: [], language });
    }
    
    // Read all markdown files in the language directory
    const files = await fs.readdir(langDir);
    const mdFiles = files.filter(file => file.endsWith('.md'));
    
    const docs: DocFile[] = [];
    
    for (const file of mdFiles) {
      const filePath = path.join(langDir, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const stats = await fs.stat(filePath);
      
      const metadata = extractMetadata(content, file);
      
      // Filter by category if specified
      if (category && metadata.category !== category) {
        continue;
      }
      
      docs.push({
        id: file.replace('.md', ''),
        filename: file,
        ...metadata,
        lastModified: stats.mtime.toISOString()
      });
    }
    
    // Sort by last modified date (most recent first)
    docs.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
    
    return NextResponse.json({
      docs,
      language,
      total: docs.length,
      categories: [...new Set(docs.map(d => d.category))]
    });
    
  } catch (error) {
    console.error('Error listing docs:', error);
    return NextResponse.json(
      { error: 'Failed to list documentation files' },
      { status: 500 }
    );
  }
}