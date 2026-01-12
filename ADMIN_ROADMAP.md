# Admin Suite Roadmap

> Roadmap pour une suite de gestion d'entreprise cohérente et interconnectée

**Dernière mise à jour :** 2026-01-11
**Score actuel :** 9/10 (Phase 2 complète + Objectifs Financier ✅ + Objectifs Clients ✅)

**Spécifications :**
- [MODULE_OBJECTIVES.md](/MODULE_OBJECTIVES.md) - Spécifications complètes du module Objectifs

---

## 📊 État Actuel des Modules

| Module | URL | État | Score | Détails |
|--------|-----|------|-------|---------|
| **Dashboard** | `/admin` | ✅ Riche | 9/10 | KPIs, YoY/MoM, Forecasting MRR, Alertes summary |
| **Login** | `/admin/login` | ✅ Fonctionnel | 8/10 | Session admin OK |
| **Clients** | `/admin/clients` | ✅ Connecté | 8/10 | CRUD + stats auto-màj via trigger P&L |
| **Catalogue** | `/admin/catalogue` | ✅ Fonctionnel | 7/10 | Produits, édition, hooks - complet |
| **P&L Hackboot** | `/admin/pnl/hackboot` | ✅ Riche | 8/10 | Transactions Supabase, MRR, graphiques |
| **P&L VMCloud** | `/admin/pnl/vmcloud` | ✅ Riche | 8/10 | Même système que Hackboot |
| **Subscriptions** | `/admin/pnl/*/subscriptions` | ✅ Intégré | 7/10 | Intégré au P&L, Supabase unique |
| **Objectifs Financier** | `/admin/objectives` | ✅ Complet | 9/10 | Wizard, 20+ types, cohérence, page détail, graphiques, forecasting |
| **Objectifs Clients** | `/admin/objectives` | ✅ Complet | 9/10 | 14 types : acquisition, rétention, valeur, engagement |
| **Alertes** | `/admin/objectives` | ✅ Complet | 8/10 | Alertes auto, severity, acknowledge, panel intégré |
| **Objectifs Détail** | `/admin/objectives/[id]` | ✅ Complet | 9/10 | Page détail, métriques, graphiques, forecasting Monte Carlo |
| **Budgets** | `/admin/objectives/budgets` | ✅ Basique | 7/10 | Création et suivi budgets |
| **Settings** | `/admin/settings` | ✅ Basique | 5/10 | Page fonctionnelle, config DB affichée |

### Catégories Objectifs

| Catégorie | Statut | Types disponibles |
|-----------|--------|-------------------|
| **Financier** | ✅ Complet | CA, dépenses, profits, marges (13 types) |
| **Clients** | ✅ Complet | Acquisition, rétention, valeur, engagement (14 types) |
| **Abonnements** | 🚧 En cours | MRR, ARR, churn, NRR, GRR, expansion, prévisions (22 types) |
| **Produits** | 📋 Planifié | Ventes, marges, mix produit (4 types) |

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

### 4. ~~Fonctionnalités Business Manquantes~~ → Phase 2 COMPLÈTE
- ✅ Objectifs (targets mensuels/trimestriels/annuels) - Module complet
- ✅ Alertes automatiques (critical/warning/info, acknowledge, panel)
- ✅ Forecasting MRR (3/6/12 mois avec taux de croissance)
- ✅ Comparaisons YoY/MoM sur Dashboard
- ❌ Pas de facturation (Phase 3)
- ❌ Pas de reporting/export (Phase 4)

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
- [x] ~~Phase 2 : Module Objectifs (targets mensuels/annuels)~~ → ✅ Complet
- [x] ~~Phase 2 : Système d'alertes automatiques~~ → ✅ Complet
- [x] ~~Phase 2 : Forecasting MRR~~ → ✅ Complet
- [x] ~~Phase 2 : Comparaisons YoY/MoM~~ → ✅ Complet
- [ ] Phase 3 : Module Facturation

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

### Phase 2 : Visibility Business ✅ COMPLÈTE

**Objectif :** Avoir une vision claire de la performance

