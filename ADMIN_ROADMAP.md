# Admin Suite Roadmap

> Vision complète pour une suite de gestion d'entreprise multi-modules

**Dernière mise à jour :** 2025-12-19
**Statut :** Planification

---

## 📊 État actuel de l'admin

| Module | État | Description |
|--------|------|-------------|
| **Dashboard** | 🟡 Basique | KPIs placeholder, pas de données réelles |
| **Clients** | 🟢 Fonctionnel | CRUD, recherche, stats agrégées |
| **Catalogue** | 🟢 Fonctionnel | Produits, catégories, prix |
| **P&L** | 🟢 Riche | Revenus, dépenses, transactions, graphiques |
| **Settings** | 🔴 Vide | Lien mort |
| **Abonnements** | 🟡 Limité | Intégré dans P&L (modal), pas de module dédié |

### Technologies actuelles
- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS, Framer Motion
- **Backend:** Supabase (PostgreSQL), API Routes
- **Auth:** Sessions admin custom
- **Multi-tenant:** Par companyId (vmcloud, hackboot)

---

## 🚀 Vision : Suite Admin Complète

Architecture en **8 domaines fonctionnels** interconnectés.

---

## 1. 📈 FINANCES

### 1.1 Comptabilité
| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Plan comptable | Liste des comptes (classe 1-7), personnalisable | P1 |
| Journal des écritures | Saisie débit/crédit, pièces justificatives | P1 |
| Grand livre | Vue par compte, soldes | P1 |
| Balance | Balance générale, balance âgée | P2 |
| Lettrage | Rapprochement créances/dettes | P2 |
| Clôture | Clôture mensuelle/annuelle, reports à nouveau | P3 |

