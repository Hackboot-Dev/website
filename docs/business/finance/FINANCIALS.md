# Finances - VMCloud

> Dernière mise à jour : Décembre 2025
> Statut : Lancement commercial

---

## 1. Situation actuelle

### Phase
```
🚀 LANCEMENT - Décembre 2025
Pas encore de revenus récurrents
Infrastructure opérationnelle
Premiers clients en acquisition
```

### Revenus
| Métrique | Actuel | Target M+3 | Target M+6 |
|----------|--------|------------|------------|
| MRR | 0 € | 10 000 € | 50 000 € |
| ARR | 0 € | 120 000 € | 600 000 € |
| Clients payants | 0 | 50 | 200 |

### Composition du revenu (cible)
| Source | % du MRR (cible) |
|--------|------------------|
| GPU Cloud | 40% |
| VPS | 35% |
| Web hosting | 10% |
| Storage/CDN | 10% |
| PaaS | 5% |

**Questions à répondre :**
- [ ] Répartition réelle une fois les premiers clients acquis ?
- [ ] Quel produit génère le plus de revenus en premier ?
- [ ] Revenus one-time (setup fees, consulting) prévus ?

---

## 2. Structure de coûts

### Coûts fixes mensuels (réels)
| Catégorie | Montant | Notes |
|-----------|---------|-------|
| Infrastructure (DC, électricité) | 0 € | ✅ Inclus programme OVH 24 mois |
| Bande passante / Transit | ~3 000 € | Variable selon usage, à affiner |
| **RH - Contractors** | | |
| └─ SRE (Ingénieur plateforme) | ~15 400 € | 700€/jour TJM × 22 jours |
| └─ DRH (Directrice RH + compta) | ~7 800 € | 650€/jour × 3 jours/semaine |
| └─ Virtualization Engineer | ~3 000 € | 750€ TJM, ~4 jours/mois |
| └─ CRE | ~4 000 € | Estimation |
| **Sous-total RH** | **~30 200 €** | |
| Fondateurs (CEO, CTO, COO) | 0 € | Non payés phase lancement |
| Logiciels/Tools externes | ~500 € | Minimum (monitoring interne) |
| Assurances/Legal | ~500 € | Estonie, à souscrire RC Pro |
| Intérêts prêt SEB (différé) | ~1 130 € | 1.7% sur 800K€ |
| Marketing | À définir | Selon budget restant |
| Autres | ~500 € | Divers |
| **TOTAL BURN MENSUEL** | **~36 130 €** | |

### Coûts variables
| Catégorie | Coût unitaire | Volume actuel |
|-----------|---------------|---------------|
| Bandwidth excédentaire | ~1-2 €/TB | Faible |
| Payment fees (Stripe) | 1.4% + 0.25€ | 0 |
| Support externe | 0 € | Internalisé |

### Avantage compétitif coûts
```
✅ Pas de loyer DC (programme OVH 24 mois)
✅ Pas d'électricité (programme OVH)
✅ Fondateurs non payés (3 personnes)
✅ Monitoring développé en interne (pas de Datadog/etc.)
✅ Structure estonienne (fiscalité optimisée)

⚠️ RH représente ~85% du burn rate
```

**Questions à répondre :**
- [ ] Budget marketing mensuel cible ?
- [ ] Coûts légaux prévus (avocat, marque, assurances) ?
- [ ] Évolution prévue des TJM contractors ?
- [ ] Embauches prévues et impact sur le burn ?

---

## 3. Marges et profitabilité

### Marges cibles (à maturité)
| Marge | Cible | Benchmark cloud |
|-------|-------|-----------------|
| Marge brute | 60-70% | 60-80% |
| Marge opérationnelle | 20-30% | 15-25% |
| Marge nette | 15-25% | 10-20% |

### Par produit (estimations)
| Produit | Marge brute cible | Justification |
|---------|-------------------|---------------|
| VPS | 70% | Forte densité, peu de support |
| GPU | 50-60% | Coût hardware élevé mais pricing premium |
| Web hosting | 80% | Très haute densité |
| Storage | 60% | Dépend du type (SSD vs HDD) |

### Chemin vers la profitabilité
```
Burn mensuel actuel: ~36 130 €
Marge brute cible: 65%

Breakeven MRR = 36 130 € / 0.65 = ~55 600 € MRR
Breakeven ARR = ~667 000 €
```

