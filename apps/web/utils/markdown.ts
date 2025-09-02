// /workspaces/website/apps/web/utils/markdown.ts
// Description: Advanced Markdown parser with syntax highlighting and features
// Last modified: 2025-08-28
// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';

// Dynamic import for Prism to avoid SSR issues
let Prism: any;
if (typeof window !== 'undefined') {
  Prism = require('prismjs');
  require('prismjs/components/prism-bash');
  require('prismjs/components/prism-javascript');
  require('prismjs/components/prism-typescript');
  require('prismjs/components/prism-json');
  require('prismjs/components/prism-python');
  require('prismjs/components/prism-yaml');
  require('prismjs/components/prism-docker');
  require('prismjs/components/prism-sql');
}

export interface MarkdownMetadata {
  title?: string;
  description?: string;
  readTime?: number;
  lastUpdated?: string;
  author?: string;
  tags?: string[];
  headings?: Array<{
    id: string;
    text: string;
    level: number;
  }>;
}

export interface ParsedMarkdown {
  content: string;
  metadata: MarkdownMetadata;
  tableOfContents: Array<{
    id: string;
    text: string;
    level: number;
    children?: Array<any>;
  }>;
}

// Custom remark plugin for collecting headings
function remarkHeadings() {
  return (tree: any, file: any) => {
    const headings: Array<{ id: string; text: string; level: number }> = [];
    
    visit(tree, 'heading', (node: any) => {
      const text = node.children
        .filter((child: any) => child.type === 'text')
        .map((child: any) => child.value)
        .join('');
      
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      
      headings.push({
        id,
        text,
        level: node.depth
      });
      
      // Add ID to the heading node for anchor links
      node.data = node.data || {};
      node.data.hProperties = node.data.hProperties || {};
      node.data.hProperties.id = id;
      node.data.hProperties.className = 'doc-heading';
    });
    
    file.data = file.data || {};
    file.data.headings = headings;
  };
}

// Custom remark plugin for code highlighting
function remarkPrism() {
  return (tree: any) => {
    visit(tree, 'code', (node: any) => {
      if (node.lang && typeof window !== 'undefined' && Prism) {
        const language = node.lang.toLowerCase();
        const grammar = Prism.languages[language];
        
        if (grammar) {
          const highlighted = Prism.highlight(node.value, grammar, language);
          node.type = 'html';
          node.value = `<div class="code-block">
            <div class="code-header">
              <span class="code-language">${language}</span>
              <button class="code-copy" data-code="${encodeURIComponent(node.value)}">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                </svg>
              </button>
            </div>
            <pre class="language-${language}"><code>${highlighted}</code></pre>
          </div>`;
        }
      } else if (node.lang) {
        // Fallback for SSR - just format without highlighting
        const language = node.lang.toLowerCase();
        node.type = 'html';
        node.value = `<div class="code-block">
          <div class="code-header">
            <span class="code-language">${language}</span>
            <button class="code-copy" data-code="${encodeURIComponent(node.value)}">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
              </svg>
            </button>
          </div>
          <pre class="language-${language}"><code>${node.value}</code></pre>
        </div>`;
      }
    });
  };
}

// Custom remark plugin for adding classes to elements
function remarkCustomClasses() {
  return (tree: any) => {
    // Add classes to tables
    visit(tree, 'table', (node: any) => {
      node.data = node.data || {};
      node.data.hProperties = node.data.hProperties || {};
      node.data.hProperties.className = 'doc-table';
    });
    
    // Add classes to blockquotes
    visit(tree, 'blockquote', (node: any) => {
      node.data = node.data || {};
      node.data.hProperties = node.data.hProperties || {};
      node.data.hProperties.className = 'doc-blockquote';
    });
    
    // Add classes to links
    visit(tree, 'link', (node: any) => {
      node.data = node.data || {};
      node.data.hProperties = node.data.hProperties || {};
      const isExternal = node.url.startsWith('http');
      node.data.hProperties.className = isExternal ? 'doc-link-external' : 'doc-link';
      if (isExternal) {
        node.data.hProperties.target = '_blank';
        node.data.hProperties.rel = 'noopener noreferrer';
      }
    });
  };
}

// Calculate reading time
function calculateReadTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
}

// Build table of contents from headings
function buildTableOfContents(headings: Array<{ id: string; text: string; level: number }>) {
  const toc: Array<any> = [];
  const stack: Array<any> = [];
  
  headings.forEach(heading => {
    const item = {
      id: heading.id,
      text: heading.text,
      level: heading.level,
      children: []
    };
    
    // Find the appropriate parent
    while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
      stack.pop();
    }
    
    if (stack.length === 0) {
      toc.push(item);
    } else {
      stack[stack.length - 1].children.push(item);
    }
    
    stack.push(item);
  });
  
  return toc;
}

// Main markdown parser
export async function parseMarkdown(markdown: string): Promise<ParsedMarkdown> {
  // Extract frontmatter if present
  let metadata: MarkdownMetadata = {};
  let content = markdown;
  
  const frontmatterMatch = markdown.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[1];
    content = frontmatterMatch[2];
    
    // Parse YAML-like frontmatter
    frontmatter.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length > 0) {
        const value = valueParts.join(':').trim();
        if (key === 'tags') {
          metadata.tags = value.split(',').map(tag => tag.trim());
        } else {
          (metadata as any)[key] = value;
        }
      }
    });
  }
  
  // Calculate read time
  metadata.readTime = calculateReadTime(content);
  
  // Process markdown
  const processor = remark()
    .use(remarkGfm) // GitHub Flavored Markdown
    .use(remarkHeadings) // Collect headings
    .use(remarkPrism) // Syntax highlighting
    .use(remarkCustomClasses) // Custom classes
    .use(html, { sanitize: false }); // Convert to HTML
  
  const result = await processor.process(content);
  
  // Get headings from processor data
  metadata.headings = (result.data as any).headings || [];
  
  // Build table of contents
  const tableOfContents = buildTableOfContents(metadata.headings);
  
  return {
    content: String(result),
    metadata,
    tableOfContents
  };
}

// Search function for documentation
export function searchDocumentation(
  documents: Array<{ id: string; content: string; metadata: MarkdownMetadata }>,
  query: string
): Array<{ id: string; matches: Array<{ text: string; context: string }> }> {
  const lowerQuery = query.toLowerCase();
  const results: Array<{ id: string; matches: Array<{ text: string; context: string }> }> = [];
  
  documents.forEach(doc => {
    const matches: Array<{ text: string; context: string }> = [];
    const lines = doc.content.split('\n');
    
    lines.forEach((line, index) => {
      if (line.toLowerCase().includes(lowerQuery)) {
        const contextStart = Math.max(0, index - 1);
        const contextEnd = Math.min(lines.length - 1, index + 1);
        const context = lines.slice(contextStart, contextEnd + 1).join('\n');
        
        matches.push({
          text: line,
          context
        });
      }
    });
    
    if (matches.length > 0) {
      results.push({
        id: doc.id,
        matches
      });
    }
  });
  
  return results;
}

// Export utilities for code copying
export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  
  // Fallback for older browsers
  return new Promise((resolve, reject) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      document.execCommand('copy');
      resolve();
    } catch (err) {
      reject(err);
    } finally {
      document.body.removeChild(textarea);
    }
  });
}