'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Download } from 'lucide-react';

export function DataPortabilityModal() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Data Portability Request
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-charcoal">Data Portability Request Form</DialogTitle>
          <DialogDescription>
            Right to Data Portability - Rwanda Law No 058/2021
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

          {/* Right to Portability */}
          <div className="bg-burgundy/10 border border-burgundy/30 rounded-lg p-4">
            <h3 className="font-semibold text-charcoal mb-2">Your Right to Data Portability</h3>
            <p className="text-sm text-gray-600">
              You have the right to receive your personal data in a structured, commonly used, and machine-readable format and to transmit that data to another controller. This right applies to data you provided to us based on consent or contract.
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

          {/* Data to Export */}
          <div>
            <h3 className="font-semibold text-charcoal mb-3">Data to Export</h3>
            <p className="text-sm text-gray-600 mb-3">
              Please select the data you would like to export:
            </p>
            <div className="space-y-2 bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded mt-0.5"></div>
                <div>
                  <p className="text-sm font-medium text-charcoal">All Personal Data</p>
                  <p className="text-xs text-gray-600">Complete export of all your data</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded mt-0.5"></div>
                <div>
                  <p className="text-sm font-medium text-charcoal">Profile Information</p>
                  <p className="text-xs text-gray-600">Account details, preferences, settings</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded mt-0.5"></div>
                <div>
                  <p className="text-sm font-medium text-charcoal">Booking History</p>
                  <p className="text-xs text-gray-600">All bookings, quotes, and reservations</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded mt-0.5"></div>
                <div>
                  <p className="text-sm font-medium text-charcoal">Transaction Records</p>
                  <p className="text-xs text-gray-600">Payment history and invoices</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded mt-0.5"></div>
                <div>
                  <p className="text-sm font-medium text-charcoal">Communication History</p>
                  <p className="text-xs text-gray-600">Messages, emails, and support tickets</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded mt-0.5"></div>
                <div>
                  <p className="text-sm font-medium text-charcoal">Wedding Planning Data</p>
                  <p className="text-xs text-gray-600">Checklists, budgets, guest lists, notes</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded mt-0.5"></div>
                <div>
                  <p className="text-sm font-medium text-charcoal">Reviews and Ratings</p>
                  <p className="text-xs text-gray-600">Your reviews and feedback</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded mt-0.5"></div>
                <div>
                  <p className="text-sm font-medium text-charcoal">Favorites and Saved Items</p>
                  <p className="text-xs text-gray-600">Saved vendors, venues, and services</p>
                </div>
              </div>
            </div>
          </div>

          {/* Export Format */}
          <div>
            <h3 className="font-semibold text-charcoal mb-3">Preferred Export Format</h3>
            <p className="text-sm text-gray-600 mb-3">
              Select the format for your data export:
            </p>
            <div className="space-y-2 bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded-full mt-0.5"></div>
                <div>
                  <p className="text-sm font-medium text-charcoal">JSON (Machine-Readable)</p>
                  <p className="text-xs text-gray-600">Structured format for easy import to other systems</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded-full mt-0.5"></div>
                <div>
                  <p className="text-sm font-medium text-charcoal">CSV/Excel</p>
                  <p className="text-xs text-gray-600">Spreadsheet format for easy viewing and analysis</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded-full mt-0.5"></div>
                <div>
                  <p className="text-sm font-medium text-charcoal">PDF</p>
                  <p className="text-xs text-gray-600">Human-readable document format</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded-full mt-0.5"></div>
                <div>
                  <p className="text-sm font-medium text-charcoal">XML</p>
                  <p className="text-xs text-gray-600">Structured markup format</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded-full mt-0.5"></div>
                <div>
                  <p className="text-sm font-medium text-charcoal">Multiple Formats</p>
                  <p className="text-xs text-gray-600">Receive data in multiple formats</p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Method */}
          <div>
            <h3 className="font-semibold text-charcoal mb-3">Delivery Method</h3>
            <p className="text-sm text-gray-600 mb-3">
              How would you like to receive your data?
            </p>
            <div className="space-y-2 bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded-full mt-0.5"></div>
                <div>
                  <p className="text-sm font-medium text-charcoal">Email (Encrypted Attachment)</p>
                  <p className="text-xs text-gray-600">Secure encrypted file sent to your email</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded-full mt-0.5"></div>
                <div>
                  <p className="text-sm font-medium text-charcoal">Secure Download Link</p>
                  <p className="text-xs text-gray-600">Password-protected download link (expires in 7 days)</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded-full mt-0.5"></div>
                <div>
                  <p className="text-sm font-medium text-charcoal">Physical Media (USB/CD)</p>
                  <p className="text-xs text-gray-600">Mailed to your address (may incur shipping fee)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Transfer to Another Service */}
          <div>
            <h3 className="font-semibold text-charcoal mb-3">Direct Transfer to Another Service (Optional)</h3>
            <p className="text-sm text-gray-600 mb-3">
              Would you like us to transfer your data directly to another service provider?
            </p>
            <div className="space-y-2 bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded-full"></div>
                <p className="text-sm text-charcoal">No, I will handle the transfer myself</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded-full"></div>
                <p className="text-sm text-charcoal">Yes, transfer to another service (provide details below)</p>
              </div>
            </div>
            <div className="mt-3">
              <label className="text-sm font-medium text-charcoal">Service Provider Name and Contact:</label>
              <div className="mt-1 border border-gray-300 rounded-lg p-3 min-h-[60px] bg-white"></div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h3 className="font-semibold text-charcoal mb-2">Additional Information (Optional)</h3>
            <p className="text-sm text-gray-600 mb-2">
              Please provide any additional details about your portability request:
            </p>
            <div className="border border-gray-300 rounded-lg p-3 min-h-[80px] bg-white"></div>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-charcoal mb-2">Important Notice</h3>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-2">
              <li>We will verify your identity before providing your data</li>
              <li>We will respond to your request within 30 days</li>
              <li>The first data export is provided free of charge</li>
              <li>Additional exports may incur a reasonable administrative fee</li>
              <li>Data will be provided in a secure, encrypted format</li>
              <li>This right applies only to data you provided based on consent or contract</li>
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
              <li>I will use the exported data for lawful purposes only</li>
              <li>I will keep the exported data secure</li>
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
