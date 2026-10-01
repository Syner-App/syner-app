import { apiFetch } from "@/lib/api-client"
import type { List, Member } from "@/lib/types"

export function getOrganizationMembersAction(id: string) {
  return apiFetch<List<Member>>(`/organizations/${id}/members`)
}