| Tâche | État | Impact |
|-------|------|--------|
| Module Objectifs (targets mensuels/trimestriels/annuels) | ✅ | Comparer réel vs cible |
| Système d'alertes automatiques | ✅ | Réagir avant problèmes |
| Forecasting MRR (3/6/12 mois) | ✅ | Planification |
| Comparaisons YoY/MoM | ✅ | Tendances |

**Fichiers créés/modifiés :**
```
✅ /supabase/migrations/20260110_phase2_objectives_alerts.sql  # Tables objectives, alerts, alert_rules
✅ /admin/objectives/page.tsx                    # Page server
✅ /admin/objectives/ObjectivesPageClient.tsx   # Page client
✅ /admin/objectives/types.ts                    # Types Objective, Alert, AlertRule
✅ /admin/objectives/hooks/useObjectives.ts     # Hook CRUD objectifs + progress
✅ /admin/objectives/hooks/useAlerts.ts         # Hook CRUD alertes
✅ /admin/objectives/components/ObjectiveCard.tsx       # Carte objectif avec progress
✅ /admin/objectives/components/AlertsPanel.tsx         # Panel alertes
✅ /admin/hooks/useDashboardStats.ts            # Enrichi avec YoY/MoM + Forecasting
✅ /admin/AdminDashboardClient.tsx              # Dashboard avec YoY, Forecasting, Alertes
✅ /admin/layout.tsx                            # Navigation + lien Objectifs
```

### Phase 2.5 : Objectifs Financier ✅ COMPLÈTE

**Objectif :** Transformer les objectifs en véritable outil de pilotage business

**Spécifications détaillées :** [MODULE_OBJECTIVES.md](/MODULE_OBJECTIVES.md)

#### ✅ Wizard et Types (Session 40)

| Tâche | État | Description |
|-------|------|-------------|
| Wizard création 5 étapes | ✅ | category → type → details → target → review |
| 20+ types d'objectifs | ✅ | revenue_total, revenue_product, expenses_category, gross_profit, net_profit, etc. |
| Filtres granulaires | ✅ | Par produit, catégorie produit, client, segment client, catégorie dépense |
| Validation cohérence | ✅ | Détecte si Revenue - Expenses ≠ Net Profit, marges incohérentes |
| Suggestions correction | ✅ | Propose corrections automatiques si incohérence |

#### ✅ Page Détail et Graphiques (Session 48-49)

| Tâche | État | Description |
|-------|------|-------------|
| Page détail `/objectives/[id]` | ✅ | Vue complète par objectif |
| Graphiques Recharts | ✅ | Évolution (courbes), Jauge (progression) |
| Forecasting Monte Carlo | ✅ | 1000 simulations, P5/P50/P95, probabilité succès |
| Insights automatiques | ✅ | Tendances, alertes, recommandations |
| Actions recommandées | ✅ | Upsell, relance leads, rétention |
| Données P&L réelles | ✅ | Calcul actualAmount depuis pnl_data (bug fix) |

**Fichiers créés :**
```
✅ /admin/objectives/[id]/page.tsx                     # Route détail
✅ /admin/objectives/[id]/ObjectiveDetailClient.tsx    # Client component
✅ /admin/objectives/components/detail/               # 9 composants (Chart, Gauge, Forecast, etc.)
✅ /admin/objectives/hooks/useObjectiveDetail.ts      # Hook avec données réelles P&L
✅ /admin/objectives/utils/                           # 6 utilitaires (forecast, monte carlo, etc.)
✅ /admin/objectives/budgets/                         # Module budgets
```

---

### Phase 2.6 : Objectifs Clients ✅ COMPLÈTE

**Objectif :** Ajouter la catégorie Clients au module Objectifs

#### Types d'objectifs Clients (14 types) ✅

| Sous-catégorie | Types | Description |
|----------------|-------|-------------|
| **Acquisition** | `new_clients_total`, `new_clients_segment`, `conversion_rate`, `cac` | ✅ Mesurer croissance base clients |
| **Rétention** | `churn_rate`, `retention_rate`, `active_clients`, `avg_tenure` | ✅ Mesurer fidélisation |
| **Valeur** | `arpu`, `ltv`, `ltv_cac_ratio`, `avg_basket` | ✅ Mesurer rentabilité client |
| **Engagement** | `active_ratio`, `upsell_rate` | ✅ Mesurer activité |

