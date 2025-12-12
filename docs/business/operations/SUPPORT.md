# Support Client - VMCloud

> **Source de vérité** pour l'organisation et les processus de support client
> Dernière mise à jour : Décembre 2024
> Statut : Early-stage (support réactif, différenciateur clé)

---

## Executive Summary

Le support client est le **différenciateur principal** de VMCloud face aux géants du cloud. La promesse : un support humain, réactif et expert, accessible à tous les clients sans surcoût premium.

```
MÉTRIQUES SUPPORT VMCLOUD
─────────────────────────

PERFORMANCE
├── Temps première réponse : < 4h (cible < 2h)
├── CSAT : > 90%
├── Résolution premier contact : 70%
├── Tickets/mois : ~20 (early stage)
└── Backlog : 0 (real-time)

ÉQUIPE
├── Support L1/L2 : CRE (4K€/mois)
├── Support L3 : SRE + Fondateur
├── Coverage : 9h-18h CET + on-call
└── Langues : FR, EN

CANAUX
├── Principal : Email / Tickets
├── Secondaire : Live chat
├── Enterprise : Direct Slack
└── Self-service : Docs, FAQ
```

---

## 1. Organisation du Support

### 1.1 Structure actuelle

```
ORGANISATION SUPPORT VMCLOUD
────────────────────────────

PHASE ACTUELLE (Early-stage)

┌─────────────────────────────────────────────┐
│                  CLIENTS                     │
└─────────────────────┬───────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
   ┌─────────┐   ┌─────────┐   ┌─────────┐
   │  EMAIL  │   │  CHAT   │   │  DOCS   │
   │ Tickets │   │  Live   │   │  FAQ    │
   └────┬────┘   └────┬────┘   └────┬────┘
        │             │             │
        └──────┬──────┘             │
               │                    │
        ┌──────▼──────┐       ┌─────▼─────┐
        │    L1/L2    │       │   SELF    │
        │    CRE      │       │  SERVICE  │
        │  4K€/mois   │       │   AUTO    │
        └──────┬──────┘       └───────────┘
               │
        ┌──────▼──────┐
        │    L3       │
        │ SRE/Founder │
        │ Escalation  │
        └─────────────┘

RÉPARTITION RESPONSABILITÉS
├── CRE (Customer Relationship Engineer)
│   ├── L1 : Triage, questions basiques
│   ├── L2 : Support technique, config
│   ├── Onboarding nouveaux clients
│   └── Monitoring satisfaction
│
├── SRE (Escalation L3)
│   ├── Problèmes infrastructure
│   ├── Bugs complexes
│   └── Incidents

└── Fondateur
    ├── Escalation ultime
    ├── Clients Enterprise
    └── Feedback produit
```

### 1.2 Équipe cible

| Phase | MRR trigger | Équipe support | Coverage |
|-------|-------------|----------------|----------|
| **Actuelle** | < 20K€ | 1 CRE + Fondateur | 9h-18h + on-call |
| **Phase 2** | 20-50K€ | 1 Lead + 1 Agent | 8h-20h |
| **Phase 3** | 50-100K€ | 1 Lead + 2 Agents | 7h-22h |
| **Phase 4** | > 100K€ | Team 4-5 + Manager | 24/7 |

### 1.3 Coverage actuel

```
HEURES DE SUPPORT
─────────────────

STANDARD (Tous clients)
├── Lundi - Vendredi : 09:00 - 18:00 CET
├── Samedi : 10:00 - 14:00 CET (limité)
├── Dimanche / Jours fériés : On-call urgences uniquement
└── Temps de réponse : < 4 heures

URGENCES (24/7)
├── Définition : Service client down (P0/P1)
├── Canal : Email avec [URGENT] ou phone
├── Coverage : On-call SRE
└── Temps de réponse : < 30 minutes

LANGUES
├── Français : Support complet
├── Anglais : Support complet
├── Autre : Via traduction (best effort)
└── Note : Docs en FR et EN
```

