"use client"

import { Ban, CirclePlay, MoreHorizontal, Plus, Users } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { errorMessage } from "@/lib/api-client"
import type { Organization } from "@/lib/types"
import { CreateOrganizationDialog } from "@/app/dashboard/admin/organizations/components/create-organization-dialog"
import { OrganizationMembersSheet } from "@/app/dashboard/admin/organizations/components/organization-members-sheet"
import {
  useOrganizations,
  useUpdateOrganizationStatus,
} from "@/app/dashboard/admin/organizations/hooks/useOrganizations"

const dateFormat = new Intl.DateTimeFormat("es-CO", { dateStyle: "medium", timeZone: "America/Bogota" })

// Platform panel (superadmin): tenants, their status and members
export function OrganizationsView() {
  const organizations = useOrganizations()
  const updateStatus = useUpdateOrganizationStatus()
  const [creating, setCreating] = useState(false)
  const [selected, setSelected] = useState<Organization>()

  function toggleStatus(organization: Organization) {
    updateStatus.mutate(
      { id: organization.id, status: organization.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE" },
      { onError: (error) => toast.error(errorMessage(error)) }
    )
  }

  return (
    <>
      <PageHeader
        title="Organizaciones"
        description="Clientes de la plataforma. Suspender una organización bloquea a todos sus miembros."
        actions={
          <Button onClick={() => setCreating(true)}>
            <Plus />
            Nueva organización
          </Button>
        }
      />
      {organizations.isError ? (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage(organizations.error)}
        </p>
      ) : (
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Creada</TableHead>
                <TableHead className="w-12">
                  <span className="sr-only">Acciones</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizations.isPending &&
                Array.from({ length: 3 }, (_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={5}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  </TableRow>
                ))}
              {organizations.data?.data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    Aún no hay organizaciones.
                  </TableCell>
                </TableRow>
              )}
              {organizations.data?.data.map((organization) => (
                <TableRow key={organization.id}>
                  <TableCell className="font-medium">{organization.name}</TableCell>
                  <TableCell className="text-muted-foreground">{organization.slug}</TableCell>
                  <TableCell>
                    <Badge variant={organization.status === "ACTIVE" ? "secondary" : "destructive"}>
                      {organization.status === "ACTIVE" ? "Activa" : "Suspendida"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {dateFormat.format(new Date(organization.createdAt))}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label={`Acciones de ${organization.name}`}>
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelected(organization)}>
                          <Users />
                          Miembros
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant={organization.status === "ACTIVE" ? "destructive" : "default"}
                          onClick={() => toggleStatus(organization)}
                        >
                          {organization.status === "ACTIVE" ? <Ban /> : <CirclePlay />}
                          {organization.status === "ACTIVE" ? "Suspender" : "Reactivar"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <CreateOrganizationDialog open={creating} onOpenChange={setCreating} />
      <OrganizationMembersSheet
        key={selected?.id ?? "none"}
        organization={selected}
        onOpenChange={(open) => !open && setSelected(undefined)}
      />
    </>
  )
}
