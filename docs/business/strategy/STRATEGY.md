# Stratégie 2025-2027 - VMCloud

> **Plan stratégique et feuille de route opérationnelle**
> Dernière mise à jour : Décembre 2025

---

## 1. Situation actuelle (As-Is)

### Phase de l'entreprise

```
┌─────────────────────────────────────────────────────────────────────┐
│                    🚀 PHASE : LANCEMENT                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Développement   : Depuis août 2025                                 │
│  Plateforme      : Opérationnelle, tous produits lancés            │
│  Infrastructure  : En place (programme OVH)                        │
│  Revenus         : Pré-revenu (premiers clients en acquisition)    │
│  Équipe          : 6 personnes (3 fondateurs + 3 contractors)      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Métriques actuelles (Décembre 2025)

| Métrique | Valeur actuelle | Commentaire |
|----------|-----------------|-------------|
| **MRR** | 0 € | Phase d'acquisition des premiers clients |
| **ARR** | 0 € | - |
| **Clients payants** | 0 | Lancement en cours |
| **Clients actifs** | 0 | - |
| **Mix B2C/B2B** | Cible : 40%/60% | B2B premium prioritaire |
| **Churn** | N/A | Pas encore de données |
| **NPS** | N/A | À mesurer dès premiers clients |

### Position financière

| Indicateur | Valeur |
|------------|--------|
| Trésorerie disponible | ~1 500 000 € |
| Programme OVH (non-cash) | 1 500 000 € (24 mois) |
| Burn rate mensuel | ~36 130 € |
| Runway | ~41 mois (jusqu'à mi-2029) |
| Breakeven MRR | ~55 600 € |

### Catalogue produit (live)

VMCloud propose **7 catégories** et **36 offres** :

| Catégorie | Nb offres | Gamme de prix | Statut |
|-----------|-----------|---------------|--------|
| **VPS** | 8 | 29€ - 3 199€/mois | ✅ Live |
| **GPU Cloud** | 8 | 469€ - 18 559€/mois | ✅ Live |
| **Web Hosting** | 4 | 19€ - 199€/mois | ✅ Live |
| **PaaS** | 4 | 59€ - 1 199€/mois | ✅ Live |
| **Load Balancer** | 4 | 29€ - 999€/mois | ✅ Live |
| **Storage** | 4 | 0.10€ - 0.40€/GB/mois | ✅ Live |
| **CDN** | 4 | 19€ - 2 499€/mois | ✅ Live |

**Gamme de prix totale :** 19€/mois → 18 559€/mois

### Équipe actuelle

| Rôle | Personne | Statut | Coût |
|------|----------|--------|------|
| CEO / Fondateur | Toi | Actif, non payé | 0 € |
| CTO | Co-fondateur | Actif, non payé | 0 € |
| COO | Co-fondateur | Actif, non payé | 0 € |
| SRE | Contractor | Full-time | ~15 400 €/mois |
| DRH + Compta | Contractor | Part-time | ~7 800 €/mois |
| CRE | Contractor | Variable | ~4 000 €/mois |
| Virtualization Engineer | Contractor | ~4j/mois | ~3 000 €/mois |

---

## 2. Objectifs 12 mois (Décembre 2025 → Décembre 2026)

### Objectif principal

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   OBJECTIF 2026 : Atteindre le Product-Market Fit                  │
│                                                                     │
│   Preuve : 50K€ MRR avec churn < 5% et NPS > 40                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Objectifs financiers

| Métrique | Actuel | Q1 2026 | Q2 2026 | Q3 2026 | Q4 2026 |
|----------|--------|---------|---------|---------|---------|
| MRR | 0 € | 10 000 € | 25 000 € | 40 000 € | 55 000 € |
| ARR | 0 € | 120 000 € | 300 000 € | 480 000 € | 660 000 € |
| Clients payants | 0 | 50 | 150 | 300 | 500 |
| ARPU | - | 200 € | 167 € | 133 € | 110 € |

### Objectifs clients

| Segment | Q4 2026 cible | % MRR cible |
|---------|---------------|-------------|
| B2C (devs indépendants) | 250 | 20% |
| B2B SMB | 200 | 45% |
| B2B Enterprise | 50 | 35% |

### Objectifs produit

| Objectif | Deadline | Priorité |
|----------|----------|----------|
| Plateforme 100% stable (0 incident P1) | Q1 2026 | 🔴 Critique |
| Self-service complet (0 intervention manuelle) | Q2 2026 | 🔴 Critique |
| API v1 complète et documentée | Q2 2026 | 🟡 Haute |
| Terraform provider officiel | Q3 2026 | 🟡 Haute |
| Console/Dashboard v2 (UX améliorée) | Q3 2026 | 🟢 Moyenne |
| Billing automatisé avec alertes | Q1 2026 | 🔴 Critique |

### Objectifs équipe

| Rôle | Timing | Type | Budget |
|------|--------|------|--------|
| 1er commercial (Account Executive) | Q2 2026 | Contractor | ~5 000 €/mois |
| Support Engineer #1 | Q2 2026 | Contractor | ~4 000 €/mois |
| Content Writer / SEO | Q1 2026 | Contractor / Freelance | ~2 000 €/mois |

### Objectifs marketing

| KPI | Q4 2026 cible |
|-----|---------------|
| Visiteurs site/mois | 15 000 |
| Signups trial/mois | 300 |
| Conversion trial → paid | 35% |
| Articles blog publiés | 100+ |
| Mots-clés Top 10 | 20 |

---

## 3. Objectifs 24 mois (Fin 2027)

### Contexte critique

```
⚠️  ALERTE FIN 2027
│
├── Fin programme OVH (1.5M€ non-cash)
│   → Coûts DC/électricité à payer (~15-25K€/mois)
│
├── Fin différé prêt SEB Bank
│   → Remboursement ~10-12K€/mois pendant 5 ans
│
└── Impact sur burn rate
    → De ~36K€/mois à ~65-80K€/mois
    → Breakeven MRR passe à ~100-120K€
