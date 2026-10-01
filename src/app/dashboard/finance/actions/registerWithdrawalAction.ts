import { apiFetch } from "@/lib/api-client"
import { compact } from "@/app/dashboard/finance/utils/payload"
import type { Movement } from "@/app/dashboard/finance/utils/types"
import type { WithdrawalValues } from "@/app/dashboard/finance/validations/movement"

export function registerWithdrawalAction(values: WithdrawalValues) {
  return apiFetch<Movement>("/finance/withdrawals", { method: "POST", body: compact(values) })
}
