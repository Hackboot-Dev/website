# Analyse Concurrentielle - VMCloud

> **Cartographie du paysage concurrentiel et positionnement VMCloud**
> Dernière mise à jour : Décembre 2025

---

## 1. Vue d'ensemble du marché

### Le marché cloud européen

```
TAILLE DU MARCHÉ CLOUD EU (2024-2025)
│
├── Marché total EU : ~100 Md€
├── Croissance annuelle : +20-25%
├── Part des hyperscalers (AWS/GCP/Azure) : ~65%
├── Part des acteurs européens : ~20%
└── Part des acteurs locaux/niche : ~15%
```

### Segmentation des acteurs

```
                              PRIX
                               │
        PREMIUM               │               LOW-COST
                               │
    ┌──────────────┐          │          ┌──────────────┐
    │  AWS / GCP   │          │          │   Hetzner    │
    │    Azure     │          │          │  Hostinger   │
    │              │          │          │   Contabo    │
    └──────────────┘          │          └──────────────┘
              │                │                │
              │                │                │
    ┌──────────────┐    ┌─────┴─────┐    ┌──────────────┐
    │   Lambda     │    │  VMCloud  │    │     OVH      │
    │   CoreWeave  │    │  (cible)  │    │              │
    └──────────────┘    └───────────┘    └──────────────┘
              │                │                │
              │                │                │
    ┌──────────────┐          │          ┌──────────────┐
    │  Scaleway    │          │          │ DigitalOcean │
    │  Infomaniak  │          │          │    Vultr     │
    └──────────────┘          │          └──────────────┘
                               │
    SPÉCIALISTE ───────────────┼─────────────── GÉNÉRALISTE
```

---

## 2. Concurrents directs (Tier 1)

### Qui sont les vrais concurrents de VMCloud ?

**Définition :** Acteurs européens ou accessibles en Europe, positionnés sur IaaS/PaaS, ciblant PME/ETI/devs.

| Concurrent | Niveau de menace | Pourquoi |
|------------|------------------|----------|
| **Infomaniak** | 🔴 ÉLEVÉ | Même positionnement premium + valeurs, suisse, solide |
| **Scaleway** | 🟡 MOYEN | Français, tech avancée, mais positionnement flou |
| **OVHcloud** | 🟡 MOYEN | Leader EU, mais image dégradée, pas premium |
| **Hetzner** | 🟢 FAIBLE | Allemand, B2B hardcore, pas de service |
| **DigitalOcean** | 🟡 MOYEN | US mais populaire EU, dev-friendly |

**Exclus des concurrents directs :**
- AWS/GCP/Azure → Autre catégorie (hyperscalers)
- Hostinger/Contabo → Low-cost, pas notre marché
- Lambda Labs/CoreWeave → GPU US only, enterprise

---

## 3. Analyse détaillée des concurrents

### 3.1 OVHcloud 🇫🇷

```
FICHE CONCURRENT : OVHCLOUD
│
├── 🏢 PROFIL
│   ├── Siège : Roubaix, France
│   ├── Fondé : 1999
│   ├── Employés : ~2 500
│   ├── CA : ~800 M€
│   ├── Clients : ~1.6 million
│   └── IPO : Euronext Paris (2021)
│
├── 💪 FORCES
│   ├── Leader européen incontesté
│   ├── Prix très compétitifs (low-cost)
│   ├── Infrastructure massive (33 DC)
│   ├── Souveraineté (data EU)
│   ├── Gamme complète (VPS → bare metal → cloud)
│   └── Marque connue (notoriété)
│
├── 😰 FAIBLESSES
│   ├── Support client catastrophique (bots, délais, incompétence)
│   ├── Image ternie par l'incident SBG (2021, pertes de données)
│   ├── Interface vieillotte et peu intuitive
│   ├── API incomplète et documentation pauvre
│   ├── Rigidité des offres (peu de personnalisation)
│   ├── Culture corporate (lent, bureaucratique)
│   └── Incidents récurrents (pannes réseau, maintenance mal communiquée)
│
├── 🎯 POSITIONNEMENT
│   └── "Cloud européen pas cher" → Volume, pas qualité
│
└── 📊 NOTRE AVANTAGE VS OVH
    ├── Support expert (devs, pas bots)
    ├── Flexibilité (options, personnalisation)
    ├── Réactivité (startup vs corporate)
    ├── UX moderne
    └── Relation client personnalisée
```

