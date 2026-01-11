// apps/web/app/[locale]/admin/clients/hooks/useClients.ts
// Description: Hook for clients data management
// Last modified: 2025-12-19

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { getDatabase } from '../../../../../lib/services/database';
import type { Client, CreateClient, AggregatedClientStats } from '../types';
import { SEARCH_DEBOUNCE_MS, RECENT_CLIENTS_LIMIT } from '../constants';

type UseClientsOptions = {
  companyId?: 'vmcloud' | 'hackboot';
};

export function useClients(options: UseClientsOptions = {}) {
  const { companyId = 'vmcloud' } = options;
  const db = getDatabase(companyId);

  // Stats state
  const [stats, setStats] = useState<AggregatedClientStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Recent clients
  const [recentClients, setRecentClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Client[]>([]);
  const [searching, setSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Modal state
  const [saving, setSaving] = useState(false);

  // Load stats
  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      const data = await db.getAggregatedClientStats();
      setStats(data);
    } catch (err) {
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  }, [db]);

  // Load recent clients
  const loadRecentClients = useCallback(async () => {
    try {
      setLoadingClients(true);
      const clients = await db.getClients({ limitCount: RECENT_CLIENTS_LIMIT });
      setRecentClients(clients);
    } catch (err) {
      console.error('Error loading recent clients:', err);
    } finally {
      setLoadingClients(false);
    }
  }, [db]);

  // Initial load
  useEffect(() => {
    loadStats();
    loadRecentClients();
  }, [loadStats, loadRecentClients]);

  // Search with debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await db.searchClients(searchQuery, 10);
        setSearchResults(results);
      } catch (err) {
        console.error('Error searching:', err);
      } finally {
        setSearching(false);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, db]);

  // Get full client data
  const getClient = useCallback(async (clientId: string) => {
    try {
      return await db.getClient(clientId);
    } catch (err) {
      console.error('Error getting client:', err);
      return null;
    }
  }, [db]);

  // Create client
  const createClient = useCallback(async (data: CreateClient) => {
    try {
      setSaving(true);
      await db.createClient(data);
      await Promise.all([loadStats(), loadRecentClients()]);
      return true;
    } catch (err) {
      console.error('Error creating client:', err);
      return false;
    } finally {
      setSaving(false);
    }
  }, [db, loadStats, loadRecentClients]);

  // Update client
  const updateClient = useCallback(async (clientId: string, data: CreateClient) => {
    try {
      setSaving(true);
      await db.updateClient(clientId, data);
      await Promise.all([loadStats(), loadRecentClients()]);
      // Refresh search results if needed
      if (searchQuery) {
        const results = await db.searchClients(searchQuery, 10);
        setSearchResults(results);
      }
      return true;
    } catch (err) {
      console.error('Error updating client:', err);
      return false;
    } finally {
      setSaving(false);
    }
  }, [db, searchQuery, loadStats, loadRecentClients]);

  // Delete client
  const deleteClient = useCallback(async (clientId: string) => {
    try {
      await db.deleteClient(clientId);
      await Promise.all([loadStats(), loadRecentClients()]);
      // Refresh search results if needed
      if (searchQuery) {
        const results = await db.searchClients(searchQuery, 10);
        setSearchResults(results);
      }
      return true;
    } catch (err) {
      console.error('Error deleting client:', err);
      return false;
    }
  }, [db, searchQuery, loadStats, loadRecentClients]);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
  }, []);

  return {
    // Stats
    stats,
    loading,

    // Clients
    recentClients,
    loadingClients,

    // Search
    searchQuery,
    setSearchQuery,
    searchResults,
    searching,
    clearSearch,

    // Actions
    getClient,
    createClient,
    updateClient,
    deleteClient,
    saving,

    // Reload
    refresh: useCallback(async () => {
      await Promise.all([loadStats(), loadRecentClients()]);
    }, [loadStats, loadRecentClients]),
  };
}
