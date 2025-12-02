// apps/web/app/[locale]/ads/page.tsx
// Description: Protected ads creation page with canvas editor
// Last modified: 2025-11-30

'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  LogOut,
  Download,
  Image as ImageIcon,
  Type,
  Square,
  Circle,
  Palette,
  Layers,
  Trash2,
  Copy,
  ChevronDown,
  Sparkles,
  Monitor,
  Smartphone,
  LayoutTemplate,
  Zap,
  Server,
  Cloud,
  Cpu,
  HardDrive,
  Globe,
  Shield,
  Rocket
} from 'lucide-react';

// Predefined color palette matching VMCloud brand
const BRAND_COLORS = {
  primary: '#22d3ee', // Cyan
  secondary: '#a78bfa', // Purple
  accent: '#34d399', // Green
  dark: '#18181b', // Zinc-900
  darker: '#0a0a0a', // Almost black
  light: '#fafafa', // White
  zinc: {
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
  }
};

// Predefined templates
const TEMPLATES = [
  {
    id: 'vps-promo',
    name: 'VPS Promo',
    icon: Server,
    elements: [
      { type: 'rect', x: 0, y: 0, width: 1200, height: 630, fill: 'linear-gradient(135deg, #0a0a0a 0%, #18181b 100%)' },
      { type: 'text', x: 100, y: 200, text: 'VPS Ultra-Performant', fontSize: 64, fontWeight: 'bold', fill: '#ffffff' },
      { type: 'text', x: 100, y: 300, text: 'Dès 29€/mois', fontSize: 48, fontWeight: 'normal', fill: '#22d3ee' },
      { type: 'text', x: 100, y: 400, text: 'AMD EPYC • SSD NVMe • 10 Gbps', fontSize: 24, fontWeight: 'normal', fill: '#a1a1aa' },
    ]
  },
  {
    id: 'gpu-power',
    name: 'GPU Computing',
    icon: Cpu,
    elements: [
      { type: 'rect', x: 0, y: 0, width: 1200, height: 630, fill: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)' },
      { type: 'text', x: 100, y: 180, text: 'GPU Computing', fontSize: 64, fontWeight: 'bold', fill: '#ffffff' },
      { type: 'text', x: 100, y: 280, text: 'Tesla A100 • RTX 4090', fontSize: 36, fontWeight: 'normal', fill: '#a78bfa' },
      { type: 'text', x: 100, y: 380, text: 'IA, ML, Rendu 3D', fontSize: 28, fontWeight: 'normal', fill: '#a1a1aa' },
    ]
  },
  {
    id: 'cloud-storage',
    name: 'Cloud Storage',
    icon: HardDrive,
    elements: [
      { type: 'rect', x: 0, y: 0, width: 1200, height: 630, fill: 'linear-gradient(135deg, #0a0a0a 0%, #064e3b 30%)' },
      { type: 'text', x: 100, y: 200, text: 'Stockage Cloud', fontSize: 64, fontWeight: 'bold', fill: '#ffffff' },
      { type: 'text', x: 100, y: 300, text: 'Sécurisé & Redondant', fontSize: 36, fontWeight: 'normal', fill: '#34d399' },
      { type: 'text', x: 100, y: 380, text: '3 datacenters EU • Chiffrement AES-256', fontSize: 24, fontWeight: 'normal', fill: '#a1a1aa' },
    ]
  },
  {
    id: 'web-hosting',
    name: 'Web Hosting',
    icon: Globe,
    elements: [
      { type: 'rect', x: 0, y: 0, width: 1200, height: 630, fill: 'linear-gradient(135deg, #0a0a0a 0%, #1e3a5f 100%)' },
      { type: 'text', x: 100, y: 200, text: 'Hébergement Web', fontSize: 64, fontWeight: 'bold', fill: '#ffffff' },
      { type: 'text', x: 100, y: 300, text: 'Performance & Fiabilité', fontSize: 36, fontWeight: 'normal', fill: '#38bdf8' },
      { type: 'text', x: 100, y: 380, text: 'SSL gratuit • CDN inclus • 99.9% SLA', fontSize: 24, fontWeight: 'normal', fill: '#a1a1aa' },
    ]
  },
];

