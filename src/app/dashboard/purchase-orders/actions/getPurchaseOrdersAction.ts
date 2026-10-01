import { apiFetch } from "@/lib/api-client"
import type { Paginated } from "@/lib/types"
import type { PurchaseOrder, PurchaseOrderFilters } from "@/app/dashboard/purchase-orders/utils/types"

export function getPurchaseOrdersAction(filters: PurchaseOrderFilters) {
  return apiFetch<Paginated<PurchaseOrder>>("/purchase-orders", { query: { ...filters } })
}
