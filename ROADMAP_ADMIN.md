# ROADMAP - Modules Admin (P&L, Clients, Catalogue)

> Dernière mise à jour : 14 décembre 2024

---

## 1. ÉTAT ACTUEL

### Module P&L
- ✅ Vue Overview (mois courant)
- ✅ Vue Produits (catégories, transactions par produit)
- ✅ Vue Dépenses (catégories, items)
- ✅ Vue Annuelle (tableau 12 mois + graphiques)
- ✅ Réductions (remises, retours, COGS)
- ✅ Export PDF
- ✅ Clients générés ou manuels
- ❌ Pas d'abonnements récurrents
- ❌ Pas de MRR/ARR
- ❌ Pas de prévisions

### Module Clients
- ✅ CRUD complet
- ✅ Stats basiques (CA total, nb transactions)
- ✅ Filtres et recherche
- ❌ Pas d'historique des achats
- ❌ Pas de vue abonnements actifs
- ❌ Pas de liaison directe avec P&L

### Module Catalogue
- ✅ Produits avec pricing (monthly, hourly, annual)
- ✅ Catégories (VPS, GPU, Web, etc.)
- ❌ Type produit (subscription vs one-time) pas exploité
- ❌ Pas de liaison avec P&L

---

## 2. AMÉLIORATIONS PROPOSÉES

### 2.1 Abonnements Récurrents (PRIORITÉ 1)

#### Concept
Permettre de créer des transactions qui se renouvellent automatiquement.

#### UI - Dans TransactionsModal
```
┌─────────────────────────────────────────────────────┐
│  Client: [Rechercher...]                            │
│  Quantité: [1] [-] [+]                              │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │ ☐ Abonnement récurrent                      │    │
│  │                                             │    │
│  │   Cycle: ○ Mensuel  ○ Annuel                │    │
│  │                                             │    │
│  │   Date de début: [14/12/2024]               │    │
│  │                                             │    │
│  │   ☐ Date de fin (optionnel): [__/__/____]   │    │
│  │                                             │    │
│  │   💡 Renouvellement: 14 de chaque mois      │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  [Annuler]                    [Ajouter 1 vente]     │
└─────────────────────────────────────────────────────┘
```

#### Données - Structure Subscription
```typescript
type Subscription = {
  id: string;                    // sub_xxx

  // Références
  clientId: string;
  clientName: string;
  clientEmail?: string;
  productCategoryId: string;
  productId: string;
  productLabel: string;

  // Pricing
  amount: number;                // Prix par période
  discount?: number;             // Remise appliquée

  // Cycle
  cycle: 'monthly' | 'annual';
  startDate: string;             // ISO date (ex: "2024-12-14")
  endDate?: string;              // ISO date si date de fin prévue
  dayOfMonth: number;            // Jour de renouvellement (1-28)

  // État
  status: 'active' | 'paused' | 'cancelled' | 'expired';
  cancelledAt?: string;
  cancelReason?: string;

  // Tracking
  lastRenewalDate?: string;      // Dernière date de renouvellement effectuée
  nextRenewalDate: string;       // Prochaine date prévue
  renewalCount: number;          // Nombre de renouvellements effectués

  // Metadata
  createdAt: string;
  updatedAt: string;
  note?: string;
};
```

#### Logique de Renouvellement

**Quand déclencher ?**
- À l'ouverture du module P&L
- Au clic sur "Synchroniser"
- Optionnel : bouton "Renouveler les abonnements"

**Algorithme :**
```
Pour chaque abonnement actif:
  1. Calculer toutes les dates de renouvellement depuis lastRenewalDate jusqu'à aujourd'hui
  2. Pour chaque date manquante:
     - Créer une transaction avec la date de renouvellement
     - Mettre à jour lastRenewalDate
     - Incrémenter renewalCount
  3. Calculer nextRenewalDate
  4. Si endDate atteinte → status = 'expired'
```

