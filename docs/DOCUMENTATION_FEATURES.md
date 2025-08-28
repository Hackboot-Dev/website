# Documentation des Fonctionnalités

## Vue d'ensemble
Ce fichier liste toutes les documentations de fonctionnalités disponibles dans `/docs/features/`.
Chaque fonctionnalité complexe du projet a sa documentation détaillée.

## Fonctionnalités documentées

### Support Channels System
**Fichier** : [features/SUPPORT_CHANNELS.md](./features/SUPPORT_CHANNELS.md)

**Description** : Explique le fonctionnement complet du système de canaux de support avec disponibilité en temps réel.

**Contenu** :
- Architecture du système de vérification de disponibilité
- Configuration des horaires (schedule-based, plan-based, always)
- Gestion des statuts visuels (disponible/indisponible/plan requis)
- Support multilingue FR/EN
- Guide de configuration JSON
- Tests et optimisations

**Fichiers concernés** :
- `/apps/web/components/support/SupportChannels.tsx`
- `/apps/web/data/support/channels-config.json`
- `/apps/web/app/support/page.tsx`

---

## Comment ajouter une nouvelle documentation

1. Créer un fichier dans `/docs/features/FEATURE_NAME.md`
2. Documenter la fonctionnalité selon le template :
   - Overview
   - Architecture
   - Features
   - Configuration Guide
   - Testing
   - Future Enhancements
3. Ajouter une entrée dans ce fichier (`DOCUMENTATION_FEATURES.md`)
4. Format de l'entrée :
   ```markdown
   ### Nom de la Fonctionnalité
   **Fichier** : [features/FEATURE_NAME.md](./features/FEATURE_NAME.md)
   **Description** : Brève description de ce que fait la fonctionnalité
   **Contenu** : Liste des points couverts dans la doc
   **Fichiers concernés** : Chemins des fichiers implémentant la feature
   ```

## Règles de documentation

- **Une fonctionnalité = Un fichier** dans `/docs/features/`
- **Nommage** : `FEATURE_NAME.md` en MAJUSCULES avec underscores
- **Obligatoire pour** : Toute fonctionnalité touchant 2+ composants
- **Langue** : Documentation technique en français ou anglais selon préférence
- **Mise à jour** : À chaque modification majeure de la fonctionnalité