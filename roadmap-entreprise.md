# Roadmap entreprise – VMCloud OÜ

## Contexte global (fin d’année)
- Deux branches : (1) Cloud infra premium (VPS/GPU/Web/PaaS) déjà visible sur le site, mais sans self-service complet ni API/billing en production. (2) Offre historique B2C/B2B2C gaming/streaming avec portail sessions, entitlements, marque blanche, anti-cheat, programmes communautaires, qui n’est pas reflétée dans le projet web actuel (opérée par une entité partenaire distincte).
- Cibles multiples : particuliers (cloud gaming), pros mid-market (SaaS/IA/web), partenaires marque blanche (FAI/OEM/écoles/médiathèques), enterprise (pools dédiés, conformité).
- Infra : 3 DC actifs (PAR/FRA/AMS), LON en maintenance, MAD/MIL planifiés 2025 ; tension GPU (80 %), capacité compute 65 %, stockage 45 %.
- Gouvernance/ops : support, NOC/SRE, RH, programmes partenaires décrits dans la mindmap mais non matérialisés dans l’app ; branding unique VMCloud à appliquer (partenaire cloud gaming opéré séparément).

## Gaps majeurs vs mindmap
- Portail B2C/B2B2C sessions : gestion comptes/profils, entitlements, historique sessions, lancements, limitations d’usage, fair-use, profils famille → absent.
- Marque blanche/Console entreprise : multi-tenant, centres de coûts, SSO SAML/OIDC, billing TVA, quotas, webhooks/events → absent.
- Add-ons B2C (Priority+, Family, Creator Pack, Share-Play, anti-cheat pools) → non présents sur le site/produit.
- Support structuré : L1/L2, SLA par plan, KB/FAQ, escalade SRE, communauté (Slack/feedback hub) → partiellement décrit, pas livré.
- Services managés/pro services : packaging Run/Run+Secure/Accelerate, coaching intégrations, déploiements sites/POPs partenaires → non implémentés.
- Réseau/edge : POPs/caches régionaux, peering local, options de routage, war-room événements → non exposés ni outillés.
- RH/Organisation : matrices rôles/KPIs/tracks décrites mais non planifiées en hiring roadmap.

## Roadmap priorisée (vue entreprise, inclut ce qui manque au projet)

### 0-3 mois (clôture année : socle et alignement)
- Marque & légaux : retenir VMCloud comme marque unique, aligner SLA/DPA/TOS, domaines/301, mentions légales, factures TVA.
- Socle self-service infra : auth JWT + roles, billing Stripe (horaire/mensuel/annuel), provisioning VPS/GPU, tickets + statut service public, API v1 (compute/network/billing) + CLI minimale, mode sandbox/mock.
- Portail sessions B2C (MVP) : comptes + profil unique, lancement session, historique, usage/fair-use, paiement carte (mensuel/horaire), règles de concurrence 1 session/compte, KB/FAQ + assistant existant branché support.
- Support & ops : SLA par plan (Standard/Priority/Mission), runbooks incidents, monitoring produit (logs/APM/synthetics), alerting NOC, RCAs publics légers.
- Pricing visible : simplifier catalogues web (4 VPS, 4 GPU, 3 Web/PaaS) en front ; paliers supérieurs derrière CTA sales ; crédits d’essai 50 € avec KYC léger.
- RH : geler le scope hiring sur 3-4 rôles critiques (Backend/Billing, SRE/NOC, PM plateforme, Support L1 lead).

### 3-6 mois (aligner mindmap B2C/B2B2C + partenaires)
- Portail sessions complet : profils famille/kids, Share-Play, Priority+, contrôle parental, packs heures/pools dédiés (anti-cheat) avec scheduling et files VIP ; entitlements par titre.
- Marque blanche & console entreprise : multi-tenant, centres de coûts, SSO SAML/OIDC, webhooks/events, quotas/limites, licences par point d’accès/site (retail/écoles/médiathèques), thèmes/branding.
- Billing avancé : proration, crédits, coupons, rev-share partenaires, facturation TVA par région, centres de coûts, exports comptables.
- Support structuré : L1 (chat/email), L2 (diag réseau/latence), critères d’escalade SRE, KB top 20 articles, SLA mesurés, communauté (Discord/feedback hub) avec bêta fermée.
- Offres/packs à lancer : Spot/Preemptible GPU/VPS (-60/-80 %), Reserved 12/24/36 mois (-20/-35 %), bundles IA (GPU+storage+monitoring), bundles Web/Agence (Web Pro + CDN + WAF + migration), packs migration zero-downtime payants.
- Partenaires & POPs : déploiements régionaux/caches partenaires (FAI/OEM/écoles), peering local, supervision POP, options fenêtres trafic ; packaging licence marque blanche (base + variable MAU/PAU).
- RH : amorcer NOC 24/7 léger (rotation), recruter 1-2 profils SRE/Network, 1 CSM/Success pour partenaires.

