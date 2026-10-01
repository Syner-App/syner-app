import { apiFetch } from "@/lib/api-client"
import { compact } from "@/app/dashboard/finance/utils/payload"
import type { Supply } from "@/app/dashboard/finance/utils/types"
import type { SupplyValues } from "@/app/dashboard/finance/validations/supply"

export function upsertSupplyAction({ producto_id, ...values }: SupplyValues) {
  return apiFetch<Supply>(`/finance/supplies/${producto_id}`, { method: "PUT", body: compact(values) })
}
