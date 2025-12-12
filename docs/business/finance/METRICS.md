# Métriques & KPIs - VMCloud

> Dernière mise à jour : Décembre 2025
> Statut : Phase de lancement

---

## 1. North Star Metric

### North Star
```
Métrique: MRR (Monthly Recurring Revenue)
Valeur actuelle: 0 €
Target M+6: 50 000 €
Target M+12: 100 000 €

Pourquoi: Le MRR reflète la santé du business récurrent
et la capacité à couvrir les coûts opérationnels.
Objectif breakeven: 50K€ MRR
```

---

## 2. Métriques SaaS/Cloud

### Revenue (Phase lancement)
| KPI | Actuel | Target M+3 | Target M+6 | Target M+12 |
|-----|--------|------------|------------|-------------|
| MRR | 0 € | 10 000 € | 50 000 € | 100 000 € |
| ARR | 0 € | 120 000 € | 600 000 € | 1 200 000 € |
| New MRR | 0 € | 5 000 € | 15 000 € | 10 000 € |
| Expansion MRR | 0 € | 500 € | 3 000 € | 5 000 € |
| Churned MRR | 0 € | 500 € | 2 000 € | 3 000 € |
| Net New MRR | 0 € | 5 000 € | 16 000 € | 12 000 € |

### Croissance (cibles)
| KPI | Target Phase 1 | Target Phase 2 | Benchmark |
|-----|----------------|----------------|-----------|
| MRR Growth (MoM) | +50% | +20% | 15-25% |
| ARR Growth (YoY) | - | +200% | 100%+ |

### Rétention (cibles)
| KPI | Target | Benchmark |
|-----|--------|-----------|
| Gross Revenue Retention | >90% | >90% |
| Net Revenue Retention | >100% | >100% |
| Logo Retention | >85% | >85% |
| Churn Rate (monthly) | <5% | <3% |

---

## 3. Métriques clients

### Acquisition
| KPI | Actuel | Target M+3 | Target M+6 |
|-----|--------|------------|------------|
| New customers/mois | 0 | 30 | 80 |
| Trial signups/mois | 0 | 100 | 300 |
| Trial-to-paid conversion | - | 30% | 35% |
| CAC | - | <50 € | <40 € |
| Payback period (mois) | - | <3 | <2 |

### Base clients
| KPI | Actuel | Target M+3 | Target M+6 | Target M+12 |
|-----|--------|------------|------------|-------------|
| Total customers | 0 | 80 | 250 | 600 |
| Active customers (30d) | 0 | 70 | 220 | 550 |
| Paying customers | 0 | 50 | 200 | 500 |
| Enterprise customers | 0 | 2 | 10 | 30 |

### Segmentation cible
| Segment | % clients | % MRR | ARPU |
|---------|-----------|-------|------|
| B2C (individuel) | 60% | 25% | 25 €/mois |
| B2B SMB | 30% | 40% | 150 €/mois |
| B2B Enterprise | 10% | 35% | 1 000 €/mois |

---

## 4. Métriques produit

### Capacité infrastructure
| Ressource | Capacité totale | Objectif utilisation |
|-----------|-----------------|---------------------|
| vCPU | ~3 840 (60 serveurs) | 70% |
| RAM | ~15 TB | 70% |
| GPU T4 | 25 unités | 80% |
| GPU 4090 | 20 unités | 80% |
| GPU A100 | 40 unités | 90% |
| Storage NVMe | ~100 TB | 60% |

### Usage (à tracker)
| Métrique | Actuel | Target M+6 |
|----------|--------|------------|
| VMs actives | 0 | 500 |
| GPUs loués | 0 | 50 |
| Storage utilisé (TB) | 0 | 20 |
| Bandwidth consommé (TB/mois) | 0 | 50 |

### Performance (SLA)
| Métrique | SLA | Target réel |
|----------|-----|-------------|
| Uptime | 99.9% | 99.9% |
| Avg response time API | <200ms | <100ms |
| Error rate | <0.1% | <0.05% |
| P99 latency | <500ms | <300ms |
| VM provisioning time | <2min | <1min |

---

## 5. Métriques support

