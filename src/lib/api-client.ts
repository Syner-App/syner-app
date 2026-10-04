// Browser calls to the BFF route handlers (src/app/api), which forward them to
// client-gateway with the session cookie

import { translate } from "@/lib/messages"

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly messages: string[]
  ) {
    super(messages.join(". "))
    this.name = "ApiError"
  }
}

type Query = Record<string, string | number | boolean | undefined | null>

interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  body?: unknown
  query?: Query
  // false for calls where a 401 is an expected answer (login)
  redirectOnUnauthorized?: boolean
}

function toSearch(query?: Query): string {
  if (!query) return ""
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== "") params.set(key, String(value))
  }
  const search = params.toString()
  return search ? `?${search}` : ""
}

export async function apiFetch<T>(
  path: string,
  { method = "GET", body, query, redirectOnUnauthorized = true }: ApiOptions = {}
): Promise<T> {
  let response: Response
  try {
    response = await fetch(`/api${path}${toSearch(query)}`, {
      method,
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError(0, ["No se pudo conectar con el servidor"])
  }

  const text = await response.text()
  const data: unknown = text ? JSON.parse(text) : null

  if (!response.ok) {
    if (response.status === 401 && redirectOnUnauthorized) {
      // A full reload on purpose: it drops every cached query of the expired session
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign("/login")
    }
    // The gateway sends message as a string (gRPC errors) or a string[] (validation)
    const message = (data as { message?: string | string[] } | null)?.message
    const messages = Array.isArray(message) ? message : [message ?? "Ocurrió un error inesperado"]
    throw new ApiError(response.status, messages.map((message) => translate(message, response.status)))
  }
  return data as T
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Ocurrió un error inesperado"
}
