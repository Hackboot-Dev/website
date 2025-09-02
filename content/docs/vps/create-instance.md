---
title: Create a VPS Instance
description: Step-by-step guide to create and configure a VPS instance
order: 1
readTime: 7
tags: [vps, deployment, tutorial]
lastUpdated: 2025-08-29
---

# Create a VPS Instance

This guide walks you through creating a VPS instance on VMCloud.

## Prerequisites

- Active VMCloud account
- Valid payment method configured
- SSH key (optional but recommended)

## Step 1: Choose Your Configuration

### Available Plans

| Plan | vCPU | RAM | Storage | Price |
|------|------|-----|---------|-------|
| Starter | 1 | 2GB | 25GB SSD | €5/mo |
| Standard | 2 | 4GB | 50GB SSD | €10/mo |
| Performance | 4 | 8GB | 100GB SSD | €20/mo |
| Enterprise | 8 | 16GB | 200GB SSD | €40/mo |

## Step 2: Select Operating System

Supported OS:
- Ubuntu 20.04 / 22.04 / 24.04
- Debian 11 / 12
- CentOS 8 / 9
- Rocky Linux 8 / 9
- AlmaLinux 8 / 9
- Windows Server 2019 / 2022

## Step 3: Configure Network

### IPv4 Configuration
```yaml
network:
  ipv4:
    enabled: true
    addresses:
      - public: auto
    firewall:
      - allow: 22/tcp   # SSH
      - allow: 80/tcp   # HTTP
      - allow: 443/tcp  # HTTPS
```

### IPv6 Configuration (Optional)
```yaml
network:
  ipv6:
    enabled: true
    addresses:
      - prefix: /64
```

## Step 4: Add SSH Keys

```bash
# Generate SSH key if you don't have one
ssh-keygen -t ed25519 -C "your-email@example.com"

# Add your public key during instance creation
cat ~/.ssh/id_ed25519.pub
```

## Step 5: Advanced Options

### User Data (Cloud-Init)
```yaml
#cloud-config
users:
  - name: admin
    groups: sudo
    shell: /bin/bash
    sudo: ['ALL=(ALL) NOPASSWD:ALL']
    ssh_authorized_keys:
      - ssh-ed25519 AAAAC3NzaC1... user@example.com

packages:
  - docker.io
  - nginx
  - git

runcmd:
  - systemctl enable docker
  - systemctl start docker
```

### Startup Script
```bash
#!/bin/bash
# Update system
apt-get update && apt-get upgrade -y

# Install essential tools
apt-get install -y \
  curl \
  wget \
  vim \
  htop \
  git

# Configure firewall
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
```

## Step 6: Deploy

### Via CLI
```bash
vmcloud vps create \
  --name production-server \
  --plan performance \
  --os ubuntu-22.04 \
  --region paris \
  --ssh-key ~/.ssh/id_ed25519.pub \
  --user-data cloud-init.yaml
```

### Via API
```javascript
const response = await fetch('https://api.vmcloud.com/v1/vps', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'production-server',
    plan: 'performance',
    os: 'ubuntu-22.04',
    region: 'paris',
    ssh_keys: ['ssh-ed25519 AAAAC3...']
  })
});
```

## Post-Deployment

### Connect to Your Instance
```bash
# Via SSH
ssh root@your-instance-ip

# Via Web Console
vmcloud console production-server
```

### Initial Setup Checklist
- [ ] Update system packages
- [ ] Configure firewall rules
- [ ] Set up non-root user
- [ ] Disable root SSH login
- [ ] Configure automatic updates
- [ ] Set up monitoring
- [ ] Enable backups

## Troubleshooting

### Connection Issues
```bash
# Check instance status
vmcloud vps status production-server

# View console output
vmcloud vps console-output production-server

# Reboot if needed
vmcloud vps reboot production-server
```

### Performance Issues
- Check resource usage: `htop` or `top`
- Monitor disk I/O: `iostat -x 1`
- Check network: `iftop` or `nethogs`

## Related Documentation

- [SSH Configuration Guide](/docs/vps/ssh-setup)
- [Security Best Practices](/docs/vps/security)
- [Backup Strategies](/docs/vps/backups)
- [Monitoring Setup](/docs/vps/monitoring)