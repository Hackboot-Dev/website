# Extraction de sections de Terms vers documents séparés

## 🎯 **OBJECTIF**
Le fichier `terms/fr.md` contient actuellement toutes les sections, mais certaines devraient être dans des documents juridiques séparés pour une meilleure organisation et conformité aux standards.

## 📋 **SECTIONS À EXTRAIRE DE TERMS**

### 🚫 **AUP (Acceptable Use Policy)**
**Fichier cible :** `/apps/web/public/data/legal/aup/fr.md`

**Sections à extraire de Terms :**
- **Section 14** complète : Politique d'usage acceptable (AUP)
  - 14.1. Principes généraux
  - 14.2. Interdictions explicites (gaming/cheat, crypto mining, VPN/proxy, contenu adulte)
  - 14.3. Procédure d'application (détection, gradation, délais cure)
  - 14.4. Tests d'intrusion et programme de divulgation responsable
  - 14.5. Politique de contenu adulte
  - 14.6. Procédure d'inspection sur suspicion
  - 14.7. Conservation des preuves

### 📊 **SLA (Service Level Agreement)**
**Fichier cible :** `/apps/web/public/data/legal/sla/fr.md`

**Sections à extraire de Terms :**
- **Section 7** complète : Niveau de service et SLA
  - 7.1. Engagement de disponibilité (98% mensuel)
  - 7.2. Calcul et mesure de la disponibilité
  - 7.3. Procédure de réclamation
  - 7.4. Barème de compensation (crédits selon disponibilité)
  - 7.5. Exclusions du SLA
- **Section 8** : Protection anti-DDoS (peut rester dans Terms ou aller dans SLA)

### 📜 **DPA (Data Processing Agreement)**
**Fichier cible :** `/apps/web/public/data/legal/dpa/fr.md`

**Sections à extraire de Terms :**
- **Section 13** complète : Protection des données personnelles (RGPD)
  - 13.1. Cadre général (responsable/sous-traitant)
  - 13.2. Accord de traitement (DPA)
  - 13.3. Localisation des données (datacenters UE, sous-traitants)
  - 13.4. Violation de données
  - 13.5. Droits des personnes

### 🔄 **Changes (Politique d'évolution)**
**Fichier cible :** `/apps/web/public/data/legal/changes/fr.md`

**Sections à extraire de Terms :**
- **Section 27** complète : Modifications des Services et Conditions
  - 27.1. Évolution des services
  - 27.2. Modifications mineures (7j préavis)
  - 27.3. Modifications majeures (30j préavis)
  - 27.4. Dépréciations et fin de vie des services (EoL/EoS)
  - 27.5. Modification des CGUV

## ✅ **SECTIONS RESTANT DANS TERMS**

Les sections suivantes restent dans `terms/fr.md` car elles constituent le cœur des CGU :

- **1-4** : Définitions, Objet, Acceptation, Entité contractante
- **5-6** : Tarification et paiements, Impayés et recouvrement
- **9-12** : Support, Données/sauvegardes, Conservation logs, Sécurité (général)
- **15-26** : Propriété intellectuelle, API, Services techniques, Suspension/résiliation, Garanties, Responsabilité, Assurance, Force majeure, Confidentialité
- **28-30** : Litiges, Dispositions générales, Historique

## 🔗 **RÉFÉRENCES CROISÉES**

Après extraction, `terms/fr.md` devra référencer les documents séparés :

```markdown
## 7. Niveau de service et SLA
Nos engagements de niveau de service sont détaillés dans notre **Service Level Agreement (SLA)** disponible à l'adresse : [SLA VMCloud](/legal/sla)

## 13. Protection des données personnelles
Le traitement des données personnelles est régi par notre **Data Processing Agreement (DPA)** conforme RGPD, disponible à l'adresse : [DPA VMCloud](/legal/dpa)

## 14. Politique d'usage acceptable
Les règles d'utilisation de nos services sont définies dans notre **Acceptable Use Policy (AUP)**, disponible à l'adresse : [AUP VMCloud](/legal/aup)

## 27. Évolutions et changements
Notre politique de gestion des changements est détaillée dans notre document **Changes Policy**, disponible à l'adresse : [Changes VMCloud](/legal/changes)
```

## 📦 **AVANTAGES DE LA SÉPARATION**

1. **Modularité** : Documents spécialisés plus faciles à maintenir
2. **Conformité** : Standards juridiques respectés (DPA séparé pour RGPD)  
3. **Lisibilité** : CGU principales plus courtes et accessibles
4. **Évolutivité** : Chaque document peut évoluer indépendamment
5. **Référencement** : Clients peuvent pointer vers des politiques spécifiques

## 🎯 **PROCHAINES ÉTAPES**

1. ✅ Créer les 4 documents séparés avec le contenu extrait
2. ⏳ Tester que tous les contenus sont cohérents entre documents  
3. ⏳ Optionnel : Nettoyer Terms en supprimant les sections dupliquées
4. ⏳ Mettre à jour les références croisées dans Terms