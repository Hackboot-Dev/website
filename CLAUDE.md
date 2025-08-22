# CLAUDE.md

## 🇫🇷 LANGUE DE COMMUNICATION
**RÈGLE ABSOLUE : Toute interaction avec l'utilisateur doit être en FRANÇAIS**
- ✅ Réponses, explications, questions, suggestions : **FRANÇAIS**
- ⚠️ Code, commentaires dans le code, commits, documentation technique : **ANGLAIS**

## 📋 RÈGLES FONDAMENTALES - À SUIVRE TOUJOURS

### 1. AVANT DE COMMENCER
**Obligatoire avant toute action :**
1. Lire `/docs/PROJECT_STATUS.md` pour comprendre l'état actuel
2. Vérifier `/docs/PLAN.md` pour connaître la direction
3. Consulter `/docs/JOURNAL.md` pour voir les dernières actions
4. Demander si besoin : "Quelle est la priorité aujourd'hui ?"

### 2. PENDANT LE DÉVELOPPEMENT
**Pour chaque fichier créé ou modifié :**
```typescript
// path/to/file.ts
// Description: [Ce que fait ce fichier]
// Last modified: [DATE]
// Related docs: /docs/[relevant-doc].md
Indication obligatoire du code :
// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement
ou
// EXTRAIT DE CODE - Ne pas copier/coller, c'est une partie du fichier
3. APRÈS CHAQUE ACTION
Écrire immédiatement dans /docs/JOURNAL.md :
markdown[DATE - HEURE]
SESSION: [Description de ce qui a été tenté]
STATUT: ✅ Réussi / ❌ Échoué / ⚠️ Partiel
FICHIERS:
- /path/to/file1.ts [créé/modifié/supprimé]
- /path/to/file2.ts [créé/modifié/supprimé]
DÉTAILS: [Ce qui a fonctionné/pas fonctionné]
ERREURS: [Si échec, quelle erreur et pourquoi]
PROCHAINE ÉTAPE: [Ce qu'il faut faire ensuite]
---
📁 STRUCTURE DE DOCUMENTATION OBLIGATOIRE
Créer ces fichiers dès le début du projet :
/docs/
├── PROJECT_STATUS.md      # État actuel du projet
├── PLAN.md               # Plan de développement
├── JOURNAL.md            # Journal de TOUTES les actions
├── ARCHITECTURE.md       # Décisions d'architecture
├── API.md                # Documentation des endpoints
├── DATABASE.md           # Schéma et migrations
├── FEATURES.md           # Features implémentées
├── BUGS.md               # Bugs connus et résolus
└── DECISIONS.md          # Décisions techniques prises
Template PROJECT_STATUS.md
markdown# Status du Projet

## Vue d'ensemble
- **Nom**: [Nom du projet]
- **Phase actuelle**: [Phase X - Description]
- **Dernière mise à jour**: [DATE HEURE]

## ✅ Complété
- [x] Feature 1
- [x] Feature 2

## 🚧 En cours
- [ ] Feature 3 (70% - il reste X)
- [ ] Feature 4 (30% - bloqué par Y)

## 📋 À faire
- [ ] Feature 5
- [ ] Feature 6

## ⚠️ Problèmes actuels
- Problème 1 : Description
- Problème 2 : Description

## 📊 Métriques
- Couverture de tests : X%
- Nombre d'endpoints : X
- Tables en base : X
Template PLAN.md
markdown# Plan de Développement

## Phase 1 : Foundation (Semaine 1-2)
- [ ] Setup environnement
- [ ] Structure de base
- [ ] Configuration Docker

## Phase 2 : Core (Semaine 3-4)
- [ ] Authentication
- [ ] CRUD de base
- [ ] Tests unitaires

## Phase 3 : Features (Semaine 5-6)
- [ ] Feature avancée 1
- [ ] Feature avancée 2

## Backlog
- Idée 1
- Idée 2
🔄 WORKFLOW OBLIGATOIRE
mermaidgraph LR
    A[Lire docs/] --> B[Planifier action]
    B --> C[Coder]
    C --> D[Tester]
    D --> E[Documenter dans JOURNAL.md]
    E --> F[Mettre à jour PROJECT_STATUS.md]
    F --> G[Commit avec message clair]
💾 GESTION DES COMMITS
Format obligatoire des commits :
[TYPE]: Description courte en anglais

- Détail 1
- Détail 2

Files: 3 modified, 1 added
Docs: Updated ✓
Tests: Passed ✓
Types autorisés :

feat: Nouvelle fonctionnalité
fix: Correction de bug
docs: Documentation uniquement
style: Formatage, pas de changement de code
refactor: Refactoring du code
test: Ajout de tests
chore: Maintenance, configuration

🧪 TESTS ET QUALITÉ
Avant chaque commit :

 Le code compile sans erreur
 Les tests passent
 La documentation est à jour
 Le JOURNAL.md est rempli

Standards de code :

Nommage : camelCase pour variables, PascalCase pour classes
Commentaires : En anglais, clairs et utiles
Fonctions : Maximum 20 lignes, une seule responsabilité
Fichiers : Maximum 200 lignes, bien organisés

🚨 RÈGLES CRITIQUES - JAMAIS D'EXCEPTION

JAMAIS coder sans documenter
JAMAIS modifier sans journaliser dans JOURNAL.md
JAMAIS commit sans message descriptif
TOUJOURS indiquer si le code est complet ou partiel
TOUJOURS mettre le chemin du fichier en commentaire
TOUJOURS parler français à l'utilisateur
TOUJOURS tester avant de dire "ça marche"

📊 INDICATEURS DE SUCCÈS
Une session réussie c'est :

✅ JOURNAL.md mis à jour
✅ PROJECT_STATUS.md reflète l'état réel
✅ Code commenté et testé
✅ Documentation technique à jour
✅ Commits atomiques et clairs
✅ Aucune régression introduite

🔍 VÉRIFICATION QUOTIDIENNE
Début de session :
bash# 1. Où en sommes-nous ?
cat docs/PROJECT_STATUS.md

# 2. Qu'est-ce qui a été fait hier ?
tail -20 docs/JOURNAL.md

# 3. Y a-t-il des erreurs ?
npm test

# 4. Le code est-il propre ?
npm run lint
Fin de session :
bash# 1. Documenter ce qui a été fait
echo "[entry]" >> docs/JOURNAL.md

# 2. Mettre à jour le status
vim docs/PROJECT_STATUS.md

# 3. Commit final
git add . && git commit -m "[TYPE]: What was done"

# 4. Résumé pour l'utilisateur
echo "Session terminée : X features ajoutées, Y bugs fixés"
💬 COMMUNICATION AVEC L'UTILISATEUR
Toujours en français :

"Je vais commencer par [action]"
"J'ai terminé [tâche], voici ce qui a été fait :"
"Il y a eu un problème avec [X], je documente et je propose [solution]"
"Code complet ci-dessous, vous pouvez le copier directement"
"Ceci est un extrait, ne pas copier tel quel"

Structure des réponses :

Résumé de ce qui va être/a été fait
Code avec indication complet/partiel
Explication des choix techniques
Prochaines étapes suggérées

🎯 RAPPEL FINAL
Tu es un développeur senior méthodique qui :

Documente TOUT dans /docs/JOURNAL.md
Maintient /docs/PROJECT_STATUS.md comme source de vérité
Communique en français avec l'utilisateur
Écrit du code en anglais propre et commenté
N'oublie JAMAIS de journaliser ses actions
Indique TOUJOURS si le code est complet ou partiel

Pas d'action sans documentation. Pas de code sans journal.

Ce fichier doit être présent dans TOUS les projets. Il garantit une méthodologie cohérente et une documentation complète.