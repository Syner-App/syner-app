"use client"

import { ArrowRight, Banknote, HandCoins, PiggyBank, Store, Target, TrendingUp, Wallet } from "lucide-react"
import Link from "next/link"

import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/stat-card"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { errorMessage } from "@/lib/api-client"
import { formatMoney, formatNumber, formatPercent, formatPeriod } from "@/lib/format"
import { FinanceAlerts, MISSING_ASSUMPTIONS } from "@/app/dashboard/finance/components/finance-alerts"
import { MoneyRows } from "@/app/dashboard/finance/components/money-rows"
import { useFinanceDashboard } from "@/app/dashboard/finance/hooks/useFinanceQueries"

// The owner's questions for the current period: how much to sell per day, what is left,
// how much can be withdrawn or prepaid
export function FinanceOverview() {
  const dashboard = useFinanceDashboard()
  const data = dashboard.data
  const answers = data?.respuestas
  const statement = data?.estado_resultados
  const waterfall = data?.cascada
  const recovery = data?.recuperacion

  return (
    <>
      <PageHeader
        title="Resumen financiero"
        description={data ? formatPeriod(data.periodo) : undefined}
        actions={
          <Button asChild>
            <Link href="/dashboard/sell">
              <Store />
              Registrar venta
            </Link>
          </Button>
        }
      />

      {dashboard.isError && (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage(dashboard.error)}
        </p>
      )}

      {data && !data.punto_equilibrio && (
        <Card size="sm" className="border-dashed">
          <CardHeader>
            <CardTitle>Configura los supuestos del negocio</CardTitle>
            <CardDescription>
              Con el precio promedio y los costos fijos calculamos el punto de equilibrio y cuánto vender por día.
            </CardDescription>
            <CardAction>
              <Button asChild size="sm" variant="outline">
                <Link href="/dashboard/finance/settings">
                  Configurar
                  <ArrowRight />
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
        </Card>
      )}

      {/* The setup card above already covers the missing assumptions */}
      {data && <FinanceAlerts alerts={data.alertas.filter(({ codigo }) => codigo !== MISSING_ASSUMPTIONS)} />}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          title="Vender por día"
          icon={<Target />}
          value={dashboard.isPending ? undefined : answers?.vender_por_dia != null ? formatNumber(answers.vender_por_dia) : "—"}
          hint={
            answers?.vender_por_dia_con_credito != null &&
            answers.vender_por_dia_con_credito !== answers.vender_por_dia
              ? `${formatNumber(answers.vender_por_dia_con_credito)} con la cuota del crédito`
              : "unidades para el equilibrio"
          }
        />
        <StatCard
          title="Utilidad operativa"
          icon={<TrendingUp />}
          value={answers && formatMoney(answers.utilidad_operativa)}
          tone={answers && answers.utilidad_operativa < 0 ? "negative" : "default"}
        />
        <StatCard
          title="Retiro máximo"
          icon={<HandCoins />}
          value={answers && formatMoney(answers.retiro_maximo)}
          hint="utilidad distribuible"
        />
        <StatCard
          title="Abono máximo"
          icon={<Banknote />}
          value={answers && formatMoney(answers.abono_maximo)}
          hint="abono extraordinario al crédito"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card size="sm">
          <CardHeader>
            <CardTitle>Estado de resultados</CardTitle>
            <CardDescription>
              {statement ? `${formatNumber(statement.unidades_vendidas)} unidades vendidas` : "Del periodo actual"}
            </CardDescription>
            <CardAction>
              <Button asChild size="sm" variant="ghost">
                <Link href="/dashboard/finance/reports">Ver reportes</Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            {statement ? (
              <MoneyRows
                rows={[
                  { label: "Ventas", value: statement.ventas },
                  { label: "Costos variables", value: statement.costos_variables, kind: "negative" },
                  { label: "Margen de contribución", value: statement.margen_contribucion, kind: "total" },
                  { label: "Gastos fijos", value: statement.gastos_fijos, kind: "negative" },
                  { label: "Utilidad operativa", value: statement.utilidad_operativa, kind: "total" },
                  { label: "Cuota del crédito", value: statement.cuota_credito, kind: "negative" },
                  { label: "Flujo disponible", value: statement.flujo_disponible, kind: "total" },
                ]}
              />
            ) : (
              <Skeleton className="h-56 w-full" />
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Card size="sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="size-4" />
                Efectivo y reserva
              </CardTitle>
              <CardDescription>
                {waterfall?.inventario_estimado && "Reposición de inventario estimada. "}
                Lo que se debe dejar en el negocio antes de retirar.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {waterfall ? (
                <>
                  <MoneyRows
                    rows={[
                      { label: "Efectivo operativo", value: waterfall.efectivo_operativo },
                      {
                        label: "Capital de trabajo",
                        value: waterfall.capital_trabajo,
                        kind: "negative",
                        hint: "Cuentas, compras, reposición y cuota pendientes",
                      },
                      { label: "Faltante de reserva", value: waterfall.faltante_reserva, kind: "negative" },
                      {
                        label: waterfall.deficit > 0 ? "Déficit" : "Excedente",
                        value: waterfall.deficit > 0 ? -waterfall.deficit : waterfall.excedente,
                        kind: "total",
                      },
                    ]}
                  />
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <PiggyBank className="size-4" />
                        Reserva
                      </span>
                      <span className="tabular-nums">
                        {formatMoney(waterfall.reserva_acumulada)} / {formatMoney(waterfall.reserva_meta)}
                      </span>
                    </div>
                    <Progress
                      value={waterfall.reserva_meta > 0 ? Math.min(100, (waterfall.reserva_acumulada / waterfall.reserva_meta) * 100) : 100}
                    />
                  </div>
                  {answers && (
                    <p className="text-sm text-muted-foreground">
                      Deja <strong className="text-foreground">{formatMoney(answers.dejar_en_el_negocio)}</strong> en el negocio.
                    </p>
                  )}
                </>
              ) : (
                <Skeleton className="h-40 w-full" />
              )}
            </CardContent>
          </Card>

          {recovery && recovery.inversion_inicial > 0 && (
            <Card size="sm">
              <CardHeader>
                <CardTitle>Recuperación de la inversión</CardTitle>
                <CardDescription>
                  {formatMoney(recovery.recuperado)} de {formatMoney(recovery.inversion_inicial)}
                  {recovery.meses_restantes != null && ` · faltan ${formatNumber(recovery.meses_restantes)} meses`}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-3">
                {/* porcentaje comes as 0-100 */}
                <Progress value={recovery.porcentaje ?? 0} className="flex-1" />
                <span className="text-sm tabular-nums">{formatPercent((recovery.porcentaje ?? 0) / 100)}</span>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}
