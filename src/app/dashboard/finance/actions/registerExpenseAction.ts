import { apiFetch } from "@/lib/api-client"
import { compact } from "@/app/dashboard/finance/utils/payload"
import type { Movement } from "@/app/dashboard/finance/utils/types"
import type { ExpenseValues } from "@/app/dashboard/finance/validations/movement"

export function registerExpenseAction(values: ExpenseValues) {
  return apiFetch<Movement>("/finance/expenses", { method: "POST", body: compact(values) })
}