---

## 2. Canaux de Support

### 2.1 Canaux disponibles

```
CANAUX DE SUPPORT VMCLOUD
─────────────────────────

📧 EMAIL / TICKETS (Principal)
├── Adresse : support@vmcloud.com
├── Disponibilité : 24/7 (réponse heures ouvrées)
├── SLA première réponse : < 4 heures
├── Volume : ~15 tickets/mois
├── Type de demandes : Tout
└── Tracking : HubSpot tickets

💬 LIVE CHAT (Secondaire)
├── Outil : Crisp (prévu) ou Intercom
├── Disponibilité : 09:00-18:00 CET
├── SLA première réponse : < 5 minutes
├── Volume : ~5 conversations/mois
├── Type de demandes : Questions rapides, sales
└── Statut : À implémenter Q1 2025

📞 TÉLÉPHONE (Limité)
├── Disponibilité : Sur demande / Enterprise
├── Numéro : Pas de numéro public
├── Usage : Calls planifiés, urgences
├── Volume : < 5 calls/mois
└── Note : Pas de support phone général

💬 SLACK/DISCORD (Communauté)
├── Discord : discord.vmcloud.com
├── Slack : Pour clients Enterprise uniquement
├── Type : Communauté, entraide
├── Volume : Variable
├── Support officiel : Présence mais pas SLA
└── Statut : Discord actif, Slack Enterprise Q2 2025

📚 DOCUMENTATION (Self-service)
├── URL : docs.vmcloud.com
├── Disponibilité : 24/7
├── Articles : ~50 (cible 200)
├── Format : Markdown, searchable
└── Statut : En construction
```

### 2.2 Stratégie canaux

```
PRIORISATION DES CANAUX
───────────────────────

TIER 1 : DOCUMENTATION (Déflection)
├── Objectif : Résoudre 40% des questions
├── Investment : Contenu, search, vidéos
├── Métriques : Articles vus, helpful rate
└── Roadmap : Expand to 200 articles

TIER 2 : EMAIL/TICKETS (Standard)
├── Objectif : Canal principal, tracé
├── Investment : Process, templates
├── Métriques : Volume, SLA, CSAT
└── Note : Préféré pour traçabilité

TIER 3 : CHAT (Quick wins)
├── Objectif : Questions simples, sales
├── Investment : Bot + human handoff
├── Métriques : Response time, conversion
└── Note : Pas de support technique complexe

TIER 4 : PHONE/VIDEO (High touch)
├── Objectif : Enterprise, escalations
├── Investment : Limité (founder time)
├── Usage : Onboarding, complex issues
└── Note : Sur rendez-vous uniquement

ROUTING AUTOMATIQUE (Cible)
├── FAQ keyword → Documentation
├── Billing → Auto-reply + ticket
├── Technical → Direct to CRE
├── Urgent → Priority queue + alert
└── Enterprise → Dedicated channel
```

---

## 3. SLAs et Engagements

### 3.1 SLA par tier client

```
SLA SUPPORT PAR TIER
────────────────────

FREE / TRIAL
├── Première réponse : Best effort (< 24h)
├── Résolution P1 : Best effort
├── Résolution P2 : Best effort
├── Canaux : Email, Docs
└── Engagement : Aucun SLA contractuel

STANDARD (Payant)
├── Première réponse : < 4 heures (heures ouvrées)
├── Résolution P1 : < 8 heures
├── Résolution P2 : < 24 heures
├── Résolution P3 : < 72 heures
├── Canaux : Email, Chat, Docs
└── Engagement : SLA contractuel

BUSINESS (> 500€/mois)
├── Première réponse : < 2 heures
├── Résolution P1 : < 4 heures
├── Résolution P2 : < 12 heures
├── Résolution P3 : < 48 heures
├── Canaux : Email, Chat, Phone (planifié)
├── Extra : Account review trimestriel
└── Engagement : SLA avec crédits

ENTERPRISE (> 2K€/mois ou custom)
├── Première réponse : < 1 heure
├── Résolution P1 : < 2 heures
├── Résolution P2 : < 8 heures
├── Résolution P3 : < 24 heures
├── Canaux : Tous + Slack dédié
├── Extra : Account manager, QBR
├── Engagement : SLA custom avec pénalités
└── Note : Négocié au cas par cas
```

