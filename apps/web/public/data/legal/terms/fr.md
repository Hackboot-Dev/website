# Conditions générales d'utilisation et de vente – VMCloud

> **Version 2.1 – Date d'effet: 09/03/2025**
>
> **Entité contractante :** VMCloud OÜ, société estonienne, filiale de VMCloud Group OÜ, filiale de DVP Holding
>
> **Directeur :** Gaylor Loche
>
> **Siège social :** Paju 1a, 50603 Tartu, Tartu Maakond, Estonie
>
> **Registre du commerce :** 31644377
>
> Le présent document constitue le contrat liant VMCloud OÜ (« nous », « notre », « VMCloud », « l'Opérateur ») et toute personne morale ou physique utilisant nos services (« vous », « Client », « Utilisateur »). Il définit les conditions juridiques et commerciales applicables à l'ensemble des Services d'infrastructure cloud (VPS, GPU, Stockage Objet/Bloc, CDN, PaaS, Load Balancer, Web Hosting, réseau, API et services associés).

---

## Table des matières

1. [Définitions](#1-définitions)
2. [Objet et champ d'application](#2-objet-et-champ-dapplication) 
3. [Création de Compte et sécurité](#3-création-de-compte-et-sécurité)
4. [Commande et mise en service](#4-commande-et-mise-en-service)
5. [Tarification et paiements](#5-tarification-et-paiements)
6. [Impayés et procédure de recouvrement](#6-impayés-et-procédure-de-recouvrement)
7. [SLA et engagements de service](#7-sla-et-engagements-de-service)
8. [Quotas, Fair-Use et Anti-DDoS](#8-quotas-fair-use-et-anti-ddos)
9. [Support et escalade](#9-support-et-escalade)
10. [Données, sauvegardes et réversibilité](#10-données-sauvegardes-et-réversibilité)
11. [Conservation des logs et accès](#11-conservation-des-logs-et-accès)
12. [Sécurité et responsabilité partagée](#12-sécurité-et-responsabilité-partagée)
13. [Protection des données personnelles (RGPD)](#13-protection-des-données-personnelles-rgpd)
14. [Politique d'usage acceptable (AUP)](#14-politique-dusage-acceptable-aup)
15. [Propriété intellectuelle](#15-propriété-intellectuelle)
16. [API et automatisation](#16-api-et-automatisation)
17. [Services spécifiques par produit](#17-services-spécifiques-par-produit)
18. [Suspension et résiliation](#18-suspension-et-résiliation)
19. [Maintenance et incidents](#19-maintenance-et-incidents)
20. [Garanties et exclusions](#20-garanties-et-exclusions)
21. [Responsabilité et limitations](#21-responsabilité-et-limitations)
22. [Force majeure](#22-force-majeure)
23. [Conformité et sanctions internationales](#23-conformité-et-sanctions-internationales)
24. [Audit et certifications](#24-audit-et-certifications)
25. [Sous-traitance et cession](#25-sous-traitance-et-cession)
26. [Confidentialité et références](#26-confidentialité-et-références)
27. [Modifications des Services et Conditions](#27-modifications-des-services-et-conditions)
28. [Droit applicable et juridiction](#28-droit-applicable-et-juridiction)
29. [Dispositions diverses](#29-dispositions-diverses)
30. [Historique des versions](#30-historique-des-versions)

---

## 1. Définitions

Aux fins des présentes, les termes suivants ont la signification ci‑après. Les définitions sont d'interprétation stricte et s'appliquent indifféremment au singulier et au pluriel.

**« Compte »** désigne l'espace client sécurisé mis à disposition par VMCloud, permettant la gestion des Services, des utilisateurs habilités, des moyens de paiement, des documents comptables et des paramètres opérationnels. Le Client demeure responsable de la création, de l'exactitude et de la mise à jour des informations de son Compte.

**« Services »** désigne l'ensemble des offres d'infrastructure et de plateformes cloud fournies par VMCloud, incluant sans s'y limiter : les serveurs privés virtuels (VPS), les instances GPU de calcul, le Stockage Objet compatible S3, le Stockage Bloc, le CDN, le PaaS, les répartiteurs de charge (Load Balancer), l'hébergement web, les fonctionnalités réseau et les API associées.

**« SLA »** (Service Level Agreement) désigne les engagements quantifiés de niveau de service publiés par VMCloud, notamment la disponibilité ciblée de 98% mensuel et les modalités d'obtention de crédits de service en cas de non‑atteinte documentée, hors exclusions prévues aux présentes.

**« API »** désigne toute interface de programmation fournie par VMCloud permettant l'automatisation de la création, modification, supervision et suppression des ressources via des protocoles standardisés (REST, GraphQL).

**« Contenus »** désigne l'ensemble des données, fichiers, configurations, images système, applications, journaux et informations que le Client charge, stocke, traite, transmet ou rend accessible via les Services.

**« Incident »** désigne tout événement altérant ou interrompant le fonctionnement normal d'un Service. **« Maintenance »** désigne les opérations planifiées d'entretien, mise à jour ou évolution des infrastructures ou logiciels.

**« Fair-Use »** désigne les politiques d'usage équitable visant à prévenir l'abus de ressources partagées et garantir la qualité de service pour l'ensemble des clients.

**« DPA »** (Data Processing Agreement) désigne l'accord de traitement des données personnelles conforme au RGPD, disponible séparément et référencé aux présentes.

## 2. Objet et champ d'application

Les présentes conditions générales d'utilisation et de vente (les « CGUV ») régissent l'ensemble des relations contractuelles entre VMCloud OÜ et le Client relativement aux Services. Elles s'appliquent à toute commande, mise à disposition, utilisation, facturation et résiliation, quel que soit le mode de souscription.

Ces CGUV prévalent sur les conditions d'achat du Client et sur tout autre document non expressément accepté par écrit par VMCloud. Des conditions spécifiques, fiches produit ou annexes techniques peuvent compléter les présentes. En cas de contradiction, l'ordre de priorité suivant s'applique :
1. Conditions spécifiques dûment acceptées par les deux parties
2. Présentes CGUV
3. Documentation technique publique et fiches produits
4. Accords de niveau de service (SLA)

Le Client reconnaît avoir pris connaissance des CGUV, du DPA, de l'AUP (Politique d'Usage Acceptable) et de la documentation technique avant toute souscription, et déclare les accepter sans réserve.

## 3. Création de Compte et sécurité

### 3.1. Création et gestion du Compte

L'accès aux Services suppose la création d'un Compte via la console web ou l'API. Le Client s'engage à :
- Fournir des informations exactes, complètes et à jour
- Notifier promptement toute modification pertinente
- Maintenir la confidentialité de ses identifiants d'accès
- Gérer les habilitations utilisateurs selon le principe du moindre privilège

### 3.2. Vérifications de sécurité

VMCloud se réserve le droit d'effectuer des vérifications antifraude et de conformité, incluant :
- Vérification de cartes bancaires et moyens de paiement
- Procédures KYC (Know Your Customer) justifiées par le niveau de risque
- Contrôles géographiques et de sanctions internationales
- Vérification d'identité pour certains services sensibles

### 3.3. Sécurité et bonnes pratiques

Le Client met en place des mesures de sécurité proportionnées :
- Authentification forte (MFA recommandée)
- Gestion sécurisée des clés SSH et tokens API
- Rotation régulière des secrets et mots de passe
- Durcissement des systèmes et configurations
- Segmentation réseau et politiques de journalisation
- Monitoring des accès et activités suspectes

Toute compromission suspectée doit être notifiée immédiatement à contact@vmcloud.fr. VMCloud peut adopter des mesures conservatoires pour préserver la sécurité globale.

## 4. Commande et mise en service

### 4.1. Processus de commande

Les commandes sont passées via la console web, l'API ou les canaux commerciaux autorisés. À réception, VMCloud peut :
- Effectuer les vérifications de sécurité mentionnées à l'article 3.2
- Vérifier la disponibilité technique des ressources
- Confirmer la validité des moyens de paiement

### 4.2. Mise en service

La mise en service est généralement immédiate sous réserve :
- De la validation des contrôles de sécurité
- De la disponibilité technique des ressources demandées
- Du paiement effectif ou de la validation des moyens de paiement

### 4.3. Essais gratuits

Certains Services proposent des périodes d'essai gratuit, mentionnées explicitement dans les fiches produits. À l'issue de la période d'essai :
- La somme correspondant à l'usage est due intégralement
- Aucun remboursement n'est possible pour la période d'essai
- Le Service peut être suspendu en cas de non-paiement
- Aucune tolérance n'est accordée, quel que soit le montant

### 4.4. Droit de rétractation

Pour les professionnels, aucun droit de rétractation n'est applicable. Les Services d'infrastructure étant personnalisés et activés immédiatement, le droit de rétractation des consommateurs ne s'applique pas conformément aux dispositions légales.

## 5. Tarification et paiements

### 5.1. Structure tarifaire

Les prix sont exprimés hors taxes et indiqués dans la documentation commerciale et les fiches produits. Les taxes applicables (TVA, taxes locales) sont facturées en sus selon la réglementation estonienne et celle du pays du Client.

**Modèles de facturation disponibles :**
- **Horaire :** Facturation à la seconde, consolidée mensuellement
- **Mensuel :** Tarif fixe pour la période, payable d'avance
- **Annuel :** Paiement anticipé avec économies liées à l'engagement

### 5.2. Modalités de paiement

Les paiements s'effectuent par les moyens acceptés (carte bancaire, virement SEPA, autres moyens listés). Le Client autorise VMCloud à initier les encaissements aux échéances convenues.

**Quotas et dépassements :** Tous les quotas, limites de ressources et barèmes de dépassement (overage) sont détaillés dans les fiches produits correspondantes. Aucune tolérance n'est accordée au-delà des limites contractuelles.

### 5.2.1. Système de caution pour la facturation horaire

#### Principe général et montant

Pour tout nouveau client optant pour la facturation horaire (facturation à l'usage), VMCloud applique un système de caution destiné à garantir le paiement de la consommation réelle tout en offrant une flexibilité maximale d'utilisation. Cette caution est fixée uniformément à **900 euros** (neuf cents euros), quel que soit le service commandé en mode de facturation horaire.

Ce montant de caution est :
- Identique pour tous les services et toutes les configurations en facturation horaire
- Prélevé intégralement lors de la validation de la première commande
- Conservé sur un compte bancaire ségrégué distinct des comptes opérationnels de VMCloud
- Protégé contre toute saisie par des créanciers de VMCloud

#### Mécanisme de fonctionnement et remboursement

Le système de caution fonctionne selon un mécanisme transparent et automatisé. À la fin de chaque période de facturation mensuelle, VMCloud procède au calcul détaillé de la consommation réelle du client. Ce calcul s'effectue automatiquement selon les tarifs horaires en vigueur, avec une granularité à la seconde pour une facturation équitable.

Le montant correspondant à la consommation réelle est prélevé sur la caution versée, et le solde restant est intégralement remboursé au client. Ce remboursement intervient automatiquement dans un délai maximum de **5 jours ouvrés** suivant la clôture de la période de facturation, sur le même moyen de paiement utilisé pour le versement initial de la caution.

**Exemple pratique :** Un client verse une caution de 900€ le 1er janvier. Sa consommation réelle pour le mois de janvier s'élève à 234,56€. Le 5 février au plus tard, VMCloud rembourse automatiquement 665,44€ au client, accompagné d'un relevé détaillé de consommation justifiant le montant prélevé.

#### Application et exemptions

La caution est systématiquement appliquée lors de :
- La première commande d'un nouveau client choisissant la facturation horaire
- La première utilisation du mode de facturation horaire par un client existant
- L'ouverture d'un nouveau compte avec ce mode de facturation

Après le premier mois d'utilisation et sous réserve d'un historique de paiement satisfaisant, la caution n'est plus requise pour les mois suivants. Le client bénéficie alors d'une facturation mensuelle classique basée sur sa consommation réelle, sans avance de trésorerie.

#### Réinstauration de la caution

VMCloud se réserve le droit de réinstaurer l'obligation de caution dans certaines circonstances spécifiques visant à protéger ses intérêts financiers. Cette réinstauration peut intervenir après :

**Incidents de paiement répétés :**
- Deux rejets de paiement consécutifs sur une période de 3 mois
- Trois rejets de paiement cumulés sur une période de 6 mois
- Une contestation abusive de transaction bancaire (chargeback) non justifiée

**Retards de paiement récurrents :**
- Cumul de plus de 30 jours de retard sur une période de 3 mois
- Un retard de paiement supérieur à 60 jours sur une seule facture
- Un pattern récurrent de retards (plus de 4 retards sur 12 mois glissants)

La réinstauration de la caution peut prendre trois formes :
- **Permanente :** Application systématique à toutes les futures commandes du client
- **Temporaire :** Application pendant une période probatoire de 6 mois
- **Conditionnelle :** Application selon le montant ou le type de service commandé

Le client est informé de la réinstauration de la caution par email avec un préavis minimum de 15 jours calendaires, incluant les raisons motivant cette décision et la possibilité de contester dans un délai de 7 jours.

#### Garanties et transparence

VMCloud garantit une transparence totale sur la gestion des cautions. Le client dispose d'un accès permanent via son espace client à :
- Le montant de sa caution versée
- Sa consommation en temps réel
- L'historique complet de ses remboursements
- Les projections de facturation pour la période en cours

Les fonds de caution sont conservés sur un compte bancaire dédié, séparé des comptes opérationnels de VMCloud, garantissant leur disponibilité pour remboursement. Ces fonds ne peuvent être utilisés pour le fonctionnement de l'entreprise et sont protégés contre les créanciers en cas de difficultés financières de VMCloud.

En cas de désaccord sur le calcul de la consommation ou le montant du remboursement, le client peut contester dans les 30 jours suivant la facturation. Durant l'instruction du litige, le prélèvement contesté est suspendu et une procédure contradictoire est mise en place pour résoudre le différend.

### 5.3. Évolution des prix et indexation

VMCloud opère dans un environnement économique fluctuant où certains coûts échappent à son contrôle direct. L'entreprise peut donc être amenée à ajuster ses tarifs pour maintenir la viabilité de ses services et la qualité de l'infrastructure proposée. Ces évolutions tarifaires interviennent principalement pour absorber des hausses significatives de coûts opérationnels externes.

Les principales causes d'évolution des prix incluent les variations du coût de l'énergie électrique, particulièrement sensibles dans le secteur des datacenters où l'électricité représente une part importante des charges. Les augmentations des tarifs des licences logicielles par les éditeurs tiers (Microsoft, VMware, etc.) constituent également un facteur d'ajustement, tout comme l'évolution des coûts d'infrastructure liés aux fournisseurs de centres de données, de connectivité réseau ou de matériel informatique.

### 5.4. Procédure de notification des changements tarifaires

Lorsqu'une évolution tarifaire devient nécessaire, VMCloud respecte un processus de notification transparent et équitable. Tous les clients concernés reçoivent un préavis minimum de 30 jours calendaires avant l'entrée en vigueur du nouveau tarif. Cette notification s'effectue par email personnalisé adressé aux contacts principaux et techniques de chaque compte, ainsi que par une notification persistante dans l'espace client.

La communication détaille précisément les services concernés, l'ampleur de l'augmentation (en pourcentage et en valeur absolue), la date d'entrée en vigueur et les raisons économiques motivant cette évolution. VMCloud s'attache à expliquer clairement l'impact de cette modification sur la facture mensuelle ou annuelle de chaque client, avec des exemples chiffrés personnalisés selon les services souscrits.

Par exemple, si le coût d'une licence Windows Server augmente de 15% chez Microsoft, VMCloud répercutera cette hausse sur les VPS Windows en précisant : "Le coût mensuel de votre VPS-BUSINESS Windows passera de 199€ à 229€ à partir du 1er mars 2025, soit une augmentation de 30€ liée à la hausse des licences Microsoft". Cette transparence permet au client d'anticiper l'impact budgétaire et de prendre ses décisions en connaissance de cause.

### 5.5. Options disponibles pour les clients

Face à une évolution tarifaire, chaque client dispose de plusieurs options clairement expliquées dans la notification. Il peut accepter le nouveau tarif sans démarche particulière, auquel cas ses services continuent normalement aux nouvelles conditions tarifaires. Il peut également négocier un engagement plus long (passage d'un abonnement mensuel à annuel par exemple) pour bénéficier d'un tarif préférentiel compensant partiellement la hausse.

Si le client considère que l'augmentation est inacceptable pour son modèle économique, il dispose d'un droit de résiliation anticipée sans frais ni pénalités. Cette résiliation peut être activée à tout moment avant la date d'entrée en vigueur du nouveau tarif, permettant au client de migrer vers une solution alternative sans contrainte financière.

VMCloud propose également un service d'accompagnement personnalisé pour aider les clients à identifier des alternatives internes (changement de formule, optimisation de la configuration) permettant de maintenir leurs coûts dans une enveloppe acceptable tout en préservant leurs performances opérationnelles.

### 5.6. Engagements de VMCloud sur la modération tarifaire

VMCloud s'engage à limiter les évolutions tarifaires au strict nécessaire pour maintenir la qualité de service et la pérennité de l'entreprise. Les hausses de prix ne sont jamais utilisées comme levier de rentabilité supplémentaire mais uniquement pour absorber des coûts externes inévitables qui dépassent les seuils de tolérance économique de l'entreprise.

**Indexation automatique :** Pour certains services particulièrement sensibles aux variations de coûts externes (notamment les services nécessitant des licences tierces ou une consommation énergétique intensive), VMCloud peut implémenter des clauses d'indexation automatique basées sur des indices publics reconnus (indices énergie, indices de prix des licences logicielles). Ces clauses, lorsqu'elles s'appliquent, sont clairement mentionnées dans les conditions particulières du service et respectent le préavis de 30 jours pour leur application.

**Optimisation continue :** L'entreprise privilégie les optimisations techniques et les économies d'échelle pour maintenir ses tarifs stables. Elle négocie également des accords pluriannuels avec ses fournisseurs stratégiques pour limiter la volatilité des coûts répercutés aux clients. Les gains d'efficacité réalisés par VMCloud bénéficient prioritairement au maintien de la compétitivité tarifaire plutôt qu'à l'augmentation des marges.

**Transparence annuelle :** VMCloud publie annuellement un rapport de transparence tarifaire expliquant l'évolution de ses principaux postes de coûts et les mesures prises pour optimiser l'efficacité économique de ses services. Ce document permet aux clients de comprendre la politique tarifaire de l'entreprise et d'anticiper les évolutions potentielles selon les tendances du marché et les investissements technologiques planifiés.

## 6. Impayés et procédure de recouvrement

### 6.1. Politique stricte de recouvrement

VMCloud applique une politique de recouvrement particulièrement stricte, conçue pour protéger la viabilité économique de ses services et maintenir l'équité entre tous les clients. Cette politique ne connaît aucun seuil de tolérance : même un impayé d'un euro déclenche automatiquement la procédure de recouvrement. Cette approche rigoureuse s'applique indépendamment du montant concerné, de l'historique du client ou des circonstances particulières invoquées.

La procédure est entièrement automatisée dans ses phases initiales afin de garantir l'équité de traitement et d'éviter toute discrimination. Chaque client reçoit exactement les mêmes délais et les mêmes opportunités de régulariser sa situation, quel que soit son profil ou son volume d'activité.

### 6.2. Phase 1 : Suspension immédiate des services (J+2)

Deux jours calendaires après la date d'échéance de paiement, tous les services du client sont automatiquement suspendus. Cette suspension technique signifie que le client perd immédiatement l'accès à ses serveurs, applications, bases de données et à l'ensemble de son infrastructure VMCloud. 

La notification de cette suspension est envoyée simultanément par email au contact principal et aux contacts techniques référencés dans le compte. Cette notification explique clairement la raison de la suspension, rappelle le montant impayé et indique la marche à suivre pour régulariser la situation. Le client peut encore accéder à son tableau de bord VMCloud pour effectuer le paiement, mais ne peut plus utiliser ses services opérationnels.

Durant cette phase de suspension, VMCloud maintient l'intégrité des données du client. Les serveurs sont arrêtés mais les disques et configurations sont préservés intégralement. Cette mesure vise à inciter le client à régulariser rapidement sa situation tout en lui laissant une possibilité de reprise normale de ses activités dès le paiement effectué.

### 6.3. Phase 2 : Mise en demeure ultime (J+7)

Sept jours après l'échéance, si aucun paiement n'a été effectué, VMCloud envoie une mise en demeure formelle par voie électronique. Cette communication revêt un caractère particulièrement solennel car elle constitue le dernier avertissement avant la destruction définitive des données.

La mise en demeure précise explicitement que le client dispose d'exactement 24 heures pour effectuer son paiement, faute de quoi l'ensemble de ses données sera supprimé de manière définitive et irrécupérable. Ce délai de 24 heures court à compter de l'envoi de l'email de mise en demeure, qui est horodaté précisément. Le client est informé que passé ce délai, aucun paiement ultérieur ne permettra de récupérer ses données ou de restaurer ses services.

Cette notification détaille également les conséquences pratiques de la suppression : perte définitive de tous les fichiers, bases de données, configurations, emails, sites web, applications et tout autre contenu hébergé chez VMCloud. Le client est expressément informé qu'il s'agit de sa dernière opportunité de sauvegarder ses données s'il le souhaite, en effectuant le paiement dans les 24 heures imparties.

### 6.4. Phase 3 : Destruction définitive des données (J+8)

Si le paiement n'est pas effectué dans les 24 heures suivant la mise en demeure, VMCloud procède automatiquement et immédiatement à la suppression complète et définitive de toutes les données du client. Cette opération technique intervient exactement huit jours après la date d'échéance initiale et ne souffre aucune exception ou report.

La suppression concerne l'intégralité des données : serveurs virtuels, disques de données, bases de données, fichiers, emails, configurations réseau, snapshots, sauvegardes automatiques et tout autre élément technique associé au compte du client. Cette destruction s'étend également aux sauvegardes techniques que VMCloud pourrait conserver pour ses propres besoins opérationnels.

Le processus de suppression utilise des techniques de destruction sécurisée rendant les données techniquement irrécupérables. VMCloud met en œuvre des procédures d'effacement multiple conformes aux standards de sécurité les plus exigeants. Une fois cette suppression réalisée, il devient techniquement impossible de récupérer les données, même en cas de paiement immédiat ou de négociation commerciale ultérieure.

Cette suppression définitive s'accompagne d'une notification automatique informant le client que ses données ont été détruites et que son compte est désormais vide. Le client conserve la possibilité de réactiver son compte en payant les sommes dues, mais devra repartir de zéro sans possibilité de récupération de ses anciens contenus.

### 6.5. Phase 4 : Relance commerciale formelle (J+14)

Quatorze jours après l'échéance, VMCloud envoie une seconde relance, cette fois par voie postale recommandée. Cette démarche vise à s'assurer que le client a bien reçu les notifications électroniques précédentes et à formaliser la créance selon les exigences légales de recouvrement.

Cette relance postale récapitule l'ensemble de la procédure écoulée, rappelle que les données ont été définitivement supprimées, et informe le client des frais de relance qui s'ajoutent désormais à la dette initiale. Ces frais couvrent les coûts administratifs et postaux liés à cette démarche formelle de recouvrement.

Le client est informé qu'il dispose encore de la possibilité de régulariser sa situation pour éviter la transmission du dossier aux services de recouvrement, mais qu'aucune récupération de données n'est possible. S'il souhaite utiliser à nouveau les services VMCloud, il devra reconstruire entièrement son infrastructure.

### 6.6. Phase 5 : Transmission au recouvrement (J+30)

Trente jours après l'échéance initiale, si aucune régularisation n'est intervenue, VMCloud transmet automatiquement le dossier à ses partenaires spécialisés dans le recouvrement de créances. À ce stade, la gestion du dossier échappe aux équipes VMCloud et relève des procédures légales standard de recouvrement.

Cette transmission s'accompagne de l'application de l'ensemble des pénalités de retard prévues par la loi, des frais de recouvrement forfaitaires et des éventuels coûts de procédure. Le montant total de la créance peut alors significativement dépasser la facture initiale impayée.

Le client reçoit une notification l'informant de cette transmission et des nouvelles modalités de contact pour toute régularisation. VMCloud se réserve la possibilité de communiquer à ses partenaires de recouvrement toutes les informations nécessaires à leurs démarches, dans le respect de la réglementation applicable.

### 6.7. Communication et transparence de la procédure

Tout au long de cette procédure, VMCloud s'attache à maintenir une communication claire et transparente avec le client. Chaque notification précise l'étape en cours, les délais restants, les actions possibles et les conséquences de l'inaction. Les emails de notification incluent des liens directs vers l'espace de paiement pour faciliter la régularisation.

VMCloud met à disposition dans l'espace client un suivi en temps réel de l'état du compte, permettant au client de connaître précisément sa situation et les échéances à venir. Un système d'alerte automatique avertit également par SMS les clients dont les coordonnées téléphoniques sont renseignées.

Cette procédure stricte vise à responsabiliser les clients sur l'importance du respect des échéances de paiement tout en leur offrant plusieurs opportunités de régularisation avant les mesures irréversibles.

## 7. SLA et engagements de service

### 7.1. Engagement de disponibilité et périmètre

VMCloud s'engage contractuellement sur un niveau de disponibilité de 98% mensuel pour la majorité de ses services, représentant un standard élevé dans l'industrie du cloud computing. Cet engagement signifie concrètement que chaque service peut subir une indisponibilité maximale de 14 heures et 24 minutes sur un mois de 30 jours, ou 15 heures et 36 minutes sur un mois de 31 jours, sans déclencher les mécanismes de compensation prévus.

Cette disponibilité s'applique intégralement aux services VPS (serveurs privés virtuels), instances GPU de calcul haute performance, solutions PaaS (Platform as a Service), répartiteurs de charge (Load Balancer), et services d'hébergement web traditionnels. Pour ces services, VMCloud maîtrise l'intégralité de la chaîne technique depuis l'infrastructure physique jusqu'à la couche de virtualisation, permettant un contrôle précis de la disponibilité.

Le stockage propriétaire VMCloud, incluant le stockage bloc et objet développé en interne, bénéficie également de cette garantie de 98% mensuel. Cette couverture inclut l'accessibilité des APIs, la performance des opérations de lecture/écriture, et l'intégrité des données stockées.

Deux catégories de services font exception à cet engagement standard. Les services CDN (Content Delivery Network) voient leur disponibilité limitée par les performances des fournisseurs d'accès Internet tiers et des points de présence géographiquement distribués. VMCloud ne peut s'engager sur des éléments techniques échappant à son contrôle direct, particulièrement les routages inter-opérateurs et les congestions réseau locales.

Les services s'appuyant sur Amazon Web Services, notamment certaines offres de stockage S3, sont soumis aux SLA d'AWS plutôt qu'aux engagements VMCloud. Cette distinction reflète la responsabilité technique réelle : VMCloud ne peut offrir de garanties supérieures à celles de ses fournisseurs d'infrastructure sous-jacente.

### 7.2. Système de compensation par crédits de service

Lorsque VMCloud n'atteint pas son engagement de disponibilité de 98% sur un mois donné, un système de compensation automatique s'active pour dédommager les clients impactés. Cette compensation prend exclusivement la forme d'un avoir créditeur appliqué sur le compte client, utilisable sur toutes les factures futures sans limitation de durée d'utilisation.

Le barème de compensation suit une logique progressive reflétant l'impact croissant des indisponibilités sur l'activité des clients. Pour une disponibilité mensuelle comprise entre 90% et 97,99%, correspondant à une indisponibilité de 14h25 à 72 heures environ, VMCloud accorde un crédit représentant 10% du montant mensuel facturé pour le service concerné. Cette compensation reconnaît l'impact modéré de l'indisponibilité tout en restant proportionnée à la dégradation de service effectivement subie.

Lorsque la disponibilité descend entre 50% et 89,99%, révélant des dysfonctionnements plus importants avec des indisponibilités pouvant atteindre 15 jours dans le mois, la compensation passe à 25% du montant mensuel. Ce niveau reflète un impact significatif sur l'activité du client, nécessitant probablement la mise en place de solutions de contournement coûteuses ou la perte temporaire de revenus liés aux services indisponibles.

Dans les cas extrêmes où la disponibilité tombe sous les 50% mensuels, indiquant un dysfonctionnement majeur ayant rendu le service largement inutilisable pendant la moitié du mois, VMCloud procède au remboursement intégral du mois sous forme d'avoir. Cette situation, exceptionnelle dans le fonctionnement normal des infrastructures, justifie une compensation totale reconnaissant l'impossibilité pour le client d'utiliser le service payé.

Chaque crédit est calculé précisément sur le montant effectivement facturé pour le service spécifiquement touché par l'indisponibilité. Si un client utilise plusieurs services et que seuls certains sont impactés, la compensation ne porte que sur les services effectivement concernés. Le plafond de compensation est fixé à 100% du montant mensuel du service, évitant toute sur-compensation qui pourrait créer des effets d'aubaine.

### 7.3. Procédure de réclamation

Les réclamations SLA doivent être formulées dans un délai de **15 jours calendaires** suivant l'incident, avec fourniture des éléments suivants :
- Description précise de l'incident et de son impact
- Période concernée (dates et heures UTC)
- Services affectés
- Preuves techniques éventuelles du Client

### 7.4. Méthode de mesure

La disponibilité est mesurée par les systèmes de monitoring internes de VMCloud (logs, sondes, alertes) en fuseau UTC. En cas de contestation, le Client peut fournir des éléments probants complémentaires.

### 7.5. Exclusions du SLA

Sont exclus du calcul de disponibilité :
- **Maintenance planifiée :** Notifiée au minimum 7 jours à l'avance (48 heures en cas d'urgence sécuritaire)
- **Attaques DDoS** contre l'infrastructure ou les services du Client
- **Faute du Client :** Configurations défaillantes, utilisation inappropriée, dépassements de quotas
- **Force majeure :** Événements indépendants de la volonté de VMCloud
- **Dépendances tierces :** Pannes d'AWS, FAI, fournisseurs d'infrastructure hors contrôle direct

### 7.6. Remède exclusif

Les crédits SLA constituent le seul et unique remède en cas de non-respect des engagements de disponibilité. Aucune autre forme de compensation ou dédommagement ne peut être réclamée.

## 8. Quotas, Fair-Use et Anti-DDoS

### 8.1. Référence aux fiches produits

L'ensemble des quotas, limites de ressources, politiques de fair-use et barèmes de dépassement sont détaillés dans les fiches produits correspondantes, disponibles sur le site web et intégrées aux présentes par référence.

### 8.2. Protection Anti-DDoS : Principes et limitations

VMCloud déploie une infrastructure de protection contre les attaques par déni de service distribué (DDoS) conçue selon une approche à plusieurs niveaux. Cette protection vise principalement à préserver la stabilité et la disponibilité globale de l'infrastructure VMCloud, garantissant ainsi que les attaques dirigées contre un client spécifique n'impactent pas les services des autres utilisateurs de la plateforme.

La protection de base, déployée universellement sur tous les services VMCloud, fonctionne comme un bouclier périmétrique analysant en permanence le trafic entrant. Cette analyse automatisée détecte les patterns d'attaque les plus courants : volumes anormaux de requêtes, sources géographiques suspectes, signatures de trafic malveillant, et techniques d'amplification DNS ou NTP. Lorsqu'une attaque est détectée, les systèmes de défense activent automatiquement des contre-mesures proportionnelles à la menace identifiée.

### 8.3. Modalités de protection et impact sur les services clients

Il est essentiel que les clients comprennent que cette protection anti-DDoS privilégie la préservation de l'infrastructure globale VMCloud plutôt que la continuité individuelle de chaque service client. En pratique, cela signifie que lors d'une attaque DDoS d'ampleur significative ciblant les services d'un client, VMCloud peut être amenée à suspendre temporairement ou définitivement l'accès à ces services pour éviter que l'attaque n'affecte l'ensemble de la plateforme.

Cette approche répond à une logique de mutualisation des risques : un client victime d'une attaque majeure ne doit pas compromettre la qualité de service des centaines d'autres clients hébergés sur la même infrastructure. Les mesures de protection peuvent donc inclure la mise en quarantaine temporaire des adresses IP attaquées, le blocage de certains ports réseau, la limitation drastique de la bande passante, ou dans les cas extrêmes, la déconnexion complète des services concernés.

VMCloud met en œuvre cette politique de protection de manière automatisée et sans préavis lorsque l'urgence l'exige. Les systèmes de détection fonctionnent 24h/24 et peuvent activer les contre-mesures en quelques secondes seulement. Une notification est envoyée au client concerné dès que possible après l'activation des mesures de protection, mais la priorité reste la stabilisation de l'infrastructure globale.

### 8.4. Protection renforcée et services premium

Pour les clients nécessitant une protection anti-DDoS plus robuste et individualisée, VMCloud propose des services de protection renforcée disponibles en option sur certaines gammes de produits. Ces protections premium offrent une capacité d'absorption supérieure, des mécanismes de filtrage plus sophistiqués et surtout, une approche privilégiant le maintien en service des applications du client plutôt que leur isolation préventive.

Les niveaux de protection renforcée incluent généralement une capacité d'absorption de plusieurs dizaines de gigabits par seconde, des techniques de filtrage par machine learning capables de distinguer le trafic légitime des requêtes malveillantes, et des mécanismes de répartition de charge permettant de maintenir les services opérationnels même sous attaque. Ces protections intègrent également des systèmes d'alertes en temps réel et des rapports détaillés post-attaque.

Chaque fiche produit précise explicitement le niveau de protection anti-DDoS inclus dans l'offre standard et les options de protection renforcée disponibles. Ces informations détaillent la capacité d'absorption en Gbps, les types d'attaques couvertes (volumétriques, applicatives, protocoles), et les mécanismes de notification mis en place.

### 8.5. Responsabilités respectives et recommandations

VMCloud encourage vivement ses clients à mettre en place leurs propres mesures de protection complémentaires, notamment au niveau applicatif. Ces mesures incluent la limitation du taux de requêtes par utilisateur, la mise en place de CAPTCHAs lors de pics d'activité suspecte, le blacklistage des adresses IP sources d'attaques récurrentes, et l'utilisation de services de CDN avec protection DDoS intégrée pour les contenus statiques.

Les clients opérant des services à forte visibilité ou potentiellement controversés sont particulièrement encouragés à souscrire aux options de protection renforcée. VMCloud peut également recommander l'utilisation de services tiers spécialisés dans la protection anti-DDoS pour les clients aux besoins spécifiques ou aux risques élevés.

Il est important de noter que VMCloud ne peut être tenue responsable des interruptions de service consécutives à des attaques DDoS, même lorsque ses propres mesures de protection ont contribué à ces interruptions. Cette limitation de responsabilité s'applique tant aux protections de base qu'aux protections renforcées, car aucune solution technique ne peut garantir une protection absolue contre toutes les formes d'attaques.

### 8.6. Fair-Use et limitations

VMCloud applique des politiques de fair-use pour prévenir l'abus des ressources partagées :
- Limitation du CPU moyen sur des périodes prolongées
- Bridage des IOPS en cas de surcharge
- Throttling de la bande passante en cas d'utilisation excessive
- Restrictions sur le port scanning et les activités de reconnaissance

Les seuils précis et modalités sont définis par service dans les fiches produits.

## 9. Support et escalade

### 9.1. Canaux de support disponibles

**Support Standard (inclus) :**
- Tickets via console web : 24/7
- Email : contact@vmcloud.fr
- Chat : Selon horaires affichés
- Documentation : Base de connaissances publique

**Support prioritaire (optionnel) :**
- Niveaux Business et Enterprise avec SLA de réponse garantis
- Téléphone dédié pour les comptes qualifiés
- Escalade technique prioritaire

### 9.2. SLA de support par niveau

VMCloud propose différents niveaux de support adaptés aux besoins et aux budgets de ses clients, mais ne s'engage sur aucune obligation contraignante de délais de réponse. Notre approche privilégie la qualité de la résolution plutôt que des délais artificiels qui pourraient compromettre l'efficacité de notre intervention.

**Standard :** Notre support standard vise généralement une réponse sous 48 heures ouvrées pour les demandes non critiques, mais nous nous efforçons souvent de faire mieux selon la disponibilité de nos équipes. La résolution s'effectue au mieux de nos capacités, en fonction de la complexité technique et des priorités en cours. Ce niveau convient aux usages non critiques où la rapidité n'est pas le facteur principal.

**Business :** Pour nos clients Business, nous nous efforçons de répondre dans les 4 heures et de résoudre les problèmes sous 24 heures ouvrées, sans que cela constitue un engagement contractuel ferme. L'accès au chat en direct et la priorité élevée accordée aux demandes permettent généralement d'obtenir une assistance plus réactive.

**Enterprise :** Nos clients Enterprise bénéficient de notre attention prioritaire avec un objectif de réponse sous 2 heures 24/7 et de résolution sous 8 heures. Ils disposent d'une ligne téléphonique dédiée, d'un account manager assigné, et d'une escalade technique accélérée. Cependant, même à ce niveau premium, nos engagements restent des objectifs de qualité de service plutôt que des obligations contractuelles strictes.

### 9.3. Langues supportées

Support disponible en français et anglais. D'autres langues peuvent être proposées selon la disponibilité.

## 10. Données, sauvegardes et réversibilité

### 10.1. Propriété des données

Le Client reste seul propriétaire et responsable de ses données, de leur licéité, de leur protection et de leur conformité réglementaire. VMCloud agit exclusivement comme prestataire technique.

### 10.2. Responsabilité des sauvegardes

**Sauvegardes infrastructure :** VMCloud sauvegarde son infrastructure générale pendant une durée variable (jusqu'à 12 mois selon les éléments). Ces sauvegardes sont destinées à la continuité opérationnelle de VMCloud uniquement.

**Sauvegardes des données Client :** VMCloud ne sauvegarde pas les données du Client par défaut. Le Client doit mettre en place sa propre stratégie de sauvegarde.

**Exception :** Lorsque des services de snapshots ou sauvegardes sont explicitement souscrits, les conditions sont détaillées dans les fiches produits correspondantes.

### 10.3. Coûts de stockage

Les coûts de sauvegardes et snapshots proposés au Client sont inclus dans les prix des services concernés ou facturés selon les barèmes publics. Les coûts internes de VMCloud ne sont jamais répercutés sur le Client.

### 10.4. Réversibilité et fin de contrat

**Délai d'export :** 60 jours calendaires après la fin du contrat pour demander l'export des données par email

**Formats disponibles :** API, images virtuelles, snapshots, exports applicatifs selon la nature du service

**Accès post-résiliation :** Perte immédiate d'accès au tableau de bord, demandes d'export par email uniquement

**Purge définitive :** 3 mois après la fin du contrat, toutes les données sont définitivement supprimées

**Période intermédiaire :** Entre 60 jours et 3 mois, VMCloud peut choisir discrétionnairement de fournir ou non les données selon les circonstances

### 10.5. Assistance à la migration

Des services d'assistance à la migration peuvent être proposés sur devis avec quotas d'heures dédiées, plan de cutover et contrôles d'intégrité.

## 11. Conservation des logs et accès

### 11.1. Durées de conservation

**Logs de sécurité :** 12 mois (tentatives de connexion, événements de sécurité, incidents)

**Logs d'accès :** 6 mois (connexions réussies, utilisation des services, API)

**Logs de facturation :** Durée légale comptable (conformément à la réglementation estonienne et aux obligations fiscales)

### 11.2. Accès aux logs

**Principe général :** Les Clients n'ont pas accès aux logs internes de VMCloud

**Exceptions strictement limitées :**
- **Litige et règlement amiable :** Dans le cadre d'une procédure de médiation ou d'un litige documenté, VMCloud peut fournir les logs pertinents du Client concerné
- **Procédure judiciaire :** VMCloud fournit les logs aux autorités judiciaires exclusivement sur présentation d'une base légale valide et justifiée

### 11.3. Principes de protection

VMCloud n'est pas un « bon samaritain » et applique strictement les limites légales :
- Vérification systématique de la base légale des demandes
- Respect des procédures judiciaires du pays concerné
- Fourniture limitée aux éléments strictement nécessaires et proportionnés
- Refus de toute demande non fondée juridiquement

## 12. Sécurité et responsabilité partagée

### 12.1. Modèle de responsabilité partagée

La sécurité chez VMCloud repose sur un modèle de responsabilité partagée qui définit précisément les obligations de chaque partie. Ce modèle garantit que la sécurité globale résulte de la combinaison des mesures prises par VMCloud au niveau de l'infrastructure et par le Client au niveau de ses applications et données.

**Responsabilités de VMCloud :** VMCloud prend en charge tous les aspects liés à l'infrastructure sous-jacente. Cela inclut la sécurisation physique des centres de données, la protection des serveurs physiques contre les intrusions, et la maintenance de l'intégrité du réseau backbone. VMCloud sécurise également l'hyperviseur et tous les systèmes hôtes qui permettent la virtualisation, garantissant ainsi que les environnements virtuels fonctionnent sur une base technique fiable. L'isolation stricte entre les environnements de différents clients est assurée par une segmentation réseau avancée qui empêche tout accès non autorisé entre les instances. VMCloud déploie une protection périmétrique robuste incluant des pare-feu de niveau infrastructure et un monitoring continu qui détecte les anomalies 24h/24. Enfin, le chiffrement en transit est automatiquement appliqué au niveau des communications infrastructure pour protéger les flux de données entre les composants système.

**Responsabilités du Client :** Le Client assume la responsabilité complète de tout ce qui concerne son environnement applicatif et ses données. Il doit maintenir la sécurité de ses systèmes d'exploitation, appliquer les correctifs nécessaires et configurer correctement les middlewares et applications qu'il déploie. La configuration des pare-feu applicatifs et des règles de sécurité au niveau de ses instances relève entièrement de sa responsabilité, tout comme la gestion rigoureuse des comptes utilisateurs, des identifiants et des privilèges d'accès. Le Client doit également implémenter le chiffrement de ses données sensibles selon ses propres exigences et contraintes métier. Il est responsable de définir et mettre en œuvre sa stratégie de sauvegarde ainsi que son plan de reprise d'activité. Enfin, il doit maintenir à jour toutes les applications et services qu'il déploie, notamment en appliquant les mises à jour de sécurité dès leur disponibilité.

### 12.2. Mesures de sécurité VMCloud

VMCloud déploie un ensemble complet de mesures organisationnelles et techniques qui respectent et dépassent souvent les standards de l'industrie. La segmentation stricte des environnements clients constitue le fondement de notre architecture sécuritaire : chaque client évolue dans un environnement complètement isolé des autres, avec des réseaux virtuels dédiés et des contrôles d'accès qui empêchent toute interaction non autorisée. Notre politique de limitation des privilèges administrateur suit le principe du moindre privilège, où chaque intervenant technique ne dispose que des accès strictement nécessaires à ses missions, avec des révisions périodiques et une rotation régulière des accès sensibles.

La supervision continue s'appuie sur des systèmes de détection d'intrusion avancés qui analysent en temps réel les patterns de trafic, les comportements anormaux et les tentatives d'accès non autorisées, avec des alertes automatiques et une escalade vers notre équipe de sécurité. Notre plan de réponse aux incidents de sécurité définit des procédures claires d'escalade, de confinement et de résolution, avec des délais d'intervention adaptés à la criticité de chaque situation. Enfin, nos procédures de sauvegarde et de restauration sont testées régulièrement pour garantir la continuité opérationnelle, avec des sites de sauvegarde géographiquement distribués et des tests de restauration périodiques pour valider l'intégrité des données.

### 12.3. Divulgation responsable

VMCloud encourage le signalement responsable de vulnérabilités via contact@vmcloud.fr. Un programme de divulgation coordonnée peut être mis en place avec des délais de correction selon la criticité.

## 13. Protection des données personnelles (RGPD)

### 13.1. Cadre général

Lorsque le Client traite des données personnelles via les Services, les rôles sont définis comme suit :
- **Client :** Responsable de traitement
- **VMCloud :** Sous-traitant au sens du RGPD

### 13.2. Accord de traitement (DPA)

Un Data Processing Agreement (DPA) séparé, conforme au RGPD, précise :
- Les catégories de données personnelles traitées
- Les finalités et durées de traitement
- Les mesures de sécurité mises en œuvre
- La liste des sous-traitants ultérieurs
- Les procédures en cas de violation de données
- Les modalités d'exercice des droits des personnes concernées

### 13.3. Localisation des données

**Principe général :** Toutes les données personnelles sont traitées exclusivement dans l'Union Européenne/EEE conformément aux exigences RGPD. VMCloud OÜ étant établie en Estonie (membre de l'UE), le traitement s'effectue sous juridiction européenne avec toutes les protections afférentes.

**Centres de données européens :** VMCloud opère ses centres de données dans six emplacements européens stratégiques : Paris (France), Francfort (Allemagne), Amsterdam (Pays-Bas), Londres (Royaume-Uni - avec arrangements post-Brexit), Madrid (Espagne - en déploiement), et Milan (Italie - planifié). Tous ces centres de données respectent les standards européens de protection des données et sont soumis aux réglementations nationales et européennes applicables.

**Sous-traitants et partenaires :** VMCloud maintient une liste publique de ses sous-traitants et partenaires techniques, accessible via notre site web et mise à jour trimestriellement. Cette liste inclut nos fournisseurs d'infrastructure (datacenters), nos partenaires réseau (Cogent, Telia, Level3), nos fournisseurs de sécurité DDoS (Path.net, Voxility), et nos prestataires de services auxiliaires. Tous nos partenaires sont contractuellement tenus de respecter les standards RGPD et font l'objet d'audits réguliers de conformité.

**Transferts hors UE :** VMCloud s'interdit tout transfert de données personnelles vers des pays tiers non couverts par une décision d'adéquation européenne, sauf dans le strict respect des mécanismes de transfert valides (clauses contractuelles types approuvées par la Commission européenne, règles d'entreprise contraignantes, ou dérogations spécifiques article 49 RGPD). Toute demande de transfert fait l'objet d'une analyse d'impact préalable et d'une approbation explicite de notre DPO.

### 13.4. Violation de données

En cas de violation de données personnelles impactant les traitements du Client et imputable à VMCloud :
- Notification au Client sans délai injustifié (72 heures maximum)
- Coopération de bonne foi pour les mesures correctives
- Fourniture des informations nécessaires aux déclarations réglementaires

### 13.5. Droits des personnes

Le Client reste responsable de l'information des personnes concernées et de l'exercice de leurs droits. VMCloud fournit l'assistance technique nécessaire dans les limites de son rôle de sous-traitant.

## 14. Politique d'usage acceptable (AUP)

### 14.1. Principes généraux

Le Client s'engage à un usage conforme aux lois et règlements applicables et au respect des droits des tiers. VMCloud applique une politique d'usage acceptable stricte.

### 14.2. Interdictions explicites

VMCloud maintient une politique stricte concernant les usages prohibés de ses services, avec quatre catégories principales d'interdictions qui reflètent à la fois nos obligations légales et notre engagement envers l'intégrité du gaming et de la sécurité informatique.

**Activités de contournement et triche :** VMCloud maintient une position intransigeante contre toute forme de triche vidéoludique et de contournement technologique. Cette politique reflète notre engagement envers l'intégrité du gaming et notre refus catégorique de faciliter des pratiques déloyales. Tous les logiciels de triche vidéoludique sont formellement interdits sans exception, qu'il s'agisse de cheats automatisés, de bots, d'aimbots qui automatisent la visée, ou d'ESP (Extra Sensory Perception) qui révèlent des informations cachées dans les jeux. Notre position est particulièrement ferme sur ce point : toute détection d'activité de gaming ou de cheat entraîne un avertissement immédiat, et en cas de récidive, une suspension définitive sans remboursement. Cette mesure radicale s'explique par le fait que VMCloud propose des services de cloud gaming légitimes, et nous ne pouvons tolérer aucune activité qui compromettrait l'intégrité de cet écosystème.

L'interdiction s'étend à toute installation de jeux sur nos machines virtuelles, même pour un usage personnel légitime. Cette règle sans exception garantit qu'aucun contournement ne puisse être effectué sous couvert d'usage normal. Le contournement de mesures techniques de protection représente une violation grave : cela inclut le bypass des systèmes anti-cheat des éditeurs de jeux, la désactivation de DRM (Digital Rights Management), ou toute tentative de circonvention des protections mises en place par les développeurs. Le spoofing d'identifiants constitue également une pratique prohibée, qu'il s'agisse de falsifier des adresses IP, des adresses MAC, ou de manipuler le hardware fingerprinting pour tromper les systèmes de détection. L'exploitation de vulnérabilités dans les jeux en ligne pour obtenir des avantages déloyaux est strictement interdite, tout comme les services de boost, de leveling automatisé ou de manipulation de classements qui corrompent l'équité compétitive.

**Activités malveillantes :** VMCloud adopte une tolérance zéro envers toute forme d'activité malveillante. Les attaques informatiques sont formellement proscrites, incluant les attaques DDoS (Distributed Denial of Service), les stressers et booters qui visent à surcharger des serveurs tiers, ou tout autre type de déni de service. L'hébergement de malwares, virus, ransomwares ou de tout logiciel malveillant constitue une violation majeure qui expose VMCloud et ses clients à des risques juridiques et techniques considérables. Les infrastructures Command & Control (C2) utilisées pour piloter des botnets sont strictement interdites car elles participent à des réseaux criminels organisés. Toutes les formes de phishing, d'arnaques en ligne, de fraudes financières ou de tentatives d'escroquerie sont prohibées. Enfin, l'exploitation non autorisée de vulnérabilités, que ce soit sur nos systèmes ou sur des services tiers accessibles depuis notre infrastructure, constitue une violation grave de notre AUP.

**Usage réseau abusif :** VMCloud surveille attentivement l'utilisation de ses ressources réseau pour détecter les comportements abusifs. Les scans massifs de ports non autorisés, particulièrement ceux qui visent à identifier des vulnérabilités sur des systèmes tiers, sont strictement interdits car ils peuvent être assimilés à de la reconnaissance d'attaque. La reconnaissance réseau agressive, incluant les tentatives systématiques de cartographie d'infrastructures sans autorisation, est également prohibée. 

L'utilisation de VPN et de proxies fait l'objet de restrictions spécifiques : si ces services ne sont pas inclus dans l'offre souscrite, leur installation et utilisation sur nos serveurs sont formellement interdites. Le client peut se connecter à son serveur via un VPN depuis son poste de travail, mais l'installation d'un serveur VPN ou proxy directement sur l'infrastructure VMCloud nécessite une autorisation préalable explicite et peut entraîner des surcoûts. Cette restriction vise à préserver l'intégrité de notre réseau et à respecter nos obligations légales vis-à-vis des autorités compétentes.

Toute forme de spam ou d'envoi massif non sollicité est interdite, qu'il s'agisse d'emails, de messages ou de tout autre type de communication, bien que les limites pratiques soient déterminées par les quotas de services souscrits. La violation des politiques des fournisseurs d'accès Internet tiers, qui pourrait compromettre nos relations avec nos partenaires réseau, constitue également une pratique prohibée.

**Contournement commercial :** Cette dernière catégorie vise à préserver l'intégrité de nos relations commerciales et le respect des droits de propriété intellectuelle. La revente non autorisée des services VMCloud sans accord de partenariat officiel est formellement interdite, car elle compromet notre modèle économique et peut créer des situations de responsabilité mal définies. La violation des conditions d'utilisation de services tiers hébergés sur notre infrastructure peut exposer VMCloud à des réclamations juridiques, c'est pourquoi nous l'interdisons strictement. Le contournement de licences logicielles, qu'il s'agisse de logiciels propriétaires ou de solutions SaaS, constitue une violation de la propriété intellectuelle que nous ne tolérons pas.

Le mining de cryptomonnaies est strictement interdit sur l'ensemble de notre infrastructure VMCloud. Cette interdiction absolue découle des impacts significatifs sur les performances, de la consommation énergétique excessive, et des risques de surchauffe qu'engendre cette activité. Toute détection d'activité de mining, qu'elle soit évidente ou dissimulée, entraîne des sanctions proportionnelles à la gravité et à la durée de la violation. Selon la durée et l'intensité de l'activité détectée, les mesures peuvent aller d'un simple avertissement avec facturation des coûts énergétiques supplémentaires jusqu'à une suspension définitive sans remboursement pour les cas les plus graves. Cette politique inflexible garantit l'équité de performance pour tous nos clients et préserve l'intégrité de notre infrastructure.

### 14.3. Procédure d'application

VMCloud met en œuvre une surveillance active et continue du respect de sa politique d'usage acceptable, s'appuyant sur une approche technologique avancée combinée à des processus humains rigoureux. Notre système de détection et de signalement repose sur trois piliers complémentaires qui assurent une couverture exhaustive des violations potentielles.

**Détection et signalement :** Nos systèmes de détection automatisés analysent en temps réel les patterns de trafic, les signatures de logiciels, et les comportements suspects grâce à des algorithmes d'apprentissage automatique et des bases de données de signatures régulièrement mises à jour. Ces systèmes détectent automatiquement les activités de triche, les attaques DDoS, l'hébergement de malwares, ou les scans réseau non autorisés. En parallèle, nous traitons scrupuleusement tous les signalements de tiers, qu'ils proviennent d'éditeurs de jeux, d'autres fournisseurs de services, ou d'organisations de sécurité informatique via notre adresse contact@vmcloud.fr. Ces abuse reports font l'objet d'une investigation approfondie par notre équipe de sécurité qui vérifie la validité des accusations et collecte les preuves techniques nécessaires. Enfin, notre monitoring proactif implique une surveillance ciblée des usages suspects identifiés par nos équipes techniques, avec des investigations approfondies qui peuvent inclure l'analyse de logs, l'examen de configurations, et la corrélation d'événements.

**Gradation des mesures :** VMCloud applique une approche proportionnée dans le traitement des violations, avec quatre niveaux d'escalade adaptés à la gravité et à la récurrence des infractions. La notification constitue toujours la première étape lorsque la gravité le permet : nous contactons le client pour l'informer de la violation détectée, lui expliquons les risques associés et les mesures correctives attendues, tout en précisant le délai accordé pour régulariser la situation. Cette notification s'accompagne souvent de conseils techniques et de ressources pour aider le client à comprendre et résoudre le problème. Si la violation persiste ou s'aggrave, nous procédons à une limitation ciblée des ressources ou fonctionnalités : réduction de bande passante, limitation du nombre de connexions simultanées, désactivation de certaines fonctionnalités réseau, ou restriction d'accès à certaines zones géographiques. Cette mesure vise à contenir l'impact tout en préservant les activités légitimes du client. La suspension partielle intervient lorsque la limitation s'avère insuffisante : nous isolons les services du réseau public tout en maintenant l'accès du client à ses données via la console de gestion, lui permettant ainsi de corriger la situation ou d'exporter ses informations. Enfin, la suspension totale entraîne l'arrêt immédiat et complet du service, réservée aux violations les plus graves ou aux récidives.

**Délais de cure :** Les délais accordés pour remédier aux violations varient selon la criticité de la situation et les risques associés. Pour les usages non critiques, tels que les violations mineures des conditions d'utilisation ou les problèmes de configuration, nous accordons systématiquement 48 heures au client pour se conformer à nos exigences. Ce délai permet au client de comprendre le problème, d'identifier les causes, et de mettre en œuvre les corrections nécessaires sans précipitation. En revanche, pour les usages critiques qui engagent la sécurité de notre infrastructure, la légalité de nos services, ou l'ordre public, nous procédons à une suspension immédiate sans préavis ni délai de cure. Cette mesure d'urgence concerne notamment les attaques informatiques actives, l'hébergement de contenu illégal, les activités de cybercriminalité avérées, ou toute situation qui expose VMCloud ou ses clients à des risques juridiques ou techniques immédiats.

### 14.4. Tests d'intrusion et programme de divulgation responsable

VMCloud maintient une approche stricte mais constructive concernant la sécurité de son infrastructure, encourageant la divulgation responsable de vulnérabilités tout en protégeant ses systèmes contre les tests non autorisés.

**Tests d'intrusion non autorisés :** Tous tests d'intrusion, scans de vulnérabilités, ou tentatives d'exploitation non préalablement autorisées sont strictement interdits sur l'infrastructure VMCloud et les services tiers accessibles depuis nos systèmes. Ces activités constituent une violation grave de notre AUP et sont passibles de sanctions immédiates, incluant suspension sans préavis et signalement aux autorités compétentes.

**Programme de divulgation responsable :** VMCloud encourage le signalement responsable de vulnérabilités de sécurité par les chercheurs et la communauté sécuritaire. Les vulnérabilités découvertes doivent être signalées exclusivement via contact@vmcloud.fr avec une description détaillée, des preuves de concept non destructives, et l'engagement du chercheur à respecter notre politique de divulgation coordonnée.

**Tests autorisés :** Les tests de sécurité sur notre infrastructure nécessitent une autorisation préalable explicite obtenue via contact@vmcloud.fr. La demande doit inclure l'identité complète du chercheur, le périmètre technique précis des tests envisagés, la méthodologie détaillée, la fenêtre temporelle souhaitée, les limitations acceptées, et l'engagement formel de divulgation responsable. VMCloud se réserve le droit d'accepter ou refuser toute demande selon ses critères internes.

**Délais de correction :** VMCloud s'engage à traiter les vulnérabilités signalées selon leur criticité : vulnérabilités critiques (exposition données, RCE) sous 48 heures, vulnérabilités importantes (élévation privilèges, contournement sécurité) sous 7 jours, vulnérabilités moyennes (divulgation d'information, DoS) sous 30 jours, et vulnérabilités mineures (configuration, bonnes pratiques) sous 90 jours. Ces délais constituent des objectifs de qualité et non des obligations contractuelles.

**Programme de récompenses :** VMCloud peut, à sa seule discrétion, proposer des récompenses financières ou non-financières aux chercheurs ayant contribué de manière significative à l'amélioration de notre sécurité. Ces récompenses ne constituent jamais une obligation et dépendent de la criticité de la vulnérabilité, de la qualité du rapport, et du respect de notre politique de divulgation.

### 14.5. Politique de contenu adulte

VMCloud maintient une approche équilibrée concernant le contenu à caractère adulte, basée sur la transparence, la notification préalable obligatoire, et une tolérance zéro pour tout contenu illégal. Cette politique vise à protéger VMCloud de tout risque juridique tout en respectant la liberté d'usage légitime de nos clients.

**Obligation de notification préalable :** Tout client souhaitant utiliser nos services pour stocker ou diffuser du contenu à caractère adulte doit impérativement nous en informer avant l'utilisation. Cette notification s'applique au stockage d'objets lorsque le contenu principal consiste en images ou vidéos à caractère pornographique ou adulte, ainsi qu'à l'hébergement de sites web ou services proposant du contenu adulte. La notification doit être effectuée via contact@vmcloud.fr en précisant la nature du contenu, l'usage prévu, et les mesures de protection d'accès mises en place. Cette transparence nous permet d'adapter nos mesures de sécurité et de nous conformer aux réglementations applicables.

**Contenu adulte légal :** VMCloud n'interdit pas le contenu adulte légal, à condition qu'il respecte scrupuleusement les lois en vigueur et fasse l'objet de la notification préalable obligatoire. Le client reste seul responsable de s'assurer de la licéité de son contenu et de mettre en place des mesures appropriées de contrôle d'accès, notamment la vérification d'âge et les avertissements réglementaires.

**Tolérance zéro pour l'illégal :** En cas d'hébergement de contenu adulte illégal, notamment des contenus impliquant des mineurs, de la zoophilie, des violences sexuelles, ou tout contenu non consenti, VMCloud applique une politique de suspension immédiate sans remboursement et procède à la notification immédiate des autorités compétentes avec transmission de toutes les informations d'identification du client.

### 14.6. Procédure d'inspection sur suspicion

VMCloud respecte scrupuleusement la vie privée de ses clients et n'effectue aucune inspection préventive systématique des données stockées ou des services hébergés. Cependant, nous nous réservons le droit d'inspecter le contenu dans des circonstances exceptionnelles et avec notification préalable au client.

**Circonstances d'inspection :** Notre droit d'inspection s'exerce uniquement en cas de signalement fondé par un tiers, de plainte déposée par une personne alléguant la présence de contenus la concernant sans son consentement, ou de suspicion légitime d'activité illégale basée sur des éléments objectifs. Cette inspection ne concerne jamais les données personnelles du client mais uniquement le contenu stocké ou diffusé.

**Procédure transparente :** Lorsqu'une inspection s'avère nécessaire, VMCloud notifie le client de ses intentions en expliquant les raisons motivant cette démarche et en précisant le périmètre de l'inspection envisagée. Le client dispose alors d'un délai de 48 heures pour fournir des explications, apporter des éléments de preuve de la licéité de son contenu, ou accorder l'accès volontaire aux éléments concernés.

**Suspension préventive et suite :** En cas de suspicion grave concernant du contenu potentiellement illégal, VMCloud peut procéder à une suspension préventive temporaire le temps de l'investigation. Si l'inspection révèle effectivement la présence de contenu illégal avec des preuves probantes, VMCloud procède à une suspension définitive sans remboursement, conserve les preuves pour les autorités judiciaires, et transmet immédiatement les informations d'identification du client aux autorités compétentes. Si l'inspection révèle que les soupçons étaient infondés, VMCloud rétablit immédiatement les services et peut proposer un geste commercial pour compenser la gêne occasionnée.

### 14.7. Conservation des preuves

VMCloud conserve les preuves de violation pendant 12 mois minimum à des fins légales et de défense.

## 15. Propriété intellectuelle

### 15.1. Droits du Client

Le Client conserve l'intégralité de ses droits de propriété intellectuelle sur :
- Ses données, contenus et configurations
- Ses applications et développements
- Ses marques, noms de domaine et éléments distinctifs

### 15.2. Droits de VMCloud

VMCloud conserve tous droits de propriété intellectuelle sur :
- Sa marque, logos et éléments d'identité visuelle
- Ses interfaces, logiciels et documentations
- Ses infrastructures et technologies propriétaires
- Ses méthodes et savoir-faire techniques

### 15.3. Logiciels tiers

Les logiciels tiers utilisés dans les Services restent soumis à leurs licences respectives. Le Client s'engage à respecter ces termes de licence.

### 15.4. Licence sur les retours

Le Client accorde à VMCloud une licence non exclusive et gratuite d'utilisation des suggestions d'amélioration, retours d'expérience et feedbacks fournis dans le cadre de l'utilisation des Services.

## 16. API et automatisation

### 16.1. Conditions d'accès

**Clés API :** Confidentielles et personnelles, non cessibles. Rotation régulière recommandée.

**Scopes minimaux :** Application du principe du moindre privilège pour les permissions API

**Authentification :** Mécanismes sécurisés (tokens JWT, OAuth 2.0, clés API)

### 16.2. Limitations d'usage

**Rate limiting :** Limites de débit appliquées pour préserver les performances globales

**Pagination :** Obligatoire pour les listes importantes, limites par page

**Monitoring :** Surveillance continue des usages pour détecter les abus

### 16.3. Évolutions et dépréciations

**Versioning :** Gestion des versions avec rétrocompatibilité dans la mesure du possible

**Dépréciations :** Préavis minimum de 90 jours pour les changements majeurs (breaking changes)

**Migration :** Documentation et outils de migration fournis pour faciliter les transitions

### 16.4. Suspension pour abus

Suspension automatique en cas d'usage abusif des API (dépassement massif des limites, tentatives d'intrusion, utilisation malveillante).

## 17. Services spécifiques par produit

### 17.1. VPS (Serveurs Privés Virtuels)

**Allocation des ressources :** Dédiées logiquement, infrastructure mutualisée selon l'offre

**Images système :** Ubuntu, Debian, CentOS, Rocky Linux, Windows Server (avec licences)

**Stockage :** NVMe haute performance, snapshots configurables par le Client

**Réseau :** IPv4 et IPv6, pare-feu configurable, bande passante selon l'offre

**Responsabilités :** Client responsable de l'OS, applications et configurations

### 17.2. GPU (Calcul haute performance)

**Types de cartes :** Tesla T4, RTX 4090, A100 selon les offres

**Isolation :** Cartes dédiées ou partagées selon le profil, accès root complet

**Pilotes :** CUDA, cuDNN et pilotes Nvidia pré-installés

**Optimisation coûts :** Auto-stop recommandé pour les workloads batch

**Disponibilité :** Variable selon la demande, files d'attente possibles aux heures de pointe

### 17.3. Stockage Objet (Compatible S3)

**Compatibilité :** API S3 standard, outils existants supportés

**Cohérence :** Éventuellement cohérente (eventual consistency) par région

**Fonctionnalités :** Versioning, politiques d'accès (IAM), chiffrement côté serveur

**Coûts :** Facturation du stockage, requêtes et trafic sortant selon barème

**Réplication :** Multi-zones disponible, durabilité 99.999999999% (11 9s)

### 17.4. CDN (Content Delivery Network)

**Réseau :** Points de présence (PoP) variables selon la géographie

**Performances :** Cache best-effort, TTL configurable, purge sélective

**SSL/TLS :** Certificats automatiques Let's Encrypt ou certificats importés

**Limitations :** Pas de garantie de performance sur les FAI tiers

**Règles :** Configuration par chemin, headers personnalisés, redirections

### 17.5. PaaS (Platform as a Service)

**Runtimes supportés :** Node.js, Python, PHP, Go, Java, .NET selon disponibilité

**Déploiement :** CI/CD intégré, déploiement depuis Git

**Ressources :** Limites de CPU, mémoire et requêtes par plan

**Cold start :** Latence de démarrage possible sur les plans partagés

**Logs :** Conservation limitée, externalisation recommandée

### 17.6. Load Balancer

**Types :** Layer 4 (TCP/UDP) et Layer 7 (HTTP/HTTPS)

**Algorithmes :** Round-robin, least connections, IP hash

**Health checks :** Monitoring actif des backends avec basculement automatique

**SSL :** Terminaison SSL, certificats gérés ou importés

**Haute disponibilité :** Configuration multi-zones disponible

### 17.7. Web Hosting

**Technologies :** Apache, Nginx, PHP, MySQL, SSL automatique

**Domaines :** Gestion DNS intégrée, sous-domaines illimités

**Email :** Comptes email et redirections selon l'offre

**CMS :** WordPress, Joomla pré-installables

**Bases de données :** MySQL, PostgreSQL selon le plan

## 18. Suspension et résiliation

### 18.1. Causes de suspension

VMCloud se réserve le droit de suspendre immédiatement les Services dans plusieurs situations précises qui compromettent soit la sécurité de l'infrastructure, soit le respect des obligations contractuelles. L'impayé constitue la cause de suspension la plus courante et suit la procédure détaillée à l'article 6, avec suspension automatique à J+2 après notification du client. Les violations graves de la politique d'usage acceptable (AUP) entraînent également une suspension immédiate, particulièrement lorsqu'elles concernent des activités de triche vidéoludique, des attaques informatiques ou du contenu illégal qui expose VMCloud à des risques légaux.

Tout risque de sécurité avéré, tel qu'une compromission détectée de l'environnement client, une attaque en cours depuis ses ressources, ou l'hébergement de malwares actifs, justifie une suspension préventive pour protéger l'ensemble de l'infrastructure. VMCloud suspend également les services sur injonction d'une autorité compétente, que ce soit dans le cadre d'une enquête judiciaire, d'une décision administrative ou d'une mesure d'urgence des forces de l'ordre. Enfin, le dépassement critique des quotas de ressources qui menace la stabilité de la plateforme ou les performances des autres clients peut conduire à une suspension préventive temporaire.

### 18.2. Gradation des mesures

VMCloud applique une approche progressive dans le traitement des violations, sauf en cas d'urgence absolue. La période de correction standard de 48 heures s'applique à toutes les violations non critiques, permettant au client de régulariser sa situation avant l'application de mesures plus strictes. Cette approche vise à préserver la continuité de service tout en garantissant le respect des règles.

L'escalade suit quatre niveaux progressifs adaptés à la gravité de la situation. La notification constitue la première étape : VMCloud informe le client de la violation constatée, explique les risques associés et précise le délai accordé pour remédier au problème, généralement accompagnée de conseils techniques pour résoudre la situation. Si la violation persiste, VMCloud procède à une limitation ciblée des ressources ou fonctionnalités : réduction de la bande passante, limitation des connexions simultanées, ou désactivation de certaines fonctionnalités avancées, tout en maintenant l'accès aux données et à la console de gestion.

La suspension partielle intervient en troisième niveau : les services deviennent inaccessibles au public, mais le client conserve l'accès à ses données via la console pour effectuer les corrections nécessaires ou procéder à l'export de ses informations. Enfin, la suspension totale entraîne l'arrêt complet du service avec perte d'accès à la console, bien que les données soient conservées selon la procédure de réversibilité.

Les situations d'urgence dérogent à cette gradation : en cas de risque critique pour la sécurité, d'obligation légale impérative, ou de menace pour l'ordre public, VMCloud procède à une suspension immédiate sans préavis ni période de grâce. Cette mesure exceptionnelle vise à protéger l'intégrité de l'infrastructure et à respecter les obligations légales de VMCloud.

### 18.3. Résiliation par le Client

Le Client peut résilier ses Services à tout moment :
- Via la console de gestion
- Par email à contact@vmcloud.fr
- Via l'API pour les résiliations automatisées

**Effets :** Perte d'accès immédiate, application de la procédure de réversibilité (article 10.4)

### 18.4. Résiliation par VMCloud

VMCloud peut résilier le contrat en cas de :
- Violation persistante malgré les mises en demeure
- Impayé prolongé après la procédure de recouvrement
- Impossibilité technique durable de fournir le service
- Cessation d'activité ou restructuration majeure

**Préavis :** 30 jours minimum sauf cas d'urgence ou faute grave

### 18.5. Conséquences de la résiliation

**Facturation :** Arrêt des frais récurrents à la date effective de résiliation

**Données :** Application immédiate de la procédure de réversibilité

**Remboursements :** Aucun remboursement des sommes payées d'avance, sauf erreur de VMCloud

## 19. Maintenance et incidents

### 19.1. Maintenance planifiée

VMCloud s'efforce de maintenir ses services disponibles en continu, mais certaines interventions techniques nécessitent des interruptions planifiées pour garantir la sécurité, les performances et l'évolution de l'infrastructure. Notre politique de maintenance vise à minimiser l'impact sur nos clients tout en préservant notre flexibilité opérationnelle nécessaire.

**Préavis et communication :** VMCloud communique généralement ses maintenances planifiées avec un préavis de 7 jours calendaires minimum pour les interventions majeures susceptibles d'affecter significativement les services. Cependant, nous nous réservons le droit de raccourcir ce délai à 48 heures en cas d'urgence sécuritaire, de correctif critique ou d'obligation réglementaire impérative. Les clients sont notifiés via email, la page de statut publique, et éventuellement par notifications push selon leurs préférences.

**Fenêtres d'intervention :** Nos maintenances sont préférentiellement programmées entre 02:00 et 06:00 CET pour minimiser l'impact sur les usages professionnels standard. Toutefois, VMCloud conserve la flexibilité de programmer des interventions à tout moment de la journée selon les contraintes techniques, les urgences de sécurité, ou les nécessités opérationnelles. Nous nous efforçons de regrouper les interventions mensuellement pour réduire la fréquence des interruptions.

**Flexibilité opérationnelle :** VMCloud ne s'engage sur aucune obligation contraignante de délais ou de fenêtres de maintenance. En cas de problème technique critique, de faille de sécurité découverte, ou d'incident nécessitant une intervention d'urgence, nous nous réservons le droit d'effectuer des maintenances immédiates sans préavis. Cette flexibilité est essentielle pour maintenir l'intégrité et la sécurité de notre infrastructure.

### 19.2. Communication d'incidents

**Page de statut :** Accessible publiquement avec historique des incidents

**Notifications :** Email, SMS, webhooks selon les préférences du Client

**Mise à jour régulière :** Communication temps réel pendant les incidents majeurs

**Post-mortem :** Rapport détaillé publié pour les incidents significatifs

### 19.3. Gestion des incidents

**Classification :** Criticité 1 (critique), 2 (majeur), 3 (mineur), 4 (maintenance)

**Escalade :** Procédures internes d'escalade selon la gravité

**Résolution :** Mobilisation des équipes proportionnée à l'impact

**Prévention :** Mesures correctives pour éviter la récurrence

## 20. Garanties et exclusions

### 20.1. Garanties limitées

VMCloud garantit que les Services seront fournis conformément aux SLA publiés et avec un niveau de compétence professionnel conforme aux standards de l'industrie.

**Services "as-is" :** Sauf stipulation expresse contraire, les Services sont fournis en l'état sans garantie autre que celles imposées par la loi.

### 20.2. Exclusions de garantie

VMCloud ne garantit pas :
- L'absence totale d'erreurs ou d'interruptions
- La compatibilité avec tous les environnements du Client
- Les performances spécifiques non contractuellement définies
- La résistance à toutes formes d'attaques ou d'intrusions

### 20.3. Exclusions de disponibilité

Sont exclues des engagements SLA :
- Indisponibilités imputables aux configurations du Client
- Pannes de fournisseurs tiers indépendants
- Attaques DDoS ou cyber-attaques externes
- Non-respect des prérequis techniques documentés
- Force majeure et événements hors contrôle raisonnable

### 20.4. Garantie d'éviction

Le Client garantit VMCloud contre toute réclamation de tiers fondée sur :
- Les contenus, données et configurations du Client
- L'usage des Services en violation des présentes conditions
- La violation de droits de propriété intellectuelle
- Les activités illégales ou dommageables du Client

## 21. Responsabilité et limitations

### 21.1. Plafond de responsabilité

La responsabilité totale de VMCloud, toutes causes confondues et pour l'ensemble des Services, est strictement limitée au montant total effectivement payé par le Client au cours des douze (12) mois précédant le fait générateur.

### 21.2. Dommages exclus

Sont expressément exclus de la responsabilité de VMCloud :
- Dommages indirects, consécutifs ou immatériels
- Perte d'exploitation, de bénéfices, d'image ou de réputation
- Perte de données (sauf faute lourde prouvée de VMCloud)
- Coûts de reconstitution ou de récupération
- Manque à gagner et perte de clientèle

### 21.3. Exceptions aux limitations

Les limitations de responsabilité ne s'appliquent pas en cas de :
- Faute lourde ou dol de VMCloud
- Atteinte aux personnes (dommages corporels)
- Violation des données personnelles imputable à VMCloud
- Dispositions d'ordre public contraires

### 21.4. Remède exclusif

Les crédits SLA constituent le seul et unique remède en cas de défaillance des Services dans les limites contractuelles.

## 22. Force majeure

### 22.1. Définition

Constitue un cas de force majeure tout événement extérieur, imprévisible et irrésistible au sens de la jurisprudence française, incluant notamment :
- Catastrophes naturelles (tremblements de terre, inondations, incendies)
- Conflits armés, actes de terrorisme, troubles civils
- Cyber-attaques massives d'origine étatique ou criminelle organisée
- Indisponibilité prolongée de fournisseurs critiques
- Restrictions réglementaires soudaines ou embargos
- Crise énergétique majeure ou pénurie de composants critiques

### 22.2. Effets

La force majeure suspend les obligations contractuelles affectées pendant la durée de l'événement, sans indemnité pour aucune des parties.

### 22.3. Notification et résiliation

VMCloud notifie le Client sans délai de la survenance et de la cessation de l'événement. Si la force majeure perdure plus de 90 jours, chaque partie peut résilier le contrat avec un préavis de 30 jours.

## 23. Conformité et sanctions internationales

### 23.1. Contrôle des exportations

Le Client s'engage à respecter les réglementations de contrôle des exportations applicable, notamment :
- Règlements européens et estoniens
- Export Administration Regulations (EAR) américaines si applicables
- Listes de sanctions OFAC, UE, ONU

### 23.2. Screening automatisé et vérifications

VMCloud déploie un système de vérification automatisée qui contrôle en continu tous les clients, bénéficiaires effectifs, et transactions contre les principales listes de sanctions internationales. Ce screening s'effectue lors de l'inscription, périodiquement durant la relation contractuelle, et en temps réel lors de modifications d'informations client.

**Listes contrôlées :** Notre système vérifie automatiquement les correspondances avec les listes OFAC (Office of Foreign Assets Control) américaines, les listes de sanctions de l'Union Européenne, les listes de l'ONU (Nations Unies), ainsi que les listes nationales estoniennes et d'autres juridictions pertinentes. Ces vérifications couvrent les Specially Designated Nationals (SDN), les listes sectorielles, les entités bloquées, et les Persons of Interest (POI).

**Procédure en cas de correspondance :** Toute correspondance positive, même partielle, déclenche automatiquement une suspension préventive immédiate des services concernés, une investigation approfondie par notre équipe de conformité, et une notification aux autorités compétentes si requis. Le client dispose de 48 heures pour fournir des éléments probants démontrant qu'il s'agit d'une fausse correspondance (homonyme, erreur d'identification, etc.).

**Faux positifs :** En cas de faux positif avéré après investigation, VMCloud rétablit immédiatement les services et peut proposer un geste commercial pour compenser la gêne occasionnée. En cas de vrai positif confirmé, la suspension devient définitive sans remboursement et les autorités compétentes sont notifiées conformément aux obligations légales.

### 23.3. Pays interdits et restrictions géographiques

Les Services VMCloud ne sont pas disponibles pour les résidents, citoyens, entités, ou toute personne agissant depuis ou pour le compte des pays suivants, actuellement sous embargo ou sanctions renforcées : Iran, Corée du Nord, Cuba, Syrie, et certaines régions de Russie et du Belarus selon les évolutions géopolitiques.

**Vérification géographique :** VMCloud vérifie l'origine géographique des clients par recoupement d'informations incluant l'adresse de facturation, l'adresse IP de connexion, les données de géolocalisation, et les informations bancaires. Tout indicateur suggérant une origine dans un pays interdit entraîne un refus d'inscription ou une suspension immédiate.

**Évolution des restrictions :** Cette liste évolue selon les développements géopolitiques et les nouvelles sanctions internationales. VMCloud met à jour ses restrictions dans les 48 heures suivant l'entrée en vigueur de nouvelles mesures sanctionnatrices et notifie les clients potentiellement impactés.

### 23.4. Obligations du Client

Le Client certifie qu'il n'est pas :
- Inscrit sur une liste de sanctions internationales
- Contrôlé par une entité sanctionnée
- Agissant pour le compte d'une personne ou entité sanctionnée

### 23.5. Évolution des sanctions

En cas de durcissement des sanctions affectant le Client, VMCloud notifie l'impact et les mesures requises avec un délai de 30 jours pour se conformer ou résilier.

## 24. Audit et certifications

### 24.1. Attestations disponibles

VMCloud s'efforce de maintenir des certifications reconnues de l'industrie et peut fournir sur demande :
- Attestations de conformité (SOC 2, ISO 27001 si applicables)
- Rapports d'audit de sécurité
- Documentation des politiques et procédures

### 24.2. Audits clients

VMCloud accepte les audits clients dans un cadre strictement défini qui protège la sécurité de son infrastructure, la confidentialité des autres clients, et ses secrets industriels, tout en respectant les besoins légitimes de conformité de ses clients Enterprise.

**Conditions préalables obligatoires :** Toute demande d'audit doit être soumise avec un préavis minimum de 30 jours calendaires à contact@vmcloud.fr, accompagnée d'une définition précise du périmètre souhaité, des objectifs de conformité visés, de l'identité et des qualifications des auditeurs, et de la justification métier nécessitant cet audit. VMCloud se réserve le droit d'accepter ou de refuser toute demande d'audit selon ses critères internes de sécurité et de faisabilité opérationnelle.

**Périmètre autorisé :** Les audits se limitent exclusivement à l'examen documentaire des processus, politiques et contrôles organisationnels de VMCloud. Cela inclut la documentation des politiques de sécurité, les procédures de gestion des accès, les mesures de protection des données, les processus de sauvegarde et de continuité, et les politiques de conformité spécifiquement applicables aux données du client demandeur.

**Exclusions strictes :** Aucun accès physique aux infrastructures n'est accordé. Les auditeurs ne peuvent accéder aux systèmes techniques, aux configurations réseau, aux données ou métadonnées d'autres clients, ni aux informations considérées comme secret industriel ou commercial de VMCloud. Les audits techniques intrusifs, les tests de pénétration, ou toute activité susceptible d'affecter les services sont formellement interdits.

**Coûts et facturation :** L'intégralité des coûts liés à l'audit sont à la charge du client demandeur, incluant le temps d'ingénieur dédié (facturé 150€/heure), les frais de déplacement éventuels, la préparation de documentation spécifique, et tout coût administratif associé. Une estimation préalable sera fournie avec un devis formel avant validation.

**Alternatives privilégiées :** VMCloud encourage fortement ses clients à s'appuyer en priorité sur les attestations tierces disponibles (SOC 2, ISO 27001), les rapports d'audit de sécurité indépendants, et la documentation publique de ses politiques. Ces alternatives couvrent généralement les exigences de conformité sans nécessiter un audit spécifique coûteux et chronophage.

### 24.3. Périmètre d'audit

Les audits portent exclusivement sur :
- Les processus et contrôles documentés
- Les mesures de sécurité organisationnelles
- Les politiques de conformité applicables aux données du Client auditeur

**Exclusions :** Infrastructure technique, données d'autres clients, secret industriel et commercial de VMCloud

## 25. Sous-traitance et cession

### 25.1. Sous-traitance autorisée

VMCloud peut sous-traiter certaines prestations en conservant sa responsabilité contractuelle :
- Centres de données et infrastructure physique
- Réseaux de transit et connectivité
- Services de paiement et facturation
- Support technique spécialisé
- Services cloud tiers (AWS, etc.)

### 25.2. Liste des sous-traitants

Une liste publique des sous-traitants principaux est maintenue et accessible sur le site web de VMCloud. Cette liste est mise à jour régulièrement.

### 25.3. Notification des changements

**Nouveaux sous-traitants :** Notification 30 jours à l'avance avec droit d'opposition motivée du Client

**Objection fondée :** En cas d'objection légitime, VMCloud propose une solution alternative ou accepte la résiliation sans frais

### 25.4. Cession du contrat

**Cession par VMCloud :** Possible dans le cadre d'opérations de groupe (fusion, acquisition, restructuration) avec information préalable du Client

**Cession par le Client :** Soumise à l'accord préalable de VMCloud, non refusé de manière déraisonnable

## 26. Confidentialité et références

### 26.1. Informations confidentielles

Chaque partie s'engage à préserver la confidentialité des informations non publiques communiquées par l'autre partie dans le cadre de l'exécution du contrat.

**Durée :** L'obligation de confidentialité survit à la fin du contrat pendant 5 ans

**Exceptions :** Informations publiques, développées indépendamment, divulguées par des tiers autorisés, exigées par la loi

### 26.2. Références commerciales

Sauf refus écrit du Client, VMCloud peut mentionner :
- La dénomination sociale du Client
- Le logo et éléments visuels dans ses références
- Le type de services utilisés (sans détails techniques)

**Opt-out :** Le Client peut demander le retrait de ses références à tout moment

### 26.3. Communication de crise

En cas d'incident majeur affectant le Client, les parties coordonnent leurs communications externes pour assurer la cohérence des messages et éviter les contradictions dommageables.

## 27. Modifications des Services et Conditions

### 27.1. Évolution des services

VMCloud peut faire évoluer ses Services pour des raisons :
- Techniques (amélioration, mise à jour, sécurité)
- Économiques (optimisation, viabilité)
- Réglementaires (conformité, obligations légales)
- Technologiques (obsolescence, innovation)

### 27.2. Modifications mineures

**Changements mineurs :** Améliorations, corrections de bugs, optimisations sans impact fonctionnel majeur

**Notification :** 7 jours minimum via les canaux usuels

**Refus :** Droit de résiliation en cas d'impact négatif avéré

### 27.3. Modifications majeures

**Changements majeurs :** Modification des fonctionnalités principales, suppression de services, changements de prix substantiels

**Notification :** 30 jours minimum avec description détaillée de l'impact

**Refus :** Droit de résiliation sans frais avant l'entrée en vigueur

### 27.4. Dépréciations et fin de vie des services (EoL/EoS)

VMCloud peut décider de l'arrêt définitif de certains services pour des raisons économiques, techniques, ou stratégiques, en respectant un processus transparent qui protège les intérêts de ses clients existants tout en préservant sa flexibilité opérationnelle.

**Préavis de dépréciation :** VMCloud s'engage à notifier les clients concernés avec un préavis minimum de 90 jours calendaires avant l'arrêt définitif d'un service. Cette notification précise la date d'arrêt exacte (End of Service), les raisons motivant cette décision, l'impact sur les clients concernés, et les alternatives disponibles. La notification s'effectue via email direct aux clients concernés, publication sur la page de statut, et notification dans l'interface de gestion.

**Période de transition :** Durant les 90 jours de préavis, le service reste pleinement opérationnel et maintenu selon ses SLA habituels. Aucune nouvelle souscription n'est acceptée dès l'annonce de dépréciation, mais les clients existants conservent l'intégralité de leurs droits contractuels jusqu'à la date d'arrêt effective.

**Plans de migration proposés :** VMCloud propose systématiquement des chemins de migration vers des services équivalents ou supérieurs de son catalogue, avec maintien des conditions tarifaires pendant 6 mois minimum pour faciliter la transition. Si aucun service équivalent n'existe dans le catalogue VMCloud, des recommandations vers des prestataires tiers peuvent être fournies à titre informatif, sans que VMCloud n'engage sa responsabilité.

**Support technique dédié :** Durant la période de transition, un support technique spécialisé est mis à disposition gratuitement pour accompagner les clients dans leur migration. Ce support inclut l'assistance à l'export des données, la configuration des nouveaux services, et la résolution des problèmes techniques liés à la migration. Des guides de migration détaillés et des outils automatisés sont développés lorsque techniquement possible.

**Remboursements et compensations :** Les montants prépayés non consommés à la date d'arrêt sont intégralement remboursés ou transférés vers les nouveaux services souscrits. En cas de gêne significative avérée causée par l'arrêt du service, VMCloud peut proposer des compensations commerciales (crédits, remises, services additionnels) calculées au cas par cas.

### 27.5. Modification des CGUV

**Préavis :** 30 jours minimum pour les modifications substantielles

**Publication :** Nouvelle version publiée avec historique des changements

**Acceptation :** Poursuite de l'utilisation vaut acceptation des nouvelles conditions

## 28. Droit applicable et juridiction

### 28.1. Droit applicable

Les présentes conditions sont régies par le droit estonien pour les aspects relatifs à la société VMCloud OÜ. Pour les aspects contractuels et de consommation, le droit du pays de résidence habituelle du Client s'applique lorsque celui-ci bénéficie de dispositions plus favorables.

**Règles de conflit :** En cas de conflit entre plusieurs droits applicables, les dispositions les plus favorables au Client s'appliquent dans les limites de l'ordre public estonien.

### 28.2. Juridiction compétente

**Juridiction principale :** Tribunaux compétents d'Estonie (Tallinn) pour les litiges relatifs à VMCloud OÜ

**Exception consommateurs :** Les consommateurs au sens du droit européen conservent le droit de saisir les tribunaux de leur pays de résidence

**Clause attributive :** Pour les professionnels, attribution expresse de juridiction aux tribunaux estoniens, sauf dispositions impératives contraires

### 28.3. Médiation préalable

**Tentative de médiation :** Les parties s'efforcent de résoudre amiablement leurs différends par médiation avant toute action judiciaire

**Délai :** 60 jours maximum pour la tentative de médiation

**Médiation :** Par un médiateur agréé choisi d'un commun accord ou désigné par le centre de médiation compétent

**Échec :** En cas d'échec de la médiation, les parties retrouvent leur pleine liberté d'action judiciaire

## 29. Dispositions diverses

### 29.1. Intégralité de l'accord

Les présentes CGUV, complétées par le DPA, l'AUP et les conditions spécifiques éventuelles, constituent l'intégralité de l'accord entre les parties et remplacent tous accords antérieurs relatifs au même objet.

### 29.2. Autonomie des clauses

La nullité, l'inapplicabilité ou l'inopposabilité d'une clause n'affecte pas la validité des autres dispositions, qui demeurent pleinement applicables.

### 29.3. Renonciation

Le fait pour une partie de ne pas exercer un droit ou de ne pas sanctionner un manquement ne vaut pas renonciation à ce droit ou acceptation du manquement pour l'avenir.

### 29.4. Preuve électronique

Les enregistrements informatiques conservés dans les systèmes de VMCloud font foi entre les parties (logs, horodatages, traces d'audit, factures électroniques).

### 29.5. Langue de référence

En cas de traduction des présentes conditions, la version française fait foi en cas de divergence d'interprétation.

### 29.6. Notifications

**Adresses officielles :**
- VMCloud : Paju 1a, 50603 Tartu, Tartu Maakond, Estonie
- Email : contact@vmcloud.fr
- Client : Adresse renseignée dans le Compte

**Modes de notification :** Email, courrier recommandé, notification in-app, API webhook

### 29.7. Ring-fence bancaire et séparation des entités

VMCloud OÜ maintient une séparation comptable, juridique et financière stricte entre ses différentes activités commerciales pour respecter les exigences de ses partenaires bancaires et les réglementations financières applicables. Cette architecture de ring-fence garantit la transparence et la conformité de chaque entité.

**Séparation des activités :** Les partenaires bancaires de VMCloud OÜ ne financent exclusivement que les activités cloud traditionnelles de l'entité VMCloud. Les activités de cloud gaming et les services liés aux outils de développement de cheats constituent des entités commerciales distinctes (Hackboot Cheat) avec des comptabilités, des financements et des responsabilités juridiques complètement séparés. Cette séparation garantit qu'aucune contamination financière ou réputationnelle ne puisse affecter les services cloud principaux.

**Infrastructure partagée, gouvernance séparée :** Bien que VMCloud et Hackboot Cheat partagent la même infrastructure technique et le même site web pour des raisons d'efficacité opérationnelle, ils restent juridiquement et financièrement distincts. Les clients accèdent aux services via la même interface utilisateur, mais les flux financiers, les responsabilités contractuelles et les obligations légales sont strictement compartimentées selon l'activité souscrite.

**Transparence contractuelle :** Chaque service souscrit relève clairement d'une seule entité : les services VPS, GPU, stockage, CDN et load balancing relèvent de VMCloud OÜ, tandis que les services de gaming et de développement d'outils relèvent de Hackboot Cheat. Cette distinction est transparente pour le client et mentionnée explicitement dans les factures et contrats correspondants.

### 29.8. Survie des obligations

Survivent à l'expiration ou à la résiliation du contrat :
- Obligations de paiement des sommes dues
- Obligations de confidentialité (5 ans)
- Garanties d'éviction et limitations de responsabilité
- Dispositions relatives au règlement des litiges

## 30. Historique des versions

### Version 2.0 – 02/09/2025
- Refonte complète selon le cahier des charges de conformité juridique et bancaire
- Intégration de l'entité VMCloud OÜ (Estonie) et du droit applicable
- Définition précise des SLA (98%) avec barème de crédits détaillé
- Procédure de recouvrement stricte et calendrier de suppression des données
- AUP renforcée avec interdictions explicites (anti-cheat, contournement, etc.)
- Conservation des logs et procédures d'accès strictement encadrées
- Modèle de responsabilité partagée détaillé par service
- Politique de maintenance et communication d'incidents
- Conformité RGPD avec renvoi vers DPA séparé
- Contrôle des sanctions internationales et conformité export

### Version 1.0 – 02/09/2025
- Première publication des CGUV VMCloud (version générique)

---

### Contacts

**Support technique :** contact@vmcloud.fr  
**Sécurité :** contact@vmcloud.fr  
**Juridique :** contact@vmcloud.fr  
**RGPD/DPO :** contact@vmcloud.fr  

**Abuse & Signalements :** contact@vmcloud.fr  
**Commercial :** contact@vmcloud.fr

---

*Ces conditions générales constituent un accord juridiquement contraignant. En cas de question sur leur interprétation ou application, nous recommandons de consulter un conseil juridique qualifié.*