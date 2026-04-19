'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('cookie-consent', 'all');
    setShowBanner(false);
  };

  const acceptEssential = () => {
    localStorage.setItem('cookie-consent', 'essential');
    setShowBanner(false);
  };

  const closeBanner = () => {
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Icon and Text */}
          <div className="flex items-start gap-3 flex-1">
            <Cookie className="h-6 w-6 text-burgundy flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-charcoal mb-1">
                We use cookies
              </h3>
              <p className="text-xs text-gray-600">
                We use cookies to enhance your experience, analyze site traffic, and personalize content. 
                By clicking "Accept All", you consent to our use of cookies. 
                <Link href="/cookies" className="text-burgundy hover:underline ml-1">
                  Learn more
                </Link>
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={acceptEssential}
              className="flex-1 sm:flex-none text-xs"
            >
              Essential Only
            </Button>
            <Button
              size="sm"
              onClick={acceptAll}
              className="flex-1 sm:flex-none bg-burgundy hover:bg-burgundy/90 text-white text-xs"
            >
              Accept All
            </Button>
            <button
              onClick={closeBanner}
              className="p-1 hover:bg-gray-100 rounded"
              aria-label="Close"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
