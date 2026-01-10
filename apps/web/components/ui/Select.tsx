// /workspaces/website/apps/web/components/ui/Select.tsx
// Description: Custom Select component with styled dropdown (no native browser styles)
// Last modified: 2026-01-10

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost';
}

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Sélectionner...',
  disabled = false,
  className = '',
  size = 'md',
  variant = 'default',
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  const selectedOption = options.find(opt => opt.value === value);

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-8 px-3 text-xs';
      case 'md':
        return 'h-10 px-4 text-sm';
      case 'lg':
        return 'h-12 px-5 text-base';
      default:
        return 'h-10 px-4 text-sm';
    }
  };

  const getVariantClasses = () => {
    if (variant === 'ghost') {
      return 'bg-transparent border-transparent hover:bg-zinc-800/50';
    }
    return 'bg-zinc-900 border-zinc-700 hover:border-zinc-600';
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between gap-2
          border rounded-lg font-medium
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-0
          ${getSizeClasses()}
          ${getVariantClasses()}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isOpen ? 'border-zinc-500 ring-1 ring-zinc-500' : ''}
          ${selectedOption ? 'text-white' : 'text-zinc-400'}
        `}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-zinc-400 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="
            absolute z-50 mt-1 w-full
            bg-zinc-900 border border-zinc-700 rounded-lg
            shadow-xl shadow-black/20
            py-1 max-h-60 overflow-auto
            animate-in fade-in-0 zoom-in-95 duration-100
          "
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                if (!option.disabled) {
                  onChange(option.value);
                  setIsOpen(false);
                }
              }}
              disabled={option.disabled}
              className={`
                w-full flex items-center justify-between gap-2
                px-4 py-2.5 text-sm text-left
                transition-colors duration-100
                ${option.disabled
                  ? 'text-zinc-600 cursor-not-allowed'
                  : option.value === value
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                }
              `}
            >
              <span className="truncate">{option.label}</span>
              {option.value === value && (
                <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Select;
