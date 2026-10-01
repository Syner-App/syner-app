import { apiFetch } from "@/lib/api-client"
import type { Period } from "@/app/dashboard/finance/utils/types"

export function reopenPeriodAction({ periodo, motivo }: { periodo: string; motivo: string }) {
  return apiFetch<Period>(`/finance/periods/${periodo}/reopen`, { method: "POST", body: { motivo } })
}
