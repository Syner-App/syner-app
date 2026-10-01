import { callGateway, setSessionToken, toResponse } from "@/lib/gateway"
import type { Membership, User } from "@/lib/types"

interface AuthResponse {
  user: User
  token: string
  memberships: Membership[]
}

// Logs in against the gateway and keeps the token in the httpOnly cookie; the browser
// only gets the user and its memberships
export async function POST(request: Request) {
  const result = await callGateway<AuthResponse>("/auth/login", {
    method: "POST",
    body: await request.text(),
  })
  if (!result.ok) return toResponse(result)

  const { user, token, memberships } = result.data
  await setSessionToken(token)
  return Response.json({ user, memberships })
}