**Verdict :** OVH est le géant à éviter de confronter frontalement. On ne gagne pas sur le prix, on gagne sur **tout le reste**.

---

### 3.2 Scaleway 🇫🇷

```
FICHE CONCURRENT : SCALEWAY
│
├── 🏢 PROFIL
│   ├── Siège : Paris, France
│   ├── Fondé : 1999 (Online.net) / 2015 (rebrand Scaleway)
│   ├── Groupe : Iliad (Xavier Niel)
│   ├── Positionnement : Cloud nouvelle génération
│   └── Cible : Développeurs, startups, tech companies
│
├── 💪 FORCES
│   ├── UX moderne et dev-friendly
│   ├── API complète et bien documentée
│   ├── Innovation (Kubernetes, serverless, AI)
│   ├── Pricing transparent
│   ├── Marque "cool" dans l'écosystème tech français
│   ├── Investissements R&D (quantique, AI)
│   └── Terraform provider mature
│
├── 😰 FAIBLESSES
│   ├── Positionnement flou (pour qui exactement ?)
│   ├── Trop de produits, pas de focus clair
│   ├── Pas polyvalent (certains produits immatures)
│   ├── Support moyen (meilleur qu'OVH, mais pas premium)
│   ├── Pricing pas toujours compétitif
│   ├── Écosystème incomplet (certains services manquent)
│   └── Communication tech-only (exclut les non-devs)
│
├── 🎯 POSITIONNEMENT
│   └── "Le cloud des développeurs" → Tech-first, parfois trop
│
└── 📊 NOTRE AVANTAGE VS SCALEWAY
    ├── Positionnement clair (B2B premium, service)
    ├── Support vraiment expert et humain
    ├── Moins de produits, mais mieux finis
    ├── Accessible aux non-devs aussi
    └── Relation client (pas juste du self-service)
```

**Verdict :** Scaleway est techniquement solide mais manque de clarté. On peut gagner sur le **positionnement clair** et le **service humain**.

---

### 3.3 Hetzner 🇩🇪

```
FICHE CONCURRENT : HETZNER
│
├── 🏢 PROFIL
│   ├── Siège : Gunzenhausen, Allemagne
│   ├── Fondé : 1997
│   ├── Employés : ~300
│   ├── Positionnement : Infrastructure pas chère, fiable
│   └── Cible : B2B, développeurs expérimentés, sysadmins
│
├── 💪 FORCES
│   ├── Prix imbattables (bare metal, VPS)
│   ├── Infrastructure solide (datacenters allemands/finlandais)
│   ├── Très fiable techniquement
│   ├── Pas de bullshit marketing
│   ├── Transparence sur les specs
│   └── Robot API (automation)
│
├── 😰 FAIBLESSES
│   ├── Interface archaïque (années 2000)
│   ├── UX horrible (pensé par/pour sysadmins)
│   ├── Support minimaliste
│   ├── Aucun effort sur l'expérience client
│   ├── Documentation technique mais pas user-friendly
│   ├── Pas de PaaS, pas de services managés
│   └── Image "cheap" et "old school"
│
├── 🎯 POSITIONNEMENT
│   └── "Infrastructure brute, pas chère, débrouillez-vous"
│
└── 📊 NOTRE AVANTAGE VS HETZNER
    ├── UX moderne et intuitive
    ├── Support humain et expert
    ├── Services managés (PaaS, K8s)
    ├── Onboarding pensé pour tous
    └── Image premium, pas "cheap"
```

