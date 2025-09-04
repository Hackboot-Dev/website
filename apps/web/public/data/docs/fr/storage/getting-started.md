---
title: Démarrer avec le Stockage
description: Apprenez à utiliser les solutions de stockage VMCloud
order: 1
tags: ["stockage", "s3", "stockage-objet", "démarrage"]
---

# Démarrer avec VMCloud Storage

VMCloud Storage offre des solutions de stockage évolutives, sécurisées et économiques pour tous vos besoins de données.

## Vue d'ensemble

Nos solutions de stockage incluent :
- **Stockage Objet** : Stockage compatible S3 pour données non structurées
- **Stockage Bloc** : Stockage SSD haute performance pour machines virtuelles
- **Stockage de Sauvegarde** : Solutions de sauvegarde automatisées avec versioning

## Démarrage Rapide

### 1. Créer un Bucket de Stockage

```bash
# Utilisation de VMCloud CLI
vmcloud storage create mon-bucket --region=eu-west-1
```

### 2. Téléverser des Fichiers

```bash
# Téléverser un fichier unique
vmcloud storage upload fichier.txt s3://mon-bucket/

# Téléverser un dossier entier
vmcloud storage sync ./dossier-local s3://mon-bucket/dossier/
```

### 3. Configurer les Politiques d'Accès

```json
{
  "Version": "2024-01-01",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:vmcloud:s3:::mon-bucket/public/*"
    }
  ]
}
```

## Classes de Stockage

| Classe | Cas d'Usage | Disponibilité | Prix |
|--------|-------------|---------------|------|
| **Standard** | Données fréquemment accédées | 99,99% | 0,023€/GB |
| **Accès Peu Fréquent** | Données accédées moins d'une fois par mois | 99,9% | 0,0125€/GB |
| **Archive** | Stockage à long terme | 99,9% | 0,004€/GB |

## Meilleures Pratiques

### Organisation des Données
- Utilisez des noms de bucket significatifs
- Implémentez des hiérarchies de dossiers
- Étiquetez les ressources pour une gestion facilitée

### Sécurité
- Activez le chiffrement au repos
- Utilisez les politiques IAM pour le contrôle d'accès
- Activez le versioning pour les données critiques
- Configurez les politiques de cycle de vie

### Optimisation des Performances
- Utilisez les uploads multiparts pour les gros fichiers (>100MB)
- Activez le CDN pour le contenu fréquemment accédé
- Choisissez la classe de stockage appropriée

## Intégration API

### SDK Python

```python
import vmcloud

# Initialiser le client
client = vmcloud.Storage(
    access_key='VOTRE_CLE_ACCES',
    secret_key='VOTRE_CLE_SECRETE'
)

# Téléverser un fichier
client.upload_file(
    'fichier-local.pdf',
    'mon-bucket',
    'documents/fichier.pdf'
)

# Générer une URL présignée
url = client.generate_presigned_url(
    'mon-bucket',
    'documents/fichier.pdf',
    expiration=3600
)
```

### SDK Node.js

```javascript
const VMCloud = require('@vmcloud/storage');

const storage = new VMCloud.Storage({
    accessKey: process.env.VMCLOUD_ACCESS_KEY,
    secretKey: process.env.VMCLOUD_SECRET_KEY
});

// Upload avec progression
await storage.upload('mon-bucket', 'fichier.pdf', fileBuffer, {
    onProgress: (progress) => {
        console.log(`Progression : ${progress}%`);
    }
});
```

## Surveillance & Alertes

Configurez la surveillance pour :
- Tendances d'utilisation du stockage
- Taux de requêtes
- Taux d'erreurs
- Consommation de bande passante

## Dépannage

### Problèmes Courants

#### Erreur d'Accès Refusé
- Vérifiez les permissions IAM
- Contrôlez les politiques du bucket
- Assurez-vous de la bonne région

#### Vitesses de Téléversement Lentes
- Utilisez l'upload multipart
- Vérifiez la connectivité réseau
- Considérez Transfer Acceleration

## Prochaines Étapes

- [Configurer les Politiques de Cycle de Vie →](./lifecycle-policies.md)
- [Configurer la Réplication Multi-Régions →](./replication.md)
- [Implémenter des Stratégies de Sauvegarde →](./backup-strategies.md)