### 3.2 Définition des priorités

```
CLASSIFICATION DES TICKETS
──────────────────────────

P1 - CRITIQUE
├── Définition : Service totalement indisponible
├── Exemples :
│   ├── VM ne démarre pas / inaccessible
│   ├── Perte de données
│   ├── Facturation bloquante
│   └── Sécurité compromise
├── Impact : Business client bloqué
├── Response : Immédiat
└── Escalation : Auto vers SRE

P2 - HAUTE
├── Définition : Fonctionnalité majeure impactée
├── Exemples :
│   ├── Performance dégradée (> 50%)
│   ├── Feature critique ne fonctionne pas
│   ├── Problème de backup
│   └── Erreurs répétées
├── Impact : Business client affecté
├── Response : < 2h
└── Escalation : Si pas résolu en 4h

P3 - MOYENNE
├── Définition : Fonctionnalité mineure impactée
├── Exemples :
│   ├── Console lente
│   ├── Feature non-critique KO
│   ├── Question configuration
│   └── Request documentation
├── Impact : Inconfort, pas bloquant
├── Response : < 4h
└── Escalation : Si pas résolu en 24h

P4 - BASSE
├── Définition : Pas d'impact immédiat
├── Exemples :
│   ├── Feature request
│   ├── Question générale
│   ├── Feedback
│   └── Amélioration suggérée
├── Impact : Aucun
├── Response : < 24h
└── Escalation : Via product backlog
```

### 3.3 Compensation SLA

```
CRÉDITS SLA
───────────

DÉCLENCHEURS
├── Première réponse > SLA : 5% crédit mensuel
├── P1 > SLA résolution : 10% crédit mensuel
├── P2 > SLA résolution : 5% crédit mensuel
├── Multiple breaches/mois : 25% crédit max
└── Exclusion : Force majeure, client-side issues

PROCESS DE RÉCLAMATION
├── Client : Ouvre ticket "SLA breach claim"
├── Review : Dans les 5 jours ouvrés
├── Validation : Check logs et timestamps
├── Crédit : Appliqué automatiquement
└── Communication : Email confirmation

LIMITES
├── Maximum crédit : 100% d'un mois de service
├── Cash refund : Non (crédits uniquement)
├── Cumul : Pas de cumul inter-mois
└── Prescription : Réclamation sous 30 jours
```

---

## 4. Outils Support

### 4.1 Stack actuel et cible

```
STACK SUPPORT VMCLOUD
─────────────────────

ACTUEL                          CIBLE (Q2 2025)
────────                        ────────────────

TICKETING                       TICKETING
├── HubSpot (tickets)           ├── HubSpot Service Hub
├── Email direct                │   ou Zendesk/Freshdesk
└── Manual tracking             └── Full automation

LIVE CHAT                       LIVE CHAT
├── (Non implémenté)            ├── Crisp ou Intercom
└──                             ├── Bot + Human handoff
                                └── Intégration CRM

KNOWLEDGE BASE                  KNOWLEDGE BASE
├── docs.vmcloud.com            ├── docs.vmcloud.com
├── GitBook/Docusaurus          ├── Search amélioré
└── ~50 articles                ├── 200+ articles
                                └── Vidéos tutoriels

STATUS PAGE                     STATUS PAGE
├── status.vmcloud.com          ├── status.vmcloud.com
├── Manual updates              ├── Auto-incidents
└── Uptimerobot                 └── Notifications email

COMMUNICATION                   COMMUNICATION
├── Email                       ├── In-app notifications
├── Discord                     ├── Email sequences
└── Manual                      └── Automated updates

ANALYTICS                       ANALYTICS
├── Manual                      ├── Dashboard CSAT
├── Spreadsheets                ├── Ticket analytics
└── Basic                       └── SLA tracking
```