**Verdict :** Hetzner attire ceux qui veulent le moins cher et savent tout faire eux-mêmes. On ne les cible pas, on cible ceux qui veulent **plus de service**.

---

### 3.4 Infomaniak 🇨🇭

```
FICHE CONCURRENT : INFOMANIAK
│
├── 🏢 PROFIL
│   ├── Siège : Genève, Suisse
│   ├── Fondé : 1994
│   ├── Employés : ~200
│   ├── Positionnement : Éthique, écologique, suisse
│   └── Cible : PME, indépendants, conscients de l'environnement
│
├── 💪 FORCES
│   ├── Image éthique très forte (écologie, vie privée)
│   ├── Suisse = confiance, neutralité, qualité
│   ├── Gamme large (mail, hosting, cloud, kDrive, kSuite)
│   ├── Support réactif et humain
│   ├── Prix raisonnables
│   ├── kDrive/kSuite = alternatives GAFAM crédibles
│   ├── Communication authentique, pas corporate
│   └── Engagement environnemental réel (100% renouvelable)
│
├── 😰 FAIBLESSES
│   ├── Veulent être partout → dispersion
│   ├── Site web confus (on arrive, "domaine gratuit" ?)
│   ├── Pas clair sur leur cœur de métier (cloud ? mail ? suite ?)
│   ├── Cloud compute moins mature que les autres
│   ├── Moins tech/dev-oriented que Scaleway
│   ├── Pricing parfois élevé (premium suisse)
│   └── Écosystème cloud incomplet vs hyperscalers
│
├── 🎯 POSITIONNEMENT
│   └── "Le LDLC du cloud" - Friendly, éthique, touche-à-tout
│
└── 📊 NOTRE AVANTAGE VS INFOMANIAK
    ├── Focus clair sur le cloud/compute
    ├── Plus technique et dev-friendly
    ├── GPU cloud (ils n'ont pas vraiment)
    ├── Pricing plus agressif (pas premium suisse)
    └── Positionnement B2B premium clair
```

**⚠️ ALERTE : Infomaniak est le concurrent qui ressemble le plus à VMCloud en termes de valeurs (éthique, humain, pas corporate). Ils sont une menace sérieuse.**

**Verdict :** On partage les mêmes valeurs, mais on peut gagner sur le **focus cloud** et la **clarté du positionnement**.

---

### 3.5 DigitalOcean 🇺🇸

```
FICHE CONCURRENT : DIGITALOCEAN
│
├── 🏢 PROFIL
│   ├── Siège : New York, USA
│   ├── Fondé : 2011
│   ├── IPO : NYSE (2021)
│   ├── CA : ~700 M$
│   ├── Positionnement : Cloud simple pour développeurs
│   └── Cible : Devs, startups, PME tech
│
├── 💪 FORCES
│   ├── UX excellent (référence du marché)
│   ├── Documentation exceptionnelle (tutoriels, guides)
│   ├── Pricing simple et prévisible
│   ├── Communauté dev massive
│   ├── API mature et bien documentée
│   ├── Marque forte chez les développeurs
│   └── Services managés (K8s, DB, App Platform)
│
├── 😰 FAIBLESSES
│   ├── Américain (CLOUD Act, données hors EU)
│   ├── Support moyen (pas premium)
│   ├── Réputation de ban de comptes sans explication
│   ├── Pas de GPU cloud
│   ├── Enterprise features limitées
│   ├── Pricing monte vite à l'échelle
│   └── Pas de présence locale EU (DC mais pas équipes)
│
├── 🎯 POSITIONNEMENT
│   └── "Cloud simple pour devs" - Self-service first
│
└── 📊 NOTRE AVANTAGE VS DIGITALOCEAN
    ├── Européen (RGPD, souveraineté)
    ├── GPU cloud (ils n'ont pas)
    ├── Support humain expert
    ├── Pas de ban arbitraire (relation)
    └── Présence locale (Estonie/EU)
```

