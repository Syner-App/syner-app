import { cookies } from "next/headers"

import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/session"

// Server only: used by the route handlers in src/app/api
const GATEWAY_URL = process.env.GATEWAY_URL ?? "http://localhost:3000/api"

export interface GatewayResult<T = unknown> {
  ok: boolean
  status: number
  data: T
}

// Calls client-gateway with the session token. A network failure becomes a 503 with the
// same { statusCode, message } shape the gateway uses for its own errors
export async function callGateway<T = unknown>(
  path: string,
  init: RequestInit = {},
  token?: string
): Promise<GatewayResult<T>> {
  const headers = new Headers(init.headers)
  if (token) headers.set("Authorization", `Bearer ${token}`)
  if (init.body) headers.set("Content-Type", "application/json")

  let response: Response
  try {
    response = await fetch(`${GATEWAY_URL}${path}`, { ...init, headers, cache: "no-store" })
  } catch {
    return {
      ok: false,
      status: 503,
      data: { statusCode: 503, message: "El servidor no está disponible" } as T,
    }
  }

  const text = await response.text()
  const data = (text ? JSON.parse(text) : null) as T
  return { ok: response.ok, status: response.status, data }
}

export async function getSessionToken(): Promise<string | undefined> {
  return (await cookies()).get(SESSION_COOKIE)?.value
}

export async function setSessionToken(token: string): Promise<void> {
  ;(await cookies()).set(SESSION_COOKIE, token, sessionCookieOptions)
}

export async function clearSessionToken(): Promise<void> {
  ;(await cookies()).delete(SESSION_COOKIE)
}

export function toResponse({ status, data }: GatewayResult): Response {
  return data === null ? new Response(null, { status }) : Response.json(data, { status })
}
