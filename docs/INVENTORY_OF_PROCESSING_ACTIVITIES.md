# Inventory of Processing Activities

**Andiza Co. Limited**  
Registration No: 156009534  
Email: privacy@andiza.rw  
DPO: INYANGE Larissa (dpo@andiza.rw)

**Document Version**: 1.0  
**Last Updated**: January 2025  
**Review Frequency**: Quarterly

---

## Legal Basis

This inventory is maintained in compliance with Article 17 of Rwanda Law No 058/2021 on the Protection of Personal Data and Privacy, which requires data controllers to maintain a detailed inventory of all processing activities.

---

## 1. User Account Management

### Processing Activity Details
- **Activity Name**: User Registration and Account Management
- **Purpose**: Create and manage user accounts for couples and vendors
- **Legal Basis**: Consent (Article 6) and Contract Performance (Article 7)
- **Data Controller**: Andiza Co. Limited
- **Data Processor**: None (processed internally)

### Data Categories
- Identity Data: Full name, email address, phone number
- Account Data: Username, password (encrypted), profile picture, bio
- Authentication Data: Login credentials, session tokens, OTP codes

### Data Subjects
- Couples planning weddings
- Wedding vendors and service providers
- Platform administrators

### Data Recipients
- Internal: Platform administrators, customer support team
- External: Email service provider (Resend), cloud hosting provider (Vercel)

### Retention Period
- Active accounts: Duration of account existence
- Inactive accounts: 2 years after last login
- Deleted accounts: 30 days (soft delete), then permanent erasure

### Security Measures
- Password encryption using bcrypt
- Two-factor authentication (OTP via email)
- Session management with secure tokens
- HTTPS encryption for all data transmission

---

## 2. Vendor Onboarding and Verification

### Processing Activity Details
- **Activity Name**: Vendor Registration and Verification
- **Purpose**: Onboard and verify wedding service providers
- **Legal Basis**: Consent (Article 6) and Contract Performance (Article 7)
- **Data Controller**: Andiza Co. Limited
- **Data Processor**: None (processed internally)

### Data Categories
- Business Data: Business name, registration number, tax ID
- Contact Data: Business email, phone number, physical address
- Service Data: Service category, pricing, availability, portfolio
- Verification Data: Business registration documents, certifications
- Financial Data: Bank account details for payments

### Data Subjects
- Wedding vendors (photographers, caterers, decorators, etc.)
- Venue owners and managers

### Data Recipients
- Internal: Admin team, verification team
- External: Payment processor (for vendor payouts), cloud storage provider

### Retention Period
- Active vendors: Duration of business relationship
- Inactive vendors: 2 years after last activity
- Verification documents: 7 years (legal requirement)

### Security Measures
- Document encryption at rest
- Access control for verification team only
- Audit logs for all verification activities
- Secure file upload with virus scanning

---

## 3. Service Package and Venue Listings

### Processing Activity Details
- **Activity Name**: Service and Venue Publication
- **Purpose**: Display vendor services and venues to couples
- **Legal Basis**: Contract Performance (Article 7)
- **Data Controller**: Andiza Co. Limited
- **Data Processor**: None (processed internally)

### Data Categories
- Service Data: Package name, description, pricing, inclusions
- Media Data: Photos, videos, virtual tours
- Location Data: Venue address, coordinates, region
- Availability Data: Calendar, booking slots

### Data Subjects
- Wedding vendors
- Venue owners
- Couples (as viewers)

### Data Recipients
- Internal: Platform administrators
- External: Public website visitors, CDN provider (for media hosting)

### Retention Period
- Active listings: Duration of vendor account
- Inactive listings: 1 year after deactivation
- Media files: Deleted with listing

### Security Measures
- Image optimization and watermarking
- CDN with DDoS protection
- Rate limiting for API access
- Content moderation for inappropriate content

---

## 4. Booking and Payment Processing

### Processing Activity Details
- **Activity Name**: Booking Management and Payment Processing
- **Purpose**: Facilitate bookings and process payments between couples and vendors
- **Legal Basis**: Contract Performance (Article 7)
- **Data Controller**: Andiza Co. Limited
- **Data Processor**: Payment gateway provider

