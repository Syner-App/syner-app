import { CircleAlert } from "lucide-react"

import type { FinanceAlert } from "@/app/dashboard/finance/utils/types"

// The warnings finance-ms computes (reserve below goal, deficit, break-even not reached…)
export function FinanceAlerts({ alerts, limit }: { alerts: FinanceAlert[]; limit?: number }) {
  const shown = limit ? alerts.slice(0, limit) : alerts
  if (shown.length === 0) return null
  return (
    <ul className="flex flex-col gap-2">
      {shown.map((alert) => (
        <li
          key={alert.codigo}
          className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-900 dark:text-amber-200"
        >
          <CircleAlert className="mt-0.5 size-4 shrink-0" />
          <span>{alert.mensaje}</span>
        </li>
      ))}
    </ul>
  )
}
