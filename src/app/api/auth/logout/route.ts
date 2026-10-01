import { clearSessionToken } from "@/lib/gateway"

// Tokens are stateless on the backend: logging out only drops the cookie
export async function POST() {
  await clearSessionToken()
  return new Response(null, { status: 204 })
}
