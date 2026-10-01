"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"

import { FormDialog, NumberField, TextField } from "@/components/form-fields"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { ProductCombobox } from "@/app/dashboard/products/components/product-combobox"
import type { Product } from "@/app/dashboard/products/utils/types"
import { useCreatePurchaseOrder } from "@/app/dashboard/purchase-orders/hooks/usePurchaseOrderMutations"
import {
  purchaseOrderSchema,
  type PurchaseOrderValues,
} from "@/app/dashboard/purchase-orders/validations/purchase-order"

// Picking the product fills the supplier with the product's one (editable)
export function CreatePurchaseOrderDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const createOrder = useCreatePurchaseOrder()
  const [product, setProduct] = useState<Product>()
  const form = useForm<PurchaseOrderValues>({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: { producto_id: NaN, proveedor: "", cantidad_solicitada: NaN, motivo: "" },
  })

  async function onSubmit(values: PurchaseOrderValues) {
    try {
      await createOrder.mutateAsync(values)
      form.reset()
      setProduct(undefined)
      onOpenChange(false)
    } catch {
      // Shown in the dialog from createOrder.error
    }
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Nueva orden de compra"
      description="Se valida el producto y queda pendiente de aprobación."
      onSubmit={form.handleSubmit(onSubmit)}
      isSubmitting={form.formState.isSubmitting}
      error={createOrder.error}
      submitLabel="Crear orden"
    >
      <Controller
        name="producto_id"
        control={form.control}
        render={({ fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="sm:col-span-2">
            <FieldLabel htmlFor="order-product">Producto</FieldLabel>
            <ProductCombobox
              id="order-product"
              value={product}
              invalid={fieldState.invalid}
              onChange={(selected) => {
                setProduct(selected)
                form.setValue("producto_id", selected.id, { shouldValidate: true })
                if (!form.getValues("proveedor")) form.setValue("proveedor", selected.proveedor)
              }}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <TextField control={form.control} name="proveedor" label="Proveedor" />
      <NumberField control={form.control} name="cantidad_solicitada" label="Cantidad" min={1} />
      <TextField
        control={form.control}
        name="motivo"
        label="Motivo (opcional)"
        placeholder="Reposición semanal…"
        className="sm:col-span-2"
      />
    </FormDialog>
  )
}
