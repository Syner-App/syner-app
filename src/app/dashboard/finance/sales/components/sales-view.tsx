"use client"

import { Loader2, RotateCcw, Store } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"

import { FiltersBar } from "@/components/filters-bar"
import { PageHeader } from "@/components/page-header"
import { CardField, ResponsiveList, type Column } from "@/components/responsive-list"
import { TablePagination } from "@/components/table-pagination"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { errorMessage } from "@/lib/api-client"
import { currentPeriod, formatDate, formatMoney } from "@/lib/format"
import { translate } from "@/lib/messages"
import { PeriodSelect } from "@/app/dashboard/finance/components/period-select"
import { useRetrySaleStock } from "@/app/dashboard/finance/hooks/useFinanceMutations"
import { useSales } from "@/app/dashboard/finance/hooks/useFinanceQueries"
import {
  ACCOUNT_LABELS,
  STOCK_STATUS_LABELS,
  type Sale,
  type StockDeductionStatus,
} from "@/app/dashboard/finance/utils/types"

const PAGE_SIZE = 10
const ALL = "all"

const STOCK_VARIANTS: Record<StockDeductionStatus, "secondary" | "outline" | "destructive"> = {
  STOCK_PENDIENTE: "outline",
  STOCK_APLICADO: "secondary",
  STOCK_RECHAZADO: "destructive",
}

function StockBadge({ sale }: { sale: Sale }) {
  return (
    <Badge variant={STOCK_VARIANTS[sale.estado_stock]} title={sale.motivo_rechazo && translate(sale.motivo_rechazo)}>
      {sale.estado_stock === "STOCK_PENDIENTE" && <Loader2 className="animate-spin" />}
      {STOCK_STATUS_LABELS[sale.estado_stock]}
    </Badge>
  )
}

function summary(sale: Sale) {
  return sale.lineas.map((line) => `${line.unidades} × ${line.nombre}`).join(", ")
}

// Registered sales and the state of their stock discount in products-ms. A rejected discount
// (not enough stock) is sent again after fixing the stock
export function SalesView() {
  const [periodo, setPeriodo] = useState(currentPeriod())
  const [estado, setEstado] = useState<StockDeductionStatus | undefined>()
  const [page, setPage] = useState(1)

  const sales = useSales({ page, limit: PAGE_SIZE, periodo: periodo || undefined, estado_stock: estado })
  const retry = useRetrySaleStock()

  function retryStock(sale: Sale) {
    retry.mutate(sale.id, { onError: (error) => toast.error(errorMessage(error)) })
  }

  const actions = (sale: Sale) =>
    sale.estado_stock === "STOCK_RECHAZADO" ? (
      <Button
        variant="outline"
        disabled={retry.isPending && retry.variables === sale.id}
        onClick={() => retryStock(sale)}
      >
        <RotateCcw />
        Reintentar
      </Button>
    ) : null

  const columns: Column<Sale>[] = [
    { header: "Fecha", cell: (sale) => formatDate(sale.fecha) },
    {
      header: "Detalle",
      cell: (sale) => (
        <div className="flex max-w-80 flex-col">
          <span className="truncate" title={summary(sale)}>
            {summary(sale)}
          </span>
          {sale.motivo_rechazo && <span className="truncate text-xs text-destructive">{translate(sale.motivo_rechazo)}</span>}
        </div>
      ),
    },
    { header: "Cuenta", className: "hidden lg:table-cell", cell: (sale) => ACCOUNT_LABELS[sale.cuenta] },
    { header: "Stock", cell: (sale) => <StockBadge sale={sale} /> },
    {
      header: "Costo",
      className: "hidden text-right tabular-nums text-muted-foreground lg:table-cell",
      cell: (sale) => formatMoney(sale.costo_total),
    },
    { header: "Total", className: "text-right font-medium tabular-nums", cell: (sale) => formatMoney(sale.total) },
  ]

  return (
    <>
      <PageHeader
        title="Ventas"
        description="Cada venta descuenta del inventario los insumos de sus productos."
        actions={
          <Button asChild>
            <Link href="/dashboard/sell">
              <Store />
              Registrar venta
            </Link>
          </Button>
        }
      />
      <FiltersBar activeCount={estado ? 1 : 0} primary={<PeriodSelect value={periodo} onChange={(value) => { setPeriodo(value); setPage(1) }} allowAll />}>
        <Select
          value={estado ?? ALL}
          onValueChange={(value) => {
            setEstado(value === ALL ? undefined : (value as StockDeductionStatus))
            setPage(1)
          }}
        >
          <SelectTrigger aria-label="Estado del stock" className="sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todos los estados</SelectItem>
            {Object.entries(STOCK_STATUS_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FiltersBar>
      {sales.isError ? (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage(sales.error)}
        </p>
      ) : (
        <ResponsiveList
          items={sales.data?.data}
          getKey={(sale) => sale.id}
          isLoading={sales.isPending}
          empty="No hay ventas en este periodo."
          columns={columns}
          actions={actions}
          renderCard={(sale) => (
            <>
              <div className="flex items-start justify-between gap-2">
                <span className="text-lg font-semibold tabular-nums">{formatMoney(sale.total)}</span>
                <StockBadge sale={sale} />
              </div>
              <p className="text-sm">{summary(sale)}</p>
              <CardField label="Fecha">{formatDate(sale.fecha)}</CardField>
              <CardField label="Cuenta">{ACCOUNT_LABELS[sale.cuenta]}</CardField>
              {sale.motivo_rechazo && <p className="text-xs text-destructive">{translate(sale.motivo_rechazo)}</p>}
            </>
          )}
        />
      )}
      {sales.data && (
        <TablePagination
          page={sales.data.meta.page}
          lastPage={sales.data.meta.lastPage}
          total={sales.data.meta.total}
          onPageChange={setPage}
        />
      )}
    </>
  )
}
