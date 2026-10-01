import { apiFetch } from "@/lib/api-client"
import type { List, Organization } from "@/lib/types"

// Every organization, newest first (superadmin)
export function getOrganizationsAction() {
  return apiFetch<List<Organization>>("/organizations")
}
