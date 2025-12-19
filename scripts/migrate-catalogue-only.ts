// Migration catalogue uniquement (produits + catégories)
// @ts-nocheck
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { createClient } from '@supabase/supabase-js';

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDqaDI1pHo1k1B6dog5cnaFjx8Ds0qXncg",
  authDomain: "vmcladmin.firebaseapp.com",
  projectId: "vmcladmin",
};

const SUPABASE_URL = "https://dxydeqzxjpohigqohwkm.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4eWRlcXp4anBvaGlncW9od2ttIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTkxMzQyNCwiZXhwIjoyMDgxNDg5NDI0fQ.R9l0lPkBzmyWmP2xo-THSlNsNrx_OaiMYY2BGzjuN1U";

async function main() {
  console.log('🚀 Migration catalogue Firebase → Supabase\n');

  const firebaseApp = initializeApp(FIREBASE_CONFIG);
  const firestore = getFirestore(firebaseApp);
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // Migrate product categories
  console.log('📁 Migrating product categories...');
  const catSnapshot = await getDocs(collection(firestore, 'productCategories'));
  const categories = catSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  console.log(`   Found ${categories.length} categories`);

  for (const cat of categories) {
    const { error } = await supabase.from('product_categories').upsert({
      id: cat.id,
      company_id: cat.companyId || 'vmcloud',
      name: cat.name,
      description: cat.description || null,
      color: cat.color || null,
      icon: cat.icon || null,
      sort_order: cat.sortOrder || 0,
    });
    if (error) console.error(`   ❌ ${cat.id}:`, error.message);
    else console.log(`   ✅ ${cat.name}`);
  }

  // Migrate products
  console.log('\n📦 Migrating products...');
  const prodSnapshot = await getDocs(collection(firestore, 'products'));
  const products = prodSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  console.log(`   Found ${products.length} products`);

  for (const prod of products) {
    const { error } = await supabase.from('products').upsert({
      id: prod.id,
      company_id: prod.companyId || 'vmcloud',
      name: prod.name,
      description: prod.description || null,
      sku: prod.sku || null,
      category_id: prod.categoryId || null,
      type: prod.type || 'one_time',
      status: prod.status || 'active',
      tags: prod.tags || [],
      unit_price: prod.pricing?.unitPrice || prod.unitPrice || 0,
      currency: prod.pricing?.currency || 'EUR',
      billing_period: prod.pricing?.billingPeriod || null,
      setup_fee: prod.pricing?.setupFee || null,
      metadata: prod.metadata || {},
    });
    if (error) console.error(`   ❌ ${prod.id}:`, error.message);
    else console.log(`   ✅ ${prod.name}`);
  }

  console.log('\n✅ Migration catalogue terminée!');
}

main().catch(console.error);
