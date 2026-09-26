'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Check, Loader2, AlertCircle, CheckCircle,
  Shield, Zap, HeartHandshake, Users, UserCircle2,
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/app/components/ui/card';

// ─── Plain types — no const-assertion dependency ──────────────────────────────
interface PlanFeature {
  readonly text: string;
  readonly note: string | null;
}

interface Plan {
  readonly id: string;
  readonly name: string;
  readonly amount: number;
  readonly currency: string;
  readonly description: string;
  readonly badge: string | null;
  readonly highlight: boolean;
  readonly accountType: string;
  readonly includes: readonly PlanFeature[];
}

interface ActiveSub {
  planId: string;
  planName: string;
  endDate: string | null;
  isActive: boolean;
  status: string;
}

export default function PricingClient({
  plans,
}: {
  plans: readonly Plan[];
}) {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Debug what we're receiving
  console.log('PricingClient received plans:', plans);
  plans?.forEach((plan, idx) => {
    console.log(`Plan ${idx}:`, plan);
    console.log(`Plan ${idx} includes:`, plan.includes);
  });

  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
  const [activeSub, setActiveSub] = useState<ActiveSub | null>(null);
  const [subLoading, setSubLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    searchParams.get('payment') === 'error'
      ? 'Payment could not be completed. Please try again.'
      : null
  );

  useEffect(() => {
    if (session?.user && (session.user as any).role === 'COUPLE') {
      setSubLoading(true);
      fetch('/api/subscriptions/status')
        .then((r) => r.json())
        .then((d) => { if (d.subscription) setActiveSub(d.subscription); })
        .catch(() => {})
        .finally(() => setSubLoading(false));
    }
  }, [session?.user]);

  const handleSubscribe = async (plan: Plan) => {
    setError(null);
    if (!session?.user) { router.push('/login?callbackUrl=/pricing'); return; }
    if ((session.user as any).role !== 'COUPLE') {
      setError('Only couple accounts can subscribe. Please sign in with a couple account.');
      return;
    }
    setLoadingPlanId(plan.id);
    try {
      const res = await fetch('/api/subscriptions/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: plan.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 409) { setError(data.error ?? 'You already have an active subscription.'); return; }
        throw new Error(data.error ?? 'Failed to initiate payment');
      }
      if (data.redirectUrl) window.location.href = data.redirectUrl;
      else throw new Error('No redirect URL received from payment gateway');
    } catch (err: any) {
      setError(err?.message ?? 'Something went wrong. Please try again.');
    } finally {
      setLoadingPlanId(null);
    }
  };

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('en-RW', { year: 'numeric', month: 'long', day: 'numeric' }) : '';

  return (
    <div className="min-h-screen bg-cream bg-noise">

      {/* ─── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative bg-burgundy py-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white rounded-full opacity-[0.07] blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full opacity-[0.07] blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-8 lg:px-12 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-5 py-2 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-white/70 inline-block" />
            <span className="text-white/90 text-sm tracking-wide">Simple, Transparent Pricing</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold font-serif text-white mb-6 leading-tight">
            Plans for Every Couple
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Choose how you and your partner want to plan your big day — together on one dashboard,
            or each with your own space. Paid once a year, in RWF.
          </p>

          {/* Active sub pill */}
          {subLoading && (
            <div className="mt-8 flex justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-white/50" />
            </div>
          )}
          {activeSub?.isActive && !subLoading && (
            <div className="mt-8 inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white rounded-full px-6 py-3 text-sm font-medium">
              <CheckCircle className="w-4 h-4 shrink-0" />
              Active plan: <strong className="ml-1">{activeSub.planName}</strong>
              {activeSub.endDate && (
                <span className="text-white/60 ml-1">· until {formatDate(activeSub.endDate)}</span>
              )}
            </div>
          )}
          {error && (
            <div className="mt-6 mx-auto max-w-lg flex items-start gap-3 bg-white/10 border border-white/20 text-white rounded-xl px-5 py-4 text-sm text-left">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}
        </div>
      </section>

      {/* ─── Comparison explainer ─────────────────────────────────────────────── */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto mt-12 mb-20 grid sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-burgundy/10 flex items-center justify-center shrink-0">
              <UserCircle2 className="w-5 h-5 text-burgundy" />
            </div>
            <div>
              <p className="font-semibold text-charcoal text-sm mb-1">Individual Plan</p>
              <p className="text-gray-500 text-xs leading-relaxed">
                One shared dashboard where both partners log in and plan together. Perfect if you want a unified view of everything.
              </p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-burgundy/10 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-burgundy" />
            </div>
            <div>
              <p className="font-semibold text-charcoal text-sm mb-1">Couple Plan</p>
              <p className="text-gray-500 text-xs leading-relaxed">
                Two fully separate accounts, each with their own dashboard. Best when each partner wants to manage their responsibilities independently.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Pricing Cards ────────────────────────────────────────────────────── */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 pb-24 mt-8">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => {
            const isHighlight = plan.highlight;
            const isCurrentPlan = activeSub?.isActive && activeSub.planId === plan.id;
            const isLoading = loadingPlanId === plan.id;
            const Icon = plan.id === 'INDIVIDUAL' ? UserCircle2 : Users;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-2xl overflow-hidden transition-all duration-200 ${
                  isHighlight
                    ? 'bg-burgundy shadow-2xl shadow-burgundy/20 ring-0'
                    : 'bg-white shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-0.5'
                }`}
              >
                {/* Best Value ribbon */}
                {plan.badge && (
                  <div className="bg-white/10 border-b border-white/10 py-2.5 text-center">
                    <span className="text-white text-xs font-bold tracking-[0.15em] uppercase">
                      ✦ {plan.badge} ✦
                    </span>
                  </div>
                )}

                <div className="p-8 flex flex-col flex-1">
                  {/* Icon + name */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      isHighlight ? 'bg-white/15' : 'bg-burgundy/10'
                    }`}>
                      <Icon className={`w-6 h-6 ${isHighlight ? 'text-white' : 'text-burgundy'}`} />
                    </div>
                    <div>
                      <h3 className={`text-2xl font-bold font-serif leading-none mb-1 ${
                        isHighlight ? 'text-white' : 'text-charcoal'
                      }`}>
                        {plan.name}
                      </h3>
                      <p className={`text-sm ${isHighlight ? 'text-white/60' : 'text-gray-400'}`}>
                        {plan.accountType === 'shared' ? 'Shared dashboard · 2 users' : 'Separate dashboards · 2 users'}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className={`pb-6 mb-6 border-b ${isHighlight ? 'border-white/15' : 'border-gray-100'}`}>
                    <div className="flex items-baseline gap-1.5">
                      <span className={`text-sm font-semibold ${isHighlight ? 'text-white/50' : 'text-gray-400'}`}>
                        RWF
                      </span>
                      <span className={`text-6xl font-extrabold font-serif leading-none tracking-tight ${
                        isHighlight ? 'text-white' : 'text-charcoal'
                      }`}>
                        {plan.amount.toLocaleString()}
                      </span>
                    </div>
                    <p className={`text-sm mt-2 ${isHighlight ? 'text-white/50' : 'text-gray-400'}`}>
                      per year · one-time payment · for 2 people
                    </p>
                  </div>

                  {/* Description blurb */}
                  <p className={`text-sm leading-relaxed mb-6 ${isHighlight ? 'text-white/75' : 'text-gray-500'}`}>
                    {plan.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-3 flex-1 mb-8">
                    {plan.includes?.map((item) => (
                      <li key={item.text} className="flex items-start gap-3">
                        <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          isHighlight ? 'bg-white/20' : 'bg-burgundy/10'
                        }`}>
                          <Check className={`w-3 h-3 ${isHighlight ? 'text-white' : 'text-burgundy'}`} />
                        </div>
                        <div>
                          <span className={`text-sm font-medium leading-snug ${
                            isHighlight ? 'text-white/90' : 'text-gray-700'
                          }`}>
                            {item.text}
                          </span>
                          {item.note && (
                            <span className={`text-xs block mt-0.5 ${
                              isHighlight ? 'text-white/45' : 'text-gray-400'
                            }`}>
                              {item.note}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  {isCurrentPlan ? (
                    <div className={`w-full py-4 rounded-xl text-sm font-semibold text-center flex items-center justify-center gap-2 cursor-default ${
                      isHighlight
                        ? 'bg-white/15 text-white border border-white/20'
                        : 'bg-gray-50 text-gray-500 border border-gray-200'
                    }`}>
                      <CheckCircle className="w-4 h-4" />
                      Your Current Plan
                    </div>
                  ) : (
                    <button
                      onClick={() => handleSubscribe(plan)}
                      disabled={isLoading || !!loadingPlanId}
                      className={`w-full py-4 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${
                        isHighlight
                          ? 'bg-white text-burgundy hover:bg-gray-50 shadow-lg hover:shadow-xl'
                          : 'bg-burgundy text-white hover:bg-burgundy-light shadow-md hover:shadow-lg'
                      }`}
                    >
                      {isLoading ? (
                        <><Loader2 className="w-4 h-4 animate-spin" />Redirecting to payment…</>
                      ) : sessionStatus === 'unauthenticated' ? (
                        'Sign in to Subscribe'
                      ) : (
                        `Get the ${plan.name} Plan`
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── Comparison table ─────────────────────────────────────────────────── */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold font-serif text-charcoal text-center mb-10">
            What&apos;s the difference?
          </h2>
          <Card className="border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-6 py-4 text-gray-400 font-medium w-1/2">Feature</th>
                    <th className="px-6 py-4 text-charcoal font-semibold text-center">Individual</th>
                    <th className="px-6 py-4 text-burgundy font-semibold text-center bg-burgundy/5">Couple</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: 'Number of accounts', individual: '2 users', couple: '2 users' },
                    { feature: 'Dashboard', individual: 'Shared', couple: 'Separate' },
                    { feature: 'Task management', individual: 'Shared view', couple: 'Independent per account' },
                    { feature: 'Vendor bookings', individual: 'Shared', couple: 'Separate per account' },
                    { feature: 'Budget tracker', individual: '✓', couple: '✓' },
                    { feature: 'Wedding helpers', individual: '✓', couple: '✓' },
                    { feature: 'Messaging', individual: '✓', couple: '✓' },
                    { feature: 'Guest management', individual: '✓', couple: '✓' },
                    { feature: 'Price (RWF / year)', individual: '30,000', couple: '55,000', highlight: true },
                  ].map((row, i) => (
                    <tr key={row.feature} className={`border-b border-gray-50 last:border-0 ${row.highlight ? 'bg-gray-50' : ''}`}>
                      <td className="px-6 py-4 text-gray-600">{row.feature}</td>
                      <td className="px-6 py-4 text-center text-gray-700 font-medium">{row.individual}</td>
                      <td className="px-6 py-4 text-center text-burgundy font-semibold bg-burgundy/5">{row.couple}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* ─── Trust signals ───────────────────────────────────────────────────── */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {[
            { icon: Shield, title: 'Secure Payments', body: 'Powered by PesaPal — MTN MoMo, Airtel Money, VISA & Mastercard accepted in RWF.' },
            { icon: Zap, title: 'Instant Activation', body: 'Your plan goes live immediately after payment is confirmed.' },
            { icon: HeartHandshake, title: 'No Hidden Fees', body: 'One flat yearly price per couple. No recurring charges, no surprises.' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="border-gray-100 shadow-sm">
                <CardContent className="p-5 flex items-start gap-3">
                  <div className="w-10 h-10 bg-burgundy/10 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-burgundy" />
                  </div>
                  <div>
                    <p className="font-semibold text-charcoal text-sm mb-1">{item.title}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.body}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* ─── FAQ ─────────────────────────────────────────────────────────────── */}
        <div className="mt-20 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-burgundy text-xs font-bold tracking-[0.15em] uppercase bg-burgundy/5 px-4 py-2 rounded-full border border-burgundy/10">
              FAQ
            </span>
            <h2 className="text-4xl font-bold font-serif text-charcoal mt-6 mb-3">
              Common Questions
            </h2>
            <p className="text-gray-500">Everything you need to know before subscribing.</p>
          </div>
          <div className="space-y-3">
            {[
              {
                q: 'What is the difference between Individual and Couple plans?',
                a: 'The Individual plan gives both partners access to one shared dashboard — all tasks, bookings and budgets are in one place. The Couple plan gives each partner a fully separate account so you can each independently manage your own responsibilities.',
              },
              {
                q: 'Can both partners log in with the Individual plan?',
                a: 'Yes. The Individual plan includes 2 user accounts — the primary account holder can invite their partner directly from the dashboard settings.',
              },
              {
                q: 'What payment methods are accepted?',
                a: 'PesaPal supports MTN Mobile Money, Airtel Money, VISA, and Mastercard — all charged in Rwandan Francs (RWF).',
              },
              {
                q: 'When does the subscription start?',
                a: 'Your plan activates immediately after payment confirmation. Your 12-month access starts that same day.',
              },
              {
                q: 'Can I switch plans later?',
                a: 'Yes. When your current plan expires you can subscribe to either plan for the next year.',
              },
            ].map((item) => (
              <Card key={item.q} className="border-gray-100 shadow-sm">
                <CardContent className="p-6">
                  <h5 className="font-semibold text-charcoal mb-2">{item.q}</h5>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* ─── Unauthenticated CTA ─────────────────────────────────────────────── */}
        {sessionStatus === 'unauthenticated' && (
          <section className="mt-20 bg-burgundy relative overflow-hidden rounded-2xl py-20 px-8">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full opacity-[0.07] blur-3xl" />
            <div className="relative z-10 max-w-2xl mx-auto text-center">
              <h2 className="text-4xl font-bold font-serif text-white mb-4">
                Ready to Start Planning?
              </h2>
              <p className="text-white/75 mb-10 text-lg">
                Create your free account first, then pick the plan that works for both of you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/signup"
                  className="bg-white text-burgundy px-10 py-4 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors shadow-xl inline-block"
                >
                  Create Free Account
                </Link>
                <Link
                  href="/login"
                  className="border border-white/30 text-white px-10 py-4 rounded-xl font-semibold text-sm hover:bg-white/10 transition-colors inline-block"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
