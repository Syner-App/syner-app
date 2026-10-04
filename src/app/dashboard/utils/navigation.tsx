import {
  ArrowLeftRight,
  Bell,
  BookOpen,
  Building2,
  ChartColumn,
  CreditCard,
  LayoutDashboard,
  Package,
  ReceiptText,
  Settings2,
  ShoppingCart,
  SlidersHorizontal,
  Store,
  Wallet,
  WalletCards,
} from "lucide-react"

import { can, isSuperadmin } from "@/lib/permissions"
import type { User } from "@/lib/types"

export interface NavItem {
  title: string
  url: string
  icon: React.ReactNode
  // Count shown next to the item (active alerts)
  badge?: number
  // Spinner next to the title (purchase order being generated)
  loading?: boolean
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

// Breadcrumb titles by route
export const ROUTE_TITLES: Record<string, string> = {
  "/dashboard": "Panel",
  "/dashboard/products": "Productos e insumos",
  "/dashboard/alerts": "Alertas",
  "/dashboard/purchase-orders": "Órdenes de compra",
  "/dashboard/sell": "Registrar venta",
  "/dashboard/finance": "Resumen financiero",
  "/dashboard/finance/sales": "Ventas",
  "/dashboard/finance/movements": "Movimientos",
  "/dashboard/finance/payables": "Cuentas por pagar",
  "/dashboard/finance/credits": "Créditos",
  "/dashboard/finance/recipes": "Recetas e insumos",
  "/dashboard/finance/reports": "Reportes",
  "/dashboard/finance/settings": "Configuración financiera",
  "/dashboard/settings/organization": "Organización",
  "/dashboard/admin/organizations": "Organizaciones",
}

// The sidebar for the user's role: organization routes need a selected organization,
// finance and settings need owner or admin, and the platform group is for the superadmin
export function navigationFor(user: User): NavGroup[] {
  const groups: NavGroup[] = []

  if (user.organization_id) {
    groups.push({
      label: "Inventario",
      items: [
        { title: "Panel", url: "/dashboard", icon: <LayoutDashboard /> },
        { title: "Stock", url: "/dashboard/products", icon: <Package /> },
        { title: "Órdenes de compra", url: "/dashboard/purchase-orders", icon: <ShoppingCart /> },
        { title: "Alertas", url: "/dashboard/alerts", icon: <Bell /> },
      ],
    })

    if (can.registerSale(user.role)) {
      groups.push({
        label: "Ventas",
        items: [{ title: "Registrar venta", url: "/dashboard/sell", icon: <Store /> }],
      })
    }

    if (can.manageFinance(user.role)) {
      groups.push({
        label: "Finanzas",
        items: [
          { title: "Resumen", url: "/dashboard/finance", icon: <Wallet /> },
          { title: "Ventas", url: "/dashboard/finance/sales", icon: <ReceiptText /> },
          { title: "Movimientos", url: "/dashboard/finance/movements", icon: <ArrowLeftRight /> },
          { title: "Cuentas por pagar", url: "/dashboard/finance/payables", icon: <WalletCards /> },
          { title: "Créditos", url: "/dashboard/finance/credits", icon: <CreditCard /> },
          { title: "Recetas e insumos", url: "/dashboard/finance/recipes", icon: <BookOpen /> },
          { title: "Reportes", url: "/dashboard/finance/reports", icon: <ChartColumn /> },
          { title: "Configuración", url: "/dashboard/finance/settings", icon: <SlidersHorizontal /> },
        ],
      })
    }
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
