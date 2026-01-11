# Module Objectifs - Spécifications Complètes

> Documentation technique et fonctionnelle du module Objectifs

**Dernière mise à jour :** 2026-01-11
**Statut :** En production - Catégorie Financier ✅ | Catégorie Clients 🚧

**Catégories :**
| Catégorie | Statut | Description |
|-----------|--------|-------------|
| **Financier** | ✅ Implémenté | CA, dépenses, profits, marges |
| **Clients** | 🚧 En cours | Acquisition, rétention, valeur client |
| **Abonnements** | 📋 Planifié | MRR, ARR, churn, ARPU |
| **Produits** | 📋 Planifié | Performance par produit |

---

## 1. Vue d'Ensemble

Le module Objectifs permet de :
- Définir des objectifs business (CA, dépenses, profits, clients, MRR...)
- Suivre la progression en temps réel
- Détecter les incohérences et proposer des corrections
- Générer des plans d'actions intelligents
- Visualiser les données avec graphiques avancés
- Exporter des rapports PDF

---

## 2. Décisions Techniques

| Élément | Choix | Raison |
|---------|-------|--------|
| **Librairie Charts** | Recharts | Léger, React-native, facile à customiser |
| **Export PDF** | jsPDF | Génération côté client, pas de serveur requis |
| **Simulations Monte Carlo** | 1000 itérations | Bon équilibre précision/performance |

---

## 3. Fonctionnalités - Catégorie Financier

### 3.1 Chiffre d'Affaires

**Segmentations disponibles :**
- Par produit (VPS Starter, VPS Pro, GPU Basic, etc.)
- Par catégorie de produit (VPS, GPU, Web, Stockage)
- Par client spécifique
- Par segment client (Particulier / Professionnel / Entreprise)

**Types de revenus :**
- Revenus récurrents (MRR) - Abonnements mensuels
- Revenus one-shot - Ventes ponctuelles, setup fees, migrations
- Upsells/Cross-sells - Revenus additionnels clients existants
- Renouvellements vs Nouveaux - Distinction acquisition/rétention

### 3.2 Comparaisons Temporelles

| Comparaison | Description | Utilité |
|-------------|-------------|---------|
| **MoM** | vs Mois précédent | Tendance court terme |
| **YoY** | vs Même mois N-1 | Éliminer saisonnalité |
| **vs Objectif** | Réel vs Target | Suivi performance |
| **vs Moyenne 3 mois** | Lissage court terme | Tendance récente |

### 3.3 Dépenses

**Catégorisation :**
- **Catégories fixes** : Salaires, Infrastructure, Marketing, Juridique, Télécoms, Formation, Locaux
- **Catégories personnalisées** : L'utilisateur peut créer ses propres catégories
- **Par fournisseur** : OVH, Hetzner, AWS, etc.
- **Type** : Fixes vs Variables

### 3.4 Indicateurs de Profitabilité

| Indicateur | Formule | Description |
|------------|---------|-------------|
| **Marge Brute** | CA - COGS | Revenus - Coûts directs |
| **Marge Opérationnelle** | Marge Brute - OpEx | Après coûts opérationnels |
| **Bénéfice Net** | Après toutes charges | Taxes, intérêts inclus |
| **EBITDA** | Résultat avant I/T/D/A | Métrique de cash-flow |

### 3.5 Rentabilité par Segment

Analyse de la rentabilité :
- Par produit → Quel produit génère le plus de marge ?
- Par client → Quels clients sont les plus profitables ?
- Par segment client → Particuliers vs Pros vs Entreprises
- Par canal acquisition → Google Ads vs Organique vs Referral

### 3.6 Ratios Financiers

| Ratio | Formule | Benchmark SaaS |
|-------|---------|----------------|
| **Marge brute %** | (CA - COGS) / CA × 100 | > 70% |
| **Marge nette %** | Bénéfice Net / CA × 100 | > 10% |
| **Ratio dépenses/CA** | Dépenses / CA × 100 | < 90% |
| **Rule of 40** | Croissance % + Marge % | > 40% |

