# Module Objectifs - Spécifications Complètes

> Documentation technique et fonctionnelle du module Objectifs

**Dernière mise à jour :** 2026-01-10
**Statut :** Approuvé - Prêt pour implémentation
**Catégorie actuelle :** Financier (autres catégories à venir)

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

### Phase 1 : Page Détail (2-3 jours)
- [ ] Route `/admin/objectives/[id]`
- [ ] ObjectiveDetailClient.tsx
- [ ] ObjectiveDetailHeader.tsx
- [ ] ObjectiveMetricsPanel.tsx
- [ ] useObjectiveDetail.ts
- [ ] Navigation depuis ObjectiveCard

### Phase 2 : Graphiques (2-3 jours)
- [ ] Installer Recharts
- [ ] ObjectiveChart.tsx (courbes)
- [ ] ObjectiveGauge.tsx (jauge)
- [ ] ObjectiveWaterfall.tsx
- [ ] useObjectiveChart.ts

### Phase 3 : Forecasting (2 jours)
- [ ] forecastCalculator.ts
- [ ] monteCarloSimulation.ts
- [ ] ObjectiveForecast.tsx
- [ ] useObjectiveForecast.ts

### Phase 4 : Actions & Insights (2-3 jours)
- [ ] Migration SQL (objective_actions, objective_insights)
- [ ] actionGenerator.ts
- [ ] insightsGenerator.ts
- [ ] anomalyDetector.ts
- [ ] ObjectiveActions.tsx
- [ ] ObjectiveInsights.tsx

### Phase 5 : Budgets (2-3 jours)
- [ ] Migration SQL (budgets)
- [ ] Route `/admin/objectives/budgets`
- [ ] CreateBudgetWizard.tsx
- [ ] BudgetCard.tsx, BudgetProgress.tsx
- [ ] useBudgets.ts

### Phase 6 : Dashboard (2-3 jours)
- [ ] Route `/admin/objectives/dashboard`
- [ ] ObjectivesScorecard.tsx
- [ ] ObjectivesHeatmap.tsx
- [ ] ObjectivesTreemap.tsx
- [ ] ObjectivesFunnel.tsx

### Phase 7 : Intégrations (1-2 jours)
- [ ] Liens P&L
- [ ] Liens Clients
- [ ] reportExporter.ts (PDF)
- [ ] Bouton export

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
- **Clients** : Acquisition, rétention, segments
- **Abonnements** : MRR, ARR, churn, ARPU
- **Produits** : Performance par produit

### Fonctionnalités avancées
- Hiérarchie objectifs (Annuel → Trim → Mois)
- Notifications email
- Collaboration (assignation, commentaires)
- API publique
- Webhooks

---

*Ce document est la référence technique pour l'implémentation du module Objectifs.*
