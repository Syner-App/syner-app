import { z } from "zod"

import { SUPPLY_CATEGORIES } from "@/app/dashboard/finance/utils/types"
import { quantity } from "@/app/dashboard/finance/validations/common"

// Mirrors UpsertSupplyDto; producto_id goes in the path
export const supplySchema = z.object({
  producto_id: z.number({ error: "Elige un producto." }).int().positive("Elige un producto."),
  categoria: z.enum(SUPPLY_CATEGORIES, { error: "Elige la categoría." }),
  costo_unitario: quantity("El costo unitario"),
})

export type SupplyValues = z.infer<typeof supplySchema>
