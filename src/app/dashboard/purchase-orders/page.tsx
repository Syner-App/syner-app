import type { Metadata } from "next"

import { RequireAccess } from "@/components/require-access"
import { PurchaseOrdersView } from "@/app/dashboard/purchase-orders/components/purchase-orders-view"

export const metadata: Metadata = {
  title: "Órdenes de compra",
}

export default function Page() {
  return (
    <RequireAccess>
      <PurchaseOrdersView />
    </RequireAccess>
  )
}