**Exemple :**
```
Abonnement créé le 14/12/2024, mensuel, 60€

On ouvre le P&L le 20/02/2025 :
- lastRenewalDate: 14/12/2024
- Dates manquantes: 14/01/2025, 14/02/2025
- Créer 2 transactions (une en janvier, une en février)
- Mettre à jour lastRenewalDate: 14/02/2025
- nextRenewalDate: 14/03/2025
```

#### UI - Gestion des Abonnements

**Dans l'Overview P&L :**
```
┌─────────────────────────────────────────────────────┐
│  📊 Décembre 2024                                   │
│                                                     │
│  Revenue: 12,500€     Clients: 45                   │
│  ─────────────────────────────────────────────────  │
│  🔄 MRR (Recurring): 8,200€                         │
│  🆕 One-time: 4,300€                                │
│  ─────────────────────────────────────────────────  │
│  📈 Abonnements actifs: 42                          │
│  ⚠️ À renouveler ce mois: 5       [Voir] [Sync]    │
└─────────────────────────────────────────────────────┘
```

**Modal "Abonnements" :**
```
┌─────────────────────────────────────────────────────┐
│  🔄 Abonnements                            [X]      │
│  ─────────────────────────────────────────────────  │
│  [Actifs: 42] [En pause: 2] [Résiliés: 5]          │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │ Jean Dupont                                   │  │
│  │ Pack Elite • 60€/mois                         │  │
│  │ Depuis: 14/10/2024 • Prochain: 14/01/2025     │  │
│  │                     [Pause] [Résilier]        │  │
│  ├───────────────────────────────────────────────┤  │
│  │ Marie Martin                                  │  │
│  │ VPS Pro • 350€/an                             │  │
│  │ Depuis: 01/03/2024 • Prochain: 01/03/2025     │  │
│  │                     [Pause] [Résilier]        │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  💰 MRR Total: 8,200€                               │
│  📅 ARR Projeté: 98,400€                            │
└─────────────────────────────────────────────────────┘
```

#### Actions sur Abonnement

| Action | Effet |
|--------|-------|
| **Pause** | status = 'paused', ne génère plus de transactions |
| **Reprendre** | status = 'active', recalcule nextRenewalDate |
| **Résilier** | status = 'cancelled', cancelledAt = now |
| **Modifier** | Changer amount, cycle, etc. (prend effet au prochain renouvellement) |

---

### 2.2 Historique Transactions dans Client (PRIORITÉ 1)

#### UI - Onglets dans fiche Client
```
┌─────────────────────────────────────────────────────┐
│  👤 Jean Dupont                              [X]    │
│  ─────────────────────────────────────────────────  │
│  [Infos] [Transactions] [Abonnements] [Notes]       │
│                                                     │
│  📋 TRANSACTIONS                                    │
│  ┌───────────────────────────────────────────────┐  │
│  │ 14/12/2024 │ Pack Elite  │ 60€ │ ✓ │ 🔄      │  │
│  │ 14/11/2024 │ Pack Elite  │ 60€ │ ✓ │ 🔄      │  │
│  │ 14/10/2024 │ Pack Elite  │ 60€ │ ✓ │ 🔄      │  │
│  │ 05/10/2024 │ Formation   │ 199€│ ✓ │ 1x      │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  Total: 379€ (4 transactions)                       │
│  🔄 = Abonnement, 1x = One-time                     │
└─────────────────────────────────────────────────────┘
```

#### Données requises
- Lier chaque Transaction à son clientId
- Query : `getTransactionsByClient(clientId)`

---

### 2.3 MRR / ARR dans Overview (PRIORITÉ 2)

#### Calculs
```typescript
// MRR = Monthly Recurring Revenue
const getMRR = () => {
  return subscriptions
    .filter(s => s.status === 'active')
    .reduce((sum, s) => {
      if (s.cycle === 'monthly') return sum + s.amount;
      if (s.cycle === 'annual') return sum + (s.amount / 12);
      return sum;
    }, 0);
};

// ARR = Annual Recurring Revenue
const getARR = () => getMRR() * 12;

// Churn Rate (mensuel)
const getChurnRate = (month: string) => {
  const cancelledThisMonth = subscriptions.filter(
    s => s.cancelledAt?.startsWith(month)
  ).length;
  const totalAtStartOfMonth = /* ... */;
  return (cancelledThisMonth / totalAtStartOfMonth) * 100;
};
```

