# Conformité & Réglementation - VMCloud

> Obligations réglementaires, certifications et conformité de VMCloud.
> Dernière mise à jour : Décembre 2025

---

## Executive Summary

VMCloud, en tant que cloud provider européen (OÜ estonienne), est soumis aux réglementations EU et doit démontrer sa conformité pour servir différents segments de marché. Notre approche est pragmatique : conformité de base solide maintenant, certifications avancées selon les besoins clients.

```
STATUT CONFORMITÉ VMCloud
═══════════════════════════════════════════════════════════════

RÉGLEMENTATION                          STATUT
────────────────────────────────────────────────────────────────
RGPD (Protection données)               ✅ Conforme
NIS2 (Cybersécurité)                    ⚠️ À analyser (2025)
DORA (Services financiers)              ❌ Non concerné (pour l'instant)
ePrivacy                                ✅ Conforme

CERTIFICATIONS                          STATUT
────────────────────────────────────────────────────────────────
ISO 27001                               ❌ Non (prévu 2026+)
SOC 2 Type II                           ❌ Non (prévu 2026+)
HDS (Hébergeur Données Santé)           ❌ Non (pas prioritaire)
SecNumCloud                             ❌ Non (hors scope)
PCI-DSS                                 ❌ Non applicable

DOCUMENTS CONFORMITÉ                    STATUT
────────────────────────────────────────────────────────────────
Politique de confidentialité            ✅ En place
DPA (Data Processing Agreement)         ✅ En place
AUP (Acceptable Use Policy)             ✅ En place
SLA                                     ✅ En place
CGV/CGU                                 ✅ En place
PSSI                                    ⚠️ À formaliser
```

---

## 1. RGPD / Protection des Données

### Statut RGPD

```
CONFORMITÉ RGPD VMCloud
═══════════════════════════════════════════════════════════════

Statut global: ✅ CONFORME

Structure RGPD:
├── Responsable de traitement: VMCloud OÜ
├── DPO désigné: Non requis (<250 employés, pas données sensibles)
├── Représentant UE: N/A (établi en UE - Estonie)
└── Autorité de contrôle: DPA Estonie (Andmekaitse Inspektsioon)

Base légale principale: Exécution du contrat (Art. 6.1.b)

Conformité native:
✅ Entreprise estonienne = membre UE
✅ Infrastructure OVH = datacenters EU uniquement
✅ Pas de transferts hors UE (sauf si client le demande)
✅ Privacy by design dans le développement
```

### Rôles RGPD

```
QUALIFICATION RGPD PAR SITUATION
════════════════════════════════

SCÉNARIO 1: Client utilise VPS/GPU pour ses propres données
─────────────────────────────────────────────────────────────
VMCloud = Sous-traitant (Processor)
Client = Responsable de traitement (Controller)
DPA requis: ✅ Oui (disponible sur vmcloud.fr/legal/dpa)

SCÉNARIO 2: VMCloud traite données clients (facturation, support)
─────────────────────────────────────────────────────────────────
VMCloud = Responsable de traitement (Controller)
Base légale: Exécution du contrat
Privacy policy: ✅ Disponible

SCÉNARIO 3: Client héberge données de ses propres clients
─────────────────────────────────────────────────────────
Client = Responsable de traitement
VMCloud = Sous-traitant
Client final = Personne concernée
→ VMCloud n'a pas de relation directe avec personne concernée
```

### Registre des Traitements

| Traitement | Finalité | Base Légale | Données | Durée Conservation | Destinataires |
|------------|----------|-------------|---------|---------------------|---------------|
| Gestion clients | Exécution contrat service cloud | Contrat (Art. 6.1.b) | Nom, email, société, coordonnées | Durée contrat + 5 ans | Équipe interne, comptable |
| Facturation | Facturation et comptabilité | Obligation légale (Art. 6.1.c) | Coordonnées, historique factures | 10 ans (obligation légale) | Comptable, Stripe |
| Support | Assistance technique | Contrat (Art. 6.1.b) | Tickets, logs techniques | Durée contrat + 1 an | Équipe support |
| Marketing | Newsletter, communication | Consentement (Art. 6.1.a) | Email | Jusqu'à désinscription | Outil emailing |
| Logs techniques | Sécurité et debug | Intérêt légitime (Art. 6.1.f) | IP, user agent, actions | 90 jours | Équipe technique |
| Analytics | Amélioration service | Intérêt légitime (Art. 6.1.f) | Données anonymisées | 26 mois | Équipe produit |

