import { apiFetch } from "@/lib/api-client"
import type { Product } from "@/app/dashboard/products/utils/types"

// Soft delete: the product becomes inactive (listed with activo=false) and can't be restored
export function deleteProductAction(id: number) {
  return apiFetch<Product>(`/products/${id}`, { method: "DELETE" })
}
