# Stratégie Pricing - VMCloud

> Version 1.0 - Décembre 2024
> Document stratégique définissant la politique tarifaire de VMCloud

---

## Executive Summary

VMCloud adopte une **stratégie de pricing bi-modale** :
- **Tiers d'entrée (Starter/Pro)** : Prix compétitifs alignés sur le marché européen pour l'acquisition
- **Tiers premium (Business/Enterprise)** : Prix premium justifiés par le support, le SLA et les services inclus

**Changement majeur Q1 2025** : Réduction de 50-66% sur les offres VPS d'entrée de gamme pour améliorer la compétitivité et l'acquisition client.

---

## 1. Philosophie de Pricing

### Vision stratégique

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    MODÈLE DE PRICING VMCLOUD                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   PREMIUM                    ┌──────────────────┐                       │
│   (Value-based)              │   ENTERPRISE     │  Support dédié        │
│                              │   B2B / Grands   │  SLA 99.9%            │
│                              │   comptes        │  Devis personnalisés  │
│                              └────────┬─────────┘                       │
│                                       │                                 │
│   MID-MARKET                 ┌────────┴─────────┐                       │
│   (Cost-plus)                │   BUSINESS       │  Support prioritaire  │
│                              │   PME / Scale-up │  SLA 99.9%            │
│                              └────────┬─────────┘                       │
│                                       │                                 │
│   ENTRY                      ┌────────┴─────────┐                       │
│   (Competitor-based)         │   STARTER        │  Self-service         │
│                              │   Dev / Freelance│  SLA 99.9%            │
│                              └──────────────────┘                       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Principes directeurs

| Principe | Description | Application |
|----------|-------------|-------------|
| **Compétitivité Entry-Level** | Prix alignés ou inférieurs au marché | VPS Nano/Starter proches OVH/Hetzner |
| **Value Premium** | Prix justifiés par la valeur ajoutée | Support humain, SLA garanti, monitoring |
| **Transparence** | Prix publics, pas de frais cachés | Tout inclus dans le prix affiché |
| **Simplicité** | Grille lisible, pas de configs complexes | 8 offres VPS, 8 offres GPU |
| **Flexibilité** | Options mensuel/annuel/horaire | Adaptation aux besoins clients |

### Approche par segment

| Segment | Approche pricing | Objectif | Marge cible |
|---------|------------------|----------|-------------|
| Starter | Competitor-based | Acquisition, volume | 60-70% |
| Pro | Cost-plus | Rentabilité équilibrée | 75-80% |
| Business | Value-based | Fidélisation, upsell | 80-85% |
| Enterprise | Value-based | Relation long terme | 85-90% |
| Premium | Custom | Grands comptes | Négociable |

---

## 2. Modèles de Facturation

### Par catégorie de produit

| Produit | Modèle principal | Modèles disponibles | Engagement min |
|---------|------------------|---------------------|----------------|
| **VPS** | Mensuel | Horaire, Mensuel, Annuel | Aucun |
| **GPU** | Horaire | Horaire, Mensuel, Annuel | Aucun |
| **Web Hosting** | Mensuel | Mensuel, Annuel | Aucun |
| **PaaS** | Mensuel | Horaire, Mensuel, Annuel | Aucun |
| **Load Balancer** | Mensuel | Horaire, Mensuel, Annuel | Aucun |
| **Storage** | À la consommation | Par GB/mois | 100 GB min |
| **CDN** | Forfait + overage | Mensuel, Annuel | Aucun |
| **Bandwidth** | Inclus | Overage par GB | Selon offre |

### Conversion horaire ↔ mensuel

```
Tarif horaire = Prix mensuel ÷ 720 heures × 1.15 (premium flexibilité)
Tarif mensuel = Tarif de base
Tarif annuel = Prix mensuel × 12 × 0.83 (remise 17%)
```

### Moyens de paiement

