'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Edit } from 'lucide-react';

export function DataRectificationModal() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Data Rectification Request
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-charcoal">Data Rectification Request Form</DialogTitle>
          <DialogDescription>
            Right to Rectification - Rwanda Law No 058/2021
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

          {/* Right to Rectification */}
          <div className="bg-burgundy/10 border border-burgundy/30 rounded-lg p-4">
            <h3 className="font-semibold text-charcoal mb-2">Your Right to Rectification</h3>
            <p className="text-sm text-gray-600">
              You have the right to request correction of inaccurate personal data and to have incomplete data completed. We will rectify your data without undue delay and notify any third parties to whom the data has been disclosed.
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

          {/* Data to be Corrected */}
          <div>
            <h3 className="font-semibold text-charcoal mb-3">Data to be Corrected</h3>
            <p className="text-sm text-gray-600 mb-3">
              Please specify the inaccurate or incomplete data that needs to be corrected:
            </p>
            
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-charcoal mb-2">Correction 1</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-charcoal">Field/Data Category:</label>
                    <div className="mt-1 h-8 border-b border-gray-300"></div>
                    <p className="text-xs text-gray-500 mt-1">e.g., Name, Email, Phone, Address, Date of Birth</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-charcoal">Current (Incorrect) Value:</label>
                    <div className="mt-1 h-8 border-b border-gray-300"></div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-charcoal">Correct Value:</label>
                    <div className="mt-1 h-8 border-b border-gray-300"></div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-charcoal">Reason for Correction:</label>
                    <div className="mt-1 h-8 border-b border-gray-300"></div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-charcoal mb-2">Correction 2 (if applicable)</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-charcoal">Field/Data Category:</label>
                    <div className="mt-1 h-8 border-b border-gray-300"></div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-charcoal">Current (Incorrect) Value:</label>
                    <div className="mt-1 h-8 border-b border-gray-300"></div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-charcoal">Correct Value:</label>
                    <div className="mt-1 h-8 border-b border-gray-300"></div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-charcoal">Reason for Correction:</label>
                    <div className="mt-1 h-8 border-b border-gray-300"></div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-charcoal mb-2">Correction 3 (if applicable)</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-charcoal">Field/Data Category:</label>
                    <div className="mt-1 h-8 border-b border-gray-300"></div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-charcoal">Current (Incorrect) Value:</label>
                    <div className="mt-1 h-8 border-b border-gray-300"></div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-charcoal">Correct Value:</label>
                    <div className="mt-1 h-8 border-b border-gray-300"></div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-charcoal">Reason for Correction:</label>
                    <div className="mt-1 h-8 border-b border-gray-300"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Supporting Documentation */}
          <div>
            <h3 className="font-semibold text-charcoal mb-2">Supporting Documentation</h3>
            <p className="text-sm text-gray-600 mb-2">
              Please list any documents you are attaching to support your rectification request:
            </p>
            <div className="border border-gray-300 rounded-lg p-3 min-h-[60px] bg-white"></div>
            <p className="text-xs text-gray-500 mt-2">
              e.g., Updated ID card, proof of address, official documents showing correct information
            </p>
          </div>

          {/* Additional Information */}
          <div>
            <h3 className="font-semibold text-charcoal mb-2">Additional Information (Optional)</h3>
            <p className="text-sm text-gray-600 mb-2">
              Please provide any additional details about your rectification request:
            </p>
            <div className="border border-gray-300 rounded-lg p-3 min-h-[80px] bg-white"></div>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-charcoal mb-2">Important Notice</h3>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-2">
              <li>We will verify the accuracy of the corrections before implementing them</li>
              <li>We may request supporting documentation to verify the correct information</li>
              <li>We will respond to your request within 30 days</li>
              <li>We will notify third parties to whom the data has been disclosed</li>
              <li>You will receive confirmation once the corrections are made</li>
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
              <li>The corrections requested are truthful and accurate</li>
              <li>I will provide supporting documentation if requested</li>
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
              Submit this completed form along with supporting documents to:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-4">
              <li><strong>Email:</strong> dpo@andiza.co.rw</li>
              <li><strong>Mail:</strong> Andiza Co. Limited, Nyarugenge, Kigali, Rwanda</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-charcoal mb-2">Questions or Assistance?</h3>
            <p className="text-sm text-gray-600">
              Contact our Data Protection Officer at <a href="mailto:dpo@andiza.co.rw" className="text-burgundy hover:underline">dpo@andiza.co.rw</a>
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