| KPI | Target | SLA |
|-----|--------|-----|
| Tickets/mois | <100 (self-service first) | - |
| First response time | <2h | <4h |
| Resolution time | <24h | <48h |
| CSAT | >90% | >85% |
| FCR (First Contact Resolution) | >70% | - |

### Par priorité
| Priorité | Response time | Resolution time |
|----------|---------------|-----------------|
| P1 - Critical | <15min | <4h |
| P2 - High | <1h | <8h |
| P3 - Medium | <4h | <24h |
| P4 - Low | <24h | <72h |

---

## 6. Métriques financières

| KPI | Actuel | Target M+6 | Target M+12 | Benchmark |
|-----|--------|------------|-------------|-----------|
| Gross Margin | - | 65% | 70% | 60-80% |
| Net Margin | - | -20% | 10% | 10-20% |
| Burn Rate | 25K€/mois | 30K€/mois | 40K€/mois | - |
| Runway | 24 mois | 18 mois | 15 mois | >12m |
| LTV (B2C) | - | 500 € | 600 € | - |
| LTV (B2B) | - | 3 000 € | 5 000 € | - |
| LTV/CAC | - | >5x | >8x | >3x |
| ARPU | - | 80 € | 120 € | - |

---

## 7. Métriques marketing

| KPI | Actuel | Target M+3 | Target M+6 |
|-----|--------|------------|------------|
| Website visitors/mois | ~500 | 5 000 | 15 000 |
| Organic traffic | - | 60% | 70% |
| Paid traffic | - | 20% | 15% |
| Referral traffic | - | 20% | 15% |
| Lead conversion rate | - | 5% | 8% |
| Signups/mois | 0 | 100 | 300 |

### SEO (cibles)
| Keyword | Position cible |
|---------|----------------|
| "cloud gpu france" | Top 5 |
| "vps pas cher" | Top 10 |
| "hébergement gpu" | Top 3 |
| "cloud ia france" | Top 5 |

---

## 8. Dashboard et reporting

### Outils (à mettre en place)
| Outil | Usage | Statut |
|-------|-------|--------|
| Plausible/Umami | Analytics web | ✅ À installer |
| Grafana | Métriques infra | ✅ À configurer |
| Metabase/Superset | BI / Dashboard | 🔄 À étudier |
| Google Sheets | Suivi manuel | ✅ En place |

### Fréquence de review
```
Daily: Uptime, incidents, signups
Weekly: MRR, clients, usage
Monthly: Financials, churn, NPS
Quarterly: Strategy review, OKRs
```

### Rituels
- [x] Daily standup : Équipe core (15min)
- [ ] Weekly business review : À mettre en place
- [ ] Monthly all-hands : Quand équipe grandit
- [ ] Quarterly board report : N/A actuellement

---

## 9. Alertes et seuils

| Métrique | Seuil warning | Seuil critique | Action |
|----------|---------------|----------------|--------|
| Uptime | <99.9% | <99.5% | Incident review |
| Churn mensuel | >5% | >10% | Analyse urgente |
| Support backlog | >20 tickets | >50 tickets | Renfort support |
| Cash runway | <12 mois | <6 mois | Levée/réduction burn |
| GPU utilization | <30% | <20% | Revoir pricing/marketing |
| Trial conversion | <20% | <10% | Optimiser onboarding |

---

## 10. OKRs Q1 2026

### Objectif 1 : Atteindre le product-market fit
| Key Result | Target | Métrique |
|------------|--------|----------|
| KR1 | 50 clients payants | Paying customers |
| KR2 | 10K€ MRR | MRR |
| KR3 | NPS > 40 | NPS score |
| KR4 | Churn < 5% | Monthly churn |

### Objectif 2 : Construire la notoriété
| Key Result | Target | Métrique |
|------------|--------|----------|
| KR1 | 5 000 visiteurs/mois | Web traffic |
| KR2 | 300 signups trial | Trial signups |
| KR3 | 3 articles/semaine | Content published |
| KR4 | Top 10 sur 5 keywords | SEO rankings |

### Objectif 3 : Stabiliser les opérations
| Key Result | Target | Métrique |
|------------|--------|----------|
| KR1 | 99.9% uptime | Uptime |
| KR2 | <2h first response | Support SLA |
| KR3 | 0 incidents P1 | Incident count |
| KR4 | 100% automation deploy | Deployment |
