# Documentation System

## Overview

Système de documentation dynamique et multilingue pour VMCloud, avec visualisateur Markdown sophistiqué et organisation par catégories de produits.

## Architecture

### Structure des Fichiers

```
/apps/web/
├── app/
│   ├── docs/
│   │   ├── page.tsx                 # Page principale avec catégories
│   │   └── [category]/
│   │       └── page.tsx              # Page dynamique par catégorie
│   └── api/docs/
│       ├── list/route.ts             # API pour lister les documents
│       └── content/route.ts          # API pour récupérer le contenu
├── components/documentation/
│   └── MarkdownViewer.tsx            # Visualisateur Markdown avancé
└── public/data/docs/
    ├── structure.json                # Structure des catégories
    ├── en/                          # Documentation anglaise
    │   ├── storage/
    │   │   └── *.md
    │   ├── vps/
    │   │   └── *.md
    │   └── ...
    └── fr/                          # Documentation française
        └── [même structure]
```

### Composants Principaux

1. **Page Documentation (`/docs`)**
   - Affiche les 7 catégories de produits
   - Cards interactives avec icônes et couleurs
   - Compteur d'articles par catégorie
   - Support multilingue complet

2. **Page Catégorie (`/docs/[category]`)**
   - Sidebar avec liste des documents
   - Visualisateur de contenu principal
   - Recherche en temps réel
   - Navigation au clavier
   - Table des matières automatique

3. **MarkdownViewer**
   - Rendu sophistiqué du Markdown
   - Coloration syntaxique pour le code
   - Copie de code en un clic
   - Support des tableaux, listes, citations
   - Styles adaptés à la couleur de la catégorie

## Features

### 1. Organisation par Catégories
- **7 catégories** : Storage, CDN, VPS, GPU, PaaS, Web Hosting, Load Balancer
- Chaque catégorie a sa couleur et son icône distinctive
- Navigation intuitive entre catégories

### 2. Support Multilingue
- Documentation en français et anglais
- Fallback automatique vers l'anglais si traduction manquante
- URLs préservées entre langues

### 3. Métadonnées Frontmatter
```yaml
---
title: Titre du Document
description: Description courte
order: 1  # Ordre d'affichage
tags: ["tag1", "tag2"]
---
```

### 4. Fonctionnalités Avancées
- **Temps de lecture** calculé automatiquement
- **Date de modification** des fichiers
- **Tags** pour catégorisation fine
- **Recherche** dans titre, description et tags
- **Table des matières** générée automatiquement
- **Ancres de navigation** pour les titres

### 5. Visualisateur Markdown
- Rendu de haute qualité
- Support complet de la syntaxe Markdown
- Code blocks avec coloration syntaxique
- Bouton de copie pour le code
- Tables formatées
- Listes ordonnées et non-ordonnées
- Citations stylisées
- Liens avec hover effects

## Configuration Guide

### Ajouter une Nouvelle Catégorie

1. Éditer `/public/data/docs/structure.json` :
```json
{
  "id": "nouvelle-categorie",
  "order": 8,
  "icon": "IconName",
  "color": "emerald",
  "name": {
    "en": "New Category",
    "fr": "Nouvelle Catégorie"
  },
  "description": {
    "en": "Description in English",
    "fr": "Description en français"
  }
}
```

2. Créer les dossiers :
```bash
mkdir -p public/data/docs/en/nouvelle-categorie
mkdir -p public/data/docs/fr/nouvelle-categorie
```

3. Ajouter des documents Markdown

### Ajouter un Document

Créer un fichier `.md` dans le dossier approprié :

```markdown
---
title: Mon Document
description: Description du document
order: 1
tags: ["exemple", "tutoriel"]
---

# Mon Document

Contenu en Markdown...
```

### Personnaliser les Couleurs

Les couleurs disponibles sont définies dans les composants :
- cyan, purple, blue, green, indigo, amber, rose

Chaque couleur a des variantes pour :
- Background gradient
- Hover effects
- Icônes
- Code blocks
- Liens

## API Endpoints

### GET /api/docs/list
Liste les documents d'une catégorie

**Paramètres** :
- `category` (requis) : ID de la catégorie
- `lang` : Langue (défaut: 'en')

**Réponse** :
```json
{
  "documents": [
    {
      "id": "getting-started",
      "title": "Getting Started",
      "description": "...",
      "order": 1,
      "tags": ["..."],
      "readTime": 5,
      "lastModified": "2025-09-02"
    }
  ],
  "language": "en",
  "total": 1,
  "category": "storage"
}
```

### GET /api/docs/content
Récupère le contenu d'un document

**Paramètres** :
- `category` (requis) : ID de la catégorie
- `doc` (requis) : ID du document
- `lang` : Langue (défaut: 'en')

**Réponse** :
```json
{
  "id": "getting-started",
  "title": "Getting Started",
  "description": "...",
  "content": "# Markdown content...",
  "order": 1,
  "tags": ["..."],
  "readTime": 5,
  "lastModified": "2025-09-02",
  "language": "en",
  "category": "storage"
}
```

## Testing

### Test de la Page Documentation
1. Naviguer vers `/docs`
2. Vérifier l'affichage des 7 catégories
3. Tester le hover sur les cards
4. Vérifier le changement de langue

### Test de la Page Catégorie
1. Cliquer sur une catégorie
2. Vérifier la liste des documents dans la sidebar
3. Cliquer sur un document
4. Tester la recherche
5. Vérifier le rendu Markdown
6. Tester la copie de code

### Test du Fallback Multilingue
1. Passer en français
2. Naviguer vers une catégorie sans traduction
3. Vérifier le fallback vers l'anglais

## Future Enhancements

### Court Terme
- [ ] Ajout de plus de documents pour chaque catégorie
- [ ] Système de favoris/bookmarks
- [ ] Export PDF des documents
- [ ] Mode impression optimisé

### Moyen Terme
- [ ] Recherche globale dans toute la documentation
- [ ] Versioning des documents
- [ ] Commentaires et feedback utilisateur
- [ ] Analytics de consultation

### Long Terme
- [ ] Éditeur Markdown intégré pour contributions
- [ ] API publique pour accès programmatique
- [ ] Intégration avec système de tickets support
- [ ] Génération automatique depuis code source

## Maintenance

### Mise à Jour des Documents
- Les documents sont en Markdown dans `/public/data/docs/`
- Éditer directement les fichiers `.md`
- Le frontmatter contrôle les métadonnées
- L'ordre d'affichage est contrôlé par `order`

### Ajout de Traductions
1. Copier le document depuis `/en/` vers `/fr/`
2. Traduire le contenu
3. Adapter le frontmatter si nécessaire
4. Le système détectera automatiquement la traduction

### Performance
- Les documents sont chargés à la demande
- Cache navigateur pour les contenus statiques
- Lazy loading des composants
- Optimisation des re-renders React