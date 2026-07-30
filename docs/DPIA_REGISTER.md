# Data Protection Impact Assessment (DPIA) Register

**Andiza Co. Limited**  
Registration No: 156009534  
Email: privacy@andiza.rw  
DPO: INYANGE Larissa (dpo@andiza.rw)

**Document Version**: 1.0  
**Last Updated**: January 2025  
**Review Frequency**: Quarterly

---

## 1. Purpose

This register maintains a record of all Data Protection Impact Assessments (DPIAs) conducted by Andiza Co. Limited in compliance with Article 38 of Rwanda Law No 058/2021 on the Protection of Personal Data and Privacy.

---

## 2. When DPIA is Required

A DPIA must be conducted when processing is likely to result in high risk to data subjects, including:

- Large-scale processing of special categories of data
- Systematic monitoring of publicly accessible areas
- Automated decision-making with legal or significant effects
- Processing of biometric or genetic data
- Innovative use of new technologies
- Processing that prevents data subjects from exercising rights
- Matching or combining datasets
- Processing of vulnerable persons' data at scale
- Processing involving cross-border data transfers with high risk

---

## 3. DPIA Process Overview

1. **Screening**: Determine if DPIA is required
2. **Preparation**: Define scope and gather information
3. **Assessment**: Identify and assess risks
4. **Mitigation**: Identify measures to reduce risks
5. **Documentation**: Complete DPIA report
6. **Review**: DPO and management review
7. **Approval**: Senior management approval
8. **Consultation**: Consult authority if high residual risk
9. **Implementation**: Implement mitigation measures
10. **Monitoring**: Ongoing monitoring and review

---

## 4. DPIA Register

### DPIA-001: Payment Processing System

**Status**: ✅ Completed  
**Date Completed**: January 15, 2025  
**Next Review**: January 15, 2026

**Processing Activity**: Payment and financial transaction processing  
**Data Controller**: Andiza Co. Limited  
**Data Processor**: [Payment Gateway Provider]

**Data Categories**:
- Payment card information (tokenized)
- Bank account details
- Transaction history
- Billing addresses
- Mobile money numbers

**Data Subjects**:
- Couples making bookings (approximately 1,000+ annually)
- Vendors receiving payments (approximately 200+ active)

**Purpose**: Process payments for wedding service bookings and venue reservations

**Legal Basis**: Contract performance (Article 7)

**Risk Assessment**:

| Risk | Likelihood | Severity | Risk Level | Mitigation Measures |
|------|------------|----------|------------|---------------------|
| Unauthorized access to payment data | Medium | High | HIGH | PCI DSS compliance, encryption, tokenization |
| Data breach during transmission | Low | High | MEDIUM | TLS/HTTPS encryption, secure APIs |
| Insider threat | Low | High | MEDIUM | Access controls, audit logs, background checks |
| Payment fraud | Medium | Medium | MEDIUM | Fraud detection, transaction monitoring |
| Third-party processor breach | Low | High | MEDIUM | Vendor security assessment, DPA, monitoring |

**Residual Risk**: LOW (after mitigation)

**Mitigation Measures Implemented**:
- PCI DSS Level 1 compliant payment processor
- Payment card tokenization (no card storage)
- End-to-end encryption for all transactions
- Two-factor authentication for high-value transactions
- Real-time fraud detection and monitoring
- Regular security audits and penetration testing
- Data processing agreement with payment processor
- Incident response plan for payment breaches
- Staff training on payment security

**Consultation with Authority**: Not required (residual risk is low)

**Approved By**: [Management Name]  
**Approval Date**: January 15, 2025  
**DPO Sign-off**: INYANGE Larissa

---

### DPIA-002: User Analytics and Behavioral Tracking

**Status**: ✅ Completed  
**Date Completed**: January 18, 2025  
**Next Review**: January 18, 2026

**Processing Activity**: Website and platform usage analytics  
**Data Controller**: Andiza Co. Limited  
**Data Processor**: [Analytics Provider - if applicable]

**Data Categories**:
- IP addresses (anonymized)
- Browser and device information
- Pages visited and click patterns
- Session duration and frequency
- Search queries
- Feature usage patterns

