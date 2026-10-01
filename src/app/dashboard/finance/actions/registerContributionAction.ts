import { apiFetch } from "@/lib/api-client"
import { compact } from "@/app/dashboard/finance/utils/payload"
import type { Movement } from "@/app/dashboard/finance/utils/types"
import type { ContributionValues } from "@/app/dashboard/finance/validations/movement"

export function registerContributionAction(values: ContributionValues) {
  return apiFetch<Movement>("/finance/contributions", { method: "POST", body: compact(values) })
}
