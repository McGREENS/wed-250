'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { XCircle } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/app/components/ui/card';

export default function PaymentCancelClient() {
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref');
  const status = searchParams.get('status') ?? 'cancelled';
  const isFailed = status === 'failed';

  return (
    <div className="min-h-screen bg-cream bg-noise">
      {/* Hero */}
      <section className="relative bg-burgundy py-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full opacity-10 blur-3xl mix-blend-overlay" />
        <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center relative z-10">
          <h1 className="text-5xl font-bold text-white mb-4">
            {isFailed ? 'Payment Failed' : 'Payment Cancelled'}
          </h1>
          <p className="text-xl text-white/90">
            {isFailed
              ? 'Your payment could not be processed. Please try again.'
              : 'No charge was made to your account. You can retry anytime.'}
          </p>
        </div>
      </section>

      {/* Card */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-16">
        <div className="max-w-lg mx-auto">
          <Card className="border-gray-100 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>

              <h2 className="text-xl font-semibold text-charcoal mb-2">
                {isFailed ? 'Payment could not be completed' : 'Payment was cancelled'}
              </h2>
              <p className="text-gray-600 mb-2 leading-relaxed">
                {isFailed
                  ? 'There was an issue processing your payment. Please check your payment details and try again.'
                  : 'You cancelled the checkout. Your account has not been charged.'}
              </p>
              {ref && <p className="text-xs text-gray-300 font-mono mb-8 break-all">{ref}</p>}

              <div className="space-y-3">
                <Link
                  href="/pricing"
                  className="w-full flex items-center justify-center bg-burgundy text-white px-6 py-3.5 rounded-lg font-medium hover:bg-burgundy-light transition-colors"
                >
                  Try Again
                </Link>
                <Link
                  href="/dashboard"
                  className="w-full flex items-center justify-center border border-gray-200 text-gray-700 px-6 py-3.5 rounded-lg font-medium hover:border-burgundy hover:text-burgundy transition-colors"
                >
                  Back to Dashboard
                </Link>
              </div>

              <p className="mt-6 text-sm text-gray-400">
                Need help?{' '}
                <Link href="/contact" className="text-burgundy hover:underline font-medium">
                  Contact our support team
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
