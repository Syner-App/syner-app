"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Banknote } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { FilterTabs } from "@/components/filter-tabs"
import { DateField, FormDialog, MoneyField, SelectField } from "@/components/form-fields"
import { PageHeader } from "@/components/page-header"
import { CardField, ResponsiveList, type Column } from "@/components/responsive-list"
import { TablePagination } from "@/components/table-pagination"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { errorMessage } from "@/lib/api-client"
import { formatDate, formatMoney, formatNumber, today } from "@/lib/format"
import { useProductLookup } from "@/app/dashboard/products/hooks/useProductLookup"
import { usePayPayable } from "@/app/dashboard/finance/hooks/useFinanceMutations"
import { usePayables } from "@/app/dashboard/finance/hooks/useFinanceQueries"
import { accountOptions, type Payable, type PayableStatus } from "@/app/dashboard/finance/utils/types"
import { payPayableSchema, type PayPayableValues } from "@/app/dashboard/finance/validations/payable"

const PAGE_SIZE = 10

const FILTERS: { value: PayableStatus; label: string }[] = [
  { value: "POR_PAGAR", label: "Por pagar" },
  { value: "PAGADA", label: "Pagadas" },
]

function PayDialog({ payable, onOpenChange }: { payable?: Payable; onOpenChange: (open: boolean) => void }) {
  const pay = usePayPayable()
  const form = useForm<PayPayableValues>({
    resolver: zodResolver(payPayableSchema),
    defaultValues: { monto_real: payable?.monto_estimado ?? NaN, cuenta: "BANCO", fecha: today() },
  })

  async function onSubmit(values: PayPayableValues) {
    if (!payable) return
    try {
      await pay.mutateAsync({ id: payable.id, values })
      onOpenChange(false)
    } catch {
      // Shown in the dialog
    }
  }

  return (
    <FormDialog
      open={payable !== undefined}
      onOpenChange={onOpenChange}
      title="Pagar cuenta"
      description="El monto de la factura queda como costo de referencia del insumo."
      onSubmit={form.handleSubmit(onSubmit)}
      isSubmitting={form.formState.isSubmitting}
      error={pay.error}
      submitLabel="Pagar"
    >
      <MoneyField
        control={form.control}
        name="monto_real"
        label="Monto de la factura"
        className="sm:col-span-2"
        description={payable?.monto_estimado != null ? `Estimado: ${formatMoney(payable.monto_estimado)}` : undefined}
      />
      <SelectField control={form.control} name="cuenta" label="Pagar desde" options={accountOptions} />
      <DateField control={form.control} name="fecha" label="Fecha de pago" />
    </FormDialog>
  )
}

// Bills of received purchase orders. Paying one registers the expense with the real amount
export function PayablesView() {
  const { nameOf } = useProductLookup()
  const [estado, setEstado] = useState<PayableStatus>("POR_PAGAR")
  const [page, setPage] = useState(1)
  const [paying, setPaying] = useState<Payable>()

  const payables = usePayables({ page, limit: PAGE_SIZE, estado })

  const name = (payable: Payable) => payable.nombre ?? nameOf(payable.producto_id)
  const amount = (payable: Payable) => {
    const value = payable.monto_real ?? payable.monto_estimado
    return value != null ? formatMoney(value) : <span className="text-muted-foreground">Sin valorar</span>
  }

  const actions = (payable: Payable) =>
    payable.estado === "POR_PAGAR" ? (
      <Button variant="outline" onClick={() => setPaying(payable)}>
        <Banknote />
        Pagar
      </Button>
    ) : null

  const columns: Column<Payable>[] = [
    {
      header: "Insumo",
      cell: (payable) => (
        <div className="flex flex-col">
          <span className="font-medium">{name(payable)}</span>
          <span className="text-xs text-muted-foreground">{formatNumber(payable.cantidad)} unidades</span>
        </div>
      ),
    },
    { header: "Recibida", cell: (payable) => formatDate(payable.fecha_recepcion) },
    {
      header: "Estado",
      cell: (payable) =>
        payable.estado === "PAGADA" ? (
          <Badge variant="secondary">Pagada {payable.pagada_en && formatDate(payable.pagada_en)}</Badge>
        ) : (
          <Badge variant="outline">Por pagar</Badge>
        ),
    },
    { header: "Monto", className: "text-right tabular-nums", cell: amount },
  ]

  return (
    <>
      <PageHeader
        title="Cuentas por pagar"
        description="Se crean al recibir una orden de compra. Págalas cuando llegue la factura."
      />
      <FilterTabs
        value={estado}
        options={FILTERS}
        onChange={(value) => {
          setEstado(value)
          setPage(1)
        }}
      />
      {payables.isError ? (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage(payables.error)}
        </p>
      ) : (
        <ResponsiveList
          items={payables.data?.data}
          getKey={(payable) => payable.id}
          isLoading={payables.isPending}
          empty={estado === "POR_PAGAR" ? "No hay cuentas pendientes." : "No hay cuentas pagadas."}
          columns={columns}
          actions={actions}
          renderCard={(payable) => (
            <>
              <div className="flex items-start justify-between gap-2">
                <span className="font-medium">{name(payable)}</span>
                <span className="font-semibold tabular-nums">{amount(payable)}</span>
              </div>
              <CardField label="Cantidad">{formatNumber(payable.cantidad)}</CardField>
              <CardField label="Recibida">{formatDate(payable.fecha_recepcion)}</CardField>
              {payable.pagada_en && <CardField label="Pagada">{formatDate(payable.pagada_en)}</CardField>}
            </>
          )}
        />
      )}
      {payables.data && (
        <TablePagination
          page={payables.data.meta.page}
          lastPage={payables.data.meta.lastPage}
          total={payables.data.meta.total}
          onPageChange={setPage}
        />
      )}
      <PayDialog key={paying?.id ?? "pay"} payable={paying} onOpenChange={(open) => !open && setPaying(undefined)} />
    </>
  )
}
