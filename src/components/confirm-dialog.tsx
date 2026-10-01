"use client"

import { Loader2 } from "lucide-react"
import { useRef } from "react"

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
  const submitting = useRef(false)

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
            disabled={isPending || !open}
            onClick={(event) => {
              event.preventDefault()
              // Ignore clicks while a confirmation runs or the dialog is closing: the
              // caller has already cleared the target it confirms
              if (submitting.current || !open) return
              submitting.current = true
              onConfirm()
                .then(
                  () => onOpenChange(false),
                  () => undefined
                )
                .finally(() => {
                  submitting.current = false
                })
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
