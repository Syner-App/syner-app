import { apiFetch } from "@/lib/api-client"
import type { Paginated } from "@/lib/types"
import type { Movement, MovementFilters } from "@/app/dashboard/finance/utils/types"

export function getMovementsAction(filters: MovementFilters) {
  return apiFetch<Paginated<Movement>>("/finance/movements", { query: { ...filters } })
}
