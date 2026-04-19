import { Metadata } from 'next';
import { Shield } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { ConsentFormModal } from './ConsentFormModal';
import { ConsentWithdrawalModal } from './ConsentWithdrawalModal';
import { ParentalConsentModal } from './ParentalConsentModal';
import { ParentalConsentWithdrawalModal } from './ParentalConsentWithdrawalModal';
import { DataAccessRequestModal } from './DataAccessRequestModal';
import { DataRectificationModal } from './DataRectificationModal';
import { DataErasureModal } from './DataErasureModal';
import { DataPortabilityModal } from './DataPortabilityModal';

// SEO Metadata
export const metadata: Metadata = {
  title: 'Privacy Policy - Andiza',
  description: 'Learn how Andiza protects your personal data in compliance with Rwanda Law No 058/2021 on data protection and privacy.',
};

// Privacy Policy Component
export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-cream bg-noise py-20 px-4 md:px-8">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto text-center mb-16">
        <div className="inline-flex items-center gap-3 bg-burgundy/10 p-4 rounded-2xl mb-6">
          <Shield className="h-8 w-8 text-burgundy" />
          <h1 className="text-4xl md:text-5xl font-serif text-charcoal">
            Privacy Policy
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          At <strong>Andiza</strong>, your privacy is our priority. 
          We are committed to protecting your personal data in compliance with <strong>Law No 058/2021 of 13/10/2021</strong> relating to the protection of personal data and privacy in Rwanda.
        </p>
        <p className="text-sm text-gray-500 mt-4">
          Last Updated: January 2025
        </p>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Company Info */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-charcoal">1. Data Controller Information</CardTitle>
            <CardDescription>
              Andiza is the data controller responsible for your personal information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-charcoal mb-1">Legal Entity</p>
                <p className="text-gray-600">Andiza Co. Limited</p>
              </div>
              <div>
                <p className="font-semibold text-charcoal mb-1">Registration Number</p>
                <p className="text-gray-600">156009534</p>
              </div>
              <div>
                <p className="font-semibold text-charcoal mb-1">Business Sector</p>
                <p className="text-gray-600">Wedding Planning & Event Management Software</p>
              </div>
              <div>
                <p className="font-semibold text-charcoal mb-1">Registered Address</p>
                <p className="text-gray-600">Nyarugenge, Kigali, Rwanda</p>
              </div>
              <div>
                <p className="font-semibold text-charcoal mb-1">Website</p>
                <p className="text-gray-600">www.andiza.co.rw</p>
              </div>
              <div>
                <p className="font-semibold text-charcoal mb-1">Contact Email</p>
                <p className="text-gray-600">privacy@andiza.co.rw</p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <h3 className="font-semibold text-charcoal mb-3">Data Protection Officer (DPO)</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-charcoal mb-1">Name</p>
                  <p className="text-gray-600">INYANGE Larissa</p>
                </div>
                <div>
                  <p className="font-semibold text-charcoal mb-1">Contact</p>
                  <p className="text-gray-600">dpo@andiza.co.rw</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Our Data Protection Officer is responsible for overseeing our data protection strategy and ensuring compliance with applicable data protection laws. You may contact the DPO directly regarding any questions about how we process your personal data.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data We Collect */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-charcoal">2. Personal Data We Collect</CardTitle>
            <CardDescription>
              We collect and process various types of personal data depending on your relationship with Andiza.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-charcoal mb-3">2.1 Categories of Data Subjects</h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                <li><strong>Couples:</strong> Individuals planning their weddings using our platform</li>
                <li><strong>Vendors:</strong> Wedding service providers registered on our platform</li>
                <li><strong>Website Visitors:</strong> Anyone browsing our website</li>
                <li><strong>Employees:</strong> Staff members of Andiza Co. Limited</li>
                <li><strong>Prospects:</strong> Potential customers and business partners</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-charcoal mb-3">2.2 Types of Personal Data</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-charcoal mb-2">Identification Data</p>
                  <p className="text-sm text-gray-600">Full name, date of birth, national ID number, passport number, photographs</p>
                </div>
                <div>
                  <p className="font-medium text-charcoal mb-2">Contact Information</p>
                  <p className="text-sm text-gray-600">Email address, phone number, physical address, postal address</p>
                </div>
                <div>
                  <p className="font-medium text-charcoal mb-2">Demographic Information</p>
                  <p className="text-sm text-gray-600">Gender, marital status, nationality, language preferences</p>
                </div>
                <div>
                  <p className="font-medium text-charcoal mb-2">Professional Information</p>
                  <p className="text-sm text-gray-600">Business name, service category, business registration details, portfolio images</p>
                </div>
                <div>
                  <p className="font-medium text-charcoal mb-2">Financial Information</p>
                  <p className="text-sm text-gray-600">Payment details, transaction history, invoicing information, budget preferences</p>
                </div>
                <div>
                  <p className="font-medium text-charcoal mb-2">Technical Data</p>
                  <p className="text-sm text-gray-600">IP address, browser type, device information, cookies, usage data, login credentials</p>
                </div>
                <div>
                  <p className="font-medium text-charcoal mb-2">Event Information</p>
                  <p className="text-sm text-gray-600">Wedding date, guest count, venue preferences, service bookings, event notes</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Important:</strong> We do not collect or process sensitive personal data such as racial or ethnic origin, political opinions, religious beliefs, health data, biometric data, or data concerning sexual orientation, except where explicitly required by law and with your express consent.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Data */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-charcoal">3. How We Use Your Personal Data</CardTitle>
            <CardDescription>
              We process your personal data for specific, explicit, and legitimate purposes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-charcoal mb-2">3.1 Service Delivery</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4">
                <li>Creating and managing user accounts</li>
                <li>Processing wedding bookings and vendor services</li>
                <li>Facilitating communication between couples and vendors</li>
                <li>Managing venue tours and quote requests</li>
                <li>Providing wedding planning tools (checklist, budget tracker, guest list)</li>
                <li>Sending booking confirmations and status updates</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-charcoal mb-2">3.2 Business Operations</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4">
                <li>Processing payments and managing invoices</li>
                <li>Vendor verification and quality control</li>
                <li>Customer support and dispute resolution</li>
                <li>Platform maintenance and improvement</li>
                <li>Analytics and performance monitoring</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-charcoal mb-2">3.3 Legal and Compliance</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4">
                <li>Compliance with Rwanda data protection laws</li>
                <li>Know Your Customer (KYC) verification</li>
                <li>Fraud prevention and security</li>
                <li>Responding to legal requests and court orders</li>
                <li>Enforcing our terms and conditions</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-charcoal mb-2">3.4 Marketing and Communication</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4">
                <li>Sending promotional emails and newsletters (with consent)</li>
                <li>Personalized service recommendations</li>
                <li>Market research and surveys</li>
                <li>Platform updates and announcements</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-charcoal mb-2">3.5 Human Resources</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4">
                <li>Employee recruitment and onboarding</li>
                <li>Payroll and benefits administration</li>
                <li>Performance management</li>
                <li>Training and development</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Legal Basis */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-charcoal">4. Legal Basis for Processing</CardTitle>
            <CardDescription>
              We process your personal data based on the following legal grounds as per Articles 6 and 7 of Law No 058/2021.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-charcoal mb-2">4.1 Consent (Article 6)</h3>
              <p className="text-sm text-gray-600 mb-2">
                You have given clear, informed, and voluntary consent for us to process your personal data for specific purposes. You may withdraw your consent at any time.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Examples:</strong> Marketing communications, optional profile features, newsletter subscriptions
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-charcoal mb-2">4.2 Contractual Necessity</h3>
              <p className="text-sm text-gray-600 mb-2">
                Processing is necessary for the performance of a contract to which you are a party, or to take steps at your request before entering into a contract.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Examples:</strong> Creating your account, processing bookings, delivering services, payment processing
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-charcoal mb-2">4.3 Legal Obligation</h3>
              <p className="text-sm text-gray-600 mb-2">
                Processing is necessary for compliance with legal obligations to which Andiza is subject.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Examples:</strong> Tax reporting, KYC verification, responding to lawful requests from authorities
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-charcoal mb-2">4.4 Legitimate Interest</h3>
              <p className="text-sm text-gray-600 mb-2">
                Processing is necessary for the legitimate interests pursued by Andiza or a third party, except where such interests are overridden by your fundamental rights and freedoms.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Examples:</strong> Fraud prevention, platform security, business analytics, improving user experience
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data Sharing */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-charcoal">5. Data Sharing and Recipients</CardTitle>
            <CardDescription>
              We may share your personal data with the following categories of recipients.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-charcoal mb-2">5.1 Within Andiza</h3>
              <p className="text-sm text-gray-600">
                Your data may be accessed by authorized employees and contractors who need it to perform their duties, subject to strict confidentiality obligations.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-charcoal mb-2">5.2 Service Providers and Processors</h3>
              <p className="text-sm text-gray-600 mb-2">
                We engage third-party service providers to perform functions on our behalf, including:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4">
                <li>Cloud hosting and data storage providers</li>
                <li>Payment processors (e.g., Stripe, mobile money providers)</li>
                <li>Email service providers</li>
                <li>Analytics and monitoring tools</li>
                <li>Customer support platforms</li>
              </ul>
              <p className="text-sm text-gray-600 mt-2">
                All processors are bound by data processing agreements in accordance with Articles 48 and 49 of Law No 058/2021.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-charcoal mb-2">5.3 Business Partners</h3>
              <p className="text-sm text-gray-600">
                We may share data with vendors on our platform to facilitate bookings and service delivery. Vendors only receive information necessary to fulfill their services.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-charcoal mb-2">5.4 Regulatory and Legal Authorities</h3>
              <p className="text-sm text-gray-600">
                We may disclose your data to:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4">
                <li>National Cyber Security Authority (NCSA)</li>
                <li>Rwanda Revenue Authority (RRA)</li>
                <li>Law enforcement agencies</li>
                <li>Courts and tribunals</li>
                <li>Other regulatory bodies as required by law</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-charcoal mb-2">5.5 Professional Advisors</h3>
              <p className="text-sm text-gray-600">
                We may share data with lawyers, auditors, accountants, and other professional advisors who assist us in running our business.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-900">
                <strong>International Transfers:</strong> Currently, all data processing occurs within Rwanda. If we transfer data outside Rwanda in the future, we will ensure adequate safeguards are in place as required by law and will notify you accordingly.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-charcoal">6. Your Rights Under Rwanda Law</CardTitle>
            <CardDescription>
              As a data subject, you have the following rights under Law No 058/2021.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-charcoal mb-2">6.1 Right of Access</h3>
              <p className="text-sm text-gray-600">
                You have the right to obtain confirmation as to whether your personal data is being processed, and if so, to access that data and receive information about how it is being used.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-charcoal mb-2">6.2 Right to Rectification</h3>
              <p className="text-sm text-gray-600">
                You have the right to request correction of inaccurate personal data and to have incomplete data completed.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-charcoal mb-2">6.3 Right to Erasure (Right to be Forgotten)</h3>
              <p className="text-sm text-gray-600">
                You have the right to request deletion of your personal data under certain circumstances, such as when the data is no longer necessary for the purposes for which it was collected, or when you withdraw consent.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-charcoal mb-2">6.4 Right to Restriction of Processing</h3>
              <p className="text-sm text-gray-600">
                You have the right to request that we restrict the processing of your personal data in certain situations, such as when you contest the accuracy of the data or object to processing.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-charcoal mb-2">6.5 Right to Data Portability</h3>
              <p className="text-sm text-gray-600">
                You have the right to receive your personal data in a structured, commonly used, and machine-readable format and to transmit that data to another controller.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-charcoal mb-2">6.6 Right to Object</h3>
              <p className="text-sm text-gray-600">
                You have the right to object to processing of your personal data based on legitimate interests or for direct marketing purposes.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-charcoal mb-2">6.7 Right to Withdraw Consent (Article 8)</h3>
              <p className="text-sm text-gray-600">
                Where processing is based on consent, you have the right to withdraw your consent at any time. Withdrawal of consent does not affect the lawfulness of processing based on consent before its withdrawal.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-charcoal mb-2">6.8 Right to Lodge a Complaint</h3>
              <p className="text-sm text-gray-600 mb-2">
                You have the right to lodge a complaint with the National Cyber Security Authority (NCSA) if you believe your data protection rights have been violated.
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm">
                <p className="font-medium text-charcoal mb-1">National Cyber Security Authority (NCSA)</p>
                <p className="text-gray-600">Website: www.dpo.gov.rw</p>
                <p className="text-gray-600">Email: info@ncsa.gov.rw</p>
              </div>
            </div>

            <div className="bg-burgundy/10 border border-burgundy/30 rounded-lg p-4">
              <p className="text-sm text-charcoal">
                <strong>How to Exercise Your Rights:</strong> To exercise any of these rights, please contact our Data Protection Officer at dpo@andiza.co.rw or use our <Link href="#forms" className="text-burgundy underline">Data Subject Rights Request Forms</Link> below. We will respond to your request within 30 days.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-charcoal">7. Data Security Measures (Articles 46 and 47)</CardTitle>
            <CardDescription>
              We implement appropriate technical and organizational measures to protect your personal data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-charcoal mb-2">7.1 Technical Security Measures</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4">
                <li>Encryption of data in transit (SSL/TLS) and at rest</li>
                <li>Secure authentication and password hashing (bcrypt)</li>
                <li>Regular security updates and patches</li>
                <li>Firewall and intrusion detection systems</li>
                <li>Secure backup and disaster recovery procedures</li>
                <li>Regular security audits and vulnerability assessments</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-charcoal mb-2">7.2 Organizational Security Measures</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4">
                <li>Access controls and role-based permissions</li>
                <li>Employee training on data protection</li>
                <li>Confidentiality agreements with staff and contractors</li>
                <li>Data protection impact assessments (Article 38)</li>
                <li>Incident response and data breach procedures (Articles 43-45)</li>
                <li>Regular review and update of security policies</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-charcoal mb-2">7.3 Data Breach Response (Articles 43, 44, and 45)</h3>
              <p className="text-sm text-gray-600 mb-2">
                In the event of a personal data breach, we will:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4">
                <li>Notify the NCSA within 72 hours of becoming aware of the breach (Article 43)</li>
                <li>Maintain a register of all data breaches (Article 44)</li>
                <li>Notify affected data subjects without undue delay if the breach poses a high risk to their rights and freedoms (Article 45)</li>
                <li>Take immediate steps to contain and remediate the breach</li>
                <li>Conduct a thorough investigation and implement preventive measures</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-900">
                <strong>Important:</strong> While we implement robust security measures, no system is completely secure. We cannot guarantee absolute security of your data. You are responsible for maintaining the confidentiality of your account credentials.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data Retention */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-charcoal">8. Data Retention Policy (Article 52)</CardTitle>
            <CardDescription>
              We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-charcoal mb-2">8.1 Retention Periods</h3>
              <div className="space-y-3">
                <div className="border-l-4 border-burgundy pl-4">
                  <p className="font-medium text-charcoal text-sm">User Account Data</p>
                  <p className="text-sm text-gray-600">Retained for the duration of your account plus 2 years after account closure for legal and audit purposes.</p>
                </div>
                <div className="border-l-4 border-burgundy pl-4">
                  <p className="font-medium text-charcoal text-sm">Booking and Transaction Records</p>
                  <p className="text-sm text-gray-600">Retained for 7 years from the date of transaction to comply with tax and accounting regulations.</p>
                </div>
                <div className="border-l-4 border-burgundy pl-4">
                  <p className="font-medium text-charcoal text-sm">Marketing Communications</p>
                  <p className="text-sm text-gray-600">Retained until you withdraw consent or unsubscribe, then deleted within 30 days.</p>
                </div>
                <div className="border-l-4 border-burgundy pl-4">
                  <p className="font-medium text-charcoal text-sm">Website Analytics and Cookies</p>
                  <p className="text-sm text-gray-600">Retained for up to 26 months. See our <Link href="/cookies" className="text-burgundy underline">Cookie Policy</Link> for details.</p>
                </div>
                <div className="border-l-4 border-burgundy pl-4">
                  <p className="font-medium text-charcoal text-sm">Employee Records</p>
                  <p className="text-sm text-gray-600">Retained for 10 years after employment termination as required by Rwanda labor laws.</p>
                </div>
                <div className="border-l-4 border-burgundy pl-4">
                  <p className="font-medium text-charcoal text-sm">Legal and Compliance Records</p>
                  <p className="text-sm text-gray-600">Retained as long as required by applicable laws or until legal claims are resolved.</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-charcoal mb-2">8.2 Secure Deletion</h3>
              <p className="text-sm text-gray-600">
                When personal data is no longer needed, we securely delete or anonymize it using industry-standard methods to prevent unauthorized access or recovery.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-charcoal mb-2">8.3 Retention Schedule Review</h3>
              <p className="text-sm text-gray-600">
                We regularly review our data retention schedule to ensure compliance with legal requirements and best practices. Our full Data Retention Schedule is available upon request from our DPO.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* International Transfers */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-charcoal">9. International Data Transfers</CardTitle>
            <CardDescription>
              Information about transfers of personal data outside Rwanda.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-charcoal mb-2">9.1 Current Status</h3>
              <p className="text-sm text-gray-600">
                Currently, all personal data processing and storage occurs within Rwanda using local infrastructure and service providers. We do not transfer personal data outside Rwanda.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-charcoal mb-2">9.2 Future Transfers</h3>
              <p className="text-sm text-gray-600 mb-2">
                If we need to transfer personal data outside Rwanda in the future, we will:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4">
                <li>Ensure the receiving country has adequate data protection laws</li>
                <li>Implement appropriate safeguards such as Standard Contractual Clauses</li>
                <li>Obtain authorization from the NCSA where required</li>
                <li>Notify affected data subjects and obtain consent where necessary</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-charcoal mb-2">9.3 Third-Party Services</h3>
              <p className="text-sm text-gray-600">
                Some of our service providers (e.g., cloud hosting, email services) may have servers located outside Rwanda. We ensure these providers comply with Rwanda data protection standards through contractual agreements and regular audits.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Legal Documents and Forms */}
        <Card className="border-gray-200 shadow-sm" id="forms">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-charcoal">10. Data Subject Consent and Forms</CardTitle>
            <CardDescription>
              Access forms and documents related to your data protection rights.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-charcoal mb-3">10.1 Data Subject Consent (Articles 6 and 7)</h3>
              <p className="text-sm text-gray-600 mb-3">
                When you create an account or use our services, you provide consent for us to process your personal data. Your consent is:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4 mb-3">
                <li><strong>Freely given:</strong> You have a genuine choice and control</li>
                <li><strong>Specific:</strong> Separate consent for different processing purposes</li>
                <li><strong>Informed:</strong> You understand what you're consenting to</li>
                <li><strong>Unambiguous:</strong> Clear affirmative action required</li>
              </ul>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm font-medium text-charcoal mb-2">Download Forms:</p>
                <div className="flex flex-wrap gap-2">
                  <ConsentFormModal />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-charcoal mb-3">10.2 Consent Withdrawal (Article 8)</h3>
              <p className="text-sm text-gray-600 mb-3">
                You have the right to withdraw your consent at any time. Withdrawal does not affect the lawfulness of processing based on consent before withdrawal. To withdraw consent:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4 mb-3">
                <li>Use the unsubscribe link in marketing emails</li>
                <li>Update your preferences in account settings</li>
                <li>Submit a Consent Withdrawal Form</li>
                <li>Contact our DPO at dpo@andiza.co.rw</li>
              </ul>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm font-medium text-charcoal mb-2">Download Forms:</p>
                <div className="flex flex-wrap gap-2">
                  <ConsentWithdrawalModal />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-charcoal mb-3">10.3 Parental Consent (Articles 9 and 8)</h3>
              <p className="text-sm text-gray-600 mb-3">
                Our services are intended for individuals aged 18 and above. If you are under 18, you must have parental or guardian consent to use our platform. Parents/guardians can:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4 mb-3">
                <li>Provide consent for minors to use our services</li>
                <li>Access and manage their child's data</li>
                <li>Request deletion of their child's data</li>
                <li>Withdraw consent at any time</li>
              </ul>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm font-medium text-charcoal mb-2">Download Forms:</p>
                <div className="flex flex-wrap gap-2">
                  <ParentalConsentModal />
                  <ParentalConsentWithdrawalModal />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-charcoal mb-3">10.4 Data Subject Rights Request Forms</h3>
              <p className="text-sm text-gray-600 mb-3">
                Use these forms to exercise your data protection rights:
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="grid md:grid-cols-2 gap-2">
                  <DataAccessRequestModal />
                  <DataRectificationModal />
                  <DataErasureModal />
                  <DataPortabilityModal />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Processing Activities */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-charcoal">11. Inventory of Processing Activities (Article 17)</CardTitle>
            <CardDescription>
              Overview of our data processing operations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              In compliance with Article 17 of Law No 058/2021, we maintain a comprehensive inventory of all processing activities. This includes:
            </p>
            
            <div className="space-y-3">
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="font-medium text-charcoal text-sm mb-2">Processing Activity: User Account Management</p>
                <div className="grid md:grid-cols-2 gap-2 text-xs text-gray-600">
                  <div><strong>Purpose:</strong> Account creation and authentication</div>
                  <div><strong>Legal Basis:</strong> Contractual necessity</div>
                  <div><strong>Data Categories:</strong> Identification, contact, credentials</div>
                  <div><strong>Recipients:</strong> Internal staff, cloud hosting provider</div>
                  <div><strong>Retention:</strong> Account lifetime + 2 years</div>
                  <div><strong>Security:</strong> Encryption, access controls</div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <p className="font-medium text-charcoal text-sm mb-2">Processing Activity: Booking Management</p>
                <div className="grid md:grid-cols-2 gap-2 text-xs text-gray-600">
                  <div><strong>Purpose:</strong> Service bookings and vendor coordination</div>
                  <div><strong>Legal Basis:</strong> Contractual necessity</div>
                  <div><strong>Data Categories:</strong> Contact, event details, financial</div>
                  <div><strong>Recipients:</strong> Vendors, payment processors</div>
                  <div><strong>Retention:</strong> 7 years (tax compliance)</div>
                  <div><strong>Security:</strong> Encryption, secure transmission</div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <p className="font-medium text-charcoal text-sm mb-2">Processing Activity: Marketing Communications</p>
                <div className="grid md:grid-cols-2 gap-2 text-xs text-gray-600">
                  <div><strong>Purpose:</strong> Newsletters and promotional emails</div>
                  <div><strong>Legal Basis:</strong> Consent</div>
                  <div><strong>Data Categories:</strong> Contact, preferences</div>
                  <div><strong>Recipients:</strong> Email service provider</div>
                  <div><strong>Retention:</strong> Until consent withdrawal</div>
                  <div><strong>Security:</strong> Secure API, encryption</div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <p className="font-medium text-charcoal text-sm mb-2">Processing Activity: Website Analytics</p>
                <div className="grid md:grid-cols-2 gap-2 text-xs text-gray-600">
                  <div><strong>Purpose:</strong> Platform improvement and user experience</div>
                  <div><strong>Legal Basis:</strong> Legitimate interest</div>
                  <div><strong>Data Categories:</strong> Technical data, usage patterns</div>
                  <div><strong>Recipients:</strong> Analytics service provider</div>
                  <div><strong>Retention:</strong> 26 months</div>
                  <div><strong>Security:</strong> Anonymization, aggregation</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-gray-600">
                <strong>Full Inventory:</strong> A complete inventory of all processing activities is maintained internally and is available for inspection by the NCSA upon request. Data subjects may request a copy by contacting our DPO.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-charcoal">12. Privacy Notice (Article 42)</CardTitle>
            <CardDescription>
              Information provided to data subjects at the point of data collection.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              In accordance with Article 42, we provide clear and transparent information about data processing at the point of collection. Our privacy notices include:
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-burgundy/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-burgundy">1</span>
                </div>
                <div>
                  <p className="font-medium text-charcoal text-sm">Identity of the Data Controller</p>
                  <p className="text-xs text-gray-600">Andiza Co. Limited and contact details</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-burgundy/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-burgundy">2</span>
                </div>
                <div>
                  <p className="font-medium text-charcoal text-sm">Purpose of Processing</p>
                  <p className="text-xs text-gray-600">Specific purposes for which data is collected</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-burgundy/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-burgundy">3</span>
                </div>
                <div>
                  <p className="font-medium text-charcoal text-sm">Legal Basis</p>
                  <p className="text-xs text-gray-600">Lawful grounds for processing (consent, contract, etc.)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-burgundy/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-burgundy">4</span>
                </div>
                <div>
                  <p className="font-medium text-charcoal text-sm">Recipients of Data</p>
                  <p className="text-xs text-gray-600">Who will have access to your personal data</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-burgundy/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-burgundy">5</span>
                </div>
                <div>
                  <p className="font-medium text-charcoal text-sm">Retention Period</p>
                  <p className="text-xs text-gray-600">How long we will keep your data</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-burgundy/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-burgundy">6</span>
                </div>
                <div>
                  <p className="font-medium text-charcoal text-sm">Your Rights</p>
                  <p className="text-xs text-gray-600">Rights to access, rectify, erase, and object</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-burgundy/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-burgundy">7</span>
                </div>
                <div>
                  <p className="font-medium text-charcoal text-sm">Right to Complain</p>
                  <p className="text-xs text-gray-600">How to lodge a complaint with NCSA</p>
                </div>
              </div>
            </div>

            <div className="bg-burgundy/10 border border-burgundy/30 rounded-lg p-4 mt-4">
              <p className="text-sm text-charcoal">
                <strong>Where to Find Privacy Notices:</strong> Privacy notices are displayed at account registration, booking forms, newsletter signup, and other data collection points throughout our platform.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact and Updates - Section 13 */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-charcoal">13. Contact Information and Policy Updates</CardTitle>
            <CardDescription>
              How to reach us and stay informed about policy changes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-charcoal mb-2">13.1 Contact Us</h3>
              <p className="text-sm text-gray-600 mb-3">
                For any questions, concerns, or requests regarding this Privacy Policy or our data protection practices:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="font-medium text-charcoal text-sm mb-2">General Inquiries</p>
                  <p className="text-xs text-gray-600 mb-1">Email: privacy@andiza.co.rw</p>
                  <p className="text-xs text-gray-600">Website: www.andiza.co.rw</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="font-medium text-charcoal text-sm mb-2">Data Protection Officer</p>
                  <p className="text-xs text-gray-600 mb-1">Name: INYANGE Larissa</p>
                  <p className="text-xs text-gray-600">Email: dpo@andiza.co.rw</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-charcoal mb-2">13.2 Policy Updates</h3>
              <p className="text-sm text-gray-600">
                We may update this Privacy Policy periodically. Material changes will be communicated via email and website notice. We encourage regular review of this policy.
              </p>
            </div>

            <div className="text-center pt-6">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild className="bg-burgundy hover:bg-burgundy/90 text-white">
                  <Link href="/contact">Contact Us</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/cookies">Cookie Policy</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/">Back to Home</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer Note */}
      <footer className="max-w-4xl mx-auto mt-16 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
        <p className="mb-2">&copy; 2025 Andiza Co. Limited. All rights reserved.</p>
        <p>Compliant with Rwanda Law No 058/2021 on Data Protection and Privacy.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          <Link href="/cookies" className="text-burgundy hover:underline">Cookie Policy</Link>
          <Link href="/terms" className="text-burgundy hover:underline">Terms of Service</Link>
          <Link href="/contact" className="text-burgundy hover:underline">Contact Us</Link>
        </div>
      </footer>
    </div>
  );
}

