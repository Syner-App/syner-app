import { ArrowRight, CircleAlert } from "lucide-react"
import Link from "next/link"

import { translate } from "@/lib/api-client"
import type { FinanceAlert } from "@/app/dashboard/finance/utils/types"

// Without assumptions there is no break-even yet: a setup step, not a business warning
export const MISSING_ASSUMPTIONS = "SIN_SUPUESTOS"

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
          {/* SIN_SUPUESTOS reuses finance-ms's error text, which is in English */}
          <span className="flex-1">{translate(alert.mensaje)}</span>
          {alert.codigo === MISSING_ASSUMPTIONS && (
            <Link
              href="/dashboard/finance/settings"
              className="inline-flex shrink-0 items-center gap-1 font-medium underline-offset-4 hover:underline"
            >
              Configurar
              <ArrowRight className="size-4" />
            </Link>
          )}
        </li>
      ))}
    </ul>
  )
}