---

## 3bis. Fonctionnalités - Catégorie Clients 🚧

> Objectifs liés à l'acquisition, la rétention et la valeur des clients

### 3bis.1 Acquisition de Clients

**Types d'objectifs :**

| Type | Code | Description | Source données |
|------|------|-------------|----------------|
| **Nouveaux clients (total)** | `new_clients_total` | Nombre total de nouveaux clients sur la période | `clients.created_at` |
| **Nouveaux par segment** | `new_clients_segment` | Nouveaux clients filtrés par segment | `clients.type` (individual/business/enterprise) |
| **Taux de conversion** | `conversion_rate` | % de leads convertis en clients | `clients.status` (lead → active) |
| **Coût d'acquisition** | `cac` | Coût moyen pour acquérir un client | Dépenses Marketing / Nouveaux clients |

**Segmentations disponibles :**
- Par type de client : Particulier / Professionnel / Entreprise
- Par source d'acquisition : Organique / Ads / Referral / Partenaire
- Par produit premier achat : VPS / GPU / Web / Stockage

### 3bis.2 Rétention de Clients

**Types d'objectifs :**

| Type | Code | Description | Formule |
|------|------|-------------|---------|
| **Taux de churn** | `churn_rate` | % clients perdus sur la période | Clients churned / Clients début période × 100 |
| **Taux de rétention** | `retention_rate` | % clients conservés | 100% - churn_rate |
| **Clients actifs** | `active_clients` | Nombre de clients avec statut actif | COUNT(clients WHERE status = 'active') |
| **Durée de vie moyenne** | `avg_tenure` | Ancienneté moyenne des clients | AVG(now - created_at) |

**Indicateurs de risque :**
- Clients sans transaction depuis X mois
- Clients avec tickets support non résolus
- Clients avec factures impayées

### 3bis.3 Valeur Client

**Types d'objectifs :**

| Type | Code | Description | Formule | Benchmark SaaS |
|------|------|-------------|---------|----------------|
| **ARPU** | `arpu` | Revenu moyen par client | CA Total / Clients actifs | Variable |
| **LTV** | `ltv` | Valeur vie client | ARPU × Durée moyenne × Marge | > 3× CAC |
| **Ratio LTV/CAC** | `ltv_cac_ratio` | Rentabilité acquisition | LTV / CAC | > 3 |
| **Panier moyen** | `avg_basket` | Montant moyen par transaction | CA / Nb transactions | Variable |

**Segmentation de la valeur :**
- Par segment client (Particulier/Pro/Entreprise)
- Par ancienneté (< 6 mois / 6-12 mois / > 12 mois)
- Par produit principal

### 3bis.4 Engagement Client

**Types d'objectifs :**

| Type | Code | Description |
|------|------|-------------|
| **Clients actifs vs inactifs** | `active_ratio` | % clients avec activité récente |
| **Fréquence d'achat** | `purchase_frequency` | Nb moyen d'achats par client/an |
| **Taux d'upsell** | `upsell_rate` | % clients ayant upgradé |
| **NPS** | `nps_score` | Net Promoter Score (si collecté) |

### 3bis.5 Concentration Client

**Analyse des risques :**

| Métrique | Description | Seuil d'alerte |
|----------|-------------|----------------|
| **Top 10% concentration** | % CA généré par top 10% clients | > 50% = risque |
| **Dépendance client unique** | % CA du plus gros client | > 20% = risque |
| **Diversification** | Nombre de clients représentant 80% du CA | < 5 = risque |

### 3bis.6 Insights Clients Automatiques

**Types d'insights générés :**

