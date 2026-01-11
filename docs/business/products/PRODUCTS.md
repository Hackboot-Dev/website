# Catalogue Produits - VMCloud

> **Source de vérité** pour l'offre produit complète de VMCloud
> Dernière mise à jour : Décembre 2025
> Statut : Phase de lancement (tous produits en Beta fonctionnelle)

---

## 1. Vue d'ensemble du portfolio

### Positionnement produit

```
VMCLOUD - "Le juste milieu qui n'existait pas"
│
├── Flexibilité des hyperscalers (AWS/GCP)
│   └── Options avancées, paramètres, personnalisation
│
├── Simplicité des hébergeurs traditionnels (OVH)
│   └── Pas besoin d'un DevOps pour démarrer
│
└── Service premium en plus
    └── Support expert humain, réactivité, relation
```

### Catalogue produits

| Produit | Description | Maturité | Offres | Prix range |
|---------|-------------|----------|--------|------------|
| **VPS** | Serveurs virtuels AMD EPYC | Beta fonctionnelle | 8 | 29€ - 3 199€/mois |
| **GPU Cloud** | Compute GPU pour AI/ML/Rendering | Beta fonctionnelle | 8 | 469€ - 18 559€/mois |
| **Web Hosting** | Hébergement web mutualisé/dédié | Beta fonctionnelle | 4 | 19€ - 199€/mois |
| **PaaS** | Platform as a Service conteneurs | Beta fonctionnelle | 4 | 59€ - 1 199€/mois |
| **Load Balancer** | Répartition de charge L4/L7 | Beta fonctionnelle | 4 | 29€ - 999€/mois |
| **Storage** | Stockage bloc NVMe/SSD | Beta fonctionnelle | 4 | 0.10€ - 0.40€/GB/mois |
| **CDN** | Content Delivery Network | Beta fonctionnelle | 4 | 19€ - 2 499€/mois |

### Statut "Beta fonctionnelle"

Tous les produits sont **opérationnels et vendables**, mais :
- Modifications possibles selon retours clients/internes
- Pricing ajustable
- Features évolutives
- Pas de "Beta" affichée aux clients - produits finaux modifiables

---

## 2. Détail par produit

### 2.1 VPS (Virtual Private Servers)

#### Positionnement
Le cœur de l'offre VMCloud. VPS haute performance sur AMD EPYC avec flexibilité et support expert.

#### Gamme complète

| Tier | Nom | vCPU | RAM | Storage | Bandwidth | Prix/mois | SLA |
|------|-----|------|-----|---------|-----------|-----------|-----|
| Starter | VPS-NANO | 1× EPYC | 2 GB | 40 GB NVMe | 5 TB | 29€ | 99.9% |
| Starter | VPS-STARTER | 2× EPYC | 4 GB | 80 GB NVMe | 10 TB | 49€ | 99.9% |
| Pro | VPS-PERFORMANCE | 4× EPYC | 8 GB | 160 GB NVMe | 20 TB | 99€ | 99.9% |
| Business | VPS-BUSINESS | 6× EPYC | 16 GB | 320 GB NVMe | 30 TB | 199€ | 99.95% |
| Enterprise | VPS-ENTERPRISE | 8× EPYC | 32 GB | 640 GB NVMe | 50 TB | 399€ | 99.99% |
| Enterprise | VPS-ELITE | 16× EPYC | 64 GB | 1.28 TB NVMe | 100 TB | 799€ | 99.99% |
| Premium | VPS-TITANIUM | 32× EPYC | 128 GB | 2.56 TB NVMe | 200 TB | 1 599€ | 99.99% |
| Premium | VPS-QUANTUM | 48× EPYC | 256 GB | 5 TB NVMe | Illimité | 3 199€ | 99.99% |

#### Spécifications techniques

```
HARDWARE VPS
├── CPU: AMD EPYC 7003 Series (Zen 3)
│   ├── Base: 2.9 GHz
│   ├── Boost: 3.7 GHz
│   └── L3 Cache: 32 MB
│
├── RAM: DDR4 ECC 3200 MHz
│   └── Dual Channel
│
├── Storage: NVMe PCIe 4.0
│   ├── IOPS: 50,000+ Random
│   └── Throughput: 7,000 MB/s Read
│
└── Network: 10 Gbps port
    ├── DDoS Protection incluse
    └── IPv6 natif
```

