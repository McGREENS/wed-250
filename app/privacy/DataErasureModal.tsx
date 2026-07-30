'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Trash2 } from 'lucide-react';

export function DataErasureModal() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Trash2 className="h-4 w-4 mr-2" />
          Data Erasure Request
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-charcoal">Data Erasure Request Form</DialogTitle>
          <DialogDescription>
            Right to Erasure (Right to be Forgotten) - Rwanda Law No 058/2021
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

          {/* Right to Erasure */}
          <div className="bg-burgundy/10 border border-burgundy/30 rounded-lg p-4">
            <h3 className="font-semibold text-charcoal mb-2">Your Right to Erasure</h3>
            <p className="text-sm text-gray-600">
              You have the right to request deletion of your personal data under certain circumstances, such as when the data is no longer necessary for the purposes for which it was collected, when you withdraw consent, or when you object to processing.
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
            </div>
          </div>

          {/* Erasure Request Type */}
          <div>
            <h3 className="font-semibold text-charcoal mb-3">Erasure Request Type</h3>
            <p className="text-sm text-gray-600 mb-3">
              Please select what you would like to delete:
            </p>
            <div className="space-y-2 bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded-full mt-0.5"></div>
                <div>
                  <p className="text-sm font-medium text-charcoal">Delete All Personal Data and Close Account</p>
                  <p className="text-xs text-gray-600">Permanently delete all data and close your account</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded-full mt-0.5"></div>
                <div>
                  <p className="text-sm font-medium text-charcoal">Delete Specific Data Categories</p>
                  <p className="text-xs text-gray-600">Delete only certain types of data (specify below)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Specific Data to Delete */}
          <div>
            <h3 className="font-semibold text-charcoal mb-3">Specific Data to Delete (if applicable)</h3>
            <p className="text-sm text-gray-600 mb-3">
              If you selected "Delete Specific Data Categories", please specify:
            </p>
            <div className="space-y-2 bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded mt-0.5"></div>
                <p className="text-sm text-charcoal">Profile information (photos, bio, preferences)</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded mt-0.5"></div>
                <p className="text-sm text-charcoal">Communication records (messages, emails)</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded mt-0.5"></div>
                <p className="text-sm text-charcoal">Usage data (activity logs, analytics)</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded mt-0.5"></div>
                <p className="text-sm text-charcoal">Marketing preferences and consent records</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded mt-0.5"></div>
                <p className="text-sm text-charcoal">Other (please specify below)</p>
              </div>
            </div>
          </div>

          {/* Reason for Erasure */}
          <div>
            <h3 className="font-semibold text-charcoal mb-3">Reason for Erasure Request</h3>
            <p className="text-sm text-gray-600 mb-3">
              Please select the legal ground for your erasure request:
            </p>
            <div className="space-y-2 bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded-full mt-0.5"></div>
                <p className="text-sm text-charcoal">Data no longer necessary for original purpose</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded-full mt-0.5"></div>
                <p className="text-sm text-charcoal">Withdrawal of consent</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded-full mt-0.5"></div>
                <p className="text-sm text-charcoal">Objection to processing</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded-full mt-0.5"></div>
                <p className="text-sm text-charcoal">Data processed unlawfully</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded-full mt-0.5"></div>
                <p className="text-sm text-charcoal">Legal obligation to erase</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded-full mt-0.5"></div>
                <p className="text-sm text-charcoal">Other (please specify below)</p>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div>
            <h3 className="font-semibold text-charcoal mb-2">Additional Details</h3>
            <p className="text-sm text-gray-600 mb-2">
              Please provide any additional information about your erasure request:
            </p>
            <div className="border border-gray-300 rounded-lg p-3 min-h-[80px] bg-white"></div>
          </div>

          {/* Data Export Option */}
          <div>
            <h3 className="font-semibold text-charcoal mb-3">Data Export Before Deletion</h3>
            <p className="text-sm text-gray-600 mb-3">
              Would you like to receive a copy of your data before deletion?
            </p>
            <div className="space-y-2 bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded-full"></div>
                <p className="text-sm text-charcoal">Yes, send me a copy of my data before deletion</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded-full"></div>
                <p className="text-sm text-charcoal">No, proceed with deletion without export</p>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-charcoal mb-2">Important Notice</h3>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-2">
              <li>Deletion is permanent and cannot be undone</li>
              <li>We may retain certain data where required by law (e.g., financial records for 7 years)</li>
              <li>We will respond to your request within 30 days</li>
              <li>We may refuse erasure if we have legal grounds to retain the data</li>
              <li>Account deletion will cancel all active bookings and services</li>
              <li>We will notify third parties to whom data has been disclosed</li>
            </ul>
          </div>

          {/* Consequences Acknowledgment */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-charcoal mb-2">Acknowledgment of Consequences</h3>
            <p className="text-sm text-gray-600 mb-2">
              I understand and acknowledge that:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-4">
              <li>My account will be permanently deleted</li>
              <li>I will lose access to all platform features and services</li>
              <li>All bookings and transactions will be cancelled</li>
              <li>This action cannot be reversed</li>
              <li>Some data may be retained for legal compliance</li>
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
              <li>I understand the consequences of data erasure</li>
              <li>I request permanent deletion of my data as specified above</li>
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
