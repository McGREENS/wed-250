'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Eye } from 'lucide-react';

export function DataAccessRequestModal() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-2" />
          Data Access Request
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-charcoal">Data Access Request Form</DialogTitle>
          <DialogDescription>
            Right to Access - Rwanda Law No 058/2021
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

          {/* Right to Access */}
          <div className="bg-burgundy/10 border border-burgundy/30 rounded-lg p-4">
            <h3 className="font-semibold text-charcoal mb-2">Your Right to Access</h3>
            <p className="text-sm text-gray-600">
              You have the right to obtain confirmation as to whether your personal data is being processed, and if so, to access that data and receive information about how it is being used, including the purposes of processing, categories of data, recipients, and retention periods.
            </p>
          </div>

          {/* Data Subject Information */}
          <div>
            <h3 className="font-semibold text-charcoal mb-3">Your Information</h3>
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
                  <label className="text-sm font-medium text-charcoal">Account ID (if known):</label>
                  <div className="mt-1 h-8 border-b border-gray-300"></div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-charcoal">National ID Number (for verification):</label>
                <div className="mt-1 h-8 border-b border-gray-300"></div>
              </div>
            </div>
          </div>

          {/* Request Details */}
          <div>
            <h3 className="font-semibold text-charcoal mb-3">Access Request Details</h3>
            <p className="text-sm text-gray-600 mb-3">
              Please specify what information you would like to access:
            </p>
            <div className="space-y-2 bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded mt-0.5"></div>
                <div>
                  <p className="text-sm font-medium text-charcoal">All Personal Data</p>
                  <p className="text-xs text-gray-600">Complete copy of all personal data we hold about you</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded mt-0.5"></div>
                <div>
                  <p className="text-sm font-medium text-charcoal">Account Information</p>
                  <p className="text-xs text-gray-600">Profile data, settings, and preferences</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded mt-0.5"></div>
                <div>
                  <p className="text-sm font-medium text-charcoal">Transaction History</p>
                  <p className="text-xs text-gray-600">Bookings, payments, and invoices</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded mt-0.5"></div>
                <div>
                  <p className="text-sm font-medium text-charcoal">Communication Records</p>
                  <p className="text-xs text-gray-600">Messages, emails, and support tickets</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded mt-0.5"></div>
                <div>
                  <p className="text-sm font-medium text-charcoal">Usage Data</p>
                  <p className="text-xs text-gray-600">Login history, activity logs, and analytics</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded mt-0.5"></div>
                <div>
                  <p className="text-sm font-medium text-charcoal">Specific Data (please specify below)</p>
                  <p className="text-xs text-gray-600">Particular categories or records</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div>
            <h3 className="font-semibold text-charcoal mb-2">Additional Details (Optional)</h3>
            <p className="text-sm text-gray-600 mb-2">
              Please provide any additional information about your request:
            </p>
            <div className="border border-gray-300 rounded-lg p-3 min-h-[80px] bg-white"></div>
          </div>

          {/* Preferred Format */}
          <div>
            <h3 className="font-semibold text-charcoal mb-3">Preferred Data Format</h3>
            <div className="space-y-2 bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded-full"></div>
                <p className="text-sm text-charcoal">PDF Document</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded-full"></div>
                <p className="text-sm text-charcoal">JSON File (machine-readable)</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded-full"></div>
                <p className="text-sm text-charcoal">CSV/Excel Spreadsheet</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded-full"></div>
                <p className="text-sm text-charcoal">Email Summary</p>
              </div>
            </div>
          </div>

          {/* Delivery Method */}
          <div>
            <h3 className="font-semibold text-charcoal mb-3">Preferred Delivery Method</h3>
            <div className="space-y-2 bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded-full"></div>
                <p className="text-sm text-charcoal">Email (secure encrypted attachment)</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded-full"></div>
                <p className="text-sm text-charcoal">Secure Download Link</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded-full"></div>
                <p className="text-sm text-charcoal">Physical Mail (printed copy)</p>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-charcoal mb-2">Important Notice</h3>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-2">
              <li>We will verify your identity before providing access to your data</li>
              <li>We will respond to your request within 30 days</li>
              <li>The first copy of your data is provided free of charge</li>
              <li>Additional copies may incur a reasonable administrative fee</li>
              <li>We may request additional information to verify your identity</li>
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
              <li>I understand this request is for lawful purposes only</li>
              <li>I will provide additional verification if requested</li>
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
              Submit this completed form along with proof of identity to:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-4">
              <li><strong>Email:</strong> dpo@andiza.rw</li>
              <li><strong>Mail:</strong> Andiza Co. Limited, Nyarugenge, Kigali, Rwanda</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-charcoal mb-2">Questions or Assistance?</h3>
            <p className="text-sm text-gray-600">
              Contact our Data Protection Officer at <a href="mailto:dpo@andiza.rw" className="text-burgundy hover:underline">dpo@andiza.rw</a>
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
