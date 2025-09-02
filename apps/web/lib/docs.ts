// /workspaces/website/apps/web/lib/docs.ts
// Description: Documentation parsing and management system
// Last modified: 2025-08-29
// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import prism from 'remark-prism';

export interface DocMetadata {
  title: string;
  description: string;
  order: number;
  readTime: number;
  tags: string[];
  lastUpdated: string;
}

export interface DocFile {
  slug: string;
  category: string;
  metadata: DocMetadata;
  content: string;
  htmlContent?: string;
}

export interface Category {
  id: string;
  name: { [key: string]: string };
  description: { [key: string]: string };
  icon: string;
  order: number;
  color: string;
  docs?: DocFile[];
}

const DOCS_DIRECTORY = path.join(process.cwd(), 'content', 'docs');

// Get all categories from _categories.json
export function getCategories(): Category[] {
  const categoriesPath = path.join(DOCS_DIRECTORY, '_categories.json');
  
  if (!fs.existsSync(categoriesPath)) {
    return [];
  }
  
  const fileContents = fs.readFileSync(categoriesPath, 'utf8');
  const data = JSON.parse(fileContents);
  return data.categories.sort((a: Category, b: Category) => a.order - b.order);
}

// Get all docs for a specific category
export function getDocsByCategory(categoryId: string): DocFile[] {
  const categoryPath = path.join(DOCS_DIRECTORY, categoryId);
  
  if (!fs.existsSync(categoryPath)) {
    return [];
  }
  
  const files = fs.readdirSync(categoryPath)
    .filter(file => file.endsWith('.md'));
  
  const docs = files.map(filename => {
    const filePath = path.join(categoryPath, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
      slug: filename.replace('.md', ''),
      category: categoryId,
      metadata: data as DocMetadata,
      content
    };
  });
  
  // Sort by order if specified, otherwise by title
  return docs.sort((a, b) => {
    if (a.metadata.order && b.metadata.order) {
      return a.metadata.order - b.metadata.order;
    }
    return a.metadata.title.localeCompare(b.metadata.title);
  });
}

// Get a single doc by category and slug
export async function getDoc(category: string, slug: string): Promise<DocFile | null> {
  const filePath = path.join(DOCS_DIRECTORY, category, `${slug}.md`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  
  // Process Markdown to HTML
  const processedContent = await remark()
    .use(html, { sanitize: false })
    .use(prism)
    .process(content);
  
  return {
    slug,
    category,
    metadata: data as DocMetadata,
    content,
    htmlContent: processedContent.toString()
  };
}

// Get all docs across all categories
export function getAllDocs(): DocFile[] {
  const categories = getCategories();
  const allDocs: DocFile[] = [];
  
  categories.forEach(category => {
    const docs = getDocsByCategory(category.id);
    allDocs.push(...docs);
  });
  
  return allDocs;
}

// Search docs by query
export function searchDocs(query: string): DocFile[] {
  const allDocs = getAllDocs();
  const searchTerms = query.toLowerCase().split(' ');
  
  return allDocs.filter(doc => {
    const searchableContent = [
      doc.metadata.title,
      doc.metadata.description,
      ...(doc.metadata.tags || []),
      doc.content
    ].join(' ').toLowerCase();
    
    return searchTerms.every(term => searchableContent.includes(term));
  });
}

// Get related docs based on tags
export function getRelatedDocs(doc: DocFile, limit: number = 3): DocFile[] {
  const allDocs = getAllDocs();
  const currentTags = doc.metadata.tags || [];
  
  if (currentTags.length === 0) {
    // If no tags, get docs from same category
    return getDocsByCategory(doc.category)
      .filter(d => d.slug !== doc.slug)
      .slice(0, limit);
  }
  
  // Calculate relevance score based on shared tags
  const scoredDocs = allDocs
    .filter(d => d.slug !== doc.slug || d.category !== doc.category)
    .map(d => {
      const sharedTags = (d.metadata.tags || [])
        .filter(tag => currentTags.includes(tag)).length;
      return { doc: d, score: sharedTags };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);
  
  return scoredDocs.slice(0, limit).map(item => item.doc);
}

// Get docs statistics
export function getDocsStats() {
  const allDocs = getAllDocs();
  const categories = getCategories();
  
  return {
    totalDocs: allDocs.length,
    totalCategories: categories.length,
    totalReadTime: allDocs.reduce((acc, doc) => acc + (doc.metadata.readTime || 0), 0),
    lastUpdated: allDocs
      .map(doc => new Date(doc.metadata.lastUpdated))
      .sort((a, b) => b.getTime() - a.getTime())[0]
  };
}

// Generate breadcrumbs for a doc
export function generateBreadcrumbs(category: string, slug: string) {
  const categories = getCategories();
  const categoryData = categories.find(c => c.id === category);
  
  return [
    { label: 'Documentation', href: '/docs' },
    categoryData ? { label: categoryData.name.en, href: `/docs?category=${category}` } : null,
    { label: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), href: '#' }
  ].filter(Boolean);
}