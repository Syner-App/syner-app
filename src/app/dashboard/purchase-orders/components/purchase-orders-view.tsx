"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Check, Loader2, PackageCheck, Plus, X } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { ConfirmDialog } from "@/components/confirm-dialog"
import { FilterTabs } from "@/components/filter-tabs"
import { FormDialog, TextField } from "@/components/form-fields"
import { PageHeader } from "@/components/page-header"
import { CardField, ResponsiveList, type Column } from "@/components/responsive-list"
import { TablePagination } from "@/components/table-pagination"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useSession } from "@/hooks/use-session"
import { errorMessage } from "@/lib/api-client"
import { formatDate, formatNumber } from "@/lib/format"
import { can } from "@/lib/permissions"
import { useProductLookup } from "@/app/dashboard/products/hooks/useProductLookup"
import { CreatePurchaseOrderDialog } from "@/app/dashboard/purchase-orders/components/create-purchase-order-dialog"
import { useUpdatePurchaseOrderStatus } from "@/app/dashboard/purchase-orders/hooks/usePurchaseOrderMutations"
import { usePurchaseOrders } from "@/app/dashboard/purchase-orders/hooks/usePurchaseOrders"
import {
  STATUS_LABELS,
  STATUS_VARIANTS,
  type PurchaseOrder,
  type PurchaseOrderStatus,
} from "@/app/dashboard/purchase-orders/utils/types"
import { rejectSchema, type RejectValues } from "@/app/dashboard/purchase-orders/validations/purchase-order"

const PAGE_SIZE = 10

type StatusFilter = PurchaseOrderStatus | "TODAS"

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "TODAS", label: "Todas" },
  { value: "PENDIENTE", label: "Pendientes" },
  { value: "APROBADA", label: "Aprobadas" },
  { value: "RECIBIDA", label: "Recibidas" },
  { value: "RECHAZADA", label: "Rechazadas" },
  { value: "EN_VALIDACION", label: "En validación" },
]

type DialogState =
  | { type: "create" }
  | { type: "approve"; order: PurchaseOrder }
  | { type: "receive"; order: PurchaseOrder }
  | { type: "reject"; order: PurchaseOrder }
  | null

function StatusBadge({ estado }: { estado: PurchaseOrderStatus }) {
  return (
    <Badge variant={STATUS_VARIANTS[estado]}>
      {estado === "EN_VALIDACION" && <Loader2 className="animate-spin" />}
      {STATUS_LABELS[estado]}
    </Badge>
  )
}

// The next steps of the status machine, as buttons
function OrderActions({
  order,
  onApprove,
  onReject,
  onReceive,
}: {
  order: PurchaseOrder
  onApprove: () => void
  onReject: () => void
  onReceive: () => void
}) {
  if (order.estado === "PENDIENTE") {
    return (
      <div className="flex gap-1">
        <Button size="icon" variant="outline" aria-label="Aprobar" title="Aprobar" onClick={onApprove}>
          <Check />
        </Button>
        <Button size="icon" variant="outline" aria-label="Rechazar" title="Rechazar" onClick={onReject}>
          <X />
        </Button>
      </div>
    )
  }
  if (order.estado === "APROBADA") {
    return (
      <Button variant="outline" onClick={onReceive}>
        <PackageCheck />
        Recibir
      </Button>
    )
  }
  return null
}

function RejectDialog({ order, onOpenChange }: { order?: PurchaseOrder; onOpenChange: (open: boolean) => void }) {
  const updateStatus = useUpdatePurchaseOrderStatus()
  const form = useForm<RejectValues>({ resolver: zodResolver(rejectSchema), defaultValues: { motivo: "" } })

  async function onSubmit({ motivo }: RejectValues) {
    if (!order) return
    try {
      await updateStatus.mutateAsync({ id: order.id, estado: "RECHAZADA", motivo })
      form.reset()
      onOpenChange(false)
    } catch {
      // Shown in the dialog
    }
  }

  return (
    <FormDialog
      open={order !== undefined}
      onOpenChange={onOpenChange}
      title="Rechazar orden"
      description={order ? `${order.proveedor} · ${order.cantidad_solicitada} unidades` : undefined}
      onSubmit={form.handleSubmit(onSubmit)}
      isSubmitting={form.formState.isSubmitting}
      error={updateStatus.error}
      submitLabel="Rechazar"
      destructive
    >
      <TextField
        control={form.control}
        name="motivo"
        label="Motivo"
        placeholder="Precio fuera de presupuesto…"
        className="sm:col-span-2"
        multiline
      />
    </FormDialog>
  )
}

