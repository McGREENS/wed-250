"use client";

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, Facebook, Instagram, Twitter, Loader2 } from 'lucide-react';
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                setIsSubmitted(true);
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    subject: '',
                    message: ''
                });

                setTimeout(() => setIsSubmitted(false), 5000);
            } else {
                setError(data.error || 'Failed to send message. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting contact form:', error);
            setError('Something went wrong. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactInfo = [
        {
            icon: Mail,
            title: 'Email Us',
            value: 'support@andiza.rw',
            description: 'We\'ll respond within 24 hours'
        },
        {
            icon: Phone,
            title: 'Call Us',
            value: '+250 792 247 504',
            description: 'Mon-Fri 9am-6pm EAT'
        },
        {
            icon: MapPin,
            title: 'Visit Us',
            value: 'Norrsken House Kigali',
            description: '1 KN 78 St, Kigali, Rwanda'
        },
        {
            icon: Clock,
            title: 'Office Hours',
            value: 'Monday - Friday',
            description: '9:00 AM - 6:00 PM EAT'
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
                            Get In Touch
                        </h1>
                        <p className="text-xl text-white/90">
                            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                        </p>
                    </div>
                </div>
            </section>

            <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-20">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <Card className="border-gray-100 shadow-lg">
                            <CardContent className="p-8">
                                <h2 className="text-2xl font-serif text-charcoal mb-6">
                                    Send Us a Message
                                </h2>

                                {isSubmitted ? (
                                    <div className="py-12 text-center">
                                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle className="w-8 h-8 text-green-600" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-[#2C2C2C] mb-2">
                                            Message Sent Successfully!
                                        </h3>
                                        <p className="text-gray-600">
                                            Thank you for reaching out. We'll get back to you within 24 hours.
                                        </p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {error && (
                                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                                <p className="text-red-600 text-sm">{error}</p>
                                            </div>
                                        )}
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                                                    Your Name *
                                                </label>
                                                <Input
                                                    required
                                                    placeholder="Jean Baptiste Uwimana"
                                                    value={formData.name}
                                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                                    className="border-gray-200"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                                                    Email Address *
                                                </label>
                                                <Input
                                                    required
                                                    type="email"
                                                    placeholder="jean.uwimana@gmail.com"
                                                    value={formData.email}
                                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                                    className="border-gray-200"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                                                    Phone Number
                                                </label>
                                                <Input
                                                    type="tel"
                                                    placeholder="+250 792 247 504"
                                                    value={formData.phone}
                                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                                    className="border-gray-200"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                                                    Subject
                                                </label>
                                                <Input
                                                    placeholder="Wedding planning inquiry"
                                                    value={formData.subject}
                                                    onChange={(e) => handleInputChange('subject', e.target.value)}
                                                    className="border-gray-200"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                                                Message *
                                            </label>
                                            <Textarea
                                                required
                                                placeholder="I'm planning my wedding for December 2024 and looking for vendors in Kigali. Could you help me find photographers and venues that fit my budget?"
                                                value={formData.message}
                                                onChange={(e) => handleInputChange('message', e.target.value)}
                                                className="border-gray-200 h-40"
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-burgundy hover:bg-burgundy-light text-white py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-5 h-5 mr-2" />
                                                    Send Message
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-6">
                        <Card className="border-gray-100 shadow-sm">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-serif text-charcoal mb-6">
                                    Contact Information
                                </h3>
                                <div className="space-y-6">
                                    {contactInfo.map((info, index) => {
                                        const Icon = info.icon;
                                        return (
                                            <div key={index} className="flex gap-4">
                                                <div className="w-12 h-12 bg-burgundy/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                                    <Icon className="w-6 h-6 text-burgundy" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-[#2C2C2C] mb-1">
                                                        {info.title}
                                                    </h4>
                                                    <p className="text-gray-700">{info.value}</p>
                                                    <p className="text-sm text-gray-500">{info.description}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-100 shadow-sm bg-sand/20">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-bold text-[#2C2C2C] mb-3">
                                    💡 Quick Tip
                                </h3>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    For urgent wedding planning assistance, our Premium and Elite members have access to 24/7 priority support via phone and live chat.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-100 shadow-sm">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-bold text-[#2C2C2C] mb-3">
                                    Follow Us
                                </h3>
                                <div className="flex gap-3">
                                    <button className="w-10 h-10 bg-gray-100 hover:bg-[#1877F2] hover:text-white rounded-full flex items-center justify-center transition-all">
                                        <Facebook className="w-5 h-5" />
                                    </button>
                                    <button className="w-10 h-10 bg-gray-100 hover:bg-[#E4405F] hover:text-white rounded-full flex items-center justify-center transition-all">
                                        <Instagram className="w-5 h-5" />
                                    </button>
                                    <button className="w-10 h-10 bg-gray-100 hover:bg-[#1DA1F2] hover:text-white rounded-full flex items-center justify-center transition-all">
                                        <Twitter className="w-5 h-5" />
                                    </button>
                                    <button className="w-10 h-10 bg-gray-100 hover:bg-[#BD081C] hover:text-white rounded-full flex items-center justify-center transition-all">
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                        </svg>
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Map Section */}
            <section className="bg-white py-12">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
                    <div className="mb-8 text-center">
                        <h2 className="text-3xl font-serif text-charcoal mb-2">Find Us</h2>
                        <p className="text-gray-600">Norrsken House Kigali, 1 KN 78 St, Kigali, Rwanda</p>
                    </div>
                    <div className="rounded-2xl overflow-hidden shadow-lg h-96">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.5088234567!2d30.060813!3d-1.953611!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca68f5a4c7b3d%3A0x5c3f3b3b3b3b3b3b!2sNorrsken%20House%20Kigali!5e0!3m2!1sen!2srw!4v1234567890123!5m2!1sen!2srw&q=Norrsken+House+Kigali,+KN+78+St,+Kigali"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Norrsken House Kigali Location"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
