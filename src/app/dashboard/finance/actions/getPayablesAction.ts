import { apiFetch } from "@/lib/api-client"
import type { Paginated } from "@/lib/types"
import type { Payable, PayableFilters } from "@/app/dashboard/finance/utils/types"

export function getPayablesAction(filters: PayableFilters) {
  return apiFetch<Paginated<Payable>>("/finance/payables", { query: { ...filters } })
}
