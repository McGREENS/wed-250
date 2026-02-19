"use server";

import { z } from "zod";
import { signIn } from "@/auth";

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
        // Mock registration - always succeeds for frontend development
        // In production, this would create a user in the database
        
        try {
            await signIn("credentials", {
                email,
                password: "password", // Mock password
                redirect: false,
            });
        } catch (err) {
            if ((err as Error).message.includes("NEXT_REDIRECT")) {
                throw err;
            }
        }

        return { success: "Account created successfully!" };

    } catch (error) {
        if ((error as Error).message.includes("NEXT_REDIRECT")) {
            throw error;
        }
        return { error: "Something went wrong during registration." };
    }
}
