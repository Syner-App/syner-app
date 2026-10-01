import { apiFetch } from "@/lib/api-client"
import type { Waterfall } from "@/app/dashboard/finance/utils/types"

export function getWaterfallAction() {
  return apiFetch<Waterfall>("/finance/waterfall")
}
