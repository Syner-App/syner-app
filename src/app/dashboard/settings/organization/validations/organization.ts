import { z } from "zod"

export const organizationSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio."),
})

export type OrganizationValues = z.infer<typeof organizationSchema>
