import { apiFetch } from "@/lib/api-client"
import type { Role, User } from "@/lib/types"

// Owner only, in the organization of the session; nobody changes their own role
export function updateMemberRoleAction({ user_id, role }: { user_id: string; role: Role }) {
  return apiFetch<User>(`/auth/users/${user_id}/role`, { method: "PATCH", body: { role } })
}
