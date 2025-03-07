import { auth } from "@/auth"; // Import from your NextAuth setup
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.expires) {
      return NextResponse.redirect(new URL("/login", req.url)); // Redirect if not authenticated
    }

    const expiresAt = new Date(session.expires).getTime();
    const currentTime = Date.now();

    if (expiresAt < currentTime) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next(); // Continue to requested page if authenticated
  } catch (error) {
    console.error("Middleware Auth Error:", error);
    return NextResponse.redirect(new URL("/login", req.url)); // Redirect instead of 401 error
  }
}

// Apply middleware only to protected routes
export const config = {
  matcher: ["/((?!api|_next/static|login|_next/image|favicon.ico).*)"],
};
