"use client"

import { ArrowDownUp, MoreHorizontal, Pencil, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatPrice, isLowStock } from "@/app/dashboard/products/utils/format"
import { CATEGORY_LABELS, type Product } from "@/app/dashboard/products/utils/types"

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
  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Producto</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Proveedor</TableHead>
            <TableHead className="text-right">Precio</TableHead>
            <TableHead className="text-right">Stock</TableHead>
            <TableHead className="w-12">
              <span className="sr-only">Acciones</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading &&
            Array.from({ length: 5 }, (_, index) => (
              <TableRow key={index}>
                <TableCell colSpan={6}>
                  <Skeleton className="h-6 w-full" />
                </TableCell>
              </TableRow>
            ))}
          {!isLoading && products?.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                No hay productos con estos filtros.
              </TableCell>
            </TableRow>
          )}
          {products?.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{product.nombre}</span>
                  <span className="text-xs text-muted-foreground">{product.codigo_sku}</span>
                </div>
              </TableCell>
              <TableCell>{CATEGORY_LABELS[product.categoria]}</TableCell>
              <TableCell>{product.proveedor}</TableCell>
              <TableCell className="text-right tabular-nums">{formatPrice(product.precio)}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2 tabular-nums">
                  {!product.activo ? (
                    <Badge variant="outline">Eliminado</Badge>
                  ) : (
                    isLowStock(product) && <Badge variant="destructive">Bajo</Badge>
                  )}
                  <span>
                    {product.stock_actual}
                    <span className="text-muted-foreground"> / mín. {product.stock_minimo}</span>
                  </span>
                </div>
              </TableCell>
              <TableCell>
                {product.activo && (
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
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
