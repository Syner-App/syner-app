import type { Metadata } from "next"

import { RequireAccess } from "@/components/require-access"
import { SalePos } from "@/app/dashboard/sell/components/sale-pos"

export const metadata: Metadata = {
  title: "Registrar venta",
}

export default function Page() {
  return (
    <RequireAccess>
      <SalePos />
    </RequireAccess>
  )
}
