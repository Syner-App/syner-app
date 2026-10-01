import { apiFetch } from "@/lib/api-client"
import type { Member } from "@/lib/types"

export function removeOrganizationMemberAction({ id, user_id }: { id: string; user_id: string }) {
  return apiFetch<Member>(`/organizations/${id}/members/${user_id}`, { method: "DELETE" })
}
