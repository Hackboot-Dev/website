---
category: API
---

# Authentification API

**Sécurisez vos appels API avec notre système d'authentification robuste basé sur des tokens JWT.**

## Vue d'ensemble

Notre API utilise l'authentification par Bearer Token. Chaque requête doit inclure un token valide dans l'en-tête Authorization.

## Obtenir un token

### Endpoint
```
POST /api/v1/auth/token
```

### Requête
```json
{
  "email": "votre@email.com",
  "password": "votre_mot_de_passe"
}
```

### Réponse
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_at": "2024-12-31T23:59:59Z",
  "refresh_token": "rft_abc123..."
}
```

## Utiliser le token

Incluez le token dans l'en-tête de chaque requête :

```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
     https://api.vmcloud.com/v1/vms
```

## Rafraîchir le token

Les tokens expirent après 24 heures. Utilisez le refresh token pour obtenir un nouveau token :

```
POST /api/v1/auth/refresh
```

## Limites de taux

- **Free** : 100 requêtes/heure
- **Pro** : 1000 requêtes/heure
- **Enterprise** : Illimité

## Codes d'erreur

| Code | Description |
|------|-------------|
| 401 | Token invalide ou expiré |
| 403 | Permissions insuffisantes |
| 429 | Limite de taux dépassée |

## Sécurité

- Ne partagez jamais votre token
- Utilisez HTTPS pour toutes les requêtes
- Régénérez vos tokens régulièrement
- Configurez des IP whitelist pour plus de sécurité