#### OS Supportés (16 images)

**Linux (14) :**
| OS | Versions | Support |
|----|----------|---------|
| Ubuntu | 20.04 LTS, 22.04 LTS, 24.04 LTS | Officiel |
| Debian | 11 (Bullseye), 12 (Bookworm) | Officiel |
| Rocky Linux | 8, 9 | Officiel |
| AlmaLinux | 8, 9 | Officiel |
| CentOS Stream | 8, 9 | Officiel |
| Fedora | 39, 40 | Community |
| openSUSE Leap | 15 | Community |
| Arch Linux | Rolling | Community |

**Windows (2) :**
| OS | Version | Licence |
|----|---------|---------|
| Windows Server | 2019 | BYOL ou incluse |
| Windows Server | 2022 | BYOL ou incluse |

**Images custom :** ❌ Non disponible actuellement

#### Différenciateurs VPS vs concurrence

| Critère | VMCloud | OVH | Scaleway | Hetzner |
|---------|---------|-----|----------|---------|
| CPU | EPYC 7003 | EPYC ancienne gen | EPYC | Intel/EPYC |
| Support | Expert humain | Bots | Moyen | Minimaliste |
| Flexibilité | Options avancées | Rigide | Bonne | Basique |
| Prix | Mid-premium | Low-cost | Mid | Low-cost |
| Réseau | 10 Gbps | Variable | 1-10 Gbps | 1 Gbps |

---

### 2.2 GPU Cloud

#### Positionnement
**Focus principal :** AI/ML Training & Inference
**Secondaire :** Rendering 3D, postes de travail cloud B2B
**Tertiaire :** Gaming Cloud (via Hackboot, entreprise sœur)

#### Gamme complète

| Tier | Nom | GPU | VRAM | vCPU | RAM | Storage | Prix/heure | Prix/mois |
|------|-----|-----|------|------|-----|---------|------------|-----------|
| Starter | GPU-STARTER | 1× Tesla T4 | 16 GB | 8× EPYC | 32 GB | 500 GB | 0.85€ | 469€ |
| Pro | GPU-PRO | 1× RTX 4090 | 24 GB | 16× EPYC | 64 GB | 1 TB | 1.50€ | 829€ |
| Business | GPU-BUSINESS | 2× RTX 4090 | 48 GB | 32× EPYC | 128 GB | 2 TB | 2.90€ | 1 599€ |
| Enterprise | GPU-ENTERPRISE | 1× A100 40GB | 40 GB | 48× EPYC | 192 GB | 4 TB | 4.20€ | 2 319€ |
| Premium | GPU-QUANTUM | 2× A100 40GB | 80 GB | 64× EPYC | 256 GB | 8 TB | 8.40€ | 4 639€ |
| Premium | GPU-TITAN | 1× A100 80GB | 80 GB | 96× EPYC | 384 GB | 16 TB | 5.50€ | 3 035€ |
| Premium | GPU-CLUSTER | 4× A100 40GB | 160 GB | 128× EPYC | 512 GB | 32 TB | 16.80€ | 9 279€ |
| Premium | GPU-SUPERCOMPUTE | 8× A100 80GB | 640 GB | 256× EPYC | 1 TB | 64 TB | 33.60€ | 18 559€ |

#### Stack logicielle GPU

```
SOFTWARE STACK
├── CUDA: 11.8 / 12.x
├── cuDNN: 8.9.x Optimized
├── TensorRT: 8.6 LTS
├── Frameworks: PyTorch, TensorFlow, JAX
├── ML Tools: Jupyter Lab, MLflow, W&B
├── Containers: Docker + NVIDIA Container Toolkit
└── OS: Ubuntu 22.04, Rocky Linux 9
```

#### Use cases GPU

| Priorité | Use case | GPU recommandé | Clients cibles |
|----------|----------|----------------|----------------|
| 🥇 Principal | AI/ML Training | A100, RTX 4090 | Startups AI, Labs R&D |
| 🥇 Principal | Inference LLM | A100, T4 | SaaS AI, Chatbots |
| 🥈 Secondaire | Rendering 3D | RTX 4090 | Studios, Arch viz |
| 🥈 Secondaire | Postes cloud | RTX 4090 | B2B, Remote work |
| 🥉 Tertiaire | Gaming Cloud | RTX 4090, T4 | Via Hackboot |

#### Spot Instances