| Type | Exemple |
|------|---------|
| **Meilleur segment** | "Les clients Entreprise génèrent 3× plus de CA que Particuliers" |
| **Churn prédictif** | "5 clients n'ont pas commandé depuis 60+ jours" |
| **Opportunité upsell** | "12 clients sur VPS Starter pourraient passer Pro" |
| **Concentration** | "Attention : 3 clients représentent 45% du CA" |

### 3bis.7 Actions Recommandées (Clients)

| Situation | Actions générées |
|-----------|------------------|
| **Churn élevé** | Campagne de réengagement, Offres fidélité, Appels rétention |
| **Acquisition faible** | Augmenter budget Ads, Programme referral, Partenariats |
| **ARPU bas** | Campagne upsell, Bundles produits, Pricing review |
| **Concentration élevée** | Diversifier prospection, Réduire dépendance top clients |

### 3bis.8 Source de Données

**Table principale :** `clients`

```sql
-- Structure attendue
CREATE TABLE clients (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  type TEXT CHECK (type IN ('individual', 'business', 'enterprise')),
  status TEXT CHECK (status IN ('lead', 'active', 'inactive', 'churned')),
  source TEXT, -- 'organic', 'ads', 'referral', 'partner'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  churned_at TIMESTAMPTZ,
  -- Stats calculées (via trigger)
  total_revenue NUMERIC DEFAULT 0,
  transaction_count INTEGER DEFAULT 0,
  last_transaction_at TIMESTAMPTZ
);
```

**Calculs depuis P&L :**
- Revenus par client : `SUM(transactions.amount) GROUP BY client_id`
- Dernière transaction : `MAX(transactions.date) GROUP BY client_id`

---

## 4. Forecasting & Projections

### 4.1 Types de Projections

**Projection Linéaire :**
```
Projection = Actuel + (Rythme actuel × Jours restants)
```

**Projection Saisonnière :**
```
Projection = Actuel × (Pattern historique même période)
```

**Scénarios :**
- **Optimiste** : +20% vs projection linéaire
- **Expected** : Projection linéaire
- **Pessimiste** : -20% vs projection linéaire

**Monte Carlo :**
- 1000 simulations avec variables aléatoires
- Distribution des résultats possibles
- Intervalles de confiance (5%, 50%, 95%)

### 4.2 Paramètres de Simulation

```typescript
interface MonteCarloParams {
  baseValue: number;           // Valeur actuelle
  growthRate: number;          // Taux de croissance moyen
  volatility: number;          // Écart-type historique
  daysRemaining: number;       // Jours jusqu'à fin période
  simulations: number;         // 1000 par défaut
}
```

---

## 5. Visualisations

### 5.1 Graphiques

| Type | Usage | Librairie |
|------|-------|-----------|
| **Courbes évolution** | Progression jour/semaine | Recharts LineChart |
| **Barres comparatives** | Comparer périodes/segments | Recharts BarChart |
| **Jauge/Gauge** | Progression vers objectif | Recharts RadialBarChart |
| **Waterfall** | Décomposition CA → Profit | Custom component |

### 5.2 Dashboards

**Scorecard Mensuel :**
- KPIs principaux en un coup d'œil
- Tendances vs mois précédent
- Status de chaque objectif

**Heatmap Année :**
- Calendrier coloré par performance
- Clic sur un jour → modal avec détails
- Gradient vert (bon) → rouge (mauvais)

**Treemap Revenus :**
- Répartition CA par taille visuelle
- Drill-down par catégorie → produit

**Funnel Conversion :**
- Lead → Trial → Paid → Upsell
- Taux de conversion à chaque étape

### 5.3 Drill-down

Navigation hiérarchique :
```
Année → Trimestre → Mois → Semaine → Jour → Transactions → Clients
```

---

## 6. Auto-Insights & Alertes

### 6.1 Détection d'Anomalies

**Algorithme :**
```typescript
function detectAnomaly(values: number[], current: number): boolean {
  const mean = calculateMean(values);
  const stdDev = calculateStdDev(values);
  const zScore = (current - mean) / stdDev;
  return Math.abs(zScore) > 2; // Seuil à 2 écarts-types
}
```

