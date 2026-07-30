'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { XCircle } from 'lucide-react';

export function ConsentWithdrawalModal() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <XCircle className="h-4 w-4 mr-2" />
          Consent Withdrawal Form
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-charcoal">Consent Withdrawal Form</DialogTitle>
          <DialogDescription>
            Rwanda Law No 058/2021 - Article 8
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

          {/* Your Right to Withdraw */}
          <div className="bg-burgundy/10 border border-burgundy/30 rounded-lg p-4">
            <h3 className="font-semibold text-charcoal mb-2">Your Right to Withdraw Consent</h3>
            <p className="text-sm text-gray-600">
              Under Article 8 of Rwanda Law No 058/2021, you have the right to withdraw your consent to the processing of your personal data at any time. Withdrawal of consent does not affect the lawfulness of processing based on consent before its withdrawal.
            </p>
          </div>

          {/* Data Subject Information */}
          <div>
            <h3 className="font-semibold text-charcoal mb-3">Data Subject Information</h3>
            <div className="space-y-3">
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-charcoal">Full Name:</label>
                  <div className="mt-1 h-8 border-b border-gray-300"></div>
                </div>
                <div>
                  <label className="text-sm font-medium text-charcoal">Email Address:</label>
                  <div className="mt-1 h-8 border-b border-gray-300"></div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-charcoal">Phone Number:</label>
                  <div className="mt-1 h-8 border-b border-gray-300"></div>
                </div>
                <div>
                  <label className="text-sm font-medium text-charcoal">Account ID (if applicable):</label>
                  <div className="mt-1 h-8 border-b border-gray-300"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Consent to Withdraw */}
          <div>
            <h3 className="font-semibold text-charcoal mb-3">I Wish to Withdraw Consent For:</h3>
            <p className="text-sm text-gray-600 mb-3">
              Please select the specific processing activities for which you wish to withdraw your consent:
            </p>
            <div className="space-y-2 bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded mt-0.5"></div>
                <div>
                  <p className="text-sm font-medium text-charcoal">Marketing Communications</p>
                  <p className="text-xs text-gray-600">Newsletters, promotional emails, and marketing materials</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded mt-0.5"></div>
                <div>
                  <p className="text-sm font-medium text-charcoal">Optional Profile Features</p>
                  <p className="text-xs text-gray-600">Non-essential profile information and preferences</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded mt-0.5"></div>
                <div>
                  <p className="text-sm font-medium text-charcoal">Analytics and Performance Tracking</p>
                  <p className="text-xs text-gray-600">Optional cookies and usage analytics</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded mt-0.5"></div>
                <div>
                  <p className="text-sm font-medium text-charcoal">Third-Party Data Sharing</p>
                  <p className="text-xs text-gray-600">Sharing data with partners for marketing purposes</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded mt-0.5"></div>
                <div>
                  <p className="text-sm font-medium text-charcoal">All Consent-Based Processing</p>
                  <p className="text-xs text-gray-600">Withdraw all consents (may affect account functionality)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h3 className="font-semibold text-charcoal mb-2">Additional Information (Optional)</h3>
            <p className="text-sm text-gray-600 mb-2">
              Please provide any additional details about your withdrawal request:
            </p>
            <div className="border border-gray-300 rounded-lg p-3 min-h-[80px] bg-white"></div>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-charcoal mb-2">Important Notice</h3>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-2">
              <li>Withdrawal of consent does not affect processing that occurred before withdrawal</li>
              <li>Some processing may continue based on other legal grounds (e.g., contractual necessity, legal obligations)</li>
              <li>Withdrawing consent for essential services may affect your ability to use certain platform features</li>
              <li>We will process your withdrawal request within 30 days</li>
              <li>You will receive confirmation once your request is processed</li>
            </ul>
          </div>

          {/* Declaration */}
          <div className="bg-burgundy/10 border border-burgundy/30 rounded-lg p-4">
            <h3 className="font-semibold text-charcoal mb-2">Declaration</h3>
            <p className="text-sm text-gray-600 mb-3">
              I hereby declare that:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-4">
              <li>I am the data subject or authorized representative</li>
              <li>The information provided is accurate and complete</li>
              <li>I understand the consequences of withdrawing my consent</li>
              <li>I wish to withdraw my consent as indicated above</li>
            </ul>
            <div className="mt-4 space-y-3">
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
            </div>
          </div>

          {/* Submission Instructions */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-charcoal mb-2">How to Submit This Form</h3>
            <p className="text-sm text-gray-600 mb-2">
              You can submit this consent withdrawal form through any of the following methods:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-4">
              <li><strong>Email:</strong> Send completed form to dpo@andiza.rw</li>
              <li><strong>Online:</strong> Update preferences in your account settings</li>
              <li><strong>Marketing Emails:</strong> Use the unsubscribe link in any marketing email</li>
              <li><strong>Mail:</strong> Send to Andiza Co. Limited, Nyarugenge, Kigali, Rwanda</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-charcoal mb-2">Questions or Assistance?</h3>
            <p className="text-sm text-gray-600">
              If you need help completing this form or have questions about withdrawing consent, please contact our Data Protection Officer at <a href="mailto:dpo@andiza.rw" className="text-burgundy hover:underline">dpo@andiza.rw</a>
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
