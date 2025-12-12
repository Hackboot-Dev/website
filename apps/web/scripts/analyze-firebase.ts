// /workspaces/website/apps/web/scripts/analyze-firebase.ts
// Description: Script to analyze Firebase structure and propose migrations
// Last modified: 2025-12-11
// Run with: npx ts-node --esm scripts/analyze-firebase.ts

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';

// Firebase configs
const configs = {
  vmcloud: {
    apiKey: 'AIzaSyDqaDI1pHo1k1B6dog5cnaFjx8Ds0qXncg',
    authDomain: 'vmcladmin.firebaseapp.com',
    projectId: 'vmcladmin',
    storageBucket: 'vmcladmin.firebasestorage.app',
    messagingSenderId: '239952041422',
    appId: '1:239952041422:web:c14f5da101b245cd4f879f',
  },
  hackboot: {
    apiKey: 'AIzaSyCwxfW6gF7HleGYUno-0rnd2kNnGDGFewo',
    authDomain: 'hackbootadmin.firebaseapp.com',
    projectId: 'hackbootadmin',
    storageBucket: 'hackbootadmin.firebasestorage.app',
    messagingSenderId: '885606292524',
    appId: '1:885606292524:web:11dccb48bd119d40098589',
  },
};

async function analyzeFirebase() {
  console.log('='.repeat(60));
  console.log('FIREBASE STRUCTURE ANALYSIS');
  console.log('='.repeat(60));
  console.log('');

  for (const [companyName, config] of Object.entries(configs)) {
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`📦 COMPANY: ${companyName.toUpperCase()}`);
    console.log(`   Project ID: ${config.projectId}`);
    console.log(`${'─'.repeat(60)}`);

    try {
      // Initialize Firebase app for this company
      const app = initializeApp(config, `analyze_${companyName}`);
      const db = getFirestore(app);

      // List known collections
      const knownCollections = ['pnl_data', 'clients', 'invoices', 'products', 'users'];

      for (const collName of knownCollections) {
        console.log(`\n  📁 Collection: ${collName}`);

        try {
          const collRef = collection(db, collName);
          const snapshot = await getDocs(collRef);

          if (snapshot.empty) {
            console.log(`     └─ (empty or doesn't exist)`);
          } else {
            console.log(`     └─ ${snapshot.size} document(s)`);

            // Show first few documents
            let count = 0;
            snapshot.forEach((docSnap) => {
              if (count < 3) {
                const data = docSnap.data();
                console.log(`        ├─ ${docSnap.id}`);

                // Show structure of first document
                if (count === 0) {
                  console.log(`        │  Keys: ${Object.keys(data).join(', ')}`);

                  // Analyze specific structures
                  if (collName === 'pnl_data') {
                    analyzePnLDocument(data);
                  }
                }
                count++;
              }
            });

            if (snapshot.size > 3) {
              console.log(`        └─ ... and ${snapshot.size - 3} more`);
            }
          }
        } catch (err: any) {
          console.log(`     └─ Error: ${err.message}`);
        }
      }

      // Check specifically for year_2025 in pnl_data
      console.log(`\n  🔍 Checking pnl_data/year_2025...`);
      try {
        const pnlDoc = await getDoc(doc(db, 'pnl_data', 'year_2025'));
        if (pnlDoc.exists()) {
          const data = pnlDoc.data();
          console.log(`     └─ EXISTS`);
          analyzePnLDocumentDetail(data);
        } else {
          console.log(`     └─ Does not exist`);
        }
      } catch (err: any) {
        console.log(`     └─ Error: ${err.message}`);
      }

    } catch (err: any) {
      console.log(`  ❌ Error connecting: ${err.message}`);
    }
  }

  console.log('\n');
  console.log('='.repeat(60));
  console.log('ANALYSIS COMPLETE');
  console.log('='.repeat(60));

  // Print recommendations
  printRecommendations();
}

function analyzePnLDocument(data: any) {
  if (data.productCategories) {
    console.log(`        │  productCategories: ${data.productCategories.length} categories`);
  }
  if (data.expenseCategories) {
    console.log(`        │  expenseCategories: ${data.expenseCategories.length} categories`);
  }
  if (data.reductions) {
    console.log(`        │  reductions: present`);
  }
  if (data.taxes) {
    console.log(`        │  taxes: present`);
  }
}