| Méthode | Disponibilité | Frais | Notes |
|---------|---------------|-------|-------|
| **Carte bancaire** | ✅ Immédiat | 0% | Visa, Mastercard, Amex |
| **Virement SEPA** | ✅ 24-48h | 0% | Pour prépayé ou mensuel |
| **PayPal** | ✅ Immédiat | 0% | Absorbé par VMCloud |
| **Prélèvement SEPA** | ✅ Mensuel | 0% | Sur validation compte |
| **Crypto** | 🔜 Q3 2025 | 0% | BTC, ETH, USDC planifiés |
| **Facture entreprise** | ✅ B2B | 0% | Net 30 sur approbation crédit |

### Cycles de facturation

```
┌─────────────────────────────────────────────────────────────────┐
│                    CYCLES DE FACTURATION                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  HORAIRE        MENSUEL           ANNUEL                        │
│  ────────       ────────          ──────                        │
│  • Pay-as-go    • Facturation     • Prépayé 12 mois             │
│  • Min 1h       • Le 1er du mois  • -17% sur total              │
│  • Idéal tests  • Standard        • Idéal entreprises           │
│  • GPU/dev      • Carte requise   • Engagement ferme            │
│                                                                 │
│  Prélèvement    Facture à J+1     Facture immédiate             │
│  post-conso     du mois suivant   à la commande                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Grille Tarifaire - NOUVELLE (Q1 2025)

### 3.1 VPS - Compute

**Changements majeurs** : Réduction significative des prix d'entrée de gamme pour compétitivité.

| Tier | Offre | Config | Prix horaire | Prix mensuel | Prix annuel (-17%) | SLA |
|------|-------|--------|--------------|--------------|-------------------|-----|
| **Starter** | VPS-NANO | 1 vCPU / 2 GB / 40 GB NVMe | 0.014€ | **9.99€** | 99€ | 99.9% |
| **Starter** | VPS-STARTER | 2 vCPU / 4 GB / 80 GB NVMe | 0.028€ | **19.99€** | 199€ | 99.9% |
| **Pro** | VPS-PERFORMANCE | 4 vCPU / 8 GB / 160 GB NVMe | 0.068€ | **49€** | 489€ | 99.9% |
| **Business** | VPS-BUSINESS | 6 vCPU / 16 GB / 320 GB NVMe | 0.21€ | **149€** | 1,485€ | 99.9% |
| **Enterprise** | VPS-ENTERPRISE | 8 vCPU / 32 GB / 640 GB NVMe | 0.49€ | **349€** | 3,475€ | 99.9% |
| **Enterprise** | VPS-ELITE | 16 vCPU / 64 GB / 1.28 TB NVMe | 0.97€ | **699€** | 6,965€ | 99.9% |
| **Premium** | VPS-TITANIUM | 32 vCPU / 128 GB / 2.56 TB NVMe | 2.08€ | **1,499€** | 14,930€ | 99.9% |
| **Premium** | VPS-QUANTUM | 48 vCPU / 256 GB / 5 TB NVMe | 4.17€ | **2,999€** | 29,870€ | 99.9% |

**Inclus dans tous les VPS :**
- Bande passante généreuse (5 TB à illimitée selon offre)
- IPv4 dédiée (1 à 5 selon offre)
- Monitoring de base
- Backups quotidiens (7 jours)
- Support ticket standard

### 3.2 GPU - AI/ML/Rendering

**Prix maintenus** : Bien positionnés par rapport au marché.

| Tier | Offre | GPU | VRAM | Config | Prix/h | Prix/mois | Prix/an (-17%) |
|------|-------|-----|------|--------|--------|-----------|----------------|
| **Starter** | GPU-STARTER | 1× T4 | 16 GB | 8 vCPU / 32 GB | 0.85€ | 469€ | 4,673€ |
| **Pro** | GPU-PRO | 1× RTX 4090 | 24 GB | 16 vCPU / 64 GB | 1.50€ | 829€ | 8,257€ |
| **Business** | GPU-BUSINESS | 2× RTX 4090 | 48 GB | 32 vCPU / 128 GB | 2.90€ | 1,599€ | 15,926€ |
| **Enterprise** | GPU-ENTERPRISE | 1× A100 40GB | 40 GB | 48 vCPU / 192 GB | 4.20€ | 2,319€ | 23,097€ |
| **Premium** | GPU-QUANTUM | 2× A100 40GB | 80 GB | 64 vCPU / 256 GB | 8.40€ | 4,639€ | 46,192€ |
| **Premium** | GPU-TITAN | 1× A100 80GB | 80 GB | 96 vCPU / 384 GB | 5.50€ | 3,035€ | 30,228€ |
| **Premium** | GPU-CLUSTER | 4× A100 40GB | 160 GB | 128 vCPU / 512 GB | 16.80€ | 9,279€ | 92,399€ |
| **Premium** | GPU-SUPERCOMPUTE | 8× A100 80GB | 640 GB | 256 vCPU / 1 TB | 33.60€ | 18,559€ | 184,828€ |

**Inclus dans toutes les instances GPU :**
- CUDA/cuDNN préinstallés
- NVMe haute performance
- Interconnect NVLink (multi-GPU)
- Support technique GPU
- Accès API monitoring

### 3.3 Web Hosting

| Tier | Offre | Sites | Storage | BW | Prix/mois | Prix/an (-17%) |
|------|-------|-------|---------|-----|-----------|----------------|
| **Starter** | WEB-STARTER | 1 | 50 GB | 1 TB | 19€ | 189€ |
| **Business** | WEB-BUSINESS | 10 | 200 GB | 5 TB | 49€ | 488€ |
| **Pro** | WEB-PRO | 50 | 500 GB | 20 TB | 99€ | 986€ |
| **Enterprise** | WEB-ENTERPRISE | ∞ | 2 TB | ∞ | 199€ | 1,982€ |

### 3.4 PaaS - Containers

| Tier | Offre | Containers | RAM/unit | Storage | Prix/mois | Prix/an (-17%) |
|------|-------|------------|----------|---------|-----------|----------------|
| **Starter** | PAAS-CONTAINER | 1 | 2 GB | 20 GB | 59€ | 588€ |
| **Business** | PAAS-BUSINESS | 5 | 4 GB | 100 GB | 239€ | 2,380€ |
| **Pro** | PAAS-SCALE | 20 | 8 GB | 500 GB | 719€ | 7,161€ |
| **Enterprise** | PAAS-KUBERNETES | Cluster K8s | Config | 2 TB | 1,199€ | 11,942€ |

### 3.5 Load Balancer

| Tier | Offre | Backends | Req/sec | Prix/mois | Prix/an (-17%) |
|------|-------|----------|---------|-----------|----------------|
| **Starter** | LB-STARTER | 5 | 10K | 29€ | 289€ |
| **Business** | LB-BUSINESS | 20 | 50K | 99€ | 986€ |
| **Enterprise** | LB-ENTERPRISE | 100 | 200K | 299€ | 2,978€ |
| **Premium** | LB-GLOBAL | ∞ | 1M+ | 999€ | 9,950€ |

### 3.6 Storage

| Tier | Type | IOPS/TB | Throughput | Prix/GB/mois |
|------|------|---------|------------|--------------|
| **Starter** | SSD SATA | 10K | 500 MB/s | 0.10€ |
| **Pro** | NVMe PCIe 3.0 | 50K | 2 GB/s | 0.15€ |
| **Business** | NVMe PCIe 4.0 | 200K | 7 GB/s | 0.25€ |
| **Premium** | NVMe RAID 10 | 500K+ | 14 GB/s | 0.40€ |

**Exemples de facturation Storage :**
- 500 GB NVMe PCIe 3.0 = 500 × 0.15€ = **75€/mois**
- 2 TB NVMe PCIe 4.0 = 2000 × 0.25€ = **500€/mois**
- 10 TB NVMe RAID 10 = 10000 × 0.40€ = **4,000€/mois**

### 3.7 CDN

| Tier | PoPs | Trafic inclus | Prix/mois | Trafic extra/GB |
|------|------|---------------|-----------|-----------------|
| **Starter** | 10 EU | 1 TB | 19€ | 0.08€ |
| **Pro** | 25 EU/US | 10 TB | 99€ | 0.05€ |
| **Business** | 50 Mondial | 100 TB | 499€ | 0.02€ |
| **Premium** | 150+ Mondial | 1 PB | 2,499€ | 0.01€ |

---

## 4. Comparaison avec l'Ancienne Grille

### VPS - Évolution des prix

| Offre | Ancien prix | Nouveau prix | Évolution | Raison |
|-------|-------------|--------------|-----------|--------|
| VPS-NANO | 29€ | **9.99€** | -66% | Alignement marché, acquisition |
| VPS-STARTER | 49€ | **19.99€** | -59% | Alignement marché, acquisition |
| VPS-PERFORMANCE | 99€ | **49€** | -50% | Compétitivité mid-market |
| VPS-BUSINESS | 199€ | **149€** | -25% | Légère réduction, value justifiée |
| VPS-ENTERPRISE | 399€ | **349€** | -12% | Premium maintenu, support inclus |
| VPS-ELITE | 799€ | **699€** | -12% | Premium maintenu |
| VPS-TITANIUM | 1,599€ | **1,499€** | -6% | Premium maintenu |
| VPS-QUANTUM | 3,199€ | **2,999€** | -6% | Premium maintenu |

### Impact attendu

| Métrique | Avant | Après (projection) |
|----------|-------|-------------------|
| Taux de conversion landing page | ~2% | 5-8% (×2.5-4) |
| Panier moyen nouveaux clients | 150€ | 80€ |
| Volume nouveaux clients/mois | X | 3X |
| Revenus entry-level | Y | 1.5Y |
| Marge entry-level | 90-95% | 70-80% |
| Marge globale | 90% | 82% |

---

## 5. Benchmark Concurrentiel

### VPS - Comparaison config équivalente

#### Entrée de gamme (2 vCPU / 4 GB)

| Provider | Offre | Prix/mois | Différence vs VMCloud |
|----------|-------|-----------|----------------------|
| **VMCloud** | VPS-STARTER | **19.99€** | - |
| Hetzner | CX22 | 4.85€ | -76% |
| OVH | Essential | 7.50€ | -62% |
| Scaleway | DEV1-M | 11.99€ | -40% |
| DigitalOcean | Basic 4GB | 24$ (~22€) | +10% |
| AWS | t3.medium | ~35€ | +75% |

#### Mid-range (4 vCPU / 8 GB)

| Provider | Offre | Prix/mois | Différence vs VMCloud |
|----------|-------|-----------|----------------------|
| **VMCloud** | VPS-PERFORMANCE | **49€** | - |
| Hetzner | CX32 | 9.29€ | -81% |
| OVH | Value | 14.00€ | -71% |
| Scaleway | DEV1-L | 23.99€ | -51% |
| DigitalOcean | Basic 8GB | 48$ (~44€) | -10% |
| AWS | t3.large | ~70€ | +43% |

#### Business (8 vCPU / 32 GB)

| Provider | Offre | Prix/mois | Différence vs VMCloud |
|----------|-------|-----------|----------------------|
| **VMCloud** | VPS-ENTERPRISE | **349€** | - |
| Hetzner | CX51 | 33€ | -91% |
| OVH | Performance | 60€ | -83% |
| Scaleway | GP1-S | 74€ | -79% |
| DigitalOcean | Premium 32GB | 168$ (~155€) | -56% |
| AWS | m5.2xlarge | ~280€ | -20% |

### GPU - Comparaison config équivalente

#### A100 40GB

| Provider | Offre | Prix/heure | Prix/mois | Note |
|----------|-------|------------|-----------|------|
| **VMCloud** | GPU-ENTERPRISE | **4.20€** | 2,319€ | - |
| Lambda Labs | 1× A100 | $1.29 (~1.20€) | ~860€ | Sans support |
| AWS | p4d.xlarge | ~3.50€ | ~2,520€ | On-demand |
| GCP | a2-highgpu-1g | ~3.20€ | ~2,300€ | On-demand |
| CoreWeave | A100-40GB | $2.39 (~2.20€) | ~1,580€ | Sans support |

### Positionnement prix VMCloud

```
┌─────────────────────────────────────────────────────────────────┐
│                    POSITIONNEMENT PRIX                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  MOINS CHER                                    PLUS CHER        │
│  ◄─────────────────────────────────────────────────────────►    │
│                                                                 │
│  VPS Entry:                                                     │
│  Hetzner ──── OVH ──── Scaleway ──── VMCloud ──── DO ──── AWS  │
│                                        ▲                        │
│                                    NOUVEAU                      │
│                                                                 │
│  VPS Premium:                                                   │
│  Hetzner ──── OVH ──── Scaleway ──── DO ──── VMCloud ──── AWS  │
│                                               ▲                 │
│                                       (inclut support)          │
│                                                                 │
│  GPU A100:                                                      │
│  Lambda ──── CoreWeave ──── GCP ──── VMCloud ──── AWS          │
│                                       ▲                         │
│                               (inclut support)                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Justification du premium VMCloud

