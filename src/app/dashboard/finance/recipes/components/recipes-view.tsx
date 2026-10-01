"use client"

import { Pencil, Plus } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { FilterTabs } from "@/components/filter-tabs"
import { PageHeader } from "@/components/page-header"
import { CardField, ResponsiveList, type Column } from "@/components/responsive-list"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { errorMessage } from "@/lib/api-client"
import { formatMoney, formatNumber } from "@/lib/format"
import { useUpdateRecipe } from "@/app/dashboard/finance/hooks/useFinanceMutations"
import { useRecipes, useSupplies } from "@/app/dashboard/finance/hooks/useFinanceQueries"
import { RecipeDialog } from "@/app/dashboard/finance/recipes/components/recipe-dialog"
import { SupplyDialog } from "@/app/dashboard/finance/recipes/components/supply-dialog"
import { CATEGORY_LABELS, type Recipe, type Supply } from "@/app/dashboard/finance/utils/types"

type Tab = "recipes" | "supplies"

type DialogState =
  | { type: "recipe"; recipe?: Recipe }
  | { type: "supply"; supply?: Supply }
  | null

function RecipeCard({ recipe, onEdit }: { recipe: Recipe; onEdit: () => void }) {
  const updateRecipe = useUpdateRecipe()
  const margin = recipe.precio_venta > 0 ? recipe.margen_unitario / recipe.precio_venta : 0

  return (
    <Card size="sm" className={recipe.activo ? undefined : "opacity-60"}>
      <CardHeader>
        <CardTitle>{recipe.nombre}</CardTitle>
        <CardDescription className="tabular-nums">{formatMoney(recipe.precio_venta)}</CardDescription>
        <CardAction>
          <Button variant="ghost" size="icon" aria-label={`Editar ${recipe.nombre}`} onClick={onEdit}>
            <Pencil />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-1.5">
        <CardField label="Costo">{formatMoney(recipe.costo_unitario)}</CardField>
        <CardField label="Margen">
          {formatMoney(recipe.margen_unitario)}
          <span className="text-muted-foreground"> · {Math.round(margin * 100)} %</span>
        </CardField>
        <ul className="mt-1 flex flex-wrap gap-1">
          {recipe.items.map((item) => (
            <li key={item.supply_id}>
              <Badge variant="outline">
                {formatNumber(item.cantidad)} {item.nombre}
              </Badge>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="border-t pt-3">
        <Label className="flex items-center gap-2 font-normal">
          <Switch
            checked={recipe.activo}
            disabled={updateRecipe.isPending}
            onCheckedChange={(activo) =>
              updateRecipe.mutate(
                { id: recipe.id, values: { activo } },
                { onError: (error) => toast.error(errorMessage(error)) }
              )
            }
          />
          {recipe.activo ? "Se vende" : "Inactiva"}
        </Label>
      </CardFooter>
    </Card>
  )
}

// Recipes (what is sold and the supplies each unit consumes) and supplies (products of the
// inventory with a unit cost). Together they give the variable cost of every sale
export function RecipesView() {
  const [tab, setTab] = useState<Tab>("recipes")
  const [dialog, setDialog] = useState<DialogState>(null)
  const close = (open: boolean) => !open && setDialog(null)

  const recipes = useRecipes()
  const supplies = useSupplies()

  const supplyColumns: Column<Supply>[] = [
    { header: "Insumo", cell: (supply) => <span className="font-medium">{supply.nombre}</span> },
    { header: "Categoría", cell: (supply) => CATEGORY_LABELS[supply.categoria] },
    {
      header: "Costo por unidad",
      className: "text-right tabular-nums",
      cell: (supply) => formatMoney(supply.costo_unitario),
    },
    {
      header: "Consumo sin descontar",
      className: "hidden text-right tabular-nums lg:table-cell",
      cell: (supply) => formatNumber(supply.consumo_pendiente),
    },
  ]

  return (
    <>
      <PageHeader
        title="Recetas e insumos"
        description="Define qué vendes y cuánto cuesta producir cada unidad."
        actions={
          tab === "recipes" ? (
            <Button disabled={supplies.data?.data.length === 0} onClick={() => setDialog({ type: "recipe" })}>
              <Plus />
              Nueva receta
            </Button>
          ) : (
            <Button onClick={() => setDialog({ type: "supply" })}>
              <Plus />
              Nuevo insumo
            </Button>
          )
        }
      />
      <FilterTabs
        value={tab}
        onChange={setTab}
        options={[
          { value: "recipes", label: `Recetas${recipes.data ? ` (${recipes.data.data.length})` : ""}` },
          { value: "supplies", label: `Insumos${supplies.data ? ` (${supplies.data.data.length})` : ""}` },
        ]}
      />

      {tab === "recipes" && (
        <>
          {recipes.isError && (
            <p role="alert" className="text-sm text-destructive">
              {errorMessage(recipes.error)}
            </p>
          )}
          {supplies.data?.data.length === 0 && (
            <p className="text-sm text-muted-foreground">Primero registra los insumos para armar las recetas.</p>
          )}
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {recipes.isPending && Array.from({ length: 3 }, (_, index) => <Skeleton key={index} className="h-56 rounded-xl" />)}
            {recipes.data?.data.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} onEdit={() => setDialog({ type: "recipe", recipe })} />
            ))}
          </div>
          {recipes.data?.data.length === 0 && (
            <p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
              No hay recetas todavía.
            </p>
          )}
        </>
      )}

      {tab === "supplies" &&
        (supplies.isError ? (
          <p role="alert" className="text-sm text-destructive">
            {errorMessage(supplies.error)}
          </p>
        ) : (
          <ResponsiveList
            items={supplies.data?.data}
            getKey={(supply) => supply.id}
            isLoading={supplies.isPending}
            empty="No hay insumos. Vincula un producto del inventario con su costo."
            columns={supplyColumns}
            actions={(supply) => (
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Editar ${supply.nombre}`}
                onClick={() => setDialog({ type: "supply", supply })}
              >
                <Pencil />
              </Button>
            )}
            renderCard={(supply) => (
              <>
                <span className="font-medium">{supply.nombre}</span>
                <CardField label="Categoría">{CATEGORY_LABELS[supply.categoria]}</CardField>
                <CardField label="Costo por unidad">{formatMoney(supply.costo_unitario)}</CardField>
              </>
            )}
          />
        ))}

      <RecipeDialog
        key={dialog?.type === "recipe" ? `recipe-${dialog.recipe?.id ?? "new"}` : "recipe"}
        open={dialog?.type === "recipe"}
        recipe={dialog?.type === "recipe" ? dialog.recipe : undefined}
        supplies={supplies.data?.data ?? []}
        onOpenChange={close}
      />
      <SupplyDialog
        key={dialog?.type === "supply" ? `supply-${dialog.supply?.id ?? "new"}` : "supply"}
        open={dialog?.type === "supply"}
        supply={dialog?.type === "supply" ? dialog.supply : undefined}
        onOpenChange={close}
      />
    </>
  )
}
