import { callGateway, getSessionToken, setSessionToken, toResponse } from "@/lib/gateway"
import type { User } from "@/lib/types"

// Replaces the session token with one scoped to another organization of the user
export async function POST(request: Request) {
  const result = await callGateway<{ user: User; token: string }>(
    "/auth/switch-organization",
    { method: "POST", body: await request.text() },
    await getSessionToken()
  )
  if (!result.ok) return toResponse(result)

  await setSessionToken(result.data.token)
  return Response.json({ user: result.data.user })
}