| Élément | VMCloud inclus | Concurrent équivalent |
|---------|----------------|----------------------|
| Support humain < 4h | ✅ Gratuit | +50-100€/mois |
| SLA contractuel | ✅ 99.9-99.99% | Souvent 99.5% |
| Monitoring inclus | ✅ Dashboard complet | +20-50€/mois |
| Backups 7 jours | ✅ Inclus | +5-20€/mois |
| IPv4 dédiée | ✅ Incluse | +3-5€/mois |
| Bandwidth généreux | ✅ 5 TB - illimité | Overage coûteux |
| Migration assistée | ✅ Gratuite | 100-500€ |
| **Total services** | **Inclus** | **+80-175€/mois** |

---

## 6. Remises et Programmes

### 6.1 Remises structurelles

| Type | Remise | Conditions | Application |
|------|--------|------------|-------------|
| **Engagement annuel** | 17% | Paiement upfront | Automatique |
| **Volume B2B** | 10-25% | Dépense > 1,000€/mois | Sur devis |
| **Multi-produits** | 5% | ≥ 3 produits différents | Automatique |
| **Parrainage** | 10% | Code parrain valide | 3 premiers mois |

### 6.2 Remise annuelle détaillée

```
Formule : Prix annuel = Prix mensuel × 12 × 0.83

Équivalent : 2 mois gratuits sur 12 (16.67% de remise)
Arrondi commercial : 17%

Exemple VPS-STARTER :
- Mensuel : 19.99€ × 12 = 239.88€
- Annuel : 199€ (remise de 40.88€, soit 17%)
```

