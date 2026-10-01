import { apiFetch } from "@/lib/api-client"
import { compact } from "@/app/dashboard/finance/utils/payload"
import type { Payable } from "@/app/dashboard/finance/utils/types"
import type { PayPayableValues } from "@/app/dashboard/finance/validations/payable"

export function payPayableAction({ id, values }: { id: string; values: PayPayableValues }) {
  return apiFetch<Payable>(`/finance/payables/${id}/pay`, { method: "PATCH", body: compact(values) })
}