- [x] Phase actuelle : Pré-revenu
- [ ] Breakeven opérationnel : ~54K€ MRR
- [ ] Profitabilité nette : ~80K€ MRR

**Questions à répondre :**
- [ ] Marge réelle par produit une fois en production ?
- [ ] Coûts cachés identifiés ?
- [ ] Plan si breakeven non atteint dans les 12 mois ?

---

## 4. Trésorerie

### Cash position (réel)
```
Cash disponible: ~1 500 000 €
Burn rate mensuel: ~36 130 € (dont 1 130€ intérêts prêt)
Runway: ~41 mois (3.4 ans)
```

### Composition du cash
| Source | Montant | Statut |
|--------|---------|--------|
| Prêt bancaire SEB | 800 000 € | ✅ Débloqué entièrement |
| Apport DVP Holding / Groupe | 700 000 € | ✅ Disponible |
| **Total cash reçu** | **1 500 000 €** | |
| Programme OVH | 1 500 000 € | Non-cash (infrastructure) |

### Projections trésorerie (sans revenus)
| Mois | Cash début | Revenus | Dépenses | Cash fin |
|------|------------|---------|----------|----------|
| M+1 | 1 500 000 € | 0 € | 35 000 € | 1 465 000 € |
| M+3 | 1 430 000 € | 5 000 € | 35 000 € | 1 400 000 € |
| M+6 | 1 295 000 € | 20 000 € | 35 000 € | 1 280 000 € |
| M+12 | 1 010 000 € | 50 000 € | 40 000 € | 1 020 000 € |
| M+24 | 620 000 € | 100 000 € | 60 000 € | 660 000 € |

**Questions à répondre :**
- [ ] Projections de revenus plus précises ?
- [ ] Scénario pessimiste (pas de revenus 12 mois) ?
- [ ] Seuil d'alerte cash (quand lever/réduire burn) ?
- [ ] Investissements CAPEX supplémentaires prévus ?

---

## 5. Budget et prévisions

### Budget 2026 (année 1 complète)
| Ligne | Budget | Notes |
|-------|--------|-------|
| Revenus | 500 000 € | Objectif ambitieux |
| COGS (coût des ventes) | 175 000 € | 35% des revenus |
| Marge brute | 325 000 € | 65% |
| Opex (RH, marketing, etc.) | 450 000 € | ~37K€/mois |
| EBITDA | -125 000 € | Perte acceptable (runway OK) |

### Projections 3 ans
| Année | ARR | Croissance | Nb clients | Marge brute | EBITDA |
|-------|-----|------------|------------|-------------|--------|
| 2025 | 50 000 € | - | 100 | 65% | -300K€ |
| 2026 | 600 000 € | +1100% | 800 | 68% | -100K€ |
| 2027 | 2 000 000 € | +233% | 2 500 | 70% | +200K€ |

**Questions à répondre :**
- [ ] Budget marketing détaillé ?
- [ ] Budget recrutement 2026 ?
- [ ] CAPEX supplémentaire prévu (nouveaux serveurs) ?
- [ ] Objectifs par trimestre (Q1, Q2, Q3, Q4) ?

---

## 6. Unit economics (cibles)

### Acquisition
```
CAC cible B2C: < 50 €
CAC cible B2B: < 500 €
CAC payback: < 6 mois
```

### Lifetime value (estimations)
```
Churn mensuel cible: 3%
Durée de vie moyenne: 33 mois

LTV B2C: 25€/mois × 33 mois × 70% marge = ~580 €
LTV B2B: 200€/mois × 33 mois × 70% marge = ~4 600 €
LTV Enterprise: 1000€/mois × 48 mois × 70% marge = ~33 600 €
```

### Par segment (cible)
| Segment | ARPU | CAC | LTV | LTV/CAC | Payback |
|---------|------|-----|-----|---------|---------|
| B2C | 25 € | 30 € | 580 € | 19x | 2 mois |
| B2B SMB | 200 € | 200 € | 4 600 € | 23x | 1 mois |
| B2B Enterprise | 1 000 € | 2 000 € | 33 600 € | 17x | 3 mois |

**Questions à répondre :**
- [ ] CAC réel une fois marketing lancé ?
- [ ] Churn réel observé ?
- [ ] Taux d'expansion (upsell) ?
- [ ] Coût de support par client ?

---

## 7. Comptabilité et reporting

