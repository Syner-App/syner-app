import { apiFetch } from "@/lib/api-client"
import type { IncomeStatement } from "@/app/dashboard/finance/utils/types"

export function getIncomeStatementAction(periodo?: string) {
  return apiFetch<IncomeStatement>("/finance/income-statement", { query: { periodo } })
}
