# Terms and Conditions of Use and Sale – VMCloud

> **Version 2.0 – Effective Date: 09/02/2025**
>
> **Contracting Entity:** VMCloud OÜ, Estonian company, subsidiary of VMCloud Group OÜ, subsidiary of DVP Holding
>
> **Director:** Gaylor Loche
>
> **Registered Office:** Paju 1a, 50603 Tartu, Tartu Maakond, Estonia
>
> **Registration Number:** 31644377
>
> This document constitutes the contract binding VMCloud OÜ ("we", "our", "VMCloud", "the Operator") and any legal or natural person using our services ("you", "Client", "User"). It defines the legal and commercial conditions applicable to all cloud infrastructure Services (VPS, GPU, Object/Block Storage, CDN, PaaS, Load Balancer, Web Hosting, network, API and associated services).

---

## Table of Contents

1. [Definitions](#1-definitions)
2. [Object and scope of application](#2-object-and-scope-of-application) 
3. [Account creation and security](#3-account-creation-and-security)
4. [Order and commissioning](#4-order-and-commissioning)
5. [Pricing and payments](#5-pricing-and-payments)
6. [Non-payment and collection procedure](#6-non-payment-and-collection-procedure)
7. [SLA and service commitments](#7-sla-and-service-commitments)
8. [Quotas, Fair-Use and Anti-DDoS](#8-quotas-fair-use-and-anti-ddos)
9. [Support and escalation](#9-support-and-escalation)
10. [Data, backups and reversibility](#10-data-backups-and-reversibility)
11. [Log retention and access](#11-log-retention-and-access)
12. [Security and shared responsibility](#12-security-and-shared-responsibility)
13. [Personal data protection (GDPR)](#13-personal-data-protection-gdpr)
14. [Acceptable use policy (AUP)](#14-acceptable-use-policy-aup)
15. [Intellectual property](#15-intellectual-property)
16. [API and automation](#16-api-and-automation)
17. [Product-specific services](#17-product-specific-services)
18. [Suspension and termination](#18-suspension-and-termination)
19. [Maintenance and incidents](#19-maintenance-and-incidents)
20. [Warranties and exclusions](#20-warranties-and-exclusions)
21. [Liability and limitations](#21-liability-and-limitations)
22. [Force majeure](#22-force-majeure)
23. [Compliance and international sanctions](#23-compliance-and-international-sanctions)
24. [Audit and certifications](#24-audit-and-certifications)
25. [Subcontracting and assignment](#25-subcontracting-and-assignment)
26. [Confidentiality and references](#26-confidentiality-and-references)
27. [Modifications of Services and Conditions](#27-modifications-of-services-and-conditions)
28. [Applicable law and jurisdiction](#28-applicable-law-and-jurisdiction)
29. [Miscellaneous provisions](#29-miscellaneous-provisions)
30. [Version history](#30-version-history)

---

## 1. Definitions

For the purposes of these terms, the following terms have the meaning hereinafter. The definitions are strictly interpreted and apply equally to singular and plural.

**"Account"** means the secure customer space provided by VMCloud, allowing management of Services, authorized users, payment methods, accounting documents and operational settings. The Client remains responsible for creating, accuracy and updating their Account information.

**"Services"** means all cloud infrastructure and platform offerings provided by VMCloud, including without limitation: virtual private servers (VPS), GPU compute instances, S3-compatible Object Storage, Block Storage, CDN, PaaS, Load Balancers, web hosting, network features and associated APIs.

**"SLA"** (Service Level Agreement) means the quantified service level commitments published by VMCloud, notably the targeted availability of 98% monthly and the procedures for obtaining service credits in case of documented non-achievement, excluding exclusions provided herein.

**"API"** means any programming interface provided by VMCloud enabling automation of creation, modification, monitoring and deletion of resources via standardized protocols (REST, GraphQL).

**"Content"** means all data, files, configurations, system images, applications, logs and information that the Client uploads, stores, processes, transmits or makes accessible via the Services.

**"Incident"** means any event altering or interrupting the normal operation of a Service. **"Maintenance"** means planned operations for upkeep, updating or evolution of infrastructures or software.

**"Fair-Use"** means fair use policies aimed at preventing abuse of shared resources and ensuring service quality for all customers.

**"DPA"** (Data Processing Agreement) means the personal data processing agreement compliant with GDPR, available separately and referenced herein.

## 2. Object and scope of application

These general terms of use and sale (the "GTUS") govern all contractual relations between VMCloud OÜ and the Client regarding the Services. They apply to any order, provision, use, billing and termination, regardless of the subscription method.

These GTUS prevail over the Client's purchase conditions and any other document not expressly accepted in writing by VMCloud. Specific conditions, product sheets or technical appendices may supplement these terms. In case of contradiction, the following order of priority applies:
1. Specific conditions duly accepted by both parties
2. These GTUS
3. Public technical documentation and product sheets
4. Service level agreements (SLA)

The Client acknowledges having read the GTUS, DPA, AUP (Acceptable Use Policy) and technical documentation before any subscription, and declares to accept them without reservation.

## 3. Account creation and security

### 3.1. Account creation and management

Access to Services requires creating an Account via the web console or API. The Client undertakes to:
- Provide accurate, complete and up-to-date information
- Promptly notify any relevant changes
- Maintain confidentiality of their access credentials
- Manage user authorizations according to the principle of least privilege

### 3.2. Security verifications

VMCloud reserves the right to perform anti-fraud and compliance verifications, including:
- Verification of credit cards and payment methods
- KYC (Know Your Customer) procedures justified by risk level
- Geographic and international sanctions checks
- Identity verification for certain sensitive services

### 3.3. Security and best practices

The Client implements proportionate security measures:
- Strong authentication (MFA recommended)
- Secure management of SSH keys and API tokens
- Regular rotation of secrets and passwords
- System and configuration hardening
- Network segmentation and logging policies
- Monitoring of access and suspicious activities

Any suspected compromise must be immediately notified to contact@vmcloud.fr. VMCloud may adopt conservative measures to preserve overall security.

## 4. Order and commissioning

### 4.1. Order process

Orders are placed via the web console, API or authorized commercial channels. Upon receipt, VMCloud may:
- Perform security verifications mentioned in article 3.2
- Verify technical availability of resources
- Confirm validity of payment methods

### 4.2. Commissioning

Commissioning is generally immediate subject to:
- Validation of security controls
- Technical availability of requested resources
- Effective payment or validation of payment methods

### 4.3. Free trials

Certain Services offer free trial periods, explicitly mentioned in product sheets. At the end of the trial period:
- The amount corresponding to usage is due in full
- No refund is possible for the trial period
- The Service may be suspended in case of non-payment
- No tolerance is granted, regardless of the amount

### 4.4. Right of withdrawal

For professionals, no right of withdrawal applies. Infrastructure Services being customized and activated immediately, consumers' right of withdrawal does not apply in accordance with legal provisions.

## 5. Pricing and payments

### 5.1. Pricing structure

Prices are expressed excluding taxes and indicated in commercial documentation and product sheets. Applicable taxes (VAT, local taxes) are invoiced in addition according to Estonian regulations and those of the Client's country.

**Available billing models:**
- **Hourly:** Per-second billing, consolidated monthly
- **Monthly:** Fixed rate for the period, payable in advance
- **Annual:** Advance payment with savings linked to commitment

### 5.2. Payment methods

Payments are made by accepted means (credit card, SEPA transfer, other listed means). The Client authorizes VMCloud to initiate collections at agreed deadlines.

**Quotas and overages:** All quotas, resource limits and overage scales are detailed in corresponding product sheets. No tolerance is granted beyond contractual limits.

### 5.3. Price evolution and indexation

VMCloud operates in a fluctuating economic environment where certain costs are beyond its direct control. The company may therefore need to adjust its rates to maintain the viability of its services and the quality of the proposed infrastructure. These pricing changes mainly occur to absorb significant increases in external operating costs.

The main causes of price evolution include variations in the cost of electrical energy, particularly sensitive in the datacenter sector where electricity represents a significant portion of charges. Increases in software license rates by third-party publishers (Microsoft, VMware, etc.) also constitute an adjustment factor, as does the evolution of infrastructure costs linked to datacenter providers, network connectivity or computer hardware.

### 5.4. Pricing change notification procedure

When a pricing change becomes necessary, VMCloud respects a transparent and fair notification process. All affected customers receive a minimum 30 calendar days' notice before the new rate takes effect. This notification is sent by personalized email addressed to the main and technical contacts of each account, as well as by persistent notification in the customer area.

The communication precisely details the affected services, the magnitude of the increase (in percentage and absolute value), the effective date and the economic reasons motivating this evolution. VMCloud endeavors to clearly explain the impact of this modification on each client's monthly or annual invoice, with personalized numerical examples according to subscribed services.

For example, if the cost of a Windows Server license increases by 15% at Microsoft, VMCloud will pass on this increase on Windows VPS specifying: "The monthly cost of your Windows VPS-BUSINESS will increase from €199 to €229 from March 1, 2025, an increase of €30 linked to the increase in Microsoft licenses". This transparency allows the client to anticipate the budget impact and make decisions with full knowledge.

### 5.5. Options available to clients

Faced with a pricing change, each client has several options clearly explained in the notification. They can accept the new rate without any particular action, in which case their services continue normally under the new pricing conditions. They can also negotiate a longer commitment (switching from monthly to annual subscription for example) to benefit from a preferential rate partially offsetting the increase.

If the client considers the increase unacceptable for their economic model, they have the right to early termination without fees or penalties. This termination can be activated at any time before the new rate takes effect, allowing the client to migrate to an alternative solution without financial constraint.

VMCloud also offers personalized support to help clients identify internal alternatives (plan change, configuration optimization) to maintain their costs within an acceptable envelope while preserving their operational performance.

### 5.6. VMCloud's commitments on pricing moderation

VMCloud commits to limiting pricing changes to the strict minimum necessary to maintain service quality and company sustainability. Price increases are never used as an additional profitability lever but only to absorb unavoidable external costs that exceed the company's economic tolerance thresholds.

**Automatic indexation:** For certain services particularly sensitive to variations in external costs (notably services requiring third-party licenses or intensive energy consumption), VMCloud may implement automatic indexation clauses based on recognized public indices (energy indices, software license price indices). These clauses, when applicable, are clearly mentioned in the service's special conditions and respect the 30-day notice for their application.

**Continuous optimization:** The company prioritizes technical optimizations and economies of scale to maintain stable rates. It also negotiates multi-year agreements with its strategic suppliers to limit the volatility of costs passed on to clients. The efficiency gains achieved by VMCloud primarily benefit maintaining pricing competitiveness rather than increasing margins.

**Annual transparency:** VMCloud annually publishes a pricing transparency report explaining the evolution of its main cost items and measures taken to optimize the economic efficiency of its services. This document allows clients to understand the company's pricing policy and anticipate potential changes according to market trends and planned technological investments.

## 6. Non-payment and collection procedure

### 6.1. Strict collection policy

VMCloud applies a particularly strict collection policy, designed to protect the economic viability of its services and maintain fairness among all clients. This policy has no tolerance threshold: even a one-euro non-payment automatically triggers the collection procedure. This rigorous approach applies regardless of the amount concerned, client history or particular circumstances invoked.

The procedure is entirely automated in its initial phases to guarantee fair treatment and avoid any discrimination. Each client receives exactly the same deadlines and the same opportunities to regularize their situation, regardless of their profile or activity volume.

### 6.2. Phase 1: Immediate suspension of services (D+2)

Two calendar days after the payment due date, all client services are automatically suspended. This technical suspension means the client immediately loses access to their servers, applications, databases and their entire VMCloud infrastructure.

Notification of this suspension is sent simultaneously by email to the main contact and technical contacts referenced in the account. This notification clearly explains the reason for the suspension, recalls the unpaid amount and indicates the procedure to follow to regularize the situation. The client can still access their VMCloud dashboard to make payment, but can no longer use their operational services.

During this suspension phase, VMCloud maintains the integrity of the client's data. Servers are stopped but disks and configurations are preserved entirely. This measure aims to encourage the client to quickly regularize their situation while leaving them a possibility to resume normal activities as soon as payment is made.

### 6.3. Phase 2: Final notice (D+7)

Seven days after due date, if no payment has been made, VMCloud sends a formal notice electronically. This communication has a particularly solemn character as it constitutes the last warning before definitive destruction of data.

The notice explicitly specifies that the client has exactly 24 hours to make their payment, failing which all their data will be deleted definitively and irrecoverably. This 24-hour deadline runs from the sending of the notice email, which is precisely time-stamped. The client is informed that after this deadline, no subsequent payment will allow recovery of their data or restoration of their services.

This notification also details the practical consequences of deletion: definitive loss of all files, databases, configurations, emails, websites, applications and any other content hosted at VMCloud. The client is expressly informed that this is their last opportunity to backup their data if they wish, by making payment within the allotted 24 hours.

### 6.4. Phase 3: Definitive destruction of data (D+8)

If payment is not made within 24 hours following the notice, VMCloud automatically and immediately proceeds to complete and definitive deletion of all client data. This technical operation occurs exactly eight days after the initial due date and admits no exception or postponement.

The deletion concerns all data: virtual servers, data disks, databases, files, emails, network configurations, snapshots, automatic backups and any other technical element associated with the client account. This destruction also extends to technical backups that VMCloud might keep for its own operational needs.

The deletion process uses secure destruction techniques making data technically irrecoverable. VMCloud implements multiple erasure procedures conforming to the most demanding security standards. Once this deletion is performed, it becomes technically impossible to recover data, even in case of immediate payment or subsequent commercial negotiation.

This definitive deletion is accompanied by automatic notification informing the client that their data has been destroyed and their account is now empty. The client retains the possibility to reactivate their account by paying due amounts, but must start from zero without possibility of recovering their former content.

### 6.5. Phase 4: Formal commercial follow-up (D+14)

Fourteen days after due date, VMCloud sends a second follow-up, this time by registered mail. This step aims to ensure the client has received previous electronic notifications and to formalize the debt according to legal collection requirements.

This postal follow-up recaps the entire elapsed procedure, recalls that data has been definitively deleted, and informs the client of follow-up fees now added to the initial debt. These fees cover administrative and postal costs linked to this formal collection step.

The client is informed they still have the possibility to regularize their situation to avoid transmission of the file to collection services, but no data recovery is possible. If they wish to use VMCloud services again, they must entirely rebuild their infrastructure.

### 6.6. Phase 5: Transmission to collection (D+30)

Thirty days after initial due date, if no regularization has occurred, VMCloud automatically transmits the file to its partners specialized in debt collection. At this stage, file management escapes VMCloud teams and falls under standard legal collection procedures.

This transmission is accompanied by application of all late payment penalties provided by law, flat-rate collection fees and possible procedure costs. The total debt amount may then significantly exceed the initial unpaid invoice.

The client receives notification informing them of this transmission and new contact methods for any regularization. VMCloud reserves the right to communicate to its collection partners all information necessary for their procedures, in compliance with applicable regulations.

### 6.7. Communication and procedure transparency

Throughout this procedure, VMCloud strives to maintain clear and transparent communication with the client. Each notification specifies the current stage, remaining deadlines, possible actions and consequences of inaction. Notification emails include direct links to the payment area to facilitate regularization.

VMCloud provides in the customer area real-time monitoring of account status, allowing the client to know precisely their situation and upcoming deadlines. An automatic alert system also warns by SMS clients whose telephone numbers are provided.

This strict procedure aims to make clients responsible for the importance of respecting payment deadlines while offering them several regularization opportunities before irreversible measures.

## 7. SLA and service commitments

### 7.1. Availability commitment and scope

VMCloud contractually commits to a 98% monthly availability level for most of its services, representing a high standard in the cloud computing industry. This commitment concretely means each service may experience maximum unavailability of 14 hours and 24 minutes over a 30-day month, or 15 hours and 36 minutes over a 31-day month, without triggering the compensation mechanisms provided.

This availability fully applies to VPS services (virtual private servers), high-performance GPU compute instances, PaaS (Platform as a Service) solutions, Load Balancers, and traditional web hosting services. For these services, VMCloud controls the entire technical chain from physical infrastructure to the virtualization layer, enabling precise availability control.

Proprietary VMCloud storage, including internally developed block and object storage, also benefits from this 98% monthly guarantee. This coverage includes API accessibility, read/write operation performance, and integrity of stored data.

Two service categories are exceptions to this standard commitment. CDN (Content Delivery Network) services see their availability limited by performance of third-party Internet service providers and geographically distributed presence points. VMCloud cannot commit to technical elements beyond its direct control, particularly inter-operator routing and local network congestion.

Services relying on Amazon Web Services, notably certain S3 storage offerings, are subject to AWS SLA rather than VMCloud commitments. This distinction reflects real technical responsibility: VMCloud cannot offer guarantees superior to those of its underlying infrastructure providers.

### 7.2. Service credit compensation system

When VMCloud does not reach its 98% availability commitment over a given month, an automatic compensation system activates to compensate affected clients. This compensation exclusively takes the form of credit applied to the client account, usable on all future invoices without usage time limitation.

The compensation scale follows progressive logic reflecting the increasing impact of unavailabilities on client activity. For monthly availability between 90% and 97.99%, corresponding to unavailability of 14h25 to about 72 hours, VMCloud grants credit representing 10% of the monthly amount billed for the concerned service. This compensation recognizes moderate unavailability impact while remaining proportionate to the actually suffered service degradation.

When availability drops between 50% and 89.99%, revealing more significant malfunctions with unavailabilities that can reach 15 days in the month, compensation rises to 25% of the monthly amount. This level reflects significant impact on client activity, probably requiring implementation of costly workaround solutions or temporary loss of revenue linked to unavailable services.

In extreme cases where availability falls below 50% monthly, indicating major malfunction having rendered the service largely unusable for half the month, VMCloud proceeds to full month refund as credit. This situation, exceptional in normal infrastructure operation, justifies total compensation recognizing the client's impossibility to use the paid service.

Each credit is calculated precisely on the amount actually billed for the service specifically affected by unavailability. If a client uses several services and only some are impacted, compensation only applies to services actually concerned. The compensation ceiling is set at 100% of the service's monthly amount, avoiding over-compensation that could create windfall effects.

### 7.3. Claim procedure

SLA claims must be made within **15 calendar days** following the incident, with provision of the following elements:
- Precise description of the incident and its impact
- Concerned period (dates and UTC times)
- Affected services
- Client's possible technical evidence

### 7.4. Measurement method

Availability is measured by VMCloud's internal monitoring systems (logs, probes, alerts) in UTC timezone. In case of dispute, the Client may provide additional supporting evidence.

### 7.5. SLA exclusions

Excluded from availability calculation:
- **Planned maintenance:** Notified minimum 7 days in advance (48 hours for security emergencies)
- **DDoS attacks** against infrastructure or Client services
- **Client fault:** Faulty configurations, inappropriate use, quota overruns
- **Force majeure:** Events independent of VMCloud's will
- **Third-party dependencies:** AWS outages, ISPs, infrastructure providers beyond direct control

### 7.6. Exclusive remedy

SLA credits constitute the sole and unique remedy in case of non-compliance with availability commitments. No other form of compensation can be claimed.

## 8. Quotas, Fair-Use and Anti-DDoS

### 8.1. Reference to product sheets

All quotas, resource limits, fair-use policies and overage scales are detailed in corresponding product sheets, available on the website and integrated herein by reference.

### 8.2. Anti-DDoS Protection: Principles and limitations

VMCloud deploys distributed denial of service (DDoS) attack protection infrastructure designed according to a multi-level approach. This protection mainly aims to preserve stability and global availability of VMCloud infrastructure, thus ensuring that attacks directed against a specific client do not impact other platform users' services.

Basic protection, universally deployed on all VMCloud services, functions as perimeter shield continuously analyzing incoming traffic. This automated analysis detects the most common attack patterns: abnormal request volumes, suspicious geographic sources, malicious traffic signatures, and DNS or NTP amplification techniques. When an attack is detected, defense systems automatically activate countermeasures proportionate to the identified threat.

### 8.3. Protection methods and impact on client services

It is essential that clients understand this anti-DDoS protection prioritizes preserving global VMCloud infrastructure rather than individual continuity of each client service. In practice, this means during a significant DDoS attack targeting a client's services, VMCloud may need to temporarily or permanently suspend access to these services to prevent the attack from affecting the entire platform.

This approach responds to risk mutualization logic: a client victim of a major attack must not compromise service quality for hundreds of other clients hosted on the same infrastructure. Protection measures may therefore include temporary quarantine of attacked IP addresses, blocking certain network ports, drastic bandwidth limitation, or in extreme cases, complete disconnection of concerned services.

VMCloud implements this protection policy automatically and without notice when urgency requires. Detection systems operate 24/7 and can activate countermeasures in just seconds. Notification is sent to the concerned client as soon as possible after protection measure activation, but priority remains global infrastructure stabilization.

### 8.4. Enhanced protection and premium services

For clients requiring more robust and individualized anti-DDoS protection, VMCloud offers enhanced protection services available as options on certain product ranges. These premium protections offer superior absorption capacity, more sophisticated filtering mechanisms and above all, an approach favoring maintenance of client applications rather than their preventive isolation.

Enhanced protection levels generally include absorption capacity of several tens of gigabits per second, machine learning filtering techniques capable of distinguishing legitimate traffic from malicious requests, and load distribution mechanisms to maintain services operational even under attack. These protections also integrate real-time alert systems and detailed post-attack reports.

Each product sheet explicitly specifies the anti-DDoS protection level included in the standard offer and available enhanced protection options. This information details absorption capacity in Gbps, covered attack types (volumetric, applicative, protocols), and implemented notification mechanisms.

### 8.5. Respective responsibilities and recommendations

VMCloud strongly encourages its clients to implement their own complementary protection measures, particularly at application level. These measures include limiting request rate per user, implementing CAPTCHAs during suspicious activity peaks, blacklisting source IP addresses of recurring attacks, and using CDN services with integrated DDoS protection for static content.

Clients operating high-visibility or potentially controversial services are particularly encouraged to subscribe to enhanced protection options. VMCloud may also recommend using third-party services specialized in anti-DDoS protection for clients with specific needs or high risks.

It is important to note that VMCloud cannot be held responsible for service interruptions following DDoS attacks, even when its own protection measures contributed to these interruptions. This liability limitation applies to both basic and enhanced protections, as no technical solution can guarantee absolute protection against all forms of attacks.

### 8.6. Fair-Use and limitations

VMCloud applies fair-use policies to prevent abuse of shared resources:
- Average CPU limitation over extended periods
- IOPS throttling in case of overload
- Bandwidth throttling in case of excessive use
- Restrictions on port scanning and reconnaissance activities

Precise thresholds and methods are defined per service in product sheets.

## 9. Support and escalation

### 9.1. Available support channels

**Standard Support (included):**
- Tickets via web console: 24/7
- Email: contact@vmcloud.fr
- Chat: According to displayed hours
- Documentation: Public knowledge base

**Priority support (optional):**
- Business and Enterprise levels with guaranteed response SLA
- Dedicated phone for qualified accounts
- Priority technical escalation

### 9.2. Support SLA by level

VMCloud offers different support levels adapted to client needs and budgets, but commits to no binding response time obligations. Our approach prioritizes resolution quality over artificial deadlines that could compromise our intervention effectiveness.

**Standard:** Our standard support generally aims for response within 48 business hours for non-critical requests, but we often strive to do better according to our teams' availability. Resolution is performed to the best of our capabilities, according to technical complexity and current priorities. This level suits non-critical uses where speed is not the main factor.

**Business:** For our Business clients, we strive to respond within 4 hours and resolve problems within 24 business hours, without this constituting firm contractual commitment. Access to live chat and high priority given to requests generally enables more reactive assistance.

**Enterprise:** Our Enterprise clients benefit from our priority attention with 2-hour response objective 24/7 and 8-hour resolution. They have a dedicated phone line, assigned account manager, and accelerated technical escalation. However, even at this premium level, our commitments remain service quality objectives rather than strict contractual obligations.

### 9.3. Supported languages

Support available in French and English. Other languages may be offered according to availability.

## 10. Data, backups and reversibility

### 10.1. Data ownership

The Client remains sole owner and responsible for their data, their lawfulness, protection and regulatory compliance. VMCloud acts exclusively as technical provider.

### 10.2. Backup responsibility

**Infrastructure backups:** VMCloud backs up its general infrastructure for variable duration (up to 12 months according to elements). These backups are intended for VMCloud's operational continuity only.

**Client data backups:** VMCloud does not backup Client data by default. The Client must implement their own backup strategy.

**Exception:** When snapshot or backup services are explicitly subscribed, conditions are detailed in corresponding product sheets.

### 10.3. Storage costs

Backup and snapshot costs offered to the Client are included in concerned service prices or billed according to public scales. VMCloud's internal costs are never passed on to the Client.

### 10.4. Reversibility and contract end

**Export deadline:** 60 calendar days after contract end to request data export by email

**Available formats:** API, virtual images, snapshots, application exports according to service nature

**Post-termination access:** Immediate loss of dashboard access, export requests by email only

**Definitive purge:** 3 months after contract end, all data is definitively deleted

**Intermediate period:** Between 60 days and 3 months, VMCloud may discretionarily choose to provide data or not according to circumstances

### 10.5. Migration assistance

Migration assistance services may be offered on quote with dedicated hour quotas, cutover plan and integrity controls.

## 11. Log retention and access

### 11.1. Retention periods

**Security logs:** 12 months (connection attempts, security events, incidents)

**Access logs:** 6 months (successful connections, service usage, API)

**Billing logs:** Legal accounting duration (in accordance with Estonian regulations and tax obligations)

### 11.2. Log access

**General principle:** Clients have no access to VMCloud's internal logs

**Strictly limited exceptions:**
- **Dispute and amicable settlement:** In mediation procedure or documented dispute context, VMCloud may provide relevant logs of concerned Client
- **Judicial procedure:** VMCloud provides logs to judicial authorities exclusively upon presentation of valid and justified legal basis

### 11.3. Protection principles

VMCloud is not a "good samaritan" and strictly applies legal limits:
- Systematic verification of legal basis of requests
- Respect for judicial procedures of concerned country
- Provision limited to strictly necessary and proportionate elements
- Refusal of any request not legally founded

## 12. Security and shared responsibility

### 12.1. Shared responsibility model

Security at VMCloud relies on a shared responsibility model that precisely defines each party's obligations. This model ensures global security results from the combination of measures taken by VMCloud at infrastructure level and by the Client at application and data level.

**VMCloud responsibilities:** VMCloud handles all aspects related to underlying infrastructure. This includes physical datacenter security, protecting physical servers against intrusions, and maintaining backbone network integrity. VMCloud also secures the hypervisor and all host systems enabling virtualization, thus guaranteeing virtual environments operate on reliable technical foundation. Strict isolation between different client environments is ensured by advanced network segmentation preventing any unauthorized access between instances. VMCloud deploys robust perimeter protection including infrastructure-level firewalls and continuous monitoring detecting anomalies 24/7. Finally, in-transit encryption is automatically applied at infrastructure communication level to protect data flows between system components.

**Client responsibilities:** The Client assumes complete responsibility for everything concerning their application environment and data. They must maintain security of their operating systems, apply necessary patches and correctly configure middlewares and applications they deploy. Configuration of application firewalls and security rules at their instance level falls entirely under their responsibility, as does rigorous management of user accounts, credentials and access privileges. The Client must also implement encryption of their sensitive data according to their own business requirements and constraints. They are responsible for defining and implementing their backup strategy as well as their business continuity plan. Finally, they must keep all applications and services they deploy up to date, notably by applying security updates as soon as available.

### 12.2. VMCloud security measures

VMCloud deploys a complete set of organizational and technical measures that meet and often exceed industry standards. Strict client environment segmentation constitutes the foundation of our security architecture: each client evolves in an environment completely isolated from others, with dedicated virtual networks and access controls preventing any unauthorized interaction. Our administrator privilege limitation policy follows the least privilege principle, where each technical intervener only has access strictly necessary for their missions, with periodic reviews and regular rotation of sensitive access.

Continuous monitoring relies on advanced intrusion detection systems analyzing real-time traffic patterns, abnormal behaviors and unauthorized access attempts, with automatic alerts and escalation to our security team. Our security incident response plan defines clear escalation, containment and resolution procedures, with intervention deadlines adapted to each situation's criticality. Finally, our backup and restoration procedures are regularly tested to guarantee operational continuity, with geographically distributed backup sites and periodic restoration tests to validate data integrity.

### 12.3. Responsible disclosure

VMCloud encourages responsible vulnerability reporting via contact@vmcloud.fr. A coordinated disclosure program may be established with correction deadlines according to criticality.

## 13. Personal data protection (GDPR)

### 13.1. General framework

When the Client processes personal data via the Services, roles are defined as follows:
- **Client:** Data controller
- **VMCloud:** Data processor under GDPR

### 13.2. Processing agreement (DPA)

A separate Data Processing Agreement (DPA), GDPR compliant, specifies:
- Categories of personal data processed
- Processing purposes and durations
- Implemented security measures
- List of subsequent processors
- Procedures in case of data breach
- Methods for exercising data subject rights

### 13.3. Data localization

**General principle:** All personal data is processed exclusively in the European Union/EEA in accordance with GDPR requirements. VMCloud OÜ being established in Estonia (EU member), processing is performed under European jurisdiction with all related protections.

**European datacenters:** VMCloud operates its datacenters in six strategic European locations: Paris (France), Frankfurt (Germany), Amsterdam (Netherlands), London (United Kingdom - with post-Brexit arrangements), Madrid (Spain - in deployment), and Milan (Italy - planned). All these datacenters respect European data protection standards and are subject to applicable national and European regulations.

**Processors and partners:** VMCloud maintains a public list of its processors and technical partners, accessible via our website and updated quarterly. This list includes our infrastructure providers (datacenters), network partners (Cogent, Telia, Level3), DDoS security providers (Path.net, Voxility), and auxiliary service providers. All our partners are contractually bound to respect GDPR standards and undergo regular compliance audits.

**Non-EU transfers:** VMCloud prohibits any personal data transfer to third countries not covered by European adequacy decision, except in strict compliance with valid transfer mechanisms (standard contractual clauses approved by European Commission, binding corporate rules, or specific Article 49 GDPR derogations). Any transfer request undergoes prior impact assessment and explicit approval from our DPO.

### 13.4. Data breach

In case of personal data breach impacting Client processing and attributable to VMCloud:
- Notification to Client without undue delay (72 hours maximum)
- Good faith cooperation for corrective measures
- Provision of information necessary for regulatory declarations

### 13.5. Individual rights

The Client remains responsible for informing data subjects and exercising their rights. VMCloud provides necessary technical assistance within the limits of its processor role.

## 14. Acceptable use policy (AUP)

### 14.1. General principles

The Client undertakes to use Services in compliance with applicable laws and regulations and respecting third-party rights. VMCloud applies a strict acceptable use policy.

### 14.2. Explicit prohibitions

VMCloud maintains a strict policy regarding prohibited uses of its services, with four main categories of prohibitions reflecting both our legal obligations and commitment to gaming integrity and computer security.

**Circumvention and cheating activities:** VMCloud maintains an intransigent position against any form of video game cheating and technological circumvention. This policy reflects our commitment to gaming integrity and categorical refusal to facilitate unfair practices. All video game cheat software is formally prohibited without exception, whether automated cheats, bots, aimbots that automate aiming, or ESP (Extra Sensory Perception) revealing hidden information in games. Our position is particularly firm on this point: any detection of gaming or cheat activity triggers immediate warning, and in case of recurrence, permanent suspension without refund. This radical measure is explained by VMCloud offering legitimate cloud gaming services, and we cannot tolerate any activity that would compromise this ecosystem's integrity.

The prohibition extends to any game installation on our virtual machines, even for legitimate personal use. This rule without exception guarantees no circumvention can be performed under cover of normal use. Circumvention of technical protection measures represents serious violation: this includes bypassing game anti-cheat systems, disabling DRM (Digital Rights Management), or any attempt to circumvent protections implemented by developers. Identifier spoofing also constitutes prohibited practice, whether falsifying IP addresses, MAC addresses, or manipulating hardware fingerprinting to deceive detection systems. Exploiting vulnerabilities in online games to obtain unfair advantages is strictly forbidden, as are boosting services, automated leveling or ranking manipulation that corrupt competitive fairness.

**Malicious activities:** VMCloud adopts zero tolerance towards any form of malicious activity. Computer attacks are formally proscribed, including DDoS (Distributed Denial of Service) attacks, stressers and booters aimed at overloading third-party servers, or any other type of denial of service. Hosting malware, viruses, ransomware or any malicious software constitutes major violation exposing VMCloud and its clients to considerable legal and technical risks. Command & Control (C2) infrastructures used to pilot botnets are strictly forbidden as they participate in organized criminal networks. All forms of phishing, online scams, financial fraud or attempted fraud are prohibited. Finally, unauthorized exploitation of vulnerabilities, whether on our systems or third-party services accessible from our infrastructure, constitutes serious violation of our AUP.

**Abusive network usage:** VMCloud carefully monitors its network resource usage to detect abusive behaviors. Massive unauthorized port scans, particularly those aimed at identifying vulnerabilities on third-party systems, are strictly forbidden as they may be assimilated to attack reconnaissance. Aggressive network reconnaissance, including systematic attempts to map infrastructures without authorization, is also prohibited.

VPN and proxy usage is subject to specific restrictions: if these services are not included in the subscribed offer, their installation and use on our servers are formally forbidden. The client may connect to their server via VPN from their workstation, but installing a VPN or proxy server directly on VMCloud infrastructure requires explicit prior authorization and may incur additional costs. This restriction aims to preserve our network integrity and respect our legal obligations towards competent authorities.

Any form of spam or unsolicited mass sending is forbidden, whether emails, messages or any other type of communication, although practical limits are determined by subscribed service quotas. Violating third-party Internet service provider policies, which could compromise our relationships with network partners, also constitutes prohibited practice.

**Commercial circumvention:** This last category aims to preserve integrity of our commercial relationships and respect for intellectual property rights. Unauthorized resale of VMCloud services without official partnership agreement is formally forbidden, as it compromises our economic model and may create poorly defined liability situations. Violating terms of use of third-party services hosted on our infrastructure may expose VMCloud to legal claims, which is why we strictly forbid it. Software license circumvention, whether proprietary software or SaaS solutions, constitutes intellectual property violation we do not tolerate.

Cryptocurrency mining is strictly forbidden on all VMCloud infrastructure. This absolute prohibition stems from significant performance impacts, excessive energy consumption, and overheating risks this activity generates. Any detection of mining activity, whether obvious or concealed, results in sanctions proportionate to violation gravity and duration. According to detected activity duration and intensity, measures may range from simple warning with billing of additional energy costs to permanent suspension without refund for most serious cases. This inflexible policy guarantees performance fairness for all our clients and preserves our infrastructure integrity.

### 14.3. Enforcement procedure

VMCloud implements active and continuous monitoring of acceptable use policy compliance, relying on advanced technological approach combined with rigorous human processes. Our detection and reporting system relies on three complementary pillars ensuring comprehensive coverage of potential violations.

**Detection and reporting:** Our automated detection systems analyze real-time traffic patterns, software signatures, and suspicious behaviors through machine learning algorithms and regularly updated signature databases. These systems automatically detect cheating activities, DDoS attacks, malware hosting, or unauthorized network scans. In parallel, we scrupulously process all third-party reports, whether from game publishers, other service providers, or computer security organizations via our contact@vmcloud.fr address. These abuse reports undergo thorough investigation by our security team verifying accusation validity and collecting necessary technical evidence. Finally, our proactive monitoring involves targeted surveillance of suspicious uses identified by our technical teams, with in-depth investigations that may include log analysis, configuration examination, and event correlation.

**Measure graduation:** VMCloud applies proportionate approach in violation treatment, with four escalation levels adapted to infraction severity and recurrence. Notification always constitutes first step when severity permits: we contact the client to inform them of detected violation, explain associated risks and expected corrective measures, while specifying deadline granted to regularize situation. This notification often accompanies technical advice and resources to help client understand and resolve problem. If violation persists or worsens, we proceed to targeted limitation of resources or functionalities: bandwidth reduction, simultaneous connection limitation, certain network functionality disabling, or geographic zone access restriction. This measure aims to contain impact while preserving client's legitimate activities. Partial suspension occurs when limitation proves insufficient: we isolate services from public network while maintaining client access to their data via management console, thus allowing them to correct situation or export their information. Finally, total suspension results in immediate and complete service shutdown, reserved for most serious violations or recurrences.

**Cure deadlines:** Deadlines granted to remedy violations vary according to situation criticality and associated risks. For non-critical uses, such as minor terms of use violations or configuration problems, we systematically grant 48 hours to client to comply with our requirements. This deadline allows client to understand problem, identify causes, and implement necessary corrections without haste. Conversely, for critical uses engaging our infrastructure security, service legality, or public order, we proceed to immediate suspension without notice or cure deadline. This emergency measure concerns notably active computer attacks, illegal content hosting, proven cybercrime activities, or any situation exposing VMCloud or its clients to immediate legal or technical risks.

### 14.4. Penetration testing and responsible disclosure program

VMCloud maintains strict but constructive approach concerning its infrastructure security, encouraging responsible vulnerability disclosure while protecting its systems against unauthorized testing.

**Unauthorized penetration testing:** All penetration testing, vulnerability scans, or unauthorized exploitation attempts are strictly forbidden on VMCloud infrastructure and third-party services accessible from our systems. These activities constitute serious violation of our AUP and are liable to immediate sanctions, including suspension without notice and reporting to competent authorities.

**Responsible disclosure program:** VMCloud encourages responsible reporting of security vulnerabilities by researchers and security community. Discovered vulnerabilities must be reported exclusively via contact@vmcloud.fr with detailed description, non-destructive proof of concept, and researcher's commitment to respect our coordinated disclosure policy.

**Authorized testing:** Security testing on our infrastructure requires explicit prior authorization obtained via contact@vmcloud.fr. Request must include researcher's complete identity, precise technical scope of envisioned tests, detailed methodology, desired time window, accepted limitations, and formal commitment to responsible disclosure. VMCloud reserves right to accept or refuse any request according to its internal criteria.

**Correction deadlines:** VMCloud commits to processing reported vulnerabilities according to their criticality: critical vulnerabilities (data exposure, RCE) within 48 hours, important vulnerabilities (privilege elevation, security bypass) within 7 days, medium vulnerabilities (information disclosure, DoS) within 30 days, and minor vulnerabilities (configuration, best practices) within 90 days. These deadlines constitute quality objectives and not contractual obligations.

**Reward program:** VMCloud may, at its sole discretion, offer financial or non-financial rewards to researchers having significantly contributed to improving our security. These rewards never constitute obligation and depend on vulnerability criticality, report quality, and respect for our disclosure policy.

### 14.5. Adult content policy

VMCloud maintains balanced approach concerning adult content, based on transparency, mandatory prior notification, and zero tolerance for any illegal content. This policy aims to protect VMCloud from any legal risk while respecting legitimate use freedom of our clients.

**Mandatory prior notification:** Any client wishing to use our services to store or distribute adult content must imperatively inform us before use. This notification applies to object storage when main content consists of pornographic or adult images or videos, as well as hosting websites or services offering adult content. Notification must be made via contact@vmcloud.fr specifying content nature, intended use, and implemented access protection measures. This transparency allows us to adapt our security measures and comply with applicable regulations.

**Legal adult content:** VMCloud does not forbid legal adult content, provided it scrupulously respects laws in force and is subject to mandatory prior notification. The client remains solely responsible for ensuring their content's lawfulness and implementing appropriate access control measures, notably age verification and regulatory warnings.

**Zero tolerance for illegal:** In case of hosting illegal adult content, notably content involving minors, zoophilia, sexual violence, or any non-consensual content, VMCloud applies immediate suspension policy without refund and proceeds to immediate notification of competent authorities with transmission of all client identification information.

### 14.6. Inspection procedure on suspicion

VMCloud scrupulously respects its clients' privacy and performs no systematic preventive inspection of stored data or hosted services. However, we reserve the right to inspect content in exceptional circumstances and with prior client notification.

**Inspection circumstances:** Our inspection right is exercised only in case of founded third-party report, complaint filed by person alleging presence of content concerning them without consent, or legitimate suspicion of illegal activity based on objective elements. This inspection never concerns client's personal data but only stored or distributed content.

**Transparent procedure:** When inspection proves necessary, VMCloud notifies client of its intentions explaining reasons motivating this approach and specifying envisioned inspection scope. Client then has 48 hours to provide explanations, bring evidence of their content's lawfulness, or grant voluntary access to concerned elements.

**Preventive suspension and follow-up:** In case of serious suspicion concerning potentially illegal content, VMCloud may proceed to temporary preventive suspension during investigation. If inspection actually reveals presence of illegal content with supporting evidence, VMCloud proceeds to permanent suspension without refund, preserves evidence for judicial authorities, and immediately transmits client identification information to competent authorities. If inspection reveals suspicions were unfounded, VMCloud immediately restores services and may offer commercial gesture to compensate caused inconvenience.

### 14.7. Evidence preservation

VMCloud preserves violation evidence for minimum 12 months for legal and defense purposes.

## 15. Intellectual property

### 15.1. Client rights

The Client retains all intellectual property rights over:
- Their data, content and configurations
- Their applications and developments
- Their trademarks, domain names and distinctive elements

### 15.2. VMCloud rights

VMCloud retains all intellectual property rights over:
- Its trademark, logos and visual identity elements
- Its interfaces, software and documentation
- Its infrastructures and proprietary technologies
- Its methods and technical know-how

### 15.3. Third-party software

Third-party software used in Services remains subject to their respective licenses. The Client undertakes to respect these license terms.

### 15.4. Feedback license

The Client grants VMCloud a non-exclusive and free license to use improvement suggestions, experience feedback and feedback provided in context of Service use.

## 16. API and automation

### 16.1. Access conditions

**API keys:** Confidential and personal, non-transferable. Regular rotation recommended.

**Minimal scopes:** Application of least privilege principle for API permissions

**Authentication:** Secure mechanisms (JWT tokens, OAuth 2.0, API keys)

### 16.2. Usage limitations

**Rate limiting:** Rate limits applied to preserve overall performance

**Pagination:** Mandatory for large lists, per-page limits

**Monitoring:** Continuous usage monitoring to detect abuse

### 16.3. Evolutions and deprecations

**Versioning:** Version management with backward compatibility where possible

**Deprecations:** Minimum 90 days notice for major changes (breaking changes)

**Migration:** Migration documentation and tools provided to facilitate transitions

### 16.4. Suspension for abuse

Automatic suspension in case of API abuse (massive limit exceeding, intrusion attempts, malicious use).

## 17. Product-specific services

### 17.1. VPS (Virtual Private Servers)

**Resource allocation:** Logically dedicated, shared infrastructure according to offer

**System images:** Ubuntu, Debian, CentOS, Rocky Linux, Windows Server (with licenses)

**Storage:** High-performance NVMe, snapshots configurable by Client

**Network:** IPv4 and IPv6, configurable firewall, bandwidth according to offer

**Responsibilities:** Client responsible for OS, applications and configurations

### 17.2. GPU (High-performance computing)

**Card types:** Tesla T4, RTX 4090, A100 according to offers

**Isolation:** Dedicated or shared cards according to profile, full root access

**Drivers:** CUDA, cuDNN and Nvidia drivers pre-installed

**Cost optimization:** Auto-stop recommended for batch workloads

**Availability:** Variable according to demand, possible queues at peak hours

### 17.3. Object Storage (S3 Compatible)

**Compatibility:** Standard S3 API, existing tools supported

**Consistency:** Eventually consistent by region

**Features:** Versioning, access policies (IAM), server-side encryption

**Costs:** Storage billing, requests and outbound traffic according to scale

**Replication:** Multi-zone available, 99.999999999% (11 9s) durability

### 17.4. CDN (Content Delivery Network)

**Network:** Points of presence (PoP) variable according to geography

**Performance:** Best-effort cache, configurable TTL, selective purge

**SSL/TLS:** Automatic Let's Encrypt certificates or imported certificates

**Limitations:** No performance guarantee on third-party ISPs

**Rules:** Configuration by path, custom headers, redirections

### 17.5. PaaS (Platform as a Service)

**Supported runtimes:** Node.js, Python, PHP, Go, Java, .NET according to availability

**Deployment:** Integrated CI/CD, deployment from Git

**Resources:** CPU, memory and request limits per plan

**Cold start:** Possible startup latency on shared plans

**Logs:** Limited retention, externalization recommended

### 17.6. Load Balancer

**Types:** Layer 4 (TCP/UDP) and Layer 7 (HTTP/HTTPS)

**Algorithms:** Round-robin, least connections, IP hash

**Health checks:** Active backend monitoring with automatic failover

**SSL:** SSL termination, managed or imported certificates

**High availability:** Multi-zone configuration available

### 17.7. Web Hosting

**Technologies:** Apache, Nginx, PHP, MySQL, automatic SSL

**Domains:** Integrated DNS management, unlimited subdomains

**Email:** Email accounts and redirections according to offer

**CMS:** WordPress, Joomla pre-installable

**Databases:** MySQL, PostgreSQL according to plan

## 18. Suspension and termination

### 18.1. Suspension causes

VMCloud reserves the right to immediately suspend Services in several precise situations compromising either infrastructure security or contractual obligation compliance. Non-payment constitutes the most common suspension cause and follows the detailed procedure in article 6, with automatic suspension at D+2 after client notification. Serious violations of acceptable use policy (AUP) also result in immediate suspension, particularly when concerning video game cheating activities, computer attacks or illegal content exposing VMCloud to legal risks.

Any proven security risk, such as detected compromise of client environment, ongoing attack from their resources, or hosting of active malware, justifies preventive suspension to protect entire infrastructure. VMCloud also suspends services upon competent authority injunction, whether in judicial investigation context, administrative decision or law enforcement emergency measure. Finally, critical exceeding of resource quotas threatening platform stability or other client performance may lead to temporary preventive suspension.

### 18.2. Measure graduation

VMCloud applies progressive approach in violation treatment, except in case of absolute emergency. Standard 48-hour correction period applies to all non-critical violations, allowing client to regularize their situation before applying stricter measures. This approach aims to preserve service continuity while guaranteeing rule compliance.

Escalation follows four progressive levels adapted to situation severity. Notification constitutes first step: VMCloud informs client of observed violation, explains associated risks and specifies deadline granted to remedy problem, generally accompanied by technical advice to resolve situation. If violation persists, VMCloud proceeds to targeted limitation of resources or functionalities: bandwidth reduction, simultaneous connection limitation, or advanced functionality disabling, while maintaining access to data and management console.

Partial suspension occurs at third level: services become inaccessible to public, but client retains access to their data via console to make necessary corrections or proceed to information export. Finally, total suspension results in complete service shutdown with loss of console access, although data is preserved according to reversibility procedure.

Emergency situations derogate from this graduation: in case of critical security risk, imperative legal obligation, or public order threat, VMCloud proceeds to immediate suspension without notice or grace period. This exceptional measure aims to protect infrastructure integrity and respect VMCloud's legal obligations.

### 18.3. Termination by Client

The Client may terminate their Services at any time:
- Via management console
- By email to contact@vmcloud.fr
- Via API for automated terminations

**Effects:** Immediate loss of access, application of reversibility procedure (article 10.4)

### 18.4. Termination by VMCloud

VMCloud may terminate contract in case of:
- Persistent violation despite notices
- Extended non-payment after collection procedure
- Durable technical impossibility to provide service
- Cessation of activity or major restructuring

**Notice:** 30 days minimum except emergency or serious fault

### 18.5. Termination consequences

**Billing:** Stop of recurring fees at effective termination date

**Data:** Immediate application of reversibility procedure

**Refunds:** No refund of amounts paid in advance, except VMCloud error

## 19. Maintenance and incidents

### 19.1. Planned maintenance

VMCloud strives to maintain its services continuously available, but certain technical interventions require planned interruptions to guarantee security, performance and infrastructure evolution. Our maintenance policy aims to minimize impact on our clients while preserving our necessary operational flexibility.

**Notice and communication:** VMCloud generally communicates its planned maintenance with minimum 7 calendar days notice for major interventions likely to significantly affect services. However, we reserve the right to shorten this deadline to 48 hours in case of security emergency, critical patch or imperative regulatory obligation. Clients are notified via email, public status page, and possibly push notifications according to their preferences.

**Intervention windows:** Our maintenance is preferably scheduled between 02:00 and 06:00 CET to minimize impact on standard professional uses. However, VMCloud retains flexibility to schedule interventions at any time of day according to technical constraints, security emergencies, or operational necessities. We strive to group interventions monthly to reduce interruption frequency.

**Operational flexibility:** VMCloud commits to no binding maintenance deadline or window obligations. In case of critical technical problem, discovered security flaw, or incident requiring emergency intervention, we reserve the right to perform immediate maintenance without notice. This flexibility is essential to maintain our infrastructure integrity and security.

### 19.2. Incident communication

**Status page:** Publicly accessible with incident history

**Notifications:** Email, SMS, webhooks according to Client preferences

**Regular updates:** Real-time communication during major incidents

**Post-mortem:** Detailed report published for significant incidents

### 19.3. Incident management

**Classification:** Criticality 1 (critical), 2 (major), 3 (minor), 4 (maintenance)

**Escalation:** Internal escalation procedures according to severity

**Resolution:** Team mobilization proportionate to impact

**Prevention:** Corrective measures to avoid recurrence

## 20. Warranties and exclusions

### 20.1. Limited warranties

VMCloud warrants that Services will be provided in accordance with published SLA and with professional competence level conforming to industry standards.

**"As-is" services:** Unless expressly stated otherwise, Services are provided as-is without warranty other than those imposed by law.

### 20.2. Warranty exclusions

VMCloud does not warrant:
- Total absence of errors or interruptions
- Compatibility with all Client environments
- Specific performance not contractually defined
- Resistance to all forms of attacks or intrusions

### 20.3. Availability exclusions

Excluded from SLA commitments:
- Unavailabilities attributable to Client configurations
- Independent third-party provider failures
- DDoS attacks or external cyber-attacks
- Non-compliance with documented technical prerequisites
- Force majeure and events beyond reasonable control

### 20.4. Eviction warranty

The Client warrants VMCloud against any third-party claim based on:
- Client content, data and configurations
- Use of Services in violation of these conditions
- Intellectual property rights violation
- Client's illegal or harmful activities

## 21. Liability and limitations

### 21.1. Liability cap

VMCloud's total liability, all causes combined and for all Services, is strictly limited to the total amount actually paid by the Client during the twelve (12) months preceding the triggering event.

### 21.2. Excluded damages

Expressly excluded from VMCloud's liability:
- Indirect, consequential or immaterial damages
- Loss of operation, profits, image or reputation
- Data loss (except proven gross negligence by VMCloud)
- Reconstitution or recovery costs
- Lost profits and customer loss

### 21.3. Exceptions to limitations

Liability limitations do not apply in case of:
- Gross negligence or fraud by VMCloud
- Personal injury (bodily harm)
- Personal data breach attributable to VMCloud
- Contrary public order provisions

### 21.4. Exclusive remedy

SLA credits constitute the sole and unique remedy in case of Service failure within contractual limits.

## 22. Force majeure

### 22.1. Definition

Constitutes force majeure any external, unforeseeable and irresistible event within the meaning of French jurisprudence, including notably:
- Natural disasters (earthquakes, floods, fires)
- Armed conflicts, terrorist acts, civil unrest
- Massive cyber-attacks of state or organized criminal origin
- Extended unavailability of critical suppliers
- Sudden regulatory restrictions or embargos
- Major energy crisis or critical component shortage

### 22.2. Effects

Force majeure suspends affected contractual obligations for event duration, without compensation for either party.

### 22.3. Notification and termination

VMCloud notifies the Client without delay of occurrence and cessation of event. If force majeure persists more than 90 days, each party may terminate contract with 30 days notice.

## 23. Compliance and international sanctions

### 23.1. Export control

The Client undertakes to respect applicable export control regulations, notably:
- European and Estonian regulations
- US Export Administration Regulations (EAR) if applicable
- OFAC, EU, UN sanctions lists

### 23.2. Automated screening and verifications

VMCloud deploys automated verification system continuously controlling all clients, beneficial owners, and transactions against main international sanctions lists. This screening occurs during registration, periodically during contractual relationship, and real-time during client information changes.

**Controlled lists:** Our system automatically verifies matches with US OFAC (Office of Foreign Assets Control) lists, European Union sanctions lists, UN (United Nations) lists, as well as Estonian national lists and other relevant jurisdictions. These verifications cover Specially Designated Nationals (SDN), sectoral lists, blocked entities, and Persons of Interest (POI).

**Match procedure:** Any positive match, even partial, automatically triggers immediate preventive suspension of concerned services, thorough investigation by our compliance team, and notification to competent authorities if required. Client has 48 hours to provide supporting evidence demonstrating false match (homonym, identification error, etc.).

**False positives:** In case of proven false positive after investigation, VMCloud immediately restores services and may offer commercial gesture to compensate caused inconvenience. In case of confirmed true positive, suspension becomes permanent without refund and competent authorities are notified in accordance with legal obligations.

### 23.3. Prohibited countries and geographic restrictions

VMCloud Services are not available for residents, citizens, entities, or any person acting from or on behalf of following countries, currently under embargo or enhanced sanctions: Iran, North Korea, Cuba, Syria, and certain regions of Russia and Belarus according to geopolitical developments.

**Geographic verification:** VMCloud verifies clients' geographic origin by cross-referencing information including billing address, connection IP address, geolocation data, and banking information. Any indicator suggesting origin from prohibited country results in registration refusal or immediate suspension.

**Restriction evolution:** This list evolves according to geopolitical developments and new international sanctions. VMCloud updates its restrictions within 48 hours following new sanctioning measures taking effect and notifies potentially impacted clients.

### 23.4. Client obligations

The Client certifies they are not:
- Listed on international sanctions list
- Controlled by sanctioned entity
- Acting on behalf of sanctioned person or entity

### 23.5. Sanctions evolution

In case of sanctions hardening affecting the Client, VMCloud notifies impact and required measures with 30-day deadline to comply or terminate.

## 24. Audit and certifications

### 24.1. Available attestations

VMCloud strives to maintain recognized industry certifications and may provide on request:
- Compliance attestations (SOC 2, ISO 27001 if applicable)
- Security audit reports
- Policy and procedure documentation

### 24.2. Client audits

VMCloud accepts client audits within strictly defined framework protecting its infrastructure security, other client confidentiality, and industrial secrets, while respecting legitimate compliance needs of Enterprise clients.

**Mandatory prerequisites:** Any audit request must be submitted with minimum 30 calendar days notice to contact@vmcloud.fr, accompanied by precise definition of desired scope, targeted compliance objectives, auditor identity and qualifications, and business justification requiring this audit. VMCloud reserves right to accept or refuse any audit request according to its internal security and operational feasibility criteria.

**Authorized scope:** Audits are limited exclusively to documentary examination of VMCloud's processes, policies and organizational controls. This includes security policy documentation, access management procedures, data protection measures, backup and continuity processes, and compliance policies specifically applicable to requesting client's data.

**Strict exclusions:** No physical infrastructure access is granted. Auditors cannot access technical systems, network configurations, other client data or metadata, nor information considered VMCloud's industrial or commercial secret. Intrusive technical audits, penetration tests, or any activity likely to affect services are formally forbidden.

**Costs and billing:** All audit-related costs are client requester's responsibility, including dedicated engineer time (billed €150/hour), possible travel expenses, specific documentation preparation, and any associated administrative cost. Prior estimate will be provided with formal quote before validation.

**Privileged alternatives:** VMCloud strongly encourages its clients to rely primarily on available third-party attestations (SOC 2, ISO 27001), independent security audit reports, and public documentation of its policies. These alternatives generally cover compliance requirements without requiring specific expensive and time-consuming audit.

### 24.3. Audit scope

Audits apply exclusively to:
- Documented processes and controls
- Organizational security measures
- Compliance policies applicable to auditing Client data

**Exclusions:** Technical infrastructure, other client data, VMCloud industrial and commercial secrets

## 25. Subcontracting and assignment

### 25.1. Authorized subcontracting

VMCloud may subcontract certain services while retaining contractual responsibility:
- Datacenters and physical infrastructure
- Transit networks and connectivity
- Payment and billing services
- Specialized technical support
- Third-party cloud services (AWS, etc.)

### 25.2. Subcontractor list

A public list of main subcontractors is maintained and accessible on VMCloud's website. This list is regularly updated.

### 25.3. Change notification

**New subcontractors:** 30 days advance notification with Client's motivated objection right

**Founded objection:** In case of legitimate objection, VMCloud proposes alternative solution or accepts free termination

### 25.4. Contract assignment

**Assignment by VMCloud:** Possible within group operations (merger, acquisition, restructuring) with prior Client information

**Assignment by Client:** Subject to VMCloud's prior agreement, not unreasonably refused

## 26. Confidentiality and references

### 26.1. Confidential information

Each party undertakes to preserve confidentiality of non-public information communicated by the other party in contract execution context.

**Duration:** Confidentiality obligation survives contract end for 5 years

**Exceptions:** Public information, independently developed, disclosed by authorized third parties, required by law

### 26.2. Commercial references

Unless written Client refusal, VMCloud may mention:
- Client's corporate name
- Logo and visual elements in its references
- Type of used services (without technical details)

**Opt-out:** Client may request removal of their references at any time

### 26.3. Crisis communication

In case of major incident affecting Client, parties coordinate their external communications to ensure message consistency and avoid damaging contradictions.

## 27. Modifications of Services and Conditions

### 27.1. Service evolution

VMCloud may evolve its Services for reasons:
- Technical (improvement, update, security)
- Economic (optimization, viability)
- Regulatory (compliance, legal obligations)
- Technological (obsolescence, innovation)

### 27.2. Minor modifications

**Minor changes:** Improvements, bug fixes, optimizations without major functional impact

**Notification:** 7 days minimum via usual channels

**Refusal:** Right to terminate in case of proven negative impact

### 27.3. Major modifications

**Major changes:** Modification of main functionalities, service removal, substantial price changes

**Notification:** 30 days minimum with detailed impact description

**Refusal:** Right to free termination before taking effect

### 27.4. Service deprecations and end of life (EoL/EoS)

VMCloud may decide definitive cessation of certain services for economic, technical, or strategic reasons, respecting transparent process protecting existing client interests while preserving its operational flexibility.

**Deprecation notice:** VMCloud commits to notifying concerned clients with minimum 90 calendar days notice before definitive service cessation. This notification specifies exact cessation date (End of Service), reasons motivating this decision, impact on concerned clients, and available alternatives. Notification is made via direct email to concerned clients, status page publication, and management interface notification.

**Transition period:** During 90-day notice, service remains fully operational and maintained according to usual SLA. No new subscription is accepted upon deprecation announcement, but existing clients retain all contractual rights until effective cessation date.

**Proposed migration plans:** VMCloud systematically proposes migration paths to equivalent or superior services in its catalog, with pricing condition maintenance for minimum 6 months to facilitate transition. If no equivalent service exists in VMCloud catalog, recommendations to third-party providers may be provided for information, without VMCloud engaging its responsibility.

**Dedicated technical support:** During transition period, specialized technical support is made available free of charge to accompany clients in their migration. This support includes assistance with data export, new service configuration, and resolution of technical problems linked to migration. Detailed migration guides and automated tools are developed when technically possible.

**Refunds and compensation:** Prepaid unconsumed amounts at cessation date are fully refunded or transferred to new subscribed services. In case of significant proven inconvenience caused by service cessation, VMCloud may offer commercial compensation (credits, discounts, additional services) calculated case by case.

### 27.5. GTUS modification

**Notice:** 30 days minimum for substantial modifications

**Publication:** New version published with change history

**Acceptance:** Continued use constitutes acceptance of new conditions

## 28. Applicable law and jurisdiction

### 28.1. Applicable law

These conditions are governed by Estonian law for aspects relating to VMCloud OÜ company. For contractual and consumption aspects, law of Client's country of habitual residence applies when they benefit from more favorable provisions.

**Conflict rules:** In case of conflict between several applicable laws, provisions most favorable to Client apply within limits of Estonian public order.

### 28.2. Competent jurisdiction

**Principal jurisdiction:** Estonian competent courts (Tallinn) for disputes relating to VMCloud OÜ

**Consumer exception:** Consumers within meaning of European law retain right to seize courts of their country of residence

**Attributive clause:** For professionals, express attribution of jurisdiction to Estonian courts, except contrary imperative provisions

### 28.3. Prior mediation

**Mediation attempt:** Parties strive to amicably resolve their disputes by mediation before any judicial action

**Deadline:** 60 days maximum for mediation attempt

**Mediation:** By approved mediator chosen by mutual agreement or designated by competent mediation center

**Failure:** In case of mediation failure, parties regain full judicial action freedom

## 29. Miscellaneous provisions

### 29.1. Agreement entirety

These GTUS, completed by DPA, AUP and possible specific conditions, constitute the entire agreement between parties and replace all prior agreements relating to same object.

### 29.2. Clause autonomy

Nullity, inapplicability or unenforceability of one clause does not affect validity of other provisions, which remain fully applicable.

### 29.3. Waiver

Fact that one party does not exercise a right or sanction a breach does not constitute waiver of this right or acceptance of breach for future.

### 29.4. Electronic evidence

Computer records preserved in VMCloud systems constitute evidence between parties (logs, timestamps, audit traces, electronic invoices).

### 29.5. Reference language

In case of translation of these conditions, French version prevails in case of interpretation divergence.

### 29.6. Notifications

**Official addresses:**
- VMCloud: Paju 1a, 50603 Tartu, Tartu Maakond, Estonia  
- Email: contact@vmcloud.fr
- Client: Address provided in Account

**Notification modes:** Email, registered mail, in-app notification, API webhook

### 29.7. Banking ring-fence and entity separation

VMCloud OÜ maintains strict accounting, legal and financial separation between its different commercial activities to respect requirements of its banking partners and applicable financial regulations. This ring-fence architecture guarantees transparency and compliance of each entity.

**Activity separation:** VMCloud OÜ's banking partners exclusively finance only traditional cloud activities of VMCloud entity. Cloud gaming activities and related tool services are operated by a distinct gaming subsidiary with completely separate accounting, financing and legal responsibilities. This separation guarantees no financial or reputational contamination can affect main cloud services.

**Shared infrastructure, separate governance:** Although VMCloud and the gaming subsidiary share the same technical infrastructure and website for operational efficiency reasons, they remain legally and financially distinct. Clients access services via the same user interface, but financial flows, contractual responsibilities and legal obligations are strictly compartmentalized according to subscribed activity.

**Contractual transparency:** Each subscribed service clearly falls under a single entity: VPS, GPU, storage, CDN and load balancing services fall under VMCloud OÜ, while gaming and tool development services fall under the dedicated gaming subsidiary. This distinction is transparent to clients and explicitly mentioned in corresponding invoices and contracts.

### 29.8. Obligation survival

Survive contract expiration or termination:
- Payment obligations for due amounts
- Confidentiality obligations (5 years)
- Eviction warranties and liability limitations
- Dispute resolution provisions

## 30. Version history

### Version 2.0 – 09/02/2025
- Complete overhaul according to legal and banking compliance specifications
- Integration of VMCloud OÜ entity (Estonia) and applicable law
- Precise SLA definition (98%) with detailed credit scale
- Strict collection procedure and data deletion schedule
- Reinforced AUP with explicit prohibitions (anti-cheat, circumvention, etc.)
- Log retention and strictly framed access procedures
- Detailed shared responsibility model by service
- Maintenance policy and incident communication
- GDPR compliance with reference to separate DPA
- International sanctions control and export compliance

### Version 1.0 – 09/02/2025
- First publication of VMCloud GTUS (generic version)

---

### Contacts

**Technical Support:** contact@vmcloud.fr  
**Security:** contact@vmcloud.fr  
**Legal:** contact@vmcloud.fr  
**GDPR/DPO:** contact@vmcloud.fr  

**Abuse & Reports:** contact@vmcloud.fr  
**Commercial:** contact@vmcloud.fr

---

*These general conditions constitute a legally binding agreement. In case of questions about their interpretation or application, we recommend consulting qualified legal counsel.*
