import { apiFetch } from "@/lib/api-client"
import type { Paginated } from "@/lib/types"
import type { Alert, AlertFilters } from "@/app/dashboard/alerts/utils/types"

export function getAlertsAction(filters: AlertFilters) {
  return apiFetch<Paginated<Alert>>("/alerts", { query: { ...filters } })
}
