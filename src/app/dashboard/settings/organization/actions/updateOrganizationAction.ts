import { apiFetch } from "@/lib/api-client"
import type { Organization } from "@/lib/types"

// Owner only; the slug stays fixed
export function updateOrganizationAction(values: { name: string }) {
  return apiFetch<Organization>("/organization", { method: "PATCH", body: values })
}
