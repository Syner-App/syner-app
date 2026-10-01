import { apiFetch, ApiError } from "@/lib/api-client"
import type { Assumptions } from "@/app/dashboard/finance/utils/types"

// null until the organization registers its first assumptions (finance-ms answers a
// failed precondition, which is not an error for the settings form)
export async function getAssumptionsAction(): Promise<Assumptions | null> {
  try {
    return await apiFetch<Assumptions>("/finance/assumptions")
  } catch (error) {
    if (error instanceof ApiError && error.messages.some((message) => message.startsWith("Primero registra"))) return null
    throw error
  }
}
