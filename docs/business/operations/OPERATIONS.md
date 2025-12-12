# Opérations - VMCloud

> **Source de vérité** pour les processus opérationnels et l'excellence ops
> Dernière mise à jour : Décembre 2024
> Statut : Early-stage (équipe réduite, process en construction)

---

## Executive Summary

VMCloud opère en mode **lean ops** avec une équipe technique réduite gérant l'infrastructure et le support. L'objectif est de maximiser l'automatisation pour permettre le scale sans augmentation proportionnelle de l'équipe.

```
MÉTRIQUES OPS VMCLOUD
─────────────────────

INFRASTRUCTURE
├── Clients actifs : ~10
├── VMs en production : ~80
├── GPU instances : ~20
└── Uptime (2024) : 99.9%

INCIDENTS
├── P0 (critiques) / an : 0
├── P1 (majeurs) / an : 2
├── P2 (modérés) / mois : 1-2
├── MTTR moyen : < 30 min
└── MTTD : < 2 min (automated)

ÉQUIPE OPS
├── SRE : 1 contractor (15.4K€/mois)
├── Support : Fondateur + CRE
├── On-call : 24/7 via astreinte
└── Ratio clients/ops : 10:1 (cible 100:1)
```

---

## 1. Vue d'ensemble des Opérations

### 1.1 Périmètre opérationnel

```
SCOPE OPERATIONS VMCLOUD
────────────────────────

SERVICES MANAGÉS
├── VPS (Compute) : 8 tiers
├── GPU Cloud : 4 types GPUs
├── Web Hosting : 3 tiers
├── PaaS : Containers, apps
├── Load Balancer : HAProxy
├── Block Storage : Ceph
├── Object Storage : S3-compatible
└── CDN : BunnyCDN integration

PÉRIMÈTRE RESPONSABILITÉ
├── Infrastructure physique : OVH (provider)
├── Virtualisation : VMCloud
├── Network L3+ : VMCloud
├── Storage : VMCloud
├── Backup : VMCloud
├── Monitoring : VMCloud
├── Support : VMCloud
└── Billing : VMCloud

HORS PÉRIMÈTRE
├── Hardware (via OVH)
├── DC facilities (via OVH)
├── Contenu client (responsabilité client)
└── Applications client (responsabilité client)
```

### 1.2 Organisation ops actuelle

```
STRUCTURE ÉQUIPE OPS
────────────────────

PHASE ACTUELLE (Early-stage)

         ┌─────────────────┐
         │    FONDATEUR    │
         │   (CEO/CTO)     │
         └────────┬────────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
┌───▼───┐   ┌─────▼─────┐   ┌───▼───┐
│  SRE  │   │    CRE    │   │ DEVS  │
│       │   │(Customer  │   │(Part- │
│15.4K€ │   │ Rel Eng)  │   │ time) │
│/mois  │   │  4K€/mois │   │       │
└───┬───┘   └─────┬─────┘   └───────┘
    │             │
    ├─────────────┤
    │             │
┌───▼───────────────────────────┐
│      RESPONSABILITÉS          │
├───────────────────────────────┤
│ SRE:                          │
│ - Infrastructure              │
│ - Monitoring                  │
│ - Incidents P0/P1             │
│ - Automatisation              │
│                               │
│ CRE:                          │
│ - Support client L1/L2        │
│ - Onboarding                  │
│ - Tickets non-techniques      │
│                               │
│ Fondateur:                    │
│ - Escalation P0               │
│ - Décisions architecture      │
│ - Support Enterprise          │
└───────────────────────────────┘

ÉQUIPE CIBLE (MRR > 50K€)
├── SRE Lead : 1
├── SRE Junior : 1
├── Support Lead : 1
├── Support Agent : 1
└── DevOps : 1
```

---

## 2. Monitoring et Alerting

### 2.1 Stack de monitoring

