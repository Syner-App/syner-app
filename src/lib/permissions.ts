import type { Role, User } from "@/lib/types"

// What each role can do in the UI. client-gateway and auth-ms enforce the same rules;
// this only hides what would be rejected anyway

export function isSuperadmin(user?: User): boolean {
  return user?.platform_role === "superadmin"
}

export function isManager(role?: Role): boolean {
  return role === "owner" || role === "admin"
}

export function isOwner(role?: Role): boolean {
  return role === "owner"
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

  // Purchase orders: any member lists them; owner/admin create them and change their status
  managePurchaseOrders: (role?: Role) => isManager(role),

  // Finance. Any member registers sales; owner/admin run the rest of the operation (sales
  // list, supplies, recipes, expenses, payables, installments, reports, assumptions)
  registerSale: (role?: Role) => role !== undefined,
  manageFinance: (role?: Role) => isManager(role),
  // Only the owner moves money between the business and its owners and takes the money
  // decisions: policy, new credit, prepayments, contributions, withdrawals, reserve, periods
  ownerFinance: (role?: Role) => isOwner(role),
}

export const ROLE_LABELS: Record<Role, string> = {
  owner: "Propietario",
  admin: "Administrador",
  user: "Usuario",
}

export const ROLES: Role[] = ["owner", "admin", "user"]
