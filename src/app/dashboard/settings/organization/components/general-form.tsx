"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useSession } from "@/hooks/use-session"
import { errorMessage } from "@/lib/api-client"
import { can } from "@/lib/permissions"
import { useOrganization, useUpdateOrganization } from "@/app/dashboard/settings/organization/hooks/useOrganization"
import {
  organizationSchema,
  type OrganizationValues,
} from "@/app/dashboard/settings/organization/validations/organization"

// Everyone with access sees it; only the owner can rename
export function GeneralForm() {
  const { data: session } = useSession()
  const canRename = can.renameOrganization(session?.user.role)
  const organization = useOrganization()
  const update = useUpdateOrganization()

  const form = useForm<OrganizationValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: { name: "" },
  })

  const { reset } = form
  useEffect(() => {
    if (organization.data) reset({ name: organization.data.name })
  }, [organization.data, reset])

  async function onSubmit(values: OrganizationValues) {
    await update.mutateAsync(values).catch(() => undefined)
  }

  if (organization.isPending) return <Skeleton className="h-56 w-full max-w-2xl" />
  if (organization.isError) {
    return (
      <p role="alert" className="text-sm text-destructive">
        {errorMessage(organization.error)}
      </p>
    )
  }

  return (
    <Card className="max-w-2xl">
      <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            General
            <Badge variant={organization.data.status === "ACTIVE" ? "secondary" : "destructive"}>
              {organization.data.status === "ACTIVE" ? "Activa" : "Suspendida"}
            </Badge>
          </CardTitle>
          <CardDescription>
            {canRename ? "Cambia el nombre visible de la organización." : "Solo el propietario puede editar estos datos."}
          </CardDescription>
        </CardHeader>
        <CardContent className="py-6">
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="organization-name">Nombre</FieldLabel>
                  <Input
                    {...field}
                    id="organization-name"
                    disabled={!canRename}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Field>
              <FieldLabel htmlFor="organization-slug">Slug</FieldLabel>
              <Input id="organization-slug" value={organization.data.slug} disabled readOnly />
              <FieldDescription>Identificador único; no se puede cambiar.</FieldDescription>
            </Field>
            {update.isError && <FieldError>{errorMessage(update.error)}</FieldError>}
          </FieldGroup>
        </CardContent>
        {canRename && (
          <CardFooter>
            <Button type="submit" disabled={form.formState.isSubmitting || !form.formState.isDirty}>
              {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
              Guardar
            </Button>
          </CardFooter>
        )}
      </form>
    </Card>
  )
}