```
STACK MONITORING VMCLOUD
────────────────────────

MÉTRIQUES INFRASTRUCTURE
├── Collecte : Prometheus
├── Storage : Victoria Metrics (long-term)
├── Visualisation : Grafana
├── Coverage : 100% des hosts
└── Rétention : 90 jours detail, 1 an aggregated

LOGS
├── Collecte : Fluentd / Vector
├── Storage : Loki (Grafana stack)
├── Search : LogQL
├── Coverage : 100% des services
└── Rétention : 30 jours

UPTIME / SYNTHETICS
├── Tool : UptimeRobot + internal
├── Endpoints : 50+ monitored
├── Fréquence : 1 minute
├── Alertes : Slack + PagerDuty
└── Status page : status.vmcloud.com

APM / TRACES (Limité)
├── Tool : Jaeger (internal APIs only)
├── Coverage : ~30%
├── Usage : Debug, non systematique
└── Roadmap : Expand in 2025

CLIENT METRICS
├── Dashboard client : Basic (CPU, RAM, disk)
├── Alertes client : Non (roadmap)
├── Métriques custom : Non
└── Roadmap : Client alerting Q2 2025
```

### 2.2 Dashboards

```
DASHBOARDS OPÉRATIONNELS
────────────────────────

DASHBOARD PRINCIPAL (NOC)
├── Vue globale : Santé de tous les services
├── Alertes actives : Liste temps réel
├── Capacité : CPU, RAM, Storage, Network
└── Clients impactés : Si incident

DASHBOARDS PAR SERVICE
├── Compute : VMs par DC, utilisation, migrations
├── Storage : Capacité Ceph, latency, IOPS
├── Network : Bandwidth, packets, errors
├── GPU : Allocation, température, utilisation
└── API : Requests, latency, errors

DASHBOARDS BUSINESS
├── Clients actifs : Nombre, growth
├── VMs : Total, créées/supprimées
├── Revenue : MRR, usage
└── Support : Tickets, SLA

DASHBOARDS CLIENT (Self-service)
├── VM metrics : CPU, RAM, Disk, Network
├── Status : Up/Down
├── Console : SSH, VNC
└── Logs : Limité (roadmap)

ACCÈS
├── Team : Grafana interne
├── Clients : Console VMCloud
├── Public : status.vmcloud.com
└── Alertes : Slack #alerts, PagerDuty
```

### 2.3 Alerting

```
NIVEAUX D'ALERTE
────────────────

P0 - CRITIQUE (Service down)
├── Définition : Service client totalement indisponible
├── Exemples : DC down, API down, Storage down
├── Response time : < 5 minutes
├── Notification : PagerDuty + Phone + Slack
├── Escalation : Immédiate à SRE + Fondateur
└── Target MTTR : < 30 minutes

P1 - HIGH (Dégradation majeure)
├── Définition : Fonctionnalité majeure impactée
├── Exemples : Network degraded, VM provisionning slow
├── Response time : < 15 minutes
├── Notification : PagerDuty + Slack
├── Escalation : SRE, puis Fondateur si > 1h
└── Target MTTR : < 2 heures

P2 - MEDIUM (Impact limité)
├── Définition : Fonctionnalité mineure impactée
├── Exemples : Monitoring gap, Console slow
├── Response time : < 1 heure
├── Notification : Slack only
├── Escalation : Heures ouvrées
└── Target MTTR : < 24 heures

P3 - LOW (Cosmétique)
├── Définition : Pas d'impact utilisateur
├── Exemples : Log errors, deprecation warnings
├── Response time : Next business day
├── Notification : Email / ticket
├── Escalation : Weekly review
└── Target MTTR : 1 semaine

ROUTING ALERTES
├── P0/P1 : PagerDuty → SRE on-call → Phone
├── P2 : Slack #alerts → Review heures ouvrées
├── P3 : Email / Jira → Backlog
└── Business hours : Slack notification to all
```

---

## 3. Gestion des Incidents

### 3.1 Process incident