---

### 2.4 Prévisions Revenue (PRIORITÉ 3)

#### Concept
Projeter les revenus des 3-6 prochains mois basé sur :
- Abonnements actifs (récurrent garanti)
- Moyenne des one-time des 3 derniers mois
- Tendance de croissance

#### UI
```
┌─────────────────────────────────────────────────────┐
│  📈 Prévisions (basé sur abonnements actifs)        │
│                                                     │
│  Jan 2025: ~10,200€ (8,200€ récurrent + ~2,000€)    │
│  Fév 2025: ~10,400€                                 │
│  Mar 2025: ~10,600€                                 │
│                                                     │
│  ⚠️ 3 abonnements arrivent à expiration en février  │
└─────────────────────────────────────────────────────┘
```

---

### 2.5 Intégration Catalogue ↔ P&L (PRIORITÉ 3)

#### Sync automatique
Quand on ajoute un produit du catalogue :
- Récupérer le prix depuis le catalogue
- Détecter si c'est un produit "subscription" (a un prix `monthly` ou `annual`)
- Pré-cocher "Abonnement récurrent" si applicable

---

### 2.6 Module Facturation (PRIORITÉ 4 - FUTUR)

#### Structure Invoice
```typescript
type Invoice = {
  id: string;               // inv_xxx
  number: string;           // INV-2024-0001

  clientId: string;
  clientSnapshot: {         // Copie au moment de la facture
    name: string;
    email: string;
    address?: string;
    vatNumber?: string;
  };

  items: InvoiceItem[];

  subtotal: number;
  taxRate: number;          // 20 pour 20%
  taxAmount: number;
  total: number;

  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

  issuedAt: string;
  dueAt: string;
  paidAt?: string;

  notes?: string;
  termsAndConditions?: string;
};
```

---

## 3. IMPLÉMENTATION TECHNIQUE - ABONNEMENTS

### 3.1 Stockage Firebase

**Collection : `subscriptions`** (par company)
```
vmcloudadmin/
└── subscriptions/
    ├── sub_001
    ├── sub_002
    └── ...
```

### 3.2 Modification PnLData

Ajouter dans `PnLData` :
```typescript
type PnLData = {
  // ... existing fields

  // NEW: Reference aux abonnements pour ce mois
  subscriptionRenewals?: {
    [month: string]: string[];  // Liste des subscription IDs renouvelés ce mois
  };
};
```

### 3.3 Fonction de Renouvellement

```typescript
// Dans PnLPageClient ou hook dédié

const processSubscriptionRenewals = async () => {
  const today = new Date();
  const activeSubscriptions = await getActiveSubscriptions();

  for (const sub of activeSubscriptions) {
    // Calculer les renouvellements manquants
    const lastRenewal = sub.lastRenewalDate
      ? new Date(sub.lastRenewalDate)
      : new Date(sub.startDate);

    const renewalDates = calculateMissingRenewals(
      lastRenewal,
      today,
      sub.cycle,
      sub.dayOfMonth
    );

    for (const renewalDate of renewalDates) {
      // Vérifier si pas déjà renouvelé (idempotent)
      const monthKey = getMonthKey(renewalDate); // 'jan', 'feb', etc.
      const year = renewalDate.getFullYear();

      // Créer la transaction
      const tx: Transaction = {
        id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        amount: sub.amount - (sub.discount || 0),
        isCustom: false,
        discount: sub.discount,
        clientId: sub.clientId,
        clientName: sub.clientName,
        clientEmail: sub.clientEmail,
        note: `Renouvellement abonnement ${sub.cycle}`,
        subscriptionId: sub.id,  // NEW: lien vers l'abonnement
        renewalDate: renewalDate.toISOString(),
      };

      // Ajouter au P&L du bon mois/année
      await addTransactionToPnL(
        sub.productCategoryId,
        sub.productId,
        monthKey,
        year,
        tx
      );

      // Mettre à jour l'abonnement
      await updateSubscription(sub.id, {
        lastRenewalDate: renewalDate.toISOString(),
        renewalCount: sub.renewalCount + 1,
        nextRenewalDate: calculateNextRenewal(renewalDate, sub.cycle).toISOString(),
      });
    }

    // Vérifier expiration
    if (sub.endDate && new Date(sub.endDate) <= today) {
      await updateSubscription(sub.id, { status: 'expired' });
    }
  }
};

// Helper: Calculer les dates manquantes
const calculateMissingRenewals = (
  lastRenewal: Date,
  today: Date,
  cycle: 'monthly' | 'annual',
  dayOfMonth: number
): Date[] => {
  const dates: Date[] = [];
  let current = new Date(lastRenewal);

  while (true) {
    // Avancer d'un cycle
    if (cycle === 'monthly') {
      current.setMonth(current.getMonth() + 1);
    } else {
      current.setFullYear(current.getFullYear() + 1);
    }
    current.setDate(Math.min(dayOfMonth, getDaysInMonth(current)));

    if (current > today) break;
    dates.push(new Date(current));
  }

  return dates;
};
```

