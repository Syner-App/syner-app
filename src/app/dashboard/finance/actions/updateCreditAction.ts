import { apiFetch } from "@/lib/api-client"
import { compact } from "@/app/dashboard/finance/utils/payload"
import type { Credit } from "@/app/dashboard/finance/utils/types"
import type { CreditValues } from "@/app/dashboard/finance/validations/credit"

export function updateCreditAction({ id, values }: { id: string; values: CreditValues }) {
  return apiFetch<Credit>(`/finance/credits/${id}`, { method: "PATCH", body: compact(values) })
}
