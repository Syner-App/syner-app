"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useEffect } from "react"

import { getPurchaseOrdersAction } from "@/app/dashboard/purchase-orders/actions/getPurchaseOrdersAction"
import {
  clearOrderGenerating,
  isOrderGenerating,
  MAX_WAIT_MS,
  MIN_VISIBLE_MS,
  useOrderGeneration,
} from "@/app/dashboard/purchase-orders/utils/order-generation"
import type { PurchaseOrderFilters } from "@/app/dashboard/purchase-orders/utils/types"

export const PURCHASE_ORDERS_KEY = ["purchase-orders"]
export const LATEST_PURCHASE_ORDER_KEY = [...PURCHASE_ORDERS_KEY, "latest"]

const GENERATION_POLL_MS = 1_000

// Polls while an order of the page is still being validated by the saga, or while a
// low stock alert is opening one
export function usePurchaseOrders(filters: PurchaseOrderFilters) {
  return useQuery({
    queryKey: [...PURCHASE_ORDERS_KEY, filters],
    queryFn: () => getPurchaseOrdersAction(filters),
    placeholderData: keepPreviousData,
    refetchInterval: (query) =>
      isOrderGenerating() || query.state.data?.data.some((order) => order.estado === "EN_VALIDACION")
        ? 2000
        : false,
  })
}

// Newest purchase order of the organization (the list is sorted by createdAt desc). Under
// PURCHASE_ORDERS_KEY, so the socket events and the order mutations refresh it
export function useLatestPurchaseOrder(enabled: boolean) {
  return useQuery({
    queryKey: LATEST_PURCHASE_ORDER_KEY,
    queryFn: () => getPurchaseOrdersAction({ page: 1, limit: 1 }),
    select: (result) => result.data[0] ?? null,
    refetchInterval: (query) =>
      isOrderGenerating() || query.state.data?.data[0]?.estado === "EN_VALIDACION" ? GENERATION_POLL_MS : false,
    enabled,
  })
}

// True while a low stock alert is opening a purchase order or an order is EN_VALIDACION
// (sidebar spinner). The generation ends once a new order shows up already validated,
// after MIN_VISIBLE_MS, or after MAX_WAIT_MS when no order was created
export function useIsGeneratingOrder(enabled: boolean) {
  const generation = useOrderGeneration()
  const { data: latest } = useLatestPurchaseOrder(enabled)

  const validating = latest?.estado === "EN_VALIDACION"
  const settled = Boolean(generation && latest && latest.id !== generation.baselineId && !validating)

  useEffect(() => {
    if (!generation) return
    const elapsed = Date.now() - generation.startedAt
    const timer = setTimeout(clearOrderGenerating, Math.max(0, (settled ? MIN_VISIBLE_MS : MAX_WAIT_MS) - elapsed))
    return () => clearTimeout(timer)
  }, [generation, settled])

  return generation !== null || validating
}
