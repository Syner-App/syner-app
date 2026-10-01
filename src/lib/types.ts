// Shapes returned by client-gateway. Field names are snake_case, like the backend

export type Role = "owner" | "admin" | "user"

export type OrganizationStatus = "ACTIVE" | "SUSPENDED"

// organization_id and role describe the organization the session is scoped to
export interface User {
  id: string
  name: string
  email: string
  platform_role?: "superadmin"
  organization_id?: string
  role?: Role
}

// An active organization the user belongs to
export interface Membership {
  organization_id: string
  organization_name: string
  organization_slug: string
  role: Role
}

export interface Session {
  user: User
  memberships: Membership[]
}

export interface Organization {
  id: string
  name: string
  slug: string
  status: OrganizationStatus
  createdAt: string
}

export interface Member {
  user_id: string
  name: string
  email: string
  organization_id: string
  role: Role
}

export interface List<T> {
  data: T[]
}

export interface Paginated<T> {
  data: T[]
  meta: { total: number; page: number; lastPage: number }
}
