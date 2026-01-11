// /workspaces/website/apps/web/lib/types/supabase.ts
// Description: Supabase database types (auto-generated structure)
// Last modified: 2025-12-16

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string;
          company_id: string;
          name: string;
          email: string;
          phone: string | null;
          country: string | null;
          company: string | null;
          vat_number: string | null;
          registration_number: string | null;
          type: 'individual' | 'business' | 'enterprise';
          status: 'lead' | 'active' | 'inactive' | 'churned';
          tags: string[];
          currency: string;
          payment_terms: number | null;
          credit_limit: number | null;
          total_revenue: number;
          total_transactions: number;
          created_at: string;
          updated_at: string;
          first_purchase_at: string | null;
          last_purchase_at: string | null;
          notes: string | null;
          metadata: Json;
        };
        Insert: {
          id?: string;
          company_id?: string;
          name: string;
          email: string;
          phone?: string | null;
          country?: string | null;
          company?: string | null;
          vat_number?: string | null;
          registration_number?: string | null;
          type?: 'individual' | 'business' | 'enterprise';
          status?: 'lead' | 'active' | 'inactive' | 'churned';
          tags?: string[];
          currency?: string;
          payment_terms?: number | null;
          credit_limit?: number | null;
          total_revenue?: number;
          total_transactions?: number;
          created_at?: string;
          updated_at?: string;
          first_purchase_at?: string | null;
          last_purchase_at?: string | null;
          notes?: string | null;
          metadata?: Json;
        };
        Update: {
          id?: string;
          company_id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          country?: string | null;
          company?: string | null;
          vat_number?: string | null;
          registration_number?: string | null;
          type?: 'individual' | 'business' | 'enterprise';
          status?: 'lead' | 'active' | 'inactive' | 'churned';
          tags?: string[];
          currency?: string;
          payment_terms?: number | null;
          credit_limit?: number | null;
          total_revenue?: number;
          total_transactions?: number;
          created_at?: string;
          updated_at?: string;
          first_purchase_at?: string | null;
          last_purchase_at?: string | null;
          notes?: string | null;
          metadata?: Json;
        };
      };
      products: {
        Row: {
          id: string;
          company_id: string;
          name: string;
          description: string | null;
          sku: string | null;
          category_id: string | null;
          type: 'one_time' | 'subscription' | 'usage_based';
          status: 'active' | 'inactive' | 'discontinued';
          tags: string[];
          unit_price: number;
          currency: string;
          billing_period: 'hourly' | 'daily' | 'monthly' | 'yearly' | null;
          setup_fee: number | null;
          created_at: string;
          updated_at: string;
          metadata: Json;
        };
        Insert: {
          id?: string;
          company_id?: string;
          name: string;
          description?: string | null;
          sku?: string | null;
          category_id?: string | null;
          type?: 'one_time' | 'subscription' | 'usage_based';
          status?: 'active' | 'inactive' | 'discontinued';
          tags?: string[];
          unit_price: number;
          currency?: string;
          billing_period?: 'hourly' | 'daily' | 'monthly' | 'yearly' | null;
          setup_fee?: number | null;
          created_at?: string;
          updated_at?: string;
          metadata?: Json;
        };
        Update: {
          id?: string;
          company_id?: string;
          name?: string;
          description?: string | null;
          sku?: string | null;
          category_id?: string | null;
          type?: 'one_time' | 'subscription' | 'usage_based';
          status?: 'active' | 'inactive' | 'discontinued';
          tags?: string[];
          unit_price?: number;
          currency?: string;
          billing_period?: 'hourly' | 'daily' | 'monthly' | 'yearly' | null;
          setup_fee?: number | null;
          created_at?: string;
          updated_at?: string;
          metadata?: Json;
        };
      };
      product_categories: {
        Row: {
          id: string;
          company_id: string;
          name: string;
          description: string | null;
          color: string | null;
          icon: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id?: string;
          name: string;
          description?: string | null;
          color?: string | null;
          icon?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          name?: string;
          description?: string | null;
          color?: string | null;
          icon?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          company_id: string;
          client_id: string | null;
          product_id: string | null;
          subscription_id: string | null;
          invoice_id: string | null;
          description: string | null;
          quantity: number;
          unit_price: number;
          subtotal: number;
          tax_rate: number;
          tax_amount: number;
          discount_amount: number;
          total: number;
          status: 'pending' | 'completed' | 'cancelled' | 'refunded';
          year: number;
          month: string;
          created_at: string;
          updated_at: string;
          completed_at: string | null;
          metadata: Json;
        };
        Insert: {
          id?: string;
          company_id?: string;
          client_id?: string | null;
          product_id?: string | null;
          subscription_id?: string | null;
          invoice_id?: string | null;
          description?: string | null;
          quantity?: number;
          unit_price: number;
          subtotal: number;
          tax_rate?: number;
          tax_amount?: number;
          discount_amount?: number;
          total: number;
          status?: 'pending' | 'completed' | 'cancelled' | 'refunded';
          year: number;
          month: string;
          created_at?: string;
          updated_at?: string;
          completed_at?: string | null;
          metadata?: Json;
        };
        Update: {
          id?: string;
          company_id?: string;
          client_id?: string | null;
          product_id?: string | null;
          subscription_id?: string | null;
          invoice_id?: string | null;
          description?: string | null;
          quantity?: number;
          unit_price?: number;
          subtotal?: number;
          tax_rate?: number;
          tax_amount?: number;
          discount_amount?: number;
          total?: number;
          status?: 'pending' | 'completed' | 'cancelled' | 'refunded';
          year?: number;
          month?: string;
          created_at?: string;
          updated_at?: string;
          completed_at?: string | null;
          metadata?: Json;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          company_id: string;
          client_id: string | null;
          product_id: string | null;
          name: string;
          unit_price: number;
          quantity: number;
          billing_period: 'hourly' | 'daily' | 'monthly' | 'yearly';
          status: 'active' | 'paused' | 'cancelled' | 'expired';
          start_date: string;
          end_date: string | null;
          next_billing_date: string | null;
          last_billed_date: string | null;
          created_at: string;
          updated_at: string;
          metadata: Json;
        };
        Insert: {
          id?: string;
          company_id?: string;
          client_id?: string | null;
          product_id?: string | null;
          name: string;
          unit_price: number;
          quantity?: number;
          billing_period?: 'hourly' | 'daily' | 'monthly' | 'yearly';
          status?: 'active' | 'paused' | 'cancelled' | 'expired';
          start_date: string;
          end_date?: string | null;
          next_billing_date?: string | null;
          last_billed_date?: string | null;
          created_at?: string;
          updated_at?: string;
          metadata?: Json;
        };
        Update: {
          id?: string;
          company_id?: string;
          client_id?: string | null;
          product_id?: string | null;
          name?: string;
          unit_price?: number;
          quantity?: number;
          billing_period?: 'hourly' | 'daily' | 'monthly' | 'yearly';
          status?: 'active' | 'paused' | 'cancelled' | 'expired';
          start_date?: string;
          end_date?: string | null;
          next_billing_date?: string | null;
          last_billed_date?: string | null;
          created_at?: string;
          updated_at?: string;
          metadata?: Json;
        };
      };
      invoices: {
        Row: {
          id: string;
          company_id: string;
          client_id: string | null;
          invoice_number: string;
          subtotal: number;
          tax_amount: number;
          total: number;
          currency: string;
          status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
          issued_at: string;
          due_at: string | null;
          paid_at: string | null;
          metadata: Json;
        };
        Insert: {
          id?: string;
          company_id?: string;
          client_id?: string | null;
          invoice_number: string;
          subtotal: number;
          tax_amount?: number;
          total: number;
          currency?: string;
          status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
          issued_at?: string;
          due_at?: string | null;
          paid_at?: string | null;
          metadata?: Json;
        };
        Update: {
          id?: string;
          company_id?: string;
          client_id?: string | null;
          invoice_number?: string;
          subtotal?: number;
          tax_amount?: number;
          total?: number;
          currency?: string;
          status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
          issued_at?: string;
          due_at?: string | null;
          paid_at?: string | null;
          metadata?: Json;
        };
      };
      pnl_data: {
        Row: {
          id: string;
          company_id: string;
          year: number;
          data: Json;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id?: string;
          year: number;
          data: Json;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          year?: number;
          data?: Json;
          updated_at?: string;
        };
      };
      pnl_transactions: {
        Row: {
          id: string;
          company_id: string;
          client_id: string | null;
          product_id: string;
          product_label: string;
          category_id: string;
          category_label: string;
          amount: number;
          discount: number;
          note: string | null;
          month: string;
          year: number;
          is_recurring: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id?: string;
          client_id?: string | null;
          product_id: string;
          product_label: string;
          category_id: string;
          category_label: string;
          amount: number;
          discount?: number;
          note?: string | null;
          month: string;
          year: number;
          is_recurring?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          client_id?: string | null;
          product_id?: string;
          product_label?: string;
          category_id?: string;
          category_label?: string;
          amount?: number;
          discount?: number;
          note?: string | null;
          month?: string;
          year?: number;
          is_recurring?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      stats_cache: {
        Row: {
          key: string;
          company_id: string;
          data: Json;
          updated_at: string;
        };
        Insert: {
          key: string;
          company_id?: string;
          data: Json;
          updated_at?: string;
        };
        Update: {
          key?: string;
          company_id?: string;
          data?: Json;
          updated_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {
      client_type: 'individual' | 'business' | 'enterprise';
      client_status: 'lead' | 'active' | 'inactive' | 'churned';
      product_type: 'one_time' | 'subscription' | 'usage_based';
      product_status: 'active' | 'inactive' | 'discontinued';
      billing_period: 'hourly' | 'daily' | 'monthly' | 'yearly';
      transaction_status: 'pending' | 'completed' | 'cancelled' | 'refunded';
      subscription_status: 'active' | 'paused' | 'cancelled' | 'expired';
      invoice_status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
    };
  };
};

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];
