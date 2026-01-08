import React from 'react';
import Link from 'next/link';
import { createPageUrl } from '../utils';
import { Check, Star, Sparkles, Crown } from 'lucide-react';
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";

export default function PricingPage() {
    const plans = [
        {
            name: 'Basic',
            icon: Star,
            price: 'Free',
            description: 'Perfect for couples just starting their planning journey',
            features: [
                'Browse all vendors',
                'Create wedding plan',
                'Basic vendor matching',
                'Contact up to 5 vendors',
                'Email support',
                'Planning checklist'
            ],
            cta: 'Get Started Free',
            popular: false,
            color: 'from-sand to-sand/60'
        },
        {
            name: 'Premium',
            icon: Sparkles,
            price: '$99',
            period: '/month',
            description: 'Most popular choice for engaged couples',
            features: [
                'Everything in Basic',
                'Unlimited vendor contacts',
                'Priority vendor matching',
                'Personalized recommendations',
                'Budget tracking tools',
                'Guest list management',
                'Payment tracking',
                'Priority support',
                'Wedding website builder'
            ],
            cta: 'Start Premium',
            popular: true,
            color: 'from-burgundy to-burgundy/60'
        },
        {
            name: 'Elite',
            icon: Crown,
            price: '$199',
            period: '/month',
            description: 'Complete concierge service for luxury weddings',
            features: [
                'Everything in Premium',
                'Dedicated wedding planner',
                'Vendor negotiation assistance',
                'On-site coordination available',
                'Custom vendor curation',
                'Design consultation',
                'Unlimited consultations',
                '24/7 VIP support',
                'Post-wedding video editing'
            ],
            cta: 'Go Elite',
            popular: false,
            color: 'from-gold to-gold/60'
        }
    ];

    const faqs = [
        {
            question: 'Can I change my plan later?',
            answer: 'Absolutely! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.'
        },
        {
            question: 'What payment methods do you accept?',
            answer: 'We accept all major credit cards (Visa, MasterCard, American Express) and PayPal for your convenience.'
        },
        {
            question: 'Is there a long-term commitment?',
            answer: 'No! Our Premium and Elite plans are month-to-month with no long-term contracts. Cancel anytime.'
        },
        {
            question: 'Do you offer refunds?',
            answer: 'We offer a 30-day money-back guarantee for all paid plans if you\'re not completely satisfied.'
        },
        {
            question: 'What happens after my wedding?',
            answer: 'You can keep your account active to access your wedding memories, photos, and vendor contacts, or you can cancel anytime after your event.'
        }
    ];

    return (
        <div className="min-h-screen bg-cream bg-noise">
            {/* Hero Section */}
            <section className="relative bg-burgundy py-20 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full opacity-10 blur-3xl mix-blend-overlay" />

                <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                            Simple, Transparent Pricing
                        </h1>
                        <p className="text-xl text-white/90">
                            Choose the perfect plan for your wedding journey. No hidden fees, no surprises.
                        </p>
                    </div>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="py-20">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
                    <div className="grid md:grid-cols-3 gap-8 lg:gap-6">
                        {plans.map((plan) => {
                            const Icon = plan.icon;
                            return (
                                <div
                                    key={plan.name}
                                    className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all hover:shadow-2xl hover:-translate-y-2 ${plan.popular ? 'border-burgundy lg:scale-105' : 'border-gray-100'
                                        }`}
                                >
                                    {plan.popular && (
                                        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-burgundy text-white border-0">
                                            Most Popular
                                        </Badge>
                                    )}

                                    <div className="p-8">
                                        {/* Icon */}
                                        <div className={`w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4`}>
                                            <Icon className="w-7 h-7 text-burgundy" />
                                        </div>

                                        {/* Plan Name & Price */}
                                        <h3 className="text-2xl font-serif text-charcoal mb-2">
                                            {plan.name}
                                        </h3>
                                        <div className="flex items-baseline mb-4">
                                            <span className="text-5xl font-bold text-charcoal">{plan.price}</span>
                                            {plan.period && (
                                                <span className="text-gray-600 ml-2">{plan.period}</span>
                                            )}
                                        </div>
                                        <p className="text-gray-600 mb-6">
                                            {plan.description}
                                        </p>

                                        {/* CTA Button */}
                                        <Link href={createPageUrl('PlanBuilder')}>
                                            <Button
                                                className={`w-full mb-8 ${plan.popular
                                                    ? 'bg-burgundy hover:bg-burgundy-light text-white'
                                                    : 'bg-gray-100 hover:bg-gray-200 text-charcoal'
                                                    }`}
                                            >
                                                {plan.cta}
                                            </Button>
                                        </Link>

                                        {/* Features List */}
                                        <div className="space-y-3">
                                            {plan.features.map((feature, idx) => (
                                                <div key={idx} className="flex items-start gap-3">
                                                    <Check className="w-5 h-5 text-burgundy flex-shrink-0 mt-0.5" />
                                                    <span className="text-gray-700 text-sm">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Trust Badge */}
                    <div className="mt-12 text-center">
                        <p className="text-gray-600">
                            💳 All plans include secure payment processing and data protection
                        </p>
                    </div>
                </div>
            </section>

            {/* Comparison Table */}
            <section className="py-20 bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-charcoal mb-4">
                            Compare Plans
                        </h2>
                        <p className="text-lg text-gray-600">
                            Find the perfect fit for your wedding planning needs
                        </p>
                    </div>

                    <div className="bg-sand/20 rounded-2xl p-8 overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-gray-200">
                                    <th className="text-left py-4 px-4 text-charcoal font-semibold">Feature</th>
                                    <th className="text-center py-4 px-4 text-charcoal font-semibold">Basic</th>
                                    <th className="text-center py-4 px-4 text-charcoal font-semibold">Premium</th>
                                    <th className="text-center py-4 px-4 text-charcoal font-semibold">Elite</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700">
                                {[
                                    ['Vendor Directory Access', true, true, true],
                                    ['Wedding Plan Creation', true, true, true],
                                    ['Vendor Contacts', '5 vendors', 'Unlimited', 'Unlimited'],
                                    ['Budget Tracking', false, true, true],
                                    ['Guest Management', false, true, true],
                                    ['Personalized Matching', false, true, true],
                                    ['Dedicated Planner', false, false, true],
                                    ['24/7 Support', false, false, true]
                                ].map((row, idx) => (
                                    <tr key={idx} className="border-b border-gray-200">
                                        <td className="py-4 px-4">{row[0]}</td>
                                        <td className="py-4 px-4 text-center">
                                            {typeof row[1] === 'boolean' ? (
                                                row[1] ? <Check className="w-5 h-5 text-burgundy mx-auto" /> : '—'
                                            ) : (
                                                row[1]
                                            )}
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            {typeof row[2] === 'boolean' ? (
                                                row[2] ? <Check className="w-5 h-5 text-burgundy mx-auto" /> : '—'
                                            ) : (
                                                row[2]
                                            )}
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            {typeof row[3] === 'boolean' ? (
                                                row[3] ? <Check className="w-5 h-5 text-burgundy mx-auto" /> : '—'
                                            ) : (
                                                row[3]
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-cream">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-charcoal mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-lg text-gray-600">
                            Got questions? We've got answers.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                            >
                                <h3 className="text-lg font-semibold text-charcoal mb-2">
                                    {faq.question}
                                </h3>
                                <p className="text-gray-600">
                                    {faq.answer}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-gray-600 mb-4">Still have questions?</p>
                        <Link href={createPageUrl('Contact')}>
                            <Button variant="outline" className="border-burgundy text-burgundy hover:bg-burgundy hover:text-white">
                                Contact Our Team
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-burgundy relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full opacity-10 blur-3xl" />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to Get Started?
                    </h2>
                    <p className="text-xl text-white/90 mb-8">
                        Start planning your dream wedding today with our free Basic plan
                    </p>
                    <Link href={createPageUrl('PlanBuilder')}>
                        <Button className="bg-white text-burgundy hover:bg-gray-50 text-lg px-8 py-6">
                            Create Your Free Account
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