### 6-12 mois (multi-région, managé, conformité)
- K8s/PaaS & DB managées : GA PaaS containers avec autoscaling, K8s managé (SLA 99,9 %), ingress + cert manager, registry ; DB managées (Postgres/Redis/Mongo) avec PITR et read replicas.
- Observabilité client : métriques temps réel (CPU/RAM/IO/net), alertes mail/webhook, costs dashboard horaire, webhooks events.
- Services managés/Pro Services : packs Run/Run+Secure/Accelerate (on-call, audits perf/coût, labs anti-cheat), coaching intégrations (SSO/billing/observabilité), catalogue livrables (runbooks, dashboards, DPIA).
- Infra & réseau : réouverture LON sécurisée, ouverture MAD puis MIL, backbone 400→800 Gbps, options 25/100 Gbps, LB managé GA, S3 natif GA (Standard/Archive), block storage extensible à chaud.
- Compliance & sécurité : ISO 27001, SOC 2 Type II, MFA obligatoire, gestion clés HSM, bastion, posture management, bug bounty privé.
- GTM : channel partenaires (MSP/ESN/écoles), co-marketing éditeurs (Cloudflare/Datadog), contenus benchmarks GPU/LLM, playbooks « migrer depuis OVH/Hetzner/Scaleway ».
- RH : staffing contrôlé sur SRE/NOC, Network edge, Support L2, CSM/TAM, 1 PM B2B2C.

### 12-18 mois (plateforme complète et différenciation)
- Edge & global : CDN global ou partenariat profond, Anycast LB, Edge Functions, POPs supplémentaires, latence <15 ms EU garantie contractuelle.
- IA avancée : clusters NVSwitch, storage parallèle (BeeGFS), MLOps managé (MLflow, pipelines), labs fine-tuning clés en main.
- Produits policy-driven : quotas/limites, feature flags, billing temps réel, arbitrage auto Spot/Reserved.
- Marchés & secteurs : offres conformité sectorielle (santé/finance/éducation), white-label élargi, expansion hors EU via partenariat régional, events (meetups IA/gaming cloud).
- Sécurité : Zero-trust (ZTNA), posture management continu, bug bounty public, SOC managé optionnel.

## Actions immédiates (2-3 semaines)
- Décider branding unique et lancer 301 + mise à jour légaux/SLA/DPA.
- Scoper et démarrer self-service infra (auth/billing/provisioning) + portail sessions B2C MVP (entitlements + fair-use + paiement).
- Finaliser SLA par plan + connecteur support (chat existant → ticket backend) + status page automatisée.
- Préparer simplification catalogue front + page offres/packs (Spot/Reserved, bundles IA/Web).
- Lancer gap analysis ISO 27001/SOC 2 Type II et MFA obligatoire interne.
- Prioriser hires critiques : Backend billing, SRE/NOC, PM plateforme, Support L1 lead.

## KPIs entreprise
- Croissance : conversion signup→1er déploiement (<24 h), MRR par segment (B2C/B2B/partenaires), NRR, CAC payback.
- Produit & fiabilité : SLA par région, MTTR, p95 latence/erreurs, utilisation GPU/compute, churn logo/€, TTV B2C (compte→1re session <10 min).
- Support : FRT/ART par plan, CSAT/NPS, taux auto-résolution L1.
- Finance/FinOps : marge par SKU, CPO/CPOG, mix Spot/Reserved, coût egress/transit, coût support/CSM par compte.

## Risques critiques
- Tension GPU (80 %) : lancer files d’attente + offres Spot immédiatement pour lisser la demande A100/4090.
- Branding/légaux : appliquer VMCloud partout (site, contrats, SEO) avant de pousser ventes B2C/B2B2C/partenaires.
- Billing/TVA/entitlements : sans console multi-tenant et proration, impossible d’ouvrir les modèles marque blanche/points d’accès.
- Sécurité/compliance : MFA + gestion clés HSM + logs obligatoires avant d’ouvrir SSO/partenaires ; ISO/SOC pour deals enterprise.
