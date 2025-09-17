# Service Level Agreement (SLA) - VMCloud
**Version 2.1 - 09/03/2025**

---

## Table des matières

1. [Engagement de disponibilité et périmètre](#1-engagement-de-disponibilité-et-périmètre)
2. [Système de compensation par crédits de service](#2-système-de-compensation-par-crédits-de-service)
3. [Procédure de réclamation](#3-procédure-de-réclamation)
4. [Méthode de mesure](#4-méthode-de-mesure)
5. [Exclusions du SLA](#5-exclusions-du-sla)
6. [Remède exclusif](#6-remède-exclusif)
7. [Protection Anti-DDoS et Fair-Use](#7-protection-anti-ddos-et-fair-use)
8. [Contact SLA](#8-contact-sla)

---

## 1. Engagement de disponibilité et périmètre

VMCloud s'engage contractuellement sur un niveau de disponibilité de 98% mensuel pour la majorité de ses services, représentant un standard élevé dans l'industrie du cloud computing. Cet engagement signifie concrètement que chaque service peut subir une indisponibilité maximale de 14 heures et 24 minutes sur un mois de 30 jours, ou 15 heures et 36 minutes sur un mois de 31 jours, sans déclencher les mécanismes de compensation prévus.

### 1.1. Services couverts par le SLA 98%

Cette disponibilité s'applique intégralement aux services VPS (serveurs privés virtuels), instances GPU de calcul haute performance, solutions PaaS (Platform as a Service), répartiteurs de charge (Load Balancer), et services d'hébergement web traditionnels. Pour ces services, VMCloud maîtrise l'intégralité de la chaîne technique depuis l'infrastructure physique jusqu'à la couche de virtualisation, permettant un contrôle précis de la disponibilité.

Le stockage propriétaire VMCloud, incluant le stockage bloc et objet développé en interne, bénéficie également de cette garantie de 98% mensuel. Cette couverture inclut l'accessibilité des APIs, la performance des opérations de lecture/écriture, et l'intégrité des données stockées.

### 1.2. Services à SLA limité

Deux catégories de services font exception à cet engagement standard. Les services CDN (Content Delivery Network) voient leur disponibilité limitée par les performances des fournisseurs d'accès Internet tiers et des points de présence géographiquement distribués. VMCloud ne peut s'engager sur des éléments techniques échappant à son contrôle direct, particulièrement les routages inter-opérateurs et les congestions réseau locales.

Les services s'appuyant sur Amazon Web Services, notamment certaines offres de stockage S3, sont soumis aux SLA d'AWS plutôt qu'aux engagements VMCloud. Cette distinction reflète la responsabilité technique réelle : VMCloud ne peut offrir de garanties supérieures à celles de ses fournisseurs d'infrastructure sous-jacente.

## 2. Système de compensation par crédits de service

Lorsque VMCloud n'atteint pas son engagement de disponibilité de 98% sur un mois donné, un système de compensation automatique s'active pour dédommager les clients impactés. Cette compensation prend exclusivement la forme d'un avoir créditeur appliqué sur le compte client, utilisable sur toutes les factures futures sans limitation de durée d'utilisation.

### 2.1. Barème de compensation

Le barème de compensation suit une logique progressive reflétant l'impact croissant des indisponibilités sur l'activité des clients :

**Niveau 1 : 90% - 97,99% de disponibilité**
- Crédit de **10%** du montant mensuel facturé
- Correspond à une indisponibilité de 14h25 à 72 heures environ
- Reconnaissance de l'impact modéré tout en restant proportionnée

**Niveau 2 : 50% - 89,99% de disponibilité**  
- Crédit de **25%** du montant mensuel facturé
- Indisponibilités pouvant atteindre 15 jours dans le mois
- Reflète un impact significatif nécessitant des solutions de contournement

**Niveau 3 : Moins de 50% de disponibilité**
- **Remboursement intégral** sous forme d'avoir
- Service largement inutilisable pendant la moitié du mois
- Compensation totale reconnaissant l'impossibilité d'usage

### 2.2. Modalités de calcul

Chaque crédit est calculé précisément sur le montant effectivement facturé pour le service spécifiquement touché par l'indisponibilité. Si un client utilise plusieurs services et que seuls certains sont impactés, la compensation ne porte que sur les services effectivement concernés. Le plafond de compensation est fixé à 100% du montant mensuel du service, évitant toute sur-compensation qui pourrait créer des effets d'aubaine.

## 3. Procédure de réclamation

Les réclamations SLA doivent être formulées dans un délai de **15 jours calendaires** suivant l'incident, avec fourniture des éléments suivants :

### 3.1. Informations requises

- **Description précise** de l'incident et de son impact sur l'activité
- **Période concernée** avec dates et heures en fuseau UTC
- **Services affectés** avec références et configurations
- **Preuves techniques éventuelles** du Client (logs, captures, monitoring)

### 3.2. Canal de réclamation

Les réclamations SLA doivent être adressées exclusivement via :
- **Adresse dédiée :** contact@vmcloud.fr
- **Console client :** Section "Réclamations SLA" 
- **Support prioritaire :** Pour les clients Business et Enterprise

### 3.3. Traitement de la réclamation

VMCloud s'engage à accuser réception sous 48 heures et à fournir une réponse définitive sous 7 jours ouvrés. L'instruction s'appuie sur les données de monitoring VMCloud corrélées aux éléments fournis par le client.

## 4. Méthode de mesure

### 4.1. Outils de mesure

La disponibilité est mesurée par les systèmes de monitoring internes de VMCloud utilisant :
- **Logs système** horodatés en UTC
- **Sondes de supervision** distribuées géographiquement  
- **Alertes automatisées** avec corrélation d'événements
- **Métriques de performance** en temps réel

### 4.2. Contestation et contre-expertise

En cas de contestation, le Client peut fournir des éléments probants complémentaires : logs applicatifs, monitoring externe, captures réseau. VMCloud analyse ces éléments en corrélation avec ses propres données pour établir la réalité de l'incident.

## 5. Exclusions du SLA

Les événements suivants sont exclus du calcul de disponibilité et n'ouvrent droit à aucune compensation :

### 5.1. Maintenance planifiée
- **Notifications :** Au minimum 7 jours à l'avance via email et console client
- **Maintenance d'urgence sécuritaire :** Préavis de 48 heures minimum
- **Fenêtres préférentielles :** Entre 2h00 et 6h00 CET pour limiter l'impact

### 5.2. Attaques externes
- **Attaques DDoS** contre l'infrastructure VMCloud ou les services du Client
- **Intrusions** et tentatives de compromission
- **Malwares** et activités malveillantes impactant les systèmes

### 5.3. Faute du Client
- **Configurations défaillantes** ou inappropriées
- **Utilisation non conforme** aux recommandations techniques
- **Dépassements de quotas** et limitations contractuelles
- **Actions** du Client ayant un impact sur la stabilité

### 5.4. Force majeure
- **Catastrophes naturelles** (séismes, inondations, incendies)
- **Événements sociaux** (grèves, conflits sociaux)
- **Défaillances majeures** des fournisseurs d'énergie ou de connectivité
- **Décisions gouvernementales** ou réglementaires

### 5.5. Dépendances tierces
- **Pannes d'AWS** pour les services utilisant cette infrastructure
- **Défaillances des FAI** et opérateurs réseau
- **Fournisseurs d'infrastructure** hors contrôle direct de VMCloud
- **Services tiers** intégrés dans la chaîne de service

## 6. Remède exclusif

Les crédits SLA constituent le **seul et unique remède** en cas de non-respect des engagements de disponibilité. Cette limitation s'applique strictement :

- **Aucune autre compensation** financière ou commerciale ne peut être réclamée
- **Exclusion des dommages indirects** : perte de revenus, coûts de mitigation, préjudice d'image
- **Plafond de responsabilité** : 100% du montant mensuel du service concerné
- **Non-cumul** avec d'autres formes de garanties ou assurances

Cette clause de limitation répond aux impératifs économiques des services cloud et à la mutualisation des risques inhérents à ce modèle d'activité.

## 7. Protection Anti-DDoS et Fair-Use

### 7.1. Protection Anti-DDoS de base

VMCloud déploie une infrastructure de protection contre les attaques par déni de service distribué (DDoS) conçue selon une approche à plusieurs niveaux. Cette protection vise principalement à préserver la stabilité et la disponibilité globale de l'infrastructure VMCloud, garantissant ainsi que les attaques dirigées contre un client spécifique n'impactent pas les services des autres utilisateurs de la plateforme.

La protection de base, déployée universellement sur tous les services VMCloud, fonctionne comme un bouclier périmétrique analysant en permanence le trafic entrant. Cette analyse automatisée détecte les patterns d'attaque les plus courants : volumes anormaux de requêtes, sources géographiques suspectes, signatures de trafic malveillant, et techniques d'amplification DNS ou NTP.

### 7.2. Modalités de protection

Il est essentiel que les clients comprennent que cette protection anti-DDoS privilégie la préservation de l'infrastructure globale VMCloud plutôt que la continuité individuelle de chaque service client. En pratique, cela signifie que lors d'une attaque DDoS d'ampleur significative ciblant les services d'un client, VMCloud peut être amenée à suspendre temporairement ou définitivement l'accès à ces services pour éviter que l'attaque n'affecte l'ensemble de la plateforme.

Cette approche répond à une logique de mutualisation des risques : un client victime d'une attaque majeure ne doit pas compromettre la qualité de service des centaines d'autres clients hébergés sur la même infrastructure. Les mesures de protection peuvent inclure :

- Mise en quarantaine temporaire des adresses IP attaquées
- Blocage de certains ports réseau
- Limitation drastique de la bande passante
- Déconnexion complète des services concernés (cas extrêmes)

### 7.3. Protection renforcée (optionnelle)

Pour les clients nécessitant une protection anti-DDoS plus robuste et individualisée, VMCloud propose des services de protection renforcée disponibles en option sur certaines gammes de produits. Ces protections premium offrent :

- **Capacité d'absorption** de plusieurs dizaines de Gbps
- **Filtrage sophistiqué** par machine learning
- **Maintien préférentiel** des services sous attaque
- **Alertes temps réel** et rapports post-attaque
- **Répartition de charge** résistante aux attaques

### 7.4. Fair-Use et limitations

VMCloud applique des politiques de fair-use pour prévenir l'abus des ressources partagées :

- **Limitation du CPU** moyen sur des périodes prolongées
- **Bridage des IOPS** en cas de surcharge des systèmes de stockage
- **Throttling de la bande passante** en cas d'utilisation excessive
- **Restrictions** sur le port scanning et les activités de reconnaissance

Les seuils précis et modalités sont définis par service dans les fiches produits correspondantes.

### 7.5. Limitation de responsabilité

VMCloud ne peut être tenue responsable des interruptions de service consécutives à des attaques DDoS, même lorsque ses propres mesures de protection ont contribué à ces interruptions. Cette limitation s'applique tant aux protections de base qu'aux protections renforcées, car aucune solution technique ne peut garantir une protection absolue.

## 8. Contact SLA

**Réclamations SLA :** contact@vmcloud.fr  
**Support Business/Enterprise :** Ligne dédiée via console client  
**Urgences critiques :** +372 555 0911 (Business/Enterprise uniquement)  

---

**VMCloud OÜ**  
Paju 1a, 50603 Tartu, Tartu Maakond  
Estonie  
Registre du commerce : 31644377

*Document généré le 09/03/2025*