```
INCIDENT MANAGEMENT PROCESS
───────────────────────────

1. DÉTECTION (< 2 min)
├── Source : Automated (90%) / Client report (10%)
├── Alerting : Prometheus → AlertManager → PagerDuty
├── Auto-ack : Si pas d'ack dans 5 min, escalate
└── Notification : Slack #incidents

2. TRIAGE (< 5 min)
├── Responsable : On-call SRE
├── Actions :
│   ├── Identifier le service impacté
│   ├── Évaluer la sévérité (P0-P3)
│   ├── Identifier les clients impactés
│   └── Décider : Fix vs Escalate vs Monitor
└── Communication : Update Slack, status page si P0/P1

3. INVESTIGATION (Time-boxed)
├── P0 : Max 15 min avant escalation
├── P1 : Max 30 min avant escalation
├── Tools : Grafana, Logs, SSH access
└── Documentation : Notes en temps réel

4. RESOLUTION
├── Fix identifié : Apply + Verify
├── Rollback si applicable
├── Workaround si fix long
└── Confirm with monitoring

5. POST-INCIDENT
├── Notification : Clients + Status page
├── Post-mortem : Obligatoire si P0/P1
├── Timeline : Post-mortem dans 48h
└── Actions : Assign preventive tasks

6. CLOSURE
├── Incident closed dans le tracker
├── Client communication if needed
├── Metrics updated
└── Lessons learned shared
```

### 3.2 Astreintes (On-call)

```
ORGANISATION ON-CALL
────────────────────

COVERAGE
├── Heures : 24/7/365
├── Rotation : Hebdomadaire
├── Équipe : SRE + Fondateur (backup)
└── Vacances : Swap anticipé

SCHEDULE
├── Primary : SRE contractor
├── Secondary : Fondateur (CTO)
├── Escalation : CEO si besoin
└── Response SLA : < 15 min

COMPENSATION
├── Astreinte base : Inclus dans contrat SRE
├── Intervention nuit/WE : 1.5× si > 1h
├── P0 incidents : Bonus si résolu < MTTR
└── Budget on-call : ~500€/mois extra

OUTILS
├── Alerting : PagerDuty
├── Communication : Slack + Phone
├── Access : VPN + Bastion (depuis n'importe où)
├── Runbooks : Notion / GitHub
└── War room : Google Meet (si besoin)

ESCALATION PATH
├── T+0 : Alerte PagerDuty
├── T+5 min : Phone call si pas d'ack
├── T+15 min : Escalate au secondary
├── T+30 min : Escalate au CEO
└── T+60 min : All hands
```

### 3.3 Métriques incidents

```
KPIS INCIDENT MANAGEMENT
────────────────────────

VOLUME
├── Incidents P0-P1 / an : Cible < 5
├── Incidents P2 / mois : Cible < 3
├── False positives / mois : Cible < 10
└── Client-reported : Cible < 20%

TEMPS
├── MTTD (Time to Detect) : Cible < 2 min
├── MTTA (Time to Acknowledge) : Cible < 5 min
├── MTTR P0 : Cible < 30 min
├── MTTR P1 : Cible < 2h
├── MTTR P2 : Cible < 24h
└── Post-mortem completion : < 48h

QUALITÉ
├── SLA breaches / an : Cible 0
├── Repeat incidents : Cible < 10%
├── Root cause identified : > 95%
└── Preventive actions completed : > 80%

ACTUEL (2024)
├── P0 incidents : 0
├── P1 incidents : 2
├── MTTR moyen : ~25 min
├── Client-reported : ~15%
└── SLA breaches : 0
```

---

## 4. Change Management

### 4.1 Process de déploiement

