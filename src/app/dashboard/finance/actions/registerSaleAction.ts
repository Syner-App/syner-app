import { apiFetch } from "@/lib/api-client"
import { compact } from "@/app/dashboard/finance/utils/payload"
import type { Sale } from "@/app/dashboard/finance/utils/types"
import type { SaleValues } from "@/app/dashboard/finance/validations/sale"

export function registerSaleAction(values: SaleValues) {
  return apiFetch<Sale>("/finance/sales", { method: "POST", body: compact(values) })
}
