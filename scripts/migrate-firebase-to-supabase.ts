// /workspaces/website/scripts/migrate-firebase-to-supabase.ts
// Description: Migration script from Firebase to Supabase
// Last modified: 2025-12-16
// Usage: npx ts-node scripts/migrate-firebase-to-supabase.ts

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { createClient } from '@supabase/supabase-js';

// ============================================================
// CONFIGURATION
// ============================================================

const FIREBASE_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// ============================================================
// HELPERS
// ============================================================

function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

function convertKeysToSnakeCase(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key in obj) {
    const snakeKey = camelToSnake(key);
    const value = obj[key];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      result[snakeKey] = convertKeysToSnakeCase(value as Record<string, unknown>);
    } else {
      result[snakeKey] = value;
    }
  }
  return result;
}

// ============================================================
// MIGRATION FUNCTIONS
// ============================================================

async function migrateClients(firestore: ReturnType<typeof getFirestore>, supabase: ReturnType<typeof createClient>) {
  console.log('📦 Migrating clients...');

  const snapshot = await getDocs(collection(firestore, 'clients'));
  const clients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  console.log(`   Found ${clients.length} clients in Firebase`);

  let migrated = 0;
  let errors = 0;

  for (const client of clients) {
    try {
      const supabaseClient = {
        id: client.id,
        company_id: client.companyId || 'vmcloud',
        name: client.name,
        email: client.email,
        phone: client.phone || null,
        country: client.country || null,
        company: client.company || null,
        vat_number: client.vatNumber || null,
        registration_number: client.registrationNumber || null,
        type: client.type || 'individual',
        status: client.status || 'lead',
        tags: client.tags || [],
        currency: client.currency || 'EUR',
        payment_terms: client.paymentTerms || null,
        credit_limit: client.creditLimit || null,
        total_revenue: client.totalRevenue || 0,
        total_transactions: client.totalTransactions || 0,
        created_at: client.createdAt || new Date().toISOString(),
        updated_at: client.updatedAt || new Date().toISOString(),
        first_purchase_at: client.firstPurchaseAt || null,
        last_purchase_at: client.lastPurchaseAt || null,
        notes: client.notes || null,
        metadata: client.metadata || {},
      };

      const { error } = await supabase.from('clients').upsert(supabaseClient);

      if (error) {
        console.error(`   ❌ Error migrating client ${client.id}:`, error.message);
        errors++;
      } else {
        migrated++;
      }
    } catch (err) {
      console.error(`   ❌ Exception migrating client ${client.id}:`, err);
      errors++;
    }

    // Progress log every 100 clients
    if ((migrated + errors) % 100 === 0) {
      console.log(`   Progress: ${migrated + errors}/${clients.length}`);
    }
  }

  console.log(`   ✅ Migrated ${migrated} clients, ${errors} errors`);
  return { migrated, errors };
}

async function migrateProducts(firestore: ReturnType<typeof getFirestore>, supabase: ReturnType<typeof createClient>) {
  console.log('📦 Migrating products...');

  const snapshot = await getDocs(collection(firestore, 'products'));
  const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  console.log(`   Found ${products.length} products in Firebase`);

  let migrated = 0;
  let errors = 0;

  for (const product of products) {
    try {
      const supabaseProduct = {
        id: product.id,
        company_id: product.companyId || 'vmcloud',
        name: product.name,
        description: product.description || null,
        sku: product.sku || null,
        category_id: product.categoryId || null,
        type: product.type || 'one_time',
        status: product.status || 'active',
        tags: product.tags || [],
        unit_price: product.pricing?.unitPrice || 0,
        currency: product.pricing?.currency || 'EUR',
        billing_period: product.pricing?.billingPeriod || null,
        setup_fee: product.pricing?.setupFee || null,
        created_at: product.createdAt || new Date().toISOString(),
        updated_at: product.updatedAt || new Date().toISOString(),
        metadata: product.metadata || {},
      };

      const { error } = await supabase.from('products').upsert(supabaseProduct);

      if (error) {
        console.error(`   ❌ Error migrating product ${product.id}:`, error.message);
        errors++;
      } else {
        migrated++;
      }
    } catch (err) {
      console.error(`   ❌ Exception migrating product ${product.id}:`, err);
      errors++;
    }
  }

  console.log(`   ✅ Migrated ${migrated} products, ${errors} errors`);
  return { migrated, errors };
}

