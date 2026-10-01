"use client"

import { toast } from "sonner"

import { ConfirmDialog } from "@/components/confirm-dialog"
import { errorMessage } from "@/lib/api-client"
import { useDeleteProduct } from "@/app/dashboard/products/hooks/useProductMutations"
import type { Product } from "@/app/dashboard/products/utils/types"

export function DeleteProductDialog({
  product,
  onOpenChange,
}: {
  product?: Product
  onOpenChange: (open: boolean) => void
}) {
  const deleteProduct = useDeleteProduct()

  return (
    <ConfirmDialog
      open={product !== undefined}
      title={`¿Eliminar ${product?.nombre ?? "el producto"}?`}
      description="Dejará de aparecer en el inventario y no se puede restaurar. Su SKU queda reservado."
      confirmLabel="Eliminar"
      isPending={deleteProduct.isPending}
      onConfirm={() => {
        // No `product!`: React Compiler reads the callback's dependencies during render
        if (!product) return Promise.resolve()
        return deleteProduct.mutateAsync(product.id).catch((error: unknown) => {
          toast.error(errorMessage(error))
          throw error
        })
      }}
      onOpenChange={onOpenChange}
    />
  )
}
