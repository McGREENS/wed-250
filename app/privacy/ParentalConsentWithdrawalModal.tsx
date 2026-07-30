'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { UserX } from 'lucide-react';

export function ParentalConsentWithdrawalModal() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <UserX className="h-4 w-4 mr-2" />
          Parental Consent Withdrawal
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-charcoal">Parental Consent Withdrawal Form</DialogTitle>
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
              <p><strong>Email:</strong> privacy@andiza.rw</p>
              <p><strong>DPO:</strong> INYANGE Larissa (dpo@andiza.rw)</p>
            </div>
          </div>

          {/* Right to Withdraw */}
          <div className="bg-burgundy/10 border border-burgundy/30 rounded-lg p-4">
            <h3 className="font-semibold text-charcoal mb-2">Your Right to Withdraw Parental Consent</h3>
            <p className="text-sm text-gray-600">
              Under Articles 8 and 9 of Rwanda Law No 058/2021, you have the right to withdraw your parental consent at any time. Upon withdrawal, your child's account will be deactivated and their personal data will be deleted in accordance with our data retention policy.
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
                  <label className="text-sm font-medium text-charcoal">Email Address:</label>
                  <div className="mt-1 h-8 border-b border-gray-300"></div>
                </div>
                <div>
                  <label className="text-sm font-medium text-charcoal">Account ID (if known):</label>
                  <div className="mt-1 h-8 border-b border-gray-300"></div>
                </div>
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
            </div>
          </div>

          {/* Withdrawal Request */}
          <div>
            <h3 className="font-semibold text-charcoal mb-3">Withdrawal Request</h3>
            <p className="text-sm text-gray-600 mb-3">
              Please select the action you wish to take:
            </p>
            <div className="space-y-2 bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded-full mt-0.5"></div>
                <div>
                  <p className="text-sm font-medium text-charcoal">Withdraw Consent and Delete Account</p>
                  <p className="text-xs text-gray-600">Permanently delete my child's account and all associated data</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded-full mt-0.5"></div>
                <div>
                  <p className="text-sm font-medium text-charcoal">Withdraw Consent and Suspend Account</p>
                  <p className="text-xs text-gray-600">Temporarily suspend account until further notice</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded-full mt-0.5"></div>
                <div>
                  <p className="text-sm font-medium text-charcoal">Request Data Export Before Deletion</p>
                  <p className="text-xs text-gray-600">Receive a copy of my child's data before account deletion</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reason for Withdrawal */}
          <div>
            <h3 className="font-semibold text-charcoal mb-2">Reason for Withdrawal (Optional)</h3>
            <p className="text-sm text-gray-600 mb-2">
              Please provide any additional information about your withdrawal request:
            </p>
            <div className="border border-gray-300 rounded-lg p-3 min-h-[80px] bg-white"></div>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-charcoal mb-2">Important Notice</h3>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-2">
              <li>Withdrawal of consent will result in immediate account deactivation</li>
              <li>Your child will no longer be able to access the platform</li>
              <li>Personal data will be deleted within 30 days, except where retention is required by law</li>
              <li>Some data may be retained for legal compliance (e.g., transaction records for 7 years)</li>
              <li>This action cannot be undone without submitting a new parental consent form</li>
              <li>Any active bookings or services will be cancelled</li>
            </ul>
          </div>

          {/* Consequences Acknowledgment */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-charcoal mb-2">Acknowledgment of Consequences</h3>
            <p className="text-sm text-gray-600 mb-2">
              I understand and acknowledge that:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-4">
              <li>My child's account will be deactivated immediately</li>
              <li>All account data will be deleted (subject to legal retention requirements)</li>
              <li>My child will lose access to all platform features and services</li>
              <li>Any pending bookings or transactions will be cancelled</li>
              <li>This withdrawal does not affect processing that occurred before withdrawal</li>
            </ul>
          </div>

          {/* Declaration */}
          <div className="bg-burgundy/10 border border-burgundy/30 rounded-lg p-4">
            <h3 className="font-semibold text-charcoal mb-2">Declaration</h3>
            <p className="text-sm text-gray-600 mb-3">
              I hereby declare that:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-4">
              <li>I am the parent or legal guardian who provided the original consent</li>
              <li>The information provided is accurate and complete</li>
              <li>I understand the consequences of withdrawing my consent</li>
              <li>I wish to withdraw my parental consent as indicated above</li>
              <li>I authorize Andiza to process this withdrawal request</li>
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
              <li><strong>Email:</strong> dpo@andiza.rw (scan and send as PDF)</li>
              <li><strong>Mail:</strong> Andiza Co. Limited, Nyarugenge, Kigali, Rwanda</li>
            </ul>
            <p className="text-sm text-gray-600 mt-2">
              We will verify your identity and process your request within 30 days. You will receive confirmation once the withdrawal is complete.
            </p>
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
