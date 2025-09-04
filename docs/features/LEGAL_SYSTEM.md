# Legal System Documentation

## Overview
Le système juridique VMCloud est conçu pour gérer l'ensemble des documents légaux de l'entreprise de manière modulaire et multilingue. Il permet la séparation des préoccupations juridiques en documents distincts tout en maintenant la cohérence et l'accessibilité.

## Architecture

### Structure des Fichiers
```
apps/web/public/data/legal/
├── terms/
│   ├── fr.md          # Conditions Générales d'Utilisation
│   └── en.md          # Terms of Service
├── aup/
│   ├── fr.md          # Politique d'Usage Acceptable
│   └── en.md          # Acceptable Use Policy  
├── sla/
│   ├── fr.md          # Accord de Niveau de Service
│   └── en.md          # Service Level Agreement
├── dpa/
│   ├── fr.md          # Accord de Traitement de Données
│   └── en.md          # Data Processing Agreement
└── changes/
    ├── fr.md          # Politique de Changements
    └── en.md          # Changes Policy
```

### Pages Dynamiques
```
apps/web/app/legal/
├── terms/page.tsx     # Page Terms avec rendu markdown
├── aup/page.tsx       # Page AUP avec rendu markdown  
├── sla/page.tsx       # Page SLA avec rendu markdown
├── dpa/page.tsx       # Page DPA avec rendu markdown
└── changes/page.tsx   # Page Changes avec rendu markdown
```

### Footer Integration
Le footer (`apps/web/components/layout/Footer.tsx`) contient les liens vers chaque document légal avec traductions appropriées.

## Features

### 1. Séparation Modulaire
- **Documents distincts** : Chaque type de document légal dans son propre dossier
- **Responsabilités séparées** : AUP, SLA, DPA, Changes extraites des Terms
- **Versioning** : Chaque document avec sa version (v2.1) et date de mise à jour
- **Maintenance** : Modifications indépendantes sans impact sur les autres docs

### 2. Support Bilingue Complet
- **FR/EN natif** : Traductions professionnelles pour tous les documents
- **Fallback intelligent** : Si traduction EN manquante, affiche FR automatiquement
- **Cohérence terminologique** : Vocabulaire juridique cohérent entre langues
- **Context-aware** : Pages s'adaptent à la langue utilisateur active

### 3. Intégration Société
- **Informations VMCloud OÜ** :
  - Immatriculation : 31644377  
  - Adresse : Paju 1a, 50603 Tartu, Tartu Maakond, Estonie
- **Données légales** : Intégrées dans tous les documents
- **Conformité** : Respect du droit estonien et européen

### 4. Rendu Markdown Sophistiqué
- **Pages Next.js** : Rendu côté serveur des fichiers markdown
- **Fetch dynamique** : Chargement des documents selon langue
- **Cache optimisé** : `cache: 'no-store'` pour mise à jour temps réel
- **Gestion erreurs** : Fallback vers français si document EN introuvable

## Configuration Guide

### Ajouter un Nouveau Document Légal

1. **Créer les fichiers markdown** :
```bash
mkdir apps/web/public/data/legal/nouveau-doc
touch apps/web/public/data/legal/nouveau-doc/fr.md
touch apps/web/public/data/legal/nouveau-doc/en.md
```

2. **Créer la page Next.js** :
```typescript
// apps/web/app/legal/nouveau-doc/page.tsx
import { useLanguage } from '../../../contexts/LanguageContext';

export default async function NouveauDocPage() {
  const lang = 'fr'; // ou logique de détection langue
  const resp = await fetch(`/data/legal/nouveau-doc/${lang}.md`, { 
    cache: 'no-store' 
  });
  
  if (!resp.ok && lang === 'en') {
    // Fallback vers français
    const respFr = await fetch(`/data/legal/nouveau-doc/fr.md`, { 
      cache: 'no-store' 
    });
    content = await respFr.text();
  } else {
    content = await resp.text();
  }

  return (
    <div className="doc-content">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
```

3. **Ajouter au footer** :
```typescript
// Dans Footer.tsx
legal: [
  // ... autres liens
  { 
    name: isFr ? 'Nouveau Doc' : 'New Document', 
    href: '/legal/nouveau-doc' 
  },
]
```

### Structure d'un Document Légal

Template recommandé :
```markdown
# Titre du Document

**Version :** v2.1  
**Dernière mise à jour :** [DATE]  
**Entité juridique :** VMCloud OÜ (31644377)  
**Adresse :** Paju 1a, 50603 Tartu, Tartu Maakond, Estonie

## 1. Introduction
[Contenu introductif]

## 2. Définitions
[Définitions des termes clés]

## 3. [Sections spécifiques]
[Contenu détaillé]

## Contact
VMCloud OÜ  
Paju 1a, 50603 Tartu  
Tartu Maakond, Estonie  
Immatriculation : 31644377
```

## Testing

### Tests de Rendu
1. **Vérifier l'affichage** : Toutes les pages `/legal/*` s'affichent correctement
2. **Test bilingue** : Basculer FR/EN et vérifier traductions
3. **Test fallback** : Supprimer temporairement fichier EN, vérifier fallback FR
4. **Links footer** : Tous les liens footer pointent vers bonnes pages

### Tests de Contenu
```bash
# Vérifier existence fichiers
ls apps/web/public/data/legal/*/fr.md
ls apps/web/public/data/legal/*/en.md

# Vérifier pages Next.js
ls apps/web/app/legal/*/page.tsx

# Test accessibility
npm run build && npm run start
# Vérifier avec screen reader
```

### Validation Légale
- **Cohérence terminologique** : Comparer vocabulaire FR/EN
- **Informations société** : Vérifier présence VMCloud OÜ dans tous docs
- **Versioning** : Contrôler dates et numéros de version
- **Références croisées** : Vérifier liens entre documents

## Future Enhancements

### 1. Système de Versioning Avancé
- **Git-based versioning** : Tracking des modifications par commit
- **Changelog automatique** : Génération des changements par document
- **Archives** : Conservation versions précédentes accessibles
- **Diff viewer** : Comparaison visuelle entre versions

### 2. Notification de Mise à Jour
- **Email automatique** : Notification clients lors changements majeurs
- **Dashboard admin** : Interface de gestion des documents
- **API endpoints** : Accès programmatique aux documents
- **Webhook system** : Intégration systèmes tiers

### 3. Amélioration UX
- **Table des matières** : Navigation interne documents
- **Recherche** : Recherche textuelle dans tous documents
- **Print-friendly** : Styles optimisés impression
- **PDF export** : Génération PDF à la demande
- **Bookmarking** : Liens directs vers sections spécifiques

### 4. Conformité Avancée
- **GDPR compliance checker** : Vérification automatique conformité
- **Legal review workflow** : Process validation juridique
- **Multi-jurisdiction** : Support autres juridictions que EE
- **Template engine** : Génération documents à partir templates

## Maintenance

### Mise à Jour Document
1. Modifier fichier markdown approprié
2. Mettre à jour version et date
3. Tester rendu page
4. Commit avec message descriptif
5. Documenter changements dans JOURNAL.md

### Ajout Nouvelle Langue
1. Créer fichiers `{lang}.md` dans tous dossiers
2. Adapter logique détection langue dans pages
3. Ajouter traductions footer
4. Tester fallback sur nouvelle langue

### Monitoring
- **Analytics** : Tracking consultation documents
- **Error monitoring** : Alertes si fichiers manquants  
- **Performance** : Temps chargement pages légales
- **User feedback** : Système feedback utilisateur sur clarté docs