async function migrateTransactions(firestore: ReturnType<typeof getFirestore>, supabase: ReturnType<typeof createClient>) {
  console.log('📦 Migrating transactions...');

  const snapshot = await getDocs(collection(firestore, 'transactions'));
  const transactions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  console.log(`   Found ${transactions.length} transactions in Firebase`);

  let migrated = 0;
  let errors = 0;

  for (const tx of transactions) {
    try {
      const supabaseTx = {
        id: tx.id,
        company_id: tx.companyId || 'vmcloud',
        client_id: tx.clientId || null,
        product_id: tx.productId || null,
        subscription_id: tx.subscriptionId || null,
        invoice_id: tx.invoiceId || null,
        description: tx.description || null,
        quantity: tx.quantity || 1,
        unit_price: tx.unitPrice || 0,
        subtotal: tx.subtotal || 0,
        tax_rate: tx.taxRate || 0,
        tax_amount: tx.taxAmount || 0,
        discount_amount: tx.discountAmount || 0,
        total: tx.total || 0,
        status: tx.status || 'completed',
        year: tx.year || new Date().getFullYear(),
        month: tx.month || 'jan',
        created_at: tx.createdAt || new Date().toISOString(),
        updated_at: tx.updatedAt || new Date().toISOString(),
        completed_at: tx.completedAt || null,
        metadata: tx.metadata || {},
      };

      const { error } = await supabase.from('transactions').upsert(supabaseTx);

      if (error) {
        console.error(`   ❌ Error migrating transaction ${tx.id}:`, error.message);
        errors++;
      } else {
        migrated++;
      }
    } catch (err) {
      console.error(`   ❌ Exception migrating transaction ${tx.id}:`, err);
      errors++;
    }

    if ((migrated + errors) % 100 === 0) {
      console.log(`   Progress: ${migrated + errors}/${transactions.length}`);
    }
  }

  console.log(`   ✅ Migrated ${migrated} transactions, ${errors} errors`);
  return { migrated, errors };
}

async function migrateSubscriptions(firestore: ReturnType<typeof getFirestore>, supabase: ReturnType<typeof createClient>) {
  console.log('📦 Migrating subscriptions...');

  const snapshot = await getDocs(collection(firestore, 'subscriptions'));
  const subscriptions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  console.log(`   Found ${subscriptions.length} subscriptions in Firebase`);

  let migrated = 0;
  let errors = 0;

  for (const sub of subscriptions) {
    try {
      const supabaseSub = {
        id: sub.id,
        company_id: sub.companyId || 'vmcloud',
        client_id: sub.clientId || null,
        product_id: sub.productId || null,
        name: sub.name || 'Subscription',
        unit_price: sub.unitPrice || sub.amount || 0,
        quantity: sub.quantity || 1,
        billing_period: sub.billingPeriod || sub.frequency || 'monthly',
        status: sub.status || 'active',
        start_date: sub.startDate || new Date().toISOString().split('T')[0],
        end_date: sub.endDate || null,
        next_billing_date: sub.nextBillingDate || null,
        last_billed_date: sub.lastBilledDate || null,
        created_at: sub.createdAt || new Date().toISOString(),
        updated_at: sub.updatedAt || new Date().toISOString(),
        metadata: sub.metadata || {},
      };

      const { error } = await supabase.from('subscriptions').upsert(supabaseSub);

      if (error) {
        console.error(`   ❌ Error migrating subscription ${sub.id}:`, error.message);
        errors++;
      } else {
        migrated++;
      }
    } catch (err) {
      console.error(`   ❌ Exception migrating subscription ${sub.id}:`, err);
      errors++;
    }

    if ((migrated + errors) % 500 === 0) {
      console.log(`   Progress: ${migrated + errors}/${subscriptions.length}`);
    }
  }

  console.log(`   ✅ Migrated ${migrated} subscriptions, ${errors} errors`);
  return { migrated, errors };
}

// ============================================================
// MAIN
// ============================================================

async function main() {
  console.log('🚀 Starting Firebase → Supabase migration\n');

  // Initialize Firebase
  console.log('🔥 Connecting to Firebase...');
  const firebaseApp = initializeApp(FIREBASE_CONFIG);
  const firestore = getFirestore(firebaseApp);
  console.log('   ✅ Firebase connected\n');

  // Initialize Supabase
  console.log('🗄️ Connecting to Supabase...');
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  console.log('   ✅ Supabase connected\n');

  // Run migrations
  const results = {
    clients: await migrateClients(firestore, supabase),
    products: await migrateProducts(firestore, supabase),
    transactions: await migrateTransactions(firestore, supabase),
    subscriptions: await migrateSubscriptions(firestore, supabase),
  };

  // Summary
  console.log('\n📊 Migration Summary:');
  console.log('─'.repeat(40));
  console.log(`Clients:       ${results.clients.migrated} migrated, ${results.clients.errors} errors`);
  console.log(`Products:      ${results.products.migrated} migrated, ${results.products.errors} errors`);
  console.log(`Transactions:  ${results.transactions.migrated} migrated, ${results.transactions.errors} errors`);
  console.log(`Subscriptions: ${results.subscriptions.migrated} migrated, ${results.subscriptions.errors} errors`);
  console.log('─'.repeat(40));

  const totalMigrated = Object.values(results).reduce((sum, r) => sum + r.migrated, 0);
  const totalErrors = Object.values(results).reduce((sum, r) => sum + r.errors, 0);
  console.log(`Total:         ${totalMigrated} migrated, ${totalErrors} errors`);

  console.log('\n✅ Migration complete!');
}

main().catch(console.error);
