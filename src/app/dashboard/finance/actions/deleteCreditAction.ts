import { apiFetch } from "@/lib/api-client"
import type { Credit } from "@/app/dashboard/finance/utils/types"

// Soft delete: the installments and prepayments already paid stay in the movements
export function deleteCreditAction(id: string) {
  return apiFetch<Credit>(`/finance/credits/${id}`, { method: "DELETE" })
}
