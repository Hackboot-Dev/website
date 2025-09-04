// /workspaces/website/apps/web/components/documentation/MarkdownViewer.tsx
// Description: Sophisticated markdown viewer with syntax highlighting and animations
// Last modified: 2025-09-02
// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

'use client';

import React, { useEffect, useState } from 'react';
import { 
  ClipboardDocumentIcon, 
  CheckIcon,
  LinkIcon,
  HashtagIcon 
} from '@heroicons/react/24/outline';

interface MarkdownViewerProps {
  content: string;
  accentColor?: string;
}

export default function MarkdownViewer({ content, accentColor = 'cyan' }: MarkdownViewerProps) {
  const [processedContent, setProcessedContent] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);
  
  // Get accent color classes
  const getAccentClasses = () => {
    const colors: { [key: string]: { text: string; bg: string; border: string; code: string } } = {
      cyan: {
        text: 'text-cyan-400',
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/30',
        code: 'bg-cyan-500/5 border-cyan-500/20'
      },
      purple: {
        text: 'text-purple-400',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/30',
        code: 'bg-purple-500/5 border-purple-500/20'
      },
      blue: {
        text: 'text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        code: 'bg-blue-500/5 border-blue-500/20'
      },
      green: {
        text: 'text-green-400',
        bg: 'bg-green-500/10',
        border: 'border-green-500/30',
        code: 'bg-green-500/5 border-green-500/20'
      },
      indigo: {
        text: 'text-indigo-400',
        bg: 'bg-indigo-500/10',
        border: 'border-indigo-500/30',
        code: 'bg-indigo-500/5 border-indigo-500/20'
      },
      amber: {
        text: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        code: 'bg-amber-500/5 border-amber-500/20'
      },
      rose: {
        text: 'text-rose-400',
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/30',
        code: 'bg-rose-500/5 border-rose-500/20'
      }
    };
    return colors[accentColor] || colors.cyan;
  };
  
  const accentClasses = getAccentClasses();
  
  // Process markdown content
  useEffect(() => {
    // Remove frontmatter if present
    let cleanContent = content.replace(/^---[\s\S]*?---\n*/m, '');
    
    // Extract headings for table of contents
    const headingMatches = cleanContent.match(/^#{1,6}\s+.+$/gm) || [];
    const extractedHeadings = headingMatches.map((heading, idx) => {
      const level = heading.match(/^#+/)?.[0].length || 1;
      const text = heading.replace(/^#+\s+/, '');
      const id = `heading-${idx}-${text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
      return { id, text, level };
    });
    setHeadings(extractedHeadings);
    
    // Process markdown to HTML-like structure
    let html = cleanContent;
    
    // Headers with IDs for anchor links
    extractedHeadings.forEach(({ id, text, level }) => {
      const regex = new RegExp(`^${'#'.repeat(level)}\\s+${escapeRegex(text)}$`, 'gm');
      html = html.replace(regex, `<h${level} id="${id}" class="group relative">
        <a href="#${id}" class="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span class="text-zinc-600 hover:text-zinc-400">#</span>
        </a>
        ${text}
      </h${level}>`);
    });
    
    // Code blocks with syntax highlighting
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      const uniqueId = Math.random().toString(36).substr(2, 9);
      return `<div class="code-block relative group" data-lang="${lang || 'text'}" data-code-id="${uniqueId}">
        <div class="absolute top-2 right-2 flex items-center gap-2">
          ${lang ? `<span class="text-xs text-zinc-500 font-mono">${lang}</span>` : ''}
          <button onclick="copyCode('${uniqueId}')" class="copy-btn p-1.5 rounded bg-zinc-800/50 hover:bg-zinc-800 transition-colors">
            <svg class="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
        <pre class="language-${lang || 'text'}"><code id="code-${uniqueId}">${escapeHtml(code.trim())}</code></pre>
      </div>`;
    });
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
    
    // Bold text
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    // Italic text
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="link">$1</a>');
    
    // Lists
    html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
    html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
    
    // Blockquotes
    html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
    
    // Tables
    html = html.replace(/\|(.+)\|/g, (match) => {
      const cells = match.split('|').filter(Boolean);
      const isHeader = cells.every(cell => cell.includes('---'));
      if (isHeader) return '';
      
      const cellTags = cells.map(cell => `<td>${cell.trim()}</td>`).join('');
      return `<tr>${cellTags}</tr>`;
    });
    html = html.replace(/(<tr>.*<\/tr>\n?)+/g, '<table>$&</table>');
    
    // Horizontal rules
    html = html.replace(/^---$/gm, '<hr />');
    
    // Paragraphs
    html = html.split('\n\n').map(para => {
      if (para.match(/^<[^>]+>/)) return para;
      if (para.trim()) return `<p>${para}</p>`;
      return '';
    }).join('\n');
    
    setProcessedContent(html);
  }, [content]);
  
  // Copy code to clipboard
  const copyCode = async (codeId: string) => {
    const codeElement = document.getElementById(`code-${codeId}`);
    if (codeElement) {
      await navigator.clipboard.writeText(codeElement.textContent || '');
      setCopiedCode(codeId);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };
  
  // Escape special regex characters
  const escapeRegex = (str: string) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };
  
  // Escape HTML
  const escapeHtml = (str: string) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  };
  
  // Scroll to heading
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  return (
    <div className="markdown-viewer">
      {/* Table of Contents (if there are multiple headings) */}
      {headings.length > 3 && (
        <div className={`mb-8 p-4 rounded-lg border ${accentClasses.code} ${accentClasses.border}`}>
          <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <HashtagIcon className="w-4 h-4" />
            Table of Contents
          </h3>
          <nav className="space-y-1">
            {headings.map(({ id, text, level }) => (
              <button
                key={id}
                onClick={() => scrollToHeading(id)}
                className={`block text-left text-sm text-zinc-400 hover:${accentClasses.text} transition-colors`}
                style={{ paddingLeft: `${(level - 1) * 1}rem` }}
              >
                {text}
              </button>
            ))}
          </nav>
        </div>
      )}
      
      {/* Markdown Content */}
      <div 
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: processedContent }}
      />
      
      {/* Custom Styles */}
      <style jsx global>{`
        .markdown-viewer h1,
        .markdown-viewer h2,
        .markdown-viewer h3,
        .markdown-viewer h4,
        .markdown-viewer h5,
        .markdown-viewer h6 {
          font-weight: 300;
          color: white;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        
        .markdown-viewer h1 { font-size: 2.5rem; }
        .markdown-viewer h2 { font-size: 2rem; }
        .markdown-viewer h3 { font-size: 1.5rem; }
        .markdown-viewer h4 { font-size: 1.25rem; }
        
        .markdown-viewer p {
          color: #a1a1aa;
          line-height: 1.75;
          margin-bottom: 1.5rem;
        }
        
        .markdown-viewer .inline-code {
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-family: monospace;
          font-size: 0.875rem;
          ${accentColor === 'cyan' ? 'background: rgba(6, 182, 212, 0.1); color: #67e8f9;' : ''}
          ${accentColor === 'purple' ? 'background: rgba(168, 85, 247, 0.1); color: #c084fc;' : ''}
          ${accentColor === 'blue' ? 'background: rgba(59, 130, 246, 0.1); color: #60a5fa;' : ''}
          ${accentColor === 'green' ? 'background: rgba(34, 197, 94, 0.1); color: #4ade80;' : ''}
          ${accentColor === 'indigo' ? 'background: rgba(99, 102, 241, 0.1); color: #818cf8;' : ''}
          ${accentColor === 'amber' ? 'background: rgba(245, 158, 11, 0.1); color: #fbbf24;' : ''}
          ${accentColor === 'rose' ? 'background: rgba(244, 63, 94, 0.1); color: #fb7185;' : ''}
        }
        
        .markdown-viewer .code-block {
          margin: 2rem 0;
          border-radius: 0.5rem;
          overflow: hidden;
          border: 1px solid rgba(63, 63, 70, 0.5);
          background: rgba(24, 24, 27, 0.5);
        }
        
        .markdown-viewer pre {
          padding: 1.5rem;
          overflow-x: auto;
          margin: 0;
        }
        
        .markdown-viewer code {
          font-family: 'Fira Code', monospace;
          font-size: 0.875rem;
          line-height: 1.5;
          color: #e4e4e7;
        }
        
        .markdown-viewer .link {
          color: ${accentColor === 'cyan' ? '#06b6d4' : 
                   accentColor === 'purple' ? '#a855f7' :
                   accentColor === 'blue' ? '#3b82f6' :
                   accentColor === 'green' ? '#22c55e' :
                   accentColor === 'indigo' ? '#6366f1' :
                   accentColor === 'amber' ? '#f59e0b' :
                   accentColor === 'rose' ? '#f43f5e' : '#06b6d4'};
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: border-color 0.2s;
        }
        
        .markdown-viewer .link:hover {
          border-bottom-color: currentColor;
        }
        
        .markdown-viewer ul,
        .markdown-viewer ol {
          color: #a1a1aa;
          margin: 1rem 0;
          padding-left: 2rem;
        }
        
        .markdown-viewer li {
          margin: 0.5rem 0;
        }
        
        .markdown-viewer blockquote {
          border-left: 3px solid ${accentColor === 'cyan' ? '#06b6d4' : 
                                   accentColor === 'purple' ? '#a855f7' :
                                   accentColor === 'blue' ? '#3b82f6' :
                                   accentColor === 'green' ? '#22c55e' :
                                   accentColor === 'indigo' ? '#6366f1' :
                                   accentColor === 'amber' ? '#f59e0b' :
                                   accentColor === 'rose' ? '#f43f5e' : '#06b6d4'};
          padding-left: 1rem;
          margin: 1.5rem 0;
          color: #d4d4d8;
          font-style: italic;
        }
        
        .markdown-viewer table {
          width: 100%;
          border-collapse: collapse;
          margin: 2rem 0;
        }
        
        .markdown-viewer td,
        .markdown-viewer th {
          padding: 0.75rem;
          border: 1px solid rgba(63, 63, 70, 0.5);
          text-align: left;
          color: #a1a1aa;
        }
        
        .markdown-viewer th {
          background: rgba(24, 24, 27, 0.5);
          color: white;
          font-weight: 500;
        }
        
        .markdown-viewer hr {
          border: none;
          border-top: 1px solid rgba(63, 63, 70, 0.5);
          margin: 2rem 0;
        }
        
        .markdown-viewer strong {
          color: white;
          font-weight: 600;
        }
        
        .markdown-viewer em {
          color: #e4e4e7;
          font-style: italic;
        }
      `}</style>
      
      {/* Copy functionality */}
      <script dangerouslySetInnerHTML={{ __html: `
        window.copyCode = async function(codeId) {
          const codeElement = document.getElementById('code-' + codeId);
          if (codeElement) {
            await navigator.clipboard.writeText(codeElement.textContent || '');
            const btn = document.querySelector('[data-code-id="' + codeId + '"] .copy-btn');
            if (btn) {
              btn.innerHTML = '<svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
              setTimeout(() => {
                btn.innerHTML = '<svg class="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>';
              }, 2000);
            }
          }
        }
      `}} />
    </div>
  );
}