**Types d'anomalies :**
- Chute soudaine du CA (> 2σ)
- Pic de dépenses inhabituel
- Churn anormalement élevé

### 6.2 Auto-Insights

| Type | Exemple |
|------|---------|
| **Top Performers** | "Meilleur produit ce mois : GPU Pro (+45%)" |
| **Flop** | "VPS Starter en baisse de 23% vs moyenne" |
| **Tendances** | "Le MRR croît de 8%/mois depuis 3 mois" |
| **Recommandations** | "Pour atteindre l'objectif, il faut +3 ventes/semaine" |

### 6.3 Alertes

| Type | Sévérité | Trigger |
|------|----------|---------|
| **Objectif à risque** | Warning | Progress < 80% du rythme attendu |
| **Seuil dépassé** | Critical | Dépenses > budget × 100% |
| **Anomalie** | Warning | Z-score > 2 |
| **Milestone** | Info | Objectif atteint à 100% |

---

## 7. Plans d'Actions

### 7.1 Génération Automatique

**Logique par type d'objectif :**

```typescript
function generateActions(objective: Objective): Action[] {
  if (objective.type === 'revenue_total' && objective.status === 'at_risk') {
    return [
      { type: 'lead_followup', title: 'Relancer les leads en attente' },
      { type: 'upsell', title: 'Proposer upgrades aux clients éligibles' },
      { type: 'retention', title: 'Contacter clients à risque de churn' },
    ];
  }
  // ... autres cas
}
```

### 7.2 Types d'Actions

| Type | Description | Données liées |
|------|-------------|---------------|
| **Lead Followup** | Relancer leads non convertis | Liste leads + potentiel € |
| **Upsell** | Proposer upgrade | Clients éligibles + montant |
| **Retention** | Réduire churn | Clients à risque |
| **Cost Reduction** | Réduire dépenses | Top postes à optimiser |

### 7.3 Tâches Persistées

