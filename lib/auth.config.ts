import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        // @ts-ignore
        token.role = user.role as any;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.user.role = token.role as any;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  providers: [], // your providers
  session: { strategy: "jwt" },
};