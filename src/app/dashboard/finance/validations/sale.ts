import { z } from "zod"

import { cuenta, optionalDate } from "@/app/dashboard/finance/validations/common"

// Mirrors RegisterSaleDto; precio_unitario defaults to the recipe price
export const saleSchema = z.object({
  fecha: optionalDate,
  cuenta,
  lineas: z
    .array(
      z.object({
        recipe_id: z.number().int().positive(),
        unidades: z.number().int().positive(),
        precio_unitario: z.number().int().positive().optional(),
      })
    )
    .min(1, "Agrega al menos un producto."),
})

export type SaleValues = z.infer<typeof saleSchema>