// Canvas sizes for different platforms
const CANVAS_SIZES = {
  'og-image': { width: 1200, height: 630, label: 'OG Image (1200x630)' },
  'instagram-post': { width: 1080, height: 1080, label: 'Instagram Post (1080x1080)' },
  'instagram-story': { width: 1080, height: 1920, label: 'Instagram Story (1080x1920)' },
  'twitter-post': { width: 1200, height: 675, label: 'Twitter Post (1200x675)' },
  'facebook-post': { width: 1200, height: 630, label: 'Facebook Post (1200x630)' },
  'linkedin-post': { width: 1200, height: 627, label: 'LinkedIn Post (1200x627)' },
};

type CanvasSizeKey = keyof typeof CANVAS_SIZES;

interface CanvasElement {
  id: string;
  type: 'text' | 'rect' | 'circle' | 'image';
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  text?: string;
  fontSize?: number;
  fontWeight?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  imageUrl?: string;
}

export default function AdsPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState<CanvasSizeKey>('og-image');
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(true);
  const [currentColor, setCurrentColor] = useState(BRAND_COLORS.primary);

  // Handle logout
  const handleLogout = async () => {
    await fetch('/api/ads/logout', { method: 'POST' });
    router.refresh();
  };

  // Generate unique ID
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Add element to canvas
  const addElement = (type: CanvasElement['type']) => {
    const size = CANVAS_SIZES[canvasSize];
    const newElement: CanvasElement = {
      id: generateId(),
      type,
      x: size.width / 2 - 100,
      y: size.height / 2 - 50,
    };

    switch (type) {
      case 'text':
        newElement.text = 'Nouveau texte';
        newElement.fontSize = 32;
        newElement.fontWeight = 'bold';
        newElement.fill = '#ffffff';
        break;
      case 'rect':
        newElement.width = 200;
        newElement.height = 100;
        newElement.fill = currentColor;
        break;
      case 'circle':
        newElement.radius = 50;
        newElement.fill = currentColor;
        break;
    }

    setElements([...elements, newElement]);
    setSelectedElement(newElement.id);
  };

  // Apply template - adapts to current canvas size
  const applyTemplate = (template: typeof TEMPLATES[0]) => {
    const currentSize = CANVAS_SIZES[canvasSize];
    const templateSize = { width: 1200, height: 630 }; // Original template size

    // Calculate scale and offset for centering content
    const isVertical = currentSize.height > currentSize.width;
    const scaleX = currentSize.width / templateSize.width;
    const scaleY = currentSize.height / templateSize.height;
    const scale = Math.min(scaleX, scaleY);

    // Vertical offset to center content in vertical formats
    const verticalOffset = isVertical ? (currentSize.height - templateSize.height * scale) / 3 : 0;

    const newElements: CanvasElement[] = template.elements.map((el, index) => {
      // First element is always the background - make it full size
      if (index === 0 && el.type === 'rect') {
        return {
          id: generateId(),
          type: 'rect' as const,
          x: 0,
          y: 0,
          width: currentSize.width,
          height: currentSize.height,
          fill: el.fill,
        };
      }

      // Scale and reposition other elements
      return {
        id: generateId(),
        type: el.type as CanvasElement['type'],
        x: Math.round(el.x * scale),
        y: Math.round(el.y * scale + verticalOffset),
        width: el.width ? Math.round(el.width * scale) : undefined,
        height: el.height ? Math.round(el.height * scale) : undefined,
        text: el.text,
        fontSize: el.fontSize ? Math.round(el.fontSize * scale) : undefined,
        fontWeight: el.fontWeight,
        fill: el.fill,
      };
    });
    setElements(newElements);
    setShowTemplates(false);
  };

  // Delete selected element
  const deleteElement = () => {
    if (selectedElement) {
      setElements(elements.filter(el => el.id !== selectedElement));
      setSelectedElement(null);
    }
  };

  // Duplicate selected element
  const duplicateElement = () => {
    const el = elements.find(e => e.id === selectedElement);
    if (el) {
      const newEl = { ...el, id: generateId(), x: el.x + 20, y: el.y + 20 };
      setElements([...elements, newEl]);
      setSelectedElement(newEl.id);
    }
  };

  // Update element property
  const updateElement = (id: string, updates: Partial<CanvasElement>) => {
    setElements(elements.map(el =>
      el.id === id ? { ...el, ...updates } : el
    ));
  };

  // Draw canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = CANVAS_SIZES[canvasSize];
    canvas.width = size.width;
    canvas.height = size.height;

    // Clear canvas
    ctx.fillStyle = BRAND_COLORS.darker;
    ctx.fillRect(0, 0, size.width, size.height);

    // Draw elements
    elements.forEach(el => {
      ctx.save();

      if (el.type === 'rect' && el.width && el.height) {
        // Handle gradient fills
        if (el.fill?.startsWith('linear-gradient')) {
          const gradient = ctx.createLinearGradient(el.x, el.y, el.x + el.width, el.y + el.height);
          // Parse gradient (simplified)
          gradient.addColorStop(0, '#0a0a0a');
          gradient.addColorStop(1, '#18181b');
          ctx.fillStyle = gradient;
        } else {
          ctx.fillStyle = el.fill || '#ffffff';
        }
        ctx.fillRect(el.x, el.y, el.width, el.height);
      }

      if (el.type === 'circle' && el.radius) {
        ctx.beginPath();
        ctx.arc(el.x + el.radius, el.y + el.radius, el.radius, 0, Math.PI * 2);
        ctx.fillStyle = el.fill || '#ffffff';
        ctx.fill();
      }

      if (el.type === 'text' && el.text) {
        ctx.font = `${el.fontWeight || 'normal'} ${el.fontSize || 32}px Inter, system-ui, sans-serif`;
        ctx.fillStyle = el.fill || '#ffffff';
        ctx.fillText(el.text, el.x, el.y);
      }

      // Draw selection indicator
      if (el.id === selectedElement) {
        ctx.strokeStyle = BRAND_COLORS.primary;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        if (el.type === 'rect' && el.width && el.height) {
          ctx.strokeRect(el.x - 5, el.y - 5, el.width + 10, el.height + 10);
        } else if (el.type === 'circle' && el.radius) {
          ctx.beginPath();
          ctx.arc(el.x + el.radius, el.y + el.radius, el.radius + 5, 0, Math.PI * 2);
          ctx.stroke();
        } else if (el.type === 'text') {
          const metrics = ctx.measureText(el.text || '');
          ctx.strokeRect(el.x - 5, el.y - (el.fontSize || 32) - 5, metrics.width + 10, (el.fontSize || 32) + 10);
        }
      }

      ctx.restore();
    });
  }, [elements, canvasSize, selectedElement]);

  // Redraw on changes (with small delay to ensure canvas is mounted)
  useEffect(() => {
    const timer = setTimeout(() => {
      drawCanvas();
    }, 10);
    return () => clearTimeout(timer);
  }, [elements, selectedElement, canvasSize, drawCanvas]);

  // Export canvas
  const exportCanvas = (format: 'png' | 'jpg') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    drawCanvas();

    const link = document.createElement('a');
    link.download = `vmcloud-ad-${Date.now()}.${format}`;
    link.href = canvas.toDataURL(format === 'jpg' ? 'image/jpeg' : 'image/png', 0.95);
    link.click();
  };

  const selectedEl = elements.find(el => el.id === selectedElement);

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-800">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-cyan-400" />
              <span className="text-lg font-semibold text-white">VMCloud Ads Creator</span>
            </div>
            <div className="h-6 w-px bg-zinc-700" />
            <select
              value={canvasSize}
              onChange={(e) => setCanvasSize(e.target.value as CanvasSizeKey)}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-cyan-500"
            >
              {Object.entries(CANVAS_SIZES).map(([key, value]) => (
                <option key={key} value={key}>{value.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => exportCanvas('png')}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-medium rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Export PNG
            </button>
            <button
              onClick={() => exportCanvas('jpg')}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Export JPG
            </button>
            <div className="h-6 w-px bg-zinc-700" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-zinc-400 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex pt-16">
        {/* Left sidebar - Tools */}
        <aside className="fixed left-0 top-16 bottom-0 w-16 bg-zinc-900 border-r border-zinc-800 flex flex-col items-center py-4 gap-2">
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className={`p-3 rounded-lg transition-colors ${showTemplates ? 'bg-cyan-500/20 text-cyan-400' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
            title="Templates"
          >
            <LayoutTemplate className="w-5 h-5" />
          </button>
          <div className="h-px w-8 bg-zinc-800 my-2" />
          <button
            onClick={() => addElement('text')}
            className="p-3 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Add Text"
          >
            <Type className="w-5 h-5" />
          </button>
          <button
            onClick={() => addElement('rect')}
            className="p-3 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Add Rectangle"
          >
            <Square className="w-5 h-5" />
          </button>
          <button
            onClick={() => addElement('circle')}
            className="p-3 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Add Circle"
          >
            <Circle className="w-5 h-5" />
          </button>
          <div className="h-px w-8 bg-zinc-800 my-2" />
          <button
            onClick={duplicateElement}
            disabled={!selectedElement}
            className="p-3 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Duplicate"
          >
            <Copy className="w-5 h-5" />
          </button>
          <button
            onClick={deleteElement}
            disabled={!selectedElement}
            className="p-3 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Delete"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </aside>

        {/* Templates panel */}
        {showTemplates && (
          <aside className="fixed left-16 top-16 bottom-0 w-72 bg-zinc-900/95 border-r border-zinc-800 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-white mb-4">Templates VMCloud</h3>
              <div className="space-y-3">
                {TEMPLATES.map((template) => {
                  const Icon = template.icon;
                  return (
                    <button
                      key={template.id}
                      onClick={() => applyTemplate(template)}
                      className="w-full p-4 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 hover:border-cyan-500/50 rounded-xl text-left transition-all group"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-zinc-700/50 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                          <Icon className="w-4 h-4 text-zinc-400 group-hover:text-cyan-400" />
                        </div>
                        <span className="font-medium text-white">{template.name}</span>
                      </div>
                      <div className="h-20 bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-lg" />
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        )}

        {/* Canvas area */}
        <main className={`flex-1 ${showTemplates ? 'ml-[352px]' : 'ml-16'} mr-72 p-8 flex items-center justify-center min-h-[calc(100vh-4rem)] transition-all overflow-auto`}>
          <div
            className="relative flex items-center justify-center"
            style={{
              width: '100%',
              maxWidth: CANVAS_SIZES[canvasSize].width >= CANVAS_SIZES[canvasSize].height ? '700px' : '400px',
            }}
          >
            <canvas
              key={canvasSize}
              ref={canvasRef}
              width={CANVAS_SIZES[canvasSize].width}
              height={CANVAS_SIZES[canvasSize].height}
              className="bg-zinc-900 rounded-lg shadow-2xl border border-zinc-800 w-full"
              style={{
                aspectRatio: `${CANVAS_SIZES[canvasSize].width} / ${CANVAS_SIZES[canvasSize].height}`,
              }}
              onClick={(e) => {
                // Simple element selection on click
                const rect = canvasRef.current?.getBoundingClientRect();
                if (!rect) return;
                const scaleX = CANVAS_SIZES[canvasSize].width / rect.width;
                const scaleY = CANVAS_SIZES[canvasSize].height / rect.height;
                const x = (e.clientX - rect.left) * scaleX;
                const y = (e.clientY - rect.top) * scaleY;

                // Find clicked element (reverse order for top-most first)
                for (let i = elements.length - 1; i >= 0; i--) {
                  const el = elements[i];
                  if (el.type === 'rect' && el.width && el.height) {
                    if (x >= el.x && x <= el.x + el.width && y >= el.y && y <= el.y + el.height) {
                      setSelectedElement(el.id);
                      drawCanvas();
                      return;
                    }
                  }
                  if (el.type === 'circle' && el.radius) {
                    const dx = x - (el.x + el.radius);
                    const dy = y - (el.y + el.radius);
                    if (Math.sqrt(dx * dx + dy * dy) <= el.radius) {
                      setSelectedElement(el.id);
                      drawCanvas();
                      return;
                    }
                  }
                  if (el.type === 'text') {
                    // Simplified text hit detection
                    if (x >= el.x && x <= el.x + 300 && y >= el.y - (el.fontSize || 32) && y <= el.y) {
                      setSelectedElement(el.id);
                      drawCanvas();
                      return;
                    }
                  }
                }
                setSelectedElement(null);
                drawCanvas();
              }}
            />

            {/* Canvas size indicator */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-zinc-500">
              {CANVAS_SIZES[canvasSize].width} × {CANVAS_SIZES[canvasSize].height}px
            </div>
          </div>
        </main>

        {/* Right sidebar - Properties */}
        <aside className="fixed right-0 top-16 bottom-0 w-72 bg-zinc-900 border-l border-zinc-800 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-white mb-4">Propriétés</h3>

            {selectedEl ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Type</label>
                  <div className="text-sm text-white capitalize">{selectedEl.type}</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">X</label>
                    <input
                      type="number"
                      value={selectedEl.x}
                      onChange={(e) => updateElement(selectedEl.id, { x: parseInt(e.target.value) || 0 })}
                      className="w-full px-2 py-1.5 bg-zinc-800 border border-zinc-700 rounded text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Y</label>
                    <input
                      type="number"
                      value={selectedEl.y}
                      onChange={(e) => updateElement(selectedEl.id, { y: parseInt(e.target.value) || 0 })}
                      className="w-full px-2 py-1.5 bg-zinc-800 border border-zinc-700 rounded text-sm text-white"
                    />
                  </div>
                </div>

                {(selectedEl.type === 'rect') && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Largeur</label>
                      <input
                        type="number"
                        value={selectedEl.width || 0}
                        onChange={(e) => updateElement(selectedEl.id, { width: parseInt(e.target.value) || 0 })}
                        className="w-full px-2 py-1.5 bg-zinc-800 border border-zinc-700 rounded text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Hauteur</label>
                      <input
                        type="number"
                        value={selectedEl.height || 0}
                        onChange={(e) => updateElement(selectedEl.id, { height: parseInt(e.target.value) || 0 })}
                        className="w-full px-2 py-1.5 bg-zinc-800 border border-zinc-700 rounded text-sm text-white"
                      />
                    </div>
                  </div>
                )}

                {selectedEl.type === 'circle' && (
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Rayon</label>
                    <input
                      type="number"
                      value={selectedEl.radius || 0}
                      onChange={(e) => updateElement(selectedEl.id, { radius: parseInt(e.target.value) || 0 })}
                      className="w-full px-2 py-1.5 bg-zinc-800 border border-zinc-700 rounded text-sm text-white"
                    />
                  </div>
                )}

                {selectedEl.type === 'text' && (
                  <>
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Texte</label>
                      <input
                        type="text"
                        value={selectedEl.text || ''}
                        onChange={(e) => updateElement(selectedEl.id, { text: e.target.value })}
                        className="w-full px-2 py-1.5 bg-zinc-800 border border-zinc-700 rounded text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Taille police</label>
                      <input
                        type="number"
                        value={selectedEl.fontSize || 32}
                        onChange={(e) => updateElement(selectedEl.id, { fontSize: parseInt(e.target.value) || 32 })}
                        className="w-full px-2 py-1.5 bg-zinc-800 border border-zinc-700 rounded text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Épaisseur</label>
                      <select
                        value={selectedEl.fontWeight || 'normal'}
                        onChange={(e) => updateElement(selectedEl.id, { fontWeight: e.target.value })}
                        className="w-full px-2 py-1.5 bg-zinc-800 border border-zinc-700 rounded text-sm text-white"
                      >
                        <option value="normal">Normal</option>
                        <option value="bold">Bold</option>
                        <option value="100">Thin</option>
                        <option value="300">Light</option>
                        <option value="500">Medium</option>
                        <option value="600">Semibold</option>
                        <option value="800">Extrabold</option>
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs text-zinc-400 mb-2">Couleur</label>
                  <div className="grid grid-cols-6 gap-2">
                    {[
                      '#ffffff', '#22d3ee', '#a78bfa', '#34d399',
                      '#f97316', '#ef4444', '#a1a1aa', '#3f3f46',
                      '#18181b', '#0a0a0a', '#fbbf24', '#ec4899'
                    ].map((color) => (
                      <button
                        key={color}
                        onClick={() => updateElement(selectedEl.id, { fill: color })}
                        className={`w-8 h-8 rounded-lg border-2 transition-all ${selectedEl.fill === color ? 'border-white scale-110' : 'border-zinc-700 hover:border-zinc-500'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <input
                    type="color"
                    value={selectedEl.fill || '#ffffff'}
                    onChange={(e) => updateElement(selectedEl.id, { fill: e.target.value })}
                    className="w-full h-8 mt-2 rounded cursor-pointer"
                  />
                </div>
              </div>
            ) : (
              <div className="text-sm text-zinc-500 text-center py-8">
                Sélectionnez un élément pour modifier ses propriétés
              </div>
            )}

            {/* Layers */}
            <div className="mt-8 pt-4 border-t border-zinc-800">
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Calques ({elements.length})
              </h4>
              <div className="space-y-1">
                {[...elements].reverse().map((el, index) => (
                  <button
                    key={el.id}
                    onClick={() => {
                      setSelectedElement(el.id);
                      drawCanvas();
                    }}
                    className={`w-full px-3 py-2 text-left text-sm rounded-lg transition-colors ${el.id === selectedElement ? 'bg-cyan-500/20 text-cyan-400' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                      }`}
                  >
                    <span className="capitalize">{el.type}</span>
                    {el.type === 'text' && (
                      <span className="ml-2 text-xs opacity-60 truncate">
                        {el.text?.substring(0, 15)}...
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

    </div>
  );
}