### Organisation
- [x] Expert-comptable : DRH gère la compta (Estonie)
- [ ] DAF/CFO : Non (fondateur supervise)
- [x] Outils comptables : À préciser
- [x] Fréquence de clôture : Annuelle (obligation OÜ)

### Reporting
- [ ] Dashboard financier : À mettre en place
- [x] KPIs suivis : MRR, burn, runway
- [x] Fréquence de review : Hebdomadaire (fondateurs)

**Questions à répondre :**
- [ ] Quel outil comptable utilisé ? (Xolo, autre ?)
- [ ] Dashboard financier souhaité ? (Metabase, Sheets ?)
- [ ] Reporting mensuel formalisé ?
- [ ] Audit prévu ?

---

## 8. Obligations fiscales (Estonie)

### TVA
```
Régime TVA: Assujetti EU
Périodicité déclaration: Mensuelle
TVA applicable: 22% (Estonie) / Autoliquidation B2B EU
Seuil franchise: N/A (déjà assujetti)
```

### Impôt sur les sociétés
```
Régime fiscal: OÜ estonienne
Taux IS: 0% sur bénéfices réinvestis ✅
Taux IS sur dividendes: 20%
```

### Avantages fiscaux
```
✅ 0% d'impôt tant que bénéfices réinvestis
✅ Pas de charges sociales "employeur" (contractors)
✅ Gestion 100% digitale (e-Residency)
✅ Conformité EU automatique
```

**Questions à répondre :**
- [ ] Obligations déclaratives spécifiques ?
- [ ] CIR/CII applicable ? (probablement non en Estonie)
- [ ] Conventions fiscales avec France/autres pays ?

---

## 9. Assets et CAPEX

### Investissement initial (1.7M€ - dont 1.5M€ OVH)

**Programme OVH (1.5M€ non-cash)**
- Location datacenter : Inclus
- Électricité / cooling : Inclus
- Infrastructure de base : Inclus

**CAPEX payé (estimation ~200K€ + le reste en programme)**
| Catégorie | Détail | Montant |
|-----------|--------|---------|
| Serveurs CPU | 60× EPYC 7003, 256Go RAM, NVMe | 600 000 € |
| GPU T4 | 25× 16Go | 17 500 € |
| GPU RTX 4090 | 20× 24Go | 56 000 € |
| GPU A100 40Go | 30× | 180 000 € |
| GPU A100 80Go | 10× | 100 000 € |
| Châssis GPU 4U | 15× | 120 000 € |
| Réseau | Switchs 100-200 GbE, IB, NVSwitch | 200 000 € |
| Stockage | SAN, NAS, NVMe pool | 100 000 € |
| Baies/Racks | UPS, PDU, cooling | 80 000 € |
| Sécurité | Firewalls, routeurs, LB | 40 000 € |
| Licences | Proxmox, monitoring, etc. | 35 000 € |
| **TOTAL estimé** | | **~1 528 500 €** |

*Note: Répartition exacte entre OVH (non-cash) et achat direct à clarifier*

### Amortissement
```
Base amortissable: ~1 500 000 € (matériel)
Durée: 5 ans
Amortissement annuel: ~300 000 €
Amortissement mensuel: ~25 000 €
```

**Questions à répondre :**
- [ ] Répartition exacte OVH vs achat direct ?
- [ ] Plan de renouvellement hardware ?
- [ ] CAPEX prévu 2026 (expansion) ?
- [ ] Garanties et maintenance hardware ?

---

## 10. Risques financiers

### Risques identifiés
| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| Pas de revenus 12 mois | Faible | Moyen | Runway 42 mois, ajuster burn |
| Fin programme OVH (24 mois) | Certain | Fort | Anticiper coûts DC/électricité |
| Perte client majeur | Moyen | Moyen | Diversifier base clients |
| Hausse coûts énergie | Moyen | Moyen | Couvert par OVH 24 mois |
| Remboursement prêt | Certain | Moyen | Différé 1-2 ans, planifier |

### Plan de contingence
```
Si MRR < 20K€ à M+12:
→ Réduire contractors (SRE temps partiel ?)
→ Fondateurs restent non payés
→ Geler marketing
→ Burn réduit à ~15K€/mois
→ Runway étendu à 80+ mois
```

**Questions à répondre :**
- [ ] Autres risques identifiés ?
- [ ] Seuil d'alerte pour déclencher plan B ?
- [ ] Possibilité de renégocier prêt si besoin ?
