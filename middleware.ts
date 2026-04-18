import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose"; // Import from jose

export async function middleware(req: NextRequest) {
  // Add 'async'
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  try {
    // Encode the secret for jose
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

    // Use jose's verify method
    await jwtVerify(token, secret);

    return NextResponse.next();
  } catch (err) {
    // If verification fails (expired, wrong secret, etc.), kick to sign-in
    console.error("JWT Verification Error:", err);
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
}

// Your matcher config is perfect, keep it as is!
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|images|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2?)$).*)",
  ],
};