**Data Subjects**:
- All platform users (couples, vendors, visitors)
- Estimated volume: 10,000+ monthly visitors

**Purpose**: Improve platform functionality, user experience, and business intelligence

**Legal Basis**: Legitimate interest (Article 9) with consent for non-essential cookies

**Risk Assessment**:

| Risk | Likelihood | Severity | Risk Level | Mitigation Measures |
|------|------------|----------|------------|---------------------|
| User profiling and tracking | High | Medium | MEDIUM | IP anonymization, consent mechanism |
| Re-identification of users | Low | Medium | LOW | Data minimization, aggregation |
| Third-party data sharing | Low | Medium | LOW | Strict DPA, no data selling |
| Lack of transparency | Medium | Low | LOW | Clear privacy notice, cookie policy |

**Residual Risk**: LOW

**Mitigation Measures Implemented**:
- IP address anonymization
- Cookie consent banner with granular controls
- Data minimization (collect only necessary data)
- Aggregation and pseudonymization
- 12-month data retention limit
- No selling or sharing for third-party marketing
- Clear privacy notice and cookie policy
- Easy opt-out mechanism
- Regular data deletion

**Consultation with Authority**: Not required

**Approved By**: [Management Name]  
**Approval Date**: January 18, 2025  
**DPO Sign-off**: INYANGE Larissa

---

### DPIA-003: Vendor Verification and Background Checks

**Status**: ✅ Completed  
**Date Completed**: January 20, 2025  
**Next Review**: January 20, 2026

**Processing Activity**: Vendor identity verification and business validation  
**Data Controller**: Andiza Co. Limited  
**Data Processor**: None (internal processing)

**Data Categories**:
- Business registration documents
- Tax identification numbers
- Business licenses and certifications
- Owner/director identification documents
- Business addresses and contact information
- Bank account verification documents

**Data Subjects**:
- Wedding vendors applying to platform (approximately 200+ annually)

**Purpose**: Verify legitimacy of vendors and protect couples from fraud

**Legal Basis**: Legitimate interest (Article 9) and contract performance (Article 7)

**Risk Assessment**:

| Risk | Likelihood | Severity | Risk Level | Mitigation Measures |
|------|------------|----------|------------|---------------------|
| Unauthorized access to sensitive documents | Medium | High | HIGH | Encryption, access controls, secure storage |
| Document retention beyond necessity | Medium | Medium | MEDIUM | 7-year retention policy, automated deletion |
| Insider access to verification data | Low | High | MEDIUM | Role-based access, audit logs |
| Data breach of verification documents | Low | High | MEDIUM | Encryption at rest, secure transmission |

**Residual Risk**: LOW

**Mitigation Measures Implemented**:
- Document encryption at rest and in transit
- Role-based access (verification team only)
- Comprehensive audit logs
- 7-year retention period (legal requirement)
- Secure file upload with virus scanning
- Regular access reviews
- Staff confidentiality agreements
- Secure disposal after retention period
- Incident response procedures

**Consultation with Authority**: Not required

**Approved By**: [Management Name]  
**Approval Date**: January 20, 2025  
**DPO Sign-off**: INYANGE Larissa

---

### DPIA-004: Email Marketing and Communications

**Status**: ✅ Completed  
**Date Completed**: January 22, 2025  
**Next Review**: January 22, 2026

**Processing Activity**: Marketing emails and promotional communications  
**Data Controller**: Andiza Co. Limited  
**Data Processor**: Resend (email service provider)

**Data Categories**:
- Email addresses
- Names
- Communication preferences
- Engagement data (opens, clicks)
- Subscription status

**Data Subjects**:
- Opted-in users (couples and vendors)
- Estimated volume: 5,000+ subscribers

**Purpose**: Send promotional content, platform updates, and wedding planning tips

**Legal Basis**: Consent (Article 6)

**Risk Assessment**:

