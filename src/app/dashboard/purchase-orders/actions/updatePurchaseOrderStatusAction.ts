import { apiFetch } from "@/lib/api-client"
import type { PurchaseOrder, UpdatablePurchaseOrderStatus } from "@/app/dashboard/purchase-orders/utils/types"

// PENDIENTE -> APROBADA | RECHAZADA (motivo required), APROBADA -> RECIBIDA
export function updatePurchaseOrderStatusAction({
  id,
  estado,
  motivo,
}: {
  id: string
  estado: UpdatablePurchaseOrderStatus
  motivo?: string
}) {
  return apiFetch<PurchaseOrder>(`/purchase-orders/update-status/${id}`, {
    method: "PATCH",
    body: { estado, motivo: motivo || undefined },
  })
}