### Data Categories
- Booking Data: Service/venue booked, date, time, guest count
- Payment Data: Amount, payment method, transaction ID
- Financial Data: Credit card details (tokenized), mobile money numbers
- Communication Data: Booking confirmations, receipts

### Data Subjects
- Couples making bookings
- Vendors receiving bookings

### Data Recipients
- Internal: Finance team, customer support
- External: Payment processor, email service provider, SMS gateway

### Retention Period
- Booking records: 7 years (accounting and legal requirement)
- Payment data: 7 years (tax and audit purposes)
- Transaction logs: 10 years (financial regulations)

### Security Measures
- PCI DSS compliance for payment data
- Payment tokenization (no card storage)
- Encrypted payment gateway integration
- Fraud detection and prevention
- Transaction monitoring and alerts

---

## 5. Reviews and Ratings

### Processing Activity Details
- **Activity Name**: Review and Rating System
- **Purpose**: Allow couples to review vendors and venues
- **Legal Basis**: Consent (Article 6) and Legitimate Interest (Article 9)
- **Data Controller**: Andiza Co. Limited
- **Data Processor**: None (processed internally)

### Data Categories
- Review Data: Rating (1-5 stars), written review, photos
- Identity Data: Reviewer name, profile picture
- Metadata: Review date, verified booking status

### Data Subjects
- Couples who have booked services
- Vendors receiving reviews

### Data Recipients
- Internal: Content moderation team
- External: Public website visitors

### Retention Period
- Published reviews: Indefinite (unless deleted by user or flagged)
- Deleted reviews: 30 days (soft delete), then permanent erasure
- Flagged reviews: Retained for 2 years for dispute resolution

### Security Measures
- Content moderation for inappropriate content
- Verified booking requirement for reviews
- Spam and fake review detection
- Vendor response mechanism

---

## 6. Favorites and Wishlists

### Processing Activity Details
- **Activity Name**: Favorites and Wishlist Management
- **Purpose**: Allow couples to save preferred vendors and venues
- **Legal Basis**: Consent (Article 6)
- **Data Controller**: Andiza Co. Limited
- **Data Processor**: None (processed internally)

### Data Categories
- Preference Data: Saved vendors, saved venues
- Metadata: Date saved, notes

### Data Subjects
- Couples using the platform

### Data Recipients
- Internal: Platform administrators (for analytics)
- External: None (private to user)

### Retention Period
- Active favorites: Duration of account existence
- Deleted favorites: Immediate permanent deletion

### Security Measures
- User-specific access control
- Encrypted storage
- No sharing with third parties

---

## 7. Communication and Messaging

### Processing Activity Details
- **Activity Name**: In-Platform Messaging
- **Purpose**: Facilitate communication between couples and vendors
- **Legal Basis**: Contract Performance (Article 7)
- **Data Controller**: Andiza Co. Limited
- **Data Processor**: None (processed internally)

### Data Categories
- Message Data: Message content, attachments
- Metadata: Sender, recipient, timestamp, read status

### Data Subjects
- Couples
- Vendors

### Data Recipients
- Internal: Customer support (for dispute resolution)
- External: None

### Retention Period
- Active conversations: Duration of account existence
- Deleted messages: 30 days (soft delete), then permanent erasure
- Dispute-related messages: 2 years after resolution

### Security Measures
- End-to-end encryption (planned)
- Access control (sender and recipient only)
- Message content moderation
- Attachment virus scanning

---

## 8. Marketing and Communications

### Processing Activity Details
- **Activity Name**: Marketing Emails and Notifications
- **Purpose**: Send promotional content and platform updates
- **Legal Basis**: Consent (Article 6)
- **Data Controller**: Andiza Co. Limited
- **Data Processor**: Email service provider (Resend)

### Data Categories
- Contact Data: Email address, phone number
- Preference Data: Communication preferences, interests
- Engagement Data: Email opens, clicks, unsubscribes

### Data Subjects
- Couples (opted-in)
- Vendors (opted-in)

### Data Recipients
- Internal: Marketing team
- External: Email service provider (Resend), SMS gateway

### Retention Period
- Active subscribers: Until consent is withdrawn
- Unsubscribed users: 30 days (for suppression list), then deleted
- Engagement data: 2 years

