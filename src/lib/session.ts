// httpOnly cookie holding the gateway token: JavaScript never sees it, the BFF route
// handlers (src/app/api) add it as the Bearer header
export const SESSION_COOKIE = "syner_token"

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  // Same lifetime as the gateway token (JWT_EXPIRES_IN, 2h); /api/auth/session renews both
  maxAge: 60 * 60 * 2,
}
