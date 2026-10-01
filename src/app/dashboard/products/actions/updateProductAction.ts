import { apiFetch } from "@/lib/api-client"
import type { Product } from "@/app/dashboard/products/utils/types"
import type { ProductValues } from "@/app/dashboard/products/validations/product"

// stock_actual only changes through stock movements (adjustStockAction)
export type UpdateProductValues = Omit<ProductValues, "stock_actual">

export function updateProductAction({ id, values }: { id: number; values: UpdateProductValues }) {
  return apiFetch<Product>(`/products/${id}`, { method: "PATCH", body: values })
}