```
DEPLOYMENT PROCESS
──────────────────

ENVIRONNEMENTS
├── Dev : Local / feature branches
├── Staging : staging.vmcloud.com (isolated)
├── Production : vmcloud.com
└── Canary : 5% traffic (pour changes majeurs)

FRÉQUENCE DE DEPLOY
├── API/Backend : 2-5× / semaine
├── Frontend : 2-3× / semaine
├── Infrastructure : Hebdomadaire (maintenance window)
└── Database : Ad-hoc (avec review)

CI/CD PIPELINE
├── Source : GitHub
├── CI : GitHub Actions
├── Tests : Unit + Integration (80% coverage)
├── Build : Docker images
├── Registry : Harbor (private)
├── Deploy : Kubernetes (K3s)
└── Monitoring : Auto-rollback si errors spike

VALIDATION REQUISE
├── Code review : 1 approval minimum
├── Tests : All green
├── Staging : 1h minimum
├── Security scan : Trivy (containers)
└── Manual QA : Pour features majeures
```

### 4.2 Types de changements

```
CLASSIFICATION DES CHANGES
──────────────────────────

STANDARD (Low risk)
├── Définition : Changes pré-approuvés, routine
├── Exemples : Dependency updates, minor fixes
├── Approval : Auto (via CI/CD)
├── Lead time : < 1 jour
├── Rollback : Automatique
└── Window : Anytime

NORMAL (Medium risk)
├── Définition : Features, modifications significatives
├── Exemples : New feature, API change, config change
├── Approval : Code review + QA
├── Lead time : 1-3 jours
├── Rollback : < 5 min (container rollback)
└── Window : Business hours préféré

EMERGENCY (Hotfix)
├── Définition : Fix critique, security patch
├── Exemples : Bug bloquant, vulnérabilité
├── Approval : 1 approver + post-review
├── Lead time : < 4 heures
├── Rollback : Préparé avant deploy
└── Window : Immédiat

MAJOR (High risk)
├── Définition : Infrastructure, DB migrations
├── Exemples : DC migration, schema change, major upgrade
├── Approval : CTO + review complet
├── Lead time : 1-2 semaines
├── Rollback : Plan documenté, testé
└── Window : Maintenance window (dimanche 3h-6h)
```

### 4.3 Maintenance windows

```
MAINTENANCE PLANIFIÉE
─────────────────────

SCHEDULE
├── Window régulière : Dimanche 03:00-06:00 CET
├── Fréquence : Hebdomadaire (si nécessaire)
├── Durée max : 3 heures
└── Client notification : 72h minimum (email + status page)

TYPES DE MAINTENANCE
├── Security patches : Mensuel
├── OS updates : Trimestriel
├── Hardware maintenance : Via OVH (rare)
├── Database maintenance : Mensuel
└── Major upgrades : Trimestriel

PROCESS
├── J-7 : Planification et communication
├── J-3 : Reminder clients
├── J-1 : Préparation, tests en staging
├── J : Exécution + monitoring
├── J+1 : Vérification, post-maintenance report
└── Post : Update changelog

IMPACT MINIMISÉ
├── Rolling updates : Oui (zero downtime)
├── Live migration VMs : Oui
├── Storage maintenance : Online (Ceph)
├── Network changes : < 30s interruption
└── Full DC maintenance : Très rare, avec migration
```

---

## 5. Capacity Planning

### 5.1 Capacité actuelle

```
UTILISATION DES RESSOURCES
──────────────────────────

COMPUTE
├── vCPUs total : 6,000 (allocable)
├── vCPUs utilisés : ~800 (13%)
├── RAM total : 14 TB (allocable)
├── RAM utilisée : ~2 TB (14%)
└── Headroom : 80%+ disponible

GPU
├── Total : 85 units
├── Utilisés : ~35 (40%)
├── T4 : 10/25 (40%)
├── 4090 : 15/20 (75%) - Hackboot
├── A100 40GB : 8/30 (27%)
├── A100 80GB : 2/10 (20%)
└── Headroom : 60% disponible

STORAGE
├── Total : 100 TB brut (~33 TB usable)
├── Utilisé : ~8 TB (24%)
└── Headroom : 75%+ disponible

NETWORK
├── Bandwidth : 100 Gbps
├── Peak usage : ~10 Gbps
└── Headroom : 90%
```