### 6.3 Remises volume B2B

| Dépense mensuelle | Remise applicable | Process |
|-------------------|-------------------|---------|
| < 500€/mois | 0% | Tarif public |
| 500€ - 1,000€/mois | 5% | Automatique |
| 1,000€ - 2,500€/mois | 10% | Sur demande |
| 2,500€ - 5,000€/mois | 15% | Account manager |
| 5,000€ - 10,000€/mois | 20% | Négociation |
| > 10,000€/mois | Jusqu'à 25% | Devis personnalisé |

### 6.4 Programmes spéciaux (🔜 En attente)

Les programmes suivants sont planifiés mais non actifs :

| Programme | Cible | Bénéfice prévu | Statut |
|-----------|-------|----------------|--------|
| VMCloud Startup | Startups < 3 ans | Crédits + remise | 🔜 Q2 2025 |
| VMCloud Education | Écoles, étudiants | -50% + crédits | 🔜 Q3 2025 |
| VMCloud Open Source | Projets OSS | Offres gratuites | 🔜 Q3 2025 |
| VMCloud Non-Profit | Associations | -30% permanent | 🔜 Q4 2025 |

---

## 7. Pricing B2B / Enterprise

### 7.1 Processus commercial

```
┌─────────────────────────────────────────────────────────────────┐
│                    PROCESSUS B2B                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SELF-SERVICE          ASSISTED               ENTERPRISE        │
│  < 500€/mois          500€ - 5K€/mois        > 5K€/mois        │
│  ──────────────       ──────────────         ──────────────     │
│  • Tarif public       • Contact sales        • Account dédié    │
│  • CB/PayPal          • Devis personnalisé   • SLA custom       │
│  • Support ticket     • Facture entreprise   • Support dédié    │
│  • Auto-provisioning  • Onboarding assisté   • Architecture     │
│                       • Net 30               • Net 30/60        │
│                                                                 │
│        →        Formulaire contact        →       RDV           │
│                   ou chat               Account Manager         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Structure tarifaire Enterprise

| Composant | Tarif base | Négociable | Notes |
|-----------|------------|------------|-------|
| Compute (VPS/GPU) | Grille publique | -10 à -25% | Selon volume |
| Storage | 0.10-0.40€/GB | -10 à -20% | Selon engagement |
| Bandwidth | Inclus | Flat rate possible | Sur gros volumes |
| Support Enterprise | +500€/mois | Inclus > 5K€ | Account manager |
| SLA Premium | +200€/mois | Inclus > 3K€ | 99.99% garanti |
| Migration | Gratuit | Gratuit | Assistance technique |
| Formation | 500€/jour | Négociable | Sur site ou remote |

### 7.3 Engagement minimum Enterprise

| Tier | Engagement min | Durée min | Avantages |
|------|----------------|-----------|-----------|
| Business | Aucun | Mensuel | Support prioritaire |
| Enterprise | 2,000€/mois | 6 mois | -15%, SLA, AM |
| Strategic | 10,000€/mois | 12 mois | -25%, support 24/7 |

---

## 8. Crédits et Essais

### 8.1 Offre d'essai actuelle

| Type | Offre | Durée | Conditions |
|------|-------|-------|------------|
| **Free trial** | 50€ de crédits | 14 jours | CB requise, révocable |
| **POC Enterprise** | Jusqu'à 500€ | 30 jours | Après qualification |

### 8.2 Détails free trial

```
┌─────────────────────────────────────────────────────────────────┐
│                    FREE TRIAL VMCLOUD                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  CRÉDITS : 50€                                                  │
│  DURÉE : 14 jours                                               │
│  CB : Requise (non débitée sauf dépassement)                    │
│                                                                 │
│  Ce que vous pouvez tester :                                    │
│  ✓ 5 jours de VPS-STARTER (19.99€ ≈ 0.66€/jour)                │
│  ✓ 7 jours de VPS-NANO (9.99€ ≈ 0.33€/jour)                    │
│  ✓ 1.5 jour de GPU-STARTER (469€ ≈ 33€/jour)                   │
│  ✓ ~59h de GPU-PRO à 0.85€/h                                   │
│                                                                 │
│  Conditions :                                                   │
│  • 1 essai par entreprise (email pro requis)                   │
│  • Crédits non transférables                                    │
│  • Conversion automatique en payant après essai                │
│  • Annulation possible à tout moment                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 8.3 Garantie satisfaction

