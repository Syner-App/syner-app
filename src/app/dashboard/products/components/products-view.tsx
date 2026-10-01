"use client"

import { Plus } from "lucide-react"
import { useState } from "react"

import { PageHeader } from "@/components/page-header"
import { TablePagination } from "@/components/table-pagination"
import { Button } from "@/components/ui/button"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { useSession } from "@/hooks/use-session"
import { errorMessage } from "@/lib/api-client"
import { can } from "@/lib/permissions"
import { DeleteProductDialog } from "@/app/dashboard/products/components/delete-product-dialog"
import { ProductFilters, type FilterValues } from "@/app/dashboard/products/components/product-filters"
import { ProductFormDialog } from "@/app/dashboard/products/components/product-form-dialog"
import { ProductsTable } from "@/app/dashboard/products/components/products-table"
import { StockDialog } from "@/app/dashboard/products/components/stock-dialog"
import { useProducts } from "@/app/dashboard/products/hooks/useProducts"
import type { Product } from "@/app/dashboard/products/utils/types"

const PAGE_SIZE = 10

type DialogState =
  | { type: "create" }
  | { type: "edit"; product: Product }
  | { type: "stock"; product: Product }
  | { type: "delete"; product: Product }
  | null

export function ProductsView() {
  const { data: session } = useSession()
  const canManage = can.manageProducts(session?.user.role)

  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<FilterValues>({
    nombre: "",
    proveedor: "",
    categoria: undefined,
    stock_bajo: false,
    inactivos: false,
  })
  const [dialog, setDialog] = useState<DialogState>(null)

  const nombre = useDebouncedValue(filters.nombre.trim())
  const proveedor = useDebouncedValue(filters.proveedor.trim())

  const products = useProducts({
    page,
    limit: PAGE_SIZE,
    nombre,
    proveedor,
    categoria: filters.categoria,
    stock_bajo: filters.stock_bajo || undefined,
    activo: filters.inactivos ? false : undefined,
  })

  function changeFilters(next: FilterValues) {
    setFilters(next)
    setPage(1)
  }

  const close = () => setDialog(null)

  return (
    <>
      <PageHeader
        title="Productos"
        description="Inventario de la organización: precios, stock y proveedores."
        actions={
          canManage && (
            <Button onClick={() => setDialog({ type: "create" })}>
              <Plus />
              Nuevo producto
            </Button>
          )
        }
      />
      <ProductFilters value={filters} onChange={changeFilters} />
      {products.isError ? (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage(products.error)}
        </p>
      ) : (
        <ProductsTable
          products={products.data?.data}
          isLoading={products.isPending}
          canManage={canManage}
          onEdit={(product) => setDialog({ type: "edit", product })}
          onStock={(product) => setDialog({ type: "stock", product })}
          onDelete={(product) => setDialog({ type: "delete", product })}
        />
      )}
      {products.data && (
        <TablePagination
          page={products.data.meta.page}
          lastPage={products.data.meta.lastPage}
          total={products.data.meta.total}
          onPageChange={setPage}
        />
      )}

      <ProductFormDialog
        key={dialog?.type === "edit" ? `edit-${dialog.product.id}` : "create"}
        open={dialog?.type === "create" || dialog?.type === "edit"}
        product={dialog?.type === "edit" ? dialog.product : undefined}
        onOpenChange={(open) => !open && close()}
      />
      <StockDialog
        key={dialog?.type === "stock" ? `stock-${dialog.product.id}` : "stock"}
        product={dialog?.type === "stock" ? dialog.product : undefined}
        onOpenChange={(open) => !open && close()}
      />
      <DeleteProductDialog
        product={dialog?.type === "delete" ? dialog.product : undefined}
        onOpenChange={(open) => !open && close()}
      />
    </>
  )
}