**Verdict :** DigitalOcean est la référence UX, mais leur côté US est un désavantage en EU. On peut gagner sur **souveraineté + GPU + relation**.

---

### 3.6 Hostinger 🇱🇹

```
FICHE CONCURRENT : HOSTINGER
│
├── 🏢 PROFIL
│   ├── Siège : Kaunas, Lituanie
│   ├── Fondé : 2004
│   ├── Employés : ~1 000
│   ├── Positionnement : Hébergement ultra low-cost
│   └── Cible : Débutants, petits sites, budget serré
│
├── 💪 FORCES
│   ├── Prix ultra-agressifs (le moins cher)
│   ├── Marketing massif (SEO, affiliés)
│   ├── UX simple pour débutants
│   ├── Support 24/7 (chat)
│   ├── Gamme large (hosting → VPS → cloud)
│   └── Présence mondiale
│
├── 😰 FAIBLESSES
│   ├── Image low-cost / cheap
│   ├── Performance moyenne
│   ├── Support peu technique
│   ├── Upsells agressifs
│   ├── Pas pour les professionnels sérieux
│   ├── Qualité de service variable
│   └── Réputation mitigée (avis négatifs)
│
├── 🎯 POSITIONNEMENT
│   └── "Le Ryanair du cloud" - Pas cher, basique, volume
│
└── 📊 NOTRE AVANTAGE VS HOSTINGER
    └── Tout. On ne cible pas le même marché.
```

**Verdict :** Hostinger n'est pas un concurrent direct. Leurs clients ne sont pas notre cible.

---

## 4. Concurrents GPU (Tier 2)

### Marché GPU Cloud

Le GPU cloud explose avec l'AI/ML. Voici les acteurs spécialisés :

| Concurrent | Origine | Forces | Faiblesses | Menace pour VMCloud |
|------------|---------|--------|------------|---------------------|
| **Lambda Labs** | 🇺🇸 US | GPU dernière gen, ML-focused | US only, enterprise | 🟢 Faible (pas EU) |
| **CoreWeave** | 🇺🇸 US | Scale massive, NVIDIA partner | US, très cher | 🟢 Faible (pas EU) |
| **Vast.ai** | 🇺🇸 US | Marketplace, prix bas | Qualité variable | 🟡 Moyen (prix) |
| **RunPod** | 🇺🇸 US | Simple, dev-friendly | US, support limité | 🟡 Moyen (UX) |
| **Paperspace** | 🇺🇸 US | ML notebooks, simple | Racheté par DigitalOcean | 🟢 Faible |

**Opportunité VMCloud :** Pas de vrai acteur GPU européen premium. Le marché est dominé par des US qui ne peuvent pas garantir la souveraineté EU.

---

## 5. Les hyperscalers (pas des concurrents directs)

### Pourquoi AWS/GCP/Azure ne sont PAS nos concurrents directs

| Critère | Hyperscalers | VMCloud |
|---------|--------------|---------|
| Cible | Enterprises, scale massive | PME, ETI, devs pro |
| Prix | Cher, complexe, imprévisible | Mid-premium, simple |
| Support | Payant $$$$, impersonnel | Inclus, humain, expert |
| Complexité | 200+ services, courbe d'apprentissage | Focus, simple |
| Relation | Numéro de compte | Partenaire |

**Stratégie :** On ne se bat pas contre AWS. On récupère ceux qui sont **trop petits pour AWS** ou **frustrés par AWS**.

### Quand un prospect choisit AWS plutôt que VMCloud

- Scale massive (>1000 serveurs)
- Besoin de services très spécifiques (Sagemaker, BigQuery)
- Contrat enterprise existant
- Équipe DevOps expérimentée qui maîtrise déjà

### Quand un prospect choisit VMCloud plutôt que AWS

