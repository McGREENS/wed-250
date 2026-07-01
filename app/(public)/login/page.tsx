"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react"; // Client-side signIn
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { toast } from "sonner";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";

const LoginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof LoginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [resettingPassword, setResettingPassword] = useState(false);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (values: LoginFormValues) => {
        setError(null);
        startTransition(async () => {
            try {
                const res = await signIn("credentials", {
                    email: values.email,
                    password: values.password,
                    redirect: false,
                });

                if (res?.error) {
                    setError("Invalid email or password");
                } else if (res?.ok) {
                    toast.success("Welcome back!");
                    // Clear welcome popup flag so it shows on next dashboard visit
                    const sessionRes = await fetch('/api/auth/session');
                    const session = await sessionRes.json();
                    if (session?.user?.id) {
                      sessionStorage.removeItem(`andiza_welcome_${session.user.id}`);
                    }
                    if (session?.user?.role === 'ADMIN') {
                        router.push("/admin");
                    } else if (session?.user?.role === 'VENDOR') {
                        router.push("/vendor/dashboard");
                    } else {
                        router.push("/dashboard");
                    }
                    router.refresh();
                }
            } catch (err) {
                setError("Something went wrong");
            }
        });
    };

    return (
        <div className="min-h-screen bg-cream flex items-center justify-center p-4 bg-noise">
            <Card className="w-full max-w-md border-gray-200 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="space-y-1 text-center">
                    <div className="w-12 h-12 bg-burgundy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-6 h-6 text-burgundy" />
                    </div>
                    <CardTitle className="text-2xl font-serif text-charcoal">Welcome Back</CardTitle>
                    <CardDescription>
                        Enter your credentials to access your dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                                {error}
                            </div>
                        )}

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

                        <Button
                            type="submit"
                            className="w-full bg-burgundy hover:bg-burgundy-light text-white"
                            disabled={isPending}
                        >
                            {isPending ? "Logging in..." : "Log In"}
                        </Button>

                        <div className="text-center text-sm">
                            <button
                                type="button"
                                onClick={() => setShowForgotPassword(true)}
                                className="text-burgundy hover:underline font-medium"
                            >
                                Forgot password?
                            </button>
                        </div>

                        <div className="text-center text-sm text-gray-500 mt-2">
                            Don't have an account?{" "}
                            <Link href="/signup" className="text-burgundy hover:underline font-medium">
                                Sign up
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Forgot Password Modal */}
            {showForgotPassword && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-md bg-white border-gray-200 shadow-2xl">
                        <CardHeader className="border-b border-gray-200 bg-gray-50">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-bold text-charcoal">Reset Password</CardTitle>
                                <button
                                    onClick={() => {
                                        setShowForgotPassword(false);
                                        setForgotEmail('');
                                    }}
                                    disabled={resettingPassword}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 bg-white">
                            <p className="text-sm text-gray-600 mb-4">
                                Enter your email address and we'll send you a new password.
                            </p>
                            <div className="space-y-4">
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                    disabled={resettingPassword}
                                    className="border-gray-300"
                                />
                                <div className="flex gap-3">
                                    <Button
                                        onClick={async () => {
                                            if (!forgotEmail) {
                                                toast.error('Please enter your email');
                                                return;
                                            }
                                            setResettingPassword(true);
                                            try {
                                                const res = await fetch('/api/auth/forgot-password', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ email: forgotEmail }),
                                                });
                                                const data = await res.json();
                                                if (res.ok) {
                                                    toast.success('New password sent to your email');
                                                    setShowForgotPassword(false);
                                                    setForgotEmail('');
                                                } else {
                                                    toast.error(data.error || 'Failed to reset password');
                                                }
                                            } catch (error) {
                                                toast.error('Failed to reset password');
                                            } finally {
                                                setResettingPassword(false);
                                            }
                                        }}
                                        disabled={!forgotEmail || resettingPassword}
                                        className="flex-1 bg-burgundy hover:bg-burgundy/90 text-white"
                                    >
                                        {resettingPassword ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            'Send New Password'
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setShowForgotPassword(false);
                                            setForgotEmail('');
                                        }}
                                        disabled={resettingPassword}
                                        className="border-gray-300"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
