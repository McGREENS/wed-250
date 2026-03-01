"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Mail } from 'lucide-react';
import { Card, CardContent } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const [email, setEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setIsSubscribed(true);
            setEmail('');
            setTimeout(() => setIsSubscribed(false), 3000);
        }
    };

    const faqs = [
        {
            category: "Getting Started",
            questions: [
                {
                    q: "How do I create a wedding plan on Andiza?",
                    a: "Simply sign up for an account, then navigate to your dashboard and click 'Create Your Wedding Plan'. Fill in your wedding details including date, guest count, and budget to get started."
                },
                {
                    q: "Is Andiza free to use?",
                    a: "Yes! Creating an account and browsing venues and vendors is completely free. You only pay when you book services through our platform."
                },
                {
                    q: "What areas does Andiza serve?",
                    a: "We currently serve all of Rwanda, with a focus on Kigali and surrounding areas. We're constantly expanding our network of venues and vendors."
                }
            ]
        },
        {
            category: "Booking & Payments",
            questions: [
                {
                    q: "How do I book a venue or vendor?",
                    a: "Browse our marketplace, select your preferred venue or vendor, and click 'Book Now'. You can also request custom quotes or message vendors directly through our platform."
                },
                {
                    q: "What payment methods do you accept?",
                    a: "We accept mobile money (MTN, Airtel), bank transfers, and credit/debit cards. Payment terms vary by vendor."
                },
                {
                    q: "Can I cancel or modify my booking?",
                    a: "Cancellation and modification policies vary by vendor. Please review the specific terms when booking. Contact the vendor directly through our messaging system for changes."
                }
            ]
        },
        {
            category: "Venues & Vendors",
            questions: [
                {
                    q: "How are vendors verified on Andiza?",
                    a: "All vendors go through our verification process including business registration checks, portfolio reviews, and customer feedback analysis. Premium partners undergo additional quality assessments."
                },
                {
                    q: "Can I visit venues before booking?",
                    a: "Absolutely! We encourage site visits. Use our messaging system to schedule appointments with venue managers."
                },
                {
                    q: "What if I'm not satisfied with a vendor's service?",
                    a: "Contact our support team immediately. We take quality seriously and will work with you and the vendor to resolve any issues."
                }
            ]
        },
        {
            category: "Planning Tools",
            questions: [
                {
                    q: "What planning tools does Andiza offer?",
                    a: "Our dashboard includes budget tracking, guest list management, task checklists, vendor messaging, document storage, and timeline planning."
                },
                {
                    q: "Can I share my wedding plan with others?",
                    a: "Yes! You can invite your partner, family members, or wedding planner to collaborate on your wedding plan."
                },
                {
                    q: "Is my data secure on Andiza?",
                    a: "Yes. We use industry-standard encryption and security measures to protect your personal information and wedding details."
                }
            ]
        },
        {
            category: "Support",
            questions: [
                {
                    q: "How can I contact Andiza support?",
                    a: "You can reach us via email at support@andiza.rw, call +250 788 123 456, or visit our office at Norrsken House Kigali. We respond within 24 hours."
                },
                {
                    q: "Do you offer wedding planning consultations?",
                    a: "Yes! Our team can provide personalized planning consultations. Contact us to schedule a session."
                },
                {
                    q: "Can vendors join Andiza?",
                    a: "Yes! We're always looking for quality wedding vendors. Visit our vendor registration page or contact us for partnership opportunities."
                }
            ]
        }
    ];

    let questionIndex = -1;

    return (
        <div className="min-h-screen bg-cream bg-noise">
            {/* Hero Section */}
            <section className="relative bg-burgundy py-20 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full opacity-10 blur-3xl mix-blend-overlay" />
                <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10 text-center">
                    <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <HelpCircle className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-5xl font-bold text-white mb-4">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-xl text-white/90">
                        Find answers to common questions about planning your wedding with Andiza
                    </p>
                </div>
            </section>

            {/* FAQ Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-12 py-16">
                {faqs.map((category, catIndex) => (
                    <div key={catIndex} className="mb-12">
                        <h2 className="text-2xl font-bold text-charcoal mb-6">{category.category}</h2>
                        <div className="space-y-4">
                            {category.questions.map((faq) => {
                                questionIndex++;
                                const currentIndex = questionIndex;
                                return (
                                    <Card key={currentIndex} className="border-gray-100 shadow-sm overflow-hidden">
                                        <button
                                            onClick={() => setOpenIndex(openIndex === currentIndex ? null : currentIndex)}
                                            className="w-full text-left"
                                        >
                                            <CardContent className="p-6">
                                                <div className="flex items-start justify-between gap-4">
                                                    <h3 className="text-lg font-semibold text-charcoal pr-8">
                                                        {faq.q}
                                                    </h3>
                                                    {openIndex === currentIndex ? (
                                                        <ChevronUp className="w-5 h-5 text-burgundy flex-shrink-0 mt-1" />
                                                    ) : (
                                                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                                                    )}
                                                </div>
                                                {openIndex === currentIndex && (
                                                    <p className="mt-4 text-gray-600 leading-relaxed">
                                                        {faq.a}
                                                    </p>
                                                )}
                                            </CardContent>
                                        </button>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {/* Email Subscription */}
                <Card className="border-burgundy bg-gradient-to-br from-burgundy to-burgundy-light mt-12">
                    <CardContent className="p-8 text-center">
                        <Mail className="w-12 h-12 text-white mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-3">
                            Get Wedding Planning Tips
                        </h3>
                        <p className="text-white/90 mb-6">
                            Subscribe to our newsletter for expert advice, vendor spotlights, and exclusive offers
                        </p>
                        {isSubscribed ? (
                            <div className="bg-white/20 text-white py-3 px-6 rounded-full inline-block">
                                ✓ Successfully subscribed! Check your email.
                            </div>
                        ) : (
                            <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
                                <div className="flex gap-2">
                                    <Input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="bg-white border-white"
                                    />
                                    <Button type="submit" className="bg-white text-burgundy hover:bg-gray-100">
                                        Subscribe
                                    </Button>
                                </div>
                            </form>
                        )}
                    </CardContent>
                </Card>

                {/* Contact CTA */}
                <Card className="border-burgundy bg-burgundy/5 mt-12">
                    <CardContent className="p-8 text-center">
                        <h3 className="text-2xl font-bold text-charcoal mb-3">
                            Still have questions?
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Our team is here to help you plan your perfect wedding
                        </p>
                        <a
                            href="/contact"
                            className="inline-block bg-burgundy text-white px-8 py-3 rounded-full font-medium hover:bg-burgundy-light transition-colors"
                        >
                            Contact Us
                        </a>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
