import {
  Bell,
  Building2,
  LayoutDashboard,
  Package,
  Settings2,
} from "lucide-react"

import { can, isSuperadmin } from "@/lib/permissions"
import type { User } from "@/lib/types"

export interface NavItem {
  title: string
  url: string
  icon: React.ReactNode
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

// Breadcrumb titles by route
export const ROUTE_TITLES: Record<string, string> = {
  "/dashboard": "Panel",
  "/dashboard/products": "Productos",
  "/dashboard/alerts": "Alertas",
  "/dashboard/settings/organization": "Organización",
  "/dashboard/admin/organizations": "Organizaciones",
}

// The sidebar for the user's role: organization routes need a selected organization,
// settings need owner or admin, and the platform group is for the superadmin
export function navigationFor(user: User): NavGroup[] {
  const groups: NavGroup[] = []

  if (user.organization_id) {
    groups.push({
      label: "Inventario",
      items: [
        { title: "Panel", url: "/dashboard", icon: <LayoutDashboard /> },
        { title: "Productos", url: "/dashboard/products", icon: <Package /> },
        { title: "Alertas", url: "/dashboard/alerts", icon: <Bell /> },
      ],
    })
  }

  if (can.viewOrganization(user.role)) {
    groups.push({
      label: "Configuración",
      items: [{ title: "Organización", url: "/dashboard/settings/organization", icon: <Settings2 /> }],
    })
  }

  if (isSuperadmin(user)) {
    groups.push({
      label: "Plataforma",
      items: [{ title: "Organizaciones", url: "/dashboard/admin/organizations", icon: <Building2 /> }],
    })
  }
  return groups
}
