// /workspaces/website/apps/web/lib/services/database.ts
// Description: Database service wrapper - uses Supabase (migrated from Firebase)
// Last modified: 2025-12-16

// Switch between Firebase and Supabase
// Set USE_SUPABASE=false to use Firebase (legacy)
const USE_SUPABASE = true;

// Re-export everything from the active database service
export * from './database-supabase';
export { getSupabaseDatabase as getDatabase, SupabaseDatabaseService as DatabaseService } from './database-supabase';
import defaultDb from './database-supabase';
export default defaultDb;

// Legacy Firebase exports (uncomment to use Firebase)
// export * from './database-firebase';
// export { getDatabase, DatabaseService } from './database-firebase';
// import defaultDb from './database-firebase';
// export default defaultDb;
