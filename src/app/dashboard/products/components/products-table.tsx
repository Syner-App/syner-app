"use client"

import { ArrowDownUp, MoreHorizontal, Pencil, Trash2 } from "lucide-react"

import { CardField, ResponsiveList, type Column } from "@/components/responsive-list"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatPrice, isLowStock } from "@/app/dashboard/products/utils/format"
import { CATEGORY_LABELS, type Product } from "@/app/dashboard/products/utils/types"

function StockStatus({ product }: { product: Product }) {
  if (!product.activo) return <Badge variant="outline">Eliminado</Badge>
  return isLowStock(product) ? <Badge variant="destructive">Bajo</Badge> : null
}

function Stock({ product }: { product: Product }) {
  return (
    <span className="tabular-nums">
      {product.stock_actual}
      <span className="text-muted-foreground"> / mín. {product.stock_minimo}</span>
    </span>
  )
}

export function ProductsTable({
  products,
  isLoading,
  canManage,
  onEdit,
  onStock,
  onDelete,
}: {
  products?: Product[]
  isLoading: boolean
  canManage: boolean
  onEdit: (product: Product) => void
  onStock: (product: Product) => void
  onDelete: (product: Product) => void
}) {
  const columns: Column<Product>[] = [
    {
      header: "Producto",
      cell: (product) => (
        <div className="flex flex-col">
          <span className="font-medium">{product.nombre}</span>
          <span className="text-xs text-muted-foreground">{product.codigo_sku}</span>
        </div>
      ),
    },
    { header: "Categoría", className: "hidden lg:table-cell", cell: (product) => CATEGORY_LABELS[product.categoria] },
    { header: "Proveedor", cell: (product) => product.proveedor },
    { header: "Precio", className: "text-right tabular-nums", cell: (product) => formatPrice(product.precio) },
    {
      header: "Stock",
      className: "text-right",
      cell: (product) => (
        <div className="flex items-center justify-end gap-2">
          <StockStatus product={product} />
          <Stock product={product} />
        </div>
      ),
    },
  ]

  return (
    <ResponsiveList
      items={products}
      getKey={(product) => product.id}
      isLoading={isLoading}
      empty="No hay productos con estos filtros."
      columns={columns}
      actions={(product) =>
        product.activo && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={`Acciones de ${product.nombre}`}>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onStock(product)}>
                <ArrowDownUp />
                Movimiento de stock
              </DropdownMenuItem>
              {canManage && (
                <>
                  <DropdownMenuItem onClick={() => onEdit(product)}>
                    <Pencil />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onClick={() => onDelete(product)}>
                    <Trash2 />
                    Eliminar
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
      renderCard={(product) => (
        <>
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 flex-col">
              <span className="truncate font-medium">{product.nombre}</span>
              <span className="text-xs text-muted-foreground">
                {product.codigo_sku} · {CATEGORY_LABELS[product.categoria]}
              </span>
            </div>
            <StockStatus product={product} />
          </div>
          <CardField label="Precio">{formatPrice(product.precio)}</CardField>
          <CardField label="Stock">
            <Stock product={product} />
          </CardField>
          <CardField label="Proveedor">{product.proveedor}</CardField>
        </>
      )}
    />
  )
}