function analyzePnLDocumentDetail(data: any) {
  console.log(`\n     📊 P&L Data Structure:`);
  console.log(`        Year: ${data.year}`);
  console.log(`        Updated: ${data.updatedAt}`);

  if (data.productCategories) {
    console.log(`\n        📦 Product Categories (${data.productCategories.length}):`);
    for (const cat of data.productCategories) {
      console.log(`           ├─ ${cat.id}: "${cat.label}" (${cat.products?.length || 0} products)`);

      // Count total transactions
      let totalTx = 0;
      for (const prod of cat.products || []) {
        for (const month of Object.keys(prod.transactions || {})) {
          totalTx += (prod.transactions[month] || []).length;
        }
      }
      console.log(`           │  Total transactions: ${totalTx}`);

      // Show transaction structure
      if (cat.products?.[0]?.transactions) {
        const firstProd = cat.products[0];
        const firstMonth = Object.keys(firstProd.transactions)[0];
        if (firstProd.transactions[firstMonth]?.[0]) {
          const tx = firstProd.transactions[firstMonth][0];
          console.log(`           │  Transaction structure: { ${Object.keys(tx).join(', ')} }`);
        }
      }
    }
  }

  if (data.expenseCategories) {
    console.log(`\n        💸 Expense Categories (${data.expenseCategories.length}):`);
    for (const cat of data.expenseCategories) {
      console.log(`           ├─ ${cat.id}: "${cat.label}" (${cat.items?.length || 0} items)`);
    }
  }

  // Check for client references
  console.log(`\n        🔍 Client References Check:`);
  let hasClientRefs = false;
  for (const cat of data.productCategories || []) {
    for (const prod of cat.products || []) {
      for (const month of Object.keys(prod.transactions || {})) {
        for (const tx of prod.transactions[month] || []) {
          if (tx.clientId || tx.client || tx.customerId) {
            hasClientRefs = true;
            console.log(`           Found client reference in transaction!`);
            break;
          }
        }
      }
    }
  }
  if (!hasClientRefs) {
    console.log(`           ❌ NO client references in transactions`);
    console.log(`           Transactions are anonymous (only amount, isCustom, note)`);
  }
}

function printRecommendations() {
  console.log('\n');
  console.log('🎯 RECOMMENDATIONS FOR CLIENT MODULE');
  console.log('═'.repeat(60));
  console.log(`
CURRENT PROBLEM:
- Transactions in P&L are anonymous (no client ID)
- Cannot track: who bought what, client history, revenue per client
- No client data storage (name, email, company, etc.)

PROPOSED NEW STRUCTURE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. NEW COLLECTION: "clients"
   {
     id: "cli_xxx",
     name: "John Doe",
     email: "john@company.com",
     company: "Company SAS",
     type: "business" | "individual",
     status: "active" | "inactive" | "churned",
     createdAt: timestamp,
     metadata: { ... }
   }

2. UPDATED TRANSACTION STRUCTURE:
   {
     id: "tx_xxx",
     clientId: "cli_xxx",        // NEW: Reference to client
     amount: 160,
     isCustom: false,
     note: "...",
     createdAt: timestamp,       // NEW: When transaction occurred
     invoiceId?: "inv_xxx"       // NEW: Link to invoice
   }

3. NEW COLLECTION: "invoices" (optional)
   {
     id: "inv_xxx",
     clientId: "cli_xxx",
     transactions: ["tx_xxx", ...],
     total: 1234.56,
     status: "draft" | "sent" | "paid" | "overdue",
     dueDate: timestamp,
     paidAt?: timestamp
   }

MIGRATION STRATEGY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Add new "clients" collection (non-breaking)
2. Update Transaction type to include optional clientId
3. New transactions will have clientId
4. Old transactions remain anonymous (backward compatible)
5. P&L calculations remain unchanged (sum of amounts)

BENEFITS:
- Client CRM with full history
- Revenue per client analysis
- Client retention tracking
- Invoice generation
- P&L breakdown by client
`);
}

// Run the analysis
analyzeFirebase().catch(console.error);
