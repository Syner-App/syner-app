import { apiFetch } from "@/lib/api-client"
import type { Period } from "@/app/dashboard/finance/utils/types"

export function closePeriodAction(periodo: string) {
  return apiFetch<Period>(`/finance/periods/${periodo}/close`, { method: "POST" })
}
