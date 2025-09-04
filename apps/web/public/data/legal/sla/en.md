# Service Level Agreement (SLA) - VMCloud
**Version 2.1 - 03/09/2025**

---

## Table of Contents

1. [Availability commitment and scope](#1-availability-commitment-and-scope)
2. [Service credit compensation system](#2-service-credit-compensation-system)
3. [Claim procedure](#3-claim-procedure)
4. [Measurement method](#4-measurement-method)
5. [SLA exclusions](#5-sla-exclusions)
6. [Exclusive remedy](#6-exclusive-remedy)
7. [Anti-DDoS protection and Fair-Use](#7-anti-ddos-protection-and-fair-use)
8. [SLA contact](#8-sla-contact)

---

## 1. Availability commitment and scope

VMCloud contractually commits to a 98% monthly availability level for the majority of its services, representing a high standard in the cloud computing industry. This commitment concretely means that each service may experience a maximum downtime of 14 hours and 24 minutes over a 30-day month, or 15 hours and 36 minutes over a 31-day month, without triggering the provided compensation mechanisms.

### 1.1. Services covered by the 98% SLA

This availability fully applies to VPS (Virtual Private Server) services, high-performance GPU computing instances, PaaS (Platform as a Service) solutions, load balancers, and traditional web hosting services. For these services, VMCloud controls the entire technical chain from physical infrastructure to the virtualization layer, enabling precise availability control.

VMCloud proprietary storage, including internally developed block and object storage, also benefits from this 98% monthly guarantee. This coverage includes API accessibility, read/write operation performance, and stored data integrity.

### 1.2. Services with limited SLA

Two service categories are exceptions to this standard commitment. CDN (Content Delivery Network) services see their availability limited by the performance of third-party Internet service providers and geographically distributed points of presence. VMCloud cannot commit to technical elements beyond its direct control, particularly inter-operator routing and local network congestion.

Services relying on Amazon Web Services, notably certain S3 storage offerings, are subject to AWS SLAs rather than VMCloud commitments. This distinction reflects actual technical responsibility: VMCloud cannot offer guarantees superior to those of its underlying infrastructure providers.

## 2. Service credit compensation system

When VMCloud fails to meet its 98% availability commitment in a given month, an automatic compensation system activates to compensate affected customers. This compensation takes exclusively the form of a credit applied to the customer account, usable on all future invoices without usage duration limitation.

### 2.1. Compensation scale

The compensation scale follows a progressive logic reflecting the increasing impact of unavailability on customer activities:

**Level 1: 90% - 97.99% availability**
- Credit of **10%** of the monthly billed amount
- Corresponds to downtime of approximately 14h25 to 72 hours
- Recognition of moderate impact while remaining proportionate

**Level 2: 50% - 89.99% availability**
- Credit of **25%** of the monthly billed amount
- Downtime that can reach 15 days in the month
- Reflects significant impact requiring workaround solutions

**Level 3: Less than 50% availability**
- **Full refund** in credit form
- Service largely unusable for half the month
- Total compensation recognizing impossibility of usage

### 2.2. Calculation modalities

Each credit is precisely calculated on the amount actually billed for the service specifically affected by the unavailability. If a customer uses multiple services and only some are impacted, compensation applies only to the services actually affected. The compensation ceiling is set at 100% of the monthly service amount, avoiding any over-compensation that could create windfall effects.

## 3. Claim procedure

SLA claims must be submitted within **15 calendar days** following the incident, with provision of the following elements:

### 3.1. Required information

- **Precise description** of the incident and its impact on activities
- **Affected period** with dates and times in UTC timezone
- **Affected services** with references and configurations
- **Possible technical evidence** from the Client (logs, screenshots, monitoring)

### 3.2. Claim channel

SLA claims must be addressed exclusively via:
- **Dedicated address:** sla@vmcloud.com
- **Customer console:** "SLA Claims" section
- **Priority support:** For Business and Enterprise customers

### 3.3. Claim processing

VMCloud commits to acknowledging receipt within 48 hours and providing a definitive response within 7 business days. Processing relies on VMCloud monitoring data correlated with elements provided by the customer.

## 4. Measurement method

### 4.1. Measurement tools

Availability is measured by VMCloud's internal monitoring systems using:
- **System logs** timestamped in UTC
- **Monitoring probes** geographically distributed
- **Automated alerts** with event correlation
- **Performance metrics** in real-time

### 4.2. Dispute and counter-expertise

In case of dispute, the Client may provide additional supporting evidence: application logs, external monitoring, network captures. VMCloud analyzes these elements in correlation with its own data to establish the reality of the incident.

## 5. SLA exclusions

The following events are excluded from availability calculations and do not entitle to any compensation:

### 5.1. Scheduled maintenance
- **Notifications:** Minimum 7 days in advance via email and customer console
- **Emergency security maintenance:** Minimum 48-hour notice
- **Preferred windows:** Between 2:00 AM and 6:00 AM CET to limit impact

### 5.2. External attacks
- **DDoS attacks** against VMCloud infrastructure or Client services
- **Intrusions** and compromise attempts
- **Malware** and malicious activities impacting systems

### 5.3. Client fault
- **Defective or inappropriate configurations**
- **Non-compliant usage** with technical recommendations
- **Quota overruns** and contractual limitations
- **Client actions** impacting stability

### 5.4. Force majeure
- **Natural disasters** (earthquakes, floods, fires)
- **Social events** (strikes, social conflicts)
- **Major failures** of energy or connectivity providers
- **Government or regulatory decisions**

### 5.5. Third-party dependencies
- **AWS outages** for services using this infrastructure
- **ISP and network operator failures**
- **Infrastructure providers** outside VMCloud's direct control
- **Third-party services** integrated in the service chain

## 6. Exclusive remedy

SLA credits constitute the **sole and exclusive remedy** in case of availability commitment non-compliance. This limitation applies strictly:

- **No other financial or commercial compensation** may be claimed
- **Exclusion of indirect damages**: revenue loss, mitigation costs, image prejudice
- **Liability ceiling**: 100% of the monthly amount of the concerned service
- **Non-accumulation** with other forms of guarantees or insurance

This limitation clause responds to cloud services economic imperatives and risk mutualization inherent to this business model.

## 7. Anti-DDoS protection and Fair-Use

### 7.1. Basic Anti-DDoS protection

VMCloud deploys a distributed denial of service (DDoS) attack protection infrastructure designed with a multi-level approach. This protection primarily aims to preserve VMCloud infrastructure stability and global availability, ensuring that attacks directed against a specific customer do not impact other platform users' services.

Basic protection, universally deployed across all VMCloud services, functions as a perimeter shield permanently analyzing incoming traffic. This automated analysis detects the most common attack patterns: abnormal request volumes, suspicious geographical sources, malicious traffic signatures, and DNS or NTP amplification techniques.

### 7.2. Protection modalities

It is essential that customers understand this anti-DDoS protection prioritizes preserving global VMCloud infrastructure rather than individual continuity of each customer service. In practice, this means that during a significant DDoS attack targeting a customer's services, VMCloud may be required to temporarily or permanently suspend access to these services to prevent the attack from affecting the entire platform.

This approach responds to risk mutualization logic: a customer victim of a major attack must not compromise service quality for hundreds of other customers hosted on the same infrastructure. Protection measures may include:

- Temporary quarantine of attacked IP addresses
- Blocking certain network ports
- Drastic bandwidth limitation
- Complete disconnection of concerned services (extreme cases)

### 7.3. Enhanced protection (optional)

For customers requiring more robust and individualized anti-DDoS protection, VMCloud offers enhanced protection services available as options on certain product ranges. These premium protections offer:

- **Absorption capacity** of several tens of Gbps
- **Sophisticated filtering** by machine learning
- **Preferential maintenance** of services under attack
- **Real-time alerts** and post-attack reports
- **Load balancing** resistant to attacks

### 7.4. Fair-Use and limitations

VMCloud applies fair-use policies to prevent abuse of shared resources:

- **Average CPU limitation** over extended periods
- **IOPS throttling** in case of storage system overload
- **Bandwidth throttling** in case of excessive usage
- **Restrictions** on port scanning and reconnaissance activities

Precise thresholds and modalities are defined by service in corresponding product sheets.

### 7.5. Liability limitation

VMCloud cannot be held responsible for service interruptions resulting from DDoS attacks, even when its own protection measures have contributed to these interruptions. This limitation applies to both basic and enhanced protections, as no technical solution can guarantee absolute protection.

## 8. SLA contact

**SLA Claims:** sla@vmcloud.com  
**Business/Enterprise Support:** Dedicated line via customer console  
**Critical Emergencies:** +372 555 0911 (Business/Enterprise only)  

---

**VMCloud OÜ**  
Paju 1a, 50603 Tartu, Tartu Maakond  
Estonia  
Registration number: 31644377

*Document generated on 03/09/2025*