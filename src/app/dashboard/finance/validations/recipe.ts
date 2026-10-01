import { z } from "zod"

import { money, quantity } from "@/app/dashboard/finance/validations/common"

// Mirrors CreateRecipeDto / UpdateRecipeDto (items replace the current ones)
export const recipeSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio.").max(100, "Máximo 100 caracteres."),
  precio_venta: money("El precio de venta"),
  items: z
    .array(
      z.object({
        supply_id: z.number({ error: "Elige un insumo." }).int().positive("Elige un insumo."),
        cantidad: quantity("La cantidad"),
      })
    )
    .min(1, "Agrega al menos un insumo."),
})

export type RecipeValues = z.infer<typeof recipeSchema>