### 4.2 Intégrations clés

```
FLUX DE DONNÉES SUPPORT
───────────────────────

CLIENT ACTION
     │
     ├── Ticket email ────┐
     │                    │
     ├── Chat ───────────┼──► HELPDESK (HubSpot)
     │                    │        │
     ├── Console ────────┘        │
     │                            ▼
     │                    ┌──────────────┐
     │                    │   CRM/CX     │
     │                    │   HubSpot    │
     │                    └──────┬───────┘
     │                           │
     │            ┌──────────────┼──────────────┐
     │            │              │              │
     │            ▼              ▼              ▼
     │     ┌──────────┐   ┌──────────┐   ┌──────────┐
     │     │ PRODUCT  │   │ BILLING  │   │ METRICS  │
     │     │ Feedback │   │ Stripe   │   │ Analytics│
     │     └──────────┘   └──────────┘   └──────────┘
     │
     └── Self-service ──► DOCS (docs.vmcloud.com)
                              │
                              ▼
                        Search / FAQ
```

---

## 5. Self-Service

### 5.1 Documentation

```
KNOWLEDGE BASE VMCLOUD
──────────────────────

STRUCTURE
├── Getting Started
│   ├── Account creation
│   ├── First VM
│   ├── Console tour
│   └── Billing setup
│
├── Products
│   ├── VPS
│   ├── GPU Cloud
│   ├── Web Hosting
│   ├── Storage
│   └── Load Balancer
│
├── Guides
│   ├── Deploy WordPress
│   ├── Setup SSL
│   ├── Backup configuration
│   ├── Monitoring
│   └── Security best practices
│
├── API Reference
│   ├── Authentication
│   ├── Endpoints
│   ├── SDK (Python, Go, JS)
│   └── Webhooks
│
├── Troubleshooting
│   ├── VM issues
│   ├── Network issues
│   ├── Storage issues
│   └── Common errors
│
└── FAQ
    ├── Billing
    ├── Technical
    ├── Security
    └── Policies

MÉTRIQUES ACTUELLES
├── Articles : ~50
├── Pageviews/mois : ~500
├── Search queries : ~200/mois
├── Helpful rate : ~75%
└── Tickets avoided (est.) : 30%

OBJECTIFS 2025
├── Articles : 200
├── Vidéos : 20
├── Helpful rate : > 85%
├── Tickets avoided : > 50%
└── Multi-langue : FR + EN
```

### 5.2 Fonctionnalités self-service

```
SELF-SERVICE CONSOLE
────────────────────

DISPONIBLE
├── Reset password : ✅ Oui
├── Créer/supprimer VM : ✅ Oui
├── Voir factures : ✅ Oui
├── Modifier plan : ✅ Oui (upgrade)
├── Voir statut services : ✅ Status page
├── Métriques VM : ✅ Basique (CPU, RAM, disk)
├── Console SSH/VNC : ✅ Oui
├── Backups : ✅ Manual trigger
└── API keys : ✅ Gestion complète

EN DÉVELOPPEMENT (2025)
├── Downgrade plan : ⏳ Q1
├── Custom alerting : ⏳ Q2
├── Advanced metrics : ⏳ Q2
├── Automated backups config : ⏳ Q1
├── Invoice download batch : ⏳ Q2
└── Team management : ⏳ Q3

NON PRÉVU
├── Phone support portal
├── Video support
└── Chatbot AI (évaluation)

TAUX D'ADOPTION
├── VM management : 95%
├── Billing self-service : 80%
├── Metrics viewing : 60%
├── API usage : 30%
└── Docs consultation : 40%
```

### 5.3 Taux de déflection

