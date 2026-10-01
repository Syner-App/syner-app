import { apiFetch } from "@/lib/api-client"
import type { Member } from "@/lib/types"

export function removeMemberAction(user_id: string) {
  return apiFetch<Member>(`/organization/members/${user_id}`, { method: "DELETE" })
}
