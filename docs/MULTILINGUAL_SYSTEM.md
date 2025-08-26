# 🌍 Système Multilingue - Documentation Complète

## Vue d'ensemble
Le site utilise un système de traduction flexible qui supporte actuellement FR/EN avec possibilité d'ajouter facilement d'autres langues.

## 📁 Structure des fichiers

```
/apps/web/
├── locales/
│   ├── en.json          # Traductions anglaises
│   └── fr.json          # Traductions françaises
├── data/products/
│   ├── base.json        # Données techniques des produits (prix, specs)
│   └── display-config.json # Configuration d'affichage + traductions
└── app/products/
    └── [category]/[slug]/page.tsx # Page universelle pour tous les produits
```

## 🔤 Comment fonctionne le système de traduction

### 1. Détection de la langue
- Utilise `LanguageContext` qui détecte la langue du navigateur ou la préférence utilisateur
- Switcher de langue dans le header
- Fallback : FR → EN si traduction manquante

### 2. Structure des traductions dans display-config.json

#### Pour les titres et sous-titres :
```json
{
  "benchmarks": {
    "title": "Performance Benchmarks",        // EN
    "title_fr": "Benchmarks de Performance",  // FR
    "subtitle": "Real-world metrics",
    "subtitle_fr": "Métriques réelles"
  }
}
```

#### Pour les catégories techniques :
```json
{
  "category": "GPU Hardware",          // EN
  "category_fr": "Matériel GPU",      // FR
  "specs": [...]
}
```

#### Pour les specs individuelles :
```json
{
  "name": "Memory Bandwidth",              // EN
  "name_fr": "Bande passante mémoire",    // FR (optionnel)
  "value": "Up to 2TB/s",                 // EN
  "value_fr": "Jusqu'à 2TB/s"            // FR (optionnel)
}
```

#### Pour les listes (security, features, etc.) :
```json
"items": [
  { 
    "en": "Free SSL/TLS certificate",
    "fr": "Certificat SSL/TLS gratuit" 
  },
  // ...
]
```

## 📝 Guide : Ajouter un nouveau produit

### Étape 1 : Ajouter les données techniques dans base.json
```json
{
  "nouveau-produit": {
    "name": "Mon Nouveau Produit",
    "category": "vps",  // ou gpu, webhosting, etc.
    "slug": "nouveau-produit",
    "vcpu": 4,
    "ram": 8,
    "storage": 160,
    "bandwidth": 10,
    "hourly": 0.15,
    "monthly": 89,
    "annual": 890
  }
}
```

### Étape 2 : Ajouter les traductions dans les locales
**fr.json:**
```json
{
  "products": {
    "nouveau-produit": {
      "name": "Mon Nouveau Produit",
      "description": "Description en français",
      "features": ["Feature 1", "Feature 2"]
    }
  }
}
```

**en.json:**
```json
{
  "products": {
    "nouveau-produit": {
      "name": "My New Product",
      "description": "English description",
      "features": ["Feature 1", "Feature 2"]
    }
  }
}
```

### Étape 3 : Vérifier la configuration d'affichage
Si le produit appartient à une catégorie existante (vps, gpu, etc.), il utilisera automatiquement la configuration de cette catégorie dans display-config.json.

Pour une nouvelle catégorie, ajouter dans display-config.json :
```json
{
  "nouvelle-categorie": {
    "displayName": "New Category",
    "mainSpecs": [...],
    "technicalSections": [...],
    "benchmarks": {...},
    "security": {...}
  }
}
```

## 🔧 Guide : Modifier un produit existant

### Ajouter une nouvelle spec technique
1. Dans `display-config.json`, trouver la catégorie du produit
2. Ajouter dans `technicalSections` → `specs` :
```json
{
  "name": "New Spec",
  "name_fr": "Nouvelle Spec",  // Optionnel
  "value": "Value",
  "value_fr": "Valeur"         // Optionnel
}
```

### Ajouter une section security/features
Dans `display-config.json` :
```json
"security": {
  "items": [
    { "en": "New security feature", "fr": "Nouvelle fonction sécurité" }
  ]
}
```

### Modifier les prix
Dans `base.json`, modifier les champs :
- `hourly` : Prix horaire
- `monthly` : Prix mensuel
- `annual` : Prix annuel

## 🌐 Guide : Ajouter une nouvelle langue (ex: Espagnol)

