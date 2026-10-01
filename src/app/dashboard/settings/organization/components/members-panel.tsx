"use client"

import { UserPlus } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { ConfirmDialog } from "@/components/confirm-dialog"
import { Button } from "@/components/ui/button"
import { useSession } from "@/hooks/use-session"
import { errorMessage } from "@/lib/api-client"
import { can, ROLES } from "@/lib/permissions"
import type { Member } from "@/lib/types"
import { AddMemberDialog } from "@/app/dashboard/settings/organization/components/add-member-dialog"
import { MembersTable } from "@/app/dashboard/settings/organization/components/members-table"
import {
  useAddMember,
  useMembers,
  useRemoveMember,
  useUpdateMemberRole,
} from "@/app/dashboard/settings/organization/hooks/useMembers"

// Owner: adds any role, changes roles and removes anyone else. Admin: adds and removes
// members with role user only
export function MembersPanel() {
  const { data: session } = useSession()
  const role = session?.user.role

  const members = useMembers()
  const addMember = useAddMember()
  const removeMember = useRemoveMember()
  const updateRole = useUpdateMemberRole()

  const [adding, setAdding] = useState(false)
  const [removing, setRemoving] = useState<Member>()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {members.data ? `${members.data.data.length} miembros` : "Cargando miembros…"}
        </p>
        <Button
          onClick={() => {
            addMember.reset()
            setAdding(true)
          }}
        >
          <UserPlus />
          Agregar miembro
        </Button>
      </div>
      {members.isError ? (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage(members.error)}
        </p>
      ) : (
        <MembersTable
          members={members.data?.data}
          isLoading={members.isPending}
          currentUserId={session?.user.id}
          canChangeRole={() => can.changeMemberRole(role)}
          canRemove={(member) => can.removeMember(role, member.role)}
          onChangeRole={(member, newRole) =>
            updateRole.mutate(
              { user_id: member.user_id, role: newRole },
              { onError: (error) => toast.error(errorMessage(error)) }
            )
          }
          onRemove={setRemoving}
        />
      )}

      <AddMemberDialog
        open={adding}
        roles={ROLES.filter((target) => can.assignRole(role, target))}
        error={addMember.error}
        onSubmit={addMember.mutateAsync}
        onOpenChange={setAdding}
      />
      <ConfirmDialog
        open={removing !== undefined}
        title={`¿Quitar a ${removing?.name ?? "este miembro"}?`}
        description="Perderá el acceso a la organización de inmediato. Su cuenta se conserva."
        confirmLabel="Quitar"
        isPending={removeMember.isPending}
        onConfirm={() => {
          // No `removing!`: React Compiler reads the callback's dependencies during render
          if (!removing) return Promise.resolve()
          return removeMember.mutateAsync(removing.user_id).catch((error: unknown) => {
            toast.error(errorMessage(error))
            throw error
          })
        }}
        onOpenChange={(open) => !open && setRemoving(undefined)}
      />
    </div>
  )
}
