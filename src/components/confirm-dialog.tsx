"use client"

import { Loader2 } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// A destructive action that needs confirmation. Stays open while `onConfirm` runs and
// closes when it resolves; a rejection keeps it open (the caller shows the error)
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  isPending,
  onConfirm,
  onOpenChange,
}: {
  open: boolean
  title: string
  description: React.ReactNode
  confirmLabel: string
  isPending: boolean
  onConfirm: () => Promise<unknown>
  onOpenChange: (open: boolean) => void
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isPending}
            onClick={(event) => {
              event.preventDefault()
              onConfirm().then(
                () => onOpenChange(false),
                () => undefined
              )
            }}
          >
            {isPending && <Loader2 className="animate-spin" />}
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
