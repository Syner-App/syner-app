import type { Session } from "@/lib/types"

// Where to go after logging in: a session already scoped to an organization opens the
// panel; the superadmin without one goes to the platform; several memberships, the picker
export function landingPath({ user }: Session): string {
  if (user.organization_id) return "/dashboard"
  if (user.platform_role === "superadmin") return "/dashboard/admin/organizations"
  return "/select-organization"
}
