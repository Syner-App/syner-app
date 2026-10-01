import { apiFetch } from "@/lib/api-client"
import type { Policy } from "@/app/dashboard/finance/utils/types"

export function getPolicyAction() {
  return apiFetch<Policy>("/finance/policy")
}