| Garantie | Durée | Conditions | Remboursement |
|----------|-------|------------|---------------|
| Money-back | 7 jours | Nouveaux clients | 100% |
| SLA breach | Permanent | Downtime > SLA | Crédits prorata |
| Migration fail | 30 jours | Accompagnement VMCloud | 100% |

---

## 9. Évolution du Pricing

### 9.1 Historique des changements

| Date | Changement | Impact | Raison |
|------|------------|--------|--------|
| Lancement 2023 | Prix initiaux | - | Setup initial |
| Q1 2025 | Baisse VPS -25% à -66% | Compétitivité | Alignement marché |

### 9.2 Politique de changement de prix

```
Règles VMCloud :

1. GRANDFATHERING : Les clients existants gardent leur tarif
   pendant 12 mois minimum après un changement

2. PRÉAVIS : Tout changement de prix est annoncé 60 jours
   à l'avance par email

3. BAISSE : Appliquée immédiatement à tous les clients

4. HAUSSE : Uniquement pour nouveaux clients ou après
   période de grandfathering

5. ENGAGEMENT : Un engagement annuel verrouille le prix
   pour toute la durée
```

### 9.3 Projections Q2-Q4 2025

| Période | Changement prévu | Impact |
|---------|------------------|--------|
| Q2 2025 | Lancement programmes spéciaux | +acquisition |
| Q3 2025 | Spot instances (-50%) | +volume GPU |
| Q4 2025 | Reserved instances (-30%) | +engagement |

