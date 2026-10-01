"use client"

import { Building2, ChevronRight, Loader2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { errorMessage } from "@/lib/api-client"
import { ROLE_LABELS } from "@/lib/permissions"
import { useLogout, useSession, useSwitchOrganization } from "@/hooks/use-session"

export function OrganizationPicker() {
  const session = useSession()
  const switchOrganization = useSwitchOrganization()
  const logout = useLogout()

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Elige una organización</CardTitle>
        <CardDescription>Perteneces a varias organizaciones. ¿Con cuál quieres trabajar?</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {session.isPending &&
          Array.from({ length: 2 }, (_, index) => <Skeleton key={index} className="h-14 w-full" />)}
        {session.data?.memberships.map((membership) => (
          <Button
            key={membership.organization_id}
            variant="outline"
            className="h-auto justify-start gap-3 py-3"
            disabled={switchOrganization.isPending}
            onClick={() => switchOrganization.mutate(membership.organization_id)}
          >
            <Building2 />
            <span className="flex flex-col items-start">
              <span className="font-medium">{membership.organization_name}</span>
              <span className="text-xs text-muted-foreground">{membership.organization_slug}</span>
            </span>
            <Badge variant="secondary" className="ml-auto">
              {ROLE_LABELS[membership.role]}
            </Badge>
            {switchOrganization.isPending && switchOrganization.variables === membership.organization_id ? (
              <Loader2 className="animate-spin" />
            ) : (
              <ChevronRight />
            )}
          </Button>
        ))}
        {session.data?.memberships.length === 0 && (
          <p className="text-sm text-muted-foreground">No perteneces a ninguna organización activa.</p>
        )}
        {switchOrganization.isError && (
          <p role="alert" className="text-sm text-destructive">
            {errorMessage(switchOrganization.error)}
          </p>
        )}
        <Button variant="ghost" className="mt-2" onClick={() => logout.mutate()}>
          Cerrar sesión
        </Button>
      </CardContent>
    </Card>
  )
}
