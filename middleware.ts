import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

async function verifyCustomToken(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("token")?.value;

  const nextAuthToken =
    req.cookies.get("next-auth.session-token")?.value ||
    req.cookies.get("__Secure-next-auth.session-token")?.value;

  // NextAuth Google login is valid if cookie exists
  const hasGoogleSession = !!nextAuthToken;

  // Custom login must be VERIFIED
  const hasValidCustomToken = token ? await verifyCustomToken(token) : false;

  const isAuthenticated = hasGoogleSession || hasValidCustomToken;

  // If logged in, prevent access to sign-in / sign-up
  if (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  }

  // Allow NextAuth routes
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Protected routes
  if (isAuthenticated) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/sign-in", req.url));
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|images|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2?)$).*)",
  ],
};
