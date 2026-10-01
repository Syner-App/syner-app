import { apiFetch } from "@/lib/api-client"
import type { Paginated } from "@/lib/types"
import type { Product, ProductFilters } from "@/app/dashboard/products/utils/types"

export function getProductsAction(filters: ProductFilters) {
  return apiFetch<Paginated<Product>>("/products", { query: { ...filters } })
}
