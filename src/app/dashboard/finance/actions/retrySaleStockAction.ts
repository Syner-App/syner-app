import { apiFetch } from "@/lib/api-client"
import type { Sale } from "@/app/dashboard/finance/utils/types"

export function retrySaleStockAction(id: string) {
  return apiFetch<Sale>(`/finance/sales/${id}/retry-stock`, { method: "POST" })
}
