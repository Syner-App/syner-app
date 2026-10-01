"use client"

import { Ban, CirclePlay, MoreHorizontal, Plus, Users } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { PageHeader } from "@/components/page-header"
import { CardField, ResponsiveList } from "@/components/responsive-list"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { errorMessage } from "@/lib/api-client"
import type { Organization } from "@/lib/types"
import { CreateOrganizationDialog } from "@/app/dashboard/admin/organizations/components/create-organization-dialog"
import { OrganizationMembersSheet } from "@/app/dashboard/admin/organizations/components/organization-members-sheet"
import {
  useOrganizations,
  useUpdateOrganizationStatus,
} from "@/app/dashboard/admin/organizations/hooks/useOrganizations"

const dateFormat = new Intl.DateTimeFormat("es-CO", { dateStyle: "medium", timeZone: "America/Bogota" })

function StatusBadge({ organization }: { organization: Organization }) {
  return (
    <Badge variant={organization.status === "ACTIVE" ? "secondary" : "destructive"}>
      {organization.status === "ACTIVE" ? "Activa" : "Suspendida"}
    </Badge>
  )
}

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
        <ResponsiveList
          items={organizations.data?.data}
          getKey={(organization) => organization.id}
          isLoading={organizations.isPending}
          empty="Aún no hay organizaciones."
          columns={[
            { header: "Nombre", cell: (organization) => <span className="font-medium">{organization.name}</span> },
            { header: "Slug", className: "text-muted-foreground", cell: (organization) => organization.slug },
            { header: "Estado", cell: (organization) => <StatusBadge organization={organization} /> },
            {
              header: "Creada",
              className: "text-muted-foreground",
              cell: (organization) => dateFormat.format(new Date(organization.createdAt)),
            },
          ]}
          actions={(organization) => (
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
          )}
          renderCard={(organization) => (
            <>
              <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 flex-col">
                  <span className="truncate font-medium">{organization.name}</span>
                  <span className="text-xs text-muted-foreground">{organization.slug}</span>
                </div>
                <StatusBadge organization={organization} />
              </div>
              <CardField label="Creada">{dateFormat.format(new Date(organization.createdAt))}</CardField>
            </>
          )}
        />
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
