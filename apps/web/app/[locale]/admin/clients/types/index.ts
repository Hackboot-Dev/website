// apps/web/app/[locale]/admin/clients/types/index.ts
// Description: Clients module types
// Last modified: 2025-12-19

// Re-export from database types for convenience
export type {
  Client,
  CreateClient,
  ClientStatus,
  ClientType,
  AggregatedClientStats,
} from '../../../../../lib/types/database';

// Module-specific types
export type ModalMode = 'create' | 'edit' | 'view' | null;

export type StatusConfig = {
  label: string;
  color: string;
  bgColor: string;
};

export type TypeConfig = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};
