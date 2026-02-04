"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

const RegisterSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function registerUser(formData: FormData) {
    const validatedFields = RegisterSchema.safeParse(Object.fromEntries(formData));

    if (!validatedFields.success) {
        return { error: "Invalid fields" };
    }

    const { email, password, name } = validatedFields.data;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return { error: "Email already in use" };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "COUPLE", // Default role
            },
        });

        // Attempt to sign in immediately after registration
        // Note: We can't return the result of signIn because it redirects (throws error)
        // So we catch the redirect error specifically
        try {
            await signIn("credentials", {
                email,
                password,
                redirect: false,
            });
        } catch (err) {
            // signIn throws NEXT_REDIRECT, which we might want to let bubble up if we want auto-redirect
            // For now, let's just return success and let the client handle navigation
            if ((err as Error).message.includes("NEXT_REDIRECT")) {
                throw err;
            }
        }

        return { success: "Account created successfully!" };

    } catch (error) {
        if ((error as Error).message.includes("NEXT_REDIRECT")) {
            throw error;
        }
        // console.error("Registration error:", error);
        return { error: "Something went wrong during registration." };
    }
}
