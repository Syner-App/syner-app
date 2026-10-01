"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/responsive-dialog"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { errorMessage } from "@/lib/api-client"
import { ROLE_LABELS } from "@/lib/permissions"
import type { Role } from "@/lib/types"
import {
  memberSchema,
  toMemberPayload,
  type MemberPayload,
  type MemberValues,
} from "@/app/dashboard/settings/organization/validations/member"

// Adds an existing user by email, or creates one when name and password are given.
// `roles` are the roles the caller may hand out (also used by the platform panel)
export function AddMemberDialog({
  open,
  roles,
  error,
  onSubmit,
  onOpenChange,
}: {
  open: boolean
  roles: Role[]
  error: unknown
  onSubmit: (payload: MemberPayload) => Promise<unknown>
  onOpenChange: (open: boolean) => void
}) {
  const form = useForm<MemberValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: { email: "", role: roles.at(-1) ?? "user", name: "", password: "" },
  })

  async function submit(values: MemberValues) {
    try {
      await onSubmit(toMemberPayload(values))
      form.reset()
      onOpenChange(false)
    } catch {
      // Shown below from `error`
    }
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent>
        <form noValidate onSubmit={form.handleSubmit(submit)} className="flex flex-col gap-6">
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>Agregar miembro</ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              Si el correo ya tiene cuenta, solo se agrega a la organización.
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="member-email">Correo</FieldLabel>
                  <Input {...field} id="member-email" type="email" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="role"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="member-role">Rol</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange} disabled={roles.length === 1}>
                    <SelectTrigger id="member-role" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {ROLE_LABELS[role]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {roles.length === 1 && (
                    <FieldDescription>Tu rol solo permite agregar usuarios.</FieldDescription>
                  )}
                </Field>
              )}
            />
            <FieldSeparator>Solo para una cuenta nueva</FieldSeparator>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="member-name">Nombre</FieldLabel>
                  <Input {...field} id="member-name" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="member-password">Contraseña inicial</FieldLabel>
                  <Input
                    {...field}
                    id="member-password"
                    type="password"
                    autoComplete="new-password"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
          {Boolean(error) && <FieldError>{errorMessage(error)}</FieldError>}
          <ResponsiveDialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
              Agregar
            </Button>
          </ResponsiveDialogFooter>
        </form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
