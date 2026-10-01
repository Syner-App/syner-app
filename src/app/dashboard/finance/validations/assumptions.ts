import { z } from "zod"

import { amount, money, optionalDate } from "@/app/dashboard/finance/validations/common"

// Mirrors SetAssumptionsDto
export const assumptionsSchema = z.object({
  vigente_desde: optionalDate,
  precio_promedio: money("El precio promedio"),
  // NaN = computed from the recipes
  costo_variable_unitario: z.number().int("Debe ser un valor entero.").positive("Debe ser mayor a 0.").or(z.nan()),
  arriendo: amount("El arriendo"),
  servicios: amount("Los servicios"),
  salarios: amount("Los salarios"),
  otros_fijos: amount("Otros fijos"),
  dias_operacion: z
    .number({ error: "Los días de operación son obligatorios." })
    .int()
    .min(1, "Mínimo 1 día.")
    .max(31, "Máximo 31 días."),
  inversion_inicial: amount("La inversión inicial"),
})

export type AssumptionsValues = z.infer<typeof assumptionsSchema>
