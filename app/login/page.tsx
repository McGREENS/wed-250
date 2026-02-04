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
import { Lock } from "lucide-react";

const LoginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof LoginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

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
                    router.push("/dashboard");
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
                            <Input
                                type="password"
                                placeholder="Password"
                                {...form.register("password")}
                                className="bg-white/50 border-gray-200 focus:border-burgundy focus:ring-burgundy"
                            />
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

                        <div className="text-center text-sm text-gray-500 mt-4">
                            Don't have an account?{" "}
                            <Link href="/signup" className="text-burgundy hover:underline font-medium">
                                Sign up
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
