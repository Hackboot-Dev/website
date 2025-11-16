'use client';

// components/news/custom-components/index.tsx
// Description: Custom markdown components for news articles
// Last modified: 2025-11-15

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

// ============================================================================
// HERO COMPONENTS
// ============================================================================

export function HeroFullscreen({ children, image, overlay = 'dark', animation = 'fade' }: any) {
  return (
    <div className="relative -mx-6 lg:-mx-12 h-screen min-h-[600px] flex items-center justify-center overflow-hidden mb-16">
      {overlay === 'dark' && (
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-zinc-950/60 z-10" />
      )}
      {image && (
        <Image src={image} alt="" fill className="object-cover" />
      )}
      <div className="relative z-20 text-center px-6 max-w-5xl">
        <div className="prose prose-invert prose-2xl max-w-none">{children}</div>
      </div>
    </div>
  );
}

export function HeroParallax({ children, backgroundImage, foregroundImage, speed = 0.5 }: any) {
  return (
    <div className="relative -mx-6 lg:-mx-12 h-[80vh] min-h-[500px] flex items-end overflow-hidden mb-16">
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent z-10" />
      {backgroundImage && (
        <Image src={backgroundImage} alt="" fill className="object-cover" />
      )}
      <div className="relative z-20 px-6 lg:px-12 pb-20 max-w-5xl">
        <div className="prose prose-invert prose-2xl max-w-none">{children}</div>
      </div>
    </div>
  );
}

export function HeroCode({ children, language, code }: any) {
  return (
    <div className="relative -mx-6 lg:-mx-12 bg-zinc-900 p-12 lg:p-20 mb-16">
      <div className="max-w-5xl mx-auto">
        {code && (
          <pre className="bg-black/50 rounded-lg p-6 mb-8 overflow-x-auto">
            <code className="text-sm text-cyan-400 font-mono">{code}</code>
          </pre>
        )}
        <div className="prose prose-invert prose-xl max-w-none">{children}</div>
      </div>
    </div>
  );
}

// ============================================================================
// QUOTE COMPONENTS
// ============================================================================

export function Quote({ children, author, role }: any) {
  return (
    <blockquote className="my-12 border-l-4 border-cyan-500 pl-8 py-4">
      <div className="text-2xl font-light text-white italic mb-4">{children}</div>
      {author && (
        <div className="text-sm text-zinc-400">
          <span className="font-medium text-white">— {author}</span>
          {role && <span>, {role}</span>}
        </div>
      )}
    </blockquote>
  );
}

export function QuoteHighlight({ children, author, date, highlight = 'cyan' }: any) {
  const colors: Record<string, string> = {
    cyan: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30',
    purple: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
    blue: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30',
  };

  return (
    <div className={`my-12 p-8 rounded-xl bg-gradient-to-br ${colors[highlight]} border`}>
      <div className="text-xl lg:text-2xl font-light text-white mb-4">{children}</div>
      <div className="flex items-center justify-between text-sm text-zinc-400">
        {author && <span className="font-medium text-white">{author}</span>}
        {date && <span>{date}</span>}
      </div>
    </div>
  );
}

// ============================================================================
// STATS & METRICS
// ============================================================================

export function StatsAnimated({ children }: any) {
  return (
    <div className="my-16 grid grid-cols-2 lg:grid-cols-4 gap-6">
      {children}
    </div>
  );
}

export function Stat({ value, label, sublabel }: any) {
  return (
    <motion.div
      className="text-center p-6 rounded-lg bg-zinc-900/30 border border-zinc-800"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
    >
      <div className="text-4xl font-light text-cyan-500 mb-2">{value}</div>
      <div className="text-sm font-medium text-white">{label}</div>
      {sublabel && <div className="text-xs text-zinc-500 mt-1">{sublabel}</div>}
    </motion.div>
  );
}

export function MetricsGrid({ children }: any) {
  return (
    <div className="my-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {children}
    </div>
  );
}