### 5.2 Projections et seuils

```
CAPACITY PLANNING
─────────────────

SEUILS D'ALERTE
├── CPU > 60% : Yellow (plan expansion)
├── CPU > 80% : Red (urgent expansion)
├── RAM > 70% : Yellow
├── RAM > 85% : Red
├── Storage > 70% : Yellow
├── Storage > 85% : Red
├── GPU > 70% : Yellow (popular models)
└── GPU > 90% : Red

LEAD TIME EXPANSION
├── Compute (via OVH) : 2-4 semaines
├── GPU (via OVH) : 4-8 semaines
├── Storage : 1-2 semaines
└── Network : 1 semaine

PROJECTIONS (2025)
├── Clients : 10 → 200
├── vCPU usage : 800 → 4,000 (66%)
├── GPU usage : 35 → 70 (82%)
├── Storage : 8 TB → 30 TB (90%)
└── Action : Commander GPU Q2 si croissance

BUDGET CAPACITY
├── Dans programme OVH : Via crédits
├── Extra compute : ~600€/serveur/mois
├── Extra GPU : 300-4000€/GPU/mois
└── Reserve : Demander avant 70% usage
```

### 5.3 Process capacity review

```
CAPACITY REVIEW PROCESS
───────────────────────

WEEKLY
├── Check utilisation dashboards
├── Identify trends
├── Flag si > 60% sur ressource

MONTHLY
├── Capacity report
├── Forecast next 3 months
├── Order si needed (lead time)

QUARTERLY
├── Review annuelle extrapolation
├── Budget planning
├── Infrastructure roadmap update

TRIGGERS D'ACTION
├── > 60% utilisation : Planning
├── > 70% utilisation : Order process
├── > 80% utilisation : Emergency order
├── Customer request large : Pre-provision
└── New DC : 6+ months planning
```

---

## 6. Backup et Disaster Recovery

### 6.1 Stratégie de backup

```
BACKUP STRATEGY VMCLOUD
───────────────────────

VMS CLIENTS (Block storage)
├── Fréquence : Daily (automated)
├── Type : Incremental snapshots
├── Rétention : 7 jours default
├── Extended : 30 jours (option payante)
├── Localisation : Same DC
├── Off-site : Weekly to different DC
└── Restore : Self-service via console

DATABASES (Platform)
├── Fréquence : Every 6 hours
├── Type : Full + WAL shipping (Postgres)
├── Rétention : 30 jours
├── Localisation : Cross-DC
├── Point-in-time recovery : Oui
└── Test restore : Mensuel

CONFIGURATION
├── Infrastructure as Code : Git (GitHub)
├── Secrets : HashiCorp Vault
├── Config : Ansible playbooks
├── State : Terraform state (encrypted)
└── Backup : Git + off-site

LOGS
├── Rétention : 30 jours (Loki)
├── Archive : 90 jours (S3 glacier)
└── Critical logs : 1 an

BILLING / BUSINESS DATA
├── Database : Postgres backup
├── Invoices : PDF stored S3
├── Rétention : 10 ans (legal)
└── Localisation : Multi-DC
```

### 6.2 Tests de restauration

```
RESTORE TESTING
───────────────

VM RESTORE
├── Fréquence : Mensuel
├── Process : Restore random VM to test env
├── Validation : Boot, data integrity
├── Dernier test : [À documenter]
├── RTO testé : < 30 min
└── RPO testé : 24h (daily backup)

DATABASE RESTORE
├── Fréquence : Mensuel
├── Process : Restore to staging
├── Validation : Query tests, data check
├── Dernier test : [À documenter]
├── RTO testé : < 1h
└── RPO testé : < 6h (WAL)

FULL DR TEST
├── Fréquence : Annuel
├── Process : Simuler perte d'un DC
├── Scope : Recovery dans DC secondaire
├── Dernier test : [À planifier]
├── RTO cible : 4-8h
└── RPO cible : 24h
```

### 6.3 Disaster Recovery

