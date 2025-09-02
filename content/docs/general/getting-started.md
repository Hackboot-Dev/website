---
title: Getting Started with VMCloud
description: Quick guide to get you up and running with VMCloud platform
order: 1
readTime: 5
tags: [quickstart, guide, basics]
lastUpdated: 2025-08-29
---

# Getting Started with VMCloud

Welcome to VMCloud! This guide will help you get started with our cloud platform in just a few minutes.

## Create Your Account

1. Visit [vmcloud.com/signup](https://vmcloud.com/signup)
2. Enter your email and create a strong password
3. Verify your email address
4. Complete your profile information

## Choose Your First Service

VMCloud offers various cloud services:

- **VPS**: Perfect for web applications and development
- **GPU Computing**: For AI/ML workloads and rendering
- **Web Hosting**: Managed hosting for websites
- **Storage**: S3-compatible object storage

## Deploy Your First Instance

### VPS Quick Deploy

```bash
# Using VMCloud CLI
vmcloud vps create \
  --name my-first-vps \
  --plan starter \
  --region paris \
  --os ubuntu-22.04
```

### Via Dashboard

1. Navigate to the VPS section
2. Click "Create Instance"
3. Select your configuration
4. Choose your operating system
5. Click "Deploy"

Your instance will be ready in less than 30 seconds!

## Connect to Your Instance

```bash
# SSH into your VPS
ssh root@your-instance-ip

# Or use our web console
vmcloud console my-first-vps
```

## Next Steps

- [Configure SSH Keys](/docs/vps/ssh-setup)
- [Set up a firewall](/docs/vps/security)
- [Enable automatic backups](/docs/vps/backups)
- [Install monitoring](/docs/vps/monitoring)

## Need Help?

- 📧 Email: support@vmcloud.com
- 💬 Live Chat: Available 24/7
- 📚 [Documentation Hub](/docs)
- 🎫 [Create a ticket](/support/tickets)