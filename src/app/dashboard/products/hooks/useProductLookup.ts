"use client"

import { useQuery } from "@tanstack/react-query"

import { getProductsAction } from "@/app/dashboard/products/actions/getProductsAction"
import { PRODUCTS_KEY } from "@/app/dashboard/products/hooks/useProducts"
import type { Product } from "@/app/dashboard/products/utils/types"

// The organization's active products by id, for lists of other services that only carry a
// producto_id (purchase orders, payables, alerts). Unknown ids fall back to "#id"
export function useProductLookup() {
  const products = useQuery({
    queryKey: [...PRODUCTS_KEY, "lookup"],
    queryFn: () => getProductsAction({ page: 1, limit: 100 }),
    staleTime: 60_000,
  })

  const byId = new Map<number, Product>(products.data?.data.map((product) => [product.id, product]))

  return {
    byId,
    nameOf: (id: number) => byId.get(id)?.nombre ?? `Producto #${id}`,
  }
}
