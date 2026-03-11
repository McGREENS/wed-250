import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

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
                    
                    // Find user in database
                    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
                    
                    if (user && user.password) {
                        const passwordMatch = await bcrypt.compare(password, user.password);
                        
                        if (passwordMatch) {
                            return {
                                id: user.id,
                                name: user.name,
                                email: user.email,
                                role: user.role,
                            };
                        }
                    }
                }

                return null;
            },
        }),
    ],
});