```sql
CREATE TABLE objective_actions (
  id TEXT PRIMARY KEY,
  objective_id TEXT REFERENCES objectives(id),
  title TEXT NOT NULL,
  description TEXT,
  action_type TEXT,
  target_entity_type TEXT,
  target_entity_id TEXT,
  potential_impact NUMERIC,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 8. Budgets

### 8.1 Types de Budgets

- **Budget annuel global** : Enveloppe totale
- **Budgets par catégorie** : Marketing, Infrastructure, Salaires...
- **Budgets par département** (futur)

### 8.2 Suivi

**Indicateurs :**
- Budget alloué
- Consommé à date
- % consommation
- Projection fin d'année
- Alerte si dépassement prévu

### 8.3 Schéma SQL

```sql
CREATE TABLE budgets (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  year INTEGER NOT NULL,
  name TEXT NOT NULL,
  total_amount NUMERIC NOT NULL,
  category TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 9. Intégrations

### 9.1 Liens vers Autres Modules

| Module | Lien | Action |
|--------|------|--------|
| **P&L** | Voir transactions | Clic → ouvre P&L filtré |
| **Clients** | Voir fiche client | Clic → ouvre fiche client |
| **Factures** | Voir factures liées | (Futur) |

### 9.2 Export PDF

**Contenu du rapport :**
1. Header avec info objectif
2. Métriques clés
3. Graphique de progression
4. Liste des actions recommandées
5. Transactions récentes
6. Projections

**Librairie :** jsPDF avec html2canvas pour les graphiques

---

## 10. Architecture Technique

### 10.1 Routes

```
/admin/objectives/
├── page.tsx                      # Liste objectifs (existant)
├── [id]/
│   └── page.tsx                  # Page détail objectif
├── dashboard/
│   └── page.tsx                  # Dashboard global
├── budgets/
│   ├── page.tsx                  # Liste budgets
│   └── [id]/page.tsx             # Détail budget
└── reports/
    └── page.tsx                  # Rapports et exports
```

### 10.2 Composants

```
/admin/objectives/components/
├── detail/
│   ├── ObjectiveDetailHeader.tsx
│   ├── ObjectiveMetricsPanel.tsx
│   ├── ObjectiveChart.tsx
│   ├── ObjectiveWaterfall.tsx
│   ├── ObjectiveGauge.tsx
│   ├── ObjectiveForecast.tsx
│   ├── ObjectiveActions.tsx
│   ├── ObjectiveTransactions.tsx
│   └── ObjectiveInsights.tsx
├── dashboard/
│   ├── ObjectivesScorecard.tsx
│   ├── ObjectivesHeatmap.tsx
│   ├── ObjectivesTreemap.tsx
│   └── ObjectivesFunnel.tsx
├── budgets/
│   ├── BudgetCard.tsx
│   ├── BudgetProgress.tsx
│   └── CreateBudgetWizard.tsx
└── charts/
    └── (composants réutilisables)
```

### 10.3 Hooks

```
/admin/objectives/hooks/
├── useObjectiveDetail.ts
├── useObjectiveChart.ts
├── useObjectiveForecast.ts
├── useObjectiveActions.ts
├── useObjectiveInsights.ts
├── useBudgets.ts
└── useBudgetTracking.ts
```

### 10.4 Utilitaires

```
/admin/objectives/utils/
├── coherenceChecker.ts      # (existant)
├── forecastCalculator.ts
├── monteCarloSimulation.ts
├── anomalyDetector.ts
├── actionGenerator.ts
├── insightsGenerator.ts
└── reportExporter.ts
```

---

## 11. Plan d'Implémentation

### ✅ Catégorie Financier - COMPLÈTE

#### Phase 1 : Page Détail ✅
- [x] Route `/admin/objectives/[id]`
- [x] ObjectiveDetailClient.tsx
- [x] ObjectiveMetricsPanel.tsx
- [x] useObjectiveDetail.ts (avec données réelles P&L)
- [x] Navigation depuis ObjectiveCard

#### Phase 2 : Graphiques ✅
- [x] Recharts installé
- [x] ObjectiveChart.tsx (courbes évolution)
- [x] ObjectiveGauge.tsx (jauge progression)
- [x] ObjectiveForecast.tsx (projections)

#### Phase 3 : Forecasting ✅
- [x] forecastCalculator.ts (intégré dans useObjectiveDetail)
- [x] monteCarloSimulation.ts (1000 itérations)
- [x] ObjectiveForecast.tsx (scénarios + Monte Carlo)

#### Phase 4 : Actions & Insights ✅
- [x] actionGenerator.ts
- [x] insightsGenerator.ts
- [x] anomalyDetector.ts
- [x] ObjectiveActions.tsx
- [x] ObjectiveInsights.tsx

#### Phase 5 : Budgets ✅
- [x] Migration SQL (budgets)
- [x] Route `/admin/objectives/budgets`
- [x] useBudgets.ts

---

### 🚧 Catégorie Clients - EN COURS

#### Phase 8 : Types Clients (À faire)
- [ ] Ajouter types dans `types.ts` :
  - `new_clients_total`, `new_clients_segment`
  - `churn_rate`, `retention_rate`, `active_clients`
  - `arpu`, `ltv`, `cac`, `ltv_cac_ratio`
- [ ] Ajouter catégorie 'clients' dans le wizard
- [ ] Mapper vers source de données `clients` table

#### Phase 9 : Calculs Clients (À faire)
- [ ] `useClientMetrics.ts` - Hook pour métriques clients
- [ ] Calcul nouveaux clients par période
- [ ] Calcul churn rate
- [ ] Calcul ARPU depuis P&L + clients
- [ ] Calcul LTV (ARPU × durée moyenne × marge)

#### Phase 10 : Intégration Données (À faire)
- [ ] Modifier `useObjectiveDetail.ts` pour supporter catégorie clients
- [ ] Requêtes sur table `clients` pour les métriques
- [ ] Jointure P&L + Clients pour ARPU/LTV
- [ ] Graphique évolution clients

#### Phase 11 : Insights Clients (À faire)
- [ ] Alertes concentration client
- [ ] Détection clients à risque (inactifs)
- [ ] Suggestions upsell
- [ ] Actions rétention automatiques

---

### 📋 Phases Futures

#### Phase 12 : Dashboard Global
- [ ] Route `/admin/objectives/dashboard`
- [ ] ObjectivesScorecard.tsx
- [ ] ObjectivesHeatmap.tsx
- [ ] ObjectivesTreemap.tsx
- [ ] ObjectivesFunnel.tsx

#### Phase 13 : Catégorie Abonnements
- [ ] Types : MRR, ARR, churn_subscribers, expansion_revenue
- [ ] Intégration table `subscriptions`
- [ ] Métriques SaaS avancées

#### Phase 14 : Export & Reporting
- [ ] reportExporter.ts (PDF)
- [ ] Export CSV
- [ ] Rapports périodiques automatiques

---

## 12. Tests & Validation

### Tests Manuels
1. Créer objectif via wizard
2. Cliquer card → page détail
3. Vérifier métriques correctes
4. Tester graphiques interactifs
5. Créer budget
6. Vérifier alertes
7. Tester export PDF

### Tests Unitaires (Optionnel)
- forecastCalculator
- monteCarloSimulation
- anomalyDetector
- actionGenerator

---

## 13. Évolutions Futures

### Catégories à ajouter
- ~~**Clients** : Acquisition, rétention, segments~~ → 🚧 En cours (voir section 3bis)
- **Abonnements** : MRR, ARR, churn subscribers, expansion revenue, contraction
- **Produits** : Performance par produit, mix produit, marge par produit
- **Opérations** : Utilisation infrastructure, coût par client, uptime

### Fonctionnalités avancées
- Hiérarchie objectifs (Annuel → Trim → Mois avec cascade)
- Notifications email (alertes, rapports hebdo)
- Collaboration (assignation, commentaires, mentions)
- API publique pour intégrations externes
- Webhooks pour automatisations
- Comparaison inter-entreprises (benchmark)
- Import/Export objectifs (CSV, JSON)
- Templates d'objectifs prédéfinis

### Intégrations externes (long terme)
- Stripe/Paddle pour revenus réels
- Intercom/Zendesk pour satisfaction client
- Google Analytics pour acquisition
- Slack pour notifications

---

## 14. Résumé des Types d'Objectifs

### Par Catégorie

| Catégorie | Types disponibles | Statut |
|-----------|-------------------|--------|
| **Financier** | `revenue_total`, `revenue_product`, `revenue_category`, `revenue_client`, `revenue_segment`, `revenue_recurring`, `revenue_oneshot`, `expenses_total`, `expenses_category`, `gross_profit`, `net_profit`, `gross_margin`, `net_margin` | ✅ |
| **Clients** | `new_clients_total`, `new_clients_segment`, `conversion_rate`, `cac`, `churn_rate`, `retention_rate`, `active_clients`, `avg_tenure`, `arpu`, `ltv`, `ltv_cac_ratio`, `avg_basket`, `active_ratio`, `upsell_rate` | 🚧 |
| **Abonnements** | `mrr_total`, `arr_total`, `churn_subscribers`, `expansion_revenue`, `contraction_revenue`, `net_revenue_retention` | 📋 |
| **Produits** | `product_sales`, `product_margin`, `product_mix`, `best_seller` | 📋 |

---

*Ce document est la référence technique pour l'implémentation du module Objectifs.*
*Dernière mise à jour : 2026-01-11*
