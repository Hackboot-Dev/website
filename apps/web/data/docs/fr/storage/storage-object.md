---
category: Storage
---

# Stockage Object S3

**Stockez et distribuez vos données à l'échelle mondiale avec notre stockage object compatible S3.**

## Caractéristiques

- **Compatible S3** : Utilisez vos outils existants
- **Durabilité 99.999999999%** : 11 neufs de fiabilité
- **CDN intégré** : Distribution mondiale
- **Chiffrement** : AES-256 au repos
- **Versioning** : Historique des modifications

## Tarification Simple

- **Stockage** : 0.02€/GB/mois
- **Transfert sortant** : 0.01€/GB
- **Requêtes** : 0.0004€ pour 1000 PUT/POST/LIST
- **CDN** : Inclus gratuitement

## Démarrage Rapide

### 1. Créer un bucket

```bash
# AWS CLI compatible
aws s3 mb s3://mon-bucket --endpoint-url https://s3.vmcloud.com
```

### 2. Upload de fichiers

```bash
aws s3 cp fichier.pdf s3://mon-bucket/ --endpoint-url https://s3.vmcloud.com
```

### 3. Configuration SDK

```python
import boto3

s3 = boto3.client('s3',
    endpoint_url='https://s3.vmcloud.com',
    aws_access_key_id='YOUR_KEY',
    aws_secret_access_key='YOUR_SECRET'
)
```

## Cas d'Usage

- **Backup** : Sauvegarde automatisée
- **Media** : Stockage vidéo/images
- **Archives** : Conservation long terme
- **Distribution** : CDN pour assets
- **Data Lake** : Analytics big data