**Tables Supabase à créer :**
```sql
-- Plan comptable
CREATE TABLE chart_of_accounts (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  code TEXT NOT NULL,           -- "411000", "512000"
  label TEXT NOT NULL,          -- "Clients", "Banque"
  class INTEGER NOT NULL,       -- 1-7
  type TEXT NOT NULL,           -- "asset", "liability", "equity", "revenue", "expense"
  parent_id TEXT REFERENCES chart_of_accounts(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Journal des écritures
CREATE TABLE journal_entries (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  entry_date DATE NOT NULL,
  journal_code TEXT NOT NULL,   -- "VE" (ventes), "AC" (achats), "BQ" (banque), "OD" (opérations diverses)
  reference TEXT,               -- Numéro facture, etc.
  description TEXT,
  is_balanced BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lignes d'écritures
CREATE TABLE journal_entry_lines (
  id TEXT PRIMARY KEY,
  entry_id TEXT REFERENCES journal_entries(id) ON DELETE CASCADE,
  account_id TEXT REFERENCES chart_of_accounts(id),
  debit DECIMAL(15,2) DEFAULT 0,
  credit DECIMAL(15,2) DEFAULT 0,
  label TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 1.2 Trésorerie
| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Comptes bancaires | Multi-comptes, soldes temps réel | P1 |
| Flux de trésorerie | Entrées/sorties, catégorisation | P1 |
| Rapprochement | Import relevés, matching auto | P2 |
| Prévisions | Projection cash à 3/6/12 mois | P2 |
| Alertes | Seuils, découvert prévu | P3 |

**Tables Supabase à créer :**
```sql
CREATE TABLE bank_accounts (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  name TEXT NOT NULL,
  bank_name TEXT,
  iban TEXT,
  bic TEXT,
  currency TEXT DEFAULT 'EUR',
  initial_balance DECIMAL(15,2) DEFAULT 0,
  current_balance DECIMAL(15,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE bank_transactions (
  id TEXT PRIMARY KEY,
  bank_account_id TEXT REFERENCES bank_accounts(id),
  transaction_date DATE NOT NULL,
  value_date DATE,
  amount DECIMAL(15,2) NOT NULL,
  description TEXT,
  category TEXT,
  reference TEXT,
  is_reconciled BOOLEAN DEFAULT false,
  reconciled_with TEXT,         -- ID facture/dépense
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 1.3 Facturation
| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Génération factures | Depuis transactions/abonnements | P1 |
| Numérotation | Séquence légale (FAC-2025-0001) | P1 |
| Templates | Design personnalisable | P2 |
| Envoi email | Automatique ou manuel | P2 |
| Relances | Automatiques selon échéance | P2 |
| Avoirs | Génération depuis facture | P3 |
| Multi-devise | Facturation USD, GBP, etc. | P3 |

**Tables Supabase à créer :**
```sql
CREATE TABLE invoices (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  number TEXT UNIQUE NOT NULL,  -- "FAC-2025-0001"
  client_id TEXT REFERENCES clients(id),
  subscription_id TEXT,         -- Si facture récurrente

  -- Snapshot client (légalement requis)
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_address JSONB,
  client_vat_number TEXT,

  -- Montants
  subtotal DECIMAL(15,2) NOT NULL,
  tax_rate DECIMAL(5,2) DEFAULT 20,
  tax_amount DECIMAL(15,2) NOT NULL,
  total DECIMAL(15,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',

  -- Statut
  status TEXT DEFAULT 'draft',  -- draft, sent, paid, overdue, cancelled

  -- Dates
  issued_at DATE,
  due_at DATE,
  paid_at DATE,
  sent_at TIMESTAMPTZ,

  -- Paiement
  payment_method TEXT,
  payment_reference TEXT,

  -- Metadata
  notes TEXT,
  footer_text TEXT,
  pdf_url TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE invoice_lines (
  id TEXT PRIMARY KEY,
  invoice_id TEXT REFERENCES invoices(id) ON DELETE CASCADE,
  product_id TEXT,
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) DEFAULT 1,
  unit_price DECIMAL(15,2) NOT NULL,
  discount_percent DECIMAL(5,2) DEFAULT 0,
  tax_rate DECIMAL(5,2) DEFAULT 20,
  total DECIMAL(15,2) NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE invoice_reminders (
  id TEXT PRIMARY KEY,
  invoice_id TEXT REFERENCES invoices(id) ON DELETE CASCADE,
  reminder_number INTEGER NOT NULL,  -- 1, 2, 3
  sent_at TIMESTAMPTZ NOT NULL,
  channel TEXT DEFAULT 'email',      -- email, sms
  template_used TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 1.4 Fiscalité
| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| TVA collectée | Calcul auto depuis ventes | P1 |
| TVA déductible | Depuis achats/dépenses | P1 |
| Déclaration TVA | Export pour CA3/CA12 | P2 |
| Export FEC | Fichier des Écritures Comptables | P2 |
| IS/IR | Provisions impôts | P3 |

---

## 2. 💼 CRM (Clients avancé)

### 2.1 Pipeline commercial
| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Opportunités | Deals avec montant, probabilité | P1 |
| Étapes | Kanban personnalisable | P1 |
| Prévisions | Weighted pipeline, forecast | P2 |
| Activités | Tâches, appels, meetings | P2 |
| Rapports | Win rate, cycle de vente | P3 |

**Tables Supabase à créer :**
```sql
CREATE TABLE pipeline_stages (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  name TEXT NOT NULL,
  color TEXT,
  probability INTEGER DEFAULT 0,  -- 0-100%
  sort_order INTEGER DEFAULT 0,
  is_won BOOLEAN DEFAULT false,
  is_lost BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE opportunities (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  client_id TEXT REFERENCES clients(id),
  stage_id TEXT REFERENCES pipeline_stages(id),

  title TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(15,2),
  currency TEXT DEFAULT 'EUR',
  probability INTEGER,           -- Override stage probability

  expected_close_date DATE,
  actual_close_date DATE,

  owner_id TEXT,                 -- User assigné
  source TEXT,                   -- "website", "referral", "cold"

  won_reason TEXT,
  lost_reason TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE activities (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  opportunity_id TEXT REFERENCES opportunities(id),
  client_id TEXT REFERENCES clients(id),

  type TEXT NOT NULL,            -- "call", "email", "meeting", "task", "note"
  title TEXT NOT NULL,
  description TEXT,

  due_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,

  owner_id TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.2 Historique client
| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Timeline | Toutes les interactions | P1 |
| Achats | Historique complet | P1 |
| Tickets | Support lié | P2 |
| Documents | Contrats, devis | P3 |

### 2.3 Segmentation
| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Segments auto | Par CA, ancienneté, produit | P2 |
| Scoring | Lead scoring, health score | P2 |
| Cohortes | Analyse par date d'acquisition | P3 |
| RFM | Récence, Fréquence, Montant | P3 |

---

## 3. 🔄 ABONNEMENTS (Module dédié)

### 3.1 Gestion abonnements
| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| CRUD | Création, modification, vue | P1 |
| Plans | Configuration des offres | P1 |
| Statuts | Active, paused, cancelled, trial | P1 |
| Actions | Pause, resume, cancel, upgrade | P1 |
| Historique | Changelog complet | P2 |

**Tables Supabase à créer :**
```sql
CREATE TABLE subscription_plans (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  product_id TEXT REFERENCES products(id),

  name TEXT NOT NULL,
  description TEXT,

  -- Pricing
  price DECIMAL(15,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  billing_period TEXT NOT NULL,  -- "monthly", "yearly"
  billing_period_count INTEGER DEFAULT 1,

  -- Trial
  trial_days INTEGER DEFAULT 0,

  -- Features (JSON array)
  features JSONB DEFAULT '[]',

  -- Limits
  max_users INTEGER,
  max_storage_gb INTEGER,

  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE subscriptions (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  client_id TEXT REFERENCES clients(id),
  plan_id TEXT REFERENCES subscription_plans(id),

  -- Status
  status TEXT DEFAULT 'active',  -- trial, active, paused, cancelled, expired

  -- Dates
  started_at TIMESTAMPTZ NOT NULL,
  trial_ends_at TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancelled_at TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  paused_at TIMESTAMPTZ,

  -- Pricing (peut différer du plan si custom)
  price DECIMAL(15,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  discount_percent DECIMAL(5,2) DEFAULT 0,

  -- Billing
  next_invoice_at TIMESTAMPTZ,
  last_invoice_id TEXT,

  -- Metadata
  cancel_reason TEXT,
  notes TEXT,
  metadata JSONB DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE subscription_events (
  id TEXT PRIMARY KEY,
  subscription_id TEXT REFERENCES subscriptions(id) ON DELETE CASCADE,

  event_type TEXT NOT NULL,      -- "created", "activated", "upgraded", "downgraded", "paused", "resumed", "cancelled", "expired", "renewed"

  old_plan_id TEXT,
  new_plan_id TEXT,
  old_price DECIMAL(15,2),
  new_price DECIMAL(15,2),

  reason TEXT,
  performed_by TEXT,             -- User ID ou "system"

  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.2 Facturation récurrente
| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Cycles | Mensuel, annuel, custom | P1 |
| Prorata | Calcul au jour | P2 |
| Upgrades | Facturation différentielle | P2 |
| Bulk | Facturation groupée | P3 |

### 3.3 Métriques SaaS
| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| MRR/ARR | Calcul temps réel | P1 |
| Churn | Taux, analyse causes | P1 |
| LTV | Par segment, produit | P2 |
| CAC | Coût acquisition | P2 |
| Net Revenue Retention | Expansion - Churn | P2 |
| Cohort analysis | Retention par cohorte | P3 |

### 3.4 Dunning (Gestion échecs paiement)
| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Détection | Échecs paiement auto | P2 |
| Relances | Séquence emails | P2 |
| Retry | Nouvelles tentatives | P2 |
| Grace period | Délai avant suspension | P2 |

---

## 4. 🎯 OBJECTIFS & PERFORMANCE

### 4.1 OKRs
| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Objectifs | Par entreprise, équipe | P2 |
| Key Results | Métriques mesurables | P2 |
| Progress | Suivi temps réel | P2 |
| Check-ins | Updates périodiques | P3 |

**Tables Supabase à créer :**
```sql
CREATE TABLE objectives (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,

  title TEXT NOT NULL,
  description TEXT,

  owner_id TEXT,
  parent_id TEXT REFERENCES objectives(id),  -- Pour cascade

  period_type TEXT NOT NULL,     -- "quarterly", "yearly"
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,

  status TEXT DEFAULT 'active',  -- active, completed, cancelled
  progress INTEGER DEFAULT 0,    -- 0-100, calculé depuis KRs

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE key_results (
  id TEXT PRIMARY KEY,
  objective_id TEXT REFERENCES objectives(id) ON DELETE CASCADE,

  title TEXT NOT NULL,
  description TEXT,

  metric_type TEXT NOT NULL,     -- "number", "currency", "percent", "boolean"
  start_value DECIMAL(15,2) DEFAULT 0,
  target_value DECIMAL(15,2) NOT NULL,
  current_value DECIMAL(15,2) DEFAULT 0,

  unit TEXT,                     -- "€", "%", "users", etc.

  -- Auto-update depuis données
  data_source TEXT,              -- "mrr", "clients_count", "churn_rate", etc.

  weight DECIMAL(3,2) DEFAULT 1, -- Poids dans le calcul progress

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE kr_updates (
  id TEXT PRIMARY KEY,
  key_result_id TEXT REFERENCES key_results(id) ON DELETE CASCADE,

  previous_value DECIMAL(15,2),
  new_value DECIMAL(15,2) NOT NULL,

  note TEXT,
  updated_by TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.2 KPIs Dashboard
| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Widgets | Graphiques, jauges, compteurs | P1 |
| Personnalisation | Drag & drop, resize | P2 |
| Alertes | Seuils, notifications | P2 |
| Partage | Export PDF, lien public | P3 |

### 4.3 Forecasting
| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Revenus | Projection basée sur abos + pipeline | P2 |
| Dépenses | Projection basée sur récurrence | P2 |
| Scénarios | Best/worst/expected case | P3 |

### 4.4 Comparaisons
| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| YoY | Année vs année précédente | P1 |
| MoM | Mois vs mois précédent | P1 |
| vs Budget | Réel vs prévu | P2 |
| vs Objectifs | Réel vs cibles | P2 |

---

## 5. 📦 OPÉRATIONS (Infrastructure)

### 5.1 Inventaire serveurs
| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Liste VPS | Tous les serveurs actifs | P2 |
| Specs | CPU, RAM, stockage, IP | P2 |
| Statut | Online/offline, uptime | P2 |
| Client associé | Lien avec abonnement | P2 |

**Tables Supabase à créer :**
```sql
CREATE TABLE servers (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  client_id TEXT REFERENCES clients(id),
  subscription_id TEXT REFERENCES subscriptions(id),

  hostname TEXT NOT NULL,
  ip_address TEXT,

  -- Specs
  cpu_cores INTEGER,
  ram_gb INTEGER,
  storage_gb INTEGER,
  os TEXT,

  -- Provider
  provider TEXT,                 -- "ovh", "hetzner", "aws"
  provider_id TEXT,              -- ID chez le provider
  datacenter TEXT,               -- "GRA", "SBG", etc.

  -- Status
  status TEXT DEFAULT 'active',  -- provisioning, active, suspended, terminated

  -- Costs
  monthly_cost DECIMAL(15,2),
  currency TEXT DEFAULT 'EUR',

  -- Dates
  provisioned_at TIMESTAMPTZ,
  terminated_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 5.2 Coûts infrastructure
| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Coût par serveur | Mensuel, cumulé | P2 |
| Coût par client | Total ressources | P2 |
| Marge réelle | Revenu - coût par client | P2 |
| Alertes | Marge < seuil | P3 |

### 5.3 Fournisseurs
| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Liste | OVH, Hetzner, etc. | P3 |
| Contrats | Suivi engagements | P3 |
| Factures | Import, matching | P3 |

---

## 6. 📋 PROJETS & TÂCHES

### 6.1 Projets
| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| CRUD | Création, archivage | P3 |
| Client associé | Lien avec CRM | P3 |
| Milestones | Jalons, deadlines | P3 |
| Budget | Temps prévu vs réel | P3 |

### 6.2 Tâches
| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Todo list | Personnel, équipe | P3 |
| Assignation | Par membre | P3 |
| Priorités | Urgent, normal, low | P3 |
| Récurrence | Tâches répétitives | P3 |

### 6.3 Time tracking
| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Timer | Start/stop | P3 |
| Entrées manuelles | Saisie après coup | P3 |
| Par projet/client | Ventilation | P3 |
| Rapports | Temps passé, rentabilité | P3 |

---

## 7. 👥 RH & ÉQUIPE

### 7.1 Équipe
| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Membres | Liste, profils | P3 |
| Rôles | Admin, manager, user | P3 |
| Permissions | Par module, par action | P3 |

### 7.2 Congés
| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Demandes | Soumission, validation | P3 |
| Soldes | CP, RTT, maladie | P3 |
| Planning | Vue calendrier | P3 |

### 7.3 Notes de frais
| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Soumission | Avec justificatifs | P3 |
| Validation | Workflow approbation | P3 |
| Remboursement | Suivi paiement | P3 |

---

## 8. ⚙️ CONFIGURATION

### 8.1 Settings généraux
| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Infos société | Nom, adresse, SIRET | P1 |
| Devise par défaut | EUR, USD | P1 |
| Fuseau horaire | Europe/Paris | P1 |
| Logo | Upload, utilisation factures | P2 |

### 8.2 Intégrations
| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Stripe | Paiements, webhooks | P2 |
| Banque | Import relevés (OFX, CSV) | P3 |
| Email | SMTP, templates | P2 |
| Slack | Notifications | P3 |

### 8.3 Audit log
| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Historique | Toutes les actions admin | P2 |
| Filtres | Par user, date, action | P2 |
| Export | CSV, JSON | P3 |

### 8.4 Exports
| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| FEC | Export comptable légal | P2 |
| PDF | Rapports, factures | P2 |
| CSV | Données brutes | P1 |
| API | Endpoints REST | P3 |

---

## 🏗️ Architecture des routes

```
/admin
├── /                           # Dashboard unifié avec widgets
│
├── /clients                    # CRM
│   ├── /[id]                   # Fiche client détaillée
│   ├── /pipeline               # Opportunités (kanban)
│   ├── /segments               # Cohortes, segments
│   └── /import                 # Import CSV
│
├── /subscriptions              # Abonnements
│   ├── /                       # Liste tous les abos
│   ├── /[id]                   # Détail abonnement
│   ├── /plans                  # Gestion des plans
│   ├── /metrics                # MRR, Churn, LTV
│   └── /dunning                # Échecs paiement
│
├── /invoices                   # Facturation
│   ├── /                       # Liste factures
│   ├── /[id]                   # Détail/édition
│   ├── /new                    # Nouvelle facture
│   └── /settings               # Numérotation, templates
│
├── /accounting                 # Comptabilité
│   ├── /journal                # Journal des écritures
│   ├── /ledger                 # Grand livre
│   ├── /chart                  # Plan comptable
│   ├── /balance                # Balance
│   └── /reports                # Bilan, compte de résultat
│
├── /treasury                   # Trésorerie
│   ├── /accounts               # Comptes bancaires
│   ├── /transactions           # Mouvements
│   ├── /reconciliation         # Rapprochement
│   └── /forecast               # Prévisions
│
├── /pnl                        # P&L (existant)
│   ├── /vmcloud
│   └── /hackboot
│
├── /catalogue                  # Produits (existant)
│
├── /goals                      # Objectifs
│   ├── /okrs                   # OKRs
│   ├── /kpis                   # Dashboard KPIs
│   └── /forecast               # Prévisions
│
├── /operations                 # Infrastructure
│   ├── /servers                # Inventaire VPS
│   ├── /costs                  # Analyse coûts
│   └── /providers              # Fournisseurs
│
├── /projects                   # Projets (optionnel)
│   ├── /                       # Liste projets
│   ├── /[id]                   # Détail projet
│   └── /tasks                  # Tâches
│
├── /team                       # RH (optionnel)
│   ├── /members                # Équipe
│   ├── /leaves                 # Congés
│   └── /expenses               # Notes de frais
│
└── /settings                   # Configuration
    ├── /company                # Infos société
    ├── /integrations           # APIs, webhooks
    ├── /billing                # Facturation settings
    ├── /audit                  # Logs
    └── /export                 # Exports
```

---

## 🎯 Priorisation recommandée

### Phase 1 : Fondations (Priorité haute)
1. **Abonnements** - Module dédié avec gestion complète
2. **Facturation** - Génération, envoi, suivi
3. **Dashboard amélioré** - KPIs temps réel

### Phase 2 : Finance (Priorité moyenne-haute)
4. **Métriques SaaS** - MRR, Churn, LTV
5. **Trésorerie basique** - Comptes, flux
6. **Objectifs/KPIs** - Pilotage croissance

### Phase 3 : Avancé (Priorité moyenne)
7. **CRM Pipeline** - Opportunités, prévisions
8. **Comptabilité** - Journal, grand livre
9. **Exports** - FEC, rapports

### Phase 4 : Optionnel (Priorité basse)
10. **Opérations** - Inventaire serveurs
11. **Projets** - Gestion tâches
12. **RH** - Équipe, congés

---

## 📝 Notes techniques

### Conventions de nommage
- **Tables:** snake_case pluriel (`subscriptions`, `invoice_lines`)
- **Colonnes:** snake_case (`client_id`, `created_at`)
- **IDs:** Préfixe + timestamp + random (`sub_abc123`, `inv_xyz789`)

### Multi-tenant
- Toutes les tables ont `company_id`
- RLS Supabase pour isolation
- Index sur `(company_id, ...)` pour performance

### API
- Routes API sous `/api/admin/[module]/`
- Validation avec Zod
- Pagination cursor-based

### UI/UX
- Design system existant (zinc/white theme)
- Composants réutilisables dans `/_shared/`
- Animations Framer Motion cohérentes

---

## 📚 Ressources

- [Supabase Docs](https://supabase.com/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/icons)

---

*Ce document est évolutif et sera mis à jour au fur et à mesure de l'implémentation.*