---

## 10. Analyse de Marge

### 10.1 Structure de coûts (rappel)

| Composant | Coût mensuel | % du total |
|-----------|--------------|------------|
| CAPEX amorti (5 ans) | 25,417€ | 90% |
| Ops (OVH program) | ~3,000€ | 10% |
| **Total actuel** | **~28,500€** | 100% |

*Post-2027 (sans programme OVH) : ~48,500€/mois*

### 10.2 Coût par unité de compute

| Ressource | Coût estimé | Base |
|-----------|-------------|------|
| 1 vCPU/mois | ~4.50€ | CAPEX + ops |
| 1 GB RAM/mois | ~1.20€ | CAPEX + ops |
| 1 GB NVMe/mois | ~0.02€ | CAPEX |
| 1 TB bandwidth | ~0.50€ | Ops |

### 10.3 Marge par offre VPS (nouveaux prix)

| Offre | Prix | Coût estimé | Marge | % |
|-------|------|-------------|-------|---|
| VPS-NANO | 9.99€ | ~6.90€ | 3.09€ | 31% |
| VPS-STARTER | 19.99€ | ~10.80€ | 9.19€ | 46% |
| VPS-PERFORMANCE | 49€ | ~21.60€ | 27.40€ | 56% |
| VPS-BUSINESS | 149€ | ~36.00€ | 113€ | 76% |
| VPS-ENTERPRISE | 349€ | ~57.60€ | 291.40€ | 83% |
| VPS-ELITE | 699€ | ~104.40€ | 594.60€ | 85% |
| VPS-TITANIUM | 1,499€ | ~195.60€ | 1,303.40€ | 87% |
| VPS-QUANTUM | 2,999€ | ~351.60€ | 2,647.40€ | 88% |

