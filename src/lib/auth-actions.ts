import { apiFetch } from "@/lib/api-client"
import type { Session, User } from "@/lib/types"

export function getSessionAction() {
  return apiFetch<Session>("/auth/session")
}

export function switchOrganizationAction(organization_id: string) {
  return apiFetch<{ user: User }>("/auth/switch-organization", {
    method: "POST",
    body: { organization_id },
  })
}

export function logoutAction() {
  return apiFetch<null>("/auth/logout", { method: "POST" })
}
