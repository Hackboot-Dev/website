---
title: Getting Started with VPS
description: Complete guide to deploy and manage your Virtual Private Server
order: 1
tags: ["vps", "server", "deployment", "getting-started"]
---

# Getting Started with VMCloud VPS

Deploy powerful Virtual Private Servers in seconds with full root access and dedicated resources.

## Quick Deployment

### 1. Choose Your Configuration

Select from our pre-configured VPS plans or customize your own:

```bash
# View available plans
vmcloud vps list-plans

# Example output:
# STARTER   - 2 vCPU, 4GB RAM, 80GB SSD   - $15/month
# STANDARD  - 4 vCPU, 8GB RAM, 160GB SSD  - $30/month
# PREMIUM   - 8 vCPU, 16GB RAM, 320GB SSD - $60/month
```

### 2. Deploy Your VPS

```bash
# Deploy a new VPS
vmcloud vps create \
  --name my-server \
  --plan standard \
  --os ubuntu-22.04 \
  --region us-east-1 \
  --ssh-key ~/.ssh/id_rsa.pub
```

### 3. Connect to Your Server

```bash
# Get server details
vmcloud vps info my-server

# SSH into your server
ssh root@<server-ip>
```

## Operating Systems

Choose from a variety of operating systems:

| OS | Versions Available | Default User |
|----|-------------------|--------------|
| **Ubuntu** | 20.04 LTS, 22.04 LTS, 23.10 | ubuntu |
| **Debian** | 11, 12 | debian |
| **CentOS** | Stream 8, Stream 9 | centos |
| **Rocky Linux** | 8, 9 | rocky |
| **AlmaLinux** | 8, 9 | almalinux |
| **Fedora** | 38, 39 | fedora |

## Network Configuration

### IPv4 and IPv6

All VPS instances come with:
- 1 dedicated IPv4 address
- /64 IPv6 subnet
- 10 Gbps network connectivity
- DDoS protection included

### Firewall Setup

```bash
# Enable UFW firewall
sudo ufw enable

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Check status
sudo ufw status
```

## Storage Management

### Expand Storage

```bash
# Add additional block storage
vmcloud storage attach \
  --server my-server \
  --size 100GB \
  --type ssd

# Mount the new volume
sudo mkfs.ext4 /dev/vdb
sudo mount /dev/vdb /mnt/data
```

### Automated Backups

Enable automated backups for peace of mind:

```bash
# Enable daily backups
vmcloud vps backup enable my-server \
  --frequency daily \
  --retention 7

# Create manual snapshot
vmcloud vps snapshot create my-server \
  --name pre-update-snapshot
```

## Performance Monitoring

### Built-in Metrics

Monitor your VPS performance through our dashboard:
- CPU utilization
- Memory usage
- Disk I/O
- Network traffic
- Process monitoring

### Custom Monitoring

```bash
# Install monitoring agent
curl -sSL https://vmcloud.com/install-monitor.sh | sudo bash

# View real-time metrics
vmcloud vps metrics my-server --live
```

## Security Best Practices

### Initial Setup

1. **Update the system**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Create non-root user**
   ```bash
   sudo adduser deploy
   sudo usermod -aG sudo deploy
   ```

3. **Configure SSH**
   ```bash
   # Disable root login
   sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
   
   # Change SSH port
   sudo sed -i 's/#Port 22/Port 2222/' /etc/ssh/sshd_config
   
   # Restart SSH
   sudo systemctl restart sshd
   ```

4. **Install Fail2ban**
   ```bash
   sudo apt install fail2ban -y
   sudo systemctl enable fail2ban
   ```

## Application Deployment

### Web Server Setup

#### Nginx
```bash
# Install Nginx
sudo apt install nginx -y

# Configure virtual host
sudo nano /etc/nginx/sites-available/myapp

# Enable site
sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### Docker
```bash
# Install Docker
curl -fsSL https://get.docker.com | sudo bash

# Run your application
docker run -d -p 80:80 myapp:latest
```

## Scaling Your Infrastructure

### Vertical Scaling
Upgrade your VPS resources without downtime:

```bash
# Upgrade to a larger plan
vmcloud vps resize my-server --plan premium
```

### Horizontal Scaling
Deploy multiple VPS instances with load balancing:

```bash
# Create multiple servers
for i in {1..3}; do
  vmcloud vps create --name web-$i --plan standard
done

# Setup load balancer
vmcloud lb create --name my-lb \
  --backends web-1,web-2,web-3 \
  --algorithm round-robin
```

## Troubleshooting

### Common Issues

#### High CPU Usage
```bash
# Check top processes
top -b -n 1 | head -20

# Find CPU-intensive processes
ps aux | sort -nrk 3,3 | head -10
```

#### Out of Memory
```bash
# Check memory usage
free -h

# Find memory-intensive processes
ps aux | sort -nrk 4,4 | head -10
```

#### Disk Space Issues
```bash
# Check disk usage
df -h

# Find large files
find / -type f -size +100M -exec ls -lh {} \;
```

## Next Steps

- [Configure DNS Settings →](./dns-configuration.md)
- [Setup SSL Certificates →](./ssl-setup.md)
- [Implement CI/CD Pipeline →](./cicd-integration.md)
- [Advanced Security Hardening →](./security-hardening.md)