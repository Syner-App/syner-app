import { apiFetch } from "@/lib/api-client"
import type { Member } from "@/lib/types"
import type { MemberPayload } from "@/app/dashboard/settings/organization/validations/member"

export function addOrganizationMemberAction({ id, payload }: { id: string; payload: MemberPayload }) {
  return apiFetch<Member>(`/organizations/${id}/members`, { method: "POST", body: payload })
}
