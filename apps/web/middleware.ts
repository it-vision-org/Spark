import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Routes that don't require authentication
const publicPaths = [
  "/auth/login",
  "/auth/signup",
  "/auth/forgetPassword",
  "/auth/resetPassword",
  "/",
  "/api/auth/login",
  "/api/auth/signup",
  "/api/auth/forgetPassword",
  "/api/auth/resetPassword",
];

// Routes that authenticated users should NOT access (redirect to home)
const authOnlyPaths = ["/auth/login", "/auth/signup"];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("authToken")?.value;

  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // If no token and trying to access a protected route → redirect to login
  if (!token && !isPublicPath) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If token exists, validate it
  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);

      // Authenticated user trying to access login/signup → redirect to home
      if (authOnlyPaths.some((path) => pathname.startsWith(path))) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch {
      // Token is invalid or expired — clear it
      const response = isPublicPath
        ? NextResponse.next()
        : NextResponse.redirect(new URL("/auth/login", request.url));

      response.cookies.set({
        name: "authToken",
        value: "",
        httpOnly: true,
        path: "/",
        maxAge: 0,
      });

      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
