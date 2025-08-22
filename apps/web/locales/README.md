# 🌐 Système de Traduction - Guide d'Ajout de Langues

## 📁 Structure des Fichiers

```
/locales/
├── en.json         # Anglais (langue par défaut)
├── fr.json         # Français
├── es.json         # Espagnol
└── README.md       # Ce guide
```

## ➕ Ajouter une Nouvelle Langue

### 1. Créer le Fichier de Traduction

Créez un nouveau fichier JSON dans `/locales/` avec le code de la langue :

```bash
# Exemple pour l'allemand
touch locales/de.json
```

### 2. Copier la Structure des Traductions

Copiez le contenu de `en.json` et traduisez toutes les valeurs :

```json
{
  "nav": {
    "infrastructure": "Infrastruktur",
    "pricing": "Preise",
    "documentation": "Dokumentation",
    "support": "Support",
    "signIn": "Anmelden",
    "getStarted": "Loslegen"
  },
  "hero": {
    "label": "2025 INFRASTRUKTUR",
    "title": {
      "1": "Cloud",
      "2": "Computing",
      "3": "Neu Definiert"
    },
    ...
  }
}
```

### 3. Mettre à Jour la Configuration

Éditez `/utils/loadTranslations.ts` :

```typescript
// Ajouter la nouvelle langue
export type Language = 'en' | 'fr' | 'es' | 'de';

export const supportedLanguages: Language[] = ['en', 'fr', 'es', 'de'];

export const languageInfo = {
  en: { name: 'EN', flag: '🇺🇸', fullName: 'English' },
  fr: { name: 'FR', flag: '🇫🇷', fullName: 'Français' },
  es: { name: 'ES', flag: '🇪🇸', fullName: 'Español' },
  de: { name: 'DE', flag: '🇩🇪', fullName: 'Deutsch' } // ← Nouvelle langue
};
```

### 4. Test

La nouvelle langue apparaîtra automatiquement dans le sélecteur ! 🎉

## 🔧 Structure des Clés de Traduction

Les clés de traduction suivent une structure hiérarchique :

```
section.subsection.element
```

### Exemples :
- `nav.infrastructure` → Navigation > Infrastructure
- `hero.title.1` → Hero Section > Titre > Partie 1
- `pricing.cta.trial` → Pricing > Call-to-Action > Trial

## 📋 Sections Disponibles

| Section | Préfixe | Description |
|---------|---------|-------------|
| Navigation | `nav.*` | Menu principal |
| Hero | `hero.*` | Section d'accueil |
| Features | `features.*` | Fonctionnalités |
| Pricing | `pricing.*` | Tarification |
| CTA | `cta.*` | Call-to-Action final |

## ✅ Bonnes Pratiques

### 1. Cohérence des Clés
- ✅ Utilisez exactement les mêmes clés dans tous les fichiers
- ❌ Ne supprimez jamais de clés existantes

### 2. Formatage JSON
- Utilisez l'indentation de 2 espaces
- Vérifiez la syntaxe JSON avec un validateur

### 3. Traduction de Qualité
- Respectez le contexte d'utilisation
- Adaptez la longueur des textes (UI contraints)
- Conservez les termes techniques appropriés

### 4. Test Local
```bash
# Tester la nouvelle langue
npm run dev
# Changez la langue dans le sélecteur
```

## 🚀 Fonctionnalités Automatiques

### Détection Navigateur
Le système détecte automatiquement la langue préférée du navigateur au premier chargement.

### Persistance
Le choix de langue est sauvegardé dans `localStorage` et restauré à la prochaine visite.

### Fallback
Si une clé de traduction est manquante, le système affiche la clé elle-même en attendant la traduction.

### Cache
Les fichiers de traduction sont mis en cache pour éviter les rechargements inutiles.

## 🔍 Exemple Complet - Ajout du Japonais

1. **Créer le fichier** :
```bash
touch locales/ja.json
```

2. **Ajouter les traductions** :
```json
{
  "nav": {
    "infrastructure": "インフラストラクチャ",
    "pricing": "料金",
    "documentation": "ドキュメント",
    "support": "サポート",
    "signIn": "サインイン",
    "getStarted": "始める"
  },
  ...
}
```

3. **Mettre à jour la config** :
```typescript
export type Language = 'en' | 'fr' | 'es' | 'ja';
export const supportedLanguages: Language[] = ['en', 'fr', 'es', 'ja'];
export const languageInfo = {
  // ...autres langues
  ja: { name: 'JP', flag: '🇯🇵', fullName: '日本語' }
};
```

4. **C'est tout !** Le japonais apparaît maintenant dans le sélecteur. 🎌

---

## 💡 Pro Tips

- **Collaboration** : Chaque traducteur peut travailler sur son fichier JSON indépendamment
- **Validation** : Utilisez des outils comme `i18n-validator` pour vérifier la cohérence
- **Automatisation** : Configurez des GitHub Actions pour valider les PR de traduction
- **Pluralization** : Pour des besoins avancés, considérez `react-i18next` avec support des pluriels

**Le système est extensible à l'infini ! Ajoutez autant de langues que nécessaire. 🌍**