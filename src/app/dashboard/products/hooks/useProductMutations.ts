"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { adjustStockAction } from "@/app/dashboard/products/actions/adjustStockAction"
import { createProductAction } from "@/app/dashboard/products/actions/createProductAction"
import { deleteProductAction } from "@/app/dashboard/products/actions/deleteProductAction"
import { updateProductAction } from "@/app/dashboard/products/actions/updateProductAction"
import { PRODUCTS_KEY } from "@/app/dashboard/products/hooks/useProducts"
import { ALERTS_KEY } from "@/app/dashboard/alerts/hooks/useAlerts"

// Stock changes open or resolve low-stock alerts, so alerts are refreshed too
function useInvalidateInventory() {
  const queryClient = useQueryClient()
  return () => {
    void queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY })
    void queryClient.invalidateQueries({ queryKey: ALERTS_KEY })
  }
}

export function useCreateProduct() {
  const invalidate = useInvalidateInventory()
  return useMutation({
    mutationFn: createProductAction,
    onSuccess: (product) => {
      invalidate()
      toast.success(`Producto ${product.nombre} creado`)
    },
  })
}

export function useUpdateProduct() {
  const invalidate = useInvalidateInventory()
  return useMutation({
    mutationFn: updateProductAction,
    onSuccess: (product) => {
      invalidate()
      toast.success(`Producto ${product.nombre} actualizado`)
    },
  })
}

export function useDeleteProduct() {
  const invalidate = useInvalidateInventory()
  return useMutation({
    mutationFn: deleteProductAction,
    onSuccess: (product) => {
      invalidate()
      toast.success(`Producto ${product.nombre} eliminado`)
    },
  })
}

export function useAdjustStock() {
  const invalidate = useInvalidateInventory()
  return useMutation({
    mutationFn: adjustStockAction,
    onSuccess: (product) => {
      invalidate()
      toast.success(`Stock de ${product.nombre}: ${product.stock_actual}`)
    },
  })
}