### Security Measures
- Double opt-in for email subscriptions
- Easy unsubscribe mechanism
- Preference center for granular control
- GDPR-compliant email service provider

---

## 9. Analytics and Platform Improvement

### Processing Activity Details
- **Activity Name**: Usage Analytics and Performance Monitoring
- **Purpose**: Improve platform functionality and user experience
- **Legal Basis**: Legitimate Interest (Article 9)
- **Data Controller**: Andiza Co. Limited
- **Data Processor**: Analytics provider (if applicable)

### Data Categories
- Technical Data: IP address, browser type, device type, OS
- Usage Data: Pages visited, features used, session duration
- Performance Data: Load times, error logs

### Data Subjects
- All platform users

### Data Recipients
- Internal: Development team, product team
- External: Analytics provider (anonymized data)

### Retention Period
- Analytics data: 12 months
- Error logs: 6 months
- Aggregated reports: Indefinite (anonymized)

### Security Measures
- IP address anonymization
- Cookie consent mechanism
- Data minimization
- Aggregation and pseudonymization

---

## 10. Administrative and Legal Compliance

### Processing Activity Details
- **Activity Name**: Legal Compliance and Record Keeping
- **Purpose**: Comply with legal obligations and respond to legal requests
- **Legal Basis**: Legal Obligation (Article 8)
- **Data Controller**: Andiza Co. Limited
- **Data Processor**: None (processed internally)

### Data Categories
- All data categories (as required by law)
- Legal Documents: Court orders, subpoenas, regulatory requests
- Audit Logs: System access, data modifications

### Data Subjects
- All platform users (as required)

### Data Recipients
- Internal: Legal team, DPO, senior management
- External: Law enforcement, regulatory authorities, courts

### Retention Period
- Legal documents: 10 years
- Audit logs: 7 years
- Compliance records: As required by law

### Security Measures
- Restricted access (legal team only)
- Encrypted storage
- Audit trail for all access
- Secure transmission to authorities

---

## Data Protection Impact Assessment (DPIA)

Under Article 38 of Rwanda Law No 058/2021, DPIAs have been conducted for:

1. **Payment Processing**: High-risk due to financial data processing
2. **Biometric Data**: Not currently processed (future consideration)
3. **Automated Decision-Making**: Not currently implemented
4. **Large-Scale Processing**: Ongoing monitoring as user base grows

DPIA documents are maintained separately and reviewed annually.

---

## Data Breach Response

Under Articles 43-45 of Rwanda Law No 058/2021:

- **Breach Detection**: 24/7 monitoring and alerting
- **Notification to Authority**: Within 72 hours of detection
- **Notification to Data Subjects**: Without undue delay if high risk
- **Breach Register**: Maintained by DPO

---

## Third-Party Processors

| Processor | Service | Data Categories | Location | Contract |
|-----------|---------|-----------------|----------|----------|
| Resend | Email delivery | Email addresses, names | USA | DPA signed |
| Vercel | Web hosting | All platform data | USA | DPA signed |
| Turso | Database hosting | All platform data | USA | DPA signed |
| Payment Gateway | Payment processing | Payment data | Rwanda | DPA signed |

All processors are contractually bound under Article 48-49 of Rwanda Law No 058/2021.

---

## International Data Transfers

Data may be transferred to:

- **USA**: Vercel (hosting), Resend (email), Turso (database)
- **Safeguards**: Standard Contractual Clauses, adequacy decisions
- **Legal Basis**: Article 60-62 of Rwanda Law No 058/2021

---

## Review and Updates

This inventory is reviewed and updated:

- **Quarterly**: Routine review by DPO
- **Ad-hoc**: When new processing activities are introduced
- **Annually**: Comprehensive audit and update

**Next Review Date**: April 2025

---

## Contact Information

For questions about this inventory:

**Data Protection Officer**: INYANGE Larissa  
**Email**: dpo@andiza.rw  
**Phone**: [Contact Number]  
**Address**: [Company Address]

---

**Document Control**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | January 2025 | INYANGE Larissa | Initial creation |

---

**Approval**

**DPO Signature**: ___________________________________  
**Date**: ___________________________________

**Management Approval**: ___________________________________  
**Date**: ___________________________________
