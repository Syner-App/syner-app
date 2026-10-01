"use client"

import { usePathname } from "next/navigation"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useSession } from "@/hooks/use-session"
import { ROUTE_TITLES } from "@/app/dashboard/utils/navigation"

export function DashboardBreadcrumb() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const organization = session?.memberships.find(
    ({ organization_id }) => organization_id === session.user.organization_id
  )

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          {organization?.organization_name ?? "Plataforma"}
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage className="truncate">{ROUTE_TITLES[pathname] ?? "Panel"}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
