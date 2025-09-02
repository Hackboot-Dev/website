---
category: GPU Cloud
---

# Démarrage avec GPU Cloud

**Lancez vos workloads d'IA et de machine learning sur nos GPUs haute performance en quelques minutes.**

## GPUs Disponibles

### NVIDIA RTX 4090
- 24GB VRAM GDDR6X
- 16,384 CUDA Cores
- Idéal pour : Fine-tuning de modèles, inférence rapide
- Tarif : 1.20€/heure

### NVIDIA A100
- 40GB ou 80GB HBM2e
- Tensor Cores 3ème génération
- Idéal pour : Training de large modèles, HPC
- Tarif : 2.50€/heure

### NVIDIA Tesla T4
- 16GB GDDR6
- Optimisé pour l'inférence
- Idéal pour : Inférence en production, transcoding vidéo
- Tarif : 0.45€/heure

## Démarrage Rapide

### 1. Créer une instance GPU

```bash
# Via CLI
vmcloud gpu create \
  --type rtx4090 \
  --image ubuntu-cuda \
  --name my-ai-workload
```

### 2. Connexion SSH

```bash
ssh ubuntu@gpu-instance-ip
```

### 3. Vérifier CUDA

```bash
nvidia-smi
```

## Images Pré-configurées

- **Ubuntu + CUDA** : CUDA 12.2, cuDNN 8.9
- **PyTorch** : PyTorch 2.0, CUDA 11.8
- **TensorFlow** : TensorFlow 2.13, CUDA 11.8
- **Stable Diffusion** : WebUI pré-installée

## Cas d'Usage

### Machine Learning
- Training de modèles
- Fine-tuning de LLMs
- Computer Vision
- NLP

### Rendering 3D
- Blender
- Cinema 4D
- Octane Render

### Gaming
- Cloud gaming
- Game development
- Testing

## Bonnes Pratiques

1. **Monitoring** : Utilisez `nvidia-smi` pour surveiller l'utilisation
2. **Stockage** : Attachez un volume NVMe pour les datasets
3. **Snapshots** : Sauvegardez vos modèles entraînés
4. **Scaling** : Utilisez notre API pour auto-scaler

---

*Besoin de plus de puissance ? Contactez-nous pour des clusters GPU personnalisés.*