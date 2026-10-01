import { z } from "zod"

// Mirrors CreateOrganizationDto in client-gateway
export const createOrganizationSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio."),
  slug: z
    .string()
    .trim()
    .min(1, "El slug es obligatorio.")
    .max(50, "El slug admite máximo 50 caracteres.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Solo minúsculas y números separados por guiones (ej. acme-foods)."),
})

export type CreateOrganizationValues = z.infer<typeof createOrganizationSchema>

// "Acme Foods S.A." -> "acme-foods-s-a"
export function toSlug(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50)
}
