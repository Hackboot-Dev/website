# Admin Suite Roadmap

> Roadmap pour une suite de gestion d'entreprise cohérente et interconnectée

**Dernière mise à jour :** 2026-01-10
**Score actuel :** 6/10 (Phase 1 complète, modules connectés)

---

## 📊 État Actuel des Modules

| Module | URL | État | Score | Détails |
|--------|-----|------|-------|---------|
| **Dashboard** | `/admin` | ✅ Fonctionnel | 7/10 | KPIs temps réel depuis Supabase (Revenue MTD, Clients, MRR) |
| **Login** | `/admin/login` | ✅ Fonctionnel | 8/10 | Session admin OK |
| **Clients** | `/admin/clients` | ✅ Connecté | 8/10 | CRUD + stats auto-màj via trigger P&L |
| **Catalogue** | `/admin/catalogue` | ✅ Fonctionnel | 7/10 | Produits, édition, hooks - complet |
| **P&L Hackboot** | `/admin/pnl/hackboot` | ✅ Riche | 8/10 | Transactions Supabase, MRR, graphiques |
| **P&L VMCloud** | `/admin/pnl/vmcloud` | ✅ Riche | 8/10 | Même système que Hackboot |
| **Subscriptions** | `/admin/pnl/*/subscriptions` | ✅ Intégré | 7/10 | Intégré au P&L, Supabase unique |
| **Settings** | `/admin/settings` | ✅ Basique | 5/10 | Page fonctionnelle, config DB affichée |

### Technologies
- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS, Framer Motion
- **Backend:** Supabase (PostgreSQL) - **100% migré depuis Firebase**
- **Auth:** Sessions admin custom
- **Multi-tenant:** Par companyId (vmcloud, hackboot)

---

## ✅ Problèmes Résolus (Phase 1)

### 1. ~~Modules en Silo~~ → CONNECTÉS
```
Clients ←──→ P&L ←──→ Subscriptions
   ↓           ↓            ↓
 Supabase   Supabase    Supabase (unifié)
```
- ✅ Les modules communiquent via Supabase
- ✅ Vue client 360° (transactions + stats auto-màj)
- ✅ Trigger PostgreSQL met à jour les stats clients automatiquement

### 2. ~~Double Système de Subscriptions~~ → UNIFIÉ
| Système | Localisation | Base | État |
|---------|--------------|------|------|
| P&L Subscriptions | `/admin/pnl/hooks/useSubscriptions.ts` | Supabase | ✅ Unique |

**Résolu :** Un seul système de subscriptions dans Supabase

### 3. ~~Dashboard Vide~~ → FONCTIONNEL
- ✅ KPIs temps réel depuis Supabase
- ✅ Revenue MTD, Clients actifs, Abonnements, MRR
- ✅ Calcul des variations % vs mois précédent

### 4. Fonctionnalités Business Manquantes (Phase 2+)
- ❌ Pas d'objectifs (targets mensuels/annuels)
- ❌ Pas d'alertes automatiques
- ❌ Pas de forecasting
- ❌ Pas de facturation
- ❌ Pas de reporting/export

---

## ✅ Ce qui est FAIT

### Foundation
- [x] Structure admin avec layout dédié
- [x] Authentification admin (session-based)
- [x] Navigation responsive (desktop + mobile)
- [x] Design system cohérent (zinc theme)

### Module Clients
- [x] CRUD complet (create, read, update, delete)
- [x] Recherche temps réel (debounce 500ms)
- [x] Stats agrégées (total, actifs, leads, churned)
- [x] Classification par type (individual, business, enterprise)
- [x] Modal création/édition

### Module Catalogue
- [x] Vue 3 colonnes (catégories → produits → détail)
- [x] Édition produits avec modal
- [x] Hooks et composants extraits
- [x] Traductions FR/EN

