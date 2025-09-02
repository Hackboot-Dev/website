---
category: Kubernetes
---

# Déploiement Kubernetes

**Apprenez à déployer et gérer un cluster Kubernetes sur notre infrastructure cloud haute performance.**

## Introduction

Kubernetes est la plateforme d'orchestration de conteneurs la plus populaire. Notre infrastructure est optimisée pour exécuter des clusters Kubernetes performants et sécurisés.

## Pré-requis

- Au moins 3 VMs (1 master, 2 workers)
- 4GB RAM minimum par node
- Réseau privé configuré
- Ubuntu 22.04 ou Debian 11

## Installation avec kubeadm

### Sur le master

```bash
# Installer les dépendances
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
echo "deb https://apt.kubernetes.io/ kubernetes-xenial main" > /etc/apt/sources.list.d/kubernetes.list
apt update && apt install -y kubelet kubeadm kubectl

# Initialiser le cluster
kubeadm init --pod-network-cidr=10.244.0.0/16

# Configurer kubectl
mkdir -p $HOME/.kube
cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
```

### Sur les workers

```bash
# Joindre le cluster (utiliser le token du master)
kubeadm join master-ip:6443 --token xxx --discovery-token-ca-cert-hash sha256:xxx
```

## Installation du réseau (Flannel)

```bash
kubectl apply -f https://raw.githubusercontent.com/flannel-io/flannel/master/Documentation/kube-flannel.yml
```

## Déployer une application

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:latest
        ports:
        - containerPort: 80
```

## Monitoring avec Prometheus

```bash
# Installer Helm
curl https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3 | bash

# Ajouter le repo Prometheus
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts

# Installer Prometheus
helm install prometheus prometheus-community/kube-prometheus-stack
```

## Bonnes pratiques

1. **Haute disponibilité** : Utilisez au moins 3 masters
2. **Sécurité** : Activez RBAC et les Network Policies
3. **Stockage** : Utilisez nos volumes persistants SSD
4. **Backup** : Sauvegardez etcd régulièrement
5. **Monitoring** : Surveillez les ressources en continu

## Troubleshooting

### Pods en Pending
```bash
kubectl describe pod <pod-name>
kubectl get events
```

### Problèmes de réseau
```bash
kubectl get pods -n kube-system
kubectl logs -n kube-system <flannel-pod>
```

## Support

Notre équipe est spécialisée dans Kubernetes. N'hésitez pas à nous contacter pour :
- Architecture de cluster
- Optimisation des performances
- Migration d'applications
- Formation Kubernetes