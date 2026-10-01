import { z } from "zod"

import { CATEGORIES } from "@/app/dashboard/products/utils/types"

// Whole numbers from <input type="number">; an empty input arrives as NaN
const wholeNumber = (label: string) =>
  z
    .number({ error: `${label} es obligatorio.` })
    .int(`${label} debe ser un número entero.`)
    .min(0, `${label} no puede ser negativo.`)

// Mirrors CreateProductDto in client-gateway
export const productSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio."),
  codigo_sku: z
    .string()
    .trim()
    .min(1, "El SKU es obligatorio.")
    .max(20, "El SKU admite máximo 20 caracteres."),
  categoria: z.enum(CATEGORIES, { error: "Elige una categoría." }),
  precio: wholeNumber("El precio"),
  stock_actual: wholeNumber("El stock inicial"),
  stock_minimo: wholeNumber("El stock mínimo"),
  proveedor: z.string().trim().min(1, "El proveedor es obligatorio."),
})

export type ProductValues = z.infer<typeof productSchema>

export const stockSchema = z.object({
  tipo: z.enum(["entrada", "salida"]),
  cantidad: z
    .number({ error: "La cantidad es obligatoria." })
    .int("La cantidad debe ser un número entero.")
    .positive("La cantidad debe ser mayor a 0."),
  motivo: z.string().trim().min(1, "El motivo es obligatorio."),
})

export type StockValues = z.infer<typeof stockSchema>
