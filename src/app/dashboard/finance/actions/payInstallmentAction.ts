import { apiFetch } from "@/lib/api-client"
import { compact } from "@/app/dashboard/finance/utils/payload"
import type { Credit } from "@/app/dashboard/finance/utils/types"
import type { InstallmentValues } from "@/app/dashboard/finance/validations/credit"

export function payInstallmentAction({ id, values }: { id: string; values: InstallmentValues }) {
  return apiFetch<Credit>(`/finance/credits/${id}/installments`, { method: "POST", body: compact(values) })
}
