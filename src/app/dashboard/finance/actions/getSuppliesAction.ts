import { apiFetch } from "@/lib/api-client"
import type { List } from "@/lib/types"
import type { Supply } from "@/app/dashboard/finance/utils/types"

export function getSuppliesAction() {
  return apiFetch<List<Supply>>("/finance/supplies")
}