### Module P&L (Hackboot + VMCloud)
- [x] KPIs : Revenue, Gross Profit, Operating Profit, Net Profit
- [x] Gestion des produits et transactions par mois
- [x] Abonnements récurrents avec renouvellement auto
- [x] Dépenses par catégorie
- [x] 4 onglets (Overview, Products, Expenses, Annual)
- [x] Graphiques de tendance
- [x] Auto-save (debounce 800ms)
- [x] Modals : Clients, Transactions, Subscriptions, Rules

### Module Subscriptions (non commité)
- [x] Structure créée (page, components, hooks, types)
- [x] Migration SQL prête (`20251219_subscriptions.sql`)
- [x] Plans avec pricing
- [x] États lifecycle (trial, active, paused, cancelled)
- [x] Events logging
- [ ] Non intégré au P&L
- [ ] Non lié aux Clients

---

## 🚧 En Cours

- [x] ~~Finaliser et commiter le module Subscriptions~~ → Intégré au P&L
- [x] ~~Tester l'intégration avec Supabase~~ → Fonctionnel
- [ ] Phase 2 : Module Objectifs (targets mensuels/annuels)
- [ ] Phase 2 : Système d'alertes automatiques

---

## 📋 À Faire - Roadmap

### Phase 1 : Unification ✅ COMPLÈTE

**Objectif :** Connecter les modules entre eux pour avoir une vue cohérente

| Tâche | État | Détails |
|-------|------|---------|
| Unifier les 2 systèmes Subscriptions → Supabase unique | ✅ | `database-supabase.ts` utilisé partout |
| Lier Clients ↔ P&L (transactions créent/màj clients) | ✅ | Trigger `trigger_update_client_stats` |
| Dashboard avec vraies KPIs consolidées | ✅ | Hook `useDashboardStats.ts` |
| Créer page Settings basique | ✅ | `SettingsPageClient.tsx` |

**Fichiers créés/modifiés :**
```
✅ /lib/services/database-supabase.ts  # Service unifié Supabase
✅ /admin/hooks/useDashboardStats.ts   # KPIs consolidés
✅ /admin/settings/page.tsx            # Page settings
✅ /supabase/migrations/20251219_restructure_transactions.sql  # Trigger client stats
```

### Phase 2 : Visibility Business ⏱️ 2-3 semaines

**Objectif :** Avoir une vision claire de la performance

| Tâche | Priorité | Impact |
|-------|----------|--------|
| Module Objectifs (targets mensuels/annuels) | P1 | Comparer réel vs cible |
| Système d'alertes automatiques | P1 | Réagir avant problèmes |
| Forecasting simple (projections MRR) | P2 | Planification |
| Comparaisons YoY/MoM | P2 | Tendances |

