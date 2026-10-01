import { apiFetch } from "@/lib/api-client"
import type { Product } from "@/app/dashboard/products/utils/types"
import type { ProductValues } from "@/app/dashboard/products/validations/product"

export function createProductAction(values: ProductValues) {
  return apiFetch<Product>("/products", { method: "POST", body: values })
}