### 3.4 UI Flow

1. **Création abonnement** (TransactionsModal)
   - Checkbox "Abonnement récurrent"
   - Sélection cycle (mensuel/annuel)
   - Date de début (défaut: aujourd'hui)
   - Crée la Transaction + l'entrée Subscription

2. **Sync au chargement**
   - `useEffect` au mount du P&L
   - Ou bouton "Synchroniser abonnements"
   - Affiche "X transactions créées depuis dernière sync"

3. **Gestion abonnements**
   - Modal dédié accessible depuis Overview
   - Liste avec filtres (actif/pause/résilié)
   - Actions: pause, reprendre, résilier, modifier

---

## 4. PRIORITÉS D'IMPLÉMENTATION

| Phase | Feature | Effort | Impact |
|-------|---------|--------|--------|
| **Phase 1** | Structure Subscription + UI création | 2-3h | Fondation |
| **Phase 1** | Logique de renouvellement | 2-3h | Core |
| **Phase 1** | Modal gestion abonnements | 2h | UX |
| **Phase 2** | MRR/ARR dans Overview | 1h | Insights |
| **Phase 2** | Historique dans fiche Client | 2h | UX |
| **Phase 3** | Prévisions revenue | 2-3h | Business |
| **Phase 4** | Module Facturation | 1-2 jours | Advanced |

---

## 5. QUESTIONS OUVERTES

1. **Gestion multi-années** : Si un abonnement traverse plusieurs années, comment gérer le P&L ?
   → Proposition : Créer les transactions dans le P&L de l'année correspondante

2. **Prorata** : Si on crée un abonnement le 20 du mois, facturer le mois complet ou au prorata ?
   → Proposition : Mois complet par défaut, option prorata

3. **Changement de prix** : Si on modifie le prix d'un abonnement, effet immédiat ou au prochain renouvellement ?
   → Proposition : Au prochain renouvellement

4. **Notifications** : Alerter quand un abonnement arrive à expiration ?
   → Proposition : Indicateur visuel dans l'Overview

---

## 6. FICHIERS À CRÉER/MODIFIER

### Nouveaux fichiers
- `apps/web/app/[locale]/admin/pnl/types/subscription.ts` - Types Subscription
- `apps/web/app/[locale]/admin/pnl/hooks/useSubscriptions.ts` - Hook CRUD subscriptions
- `apps/web/app/[locale]/admin/pnl/components/SubscriptionsModal.tsx` - Modal gestion
- `apps/web/app/[locale]/admin/pnl/utils/renewalEngine.ts` - Logique renouvellement

### Fichiers à modifier
- `apps/web/app/[locale]/admin/pnl/components/TransactionsModal.tsx` - Ajouter UI abonnement
- `apps/web/app/[locale]/admin/pnl/PnLPageClient.tsx` - Intégrer sync + MRR display
- `apps/web/lib/types/database.ts` - Ajouter type Subscription

---

*Document de référence pour l'évolution des modules admin VMCloud/Hackboot*
