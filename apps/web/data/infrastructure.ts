// /workspaces/website/apps/web/data/infrastructure.ts
// Description: Infrastructure data reflecting real Hackboot capabilities
// Last modified: 2025-08-27
// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

export const infrastructureData = {
  // Overview stats
  stats: [
    { 
      value: '99.97%', 
      key: 'uptime',
      label: 'Uptime Réel 2024'
    },
    { 
      value: '< 15ms', 
      key: 'latency',
      label: 'Latence EU'
    },
    { 
      value: '2,500', 
      key: 'vcpus',
      label: 'vCPUs AMD EPYC'
    },
    { 
      value: '48', 
      key: 'gpus',
      label: 'GPU Disponibles'
    }
  ],

  // Investment & capacity
  capacity: {
    investment: '> 3M€',
    compute: '2,500 vCPUs',
    ram: '8 TB DDR4 ECC',
    storage: '1.5 PB NVMe',
    network: '400 Gbps',
    utilization: {
      compute: 65,
      storage: 45,
      network: 30,
      gpu: 80
    }
  },
  
  // Datacenter regions
  regions: [
    {
      name: 'Paris',
      code: 'PAR1',
      status: 'operational',
      capacity: '600 vCPUs',
      gpus: '8x A100, 4x RTX 4090',
      peering: 'France-IX (100G)',
      features: ['GPU A100 40GB', '100 Gbps Network', 'S3 Storage Ready'],
      coordinates: { lat: 48.8566, lng: 2.3522 }
    },
    {
      name: 'Frankfurt',
      code: 'FRA1',
      status: 'operational',
      capacity: '800 vCPUs',
      gpus: '6x T4, 6x RTX 4090',
      peering: 'DE-CIX (100G)',
      features: ['Largest Capacity', 'Multi GPU Types', 'Low Latency EU'],
      coordinates: { lat: 50.1109, lng: 8.6821 }
    },
    {
      name: 'Amsterdam',
      code: 'AMS1',
      status: 'operational',
      capacity: '600 vCPUs',
      gpus: '4x RTX 4090, 4x T4',
      peering: 'AMS-IX (100G)',
      features: ['RTX 4090 Available', 'Best Peering', 'Central EU'],
      coordinates: { lat: 52.3676, lng: 4.9041 }
    },
    {
      name: 'Londres',
      code: 'LON1',
      status: 'maintenance',
      capacity: '300 vCPUs',
      gpus: '4x T4',
      peering: 'LINX (40G)',
      features: ['T4 GPUs', 'UK Coverage', 'Upgrade Soon'],
      coordinates: { lat: 51.5074, lng: -0.1278 }
    },
    {
      name: 'Madrid',
      code: 'MAD1',
      status: 'coming-soon',
      capacity: '400 vCPUs',
      gpus: '4x A100 (planned)',
      peering: 'ESPANIX',
      features: ['Q2 2025', 'A100 GPUs', 'South EU'],
      coordinates: { lat: 40.4168, lng: -3.7038 }
    },
    {
      name: 'Milan',
      code: 'MIL1',
      status: 'coming-soon',
      capacity: '400 vCPUs',
      gpus: '8x RTX 4090 (planned)',
      peering: 'MIX',
      features: ['Q3 2025', 'RTX 4090 Focus', 'Italy Coverage'],
      coordinates: { lat: 45.4642, lng: 9.1900 }
    }
  ],
  
  // Network infrastructure
  network: {
    totalCapacity: '400 Gbps',
    burstCapacity: '1 Tbps',
    transitProviders: ['Cogent', 'Telia', 'Level3'],
    peering: '150+ networks',
    cdn: 'Fastly Partnership',
    
    ddosProtection: [
      { 
        tier: 'Standard', 
        capacity: '100 Gbps', 
        mitigation: 'Automatique',
        provider: 'Path.net',
        sla: '< 10s mitigation'
      },
      { 
        tier: 'Business', 
        capacity: '500 Gbps', 
        mitigation: 'Auto + Custom rules',
        provider: 'Voxility',
        sla: '< 3s mitigation'
      },
      { 
        tier: 'Enterprise', 
        capacity: '1 Tbps+', 
        mitigation: 'Dedicated SOC',
        provider: 'Multi-layer',
        sla: 'Real-time mitigation'
      }
    ],
    
    peeringPoints: [
      { name: 'AMS-IX', location: 'Amsterdam', status: 'connected', capacity: '100 Gbps' },
      { name: 'DE-CIX', location: 'Frankfurt', status: 'connected', capacity: '100 Gbps' },
      { name: 'France-IX', location: 'Paris', status: 'connected', capacity: '100 Gbps' },
      { name: 'LINX', location: 'London', status: 'connected', capacity: '40 Gbps' },
      { name: 'ESPANIX', location: 'Madrid', status: 'planned', capacity: '40 Gbps' },
      { name: 'MIX', location: 'Milan', status: 'planned', capacity: '40 Gbps' }
    ]
  },
  
  // Compute specifications
  compute: {
    servers: {
      vpsHosts: {
        model: '2x AMD EPYC 7543',
        cores: '32 cores @ 3.7GHz',
        ram: '512 GB DDR4-3200 ECC',
        storage: '8x 3.84TB NVMe RAID 10',
        network: '2x 25GbE LACP',
        density: '50-60 VPS/host'
      },
      gpuHosts: {
        model: '2x AMD EPYC 7443',
        cores: '24 cores',
        ram: '256-768 GB DDR4 ECC',
        gpuSlots: '4x or 8x per server',
        network: '100GbE (A100) / 25GbE (T4/RTX)',
        cooling: 'Direct liquid cooling'
      }
    },
    
    virtualization: {
      hypervisor: 'KVM/QEMU',
      features: [
        'CPU Pinning - Dedicated threads',
        'NUMA Optimized topology',
        'SR-IOV Network acceleration',
        'GPU Passthrough - Native perf',
        'Live migration support'
      ]
    },
    
    gpuInventory: [
      { 
        model: 'Tesla T4',
        count: 20,
        vram: '16 GB GDDR6',
        tflops: '65 FP16',
        distribution: 'FRA: 6, AMS: 4, LON: 4, PAR: 6'
      },
      { 
        model: 'RTX 4090',
        count: 20,
        vram: '24 GB GDDR6X',
        tflops: '165 FP16',
        distribution: 'PAR: 4, FRA: 6, AMS: 4, MIL: 6 (soon)'
      },
      { 
        model: 'A100 40GB',
        count: 8,
        vram: '40 GB HBM2',
        tflops: '312 FP16',
        distribution: 'PAR: 8, MAD: 4 (soon)'
      }
    ]
  },
  
  // Storage infrastructure
  storage: {
    local: {
      type: 'NVMe Gen4',
      models: ['Samsung PM9A3', 'Intel P5800X'],
      performance: {
        read: '7 GB/s',
        write: '5 GB/s',
        iops: '1M+ 4K random',
        latency: '< 100μs P99'
      },
      endurance: '3 DWPD minimum'
    },
    
    distributed: {
      technology: 'Ceph',
      capacity: '500 TB usable',
      replication: '3x',
      performance: '50K IOPS aggregate',
      useCases: ['Snapshots', 'Backups', 'Object Storage']
    },
    
    backup: {
      method: 'ZFS incremental snapshots',
      frequency: 'Every 6 hours',
      retention: '7 days local, 30 days remote',
      rpo: '< 6 hours',
      rto: '< 1 hour'
    }
  },
  
  // Security & compliance
  security: {
    certifications: [
      { name: 'SOC 2 Type I', status: 'obtained', icon: '✅' },
      { name: 'ISO 27001', status: 'in-progress', target: 'Q2 2025', icon: '🚧' },
      { name: 'RGPD/GDPR', status: 'compliant', icon: '✅' },
      { name: 'PCI-DSS', status: 'ready', icon: '✅' }
    ],
    
    physical: [
      'Biometric access control',
      '24/7 CCTV surveillance',
      'Locked private cabinets',
      '90-day audit logs'
    ],
    
    network: [
      'Stateful DPI firewalls',
      'VLAN/VXLAN isolation',
      'Active IDS/IPS',
      '30-day flow logs'
    ],
    
    encryption: {
      atRest: 'AES-256 (LUKS)',
      inTransit: 'TLS 1.3+',
      keyManagement: 'HSM secured',
      compliance: 'PCI-DSS ready'
    }
  },
  
  // SLA & reliability
  reliability: {
    sla: [
      { 
        tier: 'Standard',
        products: 'Nano-Performance',
        uptime: '99.9%',
        mttr: '< 4 hours',
        support: 'Business hours',
        credits: '10x downtime'
      },
      { 
        tier: 'Business',
        products: 'Business-Elite',
        uptime: '99.95%',
        mttr: '< 2 hours',
        support: '24/7',
        credits: '25x downtime'
      },
      { 
        tier: 'Enterprise',
        products: 'Titanium-Quantum',
        uptime: '99.99%',
        mttr: '< 30 minutes',
        support: 'Dedicated team',
        credits: '50x downtime'
      }
    ],
    
    redundancy: {
      power: 'N+1 UPS + Generators',
      network: 'N+N dual path',
      cooling: 'N+1 with failover',
      storage: 'RAID + Ceph 3x'
    },
    
    metrics2024: {
      actualUptime: '99.97%',
      incidents: '2 major (47 min total)',
      avgLatency: '0.8ms intra-DC',
      packetLoss: '< 0.01%'
    }
  },
  
  // Technical stack
  stack: {
    orchestration: [
      { name: 'OpenStack', role: 'Compute orchestration' },
      { name: 'Ceph', role: 'Distributed storage' },
      { name: 'Ansible', role: 'Configuration management' },
      { name: 'Kubernetes', role: 'Container orchestration (soon)' }
    ],
    
    monitoring: [
      { name: 'Prometheus', role: 'Metrics collection' },
      { name: 'Grafana', role: 'Visualization' },
      { name: 'ELK Stack', role: 'Log aggregation' },
      { name: 'Zabbix', role: 'Infrastructure monitoring' }
    ],
    
    automation: {
      api: 'REST v1 (v2 in dev)',
      graphql: 'Beta Q2 2025',
      terraform: 'Provider coming',
      cli: 'Python-based OSS',
      webhooks: 'Real-time events'
    }
  },
  
  // Product capacity mapping
  productCapacity: [
    { product: 'VPS-NANO', maxInstances: 400, perHost: 60 },
    { product: 'VPS-STARTER', maxInstances: 250, perHost: 30 },
    { product: 'VPS-PERFORMANCE', maxInstances: 150, perHost: 15 },
    { product: 'VPS-BUSINESS', maxInstances: 80, perHost: 8 },
    { product: 'VPS-ENTERPRISE', maxInstances: 40, perHost: 4 },
    { product: 'GPU-T4', maxInstances: 20, available: 16 },
    { product: 'GPU-RTX4090', maxInstances: 20, available: 14 },
    { product: 'GPU-A100', maxInstances: 8, available: 6 }
  ],
  
  // Roadmap 2025
  roadmap: {
    q1: [
      { item: 'Network upgrade Paris 100G', status: 'completed' },
      { item: 'New A100 GPUs deployment', status: 'completed' },
      { item: 'API v2 development', status: 'in-progress' }
    ],
    q2: [
      { item: 'Madrid datacenter launch', status: 'planned' },
      { item: 'Object Storage S3 (MinIO)', status: 'planned' },
      { item: 'Terraform provider', status: 'planned' }
    ],
    q3: [
      { item: 'Milan datacenter launch', status: 'planned' },
      { item: 'Kubernetes managed service', status: 'planned' },
      { item: 'ISO 27001 certification', status: 'planned' }
    ],
    q4: [
      { item: 'Multi-region replication', status: 'planned' },
      { item: 'Edge computing (CDN)', status: 'planned' },
      { item: 'Quantum-safe cryptography', status: 'planned' }
    ]
  }
};