```
TICKET DEFLECTION
─────────────────

OBJECTIFS
├── Questions billing : 80% self-service
├── How-to questions : 70% via docs
├── Account issues : 60% self-service
├── Technical debug : 40% via docs
└── Global deflection : 50%

ACTUEL (Estimé)
├── Deflection rate : ~30%
├── Doc helpful rate : 75%
├── FAQ coverage : 50%
└── Search success : 60%

AMÉLIORATION (2025)
├── Expand FAQ : +100 questions
├── Video tutorials : 20 videos
├── Interactive troubleshooter
├── In-app contextual help
└── Chatbot for common questions
```

---

## 6. Process Support

### 6.1 Workflow ticket

```
TICKET LIFECYCLE
────────────────

1. RÉCEPTION
├── Source : Email, Chat, Form
├── Auto-ack : Immédiat (email confirmation)
├── Création ticket : Automatique dans HubSpot
└── Notification : Slack #support

2. TRIAGE (< 15 min)
├── Responsable : CRE
├── Actions :
│   ├── Lire et comprendre le problème
│   ├── Classifier priorité (P1-P4)
│   ├── Vérifier historique client
│   └── Identifier si FAQ/known issue
└── Auto-tags : Billing, Technical, Feedback

3. ATTRIBUTION
├── P1/P2 : Immédiat, CRE ou escalation
├── P3/P4 : Queue standard
├── Spécialisé : Route vers expert si besoin
└── Note : Pas de round-robin, ownership

4. TRAITEMENT
├── CRE ownership : Du début à la fin
├── Communication : Update client à chaque étape
├── Escalation : Si besoin (voir rules)
├── Resolution : Fix ou workaround
└── Time tracking : Log temps passé

5. RÉSOLUTION
├── Confirm avec client : "Le problème est-il résolu ?"
├── Documentation : Si nouveau, créer KB article
├── Tagging : Root cause, product area
└── Notes : Résumé pour historique

6. CLÔTURE
├── CSAT survey : Envoi automatique
├── Ticket closed : Après confirmation ou 72h sans réponse
├── Stats update : Métriques mises à jour
└── Follow-up : Si nécessaire (proactif)
```

### 6.2 Escalation

```
RÈGLES D'ESCALATION
───────────────────

L1 → L2 (CRE handling)
├── Trigger :
│   ├── Question technique avancée
│   ├── Accès infrastructure requis
│   └── > 30 min sans progression
├── Action : CRE continue avec support SRE
├── Temps max : 1h avant escalation formelle
└── Owner : CRE reste owner

L2 → L3 (SRE/Engineering)
├── Trigger :
│   ├── Bug confirmé
│   ├── Problème infrastructure
│   ├── Investigation approfondie requise
│   └── P1 non résolu en 2h
├── Action : Handoff à SRE
├── Communication : CRE informe client
└── Owner : SRE, CRE suit

L3 → Management
├── Trigger :
│   ├── P0 (service down)
│   ├── Client Enterprise mécontent
│   ├── Risque churn majeur
│   └── Demande exceptionnelle
├── Action : Fondateur impliqué
├── Communication : Appel client si nécessaire
└── Owner : Fondateur

TEMPLATES ESCALATION
├── [ESCALATION] Brief du problème
├── Timeline des actions
├── Impact client (MRR, segment)
├── Tentatives de résolution
└── Aide demandée
```

### 6.3 Gestion des clients difficiles

```
POLITIQUE CLIENTS DIFFICILES
────────────────────────────

SITUATIONS DIFFICILES
├── Client insatisfait : Écoute, empathie, solution
├── Client agressif : Rester professionnel, escalade si besoin
├── Demande déraisonnable : Expliquer policies, proposer alternatives
├── Menace de churn : Escalade manager, retention offer possible
└── Abus/Harassment : Warning, puis suspension si répété

REMBOURSEMENT POLICY
├── Premiers 14 jours : Full refund, no questions
├── Problème notre faute : Pro-rata + crédits
├── Service non fourni : Remboursement partiel
├── Changement d'avis : Pas de remboursement après 14j
├── Abus : Aucun remboursement
└── Enterprise : Selon contrat

RÉSILIATION
├── Self-service : Possible à tout moment
├── Données : Export disponible 30 jours
├── Préavis : Aucun requis (mensuel)
├── Annuel : Pas de remboursement prorata
└── Litiges : Médiation possible

ESCALATION DIFFICILE
├── CRE → Fondateur si :
│   ├── Client > 500€ MRR menace churn
│   ├── Situation légale potentielle
│   ├── Bad press risk
│   └── CRE ne peut pas gérer
└── Documentation : Tout par écrit
```