### Documents RGPD

| Document | Statut | Localisation | Dernière MAJ |
|----------|--------|--------------|--------------|
| Politique de confidentialité | ✅ En place | vmcloud.fr/legal/privacy | Nov 2025 |
| DPA (Data Processing Agreement) | ✅ En place | vmcloud.fr/legal/dpa | Nov 2025 |
| Registre des traitements | ❌ À créer | - | - |
| AIPD (Analyses d'impact) | ❌ Non requis | - | - |
| Process exercice des droits | ✅ En place | privacy@vmcloud.fr | Nov 2025 |
| Cookies policy | ✅ En place | vmcloud.fr/legal/cookies | Nov 2025 |

### Sous-Traitants (Article 28)

| Sous-traitant | Service | Données Traitées | DPA Signé | Localisation | Transferts hors UE |
|---------------|---------|------------------|-----------|--------------|-------------------|
| OVHcloud | Infrastructure | Toutes données clients | ✅ | France/EU | Non |
| Stripe | Paiements | Données bancaires | ✅ | Irlande (EU) | Non |
| Google Workspace | Email, Docs | Communications | ✅ | EU (clause régionale) | Non |
| Crisp (ou équiv.) | Chat support | Messages support | ✅ | EU | Non |
| Google Analytics | Analytics | Données navigation | ✅ | EU (mode consentement) | Non (config EU) |

### Transferts Hors UE

```
POLITIQUE TRANSFERTS INTERNATIONAUX
═══════════════════════════════════

Position VMCloud:
─────────────────
• Par défaut: AUCUN transfert hors UE
• Infrastructure: 100% datacenters EU (France, Amsterdam, Frankfurt)
• Sous-traitants: Tous basés EU ou avec garanties EU

Si client demande datacenter hors EU (futur):
──────────────────────────────────────────────
• Information claire des implications
• SCCs (Standard Contractual Clauses) en place
• Mesures techniques supplémentaires si nécessaire
• Documentation transfert impact assessment

Risque Cloud Act US:
────────────────────
• VMCloud = entreprise estonienne (EU)
• Pas de présence US
• Pas de soumission au Cloud Act
• Infrastructure OVH = français, non soumis
→ Pas de risque d'accès US aux données
```

### Exercice des Droits (DSAR)

```
PROCESS DEMANDE D'EXERCICE DES DROITS
═════════════════════════════════════

Contact: privacy@vmcloud.fr

Droits supportés:
├── Accès (Art. 15): Copie des données personnelles
├── Rectification (Art. 16): Correction données inexactes
├── Effacement (Art. 17): "Droit à l'oubli"
├── Limitation (Art. 18): Gel du traitement
├── Portabilité (Art. 20): Export format structuré
├── Opposition (Art. 21): Stop marketing
└── Retrait consentement: Si base légale = consentement

Délai réponse: 30 jours (extensible 60 jours si complexe)

Process interne:
1. Réception demande (privacy@vmcloud.fr)
2. Vérification identité
3. Évaluation demande
4. Traitement (CEO/ADRH)
5. Réponse sous 30 jours
6. Documentation dans registre

Volume actuel: ~0-2 demandes/mois (estimation)
```

---

## 2. Sécurité (ISO 27001, SOC 2)

### État des Certifications

| Certification | Statut | Périmètre | Timeline | Budget Estimé |
|---------------|--------|-----------|----------|---------------|
| ISO 27001 | ❌ Non | - | 2026+ (post-levée) | 30-50K€ |
| SOC 2 Type II | ❌ Non | - | 2026+ (post-levée) | 40-60K€ |
| HDS | ❌ Non | - | Non prioritaire | 50-100K€ |
| PCI-DSS | ❌ N/A | Stripe gère | - | - |
| SecNumCloud | ❌ Non | Hors scope | - | >500K€ |

### Stratégie Certification

```
ROADMAP CERTIFICATIONS
═══════════════════════════════════════════════════════════════

PHASE ACTUELLE (2025): Fondations
─────────────────────────────────
Objectif: Bonnes pratiques sans certification formelle
Actions:
├── PSSI formalisée
├── Contrôles de sécurité documentés
├── Process incident documenté
├── Réponse aux questionnaires clients (manuel)
└── Gap analysis ISO 27001 (préparation)

PHASE 2 (2026): Certification si levée/clients enterprise
─────────────────────────────────────────────────────────
Objectif: ISO 27001 ou SOC 2
Déclencheur: Levée de fonds OU clients enterprise exigeants
Budget prévoir: 50-80K€
Timeline: 6-12 mois

PHASE 3 (2027+): Certifications sectorielles
────────────────────────────────────────────
Selon marché:
• HDS si clients santé significatifs
• Certifications sectorielles selon besoins
```

### PSSI (Politique de Sécurité)

```
PSSI VMCloud - RÉSUMÉ
═════════════════════

Statut: ⚠️ À formaliser (document interne existe, pas formalisé)

PRINCIPES DE SÉCURITÉ
─────────────────────
1. Defense in depth (plusieurs couches)
2. Least privilege (accès minimum nécessaire)
3. Zero trust (vérifier, ne pas faire confiance)
4. Secure by default (sécurité par défaut)

DOMAINES COUVERTS
─────────────────
├── Contrôle d'accès (MFA, RBAC)
├── Chiffrement (at rest, in transit)
├── Réseau (segmentation, firewall)
├── Logs et audit
├── Gestion des vulnérabilités
├── Réponse aux incidents
├── Continuité d'activité
├── Formation et sensibilisation
└── Gestion des tiers

DOCUMENT À PRODUIRE: Q1 2025
OWNER: CTO
REVIEW: Annuel
```

### Contrôles de Sécurité

| Domaine | Contrôle | Statut | Détails |
|---------|----------|--------|---------|
| **Accès** | MFA | ✅ Implémenté | Obligatoire pour admin, recommandé clients |
| | RBAC | ✅ Implémenté | Rôles définis (admin, user, billing) |
| | SSO | ⚠️ Partiel | Google OAuth disponible |
| | Review accès | ⚠️ Manuel | Trimestriel |
| **Chiffrement** | At rest | ✅ Implémenté | AES-256 (disques, backups) |
| | In transit | ✅ Implémenté | TLS 1.3 |
| | Key management | ⚠️ Basique | À améliorer (vault) |
| **Réseau** | Firewall | ✅ Implémenté | Par défaut restrictif |
| | Segmentation | ✅ Implémenté | VLAN par client |
| | DDoS protection | ✅ OVH | Anti-DDoS OVH inclus |
| **Logs/Audit** | Centralisation | ✅ Implémenté | Loki + Prometheus |
| | Rétention | ✅ 90 jours | Configurable client |
| | Alerting | ✅ Implémenté | Prometheus Alertmanager |
| **Vulnérabilités** | Scan | ⚠️ Occasionnel | À automatiser |
| | Pentest | ❌ Non | Prévu 2025 |
| | Patch management | ✅ Processus | Weekly updates |
| **Incidents** | Process | ✅ Documenté | Voir OPERATIONS.md |
| | Communication | ✅ En place | Status page + email |

### Audits de Sécurité

| Type | Fréquence | Dernier | Résultat | Prochain |
|------|-----------|---------|----------|----------|
| Pentest externe | Annuel (prévu) | Jamais | - | Q2 2025 |
| Audit interne | Semestriel | - | - | Q1 2025 |
| Scan vulnérabilités | Mensuel (cible) | Occasionnel | - | À automatiser |
| Bug bounty | Non | - | - | Non prioritaire |
| Review code | Continu | PR reviews | - | Continu |

---

## 3. Hébergement Données de Santé (HDS)

### Statut HDS

```
CERTIFICATION HDS
═════════════════

Statut: ❌ NON CERTIFIÉ
Prévu: Non prioritaire

POURQUOI PAS PRIORITAIRE
────────────────────────
• Marché cible: Startups, Gaming, AI
• Clients santé: Pas de demande actuelle
• Coût certification: 50-100K€
• Complexité: Importante (audit, process)
• ROI: Faible pour notre positionnement

SI CLIENT SANTÉ DEMANDE
───────────────────────
Options:
1. Référer vers provider HDS certifié
2. Évaluer opportunité (volume, récurrence)
3. Si significatif: Gap analysis HDS

Note: OVH (notre infra) est HDS certifié
→ Une partie du chemin est faite
→ Certification VMCloud serait sur notre couche
```

### Gap Analysis HDS (Si Besoin)

```
GAPS IDENTIFIÉS POUR HDS
════════════════════════

Si certification HDS envisagée, gaps majeurs:

TECHNIQUE
─────────
□ Chiffrement bout-en-bout renforcé
□ Cloisonnement données santé
□ Traçabilité renforcée
□ Backup et PRA spécifiques santé

ORGANISATIONNEL
───────────────
□ PSSI santé formalisée
□ Formation personnel données santé
□ Process accès renforcés
□ Audit trail complet

CONTRACTUEL
───────────
□ Contrat hébergeur santé
□ Clauses spécifiques CNIL santé
□ Engagement de confidentialité renforcé

TIMELINE ESTIMÉ: 12-18 mois
BUDGET ESTIMÉ: 50-100K€
```

---

## 4. SecNumCloud / Souveraineté

### Statut Souveraineté

```
POSITIONNEMENT SOUVERAINETÉ VMCloud
═══════════════════════════════════════════════════════════════

SecNumCloud: ❌ NON (et pas prévu)
Cloud de Confiance: ❌ NON
EUCS (futur EU): 🔄 À surveiller

POURQUOI PAS SecNumCloud
────────────────────────
• Coût: >500K€ minimum
• Complexité: Process ANSSI long et exigeant
• Marché cible: Administrations, défense (pas notre focus)
• Taille équipe: Incompatible avec petite équipe
• Dépendance OVH: Notre infra est OVH, pas souveraine pure

CE QU'ON PEUT DIRE
──────────────────
✅ Entreprise européenne (Estonie, EU)
✅ Pas de soumission au Cloud Act US
✅ Infrastructure 100% EU (OVH France/EU)
✅ Données restent en EU par défaut
✅ Pas d'actionnariat extra-EU
✅ Management européen

CE QU'ON NE PEUT PAS DIRE
─────────────────────────
❌ SecNumCloud certifié
❌ Cloud de Confiance labellisé
❌ Indépendance technologique totale

CLIENTS SOUVERAINETÉ
────────────────────
Si client exige SecNumCloud/souveraineté stricte:
→ Référer vers providers certifiés (OVH qualifié, Outscale, etc.)
```

### Exigences de Souveraineté (Checklist)

| Exigence | VMCloud | Notes |
|----------|---------|-------|
| Données hébergées EU | ✅ | France, Amsterdam, Frankfurt |
| Pas soumission Cloud Act | ✅ | Entreprise estonienne |
| Actionnariat EU | ✅ | 100% EU |
| Management EU | ✅ | Fondateurs français |
| Pas d'admin non-EU | ✅ | Équipe 100% EU |
| Code source auditable | ⚠️ | Propriétaire, pas open source |
| Technos non-US critiques | ❌ | Linux OK, mais stack variée |
| Certification ANSSI | ❌ | Pas SecNumCloud |

---

## 5. NIS2 / DORA

### NIS2 (Directive Cybersécurité)

```
ANALYSE NIS2 VMCloud
════════════════════

Directive: NIS2 (Network and Information Security 2)
Transposition: Octobre 2024 (États membres)
Application: 2025

SOMMES-NOUS CONCERNÉS ?
───────────────────────
Critères NIS2:
• Secteur: Cloud computing = Secteur critique (Annexe I)
• Taille: >50 employés OU >10M€ CA

VMCloud actuel:
• Secteur: ✅ Cloud computing = concerné potentiellement
• Taille: ❌ <50 employés ET <10M€ CA

Conclusion: ⚠️ À ANALYSER
→ Probablement NON concerné en 2025 (taille)
→ SERA concerné si croissance significative
→ Veille nécessaire sur transposition estonienne

OBLIGATIONS SI CONCERNÉ
───────────────────────
• Mesures de gestion des risques cyber
• Notification incidents (24h alerte, 72h rapport)
• Responsabilité direction
• Formation cybersécurité
• Tests réguliers

PRÉPARATION RECOMMANDÉE
───────────────────────
Même si pas obligatoire maintenant:
□ PSSI formalisée (bonne pratique)
□ Process incident documenté (fait)
□ Veille réglementaire NIS2
□ Gap analysis quand transposition connue
```

### DORA (Digital Operational Resilience Act)

```
ANALYSE DORA VMCloud
════════════════════

Réglementation: DORA (services financiers EU)
Application: Janvier 2025

SOMMES-NOUS CONCERNÉS ?
───────────────────────
DORA concerne:
• Entités financières (banques, assurances, etc.)
• Prestataires TIC critiques de ces entités

VMCloud:
• Pas une entité financière
• Pas (encore) prestataire critique de banques

Conclusion: ❌ NON CONCERNÉ actuellement

SI CLIENTS FSI (FUTURES)
────────────────────────
Si VMCloud sert des clients services financiers:
• Obligations contractuelles possibles
• Exigences de resilience dans contrats
• Reporting incidents spécifique
• Droit d'audit par client FSI

Action: Clause DORA dans contrats enterprise si client FSI
```

### Tableau Récapitulatif Réglementations

| Réglementation | Concerné | Statut | Action |
|----------------|----------|--------|--------|
| RGPD | ✅ Oui | ✅ Conforme | Maintenance |
| NIS2 | ⚠️ À surveiller | ⚠️ Probablement exempt (taille) | Veille + préparation |
| DORA | ❌ Non | N/A | Clauses si clients FSI |
| ePrivacy | ✅ Oui (cookies) | ✅ Conforme | Maintenance |
| DSA | ⚠️ Potentiel | À analyser | Veille |

---

## 6. Conformité Sectorielle

### Par Secteur Client

| Secteur | Réglementation | Concerné | Statut VMCloud | Action |
|---------|----------------|----------|----------------|--------|
| **Finance** | PCI-DSS | ⚠️ Si paiements | Stripe gère | Aucune |
| | DORA | ❌ Non | N/A | Clauses contrat |
| **Santé** | HDS | ❌ Pas de clients | Non certifié | Référer ailleurs |
| | HIPAA | ❌ Non (pas US) | N/A | Aucune |
| **E-commerce** | DSA | ⚠️ Potentiel | À analyser | Veille |
| | PCI-DSS | Via Stripe | ✅ | Aucune |
| **Éducation** | RGPD renforcé | ⚠️ Si mineurs | Conforme RGPD | Clauses spécifiques |
| **Gaming** | Aucune spécifique | - | ✅ | Aucune |
| **AI/ML** | AI Act (2025+) | ⚠️ À surveiller | Veille | Gap analysis 2025 |

### Capacité à Servir Secteurs Régulés

```
MATRICE CAPACITÉ SECTORIELLE
════════════════════════════

PEUT SERVIR SANS PROBLÈME
─────────────────────────
✅ Startups tech
✅ Gaming / Gamedev
✅ AI/ML (non critique)
✅ E-commerce standard
✅ Média / Contenu
✅ SaaS B2B standard

PEUT SERVIR AVEC PRÉCAUTIONS
────────────────────────────
⚠️ Fintech (non bancaire)
   → Clauses DORA dans contrat
   → Questionnaire sécurité

⚠️ Éducation
   → Attention données mineurs
   → Clauses RGPD renforcées

⚠️ E-commerce gros volume
   → Vérifier PCI scope
   → Stripe reste payment processor

NE PEUT PAS SERVIR (ACTUELLEMENT)
─────────────────────────────────
❌ Santé (données patients)
   → Pas HDS certifié
   → Référer vers OVH HDS ou équivalent

❌ Secteur public / Administration
   → Pas SecNumCloud
   → Référer vers cloud qualifié

❌ Défense / Critique
   → Hors scope total
```

---

## 7. AUP (Acceptable Use Policy)

### Usages Interdits

```
ACCEPTABLE USE POLICY VMCloud
═══════════════════════════════════════════════════════════════

Document complet: vmcloud.fr/legal/aup

USAGES STRICTEMENT INTERDITS
────────────────────────────

ILLÉGAUX
────────
❌ Spam / Phishing
❌ Malware / Botnets / C&C servers
❌ Contenu illégal (CSAM, terrorisme, etc.)
❌ Violation propriété intellectuelle
❌ Fraude / Escroquerie
❌ Hacking / Intrusion non autorisée

ABUS DE RESSOURCES
──────────────────
❌ Cryptomining sans accord préalable
❌ DDoS (émission ou amplification)
❌ Scan de ports massif non autorisé
❌ Scraping abusif
❌ Utilisation excessive impactant autres clients

NUISIBLES
─────────
❌ Tor exit nodes (sauf accord)
❌ Open relay email
❌ Proxy ouvert anonymisant
❌ Services favorisant abus

SPÉCIFIQUE GPU
──────────────
⚠️ Cryptomining: Interdit sauf accord écrit
⚠️ Benchmark publics: Accord préalable requis
✅ AI/ML training: Autorisé
✅ Rendering: Autorisé
✅ Gaming servers: Autorisé
```

### Process d'Enforcement

```
PROCESS VIOLATION AUP
═════════════════════

DÉTECTION
─────────
Sources:
├── Monitoring interne (abuse patterns)
├── Abuse reports externes
├── Signalements OVH/upstream
└── Plaintes légales

CLASSIFICATION
──────────────
Mineure: Premier avertissement
├── Exemples: Usage CPU excessif, config mail ouverte
├── Action: Warning + 48h pour corriger
└── Conséquence si non corrigé: Suspension

Majeure: Suspension immédiate
├── Exemples: Spam, scan malveillant, contenu illégal mineur
├── Action: Suspension service + notification
└── Conséquence: Résiliation si récidive ou pas de correction

Critique: Résiliation immédiate
├── Exemples: CSAM, terrorisme, attaque active
├── Action: Résiliation immédiate + signalement autorités
└── Pas de préavis, pas de remboursement

DÉLAIS
──────
┌───────────────┬────────────────┬─────────────────┐
│ Type          │ Réponse        │ Résolution      │
├───────────────┼────────────────┼─────────────────┤
│ Abuse report  │ <24h           │ <72h            │
│ Violation min.│ Warning immédiat│ 48h pour corriger│
│ Violation maj.│ Suspension <1h │ 24h pour appel  │
│ Violation crit│ Immédiat       │ Pas d'appel     │
└───────────────┴────────────────┴─────────────────┘
```

### Équipe Trust & Safety

```
TRUST & SAFETY
══════════════

Équipe dédiée: Non (trop petit)
Responsable: CRE + CEO escalade

Process actuel:
1. Abuse report → CRE évalue
2. Technique → SRE analyse
3. Décision → CRE ou CEO si complexe
4. Action → SRE exécute
5. Communication → CRE notifie

Outils:
├── abuse@vmcloud.fr (contact public)
├── Monitoring patterns (interne)
└── Blocklist upstream (OVH)

Volume estimé: <5 reports/mois
```

---

## 8. Rapports et Audits

### Rapports Disponibles

| Rapport | Disponibilité | Pour Qui | Comment Obtenir |
|---------|---------------|----------|-----------------|
| SOC 2 report | ❌ Non disponible | - | - |
| ISO 27001 cert | ❌ Non disponible | - | - |
| Pentest summary | ❌ Non (pas encore fait) | - | Prévu Q2 2025 |
| Compliance overview | ✅ Disponible | Tous | Site web |
| DPA | ✅ Disponible | Clients | vmcloud.fr/legal/dpa |
| Security whitepaper | ⚠️ À créer | Prospects | Q1 2025 |

### Questionnaires Sécurité

```
PROCESS QUESTIONNAIRES CLIENTS
══════════════════════════════

TYPES DE QUESTIONNAIRES
───────────────────────
• SIG (Standard Information Gathering)
• CAIQ (Cloud Security Alliance)
• Custom client questionnaires
• RFP/RFI sécurité

QUI RÉPOND
──────────
Responsable: CTO + CEO
Support: CRE (collecte questions)

SLA RÉPONSE
───────────
• Questionnaire court (<20 questions): 5 jours ouvrés
• Questionnaire moyen (20-50 questions): 10 jours ouvrés
• Questionnaire long (>50 questions): 15 jours ouvrés + call
• RFP complexe: À évaluer au cas par cas

PROCESS
───────
1. Réception questionnaire (sales@vmcloud.fr)
2. Triage et évaluation scope
3. Assignation (CTO lead)
4. Réponse collaborative (Notion)
5. Review CEO si sensible
6. Envoi au client
7. Archivage pour réutilisation

RÉPONSES PRÉ-REMPLIES
─────────────────────
À créer: Base de réponses standard (Q1 2025)
Format: Notion database
Couvre: ~80% des questions récurrentes
```

### Security Whitepaper

```
SECURITY WHITEPAPER (À créer)
═════════════════════════════

Statut: ⚠️ À produire Q1 2025

CONTENU PRÉVU
─────────────
1. Introduction VMCloud
2. Architecture sécurité
3. Infrastructure (OVH, datacenters)
4. Contrôles d'accès
5. Chiffrement
6. Réseau et isolation
7. Monitoring et logs
8. Gestion des incidents
9. Conformité (RGPD, etc.)
10. Responsabilités partagées
11. FAQ sécurité

OBJECTIF
────────
• Document public pour prospects
• Réduire friction sales
• Démontrer maturité sécurité
• Base pour questionnaires

OWNER: CTO
DEADLINE: Q1 2025
FORMAT: PDF + page web
```

---

## 9. Roadmap Conformité

### Priorités 2025

```
ROADMAP CONFORMITÉ 2025
═══════════════════════════════════════════════════════════════

Q1 2025 - FONDATIONS
────────────────────
□ PSSI formalisée et validée
□ Security whitepaper publié
□ Base réponses questionnaires créée
□ Gap analysis NIS2 (post-transposition)
□ Process DSAR documenté et testé

Q2 2025 - RENFORCEMENT
──────────────────────
□ Premier pentest externe
□ Scan vulnérabilités automatisé
□ Formation sécurité équipe
□ Review DPA et contrats
□ Audit accès interne

Q3 2025 - PRÉPARATION
─────────────────────
□ Gap analysis ISO 27001 (si levée)
□ Amélioration key management
□ Documentation recovery procedures
□ Test DR complet

Q4 2025 - CONSOLIDATION
───────────────────────
□ Bilan conformité annuel
□ Budget certifications 2026
□ Roadmap NIS2 si applicable
□ Préparation AI Act si pertinent
```

### Priorités Post-Levée (2026+)

```
ROADMAP POST-LEVÉE
══════════════════

SI LEVÉE SEED (500K-1M€)
────────────────────────
Année 1:
□ ISO 27001 certification
□ SOC 2 Type I (puis Type II)
□ Security team hire (ou consultant)
□ Bug bounty program (privé)
□ Pentest semestriel

SI LEVÉE SERIE A (>2M€)
───────────────────────
□ SOC 2 Type II
□ Certifications sectorielles si besoin (HDS?)
□ CISO hire
□ GRC tooling
□ Compliance team

COÛTS ESTIMÉS
─────────────
ISO 27001: 30-50K€
SOC 2: 40-60K€
HDS: 50-100K€
Security hire: 80-120K€/an
```

### Gaps à Combler

```
GAPS IDENTIFIÉS
═══════════════

PRIORITÉ HAUTE (2025)
─────────────────────
□ PSSI formalisée
□ Pentest externe
□ Security whitepaper
□ Scan vulnérabilités automatisé

PRIORITÉ MOYENNE (2025-2026)
────────────────────────────
□ Key management (vault)
□ Formation sécurité formelle
□ Base questionnaires
□ DR test complet

PRIORITÉ BASSE (2026+)
──────────────────────
□ Certifications formelles
□ Bug bounty
□ GRC tooling
□ Security team
```

---

## 10. Incidents & Notification

### Process de Notification

```
NOTIFICATION INCIDENTS SÉCURITÉ/DONNÉES
═══════════════════════════════════════════════════════════════

OBLIGATIONS LÉGALES
───────────────────

RGPD (Breach données personnelles):
├── CNIL: 72h après découverte
├── Personnes concernées: "dans les meilleurs délais" si risque élevé
└── Documentation: Obligatoire même si pas de notification

NIS2 (si applicable):
├── Alerte préliminaire: 24h
├── Notification incident: 72h
└── Rapport final: 1 mois

PROCESS VMCloud
───────────────
1. DÉTECTION
   └── Monitoring, alert, ou signalement

2. QUALIFICATION (< 1h)
   ├── Incident de sécurité ?
   ├── Données personnelles impactées ?
   ├── Clients impactés ?
   └── Criticité (P0/P1/P2/P3)

3. CONFINEMENT
   └── Actions immédiates pour limiter impact

4. NOTIFICATION INTERNE (< 2h)
   └── CEO + CTO informés

5. NOTIFICATION EXTERNE (si requis)
   ├── CNIL: < 72h (si breach données perso)
   ├── Clients impactés: < 24h (email + status page)
   └── Autorités: Si requis par loi

6. REMÉDIATION
   └── Fix root cause

7. POST-MORTEM
   └── Documentation complète (Notion)

8. COMMUNICATION
   └── Blog post si incident majeur public
```

### Historique Incidents

```
HISTORIQUE INCIDENTS SÉCURITÉ/DONNÉES
═════════════════════════════════════

Depuis création (Août 2025): AUCUN incident majeur

Tableau de suivi:
| Date | Type | Impact | Notification | Resolution |
|------|------|--------|--------------|------------|
| -    | -    | -      | -            | -          |

Note: Entreprise récente (4 mois d'existence)
Objectif: Maintenir ce track record
```

### Assurance Cyber

```
ASSURANCE CYBER
═══════════════

Statut: ⚠️ À SOUSCRIRE (Q1 2025)

COUVERTURE RECHERCHÉE
─────────────────────
• Violation de données (breach response)
• Cyber extorsion (ransomware)
• Interruption d'activité
• Responsabilité civile cyber
• Frais de notification et gestion crise

MONTANTS CIBLES
───────────────
Couverture: 500K€ - 1M€
Franchise: 5-10K€
Budget prime: 3-8K€/an

PROVIDERS À CONTACTER
─────────────────────
• Hiscox
• AXA Cyber
• Stoïk
• Coalition

DEADLINE: Q1 2025
OWNER: CEO
```

---

## 11. Annexes

### A. Contacts Conformité

```
CONTACTS CONFORMITÉ VMCloud
═══════════════════════════

RGPD / Données personnelles:
privacy@vmcloud.fr

Sécurité / Vulnérabilités:
security@vmcloud.fr

Abuse / Violations AUP:
abuse@vmcloud.fr

Conformité générale:
legal@vmcloud.fr

Questionnaires sécurité:
sales@vmcloud.fr (puis transfert CTO)

RESPONSABLES INTERNES
─────────────────────
RGPD: CEO
Sécurité: CTO
AUP/Abuse: CRE
Contrats: CEO
```

### B. Checklist Due Diligence

```
CHECKLIST DUE DILIGENCE (pour clients/prospects)
════════════════════════════════════════════════

CONFORMITÉ GÉNÉRALE
───────────────────
□ Entreprise EU (Estonie)
□ RGPD conforme
□ DPA disponible
□ Pas soumis Cloud Act US
□ Infrastructure EU uniquement

SÉCURITÉ
────────
□ Chiffrement at rest et in transit
□ MFA disponible
□ RBAC implémenté
□ Monitoring 24/7
□ Process incident documenté

CONTRACTUEL
───────────
□ CGV claires
□ SLA avec pénalités
□ DPA standard
□ AUP publiée
□ Limitation responsabilité définie

À VENIR (2025-2026)
───────────────────
□ Pentest report (Q2 2025)
□ Security whitepaper (Q1 2025)
□ ISO 27001 (2026+ si levée)
□ SOC 2 (2026+ si levée)
```

### C. Ressources et Références

```
RESSOURCES CONFORMITÉ
═════════════════════

RÉGLEMENTATIONS
───────────────
• RGPD: eur-lex.europa.eu (Règlement 2016/679)
• NIS2: eur-lex.europa.eu (Directive 2022/2555)
• DORA: eur-lex.europa.eu (Règlement 2022/2554)
• AI Act: eur-lex.europa.eu (Règlement 2024/1689)

GUIDES
──────
• CNIL: cnil.fr/fr/rgpd-par-ou-commencer
• ANSSI: ssi.gouv.fr
• ENISA: enisa.europa.eu

AUTORITÉS
─────────
• CNIL (France): cnil.fr
• DPA Estonie: aki.ee
• ANSSI: ssi.gouv.fr

CERTIFICATIONS
──────────────
• ISO 27001: iso.org
• SOC 2: aicpa.org
• HDS: esante.gouv.fr/labels-certifications/hds
• SecNumCloud: ssi.gouv.fr/secnumcloud
```

### D. Glossaire Conformité

```
GLOSSAIRE
═════════

AIPD (Analyse d'Impact relative à la Protection des Données):
Évaluation obligatoire RGPD pour traitements à risque élevé.

AUP (Acceptable Use Policy):
Politique définissant les usages autorisés et interdits.

DPA (Data Processing Agreement):
Contrat entre responsable de traitement et sous-traitant (Art. 28 RGPD).

DPO (Data Protection Officer):
Délégué à la protection des données. Obligatoire selon critères RGPD.

DSAR (Data Subject Access Request):
Demande d'exercice des droits par une personne concernée.

HDS (Hébergeur de Données de Santé):
Certification française pour héberger données de santé.

NIS2 (Network and Information Security Directive 2):
Directive EU cybersécurité pour secteurs critiques.

PSSI (Politique de Sécurité des Systèmes d'Information):
Document cadre définissant la politique sécurité.

SCCs (Standard Contractual Clauses):
Clauses types pour transferts données hors EU.

SecNumCloud:
Qualification ANSSI pour cloud de confiance français.

SOC 2 (Service Organization Control 2):
Audit sécurité américain, standard pour SaaS/Cloud.
```

---

*Document de référence - Conformité VMCloud*
*Dernière mise à jour: Décembre 2025*
*Owner: CEO + CTO*
*Review: Semestriel*
