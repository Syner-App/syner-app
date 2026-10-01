"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { Controller, useForm } from "react-hook-form"

import { NumberInput } from "@/components/number-input"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { errorMessage } from "@/lib/api-client"
import { useAdjustStock } from "@/app/dashboard/products/hooks/useProductMutations"
import type { Product, StockMovementType } from "@/app/dashboard/products/utils/types"
import { stockSchema, type StockValues } from "@/app/dashboard/products/validations/product"

// Stock in (entrada) or out (salida). Any member can register one
export function StockDialog({
  product,
  onOpenChange,
}: {
  product?: Product
  onOpenChange: (open: boolean) => void
}) {
  const adjustStock = useAdjustStock()
  const form = useForm<StockValues>({
    resolver: zodResolver(stockSchema),
    defaultValues: { tipo: "entrada", cantidad: NaN, motivo: "" },
  })

  async function onSubmit(values: StockValues) {
    if (!product) return
    try {
      await adjustStock.mutateAsync({ id: product.id, values })
      onOpenChange(false)
    } catch {
      // Shown below from adjustStock.error
    }
  }

  return (
    <Dialog open={product !== undefined} onOpenChange={onOpenChange}>
      <DialogContent>
        <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle>Movimiento de stock</DialogTitle>
            <DialogDescription>
              {product?.nombre}: {product?.stock_actual} en stock.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Controller
              name="tipo"
              control={form.control}
              render={({ field }) => (
                <Tabs value={field.value} onValueChange={(tipo) => field.onChange(tipo as StockMovementType)}>
                  <TabsList className="w-full">
                    <TabsTrigger value="entrada">Entrada</TabsTrigger>
                    <TabsTrigger value="salida">Salida</TabsTrigger>
                  </TabsList>
                </Tabs>
              )}
            />
            <Controller
              name="cantidad"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="stock-cantidad">Cantidad</FieldLabel>
                  <NumberInput
                    id="stock-cantidad"
                    min={1}
                    step={1}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="motivo"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="stock-motivo">Motivo</FieldLabel>
                  <Input
                    {...field}
                    id="stock-motivo"
                    placeholder="Compra a proveedor, venta, merma…"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
          {adjustStock.isError && <FieldError>{errorMessage(adjustStock.error)}</FieldError>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
              Registrar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
