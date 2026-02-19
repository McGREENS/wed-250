"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUser } from "@/actions/auth";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { toast } from "sonner";
import { Heart, Eye, EyeOff } from "lucide-react";

const SignupSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm Password is required"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof SignupSchema>;

export default function SignupPage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [serverError, setServerError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const form = useForm<SignupFormValues>({
        resolver: zodResolver(SignupSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = (values: SignupFormValues) => {
        setServerError(null);
        startTransition(async () => {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("email", values.email);
            formData.append("password", values.password);

            try {
                const response = await registerUser(formData);
                if (response?.error) {
                    setServerError(response.error);
                } else if (response?.success) {
                    toast.success("Account created successfully!");
                    router.push("/dashboard");
                }
            } catch (error) {
                // Nextjs redirect throws an error, so we can ignore it or handle it if it's strictly a redirect
                // But since we are pushing manually on success, generic errors are real errors
                console.error(error);
            }
        });
    };

    return (
        <div className="min-h-screen bg-cream flex items-center justify-center p-4 bg-noise">
            <Card className="w-full max-w-md border-gray-200 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="space-y-1 text-center">
                    <div className="w-12 h-12 bg-burgundy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-6 h-6 text-burgundy" />
                    </div>
                    <CardTitle className="text-2xl font-serif text-charcoal">Create an Account</CardTitle>
                    <CardDescription>
                        Enter your details to start planning your dream wedding
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {serverError && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                                {serverError}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Input
                                placeholder="Full Name"
                                {...form.register("name")}
                                className="bg-white/50 border-gray-200 focus:border-burgundy focus:ring-burgundy"
                            />
                            {form.formState.errors.name && (
                                <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Input
                                type="email"
                                placeholder="Email"
                                {...form.register("email")}
                                className="bg-white/50 border-gray-200 focus:border-burgundy focus:ring-burgundy"
                            />
                            {form.formState.errors.email && (
                                <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    {...form.register("password")}
                                    className="bg-white/50 border-gray-200 focus:border-burgundy focus:ring-burgundy pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {form.formState.errors.password && (
                                <p className="text-xs text-red-500">{form.formState.errors.password.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="relative">
                                <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm Password"
                                    {...form.register("confirmPassword")}
                                    className="bg-white/50 border-gray-200 focus:border-burgundy focus:ring-burgundy pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {form.formState.errors.confirmPassword && (
                                <p className="text-xs text-red-500">{form.formState.errors.confirmPassword.message}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-burgundy hover:bg-burgundy-light text-white"
                            disabled={isPending}
                        >
                            {isPending ? "Creating Account..." : "Sign Up"}
                        </Button>

                        <div className="text-center text-sm text-gray-500 mt-4">
                            Already have an account?{" "}
                            <Link href="/login" className="text-burgundy hover:underline font-medium">
                                Log in
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
