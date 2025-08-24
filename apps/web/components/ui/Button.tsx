'use client';

// /workspaces/website/apps/web/components/ui/Button.tsx
// Description: Component Button unifié selon le design system
// Last modified: 2025-08-24
// Related docs: /docs/JOURNAL.md

// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'btn-primary';
      case 'secondary':
        return 'bg-transparent border border-zinc-600 text-zinc-300 hover:border-zinc-500 hover:text-white hover:bg-zinc-800/20';
      case 'ghost':
        return 'bg-transparent text-zinc-300 hover:text-white hover:bg-zinc-800/20';
      default:
        return 'btn-primary';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-8 min-w-20 px-3 text-sm';
      case 'md':
        return 'h-11 min-w-32 px-6 text-sm';
      case 'lg':
        return 'h-12 min-w-36 px-8 text-base';
      default:
        return 'h-11 min-w-32 px-6 text-sm';
    }
  };

  const isDisabled = disabled || loading;

  return (
    <button
      className={`btn ${getVariantClasses()} ${getSizeClasses()} ${className} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className="mr-2">{icon}</span>
          )}
          {children}
          {icon && iconPosition === 'right' && (
            <span className="ml-2">{icon}</span>
          )}
        </>
      )}
    </button>
  );
};

export default Button;