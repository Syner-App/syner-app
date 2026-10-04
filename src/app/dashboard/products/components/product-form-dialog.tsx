"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { Controller, useForm } from "react-hook-form"

import { NumberInput } from "@/components/number-input"
import { Button } from "@/components/ui/button"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/responsive-dialog"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { errorMessage } from "@/lib/api-client"
import { useCreateProduct, useUpdateProduct } from "@/app/dashboard/products/hooks/useProductMutations"
import { CATEGORIES, CATEGORY_LABELS, type Product } from "@/app/dashboard/products/utils/types"
import { productSchema, type ProductValues } from "@/app/dashboard/products/validations/product"

// Creates a product, or edits one when `product` is given. Editing leaves the stock out:
// it only changes through stock movements
export function ProductFormDialog({
  open,
  product,
  onOpenChange,
}: {
  open: boolean
  product?: Product
  onOpenChange: (open: boolean) => void
}) {
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const mutation = product ? updateProduct : createProduct

  const form = useForm<ProductValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          nombre: product.nombre,
          codigo_sku: product.codigo_sku,
          categoria: product.categoria,
          precio: product.precio,
          stock_actual: product.stock_actual,
          stock_minimo: product.stock_minimo,
          proveedor: product.proveedor,
        }
      : {
          nombre: "",
          codigo_sku: "",
          categoria: undefined,
          precio: NaN,
          stock_actual: NaN,
          stock_minimo: NaN,
          proveedor: "",
        },
  })

  async function onSubmit(values: ProductValues) {
    try {
      if (product) {
        const { nombre, codigo_sku, categoria, precio, stock_minimo, proveedor } = values
        await updateProduct.mutateAsync({
          id: product.id,
          values: { nombre, codigo_sku, categoria, precio, stock_minimo, proveedor },
        })
      } else {
        await createProduct.mutateAsync(values)
        form.reset()
      }
      onOpenChange(false)
    } catch {
      // Shown below from mutation.error
    }
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-lg">
        <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>{product ? "Editar producto" : "Nuevo producto"}</ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              {product
                ? "El stock se ajusta con un movimiento de stock."
                : "Registra un producto en el inventario de la organización."}
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>
          <FieldGroup className="grid gap-4 sm:grid-cols-2">
            <Controller
              name="nombre"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="sm:col-span-2">
                  <FieldLabel htmlFor="product-nombre">Nombre</FieldLabel>
                  <Input {...field} id="product-nombre" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="codigo_sku"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-sku">SKU</FieldLabel>
                  <Input {...field} id="product-sku" maxLength={20} aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="categoria"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-categoria">Categoría</FieldLabel>
                  <Select value={field.value ?? ""} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="product-categoria"
                      className="w-full"
                      aria-invalid={fieldState.invalid}
                      onBlur={field.onBlur}
                    >
                      <SelectValue placeholder="Elige una" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((categoria) => (
                        <SelectItem key={categoria} value={categoria}>
                          {CATEGORY_LABELS[categoria]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="precio"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-precio">Precio</FieldLabel>
                  <NumberInput
                    id="product-precio"
                    min={0}
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
              name="proveedor"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-proveedor">Proveedor</FieldLabel>
                  <Input {...field} id="product-proveedor" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            {!product && (
              <Controller
                name="stock_actual"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="product-stock">Stock inicial</FieldLabel>
                    <NumberInput
                      id="product-stock"
                      min={0}
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
            )}
            <Controller
              name="stock_minimo"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-minimo">Stock mínimo</FieldLabel>
                  <NumberInput
                    id="product-minimo"
                    min={0}
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
          </FieldGroup>
          {mutation.isError && <FieldError>{errorMessage(mutation.error)}</FieldError>}
          <ResponsiveDialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
              {product ? "Guardar cambios" : "Crear producto"}
            </Button>
          </ResponsiveDialogFooter>
        </form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
