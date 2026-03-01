import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Hardcoded users for frontend development
const mockUsers = [
    {
        id: "1",
        name: "John Doe",
        email: "user@andiza.rw",
        password: "password",
        role: "COUPLE",
        emailVerified: null,
        image: null,
    },
    {
        id: "2",
        name: "Vendor Admin",
        email: "vendor@andiza.rw",
        password: "password",
        role: "VENDOR",
        emailVerified: null,
        image: null,
    },
];

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
                    .object({ email: z.string().email(), password: z.string().min(1) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    
                    // Find user by email
                    const user = mockUsers.find(u => u.email === email);
                    
                    if (user && user.password === password) {
                        return {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            role: user.role,
                        };
                    }
                }

                return null;
            },
        }),
    ],
});