```

### Objectif principal 2027

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   OBJECTIF 2027 : Breakeven AVANT fin programme OVH                │
│                                                                     │
│   Minimum : 55K€ MRR (breakeven actuel)                            │
│   Cible   : 100K€ MRR (breakeven post-OVH)                         │
│   Stretch : 150K€ MRR (marge de sécurité)                          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Vision 2027

| Métrique | Cible 2027 |
|----------|------------|
| MRR | 150 000 € |
| ARR | 1 800 000 € |
| Clients payants | 1 500 |
| Équipe | 12-15 personnes |
| Marge brute | 70% |
| EBITDA | Positif |

### Jalons géographiques

| Phase | Timing | Marché |
|-------|--------|--------|
| Phase 1 | 2025-2026 | Estonie + Baltics |
| Phase 2 | 2026-2027 | Europe (hors France) |
| Phase 3 | 2027-2028 | Europe complète |
| Phase 4 | 2028+ | Expansion mondiale |

**Note :** La France n'est pas prioritaire (marché OVH saturé). Clients mondiaux acceptés si pays autorisé.

---

## 4. Stratégie de croissance

### 4.1 Positionnement prix

```
                    PRIX
                      │
         AWS/GCP ─────┼───── Très cher, très flexible
                      │
                      │
         VMCloud ─────┼───── Prix intermédiaire, écosystème complet
                      │
                      │
         OVH/Hetzner ─┼───── Pas cher, limité
                      │
```

**Stratégie :**
- Plus cher que OVH/Hostinger/Hetzner
- Beaucoup moins cher que AWS/GCP/Azure
- Valeur = **Écosystème complet** (comme les hyperscalers) à prix accessible
- Justification du premium = **Service client expert + Flexibilité**

### 4.2 Canaux d'acquisition

#### Canaux prioritaires (investissement fort)

| Canal | Budget | Pourquoi | KPIs |
|-------|--------|----------|------|
| **Content Marketing** | 40% | SEO long terme, autorité, lead gen | Trafic organique, leads |
| **Paid Ads** | 30% | Résultats rapides, scalable | CAC, ROAS |
| **Referral Program** | 15% | Viral, low cost, qualité | Referrals, conversion |
| **Partenariats** | 15% | Accès marché estonien/EU | Partners signés, leads |

#### Content Marketing (stratégie détaillée)

```
STRATÉGIE CONTENT
│
├── 📝 BLOG
│   ├── Tutoriels techniques (VPS, GPU, K8s...)
│   ├── Comparatifs (VMCloud vs OVH, vs AWS...)
│   ├── Guides d'optimisation
│   ├── Use cases clients
│   └── Actualités cloud/tech
│
├── 📊 SEO
│   ├── Ciblage mots-clés longue traîne
│   ├── Pages produits optimisées
│   ├── Landing pages par use case
│   └── Structure technique (Core Web Vitals)
│
├── 📚 DOCUMENTATION
│   ├── Docs techniques complètes
│   ├── API reference
│   ├── Quickstarts par produit
│   └── FAQ exhaustive
│
└── 🎯 VOLUME CIBLE
    └── 3+ articles/semaine → 150+ articles/an
