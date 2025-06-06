import { NextResponse } from "next/server";

const isAuthPage = (pathname) => {
  return pathname === "/auth/sign-in" || pathname === "/auth/sign-up";
};

export function middleware(request) {
  const user = request.cookies.get("access_token");
  const pathname = request.nextUrl.pathname;

  console.log("User:", user);
  console.log("Request Pathname:", pathname);

  // Allow access to auth pages without token
  if (isAuthPage(pathname)) {
    // If user is authenticated and trying to access auth pages, redirect to home
    if (user) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
    // If user is not authenticated, allow access to auth pages
    return NextResponse.next();
  }

  // For all other pages, require authentication
  if (!user) {
    if (pathname.includes("/auth")) return NextResponse.next();
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  // User is authenticated and accessing protected pages
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