```
DR SCENARIOS ET RÉPONSES
────────────────────────

SCENARIO 1 : PANNE SERVEUR
├── Impact : VMs sur ce host down
├── Détection : < 1 min (health check)
├── Recovery : Auto-restart sur autre host
├── RTO : < 5 min
├── RPO : 0 (storage intact)
└── Action : Automatique

SCENARIO 2 : PANNE RACK
├── Impact : ~10 serveurs down
├── Détection : < 1 min
├── Recovery : Migration VMs vers autres racks
├── RTO : < 30 min
├── RPO : 0 (storage distributed)
└── Action : Automatique + vérification

SCENARIO 3 : PANNE STORAGE
├── Impact : Données inaccessibles
├── Détection : < 1 min
├── Recovery : Ceph self-healing (si partiel)
├── RTO : Variable (minutes à heures)
├── RPO : 0 (3× replication)
└── Action : Monitor + intervenir si nécessaire

SCENARIO 4 : PANNE DC ENTIER
├── Impact : Tous les clients du DC
├── Détection : < 1 min
├── Recovery :
│   ├── Communication immédiate
│   ├── Failover vers DC secondaire (manuel)
│   ├── Restore depuis backup off-site
│   └── Client notification pour reconfiguration
├── RTO : 4-24h (manual process)
├── RPO : 24h (daily off-site backup)
└── Action : Manuel, CEO involved

SCENARIO 5 : CYBERATTAQUE
├── Impact : Variable
├── Détection : Monitoring sécurité
├── Recovery :
│   ├── Isoler les systèmes affectés
│   ├── Forensics
│   ├── Restore from clean backups
│   └── Security audit
├── RTO : 24-72h
├── RPO : Dernier backup clean
└── Action : Incident response plan
```

---

## 7. Automatisation

### 7.1 Infrastructure as Code

```
IaC STACK VMCLOUD
─────────────────

PROVISIONING
├── Tool : Terraform
├── Provider : OVH, Cloudflare
├── State : Terraform Cloud (encrypted)
├── Modules : Réutilisables par service
└── Coverage : 90% de l'infra

CONFIGURATION
├── Tool : Ansible
├── Inventory : Dynamic (from Terraform)
├── Playbooks : Par role (web, db, monitoring)
├── Secrets : Ansible Vault + HashiCorp Vault
└── Coverage : 100% des hosts

CONTAINERS
├── Orchestration : Kubernetes (K3s)
├── Manifests : Helm charts
├── GitOps : ArgoCD
├── Images : Harbor registry
└── Coverage : 100% des apps

DOCUMENTATION
├── All IaC in Git
├── PRs required for changes
├── Automated documentation
└── Drift detection : Terraform plan scheduled
```

### 7.2 CI/CD Pipeline

```
CI/CD ARCHITECTURE
──────────────────

SOURCE → BUILD → TEST → DEPLOY
   │        │       │       │
GitHub → Actions → Tests → K8s
   │        │       │       │
   │    Docker    Unit    ArgoCD
   │    Build     Integration
   │              E2E
   │
   └── Feature branch workflow

PIPELINE STAGES
├── 1. Lint & Format : < 1 min
├── 2. Build : < 3 min
├── 3. Unit tests : < 5 min
├── 4. Integration tests : < 10 min
├── 5. Security scan : < 3 min
├── 6. Build Docker image : < 5 min
├── 7. Push to registry : < 1 min
├── 8. Deploy to staging : < 2 min
├── 9. E2E tests : < 10 min
├── 10. Manual approval (if needed)
├── 11. Deploy to production : < 2 min
└── Total : ~30-45 min

ROLLBACK
├── Type : Kubernetes rollback
├── Trigger : Manual ou auto (error rate)
├── Time : < 1 min
└── Verification : Health checks
```

### 7.3 Self-healing et automation

