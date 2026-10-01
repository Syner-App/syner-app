import { apiFetch } from "@/lib/api-client"
import type { PurchaseOrder } from "@/app/dashboard/purchase-orders/utils/types"
import type { PurchaseOrderValues } from "@/app/dashboard/purchase-orders/validations/purchase-order"

// Answers 202 with the order EN_VALIDACION: the saga validates the product asynchronously
export function createPurchaseOrderAction({ motivo, ...values }: PurchaseOrderValues) {
  return apiFetch<PurchaseOrder>("/purchase-orders", {
    method: "POST",
    body: { ...values, motivo: motivo || undefined },
  })
}
