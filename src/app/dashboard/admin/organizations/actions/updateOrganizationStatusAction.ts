import { apiFetch } from "@/lib/api-client"
import type { Organization, OrganizationStatus } from "@/lib/types"

// SUSPENDED rejects every token of the organization on its next request
export function updateOrganizationStatusAction({ id, status }: { id: string; status: OrganizationStatus }) {
  return apiFetch<Organization>(`/organizations/${id}/status`, { method: "PATCH", body: { status } })
}
