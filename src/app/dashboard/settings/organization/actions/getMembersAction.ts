import { apiFetch } from "@/lib/api-client"
import type { List, Member } from "@/lib/types"

export function getMembersAction() {
  return apiFetch<List<Member>>("/organization/members")
}