### 10.4 Marge moyenne pondérée cible

| Segment | Mix prévu | Marge segment | Contribution |
|---------|-----------|---------------|--------------|
| Starter | 40% | 40% | 16% |
| Pro | 25% | 56% | 14% |
| Business | 20% | 76% | 15.2% |
| Enterprise+ | 15% | 85% | 12.75% |
| **Total** | **100%** | - | **~58%** |

---

## 11. Métriques et KPIs Pricing

### 11.1 KPIs à suivre

| Métrique | Définition | Cible |
|----------|------------|-------|
| **ARPU** | Revenu moyen par client | 150€/mois |
| **ACV** | Valeur contrat annuel moyen | 1,800€ |
| **Conversion rate** | Visiteurs → clients | 5% |
| **Trial-to-paid** | Essais → payants | 30% |
| **Upsell rate** | Upgrade dans 6 mois | 25% |
| **Discount leakage** | % revenus avec remise | < 20% |
| **Gross margin** | Marge brute globale | > 60% |

### 11.2 Dashboards à créer

```
PRICING DASHBOARD

┌─────────────────────────────────────────────────────────────────┐
│  Revenus par tier          │  Marge par produit                │
│  ████████████ Premium 35%  │  ████████████████ VPS 75%         │
│  ██████████ Enterprise 25% │  ████████████ GPU 68%             │
│  ████████ Business 20%     │  ██████████████████ Web 85%       │
│  ██████ Pro 12%            │  ████████████████ PaaS 72%        │
│  ████ Starter 8%           │  ████████████████ LB 78%          │
├─────────────────────────────────────────────────────────────────┤
│  Conversion funnel         │  Discounts applied                │
│  Visitors: 10,000          │  Annual: 45% des revenus          │
│  Signups: 500 (5%)         │  Volume: 12% des revenus          │
│  Trial: 200 (40%)          │  Promo: 3% des revenus            │
│  Paid: 80 (40%)            │  Full price: 40% des revenus      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 12. Actions et Roadmap Pricing

### Immédiat (Q1 2025)

- [x] Définir nouvelle grille VPS compétitive
- [ ] Mettre à jour site avec nouveaux prix
- [ ] Communiquer aux clients existants (grandfathering)
- [ ] Configurer analytics pricing

### Court terme (Q2 2025)

- [ ] Lancer programme Startup
- [ ] Implémenter pricing API
- [ ] A/B test landing pages pricing
- [ ] Dashboards métriques pricing

### Moyen terme (Q3-Q4 2025)

- [ ] Programmes Education / Open Source
- [ ] Spot instances GPU
- [ ] Reserved instances compute
- [ ] Pricing dynamique selon utilisation

---

## Annexes

### A. Simulateur de coût

```
EXEMPLE : Stack web e-commerce

