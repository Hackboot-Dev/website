// apps/web/app/[locale]/admin/_shared/components/EditableCell.tsx
// Description: Reusable inline editable cell component
// Last modified: 2025-12-19

'use client';

import { useState, useEffect, useRef } from 'react';
import { Check, X, Edit3 } from 'lucide-react';

type EditableCellProps = {
  value: string | number;
  onSave: (value: string | number) => void;
  type?: 'text' | 'number';
  className?: string;
  displayClassName?: string;
  inputClassName?: string;
  formatDisplay?: (value: string | number) => string;
  showEditIcon?: boolean;
};

export function EditableCell({
  value,
  onSave,
  type = 'text',
  className = '',
  displayClassName = 'text-zinc-300 hover:text-white',
  inputClassName = 'w-full bg-zinc-800 border border-violet-500 rounded px-2 py-1 text-white text-sm',
  formatDisplay,
  showEditIcon = true,
}: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(value));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditValue(String(value));
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    const newValue = type === 'number' ? parseFloat(editValue) || 0 : editValue;
    onSave(newValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(String(value));
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <input
          ref={inputRef}
          type={type}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={inputClassName}
        />
        <button onClick={handleSave} className="text-emerald-400 hover:text-emerald-300">
          <Check className="h-4 w-4" />
        </button>
        <button onClick={handleCancel} className="text-zinc-400 hover:text-zinc-300">
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className={`flex items-center gap-1 group ${displayClassName} ${className}`}
    >
      <span>{formatDisplay ? formatDisplay(value) : value}</span>
      {showEditIcon && (
        <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </button>
  );
}
