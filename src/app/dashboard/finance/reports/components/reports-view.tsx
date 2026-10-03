"use client"

import { CircleAlert } from "lucide-react"
import { useState } from "react"
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"

import { FilterTabs } from "@/components/filter-tabs"
import { PageHeader } from "@/components/page-header"
import { CardField, ResponsiveList, type Column } from "@/components/responsive-list"
import { StatCard } from "@/components/stat-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { errorMessage } from "@/lib/api-client"
import { cn } from "@/lib/utils"
import { currentPeriod, formatMoney, formatMoneyShort, formatNumber, formatPercent } from "@/lib/format"
import { MoneyRows } from "@/app/dashboard/finance/components/money-rows"
import { PeriodSelect } from "@/app/dashboard/finance/components/period-select"
import {
  useBreakEven,
  useIncomeStatement,
  useScenarios,
  useWaterfall,
} from "@/app/dashboard/finance/hooks/useFinanceQueries"
import {
  CATEGORY_LABELS,
  SCENARIO_LABELS,
  type ReplenishmentItem,
  type Scenario,
  type ScenarioResult,
} from "@/app/dashboard/finance/utils/types"

type Tab = "income" | "waterfall" | "break-even" | "scenarios"

// One series: a mid-gray that reads on both surfaces
const amountConfig = {
  monto: { label: "Monto", color: "var(--chart-2)" },
} satisfies ChartConfig

// Scenario results are a status (loss / covers the operation / profit), validated for CVD in
// light and dark; every bar also carries the label in the tooltip and the table below
const scenarioConfig = {
  PERDIDA: { label: SCENARIO_LABELS.PERDIDA, theme: { light: "#dc2626", dark: "#ef4444" } },
  CUBRE_OPERACION: { label: SCENARIO_LABELS.CUBRE_OPERACION, theme: { light: "#6366f1", dark: "#6366f1" } },
  GANANCIA: { label: SCENARIO_LABELS.GANANCIA, theme: { light: "#0d9488", dark: "#0d9488" } },
} satisfies ChartConfig

// Legend swatches live outside ChartContainer (where the --color-* variables exist)
const SWATCHES: Record<ScenarioResult, string> = {
  PERDIDA: "bg-[#dc2626] dark:bg-[#ef4444]",
  CUBRE_OPERACION: "bg-[#6366f1]",
  GANANCIA: "bg-[#0d9488]",
}

function ErrorText({ error }: { error: unknown }) {
  return (
    <p role="alert" className="flex items-start gap-2 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
      <CircleAlert className="mt-0.5 size-4 shrink-0" />
      {errorMessage(error)}
    </p>
  )
}

// Horizontal bars of amounts by label (category breakdown, waterfall steps)
function AmountBars({ data }: { data: { label: string; monto: number }[] }) {
  return (
    <ChartContainer config={amountConfig} className="aspect-auto w-full" style={{ height: Math.max(160, data.length * 36) }}>
      <BarChart data={data} layout="vertical" margin={{ left: 0, right: 12 }} barCategoryGap={6}>
        <CartesianGrid horizontal={false} />
        <YAxis dataKey="label" type="category" width={112} tickLine={false} axisLine={false} interval={0} />
        <XAxis type="number" tickFormatter={formatMoneyShort} tickLine={false} axisLine={false} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent formatter={(value) => formatMoney(Number(value))} hideIndicator />} />
        <Bar dataKey="monto" fill="var(--color-monto)" radius={[0, 4, 4, 0]} maxBarSize={24} />
      </BarChart>
    </ChartContainer>
  )
}

