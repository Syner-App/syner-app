import { callGateway, clearSessionToken, getSessionToken, setSessionToken, toResponse } from "@/lib/gateway"
import type { Membership, User } from "@/lib/types"

interface AuthResponse {
  user: User
  token: string
  memberships: Membership[]
}

// The current user and memberships. The gateway renews the token on every verify, so
// this also extends the session
export async function GET() {
  const token = await getSessionToken()
  if (!token) {
    return Response.json({ statusCode: 401, message: "Sesión no iniciada" }, { status: 401 })
  }

  const result = await callGateway<AuthResponse>("/auth/verify", {}, token)
  if (!result.ok) {
    if (result.status === 401 || result.status === 403) await clearSessionToken()
    return toResponse(result)
  }

  const { user, token: renewed, memberships } = result.data
  await setSessionToken(renewed)
  return Response.json({ user, memberships })
}