```
STATUT: ❌ PLANIFIÉ - NON ACTIF

Prévu:
- Jusqu'à -70% sur workloads interruptibles
- Batch processing, training non-critique
- Préemption avec 2 min de notice

Timeline: À définir
```

---

### 2.3 Web Hosting

#### Gamme

| Tier | Nom | Sites | Storage | Bandwidth | DB | Emails | Prix/mois |
|------|-----|-------|---------|-----------|----|---------|-----------|
| Starter | WEB-STARTER | 1 | 50 GB | 1 TB | 5 | 10 | 19€ |
| Business | WEB-BUSINESS | 10 | 200 GB | 5 TB | 25 | 100 | 49€ |
| Pro | WEB-PRO | 50 | 500 GB | 20 TB | 100 | 500 | 99€ |
| Enterprise | WEB-ENTERPRISE | Illimité | 2 TB | Illimité | Illimité | Illimité | 199€ |

#### Technologies supportées

```
WEB STACK
├── PHP: 7.4, 8.0, 8.1, 8.2, 8.3
├── Node.js: 16, 18, 20, 21 LTS
├── Python: 3.8 - 3.12
├── Ruby: 2.7 - 3.2
├── .NET: 6.0, 7.0, 8.0
├── Databases: MySQL 8, PostgreSQL 16, MariaDB 11, MongoDB 7, Redis 7
├── Web Servers: Apache 2.4, Nginx
└── Cache: Redis, Memcached, Varnish
```

#### Apps 1-Click

- WordPress, Joomla, Drupal
- WooCommerce, PrestaShop, Magento
- Discourse, phpBB, NodeBB
- GitLab CE, Jenkins
- Matomo, Plausible

---

### 2.4 PaaS (Platform as a Service)

#### Gamme

| Tier | Nom | Containers | RAM/container | Deployments/jour | Prix/mois |
|------|-----|------------|---------------|------------------|-----------|
| Starter | PAAS-CONTAINER | 1 | 2 GB | 10 | 59€ |
| Business | PAAS-BUSINESS | 5 | 4 GB | 50 | 239€ |
| Pro | PAAS-SCALE | 20 | 8 GB | 200 | 719€ |
| Enterprise | PAAS-KUBERNETES | Cluster K8s | Configurable | Illimité | 1 199€ |

#### Features PaaS

```
PAAS FEATURES
├── Container Runtime: Docker 24.x
├── Orchestration: Nomad (K8s roadmap)
├── Registry: Private registry inclus
├── CI/CD: GitHub, GitLab, Bitbucket webhooks
├── Scaling: Horizontal + Vertical
├── Environments: Dev / Staging / Prod
├── Rollback: 1-click instant
└── Blue-Green: Zero downtime deploy
```

---

### 2.5 Load Balancer

#### Gamme

| Tier | Nom | Backends | Requests/s | Protocoles | Prix/mois |
|------|-----|----------|------------|------------|-----------|
| Starter | LB-STARTER | 5 | 10K | HTTP/HTTPS | 29€ |
| Business | LB-BUSINESS | 20 | 50K | HTTP/HTTPS/TCP/UDP | 99€ |
| Enterprise | LB-ENTERPRISE | 100 | 200K | + WebSocket | 299€ |
| Premium | LB-GLOBAL | Illimité | 1M+ | + gRPC/HTTP3 | 999€ |

---

### 2.6 Storage

#### Gamme

| Tier | Nom | Type | IOPS/TB | Latence | Prix/GB/mois |
|------|-----|------|---------|---------|--------------|
| Starter | STORAGE-SSD | SSD SATA | 10K | < 1ms | 0.10€ |
| Pro | STORAGE-NVME | NVMe PCIe 3.0 | 50K | < 0.5ms | 0.15€ |
| Business | STORAGE-EXTREME | NVMe PCIe 4.0 | 200K | < 0.1ms | 0.25€ |
| Premium | STORAGE-DEDICATED | NVMe RAID 10 | 500K+ | < 0.05ms | 0.40€ |

---

### 2.7 CDN

#### Gamme

| Tier | Nom | PoPs | Traffic inclus | WAF | Prix/mois |
|------|-----|------|----------------|-----|-----------|
| Starter | CDN-STARTER | 10 Europe | 1 TB | ❌ | 19€ |
| Pro | CDN-PRO | 25 EU/US | 10 TB | Basic | 99€ |
| Business | CDN-BUSINESS | 50 Mondial | 100 TB | Advanced | 499€ |
| Premium | CDN-GLOBAL | 150+ Mondial | 1 PB | Custom rules | 2 499€ |