---

## 7. Métriques Support

### 7.1 KPIs principaux

```
DASHBOARD MÉTRIQUES SUPPORT
───────────────────────────

VOLUME
├── Tickets créés / mois : [tracking]
├── Tickets résolus / mois : [tracking]
├── Tickets ouverts (backlog) : Cible 0
├── Tickets par client/mois : [tracking]
└── Chat conversations / mois : [à venir]

TEMPS
├── Avg First Response Time : Cible < 2h
├── Avg Resolution Time : [par priorité]
├── Avg Handle Time : [tracking]
└── SLA compliance : Cible > 95%

QUALITÉ
├── CSAT : Cible > 90%
├── NPS : Cible > 50
├── First Contact Resolution : Cible > 70%
├── Reopen rate : Cible < 5%
└── Escalation rate : [tracking]

EFFICACITÉ
├── Tickets / agent / jour : [tracking]
├── Cost per ticket : [à calculer]
├── Self-service deflection : Cible > 50%
└── Automation rate : [à implémenter]

ACTUEL VS CIBLE
├── First Response : ~3h (cible 2h)
├── CSAT : ~90% (cible 90%+)
├── FCR : ~70% (cible 70%+)
├── Backlog : ~0 (cible 0)
└── SLA compliance : ~95% (cible 95%+)
```

### 7.2 Reporting

```
CADENCE REPORTING
─────────────────

QUOTIDIEN (10 min)
├── Check backlog
├── SLA breaches ?
├── Urgent tickets ?
└── Action : Priorisation

HEBDOMADAIRE (30 min)
├── Volume cette semaine
├── CSAT scores
├── Patterns / Issues récurrents
├── Top ticket categories
└── Action : Process improvements

MENSUEL (1h)
├── Full metrics review
├── CSAT trend
├── SLA performance
├── Documentation gaps
├── Training needs
└── Report to management

TRIMESTRIEL (2h)
├── Deep dive analytics
├── Customer feedback analysis
├── Process optimization
├── Tool evaluation
├── Hiring needs
└── OKRs review
```

---

## 8. Qualité et Formation

### 8.1 Quality Assurance

```
QA SUPPORT
──────────

AUDIT TICKETS
├── Fréquence : 10% des tickets / mois
├── Critères :
│   ├── Temps de réponse respecté
│   ├── Ton professionnel et empathique
│   ├── Solution correcte et complète
│   ├── Documentation mise à jour si nécessaire
│   └── CSAT post-résolution
├── Score : /100
└── Target : > 85/100

FEEDBACK LOOP
├── CSAT survey : Automatique post-ticket
├── NPS survey : Trimestriel
├── Interviews clients : Ad-hoc (gros clients)
├── Review meetings : Mensuel (équipe)
└── Improvement backlog : Trimestriel

PROCESS QA
├── Random ticket review
├── CSAT score < 3 : Review obligatoire
├── Repeat issues : Root cause analysis
├── Customer complaint : Escalation + review
└── Positive feedback : Partage + reconnaissance
```

### 8.2 Formation

