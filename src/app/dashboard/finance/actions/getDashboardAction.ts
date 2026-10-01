import { apiFetch } from "@/lib/api-client"
import type { Dashboard } from "@/app/dashboard/finance/utils/types"

export function getDashboardAction() {
  return apiFetch<Dashboard>("/finance/dashboard")
}