```

**Objectif SEO :**

| Mot-clé cible | Position cible | Timing |
|---------------|----------------|--------|
| "cloud gpu europe" | Top 5 | Q2 2026 |
| "vps estonie" | Top 3 | Q1 2026 |
| "alternative ovh" | Top 10 | Q3 2026 |
| "gpu cloud pas cher" | Top 5 | Q2 2026 |
| "kubernetes managed europe" | Top 10 | Q4 2026 |

#### Paid Ads (stratégie)

| Plateforme | Budget % | Cible |
|------------|----------|-------|
| Google Ads | 60% | Intent keywords, remarketing |
| LinkedIn Ads | 30% | B2B decision makers |
| Twitter/X Ads | 10% | Dev community (limité) |

**Note :** Pas de Facebook/Instagram (pas notre cible).

#### Referral Program

```
PROGRAMME REFERRAL
│
├── Récompense parrain
│   └── X% de réduction ou crédit
│
├── Récompense filleul
│   └── Y€ de crédit à l'inscription
│
└── Mécanique
    └── Code unique, tracking automatique, paiement automatique
```

**Questions à définir :**
- [ ] Montant exact des réductions ?
- [ ] Crédit ou réduction récurrente ?
- [ ] Plafond par parrain ?

#### Partenariats (stratégie)

| Type | Cibles | Approche |
|------|--------|----------|
| **Agences estoniennes** | Agences web, dev, marketing | Offre revendeur, commission |
| **Intégrateurs** | Consultants cloud, DevOps | Programme partenaire technique |
| **OVH** | Via le programme startup | Events, co-marketing |
| **Startups estoniennes** | e-Residency community | Offre startup, networking |

### Canaux secondaires (investissement limité)

| Canal | Approche | Pourquoi limité |
|-------|----------|-----------------|
| **Events/Meetups** | Présence, pas organisation | Premium, via invitations OVH |
| **Cold outreach** | Très peu, ciblé enterprise | Pas aligné avec image premium |
| **Discord/Twitter** | Veille, pas community management | Pas assez premium |

**Philosophie :** On ne démarche pas. On attire.

### 4.3 Rétention

| Stratégie | Action |
|-----------|--------|
| **Onboarding** | Tutoriels personnalisés, welcome email sequence |
| **Support expert** | Devs qui répondent, pas des scripts |
| **Monitoring proactif** | Alertes avant que le client ne voie le problème |
| **Feedback loop** | NPS mensuel, interviews clients |
| **Loyalty program** | Réductions ancienneté (à définir) |

### 4.4 Expansion (upsell/cross-sell)

| Produit initial | Upsell naturel |
|-----------------|----------------|
| VPS Starter | VPS Performance → VPS Business |
| GPU Starter | GPU Pro → Multi-GPU |
| Web Hosting | VPS (quand ils grandissent) |
| VPS seul | + Storage + CDN + Load Balancer |

---

## 5. Stratégie produit

### 5.1 Roadmap produit

```
2025 Q4          2026 Q1          2026 Q2          2026 Q3          2026 Q4          2027
    │                │                │                │                │                │
    ├── VPS ✅       ├── Billing v2   ├── API v1       ├── Terraform    ├── Multi-région ├── PaaS v2
    ├── GPU ✅       ├── Dashboard v2 ├── CLI          ├── K8s managed  ├── Backup auto  ├── Marketplace
    ├── Web ✅       ├── Support chat ├── Monitoring   ├── Object stor. ├── DRaaS        │
    ├── PaaS ✅      │                │                │                │                │
    ├── Storage ✅   │                │                │                │                │
    ├── CDN ✅       │                │                │                │                │
    ├── LB ✅        │                │                │                │                │
