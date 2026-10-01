import { apiFetch } from "@/lib/api-client"
import type { BreakEven } from "@/app/dashboard/finance/utils/types"

export function getBreakEvenAction() {
  return apiFetch<BreakEven>("/finance/break-even")
}
