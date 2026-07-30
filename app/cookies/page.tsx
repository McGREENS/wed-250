import { Metadata } from 'next';
import Link from 'next/link';
import { Cookie, Shield, Settings, AlertCircle, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';

export const metadata: Metadata = {
  title: 'Cookie Policy | Andiza',
  description: 'Learn about how Andiza uses cookies and similar technologies on our platform.',
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-cream bg-noise py-20 px-4 md:px-8">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto text-center mb-16">
        <div className="inline-flex items-center gap-3 bg-burgundy/10 p-4 rounded-2xl mb-6">
          <Cookie className="h-8 w-8 text-burgundy" />
          <h1 className="text-4xl md:text-5xl font-serif text-charcoal">
            Cookie Policy
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Learn how <strong>Andiza</strong> uses cookies and similar technologies to enhance your experience on our platform.
        </p>
        <p className="text-sm text-gray-500 mt-4">
          Last Updated: January 2025
        </p>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Section 1: What Are Cookies */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-charcoal flex items-center gap-2">
              <Cookie className="h-6 w-6 text-burgundy" />
              1. What Are Cookies?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our platform.
            </p>
            <p className="text-sm text-gray-600">
              We also use similar technologies such as web beacons, pixels, and local storage to collect information about your interactions with our services.
            </p>
          </CardContent>
        </Card>

        {/* Section 2: Types of Cookies We Use */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-charcoal">2. Types of Cookies We Use</CardTitle>
            <CardDescription>
              We use different types of cookies for various purposes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Essential Cookies */}
              <div className="bg-burgundy/5 border border-burgundy/20 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-burgundy flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal mb-2">Essential Cookies (Required)</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      These cookies are necessary for the website to function and cannot be disabled. They enable core functionality such as security, authentication, and accessibility.
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      <li>Session management and authentication</li>
                      <li>Security and fraud prevention</li>
                      <li>Load balancing and performance</li>
                      <li>Cookie consent preferences</li>
                    </ul>
                    <p className="text-xs text-gray-500 mt-3">
                      <strong>Retention:</strong> Session cookies (deleted when browser closes) or up to 1 year
                    </p>
                  </div>
                </div>
              </div>

              {/* Functional Cookies */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <Settings className="h-6 w-6 text-charcoal flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal mb-2">Functional Cookies (Optional)</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      <li>Language and region preferences</li>
                      <li>User interface customization</li>
                      <li>Recently viewed items</li>
                      <li>Saved search filters</li>
                    </ul>
                    <p className="text-xs text-gray-500 mt-3">
                      <strong>Retention:</strong> Up to 1 year
                    </p>
                  </div>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-6 w-6 text-charcoal flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal mb-2">Analytics Cookies (Optional)</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      <li>Page views and navigation patterns</li>
                      <li>Time spent on pages</li>
                      <li>Error tracking and debugging</li>
                      <li>Performance monitoring</li>
                    </ul>
                    <p className="text-xs text-gray-500 mt-3">
                      <strong>Retention:</strong> Up to 2 years
                    </p>
                  </div>
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <XCircle className="h-6 w-6 text-charcoal flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal mb-2">Marketing Cookies (Optional)</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      These cookies track your online activity to help us deliver more relevant advertising and measure campaign effectiveness.
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      <li>Targeted advertising</li>
                      <li>Social media integration</li>
                      <li>Campaign performance tracking</li>
                      <li>Retargeting and remarketing</li>
                    </ul>
                    <p className="text-xs text-gray-500 mt-3">
                      <strong>Retention:</strong> Up to 2 years
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Third-Party Cookies */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-charcoal">3. Third-Party Cookies</CardTitle>
            <CardDescription>
              Information about third-party services that use cookies on our platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              We may use third-party service providers who set cookies on our website to provide their services:
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <ul className="space-y-3 text-sm text-gray-600">
                <li><strong>Analytics Providers:</strong> Google Analytics, Vercel Analytics</li>
                <li><strong>Payment Processors:</strong> Stripe, PayPal</li>
                <li><strong>Communication Tools:</strong> Email service providers</li>
                <li><strong>Social Media:</strong> Facebook, Instagram, Twitter</li>
              </ul>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              These third parties have their own privacy policies and cookie policies. We recommend reviewing their policies to understand how they use cookies.
            </p>
          </CardContent>
        </Card>

        {/* Section 4: Your Cookie Choices */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-charcoal flex items-center gap-2">
              <Settings className="h-6 w-6 text-burgundy" />
              4. Your Cookie Choices
            </CardTitle>
            <CardDescription>
              How to manage and control cookies on our platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              You have the right to choose whether to accept or reject cookies. You can exercise your cookie preferences through:
            </p>
            
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-charcoal mb-2">Cookie Consent Banner</h3>
                <p className="text-sm text-gray-600">
                  When you first visit our website, you'll see a cookie consent banner where you can accept or reject optional cookies. You can change your preferences at any time by clicking the cookie settings link in the footer.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-charcoal mb-2">Browser Settings</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Most web browsers allow you to control cookies through their settings. You can:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Block all cookies</li>
                  <li>Block third-party cookies only</li>
                  <li>Delete cookies when you close your browser</li>
                  <li>View and delete individual cookies</li>
                </ul>
                <p className="text-xs text-gray-500 mt-3">
                  Note: Blocking essential cookies may prevent you from using certain features of our website.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-charcoal mb-2">Opt-Out Links</h3>
                <p className="text-sm text-gray-600 mb-3">
                  You can opt out of specific third-party cookies:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Google Analytics: <a href="https://tools.google.com/dlpage/gaoptout" className="text-burgundy hover:underline" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out</a></li>
                  <li>Advertising cookies: <a href="http://www.youronlinechoices.com/" className="text-burgundy hover:underline" target="_blank" rel="noopener noreferrer">Your Online Choices</a></li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 5: Legal Basis */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-charcoal flex items-center gap-2">
              <Shield className="h-6 w-6 text-burgundy" />
              5. Legal Basis for Using Cookies
            </CardTitle>
            <CardDescription>
              Our legal grounds for processing cookie data under Rwanda law.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Under Rwanda Law No 058/2021 on the Protection of Personal Data and Privacy (Articles 6-9), we process cookie data based on:
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <ul className="space-y-3 text-sm text-gray-600">
                <li><strong>Consent (Article 6):</strong> For optional cookies (functional, analytics, marketing), we obtain your explicit consent through our cookie banner.</li>
                <li><strong>Legitimate Interest (Article 7):</strong> For essential cookies necessary to provide our services and ensure security.</li>
                <li><strong>Contractual Necessity:</strong> Some cookies are required to fulfill our contract with you (e.g., authentication cookies).</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Section 6: Updates to This Policy */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-charcoal">6. Updates to This Cookie Policy</CardTitle>
            <CardDescription>
              How we communicate changes to this policy.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our website with a new "Last Updated" date.
            </p>
          </CardContent>
        </Card>

        {/* Section 7: Contact Us */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-charcoal">7. Contact Us</CardTitle>
            <CardDescription>
              Get in touch with questions about our cookie practices.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              If you have questions about our use of cookies, please contact us:
            </p>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-charcoal mb-2">General Inquiries</h3>
                  <p className="text-sm text-gray-600">
                    Email: <a href="mailto:privacy@andiza.rw" className="text-burgundy hover:underline">privacy@andiza.rw</a>
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal mb-2">Data Protection Officer</h3>
                  <p className="text-sm text-gray-600">
                    Email: <a href="mailto:dpo@andiza.rw" className="text-burgundy hover:underline">dpo@andiza.rw</a>
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
        <p>Compliant with Rwanda Law No 058/2021 on Data Protection and Privacy.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          <Link href="/privacy" className="text-burgundy hover:underline">Privacy Policy</Link>
          <Link href="/terms" className="text-burgundy hover:underline">Terms of Service</Link>
          <Link href="/contact" className="text-burgundy hover:underline">Contact Us</Link>
        </div>
      </footer>
    </div>
  );
}