export function Metric({ label, value, change }: any) {
  return (
    <div className="p-6 rounded-lg bg-zinc-900/30 border border-zinc-800">
      <div className="text-sm text-zinc-400 mb-1">{label}</div>
      <div className="text-3xl font-light text-white mb-1">{value}</div>
      {change && <div className="text-xs text-green-500">{change}</div>}
    </div>
  );
}

export function StatsShowcase({ children }: any) {
  return (
    <div className="my-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {children}
    </div>
  );
}

export function StatCard({ number, label, sublabel, trend, highlight }: any) {
  return (
    <motion.div
      className={`p-8 rounded-xl border ${highlight ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-zinc-900/30 border-zinc-800'}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className={`text-4xl lg:text-5xl font-light mb-2 ${highlight ? 'text-cyan-500' : 'text-white'}`}>
        {number}
      </div>
      <div className="text-base font-medium text-white mb-1">{label}</div>
      {sublabel && <div className="text-sm text-zinc-400">{sublabel}</div>}
    </motion.div>
  );
}

// ============================================================================
// TIMELINE
// ============================================================================

export function Timeline({ children, variant = 'default' }: any) {
  const items = Array.isArray(children) ? children : [children];

  return (
    <div className="my-16 space-y-8">
      {items.map((item: any, index: number) => (
        <motion.div
          key={index}
          className="flex gap-6"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex flex-col items-center">
            <div className="w-4 h-4 rounded-full bg-cyan-500 border-4 border-zinc-950" />
            {index < items.length - 1 && (
              <div className="w-0.5 flex-1 bg-zinc-800 mt-2" />
            )}
          </div>
          <div className="flex-1 pb-8">
            <div className="prose prose-invert max-w-none">{item}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ============================================================================
// CALL TO ACTION
// ============================================================================

export function CallToAction({ title, description, primaryButton, secondaryButton, variant = 'default', badge }: any) {
  return (
    <div className={`my-16 p-12 rounded-2xl text-center ${variant === 'gradient' ? 'bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-blue-500/10 border border-zinc-800' : 'bg-zinc-900/50 border border-zinc-800'}`}>
      {badge && (
        <div className="inline-block px-4 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-medium mb-6">
          {badge}
        </div>
      )}
      <h2 className="text-3xl lg:text-4xl font-light text-white mb-4">{title}</h2>
      {description && <p className="text-lg text-zinc-400 mb-8 max-w-2xl mx-auto">{description}</p>}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {primaryButton && (
          <Link
            href={primaryButton.link}
            className="px-8 py-4 bg-white text-zinc-950 rounded-lg font-medium hover:bg-zinc-100 transition-colors"
          >
            {primaryButton.text}
          </Link>
        )}
        {secondaryButton && (
          <Link
            href={secondaryButton.link}
            className="px-8 py-4 bg-zinc-900 border border-zinc-800 text-white rounded-lg font-medium hover:bg-zinc-800 transition-colors"
          >
            {secondaryButton.text}
          </Link>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// SPECIAL COMPONENTS
// ============================================================================

export function ProjectGrid({ children }: any) {
  return (
    <div className="my-16 grid grid-cols-1 md:grid-cols-2 gap-6">
      {children}
    </div>
  );
}

export function ComparisonSlider({ children, leftLabel, rightLabel }: any) {
  return (
    <div className="my-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {children}
    </div>
  );
}

export function ImageFloat({ children, src, alt, side = 'right' }: any) {
  return (
    <div className={`my-8 flex flex-col ${side === 'right' ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-6`}>
      {src && (
        <div className="lg:w-1/2">
          <Image src={src} alt={alt || ''} width={600} height={400} className="rounded-lg" />
        </div>
      )}
      <div className="lg:w-1/2 prose prose-invert">{children}</div>
    </div>
  );
}

export function Credits({ children }: any) {
  return (
    <div className="mt-24 pt-8 border-t border-zinc-800 text-sm text-zinc-500">
      <div className="prose prose-invert prose-sm">{children}</div>
    </div>
  );
}

// Placeholders for more complex components (to be implemented fully)
export const CodeBlock = ({ children, language, filename, lineNumbers }: any) => (
  <div className="my-8 bg-zinc-900 rounded-lg overflow-hidden">
    {filename && (
      <div className="px-6 py-2 bg-zinc-800 text-sm text-zinc-400 font-mono">{filename}</div>
    )}
    <pre className="p-6 overflow-x-auto">
      <code className="text-sm text-cyan-400 font-mono">{children}</code>
    </pre>
  </div>
);

export const ArchitectureDiagram = ({ title, src, interactive, layers }: any) => (
  <div className="my-12">
    {title && <h3 className="text-xl text-white mb-4">{title}</h3>}
    {src && <Image src={src} alt={title || 'Architecture diagram'} width={800} height={600} className="rounded-lg" />}
  </div>
);

export const VideoEmbed = ({ src, title, thumbnail, duration }: any) => (
  <div className="my-12 aspect-video bg-zinc-900 rounded-lg flex items-center justify-center">
    <div className="text-center">
      <div className="text-zinc-500 mb-2">{title}</div>
      <div className="text-sm text-zinc-600">{duration}</div>
    </div>
  </div>
);

export const GPUComparisonTable = ({ children }: any) => (
  <div className="my-8 overflow-x-auto">
    <table className="w-full">{children}</table>
  </div>
);

export const AlertBox = ({ children, type = 'info' }: any) => {
  const colors = {
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    error: 'bg-red-500/10 border-red-500/30 text-red-400',
    success: 'bg-green-500/10 border-green-500/30 text-green-400',
  };

  return (
    <div className={`my-8 p-6 rounded-lg border ${colors[type as keyof typeof colors]}`}>
      <div className="prose prose-invert">{children}</div>
    </div>
  );
};

export const PricingCard = ({ children, variant = 'default', highlighted }: any) => (
  <div className={`my-8 p-8 rounded-xl border ${highlighted ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-zinc-900/30 border-zinc-800'}`}>
    <div className="prose prose-invert">{children}</div>
  </div>
);

export const FAQSection = ({ children }: any) => (
  <div className="my-12 space-y-6">
    {children}
  </div>
);

export const TestimonialGrid = ({ children }: any) => (
  <div className="my-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {children}
  </div>
);

export const Testimonial = ({ author, role, company, avatar, rating, children }: any) => (
  <div className="p-6 rounded-lg bg-zinc-900/30 border border-zinc-800">
    <div className="flex items-center gap-3 mb-4">
      {avatar && <Image src={avatar} alt={author} width={48} height={48} className="rounded-full" />}
      <div>
        <div className="font-medium text-white">{author}</div>
        <div className="text-sm text-zinc-400">{role}</div>
        {company && <div className="text-xs text-zinc-500">{company}</div>}
      </div>
    </div>
    {rating && (
      <div className="flex gap-1 mb-4">
        {Array.from({ length: rating }).map((_, i) => (
          <span key={i} className="text-yellow-500">★</span>
        ))}
      </div>
    )}
    <div className="text-zinc-300 text-sm">{children}</div>
  </div>
);

export const Intro = ({ children }: any) => (
  <div className="text-xl lg:text-2xl font-light text-zinc-300 leading-relaxed mb-12 pb-8 border-b border-zinc-800">
    {children}
  </div>
);

export const MetricsChart = ({ type, title, data }: any) => (
  <div className="my-12 p-6 rounded-lg bg-zinc-900/30 border border-zinc-800">
    <h3 className="text-lg text-white mb-4">{title}</h3>
    <div className="h-64 flex items-end justify-center text-zinc-500">
      Chart placeholder (requires charting library)
    </div>
  </div>
);