---

## 3. Capacité infrastructure (réelle)

### Parc actuel

```
INVENTAIRE RÉEL - Décembre 2025
│
├── COMPUTE
│   ├── Serveurs CPU: 60× AMD EPYC 7003 (256 GB RAM)
│   ├── vCPUs totaux: ~3 840 (ou ~7 680 avec overselling x2)
│   └── RAM totale: ~15 TB
│
├── GPU
│   ├── Tesla T4 16GB: 25 unités
│   ├── RTX 4090 24GB: 20 unités
│   ├── A100 40GB: 30 unités
│   └── A100 80GB: 10 unités
│   └── TOTAL: 85 GPU
│
├── STORAGE
│   └── NVMe: ~100 TB
│
└── NETWORK
    ├── Backbone: Variable selon DC
    └── DDoS: Multi-layer (Voxility + Tier-1)
```

### Enveloppes de capacité

| Ressource | Capacité max | Objectif utilisation | Capacité vendable |
|-----------|--------------|---------------------|-------------------|
| vCPUs | 3 840 (ou 7 680 oversold) | 70% | ~5 400 vCPUs |
| RAM | 15 TB | 70% | ~10.5 TB |
| GPU T4 | 25 | 80% | 20 instances |
| GPU 4090 | 20 | 80% | 16-20 instances |
| GPU A100 | 40 | 90% | 36 instances |
| Storage | 100 TB | 60% | ~60 TB |

### Datacenters

| Code | Localisation | Tier | Statut | GPU disponibles |
|------|--------------|------|--------|-----------------|
| PAR-1 | Paris, France | III+ | ✅ Opérationnel | A100, RTX 4090 |
| AMS-1 | Amsterdam, NL | III | ✅ Opérationnel | A40, L40S |
| FRA-1 | Frankfurt, DE | III | 🔧 Maintenance | A100 (planned) |

