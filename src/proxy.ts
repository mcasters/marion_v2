import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/constants/admin";

export function proxy(request: NextRequest) {
  const currentUser = request.cookies.get(COOKIE_NAME)?.value;

  if (!currentUser && request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
