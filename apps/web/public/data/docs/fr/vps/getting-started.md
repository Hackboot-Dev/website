---
title: Démarrer avec les VPS
description: Guide complet pour déployer et gérer votre Serveur Privé Virtuel
order: 1
tags: ["vps", "serveur", "déploiement", "démarrage"]
---

# Démarrer avec VMCloud VPS

Déployez des Serveurs Privés Virtuels puissants en quelques secondes avec un accès root complet et des ressources dédiées.

## Déploiement Rapide

### 1. Choisir Votre Configuration

Sélectionnez parmi nos plans VPS préconfigurés ou personnalisez le vôtre :

```bash
# Voir les plans disponibles
vmcloud vps list-plans

# Exemple de sortie :
# STARTER   - 2 vCPU, 4GB RAM, 80GB SSD   - 15€/mois
# STANDARD  - 4 vCPU, 8GB RAM, 160GB SSD  - 30€/mois
# PREMIUM   - 8 vCPU, 16GB RAM, 320GB SSD - 60€/mois
```

### 2. Déployer Votre VPS

```bash
# Déployer un nouveau VPS
vmcloud vps create \
  --name mon-serveur \
  --plan standard \
  --os ubuntu-22.04 \
  --region eu-west-1 \
  --ssh-key ~/.ssh/id_rsa.pub
```

### 3. Se Connecter à Votre Serveur

```bash
# Obtenir les détails du serveur
vmcloud vps info mon-serveur

# SSH dans votre serveur
ssh root@<ip-serveur>
```

## Systèmes d'Exploitation

Choisissez parmi une variété de systèmes d'exploitation :

| OS | Versions Disponibles | Utilisateur Par Défaut |
|----|---------------------|------------------------|
| **Ubuntu** | 20.04 LTS, 22.04 LTS, 23.10 | ubuntu |
| **Debian** | 11, 12 | debian |
| **CentOS** | Stream 8, Stream 9 | centos |
| **Rocky Linux** | 8, 9 | rocky |
| **AlmaLinux** | 8, 9 | almalinux |
| **Fedora** | 38, 39 | fedora |

## Configuration Réseau

### IPv4 et IPv6

Toutes les instances VPS incluent :
- 1 adresse IPv4 dédiée
- Sous-réseau IPv6 /64
- Connectivité réseau 10 Gbps
- Protection DDoS incluse

### Configuration du Pare-feu

```bash
# Activer le pare-feu UFW
sudo ufw enable

# Autoriser SSH
sudo ufw allow 22/tcp

# Autoriser HTTP et HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Vérifier le statut
sudo ufw status
```

## Gestion du Stockage

### Étendre le Stockage

```bash
# Ajouter du stockage bloc supplémentaire
vmcloud storage attach \
  --server mon-serveur \
  --size 100GB \
  --type ssd

# Monter le nouveau volume
sudo mkfs.ext4 /dev/vdb
sudo mount /dev/vdb /mnt/data
```

### Sauvegardes Automatisées

Activez les sauvegardes automatisées pour votre tranquillité d'esprit :

```bash
# Activer les sauvegardes quotidiennes
vmcloud vps backup enable mon-serveur \
  --frequency daily \
  --retention 7

# Créer un snapshot manuel
vmcloud vps snapshot create mon-serveur \
  --name snapshot-avant-maj
```

## Surveillance des Performances

### Métriques Intégrées

Surveillez les performances de votre VPS via notre tableau de bord :
- Utilisation CPU
- Usage mémoire
- I/O disque
- Trafic réseau
- Surveillance des processus

### Surveillance Personnalisée

```bash
# Installer l'agent de surveillance
curl -sSL https://vmcloud.com/install-monitor.sh | sudo bash

# Voir les métriques en temps réel
vmcloud vps metrics mon-serveur --live
```

## Meilleures Pratiques de Sécurité

### Configuration Initiale

1. **Mettre à jour le système**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Créer un utilisateur non-root**
   ```bash
   sudo adduser deploy
   sudo usermod -aG sudo deploy
   ```

3. **Configurer SSH**
   ```bash
   # Désactiver la connexion root
   sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
   
   # Changer le port SSH
   sudo sed -i 's/#Port 22/Port 2222/' /etc/ssh/sshd_config
   
   # Redémarrer SSH
   sudo systemctl restart sshd
   ```

4. **Installer Fail2ban**
   ```bash
   sudo apt install fail2ban -y
   sudo systemctl enable fail2ban
   ```

## Déploiement d'Applications

### Configuration Serveur Web

#### Nginx
```bash
# Installer Nginx
sudo apt install nginx -y

# Configurer l'hôte virtuel
sudo nano /etc/nginx/sites-available/monapp

# Activer le site
sudo ln -s /etc/nginx/sites-available/monapp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### Docker
```bash
# Installer Docker
curl -fsSL https://get.docker.com | sudo bash

# Lancer votre application
docker run -d -p 80:80 monapp:latest
```

## Mise à l'Échelle de Votre Infrastructure

### Mise à l'Échelle Verticale
Augmentez les ressources de votre VPS sans temps d'arrêt :

```bash
# Passer à un plan supérieur
vmcloud vps resize mon-serveur --plan premium
```

### Mise à l'Échelle Horizontale
Déployez plusieurs instances VPS avec équilibrage de charge :

```bash
# Créer plusieurs serveurs
for i in {1..3}; do
  vmcloud vps create --name web-$i --plan standard
done

# Configurer l'équilibreur de charge
vmcloud lb create --name mon-lb \
  --backends web-1,web-2,web-3 \
  --algorithm round-robin
```

## Dépannage

### Problèmes Courants

#### Utilisation CPU Élevée
```bash
# Vérifier les processus principaux
top -b -n 1 | head -20

# Trouver les processus gourmands en CPU
ps aux | sort -nrk 3,3 | head -10
```

#### Mémoire Insuffisante
```bash
# Vérifier l'utilisation mémoire
free -h

# Trouver les processus gourmands en mémoire
ps aux | sort -nrk 4,4 | head -10
```

#### Problèmes d'Espace Disque
```bash
# Vérifier l'utilisation disque
df -h

# Trouver les gros fichiers
find / -type f -size +100M -exec ls -lh {} \;
```

## Prochaines Étapes

- [Configurer les Paramètres DNS →](./dns-configuration.md)
- [Installer les Certificats SSL →](./ssl-setup.md)
- [Implémenter un Pipeline CI/CD →](./cicd-integration.md)
- [Durcissement de Sécurité Avancé →](./security-hardening.md)