export function PurchaseOrdersView() {
  const { data: session } = useSession()
  const canManage = can.managePurchaseOrders(session?.user.role)
  const { nameOf } = useProductLookup()

  const [estado, setEstado] = useState<StatusFilter>("TODAS")
  const [page, setPage] = useState(1)
  const [dialog, setDialog] = useState<DialogState>(null)
  const close = () => setDialog(null)

  const orders = usePurchaseOrders({
    page,
    limit: PAGE_SIZE,
    estado: estado === "TODAS" ? undefined : estado,
  })
  const updateStatus = useUpdatePurchaseOrderStatus()

  const actions = canManage
    ? (order: PurchaseOrder) => (
        <OrderActions
          order={order}
          onApprove={() => setDialog({ type: "approve", order })}
          onReject={() => setDialog({ type: "reject", order })}
          onReceive={() => setDialog({ type: "receive", order })}
        />
      )
    : undefined

  const columns: Column<PurchaseOrder>[] = [
    {
      header: "Producto",
      cell: (order) => (
        <div className="flex flex-col">
          <span className="font-medium">{nameOf(order.producto_id)}</span>
          {order.motivo && (
            <span className="max-w-64 truncate text-xs text-muted-foreground" title={order.motivo}>
              {order.motivo}
            </span>
          )}
        </div>
      ),
    },
    { header: "Proveedor", cell: (order) => order.proveedor },
    {
      header: "Cantidad",
      className: "text-right tabular-nums",
      cell: (order) => formatNumber(order.cantidad_solicitada),
    },
    { header: "Estado", cell: (order) => <StatusBadge estado={order.estado} /> },
    {
      header: "Fecha",
      className: "hidden text-muted-foreground lg:table-cell",
      cell: (order) => formatDate(order.createdAt),
    },
  ]

  const confirmTarget = dialog?.type === "approve" || dialog?.type === "receive" ? dialog : undefined

  return (
    <>
      <PageHeader
        title="Órdenes de compra"
        description="Pide mercancía a tus proveedores. Al recibirla se suma al stock y se crea la cuenta por pagar."
        actions={
          canManage && (
            <Button onClick={() => setDialog({ type: "create" })}>
              <Plus />
              Nueva orden
            </Button>
          )
        }
      />
      <FilterTabs
        value={estado}
        options={FILTERS}
        onChange={(value) => {
          setEstado(value)
          setPage(1)
        }}
      />
      {orders.isError ? (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage(orders.error)}
        </p>
      ) : (
        <ResponsiveList
          items={orders.data?.data}
          getKey={(order) => order.id}
          isLoading={orders.isPending}
          empty="No hay órdenes de compra."
          columns={columns}
          actions={actions}
          renderCard={(order) => (
            <>
              <div className="flex items-start justify-between gap-2">
                <span className="font-medium">{nameOf(order.producto_id)}</span>
                <StatusBadge estado={order.estado} />
              </div>
              <CardField label="Proveedor">{order.proveedor}</CardField>
              <CardField label="Cantidad">{formatNumber(order.cantidad_solicitada)}</CardField>
              <CardField label="Fecha">{formatDate(order.createdAt)}</CardField>
              {order.motivo && <p className="text-xs text-muted-foreground">{order.motivo}</p>}
            </>
          )}
        />
      )}
      {orders.data && (
        <TablePagination
          page={orders.data.meta.page}
          lastPage={orders.data.meta.lastPage}
          total={orders.data.meta.total}
          onPageChange={setPage}
        />
      )}

      <CreatePurchaseOrderDialog open={dialog?.type === "create"} onOpenChange={(open) => !open && close()} />
      <RejectDialog
        key={dialog?.type === "reject" ? dialog.order.id : "reject"}
        order={dialog?.type === "reject" ? dialog.order : undefined}
        onOpenChange={(open) => !open && close()}
      />
      <ConfirmDialog
        open={confirmTarget !== undefined}
        destructive={false}
        title={confirmTarget?.type === "receive" ? "¿Marcar como recibida?" : "¿Aprobar la orden?"}
        description={
          confirmTarget
            ? confirmTarget.type === "receive"
              ? `Se sumarán ${confirmTarget.order.cantidad_solicitada} unidades de ${nameOf(confirmTarget.order.producto_id)} al stock y se creará la cuenta por pagar.`
              : `${confirmTarget.order.cantidad_solicitada} unidades de ${nameOf(confirmTarget.order.producto_id)} a ${confirmTarget.order.proveedor}.`
            : ""
        }
        confirmLabel={confirmTarget?.type === "receive" ? "Recibir" : "Aprobar"}
        isPending={updateStatus.isPending}
        onConfirm={() => {
          if (!confirmTarget) return Promise.resolve()
          return updateStatus
            .mutateAsync({
              id: confirmTarget.order.id,
              estado: confirmTarget.type === "receive" ? "RECIBIDA" : "APROBADA",
            })
            .catch((error: unknown) => {
              toast.error(errorMessage(error))
              throw error
            })
        }}
        onOpenChange={(open) => !open && close()}
      />
    </>
  )
}
