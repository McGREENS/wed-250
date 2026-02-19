import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Mock user for frontend development
const mockUser = {
    id: "1",
    name: "Test User",
    email: "test@example.com",
    password: "$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u", // "password"
    role: "COUPLE",
    emailVerified: null,
    image: null,
};

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    session: { strategy: "jwt" },
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    
                    // Mock authentication - accepts any email with password "password"
                    if (password === "password") {
                        return { ...mockUser, email };
                    }
                }

                return null;
            },
        }),
    ],
});