```

### 5.2 Évolution vers écosystème complet

**Vision : Devenir comme GCP/AWS mais accessible**

| Aujourd'hui (IaaS) | Demain (IaaS+PaaS) | Après-demain (Plateforme) |
|--------------------|--------------------|-----------------------------|
| VPS, GPU, Storage | + Kubernetes managé | + Marketplace d'apps |
| Compute de base | + Object Storage (S3-like) | + Serverless functions |
| CDN, Load Balancer | + Database managée | + ML/AI services |
| PaaS containers | + CI/CD intégré | + Low-code tools |

### 5.3 Différenciation produit

| Feature | VMCloud | OVH | AWS |
|---------|---------|-----|-----|
| Prix | Mid-premium | Low | High |
| Flexibilité | Haute | Basse | Très haute |
| Complexité | Moyenne | Basse | Très haute |
| Support | Expert humain | Bot + ticket | Bot + $$$$ |
| Écosystème | En construction | Limité | Complet |
| API/Terraform | En cours | Partiel | Complet |

---

## 6. OKRs

### OKRs Q1 2026

**Objective 1 : Valider le product-market fit**

| Key Result | Target | Métrique |
|------------|--------|----------|
| KR1 | 50 clients payants | Paying customers |
| KR2 | 10 000 € MRR | MRR |
| KR3 | NPS > 40 | NPS score |
| KR4 | Churn < 5% mensuel | Churn rate |

**Objective 2 : Construire la notoriété**

| Key Result | Target | Métrique |
|------------|--------|----------|
| KR1 | 5 000 visiteurs/mois | Web traffic |
| KR2 | 100 signups trial | Trial signups |
| KR3 | 50 articles blog publiés | Content published |
| KR4 | Top 10 sur 5 keywords | SEO rankings |

**Objective 3 : Stabiliser les opérations**

| Key Result | Target | Métrique |
|------------|--------|----------|
| KR1 | 99.9% uptime | Uptime |
| KR2 | < 2h first response | Support SLA |
| KR3 | 0 incidents P1 | Incident count |
| KR4 | 100% automation deploy | Deployment |

### OKRs Q2-Q4 2026

**À définir en fonction des résultats Q1.**

Axes probables :
- Scale acquisition (volume)
- Améliorer conversion
- Lancer nouvelles features
- Expansion géographique

---

## 7. Risques stratégiques

### Top 5 risques identifiés

```
MATRICE DES RISQUES
                        │
    IMPACT ÉLEVÉ        │    ┌─────────────┐
                        │    │ 1. OVH      │
                        │    │    coupe    │
                        │    │    programme│
                        │    └─────────────┘
                        │         ┌─────────────┐
                        │         │ 2. Concurrent│
                        │         │    prix +   │
                        │         │    avantages│
                        │         └─────────────┘
                        │              ┌─────────────┐
                        │              │ 3. Recruter │
                        │              │    experts  │
                        │              └─────────────┘
    IMPACT MOYEN        │
                        │    ┌─────────────┐
                        │    │ 4. Scale    │
                        │    │    plateforme│
                        │    └─────────────┘
                        │         ┌─────────────┐
                        │         │ 5. Key      │
                        │         │    person   │
                        │         └─────────────┘
                        │
    ────────────────────┼────────────────────────────
                   PROBA FAIBLE           PROBA ÉLEVÉE