```
AUTOMATION CAPABILITIES
───────────────────────

SELF-HEALING
├── VM auto-restart : Si host fail
├── Container restart : Kubernetes liveness
├── Service restart : Systemd watchdog
├── Storage : Ceph auto-repair
└── Network : BGP failover

AUTO-SCALING (Roadmap)
├── VM scaling : Non (manual)
├── Container scaling : Kubernetes HPA
├── Storage scaling : Non (manual)
└── Roadmap : VM auto-scale Q3 2025

AUTO-REMEDIATION
├── Disk full : Cleanup old logs
├── High memory : Restart service
├── Certificate expiry : Auto-renew
├── Failed deployment : Auto-rollback
└── DDoS : OVH auto-mitigation

SCHEDULED TASKS
├── Backups : Daily 02:00 UTC
├── Cleanup : Daily 04:00 UTC
├── Certificate renewal : Weekly check
├── Security updates : Weekly scan
├── Capacity report : Daily
└── Health report : Hourly
```

---

## 8. Documentation Opérationnelle

### 8.1 Runbooks

```
RUNBOOKS VMCLOUD
────────────────

STRUCTURE
├── Title : Description claire
├── Trigger : Quand utiliser
├── Prerequisites : Accès requis
├── Steps : Étapes numérotées
├── Verification : Comment vérifier succès
├── Rollback : En cas de problème
└── Contact : Qui escalader

RUNBOOKS EXISTANTS
├── VM Provisioning : Créer une VM manuellement
├── VM Migration : Migrer VM entre hosts
├── Storage Expansion : Ajouter capacité Ceph
├── Network Debug : Troubleshoot network issues
├── Database Restore : Restaurer Postgres
├── Certificate Renewal : Manual renewal
├── DDoS Response : Gérer une attaque
├── Customer Onboarding : Setup nouveau client
└── Incident Response : Process incidents

LOCALISATION
├── Source : GitHub repo /runbooks
├── Format : Markdown
├── Accès : Équipe technique
└── Backup : Notion (copie)

MAINTENANCE
├── Review : Trimestriel
├── Update : À chaque changement
├── Owner : SRE
└── Testing : Post-incident validation
```

### 8.2 Documentation technique

```
DOCUMENTATION TECHNIQUE
───────────────────────

ARCHITECTURE
├── Document : ARCHITECTURE.md
├── Statut : ✅ À jour
├── Contenu : Diagrammes, décisions, stack
└── Localisation : GitHub /docs

NETWORK
├── Document : NETWORK.md
├── Statut : ✅ À jour
├── Contenu : Diagramme réseau, IPs, VLANs
└── Localisation : GitHub /docs

API
├── Document : api.vmcloud.com/docs
├── Statut : ✅ À jour (auto-generated)
├── Format : OpenAPI / Swagger
└── Coverage : 100% endpoints

SECURITY
├── Document : SECURITY.md
├── Statut : 🔄 En cours
├── Contenu : Policies, procedures
└── Localisation : GitHub /docs (private)

DISASTER RECOVERY
├── Document : DR-PLAN.md
├── Statut : 🔄 À compléter
├── Contenu : Scenarios, procedures
└── Localisation : GitHub /docs

ONBOARDING (New ops team member)
├── Document : ONBOARDING.md
├── Statut : ✅ À jour
├── Contenu : Accès, tools, training
└── Durée : 2 semaines
```

---

## 9. Vendor Management

### 9.1 Fournisseurs critiques

