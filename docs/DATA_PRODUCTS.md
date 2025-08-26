# Structure des Données Produits 📁

## Vue d'ensemble

Ce dossier contient toutes les données relatives aux produits de la plateforme VMCloud.
La structure est organisée pour séparer les données techniques des traductions et de la configuration d'affichage.

## 🗂️ Structure des fichiers

```
data/products/
├── base.json           # Données techniques (prix, specs) - LANGUE NEUTRE
├── display-config.json # Configuration d'affichage par catégorie
├── fr/                 # Traductions françaises
│   ├── vps.json       # Descriptions VPS en français
│   ├── gpu.json       # Descriptions GPU en français
│   └── ...
├── en/                 # Traductions anglaises
│   ├── vps.json       # Descriptions VPS en anglais
│   ├── gpu.json       # Descriptions GPU en anglais
│   └── ...
└── README.md          # Ce fichier
```

## 📋 Fichiers principaux

### 1. `base.json` - Données techniques neutres
Contient toutes les spécifications techniques et prix des produits :
- **36+ produits** dans 7 catégories
- Prix (hourly, monthly, annual)
- Spécifications techniques (CPU, RAM, Storage, etc.)
- SLA, support level, trial

**Structure :**
```json
{
  "vps": [
    {
      "id": "vps-nano",
      "name": "VPS-NANO",
      "vcpu": "1x AMD EPYC™",
      "ram": "2 GB DDR4 ECC",
      "monthly": 29,
      ...
    }
  ],
  "gpu": [...],
  ...
}
```

### 2. `display-config.json` - Configuration d'affichage
Définit comment afficher chaque catégorie de produit :
- Quelles specs afficher en principal
- Configuration des benchmarks
- Sections techniques
- Sécurité & conformité
- Contact expert ou non

**Structure :**
```json
{
  "vps": {
    "displayName": "VPS",
    "mainSpecs": [...],
    "benchmarks": {...},
    "security": {...},
    "contactExpert": true
  },
  ...
}
```

### 3. `fr/*.json` et `en/*.json` - Traductions
Contiennent les descriptions traduites pour chaque produit :
- Description détaillée
- Cas d'usage
- Fonctionnalités
- Public cible

**Structure :**
```json
{
  "vps-nano": {
    "description": "Serveur virtuel économique...",
    "usage": "DÉVELOPPEMENT & TESTS",
    "use_cases": [...],
    "features": [...]
  },
  ...
}
```

## 🔄 Comment ça fonctionne

1. **Chargement** : `productDataLoader.ts` charge les données
2. **Fusion** : Combine `base.json` + traductions selon la langue
3. **Affichage** : `UniversalProductPage.tsx` utilise `display-config.json` pour adapter l'UI

## ➕ Ajouter un nouveau produit

1. Ajouter les specs dans `base.json`
2. Ajouter les traductions dans `fr/[category].json` et `en/[category].json`
3. Si nouvelle catégorie, ajouter la config dans `display-config.json`

## ✏️ Modifier l'affichage

Pour changer ce qui est affiché pour une catégorie, modifier `display-config.json` :
- `mainSpecs` : Les 4 specs principales à afficher
- `benchmarks` : Les métriques de performance
- `security.items` : Les points de sécurité
- `contactExpert` : Afficher ou non la section contact

## 📊 Sources de données

Les informations détaillées proviennent du fichier `/workspaces/website/product.md` qui contient :
- Tableaux comparatifs complets
- Tous les prix et options
- Détails techniques approfondis
- SLA et garanties

## 🚀 Architecture

Cette structure permet :
- **Séparation des préoccupations** : Technique vs Traductions vs Affichage
- **Extensibilité** : Facile d'ajouter des langues ou produits
- **Maintenance** : Un seul endroit pour chaque type de données
- **Performance** : Chargement optimisé par langue
- **Universalité** : Une page unique s'adapte à tous les produits