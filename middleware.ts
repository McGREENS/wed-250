import { authConfig } from "@/lib/auth.config";  // Import the common config only
import NextAuth from "next-auth";

const auth = NextAuth(authConfig).auth;  // Lightweight instance, no adapter

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth?.user;

  const protectedPaths = ["/dashboard", "/plan"];
  const isProtected = protectedPaths.some((path) =>
    nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !isLoggedIn) {
    const signInUrl = new URL("/auth/signin", nextUrl);
    signInUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return Response.redirect(signInUrl);
  }

  // Role-based redirects can go here if needed
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|auth).*)"],
};