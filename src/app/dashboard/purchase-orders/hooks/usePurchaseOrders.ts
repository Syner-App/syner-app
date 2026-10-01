"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { getPurchaseOrdersAction } from "@/app/dashboard/purchase-orders/actions/getPurchaseOrdersAction"
import type { PurchaseOrderFilters } from "@/app/dashboard/purchase-orders/utils/types"

export const PURCHASE_ORDERS_KEY = ["purchase-orders"]

// Polls while an order of the page is still being validated by the saga
export function usePurchaseOrders(filters: PurchaseOrderFilters) {
  return useQuery({
    queryKey: [...PURCHASE_ORDERS_KEY, filters],
    queryFn: () => getPurchaseOrdersAction(filters),
    placeholderData: keepPreviousData,
    refetchInterval: (query) =>
      query.state.data?.data.some((order) => order.estado === "EN_VALIDACION") ? 2000 : false,
  })
}
