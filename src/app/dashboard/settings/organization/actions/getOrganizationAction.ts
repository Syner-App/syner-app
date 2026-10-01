import { apiFetch } from "@/lib/api-client"
import type { Organization } from "@/lib/types"

// The organization of the session (owner and admin)
export function getOrganizationAction() {
  return apiFetch<Organization>("/organization")
}