**Note :** Infrastructure 100% hébergée chez OVH (programme Startup 24 mois jusqu'à fin 2027)

---

## 4. Features manquantes vs concurrence

### Comparaison détaillée

| Feature | VMCloud | Scaleway | OVH | DigitalOcean | Hetzner | Infomaniak |
|---------|---------|----------|-----|--------------|---------|------------|
| **CONSOLE/UX** |
| Console unifiée | ❌ Fragmentée | ✅ | ⚠️ Vieillotte | ✅ Référence | ❌ | ⚠️ |
| Dashboard temps réel | ❌ | ✅ | ⚠️ | ✅ | ❌ | ⚠️ |
| Mobile app | ❌ | ✅ | ⚠️ | ✅ | ❌ | ✅ |
| Dark mode | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ |
| **API/DEVTOOLS** |
| API REST complète | ❌ Partielle | ✅ | ⚠️ | ✅ | ⚠️ | ⚠️ |
| GraphQL API | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Terraform provider | ❌ Annoncé | ✅ Mature | ⚠️ | ✅ | ✅ | ❌ |
| CLI officiel | ❌ Annoncé | ✅ | ⚠️ | ✅ | ❌ | ❌ |
| SDK multi-langage | ❌ | ✅ | ⚠️ | ✅ | ❌ | ❌ |
| Webhooks/Events | ❌ | ✅ | ⚠️ | ✅ | ❌ | ❌ |
| **COMPUTE** |
| Images custom | ❌ | ✅ | ✅ | ✅ | ✅ | ⚠️ |
| Snapshots automatiques | ⚠️ Manuel | ✅ | ✅ | ✅ | ✅ | ✅ |
| Auto-scaling VPS | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Spot/Preemptible instances | ❌ Planned | ✅ | ❌ | ❌ | ❌ | ❌ |
| Bare metal | ❌ Voulu | ✅ | ✅ | ❌ | ✅ | ❌ |
| **GPU** |
| Multi-GPU NVLink | ✅ | ⚠️ | ❌ | ❌ | ❌ | ❌ |
| H100 | ❌ Planned | ⚠️ | ❌ | ❌ | ❌ | ❌ |
| Réservation long terme | ❌ | ✅ | ✅ | ❌ | N/A | N/A |
| **MANAGED SERVICES** |
| Kubernetes managé | ❌ Roadmap Q3 | ✅ Kapsule | ✅ | ✅ | ❌ | ❌ |
| Database managée | ❌ Voulu | ✅ | ✅ | ✅ | ❌ | ⚠️ |
| Object Storage S3 | ❌ Roadmap Q2 | ✅ | ✅ | ✅ | ✅ | ✅ |
| Serverless Functions | ❌ Non prévu | ✅ | ❌ | ✅ | ❌ | ❌ |
| Message Queue managé | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Redis managé | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **NETWORK** |
| Private Networks/VPC | ⚠️ Basique | ✅ | ✅ | ✅ | ✅ | ⚠️ |
| VPN managé | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |
| DNS managé | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Floating IPs | ⚠️ | ✅ | ✅ | ✅ | ✅ | ⚠️ |
| IPv6 natif | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **BILLING/BUSINESS** |
| Facturation à l'heure | ✅ | ✅ | ⚠️ | ✅ | ✅ | ❌ |
| Estimation de coûts | ❌ | ✅ | ⚠️ | ✅ | ⚠️ | ⚠️ |
| Budget alerts | ❌ | ✅ | ⚠️ | ✅ | ❌ | ❌ |
| Multi-user/Teams | ❌ | ✅ | ✅ | ✅ | ⚠️ | ✅ |
| SSO/SAML | ❌ | ✅ | ✅ | ✅ | ❌ | ⚠️ |
| **SUPPORT** |
| Support 24/7 | ✅ | ⚠️ | ❌ Bots | ⚠️ | ❌ | ✅ |
| Support expert humain | ✅✅ | ⚠️ | ❌ | ⚠️ | ❌ | ✅ |
| Documentation | ⚠️ À faire | ✅ | ⚠️ | ✅✅ Référence | ⚠️ | ✅ |
| Status page publique | ⚠️ | ✅ | ✅ | ✅ | ✅ | ✅ |

### Features prioritaires manquantes (impact business)

```
PRIORITÉ CRITIQUE (bloque des ventes)
│
├── 1. API REST complète
│   └── Sans API, pas d'automation → clients tech frustrés
│
├── 2. Console unifiée
│   └── UX fragmentée → mauvaise première impression
│
├── 3. Terraform provider
│   └── Standard DevOps → bloque clients IaC
│
└── 4. Documentation complète
    └── Self-service impossible → surcharge support
```

```
PRIORITÉ HAUTE (attendu par le marché)
│
├── 5. Object Storage S3
│   └── Use case universel, souvent couplé aux VPS/GPU
│
├── 6. Images custom / Snapshots auto
│   └── Workflow standard, attendu partout
│
├── 7. Kubernetes managé
│   └── Tendance marché, cible PME tech
│
└── 8. Private Networks avancés
    └── Sécurité B2B, architectures multi-tier
```

```
PRIORITÉ MOYENNE (nice to have)
│
├── 9. CLI officiel
├── 10. Database managée
├── 11. Spot instances
├── 12. Budget alerts
├── 13. Multi-user/Teams
└── 14. SSO/SAML
```

```
PRIORITÉ BASSE (différenciation future)
│
├── 15. Serverless Functions
├── 16. Bare metal
├── 17. H100
├── 18. VPN managé
└── 19. Mobile app
```

---

## 5. Dette technique

### Vue d'ensemble

```
DETTE TECHNIQUE - Décembre 2025
│
├── 🔴 CRITIQUE
│   ├── Console/UI fragmentée et non unifiée
│   ├── Pas d'API publique complète
│   ├── Terraform/CLI annoncés mais inexistants
│   └── Documentation quasi inexistante
│
├── 🟠 IMPORTANTE
│   ├── Écart données site vs réalité (chiffres gonflés)
│   ├── Pas de monitoring client temps réel
│   ├── Provisioning pas 100% automatisé
│   ├── Pas de système de billing mature
│   └── Pas de gestion multi-user/permissions
│
├── 🟡 MOYENNE
│   ├── Tests automatisés insuffisants
│   ├── Pas de chaos engineering
│   ├── Observabilité partielle
│   ├── Backup/DR pas testé en conditions réelles
│   └── Runbooks incomplets
│
└── 🟢 MINEURE
    ├── Code legacy certains composants
    ├── Dépendances à mettre à jour
    └── Refactoring UI à prévoir
```

### Détail dette critique

#### 1. Console/UI fragmentée

```
PROBLÈME:
- Pas de dashboard unifié type AWS/GCP
- Plusieurs interfaces non cohérentes
- UX "un peu de la merde" (citation fondateur)
- Pas de vision globale ressources client

IMPACT:
- Mauvaise première impression
- Onboarding difficile
- Support surchargé
- Clients frustrés

SOLUTION REQUISE:
- Refonte complète UI
- Design system cohérent
- Dashboard unifié
- Estimation: 3-6 mois dev
```

#### 2. API publique incomplète

```
PROBLÈME:
- Pas d'API documentée publique
- Pas de versioning API
- Pas d'authentification standard (OAuth, API keys)
- Endpoints internes non exposés

IMPACT:
- Automation clients impossible
- Intégrations bloquées
- Terraform/CLI impossibles
- Cible tech/DevOps perdue

SOLUTION REQUISE:
- Conception API REST v1
- Documentation OpenAPI/Swagger
- Rate limiting, auth, versioning
- Estimation: 2-4 mois dev
```

#### 3. Terraform/CLI fantômes

```
PROBLÈME:
- Site annonce "Official Terraform provider"
- Site annonce "vmcl CLI"
- Aucun des deux n'existe

IMPACT:
- Promesse non tenue
- Crédibilité atteinte si découvert
- Clients DevOps déçus

SOLUTION REQUISE:
- Soit développer (dépend de l'API)
- Soit retirer du site
- Terraform: 1-2 mois après API
- CLI: 1-2 mois après API
```

#### 4. Documentation inexistante

```
PROBLÈME:
- Pas de docs techniques publiques
- Pas de guides getting started
- Pas de tutoriels
- Pas de FAQ technique

IMPACT:
- Self-service impossible
- Support surchargé
- Onboarding lent
- SEO technique raté

SOLUTION REQUISE:
- Docs produit complètes
- Guides par use case
- API reference
- Estimation: 1-2 mois continu
```

### Détail dette importante

#### 5. Écart site vs réalité

```
PROBLÈME:
- Site: "48k+ vCPUs" → Réel: 3.8k
- Site: "500+ GPU" → Réel: 85
- Site: "150+ PoPs CDN" → Réel: ?

IMPACT:
- Fausse publicité potentielle
- Déception client si découvert
- Problème légal potentiel

SOLUTION:
- Corriger le site avec chiffres réels
- Ou afficher "capacité prévue"
- À faire rapidement
```

#### 6. Billing/Facturation

```
PROBLÈME:
- Système de billing pas mature
- Pas d'estimation de coûts
- Pas d'alertes budget
- Pas de factures automatiques ?

IMPACT:
- Friction paiement
- Surprises clients
- Comptabilité manuelle

SOLUTION:
- Intégration Stripe complète
- Dashboard billing client
- Alertes et estimations
```

#### 7. Multi-user/Permissions

```
PROBLÈME:
- Pas de gestion équipes
- Pas de rôles/permissions
- Pas de SSO

IMPACT:
- B2B enterprise bloqué
- Un compte = une personne
- Sécurité faible

SOLUTION:
- RBAC (Role-Based Access Control)
- Invitations équipe
- SSO/SAML (enterprise)
```

### Risques techniques

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| Incident majeur (data loss) | Faible | Critique | Backup réguliers, DR plan |
| Surcharge infra (overselling) | Moyenne | Fort | Monitoring, alertes |
| Faille sécurité | Moyenne | Critique | Audits, pentests, WAF |
| Dépendance OVH | Certaine | Fort | Plan sortie 2027 |
| Scalabilité limitée | Moyenne | Fort | Architecture évolutive |

---

## 6. Roadmap produit (mini)

### Court terme (0-6 mois)

| Priorité | Item | Impact | Effort |
|----------|------|--------|--------|
| P0 | Corriger chiffres site | Crédibilité | 1 jour |
| P0 | API REST v1 publique | Unlock tout | 2-4 mois |
| P0 | Documentation de base | Self-service | 1-2 mois |
| P1 | Console unifiée v1 | UX | 3-6 mois |
| P1 | Object Storage S3 | Feature clé | 2-3 mois |
| P2 | Terraform provider | DevOps | 1-2 mois (après API) |
| P2 | CLI vmcl | DevOps | 1-2 mois (après API) |

### Moyen terme (6-18 mois)

| Item | Statut |
|------|--------|
| Kubernetes managé | Roadmap Q3 2025 |
| Database managée (PostgreSQL, MySQL) | Voulu |
| DC Madrid | Roadmap Q2 2025 |
| DC Milan | Roadmap Q3 2025 |
| H100 GPU | Voulu |
| Spot instances | Planned |
| Images custom | Voulu |
| Multi-user/Teams | Voulu |

### Long terme (18+ mois)

| Item | Statut |
|------|--------|
| Bare Metal | Voulu |
| Serverless Functions | À évaluer |
| Edge Computing | Roadmap Q4 2025 |
| Certifications (ISO 27001, SOC 2) | Roadmap |
| Expansion US/APAC | Vision 2030+ |

---

## 7. Différenciateurs produit VMCloud

### Ce qui nous rend uniques

```
DIFFÉRENCIATEURS VMCLOUD
│
├── 🧑‍💻 SUPPORT EXPERT HUMAIN
│   ├── Devs et experts qui répondent, pas des bots
│   ├── Le CTO peut intervenir si nécessaire
│   ├── Réactivité startup (pas de bureaucratie)
│   └── Relation personnalisée (on connaît nos clients)
│
├── 🎯 POSITIONNEMENT CLAIR
│   ├── "Le juste milieu" explicite
│   ├── Flexibilité AWS + Simplicité OVH
│   ├── B2B premium assumé
│   └── Pas de dispersion (focus cloud)
│
├── 🇪🇺 EUROPÉEN SOUVERAIN
│   ├── Estonie = EU, e-Residency, innovation
│   ├── RGPD natif, pas de CLOUD Act
│   ├── Datacenters EU uniquement
│   └── Équipe européenne
│
├── 💰 PRIX JUSTE
│   ├── Mid-premium (pas low-cost, pas enterprise)
│   ├── Transparent, prévisible
│   ├── ROI évident vs alternatives
│   └── Pas de coûts cachés
│
└── 🚀 AGILITÉ STARTUP
    ├── Feedback intégré rapidement
    ├── Évolution continue
    ├── Proximité client
    └── Pas de corporate BS
```

### Ce qui manque pour être compétitif

```
GAPS À COMBLER
│
├── Console/UX moderne
├── API/DevTools complets
├── Documentation
├── Managed services (K8s, DB, S3)
└── Features standard (snapshots auto, images custom)
```

---

## 8. Questions en attente

### À valider avec le fondateur

- [ ] Priorité exacte de la roadmap produit
- [ ] Budget/timeline pour refonte console
- [ ] Stratégie API (build vs buy vs partner)
- [ ] Pricing des futurs produits (K8s, S3, DB)
- [ ] Position sur Serverless (go/no-go)
- [ ] Timeline réaliste Terraform/CLI

### À investiguer

- [ ] Capacité réelle CDN (PoPs, partenaire)
- [ ] État réel du système de billing
- [ ] Niveau d'automatisation provisioning actuel
- [ ] Coûts réels par produit (marges)

---

## Résumé exécutif

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    CATALOGUE PRODUITS - VMCLOUD                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  PRODUITS      7 catégories, 36 offres au total                         │
│                VPS (8) • GPU (8) • Web (4) • PaaS (4)                    │
│                LB (4) • Storage (4) • CDN (4)                            │
│                                                                          │
│  STATUT        Tous en "Beta fonctionnelle" (opérationnels, évolutifs)  │
│                                                                          │
│  CAPACITÉ      60 serveurs EPYC • 85 GPU • 100 TB storage               │
│                3 DC (Paris, Amsterdam, Frankfurt)                        │
│                                                                          │
│  FORCES        Support expert humain • Prix juste • Souveraineté EU     │
│                GPU Cloud compétitif • Agilité startup                    │
│                                                                          │
│  GAPS          Console/UX • API/DevTools • Docs • Managed services      │
│                                                                          │
│  DETTE         Console fragmentée • API inexistante • Site ≠ réalité    │
│                Terraform/CLI fantômes • Documentation absente            │
│                                                                          │
│  PRIORITÉS     1. API publique  2. Console v1  3. Docs  4. S3/K8s       │
│                                                                          │
│  DIFFÉRENCIANT Support humain + Prix juste + EU = notre moat            │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

*Document confidentiel. Dernière mise à jour : Décembre 2025.*