| Risk | Likelihood | Severity | Risk Level | Mitigation Measures |
|------|------------|----------|------------|---------------------|
| Spam or unwanted communications | Medium | Low | LOW | Double opt-in, easy unsubscribe |
| Email list breach | Low | Medium | LOW | Secure storage, DPA with processor |
| Lack of consent documentation | Low | Medium | LOW | Consent records, timestamps |
| Third-party processor misuse | Low | Medium | LOW | GDPR-compliant processor, DPA |

**Residual Risk**: LOW

**Mitigation Measures Implemented**:
- Double opt-in confirmation
- Clear consent language
- Granular preference controls
- Easy one-click unsubscribe
- Suppression list for unsubscribed users
- Data processing agreement with Resend
- GDPR-compliant email service provider
- Regular list cleaning
- Engagement-based list management
- Clear identification in emails

**Consultation with Authority**: Not required

**Approved By**: [Management Name]  
**Approval Date**: January 22, 2025  
**DPO Sign-off**: INYANGE Larissa

---

### DPIA-005: Cloud Data Storage and Hosting

**Status**: ✅ Completed  
**Date Completed**: January 25, 2025  
**Next Review**: January 25, 2026

**Processing Activity**: Cloud hosting and data storage  
**Data Controller**: Andiza Co. Limited  
**Data Processors**: Vercel (hosting), Turso (database)

**Data Categories**:
- All platform data (user accounts, bookings, messages, etc.)
- Application code and configurations
- Backup data

**Data Subjects**:
- All platform users (couples, vendors, admins)

**Purpose**: Provide reliable, scalable, and secure platform infrastructure

**Legal Basis**: Contract performance (Article 7) and legitimate interest (Article 9)

**Risk Assessment**:

| Risk | Likelihood | Severity | Risk Level | Mitigation Measures |
|------|------------|----------|------------|---------------------|
| International data transfer risks | High | Medium | MEDIUM | SCCs, adequacy assessment |
| Cloud provider breach | Low | High | MEDIUM | Vendor security assessment, DPA |
| Data loss or corruption | Low | High | MEDIUM | Regular backups, disaster recovery |
| Unauthorized access by provider | Low | Medium | LOW | Encryption, access controls |
| Service disruption | Medium | Medium | MEDIUM | SLA, redundancy, failover |

**Residual Risk**: LOW

**Mitigation Measures Implemented**:
- Standard Contractual Clauses with providers
- Data processing agreements
- Encryption at rest and in transit
- Regular security audits of providers
- ISO 27001 certified providers
- Daily automated backups
- Disaster recovery plan
- 99.9% uptime SLA
- Geographic redundancy
- Access logging and monitoring

**Consultation with Authority**: Not required

**Approved By**: [Management Name]  
**Approval Date**: January 25, 2025  
**DPO Sign-off**: INYANGE Larissa

---

## 5. Planned DPIAs

### DPIA-006: AI-Powered Vendor Recommendations (Planned)

**Status**: 📋 Planned  
**Expected Completion**: Q2 2025

**Processing Activity**: Automated vendor matching using AI/ML algorithms  
**Trigger**: New technology with potential for automated decision-making

**Preliminary Assessment**:
- High risk due to automated decision-making
- Potential for bias in recommendations
- Profiling of user preferences
- Requires DPIA before implementation

**Next Steps**:
- Define algorithm and data inputs
- Assess fairness and bias risks
- Implement transparency measures
- Conduct full DPIA
- Consult with authority if needed

---

### DPIA-007: Biometric Authentication (Under Consideration)

**Status**: 🔍 Under Consideration  
**Expected Decision**: Q3 2025

**Processing Activity**: Facial recognition or fingerprint authentication for vendor accounts  
**Trigger**: Processing of biometric data (special category)

**Preliminary Assessment**:
- High risk due to biometric data processing
- Requires explicit consent
- Enhanced security measures needed
- Mandatory DPIA required

**Next Steps**:
- Business case evaluation
- Technical feasibility study
- Legal and ethical review
- Full DPIA if proceeding
- Authority consultation required

---

## 6. DPIA Screening Decisions (No DPIA Required)

### Screening-001: User Reviews and Ratings
**Date**: January 10, 2025  
**Decision**: No DPIA required  
**Rationale**: Low risk, public information, user consent, moderation in place

