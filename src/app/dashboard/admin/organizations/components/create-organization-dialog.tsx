"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { errorMessage } from "@/lib/api-client"
import { useCreateOrganization } from "@/app/dashboard/admin/organizations/hooks/useOrganizations"
import {
  createOrganizationSchema,
  toSlug,
  type CreateOrganizationValues,
} from "@/app/dashboard/admin/organizations/validations/organization"

export function CreateOrganizationDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const createOrganization = useCreateOrganization()
  const form = useForm<CreateOrganizationValues>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: { name: "", slug: "" },
  })

  async function onSubmit(values: CreateOrganizationValues) {
    try {
      await createOrganization.mutateAsync(values)
      form.reset()
      onOpenChange(false)
    } catch {
      // Shown below from createOrganization.error
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) createOrganization.reset()
        onOpenChange(next)
      }}
    >
      <DialogContent>
        <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle>Nueva organización</DialogTitle>
            <DialogDescription>Después agrega a su propietario desde Miembros.</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="organization-new-name">Nombre</FieldLabel>
                  <Input
                    {...field}
                    id="organization-new-name"
                    aria-invalid={fieldState.invalid}
                    onChange={(event) => {
                      field.onChange(event)
                      // Suggest the slug until it's edited by hand
                      if (!form.getFieldState("slug").isDirty) {
                        form.setValue("slug", toSlug(event.target.value))
                      }
                    }}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="slug"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="organization-new-slug">Slug</FieldLabel>
                  <Input {...field} id="organization-new-slug" maxLength={50} aria-invalid={fieldState.invalid} />
                  <FieldDescription>Identificador único; no se puede cambiar después.</FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
          {createOrganization.isError && <FieldError>{errorMessage(createOrganization.error)}</FieldError>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
              Crear
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
