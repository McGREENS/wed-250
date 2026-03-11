"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Label } from "@/app/components/ui/label";
import { toast } from "sonner";
import { Heart, Store, Eye, EyeOff } from "lucide-react";

const CoupleSignupSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm Password is required"),
    weddingDate: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

const VendorSignupSchema = z.object({
    businessName: z.string().min(1, "Business name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Valid phone number is required"),
    serviceCategory: z.string().min(1, "Service category is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm Password is required"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type CoupleFormValues = z.infer<typeof CoupleSignupSchema>;
type VendorFormValues = z.infer<typeof VendorSignupSchema>;

export default function SignupPage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [activeTab, setActiveTab] = useState("couple");

    const coupleForm = useForm<CoupleFormValues>({
        resolver: zodResolver(CoupleSignupSchema),
        defaultValues: { name: "", email: "", password: "", confirmPassword: "", weddingDate: "" },
    });

    const vendorForm = useForm<VendorFormValues>({
        resolver: zodResolver(VendorSignupSchema),
        defaultValues: { businessName: "", email: "", phone: "", serviceCategory: "", password: "", confirmPassword: "" },
    });

    const onCoupleSubmit = (values: CoupleFormValues) => {
        setError(null);
        startTransition(async () => {
            try {
                const res = await fetch("/api/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ type: "couple", ...values }),
                });
                const data = await res.json();
                if (!res.ok) {
                    setError(data.error || "Failed to create account");
                    return;
                }
                toast.success("Account created successfully!");
                router.push("/dashboard");
            } catch (err) {
                setError("Something went wrong");
            }
        });
    };

    const onVendorSubmit = (values: VendorFormValues) => {
        setError(null);
        startTransition(async () => {
            try {
                const res = await fetch("/api/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ type: "vendor", ...values }),
                });
                const data = await res.json();
                if (!res.ok) {
                    setError(data.error || "Failed to create account");
                    return;
                }
                toast.success("Vendor account created successfully!");
                router.push("/vendor/dashboard");
            } catch (err) {
                setError("Something went wrong");
            }
        });
    };

    return (
        <div className="min-h-screen bg-cream flex items-center justify-center p-4 bg-noise">
            <Card className="w-full max-w-lg border-gray-200 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-serif text-charcoal">Create an Account</CardTitle>
                    <CardDescription>Choose your account type to get started</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger value="couple" className="flex items-center gap-2">
                                <Heart className="w-4 h-4" />
                                Couple
                            </TabsTrigger>
                            <TabsTrigger value="vendor" className="flex items-center gap-2">
                                <Store className="w-4 h-4" />
                                Vendor
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="couple">
                            <form onSubmit={coupleForm.handleSubmit(onCoupleSubmit)} className="space-y-4">
                                {error && <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">{error}</div>}

                                <div className="space-y-2">
                                    <Label htmlFor="couple-name">Couple Names</Label>
                                    <Input id="couple-name" placeholder="e.g., Sarah & Michael" {...coupleForm.register("name")} />
                                    {coupleForm.formState.errors.name && <p className="text-xs text-red-500">{coupleForm.formState.errors.name.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="couple-email">Email Address</Label>
                                    <Input id="couple-email" type="email" placeholder="your@email.com" {...coupleForm.register("email")} />
                                    {coupleForm.formState.errors.email && <p className="text-xs text-red-500">{coupleForm.formState.errors.email.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="wedding-date">Wedding Date (Optional)</Label>
                                    <Input id="wedding-date" type="date" {...coupleForm.register("weddingDate")} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="couple-password">Password</Label>
                                    <div className="relative">
                                        <Input id="couple-password" type={showPassword ? "text" : "password"} placeholder="Min. 6 characters" {...coupleForm.register("password")} className="pr-10" />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {coupleForm.formState.errors.password && <p className="text-xs text-red-500">{coupleForm.formState.errors.password.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="couple-confirm">Confirm Password</Label>
                                    <div className="relative">
                                        <Input id="couple-confirm" type={showConfirmPassword ? "text" : "password"} placeholder="Confirm password" {...coupleForm.register("confirmPassword")} className="pr-10" />
                                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {coupleForm.formState.errors.confirmPassword && <p className="text-xs text-red-500">{coupleForm.formState.errors.confirmPassword.message}</p>}
                                </div>

                                <Button type="submit" className="w-full bg-burgundy hover:bg-burgundy-light text-white" disabled={isPending}>
                                    {isPending ? "Creating Account..." : "Create Couple Account"}
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="vendor">
                            <form onSubmit={vendorForm.handleSubmit(onVendorSubmit)} className="space-y-4">
                                {error && <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">{error}</div>}

                                <div className="space-y-2">
                                    <Label htmlFor="business-name">Business Name</Label>
                                    <Input id="business-name" placeholder="Your Business Name" {...vendorForm.register("businessName")} />
                                    {vendorForm.formState.errors.businessName && <p className="text-xs text-red-500">{vendorForm.formState.errors.businessName.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="vendor-email">Email Address</Label>
                                    <Input id="vendor-email" type="email" placeholder="business@email.com" {...vendorForm.register("email")} />
                                    {vendorForm.formState.errors.email && <p className="text-xs text-red-500">{vendorForm.formState.errors.email.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone" placeholder="+250 788 123 456" {...vendorForm.register("phone")} />
                                    {vendorForm.formState.errors.phone && <p className="text-xs text-red-500">{vendorForm.formState.errors.phone.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="service-category">Service Category</Label>
                                    <select id="service-category" {...vendorForm.register("serviceCategory")} className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white">
                                        <option value="">Select a category</option>
                                        <option value="venue">Venue</option>
                                        <option value="photography">Photography</option>
                                        <option value="catering">Catering</option>
                                        <option value="decoration">Decoration</option>
                                        <option value="music">Music/DJ</option>
                                        <option value="planning">Wedding Planning</option>
                                    </select>
                                    {vendorForm.formState.errors.serviceCategory && <p className="text-xs text-red-500">{vendorForm.formState.errors.serviceCategory.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="vendor-password">Password</Label>
                                    <div className="relative">
                                        <Input id="vendor-password" type={showPassword ? "text" : "password"} placeholder="Min. 6 characters" {...vendorForm.register("password")} className="pr-10" />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {vendorForm.formState.errors.password && <p className="text-xs text-red-500">{vendorForm.formState.errors.password.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="vendor-confirm">Confirm Password</Label>
                                    <div className="relative">
                                        <Input id="vendor-confirm" type={showConfirmPassword ? "text" : "password"} placeholder="Confirm password" {...vendorForm.register("confirmPassword")} className="pr-10" />
                                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {vendorForm.formState.errors.confirmPassword && <p className="text-xs text-red-500">{vendorForm.formState.errors.confirmPassword.message}</p>}
                                </div>

                                <Button type="submit" className="w-full bg-burgundy hover:bg-burgundy-light text-white" disabled={isPending}>
                                    {isPending ? "Creating Account..." : "Create Vendor Account"}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>

                    <div className="text-center text-sm text-gray-500 mt-6">
                        Already have an account?{" "}
                        <Link href="/login" className="text-burgundy hover:underline font-medium">Log in</Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
