"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Trash2 } from "lucide-react"
import { useFieldArray, useForm, useWatch } from "react-hook-form"

import { FormDialog, MoneyField, NumberField, SelectField, TextField } from "@/components/form-fields"
import { Button } from "@/components/ui/button"
import { FieldError, FieldLegend, FieldSet } from "@/components/ui/field"
import { formatMoney } from "@/lib/format"
import { useCreateRecipe, useUpdateRecipe } from "@/app/dashboard/finance/hooks/useFinanceMutations"
import type { Recipe, Supply } from "@/app/dashboard/finance/utils/types"
import { recipeSchema, type RecipeValues } from "@/app/dashboard/finance/validations/recipe"

// Creates a recipe or edits one (`recipe`). Saving the items replaces the current ones; the
// cost and margin preview uses the supplies' current unit cost
export function RecipeDialog({
  open,
  recipe,
  supplies,
  onOpenChange,
}: {
  open: boolean
  recipe?: Recipe
  supplies: Supply[]
  onOpenChange: (open: boolean) => void
}) {
  const createRecipe = useCreateRecipe()
  const updateRecipe = useUpdateRecipe()
  const mutation = recipe ? updateRecipe : createRecipe

  const form = useForm<RecipeValues>({
    resolver: zodResolver(recipeSchema),
    defaultValues: recipe
      ? {
          nombre: recipe.nombre,
          precio_venta: recipe.precio_venta,
          items: recipe.items.map(({ supply_id, cantidad }) => ({ supply_id, cantidad })),
        }
      : { nombre: "", precio_venta: NaN, items: [{ supply_id: NaN, cantidad: NaN }] },
  })
  const items = useFieldArray({ control: form.control, name: "items" })
  const [watchedItems, price] = useWatch({ control: form.control, name: ["items", "precio_venta"] })

  const costById = new Map(supplies.map((supply) => [supply.id, supply.costo_unitario]))
  const cost = (watchedItems ?? []).reduce(
    (sum, item) => sum + (costById.get(item.supply_id) ?? 0) * (Number.isNaN(item.cantidad) ? 0 : item.cantidad),
    0
  )
  const supplyOptions = supplies.map((supply) => ({ value: String(supply.id), label: supply.nombre }))

  async function onSubmit(values: RecipeValues) {
    try {
      if (recipe) await updateRecipe.mutateAsync({ id: recipe.id, values })
      else await createRecipe.mutateAsync(values)
      onOpenChange(false)
    } catch {
      // Shown in the dialog
    }
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={recipe ? `Editar ${recipe.nombre}` : "Nueva receta"}
      description="Lo que se vende y los insumos que consume cada unidad."
      onSubmit={form.handleSubmit(onSubmit)}
      isSubmitting={form.formState.isSubmitting}
      error={mutation.error}
      submitLabel="Guardar"
      className="sm:max-w-xl"
    >
      <TextField control={form.control} name="nombre" label="Nombre" placeholder="Granizado de mango" />
      <MoneyField control={form.control} name="precio_venta" label="Precio de venta" />

      <FieldSet className="sm:col-span-2">
        <FieldLegend variant="label">Insumos por unidad vendida</FieldLegend>
        <div className="flex flex-col gap-3">
          {items.fields.map((item, index) => (
            <div key={item.id} className="grid grid-cols-[1fr_6.5rem_auto] items-start gap-2">
              <SelectField
                control={form.control}
                name={`items.${index}.supply_id`}
                label={`Insumo ${index + 1}`}
                options={supplyOptions}
                placeholder="Insumo"
                numeric
              />
              <NumberField control={form.control} name={`items.${index}.cantidad`} label="Cantidad" decimal />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="mt-6"
                aria-label={`Quitar insumo ${index + 1}`}
                disabled={items.fields.length === 1}
                onClick={() => items.remove(index)}
              >
                <Trash2 />
              </Button>
            </div>
          ))}
          {form.formState.errors.items?.root && <FieldError errors={[form.formState.errors.items.root]} />}
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-fit"
            disabled={supplies.length === 0}
            onClick={() => items.append({ supply_id: NaN, cantidad: NaN })}
          >
            <Plus />
            Agregar insumo
          </Button>
        </div>
      </FieldSet>

      <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted/50 p-3 text-sm sm:col-span-2">
        <span className="text-muted-foreground">Costo estimado</span>
        <span className="text-right tabular-nums">{formatMoney(cost)}</span>
        <span className="text-muted-foreground">Margen por unidad</span>
        <span className="text-right font-medium tabular-nums">
          {Number.isNaN(price) ? "—" : formatMoney(price - cost)}
        </span>
      </div>
    </FormDialog>
  )
}
