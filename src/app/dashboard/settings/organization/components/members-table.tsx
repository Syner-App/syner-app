"use client"

import { Trash2 } from "lucide-react"

import { ResponsiveList } from "@/components/responsive-list"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ROLE_LABELS, ROLES } from "@/lib/permissions"
import type { Member, Role } from "@/lib/types"

// Members of an organization. Role changes and removals are offered per member according
// to the caller's permissions (also used by the platform panel)
export function MembersTable({
  members,
  isLoading,
  currentUserId,
  canChangeRole,
  canRemove,
  onChangeRole,
  onRemove,
}: {
  members?: Member[]
  isLoading: boolean
  currentUserId?: string
  canChangeRole: (member: Member) => boolean
  canRemove: (member: Member) => boolean
  onChangeRole?: (member: Member, role: Role) => void
  onRemove: (member: Member) => void
}) {
  // Render helpers (called, not mounted as components: they close over the props)
  function roleControl(member: Member) {
    const isSelf = member.user_id === currentUserId
    return !isSelf && onChangeRole && canChangeRole(member) ? (
      <Select value={member.role} onValueChange={(role) => onChangeRole(member, role as Role)}>
        <SelectTrigger size="sm" className="w-36" aria-label={`Rol de ${member.name}`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ROLES.map((role) => (
            <SelectItem key={role} value={role}>
              {ROLE_LABELS[role]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ) : (
      <Badge variant={member.role === "owner" ? "default" : "secondary"}>{ROLE_LABELS[member.role]}</Badge>
    )
  }

  function name(member: Member) {
    return (
      <span className="font-medium">
        {member.name}
        {member.user_id === currentUserId && <span className="font-normal text-muted-foreground"> (tú)</span>}
      </span>
    )
  }

  return (
    <ResponsiveList
      items={members}
      getKey={(member) => member.user_id}
      isLoading={isLoading}
      empty="Sin miembros todavía."
      columns={[
        { header: "Nombre", cell: name },
        { header: "Correo", cell: (member) => member.email },
        { header: "Rol", className: "w-44", cell: roleControl },
      ]}
      actions={(member) =>
        member.user_id !== currentUserId &&
        canRemove(member) && (
          <Button variant="ghost" size="icon" aria-label={`Quitar a ${member.name}`} onClick={() => onRemove(member)}>
            <Trash2 />
          </Button>
        )
      }
      renderCard={(member) => (
        <>
          <div className="flex min-w-0 flex-col">
            {name(member)}
            <span className="truncate text-xs text-muted-foreground">{member.email}</span>
          </div>
          {roleControl(member)}
        </>
      )}
    />
  )
}
