'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Users } from 'lucide-react';

export function ParentalConsentModal() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Users className="h-4 w-4 mr-2" />
          Parental Consent Form
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-charcoal">Parental Consent Form</DialogTitle>
          <DialogDescription>
            Rwanda Law No 058/2021 - Articles 9 and 8
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
              <p><strong>Email:</strong> privacy@andiza.co.rw</p>
              <p><strong>DPO:</strong> INYANGE Larissa (dpo@andiza.co.rw)</p>
            </div>
          </div>

          {/* Age Requirement Notice */}
          <div className="bg-burgundy/10 border border-burgundy/30 rounded-lg p-4">
            <h3 className="font-semibold text-charcoal mb-2">Age Requirement and Parental Consent</h3>
            <p className="text-sm text-gray-600 mb-2">
              The Andiza platform is intended for individuals aged 18 and above. Under Article 9 of Rwanda Law No 058/2021, minors (individuals under 18 years of age) may only use our services with the explicit consent of a parent or legal guardian.
            </p>
            <p className="text-sm text-gray-600">
              By completing this form, you (the parent/guardian) authorize your child to use the Andiza platform and consent to the processing of their personal data.
            </p>
          </div>

          {/* Minor's Information */}
          <div>
            <h3 className="font-semibold text-charcoal mb-3">Minor's Information</h3>
            <div className="space-y-3">
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-charcoal">Full Name:</label>
                  <div className="mt-1 h-8 border-b border-gray-300"></div>
                </div>
                <div>
                  <label className="text-sm font-medium text-charcoal">Date of Birth:</label>
                  <div className="mt-1 h-8 border-b border-gray-300"></div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-charcoal">Age:</label>
                  <div className="mt-1 h-8 border-b border-gray-300"></div>
                </div>
                <div>
                  <label className="text-sm font-medium text-charcoal">Email Address:</label>
                  <div className="mt-1 h-8 border-b border-gray-300"></div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-charcoal">Phone Number (if applicable):</label>
                <div className="mt-1 h-8 border-b border-gray-300"></div>
              </div>
            </div>
          </div>

          {/* Parent/Guardian Information */}
          <div>
            <h3 className="font-semibold text-charcoal mb-3">Parent/Guardian Information</h3>
            <div className="space-y-3">
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-charcoal">Full Name:</label>
                  <div className="mt-1 h-8 border-b border-gray-300"></div>
                </div>
                <div>
                  <label className="text-sm font-medium text-charcoal">Relationship to Minor:</label>
                  <div className="mt-1 h-8 border-b border-gray-300"></div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-charcoal">Email Address:</label>
                  <div className="mt-1 h-8 border-b border-gray-300"></div>
                </div>
                <div>
                  <label className="text-sm font-medium text-charcoal">Phone Number:</label>
                  <div className="mt-1 h-8 border-b border-gray-300"></div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-charcoal">National ID Number:</label>
                <div className="mt-1 h-8 border-b border-gray-300"></div>
              </div>
              <div>
                <label className="text-sm font-medium text-charcoal">Physical Address:</label>
                <div className="mt-1 h-8 border-b border-gray-300"></div>
              </div>
            </div>
          </div>

          {/* Purpose and Data Processing */}
          <div>
            <h3 className="font-semibold text-charcoal mb-2">Purpose of Data Processing</h3>
            <p className="text-sm text-gray-600 mb-2">
              Your child's personal data will be processed for the following purposes:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-4">
              <li>Account creation and management</li>
              <li>Wedding planning services and tools (if applicable)</li>
              <li>Communication and customer support</li>
              <li>Platform security and safety</li>
              <li>Compliance with legal obligations</li>
            </ul>
          </div>

          {/* Data Categories */}
          <div>
            <h3 className="font-semibold text-charcoal mb-2">Categories of Personal Data</h3>
            <p className="text-sm text-gray-600 mb-2">We will collect and process the following data about your child:</p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-4">
              <li>Identification data (name, date of birth)</li>
              <li>Contact information (email, phone)</li>
              <li>Account credentials (username, password)</li>
              <li>Usage data (platform activity, preferences)</li>
              <li>Technical data (IP address, device information)</li>
            </ul>
          </div>

          {/* Parental Rights */}
          <div>
            <h3 className="font-semibold text-charcoal mb-2">Your Rights as Parent/Guardian</h3>
            <p className="text-sm text-gray-600 mb-2">As a parent or legal guardian, you have the right to:</p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-4">
              <li>Access your child's personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your child's data</li>
              <li>Restrict processing of your child's data</li>
              <li>Object to certain processing activities</li>
              <li>Withdraw your consent at any time (Article 8)</li>
              <li>Lodge a complaint with the NCSA</li>
            </ul>
          </div>

          {/* Parental Responsibilities */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-charcoal mb-2">Parental Responsibilities</h3>
            <p className="text-sm text-gray-600 mb-2">
              By providing consent, you acknowledge that you are responsible for:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-4">
              <li>Supervising your child's use of the platform</li>
              <li>Ensuring your child uses the platform safely and appropriately</li>
              <li>Monitoring your child's account activity</li>
              <li>Keeping your child's account credentials secure</li>
              <li>Reviewing and understanding our Privacy Policy and Terms of Service</li>
            </ul>
          </div>

          {/* Consent Statement */}
          <div className="bg-burgundy/10 border border-burgundy/30 rounded-lg p-4">
            <h3 className="font-semibold text-charcoal mb-2">Parental Consent Statement</h3>
            <p className="text-sm text-gray-600 mb-3">
              I hereby confirm that:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-4">
              <li>I am the parent or legal guardian of the minor named above</li>
              <li>I have read and understood this consent form</li>
              <li>I have reviewed Andiza's Privacy Policy and Terms of Service</li>
              <li>I consent to my child using the Andiza platform</li>
              <li>I consent to the processing of my child's personal data as described</li>
              <li>I understand I can withdraw this consent at any time</li>
              <li>I understand my rights and responsibilities as outlined above</li>
              <li>The information provided is accurate and complete</li>
            </ul>
          </div>

          {/* Signature Section */}
          <div>
            <h3 className="font-semibold text-charcoal mb-3">Parent/Guardian Signature</h3>
            <div className="space-y-3">
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-charcoal">Signature:</label>
                  <div className="mt-1 h-8 border-b border-gray-400"></div>
                </div>
                <div>
                  <label className="text-sm font-medium text-charcoal">Date:</label>
                  <div className="mt-1 h-8 border-b border-gray-400"></div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-charcoal">Place:</label>
                <div className="mt-1 h-8 border-b border-gray-400"></div>
              </div>
            </div>
          </div>

          {/* Submission Instructions */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-charcoal mb-2">How to Submit This Form</h3>
            <p className="text-sm text-gray-600 mb-2">
              Please submit this completed form along with a copy of your ID to:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-4">
              <li><strong>Email:</strong> dpo@andiza.co.rw (scan and send as PDF)</li>
              <li><strong>Mail:</strong> Andiza Co. Limited, Nyarugenge, Kigali, Rwanda</li>
            </ul>
            <p className="text-sm text-gray-600 mt-2">
              We will verify your identity and relationship to the minor before processing the consent.
            </p>
          </div>

          {/* Contact */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-charcoal mb-2">Questions or Assistance?</h3>
            <p className="text-sm text-gray-600">
              If you have questions about this form or your child's data, please contact our Data Protection Officer at <a href="mailto:dpo@andiza.co.rw" className="text-burgundy hover:underline">dpo@andiza.co.rw</a>
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
