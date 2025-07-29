# Audit de Sécurité du Site Web

## 1. Résumé Exécutif

Cet audit a identifié des vulnérabilités de sécurité critiques qui compromettent l'intégrité du site et la sécurité des données des utilisateurs. Bien que le site soit statique, la tentative de simuler un système de connexion dynamique a introduit des failles importantes.

La vulnérabilité la plus grave est l'exposition publique du fichier `account/users.json`, qui contient les informations d'identification des utilisateurs.

## 2. Vulnérabilités Identifiées

### 2.1. Exposition des Données Sensibles (Critique)

- **Description** : Le fichier `account/users.json` est accessible publiquement. Il contient une liste d'utilisateurs avec leurs noms d'utilisateur et mots de passe.
- **Impact** : Un attaquant peut télécharger ce fichier pour obtenir les informations d'identification de tous les utilisateurs.
- **Preuve de Concept** : Accéder à `https://[votre-domaine]/account/users.json` dans un navigateur révèle le contenu du fichier.

### 2.2. Authentification Côté Client (Critique)

- **Description** : Le processus de connexion est entièrement géré côté client via JavaScript (`account/login.js`). Le script télécharge la liste des utilisateurs et vérifie les informations d'identification dans le navigateur de l'utilisateur.
- **Impact** :
    - L'authentification peut être contournée en manipulant le code JavaScript.
    - Les informations d'identification sont exposées pendant le processus d'authentification.
- **Preuve de Concept** : Un utilisateur peut ouvrir les outils de développement du navigateur pour inspecter le code source, définir des points d'arrêt et manipuler les variables pour contourner la logique de connexion.

### 2.3. Encodage Faible des Mots de Passe (Élevé)

- **Description** : Les mots de passe dans `users.json` sont encodés en Base64. Base64 n'est pas une méthode de chiffrement, mais un schéma d'encodage, et il peut être facilement décodé.
- **Impact** : Quiconque obtient le fichier `users.json` peut facilement décoder les mots de passe.
- **Preuve de Concept** : Le mot de passe "cGFzc3dvcmQ=" peut être décodé en "password".

## 3. Recommandations

Pour corriger ces vulnérabilités, il est essentiel de passer à une approche sécurisée pour la gestion des utilisateurs et de l'authentification.

### 3.1. Supprimer `users.json` du Contenu Statique

Le fichier `users.json` ne doit jamais être servi publiquement. Il doit être supprimé du répertoire du site web.

### 3.2. Mettre en Place une Authentification Côté Serveur

Pour une authentification sécurisée, vous devez utiliser un backend (côté serveur) qui gère les informations d'identification des utilisateurs et les sessions.

- **Options de Backend** :
    - **Services d'Authentification Tiers** : Utilisez des services comme Auth0, Firebase Authentication ou Okta. Ils fournissent des solutions sécurisées et faciles à intégrer pour la gestion des utilisateurs.
    - **Backend Personnalisé** : Développez une API simple avec un langage comme Node.js, Python ou Go. Cette API gérera l'enregistrement, la connexion et les sessions des utilisateurs.

### 3.3. Sécuriser les Mots de Passe

- **Hachage des Mots de Passe** : Les mots de passe doivent être hachés à l'aide d'un algorithme de hachage fort et salé (par exemple, Argon2, scrypt, bcrypt).
- **Stockage Sécurisé** : Les informations d'identification des utilisateurs doivent être stockées dans une base de données sécurisée.

## 4. Conclusion

Le modèle de sécurité actuel est fondamentalement défaillant et doit être entièrement repensé. La priorité absolue est de supprimer le fichier `users.json` et de mettre en œuvre une solution d'authentification côté serveur.

Continuer avec le système actuel expose le site et ses utilisateurs à des risques importants.
