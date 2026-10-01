"use client"

import { Lock } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { can, isSuperadmin } from "@/lib/permissions"
import type { User } from "@/lib/types"
import { useSession } from "@/hooks/use-session"

function Blocked({ title, description }: { title: string; description: string }) {
  return (
    <Card className="mx-auto mt-8 w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="size-4" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button asChild variant="outline">
          <Link href="/dashboard">Volver al panel</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

// Role checks a page can ask for (plain strings: pages are Server Components)
const ACCESS = {
  organizationManager: (user: User) => can.viewOrganization(user.role),
  financeManager: (user: User) => can.manageFinance(user.role),
  superadmin: isSuperadmin,
}

// Renders children once the session loaded and allows it. `organization` requires a session
// scoped to an organization; `access` adds a role check. The gateway rejects the same cases
export function RequireAccess({
  children,
  organization = true,
  access,
}: {
  children: ReactNode
  organization?: boolean
  access?: keyof typeof ACCESS
}) {
  const { data: session, isPending } = useSession()

  if (isPending || !session) {
    return <Skeleton className="h-64 w-full" />
  }

  const { user } = session
  if (organization && !user.organization_id) {
    return (
      <Blocked
        title="Elige una organización"
        description={
          isSuperadmin(user)
            ? "Como superadmin trabajas en la plataforma. Para ver inventario, únete a una organización."
            : "Selecciona una organización en el menú lateral para continuar."
        }
      />
    )
  }
  if (access && !ACCESS[access](user)) {
    return <Blocked title="Sin acceso" description="Tu rol no tiene permiso para ver esta sección." />
  }
  return children
}