```

### Risque 1 : OVH coupe le programme plus tôt

| Aspect | Détail |
|--------|--------|
| **Probabilité** | Faible (contrat signé) |
| **Impact** | CRITIQUE (1.5M€ non-cash = DC + électricité) |
| **Conséquence** | Burn passe de 36K€ à 60-80K€/mois |
| **Mitigation** | Atteindre breakeven AVANT fin programme |
| **Plan B** | Négocier extension / Trouver autre DC / Réduire infra |

### Risque 2 : Concurrent casse les prix + offre nos avantages

| Aspect | Détail |
|--------|--------|
| **Probabilité** | Moyenne |
| **Impact** | Fort |
| **Qui** | Scaleway, Infomaniak, nouveau entrant |
| **Conséquence** | Perte de différenciation, guerre des prix |
| **Mitigation** | Construire le moat service (pas copiable facilement) |
| **Plan B** | Spécialisation niche (GPU, AI, gaming) |

### Risque 3 : Difficulté à recruter des experts

| Aspect | Détail |
|--------|--------|
| **Probabilité** | Moyenne-haute |
| **Impact** | Fort |
| **Conséquence** | Support pas "expert" = perte de différenciation |
| **Mitigation** | Freelances EU, remote-first, TJM compétitifs |
| **Plan B** | Former en interne, documentation exhaustive |

### Risque 4 : Plateforme pas scalable

| Aspect | Détail |
|--------|--------|
| **Probabilité** | Faible (travail en cours depuis août) |
| **Impact** | Moyen-fort |
| **Conséquence** | Incidents, clients perdus, réputation |
| **Mitigation** | Architecture scalable dès le départ, tests de charge |
| **Plan B** | Refactoring prioritaire si problèmes |

### Risque 5 : Key person risk (fondateur unique)

| Aspect | Détail |
|--------|--------|
| **Probabilité** | Très faible |
| **Impact** | CRITIQUE |
| **Conséquence** | Entreprise sans direction |
| **Mitigation** | Documenter tout, responsabiliser COO/CTO |
| **Plan B** | Assurance homme-clé, plan de succession |

### Structure actionnariat et risque associé

```
STRUCTURE ACTUELLE
│
Fondateur (toi) ─────────────────────────────────────
        │                                            │
        ▼                                            │
   DVP Holding (100%)                                │ Key person risk
        │                                            │ = 1 personne
        ▼                                            │
   VMCloud Group OÜ (100%)                           │
        │                                            │
        ├── VMCloud OÜ                               │
        └── Hackboot                                 │
                                                ─────┘