- Besoin de support humain
- Budget limité mais besoin de qualité
- Souveraineté EU importante
- Pas envie de courbe d'apprentissage AWS
- Startup qui a dépassé Heroku mais pas prête pour AWS

---

## 6. Matrice comparative

### Comparaison globale

| Critère | VMCloud | OVH | Scaleway | Hetzner | Infomaniak | DO |
|---------|---------|-----|----------|---------|------------|-----|
| **Prix** | ●●●○○ | ●●●●● | ●●●○○ | ●●●●● | ●●○○○ | ●●●○○ |
| **Performance** | ●●●●○ | ●●●○○ | ●●●●○ | ●●●●○ | ●●●○○ | ●●●○○ |
| **Support** | ●●●●● | ●○○○○ | ●●○○○ | ●○○○○ | ●●●●○ | ●●○○○ |
| **UX/Interface** | ●●●●○ | ●●○○○ | ●●●●○ | ●○○○○ | ●●●○○ | ●●●●● |
| **API/DevEx** | ●●●○○ | ●●○○○ | ●●●●● | ●●○○○ | ●●○○○ | ●●●●● |
| **GPU Cloud** | ●●●●○ | ●●○○○ | ●●●○○ | ●○○○○ | ●○○○○ | ○○○○○ |
| **Souveraineté EU** | ●●●●● | ●●●●○ | ●●●●○ | ●●●●● | ●●●●● | ●●○○○ |
| **Écosystème** | ●●●○○ | ●●●●○ | ●●●○○ | ●●○○○ | ●●●○○ | ●●●○○ |
| **Flexibilité** | ●●●●○ | ●●○○○ | ●●●○○ | ●●●○○ | ●●○○○ | ●●●○○ |
| **Image/Brand** | ●●○○○ | ●●●○○ | ●●●○○ | ●●○○○ | ●●●●○ | ●●●●○ |

### Positionnement prix détaillé

| Produit | VMCloud | OVH | Scaleway | Hetzner | DO |
|---------|---------|-----|----------|---------|-----|
| VPS Entry (2vCPU/4GB) | 49€ | 6€ | 15€ | 4€ | 24$ |
| VPS Pro (8vCPU/32GB) | 399€ | 58€ | 80€ | 30€ | 192$ |
| GPU T4 | 469€ | 400€ | N/A | N/A | N/A |
| GPU A100 | 2 319€ | N/A | 2 000€ | N/A | N/A |
| Storage/TB | 100€ | 20€ | 40€ | 5€ | 100$ |

**Analyse :** VMCloud est plus cher que OVH/Hetzner, comparable à Scaleway/DO. Le différentiel se justifie par le service.

---

## 7. Différenciateurs VMCloud

### Ce qui rend VMCloud unique

```
DIFFÉRENCIATEURS VMCLOUD
│
├── 🧑‍💻 HUMAIN
│   │
│   ├── Support par des experts (devs, pas scripts)
│   ├── Relation personnalisée (on connaît nos clients)
│   ├── Réactivité (on change le site si un client suggère mieux)
│   ├── Le CTO peut répondre lui-même
│   └── Pas de culture corporate
│
├── 🎯 POSITIONNEMENT CLAIR
│   │
│   ├── B2B premium explicite
│   ├── "Le juste milieu" clairement communiqué
│   ├── On sait qui on est et qui on n'est pas
│   └── Pas de dispersion (focus cloud)
│
├── 🔧 ÉCOSYSTÈME COMPLET
│   │
│   ├── Flexibilité AWS (options, paramètres)
│   ├── Simplicité OVH (pas de complexité inutile)
│   ├── Tout dans un environnement cohérent
│   └── VPS + GPU + PaaS + Storage + CDN + LB
│
├── 🇪🇺 EUROPÉEN
│   │
│   ├── Estonie = EU, e-Residency, innovation
│   ├── Souveraineté garantie
│   ├── RGPD natif
│   └── Pas de CLOUD Act
│
└── 🚀 AGILITÉ STARTUP
    │
    ├── Pas de bureaucratie
    ├── Décisions rapides
    ├── Feedback intégré immédiatement
    ├── Philosophie Odoo (bootstrap, proche clients)
    └── "Je suis encore dans ma chambre" spirit
```

