import { apiFetch } from "@/lib/api-client"
import { compact } from "@/app/dashboard/finance/utils/payload"
import type { Movement } from "@/app/dashboard/finance/utils/types"
import type { PayExpenseValues } from "@/app/dashboard/finance/validations/movement"

export function payExpenseAction({ id, values }: { id: string; values: PayExpenseValues }) {
  return apiFetch<Movement>(`/finance/expenses/${id}/pay`, { method: "PATCH", body: compact(values) })
}
