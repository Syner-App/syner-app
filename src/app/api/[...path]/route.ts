import type { NextRequest } from "next/server"

import { callGateway, clearSessionToken, getSessionToken, toResponse } from "@/lib/gateway"

// Forwards every other /api/* call to client-gateway with the session token as Bearer
async function forward(request: NextRequest, ctx: RouteContext<"/api/[...path]">) {
  const { path } = await ctx.params
  const target = `/${path.map(encodeURIComponent).join("/")}${request.nextUrl.search}`
  const body = request.method === "GET" ? undefined : (await request.text()) || undefined

  const result = await callGateway(target, { method: request.method, body }, await getSessionToken())
  if (result.status === 401) await clearSessionToken()
  return toResponse(result)
}

export { forward as GET, forward as POST, forward as PATCH, forward as DELETE }
