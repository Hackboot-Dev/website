# Financement - VMCloud

> Dernière mise à jour : Décembre 2025

---

## 1. Historique de financement

### Résumé
```
Total levé: 3 000 000 €
- Cash: 1 500 000 €
- Non-cash (infrastructure): 1 500 000 €
```

### Sources de financement
| Source | Type | Montant | Nature | Date | Statut |
|--------|------|---------|--------|------|--------|
| OVH | Programme Startup | 1 500 000 € | Infrastructure (non-cash) | 2025 | ✅ Actif |
| SEB Bank | Prêt bancaire | 800 000 € | Cash | 2025 | ✅ Débloqué |
| DVP Holding | Apport groupe | 700 000 € | Cash | 2025 | ✅ Versé |
| **TOTAL** | | **3 000 000 €** | | | |

---

## 2. Détail du prêt bancaire

### Informations prêt SEB Bank
```
Banque: SEB Bank (Estonie)
Montant: 800 000 €
Durée: 7 ans
Taux d'intérêt: 1.7%
Différé de remboursement: 2 ans ✅ Confirmé
Intérêts pendant différé: Payés (non capitalisés)
Statut: ✅ Entièrement débloqué
```

### Échéancier de remboursement
| Période | Statut | Montant mensuel estimé |
|---------|--------|------------------------|
| Années 1-2 | Différé | ~1 130 €/mois (intérêts seuls) |
| Années 3-7 | Remboursement | ~14 500 €/mois (capital + intérêts) |

### Calcul des intérêts
```
Capital: 800 000 €
Taux: 1.7%
Intérêts annuels: ~13 600 €
Intérêts mensuels (différé): ~1 130 €
Remboursement sur 5 ans: ~14 500 €/mois
Total à rembourser: ~895 200 €
```

### Garanties fournies à SEB Bank
```
1. Garantie publique EIS/KredEx: 50%
   → Possibilité d'augmenter en échange de marge réduite
   → Négociation initiale: banque demandait 6.5-7% de marge

2. Sûreté hard-asset: Matériel (serveurs, GPU)
   → Garantie physique sur les équipements

3. Mutualisation OVH: Programme Startup
   → Infrastructure couverte par le partenariat

4. Discipline de reporting:
   → MRR mensuel
   → Churn rate
   → Occupation GPU
   → Respect SLA

5. Support groupe: DVP Holding
   → Holding bénéficiaire soutient le lancement
```

**Questions à répondre :**
- [x] Différé 2 ans confirmé ? ✅ Oui
- [x] Intérêts pendant différé : payés ou capitalisés ? ✅ Payés
- [ ] Possibilité de remboursement anticipé sans pénalité ?
- [x] Garanties données à la banque ? ✅ Documentées ci-dessus
- [ ] Covenants bancaires exacts (seuils MRR, churn max, etc.) ?

---

## 3. Détail du programme OVH

### Programme OVH Startup
```
Montant: 1 500 000 € (valeur infrastructure)
Durée: 24 mois
Type: Non-cash (services et infrastructure)
Statut: ✅ Actif
```

### Ce qui est inclus
| Élément | Inclus | Notes |
|---------|--------|-------|
| Location datacenter | ✅ Oui | Espace rack, sécurité |
| Électricité | ✅ Oui | Consommation serveurs |
| Cooling | ✅ Oui | Climatisation |
| Connectivité de base | ✅ Oui | Uplink internet |
| Bande passante | ⚠️ Partiel | Excédent à payer |
| Support OVH | ✅ Oui | Support technique |

### Conditions et engagements
```
Exclusivité: ✅ Oui
- VMCloud doit utiliser l'infrastructure OVH
- Pas de multi-cloud avec concurrent direct

Partage de ressources:
- OVH peut envoyer des clients
- VMCloud partage ses ressources serveurs
- Modèle de revenue share à clarifier

Fin du programme:
- Date de fin: Décembre 2027 (24 mois)
- Après: Contrat commercial standard OVH
```

### Coûts post-programme (estimation)
| Poste | Coût mensuel estimé |
|-------|---------------------|
| Colocation (racks) | ~5 000 - 10 000 € |
| Électricité | ~8 000 - 15 000 € |
| Bande passante | ~3 000 - 5 000 € |
| **Total estimé** | **~16 000 - 30 000 €/mois** |

⚠️ **Attention** : À M+24, le burn rate augmentera significativement !

