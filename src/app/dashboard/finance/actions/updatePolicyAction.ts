import { apiFetch } from "@/lib/api-client"
import { compact } from "@/app/dashboard/finance/utils/payload"
import type { Policy } from "@/app/dashboard/finance/utils/types"
import type { PolicyValues } from "@/app/dashboard/finance/validations/policy"

export function updatePolicyAction(values: PolicyValues) {
  return apiFetch<Policy>("/finance/policy", { method: "PATCH", body: compact(values) })
}
