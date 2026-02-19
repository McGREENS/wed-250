"use client";

import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
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

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await base44.entities.ContactMessage.create(formData);
            setIsSubmitted(true);
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });

            setTimeout(() => setIsSubmitted(false), 5000);
        } catch (error) {
            console.error('Error submitting contact form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactInfo = [
        {
            icon: Mail,
            title: 'Email Us',
            value: 'support@weds360.rw',
            description: 'We\'ll respond within 24 hours'
        },
        {
            icon: Phone,
            title: 'Call Us',
            value: '(555) 123-4567',
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
                                        <div className="w-16 h-16 bg-burgundy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle className="w-8 h-8 text-burgundy" />
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
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                                                    Your Name *
                                                </label>
                                                <Input
                                                    required
                                                    placeholder="John Doe"
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
                                                    placeholder="john@example.com"
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
                                                    placeholder="(555) 123-4567"
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
                                                    placeholder="How can we help?"
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
                                                placeholder="Tell us more about your inquiry..."
                                                value={formData.message}
                                                onChange={(e) => handleInputChange('message', e.target.value)}
                                                className="border-gray-200 h-40"
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-burgundy hover:bg-burgundy-light text-white py-6 text-lg"
                                        >
                                            {isSubmitting ? (
                                                'Sending...'
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
                                    {['facebook', 'instagram', 'twitter', 'pinterest'].map((social) => (
                                        <button
                                            key={social}
                                            className="w-10 h-10 bg-gray-100 hover:bg-burgundy hover:text-white rounded-full flex items-center justify-center transition-all"
                                        >
                                            <span className="text-xl">{social[0].toUpperCase()}</span>
                                        </button>
                                    ))}
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