### Le "Moat" VMCloud (avantage défendable)

| Moat | Copiable ? | Durabilité |
|------|------------|------------|
| Service expert humain | Difficile (coût, culture) | Forte |
| Relation client personnalisée | Difficile (scale vs qualité) | Forte |
| Agilité startup | Temporaire (on grandit) | Moyenne |
| Écosystème complet | Facile (techno) | Faible |
| Prix | Facile | Faible |

**Le vrai moat = la culture et la relation.** C'est le plus dur à copier.

---

## 8. Opportunités de marché

### Segments mal servis

| Segment | Problème actuel | Opportunité VMCloud |
|---------|-----------------|---------------------|
| **PME tech EU** | AWS trop complexe/cher, OVH trop nul | Le juste milieu premium |
| **Agences digitales** | Gèrent l'infra clients, besoin fiabilité + support | Programme partenaire |
| **Startups post-Heroku** | Ont grandi, besoin de contrôle | Migration path claire |
| **GPU en Europe** | Dominé par US, pas de souveraineté | GPU EU premium |
| **Entreprises anti-GAFAM** | Cherchent alternatives EU | Valeurs alignées |

### Régions sous-exploitées

| Région | Acteurs dominants | Opportunité |
|--------|-------------------|-------------|
| **Estonie / Baltics** | Peu d'acteurs locaux | First-mover advantage |
| **Europe du Nord** | Hetzner (cheap), hyperscalers | Premium local |
| **Europe de l'Est** | Peu d'offre quality | Expansion naturelle |

### Use cases non adressés

| Use case | Problème | Solution VMCloud |
|----------|----------|------------------|
| **GPU pour PME** | Trop cher (AWS) ou US (Lambda) | GPU EU prix accessible |
| **Dev qui veut upgrader** | Heroku → AWS = gap énorme | Marche intermédiaire |
| **Multi-cloud EU simple** | Complexe à orchestrer | Écosystème unifié |

---

## 9. Menaces et scénarios

### Menace #1 : Concurrent qui copie le positionnement

**Scénario :** Scaleway ou Infomaniak décide de pousser sur "premium + service humain"

| Aspect | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| Crédibilité | Ils ont déjà une marque | Moyenne | Construire notre marque vite |
| Ressources | Ils ont plus de moyens | Élevée | Agilité, niche, relation |
| Exécution | Difficile pour un gros de devenir "humain" | Faible | C'est notre ADN, pas le leur |

### Menace #2 : Guerre des prix

**Scénario :** OVH ou Hetzner casse encore plus les prix

| Aspect | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| Pression prix | Justifier le premium devient plus dur | Élevée | Ne pas entrer dans la guerre |
| Perception | "Pourquoi payer plus ?" | Moyenne | Communiquer la valeur |
| Clients | Les price-sensitive partent | Faible | Pas notre cible de toute façon |

### Menace #3 : Hyperscaler qui descend en gamme

**Scénario :** AWS lance une offre "AWS Lite" pour PME

| Aspect | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| Crédibilité | AWS = sérieux | Élevée | Leur support restera nul |
| Prix | Ils peuvent subsidier | Moyenne | Focus service |
| Marché | Capture les "aspirants AWS" | Moyenne | Positionner différemment |

### Menace #4 : Consolidation du marché

**Scénario :** OVH rachète Scaleway (ou inverse)

| Aspect | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| Part de marché | Géant européen unifié | Faible | Rester agile et niche |
| Attention | Plus de visibilité pour le gros | Moyenne | Différenciation |

---

## 10. Veille concurrentielle

### Système de veille en place

