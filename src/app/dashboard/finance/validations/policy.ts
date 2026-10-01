import { z } from "zod"

import { OPERATING_EXPENSES } from "@/app/dashboard/finance/utils/types"

// Mirrors UpdatePolicyDto
export const policySchema = z.object({
  dias_cobertura: z.number({ error: "Obligatorio." }).int().min(0, "Mínimo 0.").max(90, "Máximo 90 días."),
  meses_reserva: z
    .number({ error: "Obligatorio." })
    .min(0, "Mínimo 0.")
    .max(24, "Máximo 24 meses.")
    .refine((value) => Math.round(value * 100) === value * 100, "Máximo 2 decimales."),
  porcentaje_retiro: z.number({ error: "Obligatorio." }).int().min(0, "Mínimo 0 %.").max(100, "Máximo 100 %."),
  niveles_escenario: z.array(z.number().int().positive()).max(10, "Máximo 10 niveles."),
  categorias_variables: z.array(z.enum(OPERATING_EXPENSES)),
})

export type PolicyValues = z.infer<typeof policySchema>
