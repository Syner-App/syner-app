import { apiFetch } from "@/lib/api-client"
import { compact } from "@/app/dashboard/finance/utils/payload"
import type { Assumptions } from "@/app/dashboard/finance/utils/types"
import type { AssumptionsValues } from "@/app/dashboard/finance/validations/assumptions"

export function setAssumptionsAction(values: AssumptionsValues) {
  return apiFetch<Assumptions>("/finance/assumptions", { method: "PUT", body: compact(values) })
}
