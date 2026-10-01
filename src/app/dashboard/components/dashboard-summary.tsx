"use client"

import { ArrowRight, Bell, HandCoins, Package, ShoppingCart, Store, TrendingUp, TriangleAlert, Wallet, Waves } from "lucide-react"
import Link from "next/link"

import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/stat-card"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSession } from "@/hooks/use-session"
import { formatMoney, formatPeriod } from "@/lib/format"
import { can } from "@/lib/permissions"
import { useAlerts } from "@/app/dashboard/alerts/hooks/useAlerts"
import { FinanceAlerts } from "@/app/dashboard/finance/components/finance-alerts"
import { useFinanceDashboard } from "@/app/dashboard/finance/hooks/useFinanceQueries"
import { useProducts } from "@/app/dashboard/products/hooks/useProducts"
import { usePurchaseOrders } from "@/app/dashboard/purchase-orders/hooks/usePurchaseOrders"

// Finance highlights for owner/admin; the full view is /dashboard/finance
function FinanceSummary() {
  const dashboard = useFinanceDashboard()
  const data = dashboard.data
  const statement = data?.estado_resultados
  const answers = data?.respuestas

  if (dashboard.isError) return null

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="size-4" />
          Finanzas
        </CardTitle>
        <CardDescription>{data ? formatPeriod(data.periodo) : "Periodo actual"}</CardDescription>
        <CardAction>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/finance">
              Ver resumen
              <ArrowRight />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard title="Ventas del mes" icon={<Store />} value={statement && formatMoney(statement.ventas)} />
          <StatCard
            title="Utilidad operativa"
            icon={<TrendingUp />}
            value={statement && formatMoney(statement.utilidad_operativa)}
            tone={statement && statement.utilidad_operativa < 0 ? "negative" : "default"}
          />
          <StatCard
            title="Flujo disponible"
            icon={<Waves />}
            value={statement && formatMoney(statement.flujo_disponible)}
            tone={statement && statement.flujo_disponible < 0 ? "negative" : "default"}
          />
          <StatCard title="Retiro máximo" icon={<HandCoins />} value={answers && formatMoney(answers.retiro_maximo)} />
        </div>
        {data && <FinanceAlerts alerts={data.alertas} limit={2} />}
      </CardContent>
    </Card>
  )
}

// Totals come from meta.total of single-item pages
export function DashboardSummary() {
  const { data: session } = useSession()
  const role = session?.user.role
  const organization = session?.memberships.find(
    ({ organization_id }) => organization_id === session.user.organization_id
  )

  const products = useProducts({ page: 1, limit: 1 })
  const lowStock = useProducts({ page: 1, limit: 1, stock_bajo: true })
  const alerts = useAlerts({ page: 1, limit: 1, estado: "ACTIVA" })
  const pendingOrders = usePurchaseOrders({ page: 1, limit: 1, estado: "PENDIENTE" })

  return (
    <>
      <PageHeader
        title={organization ? organization.organization_name : "Panel"}
        description={session ? `Hola, ${session.user.name}.` : undefined}
        actions={
          can.registerSale(role) && (
            <Button asChild size="lg">
              <Link href="/dashboard/sell">
                <Store />
                Registrar venta
              </Link>
            </Button>
          )
        }
      />
      <div className="grid auto-rows-min grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          title="Productos activos"
          value={products.data?.meta.total}
          href="/dashboard/products"
          icon={<Package />}
        />
        <StatCard
          title="Con stock bajo"
          value={lowStock.data?.meta.total}
          href="/dashboard/products"
          icon={<TriangleAlert />}
          tone={lowStock.data && lowStock.data.meta.total > 0 ? "negative" : "default"}
        />
        <StatCard
          title="Alertas activas"
          value={alerts.data?.meta.total}
          href="/dashboard/alerts"
          icon={<Bell />}
        />
        <StatCard
          title="Órdenes pendientes"
          value={pendingOrders.data?.meta.total}
          href="/dashboard/purchase-orders"
          icon={<ShoppingCart />}
        />
      </div>
      {can.manageFinance(role) && <FinanceSummary />}
    </>
  )
}
