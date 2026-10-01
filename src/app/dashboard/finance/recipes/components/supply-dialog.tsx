"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"

import { FormDialog, NumberField, SelectField } from "@/components/form-fields"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ProductCombobox } from "@/app/dashboard/products/components/product-combobox"
import type { Product } from "@/app/dashboard/products/utils/types"
import { useUpsertSupply } from "@/app/dashboard/finance/hooks/useFinanceMutations"
import { CATEGORY_LABELS, SUPPLY_CATEGORIES, type Supply, type SupplyCategory } from "@/app/dashboard/finance/utils/types"
import { supplySchema, type SupplyValues } from "@/app/dashboard/finance/validations/supply"

const categoryOptions = SUPPLY_CATEGORIES.map((value) => ({ value, label: CATEGORY_LABELS[value] }))

// Links a products-ms product as a supply with its unit cost, or edits one (`supply`)
export function SupplyDialog({
  open,
  supply,
  onOpenChange,
}: {
  open: boolean
  supply?: Supply
  onOpenChange: (open: boolean) => void
}) {
  const upsert = useUpsertSupply()
  const [product, setProduct] = useState<Product>()
  const form = useForm<SupplyValues>({
    resolver: zodResolver(supplySchema),
    defaultValues: supply
      ? {
          producto_id: supply.producto_id,
          categoria: supply.categoria as SupplyCategory,
          costo_unitario: supply.costo_unitario,
        }
      : { producto_id: NaN, categoria: "MATERIA_PRIMA", costo_unitario: NaN },
  })

  async function onSubmit(values: SupplyValues) {
    try {
      await upsert.mutateAsync(values)
      onOpenChange(false)
    } catch {
      // Shown in the dialog
    }
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={supply ? `Editar ${supply.nombre}` : "Nuevo insumo"}
      description="Un insumo es un producto del inventario con su costo por unidad."
      onSubmit={form.handleSubmit(onSubmit)}
      isSubmitting={form.formState.isSubmitting}
      error={upsert.error}
      submitLabel="Guardar"
    >
      {supply ? (
        <Field className="sm:col-span-2">
          <FieldLabel htmlFor="supply-product">Producto</FieldLabel>
          <Input id="supply-product" value={supply.nombre} disabled />
        </Field>
      ) : (
        <Controller
          name="producto_id"
          control={form.control}
          render={({ fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="sm:col-span-2">
              <FieldLabel htmlFor="supply-product">Producto</FieldLabel>
              <ProductCombobox
                id="supply-product"
                value={product}
                invalid={fieldState.invalid}
                onChange={(selected) => {
                  setProduct(selected)
                  form.setValue("producto_id", selected.id, { shouldValidate: true })
                }}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      )}
      <SelectField control={form.control} name="categoria" label="Categoría" options={categoryOptions} />
      <NumberField
        control={form.control}
        name="costo_unitario"
        label="Costo por unidad"
        prefix="$"
        decimal
        description="Se actualiza al pagar cada factura."
      />
    </FormDialog>
  )
}
