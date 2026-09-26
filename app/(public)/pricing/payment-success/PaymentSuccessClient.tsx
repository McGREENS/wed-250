'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Loader2, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/app/components/ui/card';

interface SubStatus {
  planName: string;
  endDate: string | null;
  isActive: boolean;
  status: string;
}

export default function PaymentSuccessClient() {
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref');
  const isPending = searchParams.get('pending') === '1';

  const [sub, setSub] = useState<SubStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      try {
        const data = await fetch('/api/subscriptions/status').then((r) => r.json());
        if (!cancelled) { if (data.subscription) setSub(data.subscription); setLoading(false); }
      } catch { if (!cancelled) setLoading(false); }
    };

    check();

    // Poll for up to 18 seconds in case IPN arrives slightly late
    const interval = setInterval(async () => {
      const data = await fetch('/api/subscriptions/status').then((r) => r.json());
      if (!cancelled && data.subscription?.isActive) { setSub(data.subscription); clearInterval(interval); }
    }, 3000);
    const timeout = setTimeout(() => clearInterval(interval), 18000);

    return () => { cancelled = true; clearInterval(interval); clearTimeout(timeout); };
  }, []);

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('en-RW', { year: 'numeric', month: 'long', day: 'numeric' }) : '';

  const isActive = sub?.isActive;
  const isPendingStatus = !isActive && (isPending || sub?.status === 'PENDING');

  return (
    <div className="min-h-screen bg-cream bg-noise">
      {/* Hero */}
      <section className="relative bg-burgundy py-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full opacity-10 blur-3xl mix-blend-overlay" />
        <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center relative z-10">
          <h1 className="text-5xl font-bold text-white mb-4">
            {loading ? 'Processing Payment…' : isActive ? 'Payment Successful!' : 'Payment Pending'}
          </h1>
          <p className="text-xl text-white/90">
            {loading
              ? 'Please wait while we confirm your payment.'
              : isActive
              ? 'Your subscription is now active. Welcome to Andiza!'
              : 'Your payment is being processed. We\'ll notify you once confirmed.'}
          </p>
        </div>
      </section>

      {/* Card */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-16">
        <div className="max-w-lg mx-auto">
          <Card className="border-gray-100 shadow-lg">
            <CardContent className="p-8 text-center">
              {loading ? (
                <>
                  <div className="w-16 h-16 bg-burgundy/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Loader2 className="w-8 h-8 animate-spin text-burgundy" />
                  </div>
                  <h2 className="text-xl font-semibold text-charcoal mb-2">Confirming your payment…</h2>
                  <p className="text-gray-500">This usually takes just a few seconds.</p>
                </>
              ) : isActive ? (
                <>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-charcoal mb-2">You&apos;re all set!</h2>
                  <p className="text-gray-600 mb-1">
                    Your <strong>{sub?.planName}</strong> subscription is now active.
                  </p>
                  {sub?.endDate && (
                    <p className="text-sm text-gray-400 mb-8">Valid until {formatDate(sub.endDate)}</p>
                  )}
                  <div className="space-y-3">
                    <Link
                      href="/dashboard"
                      className="w-full flex items-center justify-center gap-2 bg-burgundy text-white px-6 py-3.5 rounded-lg font-medium hover:bg-burgundy-light transition-colors"
                    >
                      Go to Dashboard <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/vendors"
                      className="w-full flex items-center justify-center border border-gray-200 text-gray-700 px-6 py-3.5 rounded-lg font-medium hover:border-burgundy hover:text-burgundy transition-colors"
                    >
                      Browse Vendors
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Clock className="w-8 h-8 text-gray-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-charcoal mb-2">
                    {isPendingStatus ? 'Payment Pending' : 'Almost there!'}
                  </h2>
                  <p className="text-gray-600 mb-2">
                    {isPendingStatus
                      ? 'Your payment is being processed. Your subscription will activate automatically once confirmed.'
                      : "We haven't received final confirmation yet. Your subscription activates as soon as the payment is verified."}
                  </p>
                  {ref && <p className="text-xs text-gray-300 font-mono mb-8 break-all">{ref}</p>}
                  <div className="space-y-3">
                    <Link
                      href="/dashboard"
                      className="w-full flex items-center justify-center gap-2 bg-burgundy text-white px-6 py-3.5 rounded-lg font-medium hover:bg-burgundy-light transition-colors"
                    >
                      Go to Dashboard <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/pricing"
                      className="w-full flex items-center justify-center border border-gray-200 text-gray-700 px-6 py-3.5 rounded-lg font-medium hover:border-burgundy hover:text-burgundy transition-colors"
                    >
                      Back to Pricing
                    </Link>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
