"use client"

import { Loader2 } from "lucide-react"
import type { ReactNode } from "react"
import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form"

import { NumberInput } from "@/components/number-input"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/responsive-dialog"
import { Button } from "@/components/ui/button"
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { errorMessage } from "@/lib/api-client"

// Controller-bound fields for react-hook-form + zod forms. Each one renders its label, the
// input and the zod error, so forms list fields instead of repeating Controller boilerplate

interface BaseProps<T extends FieldValues> {
  control: Control<T>
  name: FieldPath<T>
  label: string
  description?: ReactNode
  className?: string
}

export function TextField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  className,
  multiline,
  ...props
}: BaseProps<T> & { multiline?: boolean } & Omit<React.ComponentProps<"input">, "name">) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={className}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          {multiline ? (
            <Textarea
              {...field}
              value={field.value ?? ""}
              id={name}
              placeholder={props.placeholder}
              aria-invalid={fieldState.invalid}
            />
          ) : (
            <Input {...props} {...field} value={field.value ?? ""} id={name} aria-invalid={fieldState.invalid} />
          )}
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}

// Whole numbers by default; `decimal` allows fractions (recipe quantities, unit costs)
export function NumberField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  className,
  decimal,
  min = 0,
  prefix,
}: BaseProps<T> & { decimal?: boolean; min?: number; prefix?: string }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={className}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <div className="relative">
            {prefix && (
              <span className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-sm text-muted-foreground">
                {prefix}
              </span>
            )}
            <NumberInput
              id={name}
              min={min}
              step={decimal ? "any" : 1}
              inputMode={decimal ? "decimal" : "numeric"}
              className={prefix ? "pl-6" : undefined}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              aria-invalid={fieldState.invalid}
            />
          </div>
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}

export function MoneyField<T extends FieldValues>(props: BaseProps<T> & { min?: number }) {
  return <NumberField {...props} prefix="$" />
}

export function DateField<T extends FieldValues>(props: BaseProps<T> & { type?: "date" | "month" }) {
  const { type = "date", ...rest } = props
  return <TextField {...rest} type={type} />
}

export function SelectField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  className,
  options,
  placeholder = "Elige una opción",
  numeric,
}: BaseProps<T> & {
  options: { value: string; label: string }[]
  placeholder?: string
  // The field holds a number (an id): the Select's string value is converted both ways
  numeric?: boolean
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={className}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <Select
            value={field.value == null || Number.isNaN(field.value) ? "" : String(field.value)}
            onValueChange={(value) => field.onChange(numeric ? Number(value) : value)}
          >
            <SelectTrigger id={name} className="w-full" aria-invalid={fieldState.invalid} onBlur={field.onBlur}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}

export function SwitchField<T extends FieldValues>({ control, name, label, description, className }: BaseProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Field orientation="horizontal" className={className}>
          <Switch id={name} checked={field.value === true} onCheckedChange={field.onChange} />
          <FieldContent>
            <FieldLabel htmlFor={name}>{label}</FieldLabel>
            {description && <FieldDescription>{description}</FieldDescription>}
          </FieldContent>
        </Field>
      )}
    />
  )
}

// A form in a ResponsiveDialog: header, fields in a 1 → 2 column grid, the request error and
// Cancel / submit. `onSubmit` is form.handleSubmit(...)
export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  onSubmit,
  isSubmitting,
  error,
  submitLabel,
  destructive,
  className = "sm:max-w-lg",
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: ReactNode
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  isSubmitting: boolean
  error?: unknown
  submitLabel: string
  destructive?: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className={className}>
        <form noValidate onSubmit={onSubmit} className="flex flex-col gap-6">
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>{title}</ResponsiveDialogTitle>
            {description && <ResponsiveDialogDescription>{description}</ResponsiveDialogDescription>}
          </ResponsiveDialogHeader>
          <FieldGroup className="grid gap-4 sm:grid-cols-2">{children}</FieldGroup>
          {error != null && <FieldError>{errorMessage(error)}</FieldError>}
          <ResponsiveDialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant={destructive ? "destructive" : "default"} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="animate-spin" />}
              {submitLabel}
            </Button>
          </ResponsiveDialogFooter>
        </form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