**Questions à répondre :**
- [ ] Conditions exactes du revenue share avec OVH ?
- [ ] Possibilité de renouveler le programme ?
- [ ] Tarifs post-programme négociés ?
- [ ] Clause de sortie si besoin de changer de DC ?

---

## 4. Structure du groupe

### Organigramme capitalistique
```
DVP Holding (holding mère)
    │
    └── 100% ── VMCloud Group OÜ
                    │
                    ├── 100% ── VMCloud OÜ (cloud infrastructure)
                    │           ← Cette entité
                    │
                    └── 100% ── Hackboot (gaming - entreprise sœur)
```

### Table de capitalisation - VMCloud OÜ
| Actionnaire | % capital | % droits de vote | Type |
|-------------|-----------|------------------|------|
| VMCloud Group OÜ | 100% | 100% | Ordinaires |

### Table de capitalisation - VMCloud Group OÜ
| Actionnaire | % capital | % droits de vote | Type |
|-------------|-----------|------------------|------|
| DVP Holding | 100% | 100% | Ordinaires |

### Table de capitalisation - DVP Holding
| Actionnaire | % capital | % droits de vote | Type |
|-------------|-----------|------------------|------|
| Fondateur (CEO) | 100% | 100% | Ordinaires |

### Structure complète de détention
```
Fondateur (100%)
    │
    └── DVP Holding (100%)
            │
            └── VMCloud Group OÜ (100%)
                    │
                    ├── VMCloud OÜ (100%)
                    │   └── Cloud infrastructure
                    │
                    └── Hackboot (100%)
                        └── Gaming (entreprise sœur)
```

**Questions à répondre :**
- [x] DVP Holding détenu par qui ? ✅ Fondateur 100%
- [ ] Autres entités dans DVP Holding ?
- [ ] Structure fiscale optimisée entre entités ?

---

## 5. Utilisation des fonds

### Répartition initiale (3M€)
| Poste | Montant | % | Statut |
|-------|---------|---|--------|
| Infrastructure OVH (non-cash) | 1 500 000 € | 50% | ✅ Utilisé |
| CAPEX Matériel (GPU, serveurs) | ~500 000 € | 17% | ✅ Dépensé |
| Trésorerie opérationnelle | ~1 000 000 € | 33% | 🔄 En cours |
| **TOTAL** | **3 000 000 €** | 100% | |

### Détail CAPEX payé (~500K€ estimation)
*Le reste du matériel étant potentiellement inclus dans le programme OVH*

| Catégorie | Montant estimé |
|-----------|----------------|
| GPU (T4, 4090, A100) | ~350 000 € |
| Réseau complémentaire | ~50 000 € |
| Stockage complémentaire | ~50 000 € |
| Licences et outils | ~35 000 € |
| Divers | ~15 000 € |
| **Total** | **~500 000 €** |

**Questions à répondre :**
- [ ] Répartition exacte OVH vs achat propre ?
- [ ] Le matériel OVH reste propriété OVH ou VMCloud ?
- [ ] Inventaire précis des assets VMCloud ?

---

## 6. BSPCE / Stock options

### Situation actuelle
```
Pool total: Non défini
Attribués: 0%
Disponibles: N/A

Note: Structure estonienne (OÜ)
Les BSPCE sont un dispositif français.
Alternatives estoniennes à étudier.
```

### Alternatives en Estonie
| Option | Description | Complexité |
|--------|-------------|------------|
| Stock options classiques | Attribution d'actions | Moyenne |
| Phantom shares | Bonus indexé sur valeur | Simple |
| Warrants | Droits d'achat futurs | Moyenne |

**Questions à répondre :**
- [ ] Plan d'intéressement prévu pour l'équipe ?
- [ ] Pool réservé pour futurs recrutements clés ?
- [ ] Avocat fiscal consulté sur les options ?

---

## 7. Besoins de financement futurs

### Besoin actuel
```
Besoin immédiat: ❌ Non
Runway actuel: ~42 mois
Situation: Confortable
```

### Scénarios futurs
| Scénario | Timing | Montant | Déclencheur |
|----------|--------|---------|-------------|
| Pas de levée | - | 0 € | Croissance organique suffit |
| Extension runway | M+18 | 500K-1M€ | Si burn > prévu |
| Série A croissance | M+24 | 3-5M€ | Traction forte, scale infra |
| Acquisition | M+36+ | 10M€+ | Opportunité stratégique |

### Si levée nécessaire
```
Type envisagé: Revenue-based financing ou Série A
Valorisation cible: 10-15M€ (si ARR ~1M€)
Dilution acceptable: 15-25%
Investisseurs cibles: VC européens cloud/infra, OVH, corporate
```

