import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect vendor routes
  if (pathname.startsWith("/vendor")) {
    const session = await auth();

    // Not logged in - redirect to login
    if (!session?.user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Logged in but not a vendor - redirect to couple dashboard
    if (session.user.role !== "VENDOR") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    const session = await auth();

    // Not logged in - redirect to login
    if (!session?.user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Logged in but not an admin - redirect to appropriate dashboard
    if (session.user.role !== "ADMIN") {
      const redirectUrl = session.user.role === "VENDOR" ? "/vendor/dashboard" : "/dashboard";
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  // Protect couple dashboard routes
  if (pathname.startsWith("/dashboard")) {
    const session = await auth();

    // Not logged in - redirect to login
    if (!session?.user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Logged in but is a vendor - redirect to vendor dashboard
    if (session.user.role === "VENDOR") {
      return NextResponse.redirect(new URL("/vendor/dashboard", request.url));
    }

    // Logged in but is an admin - redirect to admin dashboard
    if (session.user.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/vendor/:path*", "/dashboard/:path*", "/admin/:path*"],
};
