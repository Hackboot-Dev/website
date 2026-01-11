// /workspaces/website/apps/web/scripts/migrate-firebase-to-supabase.ts
// Description: Script to migrate Firebase data to Supabase
// Last modified: 2025-01-10
// Run with: npx tsx scripts/migrate-firebase-to-supabase.ts

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load .env.local manually
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join('=').trim();
    }
  });
}

// Firebase Public Config (vmclpublic)
const firebaseConfig = {
  apiKey: 'AIzaSyA1XJlyUZz4vvr8puov3S4Ek6WuXDwgDpc',
  authDomain: 'vmclpublic.firebaseapp.com',
  projectId: 'vmclpublic',
  storageBucket: 'vmclpublic.firebasestorage.app',
  messagingSenderId: '260729958114',
  appId: '1:260729958114:web:c8a7ad590132f58a0978bb',
};

// Supabase Config
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eqtmgyqnfjnpeocbqvkz.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
  console.log('Please set it in your .env.local file');
  process.exit(1);
}

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig, 'migration');
const firebaseDb = getFirestore(firebaseApp);

// Initialize Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

interface FirebaseCategory {
  id: string;
  name: string;
  description?: string;
  order?: number;
  products?: FirebaseProduct[];
}

interface FirebaseProduct {
  id: string;
  name: string;
  description?: string;
  monthly?: number;
  hourly?: number;
  annual?: number;
  price_per_gb_month?: number;
  specs?: Record<string, unknown>;
}

async function migrateCategories() {
  console.log('🔄 Fetching categories from Firebase...');

  try {
    const categoriesRef = collection(firebaseDb, 'catalogue');
    const snapshot = await getDocs(categoriesRef);

    if (snapshot.empty) {
      console.log('⚠️  No categories found in Firebase');
      return;
    }

    console.log(`📦 Found ${snapshot.docs.length} categories`);

    for (const doc of snapshot.docs) {
      const data = doc.data() as FirebaseCategory;
      const categoryId = doc.id;

      console.log(`\n📁 Processing category: ${categoryId} (${data.name || 'No name'})`);

      // Insert category into Supabase
      const { error: catError } = await supabase
        .from('product_categories')
        .upsert({
          id: categoryId,
          company_id: 'vmcloud',
          name: data.name || categoryId,
          description: data.description || null,
          sort_order: data.order || 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id',
        });

      if (catError) {
        console.error(`❌ Error inserting category ${categoryId}:`, catError.message);
        continue;
      }

      console.log(`✅ Category ${categoryId} inserted`);

      // Insert products if any
      if (data.products && Array.isArray(data.products)) {
        console.log(`   📦 ${data.products.length} products to migrate`);

        for (const product of data.products) {
          const price = product.monthly || product.hourly || product.annual || product.price_per_gb_month || 0;

          const { error: prodError } = await supabase
            .from('products')
            .upsert({
              id: product.id,
              company_id: 'vmcloud',
              name: product.name || product.id,
              description: product.description || null,
              category_id: categoryId,
              unit_price: price,
              currency: 'EUR',
              type: 'subscription',
              status: 'active',
              metadata: {
                monthly: product.monthly,
                hourly: product.hourly,
                annual: product.annual,
                price_per_gb_month: product.price_per_gb_month,
                specs: product.specs,
              },
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }, {
              onConflict: 'id',
            });

          if (prodError) {
            console.error(`   ❌ Error inserting product ${product.id}:`, prodError.message);
          } else {
            console.log(`   ✅ Product ${product.id} (${product.name}) - ${price}€`);
          }
        }
      }
    }

    console.log('\n✅ Migration completed!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// Run migration
migrateCategories();
