"use client";

import React, { useEffect, useState } from 'react';
import { Button } from "@/app/components/ui/button";
import { Calendar, MessageSquare } from 'lucide-react';
import PublishedCalendar from './PublishedCalendar';
import QuickMessageModal from './QuickMessageModal';

interface VendorDetailsSidebarProps {
  vendorId: string;
  vendorName: string;
  calendarPublished: boolean;
}

export default function VendorDetailsSidebar({ vendorId, vendorName, calendarPublished: initialCalendarPublished }: VendorDetailsSidebarProps) {
  const [calendarPublished, setCalendarPublished] = useState(initialCalendarPublished);
  const [messageModalOpen, setMessageModalOpen] = useState(false);

  useEffect(() => {
    // Poll for calendar status changes every 3 seconds
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/vendors/${vendorId}`);
        const data = await res.json();
        const isPublished = !!data.vendor?.calendarPublished;
        setCalendarPublished(isPublished);
      } catch (error) {
        console.error('Error polling calendar status:', error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [vendorId]);

  return (
    <div className="space-y-4">
      {calendarPublished ? (
        <PublishedCalendar vendorId={vendorId} />
      ) : (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-burgundy/10 rounded-xl flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6 text-burgundy" />
            </div>
            <div>
              <h3 className="font-bold text-charcoal mb-2">Ready to book?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get in touch with {vendorName} to discuss your event and check availability.
              </p>
            </div>
            <Button
              onClick={() => setMessageModalOpen(true)}
              className="w-full bg-burgundy hover:bg-burgundy/90 text-white rounded-xl"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Contact Vendor
            </Button>
            <QuickMessageModal
              open={messageModalOpen}
              onOpenChange={setMessageModalOpen}
              vendorId={vendorId}
              vendorName={vendorName}
            />
          </div>
        </div>
      )}
    </div>
  );
}
