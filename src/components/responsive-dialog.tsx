"use client"

import { createContext, useContext } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

// A Dialog on md+ and a bottom Drawer on phones, with the same parts as Dialog so a form
// moves between them unchanged
const MobileContext = createContext(false)

export function ResponsiveDialog({
  open,
  onOpenChange,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}) {
  const isMobile = useIsMobile()
  return (
    <MobileContext.Provider value={isMobile}>
      {isMobile ? (
        <Drawer open={open} onOpenChange={onOpenChange} repositionInputs={false}>
          {children}
        </Drawer>
      ) : (
        <Dialog open={open} onOpenChange={onOpenChange}>
          {children}
        </Dialog>
      )}
    </MobileContext.Provider>
  )
}

// `className` sizes the desktop dialog (sm:max-w-lg); on phones the drawer takes the full width
export function ResponsiveDialogContent({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  const isMobile = useContext(MobileContext)
  if (isMobile) {
    return (
      <DrawerContent className="max-h-[92dvh]">
        <div className="grid gap-4 overflow-y-auto px-4 pt-2 pb-4">{children}</div>
      </DrawerContent>
    )
  }
  return (
    <DialogContent className={cn("max-h-[90dvh] overflow-y-auto", className)}>{children}</DialogContent>
  )
}

export function ResponsiveDialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  const isMobile = useContext(MobileContext)
  return isMobile ? (
    <DrawerHeader className={cn("p-0 text-left", className)} {...props} />
  ) : (
    <DialogHeader className={className} {...props} />
  )
}

export function ResponsiveDialogTitle(props: React.ComponentProps<typeof DialogTitle>) {
  const isMobile = useContext(MobileContext)
  return isMobile ? <DrawerTitle {...props} /> : <DialogTitle {...props} />
}

export function ResponsiveDialogDescription(props: React.ComponentProps<typeof DialogDescription>) {
  const isMobile = useContext(MobileContext)
  return isMobile ? <DrawerDescription {...props} /> : <DialogDescription {...props} />
}

// Full-width stacked buttons on phones (primary on top), a right-aligned row on desktop
export function ResponsiveDialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  const isMobile = useContext(MobileContext)
  return isMobile ? (
    <div
      className={cn(
        "sticky -bottom-4 -mx-4 -mb-4 flex flex-col-reverse gap-2 border-t bg-popover p-4 [&>button]:w-full",
        className
      )}
      {...props}
    />
  ) : (
    <DialogFooter className={className} {...props} />
  )
}
