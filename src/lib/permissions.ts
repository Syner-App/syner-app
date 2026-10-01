import type { Role, User } from "@/lib/types"

// What each role can do in the UI. client-gateway and auth-ms enforce the same rules;
// this only hides what would be rejected anyway

export function isSuperadmin(user?: User): boolean {
  return user?.platform_role === "superadmin"
}

export function isManager(role?: Role): boolean {
  return role === "owner" || role === "admin"
}

export const can = {
  // Create, edit and delete products (listing, stock movements and alerts: any member)
  manageProducts: (role?: Role) => isManager(role),
  // See the organization settings and its members
  viewOrganization: (role?: Role) => isManager(role),
  renameOrganization: (role?: Role) => role === "owner",
  changeMemberRole: (role?: Role) => role === "owner",
  // An admin only adds and removes members with role user
  assignRole: (role: Role | undefined, target: Role) =>
    role === "owner" || (role === "admin" && target === "user"),
  removeMember: (role: Role | undefined, target: Role) =>
    role === "owner" || (role === "admin" && target === "user"),
}

export const ROLE_LABELS: Record<Role, string> = {
  owner: "Propietario",
  admin: "Administrador",
  user: "Usuario",
}

export const ROLES: Role[] = ["owner", "admin", "user"]
