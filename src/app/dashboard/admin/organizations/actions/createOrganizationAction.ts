import { apiFetch } from "@/lib/api-client"
import type { Organization } from "@/lib/types"
import type { CreateOrganizationValues } from "@/app/dashboard/admin/organizations/validations/organization"

export function createOrganizationAction(values: CreateOrganizationValues) {
  return apiFetch<Organization>("/organizations", { method: "POST", body: values })
}