### Screening-002: Favorites and Wishlists
**Date**: January 12, 2025  
**Decision**: No DPIA required  
**Rationale**: Low risk, private to user, minimal data, user control

### Screening-003: In-Platform Messaging
**Date**: January 14, 2025  
**Decision**: No DPIA required (but monitor for future encryption)  
**Rationale**: Standard messaging, limited scope, user-initiated, moderation available

---

## 7. DPIA Review Schedule

| DPIA ID | Processing Activity | Last Review | Next Review | Status |
|---------|---------------------|-------------|-------------|--------|
| DPIA-001 | Payment Processing | Jan 15, 2025 | Jan 15, 2026 | Current |
| DPIA-002 | Analytics | Jan 18, 2025 | Jan 18, 2026 | Current |
| DPIA-003 | Vendor Verification | Jan 20, 2025 | Jan 20, 2026 | Current |
| DPIA-004 | Email Marketing | Jan 22, 2025 | Jan 22, 2026 | Current |
| DPIA-005 | Cloud Hosting | Jan 25, 2025 | Jan 25, 2026 | Current |
| DPIA-006 | AI Recommendations | - | Q2 2025 | Planned |
| DPIA-007 | Biometric Auth | - | Q3 2025 | Consideration |

---

## 8. DPIA Template

All DPIAs follow a standardized template including:

1. **Processing Description**
   - Purpose and context
   - Data categories and subjects
   - Legal basis
   - Data flows

2. **Necessity and Proportionality**
   - Justification for processing
   - Alternative approaches considered
   - Data minimization measures

3. **Risk Identification**
   - Privacy risks to data subjects
   - Security risks
   - Compliance risks

4. **Risk Assessment**
   - Likelihood and severity ratings
   - Risk level calculation
   - Prioritization

5. **Mitigation Measures**
   - Technical controls
   - Organizational controls
   - Residual risk assessment

6. **Consultation**
   - Stakeholder input
   - DPO review
   - Authority consultation (if needed)

7. **Approval and Sign-off**
   - Management approval
   - DPO endorsement
   - Implementation plan

---

## 9. Risk Rating Matrix

| Likelihood | Severity | Risk Level |
|------------|----------|------------|
| High | High | CRITICAL |
| High | Medium | HIGH |
| High | Low | MEDIUM |
| Medium | High | HIGH |
| Medium | Medium | MEDIUM |
| Medium | Low | LOW |
| Low | High | MEDIUM |
| Low | Medium | LOW |
| Low | Low | LOW |

**Risk Thresholds**:
- **CRITICAL**: Immediate action required, authority consultation mandatory
- **HIGH**: Priority mitigation, senior management approval required
- **MEDIUM**: Standard mitigation, DPO oversight
- **LOW**: Monitor and document

---

## 10. Authority Consultation

**When Required**:
- Residual risk remains HIGH or CRITICAL after mitigation
- Processing of special categories at large scale
- Systematic monitoring of public areas
- Innovative technologies with unclear risks

**Process**:
1. Complete DPIA with high residual risk
2. Prepare consultation package
3. Submit to National Cyber Security Authority
4. Await authority guidance
5. Implement authority recommendations
6. Document consultation outcome

**Consultation Record**: None to date (all residual risks are LOW)

---

## 11. DPIA Metrics and KPIs

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| DPIAs completed on time | 100% | 100% | ✅ |
| High-risk processing with DPIA | 100% | 100% | ✅ |
| DPIAs reviewed annually | 100% | N/A (new) | - |
| Authority consultations | As needed | 0 | ✅ |
| Residual risks at LOW | >90% | 100% | ✅ |

---

## 12. Contact Information

**Data Protection Officer**: INYANGE Larissa  
**Email**: dpo@andiza.rw  
**Phone**: [DPO Contact Number]

**DPIA Inquiries**: privacy@andiza.rw

---

## 13. Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | January 2025 | INYANGE Larissa | Initial register creation |

**Next Register Review**: April 2025

---

**DPO Approval**: INYANGE Larissa  
**Date**: January 2025  
**Signature**: _______________________
