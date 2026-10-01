"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { createPurchaseOrderAction } from "@/app/dashboard/purchase-orders/actions/createPurchaseOrderAction"
import { updatePurchaseOrderStatusAction } from "@/app/dashboard/purchase-orders/actions/updatePurchaseOrderStatusAction"
import { PURCHASE_ORDERS_KEY } from "@/app/dashboard/purchase-orders/hooks/usePurchaseOrders"
import { STATUS_LABELS } from "@/app/dashboard/purchase-orders/utils/types"
import { ALERTS_KEY } from "@/app/dashboard/alerts/hooks/useAlerts"
import { FINANCE_KEY } from "@/app/dashboard/finance/utils/keys"
import { PRODUCTS_KEY } from "@/app/dashboard/products/hooks/useProducts"

export function useCreatePurchaseOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createPurchaseOrderAction,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PURCHASE_ORDERS_KEY })
      toast.success("Orden creada: validando el producto…")
    },
  })
}

// Receiving an order adds its stock (products-ms) and opens a payable (finance-ms)
export function useUpdatePurchaseOrderStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updatePurchaseOrderStatusAction,
    onSuccess: (order) => {
      void queryClient.invalidateQueries({ queryKey: PURCHASE_ORDERS_KEY })
      if (order.estado === "RECIBIDA") {
        void queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY })
        void queryClient.invalidateQueries({ queryKey: ALERTS_KEY })
        void queryClient.invalidateQueries({ queryKey: FINANCE_KEY })
      }
      toast.success(`Orden ${STATUS_LABELS[order.estado].toLowerCase()}`)
    },
  })
}
