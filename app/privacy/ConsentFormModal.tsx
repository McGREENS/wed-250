'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { FileText } from 'lucide-react';

export function ConsentFormModal() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileText className="h-4 w-4 mr-2" />
          Data Subject Consent Form
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-charcoal">Data Subject Consent Form</DialogTitle>
          <DialogDescription>
            Rwanda Law No 058/2021 - Articles 6 and 7
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Company Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-charcoal mb-2">Data Controller Information</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Company:</strong> Andiza Co. Limited</p>
              <p><strong>Registration No:</strong> 156009534</p>
              <p><strong>Address:</strong> Nyarugenge, Kigali, Rwanda</p>
              <p><strong>Email:</strong> privacy@andiza.rw</p>
              <p><strong>DPO:</strong> INYANGE Larissa (dpo@andiza.rw)</p>
            </div>
          </div>

          {/* Purpose */}
          <div>
            <h3 className="font-semibold text-charcoal mb-2">Purpose of Data Processing</h3>
            <p className="text-sm text-gray-600 mb-2">
              By providing your consent, you authorize Andiza Co. Limited to collect and process your personal data for the following purposes:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-4">
              <li>Account creation and management</li>
              <li>Wedding planning services and tools</li>
              <li>Booking and vendor coordination</li>
              <li>Communication and customer support</li>
              <li>Payment processing and invoicing</li>
              <li>Platform improvement and analytics</li>
              <li>Marketing communications (optional)</li>
            </ul>
          </div>

          {/* Data Categories */}
          <div>
            <h3 className="font-semibold text-charcoal mb-2">Categories of Personal Data</h3>
            <p className="text-sm text-gray-600 mb-2">We will process the following categories of your personal data:</p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-4">
              <li>Identification data (name, date of birth, ID number)</li>
              <li>Contact information (email, phone, address)</li>
              <li>Demographic information (gender, nationality)</li>
              <li>Professional information (for vendors)</li>
              <li>Financial information (payment details, transactions)</li>
              <li>Technical data (IP address, cookies, device info)</li>
              <li>Event information (wedding details, bookings)</li>
            </ul>
          </div>

          {/* Legal Basis */}
          <div>
            <h3 className="font-semibold text-charcoal mb-2">Legal Basis for Processing</h3>
            <p className="text-sm text-gray-600">
              Your personal data will be processed based on your explicit consent (Article 6), contractual necessity, legal obligations, and legitimate interests as outlined in our Privacy Policy.
            </p>
          </div>

          {/* Recipients */}
          <div>
            <h3 className="font-semibold text-charcoal mb-2">Data Recipients</h3>
            <p className="text-sm text-gray-600 mb-2">Your personal data may be shared with:</p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-4">
              <li>Authorized Andiza employees and contractors</li>
              <li>Wedding vendors on our platform (for bookings)</li>
              <li>Third-party service providers (hosting, payment, email)</li>
              <li>Regulatory authorities (when required by law)</li>
            </ul>
          </div>

          {/* Retention */}
          <div>
            <h3 className="font-semibold text-charcoal mb-2">Data Retention Period</h3>
            <p className="text-sm text-gray-600">
              Your personal data will be retained for the duration of your account plus 2 years after account closure, or as required by law (e.g., 7 years for financial records).
            </p>
          </div>

          {/* Your Rights */}
          <div>
            <h3 className="font-semibold text-charcoal mb-2">Your Rights</h3>
            <p className="text-sm text-gray-600 mb-2">You have the following rights under Rwanda Law No 058/2021:</p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-4">
              <li>Right to access your personal data</li>
              <li>Right to rectification of inaccurate data</li>
              <li>Right to erasure (right to be forgotten)</li>
              <li>Right to restriction of processing</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
              <li>Right to withdraw consent at any time (Article 8)</li>
              <li>Right to lodge a complaint with NCSA</li>
            </ul>
          </div>

          {/* Consent Statement */}
          <div className="bg-burgundy/10 border border-burgundy/30 rounded-lg p-4">
            <h3 className="font-semibold text-charcoal mb-2">Consent Statement</h3>
            <p className="text-sm text-gray-600 mb-3">
              I hereby confirm that:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-4">
              <li>I have read and understood this consent form</li>
              <li>I freely give my consent for Andiza to process my personal data</li>
              <li>I understand my consent is specific to the purposes stated above</li>
              <li>I understand I can withdraw my consent at any time</li>
              <li>I understand withdrawal does not affect prior lawful processing</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-charcoal mb-2">Questions or Concerns?</h3>
            <p className="text-sm text-gray-600">
              If you have any questions about this consent form or how we process your data, please contact our Data Protection Officer at <a href="mailto:dpo@andiza.rw" className="text-burgundy hover:underline">dpo@andiza.rw</a>
            </p>
          </div>

          {/* Note */}
          <div className="text-xs text-gray-500 italic">
            <p>
              Note: By creating an account on the Andiza platform, you provide your consent through an affirmative action (clicking "I Agree" or "Sign Up"). This form is provided for your information and records.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button 
            className="bg-burgundy hover:bg-burgundy/90 text-white"
            onClick={() => {
              window.print();
            }}
          >
            Print Form
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