**Questions à répondre :**
- [ ] OVH intéressé par investissement equity ?
- [ ] Autres VCs cloud en contact ?
- [ ] Préférence dette vs equity ?

---

## 8. Gouvernance

### Direction VMCloud OÜ
| Rôle | Nom | Représente |
|------|-----|------------|
| Director / CEO | [Fondateur] | VMCloud Group |
| CTO | [Co-fondateur] | - |
| COO | [Co-fondateur] | - |

### Board
```
Pas de board formel actuellement.
Structure holding simple.
Décisions: Fondateur + consultation co-fondateurs
```

### Droits et engagements
| Engagement | Vis-à-vis | Détail |
|------------|-----------|--------|
| Exclusivité infra | OVH | 24 mois |
| Remboursement | SEB Bank | 7 ans, 1.7% |
| Reporting | DVP Holding | Interne |

**Questions à répondre :**
- [ ] Mise en place d'un board si levée future ?
- [ ] Advisory board envisagé ?
- [ ] Pacte d'associés entre entités du groupe ?

---

## 9. Particularités structure estonienne

### Avantages OÜ (Osaühing)
```
✅ Imposition différée: 0% sur bénéfices réinvestis
✅ e-Residency: Gestion 100% digitale depuis n'importe où
✅ Flexibilité: Contrats de service faciles
✅ Conformité EU: RGPD, TVA EU automatiques
✅ Réputation: Pays tech-friendly, transparent
```

### Implications
```
- Pas de CDI français → Contractors
- Comptabilité simplifiée
- Rapport annuel obligatoire (6 mois après clôture)
- Banque: Options EU (Wise, Revolut, LHV, SEB)
```

### Risques structure
| Risque | Mitigation |
|--------|------------|
| Méconnaissance droit estonien | Avocat local |
| Perception clients FR | Communication transparente |
| Évolution fiscalité | Veille réglementaire |

---

## 10. Vision long terme et exit

### Scénarios de sortie
| Scénario | Probabilité | Horizon | Valorisation cible |
|----------|-------------|---------|-------------------|
| Rester indépendant | Haute | Indéfini | N/A |
| Acquisition par OVH/Scaleway | Moyenne | 5-7 ans | 20-50M€ |
| Acquisition par US cloud | Faible | 7-10 ans | 50-100M€ |
| IPO | Très faible | 10+ ans | 100M€+ |

### Objectif principal
```
Construire un acteur cloud européen rentable et indépendant.
Exit opportuniste si offre stratégique intéressante.
Pas de pression investisseur (structure holding).
```

**Questions à répondre :**
- [ ] Ambition personnelle du fondateur ?
- [ ] Horizon de temps envisagé ?
- [ ] Ouvert à discussions M&A ?

---

## 11. Risques liés au financement

### Risques identifiés
| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| Non-renouvellement OVH | Faible | Fort | Anticiper coûts DC, négocier tôt |
| Défaut prêt SEB | Très faible | Critique | Runway OK, monitoring cash |
| Besoin cash imprévu | Faible | Moyen | Trésorerie 1.5M€ |
| Exclusivité OVH bloquante | Faible | Moyen | Clause de sortie ? |

### Échéances critiques
| Date | Événement | Action requise |
|------|-----------|----------------|
| 2025-2027 | Période de différé | Paiement intérêts seuls ~1 130€/mois |
| Fin 2027 | Fin différé prêt (2 ans) | Début remboursements ~14 500€/mois |
| Fin 2027 | Fin programme OVH | Négocier contrat commercial (+16-30K€/mois) |
| 2032 | Fin prêt SEB | Dernière échéance |

### ⚠️ Impact fin 2027 (double effet)
```
Situation actuelle (2025-2027):
- Intérêts prêt: ~1 130 €/mois
- Infrastructure OVH: 0 €
- Total charge financière: ~1 130 €/mois

Après fin 2027:
- Remboursement prêt: ~14 500 €/mois (+13 370€)
- Infrastructure post-OVH: ~16 000-30 000 €/mois
- Total charge financière: ~30 500-44 500 €/mois

→ Augmentation burn: +30K-45K€/mois
→ Nouveau burn total: ~65K-80K€/mois
→ Breakeven requis avant fin 2027 !
```

**Questions à répondre :**
- [ ] Plan de sortie du programme OVH ?
- [ ] Alternatives DC si besoin ?
- [ ] Refinancement du prêt possible ?
