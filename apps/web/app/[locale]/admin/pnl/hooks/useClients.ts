// /workspaces/website/apps/web/app/[locale]/admin/pnl/hooks/useClients.ts
// Description: Hook for client management in P&L module - Supabase version
// Last modified: 2025-01-10
// Migrated from Firebase to Supabase

import { useState, useCallback } from 'react';
import { supabase } from '../../../../../lib/supabase';
import type { Client } from '../../../../../lib/types/database';
import type { GeneratedClient } from '../../../../../lib/utils/clientGenerator';
import type { CompanyId } from '../types';

// ============================================================
// TYPES
// ============================================================

type UseClientsOptions = {
  company: CompanyId;
};

type UseClientsReturn = {
  // State
  clients: Client[];
  loadingClients: boolean;

  // Actions
  loadClients: () => Promise<void>;
  createClientInDb: (clientData: GeneratedClient) => Promise<Client>;
  updateClientStats: (clientId: string, amount: number) => Promise<void>;
};

// ============================================================
// HOOK: useClients
// ============================================================

export function useClients({ company }: UseClientsOptions): UseClientsReturn {
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);

  // Load clients from Supabase
  const loadClients = useCallback(async () => {
    try {
      setLoadingClients(true);

      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('company_id', company)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map Supabase snake_case to camelCase
      type ClientRow = {
        id: string;
        company_id: string;
        name: string;
        email: string;
        phone: string | null;
        country: string | null;
        company: string | null;
        type: 'individual' | 'business' | 'enterprise';
        status: 'lead' | 'active' | 'inactive' | 'churned';
        currency: string | null;
        total_revenue: number;
        total_transactions: number;
        created_at: string;
        updated_at: string;
        first_purchase_at: string | null;
        last_purchase_at: string | null;
        notes: string | null;
        tags: string[];
        metadata: Record<string, unknown>;
      };
      const clientsData = (data || []).map((row: ClientRow) => ({
        id: row.id,
        companyId: row.company_id as 'vmcloud' | 'hackboot',
        name: row.name,
        email: row.email,
        phone: row.phone || '',
        country: row.country || undefined,
        company: row.company || undefined,
        type: row.type,
        status: row.status,
        currency: row.currency || 'EUR',
        totalRevenue: row.total_revenue || 0,
        totalTransactions: row.total_transactions || 0,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        firstPurchaseAt: row.first_purchase_at || undefined,
        lastPurchaseAt: row.last_purchase_at || undefined,
        notes: row.notes || undefined,
        tags: row.tags || [],
        metadata: row.metadata || {},
      })) as Client[];

      setClients(clientsData);
    } catch (err) {
      console.error('Error loading clients:', err);
    } finally {
      setLoadingClients(false);
    }
  }, [company]);

  // Create client in Supabase
  const createClientInDb = useCallback(
    async (clientData: GeneratedClient): Promise<Client> => {
      const now = new Date().toISOString();

      const client: Client = {
        id: clientData.id,
        companyId: company,
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone || '',
        type: clientData.type === 'business' ? 'business' : 'individual',
        status: 'active',
        currency: 'EUR',
        isGenerated: clientData.isGenerated ?? true,
        generatedAt: clientData.generatedAt,
        createdAt: now,
        updatedAt: now,
        totalRevenue: 0,
        totalTransactions: 0,
      };

      // Add optional fields only if defined
      if (clientData.company) client.company = clientData.company;
      if (clientData.country) client.country = clientData.country;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('clients')
        .insert({
          id: client.id,
          company_id: client.companyId,
          name: client.name,
          email: client.email,
          phone: client.phone || null,
          country: client.country || null,
          company: client.company || null,
          type: client.type,
          status: client.status,
          currency: client.currency,
          total_revenue: client.totalRevenue,
          total_transactions: client.totalTransactions,
          created_at: now,
          updated_at: now,
          metadata: {
            isGenerated: client.isGenerated,
            generatedAt: client.generatedAt,
          },
        });

      if (error) throw error;

      setClients((prev) => [client, ...prev]);
      return client;
    },
    [company]
  );

  // Update client stats after transaction
  const updateClientStats = useCallback(
    async (clientId: string, amount: number) => {
      try {
        // First get current client data
        const { data: clientData, error: fetchError } = await supabase
          .from('clients')
          .select('*')
          .eq('id', clientId)
          .single();

        if (fetchError) {
          // Client doesn't exist, that's okay for generated clients
          if (fetchError.code === 'PGRST116') return;
          throw fetchError;
        }

        const now = new Date().toISOString();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const client = clientData as any;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: updateError } = await (supabase as any)
          .from('clients')
          .update({
            total_revenue: (client.total_revenue || 0) + amount,
            total_transactions: (client.total_transactions || 0) + 1,
            last_purchase_at: now,
            first_purchase_at: client.first_purchase_at || now,
            updated_at: now,
          })
          .eq('id', clientId);

        if (updateError) throw updateError;
      } catch (err) {
        console.error('Error updating client stats:', err);
      }
    },
    []
  );

  return {
    clients,
    loadingClients,
    loadClients,
    createClientInDb,
    updateClientStats,
  };
}

export default useClients;
