import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";

// Notice: In the config suitable for Edge, we cannot use the Prisma Client directly inside the authorize function easily if it relies on non-edge features.
// BUT, for middleware, we mainly need the session callback logic and the pages config.
// The credentials provider logic itself (fetching user) often effectively BREAKS in middleware if we try to use it for 're-authorization', but middleware primarily validates the session token.
// However, to keep it clean for NextAuth v5 patterns:

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            if (trigger === "update" && session?.role) {
                token.role = session.role
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isDashboard = nextUrl.pathname.startsWith("/dashboard");
            const isAdmin = nextUrl.pathname.startsWith("/admin");
            const isAuthRoute = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/signup");

            if (isAuthRoute) {
                if (isLoggedIn) {
                    return Response.redirect(new URL("/dashboard", nextUrl));
                }
                return true;
            }

            if (isDashboard || isAdmin) {
                if (isLoggedIn) return true;
                return false; // Redirect to login
            }

            return true;
        },
    },
    providers: [], // Providers are added in auth.ts for the full node environment
} satisfies NextAuthConfig;