COO : Pas de parts (pour l'instant)
CTO : Pas de parts (pour l'instant)
```

**Risque :** Si le fondateur est indisponible, COO/CTO n'ont pas d'incentive actionnarial.

**Mitigation future :** Plan d'intéressement (ESOP) à définir quand plus de visibilité.

---

## 8. Décisions stratégiques

### Décisions prises

| Décision | Choix | Rationale |
|----------|-------|-----------|
| **Focus produit** | VPS + GPU (les deux) | Marché large, complémentaires |
| **Levée de fonds** | Bootstrap pour l'instant | Runway de 41 mois, pas urgent |
| **Employés vs Contractors** | 100% contractors | Flexibilité, coûts variables |
| **IaaS vs PaaS** | Les deux, IaaS d'abord | IaaS = fondation, PaaS = différenciation |
| **Géographie** | Estonie first, puis EU | Marché local + expansion |
| **Cold outreach** | Non | Pas aligné image premium |
| **Communautés (Discord/Twitter)** | Non prioritaire | Pas assez premium |

### Décisions en suspens

| Décision | Options | Deadline | Owner |
|----------|---------|----------|-------|
| Parts COO/CTO | ESOP ? Quel % ? | 2026 | Fondateur |
| Budget marketing exact | X K€/mois ? | Q1 2026 | Fondateur + équipe |
| Passage CDI | Quand ? Qui en premier ? | 2026-2027 | DRH |
| Nouvelle levée | Besoin ? Timing ? Montant ? | 2027 | Fondateur |
| Expansion France | Ouvrir ou ignorer ? | 2027 | Fondateur |

### Questions stratégiques ouvertes

1. **Faut-il lever avant fin programme OVH (2027) ?**
   - Pro : Sécurité, accélération
   - Con : Dilution, pression externe

2. **Spécialisation vs généraliste ?**
   - Rester généraliste (VPS + GPU + tout) ?
   - Ou se spécialiser (GPU/AI only) ?

3. **Quand commencer à payer les fondateurs ?**
   - Breakeven atteint ?
   - Premier M€ ARR ?
   - Levée de fonds ?

4. **Ouvrir un bureau physique (Estonie) ?**
   - Pour l'instant : full remote
   - Plus tard : présence locale pour partenariats ?

---

## 9. Plan de contingence

### Scénario pessimiste : MRR < 20K€ à M+12

```
PLAN DE RÉDUCTION DU BURN
│
├── Phase 1 : Optimisation (burn → 25K€/mois)
│   ├── SRE passe en temps partiel
│   ├── Geler recrutement
│   └── Marketing organique only
│
├── Phase 2 : Survie (burn → 15K€/mois)
│   ├── Réduire contractors au minimum
│   ├── Fondateurs assument plus de rôles
│   └── Infrastructure réduite
│
└── Phase 3 : Pivot ou arrêt
    ├── Pivot vers niche rentable (GPU only ?)
    ├── Chercher acquéreur
    └── Fermeture ordonnée
```

### Scénario fin programme OVH sans breakeven

| Action | Timing | Impact |
|--------|--------|--------|
| Négocier extension OVH | 6 mois avant fin | Gagner du temps |
| Chercher DC alternatif | 6 mois avant fin | Réduire coût |
| Réduire infrastructure | 3 mois avant fin | Adapter à la demande réelle |
| Levée d'urgence | Si cash < 6 mois | Dilution mais survie |

### Triggers d'alerte

| Indicateur | Seuil warning | Seuil critique | Action |
|------------|---------------|----------------|--------|
| MRR vs target | < 70% | < 50% | Review stratégie |
| Churn | > 5% | > 10% | Analyse urgente |
| Cash runway | < 18 mois | < 12 mois | Réduire burn ou lever |
| NPS | < 30 | < 20 | Focus produit/support |
| Uptime | < 99.9% | < 99.5% | Incident review |

---

## 10. Gouvernance et rituels

### Rituels de l'équipe

| Rituel | Fréquence | Participants | Focus |
|--------|-----------|--------------|-------|
| Daily standup | Quotidien (15min) | Équipe core | Blocages, priorités |
| Weekly business review | Hebdo (1h) | Fondateurs | KPIs, décisions |
| Monthly all-hands | Mensuel | Toute l'équipe | Vision, résultats |
| Quarterly strategy | Trimestriel | Fondateurs | OKRs, ajustements |

### Reporting

| Type | Fréquence | Contenu |
|------|-----------|---------|
| Dashboard opérationnel | Temps réel | Uptime, incidents, usage |
| Rapport financier | Mensuel | MRR, burn, runway, P&L |
| Rapport OKRs | Trimestriel | Progrès vs objectifs |
| Strategy review | Semestriel | Ajustement plan stratégique |

### Responsabilités

| Domaine | Owner |
|---------|-------|
| Vision & stratégie | CEO (Fondateur) |
| Produit & tech | CTO |
| Opérations & RH | COO |
| Finance & legal | CEO + DRH |
| Marketing | CEO (à recruter) |
| Sales | CEO (à recruter) |
| Support | COO + équipe |

---

## 11. Résumé exécutif

```
┌─────────────────────────────────────────────────────────────────────┐
│                    STRATÉGIE VMCLOUD 2025-2027                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  SITUATION      Lancement, pré-revenu, 41 mois de runway           │
│                                                                     │
│  OBJECTIF 2026  Product-market fit : 55K€ MRR, 500 clients         │
│                                                                     │
│  OBJECTIF 2027  Breakeven AVANT fin programme OVH                  │
│                                                                     │
│  CROISSANCE     Content marketing + Paid + Referral + Partenariats │
│                                                                     │
│  POSITIONNEMENT Premium accessible : plus cher que OVH, moins      │
│                 cher que AWS, avec écosystème complet + service    │
│                 expert                                              │
│                                                                     │
│  RISQUE #1      Fin programme OVH (2027) → burn × 2                │
│                                                                     │
│  DÉCISION CLÉ   Bootstrap pour l'instant, 100% contractors,        │
│                 Estonie first                                       │
│                                                                     │
│  PROCHAIN JALON Q1 2026 : 50 clients, 10K€ MRR, 0 incident P1     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Questions à répondre (pour compléter)

### Marketing
- [ ] Budget marketing mensuel exact ?
- [ ] Montants du programme referral ?
- [ ] Qui écrit le contenu (interne/externe) ?

### Produit
- [ ] Roadmap détaillée Q1-Q2 2026 ?
- [ ] Priorité entre features ?

### Équipe
- [ ] Timeline recrutement précis ?
- [ ] Plan d'intéressement COO/CTO ?

### Finance
- [ ] Objectifs trimestriels détaillés ?
- [ ] Seuil pour commencer à payer les fondateurs ?

---

*Document stratégique confidentiel. Dernière mise à jour : Décembre 2025.*
