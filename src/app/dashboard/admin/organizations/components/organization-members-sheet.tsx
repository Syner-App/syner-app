"use client"

import { UserPlus } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { ConfirmDialog } from "@/components/confirm-dialog"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { errorMessage } from "@/lib/api-client"
import { ROLES } from "@/lib/permissions"
import type { Member, Organization } from "@/lib/types"
import { AddMemberDialog } from "@/app/dashboard/settings/organization/components/add-member-dialog"
import { MembersTable } from "@/app/dashboard/settings/organization/components/members-table"
import {
  useAddOrganizationMember,
  useOrganizationMembers,
  useRemoveOrganizationMember,
} from "@/app/dashboard/admin/organizations/hooks/useOrganizationMembers"

// Members of any organization, for the superadmin. Roles are changed by the organization's
// owner (the platform API only adds and removes members)
export function OrganizationMembersSheet({
  organization,
  onOpenChange,
}: {
  organization?: Organization
  onOpenChange: (open: boolean) => void
}) {
  const id = organization?.id ?? ""
  const members = useOrganizationMembers(organization?.id)
  const addMember = useAddOrganizationMember(id)
  const removeMember = useRemoveOrganizationMember(id)

  const [adding, setAdding] = useState(false)
  const [removing, setRemoving] = useState<Member>()

  return (
    <Sheet open={organization !== undefined} onOpenChange={onOpenChange}>
      <SheetContent className="w-full data-[side=right]:sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>Miembros de {organization?.name}</SheetTitle>
          <SheetDescription>Agrega al propietario y a los primeros miembros de la organización.</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 pb-4">
          <Button
            className="self-end"
            onClick={() => {
              addMember.reset()
              setAdding(true)
            }}
          >
            <UserPlus />
            Agregar miembro
          </Button>
          {members.isError ? (
            <p role="alert" className="text-sm text-destructive">
              {errorMessage(members.error)}
            </p>
          ) : (
            <MembersTable
              members={members.data?.data}
              isLoading={members.isPending}
              canChangeRole={() => false}
              canRemove={() => true}
              onRemove={setRemoving}
            />
          )}
        </div>

        <AddMemberDialog
          open={adding}
          roles={ROLES}
          error={addMember.error}
          onSubmit={(payload) => addMember.mutateAsync({ id, payload })}
          onOpenChange={setAdding}
        />
        <ConfirmDialog
          open={removing !== undefined}
          title={`¿Quitar a ${removing?.name ?? "este miembro"}?`}
          description="Perderá el acceso a la organización de inmediato. Su cuenta se conserva."
          confirmLabel="Quitar"
          isPending={removeMember.isPending}
          onConfirm={() =>
            removeMember.mutateAsync({ id, user_id: removing!.user_id }).catch((error: unknown) => {
              toast.error(errorMessage(error))
              throw error
            })
          }
          onOpenChange={(open) => !open && setRemoving(undefined)}
        />
      </SheetContent>
    </Sheet>
  )
}
