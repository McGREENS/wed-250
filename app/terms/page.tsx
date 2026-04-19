import { Metadata } from 'next';
import Link from 'next/link';
import { FileText, Shield, AlertTriangle, Scale, ArrowLeft } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';

export const metadata: Metadata = {
  title: 'Terms of Service | Andiza',
  description: 'Terms and conditions for using the Andiza wedding planning platform.',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-cream bg-noise py-20 px-4 md:px-8">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto text-center mb-16">
        <div className="inline-flex items-center gap-3 bg-burgundy/10 p-4 rounded-2xl mb-6">
          <FileText className="h-8 w-8 text-burgundy" />
          <h1 className="text-4xl md:text-5xl font-serif text-charcoal">
            Terms of Service
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Please read these terms carefully before using <strong>Andiza</strong>. By accessing our platform, you agree to be bound by these terms.
        </p>
        <p className="text-sm text-gray-500 mt-4">
          Last Updated: January 2025
        </p>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Section 1: Agreement to Terms */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-charcoal flex items-center gap-2">
              <Scale className="h-6 w-6 text-burgundy" />
              1. Agreement to Terms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              These Terms of Service ("Terms") constitute a legally binding agreement between you and Andiza Co. Limited ("Andiza", "we", "us", or "our") regarding your access to and use of the Andiza platform, including our website (www.andiza.co.rw), mobile applications, and related services (collectively, the "Platform").
            </p>
            <p className="text-sm text-gray-600 mb-4">
              By accessing or using the Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you must not access or use the Platform.
            </p>
            <div className="bg-burgundy/10 border border-burgundy/30 rounded-lg p-4">
              <p className="text-sm text-charcoal">
                <strong>Important:</strong> These Terms include provisions that limit our liability and require you to resolve disputes through arbitration on an individual basis.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Eligibility */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-charcoal">2. Eligibility</CardTitle>
            <CardDescription>
              Requirements for using the Andiza platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-charcoal mb-2">2.1 Age Requirement</h3>
              <p className="text-sm text-gray-600">
                You must be at least 18 years old to use the Platform. By using the Platform, you represent and warrant that you are at least 18 years of age. If you are under 18, you may only use the Platform with the consent and supervision of a parent or legal guardian.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-charcoal mb-2">2.2 Account Registration</h3>
              <p className="text-sm text-gray-600">
                To access certain features of the Platform, you must register for an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-charcoal mb-2">2.3 Account Security</h3>
              <p className="text-sm text-gray-600">
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Platform Services */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-charcoal">3. Platform Services</CardTitle>
            <CardDescription>
              Overview of services provided by Andiza.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-charcoal mb-2">3.1 For Couples</h3>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-4">
                <li>Browse and search for wedding vendors and venues</li>
                <li>Request quotes and book services</li>
                <li>Manage wedding planning tools (checklist, budget, guest list)</li>
                <li>Schedule venue tours and consultations</li>
                <li>Review and rate vendors</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-charcoal mb-2">3.2 For Vendors</h3>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-4">
                <li>Create and manage vendor profiles</li>
                <li>List service packages and pricing</li>
                <li>Receive and respond to booking requests</li>
                <li>Manage bookings and calendar</li>
                <li>Communicate with couples</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-charcoal mb-2">3.3 Platform Role</h3>
              <p className="text-sm text-gray-600">
                Andiza acts as an intermediary platform connecting couples with wedding vendors. We do not provide wedding services directly. All contracts for wedding services are between couples and vendors. We are not a party to such contracts and are not responsible for the performance or quality of services provided by vendors.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: User Responsibilities */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-charcoal">4. User Responsibilities</CardTitle>
            <CardDescription>
              Your obligations when using the Platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">You agree to use the Platform only for lawful purposes and in accordance with these Terms. You agree NOT to:</p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-2 ml-4">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on the intellectual property rights of others</li>
              <li>Upload or transmit viruses, malware, or other malicious code</li>
              <li>Engage in fraudulent, deceptive, or misleading practices</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Impersonate any person or entity</li>
              <li>Scrape, crawl, or use automated tools to access the Platform</li>
              <li>Interfere with or disrupt the Platform's operation</li>
              <li>Post false, inaccurate, or misleading information</li>
              <li>Use the Platform for commercial purposes without authorization</li>
            </ul>
          </CardContent>
        </Card>

        {/* Section 5: Vendor Terms */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-charcoal">5. Vendor-Specific Terms</CardTitle>
            <CardDescription>
              Additional terms for wedding service providers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-charcoal mb-2">5.1 Vendor Verification</h3>
              <p className="text-sm text-gray-600">
                Vendors must provide accurate business information and may be required to submit verification documents. We reserve the right to verify vendor credentials and reject or remove vendors who do not meet our standards.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-charcoal mb-2">5.2 Service Listings</h3>
              <p className="text-sm text-gray-600">
                Vendors are responsible for the accuracy of their service listings, pricing, and availability. All service descriptions must be truthful and not misleading.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-charcoal mb-2">5.3 Vendor Obligations</h3>
              <p className="text-sm text-gray-600 mb-2">Vendors agree to:</p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-4">
                <li>Respond to booking requests within 48 hours</li>
                <li>Honor confirmed bookings and pricing</li>
                <li>Provide services professionally and as described</li>
                <li>Maintain appropriate licenses and insurance</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-charcoal mb-2">5.4 Commission and Fees</h3>
              <p className="text-sm text-gray-600">
                Andiza may charge vendors commission fees or subscription fees for using the Platform. Fee structures will be communicated separately and may be updated with reasonable notice.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Section 6: Bookings and Payments */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-charcoal">6. Bookings and Payments</CardTitle>
            <CardDescription>
              Terms governing transactions on the Platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-charcoal mb-2">6.1 Booking Process</h3>
              <p className="text-sm text-gray-600">
                When a couple requests a booking, the vendor must accept or decline the request. A binding contract is formed between the couple and vendor upon acceptance. Andiza is not a party to this contract.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-charcoal mb-2">6.2 Payment Processing</h3>
              <p className="text-sm text-gray-600">
                Payments may be processed through the Platform using third-party payment processors. By making a payment, you agree to the terms of the payment processor. We are not responsible for payment processing errors or disputes.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-charcoal mb-2">6.3 Cancellations and Refunds</h3>
              <p className="text-sm text-gray-600">
                Cancellation and refund policies are determined by individual vendors. Couples should review vendor cancellation policies before booking. Andiza does not guarantee refunds but may assist in dispute resolution.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-charcoal mb-2">6.4 Disputes</h3>
              <p className="text-sm text-gray-600">
                Disputes regarding bookings, payments, or services should be resolved directly between couples and vendors. Andiza may provide mediation assistance but is not obligated to resolve disputes.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Section 7: Intellectual Property */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-charcoal">7. Intellectual Property Rights</CardTitle>
            <CardDescription>
              Ownership of content and materials on the Platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-charcoal mb-2">7.1 Platform Content</h3>
              <p className="text-sm text-gray-600">
                All content on the Platform, including text, graphics, logos, images, software, and design, is owned by Andiza or our licensors and is protected by copyright, trademark, and other intellectual property laws.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-charcoal mb-2">7.2 User Content</h3>
              <p className="text-sm text-gray-600 mb-2">
                By uploading content to the Platform (photos, reviews, descriptions), you grant Andiza a non-exclusive, worldwide, royalty-free license to use, display, reproduce, and distribute your content for the purpose of operating and promoting the Platform.
              </p>
              <p className="text-sm text-gray-600">
                You represent and warrant that you own or have the necessary rights to all content you upload and that such content does not violate any third-party rights.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-charcoal mb-2">7.3 Restrictions</h3>
              <p className="text-sm text-gray-600">
                You may not copy, modify, distribute, sell, or lease any part of the Platform or its content without our express written permission.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Section 8: Disclaimers */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-charcoal flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-burgundy" />
              8. Disclaimers and Limitations of Liability
            </CardTitle>
            <CardDescription>
              Important limitations on our liability.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-charcoal mb-2">8.1 Platform "As Is"</h3>
              <p className="text-sm text-gray-600">
                THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-charcoal mb-2">8.2 No Guarantee of Services</h3>
              <p className="text-sm text-gray-600">
                We do not guarantee the quality, accuracy, or reliability of vendor services. We do not endorse any vendor or guarantee that vendors will fulfill their obligations. You use vendor services at your own risk.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-charcoal mb-2">8.3 Limitation of Liability</h3>
              <p className="text-sm text-gray-600 mb-2">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, ANDIZA SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
              </p>
              <p className="text-sm text-gray-600">
                OUR TOTAL LIABILITY TO YOU FOR ANY CLAIMS ARISING FROM OR RELATED TO THE PLATFORM SHALL NOT EXCEED THE AMOUNT YOU PAID TO US IN THE 12 MONTHS PRECEDING THE CLAIM, OR RWF 100,000, WHICHEVER IS LESS.
              </p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-900">
                <strong>Note:</strong> Some jurisdictions do not allow the exclusion of certain warranties or limitation of liability. In such jurisdictions, our liability will be limited to the maximum extent permitted by law.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Section 9: Indemnification */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-charcoal">9. Indemnification</CardTitle>
            <CardDescription>
              Your agreement to protect Andiza from certain claims.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              You agree to indemnify, defend, and hold harmless Andiza, its affiliates, officers, directors, employees, agents, and licensors from and against any claims, liabilities, damages, losses, costs, or expenses (including reasonable attorneys' fees) arising out of or related to:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-4 mt-3">
              <li>Your use of the Platform</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of another party</li>
              <li>Your content uploaded to the Platform</li>
              <li>Your interactions with other users or vendors</li>
            </ul>
          </CardContent>
        </Card>

        {/* Section 10: Termination */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-charcoal">10. Termination</CardTitle>
            <CardDescription>
              How accounts may be terminated.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-charcoal mb-2">10.1 Termination by You</h3>
              <p className="text-sm text-gray-600">
                You may terminate your account at any time by contacting us or using the account deletion feature in your settings.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-charcoal mb-2">10.2 Termination by Us</h3>
              <p className="text-sm text-gray-600">
                We may suspend or terminate your account at any time, with or without notice, for any reason, including if we believe you have violated these Terms or engaged in fraudulent or illegal activity.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-charcoal mb-2">10.3 Effect of Termination</h3>
              <p className="text-sm text-gray-600">
                Upon termination, your right to use the Platform will immediately cease. Provisions of these Terms that by their nature should survive termination shall survive, including intellectual property rights, disclaimers, indemnification, and dispute resolution.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Section 11: Dispute Resolution */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-charcoal">11. Dispute Resolution and Governing Law</CardTitle>
            <CardDescription>
              How disputes will be resolved.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-charcoal mb-2">11.1 Governing Law</h3>
              <p className="text-sm text-gray-600">
                These Terms shall be governed by and construed in accordance with the laws of the Republic of Rwanda, without regard to its conflict of law provisions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-charcoal mb-2">11.2 Arbitration</h3>
              <p className="text-sm text-gray-600">
                Any dispute arising out of or relating to these Terms or the Platform shall be resolved through binding arbitration in accordance with the Kigali International Arbitration Centre (KIAC) rules. The arbitration shall take place in Kigali, Rwanda, and shall be conducted in English.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-charcoal mb-2">11.3 Exceptions</h3>
              <p className="text-sm text-gray-600">
                Either party may seek injunctive or other equitable relief in any court of competent jurisdiction to prevent the actual or threatened infringement, misappropriation, or violation of intellectual property rights.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Section 12: General Provisions */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-charcoal">12. General Provisions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-charcoal mb-2">12.1 Changes to Terms</h3>
              <p className="text-sm text-gray-600">
                We reserve the right to modify these Terms at any time. We will notify you of material changes by posting the updated Terms on the Platform and updating the "Last Updated" date. Your continued use of the Platform after changes constitutes acceptance of the modified Terms.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-charcoal mb-2">12.2 Entire Agreement</h3>
              <p className="text-sm text-gray-600">
                These Terms, together with our Privacy Policy and Cookie Policy, constitute the entire agreement between you and Andiza regarding the Platform.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-charcoal mb-2">12.3 Severability</h3>
              <p className="text-sm text-gray-600">
                If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-charcoal mb-2">12.4 Waiver</h3>
              <p className="text-sm text-gray-600">
                Our failure to enforce any right or provision of these Terms shall not constitute a waiver of such right or provision.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-charcoal mb-2">12.5 Assignment</h3>
              <p className="text-sm text-gray-600">
                You may not assign or transfer these Terms or your account without our prior written consent. We may assign these Terms without restriction.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Section 13: Contact Information */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-charcoal">13. Contact Information</CardTitle>
            <CardDescription>
              How to reach us with questions about these Terms.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-charcoal mb-2">Company Information</h3>
                  <p className="text-sm text-gray-600 mb-1">Andiza Co. Limited</p>
                  <p className="text-sm text-gray-600 mb-1">Registration No: 156009534</p>
                  <p className="text-sm text-gray-600">Nyarugenge, Kigali, Rwanda</p>
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal mb-2">Contact Details</h3>
                  <p className="text-sm text-gray-600 mb-1">
                    Email: <a href="mailto:legal@andiza.co.rw" className="text-burgundy hover:underline">legal@andiza.co.rw</a>
                  </p>
                  <p className="text-sm text-gray-600">
                    Website: <a href="https://www.andiza.co.rw" className="text-burgundy hover:underline">www.andiza.co.rw</a>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="bg-burgundy hover:bg-burgundy/90 text-white">
                <Link href="/privacy">
                  <Shield className="h-4 w-4 mr-2" />
                  Privacy Policy
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/cookies">
                  <FileText className="h-4 w-4 mr-2" />
                  Cookie Policy
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer Note */}
      <footer className="max-w-4xl mx-auto mt-16 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
        <p className="mb-2">&copy; 2025 Andiza Co. Limited. All rights reserved.</p>
        <p>Governed by the laws of the Republic of Rwanda.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          <Link href="/privacy" className="text-burgundy hover:underline">Privacy Policy</Link>
          <Link href="/cookies" className="text-burgundy hover:underline">Cookie Policy</Link>
          <Link href="/contact" className="text-burgundy hover:underline">Contact Us</Link>
        </div>
      </footer>
    </div>
  );
}