### Étape 1 : Créer le fichier de locale
Créer `/apps/web/locales/es.json` :
```json
{
  "nav": {
    "products": "Productos",
    "pricing": "Precios"
  },
  "products": {
    // Traductions des produits
  }
}
```

### Étape 2 : Mettre à jour LanguageContext
Dans `/apps/web/contexts/LanguageContext.tsx` :
```typescript
type Language = 'fr' | 'en' | 'es';  // Ajouter 'es'

// Ajouter l'import
import es from '../locales/es.json';

// Ajouter dans translations
const translations = {
  fr,
  en,
  es  // Nouveau
};
```

### Étape 3 : Ajouter les traductions dans display-config.json
Pour chaque section, ajouter les champs `_es` :
```json
{
  "benchmarks": {
    "title": "Performance Benchmarks",
    "title_fr": "Benchmarks de Performance",
    "title_es": "Benchmarks de Rendimiento",  // Nouveau
    // ...
  }
}
```

### Étape 4 : Mettre à jour le composant UniversalProductPage
Ajouter la détection pour la nouvelle langue :
```typescript
// Dans les conditions de traduction
language === 'es' && section.category_es ? section.category_es : 
language === 'fr' && section.category_fr ? section.category_fr : 
section.category
```

### Étape 5 : Ajouter le switch dans Header
Dans `/apps/web/components/layout/Header.tsx`, ajouter l'option espagnol au language switcher.

## 📋 Checklist pour les traductions

### ✅ Pour chaque produit, vérifier :
- [ ] Nom du produit traduit dans locales/
- [ ] Description traduite
- [ ] Features traduites
- [ ] Catégories techniques avec `category_fr`
- [ ] Titres des sections avec `title_fr`
- [ ] Items security/features en format objet `{en: "", fr: ""}`

### ✅ Pour chaque catégorie dans display-config.json :
- [ ] `displayName` (utilisé dans l'URL, pas traduit)
- [ ] `technicalSections` avec `category_fr` pour chaque
- [ ] `benchmarks` avec `title_fr` et `subtitle_fr`
- [ ] `security` avec `title_fr` et `subtitle_fr`
- [ ] `features` avec `title_fr` (si présent)
- [ ] `useCases` avec `title_fr` (si présent)

## 🔍 Debugging des traductions

### Problème : Une traduction ne s'affiche pas
1. Vérifier dans la console : `console.log(language)` pour voir la langue active
2. Vérifier que le champ `_fr` existe dans display-config.json
3. Vérifier que l'item est au format objet `{en: "", fr: ""}` et non string

### Problème : Fallback vers l'anglais alors que FR existe
1. Vérifier l'orthographe exacte du champ (ex: `title_fr` pas `titleFr`)
2. Vérifier que le JSON est valide (pas de virgule manquante)

### Commande utile pour vérifier :
```bash
# Vérifier toutes les traductions manquantes
grep -r "title\":" apps/web/data/products/display-config.json | grep -v "title_fr"
```

## 📚 Exemples complets

### Exemple : Ajouter un nouveau GPU
1. **base.json** :
```json
"gpu-rtx-5090": {
  "name": "GPU RTX 5090",
  "category": "gpu",
  "gpu": "1x RTX 5090",
  "vram": "32 GB GDDR7",
  "monthly": 1299
}
```

2. **fr.json** :
```json
"gpu-rtx-5090": {
  "name": "GPU RTX 5090",
  "description": "Le GPU le plus puissant pour l'IA"
}
```

3. **en.json** :
```json
"gpu-rtx-5090": {
  "name": "GPU RTX 5090",
  "description": "The most powerful GPU for AI"
}
```

Le produit utilisera automatiquement la configuration GPU de display-config.json.

## 🚀 Best Practices

1. **Toujours fournir EN et FR** minimum pour chaque nouvelle fonctionnalité
2. **Utiliser des clés cohérentes** : `_fr`, `_es`, etc.
3. **Tester dans les deux langues** avant de commit
4. **Documenter les nouvelles traductions** dans ce fichier
5. **Utiliser le fallback** : Si pas de traduction FR, afficher EN plutôt que rien

## 📞 Support

Pour toute question sur le système multilingue :
1. Consulter cette documentation
2. Vérifier les exemples dans display-config.json
3. Tester avec le language switcher dans le header

---
*Dernière mise à jour : 2025-08-26*