# API Authentication

**Secure your API calls with our robust JWT-based authentication system.**

## Overview

Our API uses Bearer Token authentication. Every request must include a valid token in the Authorization header.

## Getting a Token

### Endpoint
```
POST /api/v1/auth/token
```

### Request
```json
{
  "email": "your@email.com",
  "password": "your_password"
}
```

### Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_at": "2024-12-31T23:59:59Z",
  "refresh_token": "rft_abc123..."
}
```

## Using the Token

Include the token in the header of each request:

```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
     https://api.vmcloud.com/v1/vms
```

### JavaScript Example
```javascript
const response = await fetch('https://api.vmcloud.com/v1/vms', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### Python Example
```python
import requests

headers = {
    'Authorization': f'Bearer {token}',
    'Content-Type': 'application/json'
}

response = requests.get('https://api.vmcloud.com/v1/vms', headers=headers)
```

## Refreshing Tokens

Tokens expire after 24 hours. Use the refresh token to get a new token:

```
POST /api/v1/auth/refresh
```

```json
{
  "refresh_token": "rft_abc123..."
}
```

## Rate Limits

- **Free**: 100 requests/hour
- **Pro**: 1000 requests/hour
- **Enterprise**: Unlimited

## Error Codes

| Code | Description |
|------|-------------|
| 401 | Invalid or expired token |
| 403 | Insufficient permissions |
| 429 | Rate limit exceeded |

## Security Best Practices

1. **Never share your token** publicly
2. **Use HTTPS** for all requests
3. **Regenerate tokens** regularly
4. **Set up IP whitelist** for additional security
5. **Store tokens securely** (use environment variables)

## API Keys vs Tokens

### API Keys
- Long-lived
- Used for server-to-server communication
- Can be restricted by IP

### JWT Tokens
- Short-lived (24 hours)
- Used for user authentication
- Include user permissions

## Webhook Authentication

For webhooks, we send a signature header:

```
X-Webhook-Signature: sha256=abc123...
```

Verify it using your webhook secret:

```python
import hmac
import hashlib

def verify_webhook(payload, signature, secret):
    expected = hmac.new(
        secret.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(
        f"sha256={expected}",
        signature
    )
```

## Need Help?

Check our [API Reference](/docs/api-reference) for complete endpoint documentation or contact support for assistance.