import type { Metadata } from "next"

import { RequireAccess } from "@/components/require-access"
import { ProductsView } from "@/app/dashboard/products/components/products-view"

export const metadata: Metadata = {
  title: "Stock Productos e insumos",
}

export default function Page() {
  return (
    <RequireAccess>
      <ProductsView />
    </RequireAccess>
  )
}