```
VEILLE CONCURRENTIELLE VMCLOUD
│
├── 🤖 AUTOMATISÉ
│   ├── Agents IA qui scrapent les prix concurrents
│   ├── Alertes sur changements de pricing
│   └── Monitoring des changelogs
│
├── 📊 MANUEL
│   ├── Review trimestrielle des offres concurrentes
│   ├── Test des produits concurrents (secret shopping)
│   └── Analyse des avis clients (G2, Trustpilot)
│
├── 📰 SOURCES
│   ├── Blogs techniques des concurrents
│   ├── Communiqués de presse
│   ├── LinkedIn des employés
│   ├── Hacker News / Reddit / Twitter
│   └── Rapports analystes (Gartner, IDC si accessible)
│
└── 🎯 FRÉQUENCE
    ├── Prix : Temps réel (agents)
    ├── Produits : Mensuel
    ├── Stratégie : Trimestriel
    └── Analyse profonde : Semestriel
```

### Ce qu'on surveille

| Élément | Fréquence | Action si changement |
|---------|-----------|---------------------|
| Prix concurrents | Temps réel | Ajuster si nécessaire |
| Nouvelles features | Mensuel | Évaluer pour roadmap |
| Incidents concurrents | Temps réel | Opportunité communication |
| Recrutements | Mensuel | Anticiper leur stratégie |
| Levées de fonds | Immédiat | Adapter notre positionnement |

---

## 11. Stratégie compétitive

### Comment gagner contre chaque concurrent

| Concurrent | Stratégie | Message clé |
|------------|-----------|-------------|
| **OVH** | Ne pas se battre sur le prix, gagner sur le service | "Quand OVH vous laisse tomber, on est là" |
| **Scaleway** | Clarté du positionnement, support humain | "Cloud pro, simplement" |
| **Hetzner** | UX, service, managed services | "L'infra pro sans être sysadmin" |
| **Infomaniak** | Focus cloud, technique, GPU | "Le cloud, c'est notre métier" |
| **DigitalOcean** | Souveraineté EU, GPU, support | "DigitalOcean européen" |

### Principes stratégiques

```
STRATÉGIE COMPÉTITIVE VMCLOUD
│
├── ❌ CE QU'ON NE FAIT PAS
│   ├── Guerre des prix
│   ├── Copier les features pour copier
│   ├── Attaquer frontalement les gros
│   └── Promettre ce qu'on ne peut pas tenir
│
├── ✅ CE QU'ON FAIT
│   ├── Différencier par le service
│   ├── Construire une relation
│   ├── Être authentique (pas corporate)
│   ├── Écouter et s'adapter vite
│   └── Gagner client par client
│
└── 🎯 PHILOSOPHIE
    └── "On ne démarche pas. On attire."
```

---

## 12. Résumé exécutif

```
┌─────────────────────────────────────────────────────────────────────┐
│              ANALYSE CONCURRENTIELLE - RÉSUMÉ                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  MARCHÉ         Cloud EU ~100 Md€, +20%/an, dominé par US          │
│                                                                     │
│  CONCURRENTS    OVH (volume), Scaleway (tech), Hetzner (cheap)     │
│  DIRECTS        Infomaniak (éthique), DigitalOcean (UX)            │
│                                                                     │
│  MENACE #1      Infomaniak (mêmes valeurs, mieux établi)           │
│                                                                     │
│  OPPORTUNITÉ    GPU EU premium, PME mal servies, Baltics           │
│                                                                     │
│  DIFFÉRENCIATEUR Support expert humain + agilité startup           │
│                                                                     │
│  MOAT           Culture et relation (le plus dur à copier)         │
│                                                                     │
│  STRATÉGIE      Ne pas se battre sur le prix, gagner sur tout      │
│                 le reste. Attirer, pas démarcher.                  │
│                                                                     │
│  VEILLE         Agents IA pour prix, monitoring continu            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

*Document confidentiel. Dernière mise à jour : Décembre 2025.*
