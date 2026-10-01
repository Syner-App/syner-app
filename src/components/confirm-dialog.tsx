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

// An action that needs confirmation (destructive by default). Stays open while `onConfirm` runs and
// closes when it resolves; a rejection keeps it open (the caller shows the error)
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  isPending,
  onConfirm,
  onOpenChange,
  destructive = true,
}: {
  open: boolean
  title: string
  description: React.ReactNode
  confirmLabel: string
  isPending: boolean
  onConfirm: () => Promise<unknown>
  onOpenChange: (open: boolean) => void
  // false for confirmations that are not destructive (approve, receive, close a period)
  destructive?: boolean
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
            variant={destructive ? "destructive" : "default"}
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
