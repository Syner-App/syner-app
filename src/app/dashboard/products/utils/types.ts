export const CATEGORIES = ["Bebidas", "Lacteos", "Snacks", "Limpieza", "Frutas", "Granos"] as const

export type Category = (typeof CATEGORIES)[number]

export const CATEGORY_LABELS: Record<Category, string> = {
  Bebidas: "Bebidas",
  Lacteos: "Lácteos",
  Snacks: "Snacks",
  Limpieza: "Limpieza",
  Frutas: "Frutas",
  Granos: "Granos",
}

export interface Product {
  id: number
  nombre: string
  codigo_sku: string
  categoria: Category
  // Whole currency units (products-ms stores an Int)
  precio: number
  stock_actual: number
  stock_minimo: number
  proveedor: string
  activo: boolean
  createdAt: string
  updatedAt?: string
}

export interface ProductFilters {
  page: number
  limit: number
  nombre?: string
  proveedor?: string
  categoria?: Category
  stock_bajo?: boolean
  // false lists the deleted (inactive) products
  activo?: boolean
}

export type StockMovementType = "entrada" | "salida"
