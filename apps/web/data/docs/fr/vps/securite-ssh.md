---
category: Sécurité
---

# Sécurisation SSH

**Protégez vos serveurs avec les meilleures pratiques de sécurité SSH et réduisez les risques d'intrusion.**

## Configuration de base

### 1. Changer le port SSH

Éditez `/etc/ssh/sshd_config` :

```bash
Port 2222  # Au lieu de 22
```

### 2. Désactiver l'authentification par mot de passe

```bash
PasswordAuthentication no
PubkeyAuthentication yes
```

### 3. Désactiver l'accès root direct

```bash
PermitRootLogin no
```

## Authentification par clé SSH

### Générer une paire de clés

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

### Ajouter la clé publique au serveur

```bash
ssh-copy-id -p 2222 user@server
```

## Fail2ban pour bloquer les attaques

### Installation

```bash
apt install fail2ban
```

### Configuration pour SSH

Créez `/etc/fail2ban/jail.local` :

```ini
[sshd]
enabled = true
port = 2222
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600
```

## Authentification à deux facteurs (2FA)

### Installation de Google Authenticator

```bash
apt install libpam-google-authenticator
```

### Configuration

1. Exécutez pour chaque utilisateur :
```bash
google-authenticator
```

2. Modifiez `/etc/pam.d/sshd` :
```
auth required pam_google_authenticator.so
```

3. Dans `/etc/ssh/sshd_config` :
```
ChallengeResponseAuthentication yes
```

## Firewall avec UFW

```bash
# Installer UFW
apt install ufw

# Autoriser le nouveau port SSH
ufw allow 2222/tcp

# Activer le firewall
ufw enable
```

## Surveillance et alertes

### Logwatch pour les rapports quotidiens

```bash
apt install logwatch
logwatch --detail high --mailto admin@example.com --service sshd
```

### Monitoring des connexions

```bash
# Voir les connexions actives
ss -tnp | grep :2222

# Historique des connexions
last -a

# Tentatives échouées
grep "Failed password" /var/log/auth.log
```

## Bonnes pratiques supplémentaires

1. **Limitez les utilisateurs SSH** :
   ```
   AllowUsers user1 user2
   ```

2. **Timeout de session** :
   ```
   ClientAliveInterval 300
   ClientAliveCountMax 2
   ```

3. **Utilisez SSH bastion** pour les environnements critiques

4. **Auditez régulièrement** :
   ```bash
   # Vérifier la configuration SSH
   sshd -t
   
   # Scanner les vulnérabilités
   ssh-audit localhost
   ```

## Résolution de problèmes

### Bloqué par Fail2ban

```bash
# Débannir une IP
fail2ban-client set sshd unbanip 192.168.1.100
```

### Clé SSH refusée

```bash
# Vérifier les permissions
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

---

*La sécurité est un processus continu. Restez informé des dernières menaces et mettez à jour régulièrement vos systèmes.*