// /workspaces/website/apps/web/app/[locale]/admin/pnl/hooks/useClients.ts
// Description: Hook for client management in P&L module
// Last modified: 2025-12-14

import { useState, useCallback } from 'react';
import { doc, setDoc, getDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Firestore } from 'firebase/firestore';
import type { Client } from '../../../../../lib/types/database';
import type { GeneratedClient } from '../../../../../lib/utils/clientGenerator';
import type { CompanyId } from '../types';

// ============================================================
// TYPES
// ============================================================

type UseClientsOptions = {
  db: Firestore | null;
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

export function useClients({ db, company }: UseClientsOptions): UseClientsReturn {
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);

  // Load clients from Firebase
  const loadClients = useCallback(async () => {
    if (!db) return;
    try {
      setLoadingClients(true);
      const q = query(collection(db, 'clients'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const clientsData = snapshot.docs.map((docSnap) => docSnap.data() as Client);
      setClients(clientsData);
    } catch (err) {
      console.error('Error loading clients:', err);
    } finally {
      setLoadingClients(false);
    }
  }, [db]);

  // Create client in Firebase
  const createClientInDb = useCallback(
    async (clientData: GeneratedClient): Promise<Client> => {
      if (!db) throw new Error('Database not initialized');

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

      // Add optional fields only if defined (Firestore rejects undefined)
      if (clientData.company) client.company = clientData.company;
      if (clientData.country) client.country = clientData.country;

      await setDoc(doc(db, 'clients', client.id), client);
      setClients((prev) => [client, ...prev]);
      return client;
    },
    [db, company]
  );

  // Update client stats after transaction
  const updateClientStats = useCallback(
    async (clientId: string, amount: number) => {
      if (!db) return;
      try {
        const clientRef = doc(db, 'clients', clientId);
        const clientSnap = await getDoc(clientRef);
        if (clientSnap.exists()) {
          const clientData = clientSnap.data() as Client;
          const now = new Date().toISOString();
          await setDoc(clientRef, {
            ...clientData,
            totalRevenue: (clientData.totalRevenue || 0) + amount,
            totalTransactions: (clientData.totalTransactions || 0) + 1,
            lastPurchaseAt: now,
            firstPurchaseAt: clientData.firstPurchaseAt || now,
            updatedAt: now,
          });
        }
      } catch (err) {
        console.error('Error updating client stats:', err);
      }
    },
    [db]
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
