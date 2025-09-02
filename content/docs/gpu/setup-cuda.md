---
title: CUDA Setup Guide
description: Complete guide to setup CUDA and GPU drivers on VMCloud GPU instances
order: 1
readTime: 10
tags: [gpu, cuda, nvidia, ml, ai]
lastUpdated: 2025-08-29
---

# CUDA Setup on GPU Instances

This guide covers setting up CUDA and NVIDIA drivers on VMCloud GPU instances for machine learning and compute workloads.

## Available GPU Instances

| Instance | GPU Model | VRAM | CUDA Cores | Price/hour |
|----------|-----------|------|------------|------------|
| GPU-A100 | NVIDIA A100 | 80GB | 6912 | €3.50 |
| GPU-A6000 | RTX A6000 | 48GB | 10752 | €2.20 |
| GPU-4090 | RTX 4090 | 24GB | 16384 | €1.50 |
| GPU-4080 | RTX 4080 | 16GB | 9728 | €1.00 |

## Step 1: Check GPU Availability

```bash
# Verify GPU is detected
lspci | grep -i nvidia

# Expected output:
# 00:04.0 3D controller: NVIDIA Corporation GA100 [A100 PCIe 80GB]
```

## Step 2: Install NVIDIA Drivers

### Ubuntu/Debian
```bash
# Update package list
sudo apt update

# Install build essentials
sudo apt install -y build-essential linux-headers-$(uname -r)

# Add NVIDIA repository
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add -
curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | \
  sudo tee /etc/apt/sources.list.d/nvidia-docker.list

# Install NVIDIA driver
sudo apt update
sudo apt install -y nvidia-driver-535

# Reboot
sudo reboot
```

### Verify Installation
```bash
# Check driver version
nvidia-smi

# Expected output shows GPU info and driver version
```

## Step 3: Install CUDA Toolkit

### CUDA 12.3 Installation
```bash
# Download CUDA installer
wget https://developer.download.nvidia.com/compute/cuda/12.3.0/local_installers/cuda_12.3.0_545.23.06_linux.run

# Run installer
sudo sh cuda_12.3.0_545.23.06_linux.run

# Follow prompts:
# - Accept license
# - Select CUDA Toolkit only (driver already installed)
# - Keep default installation path
```

### Environment Setup
```bash
# Add to ~/.bashrc
echo 'export PATH=/usr/local/cuda-12.3/bin:$PATH' >> ~/.bashrc
echo 'export LD_LIBRARY_PATH=/usr/local/cuda-12.3/lib64:$LD_LIBRARY_PATH' >> ~/.bashrc

# Reload bashrc
source ~/.bashrc

# Verify CUDA installation
nvcc --version
```

## Step 4: Install cuDNN

```bash
# Download cuDNN (requires NVIDIA account)
# Visit: https://developer.nvidia.com/cudnn

# Extract and install
tar -xvf cudnn-linux-x86_64-8.9.7.29_cuda12-archive.tar.xz
sudo cp cudnn-*-archive/include/cudnn*.h /usr/local/cuda/include
sudo cp cudnn-*-archive/lib/libcudnn* /usr/local/cuda/lib64
sudo chmod a+r /usr/local/cuda/include/cudnn*.h /usr/local/cuda/lib64/libcudnn*
```

## Step 5: Python Environment Setup

### PyTorch Installation
```bash
# Create virtual environment
python3 -m venv ml-env
source ml-env/bin/activate

# Install PyTorch with CUDA support
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121

# Verify GPU is accessible
python -c "import torch; print(torch.cuda.is_available())"
```

### TensorFlow Installation
```bash
# Install TensorFlow with GPU support
pip install tensorflow[and-cuda]

# Verify GPU detection
python -c "import tensorflow as tf; print(tf.config.list_physical_devices('GPU'))"
```

## Step 6: Docker with GPU Support

### Install NVIDIA Container Toolkit
```bash
# Install nvidia-container-toolkit
sudo apt-get update
sudo apt-get install -y nvidia-container-toolkit

# Configure Docker
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker

# Test GPU in Docker
docker run --rm --gpus all nvidia/cuda:12.3.0-base-ubuntu22.04 nvidia-smi
```

### Docker Compose Example
```yaml
version: '3.8'
services:
  ml-workspace:
    image: pytorch/pytorch:latest
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
    volumes:
      - ./workspace:/workspace
    command: python train.py
```

## Performance Optimization

### Multi-GPU Setup
```python
import torch
import torch.nn as nn
import torch.distributed as dist

# Initialize distributed training
dist.init_process_group(backend='nccl')

# Create model and wrap with DataParallel
model = YourModel()
if torch.cuda.device_count() > 1:
    model = nn.DataParallel(model)
model = model.cuda()
```

### Memory Management
```python
# Clear cache when needed
torch.cuda.empty_cache()

# Set memory fraction
torch.cuda.set_per_process_memory_fraction(0.8)

# Enable mixed precision training
from torch.cuda.amp import autocast, GradScaler

scaler = GradScaler()
with autocast():
    output = model(input)
    loss = criterion(output, target)
```

## Monitoring GPU Usage

### Real-time Monitoring
```bash
# Watch GPU usage
watch -n 1 nvidia-smi

# Detailed monitoring with nvtop
sudo apt install nvtop
nvtop
```

### Python Monitoring
```python
import GPUtil
import psutil

# Get GPU info
gpus = GPUtil.getGPUs()
for gpu in gpus:
    print(f"GPU: {gpu.name}")
    print(f"Memory: {gpu.memoryUsed}/{gpu.memoryTotal} MB")
    print(f"Utilization: {gpu.load*100}%")
    print(f"Temperature: {gpu.temperature}°C")
```

## Troubleshooting

### Common Issues

#### CUDA Out of Memory
```python
# Reduce batch size
batch_size = 16  # Instead of 32

# Use gradient accumulation
accumulation_steps = 4
for i, batch in enumerate(dataloader):
    loss = model(batch) / accumulation_steps
    loss.backward()
    if (i + 1) % accumulation_steps == 0:
        optimizer.step()
        optimizer.zero_grad()
```

#### Driver Mismatch
```bash
# Check compatibility
nvidia-smi
cat /proc/driver/nvidia/version

# Reinstall matching versions
sudo apt-get purge nvidia-*
sudo apt-get autoremove
# Then reinstall correct driver version
```

## Best Practices

1. **Always use virtual environments** for Python projects
2. **Monitor GPU temperature** to prevent thermal throttling
3. **Use mixed precision** training for better performance
4. **Implement checkpointing** for long training runs
5. **Clean up GPU memory** after experiments

## Related Documentation

- [ML Framework Setup](/docs/gpu/ml-frameworks)
- [Distributed Training](/docs/gpu/distributed-training)
- [GPU Benchmarks](/docs/gpu/benchmarks)
- [Cost Optimization](/docs/gpu/cost-optimization)