import type { Metadata } from "next"

import { RequireAccess } from "@/components/require-access"
import { FinanceSettings } from "@/app/dashboard/finance/settings/components/finance-settings"

export const metadata: Metadata = {
  title: "Configuración financiera",
}

export default function Page() {
  return (
    <RequireAccess access="financeManager">
      <FinanceSettings />
    </RequireAccess>
  )
}
