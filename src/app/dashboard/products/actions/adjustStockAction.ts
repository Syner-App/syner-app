import { apiFetch } from "@/lib/api-client"
import type { Product } from "@/app/dashboard/products/utils/types"
import type { StockValues } from "@/app/dashboard/products/validations/product"

export function adjustStockAction({ id, values }: { id: number; values: StockValues }) {
  return apiFetch<Product>(`/products/${id}/stock`, { method: "POST", body: values })
}