**Tables Supabase à créer :**
```sql
-- Objectifs
CREATE TABLE objectives (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  type TEXT NOT NULL,              -- 'revenue', 'expense', 'mrr', 'clients'
  period TEXT NOT NULL,            -- 'monthly', 'quarterly', 'yearly'
  year INTEGER NOT NULL,
  month INTEGER,                   -- NULL si yearly
  target_amount DECIMAL(15,2) NOT NULL,
  actual_amount DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alertes
CREATE TABLE alerts (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  severity TEXT NOT NULL,          -- 'critical', 'warning', 'info'
  type TEXT NOT NULL,              -- 'revenue_miss', 'churn_spike', 'expense_overrun'
  message TEXT NOT NULL,
  is_acknowledged BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Phase 3 : Facturation ⏱️ 2-3 semaines

**Objectif :** Générer et suivre les factures

| Tâche | Priorité | Impact |
|-------|----------|--------|
| Génération factures (depuis subscriptions) | P1 | Billing automatisé |
| Numérotation légale (FAC-2025-0001) | P1 | Conformité |
| Templates PDF | P2 | Envoi pro |
| Suivi paiements | P2 | Cash flow |
| Relances automatiques | P3 | Réduire impayés |

### Phase 4 : Analytics & Reporting ⏱️ 2-3 semaines

**Objectif :** Comprendre en profondeur le business

| Tâche | Priorité | Impact |
|-------|----------|--------|
| Métriques SaaS (MRR, ARR, Churn, LTV, CAC) | P1 | KPIs standard |
| Client Health Score | P2 | Prédire churn |
| Cohort Analysis | P2 | Retention par cohorte |
| Export PDF/CSV | P2 | Partage/archives |
| Audit log | P3 | Traçabilité |

### Phase 5 : CRM Avancé (Optionnel) ⏱️ 3-4 semaines

| Tâche | Priorité | Impact |
|-------|----------|--------|
| Pipeline commercial (Kanban) | P3 | Suivi opportunités |
| Activités (appels, meetings, notes) | P3 | Historique interactions |
| Segmentation auto (par CA, ancienneté) | P3 | Marketing ciblé |

### Phase 6 : Opérations (Optionnel) ⏱️ 2-3 semaines

| Tâche | Priorité | Impact |
|-------|----------|--------|
| Inventaire serveurs VPS | P3 | Vue infrastructure |
| Coût par client (revenu - coût serveur) | P3 | Marge réelle |
| Fournisseurs et contrats | P3 | Suivi engagements |

---

## 🎯 Architecture Cible

```
┌─────────────────────────────────────────────────────────────┐
│                    ADMIN DASHBOARD                          │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│  │ Revenue │ │ Clients │ │   MRR   │ │  Churn  │  ← KPIs   │
│  │ €12,450 │ │   47    │ │ €8,200  │ │  2.3%   │    temps  │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘    réel   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ CLIENTS  │←→│ SUBSCRIPTIONS│←→│     P&L      │          │
│  │  (CRM)   │  │   (Billing)  │  │  (Finance)   │          │
│  └──────────┘  └──────────────┘  └──────────────┘          │
│       ↓              ↓                  ↓                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           SUPABASE (Source unique)                   │   │
│  │  clients | subscriptions | transactions | invoices   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │OBJECTIVES│  │    ALERTS    │  │  REPORTING   │          │
│  │ (Targets)│  │ (Monitoring) │  │   (Export)   │          │
│  └──────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Structure Routes Admin (Cible)

```
/admin
├── /                       # Dashboard KPIs consolidés
├── /clients                # CRM avec vue 360°
│   └── /[id]               # Fiche client (transactions + subscriptions)
├── /subscriptions          # Gestion abonnements (source unique)
│   ├── /plans              # Configuration plans
│   └── /metrics            # MRR, Churn, LTV
├── /pnl
│   ├── /hackboot           # P&L Hackboot
│   └── /vmcloud            # P&L VMCloud
├── /catalogue              # Produits
├── /objectives             # Targets & Goals
├── /invoices               # Facturation (future)
├── /analytics              # Reporting (future)
└── /settings               # Configuration
```

---

## 📈 Métriques de Succès

| Métrique | Phase 1 (Actuel) | Cible Phase 2 | Cible Final |
|----------|------------------|---------------|-------------|
| Score global | ✅ 6/10 | 7/10 | 8/10 |
| Modules connectés | ✅ 100% | 100% | 100% |
| Dashboard fonctionnel | ✅ | ✅ | ✅ |
| Objectifs/Targets | ❌ | ✅ | ✅ |
| Alertes | ❌ | ❌ | ✅ |
| Facturation | ❌ | ❌ | ✅ |

---

## 📝 Notes Techniques

### Conventions
- **Tables SQL:** snake_case pluriel (`subscriptions`, `invoice_lines`)
- **IDs:** Préfixe + nanoid (`sub_abc123`, `inv_xyz789`)
- **Multi-tenant:** Toutes les tables ont `company_id`

### Stack
- Supabase comme source unique (migrer Firebase P&L progressivement)
- RLS pour isolation multi-tenant
- API Routes Next.js pour logique métier
- Zod pour validation

---

*Ce document est la référence pour le développement de l'admin. Mis à jour après chaque phase.*
