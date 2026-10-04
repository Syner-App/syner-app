import { NextResponse, type NextRequest } from "next/server"

import { SESSION_COOKIE } from "@/lib/session"

// Optimistic check on the cookie only: the gateway validates the token on every call and
// a 401 sends the user back to /login. "/" is the public landing, only for visitors without a session
export function proxy(request: NextRequest) {
  const hasSession = request.cookies.has(SESSION_COOKIE)
  const { pathname } = request.nextUrl
  const isPublic = pathname === "/login" || pathname === "/"

  if (!hasSession && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url))
  }
  if (hasSession && isPublic) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/login", "/select-organization", "/dashboard/:path*"],
}