```
FORMATION SUPPORT
─────────────────

ONBOARDING (2 semaines)
├── Semaine 1 :
│   ├── Produit deep-dive (hands-on)
│   ├── Outils (HubSpot, console, etc.)
│   ├── Process et policies
│   └── Shadow experienced agent
├── Semaine 2 :
│   ├── Handle tickets supervisé
│   ├── Feedback quotidien
│   ├── Documentation procedures
│   └── First solo tickets (P3/P4)
└── Certification : Quiz produit + process

FORMATION CONTINUE
├── Product updates : À chaque release
├── Process changes : Immédiat
├── Soft skills : Trimestriel (communication, empathy)
├── Technical : Mensuel (deep-dives)
└── External : Conferences, webinars (budget)

DOCUMENTATION INTERNE
├── Runbooks support
├── FAQ internes
├── Templates réponses
├── Escalation procedures
├── Known issues tracker
└── Customer context (CRM notes)
```

---

## 9. Feedback Loop

### 9.1 Collecte feedback

```
SOURCES DE FEEDBACK
───────────────────

POST-TICKET SURVEY
├── Trigger : Ticket closed
├── Questions :
│   ├── "Êtes-vous satisfait ?" (1-5)
│   ├── "Le problème est-il résolu ?" (Y/N)
│   └── "Commentaires ?" (texte libre)
├── Response rate : ~30%
└── Action : Review < 3 stars

NPS SURVEY
├── Fréquence : Trimestriel
├── Question : "Recommanderiez-vous VMCloud ?"
├── Follow-up : "Pourquoi ?"
├── Cible : NPS > 50
└── Action : Contact detractors

INTERVIEWS CLIENTS
├── Fréquence : Mensuel (top clients)
├── Format : Call 30 min
├── Topics : Experience, improvements, roadmap
├── Owner : Fondateur ou Product
└── Output : Feature requests, testimonials

SUPPORT DATA MINING
├── Ticket tags : Product areas, issues
├── Repeat issues : Root cause analysis
├── Feature requests : Product backlog
├── Churn indicators : Alert sales
└── Positive patterns : Best practices
```

### 9.2 Action sur feedback

```
FEEDBACK → ACTION PIPELINE
──────────────────────────

FEEDBACK REÇU
     │
     ▼
┌─────────────┐
│   TRIAGE    │ ← Catégoriser (Bug, Feature, Process, Docs)
└──────┬──────┘
       │
       ├── Bug → Engineering backlog
       │
       ├── Feature → Product backlog (voting)
       │
       ├── Process → Support team review
       │
       ├── Docs → Content backlog
       │
       └── Praise → Share team + marketing

PRIORITISATION
├── Customer impact (# affected, MRR)
├── Frequency (how often mentioned)
├── Effort (quick win vs project)
├── Strategic alignment
└── Score → Roadmap

COMMUNICATION
├── Bug : Update client when fixed
├── Feature : "Thank you, added to roadmap"
├── Process : Internal change + announce
├── Docs : Publish + link client
└── Close loop : Always acknowledge
```

---

## 10. Support Premium

### 10.1 Offres support

```
TIERS DE SUPPORT
────────────────

STANDARD (Inclus - tous clients payants)
├── Prix : Inclus dans l'abonnement
├── Canaux : Email, Chat, Docs
├── SLA : < 4h première réponse
├── Heures : 9h-18h CET
├── Langue : FR, EN
└── Extra : Aucun

BUSINESS (Automatique > 500€/mois)
├── Prix : Inclus
├── Canaux : Email, Chat, Phone (planifié)
├── SLA : < 2h première réponse
├── Heures : 8h-20h CET
├── Langue : FR, EN
├── Extra :
│   ├── Account review trimestriel
│   ├── Priority queue
│   └── Direct contact agent
└── Éligibilité : Automatique (MRR)

ENTERPRISE (Sur devis)
├── Prix : À partir de 500€/mois
├── Canaux : Tous + Slack dédié
├── SLA : < 1h, custom
├── Heures : 24/7 disponible
├── Langue : FR, EN, + sur demande
├── Extra :
│   ├── Account manager dédié
│   ├── Onboarding assisté
│   ├── Architecture review
│   ├── QBR (Quarterly Business Review)
│   ├── SLA custom avec pénalités
│   └── Training on-site
└── Éligibilité : Négocié
```

