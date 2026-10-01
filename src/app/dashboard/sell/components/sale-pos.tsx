"use client"

import { Loader2, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { PageHeader } from "@/components/page-header"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/responsive-dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSession } from "@/hooks/use-session"
import { errorMessage } from "@/lib/api-client"
import { formatMoney, today } from "@/lib/format"
import { can } from "@/lib/permissions"
import { cn } from "@/lib/utils"
import { useRegisterSale } from "@/app/dashboard/finance/hooks/useFinanceMutations"
import { useRecipes } from "@/app/dashboard/finance/hooks/useFinanceQueries"
import { ACCOUNT_LABELS, CASH_ACCOUNTS, type CashAccount, type Recipe } from "@/app/dashboard/finance/utils/types"

// Point of sale: tap a recipe to add a unit, then charge. Built for a phone at the counter;
// the cart bar stays at the bottom of the screen
export function SalePos() {
  const { data: session } = useSession()
  const recipes = useRecipes()
  const registerSale = useRegisterSale()

  const [cart, setCart] = useState<Record<number, number>>({})
  const [checkout, setCheckout] = useState(false)
  const [cuenta, setCuenta] = useState<CashAccount>("CAJA")
  const [fecha, setFecha] = useState("")

  const active = recipes.data?.data.filter((recipe) => recipe.activo) ?? []
  const lines = active
    .filter((recipe) => (cart[recipe.id] ?? 0) > 0)
    .map((recipe) => ({ recipe, unidades: cart[recipe.id] }))
  const units = lines.reduce((sum, line) => sum + line.unidades, 0)
  const total = lines.reduce((sum, line) => sum + line.unidades * line.recipe.precio_venta, 0)

  function change(recipe: Recipe, delta: number) {
    setCart((current) => {
      const next = Math.max(0, (current[recipe.id] ?? 0) + delta)
      return { ...current, [recipe.id]: next }
    })
  }

  async function charge() {
    try {
      await registerSale.mutateAsync({
        cuenta,
        fecha,
        lineas: lines.map(({ recipe, unidades }) => ({ recipe_id: recipe.id, unidades })),
      })
      setCart({})
      setFecha("")
      setCheckout(false)
    } catch {
      // Shown in the checkout dialog
    }
  }

  return (
    <>
      <PageHeader title="Registrar venta" description="Toca un producto para sumarlo a la venta." />

      {recipes.isError && (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage(recipes.error)}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {recipes.isPending &&
          Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-32 rounded-xl" />)}
        {active.map((recipe) => {
          const quantity = cart[recipe.id] ?? 0
          return (
            <Card
              key={recipe.id}
              size="sm"
              className={cn(
                "relative gap-2 px-3 transition-colors select-none",
                quantity > 0 && "ring-2 ring-primary"
              )}
            >
              <button
                type="button"
                className="flex min-h-16 flex-col items-start gap-1 text-left after:absolute after:inset-0"
                onClick={() => change(recipe, 1)}
              >
                <span className="line-clamp-2 font-medium">{recipe.nombre}</span>
                <span className="text-muted-foreground tabular-nums">{formatMoney(recipe.precio_venta)}</span>
              </button>
              <div className="relative z-10 flex items-center justify-between">
                {quantity > 0 ? (
                  <>
                    <Button
                      size="icon"
                      variant="outline"
                      aria-label={`Quitar una unidad de ${recipe.nombre}`}
                      onClick={() => change(recipe, -1)}
                    >
                      <Minus />
                    </Button>
                    <span className="text-lg font-semibold tabular-nums">{quantity}</span>
                    <Button size="icon" aria-label={`Agregar una unidad de ${recipe.nombre}`} onClick={() => change(recipe, 1)}>
                      <Plus />
                    </Button>
                  </>
                ) : (
                  <span className="text-xs text-muted-foreground">Toca para agregar</span>
                )}
              </div>
            </Card>
          )
        })}
      </div>

      {recipes.data && active.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          <ShoppingBag className="size-8" />
          <p>No hay recetas activas para vender.</p>
          {can.manageFinance(session?.user.role) && (
            <Button asChild variant="outline">
              <Link href="/dashboard/finance/recipes">Crear recetas</Link>
            </Button>
          )}
        </div>
      )}

      {units > 0 && (
        <div className="sticky bottom-3 z-20 mt-auto flex items-center gap-3 rounded-xl border bg-background/95 p-3 shadow-lg backdrop-blur sm:bottom-4">
          <Button variant="ghost" size="icon" aria-label="Vaciar venta" onClick={() => setCart({})}>
            <Trash2 />
          </Button>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-xs text-muted-foreground">
              {units} {units === 1 ? "unidad" : "unidades"}
            </span>
            <span className="text-lg font-semibold tabular-nums">{formatMoney(total)}</span>
          </div>
          <Button size="lg" onClick={() => setCheckout(true)}>
            Cobrar
          </Button>
        </div>
      )}

      <ResponsiveDialog open={checkout} onOpenChange={setCheckout}>
        <ResponsiveDialogContent>
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>Confirmar venta</ResponsiveDialogTitle>
            <ResponsiveDialogDescription>Se descontarán los insumos del inventario.</ResponsiveDialogDescription>
          </ResponsiveDialogHeader>
          <ul className="flex flex-col divide-y rounded-lg border text-sm">
            {lines.map(({ recipe, unidades }) => (
              <li key={recipe.id} className="flex items-center justify-between gap-3 px-3 py-2">
                <span className="min-w-0 truncate">
                  {unidades} × {recipe.nombre}
                </span>
                <span className="tabular-nums">{formatMoney(unidades * recipe.precio_venta)}</span>
              </li>
            ))}
            <li className="flex items-center justify-between px-3 py-2 font-semibold">
              <span>Total</span>
              <span className="tabular-nums">{formatMoney(total)}</span>
            </li>
          </ul>
          <Field>
            <FieldLabel>Medio de pago</FieldLabel>
            <Tabs value={cuenta} onValueChange={(value) => setCuenta(value as CashAccount)}>
              <TabsList className="w-full">
                {CASH_ACCOUNTS.map((account) => (
                  <TabsTrigger key={account} value={account}>
                    {ACCOUNT_LABELS[account]}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </Field>
          <Field>
            <FieldLabel htmlFor="sale-fecha">Fecha (opcional)</FieldLabel>
            <Input id="sale-fecha" type="date" max={today()} value={fecha} onChange={(event) => setFecha(event.target.value)} />
          </Field>
          {registerSale.isError && <FieldError>{errorMessage(registerSale.error)}</FieldError>}
          <ResponsiveDialogFooter>
            <Button variant="outline" onClick={() => setCheckout(false)}>
              Seguir vendiendo
            </Button>
            <Button disabled={registerSale.isPending || lines.length === 0} onClick={charge}>
              {registerSale.isPending && <Loader2 className="animate-spin" />}
              Registrar {formatMoney(total)}
            </Button>
          </ResponsiveDialogFooter>
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    </>
  )
}
