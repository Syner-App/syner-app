import { apiFetch } from "@/lib/api-client"
import type { Member } from "@/lib/types"
import type { MemberPayload } from "@/app/dashboard/settings/organization/validations/member"

// Creates the user when the email is unknown (name and password required). An admin can
// only add members with role user
export function addMemberAction(payload: MemberPayload) {
  return apiFetch<Member>("/organization/members", { method: "POST", body: payload })
}
