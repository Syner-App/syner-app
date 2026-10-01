import { apiFetch } from "@/lib/api-client"
import type { Paginated } from "@/lib/types"
import type { Sale, SaleFilters } from "@/app/dashboard/finance/utils/types"

export function getSalesAction(filters: SaleFilters) {
  return apiFetch<Paginated<Sale>>("/finance/sales", { query: { ...filters } })
}
