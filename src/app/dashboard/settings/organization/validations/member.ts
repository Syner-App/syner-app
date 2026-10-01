import { z } from "zod"

import type { Role } from "@/lib/types"

// Same rule as IsStrongPassword in the backend
const STRONG_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/

// name and password only matter when the email has no account yet; the backend asks for
// them in that case
export const memberSchema = z.object({
  email: z.string().trim().min(1, "El correo es obligatorio.").pipe(z.email("Ingresa un correo válido.")),
  role: z.enum(["owner", "admin", "user"]),
  name: z.string().trim(),
  password: z
    .string()
    .refine(
      (password) => password === "" || STRONG_PASSWORD.test(password),
      "Mínimo 8 caracteres con mayúscula, minúscula, número y símbolo."
    ),
})

export type MemberValues = z.infer<typeof memberSchema>

export interface MemberPayload {
  email: string
  role: Role
  name?: string
  password?: string
}

// Empty optional fields are left out (the gateway rejects empty strings)
export function toMemberPayload({ email, role, name, password }: MemberValues): MemberPayload {
  return { email, role, ...(name && { name }), ...(password && { password }) }
}
