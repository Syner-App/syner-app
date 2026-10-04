"use client"

import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { useSession } from "@/hooks/use-session"
import { NavMain } from "@/app/dashboard/components/nav-main"
import { NavUser } from "@/app/dashboard/components/nav-user"
import { TeamSwitcher } from "@/app/dashboard/components/team-switcher"
import { navigationFor, type NavGroup } from "@/app/dashboard/utils/navigation"
import { useActiveAlertsCount } from "@/app/dashboard/alerts/hooks/useAlerts"
import { useIsGeneratingOrder } from "@/app/dashboard/purchase-orders/hooks/usePurchaseOrders"

const ALERTS_URL = "/dashboard/alerts"
const PURCHASE_ORDERS_URL = "/dashboard/purchase-orders"

function withAlertsBadge(groups: NavGroup[], count: number | undefined): NavGroup[] {
  return groups.map((group) => ({
    ...group,
    items: group.items.map((item) => (item.url === ALERTS_URL ? { ...item, badge: count } : item)),
  }))
}

function withOrdersLoading(groups: NavGroup[], loading: boolean): NavGroup[] {
  return groups.map((group) => ({
    ...group,
    items: group.items.map((item) => (item.url === PURCHASE_ORDERS_URL ? { ...item, loading } : item)),
  }))
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()
  const hasOrganization = Boolean(session?.user.organization_id)
  const { data: activeAlerts } = useActiveAlertsCount(hasOrganization)
  const generatingOrder = useIsGeneratingOrder(hasOrganization)

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {session ? <TeamSwitcher session={session} /> : <Skeleton className="h-12 w-full" />}
      </SidebarHeader>
      <SidebarContent>
        {session && (
          <NavMain
            groups={withOrdersLoading(withAlertsBadge(navigationFor(session.user), activeAlerts), generatingOrder)}
          />
        )}
      </SidebarContent>
      <SidebarFooter>
        {session ? <NavUser user={session.user} /> : <Skeleton className="h-12 w-full" />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
