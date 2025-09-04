export const infrastructureData = {
  stats: [
    { key: 'uptime', value: '99.97%', label: 'Uptime réel 2024' },
    { key: 'latency', value: '<15ms', label: 'Latence moyenne EU' },
    { key: 'vcpus', value: '48k+', label: 'vCPUs disponibles' },
    { key: 'gpus', value: '500+', label: 'GPU dédiés' },
  ],
  capacity: {
    compute: '48,000 vCPUs',
    ram: '192 TB RAM',
    storage: '12 PB NVMe',
    network: '2.4 Tbps',
    utilization: {
      compute: 68,
      storage: 61,
      network: 54,
      gpu: 72,
    },
  },
  regions: [
    {
      code: 'PAR-1',
      name: 'Paris, France',
      capacity: 'Tier III+ • 6 MW',
      status: 'operational',
      gpus: 'A100 • H100 • RTX 4090',
      peering: 'Equinix IX, France-IX',
      features: [
        '2N power, N+1 cooling',
        'Carrier-neutral, multi-IX',
        'ISO 27001 site',
      ],
    },
    {
      code: 'AMS-1',
      name: 'Amsterdam, NL',
      capacity: 'Tier III • 4 MW',
      status: 'operational',
      gpus: 'A40 • L40S • A5000',
      peering: 'AMS-IX, NL-IX',
      features: [
        '2N UPS, N+1 generators',
        'Dark fiber to IX',
        'SOC 2 Type II site',
      ],
    },
    {
      code: 'FRA-1',
      name: 'Frankfurt, DE',
      capacity: 'Tier III • 3 MW',
      status: 'maintenance',
      gpus: 'A100 • H100 (planned)',
      peering: 'DE-CIX',
      features: [
        'N+1 power and cooling',
        'Direct DE-CIX cross-connect',
        'GDPR-first operations',
      ],
    },
  ],
  compute: {
    servers: {
      vpsHosts: {
        model: 'AMD EPYC 9654 2×96c (Zen 4)',
        cores: '192 vCPU per host',
        ram: '1.5 TB DDR5 ECC',
        storage: '8× 7.68TB NVMe (RAID-10)',
        network: '2× 100 Gbps NICs',
        density: 'Up to 140 VMs/host',
      },
      gpuHosts: {
        model: 'Dual Xeon + PCIe Gen4',
        cores: '64 vCPU per host',
        ram: '1 TB DDR5 ECC',
        gpuSlots: '8× double-width',
        network: '2× 100 Gbps + RoCE',
        cooling: 'Rear-door heat exchangers',
      },
    },
    gpuInventory: [
      { name: 'NVIDIA H100', vram: '80 GB HBM3', count: 32 },
      { name: 'NVIDIA A100', vram: '80 GB HBM2e', count: 96 },
      { name: 'RTX 4090', vram: '24 GB GDDR6X', count: 180 },
    ],
    virtualization: {
      hypervisor: 'KVM (QEMU) + cgroups v2',
      features: [
        'Live migration',
        'NUMA-aware scheduling',
        'Secure boot/TPM vTPM',
        'SR-IOV, Virtio-net, vhost',
        'GPU passthrough & vGPU',
        'Cloud-init, images hardened',
      ],
    },
  },
  network: {
    totalCapacity: '2.4 Tbps',
    burstCapacity: '3.2 Tbps',
    peering: '100+ peerings',
    cdn: 'Global CDN partnership',
    ddosProtection: [
      { tier: 'Edge Scrubbing', capacity: '1.2 Tbps', mitigation: 'Always-on', provider: 'Voxility', sla: '< 30s' },
      { tier: 'Upstream Mitigation', capacity: '1.0 Tbps', mitigation: 'BGP Flowspec', provider: 'Tier-1', sla: '< 60s' },
      { tier: 'On-Prem Filters', capacity: '200 Gbps', mitigation: 'ACL/RTBH', provider: 'Inline', sla: '< 5s' },
    ],
    peeringPoints: [
      { name: 'France-IX', location: 'Paris', capacity: '2×100 G', status: 'connected' },
      { name: 'AMS-IX', location: 'Amsterdam', capacity: '2×100 G', status: 'connected' },
      { name: 'DE-CIX', location: 'Frankfurt', capacity: '1×100 G', status: 'planned' },
    ],
    transitProviders: ['GTT', 'Telia', 'Cogent'],
  },
  storage: {
    local: {
      models: ['Samsung PM9A3', 'Intel P5620', 'Micron 7450'],
      performance: {
        read: '7 GB/s',
        write: '5.5 GB/s',
        iops: '1.2M IOPS',
        latency: '< 100 µs',
      },
    },
    distributed: {
      technology: 'Ceph RGW + RBD',
      capacity: '8 PB raw',
      replication: '3× replication',
      performance: '40 GB/s aggregate',
      useCases: ['Object storage', 'Block storage', 'Backups'],
    },
    backup: {
      method: 'Incremental forever',
      frequency: 'Hourly + daily',
      retention: '30/90 days',
      rpo: '< 1 hour',
      rto: '< 15 minutes',
    },
  },
  security: {
    certifications: [
      { name: 'ISO 27001', standard: 'ISMS', status: 'ready', target: '2025' },
      { name: 'SOC 2 Type II', standard: 'Security', status: 'compliant', target: '' },
      { name: 'PCI DSS (scope)', standard: 'Payment', status: 'ready', target: 'scope-limited' },
    ],
    physical: [
      '24/7 manned security',
      'Biometric + PIN + mantrap',
      'CCTV with 90-day retention',
      'Visitor logs and escort',
    ],
    network: [
      'Segmentation, micro-segmentation',
      'WAF + IDS/IPS',
      'Least privilege access',
      'Continuous vulnerability scanning',
    ],
    encryption: {
      atRest: 'AES‑256 (LUKS) + S3 SSE',
      inTransit: 'TLS 1.3 (PFS)',
      keyManagement: 'HashiCorp Vault + HSM',
    },
  },
  reliability: {
    metrics2024: {
      actualUptime: '99.97%',
      incidents: 3,
      avgLatency: '< 15ms',
      packetLoss: '< 0.05%',
    },
    sla: [
      { tier: 'Standard', uptime: '99.9%', products: 'VPS, Hosting', mttr: '< 4h', support: 'Business hours', credits: '10%–25%' },
      { tier: 'Pro', uptime: '99.95%', products: 'GPU, VPS Pro', mttr: '< 2h', support: '24/7 Priority', credits: '25%–50%' },
      { tier: 'Enterprise', uptime: '99.99%', products: 'Dedicated, Mission-critical', mttr: '< 1h', support: '24/7 Dedicated', credits: '50%–100%' },
    ],
    redundancy: {
      power: '2N UPS + N+1 gensets',
      network: 'Dual fabric spine-leaf',
      cooling: 'N+1 CRAH with hot/cold aisles',
      storage: '3× replicated object/block',
    },
  },
  stack: {
    orchestration: ['Nomad', 'Kubernetes (roadmap)', 'Consul'],
    monitoring: ['Prometheus', 'Grafana', 'Loki', 'Tempo'],
    automation: {
      api: 'Public REST API',
      graphql: 'Partner GraphQL (beta)',
      terraform: 'Official provider',
      cli: 'vmcl CLI',
      webhooks: 'Events & billing',
    },
  },
};

export type InfrastructureData = typeof infrastructureData;