### 10.2 Services additionnels

```
SERVICES SUPPORT ADD-ON
───────────────────────

ONBOARDING ASSISTÉ
├── Prix : 500€ one-time
├── Inclus :
│   ├── Call setup 1h
│   ├── Migration assistance
│   ├── Configuration review
│   └── Best practices
├── Durée : 1-2 semaines
└── Cible : Nouveaux clients Business+

ARCHITECTURE REVIEW
├── Prix : 1,000€ one-time
├── Inclus :
│   ├── Audit infrastructure client
│   ├── Recommendations
│   ├── Documentation
│   └── Call review
├── Durée : 1 semaine
└── Cible : Clients > 1K€/mois

MANAGED SERVICES (Roadmap)
├── Prix : +30% sur infrastructure
├── Inclus :
│   ├── Monitoring proactif
│   ├── Updates automatiques
│   ├── Backup management
│   └── Incident response
├── Disponibilité : Q4 2025
└── Cible : PME sans équipe IT

TRAINING
├── Prix : 200€/h
├── Format : Remote (Google Meet)
├── Topics : Produit, API, best practices
├── Min : 2h
└── Cible : Équipes clients
```

---

## 11. Roadmap Support

### 11.1 Court terme (Q1-Q2 2025)

```
OBJECTIFS Q1-Q2 2025
────────────────────

OUTILS
├── [ ] Implémenter live chat (Crisp)
├── [ ] Setup CSAT automatique
├── [ ] Dashboard métriques
└── Budget : ~100€/mois

CONTENU
├── [ ] 100 nouveaux articles docs
├── [ ] 10 vidéos tutoriels
├── [ ] FAQ interactive
└── Budget : Temps content

PROCESS
├── [ ] Templates réponses (20)
├── [ ] Runbooks support (10)
├── [ ] QA process formalisé
└── Budget : Temps équipe

MÉTRIQUES CIBLES
├── First response : < 2h
├── CSAT : > 90%
├── FCR : > 70%
└── Deflection : > 40%
```

### 11.2 Moyen terme (Q3-Q4 2025)

```
OBJECTIFS Q3-Q4 2025
────────────────────

ÉQUIPE
├── [ ] Hire Support Agent #2 (si MRR > 40K€)
├── [ ] Extended hours (8h-20h)
└── Budget : ~40K€/an

FEATURES
├── [ ] In-app support widget
├── [ ] Chatbot basic (FAQ)
├── [ ] Customer portal
└── Budget : Dev time

CONTENU
├── [ ] 200 articles total
├── [ ] 20 vidéos total
├── [ ] Localization check (FR/EN)
└── Budget : Temps content

MÉTRIQUES CIBLES
├── First response : < 1h
├── CSAT : > 92%
├── FCR : > 75%
└── Deflection : > 50%
```

### 11.3 Long terme (2026+)

```
VISION SUPPORT 2026+
────────────────────

ÉQUIPE
├── Support Manager
├── 2-3 Support Agents
├── Technical Support Specialist
├── Documentation/Content
└── Coverage : 24/7 (si MRR > 150K€)

CAPABILITIES
├── AI-assisted support (suggestions)
├── Predictive support (proactive)
├── Multi-language (FR, EN, DE, ES)
├── Video support option
├── Community forums
└── Self-service : > 70% deflection

MÉTRIQUES CIBLES
├── First response : < 30 min
├── CSAT : > 95%
├── NPS : > 60
├── FCR : > 80%
└── Support cost / client : < 5€/mois

DIFFÉRENCIATION
├── "Le meilleur support du cloud EU"
├── Support comme feature marketing
├── Success stories clients
└── Industry benchmark top 10%
```

---

*Document maintenu par l'équipe Support VMCloud*
*Dernière mise à jour : Décembre 2024*
*Prochaine révision : Mars 2025*