function IncomeStatementTab() {
  const [periodo, setPeriodo] = useState(currentPeriod())
  const statement = useIncomeStatement(periodo)
  const data = statement.data

  return (
    <div className="flex flex-col gap-4">
      <PeriodSelect value={periodo} onChange={setPeriodo} />
      {statement.isError && <ErrorText error={statement.error} />}
      {data && (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard title="Ventas" value={formatMoney(data.ventas)} hint={`${formatNumber(data.unidades_vendidas)} unidades`} />
            <StatCard title="Margen de contribución" value={formatMoney(data.margen_contribucion)} />
            <StatCard
              title="Utilidad operativa"
              value={formatMoney(data.utilidad_operativa)}
              tone={data.utilidad_operativa < 0 ? "negative" : "default"}
            />
            <StatCard
              title="Flujo disponible"
              value={formatMoney(data.flujo_disponible)}
              tone={data.flujo_disponible < 0 ? "negative" : "default"}
              hint={data.cerrado ? "Periodo cerrado" : "Periodo abierto"}
            />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Card size="sm">
              <CardHeader>
                <CardTitle>Estado de resultados</CardTitle>
                {data.cuentas_sin_valorar > 0 && (
                  <CardDescription>
                    {data.cuentas_sin_valorar} cuentas por pagar sin valorar: el costo puede estar incompleto.
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <MoneyRows
                  rows={[
                    { label: "Ventas", value: data.ventas },
                    {
                      label: "Costos variables",
                      value: data.costos_variables,
                      kind: "negative",
                      hint: `Costo de lo vendido: ${formatMoney(data.costo_de_lo_vendido)}`,
                    },
                    { label: "Margen de contribución", value: data.margen_contribucion, kind: "total" },
                    { label: "Gastos fijos", value: data.gastos_fijos, kind: "negative" },
                    { label: "Utilidad operativa", value: data.utilidad_operativa, kind: "total" },
                    { label: "Cuota del crédito", value: data.cuota_credito, kind: "negative" },
                    { label: "Flujo disponible", value: data.flujo_disponible, kind: "total" },
                  ]}
                />
              </CardContent>
            </Card>
            <Card size="sm">
              <CardHeader>
                <CardTitle>Egresos por categoría</CardTitle>
              </CardHeader>
              <CardContent>
                {data.detalle.length > 0 ? (
                  <AmountBars
                    data={data.detalle
                      .filter((item) => item.categoria !== "VENTAS")
                      .map((item) => ({ label: CATEGORY_LABELS[item.categoria], monto: item.monto }))}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">Sin movimientos en el periodo.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
      {statement.isPending && <Skeleton className="h-80 w-full" />}
    </div>
  )
}

function WaterfallTab() {
  const waterfall = useWaterfall()
  const data = waterfall.data

  const columns: Column<ReplenishmentItem>[] = [
    { header: "Producto", cell: (item) => <span className="font-medium">{item.nombre}</span> },
    { header: "Stock", className: "text-right tabular-nums", cell: (item) => `${item.stock_actual} / mín. ${item.stock_minimo}` },
    { header: "En órdenes", className: "hidden text-right tabular-nums lg:table-cell", cell: (item) => item.en_ordenes_abiertas },
    { header: "Faltante", className: "text-right tabular-nums", cell: (item) => formatNumber(item.faltante) },
    { header: "Valor", className: "text-right tabular-nums", cell: (item) => formatMoney(item.valor) },
  ]

  if (waterfall.isError) return <ErrorText error={waterfall.error} />
  if (!data) return <Skeleton className="h-80 w-full" />

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card size="sm">
          <CardHeader>
            <CardTitle>Cascada de efectivo</CardTitle>
            <CardDescription>
              Del efectivo disponible se cubre primero la operación, luego la reserva; lo que sobra se puede repartir.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MoneyRows
              rows={[
                { label: "Caja", value: data.efectivo_caja },
                { label: "Banco", value: data.efectivo_banco },
                { label: "Efectivo operativo", value: data.efectivo_operativo, kind: "total" },
                { label: "Cuentas por pagar", value: data.cuentas_por_pagar, kind: "negative" },
                { label: "Gastos pendientes", value: data.gastos_pendientes, kind: "negative" },
                { label: "Compromisos de compra", value: data.compromisos_compra, kind: "negative" },
                {
                  label: "Reposición de inventario",
                  value: data.reposicion_inventario,
                  kind: "negative",
                  hint: data.inventario_estimado ? "Estimada: el inventario no respondió" : undefined,
                },
                {
                  label: "Cuota pendiente",
                  value: data.cuota_pendiente,
                  kind: "negative",
                  hint: `Capital de trabajo requerido: ${formatMoney(data.capital_trabajo)}`,
                },
                { label: "Faltante de reserva", value: data.faltante_reserva, kind: "negative" },
                {
                  label: data.deficit > 0 ? "Déficit" : "Excedente",
                  value: data.deficit > 0 ? -data.deficit : data.excedente,
                  kind: "total",
                },
              ]}
            />
          </CardContent>
        </Card>
        <div className="flex flex-col gap-4">
          <Card size="sm">
            <CardHeader>
              <CardTitle>Destino del excedente</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1.5">
              <CardField label="Utilidad distribuible">{formatMoney(data.utilidad_distribuible)}</CardField>
              <CardField label="Utilidades no distribuidas">{formatMoney(data.utilidades_no_distribuidas)}</CardField>
              <CardField label="Retiro sugerido">{formatMoney(data.sugerido_retiro)}</CardField>
              <CardField label="Abono sugerido">{formatMoney(data.sugerido_abono)}</CardField>
              <CardField label="Disponible para abonos">
                {formatMoney(data.disponible_abono)}{" "}
                {!data.abono_permitido && <Badge variant="outline">No permitido</Badge>}
              </CardField>
            </CardContent>
          </Card>
          <Card size="sm">
            <CardHeader>
              <CardTitle>Compromisos del efectivo</CardTitle>
            </CardHeader>
            <CardContent>
              <AmountBars
                data={[
                  { label: "Por pagar", monto: data.cuentas_por_pagar + data.gastos_pendientes },
                  { label: "Compras", monto: data.compromisos_compra },
                  { label: "Reposición", monto: data.reposicion_inventario },
                  { label: "Cuota", monto: data.cuota_pendiente },
                  { label: "Reserva faltante", monto: data.faltante_reserva },
                ]}
              />
            </CardContent>
          </Card>
        </div>
      </div>
      {data.reposicion_detalle.length > 0 && (
        <>
          <h2 className="text-base font-semibold">Reposición de inventario</h2>
          <ResponsiveList
            items={data.reposicion_detalle}
            getKey={(item) => item.producto_id}
            isLoading={false}
            empty=""
            columns={columns}
            renderCard={(item) => (
              <>
                <span className="font-medium">{item.nombre}</span>
                <CardField label="Stock">
                  {item.stock_actual} / mín. {item.stock_minimo}
                </CardField>
                <CardField label="Faltante">{formatNumber(item.faltante)}</CardField>
                <CardField label="Valor">{formatMoney(item.valor)}</CardField>
              </>
            )}
          />
        </>
      )}
    </div>
  )
}

function BreakEvenTab() {
  const breakEven = useBreakEven()
  const data = breakEven.data

  if (breakEven.isError) return <ErrorText error={breakEven.error} />
  if (!data) return <Skeleton className="h-80 w-full" />

  // Without an assigned installment the credit break-even equals the plain one
  const hasCredit = data.cuota_asignada > 0

  return (
    <div className="flex flex-col gap-4">
      {data.mensaje && (
        <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-900 dark:text-amber-200">
          {data.mensaje}
        </p>
      )}
      <div className={`grid grid-cols-2 gap-3 ${hasCredit ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
        <StatCard
          title="Por día"
          value={data.pe_diario != null ? formatNumber(data.pe_diario) : "—"}
          hint="unidades para no perder"
        />
        {hasCredit && (
          <StatCard
            title="Por día con crédito"
            value={data.pe_credito_diario != null ? formatNumber(data.pe_credito_diario) : "—"}
            hint="cubriendo la cuota asignada"
          />
        )}
        <StatCard title="Ventas al mes" value={data.pe_dinero != null ? formatMoney(data.pe_dinero) : "—"} />
        <StatCard title="Razón de contribución" value={formatPercent(data.razon_contribucion)} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card size="sm">
          <CardHeader>
            <CardTitle>Por unidad</CardTitle>
            <CardDescription>
              Costo variable {data.cvu_origen === "RECETAS" ? "calculado de las recetas" : "manual"}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MoneyRows
              rows={[
                { label: "Precio promedio", value: data.precio_promedio },
                { label: "Costo variable unitario", value: data.costo_variable_unitario, kind: "negative" },
                { label: "Margen de contribución", value: data.margen_contribucion_unitario, kind: "total" },
              ]}
            />
          </CardContent>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardTitle>Al mes</CardTitle>
            <CardDescription>{data.dias_operacion} días de operación.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-1.5">
            <CardField label="Costos fijos">{formatMoney(data.costos_fijos)}</CardField>
            {hasCredit && <CardField label="Cuota asignada">{formatMoney(data.cuota_asignada)}</CardField>}
            <CardField label="Unidades de equilibrio">
              {data.pe_unidades != null ? formatNumber(data.pe_unidades) : "—"}
            </CardField>
            {hasCredit && (
              <>
                <CardField label="Unidades con crédito">
                  {data.pe_credito_unidades != null ? formatNumber(data.pe_credito_unidades) : "—"}
                </CardField>
                <CardField label="Ventas con crédito">
                  {data.pe_credito_dinero != null ? formatMoney(data.pe_credito_dinero) : "—"}
                </CardField>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function parseLevels(text: string): number[] {
  return text
    .split(/[,\s]+/)
    .map(Number)
    .filter((level) => Number.isInteger(level) && level > 0)
    .slice(0, 10)
}

function ScenariosTab() {
  const [text, setText] = useState("")
  const [niveles, setNiveles] = useState<number[]>([])
  const scenarios = useScenarios(niveles)
  const data = scenarios.data?.data

  const columns: Column<Scenario>[] = [
    { header: "Por día", className: "tabular-nums", cell: (scenario) => formatNumber(scenario.unidades_diarias) },
    { header: "Ventas", className: "text-right tabular-nums", cell: (scenario) => formatMoney(scenario.ventas) },
    {
      header: "Utilidad operativa",
      className: "text-right tabular-nums",
      cell: (scenario) => formatMoney(scenario.utilidad_operativa),
    },
    {
      header: "Flujo disponible",
      className: "hidden text-right tabular-nums lg:table-cell",
      cell: (scenario) => formatMoney(scenario.flujo_disponible),
    },
    {
      header: "Recuperación",
      className: "hidden text-right lg:table-cell",
      cell: (scenario) => (scenario.meses_recuperacion != null ? `${formatNumber(scenario.meses_recuperacion)} meses` : "—"),
    },
    { header: "Resultado", cell: (scenario) => <ResultBadge resultado={scenario.resultado} /> },
  ]

  return (
    <div className="flex flex-col gap-4">
      <form
        className="flex flex-col gap-2 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault()
          setNiveles(parseLevels(text))
        }}
      >
        <Input
          aria-label="Unidades por día"
          placeholder="Unidades por día: 30, 50, 100"
          inputMode="numeric"
          value={text}
          onChange={(event) => setText(event.target.value)}
          className="sm:max-w-xs"
        />
        <Button type="submit" variant="outline">
          Simular
        </Button>
      </form>
      {scenarios.isError && <ErrorText error={scenarios.error} />}
      {data && data.length > 0 && (
        <Card size="sm">
          <CardHeader>
            <CardTitle>Utilidad operativa por nivel de ventas</CardTitle>
            <CardDescription className="flex flex-wrap gap-x-4 gap-y-1">
              {(Object.keys(scenarioConfig) as ScenarioResult[]).map((key) => (
                <span key={key} className="flex items-center gap-1.5">
                  <span className={cn("size-2.5 rounded-sm", SWATCHES[key])} />
                  {SCENARIO_LABELS[key]}
                </span>
              ))}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={scenarioConfig} className="aspect-auto h-64 w-full">
              <BarChart data={data.map((scenario) => ({ ...scenario, nivel: `${scenario.unidades_diarias}/día` }))}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="nivel" tickLine={false} axisLine={false} />
                <YAxis tickFormatter={formatMoneyShort} tickLine={false} axisLine={false} width={64} />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      hideIndicator
                      formatter={(value, _name, item) => (
                        <div className="flex flex-col">
                          <span className="font-medium tabular-nums">{formatMoney(Number(value))}</span>
                          <span className="text-muted-foreground">
                            {SCENARIO_LABELS[(item.payload as Scenario).resultado]}
                          </span>
                        </div>
                      )}
                    />
                  }
                />
                <Bar dataKey="utilidad_operativa" radius={4} maxBarSize={24}>
                  {data.map((scenario) => (
                    <Cell key={scenario.unidades_diarias} fill={`var(--color-${scenario.resultado})`} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
      <ResponsiveList
        items={data}
        getKey={(scenario) => scenario.unidades_diarias}
        isLoading={scenarios.isPending}
        empty="Configura los niveles de la política o escribe algunos arriba."
        columns={columns}
        renderCard={(scenario) => (
          <>
            <div className="flex items-start justify-between gap-2">
              <span className="font-medium">{formatNumber(scenario.unidades_diarias)} por día</span>
              <ResultBadge resultado={scenario.resultado} />
            </div>
            <CardField label="Ventas al mes">{formatMoney(scenario.ventas)}</CardField>
            <CardField label="Utilidad operativa">{formatMoney(scenario.utilidad_operativa)}</CardField>
            <CardField label="Flujo disponible">{formatMoney(scenario.flujo_disponible)}</CardField>
            {scenario.meses_recuperacion != null && (
              <CardField label="Recuperación">{formatNumber(scenario.meses_recuperacion)} meses</CardField>
            )}
          </>
        )}
      />
    </div>
  )
}

function ResultBadge({ resultado }: { resultado: ScenarioResult }) {
  const variant = resultado === "PERDIDA" ? "destructive" : resultado === "GANANCIA" ? "secondary" : "outline"
  return <Badge variant={variant}>{SCENARIO_LABELS[resultado]}</Badge>
}

const TABS: { value: Tab; label: string }[] = [
  { value: "income", label: "Resultados" },
  { value: "waterfall", label: "Cascada" },
  { value: "break-even", label: "Equilibrio" },
  { value: "scenarios", label: "Escenarios" },
]

export function ReportsView() {
  const [tab, setTab] = useState<Tab>("income")

  return (
    <>
      <PageHeader title="Reportes" description="Estado de resultados, cascada de efectivo, punto de equilibrio y escenarios." />
      <FilterTabs value={tab} onChange={setTab} options={TABS} />
      {tab === "income" && <IncomeStatementTab />}
      {tab === "waterfall" && <WaterfallTab />}
      {tab === "break-even" && <BreakEvenTab />}
      {tab === "scenarios" && <ScenariosTab />}
    </>
  )
}
