import { apiFetch } from "@/lib/api-client"
import type { List } from "@/lib/types"
import type { Credit } from "@/app/dashboard/finance/utils/types"

export function getCreditsAction() {
  return apiFetch<List<Credit>>("/finance/credits")
}
