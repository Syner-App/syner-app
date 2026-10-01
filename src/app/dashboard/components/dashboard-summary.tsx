"use client"

import { Bell, Package, TriangleAlert } from "lucide-react"
import Link from "next/link"

import { PageHeader } from "@/components/page-header"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useSession } from "@/hooks/use-session"
import { useAlerts } from "@/app/dashboard/alerts/hooks/useAlerts"
import { useProducts } from "@/app/dashboard/products/hooks/useProducts"

function StatCard({
  title,
  value,
  href,
  icon,
}: {
  title: string
  value?: number
  href: string
  icon: React.ReactNode
}) {
  return (
    <Link href={href} className="rounded-xl transition-colors hover:bg-muted/50">
      <Card className="h-full bg-transparent">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            {icon}
            {title}
          </CardDescription>
          <CardTitle className="text-3xl tabular-nums">
            {value === undefined ? <Skeleton className="h-9 w-16" /> : value}
          </CardTitle>
        </CardHeader>
      </Card>
    </Link>
  )
}

// Totals come from meta.total of single-item pages
export function DashboardSummary() {
  const { data: session } = useSession()
  const organization = session?.memberships.find(
    ({ organization_id }) => organization_id === session.user.organization_id
  )

  const products = useProducts({ page: 1, limit: 1 })
  const lowStock = useProducts({ page: 1, limit: 1, stock_bajo: true })
  const alerts = useAlerts({ page: 1, limit: 1, estado: "ACTIVA" })

  return (
    <>
      <PageHeader
        title={organization ? organization.organization_name : "Panel"}
        description={session ? `Hola, ${session.user.name}.` : undefined}
      />
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <StatCard
          title="Productos activos"
          value={products.data?.meta.total}
          href="/dashboard/products"
          icon={<Package className="size-4" />}
        />
        <StatCard
          title="Con stock bajo"
          value={lowStock.data?.meta.total}
          href="/dashboard/products"
          icon={<TriangleAlert className="size-4" />}
        />
        <StatCard
          title="Alertas activas"
          value={alerts.data?.meta.total}
          href="/dashboard/alerts"
          icon={<Bell className="size-4" />}
        />
      </div>
    </>
  )
}