#### Implémenté ✅

| Tâche | État | Fichiers |
|-------|------|----------|
| Types dans `types.ts` | ✅ | 14 types + labels + descriptions + units |
| Catégorie 'clients' dans wizard | ✅ | CreateObjectiveWizard.tsx |
| `useClientMetrics.ts` | ✅ | Hook complet pour tous calculs |
| Calcul depuis table `clients` | ✅ | useObjectives.ts, useObjectiveDetail.ts |
| Calcul ARPU/LTV | ✅ | LTV = ARPU × tenure × 70% marge |
| Insights concentration | ✅ | generateClientInsights() |
| Actions rétention | ✅ | generateClientActions() |

**📄 Spécifications complètes :** [MODULE_OBJECTIVES.md - Section 3bis](/MODULE_OBJECTIVES.md)

---

### Phase 2.7 : Objectifs Abonnements 🚧 EN COURS

**Objectif :** Ajouter la catégorie Abonnements au module Objectifs avec métriques SaaS complètes

**Spécifications détaillées :** [MODULE_OBJECTIVES.md - Section 3ter](/MODULE_OBJECTIVES.md)

#### Types d'objectifs Abonnements (22 types)

| Sous-catégorie | Types | Description |
|----------------|-------|-------------|
| **Revenus Récurrents** | `mrr_total`, `arr_total`, `mrr_growth_pct`, `net_new_mrr` | Métriques de base MRR/ARR |
| **Churn & Rétention** | `subscription_churn_rate`, `mrr_churn`, `mrr_churn_pct`, `nrr`, `grr` | Perte et rétention revenus |
| **Expansion** | `expansion_mrr`, `contraction_mrr`, `expansion_rate`, `upgrades_count`, `downgrades_count` | Upsells et downgrades |
| **Acquisition** | `new_subscriptions`, `new_mrr`, `paid_conversion` | Nouveaux abonnements |
| **Métriques SaaS** | `arpu_subscribers`, `ltv_mrr`, `quick_ratio`, `payback_months`, `magic_number` | KPIs avancés |

#### Fonctionnalités spéciales

| Fonctionnalité | Description | Statut |
|----------------|-------------|--------|
| **Tracking upgrades/downgrades** | Suivi des changements de plan avec impact MRR | 📋 |
| **Prévisions MRR** | Projection multi-scénarios avec Monte Carlo | 📋 |
| **NRR/GRR** | Net & Gross Revenue Retention | 📋 |
| **Quick Ratio** | Indicateur croissance saine | 📋 |
| **Insights automatiques** | Alertes churn, opportunités expansion | 📋 |

#### Implémentation prévue

| Phase | Tâches | État |
|-------|--------|------|
| Phase 12 | Types dans `types.ts` + wizard | ✅ |
| Phase 13 | `useSubscriptionMetrics.ts` + calculs | ✅ |
| Phase 14 | Prévisions MRR + Monte Carlo | ⏳ |
| Phase 15 | Intégration `useObjectiveDetail.ts` | ✅ |
| Phase 16 | Tracking changements de plan | 📋 |

---

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

| Métrique | Phase 1 | Phase 2 (Actuel) | Cible Final |
|----------|---------|------------------|-------------|
| Score global | ✅ 6/10 | ✅ 7.5/10 | 8/10 |
| Modules connectés | ✅ 100% | ✅ 100% | 100% |
| Dashboard fonctionnel | ✅ | ✅ Enrichi | ✅ |
| Objectifs/Targets | ❌ | ✅ Module complet | ✅ |
| Alertes | ❌ | ✅ Module complet | ✅ |
| Forecasting | ❌ | ✅ MRR 3/6/12 mois | ✅ |
| Comparaisons YoY/MoM | ❌ | ✅ Dashboard | ✅ |
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
