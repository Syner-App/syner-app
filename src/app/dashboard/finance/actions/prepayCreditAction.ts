import { apiFetch } from "@/lib/api-client"
import { compact } from "@/app/dashboard/finance/utils/payload"
import type { Credit } from "@/app/dashboard/finance/utils/types"
import type { PrepaymentValues } from "@/app/dashboard/finance/validations/credit"

export function prepayCreditAction({ id, values }: { id: string; values: PrepaymentValues }) {
  return apiFetch<Credit>(`/finance/credits/${id}/prepayments`, { method: "POST", body: compact(values) })
}
