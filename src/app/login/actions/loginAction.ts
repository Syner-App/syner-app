import { apiFetch } from "@/lib/api-client"
import type { Session } from "@/lib/types"
import type { LoginValues } from "@/app/login/validations/auth"

export function loginAction(values: LoginValues) {
  // A 401 here means wrong credentials, not an expired session
  return apiFetch<Session>("/auth/login", {
    method: "POST",
    body: values,
    redirectOnUnauthorized: false,
  })
}