Composants :
- 1× VPS-BUSINESS (app server)      149€
- 1× VPS-PERFORMANCE (database)      49€
- 1× LB-STARTER                      29€
- 500 GB Storage NVMe               75€
- 1× CDN-STARTER                     19€

Total mensuel :                     321€
Total annuel (-17%) :             3,193€

Économie vs à la carte :            655€
```

### B. Comparateur complet

| Config | VMCloud | OVH | Hetzner | Scaleway | DO | AWS |
|--------|---------|-----|---------|----------|-----|-----|
| 1C/2G | 9.99€ | 5€ | 3.79€ | 7.99€ | 12€ | 18€ |
| 2C/4G | 19.99€ | 7.50€ | 4.85€ | 11.99€ | 24€ | 35€ |
| 4C/8G | 49€ | 14€ | 9.29€ | 23.99€ | 48€ | 70€ |
| 8C/32G | 349€ | 60€ | 33€ | 74€ | 168€ | 280€ |
| A100 40G/h | 4.20€ | N/A | N/A | 3.50€ | N/A | 3.50€ |

### C. FAQ Pricing

**Q: Pourquoi VMCloud est plus cher que Hetzner sur les petits VPS ?**
> Support humain inclus, SLA contractuel, IPv4 dédiée, backups inclus. La différence de prix reflète ces services.

**Q: Peut-on négocier les prix ?**
> Oui, à partir de 1,000€/mois de dépense. Contactez sales@vmcloud.io.

**Q: Comment fonctionne le grandfathering ?**
> Les clients existants gardent leur tarif pendant 12 mois minimum après tout changement de prix.

**Q: Y a-t-il des frais de setup ?**
> Non, tous les frais sont inclus dans le prix mensuel/annuel.

---

*Document maintenu par l'équipe Produit VMCloud*
*Dernière mise à jour : Décembre 2024*
*Prochaine révision : Mars 2025*