```
FOURNISSEURS OPÉRATIONNELS
──────────────────────────

INFRASTRUCTURE
├── OVHcloud
│   ├── Service : Bare metal, Network
│   ├── Criticité : 🔴 Critique
│   ├── SLA : 99.9%
│   ├── Contact : Account manager + Support
│   └── Contrat : Startup Program (2027)

MONITORING / ALERTING
├── PagerDuty
│   ├── Service : Incident management
│   ├── Criticité : 🟡 Haute
│   ├── Alternative : Opsgenie
│   └── Coût : ~$30/user/mois

├── Grafana Cloud (optionnel)
│   ├── Service : Metrics, logs (backup)
│   ├── Criticité : 🟢 Moyenne
│   └── Coût : Free tier

SECURITY
├── Cloudflare
│   ├── Service : DNS, CDN (optionnel)
│   ├── Criticité : 🟢 Moyenne
│   └── Coût : Free - $200/mois

├── Let's Encrypt
│   ├── Service : SSL certificates
│   ├── Criticité : 🟢 Moyenne
│   ├── Alternative : ZeroSSL
│   └── Coût : Gratuit

CDN
├── BunnyCDN
│   ├── Service : Content delivery
│   ├── Criticité : 🟢 Moyenne
│   └── Coût : Usage-based (~$50/mois)
```

### 9.2 Risques fournisseurs

```
MATRICE DE RISQUE FOURNISSEURS
──────────────────────────────

                    Impact
                    Low      Med      High
              ┌─────────┬─────────┬─────────┐
Probabilité   │Cloudflare│         │         │
High          │Let'sEncr│         │         │
              ├─────────┼─────────┼─────────┤
Medium        │ BunnyCDN│PagerDuty│  OVH    │
              │         │         │ (2027)  │
              ├─────────┼─────────┼─────────┤
Low           │  Other  │         │ NVIDIA  │
              │         │         │ shortage│
              └─────────┴─────────┴─────────┘

MITIGATION OVH (CRITIQUE)
├── Timeline : 2027 (fin programme)
├── Actions :
│   ├── 2025 : Documenter infra portable
│   ├── 2026 : POC alternatives
│   ├── 2026-Q2 : Négociation OVH
│   └── 2027 : Exécution plan choisi
└── Budget migration : 50-100K€ reserve
```

---

## 10. Roadmap Opérations

### 10.1 Court terme (Q1-Q2 2025)

```
OBJECTIFS Q1-Q2 2025
────────────────────

MONITORING
├── [ ] Client alerting (notifications custom)
├── [ ] Dashboard client amélioré
├── [ ] Metrics retention 1 an
└── Budget : ~200€/mois

AUTOMATION
├── [ ] Auto-scaling containers
├── [ ] Automated certificate management
├── [ ] Self-service backup restore
└── Budget : Dev time

PROCESS
├── [ ] Runbooks review & update
├── [ ] DR test (annual)
├── [ ] Security audit
└── Budget : 5K€ (external audit)

ÉQUIPE
├── [ ] SRE contractor : Maintain
├── [ ] CRE : Maintain
└── Trigger hire : MRR > 30K€
```

### 10.2 Moyen terme (Q3-Q4 2025)

```
OBJECTIFS Q3-Q4 2025
────────────────────

SCALE
├── [ ] Hire SRE #2 (si MRR > 50K€)
├── [ ] Implement on-call rotation
├── [ ] 24/7 support coverage
└── Budget : ~60K€/an

FEATURES
├── [ ] VM auto-scaling
├── [ ] Multi-DC failover
├── [ ] Managed databases
└── Budget : Dev time

COMPLIANCE
├── [ ] ISO 27001 preparation
├── [ ] SOC 2 preparation
├── [ ] Security program formalisé
└── Budget : 20-50K€
```

### 10.3 Long terme (2026+)

```
VISION OPERATIONS 2026+
───────────────────────

ÉQUIPE
├── SRE Lead + 1-2 SRE
├── Support team (2-3)
├── DevOps / Platform engineer
└── Security specialist

CAPABILITIES
├── Multi-DC active-active
├── Zero-downtime everything
├── Automated DR
├── AI-assisted ops
└── NoOps pour clients (fully managed)

MÉTRIQUES CIBLES
├── Uptime : 99.9%
├── MTTR : < 15 min
├── Client/Ops ratio : 200:1
├── Automation : 95%
└── Zero P0 incidents
```

---

*Document maintenu par l'équipe Operations VMCloud*
*Dernière mise à jour : Décembre 2024*
*Prochaine révision : Mars 2025*
