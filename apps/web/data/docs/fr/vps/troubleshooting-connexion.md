# Résolution des problèmes de connexion

**Guide complet pour diagnostiquer et résoudre les problèmes de connexion à vos machines virtuelles.**

## Problèmes fréquents

### 1. Connection refused

Cette erreur survient généralement quand :
- Le service SSH n'est pas démarré
- Le port est bloqué par le firewall
- L'adresse IP est incorrecte

**Solution :**
```bash
# Vérifier le statut SSH via la console web
sudo systemctl status ssh
sudo systemctl start ssh

# Vérifier le firewall
sudo ufw status
sudo ufw allow 22/tcp
```

### 2. Permission denied (publickey)

**Causes possibles :**
- Clé SSH non ajoutée au serveur
- Mauvaises permissions sur les fichiers
- Clé privée incorrecte

**Solution :**
```bash
# Vérifier les permissions côté serveur
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys

# Côté client, spécifier la clé
ssh -i ~/.ssh/ma_cle_privee user@ip
```

### 3. Network is unreachable

**Vérifications :**
1. Vérifier l'adresse IP dans votre dashboard
2. Tester la connectivité :
```bash
ping votre-ip
traceroute votre-ip
```
3. Vérifier votre connexion internet locale

### 4. Connection timeout

**Causes fréquentes :**
- VM éteinte ou en cours de redémarrage
- Problème réseau temporaire
- Blocage par votre FAI ou firewall local

**Actions :**
1. Vérifier le statut de la VM dans le dashboard
2. Redémarrer la VM si nécessaire
3. Essayer depuis une autre connexion internet
4. Utiliser un VPN si blocage régional

## Utilisation de la console web

Si SSH ne fonctionne pas, utilisez toujours la console web :

1. Connectez-vous au dashboard
2. Sélectionnez votre VM
3. Cliquez sur "Console"
4. Connectez-vous avec vos identifiants root

## Commandes de diagnostic

### Vérifier la configuration réseau
```bash
# Afficher les interfaces
ip addr show

# Vérifier la passerelle
ip route show

# Tester la connectivité externe
ping 8.8.8.8
```

### Vérifier SSH
```bash
# Status du service
systemctl status sshd

# Logs SSH
journalctl -u ssh -n 50

# Configuration SSH
cat /etc/ssh/sshd_config | grep -E "Port|PermitRoot|PasswordAuth"
```

### Vérifier le firewall
```bash
# UFW (Ubuntu/Debian)
ufw status verbose

# iptables
iptables -L -n

# firewalld (CentOS/RHEL)
firewall-cmd --list-all
```

## Réinitialisation du mot de passe root

Si vous avez perdu l'accès :

1. Utilisez la fonction "Reset Password" dans le dashboard
2. Ou contactez le support avec votre ID de VM

## Bonnes pratiques

1. **Toujours garder un accès de secours** (console web)
2. **Documenter vos changements** de configuration
3. **Tester avant de fermer** votre session SSH actuelle
4. **Sauvegarder vos clés SSH** en lieu sûr
5. **Utiliser des clés SSH** plutôt que des mots de passe

## Besoin d'aide supplémentaire ?

- **Chat en direct** : Disponible 24/7
- **Email** : support@vmcloud.com
- **Base de connaissances** : Plus de guides disponibles
- **Communauté** : Forum d'entraide

---

*Astuce : Gardez ce guide dans vos favoris pour un accès rapide en cas de problème.*