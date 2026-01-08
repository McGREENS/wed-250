"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPageUrl } from '@/app/utils';
import { base44 } from '@/api/base44Client';
import { CheckCircle, Heart, Calendar, Users, DollarSign, Sparkles } from 'lucide-react';
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";

export default function PlanBuilderPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        couple_names: '',
        wedding_date: '',
        venue_preference: '',
        guest_count: '',
        budget: '',
        services_needed: [] as string[],
        contact_email: '',
        contact_phone: '',
        notes: ''
    });

    const steps = [
        { number: 1, title: 'Basic Info', icon: Heart },
        { number: 2, title: 'Wedding Details', icon: Calendar },
        { number: 3, title: 'Services', icon: Sparkles },
        { number: 4, title: 'Contact', icon: Users }
    ];

    const serviceOptions = [
        'Venues',
        'Photographers',
        'Decor',
        'Food & Beverages',
        'Wedding Planners',
        'Entertainment',
        'Car Rental'
    ];

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleService = (service: string) => {
        setFormData(prev => ({
            ...prev,
            services_needed: prev.services_needed.includes(service)
                ? prev.services_needed.filter(s => s !== service)
                : [...prev.services_needed, service]
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await base44.entities.WeddingPlan.create({
                ...formData,
                guest_count: parseInt(formData.guest_count),
                budget: parseFloat(formData.budget),
                status: 'pending'
            });
            router.push(createPageUrl('Dashboard'));
        } catch (error) {
            console.error('Error creating wedding plan:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const canProceed = () => {
        if (currentStep === 1) return formData.couple_names && formData.wedding_date;
        if (currentStep === 2) return formData.guest_count && formData.budget;
        if (currentStep === 3) return formData.services_needed.length > 0;
        if (currentStep === 4) return formData.contact_email;
        return true;
    };

    return (
        <div className="min-h-screen bg-cream py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-block bg-burgundy/10 px-4 py-2 rounded-full mb-4">
                        <span className="text-burgundy text-sm font-medium">✨ Start Your Journey</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif text-charcoal mb-4">
                        Plan Your Dream Wedding
                    </h1>
                    <p className="text-lg text-gray-600">
                        Tell us about your vision and we'll match you with perfect vendors
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="mb-12">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isActive = currentStep === step.number;
                            const isCompleted = currentStep > step.number;

                            return (
                                <React.Fragment key={step.number}>
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${isCompleted
                                                ? 'bg-burgundy-light text-white'
                                                : isActive
                                                    ? 'bg-burgundy text-white'
                                                    : 'bg-gray-200 text-gray-400'
                                                }`}
                                        >
                                            {isCompleted ? (
                                                <CheckCircle className="w-6 h-6" />
                                            ) : (
                                                <Icon className="w-6 h-6" />
                                            )}
                                        </div>
                                        <span
                                            className={`text-sm font-medium ${isActive ? 'text-burgundy' : 'text-gray-600'
                                                }`}
                                        >
                                            {step.title}
                                        </span>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div
                                            className={`flex-1 h-0.5 mx-4 transition-all ${currentStep > step.number ? 'bg-burgundy-light' : 'bg-gray-200'
                                                }`}
                                        />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>

                {/* Form Card */}
                <Card className="border-gray-100 shadow-xl">
                    <CardContent className="p-8">
                        {/* Step 1: Basic Info */}
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-[#2C2C2C] mb-6">
                                    Let's Start with the Basics
                                </h2>

                                <div>
                                    <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                                        Couple Names *
                                    </label>
                                    <Input
                                        placeholder="e.g., Sarah & John"
                                        value={formData.couple_names}
                                        onChange={(e) => handleInputChange('couple_names', e.target.value)}
                                        className="border-gray-200"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                                        Wedding Date *
                                    </label>
                                    <Input
                                        type="date"
                                        value={formData.wedding_date}
                                        onChange={(e) => handleInputChange('wedding_date', e.target.value)}
                                        className="border-gray-200"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                                        Venue Preference
                                    </label>
                                    <Input
                                        placeholder="e.g., Garden, Beach, Ballroom"
                                        value={formData.venue_preference}
                                        onChange={(e) => handleInputChange('venue_preference', e.target.value)}
                                        className="border-gray-200"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        What type of venue are you envisioning?
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Wedding Details */}
                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-[#2C2C2C] mb-6">
                                    Tell Us More About Your Wedding
                                </h2>

                                <div>
                                    <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                                        Expected Guest Count *
                                    </label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <Input
                                            type="number"
                                            placeholder="e.g., 150"
                                            value={formData.guest_count}
                                            onChange={(e) => handleInputChange('guest_count', e.target.value)}
                                            className="border-gray-200 pl-10"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                                        Total Budget *
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <Input
                                            type="number"
                                            placeholder="e.g., 25000"
                                            value={formData.budget}
                                            onChange={(e) => handleInputChange('budget', e.target.value)}
                                            className="border-gray-200 pl-10"
                                        />
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">
                                        This helps us recommend vendors within your price range
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                                        Additional Notes
                                    </label>
                                    <Textarea
                                        placeholder="Tell us about your wedding vision, theme, or any special requirements..."
                                        value={formData.notes}
                                        onChange={(e) => handleInputChange('notes', e.target.value)}
                                        className="border-gray-200 h-32"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 3: Services */}
                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-[#2C2C2C] mb-2">
                                    What Services Do You Need?
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    Select all the services you'd like help with *
                                </p>

                                <div className="grid grid-cols-2 gap-4">
                                    {serviceOptions.map((service) => {
                                        const isSelected = formData.services_needed.includes(service);
                                        return (
                                            <button
                                                key={service}
                                                onClick={() => toggleService(service)}
                                                className={`p-4 rounded-xl border-2 transition-all text-left ${isSelected
                                                    ? 'border-burgundy bg-burgundy/5'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium text-[#2C2C2C]">{service}</span>
                                                    {isSelected && (
                                                        <CheckCircle className="w-5 h-5 text-burgundy" />
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Step 4: Contact */}
                        {currentStep === 4 && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-[#2C2C2C] mb-6">
                                    How Can We Reach You?
                                </h2>

                                <div>
                                    <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                                        Email Address *
                                    </label>
                                    <Input
                                        type="email"
                                        placeholder="your.email@example.com"
                                        value={formData.contact_email}
                                        onChange={(e) => handleInputChange('contact_email', e.target.value)}
                                        className="border-gray-200"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                                        Phone Number
                                    </label>
                                    <Input
                                        type="tel"
                                        placeholder="(555) 123-4567"
                                        value={formData.contact_phone}
                                        onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                                        className="border-gray-200"
                                    />
                                </div>

                                <div className="bg-sand/20 rounded-xl p-6 mt-6">
                                    <h3 className="font-semibold text-charcoal mb-2">✨ What Happens Next?</h3>
                                    <ul className="space-y-2 text-sm text-gray-700">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="w-5 h-5 text-burgundy flex-shrink-0 mt-0.5" />
                                            We'll match you with the best vendors for your needs
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="w-5 h-5 text-burgundy flex-shrink-0 mt-0.5" />
                                            You'll receive personalized recommendations in your dashboard
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="w-5 h-5 text-burgundy flex-shrink-0 mt-0.5" />
                                            Our team will reach out within 24 hours
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                            {currentStep > 1 ? (
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentStep(currentStep - 1)}
                                    className="border-gray-200"
                                >
                                    Previous
                                </Button>
                            ) : (
                                <div />
                            )}

                            {currentStep < 4 ? (
                                <Button
                                    onClick={() => setCurrentStep(currentStep + 1)}
                                    disabled={!canProceed()}
                                    className="bg-burgundy hover:bg-burgundy-light text-white"
                                >
                                    Continue
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={!canProceed() || isSubmitting}
                                    className="bg-burgundy hover:bg-burgundy-light text-white"
                                >
                                    {isSubmitting ? 'Creating Your Plan...' : 'Complete & View Dashboard'}
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
