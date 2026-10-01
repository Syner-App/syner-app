import { apiFetch } from "@/lib/api-client"
import type { ScenarioList } from "@/app/dashboard/finance/utils/types"

export function getScenariosAction(niveles: number[] = []) {
  return apiFetch<ScenarioList>("/finance/scenarios", { query: { niveles: niveles.join(",") || undefined } })
}
