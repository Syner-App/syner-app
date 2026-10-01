"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { cn } from "cn"
import { Loader2 } from "lucide-react"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { errorMessage } from "@/lib/api-client"
import { useLogin } from "@/app/login/hooks/useLogin"
import { loginSchema, type LoginValues } from "@/app/login/validations/auth"

export function LoginForm({
  className,
  ...props
}: Omit<React.ComponentProps<"form">, "onSubmit">) {
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const login = useLogin()

  async function onSubmit(values: LoginValues) {
    await login.mutateAsync(values).catch(() => undefined)
  }

  // Stays disabled while the redirect after a successful login happens
  const isSubmitting = form.formState.isSubmitting || login.isSuccess

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Inicia sesión en tu cuenta</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Ingresa tu correo para acceder a tu cuenta
          </p>
        </div>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="login-email">Correo</FieldLabel>
              <Input
                {...field}
                id="login-email"
                type="email"
                placeholder="tu@correo.com"
                autoComplete="email"
                aria-invalid={fieldState.invalid}
                className="bg-background"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="login-password">Contraseña</FieldLabel>
              <Input
                {...field}
                id="login-password"
                type="password"
                autoComplete="current-password"
                aria-invalid={fieldState.invalid}
                className="bg-background"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="animate-spin" />}
            Iniciar sesión
          </Button>
        </Field>
        {login.isError && (
          <FieldError className="text-center">{errorMessage(login.error)}</FieldError>
        )}
        <FieldDescription className="text-center">
          Las cuentas las crea el administrador de tu organización.
        </FieldDescription>
      </FieldGroup>
    </form>
  )
}
