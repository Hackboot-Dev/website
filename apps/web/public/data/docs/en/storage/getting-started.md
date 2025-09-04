---
title: Getting Started with Storage
description: Learn how to use VMCloud Storage solutions
order: 1
tags: ["storage", "s3", "object-storage", "getting-started"]
---

# Getting Started with VMCloud Storage

VMCloud Storage provides scalable, secure, and cost-effective storage solutions for all your data needs.

## Overview

Our storage solutions include:
- **Object Storage**: S3-compatible storage for unstructured data
- **Block Storage**: High-performance SSD storage for virtual machines
- **Backup Storage**: Automated backup solutions with versioning

## Quick Start

### 1. Create a Storage Bucket

```bash
# Using VMCloud CLI
vmcloud storage create my-bucket --region=us-east-1
```

### 2. Upload Files

```bash
# Upload a single file
vmcloud storage upload file.txt s3://my-bucket/

# Upload entire directory
vmcloud storage sync ./local-folder s3://my-bucket/folder/
```

### 3. Configure Access Policies

```json
{
  "Version": "2024-01-01",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:vmcloud:s3:::my-bucket/public/*"
    }
  ]
}
```

## Storage Classes

| Class | Use Case | Availability | Price |
|-------|----------|--------------|-------|
| **Standard** | Frequently accessed data | 99.99% | $0.023/GB |
| **Infrequent Access** | Data accessed less than once a month | 99.9% | $0.0125/GB |
| **Archive** | Long-term storage | 99.9% | $0.004/GB |

## Best Practices

### Data Organization
- Use meaningful bucket names
- Implement folder hierarchies
- Tag resources for easier management

### Security
- Enable encryption at rest
- Use IAM policies for access control
- Enable versioning for critical data
- Configure lifecycle policies

### Performance Optimization
- Use multipart uploads for large files (>100MB)
- Enable CDN for frequently accessed content
- Choose appropriate storage class

## API Integration

### Python SDK

```python
import vmcloud

# Initialize client
client = vmcloud.Storage(
    access_key='YOUR_ACCESS_KEY',
    secret_key='YOUR_SECRET_KEY'
)

# Upload file
client.upload_file(
    'local-file.pdf',
    'my-bucket',
    'documents/file.pdf'
)

# Generate presigned URL
url = client.generate_presigned_url(
    'my-bucket',
    'documents/file.pdf',
    expiration=3600
)
```

### Node.js SDK

```javascript
const VMCloud = require('@vmcloud/storage');

const storage = new VMCloud.Storage({
    accessKey: process.env.VMCLOUD_ACCESS_KEY,
    secretKey: process.env.VMCLOUD_SECRET_KEY
});

// Upload with progress
await storage.upload('my-bucket', 'file.pdf', fileBuffer, {
    onProgress: (progress) => {
        console.log(`Upload progress: ${progress}%`);
    }
});
```

## Monitoring & Alerts

Set up monitoring for:
- Storage usage trends
- Request rates
- Error rates
- Bandwidth consumption

## Troubleshooting

### Common Issues

#### Access Denied Error
- Verify IAM permissions
- Check bucket policies
- Ensure correct region

#### Slow Upload Speeds
- Use multipart upload
- Check network connectivity
- Consider using Transfer Acceleration

## Next Steps

- [Configure Lifecycle Policies →](./lifecycle-policies.md)
- [Set Up Cross-Region Replication →](./replication.md)
- [Implement Backup Strategies →](./backup-strategies.md)