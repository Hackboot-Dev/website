# Admin Suite Roadmap

> Roadmap pour une suite de gestion d'entreprise cohérente et interconnectée

**Dernière mise à jour :** 2025-01-10
**Score actuel :** 3.6/10 (modules isolés, pas de vue business globale)

---

## 📊 État Actuel des Modules

| Module | URL | État | Score | Problèmes |
|--------|-----|------|-------|-----------|
| **Dashboard** | `/admin` | 🟡 Placeholder | 3/10 | KPIs vides ("—"), pas de données réelles |
| **Login** | `/admin/login` | ✅ Fonctionnel | 8/10 | Session admin OK |
| **Clients** | `/admin/clients` | ✅ Fonctionnel | 6/10 | CRUD OK mais **isolé** du P&L et Subscriptions |
| **Catalogue** | `/admin/catalogue` | ✅ Fonctionnel | 7/10 | Produits, édition, hooks - complet |
| **P&L Hackboot** | `/admin/pnl/hackboot` | ✅ Riche | 8/10 | Transactions, MRR, graphiques |
| **P&L VMCloud** | `/admin/pnl/vmcloud` | ✅ Riche | 8/10 | Même système que Hackboot |
| **Subscriptions** | `/admin/subscriptions` | 🟡 En cours | 4/10 | **Non commité**, doublon avec P&L |
| **Settings** | `/admin/settings` | ❌ Vide | 0/10 | Lien mort (404) |

### Technologies
- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS, Framer Motion
- **Backend:** Supabase (PostgreSQL) + Firebase (P&L legacy)
- **Auth:** Sessions admin custom
- **Multi-tenant:** Par companyId (vmcloud, hackboot)

---

## 🔴 Problèmes Critiques Identifiés

### 1. Modules en Silo (CRITIQUE)
```
Clients ←✗→ P&L ←✗→ Subscriptions
   ↓           ↓            ↓
 Isolé      Isolé        Isolé
```
- Les modules ne communiquent pas entre eux
- Pas de vue client 360° (transactions + subscriptions)
- Impossible de voir quel client génère quel revenu

### 2. Double Système de Subscriptions (CRITIQUE)
| Système | Localisation | Base | Utilisé pour |
|---------|--------------|------|--------------|
| P&L Subscriptions | `/admin/pnl/hooks/useSubscriptions.ts` | Firebase | Transactions récurrentes |
| Module Subscriptions | `/admin/subscriptions/` | Supabase | Gestion autonome |

**Impact :** Données dupliquées, incohérences garanties, MRR/ARR non fiables

### 3. Dashboard Vide
- Affiche des placeholders "—" au lieu de vraies métriques
- Pas de consolidation des données des autres modules

### 4. Absence de Fonctionnalités Business
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

- [ ] Finaliser et commiter le module Subscriptions
- [ ] Tester l'intégration avec Supabase

---

## 📋 À Faire - Roadmap

### Phase 1 : Unification (URGENT) ⏱️ 1-2 semaines

**Objectif :** Connecter les modules entre eux pour avoir une vue cohérente

| Tâche | Priorité | Impact |
|-------|----------|--------|
| Unifier les 2 systèmes Subscriptions → Supabase unique | P0 | Élimine la duplication |
| Lier Clients ↔ P&L (transactions créent/màj clients) | P0 | Vue client 360° |
| Dashboard avec vraies KPIs consolidées | P1 | Vision business temps réel |
| Créer page Settings basique | P1 | Éliminer le 404 |

**Fichiers à créer/modifier :**
```
/lib/services/subscriptions.ts     # Service unifié
/lib/services/metrics.ts           # KPIs consolidés
/admin/settings/page.tsx           # Page settings
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

| Métrique | Actuel | Cible Phase 1 | Cible Final |
|----------|--------|---------------|-------------|
| Score global | 3.6/10 | 6/10 | 8/10 |
| Modules connectés | 0% | 50% | 100% |
| Dashboard fonctionnel | ❌ | ✅ | ✅ |
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
