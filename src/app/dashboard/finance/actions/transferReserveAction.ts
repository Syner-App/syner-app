import { apiFetch } from "@/lib/api-client"
import { compact } from "@/app/dashboard/finance/utils/payload"
import type { Movement } from "@/app/dashboard/finance/utils/types"
import type { TransferValues } from "@/app/dashboard/finance/validations/movement"

export function transferReserveAction(values: TransferValues) {
  return apiFetch<Movement>("/finance/reserve/transfers", { method: "POST", body: compact(values) })
}
