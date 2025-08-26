'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface SpecsModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  specs: Array<{
    name: string;
    value: string;
  }>;
  language?: 'fr' | 'en';
}

export default function SpecsModal({
  isOpen,
  onClose,
  category,
  specs,
  language = 'fr'
}: SpecsModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-2 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-zinc-800">
            <h3 className="text-xl font-medium text-white">
              {category}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
              aria-label={language === 'fr' ? 'Fermer' : 'Close'}
            >
              <X className="w-5 h-5 text-zinc-400 hover:text-white" />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
            <div className="space-y-4">
              {specs.map((spec, index) => (
                <div 
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-start gap-2 pb-4 border-b border-zinc-800/50 last:border-b-0"
                >
                  <div className="sm:w-1/3">
                    <span className="text-sm font-medium text-zinc-400">
                      {spec.name}
                    </span>
                  </div>
                  <div className="sm:w-2/3">
                    <span className="text-sm text-white/90 leading-relaxed">
                      {spec.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Footer */}
          <div className="p-6 border-t border-zinc-800">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              {language === 'fr' ? 'Fermer' : 'Close'}
            </button>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgb(39 39 42 / 0.5);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgb(63 63 70);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgb(82 82 91);
        }
      `}</style>
    </>
  );
}