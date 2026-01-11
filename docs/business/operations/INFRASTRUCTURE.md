# Infrastructure - VMCloud

> **Source de vérité** pour l'infrastructure technique et les capacités
> Dernière mise à jour : Décembre 2024
> Statut : Production (hébergée chez OVH via Startup Program)

---

## Executive Summary

VMCloud opère une infrastructure cloud européenne 100% hébergée chez OVHcloud via le Startup Program (1.5M€ de crédits jusqu'à fin 2027). L'infrastructure comprend 60 serveurs AMD EPYC et 85 GPUs répartis sur 3 datacenters.

```
CAPACITÉ INFRASTRUCTURE VMCLOUD
───────────────────────────────

COMPUTE
├── 60× serveurs AMD EPYC 7003
├── ~3,840 vCPUs total (64 cores × 60)
├── 15.36 TB RAM (256 GB × 60)
└── Utilisation : ~20% (early stage)

GPU
├── 25× NVIDIA T4 (inference, budget)
├── 20× NVIDIA RTX 4090 (training, gaming)
├── 30× NVIDIA A100 40GB (enterprise AI)
└── 10× NVIDIA A100 80GB (large models)

STORAGE
├── 100 TB NVMe total
├── Distributed Ceph cluster
└── S3-compatible object storage

NETWORK
├── 100 Gbps backbone
├── DDoS protection incluse (OVH)
└── Multi-DC : Paris, Amsterdam, Frankfurt

UPTIME : 99.9% (SLA)
```

---

## 1. Vue d'ensemble

### 1.1 Résumé infrastructure

```
CONFIGURATION ACTUELLE
──────────────────────

Type : Hosted (OVH Startup Program)
       → Bare metal dédié, pas de colocation
       → Crédits : 1,500,000€ sur 24 mois
       → Fin programme : Décembre 2027

Datacenters : 3 localisations
├── Paris (PAR) - Principal, full capacity
├── Amsterdam (AMS) - Secondaire, operational
└── Frankfurt (FRA) - Tertiaire, maintenance mode

Capacité totale :
├── vCPUs : ~3,840 (allocable ~3,000 avec overhead)
├── RAM : 15.36 TB (allocable ~14 TB)
├── GPU : 85 units
├── Storage : 100 TB NVMe
└── Bandwidth : 100 Gbps

Clients hébergés : ~10 (early stage, dont Hackboot)
VMs en production : ~50-100
Uptime (2024) : 99.9%
```

### 1.2 Architecture haut niveau

```
ARCHITECTURE VMCLOUD
────────────────────

                    ┌─────────────────────┐
                    │      INTERNET       │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
         ┌────▼────┐     ┌─────▼────┐     ┌────▼────┐
         │  PARIS  │     │AMSTERDAM │     │FRANKFURT│
         │  (PAR)  │     │  (AMS)   │     │  (FRA)  │
         └────┬────┘     └────┬─────┘     └────┬────┘
              │               │                │
    ┌─────────┴─────────┐     │                │
    │                   │     │                │
┌───▼───┐         ┌─────▼─────▼─────┐    ┌────▼────┐
│ EDGE  │         │   OVH BACKBONE   │    │STANDBY │
│Routing│         │   (100 Gbps)     │    │        │
│ DDoS  │         └─────────────────┘    └─────────┘
└───┬───┘
    │
┌───▼────────────────────────────────────────────────┐
│                   CONTROL PLANE                     │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌───────┐  │
│  │   API   │  │ Portal  │  │Scheduler│  │Billing│  │
│  └─────────┘  └─────────┘  └─────────┘  └───────┘  │
└────────────────────────┬───────────────────────────┘
                         │
┌────────────────────────▼───────────────────────────┐
│                    DATA PLANE                       │
│                                                     │
│  ┌─────────────────┐  ┌─────────────────────────┐  │
│  │     COMPUTE     │  │          GPU            │  │
│  │  60× EPYC 7003  │  │  85× NVIDIA GPUs        │  │
│  │  256 GB RAM ea  │  │  T4/4090/A100           │  │
│  └────────┬────────┘  └────────────┬────────────┘  │
│           │                        │               │
│  ┌────────▼────────────────────────▼────────────┐  │
│  │                   STORAGE                     │  │
│  │  Ceph Cluster - 100 TB NVMe - 3× replicas    │  │
│  │  + S3-compatible Object Storage              │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 2. Datacenters

### 2.1 Localisations

| DC | Ville | Pays | Provider | Tier | Statut | Utilisation |
|----|-------|------|----------|------|--------|-------------|
| **PAR** | Paris | France 🇫🇷 | OVHcloud | Tier 3+ | ✅ Production | ~40% |
| **AMS** | Amsterdam | Pays-Bas 🇳🇱 | OVHcloud | Tier 3+ | ✅ Production | ~20% |
| **FRA** | Frankfurt | Allemagne 🇩🇪 | OVHcloud | Tier 3+ | ⚠️ Maintenance | ~5% |

### 2.2 Caractéristiques datacenters OVH

```
CERTIFICATIONS DC OVH
─────────────────────
├── ISO 27001 : ✅ Tous les DC
├── SOC 1/2 Type II : ✅
├── HDS (Santé) : ✅ Paris uniquement
├── PCI-DSS : ✅
└── RGPD Compliant : ✅

CARACTÉRISTIQUES TECHNIQUES
├── Redondance électrique : 2N
├── Refroidissement : Water cooling + Free cooling
├── PUE : 1.1-1.3 (très efficient)
├── Réseau : 100% fibre optique
└── Accès physique : Badge + Biométrie + Escorte

LATENCE INTER-DC
├── PAR ↔ AMS : ~8 ms
├── PAR ↔ FRA : ~10 ms
└── AMS ↔ FRA : ~6 ms
```

### 2.3 Capacité par DC

```
RÉPARTITION PAR DATACENTER
──────────────────────────

PARIS (Principal)
├── Serveurs : 35 (58%)
├── GPUs : 60 (70%)
│   ├── A100 40GB : 30 (tous)
│   ├── A100 80GB : 10 (tous)
│   └── T4 : 20
├── Storage : 60 TB
└── Rôle : Production principale, GPU, Enterprise

AMSTERDAM (Secondaire)
├── Serveurs : 20 (33%)
├── GPUs : 20 (24%)
│   ├── RTX 4090 : 20 (tous)
│   └── T4 : 0
├── Storage : 30 TB
└── Rôle : EU West, Gaming (Hackboot), PME

FRANKFURT (Tertiaire)
├── Serveurs : 5 (8%)
├── GPUs : 5 (6%)
│   └── T4 : 5
├── Storage : 10 TB
└── Rôle : DR, Backup, Tests
```

### 2.4 Plan d'expansion

```
ROADMAP INFRASTRUCTURE
──────────────────────

2025 (Dans le programme OVH)
├── [ ] Augmenter capacité Paris (+20 serveurs)
├── [ ] Activer Frankfurt en full production
├── [ ] Ajouter GPUs si demande (A100)
└── Budget : Via crédits OVH (pas de Capex)

2026 (Transition)
├── [ ] Évaluer alternatives (Hetzner, Scaleway)
├── [ ] Préparer architecture multi-cloud
├── [ ] Négocier deal post-program OVH
└── Budget : Planning en cours

2027+ (Post-program)
├── Option A : Renouvellement OVH (deal négocié)
├── Option B : Migration partielle multi-cloud
├── Option C : Colocation bare metal
└── Coût estimé : 23K€/mois (vs 3K€ actuel)

NOUVEAUX DC POTENTIELS (2026+)
├── Londres (UK market post-Brexit)
├── Zurich (Suisse, finance/healthcare)
└── Varsovie (Europe de l'Est, gaming)
```

---

## 3. Compute

### 3.1 Hardware serveurs

```
INVENTAIRE SERVEURS
───────────────────

TYPE : AMD EPYC 7003 Series (Milan)
├── Quantité : 60 serveurs
├── CPU : 64 cores / 128 threads par serveur
├── RAM : 256 GB DDR4 ECC par serveur
├── Storage local : NVMe (boot + cache)
├── Network : 2× 25 Gbps
└── Âge moyen : < 2 ans (2023)

CAPACITÉ TOTALE
├── Cores physiques : 3,840
├── Threads (vCPUs) : 7,680
├── RAM totale : 15,360 GB (15.36 TB)
└── Network : 3 Tbps aggregate

ALLOCATION (avec overcommit)
├── vCPUs vendables : ~6,000 (1.5:1 ratio)
├── RAM vendable : ~14,000 GB (overhead 10%)
└── Utilisation actuelle : ~20%
```

### 3.2 Virtualisation

```
STACK VIRTUALISATION
────────────────────

HYPERVISEUR
├── Technologie : KVM (Kernel-based Virtual Machine)
├── OS : Ubuntu Server 22.04 LTS
├── Management : Proxmox VE
└── Version : 8.x

ORCHESTRATION
├── API propriétaire VMCloud
├── Provisioning : < 60 secondes
├── Live migration : Supporté
└── Auto-scaling : Prévu (pas encore actif)

CONTAINERS
├── Runtime : Docker + containerd
├── Orchestration : Kubernetes (K3s)
├── Registry : Harbor (privé)
└── Adoption : 30% des workloads

IMAGES SUPPORTÉES
├── Linux : 14 distributions
│   ├── Ubuntu (20.04, 22.04, 24.04)
│   ├── Debian (11, 12)
│   ├── CentOS Stream (8, 9)
│   ├── Rocky Linux (8, 9)
│   ├── AlmaLinux (8, 9)
│   ├── Fedora (latest)
│   └── Arch Linux
└── Windows : 2 éditions
    ├── Windows Server 2022
    └── Windows Server 2019
```

### 3.3 Capacité compute détaillée

```
MÉTRIQUES COMPUTE
─────────────────

OVERCOMMIT RATIOS
├── CPU : 1.5:1 (conservateur)
├── RAM : 1.0:1 (pas d'overcommit)
└── Note : Ratios ajustables par tier client

UTILISATION ACTUELLE
├── vCPUs alloués : ~800 / 6,000 (13%)
├── RAM allouée : ~2 TB / 14 TB (14%)
├── VMs actives : ~80
└── Clients : ~10

CAPACITÉ DISPONIBLE
├── Nouveaux clients possibles : ~500-1,000
├── Marge de croissance : 5-7× avant investissement
└── Goulot d'étranglement : GPU (plus demandés)

PERFORMANCE
├── CPU benchmark : Score EPYC standard
├── Network VM : Up to 10 Gbps
├── Storage VM : Up to 100K IOPS (NVMe)
└── Latency intra-DC : < 1 ms
```

---

## 4. GPU Infrastructure

### 4.1 Inventaire GPU

```
PARC GPU VMCLOUD
────────────────

NVIDIA T4 (25 units)
├── VRAM : 16 GB
├── Performance : 65 TFLOPS FP16
├── Usage : Inference, workstations légères
├── Prix : 0.60€/h (entry-level)
└── Localisation : PAR (20) + FRA (5)

NVIDIA RTX 4090 (20 units)
├── VRAM : 24 GB
├── Performance : 82.6 TFLOPS FP32
├── Usage : Training ML, Rendering 3D, Gaming
├── Prix : 1.50€/h
└── Localisation : AMS (20) - Gaming cluster

NVIDIA A100 40GB (30 units)
├── VRAM : 40 GB HBM2e
├── Performance : 312 TFLOPS FP16
├── Usage : Enterprise AI, Large training
├── Prix : 3.00€/h
└── Localisation : PAR (30) - AI cluster

NVIDIA A100 80GB (10 units)
├── VRAM : 80 GB HBM2e
├── Performance : 312 TFLOPS FP16
├── Usage : LLM training, Very large models
├── Prix : 4.50€/h
└── Localisation : PAR (10) - Premium AI

TOTAL GPU CAPACITY
├── Total units : 85
├── Total VRAM : 2,620 GB
├── Valeur estimée : ~800K€
└── Utilisation : ~40% (Hackboot + clients)
```

### 4.2 Use cases GPU

```
RÉPARTITION PAR USE CASE
────────────────────────

1. AI/ML TRAINING (40% usage)
   ├── Clients : Startups AI, Labs R&D
   ├── GPUs : A100 principalement
   ├── Typical job : 4-8 GPUs, 2-72h
   └── Revenue : 60% du GPU revenue

2. AI/ML INFERENCE (15% usage)
   ├── Clients : SaaS AI, APIs
   ├── GPUs : T4, A100
   ├── Typical : 1-2 GPUs, 24/7
   └── Revenue : 20% du GPU revenue

3. RENDERING 3D (10% usage)
   ├── Clients : Studios, Archi, VFX
   ├── GPUs : RTX 4090
   ├── Typical : Burst, projets
   └── Revenue : 10% du GPU revenue

4. CLOUD GAMING (30% usage)
   ├── Client : Hackboot (interne)
   ├── GPUs : RTX 4090
   ├── Typical : Sessions gaming 2-4h
   └── Revenue : Interne

5. WORKSTATIONS (5% usage)
   ├── Clients : Remote workers, devs
   ├── GPUs : T4, 4090
   ├── Typical : 1 GPU, daytime
   └── Revenue : 10% du GPU revenue
```

### 4.3 GPU roadmap

```
EXPANSION GPU PRÉVUE
────────────────────

2025 (Si demande)
├── +10 A100 80GB (via crédits OVH)
├── +20 T4 (inference scaling)
└── Objectif : 115 GPUs total

2026 (Nouvelles générations)
├── NVIDIA H100 (évaluation)
├── AMD MI300X (alternative)
└── Dépend du marché et pricing

LIMITATIONS ACTUELLES
├── Pas de multi-GPU instances (WIP)
├── Pas de fractional GPUs (MIG prévu)
├── Spot instances GPU : Non disponible
└── Reservation long terme : Manuel
```

---

## 5. Storage

### 5.1 Architecture stockage

```
STACK STORAGE VMCLOUD
─────────────────────

BLOCK STORAGE (Principal)
├── Technologie : Ceph RBD
├── Backend : NVMe SSD
├── Capacité : 100 TB brut → ~33 TB utile (3× replicas)
├── Performance : 100K+ IOPS, < 1ms latency
└── Usage : Volumes VMs, databases

OBJECT STORAGE (S3-compatible)
├── Technologie : Ceph RadosGW / MinIO
├── Capacité : Inclus dans les 100 TB
├── API : S3-compatible
├── Performance : High throughput, eventual consistency
└── Usage : Backups, static assets, data lakes

LOCAL NVMe (VM hosts)
├── Capacité : ~2 TB par serveur (120 TB total)
├── Usage : OS boot, cache, ephemeral
├── Performance : 500K+ IOPS
└── Note : Non-persistent, perte si host fail
```

### 5.2 Performance stockage

```
BENCHMARKS STORAGE
──────────────────

BLOCK STORAGE (Ceph NVMe)
├── Random Read IOPS : 100,000+
├── Random Write IOPS : 50,000+
├── Sequential Read : 2 GB/s
├── Sequential Write : 1 GB/s
├── Latency (avg) : < 1 ms
└── Latency (p99) : < 5 ms

OBJECT STORAGE (S3)
├── Throughput : 500 MB/s per stream
├── Latency : 10-50 ms (first byte)
├── Max object size : 5 TB
└── Concurrency : High

TIERS DE PERFORMANCE
├── Premium (NVMe SSD) : 100K IOPS - 0.15€/GB/mois
├── Standard (SSD) : 20K IOPS - 0.10€/GB/mois
├── Archive (HDD) : 500 IOPS - 0.03€/GB/mois
└── Object (S3) : Throughput - 0.02€/GB/mois
```

### 5.3 Réplication et durabilité

```
DURABILITÉ DES DONNÉES
──────────────────────

RÉPLICATION
├── Factor : 3× (triple réplication)
├── Placement : Cross-server (min 3 hosts)
├── Cross-DC : Non (same DC only)
└── Sync : Synchronous writes

DURABILITÉ
├── Théorique : 99.99% (4 nines)
├── SLA : 99.9%
└── Note : Pas de cross-DC = risque DC entier

BACKUPS
├── Snapshots : Daily automated
├── Retention : 7 jours par défaut
├── Off-site : Cross-DC backup (async)
├── Recovery : Self-service via console
└── Pricing : Inclus jusqu'à 100% du volume

ROADMAP STORAGE
├── [ ] Object storage dedicated (2025)
├── [ ] Cross-DC replication (2025)
├── [ ] Tiering automatique (2026)
└── [ ] Compression/Dedupe (2026)
```

---

## 6. Network

### 6.1 Connectivité

```
ARCHITECTURE RÉSEAU
───────────────────

BACKBONE
├── Bandwidth total : 100 Gbps
├── Provider : OVHcloud (inclus)
├── Transit : OVH peering (Tier 1)
├── Latence Europe : < 20 ms
└── Latence US : 80-100 ms

ANTI-DDOS
├── Protection : OVH Game DDoS Protection
├── Capacité : 1+ Tbps mitigation
├── Activation : Automatique
├── Inclus : Oui (pas de surcoût)
└── SLA : 99.9% uptime network

IP ADDRESSING
├── IPv4 : Pool /22 (1,024 IPs)
├── IPv6 : Pool /48 (illimité)
├── Prix IPv4 : 3€/mois/IP
├── Prix IPv6 : Gratuit
└── Reverse DNS : Configurable

CONNECTIVITÉ PAR DC
├── PAR : 40 Gbps
├── AMS : 40 Gbps
├── FRA : 20 Gbps
└── Inter-DC : 10 Gbps dedicated
```

### 6.2 Services réseau

```
SERVICES RÉSEAU VMCLOUD
───────────────────────

LOAD BALANCING
├── Type : Software (HAProxy)
├── Algorithms : Round-robin, Least-conn, IP-hash
├── SSL Termination : Let's Encrypt auto
├── Health checks : HTTP/TCP
├── Pricing : 19€/mois par LB
└── Statut : ✅ Production

FIREWALL
├── Type : Software firewall par VM
├── Rules : Stateful, allow/deny
├── Default : All outbound, SSH inbound only
├── Management : Console + API
└── Statut : ✅ Production

VPN / PRIVATE NETWORK
├── Type : VLAN isolation
├── Private IPs : 10.x.x.x range
├── Inter-DC : Non (same DC only)
├── VPN client : WireGuard recommandé
└── Statut : ✅ Production

CDN
├── Provider : BunnyCDN (intégration)
├── PoPs : 100+ worldwide
├── Pricing : À la consommation
├── Integration : Simple (CNAME)
└── Statut : ✅ Available

DNS
├── Provider : OVH DNS / Cloudflare
├── Management : Via console
├── Records : A, AAAA, CNAME, MX, TXT, SRV
└── Statut : ✅ Production
```

### 6.3 Performance réseau

```
BENCHMARKS RÉSEAU
─────────────────

BANDWIDTH PAR VM (par défaut)
├── VPS Starter : 1 Gbps
├── VPS Business : 2 Gbps
├── VPS Enterprise : 5 Gbps
├── GPU instances : 10 Gbps
└── Dedicated : Configurable

LATENCY
├── Intra-DC : < 0.5 ms
├── PAR → AMS : ~8 ms
├── PAR → FRA : ~10 ms
├── PAR → London : ~15 ms
├── PAR → US East : ~80 ms
└── PAR → Singapore : ~180 ms

BANDWIDTH INCLUS
├── Entrée (Ingress) : Illimité
├── Sortie (Egress) : 10 TB/mois inclus
├── Extra egress : 0.01€/GB
└── Inter-DC : Facturé comme egress
```

---

## 7. Sécurité Infrastructure

### 7.1 Sécurité physique (via OVH)

```
SÉCURITÉ PHYSIQUE DC OVH
────────────────────────

ACCÈS
├── Badge électronique
├── Biométrie (empreinte)
├── Escorte obligatoire
├── Logs d'accès audités
└── Caméras 24/7

CONSTRUCTION
├── Anti-intrusion : Murs renforcés
├── Anti-incendie : Détection + extinction
├── Anti-inondation : Planchers surélevés
└── Générateurs : 48h+ autonomie

CERTIFICATIONS
├── ISO 27001 ✅
├── SOC 2 Type II ✅
├── HDS (Santé) ✅ Paris
└── PCI-DSS ✅
```

### 7.2 Sécurité réseau

```
SÉCURITÉ RÉSEAU VMCLOUD
───────────────────────

PROTECTION PÉRIMÉTRIQUE
├── DDoS : OVH Anti-DDoS (automatique)
├── Firewall edge : Stateful inspection
├── Rate limiting : Configurable
└── Geo-blocking : Sur demande

SEGMENTATION
├── VLAN par client : Isolation L2
├── Security groups : Firewall par VM
├── Private networks : 10.x.x.x isolés
└── No direct internet : Opt-in only

ENCRYPTION
├── In-transit : TLS 1.3 (tout trafic)
├── At-rest : AES-256 (storage)
├── Key management : Customer-managed
└── SSL/TLS : Let's Encrypt auto

MONITORING SÉCURITÉ
├── Logs : Centralisés (90 jours)
├── Alertes : Suspicious activity
├── Audit : Sur demande
└── Compliance : RGPD ready
```

### 7.3 Sécurité applicative

```
SÉCURITÉ PLATEFORME VMCLOUD
───────────────────────────

AUTHENTIFICATION
├── Passwords : Bcrypt, min 12 chars
├── 2FA : TOTP (recommandé)
├── SSH Keys : Ed25519 / RSA-4096
├── API Keys : Scoped, rotatable
└── Sessions : 24h expiry, revocable

ACCÈS ADMIN
├── Bastion : Jump host required
├── VPN : WireGuard pour admin
├── Audit logs : Toutes actions loggées
├── Least privilege : RBAC
└── MFA obligatoire : Admins

VULNERABILITIES
├── Patching : < 7 jours critiques
├── Scanning : Hebdomadaire
├── Bug bounty : Non (prévu 2025)
└── Pentest : Annuel (externe)
```

---

## 8. SLA et Fiabilité

### 8.1 SLA Infrastructure

```
ENGAGEMENTS SLA VMCLOUD
───────────────────────

DISPONIBILITÉ
├── Compute : 99.9% SLA
│   └── Max downtime : 8.76h/an
├── Storage : 99.9% SLA
│   └── Max downtime : 8.76h/an
├── Network : 99.9% SLA
│   └── Max downtime : 8.76h/an
└── Overall : 99.9%

COMPENSATION (Crédits service)
├── 99.0% - 99.9% : 10% crédit
├── 95.0% - 99.0% : 25% crédit
├── 90.0% - 95.0% : 50% crédit
└── < 90.0% : 100% crédit (mois)

EXCLUSIONS
├── Maintenance planifiée (préavis 72h)
├── Force majeure
├── Problèmes côté client
├── Abus des ressources
└── Beta features
```

### 8.2 Historique uptime

```
UPTIME HISTORIQUE (2024)
────────────────────────

GLOBAL
├── Janvier - Juin : 99.9%
├── Juillet - Décembre : 99.9%
└── Année complète : 99.9%

PAR SERVICE
├── Compute : 99.9%
├── Storage : 99.9%
├── Network : 99.9%
└── API/Console : 99.90%

INCIDENTS MAJEURS 2024
├── Mars 2024 : Maintenance OVH Paris (2h planned)
├── Juillet 2024 : Network issue AMS (45min)
└── Octobre 2024 : Storage slowdown PAR (30min)

MTTD/MTTR
├── MTTD (Time to Detect) : < 2 minutes (automated)
├── MTTA (Time to Acknowledge) : < 5 minutes
├── MTTR (Time to Resolve) : < 30 minutes (P1)
└── MTTR (Time to Resolve) : < 4 hours (P2)
```

### 8.3 Redondance

```
ARCHITECTURE HAUTE DISPONIBILITÉ
────────────────────────────────

POWER
├── DC : 2N (double alimentation)
├── UPS : N+1 par rack
├── Générateurs : 48h+ autonomie
└── Failover : < 10ms

NETWORK
├── Dual-homed : Oui (2× uplinks)
├── BGP : Multi-path
├── DNS : GeoDNS + failover
└── Failover : < 30s

COMPUTE
├── Live migration : Supporté
├── Auto-restart : Si host fail
├── Spread policy : Anti-affinity available
└── Failover : < 5min (VM restart)

STORAGE
├── Replication : 3× (synchronous)
├── Self-healing : Automatic
├── No SPOF : Distributed
└── Failover : Transparent

CROSS-DC (Limité)
├── Active-Active : Non (pas encore)
├── DR : Backup cross-DC (async)
├── RTO : 4-24h (manual failover)
└── RPO : 24h (daily backups)
```

---

## 9. Coûts Infrastructure

### 9.1 Structure de coûts actuelle

```
COÛTS INFRASTRUCTURE (Décembre 2024)
────────────────────────────────────

SITUATION ACTUELLE (Programme OVH)
├── Crédits OVH restants : ~1,200,000€
├── Burn rate infra : ~50,000€/mois (crédits)
├── Coût réel cash : ~3,000€/mois
│   └── Bandwidth overage uniquement
└── Validité : Jusqu'à fin 2027

DÉTAIL CRÉDITS CONSOMMÉS
├── Bare metal serveurs : ~35,000€/mois
├── Storage : ~5,000€/mois
├── Network/Bandwidth : ~5,000€/mois
├── IPs additionnelles : ~2,000€/mois
├── Support : ~3,000€/mois
└── Total : ~50,000€/mois

COÛT PAR RESSOURCE (Prix OVH)
├── Serveur EPYC 256GB : ~600€/mois
├── GPU T4 : ~300€/mois
├── GPU A100 40GB : ~2,500€/mois
├── GPU A100 80GB : ~4,000€/mois
├── Storage 1TB NVMe : ~50€/mois
└── IP publique : ~3€/mois
```

### 9.2 Projection post-program (2027+)

```
COÛTS POST-OVH PROGRAM
──────────────────────

SCENARIO A : DEAL NÉGOCIÉ OVH
├── Réduction estimée : -30% vs prix public
├── Coût mensuel : ~35,000€/mois
├── Avantages : Continuité, pas de migration
└── Risque : Dépendance

SCENARIO B : COLOCATION
├── Colocation DC : ~7,500€/mois
├── Électricité : ~11,500€/mois
├── Bandwidth : ~4,000€/mois
├── Total : ~23,000€/mois
└── Note : Capex hardware à amortir

SCENARIO C : MULTI-CLOUD
├── OVH (partie) : ~15,000€/mois
├── Hetzner : ~5,000€/mois
├── Scaleway GPU : ~8,000€/mois
├── Total : ~28,000€/mois
└── Avantage : Résilience, négociation

CAPEX AMORTISSEMENT
├── Hardware actuel : ~1,528,500€
├── Amortissement 5 ans : ~25,417€/mois
├── Renouvellement prévu : 2028
└── Note : Déjà amorti (via programme OVH)
```

### 9.3 Unit economics infrastructure

```
COÛTS UNITAIRES (Base actuelle)
───────────────────────────────

COMPUTE (Prix coûtant via OVH)
├── Coût/vCPU/mois : ~1.50€
├── Coût/GB RAM/mois : ~0.80€
└── Marge potentielle : 3-5× prix coûtant

GPU (Prix coûtant)
├── T4/mois : ~300€ → Vente ~430€ (43% marge)
├── 4090/mois : ~400€ → Vente ~1,080€ (170% marge)
├── A100 40GB/mois : ~2,500€ → Vente ~2,160€ (-14% marge)*
└── *A100 vendu à perte pour attirer enterprise

STORAGE (Prix coûtant)
├── NVMe/TB/mois : ~50€ → Vente ~150€ (200% marge)
├── Object/TB/mois : ~20€ → Vente ~20€ (0% marge)
└── Note : Object storage = acquisition

NETWORK
├── Bandwidth/TB : ~5€ (inclus OVH)
├── IP/mois : ~3€ → Vente ~3€ (0% marge)
└── Egress > 10TB : 0.01€/GB
```

---

## 10. Fournisseurs et Dépendances

### 10.1 Fournisseurs critiques

| Fournisseur | Service | Criticité | Alternative | Contrat |
|-------------|---------|-----------|-------------|---------|
| **OVHcloud** | Infrastructure complète | 🔴 Critique | Hetzner, Scaleway | Programme jusqu'à 2027 |
| **NVIDIA** | GPUs (via OVH) | 🔴 Critique | AMD (MI300X) | Via OVH |
| **Cloudflare** | CDN, DNS | 🟡 Haute | Fastly, BunnyCDN | Pay-as-you-go |
| **Let's Encrypt** | SSL certificates | 🟢 Moyenne | ZeroSSL, sectigo | Gratuit |
| **AMD** | CPUs EPYC | 🟢 Moyenne | Intel (moins efficient) | Via OVH |

### 10.2 Risques de dépendance

```
ANALYSE DES RISQUES FOURNISSEURS
────────────────────────────────

RISQUE CRITIQUE : OVHcloud
├── Dépendance : 100% de l'infrastructure
├── Impact si indisponible : Service down complet
├── Probabilité : Faible (OVH stable)
├── Mitigation :
│   ├── Plan de migration documenté
│   ├── Cash reserve pour transition
│   ├── Relationships avec alternatives
│   └── Architecture portable (pas de vendor lock-in)
└── Timeline critique : Fin 2027

RISQUE MOYEN : NVIDIA
├── Dépendance : 100% des GPUs
├── Impact : Pas de nouveaux GPU clients
├── Mitigation : Évaluer AMD MI300X
└── Note : GPU shortage possible en cas de demande AI

RISQUE FAIBLE : Autres
├── Cloudflare : Alternatives disponibles
├── Let's Encrypt : Alternatives gratuites
└── Software : Open source, portable
```

### 10.3 Stratégie multi-vendor

```
STRATÉGIE DIVERSIFICATION (2025-2027)
─────────────────────────────────────

COURT TERME (2025)
├── Documenter architecture portable
├── Tester déploiement sur Hetzner (non-prod)
├── Établir contacts avec Scaleway, OVH sales
└── Pas de changement opérationnel

MOYEN TERME (2026)
├── Négociation avec OVH pour post-program
├── POC multi-cloud (si pricing défavorable)
├── Budget migration si nécessaire
└── Décision finale Q2 2026

LONG TERME (2027+)
├── Option A : Stay with OVH (deal négocié)
├── Option B : Hybrid (OVH + alternative)
├── Option C : Migration complète
└── Préférence : Option A ou B

PRINCIPES
├── Pas de vendor lock-in technique
├── APIs standard (S3, K8s, etc.)
├── Infrastructure as Code (Terraform)
└── Données exportables facilement
```

---

## Annexes

### A. Spécifications serveurs détaillées

```
AMD EPYC 7003 (Milan) - CONFIG VMCLOUD
──────────────────────────────────────

CPU
├── Model : EPYC 7443P ou équivalent
├── Cores : 64
├── Threads : 128
├── Base clock : 2.85 GHz
├── Boost clock : 4.0 GHz
├── L3 Cache : 256 MB
└── TDP : 200W

MEMORY
├── Type : DDR4-3200 ECC REG
├── Capacity : 256 GB (8× 32GB)
├── Channels : 8
└── Bandwidth : 204.8 GB/s

STORAGE (Local)
├── Boot : 480 GB NVMe
├── Cache : 1.92 TB NVMe
└── Interface : PCIe 4.0

NETWORK
├── NICs : 2× 25 GbE
├── Bonding : LACP
└── Total : 50 Gbps

FORM FACTOR
├── Size : 1U
├── Power : 2× 750W PSU
└── Rack : Standard 19"
```

### B. Diagramme réseau

```
ARCHITECTURE RÉSEAU DÉTAILLÉE
─────────────────────────────

                    INTERNET
                        │
                        ▼
            ┌───────────────────────┐
            │   OVH DDoS Shield     │
            │   (1+ Tbps capacity)  │
            └───────────┬───────────┘
                        │
            ┌───────────▼───────────┐
            │   OVH Edge Routers    │
            │   (BGP, GeoDNS)       │
            └───────────┬───────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
   ┌────▼────┐    ┌─────▼────┐    ┌────▼────┐
   │ PAR-GW  │    │ AMS-GW   │    │ FRA-GW  │
   │ 40 Gbps │    │ 40 Gbps  │    │ 20 Gbps │
   └────┬────┘    └────┬─────┘    └────┬────┘
        │              │               │
   ┌────▼────┐    ┌────▼────┐    ┌────▼────┐
   │ PAR-FW  │    │ AMS-FW  │    │ FRA-FW  │
   │ (vFW)   │    │ (vFW)   │    │ (vFW)   │
   └────┬────┘    └────┬────┘    └────┬────┘
        │              │               │
   ┌────▼────────────────────────────────────┐
   │            VMCLOUD BACKBONE              │
   │         (100 Gbps, VXLAN/VLAN)          │
   └────┬────────────────┬───────────────────┘
        │                │
   ┌────▼────┐      ┌────▼────┐
   │ COMPUTE │      │ STORAGE │
   │ CLUSTER │      │ CLUSTER │
   │(60 hosts│      │ (Ceph)  │
   └─────────┘      └─────────┘
```

### C. Checklist maintenance

```
CHECKLIST MAINTENANCE PLANIFIÉE
───────────────────────────────

PRÉ-MAINTENANCE (J-7)
□ Identifier scope et impact
□ Notifier clients (email + status page)
□ Planifier fenêtre maintenance
□ Préparer runbook
□ Backup configuration

JOUR J
□ Annoncer début maintenance
□ Drainer workloads (si compute)
□ Exécuter maintenance
□ Tests post-maintenance
□ Rollback si problème

POST-MAINTENANCE
□ Annoncer fin maintenance
□ Vérifier alertes
□ Mettre à jour documentation
□ Post-mortem si incident
□ Notifier clients résolution
```

---

*Document maintenu par l'équipe Infrastructure VMCloud*
*Dernière mise à jour : Décembre 2024*
*Prochaine révision : Mars 2025*
